import type { DnsProvider, DnsProviderId } from './dns/types.ts';
import type { Env } from './env.ts';
import { type FetchFn, HttpError } from './http.ts';
import { dnsStep } from './providers/dns.ts';
import { goLiveStep } from './providers/golive.ts';
import { gscStep } from './providers/gsc.ts';
import { oneSignalStep } from './providers/onesignal.ts';
import { placesStep } from './providers/places.ts';
import { previewStep } from './providers/preview.ts';
import { saasStep } from './providers/saas.ts';
import { vercelStep } from './providers/vercel.ts';
import type { SaasGateway } from './saas/gateway.ts';
import type { Billing, Integration, IntegrationProvider, Plan, ProvisionMode, Step, StepContext, StepOutcome, Tenant } from './types.ts';

/** Orden de provisionado. Cada paso depende de los anteriores. */
export const STEPS: Step[] = [placesStep, saasStep, previewStep, vercelStep, dnsStep, oneSignalStep, gscStep, goLiveStep];
/** "Crear preview": negocio en la BD del SaaS + host .vercel.app. Sin dominio, DNS ni cobro. */
export const PREVIEW_STEPS: Step[] = [saasStep, previewStep];

/** Un cerrojo más antiguo que esto se considera de una ejecución muerta. */
export const LOCK_STALE_MS = 10 * 60_000;

export interface TenantBundle {
  tenant: Tenant;
  plan: Plan | null;
  billing: Billing | null;
  integrations: Record<IntegrationProvider, Integration>;
}

/** Persistencia en la BD de VirtualDesk. Interfaz para poder probar el orquestador sin Supabase. */
export interface ProvisioningRepo {
  load(tenantId: string): Promise<TenantBundle | null>;
  missingRequirements(tenantId: string): Promise<string[]>;
  /** Lo mínimo para la preview (tenant_preview_missing en la BD). */
  previewMissing(tenantId: string): Promise<string[]>;
  acquireLock(tenantId: string, staleMs: number): Promise<boolean>;
  releaseLock(tenantId: string): Promise<void>;
  updateTenant(tenantId: string, patch: Partial<Tenant>): Promise<void>;
  updateIntegration(tenantId: string, provider: IntegrationProvider, patch: Partial<Integration>): Promise<void>;
  log(entry: { tenantId: string; step: string; ok: boolean; detail: string; actor: string }): Promise<void>;
  /** Al pasar a live: fija la renovación del mantenimiento y avisa a los socios. */
  onLive(tenant: Tenant, actor: string): Promise<void>;
}

export interface PipelineDeps {
  repo: ProvisioningRepo;
  env: Env;
  fetch: FetchFn;
  saas: () => SaasGateway;
  dns: (id: DnsProviderId) => DnsProvider;
  now?: () => Date;
}

export interface StepReport {
  step: Step['name'];
  status: StepOutcome['status'] | 'error' | 'done';
  detail: string;
}

export interface PipelineResult {
  /** live = en producción · pending = esperando DNS u otra cosa externa · error = paró en un paso. */
  status: 'live' | 'pending' | 'error' | 'preview';
  failedStep?: Step['name'];
  steps: StepReport[];
}

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

/**
 * Provisiona un tenant de forma idempotente. Los pasos ya en `ok` o `skipped` no se repiten
 * (salvo los de `force`); si un paso falla, se para ahí y el reintento continúa desde ese paso.
 */
