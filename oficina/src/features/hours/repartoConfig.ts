/**
 * Reglas del reparto. Son una propuesta inicial: ajustadlas aquí y toda la app
 * (calculadora, widgets y fondo) se recalcula sola.
 *
 * De cada cobro de un proyecto:
 *  - `fund`      va al fondo común (dominios, hosting, herramientas, imprevistos).
 *  - `closing`   es la comisión del socio que cerró la venta.
 *  - `audit`     es para el socio que audita seguridad y calidad antes de publicar.
 *  - El resto se reparte entre los socios según sus horas verificadas en ese proyecto.
 */
export const REPARTO_RULES = {
  fund: 0.2,
  closing: 0.1,
  audit: 0.05,
} as const;

export const WORK_SHARE = 1 - REPARTO_RULES.fund - REPARTO_RULES.closing - REPARTO_RULES.audit;

/** Máximo de horas que cuentan por socio y día, aunque la sesión dure más. */
export const DAILY_CAP_HOURS = 8;

/** Margen tras el check-out en el que un push todavía verifica la sesión. */
export const PUSH_GRACE_MINUTES = 15;

/** Saldo que el fondo común no reparte nunca. */
export const FUND_MIN_RESERVE = 300;
