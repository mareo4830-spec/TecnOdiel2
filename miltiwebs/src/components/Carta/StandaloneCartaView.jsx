import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  UtensilsCrossed, 
  Flame, 
  Sparkles, 
  Bell, 
  Check, 
  AlertCircle, 
  Globe, 
  MapPin, 
  Phone, 
  Wifi, 
  ArrowLeft,
  Filter,
  Plus,
  Minus,
  Trash2,
  Share2,
  Info
} from 'lucide-react';

const COMMON_ALLERGENS = [
  { id: 'gluten', label: 'Sin Gluten', icon: '🌾' },
  { id: 'veggie', label: 'Vegetariano', icon: '🌱' },
  { id: 'lacteos', label: 'Sin Lactosa', icon: '🥛' },
  { id: 'marisco', label: 'Marisco', icon: '🦐' },
  { id: 'picante', label: 'Picante', icon: '🌶️' }
];

export default function StandaloneCartaView({ 
  restaurant = {}, 
  tableNumber = '', 
  onBackToFullWeb = null 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [activeAllergenFilter, setActiveAllergenFilter] = useState(null);
  const [selectedDishes, setSelectedDishes] = useState([]); // [{ item, quantity }]
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [waiterReason, setWaiterReason] = useState('Pedir la comanda');
  const [waiterSuccessNotice, setWaiterSuccessNotice] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isAllergensInfoOpen, setIsAllergensInfoOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

  const primaryColor = restaurant.primary_color || '#eab308';
  const bgColor = restaurant.background_color || '#09090b';
  const surfaceColor = restaurant.surface_color || '#18181b';
  const fontFamily = restaurant.font_family || 'Inter';

  const categories = useMemo(() => {
    return Array.isArray(restaurant.menu_categories) && restaurant.menu_categories.length > 0
      ? restaurant.menu_categories
      : [
          {
            name: 'Platos Principales',
            items: [
              { name: 'Chuletón de Vaca Rubia Gallega', price: 68, description: 'Maduración 45 días Dry Aged a la brasa de encina con sal de escamas', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', is_specialty: true },
              { name: 'Entrecot Angus a la Parrilla', price: 28, description: 'Corte seleccionado con patatas panaderas y pimientos del padrón', image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80' }
            ]
          }
        ];
  }, [restaurant.menu_categories]);

  // Filtered dishes
  const filteredCategories = useMemo(() => {
    return categories.map(cat => {
      const items = (cat.items || []).filter(item => {
        const matchesSearch = !searchTerm.trim() || 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

        let matchesAllergen = true;
        if (activeAllergenFilter === 'veggie') {
          matchesAllergen = (item.description || '').toLowerCase().includes('vegano') || (item.description || '').toLowerCase().includes('vegetal') || (item.description || '').toLowerCase().includes('ensalada');
        } else if (activeAllergenFilter === 'picante') {
          matchesAllergen = (item.description || '').toLowerCase().includes('picante') || (item.description || '').toLowerCase().includes('chile');
        }

        return matchesSearch && matchesAllergen;
      });

      return {
        ...cat,
        items
      };
    }).filter(cat => cat.items.length > 0);
  }, [categories, searchTerm, activeAllergenFilter]);

  // Order calculator helpers
  const handleAddToSelection = (item) => {
    setSelectedDishes(prev => {
      const existing = prev.find(d => d.item.name === item.name);
      if (existing) {
        return prev.map(d => d.item.name === item.name ? { ...d, quantity: d.quantity + 1 } : d);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleRemoveFromSelection = (itemName) => {
    setSelectedDishes(prev => {
      return prev.map(d => {
        if (d.item.name === itemName) {
          return { ...d, quantity: d.quantity - 1 };
        }
        return d;
      }).filter(d => d.quantity > 0);
    });
  };

  const totalSelectionPrice = useMemo(() => {
    return selectedDishes.reduce((acc, d) => acc + (d.item.price * d.quantity), 0);
  }, [selectedDishes]);

  const totalDishCount = useMemo(() => {
    return selectedDishes.reduce((acc, d) => acc + d.quantity, 0);
  }, [selectedDishes]);

  const handleCallWaiter = () => {
    setWaiterSuccessNotice(true);
    setTimeout(() => {
      setWaiterSuccessNotice(false);
      setIsWaiterModalOpen(false);
    }, 2200);
  };

  return (
    <div 
      className="min-h-screen text-zinc-100 flex flex-col font-sans selection:bg-white selection:text-black"
      style={{ backgroundColor: bgColor, fontFamily }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER COMPACTO Y EXCLUSIVO PARA MESAS
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {onBackToFullWeb && (
              <button
                type="button"
                onClick={onBackToFullWeb}
                className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition"
                title="Ver web completa"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white truncate max-w-[200px] sm:max-w-xs">
                  {restaurant.name || 'Carta Digital'}
                </span>
                {tableNumber && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
                    Mesa {tableNumber}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cocina Abierta</span>
                </span>
                <span>•</span>
                <span>Carta Digital Mesa</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWaiterModalOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-xs text-white font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Avisar a sala / Llamar camarero"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span className="hidden sm:inline">Llamar Camarero</span>
              <span className="sm:hidden">Camarero</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAllergensInfoOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition cursor-pointer"
              title="Información de alérgenos"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. BUSCADOR & FILTROS DE ALÉRGENOS
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-zinc-950/70 border-b border-white/5 px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto space-y-2.5">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar plato, ingrediente o corte..."
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-white/30"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
            <span className="text-zinc-500 uppercase text-[10px] shrink-0 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Filtro:</span>
            </span>

            {COMMON_ALLERGENS.map(all => {
              const isActive = activeAllergenFilter === all.id;
              return (
                <button
                  key={all.id}
                  type="button"
                  onClick={() => setActiveAllergenFilter(isActive ? null : all.id)}
                  className={`px-2.5 py-1 rounded-lg border transition shrink-0 cursor-pointer flex items-center gap-1 ${
                    isActive 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' 
                      : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>{all.icon}</span>
                  <span>{all.label}</span>
                </button>
              );
            })}

            {activeAllergenFilter && (
              <button
                type="button"
                onClick={() => setActiveAllergenFilter(null)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 underline shrink-0 cursor-pointer"
              >
                Limpiar filtro
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CATEGORÍAS EN PESTAÑAS HORIZONTALES (STICKY)
         ───────────────────────────────────────────────────────────── */}
      <nav className="sticky top-[57px] z-30 bg-zinc-950/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategoryIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedCategoryIndex(idx);
                  const el = document.getElementById(`cat-section-${idx}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-extrabold shadow-sm'
                    : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-white/5'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          4. LISTADO DE PLATOS Y RACIONES
         ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-8 pb-32">
        
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-zinc-900/40 rounded-3xl border border-white/5 p-8">
            <UtensilsCrossed className="w-10 h-10 text-zinc-600 mx-auto" />
            <h4 className="text-base font-bold text-white">No hay platos que coincidan</h4>
            <p className="text-xs text-zinc-400">Intenta con otro término o limpia los filtros de búsqueda.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setActiveAllergenFilter(null);
              }}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs"
            >
              Ver Toda la Carta
            </button>
          </div>
        ) : (
          filteredCategories.map((cat, catIdx) => (
            <section 
              key={catIdx} 
              id={`cat-section-${catIdx}`}
              className="space-y-4 pt-2"
            >
              {/* Category Title */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {cat.name}
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">
                  {cat.items.length} {cat.items.length === 1 ? 'opción' : 'opciones'}
                </span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {cat.items.map((item, itemIdx) => {
                  const selectionEntry = selectedDishes.find(d => d.item.name === item.name);
                  const selectedCount = selectionEntry?.quantity || 0;

                  return (
                    <article
                      key={itemIdx}
                      className="p-3.5 sm:p-4 rounded-2xl bg-zinc-900/70 border border-white/10 hover:border-white/20 transition flex gap-3.5 sm:gap-4 shadow-sm"
                      style={{ backgroundColor: surfaceColor }}
                    >
                      {/* Dish Photo (if available) */}
                      {item.image && (
                        <div 
                          onClick={() => setEnlargedImage(item.image)}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10 relative cursor-pointer group"
                          title="Toca para ampliar foto"
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-white leading-snug">
                              {item.name}
                            </h4>
                            <span 
                              className="font-mono font-extrabold text-sm sm:text-base shrink-0"
                              style={{ color: primaryColor }}
                            >
                              {typeof item.price === 'number' ? `${item.price.toFixed(2)}€` : item.price}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Order Counter & Badges */}
                        <div className="pt-2 flex items-center justify-between gap-2 mt-auto">
                          {item.is_specialty ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-orange-400 bg-orange-950/60 border border-orange-500/40 px-2 py-0.5 rounded-full font-semibold">
                              <Flame className="w-3 h-3" />
                              <span>Especialidad</span>
                            </span>
                          ) : <div />}

                          {/* Quick selection calculator */}
                          <div className="flex items-center gap-1 bg-black/60 border border-white/10 rounded-xl p-1">
                            {selectedCount > 0 ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromSelection(item.name)}
                                  className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center text-xs transition cursor-pointer"
                                  title="Quitar uno"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-mono font-bold text-white">
                                  {selectedCount}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddToSelection(item)}
                                  className="w-6 h-6 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center text-xs font-bold transition cursor-pointer"
                                  title="Añadir otro"
                                >
                                  <Plus className="w-3 h-3 stroke-[3]" />
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddToSelection(item)}
                                className="px-2 py-1 rounded-lg bg-zinc-800/80 hover:bg-white/10 text-[11px] text-zinc-300 hover:text-white font-medium flex items-center gap-1 transition cursor-pointer"
                                title="Anotar en mi selección para calcular cuenta"
                              >
                                <Plus className="w-3 h-3 text-emerald-400" />
                                <span>Anotar</span>
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}

      </main>

      {/* ─────────────────────────────────────────────────────────────
          5. BARRA FLOTANTE INFERIOR: RESUMEN DE MESA / COMANDA
         ───────────────────────────────────────────────────────────── */}
      {totalDishCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950/95 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3 text-white">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm border border-emerald-500/40">
                {totalDishCount}
              </div>
              <div>
                <span className="text-xs text-zinc-400 block font-mono">Tu selección de mesa:</span>
                <span className="font-extrabold text-base sm:text-lg font-mono text-emerald-400">
                  {totalSelectionPrice.toFixed(2)}€
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSelectionModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-xs text-white font-semibold hover:bg-zinc-800 transition cursor-pointer"
              >
                Ver Lista
              </button>

              <button
                type="button"
                onClick={() => setIsWaiterModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Pedir a Sala</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. MODAL: LLAMAR AL CAMARERO / ASISTENCIA
         ───────────────────────────────────────────────────────────── */}
      {isWaiterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-white">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-base">Avisar a Sala</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {tableNumber ? `Mesa ${tableNumber}` : 'Comunica tu petición'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWaiterModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {waiterSuccessNotice ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <h5 className="font-extrabold text-emerald-300 text-base">¡Aviso Enviado a Sala!</h5>
                <p className="text-xs text-zinc-300">Un miembro del equipo acudirá a tu mesa en breves instantes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-xs font-mono text-zinc-400 uppercase font-semibold">
                  ¿En qué podemos ayudarte?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'Tomar nota de la comanda',
                    'Pedir la cuenta',
                    'Otra ronda de bebidas',
                    'Duda sobre ingredientes / alérgenos',
                    'Servilletas o cubiertos extra'
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWaiterReason(opt)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                        waiterReason === opt
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCallWaiter}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition cursor-pointer shadow-lg shadow-amber-950/40"
                >
                  Confirmar Aviso para la Mesa
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. MODAL: DETALLE DE LA COMANDA / SELECCIÓN
         ───────────────────────────────────────────────────────────── */}
      {isSelectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-zinc-950 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-white max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-base">Tu Selección en Mesa</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsSelectionModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {selectedDishes.map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white block truncate">{d.item.name}</span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {d.quantity} x {d.item.price}€ = {(d.quantity * d.item.price).toFixed(2)}€
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveFromSelection(d.item.name)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold w-4 text-center">{d.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleAddToSelection(d.item)}
                      className="p-1.5 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400 font-mono">Estimación Total:</span>
                <span className="font-mono font-extrabold text-lg text-emerald-400">
                  {totalSelectionPrice.toFixed(2)}€
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDishes([])}
                  className="py-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-400 hover:text-white transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar Lista</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSelectionModalOpen(false);
                    setIsWaiterModalOpen(true);
                  }}
                  className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Pedir al Camarero</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. MODAL: INFORMACIÓN LEGAL DE ALÉRGENOS (UE 1169/2011)
         ───────────────────────────────────────────────────────────── */}
      {isAllergensInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 text-white max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-base">Información de Alérgenos</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAllergensInfoOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              En cumplimiento del <strong>Reglamento (UE) Nº 1169/2011</strong> sobre la información alimentaria facilitada al consumidor, disponemos de la información detallada de los 14 alérgenos de presencia obligatoria.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                'Gluten / Cereales', 'Crustáceos', 'Huevos', 'Pescado',
                'Cacahuetes', 'Soja', 'Lácteos', 'Frutos de cáscara',
                'Apio', 'Mostaza', 'Granos de sésamo', 'Dióxido de azufre y sulfitos',
                'Altramuces', 'Moluscos'
              ].map((all, i) => (
                <div key={i} className="p-2 rounded-lg bg-zinc-900 border border-white/5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="truncate">{all}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
              Si padeces alguna alergia severa o intolerancia, por favor avisa siempre a nuestro personal de sala antes de realizar tu pedido.
            </div>

            <button
              type="button"
              onClick={() => setIsAllergensInfoOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs"
            >
              Entendido
            </button>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. MODAL: AMPLIAR FOTO DEL PLATO
         ───────────────────────────────────────────────────────────── */}
      {enlargedImage && (
        <div 
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
        >
          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <img 
              src={enlargedImage} 
              alt="Plato ampliado" 
              className="w-full max-h-[80vh] object-contain bg-black"
            />
            <button
              type="button"
              onClick={() => setEnlargedImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          10. FOOTER LIMPIO
         ───────────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-8 px-4 border-t border-white/10 text-center text-xs text-zinc-500 space-y-2">
        <p className="font-semibold text-zinc-400">
          {restaurant.name} • Carta Digital Oficial
        </p>
        <p className="text-[11px] font-mono">
          Desarrollada con Tecnología TecnOdiel • 0€ Comisiones para la Hostelería
        </p>
      </footer>
    </div>
  );
}
