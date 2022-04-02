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
