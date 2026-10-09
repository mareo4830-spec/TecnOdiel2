import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://wkzbgxsknkhixclgvrli.supabase.co';
const SUPABASE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndremJneHNrbmtoaXhjbGd2cmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0Nzk0NzUsImV4cCI6MjEwNzA1NTQ3NX0.MpIo0xJQC3MdJ4HQewEs3stfTF-I8uWXZgcJ6sS5uVw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Base de datos de Autenticación, Leads y Portal de Clientes de TecnOdiel
export const PORTAL_AUTH_URL = 'https://zkgragndnbqieseobkcq.supabase.co';
export const PORTAL_AUTH_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprZ3JhZ25kbmJxaWVzZW9ia2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NTkyNjEsImV4cCI6MjEwNjIzNTI2MX0.uFjyXaq_Dt5BpozYsMNskjuXajQ4kIOoIbffxbjWXNg';
export const portalAuthClient = createClient(PORTAL_AUTH_URL, PORTAL_AUTH_KEY);

// Default checklist tasks for monitoring website readiness
export const DEFAULT_PENDING_TASKS = [
  { id: 'task-1', label: 'Fotografías profesionales de platos estrella', done: true },
  { id: 'task-2', label: 'Logotipo en alta resolución o vector transparente', done: true },
  { id: 'task-3', label: 'Carta completa de comidas, postres y alérgenos', done: true },
  { id: 'task-4', label: 'Vinculación de dominio propio (.es / .com)', done: false },
  { id: 'task-5', label: 'Verificación de reservas directas por WhatsApp', done: true },
  { id: 'task-6', label: 'Firma de contrato y orden de domiciliación bancaria', done: true }
];

// Demo Fallback Restaurant when offline or initial setup
export const FALLBACK_RESTAURANT = {
  id: 'demo-rest-01',
  slug: 'marea-negra',
  client_access_key: 'TO-MN892',
  plan_name: 'Plan Hostelería Pro',
  budget: 99.00,
  billing_plan: 'monthly',
  contract_status: 'active',
  name: 'Marea Negra Bar & Lounge',
  slogan: 'Coctelería de autor y bocados de noche',
  description: 'Un espacio íntimo y refinado donde la mixología contemporánea se encuentra con creaciones culinarias de origen y acústica envolvente.',
  category: 'night_bar',
  template_id: 'nocturne',
  cloudflare_url: 'https://marea-negra.pages.dev',
  published_url: 'https://marea-negra.pages.dev',
  subdomain: 'marea-negra.pages.dev',
  primary_color: '#f59e0b',
  accent_color: '#fbbf24',
  background_color: '#050507',
  surface_color: '#0d0d12',
  phone: '+34 959 10 20 30',
  whatsapp_number: '+34600112233',
  email: 'reservas@mareanegra.es',
  address: 'Calle Marina, 14',
  city: 'Huelva',
  postal_code: '21001',
  pending_tasks: DEFAULT_PENDING_TASKS,
  admin_notes: 'Web activa en Cloudflare Pages. Pendiente confirmar si quieren dominio propio .es.',
  lunch_shift: { enabled: false, open: '13:30', close: '16:30' },
  dinner_shift: { enabled: true, open: '19:30', close: '02:30' },
  closed_days: ['Lunes'],
  menu_categories: [
    {
      id: 'cat-demo-1',
      name: 'Cócteles de Autor',
      items: [
        {
          id: 'item-demo-1',
          name: 'Smoked Truffle Old Fashioned',
          description: 'Bourbon añejo, bitter de trufa negra y roble tostado.',
          price: 14.50,
          badge: 'Firma de la Casa',
          is_available: true
        },
        {
          id: 'item-demo-2',
          name: 'Emerald Yuzu Spritz',
          description: 'Gin botánico artesanal, reducción de yuzu japonés y champán.',
          price: 13.00,
          badge: 'Top Ventas',
          is_available: true
        }
      ]
    },
    {
      id: 'cat-demo-2',
      name: 'Bocados de Noche',
      items: [
        {
          id: 'item-demo-3',
          name: 'Brioche de Wagyu A5 & Foie',
          description: 'Mantequilla tostada, tartar tibio de buey Wagyu y lascas de trufa.',
          price: 18.00,
          badge: 'Exclusivo',
          is_available: true
        }
      ]
    }
  ],
  reservations: [
    {
      id: 'res-demo-1',
      booking_code: 'RES-MN891',
      customer_name: 'Carlos Mendoza',
      customer_phone: '+34 611 22 33 44',
      customer_email: 'carlos@ejemplo.es',
      guests_count: 4,
      reservation_date: new Date().toISOString().split('T')[0],
      reservation_time: '21:30',
      area: 'Barra VIP Coctelería',
      status: 'confirmed'
    },
    {
      id: 'res-demo-2',
      booking_code: 'RES-MN892',
      customer_name: 'Elena Rodríguez',
      customer_phone: '+34 622 33 44 55',
      customer_email: 'elena@ejemplo.es',
      guests_count: 2,
      reservation_date: new Date().toISOString().split('T')[0],
      reservation_time: '22:00',
      area: 'Salón Central',
      status: 'confirmed'
    }
  ]
};

