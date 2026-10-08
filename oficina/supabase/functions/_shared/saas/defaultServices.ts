import type { TenantBusinessType } from '../types.ts';
import type { SaasService } from './gateway.ts';

type ServiceSeed = [name: string, price: number, minutes: number, icon: string];

/*
 * Servicios iniciales si el negocio no tiene ninguno. Precios en euros enteros (como services.price
 * del SaaS) y orientativos: el negocio los ajusta después desde su panel. Los iconos son claves del
 * mapa de BarberServiceIcons del SaaS.
 */
const SEEDS: Record<TenantBusinessType, ServiceSeed[]> = {
  barberia: [
    ['Corte', 12, 30, 'scissors'],
    ['Barba', 8, 20, 'beard'],
    ['Corte + Barba', 18, 45, 'scissors-crossed'],
    ['Arreglo de cuello y patillas', 5, 15, 'neck'],
  ],
  peluqueria: [
    ['Corte', 15, 30, 'scissors'],
    ['Lavado y peinado', 15, 30, 'wash'],
    ['Tinte', 35, 90, 'color'],
    ['Corte + Lavado y peinado', 25, 60, 'scissors-crossed'],
  ],
  salon: [
    ['Corte y peinado', 25, 45, 'scissors'],
    ['Lavado y peinado', 18, 30, 'wash'],
    ['Color', 40, 90, 'color'],
  ],
  estetica: [
    ['Diseño de cejas', 10, 20, 'contours'],
    ['Limpieza facial', 35, 60, 'wash'],
    ['Depilación', 15, 30, 'neck'],
  ],
  // Verticales nuevas: sin catálogo por defecto, cada SaaS (restaurantes, clínicas…) trae el suyo.
  restaurante: [],
  cafeteria: [],
  clinica: [],
  otro: [],
};

export function defaultServices(businessId: string, type: TenantBusinessType): SaasService[] {
  return SEEDS[type].map(([name, price, minutes, icon], i) => ({
    business_id: businessId,
    name,
    price,
    duration: `${minutes}min`,
    duration_minutes: minutes,
    icon,
    sort_order: i,
  }));
}
