-- =====================================================================
-- FASES 2–7 · Datos de la Oficina Virtual
-- Proyecto Supabase de la OFICINA VIRTUAL (NO el de producción del SaaS).
-- Requiere la migración de la Fase 1 (tabla partners y función is_partner()).
--
-- Todas las tablas son internas: solo los socios autenticados pueden leer y
-- escribir. Los secretos (GitHub, Vercel, WhatsApp) viven en Edge Functions,
-- que escriben con la service_role y se saltan RLS.
-- =====================================================================

-- 1. Proyectos (Fase 2) ---------------------------------------------------
create table if not exists public.projects (
  id             text primary key,                       -- slug legible
  name           text not null,
  description    text not null default '',
  business_id    uuid not null,                          -- businesses.id del SaaS (solo la referencia)
  business_name  text not null,
  business_type  text not null check (business_type in ('barberia', 'peluqueria', 'restaurante', 'clinica')),
  layout         text not null check (layout in ('clasico', 'moderno', 'minimal')),
  status         text not null default 'propuesta'
                 check (status in ('propuesta', 'en_desarrollo', 'revision', 'publicado', 'mantenimiento')),
  progress       smallint not null default 0 check (progress between 0 and 100),
  price          numeric(10, 2) not null check (price >= 0),
  closed_by      text not null references public.partners (id),
  audit_by       text not null references public.partners (id),
  contributors   text[] not null default '{}',
  client_contact text not null default '',
  client_phone   text not null default '',
  client_email   text not null default '',
  client_city    text not null default 'Huelva',
  domain         text,
  repo_full_name text not null,
  repo_branch    text not null,
  vercel_project text not null,
  preview_url    text,
  started_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Commits que guarda la Edge Function `github-webhook` al recibir eventos push.
create table if not exists public.commits (
  sha          text primary key,
  project_id   text not null references public.projects (id) on delete cascade,
  author       text not null references public.partners (id),
  message      text not null,
  branch       text not null,
  additions    integer not null default 0,
  deletions    integer not null default 0,
  committed_at timestamptz not null
);
create index if not exists commits_project_idx on public.commits (project_id, committed_at desc);
create index if not exists commits_author_idx on public.commits (author, committed_at desc);

-- Timeline "Actividad del equipo".
create table if not exists public.activity (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('push', 'checkin', 'checkout', 'project_created', 'status', 'deploy',
                                           'task', 'chat', 'hours', 'fund', 'lead')),
  partner_id text not null references public.partners (id),
  project_id text references public.projects (id) on delete set null,
  action     text not null,
  detail     text,
  created_at timestamptz not null default now()
);
create index if not exists activity_created_idx on public.activity (created_at desc);