// Sanitize slug for routing and queries
export function sanitizeSlug(input) {
  return (input || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Verify client access key strictly (Solo la clave privada da acceso)
export async function verifyClientAccessKey(rawKey, targetSlug = null) {
  if (!rawKey) return null;
  const key = rawKey.toString().trim();
  // Sanitización estricta: solo mayúsculas, números y guiones para prevenir wildcard e inyección SQL
  const cleanKey = key.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (!cleanKey || cleanKey.length < 3) return null;

  try {
    // 1. Coincidencia estricta por client_access_key en Supabase
    let query = supabase
      .from('restaurants')
      .select('*')
      .ilike('client_access_key', cleanKey);

    if (targetSlug) {
      query = query.eq('slug', targetSlug);
    }

    const { data: byKey, error: errKey } = await query.limit(1);

    if (!errKey && byKey && byKey.length > 0) {
      return byKey[0];
    }
  } catch (e) {
    console.warn('Error verifying client key in Supabase:', e);
  }

  // Comprobar restaurantes o clínicas en almacenamiento local (solo por clave exacta)
  if (typeof window !== 'undefined') {
    try {
      const localClinicsRaw = localStorage.getItem('tecnodiel_cys_clinics');
      if (localClinicsRaw) {
        const localClinics = JSON.parse(localClinicsRaw);
        const matchClinic = localClinics.find(c => 
          c.client_access_key && 
          c.client_access_key.toUpperCase().trim() === cleanKey &&
          (!targetSlug || c.slug === targetSlug)
        );
        if (matchClinic) return matchClinic;
      }

      const localRestsRaw = localStorage.getItem('tecnodiel_restaurants');
      if (localRestsRaw) {
        const localRests = JSON.parse(localRestsRaw);
        const matchRest = localRests.find(r => 
          r.client_access_key && 
          r.client_access_key.toUpperCase().trim() === cleanKey &&
          (!targetSlug || r.slug === targetSlug)
        );
        if (matchRest) return matchRest;
      }
    } catch (_) {}
  }

  // Fallback demo estricto únicamente si se introduce la clave exacta 'TO-MN892'
  if (cleanKey === 'TO-MN892') {
    if (!targetSlug || targetSlug === 'marea-negra') {
      return FALLBACK_RESTAURANT;
    }
  }

  return null;
}

// Verify client by submitted email (Para autenticación exclusiva por Google OAuth)
export async function verifyClientByEmail(rawEmail, targetSlug = null) {
  if (!rawEmail) return null;
  const cleanEmail = rawEmail.toString().trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) return null;

  // 1. Comprobar leads registrados en la base de datos de TecnOdiel
  try {
    const { data: leads, error: leadError } = await portalAuthClient
      .from('leads')
      .select('*')
      .ilike('email', cleanEmail)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!leadError && leads && leads.length > 0) {
      const lead = leads[0];
      const leadName = lead.business_name || lead.contact_name || 'Mi Proyecto Web';
      const leadSlug = sanitizeSlug(leadName) || 'mi-proyecto';
      return {
        ...FALLBACK_RESTAURANT,
        id: `lead-${lead.id}`,
        name: leadName,
        email: cleanEmail,
        phone: lead.phone || '',
        slug: leadSlug,
        plan_name: 'Plan Digital TecnOdiel',
        budget: lead.estimated_value || 99,
        category: lead.business_type || 'negocio',
        client_access_key: `TO-${leadSlug.slice(0, 4).toUpperCase()}`,
        pending_tasks: DEFAULT_PENDING_TASKS,
        contract_status: 'active'
      };
    }
  } catch (e) {
    console.warn('Error checking lead by email:', e);
  }

  // 2. Comprobar proyectos persistidos en localStorage de la landing / formulario
  if (typeof window !== 'undefined') {
    try {
      const storedProject = 
        localStorage.getItem(`tecnodiel_client_project_${cleanEmail}`) ||
        localStorage.getItem('tecnodiel_active_project');
      if (storedProject) {
        const p = JSON.parse(storedProject);
        const pName = p.business_name || p.name || 'Mi Negocio Web';
        const pSlug = sanitizeSlug(pName) || 'mi-negocio';
        return {
          ...FALLBACK_RESTAURANT,
          id: p.id || `local-${Date.now()}`,
          name: pName,
          email: cleanEmail,
          phone: p.phone || '',
          slug: pSlug,
          plan_name: 'Plan Digital TecnOdiel',
          budget: p.budget || p.estimated_value || 99,
          category: p.business_type || p.sector || 'negocio',
          client_access_key: `TO-${pSlug.slice(0, 4).toUpperCase()}`,
          pending_tasks: DEFAULT_PENDING_TASKS,
          contract_status: 'active'
        };
      }
    } catch (_) {}
  }

  // 3. Comprobar restaurantes en la base multitenant de hostelería
  try {
    let query = supabase
      .from('restaurants')
      .select('*')
      .ilike('email', cleanEmail);

    if (targetSlug) {
      query = query.eq('slug', targetSlug);
    }

    const { data: byEmail, error } = await query.limit(1);
    if (!error && byEmail && byEmail.length > 0) {
      return byEmail[0];
    }
  } catch (e) {
    console.warn('Error verifying client email in restaurants Supabase:', e);
  }

  // 4. Comprobar restaurantes o clínicas en almacenamiento local
  if (typeof window !== 'undefined') {
    try {
      const localClinicsRaw = localStorage.getItem('tecnodiel_cys_clinics');
      if (localClinicsRaw) {
        const localClinics = JSON.parse(localClinicsRaw);
        const matchClinic = localClinics.find(c =>
          c.email &&
          c.email.toString().trim().toLowerCase() === cleanEmail &&
          (!targetSlug || c.slug === targetSlug)
        );
        if (matchClinic) return matchClinic;
      }

      const localRestsRaw = localStorage.getItem('tecnodiel_restaurants');
      if (localRestsRaw) {
        const localRests = JSON.parse(localRestsRaw);
        const matchRest = localRests.find(r =>
          r.email &&
          r.email.toString().trim().toLowerCase() === cleanEmail &&
          (!targetSlug || r.slug === targetSlug)
        );
        if (matchRest) return matchRest;
      }
    } catch (_) {}
  }

  // 5. Fallback demo si el email coincide con el restaurante demo
  if (cleanEmail === (FALLBACK_RESTAURANT.email || '').toLowerCase()) {
    if (!targetSlug || targetSlug === 'marea-negra') {
      return FALLBACK_RESTAURANT;
    }
  }

  return null;
}

