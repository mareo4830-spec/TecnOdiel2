import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CalendarClock, Check, CircleDashed, ExternalLink, Globe, Hourglass, LayoutDashboard,
  Loader2, Rocket, ShieldCheck, Sparkles, Wallet,
} from 'lucide-react';
import { client, useAccount } from '../lib/adminAuth';
import { ProfileButton } from '../components/home/AccountMenu';
import { APP_URLS } from '../config/apps';

/*
 * Portal del cliente. Entra con su cuenta de Google (la misma del formulario) y ve solo lo suyo:
 * la BD aplica la regla (RLS: clients.owner_user_id = auth.uid()), esta página solo lo pinta.
 *
 * Un cliente cerrado a mano por un socio no tiene cuenta vinculada: `claim_my_clients()` le
 * asigna al entrar los clientes sin propietario cuyo email coincide con el de su cuenta.
 */

const eur = (n) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(n) || 0);
const day = (d) => (d ? new Date(d.length === 10 ? `${d}T12:00:00` : d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '—');

const CLIENT_STATUS = {
  solicitud: { label: 'Solicitud recibida', tone: 'bg-amber-500/15 text-amber-300 ring-amber-500/30' },
  activo: { label: 'Cliente activo', tone: 'bg-[#6DD94B]/15 text-[#6DD94B] ring-[#6DD94B]/30' },
  pausado: { label: 'En pausa', tone: 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/30' },
  baja: { label: 'De baja', tone: 'bg-rose-500/15 text-rose-300 ring-rose-500/30' },
};

// Mismas tres etapas que el Kanban del equipo, con palabras de cliente.
const STAGES = [
  { id: 'planeado', label: 'Preparando', hint: 'Cerramos los detalles contigo' },
  { id: 'en_progreso', label: 'En desarrollo', hint: 'Estamos construyendo tu web' },
  { id: 'hecho', label: 'Entregado', hint: 'Tu web está publicada' },
];

const PAYMENT_LABEL = {
  deposit: 'Entrada (50 %)',
  final: 'Pago final',
  single: 'Pago único',
  maintenance: 'Mantenimiento anual',
  ai: 'Asistente IA (mensual)',
};

// ---------------------------------------------------------------- datos

function usePortalData(enabled) {
  const [state, setState] = useState({ loading: true, error: null, clients: [], projects: [], tenants: [], payments: [] });

  const load = useCallback(async () => {
    try {
      // Antes de leer: vincula los clientes cerrados a mano cuyo email coincide con esta cuenta.
      await client.rpc('claim_my_clients');
      const [clients, projects, tenants, payments] = await Promise.all([
        client.from('clients').select('id, business_name, contact_name, status, created_at').order('created_at', { ascending: false }),
        client.from('projects').select('id, client_id, name, business_name, status, progress, waiting_client, meeting, preview_url, domain, started_at').order('started_at', { ascending: false }),
        client.from('tenants').select('id, client_id, name, status, stage, waiting_client, meeting, preview_host, domain, created_at').order('created_at', { ascending: false }),
        client.from('tenant_payments').select('id, tenant_id, concept, amount, due_date, paid_at').order('due_date', { ascending: true, nullsFirst: false }),
      ]);
      const failed = [clients, projects, tenants, payments].find((r) => r.error);
      if (failed) throw failed.error;
      setState({ loading: false, error: null, clients: clients.data, projects: projects.data, tenants: tenants.data, payments: payments.data });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e?.message || 'No se han podido cargar tus datos.' }));
    }
  }, []);

  useEffect(() => {
    if (!enabled || !client) return undefined;
    let timer;
    const reload = () => { clearTimeout(timer); timer = setTimeout(load, 300); };
    load();
    // Lo que haga el equipo (mover tu proyecto, marcar un pago) aparece sin recargar.
    const channel = client.channel(`portal-${Math.random().toString(36).slice(2, 8)}`);
    ['clients', 'projects', 'tenants', 'tenant_payments'].forEach((table) =>
      channel.on('postgres_changes', { event: '*', schema: 'public', table }, reload));
    channel.subscribe();
    return () => { clearTimeout(timer); client.removeChannel(channel); };
  }, [enabled, load]);

  return state;
}

