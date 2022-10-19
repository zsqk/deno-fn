import { encode } from "../lib/hex";

export async function hashString(
  algorithm: "SHA-1" | "SHA-256" | "SHA-512",
  d: string | Uint8Array
): Promise<string> {
  const data = typeof d === "string" ? new TextEncoder().encode(d) : d;
  const hashRes = new Uint8Array(await crypto.subtle.digest(algorithm, data));
  return hexString(hashRes);
}

/**
 * 将二进制数据储存为 HEX (16 进制字符串)
 * @param data 二进制数据
 * @returns HEX (16 进制字符串)
 */
export function hexString(data: Uint8Array): string {
  let s = "";
  for (const d of encode(data)) {
    s += String.fromCodePoint(d);
  }
  return s;
}

export async function hmac(
  key:
    | {
        hash: "SHA-1" | "SHA-256" | "SHA-512";
        /** secret key */
        s: string | Uint8Array;
      }
    | CryptoKey,
  /** data */
  d: string | Uint8Array
): Promise<Uint8Array> {
  const textEncoder = new TextEncoder();

  let cryptoKey: CryptoKey;
  if (key instanceof CryptoKey) {
    cryptoKey = key;
  } else {
    const { s, hash } = key;
    const keyData = typeof s === "string" ? textEncoder.encode(s) : s;
    cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash },
      true,
      ["sign", "verify"]
    );
  }

  const data = typeof d === "string" ? textEncoder.encode(d) : d;

  const res = new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, data));

  return res;
}
