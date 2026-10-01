import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Globe, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { getClientRestaurantsList } from '../lib/supabase';

export default function ClientAuth({ onSelectRestaurant }) {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getClientRestaurantsList();
      setRestaurants(list || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = restaurants.filter(r => 
    (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.slug || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative z-10 w-full min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-zinc-950/80 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl space-y-8 animate-fadeIn">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Acceso Privado // TecnOdiel Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Acceso a tu Portal de Negocio
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Gestiona la carta digital, revisa reservas de mesas en vivo y consulta tu dominio Cloudflare en tiempo real.
          </p>
        </div>

        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-300 block">
            Selecciona tu restaurante o busca por nombre:
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por nombre (ej: Marea Negra, Nocturne...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>
        </div>

        {/* Restaurants Selection List */}
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              Cargando tus negocios registrados en Supabase...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500">
              No se encontraron restaurantes con ese nombre.
            </div>
          ) : (
            filtered.map(r => (
              <div
                key={r.id || r.slug}
                onClick={() => onSelectRestaurant(r.slug || r.id)}
                className="group p-4 rounded-2xl border border-white/5 bg-zinc-900/60 hover:bg-emerald-500/10 hover:border-emerald-400/40 cursor-pointer transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black border border-white/10 group-hover:border-emerald-400/50 flex items-center justify-center text-zinc-300 group-hover:text-emerald-400 transition">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition">
                      {r.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
                      <span className="text-emerald-400">⚡ {r.slug}.pages.dev</span>
                      <span>•</span>
                      <span className="capitalize">{r.template_id || 'nocturne'}</span>
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-emerald-400 group-hover:bg-emerald-400 group-hover:text-black flex items-center justify-center text-zinc-400 transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Security & Cloudflare badge */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conexión segura Supabase SSL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Cloudflare Edge Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}
