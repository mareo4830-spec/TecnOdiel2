import { createClient } from '@supabase/supabase-js';
import { INITIAL_RESTAURANTS } from './mockData';
import { provisionCloudflarePage } from './cloudflareService';

const STORAGE_KEY_RESTAURANTS = 'tecnodiel_restaurants_db';
const STORAGE_KEY_CONFIG = 'tecnodiel_supabase_config';

const DEFAULT_SUPABASE_URL = 'https://ifmtuucsonuzuxauolvt.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbXR1dWNzb251enV4YXVvbHZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3OTkxNjMsImV4cCI6MjEwNjM3NTE2M30.lGjIIBmW0kfi8QAf5SNynlRDKsX3g1hXgTzPOVflAyU';

// Retrieve saved Supabase credentials or default
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

// Initialize Supabase client if configured
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

// Local Storage Multi-Tenant Store (Offline-first & fallback)
function getLocalRestaurants() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_RESTAURANTS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading local restaurants', e);
  }
  // Initialize with rich defaults
  localStorage.setItem(STORAGE_KEY_RESTAURANTS, JSON.stringify(INITIAL_RESTAURANTS));
  return INITIAL_RESTAURANTS;
}

function saveLocalRestaurants(restaurants) {
  try {
    localStorage.setItem(STORAGE_KEY_RESTAURANTS, JSON.stringify(restaurants));
  } catch (e) {
    console.error('Error saving local restaurants', e);
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

// API: Get all restaurants
export async function fetchRestaurants() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, using local store', e);
    }
  }
  return getLocalRestaurants();
}

// API: Get single restaurant by slug or subdomain
export async function fetchRestaurantBySlug(slugOrSubdomain) {
  if (!slugOrSubdomain) return null;
  const clean = sanitizeSlug(slugOrSubdomain);
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrSubdomain);
  const supabase = getSupabaseClient();
  
  if (supabase) {
    try {
      let query = supabase.from('restaurants').select('*');
      if (isUUID) {
        query = query.eq('id', slugOrSubdomain);
      } else {
        query = query.or(`slug.eq.${clean},subdomain.eq.${clean}`);
      }
      const { data, error } = await query.maybeSingle();
      
      if (!error && data) {
        // Also fetch menu categories & items
        const { data: categories } = await supabase
          .from('menu_categories')
          .select('*, menu_items(*)')
          .eq('restaurant_id', data.id)
          .order('order_index');
        
        return {
          ...data,
          menu_categories: categories && categories.length > 0 ? categories : (data.menu_categories || [])
        };
      }
    } catch (e) {
      console.warn('Supabase fetch single failed, using local fallback', e);
    }
  }
  
  const all = getLocalRestaurants();
  const found = all.find(r => r.slug === clean || r.subdomain === clean || r.id === slugOrSubdomain);
  return found || null;
}

