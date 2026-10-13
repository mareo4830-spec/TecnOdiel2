import { createStore, useStore } from '../../lib/store';
import type { Lead, LeadStage, LeadSource, BusinessType, NewProjectInput, PartnerId, Project } from '../../types';
import { logActivity } from '../activity/activityService';
import { createProject } from '../projects/projectService';
import { STAGE_META } from './leadMeta';
import { provisionCloudflarePage, sanitizeSlug } from '../../lib/cloudflare';

/*
 * Capa de datos del CRM (local y sincronizada con landing/portal).
 * Lee automáticamente `tecnodiel_leads` y `tecnodiel_active_project` para que cualquier cliente
 * que rellene el formulario de la landing aparezca de inmediato aquí en el panel de admin.
 */

const LOCAL_LANDING_LEADS_KEY = 'tecnodiel_leads';

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
  if (s.includes('bar') || s.includes('cafeter')) return 'cafeteria';
  if (s.includes('clinic') || s.includes('dental') || s.includes('salud') || s.includes('fisio') || s.includes('medic')) return 'clinica';
  if (s.includes('barber')) return 'barberia';
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
  if (s === 'contactado' || s === 'nuevo') return 'contactado';
  if (s === 'interesado') return 'interesado';
  if (s === 'propuesta') return 'propuesta';
  if (s === 'negociacion' || s === 'negociación') return 'negociacion';
  if (s === 'cerrado' || s === 'ganado') return 'cerrado';
  if (s === 'perdido') return 'perdido';
  return 'contactado';
}

function normalizeLandingLead(raw: RawLandingLead): Lead {
  const businessName = raw.business_name || raw.name || 'Negocio sin nombre';
  const slug = raw.slug || sanitizeSlug(businessName);
  const now = raw.created_at || new Date().toISOString();
  const cfUrl = raw.live_url || (raw.site_deployed ? `https://${slug}.pages.dev` : null);

  return {
    id: raw.id || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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
    notes: raw.message ? [{ id: 'note-initial', author: 'javier', text: raw.message, createdAt: now }] : [],
    projectId: null,
    siteDeployed: Boolean(raw.site_deployed),
    cloudflareUrl: cfUrl,
    liveUrl: cfUrl,
    slug,
    templateId: raw.template_id || null,
    templateName: raw.template_name || null,
    services: raw.services || [],
    intake: raw.intake || null,
    createdAt: now,
    updatedAt: now,
  };
}

/** Carga y unifica leads del almacenamiento local de TecnOdiel y la Oficina Virtual */
function loadInitialLeads(): Lead[] {
  const leadsMap = new Map<string, Lead>();

  // 1. Leads de la oficina virtual previos (ov.data.leads)
  try {
    const rawOv = localStorage.getItem('ov.data.leads');
    if (rawOv) {
      const parsed = JSON.parse(rawOv) as Lead[];
      if (Array.isArray(parsed)) {
        parsed.forEach((l) => leadsMap.set(l.id, l));
      }
    }
  } catch (_) {}

  // 2. Leads del formulario de la Landing (`tecnodiel_leads`)
  try {
    const rawLanding = localStorage.getItem(LOCAL_LANDING_LEADS_KEY);
    if (rawLanding) {
      const parsedLanding = JSON.parse(rawLanding) as RawLandingLead[];
      if (Array.isArray(parsedLanding)) {
        parsedLanding.forEach((raw) => {
          const lead = normalizeLandingLead(raw);
          // Buscar si ya existe por id o por teléfono/email
          const existingKey = Array.from(leadsMap.keys()).find((k) => {
            const item = leadsMap.get(k);
            return item && (item.id === lead.id || (lead.phone && item.phone === lead.phone) || (lead.email && item.email === lead.email));
          });

          if (existingKey) {
            const prev = leadsMap.get(existingKey)!;
            leadsMap.set(existingKey, {
              ...lead,
              ...prev,
              siteDeployed: prev.siteDeployed ?? lead.siteDeployed,
              cloudflareUrl: prev.cloudflareUrl || lead.cloudflareUrl,
              liveUrl: prev.liveUrl || lead.liveUrl,
              slug: prev.slug || lead.slug,
            });
          } else {
            leadsMap.set(lead.id, lead);
          }
        });
      }
    }
  } catch (_) {}

  // 3. Lead activo en progreso (`tecnodiel_active_project`)
  try {
    const rawActive = localStorage.getItem('tecnodiel_active_project');
    if (rawActive) {
      const activeProj = JSON.parse(rawActive) as RawLandingLead;
      if (activeProj?.business_name || activeProj?.name) {
        const lead = normalizeLandingLead(activeProj);
        const existingKey = Array.from(leadsMap.keys()).find((k) => {
          const item = leadsMap.get(k);
          return item && ((lead.phone && item.phone === lead.phone) || (lead.email && item.email === lead.email) || item.businessName === lead.businessName);
        });
        if (!existingKey) {
          leadsMap.set(lead.id, lead);
        }
      }
    }
  } catch (_) {}

  return Array.from(leadsMap.values());
}