// ---------------------------------------------------------------- piezas

function Shell({ account, onNavigateToLanding, children }) {
  return (
    <div className="min-h-[100dvh] bg-[#121212] font-['Montserrat',Inter,system-ui,sans-serif] text-white antialiased selection:bg-[#6DD94B] selection:text-black">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#121212]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <button onClick={onNavigateToLanding} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> <span className="font-bold text-white">Tecn<span className="text-[#6DD94B]">Odiel</span></span>
          </button>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold uppercase tracking-widest text-zinc-500 sm:block">Mi portal</span>
            {account.role === 'client' && <ProfileButton account={account} />}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">{children}</main>
    </div>
  );
}

function Notice({ icon: Icon, title, children, action }) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#6DD94B]/15 text-[#6DD94B]"><Icon className="h-6 w-6" /></div>
      <h1 className="mt-4 text-xl font-bold">{title}</h1>
      <div className="mt-2 text-sm leading-relaxed text-zinc-400">{children}</div>
      {action}
    </div>
  );
}

const primaryBtn = 'mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#6DD94B] px-6 py-3 text-sm font-bold text-black transition hover:brightness-110';

const PERKS = [
  { icon: Rocket, title: 'El avance de tu web', text: 'En qué fase está y cuándo se publica.' },
  { icon: CalendarClock, title: 'Tus reuniones', text: 'Fecha, hora y lugar de la próxima cita.' },
  { icon: Wallet, title: 'Tus pagos', text: 'Qué has pagado y qué queda pendiente.' },
];

function FirstAccess({ onSignIn, onRequest }) {
  return (
    <div className="mx-auto grid max-w-4xl items-center gap-10 py-4 md:grid-cols-2 md:py-10">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#6DD94B]">Primer acceso</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">Tu web, <span className="text-[#6DD94B]">a la vista.</span></h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">Entra con la cuenta de Google con la que nos enviaste tu solicitud. Sin contraseñas ni claves: tu portal se activa solo.</p>
        <button onClick={onSignIn} className="mt-7 flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-white px-6 text-sm font-semibold text-black shadow-lg transition hover:bg-zinc-100 active:scale-[0.98] sm:w-auto">
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continuar con Google
        </button>
        {onRequest && (
          <p className="mt-5 text-xs text-zinc-500">¿Aún no tienes web con nosotros? <button onClick={onRequest} className="cursor-pointer font-semibold text-[#6DD94B] hover:underline">Solicita la tuya</button></p>
        )}
      </div>
      <ul className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#6DD94B]/15 text-[#6DD94B]"><Icon className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs leading-snug text-zinc-400">{text}</p>
            </div>
          </li>
        ))}
        <li className="flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-zinc-500"><ShieldCheck className="h-3.5 w-3.5 text-[#6DD94B]" />Solo tú ves lo de tu negocio.</li>
      </ul>
    </div>
  );
}

