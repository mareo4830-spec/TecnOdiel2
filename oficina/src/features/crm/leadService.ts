import { useMemo } from 'react';
import { iso, num } from '../../lib/rows';
import { useStore } from '../../lib/store';
import { createSyncedStore } from '../../lib/syncedStore';
import type { Lead, LeadNote, LeadStage, NewProjectInput, PartnerId, Project } from '../../types';
import { logActivity } from '../activity/activityService';
import { ensureClientForLead } from '../clients/clientService';
import { createProject } from '../projects/projectService';
import { STAGE_META } from './leadMeta';

/*
 * CRM: tablas `leads` y `lead_notes`. Los leads de la landing llegan por Realtime
 * (los inserta el propio visitante con su sesión de Google, ver la política de `leads`).
 * Las notas son filas aparte; aquí se unen al lead para que los componentes no cambien.
 */
type LeadRecord = Omit<Lead, 'notes'>;
interface NoteRecord extends LeadNote {
  leadId: string;
}

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

function patch(id: string, changes: Partial<LeadRecord>): void {
  leadsStore.set((prev) =>
    prev.map((l) => (l.id === id ? { ...l, ...changes, updatedAt: new Date().toISOString() } : l)),
  );
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
