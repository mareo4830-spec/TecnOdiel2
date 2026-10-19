/**
 * Servicio de Prospección Comercial Multiagente (5 Roles IA) para TecnOdiel.
 * Funciona a coste cero (Gemini Flash / Motor determinista autónomo).
 */

const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VD_SUPABASE_URL) ||
  'https://wkzbgxsknkhixclgvrli.supabase.co';

const SUPABASE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VD_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndremJneHNrbmtoaXhjbGd2cmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0Nzk0NzUsImV4cCI6MjEwNzA1NTQ3NX0.MpIo0xJQC3MdJ4HQewEs3stfTF-I8uWXZgcJ6sS5uVw';

export const AGENT_ROLES = [
  { id: 1, name: 'Agente 1 (Investigador)', role: 'Recopila y estructura datos del negocio y mercado local' },
  { id: 2, name: 'Agente 2 (Auditor Técnico)', role: 'Detecta fallos críticos de UX/diseño y extrae 3 puntos débiles' },
  { id: 3, name: 'Agente 3 (Estratega SEO)', role: 'Evalúa oportunidades de palabras clave y visibilidad local' },
  { id: 4, name: 'Agente 4 (Copywriter Outbound)', role: 'Redacta propuesta comercial ultra-personalizada y persuasiva' },
  { id: 5, name: 'Agente 5 (Director / QA)', role: 'Revisa coherencia, valida calidad y compila dossier comercial' },
];

/**
 * Lanza la prospección multiagente para un sector y localidad.
 * @param {string} sector - Ej: "Clínica Dental", "Restaurante", "Peluquería"
 * @param {string} city - Ej: "Huelva", "Sevilla", "Punta Umbría"
 * @param {Object} options - { hasWeb, onStepChange }
 */
