import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  FolderPlus,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Rocket,
  Send,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../components/ui/Avatar';
import { MOCK_PARTNERS, PARTNER_META } from '../../../lib/partners';
import { formatRelative, formatShortDate } from '../../../lib/format';
import { toast } from '../../../lib/toast';
import type { Lead, LeadStage, PartnerId } from '../../../types';
import { useAuth } from '../../auth/authContext';
import { BUSINESS_TYPE_META } from '../../projects/projectMeta';
import { ALL_STAGES, SOURCE_LABEL, STAGE_META, whatsappLink } from '../leadMeta';
import { addLeadNote, deployLeadWeb, moveLead, updateLead } from '../leadService';

const inputClass =
  'h-10 w-full rounded-xl border border-gray-800 bg-gray-950 px-3 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-gray-400">{label}</span>
      {children}
    </label>
  );
}

interface LeadDrawerProps {
  lead: Lead;
  onClose: () => void;
  onConvert: () => void;
}

export function LeadDrawer({ lead, onClose, onConvert }: LeadDrawerProps) {
  const { partner } = useAuth();
  const [note, setNote] = useState('');
  const [value, setValue] = useState(String(lead.estimatedValue));
  const [nextAction, setNextAction] = useState(lead.nextAction);
  const [isDeploying, setIsDeploying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Al cambiar de lead se reinician los campos editables.
  useEffect(() => {
    setValue(String(lead.estimatedValue));
    setNextAction(lead.nextAction);
    setNote('');
  }, [lead.id, lead.estimatedValue, lead.nextAction]);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const saveValue = () => {
    const n = Number(value.replace(',', '.'));
    if (Number.isFinite(n) && n >= 0 && n !== lead.estimatedValue) updateLead(lead.id, { estimatedValue: n });
    else setValue(String(lead.estimatedValue));
  };

  const submitNote = (e: FormEvent) => {
    e.preventDefault();
    if (!partner || !note.trim()) return;
    addLeadNote(lead.id, note, partner.id);
    setNote('');
  };

  const handleLaunchWeb = async () => {
    setIsDeploying(true);
    try {
      const res = await deployLeadWeb(lead.id, partner?.id);
      if (res.success) {
        toast(`Web lanzada en Cloudflare: ${res.url}`);
      } else {
        toast(res.error || 'No se pudo lanzar la web');
      }
    } catch (_) {
      toast('Error inesperado al conectar con Cloudflare');
    } finally {
      setIsDeploying(false);
    }
  };

  const activeUrl = lead.cloudflareUrl || (lead.siteDeployed && lead.slug ? `https://${lead.slug}.pages.dev` : null);

  const handleCopyLink = () => {
    if (!activeUrl) return;
    try {
      navigator.clipboard.writeText(activeUrl);
      setCopiedLink(true);
      toast('Enlace copiado al portapapeles');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (_) {}
  };

  const type = BUSINESS_TYPE_META[lead.businessType];
  const TypeIcon = type.icon;

  const wpLaunchMessage = activeUrl
    ? `¡Hola ${lead.contactName}! Aquí tienes el enlace de tu nueva web para ${lead.businessName} lista para revisar: ${activeUrl}`
    : `Hola ${lead.contactName}, soy ${partner?.name ?? ''} de TecnOdiel.`;

  const contacts = [
    { href: `tel:${lead.phone.replace(/\s/g, '')}`, icon: Phone, label: 'Llamar' },
    { href: whatsappLink(lead.phone, wpLaunchMessage), icon: MessageCircle, label: activeUrl ? 'Enviar Web (WA)' : 'WhatsApp' },
    { href: `mailto:${lead.email}`, icon: Mail, label: 'Email' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div aria-hidden onClick={onClose} className="anim-backdrop absolute inset-0 bg-black/60" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Ficha de ${lead.businessName}`}
        className="anim-drawer relative flex h-full w-full flex-col overflow-hidden border-l border-gray-800 bg-gray-900 shadow-2xl sm:max-w-md"
      >
        <header className="flex items-start gap-3 border-b border-gray-800 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))]">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${type.tint}`}>
            <TypeIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-semibold text-white">{lead.businessName}</h2>
            <p className="text-xs text-gray-400">
              {type.label} · {lead.city} · {SOURCE_LABEL[lead.source]}
            </p>
          </div>
          <button ref={closeRef} onClick={onClose} aria-label="Cerrar ficha" className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {/* SECCIÓN LANZAR WEB & CLOUDFLARE PAGES */}
          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/15 text-amber-400">
                  <Globe className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Despliegue Cloudflare Pages
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    {activeUrl ? 'URL pública en producción' : 'Genera una URL *.pages.dev gratuita'}
                  </span>
                </div>
              </div>
              {activeUrl && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Activa
                </span>
              )}
            </div>

            {activeUrl ? (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-black/60 px-3 py-2 text-xs font-mono text-amber-300">
                  <span className="truncate flex-1">{activeUrl}</span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copiar URL"
                    className="shrink-0 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
                  >
                    {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <a
                    href={activeUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="Abrir web en nueva pestaña"
                    className="shrink-0 p-1 rounded-lg text-amber-400 hover:text-white hover:bg-amber-500/20 transition"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="flex gap-2">
                  <a
                    href={whatsappLink(lead.phone, wpLaunchMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500 transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Enviar enlace por WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={handleLaunchWeb}
                    disabled={isDeploying}
                    className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-gray-700 transition"
                    title="Re-desplegar o regenerar URL"
                  >
                    {isDeploying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Regenerar'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLaunchWeb}
                disabled={isDeploying}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-amber-900/30 hover:from-amber-400 hover:to-orange-400 transition cursor-pointer disabled:opacity-60"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                    <span>Conectando con Cloudflare...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 text-black" />
                    <span>Lanzar web (Cloudflare Pages)</span>
                  </>
                )}
              </button>
            )}
          </section>

          {/* DATOS DE CONTACTO */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Avatar partner={{ name: lead.contactName, initials: lead.contactName.charAt(0), avatarUrl: null, color: 'from-gray-600 to-gray-700' }} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{lead.contactName}</p>
                <p className="truncate text-xs text-gray-400">
                  {lead.phone} · {lead.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {contacts.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1 rounded-xl bg-gray-800/60 py-2.5 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white text-center"
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate w-full px-1">{label}</span>
                </a>
              ))}
            </div>
          </section>

          {/* DETALLES DE LA SOLICITUD (SERVICIOS Y PLANTILLA) */}
          {(lead.services?.length || lead.templateId) && (
            <section className="rounded-xl border border-gray-800 bg-gray-800/40 p-3 space-y-2">
              <h3 className="text-xs font-semibold text-gray-300">Petición del formulario</h3>
              {lead.templateId && (
                <p className="text-xs text-gray-400">
                  <span className="text-gray-500">Plantilla/Estilo:</span> <span className="text-white font-medium">{lead.templateName || lead.templateId}</span>
                </p>
              )}
              {lead.services && lead.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lead.services.map((s, idx) => (
                    <span key={idx} className="rounded-md bg-gray-700/60 px-2 py-0.5 text-[11px] text-gray-300">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="grid grid-cols-2 gap-3">
            <Field label="Etapa">
              <select
                value={lead.stage}
                onChange={(e) => partner && moveLead(lead.id, e.target.value as LeadStage, partner.id)}
                className={inputClass}
              >
                {ALL_STAGES.map((s) => (
                  <option key={s} value={s}>{STAGE_META[s].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Responsable">
              <select value={lead.owner} onChange={(e) => updateLead(lead.id, { owner: e.target.value as PartnerId })} className={inputClass}>
                {MOCK_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Presupuesto (€)">
              <input value={value} inputMode="decimal" onChange={(e) => setValue(e.target.value)} onBlur={saveValue} className={inputClass} />
            </Field>
            <Field label="Próximo paso (fecha)">
              <input
                type="date"
                value={lead.nextActionDate ?? ''}
                onChange={(e) => updateLead(lead.id, { nextActionDate: e.target.value || null })}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </Field>
            <div className="col-span-2">
              <Field label="Próximo paso">
                <input
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  onBlur={() => nextAction !== lead.nextAction && updateLead(lead.id, { nextAction: nextAction.trim() })}
                  placeholder="Ej. Enviar propuesta o enlace de Cloudflare"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section>
            {lead.projectId ? (
              <Link
                to={`/proyectos/${lead.projectId}`}
                className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/15"
              >
                Ver el proyecto de este cliente
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              lead.stage !== 'perdido' && (
                <button
                  onClick={onConvert}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 hover:from-emerald-500 hover:to-teal-500"
                >
                  <FolderPlus className="h-4 w-4" />
                  Venta cerrada: convertir en proyecto
                </button>
              )
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white">Notas</h3>
            <ul className="mt-3 space-y-3">
              {lead.notes.length === 0 && <li className="text-sm text-gray-500">Todavía no hay notas.</li>}
              {[...lead.notes].reverse().map((n) => (
                <li key={n.id} className="flex gap-2.5">
                  <Avatar partner={{ ...PARTNER_META[n.author], avatarUrl: null }} size="xs" />
                  <div className="min-w-0 flex-1 rounded-xl bg-gray-800/60 px-3 py-2">
                    <p className="text-xs text-gray-400">
                      <span className="font-semibold text-gray-200">{PARTNER_META[n.author].name}</span> · {formatRelative(n.createdAt)}
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap text-sm text-gray-200">{n.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={submitNote} className="mt-3 flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Añadir nota…" aria-label="Nueva nota" className={inputClass} />
              <button type="submit" disabled={!note.trim()} aria-label="Guardar nota" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-500">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </section>

          <p className="text-xs text-gray-500">
            Creado el {formatShortDate(lead.createdAt)} · actualizado {formatRelative(lead.updatedAt)}
          </p>
        </div>
      </aside>
    </div>
  );
}
