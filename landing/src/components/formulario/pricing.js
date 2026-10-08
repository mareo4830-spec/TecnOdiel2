/*
 * Calculadora de precio del formulario. Constantes ajustables a mano: no hay nada mágico aquí,
 * son los números que nos has dado como referencia (carta digital sola = 99€; web normal con
 * reservas + panel + SEO = 700-800€ nuestro frente a ~1800€ de una gran plataforma).
 */

// Si el cliente SOLO quiere la carta/menú digital, es el producto más barato, precio fijo.
const ONLY_MENU_PRICE = 99;

// Base de una web a medida (sin ninguna función extra).
const BASE_PRICE = 450;

const FEATURE_PRICE = {
  reservas: 150,
  carta: 60,
  panel: 120,
  seo: 80,
  whatsapp: 40,
  pagos: 100,
  tienda: 150,
  ia: 120,
};

// Lo que cobraría una gran plataforma por un alcance equivalente: referencia, no un cálculo real.
const PLATFORM_MULTIPLIER = 2.25;
const PLATFORM_MIN = 900;

export function computeOurPrice(selectedFeatures) {
  const onlyMenu = selectedFeatures.length === 1 && selectedFeatures[0] === 'carta';
  if (onlyMenu) return ONLY_MENU_PRICE;

  const total = selectedFeatures.reduce((sum, id) => sum + (FEATURE_PRICE[id] || 0), BASE_PRICE);
  return Math.round(total / 10) * 10;
}

export function computeReferencePrice(ourPrice, selectedFeatures) {
  const onlyMenu = selectedFeatures.length === 1 && selectedFeatures[0] === 'carta';
  if (onlyMenu) return Math.round((ourPrice * 1.8) / 10) * 10;

  return Math.max(PLATFORM_MIN, Math.round((ourPrice * PLATFORM_MULTIPLIER) / 50) * 50);
}
