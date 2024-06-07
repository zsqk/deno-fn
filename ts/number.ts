/** SafeInt < 2 ** 53 */
export type Int = number;

/** 自然数 (包含 0) */
export type NaturalNumber = number;

/** 判断是否为自然数 (包含 0) */
export function isNaturalNumber(v: unknown): v is NaturalNumber {
  return Number.isSafeInteger(v) && (v as number) >= 0;
}

/** 正整数 (不包含 0) */
export type PositiveInteger = number;

/** 判断是否为正整数 (不包含 0) */
export function isPositiveInteger(v: unknown): v is PositiveInteger {
  return Number.isSafeInteger(v) && (v as number) > 0;
}

/** 人民币分 */
export type RMBFen = number;

/**
 * 判断是否为人民币分类型
 */
export function isRMBFen(v: unknown): v is RMBFen {
  return Number.isSafeInteger(v);
}

/** 比率 (比如利率), 0.01 = 1% */
export type Rate = number;
