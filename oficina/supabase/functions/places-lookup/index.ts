import { adminClient, requireAdmin } from '../_shared/auth.ts';
import { denoEnv, requireSecret } from '../_shared/env.ts';
import { openingHoursFromPlaces } from '../_shared/hours.ts';
import { corsHeaders, HttpError, json, ProviderError } from '../_shared/http.ts';
import { lookupPlace } from '../_shared/providers/places.ts';

/*
 * POST /places-lookup  { mapsUrl }
 * Botón "Autocompletar" del wizard de tenants. Resuelve la URL de Google Maps con Places API (New)
 * y devuelve nombre, dirección, coordenadas y horario. La API key nunca sale de aquí.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);

  try {
    await requireAdmin(req, denoEnv, adminClient(denoEnv));
    const body = await req.json().catch(() => null);
    const mapsUrl = typeof body?.mapsUrl === 'string' ? body.mapsUrl.trim() : '';
    if (!/^https?:\/\//.test(mapsUrl)) throw new HttpError(400, 'mapsUrl debe ser una URL de Google Maps');

    const { place } = await lookupPlace({ mapsUrl, placeId: null }, requireSecret(denoEnv, 'GOOGLE_MAPS_API_KEY'), fetch);
    return json({
      placeId: place.id,
      name: place.displayName?.text ?? '',
      address: place.formattedAddress ?? '',
      lat: place.location?.latitude ?? null,
      lng: place.location?.longitude ?? null,
      openingHours: openingHoursFromPlaces(place.regularOpeningHours?.periods),
    });
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    // Errores de Places (URL no reconocida, sin resultados…): 422 con el motivo para el wizard.
    if (e instanceof ProviderError) return json({ error: e.message }, 422);
    console.error('places-lookup', e);
    return json({ error: e instanceof Error ? e.message : 'Error inesperado' }, 500);
  }
});
