# Oficina Virtual

Panel interno de la agencia (Huelva): sincronización entre socios, reparto del trabajo, horas verificadas, CRM y chats.

> El nombre y el logo se configuran en `src/lib/config.ts`.

## Stack

React + TypeScript + Vite · Tailwind CSS v4 · Lucide · Supabase (Auth, Postgres, Realtime) · Vercel.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # opcional: sin variables arranca en modo demo
npm run dev
```

### Modo demo vs. Supabase

- **Sin** `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`: modo demo. El login muestra un selector de socio. La app arranca vacía (sin datos de ejemplo) y lo que se añade se guarda en el `localStorage` del navegador, así que no se comparte entre ordenadores.
- **Con** ellas: login real con Google. Solo entran las cuentas de Google vinculadas por email a una fila de `partners`.

### Configurar Supabase (proyecto de la Oficina Virtual, separado del SaaS de clientes)

1. Crea un proyecto Supabase nuevo y dedicado.
2. En **Authentication → Providers → Email**, desactiva *Allow new users to sign up*.
3. Edita los emails de `supabase/migrations/20260925000000_partners.sql` y ejecuta las migraciones **en orden** en el SQL Editor (o con `supabase db push`):
   1. `20260925000000_partners.sql`: socios, `is_partner()` y vínculo con Auth.
   2. `20260928000000_oficina.sql`: proyectos, commits, actividad, tareas, chat, horas, fondo, CRM y WhatsApp, con RLS y Realtime.
   3. `20260929…` a `20261001…`: proyectos SaaS multi-tenant (tenants, facturación, integraciones, provisionado).
   4. `20261002000000_workflow_saas_config.sql`: etapas Planeado / En progreso / Hecho, configuración de conexiones por SaaS (`saas_project_config`) y paso `preview` de los tenants.
4. En **Authentication → Users**, invita o crea a Javier y Mario con esos emails. El trigger los vincula solos.
5. Copia la URL y la clave **anon/publishable** a `.env` y a las variables de entorno de Vercel.

**Nunca** pongas la `service_role` ni tokens de GitHub, WhatsApp o Resend en variables `VITE_*`: todo lo que se prefija con `VITE_` acaba en el bundle público. Esos secretos van en Edge Functions.

## Módulos

| Sección | Qué hace |
| --- | --- |
| **Panel** | Kanban de trabajos arriba, integraciones, mis proyectos, horas de hoy, fondo común y actividad en directo. |
| **Proyectos** | Proyectos estándar por categoría (barbería, restaurante, clínica…) y productos **SaaS Multi-Tenant** con su configuración (Supabase, GitHub, Vercel, previews) y sus tenants. |
| **Kanban** | Un cliente por tarjeta, sea proyecto estándar o tenant de un SaaS: Planeado (cita para cerrarlo) → En progreso (con "esperando al cliente") → Hecho. Las tareas técnicas viven en la pestaña Desarrollo de cada proyecto. |
| **Tenants** | Asistente por fases: lo esencial (nombre, slug, tipo, `business_id` nuevo o vinculado, layout y plan) y lo opcional (contacto, redes, ubicación, dominio, cobro). Al guardar se crea la preview `<slug>-<sufijo>.vercel.app` en Vercel y se ve la web real o simulada en su ficha. |
| **Horas y Reparto** | Check-in por proyecto, sesiones verificadas por push (o validadas por otro socio), tope de 8 h/día, calculadora de reparto y fondo común. |
| **CRM** | Pipeline de leads de Contactado a Cerrado, ficha con notas y próximo paso, y conversión del lead en proyecto. |
| **Chats** | Bandeja de WhatsApp Business con clientes y chat interno del equipo (también en el botón flotante). |

Todo lo que es relevante (pushes, check-ins, tareas, avisos, cobros, leads…) aparece en **Actividad del equipo**, y la campana de notificaciones recoge lo que te toca: horas por validar, seguimientos del CRM, WhatsApp sin leer y avisos.

### Reglas del reparto

Están en `src/features/hours/repartoConfig.ts` y son una propuesta inicial. De cada cobro: **20 %** al fondo común, **10 %** a quien cerró la venta, **5 %** a quien audita y el **65 %** restante según las horas verificadas en ese proyecto. El fondo mantiene una reserva mínima de 300 € que no se reparte.

### Integraciones pendientes (Edge Functions)

Los datos de GitHub, Vercel y WhatsApp están simulados. Para conectarlos hacen falta Edge Functions con sus tokens como secretos de Supabase:

- `github-webhook`: recibe los eventos `push` y rellena `commits` (y la actividad).
- `whatsapp-webhook`: recibe mensajes y estados de la Cloud API de Meta en `client_messages`, y otra función envía las respuestas.

## Estructura

```
src/
  components/     UI compartida (layout, avatar, tarjetas…)
  features/       Un módulo por dominio: auth, checkin, dashboard, projects, kanban, chat,
                  hours, crm, chats, notifications…
  hooks/          Hooks genéricos
  lib/            Configuración, cliente Supabase, navegación, formato
  types/          Tipos compartidos
supabase/migrations/  SQL con RLS
```

Cada módulo expone sus datos mediante un servicio o hook (`checkinService`, `useTeam`, `useNotifications`…). Pasar de mock a Supabase consiste en cambiar la implementación del servicio, sin tocar los componentes.
