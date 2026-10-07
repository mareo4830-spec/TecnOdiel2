// Configuracion de plantillas y datos iniciales de alta gama para Clinicas y Salud (CyS)

export const BASE_WEB_PRICE = 99; // 99€/mes precio base web clinica

export const AVAILABLE_MODULES = [
  {
    id: 'booking_engine',
    name: 'Motor de Cita Previa 24/7',
    price: 29,
    description: 'Gestión de citas directas por especialista y servicio sin comisiones a terceros.'
  },
  {
    id: 'whatsapp_triage',
    name: 'Triage & WhatsApp Automático',
    price: 19,
    description: 'Confirmación instantánea de citas, recordatorios 24h antes y atención por WhatsApp.'
  },
  {
    id: 'patient_portal',
    name: 'Portal & Ficha del Paciente',
    price: 25,
    description: 'Área privada para que los pacientes consulten sus citas, informes y presupuestos.'
  },
  {
    id: 'insurance_matcher',
    name: 'Filtro de Mutuas & Seguros',
    price: 15,
    description: 'Buscador interactivo de aseguradoras médicas aceptadas (Adeslas, Sanitas, DKV, etc.).'
  },
  {
    id: 'seo_local_google',
    name: 'SEO Local "Cerca de Mí"',
    price: 29,
    description: 'Optimización en Google Maps y ficha de Google Business para captación de pacientes locales.'
  },
  {
    id: 'virtual_tour',
    name: 'Tour Virtual de Gabinetes',
    price: 19,
    description: 'Muestra tus instalaciones, aparatología de vanguardia y quirófanos a pacientes nuevos.'
  }
];

export const MEDICAL_INSURANCES = [
  'Adeslas',
  'Sanitas',
  'DKV Seguros',
  'Asisa',
  'Mapfre Salud',
  'Caser Seguros',
  'FIATC',
  'Cigna',
  'Aegon',
  'Axa Salud',
  'Privado / Sin Seguro'
];

export const CLINIC_CATEGORIES = [
  { id: 'dental', name: 'Clínica Dental & Odontología', iconKey: 'dental' },
  { id: 'policlinica', name: 'Centro Médico & Policlínica', iconKey: 'policlinica' },
  { id: 'fisioterapia', name: 'Fisioterapia & Rehabilitación', iconKey: 'fisioterapia' },
  { id: 'estetica', name: 'Medicina Estética & Dermatología', iconKey: 'estetica' },
  { id: 'psicologia', name: 'Psicología & Salud Mental', iconKey: 'psicologia' },
  { id: 'veterinaria', name: 'Clínica & Hospital Veterinario', iconKey: 'veterinaria' },
  { id: 'oftalmologia', name: 'Oftalmología & Visión', iconKey: 'oftalmologia' },
  { id: 'podologia', name: 'Podología & Biomecánica', iconKey: 'podologia' },
  { id: 'nutricion', name: 'Nutrición Clínica & Dietética', iconKey: 'nutricion' }
];