// API: Create new restaurant
export async function createRestaurant(restaurantData) {
  const cleanSlug = sanitizeSlug(restaurantData.slug || restaurantData.name || 'mi-restaurante');
  const randomKeyNum = Math.floor(100 + Math.random() * 900);
  const clientKey = restaurantData.client_access_key || `TO-${cleanSlug.toUpperCase().slice(0, 6)}-${randomKeyNum}`;

  const newRestaurant = {
    id: restaurantData.id || `rest-${Date.now()}`,
    slug: cleanSlug,
    subdomain: cleanSlug,
    client_access_key: clientKey,
    plan_name: restaurantData.plan_name || 'Plan Hostelería Pro',
    budget: parseFloat(restaurantData.budget) || 99.00,
    billing_plan: restaurantData.billing_plan || 'monthly',
    contract_status: restaurantData.contract_status || 'active',
    pending_tasks: restaurantData.pending_tasks || [
      { id: 'task-1', label: 'Fotografías profesionales de platos estrella', done: true },
      { id: 'task-2', label: 'Logotipo en alta resolución o vector transparente', done: true },
      { id: 'task-3', label: 'Carta completa de comidas, postres y alérgenos', done: true },
      { id: 'task-4', label: 'Vinculación de dominio propio (.es / .com)', done: false },
      { id: 'task-5', label: 'Verificación de reservas directas por WhatsApp', done: true },
      { id: 'task-6', label: 'Firma de contrato y orden de domiciliación bancaria', done: true }
    ],
    admin_notes: restaurantData.admin_notes || 'Web creada desde el configurador. Pendiente llamada de bienvenida.',
    name: restaurantData.name,
    slogan: restaurantData.slogan || '',
    description: restaurantData.description || '',
    category: restaurantData.category || 'night_bar',
    dress_code: restaurantData.dress_code || 'Smart Casual / Elegante',
    ambiance: restaurantData.ambiance || 'Elegante y exclusivo',
    template_id: restaurantData.template_id || 'nocturne',
    hero_layout: restaurantData.hero_layout || 'centered',
    texture: restaurantData.texture || 'spotlight',
    primary_color: restaurantData.primary_color || '#f59e0b',
    accent_color: restaurantData.accent_color || '#fbbf24',
    background_color: restaurantData.background_color || '#050507',
    surface_color: restaurantData.surface_color || '#0d0d12',
    font_family: restaurantData.font_family || 'Outfit',
    hero_image: restaurantData.hero_image || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80',
    phone: restaurantData.phone || '+34 959 10 20 30',
    whatsapp_number: restaurantData.whatsapp_number || '+34600112233',
    email: restaurantData.email || 'info@' + cleanSlug + '.es',
    address: restaurantData.address || 'Calle Principal, 1',
    city: restaurantData.city || 'Huelva',
    postal_code: restaurantData.postal_code || '21001',
    google_maps_url: restaurantData.google_maps_url || 'https://maps.google.com',
    instagram_url: restaurantData.instagram_url || 'https://instagram.com',
    lunch_shift: restaurantData.lunch_shift || { enabled: false, open: '13:30', close: '16:30' },
    dinner_shift: restaurantData.dinner_shift || { enabled: true, open: '19:30', close: '02:30' },
    closed_days: restaurantData.closed_days || ['Lunes'],
    dietary_filters: restaurantData.dietary_filters || ['Gluten Free', 'Vegano'],
    booking_rules: restaurantData.booking_rules || {
      max_guests_per_table: 8,
      slot_interval_minutes: 30,
      advance_notice: 'Mismo dia permitido',
      confirmation_mode: 'instant',
      available_areas: ['Salon Central', 'Terraza Climatizada', 'Barra VIP Cocteleria']
    },
    menu_categories: restaurantData.menu_categories || [
      {
        id: `cat-${Date.now()}-1`,
        name: 'Platos & Especialidades',
        items: [
          {
            id: `item-${Date.now()}-1`,
            name: 'Creación Exclusiva de Temporada',
            description: 'Elaboración con ingredientes selectos y presentación de autor.',
            price: 17.50,
            badge: 'Recomendado',
            allergens: []
          },
          {
            id: `item-${Date.now()}-2`,
            name: 'Bocado Gourmet Marinado',
            description: 'Textura sedosa, toques cítricos y reducción balsámica.',
            price: 14.00,
            badge: 'Firma',
            allergens: []
          }
        ]
      },
      {
        id: `cat-${Date.now()}-2`,
        name: 'Bebidas & Coctelería de Autor',
        items: [
          {
            id: `item-${Date.now()}-3`,
            name: 'Signature Cocktail TecnOdiel',
            description: 'Destilados infusionados artesanalmente con notas aromáticas botánicas.',
            price: 12.00,
            badge: 'Top Ventas',
            allergens: []
          }
        ]
      }
    ],
    reservations: [],
    created_at: new Date().toISOString()
  };

  // Automatically provision free Cloudflare Pages domain (100% free & commercial compliant)
  try {
    const cfInfo = await provisionCloudflarePage(cleanSlug, restaurantData.custom_domain, restaurantData);
    newRestaurant.cloudflare_domain = cfInfo.domain;
    newRestaurant.cloudflare_url = cfInfo.url;
    newRestaurant.published_url = cfInfo.url;
    newRestaurant.cloudflare_status = cfInfo.status;
    newRestaurant.subdomain = cfInfo.domain;
  } catch (err) {
    console.warn('Cloudflare Pages domain provisioning error:', err);
    newRestaurant.cloudflare_domain = `${cleanSlug}.pages.dev`;
    newRestaurant.cloudflare_url = `https://${cleanSlug}.pages.dev`;
    newRestaurant.published_url = `https://${cleanSlug}.pages.dev`;
    newRestaurant.cloudflare_status = 'ready';
    newRestaurant.subdomain = `${cleanSlug}.pages.dev`;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .insert([{
          slug: newRestaurant.slug,
          subdomain: newRestaurant.cloudflare_domain || newRestaurant.subdomain,
          name: newRestaurant.name,
          slogan: newRestaurant.slogan,
          description: newRestaurant.description,
          category: newRestaurant.category,
          ambiance: newRestaurant.ambiance,
          template_id: newRestaurant.template_id,
          primary_color: newRestaurant.primary_color,
          accent_color: newRestaurant.accent_color,
          background_color: newRestaurant.background_color,
          surface_color: newRestaurant.surface_color,
          font_family: newRestaurant.font_family,
          hero_image: newRestaurant.hero_image,
          phone: newRestaurant.phone,
          email: newRestaurant.email,
          address: newRestaurant.address,
          city: newRestaurant.city,
          booking_rules: newRestaurant.booking_rules,
          client_access_key: newRestaurant.client_access_key,
          plan_name: newRestaurant.plan_name,
          budget: newRestaurant.budget,
          billing_plan: newRestaurant.billing_plan,
          contract_status: newRestaurant.contract_status,
          pending_tasks: newRestaurant.pending_tasks,
          admin_notes: newRestaurant.admin_notes,
          seo_title: `${newRestaurant.name} | Web Oficial`,
          seo_description: `Dominio Cloudflare Pages: ${newRestaurant.cloudflare_url || 'https://' + newRestaurant.slug + '.pages.dev'}`
        }])
        .select()
        .single();

      if (!error && data) {
        newRestaurant.id = data.id;

        // Insert initial menu categories and items in Supabase
        if (newRestaurant.menu_categories && newRestaurant.menu_categories.length > 0) {
          for (let cIdx = 0; cIdx < newRestaurant.menu_categories.length; cIdx++) {
            const cat = newRestaurant.menu_categories[cIdx];
            const { data: catData } = await supabase
              .from('menu_categories')
              .insert([{
                restaurant_id: data.id,
                name: cat.name,
                order_index: cIdx
              }])
              .select()
              .single();

            if (catData && cat.items && cat.items.length > 0) {
              const itemsToInsert = cat.items.map((it, itIdx) => ({
                restaurant_id: data.id,
                category_id: catData.id,
                name: it.name,
                description: it.description || '',
                price: typeof it.price === 'number' ? it.price : parseFloat(it.price) || 0,
                badge: it.badge || null,
                allergens: it.allergens || [],
                is_available: true,
                order_index: itIdx
              }));

              await supabase.from('menu_items').insert(itemsToInsert);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Supabase insert failed, saving to local store', e);
    }
  }

  // Always update local cache
  const all = getLocalRestaurants();
  const existingIdx = all.findIndex(r => r.slug === cleanSlug);
  if (existingIdx >= 0) {
    all[existingIdx] = newRestaurant;
  } else {
    all.unshift(newRestaurant);
  }
  saveLocalRestaurants(all);

  return newRestaurant;
}

// API: Create reservation (Direct booking engine)
export async function createReservation(restaurantId, bookingData) {
  const code = 'RES-' + Math.random().toString(36).substring(2, 6).toUpperCase() + Math.floor(100 + Math.random() * 900);
  
  const reservation = {
    id: `res-${Date.now()}`,
    restaurant_id: restaurantId,
    booking_code: code,
    customer_name: bookingData.name?.trim(),
    customer_email: bookingData.email?.trim(),
    customer_phone: bookingData.phone?.trim(),
    guests_count: parseInt(bookingData.guests, 10) || 2,
    reservation_date: bookingData.date,
    reservation_time: bookingData.time,
    area: bookingData.area || 'Salón Principal',
    special_requests: bookingData.notes?.trim() || '',
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('reservations').insert([reservation]);
    } catch (e) {
      console.warn('Supabase reservation insert failed, saving locally', e);
    }
  }

  // Update in local store
  const all = getLocalRestaurants();
  const rest = all.find(r => r.id === restaurantId || r.slug === restaurantId);
  if (rest) {
    if (!rest.reservations) rest.reservations = [];
    rest.reservations.unshift(reservation);
    saveLocalRestaurants(all);
  }

  return reservation;
}

// API: Update restaurant (menu, colors, info) with Supabase sync
export async function updateRestaurant(id, updatedFields) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // Clean fields that belong to table
      const safeFields = { ...updatedFields };
      delete safeFields.menu_categories;
      delete safeFields.reservations;
      delete safeFields.id;

      if (Object.keys(safeFields).length > 0) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUUID) {
          await supabase.from('restaurants').update(safeFields).eq('id', id);
        } else {
          await supabase.from('restaurants').update(safeFields).eq('slug', id);
        }
      }
    } catch (err) {
      console.warn('Supabase restaurant update failed, updating locally', err);
    }
  }

  const all = getLocalRestaurants();
  const idx = all.findIndex(r => r.id === id || r.slug === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updatedFields };
    saveLocalRestaurants(all);
    return all[idx];
  }
  return null;
}

