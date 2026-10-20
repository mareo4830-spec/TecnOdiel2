/**
 * Generador Automático de Webs y Cartas para TecnOdiel
 * Genera la configuración completa del tenant (nombre, colores, estilos, fondo y platos)
 * a partir de las respuestas del formulario para que con 1 solo clic la web quede lista y autohosteada en Cloudflare.
 */

import { sanitizeSlug } from '../../miltiwebs/src/lib/supabase.js';

// Mapeo de estilos del formulario a plantillas maestras y tonalidades
export const STYLE_CONFIG_MAP = {
  // Hostelería
  'bistro-split': {
    templateId: 'the-editorial-print',
    category: 'bistro',
    defaultAccent: '#6DD94B',
    bgColor: '#050507',
    surfaceColor: '#0e0e12',
    slogan: 'Cocina de autor, mercado fresco y buen vino',
    ambiance: 'Elegante y acogedor'
  },
  'urban-street': {
    templateId: 'the-neo-bento-brutalist',
    category: 'street_food',
    defaultAccent: '#FFA000',
    bgColor: '#0c0c0e',
    surfaceColor: '#161619',
    slogan: 'Smash burgers, street bites & good vibes',
    ambiance: 'Joven y canalla'
  },
  'lounge-velvet': {
    templateId: 'the-glass-fluid',
    category: 'cocteleria',
    defaultAccent: '#A855F7',
    bgColor: '#070204',
    surfaceColor: '#12050b',
    slogan: 'Coctelería de autor y bocados de noche',
    ambiance: 'Nocturno y sofisticado'
  },
  'zen-terraza': {
    templateId: 'the-rustic-organic',
    category: 'terraza',
    defaultAccent: '#A3B18A',
    bgColor: '#080908',
    surfaceColor: '#111411',
    slogan: 'Armonía gastronómica al aire libre',
    ambiance: 'Sereno y natural'
  },
  'tech-gourmet': {
    templateId: 'the-cyber-terminal',
    category: 'vanguardia',
    defaultAccent: '#06B6D4',
    bgColor: '#020408',
    surfaceColor: '#070c14',
    slogan: 'Experiencia culinaria inmersiva y vanguardista',
    ambiance: 'Moderno y digital'
  },
  'asador-grid': {
    templateId: 'the-rustic-organic',
    category: 'asador',
    defaultAccent: '#F97316',
    bgColor: '#0a0604',
    surfaceColor: '#160d09',
    slogan: 'Fuego de leña, cortes nobles y tradición',
    ambiance: 'Rústico y apasionado'
  },

  // Plantillas directas
  'the-awwwards-cinematic': {
    templateId: 'the-awwwards-cinematic',
    category: 'alta_cocina',
    defaultAccent: '#6DD94B',
    bgColor: '#000000',
    surfaceColor: '#0a0a0a',
    slogan: 'Alta cocina, producto noble y experiencia visual',
    ambiance: 'Cinematográfico y exclusivo'
  },
  'the-neo-bento-brutalist': {
    templateId: 'the-neo-bento-brutalist',
    category: 'street_food',
    defaultAccent: '#FFE600',
    bgColor: '#0c0c0e',
    surfaceColor: '#161619',
    slogan: 'Sabor auténtico y recetas directas',
    ambiance: 'Urbano e impactante'
  },
  'the-glass-fluid': {
    templateId: 'the-glass-fluid',
    category: 'cocteleria',
    defaultAccent: '#A855F7',
    bgColor: '#070510',
    surfaceColor: '#120d24',
    slogan: 'Copas premium, ambiente selecto y música',
    ambiance: 'Cristal y noche'
  },
  'the-editorial-print': {
    templateId: 'the-editorial-print',
    category: 'bistro',
    defaultAccent: '#1c1917',
    bgColor: '#080808',
    surfaceColor: '#121212',
    slogan: 'Carta de temporada y cocina honesta',
    ambiance: 'Editorial de autor'
  },
  'the-cyber-terminal': {
    templateId: 'the-cyber-terminal',
    category: 'vanguardia',
    defaultAccent: '#00FF66',
    bgColor: '#020408',
    surfaceColor: '#070c14',
    slogan: 'Digital food experience',
    ambiance: 'Futurista y rápido'
  },
  'the-rustic-organic': {
    templateId: 'the-rustic-organic',
    category: 'asador',
    defaultAccent: '#8B5A2B',
    bgColor: '#0a0604',
    surfaceColor: '#160d09',
    slogan: 'Sabores de la tierra y brasas auténticas',
    ambiance: 'Cálido y artesanal'
  },

  // Clínicas
  'clinic-minimal': {
    templateId: 'the-ultra-minimal-swiss',
    category: 'dental',
    defaultAccent: '#2563EB',
    bgColor: '#05070a',
    surfaceColor: '#0b1017',
    slogan: 'Cuidado bucodental avanzado y sin dolor',
    ambiance: 'Limpio y profesional'
  },
  'tech-advanced': {
    templateId: 'the-tech-ortho',
    category: 'fisioterapia',
    defaultAccent: '#06B6D4',
    bgColor: '#020408',
    surfaceColor: '#070c14',
    slogan: 'Fisioterapia deportiva y tecnología de vanguardia',
    ambiance: 'Técnico y avanzado'
  },
  'amable-family': {
    templateId: 'the-pediatric-playful',
    category: 'pediatria',
    defaultAccent: '#70D6BC',
    bgColor: '#060a08',
    surfaceColor: '#0c1410',
    slogan: 'Atención médica cercana para toda la familia',
    ambiance: 'Cálido y familiar'
  },
  'zen-wellness': {
    templateId: 'the-horizontal-zen',
    category: 'psicologia',
    defaultAccent: '#A3B18A',
    bgColor: '#070807',
    surfaceColor: '#0f120f',
    slogan: 'Salud mental, bienestar y calma interior',
    ambiance: 'Sereno y empático'
  },
  'luxury-aesthetics': {
    templateId: 'the-luxury-curtain',
    category: 'estetica',
    defaultAccent: '#D4AF37',
    bgColor: '#080502',
    surfaceColor: '#140c05',
    slogan: 'Medicina estética avanzada y rejuvenecimiento',
    ambiance: 'Exclusivo y premium'
  },
  'precision-grid': {
    templateId: 'the-dark-biotech',
    category: 'policlinica',
    defaultAccent: '#3B82F6',
    bgColor: '#030508',
    surfaceColor: '#090d14',
    slogan: 'Diagnóstico de precisión y especialistas médicos',
    ambiance: 'Científico y riguroso'
  }
};