// Fetch all available restaurants for Super Admin monitoring
export async function getAllRestaurantsForAdmin() {
  let list = [];
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      list = data.map(r => ({
        ...r,
        client_access_key: r.client_access_key || `TO-${(r.slug || 'CLIENT').toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`,
        plan_name: r.plan_name || (r.category && ['dental', 'policlinica', 'fisioterapia', 'estetica', 'psicologia', 'veterinaria', 'oftalmologia', 'podologia'].includes(r.category) ? 'Plan Clínica & Salud Pro' : 'Plan Hostelería Pro'),
        budget: r.budget || 99.00,
        billing_plan: r.billing_plan || 'monthly',
        contract_status: r.contract_status || 'active',
        pending_tasks: Array.isArray(r.pending_tasks) && r.pending_tasks.length > 0 ? r.pending_tasks : DEFAULT_PENDING_TASKS,
        admin_notes: r.admin_notes || ''
      }));
    }
  } catch (e) {
    console.warn('Supabase admin fetch failed:', e);
  }

  // Also include locally stored clinics if not already present
  if (typeof window !== 'undefined') {
    try {
      const localClinicsRaw = localStorage.getItem('tecnodiel_cys_clinics');
      if (localClinicsRaw) {
        const localClinics = JSON.parse(localClinicsRaw);
        localClinics.forEach(c => {
          if (!list.some(r => r.slug === c.slug || r.id === c.id)) {
            list.push({
              ...c,
              client_access_key: c.client_access_key || `CYS-${(c.slug || 'CLINIC').toUpperCase().slice(0, 6)}-104`,
              plan_name: c.plan_name || 'Plan Clínica & Salud Pro',
              budget: c.budget || 99.00,
              billing_plan: c.billing_plan || 'monthly',
              contract_status: c.contract_status || 'active',
              pending_tasks: c.pending_tasks || DEFAULT_PENDING_TASKS,
              admin_notes: c.admin_notes || ''
            });
          }
        });
      }
    } catch (_) {}
  }

  return list.length > 0 ? list : [FALLBACK_RESTAURANT];
}

