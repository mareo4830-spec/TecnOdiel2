// Configuración centralizada de subdominios y enlaces de TecnOdiel
// Puedes cambiar estas URLs en cualquier momento por tus subdominios reales

export const SUBDOMAINS = {
  restaurants: {
    id: 'restaurantes',
    name: 'Restaurantes & Hostelería',
    tagline: 'Cartas Digitales QR, Reservas Directas 0€ Comisión y Sistema Anti-plantones',
    url: 'https://restaurantes.tecnodiel.com', // Cambia aquí tu subdominio
    target: '_self', // '_self' para abrir en la misma pestaña o '_blank' para nueva pestaña
    badge: 'SUBDOMINIO // HOSTELERÍA',
    accentColor: 'emerald',
    metrics: [
      { label: 'Carga de Carta', value: '< 0.18s' },
      { label: 'Comisiones', value: '0€ (Tuya 100%)' },
      { label: 'Reservas Mesa', value: 'Directo WhatsApp' }
    ],
    features: [
      'Carta digital táctil ultrarrápida (adiós a los PDFs pesados)',
      'Motor de reservas propio sin pagar a intermediarios',
      'Cobro de fianza previa para evitar mesas vacías'
    ]
  },
  businesses: {
    id: 'negocios',
    name: 'Comercios & Negocios Locales',
    tagline: 'Páginas web que posicionan Nº1 en Google Maps y captan clientes en 1 clic',
    url: 'https://negocios.tecnodiel.com', // Cambia aquí tu subdominio
    target: '_self',
    badge: 'SUBDOMINIO // SERVICIOS & COMERCIO',
    accentColor: 'cyan',
    metrics: [
      { label: 'Google Maps', value: 'Top #1 Local' },
      { label: 'Contacto', value: '1 Clic WhatsApp' },
      { label: 'Conversión', value: '+45% Clientes' }
    ],
    features: [
      'Diseño prémium a medida para clínicas, reformas y tiendas',
      'Optimización total para móviles y llamadas inmediatas',
      'Posicionamiento local para superar a tu competencia en Huelva'
    ]
  },
  audit: {
    id: 'auditoria',
    name: 'Diagnóstico & Presupuesto',
    tagline: 'Calcula el presupuesto cerrado y los beneficios para tu negocio en 60 segundos',
    url: 'https://presupuesto.tecnodiel.com', // Cambia aquí tu subdominio
    target: '_self',
    badge: 'HERRAMIENTA // PRESUPUESTO INMEDIATO',
    accentColor: 'violet',
    metrics: [
      { label: 'Respuesta', value: '< 24 Horas' },
      { label: 'Presupuesto', value: 'Cerrado 100%' },
      { label: 'Trato', value: 'Directo en Huelva' }
    ],
    features: [
      'Sin compromisos ni letra pequeña',
      'Auditoría gratuita de tu presencia actual',
      'Propuesta adaptada a tu presupuesto'
    ]
  }
}
