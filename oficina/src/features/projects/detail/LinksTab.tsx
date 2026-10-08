import { Database, ExternalLink, Github, Globe, Triangle, type LucideIcon } from 'lucide-react';
import { EXTERNAL_LINKS } from '../../../lib/config';
import type { Project } from '../../../types';

interface QuickLink {
  label: string;
  description: string;
  href: string | null;
  icon: LucideIcon;
  tint: string;
}

export function LinksTab({ project }: { project: Project }) {
  const links: QuickLink[] = [
    {
      label: 'GitHub',
      description: `${project.repo.fullName} · ${project.repo.branch}`,
      href: `https://github.com/${project.repo.fullName}/tree/${project.repo.branch}`,
      icon: Github,
      tint: 'bg-gray-700/40 text-gray-200',
    },
    {
      label: 'Vercel',
      description: `Proyecto ${project.vercelProject} y sus deployments`,
      href: `https://vercel.com/${EXTERNAL_LINKS.vercelTeam}/${project.vercelProject}`,
      icon: Triangle,
      tint: 'bg-white/10 text-white',
    },
    {
      label: 'Supabase (SaaS)',
      description: project.businessId
        ? `Negocio ${project.businessId.slice(0, 8)}… en la tabla businesses`
        : 'Tabla businesses del SaaS (un negocio por tenant)',
      href: `https://supabase.com/dashboard/project/${EXTERNAL_LINKS.saasSupabaseRef}/editor`,
      icon: Database,
      tint: 'bg-emerald-500/15 text-emerald-300',
    },
    {
      label: 'Dominio',
      description: project.domain ?? 'Todavía sin dominio asignado',
      href: project.domain ? `https://${project.domain}` : null,
      icon: Globe,
      tint: 'bg-indigo-500/15 text-indigo-300',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {links.map(({ label, description, href, icon: Icon, tint }) => {
        const content = (
          <>
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tint}`}>
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{label}</p>
              <p className="truncate text-sm text-gray-400">{description}</p>
            </div>
            {href && <ExternalLink className="h-4 w-4 shrink-0 text-gray-500 transition group-hover:text-indigo-300" />}
          </>
        );
        const className =
          'group flex items-center gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-4 transition sm:p-5';
        return href ? (
          <a key={label} href={href} target="_blank" rel="noreferrer" className={`${className} hover:border-indigo-500/50`}>
            {content}
          </a>
        ) : (
          <div key={label} className={`${className} opacity-60`}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