// API: Fetch restaurant menu categories and items from Supabase
export async function fetchRestaurantMenu(restaurantId) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*, menu_items(*)')
        .eq('restaurant_id', restaurantId)
        .order('order_index');

      if (!error && data && data.length > 0) {
        return data.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description,
          order_index: cat.order_index,
          items: (cat.menu_items || []).map(it => ({
            id: it.id,
            category_id: it.category_id,
            name: it.name,
            description: it.description,
            price: typeof it.price === 'number' ? it.price : parseFloat(it.price) || 0,
            badge: it.badge,
            image_url: it.image_url,
            allergens: it.allergens || [],
            is_available: it.is_available !== false,
            is_featured: !!it.is_featured,
            order_index: it.order_index
          }))
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch menu failed, using local store', e);
    }
  }

  // Fallback to local restaurant menu_categories
  const all = getLocalRestaurants();
  const rest = all.find(r => r.id === restaurantId || r.slug === restaurantId);
  return rest?.menu_categories || [];
}

// API: Save or Edit Menu Item in Supabase & Local Cache
export async function saveMenuItemInDb(restaurantId, categoryId, itemData) {
  const supabase = getSupabaseClient();
  let savedItem = { ...itemData };

  if (supabase) {
    try {
      const payload = {
        name: itemData.name.trim(),
        description: itemData.description?.trim() || '',
        price: typeof itemData.price === 'number' ? itemData.price : parseFloat(itemData.price) || 0,
        badge: itemData.badge?.trim() || null,
        allergens: itemData.allergens || [],
        image_url: itemData.image_url || null,
        is_available: itemData.is_available !== false,
        is_featured: !!itemData.is_featured
      };

      // Check if itemId is valid UUID or existing
      const isUuid = itemData.id && itemData.id.length > 20 && !itemData.id.startsWith('item-');
      if (isUuid) {
        const { data, error } = await supabase
          .from('menu_items')
          .update(payload)
          .eq('id', itemData.id)
          .select()
          .single();
        if (!error && data) savedItem = { ...savedItem, ...data };
      } else {
        // If categoryId is UUID, insert with category
        const isCatUuid = categoryId && categoryId.length > 20 && !categoryId.startsWith('cat-');
        const insertPayload = {
          ...payload,
          restaurant_id: restaurantId,
          ...(isCatUuid ? { category_id: categoryId } : {})
        };
        const { data, error } = await supabase
          .from('menu_items')
          .insert([insertPayload])
          .select()
          .single();
        if (!error && data) savedItem = { ...savedItem, ...data };
      }
    } catch (e) {
      console.warn('Supabase item save failed, updating locally', e);
    }
  }

  // Ensure local ID exists
  if (!savedItem.id) savedItem.id = `item-${Date.now()}`;

  // Sync to local store
  const all = getLocalRestaurants();
  const rest = all.find(r => r.id === restaurantId || r.slug === restaurantId);
  if (rest && rest.menu_categories) {
    const cat = rest.menu_categories.find(c => c.id === categoryId);
    if (cat) {
      if (!cat.items) cat.items = [];
      const itemIdx = cat.items.findIndex(it => it.id === savedItem.id || it.name === savedItem.name);
      if (itemIdx >= 0) {
        cat.items[itemIdx] = { ...cat.items[itemIdx], ...savedItem };
      } else {
        cat.items.push(savedItem);
      }
      saveLocalRestaurants(all);
    }
  }

  return savedItem;
}

