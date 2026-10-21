import {
  ArrowUpRight,
  Bot,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Flame,
  Globe,
  Loader2,
  MapPin,
  MessageCircle,
  Plus,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../lib/toast';
import { useAuth } from '../auth/authContext';
import { createLead } from '../crm/leadService';
import {
  analyzeProspect,
  type ProspectAgentStep,
  type ProspectAnalysis,
} from './prospectService';

const inputClass =
  'h-11 w-full rounded-xl border border-gray-800 bg-gray-950 px-3.5 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all';

const POPULAR_SECTORS = [
  'Clínica Dental',
  'Restaurante / Bar',
  'Peluquería y Estética',
  'Taller Mecánico',
  'Fisioterapia',
  'Gimnasio / Box',
  'Reformas y Pintura',
];

const POPULAR_CITIES = ['Huelva', 'Sevilla', 'Punta Umbría', 'Aljaraque', 'Lepe', 'Moguer'];

function AnalysisCard({
  analysis,
  onCopy,
  onAddToCrm,
}: {
  analysis: ProspectAnalysis;
  onCopy: () => void;
  onAddToCrm: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [seoOpen, setSeoOpen] = useState(true);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [addedToCrm, setAddedToCrm] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(analysis.mensaje_comercial);
      setCopied(true);
      onCopy();
      setTimeout(() => setCopied(false), 2400);
    } catch {
      toast('No se pudo copiar al portapapeles');
    }
  };

  const handleWhatsapp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(analysis.mensaje_comercial)}`;
    window.open(url, '_blank');
  };

  const handleCrm = () => {
    onAddToCrm();
    setAddedToCrm(true);
    toast('¡Lead añadido con éxito al pipeline del CRM!');
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cabecera del Dossier */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-gray-900 p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Dossier Comercial Automatizado
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
              5 Agentes Aprobado
            </span>
          </div>
          <h2 className="text-base font-bold text-white sm:text-lg">{analysis.negocio_tipo}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3.5 py-2 text-xs font-bold text-gray-950 shadow-md transition hover:bg-gray-200 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copiar mensaje</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Búsqueda Optimizada en Google & Maps */}
      <section className="space-y-2.5 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-500/15 text-sky-400">
            <Search className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Búsqueda Optimizada de Prospección
            </h3>
            <p className="text-[11px] text-gray-400">Localiza negocios potenciales reales con un solo clic</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href={analysis.busqueda_optimizada.url_google}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20 hover:text-white"
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Google: {analysis.busqueda_optimizada.query_google}</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>
          <a
            href={analysis.busqueda_optimizada.url_maps}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20 hover:text-white"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Google Maps: {analysis.busqueda_optimizada.query_maps}</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>
        </div>
      </section>

      {/* 2. Diagnóstico de Presencia Digital (Agente 2 - Auditor Técnico) */}
      <section className="space-y-3 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-500/15 text-rose-400">
            <Target className="h-4 w-4" />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
            Diagnóstico Digital & Puntos Débiles Críticos
          </h3>
          <span className="ml-auto rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 ring-1 ring-rose-500/25">
            Agente 2 · Auditor Técnico
          </span>
        </div>
        <p className="text-sm leading-relaxed text-gray-300">{analysis.diagnostico.resumen}</p>
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-semibold text-rose-400">3 Puntos débiles detectados:</h4>
          <ul className="space-y-2">
            {analysis.diagnostico.puntos_debiles.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 rounded-xl bg-gray-950/60 p-2.5 text-xs text-gray-300 border border-rose-500/10">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-400">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Oportunidades de SEO Local (Agente 3 - Estratega SEO) */}
      <section className="space-y-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <button
          type="button"
          onClick={() => setSeoOpen((open) => !open)}
          className="flex w-full items-center gap-2 text-left"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Oportunidades de SEO Local & Tráfico
            </h3>
            <span className="text-[10px] text-gray-400">Agente 3 · Estratega SEO</span>
          </div>
          <span className="ml-auto text-gray-500">
            {seoOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {seoOpen && (
          <div className="space-y-3 pt-1">
            <div>
              <span className="mb-1.5 block text-xs font-semibold text-emerald-400">Palabras clave transaccionales:</span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.oportunidades_seo.keywords_objetivo.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 ring-1 ring-emerald-500/25"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">{analysis.oportunidades_seo.estrategia}</p>
            <div className="space-y-1.5 pt-1">
              <h4 className="text-xs font-semibold text-emerald-400">Quick wins de rápida victoria:</h4>
              {analysis.oportunidades_seo.quick_wins.map((quickWin, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-gray-300">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>{quickWin}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. Mensaje Comercial Ultra-personalizado (Agente 4 - Copywriter + Agente 5 QA) */}
      <section className="space-y-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4 sm:p-5 shadow-lg shadow-indigo-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Flame className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Mensaje de Propuesta Comercial Ultra-Personalizado
              </h3>
              <p className="text-[11px] text-gray-400">Listo para enviar por WhatsApp o Email frío</p>
            </div>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300 ring-1 ring-indigo-500/30">
            Validado por QA (100% Persuasivo)
          </span>
        </div>

        <div className="relative rounded-xl border border-indigo-500/20 bg-gray-950/90 p-4">
          <p className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-gray-200">
            {analysis.mensaje_comercial}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:from-indigo-500 hover:to-purple-500 active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>¡Mensaje copiado!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copiar mensaje</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsapp}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 hover:text-white active:scale-95 cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Abrir en WhatsApp</span>
          </button>

          <button
            type="button"
            disabled={addedToCrm}
            onClick={handleCrm}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-800/80 px-4 py-2.5 text-xs font-semibold text-gray-200 transition hover:bg-gray-700 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            {addedToCrm ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Guardado en CRM</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-indigo-400" />
                <span>Añadir como Lead al CRM</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* 5. Desplegable: Debate Secuencial de los 5 Agentes */}
      <section className="rounded-2xl border border-gray-800 bg-gray-900/60 p-4">
        <button
          type="button"
          onClick={() => setAgentsOpen((o) => !o)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold text-gray-300">
              Cadena de Razonamiento del Equipo Multiagente (5 Roles)
            </h3>
          </div>
          <span className="text-xs text-gray-400">
            {agentsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>

        {agentsOpen && (
          <div className="mt-4 space-y-3 border-t border-gray-800 pt-3">
            {analysis.cadena_agentes.map((ag: ProspectAgentStep, idx: number) => (
              <div key={idx} className="rounded-xl border border-gray-800/80 bg-gray-950 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300">{ag.agente}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{ag.rol}</span>
                </div>
                <p className="text-gray-400 leading-relaxed">{ag.aporte}</p>
                {ag.score_calidad && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-400 font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Control de Calidad: {ag.score_calidad}/100 — {ag.veredicto_qa}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function ProspectPage() {
  const { partner } = useAuth();
  const navigate = useNavigate();
  const [sector, setSector] = useState('');
  const [city, setCity] = useState('');
  const [hasWeb, setHasWeb] = useState<'si' | 'no' | 'desconocido'>('no');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<{ index: number; name: string; role: string } | null>(null);
  const [result, setResult] = useState<ProspectAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!sector.trim() || !city.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const response = await analyzeProspect(sector.trim(), city.trim(), {
      hasWeb: hasWeb === 'si' ? true : hasWeb === 'no' ? false : undefined,
      onStepChange: (index, name, role) => {
        setCurrentStep({ index, name, role });
      },
    });

    setLoading(false);
    setCurrentStep(null);

    if (response.ok && response.analysis) {
      setResult(response.analysis);
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } else {
      setError(response.error || 'No se pudo completar el análisis multiagente.');
    }
  };

  const handleAddToCrm = () => {
    if (!result || !partner) return;
    createLead(
      {
        businessName: `${result.sector} en ${result.localidad}`,
        contactName: 'Gerente / Responsable',
        businessType: result.sector.toLowerCase().includes('clinic') || result.sector.toLowerCase().includes('dent')
          ? 'clinica'
          : result.sector.toLowerCase().includes('pelu') || result.sector.toLowerCase().includes('estet')
          ? 'peluqueria'
          : 'restaurante',
        city: result.localidad,
        phone: '',
        email: '',
        source: 'puerta_fria',
        owner: partner.id,
        estimatedValue: 850,
      },
      partner.id,
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 ring-1 ring-indigo-500/30">
            <Radar className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">Prospección Comercial IA (5 Roles)</h1>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 ring-1 ring-indigo-500/25">
                Multiagente
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Equipo autónomo de 5 agentes: Investigador, Auditor Técnico, Estratega SEO, Copywriter y Director QA.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/crm')}
          className="text-xs font-medium text-gray-400 hover:text-white"
        >
          Ir al CRM &rarr;
        </button>
      </div>

      {/* Formulario de 1 Clic */}
      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-800 bg-gray-900 p-5 sm:p-6 shadow-xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-gray-300">Sector del negocio</span>
            <input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Ej: Clínica Dental, Restaurante, Peluquería…"
              className={inputClass}
              autoFocus
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-gray-300">Localidad / Ciudad</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej: Huelva, Sevilla, Punta Umbría, Lepe…"
              className={inputClass}
            />
          </label>
        </div>

        {/* Píldoras de sugerencias rápidas */}
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
            <span className="text-[11px] text-gray-400 font-medium">Sectores habituales:</span>
            {POPULAR_SECTORS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSector(s)}
                className="rounded-lg border border-gray-800 bg-gray-950 px-2.5 py-1 text-[11px] text-gray-300 transition hover:border-indigo-500/50 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
            <span className="text-[11px] text-gray-400 font-medium">Localidades:</span>
            {POPULAR_CITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className="rounded-lg border border-gray-800 bg-gray-950 px-2.5 py-1 text-[11px] text-gray-300 transition hover:border-indigo-500/50 hover:text-white"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Estado web */}
        <div className="flex items-center gap-3 border-t border-gray-800/80 pt-3">
          <span className="text-xs font-medium text-gray-400">¿Tiene página web actualmente?</span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'no', label: 'Sin web / solo redes' },
              { id: 'si', label: 'Sí, pero deficiente' },
              { id: 'desconocido', label: 'Auditar ambos' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setHasWeb(opt.id as any)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                  hasWeb === opt.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-950 text-gray-400 border border-gray-800 hover:text-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botón Principal de 1 Clic */}
        <button
          type="submit"
          disabled={loading || !sector.trim() || !city.trim()}
          className="relative inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.99] cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {currentStep ? `${currentStep.name}: ${currentStep.role}…` : 'Iniciando deliberación multiagente…'}
              </span>
            </div>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Ejecutar Prospección con 5 Agentes IA</span>
            </>
          )}
        </button>
      </form>

      {/* Stepper en tiempo real mientras procesa */}
      {loading && currentStep && (
        <div className="space-y-3 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300">Paso {currentStep.index} de 5</span>
            <span className="text-gray-400">{currentStep.name}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(currentStep.index / 5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-300 italic">{currentStep.role}…</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          <strong>Error en prospección:</strong> {error}
        </div>
      )}

      {/* Resultado Final */}
      <div ref={resultRef}>
        {result && (
          <AnalysisCard
            analysis={result}
            onCopy={() => toast('Mensaje copiado al portapapeles')}
            onAddToCrm={handleAddToCrm}
          />
        )}
      </div>
    </div>
  );
}
