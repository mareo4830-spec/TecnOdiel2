import { Check, Cloud, Database, Eye, Github, Globe, KeyRound, LoaderCircle, PlugZap, Save, X, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { DnsProviderId, PreviewMode, Project, SaasProjectConfig } from '../../../types';
import { Field, inputClass } from '../../tenants/components/TenantBits';
import { DNS_PROVIDER_META, previewHostFor } from '../../tenants/tenantMeta';
import { updateProject } from '../projectService';
import { checkSaasConnections, type ConnectionCheck } from '../saasProjectClient';
import { CONNECTION_LABEL, DEFAULT_SAAS_CONFIG, refFromSupabaseUrl, validateSaasConfig } from '../saasConfig';

function Block({ title, icon: Icon, description, children }: { title: string; icon: LucideIcon; description: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
      <header className="mb-4 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-300">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

/** Conexiones de un proyecto SaaS: la BD donde viven los negocios, el repo core, Vercel y las previews. */
export function SaasConfigTab({ project }: { project: Project }) {
  const [cfg, setCfg] = useState<SaasProjectConfig>(project.saas ?? DEFAULT_SAAS_CONFIG);
  const [repo, setRepo] = useState(project.repo);
  const [vercelProject, setVercelProject] = useState(project.vercelProject);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [checks, setChecks] = useState<ConnectionCheck[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const set = <K extends keyof SaasProjectConfig>(key: K, value: SaasProjectConfig[K]) => {
    setCfg((c) => ({ ...c, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    const clean: SaasProjectConfig = {
      ...cfg,
      supabaseUrl: cfg.supabaseUrl.trim().replace(/\/$/, ''),
      supabaseRef: refFromSupabaseUrl(cfg.supabaseUrl) || cfg.supabaseRef,
      vercelProjectId: cfg.vercelProjectId.trim(),
      vercelTeamId: cfg.vercelTeamId.trim(),
      agencyPreviewDomain: cfg.agencyPreviewDomain.trim().toLowerCase(),
    };
    const e = validateSaasConfig(clean, repo, vercelProject);
    setErrors(e);
    if (Object.keys(e).length) return;
    updateProject(project.id, {
      saas: clean,
      repo: { fullName: repo.fullName.trim(), branch: repo.branch.trim() || 'main' },
      vercelProject: vercelProject.trim(),
    });
    setCfg(clean);
    setSaved(true);
    setChecks(null);
  };

  const check = async () => {
    setChecking(true);
    setCheckError(null);
    try {
      setChecks(await checkSaasConnections(project));
    } catch (e) {
      setCheckError(e instanceof Error ? e.message : 'No se pudo comprobar');
    } finally {
      setChecking(false);
    }
  };

  const example = previewHostFor('salon-aurora', cfg);
  const dirty = !saved && JSON.stringify(cfg) !== JSON.stringify(project.saas ?? DEFAULT_SAAS_CONFIG);

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
      <div className="space-y-4 xl:col-span-2">
        <Block
          title="Supabase del SaaS"
          icon={Database}
          description="La BD de producción donde viven los negocios. Cada tenant se enlaza a su fila de businesses por business_id."
        >
          <Field
            label="URL del proyecto"
            error={errors.supabaseUrl}
            hint={cfg.supabaseUrl ? `ref: ${refFromSupabaseUrl(cfg.supabaseUrl) || '—'}` : undefined}
          >
            <input
              className={`${inputClass} font-mono`}
              value={cfg.supabaseUrl}
              onChange={(e) => set('supabaseUrl', e.target.value)}
              placeholder="https://abcd1234.supabase.co"
            />
          </Field>
          <Field label="Secreto con la service_role" error={errors.serviceRoleSecret} hint="Nombre del secreto de las Edge Functions, no la clave.">
            <input
              className={`${inputClass} font-mono`}
              value={cfg.serviceRoleSecret}
              onChange={(e) => set('serviceRoleSecret', e.target.value.toUpperCase())}
            />
          </Field>
        </Block>

        <Block title="Repositorio" icon={Github} description="El core del producto: un solo repo sirve a todos los tenants.">
          <Field label="organización/repositorio" error={errors.repo}>
            <input
              className={`${inputClass} font-mono`}
              value={repo.fullName}
              onChange={(e) => {
                setRepo((r) => ({ ...r, fullName: e.target.value }));
                setSaved(false);
              }}
            />
          </Field>
          <Field label="Rama de producción">
            <input
              className={`${inputClass} font-mono`}
              value={repo.branch}
              onChange={(e) => {
                setRepo((r) => ({ ...r, branch: e.target.value }));
                setSaved(false);
              }}
            />
          </Field>
        </Block>

        <Block title="Vercel" icon={Cloud} description="Proyecto donde se añaden los dominios y previews de los tenants.">
          <Field label="Proyecto" error={errors.vercelProject}>
            <input
              className={`${inputClass} font-mono`}
              value={vercelProject}
              onChange={(e) => {
                setVercelProject(e.target.value);
                setSaved(false);
              }}
            />
          </Field>
          <Field label="ID del proyecto" error={errors.vercelProjectId} hint="Settings → General → Project ID.">
            <input
              className={`${inputClass} font-mono`}
              value={cfg.vercelProjectId}
              onChange={(e) => set('vercelProjectId', e.target.value)}
              placeholder="prj_…"
            />
          </Field>
          <Field label="Equipo (slug)">
            <input
              className={`${inputClass} font-mono`}
              value={cfg.vercelTeamSlug}
              onChange={(e) => set('vercelTeamSlug', e.target.value)}
              placeholder="tu-equipo"
            />
          </Field>
          <Field label="ID del equipo (opcional)" error={errors.vercelTeamId}>
            <input
              className={`${inputClass} font-mono`}
              value={cfg.vercelTeamId}
              onChange={(e) => set('vercelTeamId', e.target.value)}
              placeholder="team_…"
            />
          </Field>
          <Field label="Secreto con el token" error={errors.vercelTokenSecret} hint="Nombre del secreto, no el token.">
            <input
              className={`${inputClass} font-mono`}
              value={cfg.vercelTokenSecret}
              onChange={(e) => set('vercelTokenSecret', e.target.value.toUpperCase())}
            />
          </Field>
        </Block>

        <Block
          title="Previews de los tenants"
          icon={Eye}
          description="Al crear un tenant se da de alta su host de preview en Vercel automáticamente."
        >
          <div role="radiogroup" aria-label="Tipo de preview" className="grid grid-cols-1 gap-2 sm:col-span-2 sm:grid-cols-2">
            {(
              [
                ['vercel_app', 'Subdominio .vercel.app', 'Gratis y sin DNS: <slug>-<sufijo>.vercel.app'],
                ['agency_domain', 'Dominio de la agencia', 'Wildcard propio: <slug>.preview.tu-agencia.es'],
              ] as [PreviewMode, string, string][]
            ).map(([mode, label, desc]) => (
              <button
                key={mode}
                type="button"
                role="radio"
                aria-checked={cfg.previewMode === mode}
                onClick={() => set('previewMode', mode)}
                className={`rounded-xl border p-3 text-left transition ${cfg.previewMode === mode ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}
              >
                <span className="block text-sm font-semibold text-white">{label}</span>
                <span className="block text-xs text-gray-400">{desc}</span>
              </button>
            ))}
          </div>
          {cfg.previewMode === 'vercel_app' ? (
            <Field label="Sufijo" error={errors.vercelAppSuffix} hint="Los .vercel.app son globales: el sufijo evita que otro los tenga cogidos.">
              <input
                className={`${inputClass} font-mono`}
                value={cfg.vercelAppSuffix}
                onChange={(e) => set('vercelAppSuffix', e.target.value.toLowerCase())}
                placeholder="vd"
              />
            </Field>
          ) : (
            <Field label="Dominio de previews" error={errors.agencyPreviewDomain} hint="Necesita un CNAME *.<dominio> → cname.vercel-dns.com.">
              <input
                className={`${inputClass} font-mono`}
                value={cfg.agencyPreviewDomain}
                onChange={(e) => set('agencyPreviewDomain', e.target.value)}
                placeholder="preview.tu-agencia.es"
              />
            </Field>
          )}
          <div className="flex items-end">
            <p className="w-full rounded-xl bg-gray-800/50 px-3 py-2.5 text-xs text-gray-400">
              Ejemplo: <span className="font-mono text-indigo-300">https://{example}</span>
            </p>
          </div>
        </Block>

        <Block title="DNS por defecto" icon={Globe} description="Proveedor que se preselecciona al dar de alta un tenant con dominio propio.">
          <Field label="Proveedor">
            <select
              className={inputClass}
              value={cfg.defaultDnsProvider ?? ''}
              onChange={(e) => set('defaultDnsProvider', (e.target.value || null) as DnsProviderId | null)}
            >
              {(Object.keys(DNS_PROVIDER_META) as DnsProviderId[]).map((d) => (
                <option key={d} value={d}>
                  {DNS_PROVIDER_META[d].label}
                </option>
              ))}
              <option value="">Manual</option>
            </select>
          </Field>
        </Block>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={save}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            <Save className="h-4 w-4" />
            Guardar configuración
          </button>
          {saved && <span className="text-sm text-emerald-300">Guardado</span>}
          {dirty && !Object.keys(errors).length && <span className="text-sm text-amber-300">Cambios sin guardar</span>}
          {Object.keys(errors).length > 0 && <span className="text-sm text-rose-300">Revisa los campos marcados</span>}
        </div>
      </div>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white">Estado de las conexiones</h3>
            <button
              onClick={check}
              disabled={checking}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-700 px-3 text-sm text-gray-200 hover:border-indigo-500 disabled:opacity-60"
            >
              {checking ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
              Comprobar
            </button>
          </div>
          {checkError && <p className="mb-2 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{checkError}</p>}
          {checks ? (
            <ul className="space-y-2">
              {checks.map((c) => (
                <li key={c.connection} className="flex items-start gap-2 rounded-xl bg-gray-800/40 p-2.5">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${c.ok ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}
                  >
                    {c.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-white">{CONNECTION_LABEL[c.connection]}</span>
                    <span className="block break-words text-xs text-gray-400">{c.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">Guarda y pulsa Comprobar: se prueba de verdad la BD, el repo y el proyecto de Vercel.</p>
          )}
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
            <KeyRound className="h-4 w-4 text-amber-300" />
            Secretos
          </h3>
          <p className="text-xs text-gray-400">
            Las claves no se guardan aquí: viven como secretos de las Edge Functions. Configúralos una vez por producto:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-gray-950 p-3 text-[11px] leading-relaxed text-gray-300">
            {`supabase secrets set \\
  ${cfg.serviceRoleSecret || 'SAAS_SERVICE_ROLE_KEY'}=<service_role> \\
  ${cfg.vercelTokenSecret || 'VERCEL_TOKEN'}=<token> \\
  GITHUB_TOKEN=<token de solo lectura>`}
          </pre>
        </section>
      </aside>
    </div>
  );
}