const leadsStore = createStore<Lead[]>(loadInitialLeads(), 'leads');

/** Sincroniza hacia `tecnodiel_leads` para mantener retrocompatibilidad total */
function syncWithLandingLeads(leads: Lead[]): void {
  try {
    const formatted = leads.map((l) => ({
      id: l.id,
      name: l.contactName,
      business_name: l.businessName,
      sector: l.businessType,
      city: l.city,
      email: l.email,
      phone: l.phone,
      services: l.services || [],
      message: l.notes.map((n) => n.text).join('\n'),
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
  } catch (_) {}
}

/** Al borrar un proyecto, el lead que se convirtió en él vuelve a no tener proyecto. */
export function unlinkProjectLeads(projectId: string): void {
  leadsStore.set((prev) => {
    const updated = prev.map((l) => (l.projectId === projectId ? { ...l, projectId: null } : l));
    syncWithLandingLeads(updated);
    return updated;
  });
}

export function useLeads(): Lead[] {
  return useStore(leadsStore);
}

export function useLead(id: string | null): Lead | undefined {
  return useStore(leadsStore, (list) => (id ? list.find((l) => l.id === id) : undefined));
}

function patch(id: string, changes: Partial<Lead>): Lead | undefined {
  let updated: Lead | undefined;
  leadsStore.set((prev) => {
    const next = prev.map((l) => {
      if (l.id !== id) return l;
      updated = { ...l, ...changes, updatedAt: new Date().toISOString() };
      return updated;
    });
    syncWithLandingLeads(next);
    return next;
  });
  return updated;
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
  const slug = input.slug || sanitizeSlug(input.businessName);
  const lead: Lead = {
    ...input,
    id: crypto.randomUUID(),
    stage: 'contactado',
    nextActionDate: null,
    nextAction: 'Lanzar web en Cloudflare y contactar',
    notes: [],
    projectId: null,
    slug,
    siteDeployed: false,
    cloudflareUrl: null,
    liveUrl: null,
    createdAt: now,
    updatedAt: now,
  };
  leadsStore.set((prev) => {
    const next = [lead, ...prev];
    syncWithLandingLeads(next);
    return next;
  });
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
  patch(id, {
    notes: [...lead.notes, { id: crypto.randomUUID(), author: by, text: text.trim(), createdAt: new Date().toISOString() }],
  });
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

  if (res.success) {
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

  return { success: false, url: '', error: res.message || 'Error al conectar con Cloudflare' };
}

/** Crea el proyecto con los datos del cliente y deja el lead como cerrado y enlazado. */
export function convertLead(id: string, input: NewProjectInput, by: PartnerId): Project | undefined {
  const lead = leadsStore.get().find((l) => l.id === id);
  if (!lead || lead.projectId) return undefined;
  const project = createProject(input, by, {
    contactName: lead.contactName,
    phone: lead.phone,
    email: lead.email,
    city: lead.city,
  });
  patch(id, { stage: 'cerrado', projectId: project.id, estimatedValue: input.price, nextAction: '', nextActionDate: null });
  logActivity({ type: 'lead', partnerId: by, projectId: project.id, action: `cerró la venta y convirtió el lead en` });
  return project;
}
