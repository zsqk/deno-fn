import {
  decode,
  encode,
} from 'https://deno.land/std@0.151.0/encoding/base64.ts';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * 生成 key 功能
 *
 * 功能点:
 *
 * 1. 随机生成 key.
 * 2. 生成后的 key 进行 base64 编码.
 * 3. 根据 base64 字符串生成 key.
 */
export async function genAesKey(
  type: 'AES-CBC' | 'AES-GCM',
  /**
   * base64 string 或者二进制数据, 或者选择密钥长度
   */
  k: string | Uint8Array | 128 | 192 | 256 = 192,
): Promise<[CryptoKey, Uint8Array]> {
  let u8aKey: Uint8Array;
  if (typeof k === 'string') {
    u8aKey = decode(k);
  } else if (typeof k === 'number') {
    u8aKey = new Uint8Array(k / 8).map(() => Math.trunc(256 * Math.random()));
  } else {
    u8aKey = k;
  }

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    u8aKey,
    {
      name: type,
    },
    false,
    ['encrypt', 'decrypt'],
  );
  return [cryptoKey, u8aKey];
}

/**
 * 生成 随机的初始向量
 * @param l 字节长度 (不是位长度)
 * @param method Math.random (默认值) 更快且兼容性更强, getRandomValues 更随机
 * @returns 随机的初始向量
 */
export function genIV(
  l: number,
  method: 'Math.random' | 'getRandomValues' = 'Math.random',
): Uint8Array {
  if (method === 'Math.random') {
    return new Uint8Array(l).map(() => Math.trunc(256 * Math.random()));
  }
  if (method === 'getRandomValues') {
    return window.crypto.getRandomValues(new Uint8Array(l));
  }
  throw new Error(`invalid method`);
}

/**
 * 加密
 * @param cryptoKey 用于加密的 key
 * @param iv 随机向量
 * @param data 需要加密的数据.
 *             允许普通字符串 (并非 base64 字符串) 或者二进制数据
 * @returns 加密后的 base64 编码的结果
 */
export async function encryptBase(
  cryptoKey: CryptoKey,
  iv: Uint8Array,
  data: Uint8Array | string,
) {
  const encrypted = await crypto.subtle.encrypt(
    { name: cryptoKey.algorithm.name, iv },
    cryptoKey,
    typeof data === 'string' ? textEncoder.encode(data) : data,
  );

  return encode(encrypted);
}

/**
 * 解密
 * @param cryptoKey 用于解密的 key
 * @param iv 随机向量
 * @param encrypted 需要解密的的二进制数据, 允许 base64 编码的字符串和普通
 * @returns
 */
export async function decryptBase(
  cryptoKey: CryptoKey,
  iv: Uint8Array,
  encrypted: string | Uint8Array,
) {
  const decrypted = await crypto.subtle.decrypt(
    { name: cryptoKey.algorithm.name, iv },
    cryptoKey,
    typeof encrypted === 'string' ? decode(encrypted) : encrypted,
  );

  return textDecoder.decode(decrypted);
}