/**
 * Genera la carta de platos/servicios inicial según la temática del negocio,
 * permitiendo al equipo tener la carta ya estructurada y lista con precios reales.
 */
export function generateStarterMenuCategories(styleKey, sector, businessName) {
  const isHealth = /cl[ií]nica|salud|est[eé]tica|bienestar|dental|fisio/i.test(sector || '') ||
                   ['clinic-minimal', 'tech-advanced', 'amable-family', 'zen-wellness', 'luxury-aesthetics', 'precision-grid'].includes(styleKey);

  if (isHealth) {
    return [
      {
        id: `cat-${Date.now()}-1`,
        name: 'Consultas & Diagnóstico Integral',
        items: [
          {
            id: `item-${Date.now()}-1`,
            name: 'Primera Consulta y Estudio Digital 3D',
            description: 'Exploración completa, radiografía o escáner intraoral y plan de tratamiento personalizado.',
            price: 0.00,
            badge: 'Gratuita',
            allergens: []
          },
          {
            id: `item-${Date.now()}-2`,
            name: 'Revisión Preventiva y Limpieza por Ultrasonidos',
            description: 'Eliminación suave de placa bacteriana, pulido dental y aplicación de flúor protector.',
            price: 45.00,
            badge: 'Recomendado',
            allergens: []
          }
        ]
      },
      {
        id: `cat-${Date.now()}-2`,
        name: 'Tratamientos Especializados',
        items: [
          {
            id: `item-${Date.now()}-3`,
            name: 'Ortodoncia Invisible (Alineadores Transparentes)',
            description: 'Corrección dental discreta, cómoda y sin brackets. Incluye revisiones y retenedores.',
            price: 1850.00,
            badge: 'Más Solicitado',
            allergens: []
          },
          {
            id: `item-${Date.now()}-4`,
            name: 'Blanqueamiento Dental LED Avanzado en Clínica',
            description: 'Aclara hasta 4 tonos en una sola sesión de 45 minutos con tecnología de luz fría.',
            price: 220.00,
            badge: 'Resultado Inmediato',
            allergens: []
          },
          {
            id: `item-${Date.now()}-5`,
            name: 'Implantología Dental de Carga Inmediata',
            description: 'Implante de titanio de alta gama con corona de circonio colocada en el mismo día.',
            price: 750.00,
            badge: 'Garantía Vitalicia',
            allergens: []
          }
        ]
      },
      {
        id: `cat-${Date.now()}-3`,
        name: 'Estética & Rejuvenecimiento',
        items: [
          {
            id: `item-${Date.now()}-6`,
            name: 'Diseño de Sonrisa con Carillas de Porcelana',
            description: 'Armonización estética de forma y color con finas láminas cerámicas de alta resistencia.',
            price: 350.00,
            badge: 'Alta Estética',
            allergens: []
          },
          {
            id: `item-${Date.now()}-7`,
            name: 'Tratamiento con Ácido Hialurónico Peribucal',
            description: 'Hidratación profunda y perfilado de labios para un aspecto natural y rejuvenecido.',
            price: 190.00,
            badge: 'Médico',
            allergens: []
          }
        ]
      }
    ];
  }

  // Restauración: Asadores y Carnes a la Brasa
  if (styleKey === 'asador-grid' || styleKey === 'the-rustic-organic' || /asador|brasa|carne|fuego/i.test(sector || '')) {
    return [
      {
        id: `cat-${Date.now()}-1`,
        name: 'Entrantes a la Brasa & De la Tierra',
        items: [
          {
            id: `item-${Date.now()}-1`,
            name: 'Alcachofas Confitadas a la Brasa con Jamón Ibérico de Bellota',
            description: 'Corazones de alcachofa tiernos sobre brasa de encina con lascas de jamón y flor de sal.',
            price: 16.50,
            badge: 'Especialidad',
            allergens: ['Sin Gluten']
          },
          {
            id: `item-${Date.now()}-2`,
            name: 'Croquetas Caseras de Cecina de León y Trufa Negra',
            description: 'Bechamel sedosa elaborada a fuego lento con leche fresca de granja (6 unidades).',
            price: 12.00,
            badge: 'Top Ventas',
            allergens: ['Lácteos', 'Gluten']
          },
          {
            id: `item-${Date.now()}-3`,
            name: 'Chorizo Criollo Artesano con Chimichurri de la Casa',
            description: 'Doble cocción a la parrilla de carbón vegetal servido con pan rústico tostado.',
            price: 8.50,
            badge: 'Tradicional',
            allergens: []
          }
        ]
      },
      {
        id: `cat-${Date.now()}-2`,
        name: 'Carnes Maduradas & Cortes Nobles',
        items: [
          {
            id: `item-${Date.now()}-4`,
            name: 'Chuletón de Vaca Rubia Gallega Madurada 45 Días (1 kg aprox.)',
            description: 'Infiltración óptima, corte sellado a alta temperatura y reposado en brasa con patatas rústicas.',
            price: 58.00,
            badge: 'Firma de la Casa',
            allergens: ['Sin Gluten']
          },
          {
            id: `item-${Date.now()}-5`,
            name: 'Entraña de Black Angus con Pimientos de Padrón Asados',
            description: 'Jugosa, tierna y con el punto exacto de humo natural.',
            price: 22.50,
            badge: 'Recomendado',
            allergens: []
          },
          {
            id: `item-${Date.now()}-6`,
            name: 'Costillar Ibérico Glaseado a Baja Temperatura (12 horas)',
            description: 'Carne melosa que se desprende del hueso con salsa barbacoa de miel de romero.',
            price: 19.50,
            badge: 'Muy Tierno',
            allergens: []
          }
        ]
      },
      {
        id: `cat-${Date.now()}-3`,
        name: 'Postres Caseros & Bodega',
        items: [
          {
            id: `item-${Date.now()}-7`,
            name: 'Tarta de Queso Fluida al Horno de Leña',
            description: 'Interior cremoso de queso curado y base crujiente de galleta tostada.',
            price: 6.50,
            badge: 'Imprescindible',
            allergens: ['Lácteos', 'Huevo']
          },
          {
            id: `item-${Date.now()}-8`,
            name: 'Vino Tinto D.O. Selección Especial de la Casa (Crianza)',
            description: '14 meses en barrica de roble francés. Notas de fruta madura, vainilla y especias.',
            price: 18.00,
            badge: 'Bodega Propia',
            allergens: ['Sulfitos']
          }
        ]
      }
    ];
  }

  // Restauración: Street Food / Burgers / Pizzería
  if (styleKey === 'urban-street' || styleKey === 'the-neo-bento-brutalist' || /burger|smash|street|pizza/i.test(sector || '')) {
    return [
      {
        id: `cat-${Date.now()}-1`,
        name: 'Starters & Street Bites',
        items: [
          {
            id: `item-${Date.now()}-1`,
            name: 'Tequeños Caseros de Queso con Dip de Maracuyá',
            description: 'Masa fina y crujiente rellena de queso fundente (5 unidades) con salsa agridulce.',
            price: 9.50,
            badge: 'Para Compartir',
            allergens: ['Gluten', 'Lácteos']
          },
          {
            id: `item-${Date.now()}-2`,
            name: 'Patatas Smash con Pulled Pork y Queso Cheddar Fundido',
            description: 'Patatas crujientes con doble cocción, carne desmechada ahumada y cebollino fresco.',
            price: 11.00,
            badge: 'Top Ventas',
            allergens: ['Lácteos']
          },
          {
            id: `item-${Date.now()}-3`,
            name: 'Alitas Crispy con Glaseado BBQ Ahumado y Sésamo',
            description: 'Crujientes por fuera y jugosas por dentro marinadas durante 24 horas.',
            price: 10.50,
            badge: 'Crujiente',
            allergens: ['Sésamo']
          }
        ]
      },
      {
        id: `cat-${Date.now()}-2`,
        name: 'Smash & Gourmet Burgers',
        items: [
          {
            id: `item-${Date.now()}-4`,
            name: 'Smash Burger Trufada (Doble Carne Dry Aged 2x90g)',
            description: 'Costra crujiente de carne, queso havarti fundido, mayonesa de trufa negra y cebolla caramelizada.',
            price: 14.50,
            badge: 'Best Seller',
            allergens: ['Gluten', 'Lácteos', 'Huevo']
          },
          {
            id: `item-${Date.now()}-5`,
            name: 'Classic Bacon & Cheddar en Pan Brioche de Mantequilla',
            description: 'Doble patty smash, bacon ahumado crujiente, pepinillos encurtidos y salsa secreta.',
            price: 13.00,
            badge: 'Clásica',
            allergens: ['Gluten', 'Lácteos', 'Huevo']
          },
          {
            id: `item-${Date.now()}-6`,
            name: 'Crispy Crunchy Chicken con Salsa Honey Mustard',
            description: 'Contramuslo de pollo empanado en cornflakes, lechuga romana, tomate y miel-mostaza.',
            price: 12.50,
            badge: 'Crujiente',
            allergens: ['Gluten', 'Mostaza']
          }
        ]
      },
      {
        id: `cat-${Date.now()}-3`,
        name: 'Milkshakes & Postres Dulces',
        items: [
          {
            id: `item-${Date.now()}-7`,
            name: 'Batido Americano de Galleta Lotus & Vainilla de Madagascar',
            description: 'Cremoso, coronado con nata montada y sirope de caramelo salado.',
            price: 5.50,
            badge: 'Dulce',
            allergens: ['Lácteos', 'Gluten']
          },
          {
            id: `item-${Date.now()}-8`,
            name: 'Cookie Caliente Rellena de Nutella al Horno',
            description: 'Recién horneada en sartén de hierro con bola de helado artesano de fior di latte.',
            price: 6.00,
            badge: 'Recién Hecha',
            allergens: ['Gluten', 'Lácteos', 'Frutos Secos']
          }
        ]
      }
    ];
  }

  // Restauración: Coctelería / Speakeasy / Lounge
  if (styleKey === 'lounge-velvet' || styleKey === 'the-glass-fluid' || /coctel|copa|lounge|noche/i.test(sector || '')) {
    return [
      {
        id: `cat-${Date.now()}-1`,
        name: 'Signature Cocktails (Coctelería de Autor)',
        items: [
          {
            id: `item-${Date.now()}-1`,
            name: 'Smoky Old Fashioned al Roble & Naranja Amarga',
            description: 'Bourbon añejo macerado en roble, angostura amarga, terrón de azúcar moreno y twist de piel cítrica.',
            price: 12.50,
            badge: 'Firma',
            allergens: []
          },
          {
            id: `item-${Date.now()}-2`,
            name: 'Velvet Gin Fizz con Espuma Botánica de Lavanda',
            description: 'Ginebra artesanal, zumo de lima recién exprimido, licor de saúco y nube de flor blanca.',
            price: 11.00,
            badge: 'Top Ventas',
            allergens: ['Huevo']
          },
          {
            id: `item-${Date.now()}-3`,
            name: 'Paloma Artesanal con Mezcal Oaxaqueño & Pomelo Rosa',
            description: 'Destilado ahumado, soda de pomelo fresco, zumo de lima y borde de sal marina rosa.',
            price: 12.00,
            badge: 'Refrescante',
            allergens: []
          }
        ]
      },
      {
        id: `cat-${Date.now()}-2`,
        name: 'Tapas Selectas & Raw Bar',
        items: [
          {
            id: `item-${Date.now()}-4`,
            name: 'Tartar de Atún Rojo de Almadraba sobre Brioche Crujiente',
            description: 'Atún seleccionado cortado a cuchillo con aceite de sésamo tostado, aguacate y perlas de soja.',
            price: 18.50,
            badge: 'Gourmet',
            allergens: ['Pescado', 'Sésamo', 'Gluten']
          },
          {
            id: `item-${Date.now()}-5`,
            name: 'Ostras Especiales con Emulsión de Ponzu y Yuzu (4 uds.)',
            description: 'Frescura atlántica con toques cítricos japoneses y alga wakame.',
            price: 21.00,
            badge: 'Marino',
            allergens: ['Moluscos', 'Soja']
          },
          {
            id: `item-${Date.now()}-6`,
            name: 'Tabla de Quesos Artesanos con Frutos Secos y Mermelada de Higo',
            description: 'Selección de quesos curados nacionales e internacionales con tostas de pan de masa madre.',
            price: 16.00,
            badge: 'Maridaje',
            allergens: ['Lácteos', 'Frutos Secos']
          }
        ]
      },
      {
        id: `cat-${Date.now()}-3`,
        name: 'Destilados Premium & Champagnes',
        items: [
          {
            id: `item-${Date.now()}-7`,
            name: 'Champagne Brut Réserve (Copa)',
            description: 'Burbuja fina, notas de manzana verde, brioche y final mineral elegante.',
            price: 14.00,
            badge: 'Francés',
            allergens: ['Sulfitos']
          },
          {
            id: `item-${Date.now()}-8`,
            name: 'Whisky Single Malt Escocés (12 Años de Crianza)',
            description: 'Servido con piedra de hielo tallada a mano y acompañamiento de chocolate negro 85%.',
            price: 15.00,
            badge: 'Reserva',
            allergens: []
          }
        ]
      }
    ];
  }

  // Por defecto: Bistró / Restaurante Gastronómico / Cocina de Mercado
  return [
    {
      id: `cat-${Date.now()}-1`,
      name: 'Entrantes & Para Compartir',
      items: [
        {
          id: `item-${Date.now()}-1`,
          name: 'Croquetas Cremosas de Jamón Ibérico 100% Bellota',
          description: 'Receta tradicional con bechamel fluida, rebozado panko crujiente y velo de papada ibérica (6 uds.).',
          price: 12.50,
          badge: 'De la Casa',
          allergens: ['Lácteos', 'Gluten', 'Huevo']
        },
        {
          id: `item-${Date.now()}-2`,
          name: 'Ensaladilla Rusa Templada con Gambas Blancas de Huelva',
          description: 'Patata pochada con mayonesa ligera de su propio coral y regañás artesanales.',
          price: 13.50,
          badge: 'Top Ventas',
          allergens: ['Crustáceos', 'Huevo', 'Gluten']
        },
        {
          id: `item-${Date.now()}-3`,
          name: 'Salmorejo Cordobés con Virutas de Jamón y Huevo de Corral',
          description: 'Tomates madurados al sol, aceite virgen extra arbequina y picatostes dorados.',
          price: 9.00,
          badge: 'Fresco',
          allergens: ['Gluten', 'Huevo']
        }
      ]
    },
    {
      id: `cat-${Date.now()}-2`,
      name: 'Pescados de la Costa & Arroces Melosos',
      items: [
        {
          id: `item-${Date.now()}-4`,
          name: 'Lomo de Corvina Salvaje con Salteado de Verduras de Temporada',
          description: 'Pescado fresco del día marcado a la plancha sobre crema ligera de calabaza asada.',
          price: 21.00,
          badge: 'Pescado del Día',
          allergens: ['Pescado']
        },
        {
          id: `item-${Date.now()}-5`,
          name: 'Arroz Meloso de Carabineros y Calamar de Isla Cristina (mín. 2 pers.)',
          description: 'Fumet intenso de roca elaborado durante 6 horas con grano en su punto exacto.',
          price: 23.50,
          badge: 'Recomendado',
          allergens: ['Crustáceos', 'Moluscos']
        },
        {
          id: `item-${Date.now()}-6`,
          name: 'Presa Ibérica de Bellota con Puré Trufado de Boniato',
          description: 'Corte a la brasa con su jugo reducido al vino tinto y sal maldon.',
          price: 21.50,
          badge: 'Carne Selecta',
          allergens: ['Lácteos']
        }
      ]
    },
    {
      id: `cat-${Date.now()}-3`,
      name: 'Postres Artesanales & Cafés',
      items: [
        {
          id: `item-${Date.now()}-7`,
          name: 'Tarta de Queso Tostada al Horno con Coulis de Frutos Rojos',
          description: 'Corazón cremoso elaborada con queso de cabra artesano y queso crema suave.',
          price: 6.50,
          badge: 'Imprescindible',
          allergens: ['Lácteos', 'Huevo']
        },
        {
          id: `item-${Date.now()}-8`,
          name: 'Coulant de Chocolate Belga 70% con Helado de Vainilla Bourbon',
          description: 'Bizcocho caliente con volcán fluido de cacao puro servido al momento.',
          price: 7.00,
          badge: 'Recién Hecho',
          allergens: ['Lácteos', 'Gluten', 'Huevo']
        }
      ]
    }
  ];
}

