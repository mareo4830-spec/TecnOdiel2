/**
 * Identidad de la agencia. El nombre y el logo definitivos aún no están decididos:
 * cámbialos aquí y se actualizan en login, sidebar y título de la pestaña.
 */
export const APP_CONFIG: {
  name: string;
  shortName: string;
  /** URL o ruta en /public del logo. Si es null se muestra el monograma con `shortName`. */
  logoUrl: string | null;
  location: string;
} = {
  name: 'Oficina Virtual',
  shortName: 'OV',
  logoUrl: null,
  location: 'Huelva',
};

/** URLs de las otras ventanas del ecosistema TecnOdiel (cada una es un proyecto de Vercel con su subdominio). */
export const APP_URLS = {
  landing: import.meta.env.VITE_LANDING_URL || '/',
  portal: import.meta.env.VITE_PORTAL_URL || '/portal',
};

/** Datos para construir los enlaces de "Accesos rápidos". Solo URLs públicas, nunca tokens. */
export const EXTERNAL_LINKS = {
  /** Slug del equipo en Vercel (vercel.com/<equipo>/<proyecto>). */
  vercelTeam: 'tu-equipo',
  /** Referencia del proyecto Supabase de PRODUCCIÓN del SaaS (solo para enlazar a su panel). */
  saasSupabaseRef: 'ref-proyecto-saas',
  /** Dominio de la agencia para las previews de los tenants: https://<slug>.<este dominio>. Igual que AGENCY_PREVIEW_DOMAIN. */
  agencyPreviewDomain: 'preview.tu-agencia.es',
};