-- 2. Kanban (Fase 3) ------------------------------------------------------
create table if not exists public.tasks (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  project_id text not null references public.projects (id) on delete cascade,
  status     text not null default 'por_hacer' check (status in ('por_hacer', 'en_progreso', 'hecho')),
  assignees  text[] not null default '{}',
  tags       text[] not null default '{}',
  due_date   date,
  priority   text not null default 'media' check (priority in ('baja', 'media', 'alta')),
  "order"    integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists tasks_column_idx on public.tasks (status, "order");

-- 3. Chat interno (Fase 4) ------------------------------------------------
create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  author     text not null references public.partners (id),
  text       text not null check (char_length(text) between 1 and 1000),
  kind       text not null default 'mensaje' check (kind in ('mensaje', 'aviso')),
  project_id text references public.projects (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_created_idx on public.chat_messages (created_at);

-- Hasta dónde ha leído cada socio (contador de no leídos).
create table if not exists public.chat_reads (
  partner_id   text primary key references public.partners (id),
  last_read_at timestamptz not null default now()
);

-- 4. Horas y reparto (Fase 5) --------------------------------------------
-- Una fila por check-in. Mientras ended_at es null, la sesión está en curso.
create table if not exists public.work_sessions (
  id          uuid primary key default gen_random_uuid(),
  partner_id  text not null references public.partners (id),
  project_id  text references public.projects (id) on delete set null,
  started_at  timestamptz not null default now(),
  ended_at    timestamptz,
  approved_by text references public.partners (id),
  check (ended_at is null or ended_at >= started_at),
  check (approved_by is null or approved_by <> partner_id)   -- nadie valida sus propias horas
);
-- Un socio solo puede tener una sesión abierta a la vez.
create unique index if not exists work_sessions_one_open_idx on public.work_sessions (partner_id) where ended_at is null;
create index if not exists work_sessions_project_idx on public.work_sessions (project_id, started_at desc);

create table if not exists public.fund_movements (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('aportacion', 'gasto')),
  concept    text not null,
  amount     numeric(10, 2) not null check (amount > 0),
  project_id text references public.projects (id) on delete set null,
  created_by text not null references public.partners (id),
  created_at timestamptz not null default now()
);

-- 5. CRM (Fase 6) ---------------------------------------------------------
create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  business_name    text not null,
  business_type    text not null check (business_type in ('barberia', 'peluqueria', 'restaurante', 'clinica')),
  contact_name     text not null,
  phone            text not null,
  email            text not null default '',
  city             text not null default 'Huelva',
  source           text not null check (source in ('puerta_fria', 'instagram', 'recomendacion', 'google', 'whatsapp')),
  stage            text not null default 'contactado'
                   check (stage in ('contactado', 'interesado', 'propuesta', 'negociacion', 'cerrado', 'perdido')),
  estimated_value  numeric(10, 2) not null default 0 check (estimated_value >= 0),
  owner            text not null references public.partners (id),
  next_action_date date,
  next_action      text not null default '',
  project_id       text references public.projects (id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.lead_notes (
  id         uuid primary key default gen_random_uuid(),
  lead_id    uuid not null references public.leads (id) on delete cascade,
  author     text not null references public.partners (id),
  text       text not null,
  created_at timestamptz not null default now()
);

-- 6. Chats con clientes · WhatsApp Business (Fase 7) ----------------------
-- La Edge Function `whatsapp-webhook` inserta los entrantes y actualiza los estados.
create table if not exists public.client_conversations (
  id            uuid primary key default gen_random_uuid(),
  contact_name  text not null,
  business_name text not null,
  phone         text not null unique,                    -- wa_id en formato internacional
  project_id    text references public.projects (id) on delete set null,
  lead_id       uuid references public.leads (id) on delete set null,
  assigned_to   text references public.partners (id),
  last_read_at  timestamptz not null default now()
);

create table if not exists public.client_messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.client_conversations (id) on delete cascade,
  wa_message_id   text unique,                           -- id de Meta, para actualizar el estado
  direction       text not null check (direction in ('entrante', 'saliente')),
  text            text not null,
  sent_by         text references public.partners (id),
  status          text not null default 'enviado' check (status in ('enviado', 'entregado', 'leido')),
  created_at      timestamptz not null default now()
);
create index if not exists client_messages_conv_idx on public.client_messages (conversation_id, created_at);

-- 7. updated_at automático ------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();

-- 8. RLS: solo socios, en todas las tablas --------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'projects', 'commits', 'activity', 'tasks', 'chat_messages', 'chat_reads', 'work_sessions',
    'fund_movements', 'leads', 'lead_notes', 'client_conversations', 'client_messages'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('drop policy if exists "Solo socios" on public.%I', t);
    execute format(
      'create policy "Solo socios" on public.%I for all to authenticated using (public.is_partner()) with check (public.is_partner())',
      t
    );
  end loop;
end;
$$;

-- Los commits y los mensajes entrantes de clientes solo los escriben las Edge Functions.
revoke insert, update, delete on public.commits from authenticated;
revoke insert, delete on public.client_messages from authenticated;
grant insert (conversation_id, direction, text, sent_by) on public.client_messages to authenticated;

-- El historial de actividad y del fondo no se reescribe: solo se añade.
revoke update, delete on public.activity from authenticated;
revoke update, delete on public.fund_movements from authenticated;

-- 9. Realtime ---------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'projects', 'commits', 'activity', 'tasks', 'chat_messages', 'chat_reads', 'work_sessions',
    'fund_movements', 'leads', 'lead_notes', 'client_conversations', 'client_messages'
  ]
  loop
    if not exists (
      select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end;
$$;