// API: Delete Menu Item from Supabase & Local Cache
export async function deleteMenuItemFromDb(restaurantId, categoryId, itemId) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const isUuid = itemId && itemId.length > 20 && !itemId.startsWith('item-');
      if (isUuid) {
        await supabase.from('menu_items').delete().eq('id', itemId);
      }
    } catch (e) {
      console.warn('Supabase delete item failed', e);
    }
  }

  const all = getLocalRestaurants();
  const rest = all.find(r => r.id === restaurantId || r.slug === restaurantId);
  if (rest && rest.menu_categories) {
    const cat = rest.menu_categories.find(c => c.id === categoryId);
    if (cat && cat.items) {
      cat.items = cat.items.filter(it => it.id !== itemId);
      saveLocalRestaurants(all);
    }
  }
}

// API: Toggle Menu Item Availability (In stock / Sold out)
export async function toggleMenuItemAvailabilityInDb(restaurantId, categoryId, itemId, isAvailable) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const isUuid = itemId && itemId.length > 20 && !itemId.startsWith('item-');
      if (isUuid) {
        await supabase
          .from('menu_items')
          .update({ is_available: isAvailable })
          .eq('id', itemId);
      }
    } catch (e) {
      console.warn('Supabase toggle availability failed', e);
    }
  }

  const all = getLocalRestaurants();
  const rest = all.find(r => r.id === restaurantId || r.slug === restaurantId);
  if (rest && rest.menu_categories) {
    const cat = rest.menu_categories.find(c => c.id === categoryId);
    if (cat && cat.items) {
      const it = cat.items.find(i => i.id === itemId);
      if (it) it.is_available = isAvailable;
      saveLocalRestaurants(all);
    }
  }
}