export const TEMPLATES = [
  {
    id: 'the-ultra-minimal-swiss',
    name: '1. THE ULTRA-MINIMAL SWISS',
    category: 'dental',
    archetype: 'Dentales de Lujo & Proporción Áurea',
    badge: '★ BLANCO ABSOLUTO • GRID SUIZO',
    description: 'Dentales de Lujo. Blanco absoluto (#FFFFFF), grid matemático riguroso, tipografía suiza minúscula frente a espacios vacíos gigantescos y botones invisibles que solo revelan una flecha fina "→" al pasar el ratón.',
    previewColors: {
      primary: '#000000',
      accent: '#737373',
      bg: '#ffffff',
      card: '#f5f5f5'
    },
    defaultFont: 'Inter',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80',
    tags: ['Blanco Absoluto', 'Proporción Áurea', 'Botón Flecha Invisible', 'Micro-Interacciones']
  },
  {
    id: 'the-dark-biotech',
    name: '2. THE DARK BIOTECH',
    category: 'fisioterapia',
    archetype: 'Medicina Deportiva & Alto Rendimiento',
    badge: '★ AZUL MARINO • MOLÉCULAS SVG',
    description: 'Medicina Deportiva. Azul marino casi negro (#030712), gráficos de fondo tipo moléculas 3D y bio-redes SVG, layout tipo Dashboard con métricas de rendimiento, botones magnéticos con brillos interiores azules y textos decodificándose.',
    previewColors: {
      primary: '#06b6d4',
      accent: '#3b82f6',
      bg: '#030712',
      card: '#060c21'
    },
    defaultFont: 'JetBrains Mono',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80',
    tags: ['Moléculas 3D', 'Dashboard Biomecánico', 'Decoder Text', 'Botones Magnéticos']
  },
  {
    id: 'the-pediatric-playful',
    name: '3. THE PEDIATRIC PLAYFUL',
    category: 'policlinica',
    archetype: 'Pediatría Infantil & Sin Miedos',
    badge: '★ PASTEL • BLOBS ORGÁNICOS',
    description: 'Pediatría. Colores pastel muy suaves (#FAF7F2, menta, lavanda), elementos con formas de "Blob" orgánicos SVG, tipografías redondeadas gruesas y botones redondos y elásticos como de goma que se estiran y encogen al pulsar.',
    previewColors: {
      primary: '#70D6BC',
      accent: '#FF9B85',
      bg: '#FAF7F2',
      card: '#ffffff'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1920&q=80',
    tags: ['Blobs SVG', 'Colores Pastel', 'Botones Elásticos de Goma', 'Cero Lágrimas']
  },
  {
    id: 'the-horizontal-zen',
    name: '4. THE HORIZONTAL ZEN',
    category: 'psicologia',
    archetype: 'Psicología Clínica & Spa Somático',
    badge: '★ SCROLL HORIZONTAL • CALMA',
    description: 'Psicología y Spa. Navegación 100% de scroll horizontal continuo, tonos arena (#E7E1D8) y niebla (#F3EFEA), textos con un tracking enorme que se va juntando lentamente con el scroll y botones que son círculos perfectos translúcidos con micro-ondas.',
    previewColors: {
      primary: '#8C8476',
      accent: '#D5CEC2',
      bg: '#F3EFEA',
      card: '#EBE5DC'
    },
    defaultFont: 'Inter',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80',
    tags: ['Scroll Horizontal', 'Tonos Niebla & Arena', 'Tracking Expansivo', 'Botones Circulares']
  },
  {
    id: 'the-luxury-curtain',
    name: '5. THE LUXURY CURTAIN',
    category: 'estetica',
    archetype: 'Medicina Estética de Alta Costura',
    badge: '★ ORO MATE • ANIMACIÓN TELÓN',
    description: 'Clínicas Estéticas. Oro mate (#D4AF37) y negro profundo (#0A0A0A), tipografías Serif extrafinas, animaciones de telón donde la sección entera se desliza verticalmente hacia arriba para revelar el siguiente acto, y botones con líneas finas doradas envolventes.',
    previewColors: {
      primary: '#D4AF37',
      accent: '#C5A059',
      bg: '#0A0A0A',
      card: '#141414'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1920&q=80',
    tags: ['Oro Mate & Negro', 'Telón Vertical', 'Serif Extrafina', 'Líneas Envolventes']
  },
  {
    id: 'the-tech-ortho',
    name: '6. THE TECH-ORTHO',
    category: 'dental',
    archetype: 'Ortodoncia Avanzada & Wireframe 3D',
    badge: '★ WIREFRAME • ESCÁNER LÁSER',
    description: 'Ortodoncia Avanzada. Estética "Wireframe" técnica arquitectónica, fondos blancos con líneas de diseño técnico visibles, tipografías técnicas, animaciones de escáner láser luminoso que recorre imágenes de arriba abajo y botones sólidos azules (#0055FF) sin efectos locos.',
    previewColors: {
      primary: '#0055FF',
      accent: '#0037A8',
      bg: '#ffffff',
      card: '#f8fafc'
    },
    defaultFont: 'Inter',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80',
    tags: ['Blueprint Wireframe', 'Escáner Láser 60FPS', 'Botón Azul Sólido', 'Precisión CAD/CAM']
  },
  {
    id: 'estetica_glow',
    name: 'Estilo Medicina Estética & Glow Facial',
    category: 'estetica',
    archetype: 'Dermatología & Antienvejecimiento',
    badge: 'Champagne, Oro Rosa & Lujo Suave',
    description: 'Sofisticación, belleza natural y exclusividad. Diseñada para centros de medicina estética, ácido hialurónico, neuromoduladores y tratamientos faciales láser.',
    previewColors: {
      primary: '#f59e0b',
      accent: '#fbbf24',
      bg: '#1a1005',
      card: '#291b08'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1512290900672-1f55b9e07802?auto=format&fit=crop&w=1920&q=80',
    tags: ['Ácido Hialurónico', 'Armonización Facial', 'Dermatología Láser', 'Diagnóstico Cutáneo']
  },
  {
    id: 'psico_mente',
    name: 'Estilo Psicología & Bienestar Emocional',
    category: 'psicologia',
    archetype: 'Terapia & Salud Mental',
    badge: 'Verde Salvia, Calidez & Serenidad',
    description: 'Entorno de acogida, confidencialidad y paz. Ideal para gabinetes de psicología sanitaria, psicoterapia individual, de pareja e infanto-juvenil.',
    previewColors: {
      primary: '#14b8a6',
      accent: '#2dd4bf',
      bg: '#041716',
      card: '#082b28'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80',
    tags: ['Terapia Cognitivo-Conductual', 'Sesión Presencial & Online', 'Espacio Seguro', 'Confidencialidad']
  },
  {
    id: 'veterinaria_care',
    name: 'Estilo Hospital Veterinario & PetCare',
    category: 'veterinaria',
    archetype: 'Medicina Animal & Cirugía',
    badge: 'Turquesa, Ámbar & Cariño Animal',
    description: 'Dedicación y amor por las mascotas con rigor quirúrgico. Especialmente concebida para clínicas veterinarias, vacunación, quirófano y urgencias 24h.',
    previewColors: {
      primary: '#0ea5e9',
      accent: '#f59e0b',
      bg: '#061726',
      card: '#0c273e'
    },
    defaultFont: 'Inter',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1920&q=80',
    tags: ['Urgencias 24 Horas', 'Cirugía Menor', 'Planes de Salud Cachorros', 'Diagnóstico por Imagen']
  },
  {
    id: 'oftalmo_laser',
    name: 'Estilo Oftalmología Láser & Precisión',
    category: 'oftalmologia',
    archetype: 'Salud Ocular & Cirugía Refractiva',
    badge: 'Azul Zafiro & Claridad Visual',
    description: 'Enfoque tecnológico nítido para cirujanos oftalmólogos, cirugía de cataratas, corrección láser miopía y salud ocular de alta resolución.',
    previewColors: {
      primary: '#3b82f6',
      accent: '#60a5fa',
      bg: '#040e21',
      card: '#081a3d'
    },
    defaultFont: 'Inter',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1920&q=80',
    tags: ['Cirugía Láser Femtosegundo', 'Graduación de Precisión', 'Tratamiento Cataratas', 'Topografía Corneal']
  },
  {
    id: 'podologia_active',
    name: 'Estilo Podología & Biomecánica del Pie',
    category: 'podologia',
    archetype: 'Salud del Pie & Plantillas Personalizadas',
    badge: 'Cyan Claro & Movilidad',
    description: 'Clínica del pie moderna: estudio de la pisada en cinta computerizada, plantillas a medida, quiropodia y cirugía ungueal mínima invasiva.',
    previewColors: {
      primary: '#06b6d4',
      accent: '#67e8f9',
      bg: '#02161f',
      card: '#05293b'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80',
    tags: ['Estudio de la Pisada 3D', 'Plantillas Personalizadas', 'Quiropodia Completa', 'Papilomas & Uña Incarnada']
  }
];

export const COLOR_PALETTES = [
  {
    name: 'Cyan Dental Puro',
    primary: '#06b6d4',
    accent: '#22d3ee',
    bg: '#041724',
    surface: '#08253a'
  },
  {
    name: 'Azul Médico Quirúrgico',
    primary: '#0284c7',
    accent: '#38bdf8',
    bg: '#031326',
    surface: '#072445'
  },
  {
    name: 'Verde Fisioterapia & Salud',
    primary: '#10b981',
    accent: '#34d399',
    bg: '#061a12',
    surface: '#0c2e20'
  },
  {
    name: 'Champagne Medicina Estética',
    primary: '#f59e0b',
    accent: '#fbbf24',
    bg: '#1a1005',
    surface: '#291b08'
  },
  {
    name: 'Salvia Bienestar & Terapia',
    primary: '#14b8a6',
    accent: '#2dd4bf',
    bg: '#041716',
    surface: '#082b28'
  },
  {
    name: 'Zafiro Oftalmológico',
    primary: '#3b82f6',
    accent: '#60a5fa',
    bg: '#040e21',
    surface: '#081a3d'
  }
];

export const CLINIC_PHOTO_PRESETS = [
  { label: 'Gabinete Dental 3D', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Equipo Médico Colegiado', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Fisioterapia y Camilla', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Medicina Estética & Belleza', url: 'https://images.unsplash.com/photo-1512290900672-1f55b9e07802?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Gabinete de Psicología', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Clínica Veterinaria', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Recepción y Espera VIP', url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80' },
  { label: 'Quirófano de Precisión', url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1920&q=80' }
];

export function getPresetServicesForStyle(templateId) {
  switch (templateId) {
    case 'dental_pure':
      return [
        {
          category: 'Implantología & Cirugía Oral',
          items: [
            {
              name: 'Implante Dental Titanio Premium',
              price: 'Desde 650€',
              description: 'Colocación guiada por ordenador con anestesia local sin dolor. Corona de circonio biocompatible.',
              badge: 'Tecnología 3D',
              image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
            },
            {
              name: 'Carga Inmediata (Dientes en 1 Día)',
              price: 'Consultar Caso',
              description: 'Rehabilitación fija en el mismo día para que nunca estés sin tus dientes.',
              badge: 'En 24 Horas'
            }
          ]
        },
        {
          category: 'Ortodoncia Digital Avanzada',
          items: [
            {
              name: 'Ortodoncia Invisible (Alineadores Transparentes)',
              price: 'Desde 49€/mes',
              description: 'Planificación digital 3D. Corrige tu mordida de forma estética, cómoda y extraíble.',
              badge: 'Tratamiento Estrella',
              image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'
            },
            {
              name: 'Estudio Ortodóncico con Escáner iTero',
              price: 'Gratuito en 1ª Cita',
              description: 'Visualización previa del resultado final de tu sonrisa antes de comenzar.',
              badge: 'Sin Molde Clásico'
            }
          ]
        },
        {
          category: 'Estética Dental & Salud',
          items: [
            {
              name: 'Blanqueamiento Dental LED Philips Zoom',
              price: '280€',
              description: 'Aclara hasta 6 tonos en una sola sesión de 45 minutos sin sensibilidad dental.',
              badge: 'Resultados Inmediatos'
            },
            {
              name: 'Limpieza Bucodental Ultrasonidos + Fluoración',
              price: '50€',
              description: 'Eliminación completa de placa bacteriana, manchas de café o tabaco y pulido de esmalte.'
            }
          ]
        }
      ];

    case 'fisio_sport':
      return [
        {
          category: 'Fisioterapia Avanzada & Lesiones',
          items: [
            {
              name: 'Sesión Fisioterapia Manual + Diagnóstico Ecográfico',
              price: '45€',
              description: 'Tratamiento personalizado de 50 minutos enfocado en la causa de tu dolor y descarga muscular.',
              badge: 'Más Solicitada',
              image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
            },
            {
              name: 'Punción Seca Ecoguiada & Neuromodulación',
              price: '55€',
              description: 'Inactivación de puntos gatillo miofasciales con aguja y corriente para dolor crónico.',
              badge: 'Alta Eficacia'
            }
          ]
        },
        {
          category: 'Readaptación & Deporte',
          items: [
            {
              name: 'Readaptación Deportiva & Retorno a la Competición',
              price: '50€ / sesión',
              description: 'Entrenamiento guiado para volver a correr o entrenar sin recaídas tras esguinces o roturas.',
              badge: 'Protocolo Return-to-Play'
            }
          ]
        }
      ];

    case 'estetica_glow':
      return [
        {
          category: 'Medicina Estética Facial',
          items: [
            {
              name: 'Ácido Hialurónico Aumento & Hidratación de Labios',
              price: '290€',
              description: 'Diseño de labios natural y armónico con producto de alta gama Juvederm o Teoxane.',
              badge: 'Firma de la Dra.'
            },
            {
              name: 'Neuromoduladores para Líneas de Expresión (Frente & Patas de Gallo)',
              price: '320€',
              description: 'Atenúa arrugas manteniendo la naturalidad y luminosidad de tu mirada.',
              badge: 'Top Rejuvenecimiento'
            }
          ]
        },
        {
          category: 'Dermatología & Cuidado Cutáneo',
          items: [
            {
              name: 'Peeling Químico Médico Glow & Luminosidad',
              price: '110€',
              description: 'Renovación celular profunda para eliminar manchas solares y cerrar poros.'
            }
          ]
        }
      ];

    case 'psico_mente':
      return [
        {
          category: 'Servicios de Psicoterapia',
          items: [
            {
              name: 'Terapia Psicológica Individual (Adultos)',
              price: '55€ / sesión',
              description: 'Atención a ansiedad, estrés laboral, depresión, duelo y gestión emocional en espacio seguro.',
              badge: 'Presencial u Online'
            },
            {
              name: 'Terapia de Pareja & Resolución de Conflictos',
              price: '70€ / sesión',
              description: 'Herramientas prácticas para mejorar la comunicación afectiva y superar crisis de pareja.'
            }
          ]
        }
      ];

    case 'veterinaria_care':
      return [
        {
          category: 'Consultas & Prevención Animal',
          items: [
            {
              name: 'Consulta Veterinaria General & Revisión Completa',
              price: '35€',
              description: 'Exploración física exhaustiva de ojos, oídos, boca, peso y auscultación cardíaca.',
              badge: 'Atención Afectuosa'
            },
            {
              name: 'Plan de Vacunación & Desparasitación Anual Perro / Gato',
              price: '55€',
              description: 'Vacunas obligatorias (Rabia + Polivalente) y cartilla oficial veterinaria.'
            }
          ]
        },
        {
          category: 'Cirugía & Diagnóstico 24h',
          items: [
            {
              name: 'Esterilización / Castración con Monitorización Segura',
              price: 'Desde 140€',
              description: 'Quirófano con anestesia inhalatoria y recuperación asistida sin molestias.',
              badge: 'Cirugía Mínima Invasión'
            }
          ]
        }
      ];

    default: // policlinica y general
      return [
        {
          category: 'Consultas Médicas de Especialidad',
          items: [
            {
              name: 'Consulta de Medicina General & Familiar',
              price: '40€ (O con tu Seguro)',
              description: 'Atención médica integral, diagnóstico, emisión de recetas y analíticas.',
              badge: 'Cita en el Día'
            },
            {
              name: 'Consulta Especialista Traumatología & Cirugía Ortopédica',
              price: '60€ (Acepta Mutuas)',
              description: 'Valoración experta de dolores articulares, columna, lesiones y segundas opiniones.',
              badge: 'Dr. Colegiado'
            }
          ]
        },
        {
          category: 'Diagnóstico por Imagen & Pruebas',
          items: [
            {
              name: 'Ecografía Diagnóstica de Alta Resolución',
              price: '65€',
              description: 'Exploración abdominal, tiroidea, muscular o vascular con informe médico inmediato.',
              badge: 'Informe al Instante'
            },
            {
              name: 'Extracción & Analítica de Sangre Completa',
              price: 'Desde 35€',
              description: 'Perfil bioquímico, hemograma, colesterol, glucosa y marcadores inflamatorios.'
            }
          ]
        }
      ];
  }
}

export const INITIAL_CLINICS = [
  {
    id: 'clinic-1',
    name: 'Clínica Dental Odiel Sonrisas',
    slug: 'clinica-dental-sonrisas',
    subdomain: 'clinica-dental-sonrisas',
    cloudflare_domain: 'clinica-dental-sonrisas.pages.dev',
    cloudflare_url: 'https://clinica-dental-sonrisas.pages.dev',
    slogan: 'Tu sonrisa perfecta con tecnología 3D y trato cercano',
    description: 'Centro odontológico de referencia en Huelva. Especialistas en implantología guiada sin dolor, ortodoncia invisible y estética dental. Primera consulta y radiografía panorámica digital gratuitas.',
    category: 'dental',
    template_id: 'dental_pure',
    hero_layout: 'split',
    hero_image_side: 'right',
    hero_image_size: 'md',
    hero_image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1920&q=80',
    primary_color: '#06b6d4',
    accent_color: '#22d3ee',
    background_color: '#041724',
    surface_color: '#08253a',
    font_family: 'Inter',
    phone: '+34 959 28 30 40',
    whatsapp_number: '+34611223344',
    email: 'citas@dentalsonrisas.es',
    address: 'Avenida Martín Alonso Pinzón, 14',
    city: 'Huelva',
    postal_code: '21003',
    cta_text: 'Pedir Cita Online Gratuita',
    collegiate_number: 'Col. Odontólogos Nº 21/0482',
    accepted_insurances: ['Adeslas', 'Sanitas', 'Asisa', 'DKV Seguros', 'Privado / Sin Seguro'],
    emergency_phone: '+34 611 22 33 44',
    lunch_shift: { enabled: true, open: '09:00', close: '14:00' },
    dinner_shift: { enabled: true, open: '16:00', close: '20:30' },
    closed_days: ['Sábado', 'Domingo'],
    selected_modules: ['booking_engine', 'whatsapp_triage', 'patient_portal', 'seo_local_google'],
    menu_categories: getPresetServicesForStyle('dental_pure'),
    appointments: []
  },
  {
    id: 'clinic-2',
    name: 'Centro Médico Doñana Policlínica',
    slug: 'policlinica-donana',
    subdomain: 'policlinica-donana',
    cloudflare_domain: 'policlinica-donana.pages.dev',
    cloudflare_url: 'https://policlinica-donana.pages.dev',
    slogan: 'Medicina integral, especialistas de vanguardia y diagnóstico rápido',
    description: 'Policlínica con más de 12 especialidades médicas: medicina de familia, traumatología, ginecología, cardiología, análisis clínicos y ecografías con resultados en el día.',
    category: 'policlinica',
    template_id: 'medica_policlinica',
    hero_layout: 'centered',
    hero_image_side: 'right',
    hero_image_size: 'md',
    hero_image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    primary_color: '#0284c7',
    accent_color: '#38bdf8',
    background_color: '#031326',
    surface_color: '#072445',
    font_family: 'Outfit',
    phone: '+34 959 40 50 60',
    whatsapp_number: '+34622334455',
    email: 'recepcion@policlinicadonana.com',
    address: 'Calle Vázquez López, 22',
    city: 'Huelva',
    postal_code: '21001',
    cta_text: 'Reservar Cita Médica',
    collegiate_number: 'Centro Sanitario Autorizado NICA 48192',
    accepted_insurances: ['Adeslas', 'Sanitas', 'DKV Seguros', 'Mapfre Salud', 'Caser Seguros', 'Privado / Sin Seguro'],
    emergency_phone: '+34 959 40 50 60',
    lunch_shift: { enabled: true, open: '08:30', close: '14:30' },
    dinner_shift: { enabled: true, open: '16:00', close: '21:00' },
    closed_days: ['Domingo'],
    selected_modules: ['booking_engine', 'whatsapp_triage', 'insurance_matcher'],
    menu_categories: getPresetServicesForStyle('medica_policlinica'),
    appointments: []
  },
  {
    id: 'clinic-3',
    name: 'FisioSport Rendimiento & Lesiones',
    slug: 'fisiosport-huelva',
    subdomain: 'fisiosport-huelva',
    cloudflare_domain: 'fisiosport-huelva.pages.dev',
    cloudflare_url: 'https://fisiosport-huelva.pages.dev',
    slogan: 'Elimina tu dolor y vuelve a tu mejor nivel físico',
    description: 'Clínica de fisioterapia avanzada, osteopatía y rehabilitación de lesiones deportivas. Punción seca ecoguiada, readaptación funcional y terapia manual.',
    category: 'fisioterapia',
    template_id: 'fisio_sport',
    hero_layout: 'split',
    hero_image_side: 'left',
    hero_image_size: 'lg',
    hero_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80',
    primary_color: '#10b981',
    accent_color: '#34d399',
    background_color: '#061a12',
    surface_color: '#0c2e20',
    font_family: 'Outfit',
    phone: '+34 959 55 66 77',
    whatsapp_number: '+34633445566',
    email: 'contacto@fisiosporthuelva.com',
    address: 'Calle Pablo Rada, 8',
    city: 'Huelva',
    postal_code: '21004',
    cta_text: 'Pedir Cita con Fisioterapeuta',
    collegiate_number: 'Col. Fisioterapeutas Andalucía Nº 8194',
    accepted_insurances: ['Privado / Sin Seguro', 'Reembolso de Seguros'],
    emergency_phone: '+34 633 44 55 66',
    lunch_shift: { enabled: true, open: '09:00', close: '14:00' },
    dinner_shift: { enabled: true, open: '16:00', close: '21:30' },
    closed_days: ['Sábado', 'Domingo'],
    selected_modules: ['booking_engine', 'whatsapp_triage', 'seo_local_google'],
    menu_categories: getPresetServicesForStyle('fisio_sport'),
    appointments: []
  },
  {
    id: 'clinic-4',
    name: 'Dra. Elena Vega Medicina Estética',
    slug: 'dra-elena-vega-estetica',
    subdomain: 'dra-elena-vega-estetica',
    cloudflare_domain: 'dra-elena-vega-estetica.pages.dev',
    cloudflare_url: 'https://dra-elena-vega-estetica.pages.dev',
    slogan: 'Armonización facial natural y dermatología de alta gama',
    description: 'Medicina estética sin artificios. Tratamientos médicos personalizados con ácido hialurónico, neuromoduladores, peeling médico y bioestimulación de colágeno.',
    category: 'estetica',
    template_id: 'estetica_glow',
    hero_layout: 'centered',
    hero_image_side: 'right',
    hero_image_size: 'md',
    hero_image: 'https://images.unsplash.com/photo-1512290900672-1f55b9e07802?auto=format&fit=crop&w=1920&q=80',
    primary_color: '#f59e0b',
    accent_color: '#fbbf24',
    background_color: '#1a1005',
    surface_color: '#291b08',
    font_family: 'Playfair Display',
    phone: '+34 959 88 99 00',
    whatsapp_number: '+34644556677',
    email: 'consulta@draelenaestetica.com',
    address: 'Paseo de Santa Fe, 5',
    city: 'Huelva',
    postal_code: '21003',
    cta_text: 'Solicitar Valoración Médica',
    collegiate_number: 'Col. Médicos Huelva Nº 21/3910',
    accepted_insurances: ['Privado / Sin Seguro'],
    emergency_phone: '+34 644 55 66 77',
    lunch_shift: { enabled: true, open: '10:00', close: '14:00' },
    dinner_shift: { enabled: true, open: '16:30', close: '20:30' },
    closed_days: ['Viernes Tarde', 'Sábado', 'Domingo'],
    selected_modules: ['booking_engine', 'whatsapp_triage', 'virtual_tour'],
    menu_categories: getPresetServicesForStyle('estetica_glow'),
    appointments: []
  }
];
