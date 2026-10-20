import { useMemo } from 'react';
import { provisionCloudflarePage, sanitizeSlug } from '../../lib/cloudflare';
import { iso, num } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { isSupabaseConfigured } from '../../lib/supabase';
import { createSyncedStore, whenSyncReady } from '../../lib/syncedStore';
import type { BusinessType, Lead, LeadNote, LeadSource, LeadStage, NewProjectInput, PartnerId, Project } from '../../types';
import { logActivity } from '../activity/activityService';
import { ensureClientForLead } from '../clients/clientService';
import { createProject } from '../projects/projectService';
import { STAGE_META } from './leadMeta';

/*
 * CRM: tablas `leads` y `lead_notes`. Los leads de la landing llegan por Realtime
 * (los inserta el propio visitante con su sesión de Google, ver la política de `leads`).
 * Las notas son filas aparte; aquí se unen al lead para que los componentes no cambien.
 *
 * Además, las solicitudes que el formulario de la landing guarda en este navegador
 * (`tecnodiel_leads` y `tecnodiel_active_project`) se importan como leads si aún no existen, y los
 * leads se vuelcan de vuelta a `tecnodiel_leads` para que la landing y el portal los sigan viendo.
 * Desde aquí se puede lanzar la web del lead en Cloudflare Pages (ver deployLeadWeb).
 */
type LeadRecord = Omit<Lead, 'notes'>;
interface NoteRecord extends LeadNote {
  leadId: string;
}

const LOCAL_LANDING_LEADS_KEY = 'tecnodiel_leads';

const leadsStore = createSyncedStore<LeadRecord>([], {
  table: 'leads',
  persistKey: 'leads',
  toRow: (l) => ({
    id: l.id,
    business_name: l.businessName,
    business_type: l.businessType,
    contact_name: l.contactName,
    phone: l.phone,
    email: l.email,
    city: l.city,
    source: l.source,
    stage: l.stage,
    estimated_value: l.estimatedValue,
    owner: l.owner,
    next_action_date: l.nextActionDate,
    next_action: l.nextAction,
    project_id: l.projectId,
    intake: l.intake ?? null,
    slug: l.slug ?? null,
    site_deployed: Boolean(l.siteDeployed),
    cloudflare_url: l.cloudflareUrl ?? null,
    live_url: l.liveUrl ?? null,
    template_id: l.templateId ?? null,
    template_name: l.templateName ?? null,
    services: l.services ?? [],
    created_at: l.createdAt,
  }),
  fromRow: (r) => ({
    id: r.id,
    businessName: r.business_name,
    businessType: r.business_type,
    contactName: r.contact_name,
    phone: r.phone,
    email: r.email,
    city: r.city,
    source: r.source,
    stage: r.stage,
    estimatedValue: num(r.estimated_value),
    owner: r.owner,
    nextActionDate: r.next_action_date,
    nextAction: r.next_action,
    projectId: r.project_id,
    intake: r.intake ?? null,
    slug: r.slug ?? null,
    siteDeployed: Boolean(r.site_deployed),
    cloudflareUrl: r.cloudflare_url ?? null,
    liveUrl: r.live_url ?? null,
    templateId: r.template_id ?? null,
    templateName: r.template_name ?? null,
    services: Array.isArray(r.services) ? r.services : [],
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  }),
  sort: (a, b) => b.createdAt.localeCompare(a.createdAt),
  order: { column: 'created_at', ascending: false },
});

const notesStore = createSyncedStore<NoteRecord>([], {
  table: 'lead_notes',
  persistKey: 'leads.notes',
  toRow: (n) => ({ id: n.id, lead_id: n.leadId, author: n.author, text: n.text, created_at: n.createdAt }),
  fromRow: (r) => ({ id: r.id, leadId: r.lead_id, author: r.author, text: r.text, createdAt: iso(r.created_at) }),
  order: { column: 'created_at', ascending: true },
});

function join(leads: LeadRecord[], notes: NoteRecord[]): Lead[] {
  const byLead = new Map<string, LeadNote[]>();
  for (const { leadId, ...note } of [...notes].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    byLead.set(leadId, [...(byLead.get(leadId) ?? []), note]);
  }
  return leads.map((l) => ({ ...l, notes: byLead.get(l.id) ?? [] }));
}

