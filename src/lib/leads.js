// Solicitudes de clientes (formulario de la landing -> Oficina Virtual).
// Usa la API REST de Supabase (sin dependencias) y guarda copia en localStorage
// como respaldo, igual que el resto de la plataforma, para no perder ninguna solicitud.

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://ifmtuucsonuzuxauolvt.supabase.co';
const SUPABASE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbXR1dWNzb251enV4YXVvbHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3OTkxNjMsImV4cCI6MjEwNjM3NTE2M30.lGjIIBmW0kfi8QAf5SNynlRDKsX3g1hXgTzPOVflAyU';

const LOCAL_KEY = 'tecnodiel_leads';
const ENDPOINT = `${SUPABASE_URL}/rest/v1/leads`;
const headers = (extra = {}) => ({
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  ...extra
});

const readLocal = () => {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); } catch { return []; }
};
const writeLocal = (rows) => {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(rows)); } catch { /* sin almacenamiento */ }
};

const clean = (v, max = 500) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

/** Guarda una solicitud. Devuelve { ok, remote } — ok=false solo si falla todo. */
export async function submitLead(form) {
  const row = {
    name: clean(form.name, 120),
    business_name: clean(form.business_name, 160),
    sector: clean(form.sector, 60),
    city: clean(form.city || 'Huelva', 80),
    email: clean(form.email, 160),
    phone: clean(form.phone, 40),
    services: Array.isArray(form.services) ? form.services.slice(0, 20).map((s) => clean(s, 80)) : [],
    message: clean(form.message, 2000),
    source: 'landing'
  };

  let remote = false;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(row)
    });
    remote = res.ok;
  } catch { /* offline o tabla sin crear: caemos al respaldo local */ }

  if (!remote) {
    writeLocal([{ ...row, id: `local-${Date.now()}`, created_at: new Date().toISOString(), stage: 'nuevo', pending_sync: true }, ...readLocal()]);
  }
  return { ok: true, remote };
}

/** Lista las solicitudes (Supabase + las pendientes de sincronizar en este navegador). */
export async function fetchLeads() {
  let remoteRows = [];
  let error = null;
  try {
    const res = await fetch(`${ENDPOINT}?select=*&order=created_at.desc&limit=500`, { headers: headers() });
    if (res.ok) remoteRows = await res.json();
    else error = `HTTP ${res.status}`;
  } catch (e) { error = e.message; }
  return { rows: [...readLocal(), ...remoteRows], error };
}

export async function updateLead(id, fields) {
  if (String(id).startsWith('local-')) {
    writeLocal(readLocal().map((l) => (l.id === id ? { ...l, ...fields } : l)));
    return true;
  }
  try {
    const res = await fetch(`${ENDPOINT}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(fields)
    });
    return res.ok;
  } catch { return false; }
}
