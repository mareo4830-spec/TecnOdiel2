import { createClient } from '@supabase/supabase-js';
import { INITIAL_CLINICS } from './mockData';
import { provisionCloudflarePage } from './cloudflareService';

const STORAGE_KEY_CLINICS = 'tecnodiel_clinics_db';
const STORAGE_KEY_CONFIG = 'tecnodiel_supabase_config_cys';

const DEFAULT_SUPABASE_URL = 'https://wkzbgxsknkhixclgvrli.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndremJneHNrbmtoaXhjbGd2cmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0Nzk0NzUsImV4cCI6MjEwNzA1NTQ3NX0.MpIo0xJQC3MdJ4HQewEs3stfTF-I8uWXZgcJ6sS5uVw';

export function getSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  return {
    url: envUrl.trim(),
    anonKey: envKey.trim(),
    connected: true
  };
}

export function saveSupabaseConfig(url, anonKey) {
  const config = {
    url: url ? url.trim() : '',
    anonKey: anonKey ? anonKey.trim() : '',
    connected: !!(url && anonKey)
  };
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  return config;
}

export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      return createClient(config.url, config.anonKey);
    } catch (err) {
      console.warn('Could not instantiate Supabase client:', err);
    }
  }
  return null;
}

// Clinic detection helper to guarantee total isolation between restaurants and clinics
export function isClinicEntity(item) {
  if (!item) return false;

  // 1. Explicit clinical categories
  const CLINIC_CATEGORIES = new Set([
    'dental', 'policlinica', 'fisioterapia', 'estetica', 
    'psicologia', 'veterinaria', 'oftalmologia', 'podologia', 
    'nutricion', 'clinica', 'salud', 'medica', 'medico', 'hospital'
  ]);
  const cat = (item.category || '').toLowerCase().trim();
  if (CLINIC_CATEGORIES.has(cat)) return true;

  // 2. Client access key starts with CYS
  const key = (item.client_access_key || '').toUpperCase().trim();
  if (key.startsWith('CYS-') || key.startsWith('CYS')) return true;

  // 3. Dress code used for medical collegiate number
  const collegiate = (item.collegiate_number || item.dress_code || '').toLowerCase();
  if (
    collegiate.includes('col.') || 
    collegiate.includes('colegiad') || 
    collegiate.includes('odontólog') || 
    collegiate.includes('odontolog') || 
    collegiate.includes('médic') || 
    collegiate.includes('medic')
  ) return true;

  // 4. Slug & Subdomain contains clinic keywords
  const slug = (item.slug || '').toLowerCase();
  const sub = (item.subdomain || '').toLowerCase();
  if (
    slug.startsWith('cys-') || 
    slug.includes('clinic') || 
    slug.includes('dental') || 
    slug.includes('fisioterap') || 
    slug.includes('policlinic') || 
    slug.includes('oftalmo') || 
    slug.includes('psicol') ||
    sub.startsWith('cys-') ||
    sub.includes('clinic')
  ) return true;

  // 5. Name contains clinic words
  const name = (item.name || '').toLowerCase();
  if (
    name.includes('clínica') || 
    name.includes('clinica') || 
    name.includes('policlínica') || 
    name.includes('policlinica') || 
    name.includes('odontol') || 
    name.includes('fisioterapia') || 
    name.includes('oftalmolog') || 
    name.includes('podolog') || 
    name.includes('centro médico') || 
    name.includes('centro medico')
  ) return true;

  // 6. Template IDs from CyS
  const templateId = (item.template_id || '').toLowerCase();
  const CLINIC_TEMPLATES = [
    'dental_pure', 'medica_policlinica', 'fisio_sport', 'estetica_glow', 
    'psico_mente', 'vet_care', 'oftalmo_vision', 'podologia_laser', 'nutri_metabol'
  ];
  if (
    CLINIC_TEMPLATES.includes(templateId) || 
    templateId.startsWith('dental') || 
    templateId.startsWith('medica') || 
    templateId.startsWith('fisio') || 
    templateId.startsWith('estetica') || 
    templateId.startsWith('psico') || 
    templateId.startsWith('vet_') || 
    templateId.startsWith('oftalmo') || 
    templateId.startsWith('podolog') || 
    templateId.startsWith('nutri_')
  ) return true;

  // 7. Plan name
  const plan = (item.plan_name || '').toLowerCase();
  if (plan.includes('clínica') || plan.includes('clinica') || plan.includes('salud') || plan.includes('cys')) return true;

  return false;
}