// ---------------------------------------------------------------- solicitudes de la landing

interface RawLandingLead {
  id?: string;
  name?: string;
  business_name?: string;
  sector?: string;
  city?: string;
  email?: string;
  phone?: string;
  services?: string[];
  message?: string;
  source?: string;
  template_id?: string;
  template_name?: string;
  slug?: string;
  client_access_key?: string;
  site_deployed?: boolean;
  live_url?: string;
  cloudflare_url?: string;
  stage?: string;
  created_at?: string;
  budget?: number;
  estimated_value?: number;
  owner?: string;
  intake?: Record<string, unknown>;
}

function mapSectorToBusinessType(sector?: string): BusinessType {
  const s = (sector || '').toLowerCase();
  if (s.includes('restauran') || s.includes('comida') || s.includes('hosteler')) return 'restaurante';
  // «barbería» contiene «bar»: va antes que cafetería.
  if (s.includes('barber')) return 'barberia';
  if (s.includes('bar') || s.includes('cafeter')) return 'cafeteria';
  if (s.includes('clinic') || s.includes('dental') || s.includes('salud') || s.includes('fisio') || s.includes('medic')) return 'clinica';
  if (s.includes('peluquer')) return 'peluqueria';
  if (s.includes('estet')) return 'estetica';
  if (s.includes('tienda') || s.includes('comercio') || s.includes('moda')) return 'tienda';
  return 'otro';
}

function mapSourceToLeadSource(src?: string): LeadSource {
  const s = (src || '').toLowerCase();
  if (s.includes('insta')) return 'instagram';
  if (s.includes('recomen') || s.includes('amigo')) return 'recomendacion';
  if (s.includes('goog') || s.includes('buscad')) return 'google';
  if (s.includes('what')) return 'whatsapp';
  return 'puerta_fria';
}

function mapStageToLeadStage(st?: string): LeadStage {
  const s = (st || '').toLowerCase();
  if (s === 'interesado') return 'interesado';
  if (s === 'propuesta') return 'propuesta';
  if (s === 'negociacion' || s === 'negociación') return 'negociacion';
  if (s === 'cerrado' || s === 'ganado') return 'cerrado';
  if (s === 'perdido') return 'perdido';
  return 'contactado';
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Solicitud de la landing → lead (y su mensaje como primera nota). */
function normalizeLandingLead(raw: RawLandingLead): { lead: LeadRecord; note: string | null } {
  const businessName = raw.business_name || raw.name || 'Negocio sin nombre';
  const slug = raw.slug || sanitizeSlug(businessName);
  const now = raw.created_at || new Date().toISOString();
  const cfUrl = raw.cloudflare_url || raw.live_url || (raw.site_deployed ? `https://${slug}.pages.dev` : null);
  return {
    lead: {
      // La tabla usa UUID: los ids de la landing (lead-123…) se guardan en intake para no duplicar.
      id: raw.id && UUID.test(raw.id) ? raw.id : crypto.randomUUID(),
      businessName,
      businessType: mapSectorToBusinessType(raw.sector),
      contactName: raw.name || businessName,
      phone: raw.phone || '',
      email: raw.email || '',
      city: raw.city || 'Huelva',
      source: mapSourceToLeadSource(raw.source),
      stage: mapStageToLeadStage(raw.stage),
      estimatedValue: Number(raw.budget || raw.estimated_value) || 350,
      owner: (raw.owner === 'mario' ? 'mario' : 'javier') as PartnerId,
      nextActionDate: null,
      nextAction: raw.site_deployed ? 'Web desplegada en Cloudflare' : 'Revisar solicitud y lanzar web',
      projectId: null,
      siteDeployed: Boolean(raw.site_deployed),
      cloudflareUrl: cfUrl,
      liveUrl: cfUrl,
      slug,
      templateId: raw.template_id || null,
      templateName: raw.template_name || null,
      services: raw.services || [],
      intake: { ...(raw.intake ?? {}), ...(raw.id ? { landingId: raw.id } : {}) },
      createdAt: now,
      updatedAt: now,
    },
    note: raw.message?.trim() || null,
  };
}

function readLanding(key: string): RawLandingLead[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RawLandingLead | RawLandingLead[];
    return (Array.isArray(parsed) ? parsed : [parsed]).filter((l) => l && (l.business_name || l.name));
  } catch {
    return [];
  }
}