function Stepper({ stage }) {
  const current = Math.max(0, STAGES.findIndex((s) => s.id === stage));
  return (
    <ol className="grid grid-cols-3 gap-2">
      {STAGES.map((s, i) => {
        const done = i < current || (stage === 'hecho' && i === current);
        const active = i === current && stage !== 'hecho';
        return (
          <li key={s.id} className="min-w-0">
            <div className={`h-1.5 rounded-full ${done || active ? 'bg-[#6DD94B]' : 'bg-white/10'} ${active ? 'animate-pulse' : ''}`} />
            <p className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${done || active ? 'text-white' : 'text-zinc-500'}`}>
              {done ? <Check className="h-3.5 w-3.5 text-[#6DD94B]" /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6DD94B]" /> : <CircleDashed className="h-3.5 w-3.5" />}
              <span className="truncate">{s.label}</span>
            </p>
            <p className="mt-0.5 hidden text-[11px] leading-snug text-zinc-500 sm:block">{s.hint}</p>
          </li>
        );
      })}
    </ol>
  );
}

function Meeting({ meeting }) {
  if (!meeting?.date) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl bg-sky-500/10 p-3 text-sm text-sky-200 ring-1 ring-sky-500/25">
      <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
      <p><span className="font-semibold">Próxima reunión:</span> {day(meeting.date)}{meeting.time ? ` a las ${meeting.time}` : ''}{meeting.place ? ` · ${meeting.place}` : ''}</p>
    </div>
  );
}

function Waiting() {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200 ring-1 ring-amber-500/25">
      <Hourglass className="mt-0.5 h-4 w-4 shrink-0" />
      <p><span className="font-semibold">Necesitamos algo de ti.</span> Estamos esperando tus datos (textos, fotos, horarios…) para seguir. Escríbenos o responde a nuestro último mensaje.</p>
    </div>
  );
}

function LinkPill({ href, icon: Icon, children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 ring-1 ring-white/10 transition hover:bg-[#6DD94B] hover:text-black hover:ring-[#6DD94B]">
      <Icon className="h-3.5 w-3.5" />{children}<ExternalLink className="h-3 w-3 opacity-60" />
    </a>
  );
}

function WorkCard({ title, subtitle, stage, progress, waiting, meeting, previewUrl, liveUrl, payments }) {
  const pending = payments.filter((p) => !p.paid_at).reduce((s, p) => s + Number(p.amount), 0);
  return (
    <article className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">{title}</h3>
          {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {liveUrl && <LinkPill href={liveUrl} icon={Globe}>Tu web</LinkPill>}
          {!liveUrl && previewUrl && <LinkPill href={previewUrl} icon={Sparkles}>Ver avance</LinkPill>}
        </div>
      </div>

      <Stepper stage={stage} />

      {typeof progress === 'number' && stage !== 'hecho' && (
        <div>
          <div className="mb-1 flex justify-between text-xs text-zinc-500"><span>Progreso</span><span>{progress} %</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#6DD94B]" style={{ width: `${progress}%` }} /></div>
        </div>
      )}

      {stage === 'en_progreso' && waiting && <Waiting />}
      {stage === 'planeado' && <Meeting meeting={meeting} />}

      {payments.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500"><Wallet className="h-3.5 w-3.5" />Pagos</h4>
            {pending > 0 && <span className="text-xs text-zinc-400">Pendiente: <span className="font-semibold text-white">{eur(pending)}</span></span>}
          </div>
          <ul className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10">
            {payments.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{PAYMENT_LABEL[p.concept] ?? p.concept}</p>
                  <p className="text-xs text-zinc-500">{p.paid_at ? `Pagado el ${day(p.paid_at)}` : p.due_date ? `Vence el ${day(p.due_date)}` : 'Sin fecha'}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-semibold tabular-nums">{eur(p.amount)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${p.paid_at ? 'bg-[#6DD94B]/15 text-[#6DD94B] ring-[#6DD94B]/30' : 'bg-amber-500/15 text-amber-300 ring-amber-500/30'}`}>
                    {p.paid_at ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function RequestTimeline() {
  const steps = [
    { label: 'Solicitud enviada', done: true },
    { label: 'Te llamamos para cerrar los detalles', done: false },
    { label: 'Desarrollamos tu web', done: false },
    { label: 'Entrega y publicación', done: false },
  ];
  return (
    <ol className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      {steps.map((s, i) => (
        <li key={s.label} className="flex items-center gap-3 text-sm">
          <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${s.done ? 'bg-[#6DD94B] text-black' : 'bg-white/10 text-zinc-500'}`}>
            {s.done ? <Check className="h-3.5 w-3.5" /> : i + 1}
          </span>
          <span className={s.done ? 'font-semibold text-white' : 'text-zinc-400'}>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

function ClientSection({ c, projects, tenants, payments }) {
  const status = CLIENT_STATUS[c.status] ?? CLIENT_STATUS.activo;
  const works = [
    ...projects.map((p) => ({
      key: `p-${p.id}`, title: p.business_name, subtitle: p.name, stage: p.status, progress: p.progress, waiting: p.waiting_client,
      meeting: p.meeting, previewUrl: p.preview_url, liveUrl: p.domain && p.status === 'hecho' ? `https://${p.domain}` : null, payments: [],
    })),
    ...tenants.map((t) => ({
      key: `t-${t.id}`, title: t.name, subtitle: 'Tu web', stage: t.stage, progress: undefined, waiting: t.waiting_client, meeting: t.meeting,
      previewUrl: t.preview_host ? `https://${t.preview_host}` : null,
      liveUrl: t.status === 'live' && t.domain ? `https://${t.domain}` : null,
      payments: payments.filter((p) => p.tenant_id === t.id),
    })),
  ];
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold sm:text-3xl">{c.business_name}</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${status.tone}`}>{status.label}</span>
      </div>
      {works.length === 0 ? (
        c.status === 'solicitud' ? (
          <>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
              Hemos recibido tu solicitud, {c.contact_name?.split(' ')[0] || 'gracias'}. Un socio de TecnOdiel te contactará en breve para ajustar los detalles y darte el presupuesto cerrado.
            </p>
            <RequestTimeline />
          </>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-400">Todavía no hay ningún trabajo en marcha para este negocio.</p>
        )
      ) : (
        <div className="grid gap-4">{works.map(({ key, ...w }) => <WorkCard key={key} {...w} />)}</div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- página

export default function ClientPortalPage({ onNavigateToLanding, onNavigateToMultiwebs }) {
  const account = useAccount();
  const isClient = account.role === 'client';
  const data = usePortalData(isClient);

  const byClient = useMemo(() => data.clients.map((c) => ({
    c,
    projects: data.projects.filter((p) => p.client_id === c.id),
    tenants: data.tenants.filter((t) => t.client_id === c.id),
  })), [data]);

  let body;
  if (!account.enabled) {
    body = <Notice icon={LayoutDashboard} title="Portal no disponible">Ahora mismo no podemos conectar con tu cuenta. Inténtalo de nuevo en unos minutos.</Notice>;
  } else if (account.role === 'loading') {
    body = <div className="grid place-items-center py-24 text-zinc-500"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  } else if (account.role === 'guest') {
    body = <FirstAccess onSignIn={account.signIn} onRequest={onNavigateToMultiwebs} />;
  } else if (account.role === 'admin') {
    body = (
      <Notice
        icon={LayoutDashboard}
        title="Esta es la vista de cliente"
        action={<a href={APP_URLS.oficina} className={primaryBtn}>Ir a la Oficina Virtual <ArrowRight className="h-4 w-4" /></a>}
      >
        Entraste con una cuenta del equipo. Los clientes ven aquí solo lo suyo; tú gestionas todo desde la Oficina Virtual.
      </Notice>
    );
  } else if (data.loading) {
    body = <div className="grid place-items-center py-24 text-zinc-500"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  } else if (data.error) {
    body = <Notice icon={LayoutDashboard} title="No hemos podido cargar tu portal">{data.error}</Notice>;
  } else if (byClient.length === 0) {
    body = (
      <Notice
        icon={Sparkles}
        title="Aún no tienes ninguna solicitud"
        action={<button onClick={onNavigateToMultiwebs} className={primaryBtn}>Solicitar mi web <ArrowRight className="h-4 w-4" /></button>}
      >
        Cuéntanos sobre tu negocio en el formulario y, al enviarlo, tu portal se activa automáticamente con esta misma cuenta.
      </Notice>
    );
  } else {
    body = (
      <div className="space-y-12">
        <div>
          <p className="text-sm text-zinc-500">Hola, {account.profile?.name?.split(' ')[0] || 'bienvenido'}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Tu portal de <span className="text-[#6DD94B]">TecnOdiel</span></h1>
        </div>
        {byClient.map(({ c, projects, tenants }) => <ClientSection key={c.id} c={c} projects={projects} tenants={tenants} payments={data.payments} />)}
      </div>
    );
  }

  return <Shell account={account} onNavigateToLanding={onNavigateToLanding}>{body}</Shell>;
}
