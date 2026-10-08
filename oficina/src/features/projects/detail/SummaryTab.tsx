import { Check, Copy, HandCoins, ShieldCheck, Code2, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Avatar } from '../../../components/ui/Avatar';
import { PARTNER_META } from '../../../lib/partners';
import { formatEuros, formatShortDate } from '../../../lib/format';
import type { PartnerId, Project } from '../../../types';
import { BUSINESS_TYPE_META, LAYOUT_META, STATUS_META } from '../projectMeta';

function Card({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-gray-800 bg-gray-900 p-4 sm:p-5 ${className}`}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">{title}</h3>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="text-sm text-gray-400">{label}</dt>
      <dd className="min-w-0 text-sm text-gray-100 sm:text-right">{children}</dd>
    </div>
  );
}

function CopyValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* portapapeles no disponible */
    }
  };
  return (
    <button
      onClick={copy}
      title="Copiar"
      className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-gray-800 px-2 py-1 font-mono text-xs text-gray-300 hover:text-white"
    >
      <span className="truncate">{value}</span>
      {copied ? <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
    </button>
  );
}

function RoleRow({ icon: Icon, role, share, ids }: { icon: LucideIcon; role: string; share: string; ids: PartnerId[] }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/30 p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{role}</p>
        <p className="text-xs text-gray-500">{share}</p>
      </div>
      <div className="flex -space-x-2">
        {ids.map((id) => (
          <div key={id} title={PARTNER_META[id].name} className="flex items-center gap-2">
            <Avatar partner={{ ...PARTNER_META[id], avatarUrl: null }} size="sm" />
          </div>
        ))}
      </div>
      {ids.length === 1 && <span className="text-sm text-gray-300">{PARTNER_META[ids[0]].name}</span>}
    </li>
  );
}

export function SummaryTab({ project }: { project: Project }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Cliente">
        <dl className="divide-y divide-gray-800">
          <Row label="Negocio">{project.businessName}</Row>
          <Row label="Tipo">{BUSINESS_TYPE_META[project.businessType].label}</Row>
          <Row label="Contacto">{project.client.contactName || '—'}</Row>
          <Row label="Teléfono">
            {project.client.phone ? (
              <a href={`tel:${project.client.phone.replace(/\s/g, '')}`} className="text-indigo-300 hover:underline">
                {project.client.phone}
              </a>
            ) : (
              '—'
            )}
          </Row>
          <Row label="Email">{project.client.email || '—'}</Row>
          <Row label="Localidad">{project.client.city || '—'}</Row>
          {project.businessId && (
            <Row label="business_id (SaaS)">
              <CopyValue value={project.businessId} />
            </Row>
          )}
        </dl>
      </Card>

      <Card title="Proyecto">
        <dl className="divide-y divide-gray-800">
          <Row label="Estado">{STATUS_META[project.status].label}</Row>
          <Row label="Dominio">
            {project.domain ? (
              <a href={`https://${project.domain}`} target="_blank" rel="noreferrer" className="text-indigo-300 hover:underline">
                {project.domain}
              </a>
            ) : (
              'Pendiente'
            )}
          </Row>
          <Row label="Layout">{LAYOUT_META[project.layout].label}</Row>
          <Row label="Precio cerrado">
            <span className="text-base font-semibold text-white">{formatEuros(project.price)}</span>
          </Row>
          <Row label="Inicio">{formatShortDate(project.startedAt)}</Row>
        </dl>
        {project.description && <p className="mt-4 text-sm leading-relaxed text-gray-400">{project.description}</p>}
      </Card>

      <Card title="Roles del proyecto" className="lg:col-span-2">
        <ul className="grid gap-3 md:grid-cols-3">
          <RoleRow icon={HandCoins} role="Cerró la venta" share="20% del reparto" ids={[project.closedBy]} />
          <RoleRow icon={ShieldCheck} role="Auditoría, seguridad y SEO" share="20% del reparto" ids={[project.auditBy]} />
          <RoleRow icon={Code2} role="Desarrollo" share="60% según horas verificadas" ids={project.contributors} />
        </ul>
      </Card>
    </div>
  );
}
