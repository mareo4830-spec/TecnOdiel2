import React, { useState } from 'react';
import { 
  Globe, 
  Utensils, 
  Calendar, 
  Clock, 
  Settings, 
  CreditCard, 
  QrCode, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Instagram, 
  ShieldCheck, 
  Sparkles, 
  Download, 
  RefreshCw,
  AlertCircle,
  Copy,
  ChevronRight,
  Key,
  Lock,
  Headphones,
  Check
} from 'lucide-react';
import { 
  toggleMenuItemStock, 
  upsertMenuItem, 
  deleteMenuItem, 
  updateReservationStatus, 
  updateRestaurantProfile 
} from '../lib/supabase';
import confetti from 'canvas-confetti';

export default function Dashboard({ restaurant, onRefresh }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'menu', 'bookings', 'hours', 'billing'
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const handleCopyKey = () => {
    const k = restaurant.client_access_key || 'TO-MN892';
    navigator.clipboard.writeText(k);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Menu modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState(restaurant.menu_categories?.[0]?.id || '');
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemBadge, setItemBadge] = useState('');

  // Contact & Hours state
  const [phone, setPhone] = useState(restaurant.phone || '');
  const [whatsapp, setWhatsapp] = useState(restaurant.whatsapp_number || '');
  const [address, setAddress] = useState(restaurant.address || '');
  const [city, setCity] = useState(restaurant.city || 'Huelva');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const liveUrl = restaurant.cloudflare_url || restaurant.published_url || `https://${restaurant.slug}.pages.dev`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(liveUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleToggleStock = async (itemId, currentStatus) => {
    await toggleMenuItemStock(itemId, !currentStatus);
    onRefresh();
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('¿Seguro que deseas eliminar este plato de la carta?')) {
      await deleteMenuItem(itemId);
      onRefresh();
    }
  };

  const handleOpenItemModal = (item = null, catId = null) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.name || '');
      setItemPrice(item.price || '');
      setItemDesc(item.description || '');
      setItemBadge(item.badge || '');
      setSelectedCatId(catId || restaurant.menu_categories?.[0]?.id || '');
    } else {
      setEditingItem(null);
      setItemName('');
      setItemPrice('');
      setItemDesc('');
      setItemBadge('');
      setSelectedCatId(catId || restaurant.menu_categories?.[0]?.id || '');
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;

    await upsertMenuItem(restaurant.id, selectedCatId, {
      id: editingItem?.id,
      name: itemName,
      price: itemPrice,
      description: itemDesc,
      badge: itemBadge,
      is_available: editingItem ? editingItem.is_available : true
    });

    setIsItemModalOpen(false);
    onRefresh();
  };

  const handleStatusChange = async (resId, newStatus) => {
    await updateReservationStatus(resId, newStatus);
    onRefresh();
  };

  const handleSaveHours = async () => {
    setSavingProfile(true);
    await updateRestaurantProfile(restaurant.id, {
      phone,
      whatsapp_number: whatsapp,
      address,
      city
    });
    setSavingProfile(false);
    setSaveSuccessMsg('Datos actualizados correctamente en Supabase.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
    onRefresh();
  };

  const totalDishes = (restaurant.menu_categories || []).reduce(
    (acc, cat) => acc + (cat.items || []).length, 0
  );

  const reservationsList = restaurant.reservations || [];
  const confirmedReservations = reservationsList.filter(r => r.status === 'confirmed').length;

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner / Restaurant Identity */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 uppercase font-semibold">
              ● Web Activa en Línea
            </span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 uppercase font-semibold">
              Cloudflare Pages
            </span>
            {/* Clave Privada de Cliente */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-emerald-500/40 text-xs font-mono">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400 text-[11px]">Tu Clave Privada:</span>
              <strong className="text-white text-xs tracking-wider">{restaurant.client_access_key || 'TO-MN892'}</strong>
              <button
                type="button"
                onClick={handleCopyKey}
                className="hover:text-emerald-300 text-zinc-400 transition ml-0.5 p-0.5"
                title="Copiar tu clave de acceso"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {copiedKey && <span className="text-[10px] text-emerald-400 font-bold ml-0.5">¡Copiada!</span>}
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {restaurant.name}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            {restaurant.slogan || restaurant.description}
          </p>
        </div>

        {/* Live URL & QR Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-900/90 hover:bg-zinc-800 text-xs font-mono text-zinc-200 transition flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-zinc-400" />
            <span>{copiedUrl ? '¡Copiado!' : 'Copiar URL'}</span>
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-bold text-emerald-300 transition flex items-center gap-2"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Ver Cartel QR Mesas</span>
          </button>

          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold transition flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          >
            <span>Ver Mi Web en Vivo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Trust & Security Guarantee Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 px-4 sm:px-6 py-3 rounded-2xl bg-zinc-950/70 border border-white/10 text-[11px] text-zinc-300 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>SSL Certificado 256-bit</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Cloudflare Global Edge</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Panel Aislado y Seguro</span>
        </div>
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Soporte Técnico Huelva</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Resumen & Dominio', icon: Globe },
          { id: 'menu', label: `Carta Digital (${totalDishes})`, icon: Utensils },
          { id: 'bookings', label: `Reservas (${reservationsList.length})`, icon: Calendar },
          { id: 'hours', label: 'Horarios & Contacto', icon: Clock },
          { id: 'billing', label: 'Plan & Condiciones', icon: CreditCard }
        ].map(tab => {
          const Icon = tab.icon;
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isSel 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Dominio Gratuito</span>
              <div className="text-sm font-mono text-amber-300 font-bold truncate">
                {restaurant.slug}.pages.dev
              </div>
              <span className="text-[10px] text-emerald-400 block pt-1">
                ✓ Cloudflare SSL Certificado
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Reservas Confirmadas</span>
              <div className="text-2xl font-black text-white font-mono">
                {confirmedReservations}
              </div>
              <span className="text-[10px] text-zinc-400 block pt-1">
                Directas a tu WhatsApp y panel
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Platos en Carta</span>
              <div className="text-2xl font-black text-white font-mono">
                {totalDishes}
              </div>
              <span className="text-[10px] text-emerald-400 block pt-1">
                Actualización instantánea
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Estilo Activo</span>
              <div className="text-sm font-bold text-white uppercase truncate">
                {restaurant.template_id || 'Nocturne'}
              </div>
              <span className="text-[10px] text-zinc-400 block pt-1">
                Color principal: <span className="font-mono" style={{ color: restaurant.primary_color }}>{restaurant.primary_color}</span>
              </span>
            </div>
          </div>

          {/* Tu Asesor TecnOdiel Personal - Cercanía, Soporte y Confianza */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-zinc-950 border border-emerald-500/30 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
            <div className="flex items-start sm:items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-2 border-emerald-400/50 flex items-center justify-center text-white shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-700 w-full h-full flex items-center justify-center font-black font-mono text-lg tracking-wider">
                    TO
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-black" title="Asesor en línea" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-white">Tu Asesor TecnOdiel Asignado</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                    ● En Línea (Huelva)
                  </span>
                </div>
                <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
                  ¿Quieres cambiar fotos de tu local, actualizar platos especiales o necesitas una recomendación? Estamos a tu lado para que no tengas que preocuparte por nada técnico.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Soporte Humano Cercano
                  </span>
                  <span>•</span>
                  <span>Respuesta media &lt; 15 min</span>
                  <span>•</span>
                  <span>Garantía 100% TecnOdiel</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola TecnOdiel, soy ${restaurant.name} (clave ${restaurant.client_access_key || ''}). Necesito ayuda con mi web o carta digital.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-extrabold transition flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Hablar con mi Asesor (WhatsApp)</span>
              </a>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Acciones Frecuentes para tu Día a Día</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveTab('menu')}
                className="p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-emerald-400/40 text-left transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
                  <span>Modificar Platos o Precios</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Cambia un precio, marca un plato como agotado o añade la sugerencia del chef.
                </p>
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className="p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-emerald-400/40 text-left transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
                  <span>Gestionar Reservas de Mesas</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Comprueba las mesas solicitadas y envía confirmaciones por WhatsApp en 1 clic.
                </p>
              </button>

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-emerald-400/40 text-left transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-emerald-300">
                  <span>Descargar Cartel QR para Mesas</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Código QR listo para imprimir y colocar en barras, mesas o en la entrada de tu local.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENU MANAGER */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Gestión de Carta Digital en Tiempo Real
              </h2>
              <p className="text-xs text-zinc-400">
                Los cambios se reflejan al instante en tu web pública de Cloudflare Pages sin reiniciar nada.
              </p>
            </div>

            <button
              onClick={() => handleOpenItemModal()}
              className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Añadir Nuevo Plato / Bebida</span>
            </button>
          </div>

          {/* Categories and Items */}
          <div className="space-y-6">
            {(restaurant.menu_categories || []).map(cat => (
              <div key={cat.id} className="p-5 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                    <span>{cat.name}</span>
                    <span className="text-[11px] font-normal text-zinc-500 font-mono">
                      ({(cat.items || []).length} productos)
                    </span>
                  </h3>

                  <button
                    onClick={() => handleOpenItemModal(null, cat.id)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-300 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Añadir a esta sección</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(cat.items || []).map(item => (
                    <div 
                      key={item.id}
                      className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                        item.is_available !== false 
                          ? 'bg-zinc-900/60 border-white/5' 
                          : 'bg-zinc-950/40 border-rose-500/20 opacity-60'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          {item.badge && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-medium">
                              {item.badge}
                            </span>
                          )}
                          {item.is_available === false && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono">
                              Agotado
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <span className="font-mono text-emerald-400 font-extrabold text-sm block pt-1">
                          {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}€
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {/* Toggle stock availability */}
                        <button
                          onClick={() => handleToggleStock(item.id, item.is_available !== false)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition flex items-center gap-1.5 ${
                            item.is_available !== false
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-rose-500/20 hover:text-rose-300'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300'
                          }`}
                        >
                          {item.is_available !== false ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>Disponible</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-400" />
                              <span>Agotado</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenItemModal(item, cat.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
                            title="Editar plato"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="Eliminar plato"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BOOKINGS MANAGER */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Reservas Directas de Clientes
              </h2>
              <p className="text-xs text-zinc-400">
                Reservas recibidas sin pagar comisiones ni intermediarios externos.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              0€ Comisiones de por vida
            </span>
          </div>

          <div className="space-y-3">
            {reservationsList.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-zinc-950/60 border border-white/5 text-zinc-500 text-xs">
                No hay reservas registradas en este momento. Las nuevas reservas aparecerán aquí en vivo.
              </div>
            ) : (
              reservationsList.map(res => (
                <div 
                  key={res.id}
                  className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                        {res.booking_code}
                      </span>
                      <h4 className="font-bold text-white text-base">{res.customer_name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        res.status === 'confirmed' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : res.status === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {res.status === 'confirmed' ? 'Confirmada' : res.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-0.5">
                      <span>📅 {res.reservation_date}</span>
                      <span>⏰ {res.reservation_time}</span>
                      <span>👥 {res.guests_count} comensales</span>
                      {res.area && <span>📍 {res.area}</span>}
                    </div>

                    {res.special_requests && (
                      <p className="text-[11px] text-amber-300/80 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        Nota del cliente: {res.special_requests}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Direct WhatsApp Message to Customer */}
                    {res.customer_phone && (
                      <a
                        href={`https://wa.me/${res.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hola ${res.customer_name}, te escribimos desde ${restaurant.name} respecto a tu reserva ${res.booking_code} para el ${res.reservation_date} a las ${res.reservation_time} (${res.guests_count} personas). ¡Todo preparado para recibiros!`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Avisar por WhatsApp</span>
                      </a>
                    )}

                    {res.status !== 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(res.id, 'confirmed')}
                        className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 text-xs font-semibold border border-white/10 transition"
                      >
                        Confirmar
                      </button>
                    )}

                    {res.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(res.id, 'cancelled')}
                        className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-rose-400 text-xs font-semibold border border-white/10 transition"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: HOURS & CONTACT */}
      {activeTab === 'hours' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Datos de Contacto & Dirección del Negocio
            </h2>
            <p className="text-xs text-zinc-400">
              Esta información aparece visible en el pie de página de tu web y en los enlaces de reserva.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Teléfono de Reservas:
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Número de WhatsApp para Notificaciones:
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Dirección física:
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Ciudad:
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <button
            onClick={handleSaveHours}
            disabled={savingProfile}
            className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition shadow-lg flex items-center gap-2"
          >
            {savingProfile ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>Guardar Cambios en Supabase</span>
          </button>
        </div>
      )}

      {/* TAB 5: BILLING & CONTRACT */}
      {activeTab === 'billing' && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-white/10 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  // CONDICIONES CONTRACTUALES CLARAS
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Tu Plan y Servicios Contratados
                </h2>
                <p className="text-xs text-zinc-400">
                  Transparencia absoluta y soporte personal de TecnOdiel.
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-emerald-500/30 text-right">
                <span className="text-[10px] font-mono text-zinc-400 block uppercase">Inversión Contratada:</span>
                <span className="text-lg font-black text-emerald-300 font-mono">
                  {restaurant.budget ? `${parseFloat(restaurant.budget).toFixed(0)}€` : '99€'}/mes
                </span>
              </div>
            </div>

            {/* Plan Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Plan Activo</span>
                <div className="text-sm font-bold text-white">
                  {restaurant.plan_name || 'Plan Crecimiento Gastronómico'}
                </div>
                <span className="text-[11px] text-emerald-400 block">✓ Estado: Activo y Protegido</span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Tu Clave de Cliente Privada</span>
                <div className="text-sm font-mono text-amber-300 font-bold">
                  {restaurant.client_access_key || 'TO-MN892'}
                </div>
                <span className="text-[11px] text-zinc-400 block">Identificador exclusivo para tu negocio</span>
              </div>
            </div>

            {/* Inclusive Services List */}
            <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Servicios y Coberturas Incluidas en tu Cuota:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Alojamiento Cloudflare de Alta Velocidad</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0€ Comisiones por Reserva (100% tuyo)</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Carta Digital y Cartelería QR Ilimitada</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Certificado SSL y Copias de Seguridad 24h</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Motor de Reservas Directo a WhatsApp</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Asesor Técnico Personal Asignado en Huelva</span>
                </div>
              </div>
            </div>

            {/* Ethics & Trust Manifesto */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-zinc-300 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantía de Cercanía y Transparencia TecnOdiel</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                Sin permanencias ocultas, sin cargos imprevistos ni comisiones por cubierto. Si necesitas solicitar una factura, cambiar los datos de facturación o ampliar funcionalidades, habla directamente con tu asesor.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={`https://wa.me/34600000000?text=${encodeURIComponent(`Hola equipo TecnOdiel, soy ${restaurant.name} (clave ${restaurant.client_access_key || ''}). Tengo una consulta sobre mi factura / plan contratado.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs border border-white/10 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Hablar con Administración TecnOdiel</span>
              </a>

              <a
                href="tel:+34600000000"
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition flex items-center justify-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                <span>Llamar por Teléfono</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white">Cartel QR para Mesas</h3>
            <p className="text-xs text-zinc-400">
              Escanea con la cámara de cualquier móvil para abrir la carta digital y reservas.
            </p>

            <div className="p-4 bg-white rounded-2xl mx-auto inline-block shadow-xl">
              <img src={qrImageUrl} alt="QR de mesa" className="w-48 h-48 mx-auto" />
            </div>

            <div className="text-[11px] font-mono text-emerald-300 font-bold">
              {restaurant.slug}.pages.dev
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={qrImageUrl}
                download={`${restaurant.slug}-qr-mesas.png`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Imagen QR</span>
              </a>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISH ADD / EDIT MODAL */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form 
            onSubmit={handleSaveItem}
            className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white">
              {editingItem ? 'Editar Plato / Bebida' : 'Añadir Nuevo Plato / Bebida'}
            </h3>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Nombre:</label>
              <input
                type="text"
                required
                placeholder="ej: Arroz Caldoso con Bogavante"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Precio (€):</label>
              <input
                type="number"
                step="0.10"
                required
                placeholder="ej: 18.50"
                value={itemPrice}
                onChange={e => setItemPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Descripción:</label>
              <textarea
                rows={2}
                placeholder="Ingredientes principales, alérgenos o presentación..."
                value={itemDesc}
                onChange={e => setItemDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Etiqueta Destacada (Opcional):</label>
              <input
                type="text"
                placeholder="ej: Firma de la Casa, Top Ventas, Recomendado..."
                value={itemBadge}
                onChange={e => setItemBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Categoría de la Carta:</label>
              <select
                value={selectedCatId}
                onChange={e => setSelectedCatId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              >
                {(restaurant.menu_categories || []).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition shadow-md"
              >
                Guardar en Carta
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
