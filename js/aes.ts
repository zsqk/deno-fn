import {
  decode,
  encode,
} from 'https://deno.land/std@0.151.0/encoding/base64.ts';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export async function encrypt(
  keyStr: string,
  dataStr: string,
) {
  const u8aKey = decode(keyStr);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    u8aKey,
    {
      name: 'AES-CBC',
    },
    false,
    ['encrypt', 'decrypt'],
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-CBC', iv: u8aKey.slice(16) },
    cryptoKey,
    textEncoder.encode(dataStr),
  );

  return encode(encrypted);
}

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

export async function decrypt(
  keyStr: string,
  dataStr: string,
) {
  const u8aKey = decode(keyStr);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    u8aKey,
    {
      name: 'AES-CBC',
    },
    false,
    ['encrypt', 'decrypt'],
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: u8aKey.slice(16) },
    cryptoKey,
    decode(dataStr),
  );

  return textDecoder.decode(decrypted);
}

export async function encryptBase(
  cryptoKey: CryptoKey,
  iv: Uint8Array,
  dataStr: string,
) {
  const encrypted = await crypto.subtle.encrypt(
    { name: cryptoKey.algorithm.name, iv },
    cryptoKey,
    textEncoder.encode(dataStr),
  );

  return encode(encrypted);
}

export async function decryptBase(
  cryptoKey: CryptoKey,
  iv: Uint8Array,
  dataStr: string,
) {
  const decrypted = await crypto.subtle.decrypt(
    { name: cryptoKey.algorithm.name, iv },
    cryptoKey,
    decode(dataStr),
  );

  return textDecoder.decode(decrypted);
}

// 加密功能:
// 1. 随机生成 key.
// 2. 根据字符串生成 key.
