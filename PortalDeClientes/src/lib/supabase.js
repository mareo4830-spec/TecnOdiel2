import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ifmtuucsonuzuxauolvt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbXR1dWNzb251enV4YXVvbHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3OTkxNjMsImV4cCI6MjEwNjM3NTE2M30.lGjIIBmW0kfi8QAf5SNynlRDKsX3g1hXgTzPOVflAyU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Demo Fallback Restaurant when offline or initial setup
export const FALLBACK_RESTAURANT = {
  id: 'demo-rest-01',
  slug: 'marea-negra',
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

// Fetch all available restaurants for client switcher / login
export async function getClientRestaurantsList() {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('id, name, slug, subdomain, category, template_id, cloudflare_url, published_url')
      .order('name');
    
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Supabase fetch failed:', e);
  }
  return [FALLBACK_RESTAURANT];
}

// Fetch full restaurant by slug with categories, items, and reservations
export async function getClientRestaurantDetails(slugOrId) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .single();

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
