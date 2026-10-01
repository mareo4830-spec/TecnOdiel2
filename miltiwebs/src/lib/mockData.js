// Configuracion de plantillas y datos iniciales de alta gama para restauracion

export const TEMPLATES = [
  {
    id: 'tapas_andaluzas',
    name: 'Estilo Taberna & Solera Andaluza',
    category: 'tapas',
    badge: 'Albero, Pizarra & Solera',
    description: 'Madera de roble, amarillo albero y pizarra tradicional. Pensada para taperías de solera, freidurías, bodeguitas y raciones de bellota.',
    previewColors: {
      primary: '#eab308',
      accent: '#ca8a04',
      bg: '#1c1006',
      card: '#2a180b'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&w=1920&q=80',
    tags: ['Jamón de Jabugo', 'Pizarra Chalk', 'Gambas al Ajillo', 'Solera de Jerez']
  },
  {
    id: 'nocturne',
    name: 'Estilo Nocturno & Mixología VIP',
    category: 'night_bar',
    badge: 'Obsidian Black & Oro',
    description: 'Atmósfera íntima y refinada con luces suaves, ideal para bares de copas, cócteles de autor, reservados exclusivos y noches con encanto.',
    previewColors: {
      primary: '#f59e0b',
      accent: '#fbbf24',
      bg: '#060608',
      card: '#0f0f14'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1920&q=80',
    tags: ['Mixología de Autor', 'Foco Dorado', 'Reservados VIP', 'Bocados de Noche']
  },
  {
    id: 'urban_street_smash',
    name: 'Estilo Urban Street & Smash Burger',
    category: 'tapas',
    badge: 'Neo-Brutalist & Street',
    description: 'Bordes marcados, banners en movimiento y contraste neón amarillo y naranja para smash burgers, tacos callejeros y street food con actitud.',
    previewColors: {
      primary: '#facc15',
      accent: '#ff5500',
      bg: '#09090b',
      card: '#18181b'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80',
    tags: ['Smash Burgers', 'Costra Maillard', 'Ticker Marquee', 'Loaded Fries']
  },
  {
    id: 'tokyo_omakase',
    name: 'Estilo Omakase & Zen Japonés',
    category: 'gastronomic',
    badge: 'Piedra Zen & Wabi-Sabi',
    description: 'Piedra de carbón, papel washi y kanjis tradicionales inspirados en las barras exclusivas de sushi de Ginza (Tokio).',
    previewColors: {
      primary: '#f5f5f4',
      accent: '#e11d48',
      bg: '#111113',
      card: '#1c1917'
    },
    defaultFont: 'Inter',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1920&q=80',
    tags: ['Barra Omakase', 'Nigiri Otoro', 'Shokunin', 'Sake Seleccionado']
  },
  {
    id: 'steakhouse_asador',
    name: 'Estilo Asador Prime & Cortes Madurados',
    category: 'trattoria',
    badge: 'Carbón & Dry Aged 60D',
    description: 'Resplandor de brasas de encina a 400°C, hierro fundido y telemetría de maduración para asadores de carne, parrillas y chuletones.',
    previewColors: {
      primary: '#ef4444',
      accent: '#f97316',
      bg: '#180704',
      card: '#280c08'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80',
    tags: ['Chuletón Rubia Gallega', 'Dry Aged', 'Brasa de Encina', 'Hierro Fundido']
  },
  {
    id: 'bistro_parisien',
    name: 'Estilo Bistró Francés & Belle Époque',
    category: 'gastronomic',
    badge: 'Verde Esmeralda & Oro',
    description: 'Elegancia clásica de brasserie parisina con verde carruaje, molduras doradas y tipografía francesa para bistrós y trattorias finas.',
    previewColors: {
      primary: '#10b981',
      accent: '#eab308',
      bg: '#04160e',
      card: '#072417'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=80',
    tags: ['Maison de Cuisine', 'Acuerdos Vinos', 'Foie Casero', 'Playfair Serif']
  },
  {
    id: 'marisqueria_costera',
    name: 'Estilo Marisquería & Lonja Marinera',
    category: 'mediterranean',
    badge: 'Azul Océano & Lonja',
    description: 'Azul náutico profundo y salitre para marisquerías de costa, marisco fresco de subasta matinal y arroces caldosos al fuego.',
    previewColors: {
      primary: '#0284c7',
      accent: '#38bdf8',
      bg: '#021424',
      card: '#05233e'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1920&q=80',
    tags: ['Gamba Blanca de Huelva', 'Subasta 06:00', 'Arroces Marineros', 'Pescado Salvaje']
  },
  {
    id: 'pasticceria_dolce',
    name: 'Estilo Dolce Boutique, Brunch & Café',
    category: 'cafe_sweet',
    badge: 'Crema, Rosa Pastel & Oro',
    description: 'Diseño suave con formas redondeadas, tonos crema y pastel para cafeterías de especialidad, pastelerías boutique y brunch de fin de semana.',
    previewColors: {
      primary: '#ec4899',
      accent: '#f472b6',
      bg: '#1c1218',
      card: '#2b1b25'
    },
    defaultFont: 'Playfair Display',
    defaultLayout: 'centered',
    heroBg: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80',
    tags: ['Brunch Benedictinos', 'Pistacho Bronte', 'Specialty Coffee', 'Vitrina Dulce']
  },
  {
    id: 'cerveceria_craft',
    name: 'Estilo Cervecería Artesanal & Taproom',
    category: 'tapas',
    badge: 'Cobre, Grifos & Kraft',
    description: 'Estética industrial de fábrica cervecera con cobre, pizarra de grifos con IBU y ABV, y comida ahumada para taprooms.',
    previewColors: {
      primary: '#d97706',
      accent: '#f59e0b',
      bg: '#1a0f04',
      card: '#291807'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?auto=format&fit=crop&w=1920&q=80',
    tags: ['12 Grifos Artesanos', 'Flight Degustación', 'Smash Pulled Pork', 'Kraft Industrial']
  },
  {
    id: 'cyberpunk',
    name: 'Estilo Cyber Neon & Future Bar',
    category: 'night_bar',
    badge: 'Cian Neón & Consola HUD',
    description: 'Estética futurista con marcos HUD, telemetría visual de sala y acentos neón para locales temáticos, gaming clubs y coctelería experimental.',
    previewColors: {
      primary: '#06b6d4',
      accent: '#a855f7',
      bg: '#010914',
      card: '#04172a'
    },
    defaultFont: 'Outfit',
    defaultLayout: 'split',
    heroBg: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1920&q=80',
    tags: ['Terminal HUD', 'Mixología Molecular', 'Neón Cian 2077', 'Glitch Tech']
  }
];

// Realistic Sample Menus tailored to each specific gastronomic concept
export const DEFAULT_MENUS_BY_STYLE = {
  tapas_andaluzas: [
    {
      id: 'cat-tapas-1',
      name: 'Tapas & Raciones de Solera',
      items: [
        { id: 't-1', name: 'Jamón 100% Ibérico de Bellota D.O. Jabugo', description: 'Cortado a cuchillo al momento, servido con picos de aceite de oliva virgen extra.', price: 24.00, badge: 'Firma de la Casa', allergens: [] },
        { id: 't-2', name: 'Gambas Blancas de Huelva al Ajillo', description: 'Salteadas con guindilla fresca, ajos dorados y aceite virgen extra.', price: 16.50, badge: 'Top Ventas', allergens: ['Crustáceos'] },
        { id: 't-3', name: 'Salmorejo Cordobés Tradicional', description: 'Emulsión de tomate de rama con virutas de jamón crujiente y huevo campero picado.', price: 8.50, badge: 'Receta Tradicional', allergens: ['Gluten', 'Huevos'] },
        { id: 't-4', name: 'Carrillada Ibérica al Vino Oloroso de Jerez', description: 'Estofada a fuego lento durante 6 horas con patatitas confitadas al romero.', price: 14.00, badge: 'Plato Estrella', allergens: [] },
        { id: 't-5', name: 'Tortillitas de Camarones Crujientes', description: 'Masa fina y extra crujiente con camarones frescos de la Bahía (4 unidades).', price: 9.00, badge: 'Crujiente', allergens: ['Gluten', 'Crustáceos'] }
      ]
    },
    {
      id: 'cat-tapas-2',
      name: 'Vinos de Solera & Manzanillas',
      items: [
        { id: 't-6', name: 'Manzanilla de Sanlúcar Pasada en Rama', description: 'Crianza biológica bajo velo de flor, servida muy fría en catavinos.', price: 3.50, badge: 'Copa Fría', allergens: [] },
        { id: 't-7', name: 'Vino Tinto Ribera del Guadiana Roble', description: '12 meses en barrica de roble americano, aromas a frutos negros maduros.', price: 4.00, badge: 'Copa Selección', allergens: [] }
      ]
    }
  ],
  nocturne: [
    {
      id: 'cat-noc-1',
      name: 'Coctelería de Autor & Mixología',
      items: [
        { id: 'n-1', name: 'Smoked Truffle Old Fashioned', description: 'Bourbon añejo macerado en roble, bitter de trufa negra melanosporum y piel de naranja flambeada.', price: 14.50, badge: 'Signature Drink', allergens: [] },
        { id: 'n-2', name: 'Emerald Yuzu Botanical', description: 'Ginebra artesanal de destilería botánica, cordial de yuzu fresco japonés y champán brut.', price: 13.00, badge: 'Cítrico & Fresco', allergens: [] },
        { id: 'n-3', name: 'Velvet Midnight Espresso Martini', description: 'Vodka destilado en frío, cold brew de café arábica y licor de cacao con espuma sedosa.', price: 12.50, badge: 'Energía & Noche', allergens: [] }
      ]
    },
    {
      id: 'cat-noc-2',
      name: 'Bocados de Noche & Clandestino',
      items: [
        { id: 'n-4', name: 'Brioche de Wagyu A5 & Foie Mi-Cuit', description: 'Pan brioche francés tostado en mantequilla noisette con láminas de trufa negra fresca.', price: 18.00, badge: 'Exclusivo VIP', allergens: ['Gluten', 'Lácteos'] },
        { id: 'n-5', name: 'Caviar Oscietra Imperial con Blinis', description: 'Lata de 15g servida sobre hielo picado con blinis calientes y crème fraîche artesana.', price: 38.00, badge: 'Gran Lujo', allergens: ['Pescado', 'Lácteos'] }
      ]
    }
  ],
  urban_street_smash: [
    {
      id: 'cat-smash-1',
      name: 'Smash Burgers & Streetwear',
      items: [
        { id: 's-1', name: 'Double Smash Oklahoma Fried Onion', description: 'Dos discos de 90g de buey aplastados a fuego con cebolla ultrafina, doble queso cheddar americano y salsa de la casa.', price: 11.90, badge: 'Best Seller ★', allergens: ['Gluten', 'Lácteos'] },
        { id: 's-2', name: 'Truffle Bacon Jam Smash', description: 'Doble carne madurada 45 días, mermelada casera de bacon crujiente, mayonesa de trufa negra y queso gouda fundido.', price: 13.50, badge: 'Favorita', allergens: ['Gluten', 'Lácteos'] },
        { id: 's-3', name: 'Crispy Korean Chicken Burger', description: 'Contramuslo crujiente marinado en buttermilk, salsa gochujang dulce-picante, encurtidos y col blanca.', price: 10.90, badge: 'Extra Crujiente', allergens: ['Gluten', 'Sésamo'] }
      ]
    },
    {
      id: 'cat-smash-2',
      name: 'Dirty Sides & Monster Shakes',
      items: [
        { id: 's-4', name: 'Loaded Dirty Cheese Fries', description: 'Patatas corte casero triple cocción cubiertas de pulled pork ahumado 12 horas, cheddar líquido y jalapeños.', price: 8.50, badge: 'Para Compartir', allergens: ['Lácteos'] },
        { id: 's-5', name: 'Milkshake Artesanal Biscoff Lotus', description: 'Helado mantecado de vainilla bourbon, crema pura de galleta Lotus y volcán de nata montada.', price: 5.90, badge: 'Dulce', allergens: ['Gluten', 'Lácteos'] }
      ]
    }
  ],
  tokyo_omakase: [
    {
      id: 'cat-oma-1',
      name: 'Secuencia Omakase (Pases del Shokunin)',
      items: [
        { id: 'o-1', name: 'Nigiri O-Toro Flameado con Trufa', description: 'Ventresca de atún rojo salvaje de almadraba flambeada al momento con sal marina y aceite de trufa blanca.', price: 14.00, badge: 'Pase 01', allergens: ['Pescado'] },
        { id: 'o-2', name: 'Tartar de Salmón Salvaje sobre Nori Tempura', description: 'Corte a cuchillo milimétrico con cebollino japonés sobre hoja de alga nori frita al aire.', price: 16.00, badge: 'Pase 02', allergens: ['Pescado', 'Gluten'] },
        { id: 'o-3', name: 'Black Cod Macerado al Miso Rojo Saikyo', description: 'Bacalao negro de profundidad marinado durante 72 horas y glaseado al carbón binchotan.', price: 22.00, badge: 'Pase 03', allergens: ['Pescado', 'Soja'] },
        { id: 'o-4', name: 'Gunkan de Erizo de Mar de Costa con Shiso', description: 'Erizo fresco de roca con arroz sazonado en vinagre rojo akazu y toque de wasabi fresco rallado.', price: 18.00, badge: 'Pase 04', allergens: ['Crustáceos'] }
      ]
    },
    {
      id: 'cat-oma-2',
      name: 'Sakes & Destilados Japoneses',
      items: [
        { id: 'o-5', name: 'Sake Junmai Daiginjo Yamada Nishiki', description: 'Arroz pulido al 50%, notas florales aterciopeladas y final limpio en boca.', price: 9.50, badge: 'Copa Cerámica', allergens: [] }
      ]
    }
  ],
  steakhouse_asador: [
    {
      id: 'cat-asa-1',
      name: 'Carnes a la Brasa & Dry Aged',
      items: [
        { id: 'a-1', name: 'Chuletón de Vaca Rubia Gallega (Maduración 60 Días)', description: 'Pieza seleccionada a mano con infiltración grasa BMS 7, asada al carbón de encina y cortada en lomo.', price: 68.00, badge: 'Maduración Óptima', allergens: [] },
        { id: 'a-2', name: 'Entrecot de Buey Nacional al Punto', description: '500 gramos de carne jugosa sellada a 400°C con escamas de sal volcánica ahumada.', price: 28.50, badge: 'Corte Noble', allergens: [] },
        { id: 'a-3', name: 'Mollejas de Ternera Lechal Glaseadas', description: 'Textura cremosa por dentro y crujiente por fuera con reducción de fondo oscuro.', price: 16.00, badge: 'Brasa Viva', allergens: [] }
      ]
    },
    {
      id: 'cat-asa-2',
      name: 'Entrantes de Parrilla & Horno',
      items: [
        { id: 'a-4', name: 'Pimientos del Padrón Asados al Carbón', description: 'Fritos en aceite virgen extra con sal gorda de salina natural.', price: 7.00, badge: 'De Temporada', allergens: [] },
        { id: 'a-5', name: 'Patatas Rústicas Panaderas con Romero Fresco', description: 'Confitadas a fuego lento en grasa de buey madurado.', price: 6.50, badge: 'Guarnición Top', allergens: [] }
      ]
    }
  ],
  bistro_parisien: [
    {
      id: 'cat-bis-1',
      name: 'Plats Principaux & Entrées',
      items: [
        { id: 'b-1', name: 'Foie Gras de Canard Mi-Cuit Maison', description: 'Elaborado artesanalmente en terrina con brioche de mantequilla templado y confitura de higos.', price: 19.50, badge: 'Fait Maison', allergens: ['Gluten', 'Lácteos'] },
        { id: 'b-2', name: 'Magret de Canard Rôti au Miel & Vinaigre', description: 'Pechuga de pato asada con reducción agridulce, chalotas glaseadas y puré robuchon.', price: 22.00, badge: 'Spécialité', allergens: ['Lácteos'] },
        { id: 'b-3', name: 'Steak Tartare Coupé au Couteau', description: 'Solomillo de ternera picado a cuchillo al minuto con alcaparras, mostaza dijon y yema de huevo.', price: 21.00, badge: 'Tradition', allergens: ['Huevos', 'Mostaza'] }
      ]
    },
    {
      id: 'cat-bis-2',
      name: 'Desserts & Sélection de Vins',
      items: [
        { id: 'b-4', name: 'Soufflé Chaud au Chocolat Grand Cru', description: 'Esponjoso soufflé horneado al momento con corazón fundente y helado de vainilla de Madagascar.', price: 9.00, badge: 'Minute', allergens: ['Huevos', 'Lácteos'] },
        { id: 'b-5', name: 'Verre de Bourgogne Pinot Noir Réserve', description: 'Elegancia borgoñona con taninos sedosos y notas de frambuesa silvestre.', price: 8.50, badge: 'Accord Vin', allergens: [] }
      ]
    }
  ],
  marisqueria_costera: [
    {
      id: 'cat-mar-1',
      name: 'Mariscos Frescos de la Lonja',
      items: [
        { id: 'm-1', name: 'Gamba Blanca de Huelva Cocida de Lonja', description: 'Recién traída de la subasta matinal, cocida en agua de mar y enfriada con sal marina gorda.', price: 22.00, badge: 'Subasta de Hoy', allergens: ['Crustáceos'] },
        { id: 'm-2', name: 'Coquinas de la Costa al Ajillo y Manzanilla', description: 'Salteadas vivas al momento con láminas de ajo frito y un golpe de vino fino.', price: 17.50, badge: 'Plato Marinero', allergens: ['Moluscos'] },
        { id: 'm-3', name: 'Pata de Pulpo de Roca Braseado', description: 'Asado a la brasa con parmentier trufada de patata y pimentón ahumado de la Vera.', price: 19.50, badge: 'Puro Sabor a Mar', allergens: ['Moluscos', 'Lácteos'] }
      ]
    },
    {
      id: 'cat-mar-2',
      name: 'Arroces Marineros a la Llauna',
      items: [
        { id: 'm-4', name: 'Arroz Caldoso con Bogavante Azul', description: 'Fondo intenso de roca cocinado lentamente durante 4 horas con bogavante entero (p/p mín 2 pers).', price: 24.00, badge: 'Especialidad', allergens: ['Crustáceos'] }
      ]
    }
  ],
  pasticceria_dolce: [
    {
      id: 'cat-dol-1',
      name: 'Brunch Salado & Tostas de Autor',
      items: [
        { id: 'd-1', name: 'Tosta Brioche con Huevos Benedictinos & Salmón', description: 'Pan brioche tostado en mantequilla francesa con salmón ahumado noruego y salsa holandesa casera.', price: 11.50, badge: 'Brunch Favorito', allergens: ['Gluten', 'Huevos', 'Pescado', 'Lácteos'] },
        { id: 'd-2', name: 'Avocado Toast & Feta Crumble sobre Masa Madre', description: 'Aguacate hass laminado, queso feta griego, semillas de chía tostadas y aceite de oliva virgen.', price: 9.00, badge: 'Healthy & Bio', allergens: ['Gluten', 'Lácteos'] }
      ]
    },
    {
      id: 'cat-dol-2',
      name: 'Pastelería Boutique & Specialty Coffee',
      items: [
        { id: 'd-3', name: 'Croissant Artesanal relleno de Pistacho de Bronte', description: 'Hojaldre 100% mantequilla de Normandía fermentado 48h con crema pura de pistacho siciliano.', price: 4.50, badge: 'Recién Horneado', allergens: ['Gluten', 'Lácteos', 'Frutos de Cáscara'] },
        { id: 'd-4', name: 'French Toast Caramelizada con Mascarpone', description: 'Panettone bañado en crema de vainilla con frutos del bosque frescos y miel de azahar.', price: 8.50, badge: 'Irresistible', allergens: ['Gluten', 'Huevos', 'Lácteos'] },
        { id: 'd-5', name: 'Specialty Flat White (Origen Colombia Geisha)', description: 'Doble shot de espresso de finca con leche fresca micro-emulsionada a 65°C.', price: 2.80, badge: 'Café de Finca', allergens: ['Lácteos'] }
      ]
    }
  ],
  cerveceria_craft: [
    {
      id: 'cat-craft-1',
      name: 'Pizarra de Grifos & Cervezas Artesanales',
      items: [
        { id: 'c-1', name: 'Flight Degustación de 4 Cervezas de la Fábrica', description: 'Cata guiada con 4 copas de 150ml (Lager, Hazy IPA, Belgian Dubbel e Imperial Stout).', price: 10.00, badge: 'Experiencia Cata', allergens: ['Gluten'] },
        { id: 'c-2', name: 'Hazy IPA Doble Lúpulo Citra & Mosaic (6.5% ABV)', description: 'Cuerpo sedoso de avena con explosión aromática de maracuyá, mango y pomelo. 45 IBU.', price: 5.50, badge: 'Grifo 03', allergens: ['Gluten'] },
        { id: 'c-3', name: 'Imperial Stout en Barrica de Bourbon (9.2% ABV)', description: 'Cerveza negra de guarda con densas notas de chocolate amargo, café tostado y roble. 65 IBU.', price: 5.00, badge: 'Grifo 08', allergens: ['Gluten'] }
      ]
    },
    {
      id: 'cat-craft-2',
      name: 'Comida de Taproom & Ahumados',
      items: [
        { id: 'c-4', name: 'Smash Pulled Pork Burger al Sarmiento', description: 'Carne de cerdo desmenuzada ahumada 12h con salsa barbacoa a la stout en pan pretzel.', price: 11.00, badge: 'Ahumado Lento', allergens: ['Gluten', 'Mostaza'] },
        { id: 'c-5', name: 'Nachos de la Fábrica con Brisket Ahumado', description: 'Totopos de maíz artesanos, brisket de ternera, queso cheddar fundido y pico de gallo.', price: 12.50, badge: 'Para Compartir', allergens: ['Lácteos'] }
      ]
    }
  ],
  cyberpunk: [
    {
      id: 'cat-cyb-1',
      name: 'Molecular Mixology // PROTOCOL_01',
      items: [
        { id: 'cy-1', name: 'Cryogenic Liquid Nitrogen Mule', description: 'Vodka destilado criogénico a -196°C, cordial espumoso de jengibre y humo helado comestible.', price: 15.00, badge: 'SYS_OVERCLOCK', allergens: [] },
        { id: 'cy-2', name: 'Neon Cyan Electric Tonic', description: 'Ginebra infusionada en flor de mariposa azul sensible al pH con tónica luminiscente ultravioleta.', price: 13.50, badge: 'HIGH_VOLTAGE', allergens: [] }
      ]
    },
    {
      id: 'cat-cyb-2',
      name: 'Synthetic Street Food // DATA_INDEX',
      items: [
        { id: 'cy-3', name: 'Bao Negro al Vapor con Panceta Confitada', description: 'Pan bao de carbón activado con panceta laqueada, mayo de kimchi y crujiente de raíz de loto.', price: 12.00, badge: 'BIO_LINK', allergens: ['Gluten', 'Sésamo'] },
        { id: 'cy-4', name: 'Edamame Trufado con Sal Volcánica de Hawái', description: 'Salteado a fuego ultra-vivo en wok con aceite virgen de trufa y copos de sal negra.', price: 7.50, badge: 'SNACK_CORE', allergens: ['Soja'] }
      ]
    }
  ]
};

export function getPresetMenuForStyle(styleId) {
  if (!styleId) return DEFAULT_MENUS_BY_STYLE.tapas_andaluzas;
  const clean = String(styleId).toLowerCase().trim().replace(/[-\s]+/g, '_');
  
  if (DEFAULT_MENUS_BY_STYLE[clean]) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE[clean]));
  }

  // Synonym fallbacks
  if (clean.includes('tapa') || clean.includes('iberic') || clean.includes('taberna') || clean.includes('churreria') || clean.includes('bodega')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.tapas_andaluzas));
  }
  if (clean.includes('smash') || clean.includes('burger') || clean.includes('street') || clean.includes('brutal') || clean.includes('taqueria')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.urban_street_smash));
  }
  if (clean.includes('omakase') || clean.includes('sushi') || clean.includes('zen') || clean.includes('japon') || clean.includes('minimal')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.tokyo_omakase));
  }
  if (clean.includes('asador') || clean.includes('carne') || clean.includes('steak') || clean.includes('brasa') || clean.includes('artisan')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.steakhouse_asador));
  }
  if (clean.includes('bistro') || clean.includes('paris') || clean.includes('frances') || clean.includes('velvet') || clean.includes('gourmet')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.bistro_parisien));
  }
  if (clean.includes('mar') || clean.includes('marisc') || clean.includes('costa') || clean.includes('lonja') || clean.includes('mediterran')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.marisqueria_costera));
  }
  if (clean.includes('dolce') || clean.includes('dulce') || clean.includes('pasteler') || clean.includes('brunch') || clean.includes('coffee') || clean.includes('cafe')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.pasticceria_dolce));
  }
  if (clean.includes('craft') || clean.includes('cerve') || clean.includes('brew') || clean.includes('beer')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.cerveceria_craft));
  }
  if (clean.includes('cyber') || clean.includes('neon') || clean.includes('future') || clean.includes('tecnodiel')) {
    return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.cyberpunk));
  }

  return JSON.parse(JSON.stringify(DEFAULT_MENUS_BY_STYLE.nocturne));
}

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
    name: 'Reservas Directas a WhatsApp',
    tagline: '0€ comisiones, 100% para ti',
    price: 15,
    description: 'Tus clientes reservan mesa en 1 clic. El aviso te llega directo al móvil sin intermediarios ni comisiones.',
    badge: '0€ Comisiones'
  },
  {
    id: 'nfc_menu',
    name: 'Carta Digital con Código QR',
    tagline: 'Sin descargas, fotos y precios al día',
    price: 10,
    description: 'Tus clientes leen el QR y ven la carta al instante. Actualiza platos, sugerencias y precios en segundos.',
    badge: 'Carga en 0.2s'
  },
  {
    id: 'seo_ranking',
    name: 'Posicionamiento en Google y Maps',
    tagline: 'Aparece el primero en tu ciudad',
    price: 19,
    description: 'Atrae a clientes locales y turistas cuando busquen dónde comer o tomar una copa en Google Maps.',
    badge: 'Más Clientes'
  },
  {
    id: 'multi_language',
    name: 'Carta en Inglés y Varios Idiomas',
    tagline: 'Ideal para turistas extranjeros',
    price: 10,
    description: 'Traduce tu carta y alérgenos para que los visitantes extranjeros pidan más rápido y con confianza.',
    badge: 'Para Turistas'
  },
  {
    id: 'custom_domain',
    name: 'Dominio Propio (.es o .com)',
    tagline: 'Tu nombre exclusivo en internet',
    price: 6,
    description: 'Tu dirección web propia (ej: tubar.es) para transmitir máxima confianza y categoría a tus clientes.',
    badge: 'Tu Marca'
  }
];

