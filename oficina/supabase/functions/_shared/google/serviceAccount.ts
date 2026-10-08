import { type Env, requireSecret } from '../env.ts';
import { apiErrorMessage, fetchJson, type FetchFn, ProviderError } from '../http.ts';

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/siteverification',
  'https://www.googleapis.com/auth/webmasters',
];

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlJson = (obj: unknown) => b64url(new TextEncoder().encode(JSON.stringify(obj)));

function pemToPkcs8(pem: string): Uint8Array<ArrayBuffer> {
  const body = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s+/g, '');
  return Uint8Array.from(atob(body), (c) => c.charCodeAt(0));
}

export function parseServiceAccount(raw: string): ServiceAccountKey {
  let key: ServiceAccountKey;
  try {
    key = JSON.parse(raw);
  } catch {
    throw new ProviderError('gsc', 'GOOGLE_SERVICE_ACCOUNT_JSON no es un JSON válido');
  }
  if (!key.client_email || !key.private_key) {
    throw new ProviderError('gsc', 'GOOGLE_SERVICE_ACCOUNT_JSON no tiene client_email o private_key');
  }
  return key;
}

/** Token OAuth de la cuenta de servicio (flujo JWT bearer, firmado con RS256 vía WebCrypto). */
export async function serviceAccountToken(env: Env, fetchFn: FetchFn, now = new Date()): Promise<{ token: string; email: string }> {
  const key = parseServiceAccount(requireSecret(env, 'GOOGLE_SERVICE_ACCOUNT_JSON'));
  const tokenUri = key.token_uri ?? 'https://oauth2.googleapis.com/token';
  const iat = Math.floor(now.getTime() / 1000);
  const unsigned = `${b64urlJson({ alg: 'RS256', typ: 'JWT' })}.${b64urlJson({
    iss: key.client_email,
    scope: GOOGLE_SCOPES.join(' '),
    aud: tokenUri,
    iat,
    exp: iat + 3600,
  })}`;

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToPkcs8(key.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(unsigned)));

  const res = await fetchJson<{ access_token: string }>(fetchFn, tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${b64url(signature)}`,
    }),
  });
  if (!res.ok || !res.data?.access_token) {
    throw new ProviderError('gsc', `no se pudo autenticar la cuenta de servicio: ${apiErrorMessage(res.data, res.status)}`, res.status);
  }
  return { token: res.data.access_token, email: key.client_email };
}
