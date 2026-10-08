import { createStore, useStore } from '../../lib/store';
import type { Lead, LeadStage, NewProjectInput, PartnerId, Project } from '../../types';
import { logActivity } from '../activity/activityService';
import { createProject } from '../projects/projectService';
import { STAGE_META } from './leadMeta';

/*
 * Capa de datos del CRM (local). Con Supabase: tabla `leads` + `lead_notes` con Realtime.
 * Los componentes no cambian.
 */
const leadsStore = createStore<Lead[]>([], 'leads');

/** Al borrar un proyecto, el lead que se convirtió en él vuelve a no tener proyecto. */
export function unlinkProjectLeads(projectId: string): void {
  leadsStore.set((prev) => prev.map((l) => (l.projectId === projectId ? { ...l, projectId: null } : l)));
}

export function useLeads(): Lead[] {
  return useStore(leadsStore);
}

export function useLead(id: string | null): Lead | undefined {
  return useStore(leadsStore, (list) => (id ? list.find((l) => l.id === id) : undefined));
}

function patch(id: string, changes: Partial<Lead>): Lead | undefined {
  let updated: Lead | undefined;
  leadsStore.set((prev) =>
    prev.map((l) => {
      if (l.id !== id) return l;
      updated = { ...l, ...changes, updatedAt: new Date().toISOString() };
      return updated;
    }),
  );
  return updated;
}

export type NewLeadInput = Pick<
  Lead,
  'businessName' | 'businessType' | 'contactName' | 'phone' | 'email' | 'city' | 'source' | 'estimatedValue' | 'owner'
>;

export function createLead(input: NewLeadInput, by: PartnerId): Lead {
  const now = new Date().toISOString();
  const lead: Lead = {
    ...input,
    id: crypto.randomUUID(),
    stage: 'contactado',
    nextActionDate: null,
    nextAction: '',
    notes: [],
    projectId: null,
    createdAt: now,
    updatedAt: now,
  };
  leadsStore.set((prev) => [lead, ...prev]);
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
