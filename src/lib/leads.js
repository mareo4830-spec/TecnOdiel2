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

/** Guarda una solicitud de formulario. Devuelve { ok, remote } */
export async function submitLead(form) {
  const row = {
    id: form.id || `lead-${Date.now()}`,
    name: clean(form.name, 120),
    business_name: clean(form.business_name, 160) || clean(form.name, 120),
    sector: clean(form.sector, 60),
    city: clean(form.city || 'Huelva', 80),
    email: clean(form.email, 160),
    phone: clean(form.phone, 40),
    services: Array.isArray(form.services) ? form.services.slice(0, 20).map((s) => clean(s, 80)) : [],
    message: clean(form.message, 2000),
    source: clean(form.source || 'landing', 40),
    template_id: clean(form.template_id || '', 80),
    template_name: clean(form.template_name || '', 80),
    instagram_url: clean(form.instagram_url || '', 200),
    current_website: clean(form.current_website || '', 200),
    slug: clean(form.slug || '', 80),
    client_access_key: clean(form.client_access_key || '', 60),
    site_deployed: Boolean(form.site_deployed),
    live_url: clean(form.live_url || '', 200),
    stage: clean(form.stage || 'nuevo', 40),
    created_at: form.created_at || new Date().toISOString()
  };

  // Siempre persistir localmente como copia fiable e inmediata
  const existingLocal = readLocal();
  const filtered = existingLocal.filter(l => l.phone !== row.phone || !row.phone);
  writeLocal([row, ...filtered]);

  let remote = false;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: headers({ Prefer: 'return=minimal' }),
      body: JSON.stringify(row)
    });
    remote = res.ok;
  } catch { /* offline o tabla sin crear: respaldo local activo */ }

  return { ok: true, remote, lead: row };
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