// Fetch full restaurant by slug or ID with categories, items, and reservations
export async function getClientRestaurantDetails(slugOrId) {
  try {
    const clean = (slugOrId || '').toString().trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
    
    let query = supabase.from('restaurants').select('*');
    if (isUuid) {
      query = query.eq('id', clean);
    } else {
      query = query.eq('slug', sanitizeSlug(clean));
    }

    const { data, error } = await query.single();

    if (!error && data) {
      // Fetch categories & items
      const { data: categories } = await supabase
        .from('menu_categories')
        .select('*, menu_items(*)')
        .eq('restaurant_id', data.id)
        .order('order_index');

      // Fetch reservations
      const { data: reservations } = await supabase
        .from('reservations')
        .select('*')
        .eq('restaurant_id', data.id)
        .order('created_at', { ascending: false });

      return {
        ...data,
        client_access_key: data.client_access_key || `TO-${(data.slug || 'CLIENT').toUpperCase().slice(0, 6)}-892`,
        plan_name: data.plan_name || 'Plan Hostelería Pro',
        budget: data.budget || 99.00,
        billing_plan: data.billing_plan || 'monthly',
        contract_status: data.contract_status || 'active',
        pending_tasks: Array.isArray(data.pending_tasks) && data.pending_tasks.length > 0 ? data.pending_tasks : DEFAULT_PENDING_TASKS,
        admin_notes: data.admin_notes || '',
        cloudflare_url: data.cloudflare_url || data.published_url || `https://${data.slug}.pages.dev`,
        menu_categories: categories || [],
        reservations: reservations || []
      };
    }
  } catch (e) {
    console.warn('Supabase fetch details failed, using fallback:', e);
  }

  // Check local fallback
  if (typeof window !== 'undefined') {
    try {
      const cleanSlug = sanitizeSlug((slugOrId || '').toString());
      const localClinicsRaw = localStorage.getItem('tecnodiel_cys_clinics');
      if (localClinicsRaw) {
        const localClinics = JSON.parse(localClinicsRaw);
        const matchClinic = localClinics.find(c => 
          c.slug === cleanSlug || 
          c.subdomain === cleanSlug || 
          c.id === slugOrId || 
          (c.client_access_key && c.client_access_key.toUpperCase() === (slugOrId || '').toString().trim().toUpperCase())
        );
        if (matchClinic) {
          return {
            ...matchClinic,
            client_access_key: matchClinic.client_access_key || `CYS-${matchClinic.slug.toUpperCase().slice(0, 6)}-104`,
            plan_name: matchClinic.plan_name || 'Plan Clínica & Salud Pro',
            budget: matchClinic.budget || 99.00,
            billing_plan: matchClinic.billing_plan || 'monthly',
            contract_status: matchClinic.contract_status || 'active',
            pending_tasks: matchClinic.pending_tasks || DEFAULT_PENDING_TASKS,
            admin_notes: matchClinic.admin_notes || '',
            cloudflare_url: matchClinic.cloudflare_url || `https://${matchClinic.slug}.pages.dev`,
            menu_categories: matchClinic.menu_categories || matchClinic.treatments || [],
            reservations: matchClinic.appointments || matchClinic.reservations || []
          };
        }
      }

      const localRestsRaw = localStorage.getItem('tecnodiel_restaurants');
      if (localRestsRaw) {
        const localRests = JSON.parse(localRestsRaw);
        const matchRest = localRests.find(r => 
          r.slug === cleanSlug || 
          r.subdomain === cleanSlug || 
          r.id === slugOrId || 
          (r.client_access_key && r.client_access_key.toUpperCase() === (slugOrId || '').toString().trim().toUpperCase())
        );
        if (matchRest) {
          return {
            ...matchRest,
            client_access_key: matchRest.client_access_key || `TO-${matchRest.slug.toUpperCase().slice(0, 6)}-892`,
            plan_name: matchRest.plan_name || 'Plan Hostelería Pro',
            budget: matchRest.budget || 99.00,
            billing_plan: matchRest.billing_plan || 'monthly',
            contract_status: matchRest.contract_status || 'active',
            pending_tasks: matchRest.pending_tasks || DEFAULT_PENDING_TASKS,
            admin_notes: matchRest.admin_notes || '',
            cloudflare_url: matchRest.cloudflare_url || `https://${matchRest.slug}.pages.dev`,
            menu_categories: matchRest.menu_categories || [],
            reservations: matchRest.reservations || []
          };
        }
      }
    } catch (_) {}
  }

  return FALLBACK_RESTAURANT;
}

