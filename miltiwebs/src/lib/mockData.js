// Configuracion de plantillas y datos iniciales de alta gama para restauracion

export const TEMPLATES = [
  {
    id: 'nocturne',
    name: 'Estilo Nocturno & Exclusivo',
    category: 'night_bar',
    badge: 'Luces Tenues & Cocteles',
    description: 'Atmósfera íntima y refinada con luces suaves, ideal para bares de copas, cócteles de autor y cenas románticas.',
    previewColors: {
      primary: '#f59e0b',
      accent: '#fbbf24',
      bg: '#050507',
      card: '#0c0c10'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1920&q=80',
    tags: ['Cocteles Especiales', 'Luces de Noche', 'Mesas Reservadas', 'Musica de Fondo']
  },
  {
    id: 'minimalist',
    name: 'Estilo Limpio & Nórdico',
    category: 'gastronomic',
    badge: 'Paz Visual & Espacio',
    description: 'Líneas finas, fondos limpios y mucho espacio para que las fotos de tus mejores platos hablen por sí solas.',
    previewColors: {
      primary: '#ffffff',
      accent: '#a1a1aa',
      bg: '#000000',
      card: '#09090b'
    },
    defaultFont: 'Inter',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80',
    tags: ['Diseno Limpio', 'Fotos Grandes', 'Ambiente Tranquilo', 'Cocina Cuidada']
  },
  {
    id: 'brutalist',
    name: 'Estilo Moderno & Rompedor',
    category: 'tapas',
    badge: 'Juvenil & Dinamico',
    description: 'Diseño potente y rompedor con textos en movimiento, perfecto para bares de moda, pubs con música y locales con mucha energía.',
    previewColors: {
      primary: '#ccff00',
      accent: '#facc15',
      bg: '#050505',
      card: '#0f0f11'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80',
    tags: ['Ambiente Joven', 'Musica & Ritmo', 'Pase de Entrada', 'Cervezas & Copas']
  },
  {
    id: 'artisan',
    name: 'Estilo Rústico & Brasa',
    category: 'trattoria',
    badge: 'Brasa, Tradicion & Calor',
    description: 'La calidez de un local de toda la vida: tonos madera, horno de leña y ambiente cercano que invita a disfrutar de una buena comida.',
    previewColors: {
      primary: '#ea580c',
      accent: '#fb923c',
      bg: '#0a0908',
      card: '#14120e'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
    tags: ['Comida Tradicional', 'Horno de Lena', 'Vinos Selectos', 'Terraza Agradable']
  },
  {
    id: 'velvet',
    name: 'Estilo Velvet & Burdeos',
    category: 'night_bar',
    badge: 'Terciopelo & Jazz',
    description: 'Rojo vino tinto y notas doradas para locales románticos, cenas íntimas, bodegas gourmet y jazz clubs.',
    previewColors: {
      primary: '#e11d48',
      accent: '#fb7185',
      bg: '#070204',
      card: '#120509'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1920&q=80',
    tags: ['Cenas Romanticas', 'Vino & Champagne', 'Musica Suave', 'Mesa VIP']
  },
  {
    id: 'cyberpunk',
    name: 'Estilo Cyber Neon & Future Bar',
    category: 'night_bar',
    badge: 'Neon Cyan & Glitch',
    description: 'Estética futurista con acentos cian neón y violeta, perfecta para locales temáticos, gaming bars y coctelería experimental.',
    previewColors: {
      primary: '#06b6d4',
      accent: '#a855f7',
      bg: '#030712',
      card: '#081120'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1920&q=80',
    tags: ['Iluminacion Neon', 'Bar Experimental', 'Ambiente Cyber', 'Cocteles Brillantes']
  },
  {
    id: 'tokyo_omakase',
    name: 'Estilo Omakase & Zen Japonés',
    category: 'gastronomic',
    badge: 'Zen & Minimalismo',
    description: 'Serenidad oriental inspirada en barras de sushi de Tokio, maderas claras, carbón negro y presentación milimétrica.',
    previewColors: {
      primary: '#f43f5e',
      accent: '#fecdd3',
      bg: '#09090b',
      card: '#141416'
    },
    defaultFont: 'Inter',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1920&q=80',
    tags: ['Barra Sushi', 'Omakase del Chef', 'Sake Seleccionado', 'Paciencia Zen']
  },
  {
    id: 'mediterranean_breeze',
    name: 'Estilo Brisa Mediterránea & Arroz',
    category: 'mediterranean',
    badge: 'Azul Egeo & Sol',
    description: 'Tonos azul mar y arena blanca para arrocerías, restaurantes costeros, chiringuitos prémium y marisquerías.',
    previewColors: {
      primary: '#0284c7',
      accent: '#38bdf8',
      bg: '#030d17',
      card: '#08192b'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1920&q=80',
    tags: ['Arroces & Paellas', 'Pescado del Dia', 'Vistas al Mar', 'Vinos Blancos']
  },
  {
    id: 'bistro_parisien',
    name: 'Estilo Bistró Francés & Vintage',
    category: 'gastronomic',
    badge: 'Verde Esmeralda & Latón',
    description: 'Elegancia clásica europea con verde carruaje y tipografía refinada, ideal para bistrós, cafés de época y trattorias elegantes.',
    previewColors: {
      primary: '#10b981',
      accent: '#eab308',
      bg: '#04100c',
      card: '#081c16'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80',
    tags: ['Cocina de Autor', 'Café & Pastelería', 'Bistró de Época', 'Vinos Franceses']
  },
  {
    id: 'urban_street_smash',
    name: 'Estilo Urban Street & Smash Burger',
    category: 'tapas',
    badge: 'Smash & Streetfood',
    description: 'Estilo urbano callejero con naranja fuego y tipografía bold para hamburgueserías smash, tacos urbanos y street food.',
    previewColors: {
      primary: '#f97316',
      accent: '#fbbf24',
      bg: '#0c0a09',
      card: '#1c1917'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80',
    tags: ['Smash Burgers', 'Patatas Crujientes', 'Salsas Secretas', 'Streetwear Vibe']
  },
  {
    id: 'tapas_andaluzas',
    name: 'Estilo Taberna & Tapas Andaluzas',
    category: 'tapas',
    badge: 'Albero, Sol & Azulejo',
    description: 'Sabor del sur, taberna de solera con amarillo albero y madera tostada. Ideal para taperías, freidurías y bodeguitas.',
    previewColors: {
      primary: '#eab308',
      accent: '#ca8a04',
      bg: '#0d0b04',
      card: '#1c1708'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1920&q=80',
    tags: ['Jamon Iberico', 'Chocos & Pescaíto', 'Manzanilla & Fino', 'Terraza Solera']
  },
  {
    id: 'steakhouse_asador',
    name: 'Estilo Asador Prime & Carnicería',
    category: 'trattoria',
    badge: 'Brasa & Madurados',
    description: 'Marrón cuero profundo y resplandor de brasas vivas para asadores de carne madurada, chuletones y parrillas de carbón.',
    previewColors: {
      primary: '#ef4444',
      accent: '#f97316',
      bg: '#0a0505',
      card: '#160b0b'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
    tags: ['Carne Madurada', 'Horno de Carbon', 'Chuleton Rubia', 'Vinos Reserva']
  },
  {
    id: 'pasticceria_dolce',
    name: 'Estilo Dulce Boutique & Brunch',
    category: 'cafe_sweet',
    badge: 'Pastelería & Crema',
    description: 'Tonos rosa empolvado, vainilla y oro rosa para cafeterías de especialidad, brunches con encanto y reposterías finas.',
    previewColors: {
      primary: '#ec4899',
      accent: '#f472b6',
      bg: '#0a0508',
      card: '#170b13'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80',
    tags: ['Tostas Brunch', 'Croissants Mantequilla', 'Smoothies Naturales', 'Terraza Bonita']
  },
  {
    id: 'botanical_garden',
    name: 'Estilo Botánico & Cocina Saludable',
    category: 'mediterranean',
    badge: 'Verde Salvia & Natural',
    description: 'Ambiente orgánico lleno de plantas y calma para locales healthy, poke bowls, comida vegana y huerto ecológico.',
    previewColors: {
      primary: '#22c55e',
      accent: '#86efac',
      bg: '#040d06',
      card: '#081a0d'
    },
    defaultFont: 'Inter',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1920&q=80',
    tags: ['Cocina Saludable', 'Ingredientes Bio', 'Poke Bowls', 'Zumos Cold-Pressed']
  },
  {
    id: 'rooftop_sunset',
    name: 'Estilo Sky Lounge & Atardecer',
    category: 'night_bar',
    badge: 'Coral Sunset & Vistas',
    description: 'Gradientes de atardecer en coral y púrpura para terrazas en azoteas, sky bars panorámicos y tardeos con DJ.',
    previewColors: {
      primary: '#fb7185',
      accent: '#c084fc',
      bg: '#08040d',
      card: '#13091f'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1920&q=80',
    tags: ['Vistas Panorámicas', 'Musica Chillout', 'Tardeos Exclusivos', 'Cocteleria Sunset']
  },
  {
    id: 'trattoria_italiana',
    name: 'Estilo Trattoria Clásica Toscana',
    category: 'trattoria',
    badge: 'Pasta Fresca & Chianti',
    description: 'Auténtico sabor italiano con tonos albahaca y rojo tomate para trattorias, pasta fresca fatta in casa y antipasti.',
    previewColors: {
      primary: '#16a34a',
      accent: '#dc2626',
      bg: '#080b06',
      card: '#12180d'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1920&q=80',
    tags: ['Pasta al Dente', 'Burrata de Puglia', 'Tiramisú Casero', 'Aceite de Oliva']
  },
  {
    id: 'cerveceria_craft',
    name: 'Estilo Cervecería Artesanal & Taproom',
    category: 'tapas',
    badge: 'Cobre, Lúpulo & Barril',
    description: 'Ambiente industrial de fábrica cervecera con cobre pulido y madera negra. Ideal para taprooms, birrerías y brewpubs.',
    previewColors: {
      primary: '#d97706',
      accent: '#f59e0b',
      bg: '#0a0703',
      card: '#171007'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1920&q=80',
    tags: ['Grifos Artesanales', 'Cata de Cervezas', 'Burgers & Alitas', 'Ambiente Informal']
  },
  {
    id: 'marisqueria_costera',
    name: 'Estilo Marisquería & Lonja Marinera',
    category: 'mediterranean',
    badge: 'Gamba Blanca & Mar',
    description: 'Elegancia marinera en azul náutico y blanco perla para marisquerías de costa, marisco fresco de lonja y pescados a la sal.',
    previewColors: {
      primary: '#0ea5e9',
      accent: '#38bdf8',
      bg: '#020b14',
      card: '#061726'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1920&q=80',
    tags: ['Gamba de Huelva', 'Pescado Salvaje', 'Almejas a la Marinera', 'Vino Blanco Frio']
  },
  {
    id: 'taqueria_fiesta',
    name: 'Estilo Taquería & Cantina Mexicana',
    category: 'tapas',
    badge: 'Lima Agave & Mezcal',
    description: 'Alegría vibrante en verde lima y chile rojo para taquerías callejeras, cantinas contemporáneas y tacos al pastor.',
    previewColors: {
      primary: '#84cc16',
      accent: '#ef4444',
      bg: '#090d04',
      card: '#131c0a'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1920&q=80',
    tags: ['Tacos al Pastor', 'Margaritas & Mezcal', 'Guacamole Casero', 'Música Latina']
  },
  {
    id: 'coffee_specialty',
    name: 'Estilo Café de Especialidad & Roastery',
    category: 'cafe_sweet',
    badge: 'Espresso & Tostadero',
    description: 'Marrón café tostado y crema avena para cafeterías de tercera generación, filtrados V60 y bollería artesanal.',
    previewColors: {
      primary: '#b45309',
      accent: '#d97706',
      bg: '#080503',
      card: '#140c06'
    },
    defaultFont: 'Inter',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80',
    tags: ['Café Origen Colombia', 'Arte Latte', 'V60 & Aeropress', 'Wi-Fi & Trabajo']
  },
  {
    id: 'gelato_artesanal',
    name: 'Estilo Heladería Italiana & Crepería',
    category: 'cafe_sweet',
    badge: 'Pistacho & Crema',
    description: 'Tonos pastel apetecibles en pistacho suave y nata montada para heladerías artesanales, gofres y crepes de autor.',
    previewColors: {
      primary: '#14b8a6',
      accent: '#2dd4bf',
      bg: '#030d0c',
      card: '#071c1a'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=1920&q=80',
    tags: ['Helado Natural', 'Sin Aditivos', 'Cucuruchos Caseros', 'Sabores Únicos']
  },
  {
    id: 'pizzeria_napolitana',
    name: 'Estilo Pizzería Napolitana & Horno',
    category: 'trattoria',
    badge: 'Masa Madre & Horno Leña',
    description: 'Rojo tomate San Marzano y detalles de harina tostada para pizzerías con horno de piedra y fermentación 48 horas.',
    previewColors: {
      primary: '#e11d48',
      accent: '#f97316',
      bg: '#0a0405',
      card: '#17090b'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1920&q=80',
    tags: ['Masa Madre 48h', 'Horno de Piedra', 'Mozzarella di Bufala', 'Bordes Inflados']
  },
  {
    id: 'lounge_shisha',
    name: 'Estilo Shisha Lounge & Arabian Nights',
    category: 'night_bar',
    badge: 'Índigo Real & Oro',
    description: 'Misticismo oriental y lujo moderno con índigo y oro metálico para teterías exclusivas, shisha bars y reservados VIP.',
    previewColors: {
      primary: '#8b5cf6',
      accent: '#f59e0b',
      bg: '#05030d',
      card: '#0f0821'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1920&q=80',
    tags: ['Shishas Prémium', 'Té con Menta', 'Sofás & Cojines VIP', 'Luces de Ambiente']
  },
  {
    id: 'beach_club',
    name: 'Estilo Beach Club & Sunset Chiringuito',
    category: 'mediterranean',
    badge: 'Turquesa Balear & Sol',
    description: 'Frescura isleña con turquesa y blanco arena para chiringuitos de playa, camas balinesas, cócteles de fruta y arroces.',
    previewColors: {
      primary: '#06b6d4',
      accent: '#facc15',
      bg: '#020d11',
      card: '#051a21'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    tags: ['Camas Balinesas', 'Mojitos & Caipirinhas', 'Puestas de Sol', 'Música Tropical']
  },
  {
    id: 'gourmet_vanguardia',
    name: 'Estilo Vanguardia & Estrella Michelin',
    category: 'gastronomic',
    badge: 'Platino & Alta Cocina',
    description: 'Negro titanio y acentos platino para restaurantes gastronómicos galardonados, menús degustación y cocina de vanguardia.',
    previewColors: {
      primary: '#f4f4f5',
      accent: '#71717a',
      bg: '#000000',
      card: '#0a0a0c'
    },
    defaultFont: 'Inter',
    defaultLayout: 'minimal',
    heroBg: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1920&q=80',
    tags: ['Menú Degustación', 'Maridaje de Vinos', 'Técnica Molecular', 'Reserva Anticipada']
  },
  {
    id: 'wok_asian_fusion',
    name: 'Estilo Asian Street & Wok Fusión',
    category: 'tapas',
    badge: 'Rojo Dragón & Pizarra',
    description: 'Energía de los callejones gastronómicos asiáticos con rojo vibrante para locales de noodles, bao buns, ramen y dim sum.',
    previewColors: {
      primary: '#dc2626',
      accent: '#facc15',
      bg: '#0d0303',
      card: '#1a0808'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1920&q=80',
    tags: ['Ramen Tradicional', 'Bao Buns al Vapor', 'Gyoza Crujiente', 'Wok al Momento']
  },
  {
    id: 'churreria_tradicional',
    name: 'Estilo Chocolatería & Churrería Castiza',
    category: 'cafe_sweet',
    badge: 'Chocolate Puro & Crujiente',
    description: 'Tradición castiza con marrón chocolate y oro crujiente para churrerías de toda la vida, desayunos con porras y meriendas.',
    previewColors: {
      primary: '#d97706',
      accent: '#ca8a04',
      bg: '#0a0602',
      card: '#170e06'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1920&q=80',
    tags: ['Churros de Rueda', 'Chocolate Espeso', 'Desayunos Caseros', 'Masa del Día']
  },
  {
    id: 'bodega_enoteca',
    name: 'Estilo Bodega Histórica & Enoteca',
    category: 'mediterranean',
    badge: 'Roble Viejo & Crianza',
    description: 'Aroma a barrica centenaria y vino tinto crianza para enotecas, tabernas de vino, catas y tablas de quesos curados.',
    previewColors: {
      primary: '#991b1b',
      accent: '#d97706',
      bg: '#080203',
      card: '#140608'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1920&q=80',
    tags: ['Catas Guiadas', 'Vinos por Copas', 'Tablas de Quesos', 'Bodega Climatizada']
  },
  {
    id: 'pulperia_gallega',
    name: 'Estilo Pulpería Tradicional & Rías',
    category: 'trattoria',
    badge: 'Pulpo Á Feira & Pimentón',
    description: 'Pizarra de granito, madera de carballo y pimentón de la Vera para pulperías tradicionales, empanadas y albariño en taza.',
    previewColors: {
      primary: '#ef4444',
      accent: '#64748b',
      bg: '#08080a',
      card: '#121217'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
    tags: ['Pulpo á Feira', 'Empanada Casera', 'Vino en Cunca', 'Pimientos de Padrón']
  },
  {
    id: 'tecnodiel_elite',
    name: 'Estilo TecnOdiel Cyber Luxury',
    category: 'tech_elite',
    badge: 'Esmeralda Láser & Cristal',
    description: 'La firma tecnológica insignia de TecnOdiel: microcristales oscuros, haz de luz esmeralda y ultravelocidad visual.',
    previewColors: {
      primary: '#10b981',
      accent: '#34d399',
      bg: '#000000',
      card: '#08080a'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
    tags: ['Firma TecnOdiel', 'Microcristales', 'Haz de Luz Láser', 'Carga Instantánea']
  }
];


export const COLOR_PALETTES = [
  {
    id: 'gold-obsidian',
    name: 'Negro Elegante & Oro',
    primary: '#f59e0b',
    accent: '#fbbf24',
    bg: '#050507',
    surface: '#0d0d12'
  },
  {
    id: 'emerald-tecnodiel',
    name: 'Negro & Verde Fresco',
    primary: '#10b981',
    accent: '#34d399',
    bg: '#000000',
    surface: '#09090b'
  },
  {
    id: 'cyan-cyber',
    name: 'Azul Noche & Titanio',
    primary: '#06b6d4',
    accent: '#22d3ee',
    bg: '#03070b',
    surface: '#07111a'
  },
  {
    id: 'ruby-velvet',
    name: 'Vino Tinto & Bronce',
    primary: '#e11d48',
    accent: '#fb7185',
    bg: '#060204',
    surface: '#14060b'
  },
  {
    id: 'terracotta-warm',
    name: 'Tierra Cálida & Madera',
    primary: '#ea580c',
    accent: '#fb923c',
    bg: '#090705',
    surface: '#140f0c'
  },
  {
    id: 'platinum-monochrome',
    name: 'Blanco, Negro & Plata',
    primary: '#e4e4e7',
    accent: '#ffffff',
    bg: '#09090b',
    surface: '#18181b'
  }
];

export const BASE_WEB_PRICE = 29;

export const AVAILABLE_MODULES = [
  {
    id: 'booking_engine',
    name: 'Reservas de Mesas sin Comisiones',
    tagline: 'Ahorra intermediarios y gestiona tus mesas',
    price: 15,
    description: 'Tus clientes reservan mesa desde la web. Te llega el aviso directo a tu móvil o WhatsApp y no pagas ni un céntimo de comisión por cliente.',
    badge: 'Sin Comisiones'
  },
  {
    id: 'nfc_menu',
    name: 'Carta Digital con Código QR y Placa de Mesa',
    tagline: 'Tus clientes tocan la mesa o leen el código con el móvil',
    price: 10,
    description: 'Carta digital rápida para ver desde cualquier móvil sin descargar nada. Puedes cambiar precios o platos cuando quieras en un segundo.',
    badge: 'Tocar y Listo'
  },
  {
    id: 'seo_ranking',
    name: 'Aparecer de los Primeros en Google y Mapas',
    tagline: 'Para que te encuentren al buscar dónde comer o tomar algo',
    price: 19,
    description: 'Optimizamos tu web para que vecinos y visitantes de tu ciudad te encuentren rápidamente al buscar bares o restaurantes en Google Maps.',
    badge: 'Más Clientes'
  },
  {
    id: 'multi_language',
    name: 'Carta en Varios Idiomas para Turistas',
    tagline: 'Inglés, Francés y Alemán al instante',
    price: 10,
    description: 'Traduce automáticamente tu carta y la lista de alérgenos para que los clientes extranjeros entiendan tus platos y pidan con confianza.',
    badge: 'Para Turistas'
  },
  {
    id: 'custom_domain',
    name: 'Tu Propio Nombre en Internet (tu-local.com)',
    tagline: 'Nombre exclusivo y correo profesional',
    price: 6,
    description: 'Consigue una dirección web propia con el nombre exacto de tu negocio (ej: elbarquito.es) y correo con tu nombre para dar máxima confianza.',
    badge: 'Tu Marca'
  }
];

export const INITIAL_RESTAURANTS = [

  {
    id: 'rest-1',
    slug: 'nocturne-club',
    subdomain: 'nocturne',
    name: 'Nocturne Sky Lounge',
    slogan: 'Alta cocteleria y gastronomia de noche en las alturas',
    description: 'Un espacio sensorial exclusivo donde la mixologia de vanguardia, la acustica cuidada y la atmosfera nocturna se combinan con elegancia.',
    category: 'night_bar',
    ambiance: 'Elegante, reservado y nocturno',
    template_id: 'nocturne',
    hero_layout: 'centered',
    texture: 'spotlight',
    dress_code: 'Smart Casual / Elegante',
    primary_color: '#f59e0b',
    accent_color: '#fbbf24',
    background_color: '#050507',
    surface_color: '#0d0d12',
    font_family: 'Outfit',
    hero_image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80',
    phone: '+34 959 12 34 56',
    whatsapp_number: '+34600123456',
    email: 'reservas@nocturne.es',
    address: 'Gran Via de Martin Alonso Pinzon, 24',
    city: 'Huelva',
    postal_code: '21003',
    google_maps_url: 'https://maps.google.com',
    instagram_url: 'https://instagram.com/nocturne',
    lunch_shift: { enabled: false, open: '13:30', close: '16:30' },
    dinner_shift: { enabled: true, open: '19:30', close: '02:30' },
    closed_days: ['Lunes'],
    booking_rules: {
      max_guests_per_table: 8,
      slot_interval_minutes: 30,
      advance_notice: 'Mismo dia permitido',
      confirmation_mode: 'instant',
      available_areas: ['Barra VIP Cocteleria', 'Salon Central Low Light', 'Terraza Panoramica']
    },
    menu_categories: [
      {
        id: 'cat-1',
        name: 'Cocteles de Autor',
        items: [
          {
            id: 'item-1',
            name: 'Smoked Bourbon & Truffle',
            description: 'Bourbon envejecido 12 anos, bitter de trufa negra, sirope de higos asados y humo de roble.',
            price: 14.50,
            badge: 'Firma de la Casa',
            allergens: []
          },
          {
            id: 'item-2',
            name: 'Emerald Yuzu Spritz',
            description: 'Gin botanico artesanal, reduccion de yuzu japones, licor de albahaca fresca y champan brut.',
            price: 13.00,
            badge: 'Seleccion',
            allergens: []
          },
          {
            id: 'item-3',
            name: 'Obsidian Velvet Espresso',
            description: 'Vodka infusionado en vainilla de Madagascar, licor de cafe de especialidad y crema de avellana.',
            price: 12.50,
            badge: 'Especialidad',
            allergens: ['Frutos secos']
          }
        ]
      },
      {
        id: 'cat-2',
        name: 'Bocados de Noche',
        items: [
          {
            id: 'item-4',
            name: 'Brioche de Wagyu A5 & Foie',
            description: 'Mantequilla tostada, tartar tibio de buey Wagyu y lascas de trufa fresca de temporada.',
            price: 18.00,
            badge: 'Exclusivo',
            allergens: ['Gluten', 'Lacteos']
          },
          {
            id: 'item-5',
            name: 'Tacos de Atun Rojo de Almadraba',
            description: 'Laminas de atun salvaje sobre alga nori crujiente, mayonesa de sriracha casera y caviar citrico.',
            price: 16.50,
            badge: 'Recomendado',
            allergens: ['Pescado', 'Sesamo']
          }
        ]
      }
    ],
    reservations: [
      {
        id: 'res-1',
        booking_code: 'NOCT-8812',
        customer_name: 'Alejandro Morales',
        customer_email: 'amorales@gmail.com',
        customer_phone: '+34 655 443 322',
        guests_count: 4,
        reservation_date: '2026-10-02',
        reservation_time: '21:30',
        area: 'Salon Central Low Light',
        special_requests: 'Celebracion privada. Mesa tranquila.',
        status: 'confirmed'
      }
    ]
  },
  {
    id: 'rest-2',
    slug: 'komorebi-sake',
    subdomain: 'komorebi',
    name: 'Komorebi Sake & Raw Bar',
    slogan: 'Silencio, estacionalidad y destilados ancestrales',
    description: 'Espacio de inspiracion japonesa donde cada plato respira vacio, tecnica milimetrica y producto puro.',
    category: 'cocktail',
    ambiance: 'Wabi-Sabi, sereno y minimalismo silencioso',
    template_id: 'minimalist',
    hero_layout: 'minimal',
    texture: 'none',
    dress_code: 'Smart Casual sobrio',
    primary_color: '#ffffff',
    accent_color: '#a1a1aa',
    background_color: '#09090b',
    surface_color: '#121215',
    font_family: 'Inter',
    hero_image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1920&q=80',
    phone: '+34 911 22 33 44',
    whatsapp_number: '+34611223344',
    email: 'reservas@komorebi.com',
    address: 'Calle del Desengano 12',
    city: 'Madrid',
    postal_code: '28004',
    google_maps_url: 'https://maps.google.com',
    instagram_url: 'https://instagram.com/komorebisake',
    lunch_shift: { enabled: false, open: '13:30', close: '16:30' },
    dinner_shift: { enabled: true, open: '19:30', close: '01:00' },
    closed_days: ['Lunes', 'Martes'],
    booking_rules: {
      max_guests_per_table: 4,
      slot_interval_minutes: 30,
      advance_notice: '24 horas de antelacion',
      confirmation_mode: 'instant',
      available_areas: ['Barra Omakase (8 plazas)', 'Salon de Te Zen']
    },
    menu_categories: [
      {
        id: 'cat-min-1',
        name: 'Seleccion Omakase & Maridaje',
        items: [
          {
            id: 'item-min-1',
            name: 'Nigiri de Toro Ahumado en Paja de Arroz',
            description: 'Ventresca madurada 7 dias, pincelada de soja aneja de barril de cedro y wasabi fresco de Shizuoka.',
            price: 19.00,
            badge: 'Puro Producto',
            allergens: ['Pescado', 'Soja']
          },
          {
            id: 'item-min-2',
            name: 'Sake Junmai Daiginjo 1800',
            description: 'Destilacion en frio, notas florales de pera blanca, arroz pulido al 35%. Servicio en copa de cristal soplado.',
            price: 22.00,
            badge: 'Edicion Limitada',
            allergens: []
          }
        ]
      }
    ],
    reservations: [
      {
        id: 'res-min-1',
        booking_code: 'KOM-1092',
        customer_name: 'Elena Soriano',
        customer_email: 'elena.s@gmail.com',
        customer_phone: '+34 600 112 233',
        guests_count: 2,
        reservation_date: '2026-10-04',
        reservation_time: '20:30',
        area: 'Barra Omakase (8 plazas)',
        special_requests: 'Aniversario.',
        status: 'confirmed'
      }
    ]
  },
  {
    id: 'rest-3',
    slug: 'bunker-99',
    subdomain: 'bunker99',
    name: 'BUNKER 99 / ACID CLUB',
    slogan: 'HORARIO NOCTURNO. DECIBELIOS CONTROLADOS. COCTELERIA RADICAL.',
    description: 'Sotano industrial de hormigon crudo, sistema de sonido Funktion-One y cocteleria molecular destilada en laboratorio interno.',
    category: 'cocktail',
    ambiance: 'Brutalista, industrial berlines y sonido vanguardista',
    template_id: 'brutalist',
    hero_layout: 'split',
    texture: 'grid',
    dress_code: 'Total Black / Expresion libre',
    primary_color: '#ccff00',
    accent_color: '#ffffff',
    background_color: '#050505',
    surface_color: '#111111',
    font_family: 'JetBrains Mono',
    hero_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
    phone: '+34 932 88 99 00',
    whatsapp_number: '+34699887766',
    email: 'gate@bunker99.club',
    address: 'Poligono Industrial Poblenou, Nave 14B',
    city: 'Barcelona',
    postal_code: '08005',
    google_maps_url: 'https://maps.google.com',
    instagram_url: 'https://instagram.com/bunker99club',
    lunch_shift: { enabled: false, open: '13:00', close: '16:00' },
    dinner_shift: { enabled: true, open: '22:00', close: '05:30' },
    closed_days: ['Lunes', 'Martes', 'Miercoles'],
    booking_rules: {
      max_guests_per_table: 8,
      slot_interval_minutes: 60,
      advance_notice: 'Puerta estricta. Pase previo requerido.',
      confirmation_mode: 'instant',
      available_areas: ['Sub-Bunker Soundstage', 'Laboratorio Quimico VIP']
    },
    menu_categories: [
      {
        id: 'cat-brut-1',
        name: 'DESTILADOS RADICALES // LAB DRINKS',
        items: [
          {
            id: 'item-brut-1',
            name: 'ACID MESCAL NITRO [BATCH #04]',
            description: 'Mezcal artesanal clarificado con acido tartarico, espuma de chile serrano y hielo tallado en diamante.',
            price: 15.00,
            badge: 'SIGNATURE 140BPM',
            allergens: []
          },
          {
            id: 'item-brut-2',
            name: 'NEON GIN & ELEKTRA TONIC',
            description: 'Ginebra infusionada con flores electricas y yuzu, tonica artesanal luminiscente bajo luz UV.',
            price: 14.50,
            badge: 'GLOW IN DARK',
            allergens: []
          }
        ]
      }
    ],
    reservations: [
      {
        id: 'res-brut-1',
        booking_code: 'BNK-7741',
        customer_name: 'Marc Rovira',
        customer_email: 'm.rovira@techno.cat',
        customer_phone: '+34 677 889 900',
        guests_count: 5,
        reservation_date: '2026-10-03',
        reservation_time: '23:30',
        area: 'Sub-Bunker Soundstage',
        special_requests: 'Acceso cabina de audio.',
        status: 'confirmed'
      }
    ]
  }
];

