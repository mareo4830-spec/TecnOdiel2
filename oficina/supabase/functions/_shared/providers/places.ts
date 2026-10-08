import { requireSecret } from '../env.ts';
import { apiErrorMessage, fetchJson, type FetchFn, ProviderError } from '../http.ts';
import { hasOpeningHours, openingHoursFromPlaces, type PlacesPeriod } from '../hours.ts';
import type { Step, StepContext, Tenant } from '../types.ts';

const API = 'https://places.googleapis.com/v1';
const FIELDS = 'id,displayName,formattedAddress,location,regularOpeningHours,googleMapsUri';

interface Place {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  regularOpeningHours?: { periods?: PlacesPeriod[]; weekdayDescriptions?: string[] };
  googleMapsUri?: string;
}

/** Lo que se puede sacar de una URL de Google Maps sin llamar a la API. */
export interface MapsUrlInfo {
  placeId?: string;
  query?: string;
  lat?: number;
  lng?: number;
}

const SHORT_HOSTS = ['maps.app.goo.gl', 'goo.gl'];

/** Sigue las redirecciones de los enlaces cortos (maps.app.goo.gl/…) hasta la URL larga. */
export async function expandMapsUrl(url: string, fetchFn: FetchFn): Promise<string> {
  let current = url;
  for (let hop = 0; hop < 5; hop++) {
    if (!SHORT_HOSTS.includes(new URL(current).hostname)) return current;
    const res = await fetchFn(current, { redirect: 'manual' });
    await res.body?.cancel();
    const location = res.headers.get('location');
    if (!location || res.status < 300 || res.status >= 400) {
      throw new ProviderError('places', `El enlace corto ${url} no redirige a Google Maps (HTTP ${res.status})`);
    }
    current = new URL(location, current).toString();
  }
  throw new ProviderError('places', `Demasiadas redirecciones al abrir ${url}`);
}

/** Extrae place_id, nombre buscado y coordenadas de los distintos formatos de URL de Maps. */
export function parseMapsUrl(url: string): MapsUrlInfo {
  const u = new URL(url);
  const info: MapsUrlInfo = {};
  const placeParam = u.searchParams.get('query_place_id') ?? u.searchParams.get('place_id');
  const q = u.searchParams.get('q') ?? u.searchParams.get('query') ?? '';
  if (placeParam) info.placeId = placeParam;
  else if (q.startsWith('place_id:')) info.placeId = q.slice('place_id:'.length);

  const place = u.pathname.match(/\/maps\/place\/([^/]+)/);
  if (place) info.query = decodeURIComponent(place[1].replace(/\+/g, ' '));
  else if (q && !q.startsWith('place_id:')) info.query = q;

  // Preferimos las coordenadas del marcador (!3d…!4d…) a las del encuadre del mapa (@lat,lng).
  const pin = url.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  const view = u.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  const coords = pin ?? view;
  if (coords) {
    info.lat = Number(coords[1]);
    info.lng = Number(coords[2]);
  }
  return info;
}

async function placeDetails(placeId: string, key: string, fetchFn: FetchFn): Promise<Place> {
  const res = await fetchJson<Place>(fetchFn, `${API}/places/${encodeURIComponent(placeId)}?languageCode=es`, {
    headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS },
  });
  if (!res.ok) throw new ProviderError('places', `Place Details: ${apiErrorMessage(res.data, res.status)}`, res.status);
  return res.data;
}

async function searchPlace(info: MapsUrlInfo, key: string, fetchFn: FetchFn): Promise<Place> {
  const body: Record<string, unknown> = { textQuery: info.query, languageCode: 'es', pageSize: 1 };
  if (info.lat !== undefined && info.lng !== undefined) {
    body.locationBias = { circle: { center: { latitude: info.lat, longitude: info.lng }, radius: 300 } };
  }
  const res = await fetchJson<{ places?: Place[] }>(fetchFn, `${API}/places:searchText`, {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': FIELDS.split(',').map((f) => `places.${f}`).join(','),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new ProviderError('places', `Text Search: ${apiErrorMessage(res.data, res.status)}`, res.status);
  const place = res.data.places?.[0];
  if (!place) throw new ProviderError('places', `Google no encuentra "${info.query}"; revisa la URL o pon el place_id a mano`);
  return place;
}

/** Busca el sitio en Places. Lo usa el paso de provisionado y el botón "Autocompletar" del wizard. */
export async function lookupPlace(
  input: { mapsUrl: string | null; placeId: string | null },
  key: string,
  fetchFn: FetchFn,
): Promise<{ place: Place; source: 'place_id' | 'url' | 'search' }> {
  if (input.placeId) return { place: await placeDetails(input.placeId, key, fetchFn), source: 'place_id' };
  if (!input.mapsUrl) throw new ProviderError('places', 'No hay URL de Google Maps ni place_id');
  const info = parseMapsUrl(await expandMapsUrl(input.mapsUrl, fetchFn));
  if (info.placeId) return { place: await placeDetails(info.placeId, key, fetchFn), source: 'url' };
  if (!info.query) throw new ProviderError('places', `No se reconoce el negocio en la URL ${input.mapsUrl}`);
  return { place: await searchPlace(info, key, fetchFn), source: 'search' };
}

/**
 * Paso 1 · places. Fija google_place_id y rellena dirección, coordenadas y horario solo si están
 * vacíos: lo que el socio editó a mano en el wizard manda.
 */
export const placesStep: Step = {
  name: 'places',
  provider: 'places',
  async run(ctx: StepContext) {
    const { tenant } = ctx;
    if (!tenant.google_maps_url && !tenant.google_place_id) {
      return { status: 'skipped', detail: 'Sin URL de Google Maps: se usan la dirección y el horario introducidos a mano' };
    }
    const key = requireSecret(ctx.env, 'GOOGLE_MAPS_API_KEY');
    const { place, source } = await lookupPlace({ mapsUrl: tenant.google_maps_url, placeId: tenant.google_place_id }, key, ctx.fetch);

    const patch: Partial<Tenant> = { google_place_id: place.id };
    const filled: string[] = [];
    if (!tenant.address?.trim() && place.formattedAddress) {
      patch.address = place.formattedAddress;
      filled.push('dirección');
    }
    if ((tenant.lat === null || tenant.lng === null) && place.location) {
      patch.lat = place.location.latitude;
      patch.lng = place.location.longitude;
      filled.push('coordenadas');
    }
    const hours = openingHoursFromPlaces(place.regularOpeningHours?.periods);
    if (!hasOpeningHours(tenant.opening_hours) && hours) {
      patch.opening_hours = hours;
      filled.push('horario');
    }

    return {
      status: 'ok',
      externalId: place.id,
      tenantPatch: patch,
      meta: {
        source,
        displayName: place.displayName?.text ?? null,
        formattedAddress: place.formattedAddress ?? null,
        location: place.location ?? null,
        weekdayDescriptions: place.regularOpeningHours?.weekdayDescriptions ?? null,
        googleMapsUri: place.googleMapsUri ?? null,
      },
      detail: `${place.displayName?.text ?? place.id} (${place.id})${filled.length ? ` · rellenado: ${filled.join(', ')}` : ' · datos manuales conservados'}`,
    };
  },
};
