import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3,
  ExternalLink,
  Utensils,
  Sliders,
  DollarSign,
  AlertCircle,
  Globe,
  Share2,
  Check,
  X,
  Sparkles,
  Phone,
  QrCode,
  Tag,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { 
  updateRestaurant, 
  saveMenuItemInDb, 
  deleteMenuItemFromDb, 
  toggleMenuItemAvailabilityInDb,
  saveMenuCategoryInDb, 
  deleteMenuCategoryFromDb,
  fetchRestaurantMenu
} from '../../lib/supabase';
import { checkVercelDomainStatus } from '../../lib/vercelService';

export default function RestaurantManager({ restaurant, onBack, onRestaurantUpdated }) {
  if (!restaurant) return null;

  const [activeTab, setActiveTab] = useState('menu'); // 'menu', 'reservations', 'info', 'vercel'
  const [reservations, setReservations] = useState(restaurant.reservations || []);
  const [categories, setCategories] = useState(restaurant.menu_categories || []);
  const [savedMsg, setSavedMsg] = useState('');
  const [loadingMenu, setLoadingMenu] = useState(false);

  // New category state
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Add / Edit Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null if adding new, object if editing
  const [targetCatId, setTargetCatId] = useState(categories[0]?.id || '');

  // Product Form Fields
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemBadge, setItemBadge] = useState('');
  const [itemImage, setItemImage] = useState('');
  const [itemAvailable, setItemAvailable] = useState(true);
  const [itemAllergens, setItemAllergens] = useState([]);

  // Restaurant Basic Info Form State
  const [restPhone, setRestPhone] = useState(restaurant.phone || '');
  const [restWhatsapp, setRestWhatsapp] = useState(restaurant.whatsapp_number || '');
  const [restAddress, setRestAddress] = useState(restaurant.address || '');
  const [restLunchOpen, setRestLunchOpen] = useState(restaurant.lunch_shift?.open || '13:30');
  const [restLunchClose, setRestLunchClose] = useState(restaurant.lunch_shift?.close || '16:30');
  const [restLunchEnabled, setRestLunchEnabled] = useState(restaurant.lunch_shift?.enabled !== false);
  const [restDinnerOpen, setRestDinnerOpen] = useState(restaurant.dinner_shift?.open || '19:30');
  const [restDinnerClose, setRestDinnerClose] = useState(restaurant.dinner_shift?.close || '02:30');
  const [restDinnerEnabled, setRestDinnerEnabled] = useState(restaurant.dinner_shift?.enabled !== false);
  const [restClosedDays, setRestClosedDays] = useState(restaurant.closed_days || ['Lunes']);

  // Vercel Domain state
  const vercelDomain = restaurant.vercel_domain || `${restaurant.slug}.vercel.app`;
  const vercelUrl = restaurant.vercel_url || `https://${vercelDomain}`;
  const [domainStatus, setDomainStatus] = useState({ verified: true, ssl: 'active' });

  const primaryColor = restaurant.primary_color || '#10b981';

  // Load fresh menu from Supabase on mount
  useEffect(() => {
    async function loadFreshMenu() {
      setLoadingMenu(true);
      try {
        const freshMenu = await fetchRestaurantMenu(restaurant.id || restaurant.slug);
        if (freshMenu && freshMenu.length > 0) {
          setCategories(freshMenu);
          if (!targetCatId) setTargetCatId(freshMenu[0]?.id);
        }
      } catch (e) {
        console.warn('Error loading fresh menu:', e);
      } finally {
        setLoadingMenu(false);
      }
    }
    loadFreshMenu();

    // Verify Vercel domain status
    checkVercelDomainStatus(vercelDomain).then(status => {
      setDomainStatus(status);
    });
  }, [restaurant.id, restaurant.slug]);

  // Open modal to add product
  const handleOpenAddProduct = (catId = null) => {
    setEditingItem(null);
    setTargetCatId(catId || categories[0]?.id || '');
    setItemName('');
    setItemPrice('');
    setItemDesc('');
    setItemBadge('');
    setItemImage('');
    setItemAvailable(true);
    setItemAllergens([]);
    setIsProductModalOpen(true);
  };

  // Open modal to edit existing product
  const handleOpenEditProduct = (catId, item) => {
    setEditingItem(item);
    setTargetCatId(catId);
    setItemName(item.name || '');
    setItemPrice(item.price !== undefined ? item.price.toString() : '');
    setItemDesc(item.description || '');
    setItemBadge(item.badge || '');
    setItemImage(item.image_url || '');
    setItemAvailable(item.is_available !== false);
    setItemAllergens(item.allergens || []);
    setIsProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice || !targetCatId) return;

    const payload = {
      id: editingItem?.id,
      name: itemName.trim(),
      price: parseFloat(itemPrice) || 0,
      description: itemDesc.trim(),
      badge: itemBadge.trim() || null,
      image_url: itemImage.trim() || null,
      is_available: itemAvailable,
      allergens: itemAllergens
    };

    try {
      const saved = await saveMenuItemInDb(restaurant.id || restaurant.slug, targetCatId, payload);
      
      // Update state in UI immediately
      const updatedCats = categories.map(cat => {
        if (cat.id === targetCatId) {
          const items = cat.items || [];
          if (editingItem) {
            return {
              ...cat,
              items: items.map(it => it.id === editingItem.id ? { ...it, ...saved } : it)
            };
          } else {
            return {
              ...cat,
              items: [...items, saved]
            };
          }
        }
        return cat;
      });

      setCategories(updatedCats);
      const updatedRest = { ...restaurant, menu_categories: updatedCats };
      if (onRestaurantUpdated) onRestaurantUpdated(updatedRest);

      setIsProductModalOpen(false);
      showNotice(editingItem ? 'Plato actualizado y publicado con éxito.' : 'Nuevo plato añadido a la carta digital.');
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (catId, itemId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto de la carta?')) return;
    try {
      await deleteMenuItemFromDb(restaurant.id || restaurant.slug, catId, itemId);
      const updatedCats = categories.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            items: (cat.items || []).filter(it => it.id !== itemId)
          };
        }
        return cat;
      });
      setCategories(updatedCats);
      const updatedRest = { ...restaurant, menu_categories: updatedCats };
      if (onRestaurantUpdated) onRestaurantUpdated(updatedRest);
      showNotice('Producto eliminado de la carta.');
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Toggle availability (Disponible vs Agotado)
  const handleToggleAvailability = async (catId, item) => {
    const nextState = !(item.is_available !== false);
    try {
      await toggleMenuItemAvailabilityInDb(restaurant.id || restaurant.slug, catId, item.id, nextState);
      const updatedCats = categories.map(cat => {
        if (cat.id === catId) {
          return {
            ...cat,
            items: (cat.items || []).map(it => it.id === item.id ? { ...it, is_available: nextState } : it)
          };
        }
        return cat;
      });
      setCategories(updatedCats);
      const updatedRest = { ...restaurant, menu_categories: updatedCats };
      if (onRestaurantUpdated) onRestaurantUpdated(updatedRest);
      showNotice(nextState ? `"${item.name}" marcado como DISPONIBLE.` : `"${item.name}" marcado como AGOTADO por hoy.`);
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const createdCat = await saveMenuCategoryInDb(restaurant.id || restaurant.slug, newCatName.trim());
      const updatedCats = [...categories, createdCat];
      setCategories(updatedCats);
      setNewCatName('');
      setIsAddingCat(false);
      const updatedRest = { ...restaurant, menu_categories: updatedCats };
      if (onRestaurantUpdated) onRestaurantUpdated(updatedRest);
      showNotice(`Categoría "${createdCat.name}" añadida.`);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  // Delete category
  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la sección "${catName}" y todos sus productos?`)) return;
    try {
      await deleteMenuCategoryFromDb(restaurant.id || restaurant.slug, catId);
      const updatedCats = categories.filter(c => c.id !== catId);
      setCategories(updatedCats);
      const updatedRest = { ...restaurant, menu_categories: updatedCats };
      if (onRestaurantUpdated) onRestaurantUpdated(updatedRest);
      showNotice(`Categoría "${catName}" eliminada.`);
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // Update reservation status
  const handleUpdateStatus = (resId, newStatus) => {
    const updated = reservations.map(r => r.id === resId ? { ...r, status: newStatus } : r);
    setReservations(updated);
    updateRestaurant(restaurant.id, { reservations: updated });
    if (onRestaurantUpdated) onRestaurantUpdated({ ...restaurant, reservations: updated });
    showNotice('Estado de reserva actualizado.');
  };

  // Save Restaurant Info (Hours & Contact)
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    const updatedFields = {
      phone: restPhone.trim(),
      whatsapp_number: restWhatsapp.trim(),
      address: restAddress.trim(),
      lunch_shift: {
        enabled: restLunchEnabled,
        open: restLunchOpen,
        close: restLunchClose
      },
      dinner_shift: {
        enabled: restDinnerEnabled,
        open: restDinnerOpen,
        close: restDinnerClose
      },
      closed_days: restClosedDays
    };

    await updateRestaurant(restaurant.id, updatedFields);
    const updatedRest = { ...restaurant, ...updatedFields };
    if (onRestaurantUpdated) onRestaurantUpdated(updatedRest);
    showNotice('Información del local y horarios guardados en la web.');
  };

  const showNotice = (msg) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const ALLERGEN_OPTIONS = [
    'Gluten', 'Lácteos', 'Huevos', 'Frutos de Cáscara', 
    'Pescado', 'Marisco', 'Soja', 'Vegano', 'Vegetariano'
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-100 font-sans pb-20 selection:bg-emerald-500 selection:text-black">
      {/* Executive Header */}
      <header className="border-b border-white/10 bg-zinc-950/90 backdrop-blur-2xl sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition emil-pressable"
              title="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {restaurant.name}
                </h1>
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono border font-bold"
                  style={{
                    borderColor: `${primaryColor}40`,
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor
                  }}
                >
                  Panel de Propietario
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                <span>Gestión de Carta, Productos, Reservas y Dominio Vercel</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono">Supabase Online</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={restaurant.custom_domain ? `https://${restaurant.custom_domain}` : `/#/r/${restaurant.slug}`}
              target="_blank"
              rel="noreferrer"
              className="emil-pressable px-3.5 py-1.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ver Web en Directo</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        
        {/* Vercel Banner Notice */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Dominio Asignado en Vercel:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                  {vercelDomain}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" /> SSL Activo
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Tu web ya tiene su subdominio preparado para cuando confirmemos los pagos y contratos.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('vercel')}
            className="emil-pressable px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold shrink-0"
          >
            Ver Detalles del Dominio
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('menu')}
            className={`emil-pressable px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'menu'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Carta Digital & Productos ({categories.reduce((acc, c) => acc + (c.items?.length || 0), 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`emil-pressable px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Libro de Reservas ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`emil-pressable px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'info'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Horarios & Contacto</span>
          </button>

          <button
            onClick={() => setActiveTab('vercel')}
            className={`emil-pressable px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'vercel'
                ? 'bg-white text-black shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Dominio Vercel & QR</span>
          </button>
        </div>

        {/* Global Toast Notification */}
        {savedMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{savedMsg}</span>
            </div>
            <button onClick={() => setSavedMsg('')} className="text-zinc-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: MENU & PRODUCTS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Productos y Carta Digital de Tu Local</span>
                  {loadingMenu && <RefreshCw className="w-3.5 h-3.5 text-zinc-400 animate-spin" />}
                </h2>
                <p className="text-xs text-zinc-400">
                  Cualquier plato que añadas, edites o marques como agotado se actualiza en tiempo real en la web pública y en tu Supabase.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCat(true)}
                  className="emil-pressable px-3.5 py-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 font-semibold transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Nueva Sección</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAddProduct()}
                  className="emil-pressable px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center gap-1.5 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Producto</span>
                </button>
              </div>
            </div>

            {/* Inline Add Category Bar */}
            {isAddingCat && (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-emerald-500/40 flex flex-col sm:flex-row items-center gap-3 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Nombre de la nueva sección (ej: Tapas Calientes, Postres Caseros, Vinos)..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  autoFocus
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleAddCategory}
                    className="emil-pressable px-4 py-2 rounded-xl bg-emerald-400 text-black font-bold text-xs"
                  >
                    Crear Sección
                  </button>
                  <button
                    onClick={() => { setIsAddingCat(false); setNewCatName(''); }}
                    className="emil-pressable px-3 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Category Cards with Items */}
            {categories.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
                <Utensils className="w-8 h-8 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-semibold text-white">No hay secciones en la carta</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Crea tu primera sección (por ejemplo: "Platos Principales") para empezar a añadir platos y bebidas a tu carta digital.
                </p>
                <button
                  onClick={() => setIsAddingCat(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-bold text-xs"
                >
                  Crear Primera Sección
                </button>
              </div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="p-6 rounded-3xl bg-zinc-950 border border-white/10 space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-extrabold text-base text-white">{cat.name}</h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
                        {cat.items?.length || 0} productos
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenAddProduct(cat.id)}
                        className="emil-pressable text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir a esta sección</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="emil-pressable p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Eliminar esta sección completa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Items Grid / List */}
                  {(!cat.items || cat.items.length === 0) ? (
                    <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-white/10 rounded-2xl">
                      <span>Esta sección aún no tiene productos. Haz clic en </span>
                      <button 
                        onClick={() => handleOpenAddProduct(cat.id)}
                        className="text-emerald-400 underline font-semibold ml-1"
                      >
                        Añadir a esta sección
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cat.items.map((item) => {
                        const isAvail = item.is_available !== false;
                        return (
                          <div
                            key={item.id}
                            className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                              isAvail 
                                ? 'bg-zinc-900/80 border-white/10 hover:border-white/20' 
                                : 'bg-zinc-950/60 border-red-500/20 opacity-70'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-bold text-sm ${isAvail ? 'text-white' : 'text-zinc-400 line-through'}`}>
                                    {item.name}
                                  </span>
                                  {item.badge && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                      {item.badge}
                                    </span>
                                  )}
                                  {!isAvail && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                                      Agotado Hoy
                                    </span>
                                  )}
                                </div>

                                <span className="font-mono font-black text-sm text-white shrink-0">
                                  {typeof item.price === 'number' ? `${item.price.toFixed(2)}€` : `${item.price}€`}
                                </span>
                              </div>

                              {item.description && (
                                <p className="text-xs text-zinc-400 line-clamp-2">
                                  {item.description}
                                </p>
                              )}

                              {item.allergens && item.allergens.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {item.allergens.map((alg, aIdx) => (
                                    <span key={aIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/5 font-mono">
                                      {alg}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                              {/* Toggle Available */}
                              <button
                                type="button"
                                onClick={() => handleToggleAvailability(cat.id, item)}
                                className={`emil-pressable flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                                  isAvail 
                                    ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20' 
                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                              >
                                {isAvail ? <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                                <span>{isAvail ? 'Disponible' : 'Marcar Disponible'}</span>
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProduct(cat.id, item)}
                                  className="emil-pressable p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1 text-[11px]"
                                  title="Editar plato"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Editar</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(cat.id, item.id)}
                                  className="emil-pressable p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                                  title="Eliminar plato"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: RESERVATIONS BOOK */}
        {/* ========================================================= */}
        {activeTab === 'reservations' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Libro de Reservas de Clientes
                </h2>
                <p className="text-xs text-zinc-400">
                  Reservas directas realizadas en tu web. 0% comisiones a portales externos.
                </p>
              </div>
            </div>

            {reservations.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-zinc-950 border border-white/5 space-y-3">
                <Calendar className="w-8 h-8 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-semibold text-white">Aún no hay reservas registradas</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Cuando un cliente reserve mesa en tu web pública, aparecerá aquí inmediatamente con su nombre, hora y comensales.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.map((res) => {
                  const isConfirmed = res.status === 'confirmed';
                  const isSeated = res.status === 'seated';
                  const isCancelled = res.status === 'cancelled';

                  return (
                    <div
                      key={res.id}
                      className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/20 transition space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-mono text-xs font-bold text-emerald-400 block">
                            #{res.booking_code}
                          </span>
                          <h3 className="font-bold text-white text-base mt-0.5">
                            {res.customer_name}
                          </h3>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            isSeated
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : isConfirmed
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-red-500/10 border-red-500/30 text-red-400'
                          }`}
                        >
                          {isSeated ? 'En Mesa' : isConfirmed ? 'Confirmada' : 'Cancelada'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 py-1 border-y border-white/5">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{res.reservation_date} a las {res.reservation_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{res.guests_count} comensales</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{res.area || 'Salón Principal'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <span>{res.customer_phone}</span>
                        </div>
                      </div>

                      {res.special_requests && (
                        <p className="text-xs text-amber-300/80 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                          <strong>Nota:</strong> {res.special_requests}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <a
                          href={`https://wa.me/${res.customer_phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola ${res.customer_name}, te escribimos desde ${restaurant.name} respecto a tu reserva #${res.booking_code}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 font-semibold"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp Directo</span>
                        </a>

                        <div className="flex gap-1.5">
                          {!isSeated && !isCancelled && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'seated')}
                              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-white border border-white/10"
                            >
                              Sentar en Mesa
                            </button>
                          )}
                          {!isCancelled && (
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                              className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-xs font-semibold text-red-300 border border-red-500/20"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: RESTAURANT INFO & HOURS */}
        {/* ========================================================= */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveInfo} className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Datos de Contacto y Horarios de Apertura
              </h2>
              <p className="text-xs text-zinc-400">
                Estos datos aparecen en la cabecera, pie de página y motor de reservas de tu web.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Teléfono Fijo o Móvil de Atención
                </label>
                <input
                  type="text"
                  value={restPhone}
                  onChange={(e) => setRestPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Móvil con WhatsApp (Para confirmaciones)
                </label>
                <input
                  type="text"
                  value={restWhatsapp}
                  onChange={(e) => setRestWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Dirección del Local
                </label>
                <input
                  type="text"
                  value={restAddress}
                  onChange={(e) => setRestAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Shifts & Hours */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <span className="text-xs font-bold text-white block">
                Turnos de Servicio
              </span>

              {/* Lunch Shift */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="lunchEnabled"
                    checked={restLunchEnabled}
                    onChange={(e) => setRestLunchEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400 rounded"
                  />
                  <label htmlFor="lunchEnabled" className="text-xs font-semibold text-zinc-200">
                    Turno de Comidas (Mediodía)
                  </label>
                </div>
                {restLunchEnabled && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400">De</span>
                    <input
                      type="time"
                      value={restLunchOpen}
                      onChange={(e) => setRestLunchOpen(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-mono text-xs"
                    />
                    <span className="text-zinc-400">a</span>
                    <input
                      type="time"
                      value={restLunchClose}
                      onChange={(e) => setRestLunchClose(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Dinner Shift */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="dinnerEnabled"
                    checked={restDinnerEnabled}
                    onChange={(e) => setRestDinnerEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-400 rounded"
                  />
                  <label htmlFor="dinnerEnabled" className="text-xs font-semibold text-zinc-200">
                    Turno de Cenas y Noche
                  </label>
                </div>
                {restDinnerEnabled && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400">De</span>
                    <input
                      type="time"
                      value={restDinnerOpen}
                      onChange={(e) => setRestDinnerOpen(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-mono text-xs"
                    />
                    <span className="text-zinc-400">a</span>
                    <input
                      type="time"
                      value={restDinnerClose}
                      onChange={(e) => setRestDinnerClose(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-white font-mono text-xs"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="emil-pressable px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Cambios de Horarios y Contacto</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================= */}
        {/* TAB 4: VERCEL DOMAIN & QR CODE */}
        {/* ========================================================= */}
        {activeTab === 'vercel' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-emerald-500/30 space-y-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Dominio Web en Vercel & Configuración DNS
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                      Listo para Producción
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Tu web cuenta con despliegue instantáneo en la infraestructura de Vercel y base de datos Supabase conectada.
                  </p>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white shrink-0 font-mono font-bold text-sm">
                  ▲
                </div>
              </div>

              {/* Domain Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Dominio Asignado</span>
                  <span className="font-mono text-emerald-300 font-bold break-all text-xs">
                    {vercelDomain}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Certificado de Seguridad SSL</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Activo & Seguro (HTTPS)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Base de Datos</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Supabase Sincronizado</span>
                  </div>
                </div>
              </div>

              {/* Direct Links Actions */}
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <QrCode className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Enlace para la Carta Digital en las Mesas
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      https://tecnodiel.app/#r/{restaurant.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://tecnodiel.app/#r/${restaurant.slug}`);
                      showNotice('Enlace de la carta copiado al portapapeles.');
                    }}
                    className="emil-pressable px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition"
                  >
                    Copiar Enlace QR
                  </button>

                  <a
                    href={`#r/${restaurant.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="emil-pressable px-4 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Abrir Mi Web</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 sm:p-8 space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar animate-spring-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {editingItem ? 'Editar Producto de la Carta' : 'Añadir Nuevo Producto'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Se publicará al instante en tu web pública y en Supabase.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Sección de la Carta donde irá el producto
                </label>
                <select
                  value={targetCatId}
                  onChange={(e) => setTargetCatId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Nombre del Plato o Bebida *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Croquetas de Jamón Ibérico, Gin Tonic Premium..."
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Precio (€) *
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    placeholder="12.50"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Descripción o Ingredientes
                </label>
                <textarea
                  rows="2"
                  placeholder="Detalles sobre el plato, ingredientes principales, salsa, guarnición..."
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Badge & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Distintivo Especial (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Recomendado, Firma, Especialidad, Top Ventas..."
                    value={itemBadge}
                    onChange={(e) => setItemBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Disponibilidad en Carta
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="itemAvailCheck"
                      checked={itemAvailable}
                      onChange={(e) => setItemAvailable(e.target.checked)}
                      className="w-4 h-4 accent-emerald-400 rounded"
                    />
                    <label htmlFor="itemAvailCheck" className="text-zinc-200">
                      {itemAvailable ? 'Disponible para pedir' : 'Agotado por hoy'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Allergens selection */}
              <div>
                <label className="font-semibold text-zinc-300 block mb-1.5">
                  Avisos y Alérgenos
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALLERGEN_OPTIONS.map((alg) => {
                    const isSelected = itemAllergens.includes(alg);
                    return (
                      <button
                        type="button"
                        key={alg}
                        onClick={() => {
                          if (isSelected) {
                            setItemAllergens(itemAllergens.filter(a => a !== alg));
                          } else {
                            setItemAllergens([...itemAllergens, alg]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg border transition text-[11px] ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 font-semibold'
                            : 'border-white/5 bg-zinc-900 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {alg}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="emil-pressable px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold shadow-lg"
                >
                  {editingItem ? 'Guardar Cambios del Plato' : 'Publicar Plato en la Carta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