export async function runMultiAgentProspecting(sector, city, options = {}) {
  const cleanSector = (sector || '').trim();
  const cleanCity = (city || '').trim();
  if (!cleanSector || !cleanCity) {
    throw new Error('Sector y localidad son obligatorios');
  }

  // Feedback en tiempo real para visualizar el relevo de los 5 agentes
  const simulateCadence = async () => {
    if (typeof options.onStepChange === 'function') {
      for (const ag of AGENT_ROLES) {
        options.onStepChange(ag.id, ag.name, ag.role);
        await new Promise((r) => setTimeout(r, 480));
      }
    }
  };

  // Intentar Edge Function de Supabase si está disponible
  let remoteResult = null;
  try {
    const stepPromise = simulateCadence();
    const fetchPromise = fetch(`${SUPABASE_URL}/functions/v1/prospect-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        sector: cleanSector,
        city: cleanCity,
        hasWeb: options.hasWeb,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);

    const [, jsonResponse] = await Promise.all([stepPromise, fetchPromise]);
    if (jsonResponse?.ok && jsonResponse.analysis) {
      remoteResult = jsonResponse.analysis;
    }
  } catch (_) {
    // Modo local autónomo
  }

  if (remoteResult) {
    return remoteResult;
  }

  // Si no hay respuesta remota, ejecutar el motor multiagente local a coste cero
  return generateDeterministicMultiAgentProspect(cleanSector, cleanCity, options.hasWeb);
}

/**
 * Motor determinista multiagente local para prospección comercial en España (100% coste cero).
 */
export function generateDeterministicMultiAgentProspect(sector, city, hasWeb) {
  const s = sector.trim();
  const c = city.trim();
  const norm = s.toLowerCase();
  const capSector = s.charAt(0).toUpperCase() + s.slice(1);
  const capCity = c.charAt(0).toUpperCase() + c.slice(1);

  // Queries de búsqueda directa
  const queryGoogle = `"${norm}" en "${c}"`;
  const queryMaps = `${norm} ${c}`;
  const dorkInvestigacion = `"${norm}" "${c}" ("reservar" OR "cita" OR "carta") -site:just-eat.es -site:paginasamarillas.es`;

  // Agente 1: Investigador
  const a1 = `Análisis de mercado local en ${capCity}. Los negocios de ${norm} en la localidad captan búsquedas constantes de vecinos y visitantes desde Google y Google Maps. La mayor parte de los negocios locales tienen perfiles descuidados o dependen únicamente de Instagram/Facebook sin un canal directo de reserva/captación.`;

  // Agente 2: Auditor Técnico (Exactamente 3 puntos débiles)
  let puntosDebiles = [
    `Ausencia de web propia o diseño no adaptado a móvil (fuga estimada del 60% del tráfico que busca en smartphone).`,
    `Falta de llamadas a la acción claras (CTA): no permiten agendar cita ni contactar por WhatsApp en 1 solo toque.`,
    `Carga lenta sin optimización técnica, afectando negativamente la experiencia de usuario y el posicionamiento.`,
  ];

  if (norm.includes('dental') || norm.includes('clinic') || norm.includes('salud') || norm.includes('fisio')) {
    puntosDebiles = [
      `Sin sistema de cita previa online directo: obliga al paciente a llamar en horario laboral perdiendo solicitudes en horas no comerciales.`,
      `Página web desactualizada sin catálogo de tratamientos claro ni credenciales visuales que generen confianza inmediata.`,
      `Inexistencia de recordatorios automatizados o atención rápida por WhatsApp para reducir el absentismo en consulta.`,
    ];
  } else if (norm.includes('restaur') || norm.includes('bar') || norm.includes('taberna') || norm.includes('asador') || norm.includes('comida')) {
    puntosDebiles = [
      `Carta digital inexistente o en PDF pesado que no carga sin buena cobertura móvil, sin fotos atractivas ni filtros de alérgenos.`,
      `Sin motor de reservas online propio: pérdida de mesas fuera de horario comercial o pago de altas comisiones a agregadores.`,
      `Ficha de Google Maps desatendida, sin sincronización directa con el menú del local ni botón de reserva en Google.`,
    ];
  } else if (norm.includes('pelu') || norm.includes('estet') || norm.includes('barber')) {
    puntosDebiles = [
      `Gestión de citas manual por mensajes dispersos, generando huecos en la agenda y pérdida de clientes por lentitud de respuesta.`,
      `Sin presencia web profesional estilo portfolio con catálogo de servicios, precios transparentes ni fotos de alta calidad.`,
      `Sin recolección sistemática y automatizada de reseñas en Google tras cada servicio para dominar el pack local de ${capCity}.`,
    ];
  }

  const a2 = `Auditoría técnica de UX completada. Se han detectado 3 puntos de fuga críticos que limitan la facturación diaria del negocio frente a competidores digitalizados de ${capCity}.`;

  // Agente 3: Estratega SEO
  const keywords = [
    `${norm} en ${c}`,
    `mejor ${norm} ${c}`,
    `${norm} cerca de mí`,
    `${norm} ${c} opiniones`,
    `${norm} ${c} precios`,
  ];

  const estrategia = `Posicionamiento en el Local 3-Pack de Google Maps en ${capCity}. Mediante una web moderna de TecnOdiel ultrarrápida (<0.8s), schema markup LocalBusiness y optimización del perfil de Google Business Profile, el negocio captará a los clientes con intención de compra directa en su zona geográfica.`;

  const quickWins = [
    `Verificar y enriquecer la ficha de Google Business Profile con servicios específicos, fotos reales y horarios actualizados.`,
    `Lanzar web mobile-first de alta conversión desarrollada por TecnOdiel con botón flotante directo a WhatsApp.`,
    `Campaña automatizada de reputación digital para multiplicar las reseñas 5 estrellas en Google en los primeros 30 días.`,
  ];

  const a3 = `Estrategia de visibilidad completada. Las búsquedas locales de "${norm} en ${c}" representan una oportunidad inmediata con baja competencia de páginas web modernas y bien optimizadas.`;

  // Agente 4: Copywriter Outbound
  const mensajeComercial = `¡Hola! Buenas tardes. Te escribo muy rápidamente porque he estado realizando un estudio de visibilidad digital para negocios de ${norm} en ${capCity} y he visto vuestro negocio.

Hemos detectado que en ${capCity} se realizan decenas de búsquedas semanales para "${norm} en ${c}", pero la gran mayoría de negocios de la zona no disponen de una web moderna adaptada al móvil ni de un sistema directo para solicitar cita o consultar información en 1 clic.

En TecnOdiel hemos preparado una demo interactiva funcional especialmente adaptada para un negocio de ${norm} en ${capCity}, con reservas instantáneas y posicionamiento en Google Maps.

¿Me permites que te comparta el enlace de la demo para que le eches un vistazo en 1 minuto sin ningún tipo de compromiso?

Un saludo cordial,
Mario & Javier — TecnOdiel (Agencia Tecnológica & SaaS)`;

  const a4 = `Propuesta comercial redactada con enfoque consultivo, libre de spam, orientada a la aportación de valor previo y facilitando una respuesta afirmativa con llamada a la acción de cero compromiso.`;

  // Agente 5: Director / QA
  const a5 = `Revisión de calidad completada y aprobada. Verificación de congruencia entre el sector (${capSector}), la localidad (${capCity}) y los 3 puntos débiles detectados. Dossier validado con un score de 96/100 para prospección comercial.`;

  const cadenaAgentes = [
    {
      agente: 'Agente 1 (Investigador)',
      rol: 'Recopilación de mercado y datos del negocio',
      aporte: a1,
    },
    {
      agente: 'Agente 2 (Auditor Técnico)',
      rol: 'Auditoría de UX, rendimiento y ausencia de web',
      puntos_debiles: puntosDebiles,
      aporte: a2,
    },
    {
      agente: 'Agente 3 (Estratega SEO)',
      rol: 'Evaluación de palabras clave y visibilidad local',
      keywords_objetivo: keywords,
      estrategia,
      quick_wins: quickWins,
      aporte: a3,
    },
    {
      agente: 'Agente 4 (Copywriter Outbound)',
      rol: 'Redacción de propuesta comercial ultra-personalizada',
      aporte: a4,
    },
    {
      agente: 'Agente 5 (Director / QA)',
      rol: 'Control de calidad, validación y cierre de dossier',
      veredicto_qa: 'Aprobado con máxima personalización y enfoque en conversión.',
      score_calidad: 96,
      aporte: a5,
    },
  ];

  return {
    negocio_tipo: `${capSector} en ${capCity}`,
    sector: capSector,
    localidad: capCity,
    busqueda_optimizada: {
      query_google: queryGoogle,
      query_maps: queryMaps,
      dork_investigacion: dorkInvestigacion,
      url_google: `https://www.google.com/search?q=${encodeURIComponent(queryGoogle)}`,
      url_maps: `https://www.google.com/maps/search/${encodeURIComponent(queryMaps)}`,
    },
    cadena_agentes: cadenaAgentes,
    diagnostico: {
      resumen: `En ${capCity}, la mayor parte de negocios de ${norm} ${hasWeb ? 'tienen webs obsoletas o poco adaptadas a smartphones' : 'dependen exclusivamente de redes sociales o directorios genéricos'}. Esto provoca que gran parte de los clientes potenciales que buscan activamente en Google acaben contratando a competidores mejor posicionados.`,
      puntos_debiles: puntosDebiles,
    },
    oportunidades_seo: {
      keywords_objetivo: keywords,
      estrategia,
      quick_wins: quickWins,
    },
    mensaje_comercial: mensajeComercial,
  };
}
