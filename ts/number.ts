/** SafeInt < 2 ** 53 */
export type Int = number;

/** 自然数 (包含 0) */
export type NaturalNumber = number;

/** 判断是否为自然数 (包含 0) */
export function isNaturalNumber(v: unknown): v is NaturalNumber {
  return Number.isSafeInteger(v) && (v as number) >= 0;
}

/**
 * 断言传入值是一个自然数 (包含 0)
 * 默认情况下只允许自然数，不允许 null 或 undefined
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 额外允许的值类型, 默认不允许
 * @returns 断言 v 是 NaturalNumber 类型
 */
export function assertNaturalNumber(
  v: unknown,
  options?: {
    genErr?: (v: unknown) => Error;
    allow?: never;
  },
): asserts v is NaturalNumber;

/**
 * 断言传入值是一个自然数 (包含 0) 或 null
 * 允许传入 null 值，其他情况必须为自然数
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'null'，表示允许 null 值
 * @returns 断言 v 是 NaturalNumber | null 类型
 */
export function assertNaturalNumber(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'null';
  },
): asserts v is NaturalNumber | null;

/**
 * 断言传入值是一个自然数 (包含 0) 或 undefined
 * 允许传入 undefined 值，其他情况必须为自然数
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'undefined'，表示允许 undefined 值
 * @returns 断言 v 是 NaturalNumber | undefined 类型
 */
export function assertNaturalNumber(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'undefined';
  },
): asserts v is NaturalNumber | undefined;

/**
 * 断言传入值是一个自然数 (包含 0)、null 或 undefined
 * 允许传入 null 和 undefined 值，其他情况必须为自然数
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'null-undefined'，表示允许 null 和 undefined 值
 * @returns 断言 v 是 NaturalNumber | null | undefined 类型
 */
export function assertNaturalNumber(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'null-undefined';
  },
): asserts v is NaturalNumber | null | undefined;

export function assertNaturalNumber(
  v: unknown,
  {
    genErr = () => new TypeError(`should be natural number but ${v}`),
    allow,
  }: {
    genErr?: (v: unknown) => Error;
    allow?: 'null' | 'undefined' | 'null-undefined';
  } = {},
): asserts v is NaturalNumber | null | undefined {
  // 如果值为 null，检查是否允许
  if (v === null) {
    if (allow === 'null' || allow === 'null-undefined') {
      return;
    }
    throw genErr(v);
  }

  // 如果值为 undefined，检查是否允许
  if (v === undefined) {
    if (allow === 'undefined' || allow === 'null-undefined') {
      return;
    }
    throw genErr(v);
  }

  // 检查是否为自然数
  if (!isNaturalNumber(v)) {
    throw genErr(v);
  }
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
 * 默认情况下只允许正整数，不允许 null 或 undefined
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 额外允许的值类型, 默认不允许
 * @returns 断言 v 是 PositiveInteger 类型
 */
export function assertPositiveInteger(
  v: unknown,
  options?: {
    genErr?: (v: unknown) => Error;
    allow?: never;
  },
): asserts v is PositiveInteger;

/**
 * 断言传入值是一个正整数 (不包含 0) 或 null
 * 允许传入 null 值，其他情况必须为正整数
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'null'，表示允许 null 值
 * @returns 断言 v 是 PositiveInteger | null 类型
 */
export function assertPositiveInteger(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'null';
  },
): asserts v is PositiveInteger | null;

/**
 * 断言传入值是一个正整数 (不包含 0) 或 undefined
 * 允许传入 undefined 值，其他情况必须为正整数
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'undefined'，表示允许 undefined 值
 * @returns 断言 v 是 PositiveInteger | undefined 类型
 */
export function assertPositiveInteger(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'undefined';
  },
): asserts v is PositiveInteger | undefined;

/**
 * 断言传入值是一个正整数 (不包含 0)、null 或 undefined
 * 允许传入 null 和 undefined 值，其他情况必须为正整数
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'null-undefined'，表示允许 null 和 undefined 值
 * @returns 断言 v 是 PositiveInteger | null | undefined 类型
 */
export function assertPositiveInteger(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'null-undefined';
  },
): asserts v is PositiveInteger | null | undefined;

export function assertPositiveInteger(
  v: unknown,
  {
    genErr = () => new TypeError(`should be positive integer but ${v}`),
    allow,
  }: {
    genErr?: (v: unknown) => Error;
    allow?: 'null' | 'undefined' | 'null-undefined';
  } = {},
): asserts v is PositiveInteger | null | undefined {
  // 如果值为 null，检查是否允许
  if (v === null) {
    if (allow === 'null' || allow === 'null-undefined') {
      return;
    }
    throw genErr(v);
  }

  // 如果值为 undefined，检查是否允许
  if (v === undefined) {
    if (allow === 'undefined' || allow === 'null-undefined') {
      return;
    }
    throw genErr(v);
  }

  // 检查是否为正整数
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
