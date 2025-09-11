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
  if (!Number.isSafeInteger(v)) {
    return false;
  }
  return (v as number) > 0;
}

/**
 * 断言传入值是一个正整数 (不包含 0)
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allowNull 是否允许传入 null, 默认不允许
 * @param options.allowUndefined 是否允许传入 undefined, 默认不允许
 * @returns
 */
export function assertPositiveInteger(
  v: unknown,
  {
    genErr = () => new TypeError(`should be positive integer but ${v}`),
    allowNull,
    allowUndefined,
  }: {
    genErr?: (v: unknown) => Error;
    allowNull?: boolean;
    allowUndefined?: boolean;
  } = {},
): asserts v is PositiveInteger {
  if (allowNull && v === null) {
    return;
  }
  if (allowUndefined && v === undefined) {
    return;
  }
  if (!isPositiveInteger(v)) {
    throw genErr(v);
  }
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
