import type { SaasPlan } from '../../types';

/** Planes del modo demo (sin Supabase). Con Supabase se leen de la tabla `plans`, que trae los mismos de serie. */
export const DEMO_PLANS: SaasPlan[] = [
  {
    id: 'plan-basico',
    name: 'Básico',
    saasPlanCode: 'basic',
    setupPrice: 350,
    yearlyMaintenance: 50,
    monthlyAi: 0,
    features: { has_store: false, has_gallery: true, allow_manual_booking: true, enable_emails: false, enable_campaigns: false, enable_pwa: true, enable_seo_advanced: false },
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    saasPlanCode: 'pro',
    setupPrice: 600,
    yearlyMaintenance: 50,
    monthlyAi: 0,
    features: { has_store: true, has_gallery: true, allow_manual_booking: true, enable_emails: true, enable_campaigns: false, enable_pwa: true, enable_seo_advanced: true },
  },
  {
    id: 'plan-pro-ia',
    name: 'Pro+IA',
    saasPlanCode: 'premium',
    setupPrice: 600,
    yearlyMaintenance: 50,
    monthlyAi: 20,
    features: { has_store: true, has_gallery: true, allow_manual_booking: true, enable_emails: true, enable_campaigns: true, enable_pwa: true, enable_seo_advanced: true },
  },
];
