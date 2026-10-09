import { Banknote, Bot, Calendar, Globe2, MessageCircle, QrCode, ShieldCheck, Store } from 'lucide-react';

/** Mismos valores que `leads.business_type` en la Oficina Virtual (ver migración formulario_publico). */
export const SECTORS = [
  { id: 'restaurante', label: 'Restaurantes y Bares' },
  { id: 'clinica', label: 'Clínicas y Salud' },
];

export const AMBIENTES = [
  { id: 'minimalista', label: 'Minimalista', desc: 'Limpio, blanco, directo al grano' },
  { id: 'clasico', label: 'Clásico', desc: 'Elegante, de toda la vida' },
  { id: 'elegante', label: 'Elegante', desc: 'Tipografía grande, con carácter' },
  { id: 'divertido', label: 'Divertido', desc: 'Cercano, colorido, desenfadado' },
];

/** Cada función suma a `pricing.js`. El icono es solo decorativo. */
export const FEATURES = [
  { id: 'reservas', label: 'Reserva de citas online', desc: 'Tus clientes reservan solos, sin llamadas', icon: Calendar },
  { id: 'carta', label: 'Carta o menú digital con QR', desc: 'Sin PDFs, se actualiza al momento', icon: QrCode },
  { id: 'panel', label: 'Panel de administrador', desc: 'Gestiona todo tú mismo, sin depender de nosotros', icon: ShieldCheck },
  { id: 'seo', label: 'SEO local avanzado', desc: 'Que te encuentren en Google Maps y búsquedas', icon: Globe2 },
  { id: 'whatsapp', label: 'Contacto directo por WhatsApp', desc: 'Botón flotante, sin comisiones por mensaje', icon: MessageCircle },
  { id: 'pagos', label: 'Pasarela de pago online', desc: 'Cobra señales o el total por adelantado', icon: Banknote },
  { id: 'tienda', label: 'Tienda / pedidos online', desc: 'Vende productos o pedidos para recoger', icon: Store },
  { id: 'ia', label: 'Asistente con IA', desc: 'Responde dudas frecuentes de tus clientes solo', icon: Bot },
];
