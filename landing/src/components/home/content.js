// Contenido editable de la landing de TecnOdiel (estructura inspirada en q2bstudio.com).
// Edita aquí textos, enlaces y datos de contacto sin tocar los componentes.

export const CONTACT = {
  whatsapp: '34600000000', // <- sustituir por el número real (formato internacional, sin +)
  email: 'contacto@tecnodiel.com',
  city: 'Huelva'
};

export const waLink = (text = 'Hola TecnOdiel, quiero información para mi negocio') =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { label: 'Servicios', sub: '¿Qué hacemos?', href: '#servicios' },
  { label: 'Proyectos', sub: '¿Qué hemos hecho?', href: '#proyectos' },
  { label: 'TecnOdiel', sub: 'Más sobre nosotros', href: '#por-que' },
  { label: 'Preguntas', sub: 'Dudas habituales', href: '#faq' },
  { label: 'Contacto', sub: 'Hablemos', href: '#contacto' }
];

export const WHY = {
  eyebrow: 'POR QUÉ TECNODIEL',
  title: 'Tu partner tecnológico de confianza en Huelva',
  text:
    'Somos TecnOdiel, una startup de Huelva que trabaja mano a mano con negocios locales: peluquerías, barberías, restauración, clínicas y mucho más. Creamos software a tu medida —reserva de citas, cartas digitales, panel de administración, automatización con IA— a un precio que de verdad puede pagar un negocio de barrio, y te acompañamos como lo haría un vecino, no un call center.',
  bullets: [
    'Soluciones 100% personalizadas: diseñadas para cómo trabaja tu negocio',
    'Más económico que las grandes plataformas, sin comisiones por cada cita o reserva',
    'Trato directo y cercano en Huelva: hablas siempre con quien lo construye',
    'Te ayudamos a digitalizarte desde cero, aunque nunca hayas usado una web o una app'
  ],
  highlight: {
    eyebrow: 'FRENTE A LAS MULTINACIONALES',
    title: 'Cercanía de verdad',
    text: 'Las grandes plataformas te ven como un número y te cobran por cada cliente. Nosotros te vemos como un vecino: tu web, tus datos y tus clientes son tuyos.'
  },
  stats: [
    { value: '100%', label: 'A medida' },
    { value: '0 €', label: 'Comisiones por cita' },
    { value: '<24h', label: 'Respuesta' }
  ]
};

export const PROJECTS = {
  eyebrow: 'PROYECTOS DESTACADOS',
  title: 'Algunos de nuestros trabajos',
  items: [
    {
      tag: 'Caso real · Barbería',
      title: 'adrianmillan.es — Web, reservas y panel de gestión para una barbería de Huelva',
      text: 'Web con SEO local, sistema de reserva de citas, panel de administración (personal, servicios, notificaciones, agendas y horarios), analíticas reales de usuarios y control de gastos, tienda de productos y galería de cortes.',
      sector: 'Sector · Belleza y cuidado personal',
      chips: ['Reserva de citas', 'Panel admin', 'SEO local', 'Tienda', 'Analíticas'],
      href: 'https://adrianmillan.es',
      caption: 'Barbería en Huelva · SEO, panel de administrador, app y web para citas, notificaciones, marketing…',
      featured: true
    },
    {
      tag: 'Solución · Restauración',
      title: 'Carta digital con QR y reservas directas para bares y restaurantes',
      text: 'Tu carta siempre actualizada, pedidos y reservas directas a tu WhatsApp, sin comisiones y con un diseño propio que refleja tu local.',
      sector: 'Sector · Hostelería',
      chips: ['Carta QR', 'Reservas', 'WhatsApp'],
      action: 'hosteleria'
    },
    {
      tag: 'Solución · Clínicas',
      title: 'Agenda online y web profesional para clínicas y centros de salud',
      text: 'Citas online, recordatorios automáticos y una web que transmite confianza y te posiciona en Google Maps frente a tu competencia local.',
      sector: 'Sector · Salud y bienestar',
      chips: ['Agenda', 'Recordatorios', 'SEO'],
      action: 'clinicas'
    }
  ]
};

