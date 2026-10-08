// URLs de cada "ventana" del ecosistema TecnOdiel. Por defecto cuelgan del mismo dominio
// (/, /oficina/, /portal); cuando haya subdominios reales se ponen en las variables de entorno.
export const APP_URLS = {
  landing: import.meta.env.VITE_LANDING_URL || '/',
  oficina: import.meta.env.VITE_OFICINA_URL || '/oficina/',
  portal: import.meta.env.VITE_PORTAL_URL || '/portal',
};
