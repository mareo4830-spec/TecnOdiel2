import { ExternalLink, Lock, Monitor, RotateCw, Smartphone } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Project } from '../../../types';
import { buildMockSite } from '../mockSite';

type Device = 'desktop' | 'mobile';

export function PreviewTab({ project }: { project: Project }) {
  const [device, setDevice] = useState<Device>('desktop');
  const [reloadKey, setReloadKey] = useState(0);
  const isMock = !project.previewUrl;
  const srcDoc = useMemo(() => (isMock ? buildMockSite(project) : undefined), [isMock, project]);
  const shownUrl = project.previewUrl ?? (project.domain ? `https://${project.domain}` : 'vista-previa.local');

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-gray-800 px-3 py-2 text-xs text-gray-400">
          <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="truncate font-mono">{shownUrl}</span>
          {isMock && (
            <span className="ml-auto shrink-0 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
              SIMULADA
            </span>
          )}
        </div>

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
              onClick={() => setDevice(value)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                device === value ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
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
        {!isMock && (
          <a
            href={project.previewUrl!}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir en otra pestaña"
            className="grid h-9 w-9 place-items-center rounded-xl bg-gray-800 text-gray-400 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="flex justify-center overflow-hidden rounded-xl bg-gray-950 p-0 sm:p-4">
        <div
          className={`overflow-hidden bg-white transition-all duration-300 ${
            device === 'mobile'
              ? 'h-[667px] w-full max-w-[375px] rounded-[2rem] border-[10px] border-gray-800 shadow-2xl'
              : 'h-[560px] w-full rounded-lg sm:h-[640px]'
          }`}
        >
          <iframe
            key={`${device}-${reloadKey}`}
            title={`Vista previa de ${project.businessName}`}
            src={project.previewUrl ?? undefined}
            srcDoc={srcDoc}
            // srcDoc hereda nuestro origen: la vista simulada va sin permisos. La web real es de otro origen.
            sandbox={isMock ? '' : 'allow-scripts allow-same-origin allow-forms allow-popups'}
            className="h-full w-full"
          />
        </div>
      </div>

      {isMock && (
        <p className="mt-3 text-xs text-gray-500">
          Vista generada con el layout y el tipo de negocio del proyecto. Cuando exista el Preview Deployment de Vercel se
          cargará aquí la web real.
        </p>
      )}
    </section>
  );
}