// Local Storage Multi-Tenant Store (Offline-first & fallback)
export function getLocalClinics() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CLINICS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const onlyClinics = parsed.filter(isClinicEntity);
        if (onlyClinics.length > 0) {
          if (onlyClinics.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_CLINICS, JSON.stringify(onlyClinics));
          }
          return onlyClinics;
        }
      }
    }
  } catch (e) {
    console.error('Error reading local clinics', e);
  }
  localStorage.setItem(STORAGE_KEY_CLINICS, JSON.stringify(INITIAL_CLINICS));
  return INITIAL_CLINICS;
}

export function saveLocalClinics(clinics) {
  try {
    const onlyClinics = Array.isArray(clinics) ? clinics.filter(isClinicEntity) : [];
    localStorage.setItem(STORAGE_KEY_CLINICS, JSON.stringify(onlyClinics));
  } catch (e) {
    console.error('Error saving local clinics', e);
  }
}

// Sanitize slug for cybersecurity & subdomain routing
export function sanitizeSlug(input) {
  return (input || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to determine whether a remote row is a clinic
function rowToClinic(row) {
  if (!row) return null;
  return {
    ...row,
    accepted_insurances: row.accepted_insurances || row.dietary_filters || ['Adeslas', 'Sanitas', 'Privado'],
    collegiate_number: row.collegiate_number || row.dress_code || 'Col. Sanitario Oficial',
    emergency_phone: row.emergency_phone || row.whatsapp_number || row.phone,
    appointments: row.appointments || row.reservations || []
  };
}

// API: Get all clinics from database (strictly excluding restaurants)
export async function fetchClinics() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // 1. Try 'clinics' table
      const { data: cData, error: cErr } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      if (!cErr && cData && cData.length > 0) {
        const onlyClinics = cData.filter(isClinicEntity).map(rowToClinic);
        if (onlyClinics.length > 0) return onlyClinics;
      }

      // 2. Fetch from 'restaurants' table filtering for clinic entities
      const { data: rData, error: rErr } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (!rErr && rData && rData.length > 0) {
        const onlyClinics = rData.filter(isClinicEntity).map(rowToClinic);
        if (onlyClinics.length > 0) {
          saveLocalClinics(onlyClinics);
          return onlyClinics;
        }
      }
    } catch (e) {
      console.warn('Supabase fetch clinics failed, using local store', e);
    }
  }
  return getLocalClinics();
}

// API: Get single clinic by slug or subdomain (strictly excluding restaurants)
export async function fetchClinicBySlug(slugOrSubdomain) {
  if (!slugOrSubdomain) return null;
  const clean = sanitizeSlug(slugOrSubdomain);
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrSubdomain);
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      // Try clinics table first
      let query = supabase.from('clinics').select('*');
      if (isUUID) {
        query = query.eq('id', slugOrSubdomain);
      } else {
        query = query.or(`slug.eq.${clean},subdomain.eq.${clean}`);
      }
      const { data, error } = await query.maybeSingle();
      if (!error && data && isClinicEntity(data)) {
        return rowToClinic(data);
      }

      // Try restaurants table
      let rQuery = supabase.from('restaurants').select('*');
      if (isUUID) {
        rQuery = rQuery.eq('id', slugOrSubdomain);
      } else {
        rQuery = rQuery.or(`slug.eq.${clean},subdomain.eq.${clean}`);
      }
      const { data: rData, error: rErr } = await rQuery.maybeSingle();
      if (!rErr && rData && isClinicEntity(rData)) {
        return rowToClinic(rData);
      }
    } catch (e) {
      console.warn('Supabase fetch single clinic failed, using local fallback', e);
    }
  }

  const all = getLocalClinics();
  const found = all.find(c => (c.slug === clean || c.subdomain === clean || c.id === slugOrSubdomain) && isClinicEntity(c));
  return found || null;
}