export async function runProvisioning(
  tenantId: string,
  actor: string,
  deps: PipelineDeps,
  options: { force?: IntegrationProvider[]; mode?: ProvisionMode } = {},
): Promise<PipelineResult> {
  const { repo } = deps;
  const now = deps.now ?? (() => new Date());
  const mode = options.mode ?? 'full';
  const preview = mode === 'preview';
  // En la preview se reescriben siempre sus pasos: "Actualizar preview" vuelca los datos nuevos.
  const force = new Set<IntegrationProvider>(preview ? ['supabase', 'preview'] : options.force ?? []);

  const bundle = await repo.load(tenantId);
  if (!bundle) throw new HttpError(404, 'Tenant no encontrado');
  const missing = preview ? await repo.previewMissing(tenantId) : await repo.missingRequirements(tenantId);
  if (missing.length) {
    throw new HttpError(409, `Faltan datos para ${preview ? 'la preview' : 'provisionar'}: ${missing.join(', ')}`, { missing });
  }
  if (!(await repo.acquireLock(tenantId, LOCK_STALE_MS))) {
    throw new HttpError(409, 'Ya hay un provisionado en curso para este tenant');
  }

  const { plan, billing } = bundle;
  let tenant = bundle.tenant;
  const integrations = { ...bundle.integrations };
  const wasLive = tenant.status === 'live';
  const steps: StepReport[] = [];

  try {
    await repo.log({ tenantId, step: 'start', ok: true, detail: `${preview ? 'Preview solicitada' : 'Provisionado iniciado'} por ${actor}`, actor });
    // La preview no cambia el estado del tenant: sigue en borrador hasta el provisionado completo.
    if (!preview && !wasLive && tenant.status !== 'provisioning') {
      await repo.updateTenant(tenantId, { status: 'provisioning' });
      tenant = { ...tenant, status: 'provisioning' };
    }

    for (const step of preview ? PREVIEW_STEPS : STEPS) {
      const current = step.provider ? integrations[step.provider] : null;
      if (step.provider && current && (current.status === 'ok' || current.status === 'skipped') && !force.has(step.provider)) {
        steps.push({ step: step.name, status: 'done', detail: 'ya completado' });
        continue;
      }
      if (step.provider) await repo.updateIntegration(tenantId, step.provider, { status: 'running', error: null });

      const ctx: StepContext = {
        tenant,
        plan,
        billing,
        integrations,
        env: deps.env,
        fetch: deps.fetch,
        saas: deps.saas,
        dns: deps.dns,
        now,
        actor,
        missingRequirements: () => repo.missingRequirements(tenantId),
      };

      let outcome: StepOutcome;
      try {
        outcome = await step.run(ctx);
      } catch (e) {
        const message = errorMessage(e);
        if (step.provider) {
          await repo.updateIntegration(tenantId, step.provider, { status: 'error', error: message, last_sync_at: now().toISOString() });
          integrations[step.provider] = { ...integrations[step.provider], status: 'error', error: message };
        }
        await repo.log({ tenantId, step: step.name, ok: false, detail: message, actor });
        if (!preview && !wasLive) await repo.updateTenant(tenantId, { status: 'error' });
        steps.push({ step: step.name, status: 'error', detail: message });
        return { status: 'error', failedStep: step.name, steps };
      }

      if (outcome.tenantPatch && Object.keys(outcome.tenantPatch).length) {
        await repo.updateTenant(tenantId, outcome.tenantPatch);
        tenant = { ...tenant, ...outcome.tenantPatch };
      }
      if (step.provider) {
        const prev = integrations[step.provider];
        const next: Integration = {
          ...prev,
          status: outcome.status,
          external_id: outcome.externalId ?? prev.external_id,
          meta: { ...prev.meta, ...(outcome.meta ?? {}) },
          error: null,
          last_sync_at: now().toISOString(),
        };
        await repo.updateIntegration(tenantId, step.provider, {
          status: next.status,
          external_id: next.external_id,
          meta: next.meta,
          error: null,
          last_sync_at: next.last_sync_at,
        });
        integrations[step.provider] = next;
      }
      await repo.log({
        tenantId,
        step: step.name,
        ok: true,
        detail: outcome.status === 'pending' ? `En espera: ${outcome.detail}` : outcome.detail,
        actor,
      });
      steps.push({ step: step.name, status: outcome.status, detail: outcome.detail });

      if (step === goLiveStep && outcome.status === 'ok' && !wasLive) await repo.onLive(tenant, actor);
    }

    return { status: preview ? 'preview' : tenant.status === 'live' ? 'live' : 'pending', steps };
  } finally {
    await repo.releaseLock(tenantId);
  }
}