/** Importa como leads las solicitudes de la landing de este navegador que aún no estén en el CRM. */
function importLandingLeads(): void {
  const incoming = [...readLanding(LOCAL_LANDING_LEADS_KEY), ...readLanding('tecnodiel_active_project')].map(normalizeLandingLead);
  if (!incoming.length) return;
  const notes: NoteRecord[] = [];
  leadsStore.set((prev) => {
    const fresh: LeadRecord[] = [];
    const all = [...prev];
    for (const { lead, note } of incoming) {
      const landingId = lead.intake?.landingId;
      const exists = all.some(
        (l) =>
          l.id === lead.id ||
          (landingId && l.intake?.landingId === landingId) ||
          (lead.phone && l.phone === lead.phone) ||
          (lead.email && l.email === lead.email),
      );
      if (exists) continue;
      all.push(lead);
      fresh.push(lead);
      if (note) notes.push({ id: crypto.randomUUID(), leadId: lead.id, author: 'javier', text: note, createdAt: lead.createdAt });
    }
    return fresh.length ? [...fresh, ...prev] : prev;
  });
  // Las notas van después de sus leads (misma cola de escritura, mismo orden).
  if (notes.length) notesStore.set((prev) => [...prev, ...notes]);
}

/** Vuelca los leads a `tecnodiel_leads` para que la landing y el portal los sigan viendo. */
function syncWithLandingLeads(): void {
  try {
    const notes = notesStore.get();
    const formatted = leadsStore.get().map((l) => ({
      id: (l.intake?.landingId as string | undefined) ?? l.id,
      name: l.contactName,
      business_name: l.businessName,
      sector: l.businessType,
      city: l.city,
      email: l.email,
      phone: l.phone,
      services: l.services || [],
      message: notes
        .filter((n) => n.leadId === l.id)
        .map((n) => n.text)
        .join('\n'),
      source: l.source,
      template_id: l.templateId,
      template_name: l.templateName,
      slug: l.slug,
      site_deployed: Boolean(l.siteDeployed),
      live_url: l.cloudflareUrl || l.liveUrl,
      stage: l.stage,
      budget: l.estimatedValue,
      estimated_value: l.estimatedValue,
      owner: l.owner,
      created_at: l.createdAt,
    }));
    localStorage.setItem(LOCAL_LANDING_LEADS_KEY, JSON.stringify(formatted));
  } catch {
    // Sin almacenamiento local: no pasa nada, los datos siguen en el CRM.
  }
}

// En la demo se importa al cargar; con Supabase, cuando ya se han leído los leads del equipo.
if (typeof window !== 'undefined') {
  if (isSupabaseConfigured) whenSyncReady(importLandingLeads);
  else importLandingLeads();
  leadsStore.subscribe(syncWithLandingLeads);
}

// ---------------------------------------------------------------- lectura

/** Al borrar un proyecto, el lead que se convirtió en él vuelve a no tener proyecto. */
export function unlinkProjectLeads(projectId: string): void {
  leadsStore.set((prev) => prev.map((l) => (l.projectId === projectId ? { ...l, projectId: null } : l)));
}

export function useLeads(): Lead[] {
  const leads = useStore(leadsStore);
  const notes = useStore(notesStore);
  return useMemo(() => join(leads, notes), [leads, notes]);
}

export function useLead(id: string | null): Lead | undefined {
  const leads = useLeads();
  return useMemo(() => (id ? leads.find((l) => l.id === id) : undefined), [leads, id]);
}

// ---------------------------------------------------------------- escritura

function patch(id: string, changes: Partial<LeadRecord>): void {
  leadsStore.set((prev) =>
    prev.map((l) => (l.id === id ? { ...l, ...changes, updatedAt: new Date().toISOString() } : l)),
  );
}

