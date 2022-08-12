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