/**
 * Construye el payload completo de restaurante/tenant a partir de los datos
 * de la solicitud de un lead (nombre, colores, estilos, platos, etc.).
 */
export function buildStarterTenantPayload(lead) {
  const businessName = (lead.business_name || lead.name || 'Nuevo Negocio').trim();
  const cleanSlug = sanitizeSlug(lead.slug || businessName) || `web-${Date.now().toString().slice(-4)}`;
  const accessKey = lead.client_access_key || `TO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const intake = lead.intake || {};
  const styleKey = intake.layoutVariant || lead.template_id || intake.layoutFamily || 'bistro-split';
  const sector = lead.sector || lead.businessType || intake.ambiente || 'restauracion';

  const cfg = STYLE_CONFIG_MAP[styleKey] || STYLE_CONFIG_MAP['bistro-split'];

  // Colores: acento elegido por el usuario en el formulario o el de la plantilla
  const primaryColor = intake.accentOverride || lead.accent_color || cfg.defaultAccent;
  const accentColor = primaryColor;
  const backgroundColor = cfg.bgColor;
  const surfaceColor = cfg.surfaceColor;

  const cloudflareDomain = `${cleanSlug}.pages.dev`;
  const cloudflareUrl = `https://${cleanSlug}.pages.dev`;

  const menuCategories = generateStarterMenuCategories(styleKey, sector, businessName);

  return {
    name: businessName,
    slug: cleanSlug,
    subdomain: cloudflareDomain,
    cloudflare_domain: cloudflareDomain,
    cloudflare_url: cloudflareUrl,
    published_url: cloudflareUrl,
    cloudflare_status: 'ready',
    slogan: cfg.slogan,
    description: lead.message || `Web oficial de ${businessName}. Carta digital, reservas directas y presencia moderna.`,
    category: cfg.category,
    ambiance: cfg.ambiance,
    template_id: cfg.templateId,
    primary_color: primaryColor,
    accent_color: accentColor,
    background_color: backgroundColor,
    surface_color: surfaceColor,
    font_family: 'Outfit',
    hero_image: '/demos/noir-atelier.jpg',
    phone: lead.phone || '+34 600 000 000',
    whatsapp_number: lead.phone || '+34 600 000 000',
    email: lead.email || `contacto@${cleanSlug}.es`,
    address: 'Calle Centro, 12',
    city: lead.city || 'Huelva',
    postal_code: '21001',
    selected_modules: Array.isArray(lead.services) && lead.services.length > 0
      ? lead.services
      : ['Carta digital QR', 'Reserva de mesas', 'Página web completa', 'Optimización móvil'],
    client_access_key: accessKey,
    menu_categories: menuCategories
  };
}
