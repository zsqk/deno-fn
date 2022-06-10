import { encode } from 'https://deno.land/std@0.143.0/encoding/hex.ts';

export async function hashString(
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512',
  data: string,
): Promise<string> {
  const hashRes = new Uint8Array(
    await crypto.subtle.digest(
      algorithm,
      new TextEncoder().encode(data),
    ),
  );
  return hexString(hashRes);
}

export function hexString(data: Uint8Array): string {
  let s = '';
  for (const d of encode(data)) {
    s += String.fromCodePoint(d);
  }
  return s;
}

export async function hmac(
  hash: 'SHA-256' | 'SHA-512',
  /** secret key */
  s: string | Uint8Array,
  /** data */
  d: string | Uint8Array,
) {
  const keyData = typeof s === 'string' ? new TextEncoder().encode(s) : s;
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash },
    true,
    ['sign', 'verify'],
  );

  const data = typeof d === 'string' ? new TextEncoder().encode(d) : d;

  const res = new Uint8Array(
    await crypto.subtle.sign(
      'HMAC',
      key,
      data,
    ),
  );

  return res;
}