// API: Create or update Menu Category
export async function saveMenuCategoryInDb(restaurantId, categoryName) {
  const supabase = getSupabaseClient();
  let newCat = {
    id: `cat-${Date.now()}`,
    name: categoryName.trim(),
    items: []
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert([{
          restaurant_id: restaurantId,
          name: categoryName.trim()
        }])
        .select()
        .single();
      if (!error && data) {
        newCat = {
          id: data.id,
          name: data.name,
          items: []
        };
      }
    } catch (e) {
      console.warn('Supabase category insert failed', e);
    }
  }

  const all = getLocalRestaurants();
  const rest = all.find(r => r.id === restaurantId || r.slug === restaurantId);
  if (rest) {
    if (!rest.menu_categories) rest.menu_categories = [];
    rest.menu_categories.push(newCat);
    saveLocalRestaurants(all);
  }

  return newCat;
}

// API: Delete Menu Category
export async function deleteMenuCategoryFromDb(restaurantId, categoryId) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const isUuid = categoryId && categoryId.length > 20 && !categoryId.startsWith('cat-');
      if (isUuid) {
        await supabase.from('menu_items').delete().eq('category_id', categoryId);
        await supabase.from('menu_categories').delete().eq('id', categoryId);
      }
    } catch (e) {
      console.warn('Supabase delete category failed', e);
    }
  }

  const all = getLocalRestaurants();
  const rest = all.find(r => r.id === restaurantId || r.slug === restaurantId);
  if (rest && rest.menu_categories) {
    rest.menu_categories = rest.menu_categories.filter(c => c.id !== categoryId);
    saveLocalRestaurants(all);
  }
}

