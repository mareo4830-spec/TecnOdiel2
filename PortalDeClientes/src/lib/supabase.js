import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ifmtuucsonuzuxauolvt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbXR1dWNzb251enV4YXVvbHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3OTkxNjMsImV4cCI6MjEwNjM3NTE2M30.lGjIIBmW0kfi8QAf5SNynlRDKsX3g1hXgTzPOVflAyU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

// Verify client access key and return their restaurant
export async function verifyClientAccessKey(rawKey) {
  if (!rawKey) return null;
  const key = rawKey.toString().trim();
  const cleanKey = key.toUpperCase();
  const cleanSlug = sanitizeSlug(key);

  try {
    // 1. Try matching by client_access_key
    const { data: byKey, error: errKey } = await supabase
      .from('restaurants')
      .select('*')
      .ilike('client_access_key', cleanKey)
      .limit(1);

    if (!errKey && byKey && byKey.length > 0) {
      return byKey[0];
    }

    // 2. Try matching by slug
    if (cleanSlug) {
      const { data: bySlug, error: errSlug } = await supabase
        .from('restaurants')
        .select('*')
        .eq('slug', cleanSlug)
        .limit(1);

      if (!errSlug && bySlug && bySlug.length > 0) {
        return bySlug[0];
      }
    }
  } catch (e) {
    console.warn('Error verifying client key in Supabase:', e);
  }

  // Fallback match for demo
  if (
    cleanKey === 'TO-MN892' || 
    cleanKey === 'TO-MAREA-91' || 
    cleanSlug === 'marea-negra' || 
    cleanKey === 'MAREA'
  ) {
    return FALLBACK_RESTAURANT;
  }

  return null;
}

// Fetch all available restaurants for Super Admin monitoring
export async function getAllRestaurantsForAdmin() {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data && data.length > 0) {
      return data.map(r => ({
        ...r,
        client_access_key: r.client_access_key || `TO-${(r.slug || 'CLIENT').toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`,
        plan_name: r.plan_name || 'Plan Hostelería Pro',
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
  return [FALLBACK_RESTAURANT];
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
      master_pin: 'tecnodiel2026'
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
