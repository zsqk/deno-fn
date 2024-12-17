/**
 * 转换类型为整数 (int)
 * Convert value to integer
 */
export function toInt(v: unknown): number {
  if (v === null) {
    throw new TypeError('should be int but null');
  }
  const num = Number(v);
  if (!Number.isSafeInteger(num)) {
    throw new TypeError(`should be int but ${num}`);
  }
  return num;
}

/**
 * 转换类型为正整数 (不包含 0)
 * Convert value to positive integer (greater than 0)
 */
export function toPositiveInt(value: unknown): number {
  const num = toInt(value);
  if (num <= 0) {
    throw new TypeError(`should be positive int but ${num}`);
  }
  return num;
}
