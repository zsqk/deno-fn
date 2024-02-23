import {
  decode,
  encode,
} from 'https://deno.land/std@0.151.0/encoding/base64.ts';
import { isBufferSource } from '../ts/binary.ts';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * 生成 key 功能
 *
 * 功能点:
 *
 * 1. 随机生成 key.
 * 2. 支持传入的 base64 编码 key.
 * 3. 支持传入的二进制 key.
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
    u8aKey = genIV(k / 8);
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
 * @param method Math.random 更快且兼容性更强, getRandomValues 更随机
 * 经测试, Math.random 速度会快 50% 左右, 但基于安全考虑, 如果不指定, 则优先使用
 * getRandomValues, 如果无法使用 getRandomValues, 再回退到 Math.random.
 * @returns 随机的初始向量
 */
export function genIV(
  l: number,
  method?: 'Math.random' | 'getRandomValues',
): Uint8Array {
  if (
    method === 'getRandomValues' ||
    (method === undefined &&
      typeof window.crypto?.getRandomValues === 'function')
  ) {
    return window.crypto.getRandomValues(new Uint8Array(l));
  }
  return new Uint8Array(l).map(() => Math.trunc(256 * Math.random()));
}

/**
 * 加密
 * @param cryptoKey 用于加密的 key
 * @param iv 随机向量
 * @param data 需要加密的数据.
 *             允许普通字符串 (并非 base64 字符串) 或者二进制数据
 * @returns 加密后的 base64 编码的结果
 */
export async function encrypt(
  cryptoKey: CryptoKey,
  iv: Uint8Array,
  data: Uint8Array | string,
): Promise<string> {
  const encrypted = await crypto.subtle.encrypt(
    { name: cryptoKey.algorithm.name, iv },
    cryptoKey,
    typeof data === 'string' ? textEncoder.encode(data) : data,
  );

  return encode(encrypted);
}

/**
 * Binary data
 */
type BinaryData =
  | BufferSource
  | { data: string; encodingType: 'utf8' }
  | { data: string; encodingType: 'base64' };

/**
 * <https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#data>
 */
type EncryptedData = BufferSource | { data: string; encodingType: 'base64' };

export function decrypt(
  cryptoKey: CryptoKey,
  iv: BinaryData,
  encrypted: EncryptedData,
  opt?: {
    /**
     * The encoding method of the decrypted data.
     * - The default value `utf8` is a UTF-8 string.
     * - `base64` is a string encoded as Base64.
     */
    decryptedEncodingType?: 'utf8' | 'base64';
    /**
     * Data that may be present during AES-GCM encryption to participate in
     * additional authentication.
     */
    additionalData?: BinaryData;
  },
): Promise<string>;
export function decrypt(
  cryptoKey: CryptoKey,
  iv: BinaryData,
  encrypted: EncryptedData,
  opt?: {
    /**
     * The encoding method of the decrypted data.
     * By default, it will be UTF-8 encoded. The `arraybuffer` is not encoded.
     */
    decryptedEncodingType?: 'arraybuffer';
    /**
     * Data that may be present during AES-GCM encryption to participate in
     * additional authentication.
     */
    additionalData?: BinaryData;
  },
): Promise<ArrayBuffer>;
/**
 * AES decryption based on key (AES-CBC, AES-GCM)
 * @param cryptoKey CryptoKey for decryption
 * @param iv initialization vector
 * @param encrypted Binary data to be decrypted, allowing base64 encoded strings
 *        and raw binary data.
 * @param opt
 * @param opt.decryptedEncodingType - default value `utf8`
 * @returns
 */
export async function decrypt(
  cryptoKey: CryptoKey,
  iv: BufferSource | { data: string; encodingType: 'base64' | 'utf8' },
  encrypted: BufferSource | { data: string; encodingType: 'base64' },
  {
    additionalData,
    decryptedEncodingType = 'utf8',
  }: {
    decryptedEncodingType?: 'arraybuffer' | 'utf8' | 'base64';
    additionalData?:
      | BufferSource
      | { data: string; encodingType: 'utf8' | 'base64' };
  } = {},
): Promise<string | ArrayBuffer> {
  let encryptedArray: BufferSource;
  if (isBufferSource(encrypted)) {
    encryptedArray = encrypted;
  } else if (encrypted?.encodingType === 'base64') {
    encryptedArray = decode(encrypted.data);
  } else {
    throw new TypeError('encrypted must be BufferSource or base64 string');
  }

  let additionalArray: BufferSource | undefined;
  if (isBufferSource(additionalData)) {
    additionalArray = additionalData;
  } else if (additionalData?.encodingType === 'utf8') {
    // 将 UTF-8 编码的 additionalData 转为二进制数据
    additionalArray = textEncoder.encode(additionalData.data);
  } else if (additionalData?.encodingType === 'base64') {
    // 将 base64 编码的 additionalData 转为二进制数据
    additionalArray = decode(additionalData.data);
  }

  let ivArray: BufferSource | undefined;
  if (isBufferSource(iv)) {
    ivArray = iv;
  } else if (iv?.encodingType === 'utf8') {
    // 将 UTF-8 编码的 ivData 转为二进制数据
    ivArray = textEncoder.encode(iv.data);
  } else if (iv?.encodingType === 'base64') {
    // 将 base64 编码的 ivData 转为二进制数据
    ivArray = decode(iv.data);
  }

  // 解密
  const decrypted = await crypto.subtle.decrypt(
    {
      name: cryptoKey.algorithm.name,
      iv: ivArray,
      additionalData: additionalArray,
    },
    cryptoKey,
    encryptedArray,
  );

  // 将解密后的内容编码为 UTF-8 字符串
  if (decryptedEncodingType === 'utf8') {
    return textDecoder.decode(decrypted);
  }

  // 将解密后的内容编码为 base64 字符串
  if (decryptedEncodingType === 'base64') {
    return encode(decrypted);
  }

  // 返回原始的解密后内容
  return decrypted;
}
