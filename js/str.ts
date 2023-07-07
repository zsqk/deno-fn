type SafeString = string;
/**
 * check str in [az09AZ]
 */
export function isSafeString(str: string): str is SafeString {
  for (let i = 0; i < str.length; i++) {
    const u = str.codePointAt(i);
    if (!u) {
      return false;
    }
    if (u > 122 || u < 48) { // z=122, 0=48
      return false;
    }
    if (u > 57 && u < 65) { // 9=57, A=65
      return false;
    }
    if (u > 90 && u < 97) { // Z=90, a=97
      return false;
    }
  }
  return true;
}

/**
 * not a ramdom string (but faster)
 * @param len
 * @returns
 */
export function genSafeString(len: number): string {
  return new TextDecoder().decode(
    crypto.getRandomValues(new Uint8Array(len)).map((u) => {
      if (u > 122 || u < 48) { // z=122, 0=48
        return 122;
      }
      if (u > 57 && u < 65) { // 9=57, A=65
        return 122;
      }
      if (u > 90 && u < 97) { // Z=90, a=97
        return 122;
      }
      return u;
    }),
  );
}

/**
 * Generate a new random string
 *
 * @param len Should less than 65536
 * @param map Better is 256 % map.length = 0
 * - `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-=` (all)
 * - `abcdefghijkmnpqrstuvwxyz23456789` (lite)
 * @returns A ramdom string
 */
export function genRandomString(
  len: number,
  map = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-=',
): string {
  return crypto.getRandomValues(new Uint8Array(len)).reduce((p, v) => {
    return p + map[v % map.length];
  }, '');
}

/**
 * 编码字符串为 UTF-8
 * @param str 16 位的 Unicode 编码的 ASCII 字符串, 比如 `\u8fd9a` 表示 `这a`
 */
export function fromUnicodeStr(str: string): string {
  let encoded = '';
  let tempArr: number[] = [];
  for (let i = 0; i < str.length; i++) {
    const k = str[i];
    if (k === '\\') {
      if (str[i + 1] !== 'u') {
        throw new Error(`暂不支持 \\${str[i + 1]} 编码`);
      }
      tempArr.push(Number(`0x${str.slice(i + 2, i + 6)}`));
      i = i + 5;
      continue;
    }
    if (tempArr.length > 0) {
      encoded += String.fromCodePoint(...tempArr);
      tempArr = [];
    }
    encoded += k;
  }
  // 将最后还未编码的信息写入
  if (tempArr.length > 0) {
    encoded += String.fromCodePoint(...tempArr);
  }
  return encoded;
}

/**
 * 为文本添加 UTF-8 BOM (for Windows...)
 * - [Magic Number](https://en.wikipedia.org/wiki/Magic_number_(programming))
 * - [Byte Order Mark](https://en.wikipedia.org/wiki/Byte_order_mark)
 * @param v 需要增加 BOM 的文本
 * @returns
 */
export function textWithBOM(v: Uint8Array | string): Uint8Array {
  let data: Uint8Array;
  if (typeof v === 'string') {
    const encoder = new TextEncoder();
    data = encoder.encode(v);
  } else {
    if (v[0] === 239 && v[1] === 187 && v[2] === 191) {
      return v;
    }
    data = v;
  }

  /** EF BB BF */
  const mn = [239, 187, 191];
  const u8a = new Uint8Array(data.length + 3); // mn.length is 3
  u8a.set(mn);
  u8a.set(data, 3); // mn.length is 3

  return u8a;
}