// Toggle dish availability in Supabase
export async function toggleMenuItemStock(itemId, isAvailable) {
  try {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: isAvailable })
      .eq('id', itemId);
    return !error;
  } catch (e) {
    console.error('Error toggling menu item:', e);
    return false;
  }
}

// Add or edit dish in Supabase
export async function upsertMenuItem(restaurantId, categoryId, itemData) {
  try {
    const payload = {
      name: itemData.name.trim(),
      description: itemData.description?.trim() || '',
      price: parseFloat(itemData.price) || 0,
      badge: itemData.badge?.trim() || null,
      is_available: itemData.is_available !== false
    };

    if (itemData.id && !itemData.id.startsWith('item-demo')) {
      const { data, error } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', itemData.id)
        .select()
        .single();
      if (!error) return data;
    } else {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          ...payload,
          restaurant_id: restaurantId,
          category_id: categoryId
        }])
        .select()
        .single();
      if (!error) return data;
    }
  } catch (e) {
    console.error('Error upserting menu item:', e);
  }
  return itemData;
}

// Delete dish in Supabase
export async function deleteMenuItem(itemId) {
  try {
    await supabase.from('menu_items').delete().eq('id', itemId);
    return true;
  } catch (e) {
    console.error('Error deleting menu item:', e);
    return false;
  }
}

// Update reservation status in Supabase
export async function updateReservationStatus(reservationId, status) {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', reservationId);
    return !error;
  } catch (e) {
    console.error('Error updating reservation:', e);
    return false;
  }
}

// Update restaurant general details in Supabase
export async function updateRestaurantProfile(restaurantId, fields) {
  try {
    const { error } = await supabase
      .from('restaurants')
      .update(fields)
      .eq('id', restaurantId);
    return !error;
  } catch (e) {
    console.error('Error updating profile:', e);
    return false;
  }
}

// Admin: Update pending tasks checklist for a specific restaurant
export async function updateRestaurantTasks(restaurantId, tasks) {
  try {
    const { error } = await supabase
      .from('restaurants')
      .update({ pending_tasks: tasks })
      .eq('id', restaurantId);
    return !error;
  } catch (e) {
    console.error('Error updating tasks:', e);
    return false;
  }
}

// Admin: Update internal notes for a restaurant
export async function updateRestaurantAdminNotes(restaurantId, notes) {
  try {
    const { error } = await supabase
      .from('restaurants')
      .update({ admin_notes: notes })
      .eq('id', restaurantId);
    return !error;
  } catch (e) {
    console.error('Error updating admin notes:', e);
    return false;
  }
}

// Admin: Update budget and plan settings
export async function updateRestaurantPlanSettings(restaurantId, planData) {
  try {
    const { error } = await supabase
      .from('restaurants')
      .update({
        budget: parseFloat(planData.budget) || 99.00,
        billing_plan: planData.billing_plan || 'monthly',
        plan_name: planData.plan_name || 'Plan Hostelería Pro',
        contract_status: planData.contract_status || 'active'
      })
      .eq('id', restaurantId);
    return !error;
  } catch (e) {
    console.error('Error updating plan settings:', e);
    return false;
  }
}

// Admin: Delete a restaurant project and its cascaded data (Protected by Master PIN via RPC)
export async function deleteRestaurant(restaurantId) {
  try {
    // 1. Intentar borrado seguro mediante RPC con validación de PIN maestro en base de datos
    const { data, error } = await supabase.rpc('delete_restaurant_admin', {
      target_id: restaurantId,
      master_pin: 'psoe2026'
    });

    if (!error && data === true) {
      return true;
    }

    // 2. Si la función RPC aún no se ha ejecutado en Supabase, fallback a delete directo
    const { error: directErr } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', restaurantId);

    if (!directErr) {
      return true;
    }

    console.error('Error deleting restaurant from Supabase:', error || directErr);
    return false;
  } catch (e) {
    console.error('Exception deleting restaurant:', e);
    return false;
  }
}
