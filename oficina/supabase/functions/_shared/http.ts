export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/** Error que la función devuelve tal cual al cliente con su código HTTP. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

/** Fallo de un proveedor externo. El mensaje se guarda en tenant_integrations.error. */
export class ProviderError extends Error {
  constructor(
    readonly provider: string,
    message: string,
    readonly status?: number,
  ) {
    super(`${provider}: ${message}`);
  }
}

export type FetchFn = typeof fetch;

export interface FetchResult<T> {
  ok: boolean;
  status: number;
  data: T;
  headers: Headers;
}

/**
 * fetch con timeout que parsea JSON cuando lo hay. No lanza por códigos 4xx/5xx: cada
 * proveedor decide qué significan (p. ej. 404 = no existe todavía, 409 = ya existe).
 */
export async function fetchJson<T = unknown>(
  fetchFn: FetchFn,
  url: string,
  init: RequestInit = {},
  timeoutMs = 20_000,
): Promise<FetchResult<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchFn(url, { ...init, signal: controller.signal });
    const text = await res.text();
    let data: unknown = text;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // Respuesta no JSON (HTML de error, texto plano…): se devuelve como string.
      }
    }
    return { ok: res.ok, status: res.status, data: data as T, headers: res.headers };
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error(`Tiempo de espera agotado (${timeoutMs / 1000} s) llamando a ${new URL(url).host}`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** Extrae un mensaje legible de las respuestas de error de las distintas APIs. */
export function apiErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    const err = d.error;
    if (err && typeof err === 'object') {
      const e = err as Record<string, unknown>;
      if (typeof e.message === 'string') return `${e.message} (HTTP ${status})`;
    }
    if (typeof err === 'string') return `${err} (HTTP ${status})`;
    if (Array.isArray(d.errors) && d.errors.length) {
      const first = d.errors[0];
      if (typeof first === 'string') return `${first} (HTTP ${status})`;
      if (first && typeof first === 'object' && 'message' in first) return `${String(first.message)} (HTTP ${status})`;
    }
    if (typeof d.message === 'string') return `${d.message} (HTTP ${status})`;
  }
  if (typeof data === 'string' && data.trim()) return `${data.trim().slice(0, 200)} (HTTP ${status})`;
  return `HTTP ${status}`;
}