export type NewLeadInput = Pick<
  Lead,
  'businessName' | 'businessType' | 'contactName' | 'phone' | 'email' | 'city' | 'source' | 'estimatedValue' | 'owner'
> & {
  slug?: string;
  templateId?: string;
  services?: string[];
};

export function createLead(input: NewLeadInput, by: PartnerId): Lead {
  const now = new Date().toISOString();
  const lead: Lead = {
    ...input,
    id: crypto.randomUUID(),
    stage: 'contactado',
    nextActionDate: null,
    nextAction: 'Lanzar web en Cloudflare y contactar',
    notes: [],
    projectId: null,
    slug: input.slug || sanitizeSlug(input.businessName),
    templateId: input.templateId ?? null,
    services: input.services ?? [],
    siteDeployed: false,
    cloudflareUrl: null,
    liveUrl: null,
    createdAt: now,
    updatedAt: now,
  };
  const { notes: _notes, ...record } = lead;
  leadsStore.set((prev) => [record, ...prev]);
  logActivity({ type: 'lead', partnerId: by, projectId: null, action: `añadió el lead «${lead.businessName}» al CRM` });
  return lead;
}

export function moveLead(id: string, stage: LeadStage, by: PartnerId): void {
  const lead = leadsStore.get().find((l) => l.id === id);
  if (!lead || lead.stage === stage) return;
  patch(id, { stage });
  logActivity({
    type: 'lead',
    partnerId: by,
    projectId: lead.projectId,
    action: `movió el lead «${lead.businessName}» a ${STAGE_META[stage].label}`,
  });
}

export function updateLead(id: string, changes: Partial<Omit<Lead, 'id' | 'notes' | 'stage' | 'createdAt'>>): void {
  patch(id, changes);
}

export function addLeadNote(id: string, text: string, by: PartnerId): void {
  const lead = leadsStore.get().find((l) => l.id === id);
  if (!lead || !text.trim()) return;
  notesStore.set((prev) => [
    ...prev,
    { id: crypto.randomUUID(), leadId: id, author: by, text: text.trim(), createdAt: new Date().toISOString() },
  ]);
}

/**
 * Lanza la web del lead en Cloudflare Pages.
 * Genera la URL *.pages.dev, la guarda en el lead y la deja lista para ver y enviar al cliente.
 */
export async function deployLeadWeb(id: string, by?: PartnerId): Promise<{ success: boolean; url: string; error?: string }> {
  const lead = leadsStore.get().find((l) => l.id === id);
  if (!lead) return { success: false, url: '', error: 'Lead no encontrado' };

  const slug = lead.slug || sanitizeSlug(lead.businessName);
  const res = await provisionCloudflarePage(slug);
  if (!res.success) return { success: false, url: '', error: res.message || 'Error al conectar con Cloudflare' };

  patch(id, {
    siteDeployed: true,
    cloudflareUrl: res.url,
    liveUrl: res.url,
    slug,
    nextAction: `Web activa en ${res.url}. Enlace listo para enviar.`,
  });
  if (by) {
    logActivity({
      type: 'lead',
      partnerId: by,
      projectId: lead.projectId,
      action: `lanzó la web de «${lead.businessName}» en Cloudflare: ${res.url}`,
    });
  }
  return { success: true, url: res.url };
}

/** Crea el proyecto con los datos del cliente y deja el lead como cerrado y enlazado. */
export function convertLead(id: string, input: NewProjectInput, by: PartnerId): Project | undefined {
  const lead = leadsStore.get().find((l) => l.id === id);
  if (!lead || lead.projectId) return undefined;
  // El cliente va antes que el proyecto (que lo referencia): así el cliente lo ve en su portal.
  const clientId = ensureClientForLead(lead);
  const project = createProject(
    input,
    by,
    { contactName: lead.contactName, phone: lead.phone, email: lead.email, city: lead.city },
    clientId,
  );
  patch(id, { stage: 'cerrado', projectId: project.id, estimatedValue: input.price, nextAction: '', nextActionDate: null });
  logActivity({ type: 'lead', partnerId: by, projectId: project.id, action: `cerró la venta y convirtió el lead en` });
  return project;
}