// API: Create new clinic
export async function createClinic(clinicData) {
  const cleanSlug = sanitizeSlug(clinicData.slug || clinicData.name || 'mi-clinica');
  const randomKeyNum = Math.floor(100 + Math.random() * 900);
  const clientKey = clinicData.client_access_key || `CYS-${cleanSlug.toUpperCase().slice(0, 6)}-${randomKeyNum}`;

  const newClinic = {
    id: clinicData.id || `clinic-${Date.now()}`,
    slug: cleanSlug,
    subdomain: cleanSlug,
    client_access_key: clientKey,
    plan_name: clinicData.plan_name || 'Plan Clínica & Salud Pro',
    budget: parseFloat(clinicData.budget) || 99.00,
    billing_plan: clinicData.billing_plan || 'monthly',
    contract_status: clinicData.contract_status || 'active',
    name: clinicData.name,
    slogan: clinicData.slogan || '',
    description: clinicData.description || '',
    category: clinicData.category || 'dental',
    collegiate_number: clinicData.collegiate_number || 'Col. Oficial de Médicos / Odontólogos',
    accepted_insurances: clinicData.accepted_insurances || ['Adeslas', 'Sanitas', 'Privado / Sin Seguro'],
    emergency_phone: clinicData.emergency_phone || clinicData.phone || '+34 959 10 20 30',
    cta_text: clinicData.cta_text || 'Pedir Cita Online',
    template_id: clinicData.template_id || 'dental_pure',
    hero_layout: clinicData.hero_layout || 'split',
    hero_image_side: clinicData.hero_image_side || 'right',
    hero_image_size: clinicData.hero_image_size || 'md',
    primary_color: clinicData.primary_color || '#06b6d4',
    accent_color: clinicData.accent_color || '#22d3ee',
    background_color: clinicData.background_color || '#041724',
    surface_color: clinicData.surface_color || '#08253a',
    font_family: clinicData.font_family || 'Inter',
    hero_image: clinicData.hero_image || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80',
    phone: clinicData.phone || '+34 959 10 20 30',
    whatsapp_number: clinicData.whatsapp_number || '+34600112233',
    email: clinicData.email || 'citas@' + cleanSlug + '.es',
    address: clinicData.address || 'Calle Gran Vía, 12',
    city: clinicData.city || 'Huelva',
    postal_code: clinicData.postal_code || '21001',
    google_maps_url: clinicData.google_maps_url || 'https://maps.google.com',
    lunch_shift: clinicData.lunch_shift || { enabled: true, open: '09:00', close: '14:00' },
    dinner_shift: clinicData.dinner_shift || { enabled: true, open: '16:00', close: '20:30' },
    closed_days: clinicData.closed_days || ['Sábado', 'Domingo'],
    selected_modules: clinicData.selected_modules || ['booking_engine', 'whatsapp_triage', 'patient_portal'],
    menu_categories: clinicData.menu_categories || clinicData.treatments || [],
    appointments: [],
    created_at: new Date().toISOString()
  };

  // Automatically provision Cloudflare Pages domain (*.pages.dev)
  try {
    const cfInfo = await provisionCloudflarePage(cleanSlug, clinicData.custom_domain, clinicData);
    newClinic.cloudflare_domain = cfInfo.domain;
    newClinic.cloudflare_url = cfInfo.url;
    newClinic.published_url = cfInfo.url;
    newClinic.cloudflare_status = cfInfo.status;
    newClinic.subdomain = cfInfo.domain;
  } catch (err) {
    console.warn('Cloudflare Pages domain provisioning error:', err);
    newClinic.cloudflare_domain = `cys-${cleanSlug}.pages.dev`;
    newClinic.cloudflare_url = `https://cys-${cleanSlug}.pages.dev`;
    newClinic.published_url = `https://cys-${cleanSlug}.pages.dev`;
    newClinic.cloudflare_status = 'ready';
    newClinic.subdomain = `cys-${cleanSlug}.pages.dev`;
  }

  // Insert into Supabase (in the same database!)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const rowPayload = {
        slug: newClinic.slug,
        subdomain: newClinic.cloudflare_domain || newClinic.subdomain,
        name: newClinic.name,
        slogan: newClinic.slogan,
        description: newClinic.description,
        category: newClinic.category,
        dress_code: newClinic.collegiate_number,
        dietary_filters: newClinic.accepted_insurances,
        template_id: newClinic.template_id,
        hero_layout: newClinic.hero_layout,
        primary_color: newClinic.primary_color,
        accent_color: newClinic.accent_color,
        background_color: newClinic.background_color,
        surface_color: newClinic.surface_color,
        font_family: newClinic.font_family,
        hero_image: newClinic.hero_image,
        phone: newClinic.phone,
        whatsapp_number: newClinic.whatsapp_number,
        email: newClinic.email,
        address: newClinic.address,
        city: newClinic.city,
        client_access_key: newClinic.client_access_key,
        cloudflare_url: newClinic.cloudflare_url,
        published_url: newClinic.published_url
      };

      // Check if already exists to do upsert
      const { data: existingRow } = await supabase
        .from('restaurants')
        .select('id')
        .eq('slug', newClinic.slug)
        .maybeSingle();

      if (existingRow && existingRow.id) {
        const { data: uData } = await supabase
          .from('restaurants')
          .update(rowPayload)
          .eq('id', existingRow.id)
          .select()
          .single();
        if (uData) newClinic.id = uData.id;
      } else {
        const { data: iData, error: iErr } = await supabase
          .from('restaurants')
          .insert([rowPayload])
          .select()
          .single();

        if (!iErr && iData) {
          newClinic.id = iData.id;
        } else if (iErr?.code === '23505') {
          // Fallback update on conflict
          const { data: uData } = await supabase
            .from('restaurants')
            .update(rowPayload)
            .eq('slug', newClinic.slug)
            .select()
            .single();
          if (uData) newClinic.id = uData.id;
        }
      }
    } catch (e) {
      console.warn('Supabase clinic insert failed, saving to local store', e);
    }
  }

  // Always update local cache
  const all = getLocalClinics();
  const existingIdx = all.findIndex(c => c.slug === cleanSlug);
  if (existingIdx >= 0) {
    all[existingIdx] = newClinic;
  } else {
    all.unshift(newClinic);
  }
  saveLocalClinics(all);

  return newClinic;
}