export const INITIAL_RESTAURANTS = [

  {
    id: 'rest-1',
    slug: 'nocturne-club',
    subdomain: 'nocturne',
    client_access_key: 'TO-NOCTURNE-88',
    plan_name: 'Plan Hostelería Pro',
    budget: 99.00,
    billing_plan: 'monthly',
    contract_status: 'active',
    pending_tasks: [
      { id: 'task-1', label: 'Fotografías profesionales de platos estrella', done: true },
      { id: 'task-2', label: 'Logotipo en alta resolución o vector transparente', done: true },
      { id: 'task-3', label: 'Carta completa de comidas, postres y alérgenos', done: true },
      { id: 'task-4', label: 'Vinculación de dominio propio (.es / .com)', done: false },
      { id: 'task-5', label: 'Verificación de reservas directas por WhatsApp', done: true },
      { id: 'task-6', label: 'Firma de contrato y domiciliación bancaria', done: true }
    ],
    admin_notes: 'Web en producción bajo Cloudflare Pages. Pendiente confirmar compra de dominio propio .es.',
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
    client_access_key: 'TO-KOMOREBI-42',
    plan_name: 'Plan Hostelería Pro',
    budget: 99.00,
    billing_plan: 'monthly',
    contract_status: 'active',
    pending_tasks: [
      { id: 'task-1', label: 'Fotografías profesionales de platos estrella', done: true },
      { id: 'task-2', label: 'Logotipo en alta resolución o vector transparente', done: true },
      { id: 'task-3', label: 'Carta completa de comidas, postres y alérgenos', done: true },
      { id: 'task-4', label: 'Vinculación de dominio propio (.es / .com)', done: false },
      { id: 'task-5', label: 'Verificación de reservas directas por WhatsApp', done: true },
      { id: 'task-6', label: 'Firma de contrato y domiciliación bancaria', done: true }
    ],
    admin_notes: 'Carta Omakase revisada. Pendiente entrega de pegatinas QR.',
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
    client_access_key: 'TO-BUNKER-99',
    plan_name: 'Plan Hostelería Pro',
    budget: 99.00,
    billing_plan: 'monthly',
    contract_status: 'active',
    pending_tasks: [
      { id: 'task-1', label: 'Fotografías profesionales de platos estrella', done: true },
      { id: 'task-2', label: 'Logotipo en alta resolución o vector transparente', done: true },
      { id: 'task-3', label: 'Carta completa de comidas, postres y alérgenos', done: true },
      { id: 'task-4', label: 'Vinculación de dominio propio (.es / .com)', done: false },
      { id: 'task-5', label: 'Verificación de reservas directas por WhatsApp', done: true },
      { id: 'task-6', label: 'Firma de contrato y domiciliación bancaria', done: true }
    ],
    admin_notes: 'Pruebas de sonido y reservas completadas con éxito.',
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

