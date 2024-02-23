/**
 * 校验或签名数据, 目的在于保护数据不被篡改及确认数据来源可靠.
 *
 * 主要有三种方式:
 *
 * 1. 非加密.
 * 2. HMAC 签名.
 * 3. RSA 签名.
 */
import { encodeHex } from 'https://deno.land/std@0.217.0/encoding/hex.ts';
import { decodeBase64 } from 'https://deno.land/std@0.217.0/encoding/base64.ts';

/**
 * 获取数据散列值
 * @param algorithm 可选 SHA-1 等算法, 不支持 MD5
 * @param d 需要计算散列值的数据
 * @returns 数据的散列值
 */
export async function hashString(
  algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512',
  d: string | Uint8Array,
): Promise<string> {
  const data = typeof d === 'string' ? new TextEncoder().encode(d) : d;
  const hashRes = new Uint8Array(
    await crypto.subtle.digest(
      algorithm,
      data,
    ),
  );
  return encodeHex(hashRes);
}

export async function hmac(
  key: {
    hash: 'SHA-1' | 'SHA-256' | 'SHA-512';
    /** secret key */
    s: string | Uint8Array;
  } | CryptoKey,
  /** data */
  d: string | Uint8Array,
): Promise<Uint8Array> {
  const textEncoder = new TextEncoder();

  let cryptoKey: CryptoKey;
  if (key instanceof CryptoKey) {
    cryptoKey = key;
  } else {
    const { s, hash } = key;
    const keyData = typeof s === 'string' ? textEncoder.encode(s) : s;
    cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash },
      true,
      ['sign', 'verify'],
    );
  }

  const data = typeof d === 'string' ? textEncoder.encode(d) : d;

  const res = new Uint8Array(
    await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      data,
    ),
  );

  return res;
}

/**
 * Sign data with RSA
 * - only pkcs8
 * - only RSASSA-PKCS1-v1_5
 * @param key
 * @param d
 * @returns
 */
export async function rsaSign(
  key: {
    hash: 'SHA-256' | 'SHA-512';
    /** secret key */
    s: string | Uint8Array;
  } | CryptoKey,
  /** data */
  d: string | Uint8Array,
): Promise<Uint8Array> {
  let cryptoKey: CryptoKey;
  if (key instanceof CryptoKey) {
    cryptoKey = key;
  } else {
    const { s, hash } = key;
    const keyData = typeof s === 'string' ? decodeBase64(s) : s;
    cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      keyData,
      { name: 'RSASSA-PKCS1-v1_5', hash: { name: hash } },
      true,
      ['sign'],
    );
  }

  const data = typeof d === 'string' ? new TextEncoder().encode(d) : d;

  const res = new Uint8Array(
    await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      data,
    ),
  );

  return res;
}