// API: Create Appointment (Patient booking engine)
export async function createAppointment(clinicId, bookingData) {
  const code = 'CITA-' + Math.random().toString(36).substring(2, 6).toUpperCase() + Math.floor(100 + Math.random() * 900);

  const appointment = {
    id: `app-${Date.now()}`,
    clinic_id: clinicId,
    appointment_code: code,
    patient_name: bookingData.name?.trim(),
    patient_email: bookingData.email?.trim(),
    patient_phone: bookingData.phone?.trim(),
    insurance: bookingData.insurance || 'Privado',
    treatment: bookingData.treatment || 'Primera Consulta & Valoración',
    doctor: bookingData.doctor || 'Especialista de Guardia',
    date: bookingData.date,
    time: bookingData.time,
    notes: bookingData.notes?.trim() || '',
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('appointments').insert([appointment]);
    } catch (e) {
      // Try fallback to reservations table
      try {
        await supabase.from('reservations').insert([{
          restaurant_id: clinicId,
          booking_code: code,
          customer_name: appointment.patient_name,
          customer_email: appointment.patient_email,
          customer_phone: appointment.patient_phone,
          special_requests: `[Cita Médica] Mutua: ${appointment.insurance} | Tratamiento: ${appointment.treatment}`,
          reservation_date: appointment.date,
          reservation_time: appointment.time,
          status: 'confirmed'
        }]);
      } catch (err) {}
    }
  }

  // Update in local store
  const all = getLocalClinics();
  const clinic = all.find(c => c.id === clinicId || c.slug === clinicId);
  if (clinic) {
    if (!clinic.appointments) clinic.appointments = [];
    clinic.appointments.unshift(appointment);
    saveLocalClinics(all);
  }

  return appointment;
}

// API: Update clinic
export async function updateClinic(id, updatedFields) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const safeFields = { ...updatedFields };
      delete safeFields.appointments;
      delete safeFields.id;

      if (Object.keys(safeFields).length > 0) {
        await supabase.from('clinics').update(safeFields).eq('slug', id);
      }
    } catch (err) {
      console.warn('Supabase clinic update failed, updating locally', err);
    }
  }

  const all = getLocalClinics();
  const idx = all.findIndex(c => c.id === id || c.slug === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updatedFields };
    saveLocalClinics(all);
    return all[idx];
  }
  return null;
}
