/**
 * 检查是否是 IPv4
 * @param str 任意可能是 IP 的字符串
 */
export function checkIPv4(str: string): boolean {
  const arr = str.split('.');
  if (arr.length !== 4) {
    return false;
  }
  for (const v of arr) {
    // 不允许空格
    if (v.trim() !== v) {
      return false;
    }
    const n = Number(v);
    if (!Number.isInteger(n)) {
      return false;
    }
    if (n < 0 || n > 255) {
      return false;
    }
  }
  return true;
}