export const SERVICES = {
  eyebrow: 'SERVICIOS',
  title: 'Lo que hacemos',
  text: 'De la primera idea al negocio funcionando: cubrimos todo lo que necesitas para estar presente y trabajar mejor en digital.',
  items: [
    { icon: 'CalendarCheck', title: 'Reserva de citas online', text: 'Tus clientes reservan 24/7 desde el móvil. Agenda por profesional, horarios flexibles y cero llamadas perdidas.' },
    { icon: 'QrCode', title: 'Cartas digitales', text: 'Carta con QR siempre actualizada, con fotos, alérgenos y pedidos directos, sin PDFs imposibles de leer.' },
    { icon: 'LayoutDashboard', title: 'Panel de administración', text: 'Gestiona personal, servicios, agendas, horarios y notificaciones desde un único panel claro y fácil de usar.' },
    { icon: 'Bot', title: 'Automatización con IA', text: 'Asistentes que responden a tus clientes por WhatsApp, recordatorios automáticos y tareas repetitivas resueltas solas.' },
    { icon: 'Globe', title: 'Páginas web con SEO local', text: 'Una web rápida y a tu medida que te hace aparecer en Google y Google Maps cuando te buscan en Huelva.' },
    { icon: 'ShoppingBag', title: 'Tienda online', text: 'Vende tus productos fuera del local: catálogo, pedidos y cobros integrados con tu web.' },
    { icon: 'BarChart3', title: 'Analíticas y control de gastos', text: 'Entiende de dónde vienen tus clientes y cuánto gastas con datos reales, sin hojas de cálculo.' },
    { icon: 'BellRing', title: 'Notificaciones y recordatorios', text: 'Avisos automáticos por WhatsApp o email para reducir plantones y fidelizar a tus clientes.' },
    { icon: 'Image', title: 'Galería y promoción', text: 'Muestra tu trabajo —cortes, platos, tratamientos— con una galería cuidada que vende por sí sola.' },
    { icon: 'Rocket', title: 'Digitalización desde cero', text: '¿Nunca has usado una web o una app en tu día a día? Te acompañamos paso a paso, sin tecnicismos.' },
    { icon: 'RefreshCw', title: 'Alternativa a plataformas caras', text: 'Migramos tu negocio desde apps multinacionales a una solución propia, más barata, cercana y sin comisiones.' },
    { icon: 'LifeBuoy', title: 'Mantenimiento y soporte', text: 'Cambios, mejoras y ayuda cuando la necesites, con respuesta rápida y un trato siempre directo.' }
  ]
};

export const SECTORS = {
  eyebrow: 'NEGOCIOS COMO EL TUYO',
  title: 'Trabajamos con negocios locales de Huelva',
  items: [
    'Peluquerías', 'Barberías', 'Restaurantes', 'Bares y cafeterías', 'Clínicas dentales',
    'Fisioterapia', 'Centros de estética', 'Gimnasios', 'Academias', 'Talleres',
    'Tiendas locales', 'Veterinarias', 'Inmobiliarias', 'Autónomos'
  ]
};

export const FAQ = {
  eyebrow: 'PREGUNTAS FRECUENTES',
  title: 'Preguntas frecuentes sobre digitalizar tu negocio',
  items: [
    { q: '¿Por qué elegir TecnOdiel y no una plataforma grande?', a: 'Porque somos de Huelva y trabajamos para tu negocio, no para un ranking global. Tu solución es personalizada, más económica, sin comisiones por cita o reserva, y siempre hablas con la persona que la construye.' },
    { q: '¿Qué soluciones desarrolláis?', a: 'Reserva de citas online, cartas digitales con QR, páginas web con SEO local, paneles de administración, tiendas online, analíticas, notificaciones y automatización con IA. Todo adaptado al uso que necesite tu negocio.' },
    { q: '¿Cómo empieza un proyecto con TecnOdiel?', a: 'Rellenas el formulario o nos escribes por WhatsApp, hablamos contigo para entender cómo trabajas, te enviamos una propuesta clara con presupuesto cerrado y, en cuanto la aceptas, nos ponemos manos a la obra.' },
    { q: '¿Cuánto cuesta?', a: 'Depende de lo que necesites, pero nuestro objetivo es que sea mucho más asequible que las alternativas multinacionales. Siempre te damos un presupuesto cerrado y sin letra pequeña, y gratis.' },
    { q: '¿Cuánto tarda en estar lista mi web?', a: 'Gracias a nuestra forma de trabajar, un proyecto estándar puede estar listo en pocos días. Te damos un plazo concreto en la propuesta, según lo que incluya.' },
    { q: '¿Y si nunca he usado una web o una app en mi negocio?', a: 'Es justo para quien trabajamos. Te acompañamos paso a paso, te formamos para usar tu panel y estamos disponibles por WhatsApp cuando tengas cualquier duda.' },
    { q: '¿Quién es el dueño de mi web y de mis datos de clientes?', a: 'Tú. Tus clientes, tus reservas y tu información son tuyos; no los compartimos ni los usamos para otros fines.' },
    { q: '¿Qué soporte ofrecéis después del lanzamiento?', a: 'Mantenimiento, cambios y mejoras con respuesta rápida. Si algo falla o quieres añadir una función, nos escribes y lo resolvemos.' }
  ]
};

export const FORM_SECTORS = [
  'Peluquería / Barbería', 'Restaurante / Bar / Cafetería', 'Clínica / Salud', 'Estética / Bienestar',
  'Tienda / Comercio', 'Gimnasio / Academia', 'Otro tipo de negocio'
];

export const FORM_SERVICES = [
  'Reserva de citas', 'Carta digital', 'Página web', 'Panel de administración',
  'Automatización con IA', 'Tienda online', 'Analíticas', 'No lo sé, necesito consejo'
];

export const FOOTER = {
  company: [
    { label: 'Por qué TecnOdiel', href: '#por-que' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Preguntas frecuentes', href: '#faq' },
    { label: 'Contacto', href: '#contacto' }
  ],
  solutions: ['Software a medida', 'Reserva de citas online', 'Cartas digitales QR', 'Automatizar con IA', 'Digitalizar mi negocio', 'De la idea a tu web', 'Alternativa a plataformas caras']
};
