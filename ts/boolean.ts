/** 判断是否为布尔值 */
export function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean';
}

/**
 * 断言传入值是一个布尔值
 * 默认情况下只允许布尔值，不允许 null 或 undefined
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 额外允许的值类型, 默认不允许
 * @returns 断言 v 是 boolean 类型
 */
export function assertBoolean(
  v: unknown,
  options?: {
    genErr?: (v: unknown) => Error;
    allow?: never;
  },
): asserts v is boolean;

/**
 * 断言传入值是一个布尔值或 null
 * 允许传入 null 值，其他情况必须为布尔值
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'null'，表示允许 null 值
 * @returns 断言 v 是 boolean | null 类型
 */
export function assertBoolean(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'null';
  },
): asserts v is boolean | null;

/**
 * 断言传入值是一个布尔值或 undefined
 * 允许传入 undefined 值，其他情况必须为布尔值
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'undefined'，表示允许 undefined 值
 * @returns 断言 v 是 boolean | undefined 类型
 */
export function assertBoolean(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'undefined';
  },
): asserts v is boolean | undefined;

/**
 * 断言传入值是一个布尔值、null 或 undefined
 * 允许传入 null 和 undefined 值，其他情况必须为布尔值
 * @param v 传入值
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 * @param options.allow 必须为 'null-undefined'，表示允许 null 和 undefined 值
 * @returns 断言 v 是 boolean | null | undefined 类型
 */
export function assertBoolean(
  v: unknown,
  options: {
    genErr?: (v: unknown) => Error;
    allow: 'null-undefined';
  },
): asserts v is boolean | null | undefined;

export function assertBoolean(
  v: unknown,
  {
    genErr = () => new TypeError(`should be boolean but ${JSON.stringify(v)}`),
    allow,
  }: {
    genErr?: (v: unknown) => Error;
    allow?: 'null' | 'undefined' | 'null-undefined';
  } = {},
): asserts v is boolean | null | undefined {
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

  // 检查是否为布尔值
  if (!isBoolean(v)) {
    throw genErr(v);
  }
}
