# TecnOdiel Studio — Creador de Webs para Restaurantes & Motor de Reservas Booksy

Plataforma SaaS multi-inquilino de alto impacto visual inspirada en la estética minimalista y de lujo de [TecnOdiel](https://tecnodiel.vercel.app/), diseñada específicamente para restaurantes, gastrobares, trattorias y bares de noche.

---

## 🚀 Características Principales

## 28 Aspectos Arquitectonicos y de Personalizacion

El generador por cuestionario y el editor del panel permiten configurar 28 parametros directos que modelan la web en tiempo real:

### Modulo 01: Identidad Comercial & Concepto
1. **Tipologia Gastronomica**: Bar de Noche & Cocteleria, Alta Cocina & Michelin, Trattoria & Fuego de Lena, Speakeasy & Club Privado.
2. **Nombre Comercial del Establecimiento**: Titulo legal y marca visible.
3. **Subdominio Multi-Tenant Dedicado**: Ruta canonica (`slug.tecnodiel.app` y `/r/:slug`).
4. **Eslogan Principal / Claim Editorial**: Frase destacada del hero y tarjetas de comparticion.
5. **Descripcion Editorial & Filosofia Culinaria**: Manifiesto del restaurante y experiencia gastronomica.
6. **Codigo de Vestimenta (Dress Code)**: Etiqueta formal, Smart Casual, Casual de Autor o sin restriccion.

### Modulo 02: Arquitectura Estructural & Hero
7. **Plantilla Estructural Base**: Nocturne & Mixology, TecnOdiel Gastronomic, Trattoria Artisan Heritage, Velvet Speakeasy Club.
8. **Disposicion Espacial del Hero (Layout)**: Centrado Inmersivo, Split 50/50 Editorial o Minimalista Puro.
9. **Imagen de Cabecera (Hero Banner)**: Fotografia de autor con enlace de alta resolucion y selector rapido.
10. **Textura & Acabado Ambiental**: Halo de luz radial, Grano analógico cinemático, Vineta de alto contraste o Negro limpio.

### Modulo 03: Cromatica & Tipografia de Lujo
11. **Paleta de Autor Armonica**: Presets de lujo (Obsidiana Oro, Esmeralda Neon TecnOdiel, Cian Glaciar, Rubi Profundo, Terracota Fuego, Monocromo Platino).
12. **Color Primario de Marca**: Selector HEX y muestrario interactivo.
13. **Color Secundario / Acento de Luz**: Selector HEX para botones, glows y badges.
14. **Color de Fondo Nocturno**: Tonalidades profundas (#000000, #050507, #070204, etc.).
15. **Tipografia Principal de Títulos**: Inter (Swiss Neo-Grotesk), Outfit (Modern Clean), Playfair Display (Luxury Serif).

### Modulo 04: Motor de Reservas Directas Booksy
16. **Zonas de Mesa Configurables**: Salon Central, Terraza Climatizada, Barra VIP Cocteleria, Reservado Privado.
17. **Capacidad Maxima por Mesa**: Selector numerico de comensales (de 2 a 20 personas).
18. **Intervalos de Reserva**: Selector de slots (15 min, 30 min, 45 min, 60 min).
19. **Antelacion Minima de Reserva**: En el acto / mismo dia, 2 horas antes, 24 horas antes.
20. **Modo de Confirmacion**: Confirmacion instantanea automatica o Revision previa del maitre.

### Modulo 05: Horarios de Apertura & Logistica
21. **Turno de Almuerzo / Mediodia**: Habilitado / Deshabilitado con hora de apertura y cierre.
22. **Turno de Cena & Noche**: Habilitado / Deshabilitado con hora de apertura y cierre.
23. **Dias de Descanso Semanal**: Selector multiple de dias de cierre (Lunes, etc.).
24. **Alergenos & Filtros Dieteticos en Carta**: Gluten Free, Sin Lacteos, Vegano, Vegetariano, Halal.

### Modulo 06: Canales Directos, Localizacion & SEO
25. **Telefono Oficial de Atencion**: Llamada directa con enlace tel:.
26. **WhatsApp Business para Notificaciones**: Enlace directo con mensaje pre-redactado de la reserva.
27. **Correo Electronico Oficial**: Buzon de reservas e incidencias.
28. **Localizacion Fisica & Marcado Semantico**: Direccion postal, Ciudad, Codigo Postal, anclaje a Google Maps y datos estructurados Schema.org FoodEstablishment.

2. **Motor de Reservas Directas estilo Booksy (Sin Comisiones)**:
   - Selector interactivo de comensales (1 a 8+ personas).
   - Selector visual de calendario de los próximos 7 a 14 días.
   - Selector de turnos (Almuerzo / Cena / Copas).
   - Preferencia de zona de mesas (Terraza, Salón, Barra VIP).
   - Datos del cliente, alérgenos y notas especiales.
   - Generación de código de reserva único (ej: `#NOCT-8812`) con animación de confetti y enlace directo de confirmación para el WhatsApp del restaurante.

3. **Arquitectura de Base de Datos Única (Supabase Multi-Tenant)**:
   - **Una sola base de datos centralizada** con aislamiento multi-inquilino por `slug` y `subdomain`.
   - **Seguridad RLS (Row-Level Security)** activa en PostgreSQL.
   - **Modo seguro offline / demo automático**: Funciona al 100% de inmediato con caché reactiva y permite conectar tu proyecto de Supabase en cualquier momento desde el botón **"Configurar Supabase"** del panel.

4. **Estética Fiel a TecnOdiel**:
   - Fondo negro puro (`#000000`).
   - Luces y degradados radiales (`radial-spotlight`).
   - Tarjetas glassmorphic con desenfoque (`backdrop-blur-2xl`), bordes sutiles `border-white/10` y glows de acento esmeralda/ámbar.
   - Tipografía suiza geométrica de alto contraste y badges animados con pulsos de estado.

---

## Puesta en Marcha Local

El servidor de desarrollo ya se encuentra ejecutandose en segundo plano:

```bash
npm run dev
```

Enlace local: http://localhost:5173/

---

## Vinculacion con tu Supabase

1. Crea tu proyecto en Supabase (https://supabase.com).
2. Entra en el SQL Editor de tu proyecto Supabase.
3. Copia y ejecuta el archivo supabase_schema.sql.
4. En el panel de control de la app web, haz clic en "Configurar Supabase" e introduce:
   - Project URL (ej: https://xyzproject.supabase.co)
   - Anon / Public Key (ej: eyJhbGciOi...)
5. Toda la informacion se sincronizara de inmediato con aislamiento multi-inquilino y politicas RLS activas.

