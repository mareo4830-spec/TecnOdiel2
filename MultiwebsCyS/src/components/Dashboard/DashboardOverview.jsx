import React, { useState } from 'react';
import { 
  Stethoscope, 
  Plus, 
  ExternalLink, 
  Calendar, 
  Users, 
  Activity, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles, 
  Eye,
  HeartPulse,
  Phone
} from 'lucide-react';
import { CLINIC_CATEGORIES } from '../../lib/mockData';

export default function DashboardOverview({ clinics = [], onOpenWizard, onSelectClinic }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [copiedSlug, setCopiedSlug] = useState(null);

  const filteredClinics = filterCategory === 'all'
    ? clinics
    : clinics.filter(c => c.category === filterCategory);

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/#/c/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black text-zinc-100 p-4 sm:p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-cyan-950/60 via-zinc-950 to-zinc-950 border border-cyan-500/20 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TECNODIEL CYS — ECOSISTEMA SANITARIO</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Generador de Webs para Clínicas & Salud
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                Crea en 2 minutos la web oficial de tu clínica dental, policlínica o centro de fisioterapia. Con motor de cita previa online directa, soporte para mutuas y cuadro médico.
              </p>
            </div>

            <button
              onClick={onOpenWizard}
              className="btn-industrial px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-sm transition flex items-center gap-2.5 shadow-[0_0_30px_rgba(6,182,212,0.4)] shrink-0 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Crear Nueva Web Clínica</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-white/10 mt-6">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
                <HeartPulse className="w-4 h-4" />
                <span>CLÍNICAS ACTIVAS</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">{clinics.length}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                <Calendar className="w-4 h-4" />
                <span>CITAS ONLINE HOY</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">18</div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
                <Activity className="w-4 h-4" />
                <span>ESPECIALIDADES</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">9</div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>MUTUAS CONECTADAS</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">100%</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl border transition shrink-0 cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Todas las Especialidades ({clinics.length})
          </button>
          {CLINIC_CATEGORIES.map(cat => {
            const count = clinics.filter(c => c.category === cat.id).length;
            const CategoryIcon = cat.id === 'fisioterapia' ? HeartPulse
              : cat.id === 'estetica' ? Sparkles
              : cat.id === 'policlinica' ? Activity
              : cat.id === 'psicologia' ? Users
              : cat.id === 'oftalmologia' ? Eye
              : cat.id === 'veterinaria' ? ShieldCheck
              : Stethoscope;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl border transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                    : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                {count > 0 && <span className="opacity-70">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClinics.map(clinic => {
            const ClinicIcon = clinic.category === 'fisioterapia' ? HeartPulse
              : clinic.category === 'estetica' ? Sparkles
              : clinic.category === 'policlinica' ? Activity
              : clinic.category === 'psicologia' ? Users
              : clinic.category === 'oftalmologia' ? Eye
              : clinic.category === 'veterinaria' ? ShieldCheck
              : Stethoscope;

            return (
              <div
                key={clinic.id || clinic.slug}
                className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-cyan-500/40 transition shadow-xl space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top line */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-cyan-400 shadow-md shrink-0"
                        style={{ backgroundColor: `${clinic.primary_color || '#06b6d4'}25` }}
                      >
                        <ClinicIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition">
                          {clinic.name}
                        </h3>
                        <p className="text-xs text-zinc-400 font-mono">
                          {clinic.collegiate_number || 'Centro Sanitario Autorizado'}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase font-bold shrink-0">
                      Activa 24/7
                    </span>
                  </div>

                  {/* Slogan */}
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                    {clinic.slogan || clinic.description}
                  </p>

                  {/* URLs */}
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">SUBDOMINIO TECNODIEL:</span>
                      <span className="text-cyan-400 font-semibold">{clinic.slug}.tecnodiel.app</span>
                    </div>
                    {clinic.cloudflare_domain && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">CLOUDFLARE PAGES:</span>
                        <span className="text-zinc-300">{clinic.cloudflare_domain}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(clinic.slug)}
                    className="p-2 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5"
                    title="Copiar enlace de la web clínica"
                  >
                    {copiedSlug === clinic.slug ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSlug === clinic.slug ? 'Copiado' : 'Copiar URL'}</span>
                  </button>

                  <a
                    href={`/#/c/${clinic.slug}`}
                    className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Ver Web Clínica</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
