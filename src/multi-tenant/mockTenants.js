export const MOCK_TENANTS = [
  // --- HOSTELERÍA (6 PLANTILLAS) ---
  {
    id: 'tenant-noir-atelier',
    slug: 'noir-atelier',
    name: 'NOIR & ATELIER',
    tagline: 'Gastronomía Sensorial en la Penumbra',
    platform: 'hosteleria',
    template: 'the-awwwards-cinematic',
    city: 'Madrid / Barcelona',
    michelinStars: 2,
    description: 'Un santuario clandestino donde el fuego ancestral colisiona con la vanguardia técnica. Texturas indómitas y maridajes biodinámicos.',
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-chef-plating-a-gourmet-dish-40919-large.mp4',
    heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=90',
    meta: {
      instagram: '@noir.atelier',
      reservationPhone: '+34 910 889 201',
      address: 'Paseo de la Castellana 142, Subsuelo Privé, Madrid',
      hours: 'Miércoles a Domingo · 20:00 — 02:00'
    },
    experiencePasses: [
      { id: 'pass-1', title: 'EL ORIGEN DEL VACÍO', steps: '14 PASOS · ACTO I', price: '185€', notes: 'Pieles crujientes, caldo volcánico de tuétano, ciervo madurado en ceniza.' },
      { id: 'pass-2', title: 'ALQUIMIA CINEGÉTICA & MAR', steps: '21 PASOS · EDICIÓN TOTAL', price: '260€', notes: 'Gamba roja en grasa de buey gallego, trufa blanca fermentada, caviar ahumado.' }
    ],
    signatureDishes: [
      { id: 'd1', code: '01 / CARBON & CORAL', name: 'CIGALA EN LLAMA NEGRA', description: 'Cigala troncocónica flambeada al sarmiento vivo, mantequilla noisette y yuzu marino.', image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1400&q=85', year: '2026' },
      { id: 'd2', code: '02 / SANGRE VEGETAL', name: 'BETABEL EN COSTRA DE BREZO', description: 'Remolacha estofada 36 horas en jugo de pino ahumado y helado de trufa negra.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=85', year: '2026' },
      { id: 'd3', code: '03 / CARNE & TIEMPO', name: 'LOMO DE VACA RUBIA 120 DÍAS', description: 'Corte fino de lomo madurado en cámara de sal rosa, glaseado en demi-glace de tuétano.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=85', year: '2026' },
      { id: 'd4', code: '04 / NIEBLA NOCTURNA', name: 'ESFERA DE CACAO 85% & TURBA', description: 'Cacao salvaje de Chuao ahumado con whisky de Islay y sal volcánica.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=85', year: '2026' }
    ]
  },
  {
    id: 'tenant-smash-destroy',
    slug: 'smash-destroy',
    name: 'SMASH & DESTROY BURGER',
    platform: 'hosteleria',
    template: 'the-neo-bento-brutalist',
    city: 'Malasaña, Madrid'
  },
  {
    id: 'tenant-aura-velvet',
    slug: 'aura-velvet',
    name: 'AURA & VELVET COCKTAILS',
    platform: 'hosteleria',
    template: 'the-glass-fluid',
    city: 'Eixample, Barcelona'
  },
  {
    id: 'tenant-le-maison',
    slug: 'le-maison',
    name: 'LE MAISON DE PROVENCE',
    platform: 'hosteleria',
    template: 'the-editorial-print',
    city: 'San Sebastián'
  },
  {
    id: 'tenant-cyber-fusion',
    slug: 'cyber-fusion',
    name: 'CYBER_FUSION.OS',
    platform: 'hosteleria',
    template: 'the-cyber-terminal',
    city: 'Tokio / Valencia'
  },
  {
    id: 'tenant-casa-encina',
    slug: 'casa-encina',
    name: 'ASADOR CASA DE LA ENCINA',
    platform: 'hosteleria',
    template: 'the-rustic-organic',
    city: 'Segovia'
  },

  // --- CLÍNICAS (6 PLANTILLAS) ---
  {
    id: 'tenant-swiss-dental',
    slug: 'swiss-dental',
    name: 'SWISS DENTAL ATELIER',
    platform: 'clinicas',
    template: 'the-ultra-minimal-swiss',
    city: 'Zürich / Salamanca'
  },
  {
    id: 'tenant-genome-biotech',
    slug: 'genome-biotech',
    name: 'GENOME SPORT MEDICINE',
    platform: 'clinicas',
    template: 'the-dark-biotech',
    city: 'Barcelona High Performance'
  },
  {
    id: 'tenant-pequenos-gigantes',
    slug: 'pequenos-gigantes',
    name: 'PEQUEÑOS GIGANTES PEDIATRÍA',
    platform: 'clinicas',
    template: 'the-pediatric-playful',
    city: 'Sevilla'
  },
  {
    id: 'tenant-espacio-vacio',
    slug: 'espacio-vacio',
    name: 'ESPACIO VACÍO PSICOLOGÍA & SPA',
    platform: 'clinicas',
    template: 'the-horizontal-zen',
    city: 'Ibiza'
  },
  {
    id: 'tenant-aura-gold',
    slug: 'aura-gold',
    name: 'AURA GOLD CLINIC ESTÉTICA',
    platform: 'clinicas',
    template: 'the-luxury-curtain',
    city: 'Barrio de Salamanca, Madrid'
  },
  {
    id: 'tenant-ortho-tech',
    slug: 'ortho-tech',
    name: 'ORTHO_TECH STUDIO 3D',
    platform: 'clinicas',
    template: 'the-tech-ortho',
    city: 'Bilbao'
  }
];
