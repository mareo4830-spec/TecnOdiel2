import { ExternalLink, Lock, Monitor, RotateCw, Smartphone } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SiteContent } from '../../../types';
import { LIVE_PREVIEW_ORIGIN, LIVE_PREVIEW_READY, LIVE_PREVIEW_URL, livePreviewMessage } from '../livePreview';
import { buildTenantSite, type SiteData } from '../tenantSite';

type Device = 'desktop' | 'mobile';

interface SitePreviewProps {
  data: SiteData;
  /** URL de la web real (preview de Vercel o dominio). Sin ella solo hay vista simulada. */
  liveUrl?: string | null;
  /** Empezar mostrando la web real si existe. */
  preferLive?: boolean;
  /** Altura del marco en escritorio. */
  height?: string;
  compact?: boolean;
  /** Contenido de la web: con él, la vista es la portada real del SaaS repintada en vivo. */
  content?: SiteContent;
}

/** Marco de navegador con la web del tenant: la real (iframe) o la simulada con sus datos. */
export function SitePreview({ data, liveUrl = null, preferLive = false, height = 'h-[560px]', compact = false, content }: SitePreviewProps) {
  const [device, setDevice] = useState<Device>(compact ? 'mobile' : 'desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const [live, setLive] = useState(Boolean(liveUrl && preferLive));
  const showLive = live && Boolean(liveUrl);
  // Portada real en vivo (asistente): la demo del SaaS pintada con lo que se está editando.
  const realtime = content !== undefined && !showLive;
  const srcDoc = useMemo(() => (showLive || realtime ? undefined : buildTenantSite(data)), [showLive, realtime, data]);
  const shownUrl = showLive ? liveUrl! : (liveUrl ?? (data.previewHost ? `https://${data.previewHost}` : 'vista-previa.local'));

  const frame = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => (realtime ? livePreviewMessage(data, content) : null), [realtime, data, content]);
  const latest = useRef(message);
  latest.current = message;
  useEffect(() => {
    if (message) frame.current?.contentWindow?.postMessage(message, LIVE_PREVIEW_ORIGIN);
  }, [message]);
  useEffect(() => {
    if (!realtime) return;
    // La portada avisa cuando ya escucha (al cargar o al recargar): se le manda el estado actual.
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== LIVE_PREVIEW_ORIGIN || e.source !== frame.current?.contentWindow) return;
      if ((e.data as { type?: string } | null)?.type === LIVE_PREVIEW_READY && latest.current) {
        frame.current?.contentWindow?.postMessage(latest.current, LIVE_PREVIEW_ORIGIN);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [realtime]);

  const tab = (active: boolean) =>
    `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-gray-800 px-3 py-2 text-xs text-gray-400">
          <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="truncate font-mono">{shownUrl.replace('https://', '')}</span>
          {realtime ? (
            <span className="ml-auto shrink-0 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300">PORTADA REAL</span>
          ) : (
            !showLive && (
              <span className="ml-auto shrink-0 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">SIMULADA</span>
            )
          )}
        </div>
        {liveUrl && (
          <div className="flex rounded-xl bg-gray-800 p-1" role="radiogroup" aria-label="Qué web ver">
            <button role="radio" aria-checked={showLive} onClick={() => setLive(true)} className={tab(showLive)}>
              Real
            </button>
            <button role="radio" aria-checked={!showLive} onClick={() => setLive(false)} className={tab(!showLive)}>
              Simulada
            </button>
          </div>
        )}
        <div className="flex rounded-xl bg-gray-800 p-1" role="radiogroup" aria-label="Dispositivo">
          {(
            [
              ['desktop', Monitor, 'Escritorio'],
              ['mobile', Smartphone, 'Móvil'],
            ] as const
          ).map(([value, Icon, label]) => (
            <button
              key={value}
              role="radio"
              aria-checked={device === value}
              aria-label={label}
              onClick={() => setDevice(value)}
              className={tab(device === value)}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
        <button
          onClick={() => setReloadKey((k) => k + 1)}
          aria-label="Recargar"
          className="grid h-9 w-9 place-items-center rounded-xl bg-gray-800 text-gray-400 hover:text-white"
        >
          <RotateCw className="h-4 w-4" />
        </button>
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir en otra pestaña"
            className="grid h-9 w-9 place-items-center rounded-xl bg-gray-800 text-gray-400 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="flex justify-center overflow-hidden rounded-xl bg-gray-950 p-0 sm:p-3">
        <div
          className={`overflow-hidden bg-white transition-all duration-300 ${
            device === 'mobile'
              ? 'h-[600px] w-full max-w-[340px] rounded-[2rem] border-[10px] border-gray-800 shadow-2xl'
              : `${height} w-full rounded-lg`
          }`}
        >
          <iframe
            ref={frame}
            key={`${device}-${reloadKey}-${showLive}`}
            title={`Vista previa de ${data.name || 'el negocio'}`}
            src={showLive ? liveUrl! : realtime ? LIVE_PREVIEW_URL : undefined}
            srcDoc={srcDoc}
            // srcDoc hereda nuestro origen: la simulada va sin permisos. La real es de otro origen.
            sandbox={showLive || realtime ? 'allow-scripts allow-same-origin allow-forms allow-popups' : 'allow-popups'}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
