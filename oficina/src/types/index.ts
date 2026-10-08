import type { LucideIcon } from 'lucide-react';

export type PartnerId = 'javier' | 'dani' | 'mario';

export interface Partner {
  id: PartnerId;
  name: string;
  initials: string;
  email: string;
  avatarUrl: string | null;
  /** Clases de degradado de Tailwind para el avatar (ej. "from-sky-500 to-indigo-600"). */
  color: string;
  availability: string;
}

export type PresenceStatus = 'online' | 'checked_in' | 'offline';

export interface CheckinSession {
  id: string;
  partnerId: PartnerId;
  /** Se elegirá al hacer check-in a partir de la Fase 3. */
  projectId: string | null;
  startedAt: string;
  endedAt: string | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  /** Ruta de la app donde se resuelve la notificación. */
  to?: string;
}

export interface NavItem {
  path: string;
  label: string;
  title: string;
  icon: LucideIcon;
  phase: number;
  description: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';
export type AuthMode = 'supabase' | 'demo';

// ---------------------------------------------------------------------------
// Proyectos (Fase 2)
// ---------------------------------------------------------------------------

/** Categoría del negocio del cliente (proyectos estándar y vertical de un SaaS). */
export type BusinessType =
  | 'barberia'
  | 'peluqueria'
  | 'salon'
  | 'estetica'
  | 'restaurante'
  | 'cafeteria'
  | 'clinica'
  | 'tienda'
  | 'otro';

/** Mismos valores que businesses.layout_key del SaaS. */
export type LayoutVariant = 'classic' | 'editorial' | 'minimal' | 'playful';

/**
 * Etapa de un trabajo en el Kanban (proyecto estándar o tenant de un SaaS):
 * planeado = hay que ir a cerrarlo con el cliente · en_progreso = el cliente dijo que sí
 * (desarrollando, personalizando o esperando sus datos) · hecho = entregado.
 */
export type WorkStage = 'planeado' | 'en_progreso' | 'hecho';
export type ProjectStatus = WorkStage;

/** Cita para ir a cerrar el trabajo con el cliente (columna Planeado). */
export interface PlannedMeeting {
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM */
  time: string | null;
  place: string;
}

/** Campos del Kanban de trabajos, comunes a proyectos estándar y tenants. */
export interface BoardFields {
  /** En progreso pero parado a la espera de datos del cliente. */
  waitingClient: boolean;
  meeting: PlannedMeeting | null;
  /** Posición dentro de su columna del Kanban. */
  boardOrder: number;
}

export interface ProjectClient {
  contactName: string;
  phone: string;
  email: string;
  city: string;
}

/**
 * standard = web de un cliente (un negocio). saas = el producto multi-tenant: el repo core
 * contiene muchos negocios (tenants), cada uno con sus datos, facturación y provisionado.
 */
export type ProjectKind = 'standard' | 'saas';

/** Cómo se construye la URL de preview de cada tenant. */
export type PreviewMode = 'vercel_app' | 'agency_domain';

/**
 * Conexiones de un proyecto SaaS. Solo referencias y nombres de secretos: las claves reales
 * viven como secretos de las Edge Functions (supabase secrets set …), nunca aquí.
 */
export interface SaasProjectConfig {
  /** https://<ref>.supabase.co del Supabase de producción del SaaS. */
  supabaseUrl: string;
  supabaseRef: string;
  /** Nombre del secreto con la service_role del SaaS (p. ej. SAAS_SERVICE_ROLE_KEY). */
  serviceRoleSecret: string;
  vercelTeamSlug: string;
  vercelTeamId: string;
  vercelProjectId: string;
  /** Nombre del secreto con el token de Vercel (p. ej. VERCEL_TOKEN). */
  vercelTokenSecret: string;
  previewMode: PreviewMode;
  /** vercel_app: <slug>-<sufijo>.vercel.app (los .vercel.app son globales: el sufijo evita choques). */
  vercelAppSuffix: string;
  /** agency_domain: <slug>.<dominio>. */
  agencyPreviewDomain: string;
  defaultDnsProvider: DnsProviderId | null;
}

export interface Project extends BoardFields {
  id: string;
  kind: ProjectKind;
  /** Nombre del trabajo (ej. "Landing Page Barbería"). */
  name: string;
  description: string;
  /**
   * `businesses.id` en el Supabase de producción del SaaS (solo la referencia, nunca sus datos).
   * Null en proyectos `saas`: cada tenant guarda el suyo.
   */
  businessId: string | null;
  businessName: string;
  businessType: BusinessType;
  layout: LayoutVariant;
  status: ProjectStatus;
  /** 0–100 */
  progress: number;
  /** Precio cerrado en euros. */
  price: number;
  closedBy: PartnerId;
  auditBy: PartnerId;
  contributors: PartnerId[];
  client: ProjectClient;
  /** Dominio de `business_domains`. */
  domain: string | null;
  repo: { fullName: string; branch: string };
  vercelProject: string;
  /** Web en vivo o Preview Deployment de Vercel. Null = preview simulada. */
  previewUrl: string | null;
  /** Solo en proyectos `saas`. */
  saas: SaasProjectConfig | null;
  startedAt: string;
  updatedAt: string;
}

export type NewProjectInput = Pick<
  Project,
  | 'kind'
  | 'name'
  | 'businessId'
  | 'businessName'
  | 'businessType'
  | 'layout'
  | 'price'
  | 'closedBy'
  | 'auditBy'
  | 'domain'
> & {
  saas?: SaasProjectConfig | null;
  repo?: Project['repo'];
  vercelProject?: string;
  status?: ProjectStatus;
  meeting?: PlannedMeeting | null;
};

export interface Commit {
  sha: string;
  projectId: string;
  author: PartnerId;
  message: string;
  branch: string;
  additions: number;
  deletions: number;
  committedAt: string;
}

export type ActivityType =
  | 'push'
  | 'checkin'
  | 'checkout'
  | 'project_created'
  | 'status'
  | 'deploy'
  | 'task'
  | 'chat'
  | 'hours'
  | 'fund'
  | 'lead';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  partnerId: PartnerId;
  projectId: string | null;
  /** Texto tras el nombre del socio, ej. "hizo push en". */
  action: string;
  /** Detalle opcional, ej. el mensaje del commit. */
  detail?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Kanban (Fase 3)
// ---------------------------------------------------------------------------

export type TaskStatus = 'por_hacer' | 'en_progreso' | 'hecho';
export type TaskTag = 'frontend' | 'backend' | 'seo' | 'seguridad' | 'cliente' | 'devops' | 'diseno';
export type TaskPriority = 'baja' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  assignees: PartnerId[];
  tags: TaskTag[];
  /** Fecha de entrega, formato YYYY-MM-DD. */
  dueDate: string | null;
  priority: TaskPriority;
  /** Posición dentro de su columna. */
  order: number;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Chat interno (Fase 4)
// ---------------------------------------------------------------------------

/** `aviso` = mensaje destacado que el resto del equipo tiene que ver sí o sí. */
export type ChatMessageKind = 'mensaje' | 'aviso';

export interface ChatMessage {
  id: string;
  author: PartnerId;
  text: string;
  kind: ChatMessageKind;
  /** Proyecto al que se refiere el mensaje, si lo hay. */
  projectId: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Horas y reparto (Fase 5)
// ---------------------------------------------------------------------------

/** Sesión cerrada (check-in → check-out) que cuenta para el reparto. */
export interface WorkSession {
  id: string;
  partnerId: PartnerId;
  projectId: string;
  startedAt: string;
  endedAt: string;
  /** Validación manual de otro socio cuando no hubo push durante la sesión. */
  approvedBy: PartnerId | null;
}

export type SessionVerification = 'push' | 'aprobada' | 'pendiente';

export type FundMovementType = 'aportacion' | 'gasto';

export interface FundMovement {
  id: string;
  type: FundMovementType;
  concept: string;
  /** Siempre positivo; el signo lo da `type`. */
  amount: number;
  projectId: string | null;
  createdBy: PartnerId;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// CRM (Fase 6)
// ---------------------------------------------------------------------------

export type LeadStage = 'contactado' | 'interesado' | 'propuesta' | 'negociacion' | 'cerrado' | 'perdido';
export type LeadSource = 'puerta_fria' | 'instagram' | 'recomendacion' | 'google' | 'whatsapp' | 'formulario_web';

export interface LeadNote {
  id: string;
  author: PartnerId;
  text: string;
  createdAt: string;
}

/** Lo que rellenó el visitante en tecnodiel.com/formulario. Solo presente si source='formulario_web'. */
export interface LeadIntake {
  ambiente: string;
  features: string[];
  layoutFamily: LayoutVariant;
  layoutVariant: string;
  accentOverride: string | null;
  ourPrice: number;
  referencePrice: number;
}

export interface Lead {
  id: string;
  businessName: string;
  businessType: BusinessType;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  source: LeadSource;
  stage: LeadStage;
  /** Solo si llegó de tecnodiel.com/formulario: lo que eligió (funciones, estilo, precio mostrado). */
  intake: LeadIntake | null;
  /** Presupuesto estimado en euros. */
  estimatedValue: number;
  owner: PartnerId;
  /** Próximo paso acordado, formato YYYY-MM-DD. */
  nextActionDate: string | null;
  nextAction: string;
  notes: LeadNote[];
  /** Proyecto creado al convertir el lead. */
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Chats con clientes (Fase 7)
// ---------------------------------------------------------------------------

export type ClientMessageDirection = 'entrante' | 'saliente';
export type ClientMessageStatus = 'enviado' | 'entregado' | 'leido';

export interface ClientMessage {
  id: string;
  direction: ClientMessageDirection;
  text: string;
  /** Socio que respondió (solo en salientes). */
  sentBy: PartnerId | null;
  status: ClientMessageStatus;
  createdAt: string;
}

export interface ClientConversation {
  id: string;
  contactName: string;
  businessName: string;
  phone: string;
  projectId: string | null;
  leadId: string | null;
  assignedTo: PartnerId | null;
  messages: ClientMessage[];
  /** Hasta dónde se leyó la conversación en la oficina. */
  lastReadAt: string;
}

export type IntegrationStatus = 'connected' | 'demo' | 'pending';

export interface Integration {
  id: 'supabase' | 'github' | 'vercel' | 'whatsapp';
  name: string;
  status: IntegrationStatus;
  details: { label: string; value: string }[];
}

// ---------------------------------------------------------------------------
// SaaS multi-tenant (proyectos kind = 'saas')
// ---------------------------------------------------------------------------

export type TenantBusinessType =
  | 'barberia'
  | 'peluqueria'
  | 'salon'
  | 'estetica'
  | 'restaurante'
  | 'cafeteria'
  | 'clinica'
  | 'otro';
export type TenantStatus = 'draft' | 'provisioning' | 'live' | 'suspended' | 'error';
export type DnsProviderId = 'cloudflare' | 'ionos';
export type PaymentMode = 'single' | 'split_50_50';
export type PaymentConcept = 'deposit' | 'final' | 'single' | 'maintenance' | 'ai';
export type IntegrationProvider = 'places' | 'supabase' | 'preview' | 'vercel' | 'dns' | 'onesignal' | 'gsc';
export type TenantIntegrationStatus = 'pending' | 'running' | 'ok' | 'error' | 'skipped';
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
/** { mon: [["09:30", "13:30"], ["16:30", "20:30"]], … }. Un día sin tramos está cerrado. */
export type OpeningHours = Partial<Record<Weekday, [string, string][]>>;
/** Lo que exige la regla de go-live (tenant_missing_requirements en la BD). */
export type TenantRequirement =
  | 'name'
  | 'business_type'
  | 'layout'
  | 'plan'
  | 'domain'
  | 'opening_hours'
  | 'address'
  | 'payment';

export interface SaasPlan {
  id: string;
  name: string;
  /** plans.code del SaaS (basic | pro | premium). */
  saasPlanCode: string;
  setupPrice: number;
  yearlyMaintenance: number;
  monthlyAi: number;
  features: Record<string, boolean>;
}

export type SocialNetwork = 'instagram' | 'facebook' | 'tiktok' | 'google';
export type TenantSocials = Partial<Record<SocialNetwork, string>>;

export interface Tenant extends BoardFields {
  id: string;
  projectId: string;
  /**
   * `businesses.id` en el Supabase del SaaS. Se fija al crear el tenant (generado o vinculado a
   * un negocio que ya existe) y el provisionado crea o actualiza esa misma fila.
   */
  saasBusinessId: string | null;
  /** Etapa en el Kanban de trabajos. */
  stage: WorkStage;
  name: string;
  slug: string;
  tagline: string | null;
  logoUrl: string | null;
  businessType: TenantBusinessType | null;
  layout: LayoutVariant | null;
  /** Una de las 5 variantes del layout (p. ej. editorial_magazine). Null = la primera. */
  layoutVariant: string | null;
  planId: string | null;
  googleMapsUrl: string | null;
  googlePlaceId: string | null;
  openingHours: OpeningHours | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  domain: string | null;
  dnsProvider: DnsProviderId | null;
  /** Host de la preview (p. ej. salon-aurora-vd.vercel.app). Se crea en Vercel al guardar. */
  previewHost: string | null;
  /** Contacto público del negocio (se publica en la web). */
  phone: string | null;
  whatsapp: string | null;
  publicEmail: string | null;
  socials: TenantSocials;
  status: TenantStatus;
  createdBy: PartnerId | null;
  createdAt: string;
  updatedAt: string;
}

/** Datos personales y fiscales del cliente. Todo opcional; solo los ven los admin. */
export interface TenantContact {
  tenantId: string;
  fullName: string | null;
  nif: string | null;
  legalEmail: string | null;
  billingEmail: string | null;
  phone: string | null;
  fiscalAddress: string | null;
}

export interface TenantBilling {
  tenantId: string;
  closedPrice: number;
  paymentMode: PaymentMode;
  maintenanceYearly: number;
  /** YYYY-MM-DD. Se fija al salir a live. */
  maintenanceRenewal: string | null;
}

export interface TenantPayment {
  id: string;
  tenantId: string;
  concept: PaymentConcept;
  amount: number;
  /** YYYY-MM-DD */
  dueDate: string | null;
  paidAt: string | null;
  method: string | null;
}

export interface TenantIntegration {
  tenantId: string;
  provider: IntegrationProvider;
  status: TenantIntegrationStatus;
  externalId: string | null;
  meta: Record<string, unknown>;
  error: string | null;
  lastSyncAt: string | null;
}

export interface ProvisioningLogEntry {
  id: string;
  tenantId: string;
  /** Proveedor, 'go-live', 'start' o 'sync'. */
  step: string;
  ok: boolean;
  detail: string;
  actor: string;
  at: string;
}
