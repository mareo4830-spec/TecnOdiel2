import { db, must, num, persist } from '../../lib/db';
import { createStore, useStore } from '../../lib/store';
import type { BusinessType, Lead, LeadIntake, LeadNote, LeadSource, LeadStage, NewProjectInput, PartnerId, Project } from '../../types';
import { logActivity } from '../activity/activityService';
import { createProject } from '../projects/projectService';
import { STAGE_META } from './leadMeta';

/*
 * CRM. Con Supabase: tablas `leads` + `lead_notes` con Realtime. Sin Supabase: en memoria.
 */
const leadsStore = createStore<Lead[]>([]);

interface LeadRow {
  id: string;
  business_name: string;
  business_type: BusinessType;
  contact_name: string;
  phone: string;
  email: string;
  city: string;
  source: LeadSource;
  stage: LeadStage;
  intake: LeadIntake | null;
  estimated_value: number | string;
  owner: PartnerId;
  next_action_date: string | null;
  next_action: string;
  project_id: string | null;
  created_at: string;
  updated_at: string;
  lead_notes: { id: string; author: PartnerId; text: string; created_at: string }[];
}

export async function loadLeads(): Promise<void> {
  const rows = await must<LeadRow[]>(db().from('leads').select('*, lead_notes(*)').order('updated_at', { ascending: false }));
  leadsStore.set(() =>
    rows.map((r) => ({
      id: r.id,
      businessName: r.business_name,
      businessType: r.business_type,
      contactName: r.contact_name,
      phone: r.phone,
      email: r.email,
      city: r.city,
      source: r.source,
      stage: r.stage,
      intake: r.intake ?? null,
      estimatedValue: num(r.estimated_value),
      owner: r.owner,
      nextActionDate: r.next_action_date,
      nextAction: r.next_action,
      notes: r.lead_notes
        .map((n) => ({ id: n.id, author: n.author, text: n.text, createdAt: n.created_at }))
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      projectId: r.project_id,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
  );
}

/** Columnas de `leads` que cambian con un patch de la app. */
function toRow(l: Partial<Lead>): Record<string, unknown> {
  const map: [keyof Lead, string][] = [
    ['businessName', 'business_name'],
    ['businessType', 'business_type'],
    ['contactName', 'contact_name'],
    ['phone', 'phone'],
    ['email', 'email'],
    ['city', 'city'],
    ['source', 'source'],
    ['stage', 'stage'],
    ['estimatedValue', 'estimated_value'],
    ['owner', 'owner'],
    ['nextActionDate', 'next_action_date'],
    ['nextAction', 'next_action'],
    ['projectId', 'project_id'],
  ];
  const row: Record<string, unknown> = {};
  for (const [from, to] of map) if (from in l) row[to] = l[from];
  return row;
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
  const row = toRow(changes);
  if (Object.keys(row).length) void persist('Guardar lead', () => must(db().from('leads').update(row).eq('id', id)));
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
    intake: null,
    nextActionDate: null,
    nextAction: '',
    notes: [],
    projectId: null,
    createdAt: now,
    updatedAt: now,
  };
  leadsStore.set((prev) => [lead, ...prev]);
  void persist('Crear lead', () => must(db().from('leads').insert({ id: lead.id, ...toRow(lead), created_at: now })));
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
  const note: LeadNote = { id: crypto.randomUUID(), author: by, text: text.trim(), createdAt: new Date().toISOString() };
  leadsStore.set((prev) => prev.map((l) => (l.id === id ? { ...l, notes: [...l.notes, note], updatedAt: note.createdAt } : l)));
  void persist('Guardar nota', () =>
    must(db().from('lead_notes').insert({ id: note.id, lead_id: id, author: by, text: note.text, created_at: note.createdAt })),
  );
}

export async function deleteLeadNote(leadId: string, noteId: string): Promise<boolean> {
  const ok = await persist('Eliminar nota', () => must(db().from('lead_notes').delete().eq('id', noteId)));
  if (ok) leadsStore.set((prev) => prev.map((l) => (l.id === leadId ? { ...l, notes: l.notes.filter((n) => n.id !== noteId) } : l)));
  return ok;
}

/** Elimina el lead y sus notas. El proyecto que se creó al convertirlo (si lo hay) se conserva. */
export async function deleteLead(id: string, by: PartnerId): Promise<boolean> {
  const lead = leadsStore.get().find((l) => l.id === id);
  if (!lead) return false;
  const ok = await persist('Eliminar lead', () => must(db().from('leads').delete().eq('id', id)));
  if (ok) {
    leadsStore.set((prev) => prev.filter((l) => l.id !== id));
    logActivity({ type: 'lead', partnerId: by, projectId: null, action: `eliminó el lead «${lead.businessName}» del CRM` });
  }
  return ok;
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
