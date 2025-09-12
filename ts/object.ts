/** 字符串对象 */
export type StringObject = { [key: string]: string };

/** 空对象 */
export type EmptyObject = Record<string, never>;

/** 未知对象 */
export type UnknownObject = Record<string, unknown>;

/**
 * 非 Promise 对象
 */
export type NotPromise<T> = T extends Promise<infer _> ? never : T;

/** 判断是否为未知对象 */
export function isUnknownObject(v: unknown): v is UnknownObject {
  if (typeof v !== 'object' || v === null) {
    return false;
  }
  return true;
}

/** 断言为未知对象 */
export function assertUnknownObject(v: unknown): asserts v is UnknownObject {
  if (typeof v !== 'object' || v === null) {
    throw new TypeError('Expected an object');
  }
}

/**
 * 断言为数组
 * @param v 需要断言的变量
 */
export function assertArray(v: unknown): asserts v is Array<unknown> {
  if (!Array.isArray(v)) {
    throw new TypeError('Expected an array');
  }
}

/**
 * 断言为长度大于 0 的数组
 * @param v 需要断言的变量
 * @param options 可选参数
 * @param options.genErr 生成错误的方法, 默认是返回一个 TypeError
 */
export function assertNonEmptyArray(
  v: unknown,
  {
    genErr = () =>
      new TypeError(`should be non-empty array but ${JSON.stringify(v)}`),
  }: {
    genErr?: (v: unknown) => Error;
  } = {},
): asserts v is Array<unknown> {
  if (!isNonEmptyArray(v)) {
    throw genErr(v);
  }
}

/** 判断是否为非空数组 */
export function isNonEmptyArray(v: unknown): v is Array<unknown> {
  return Array.isArray(v) && v.length > 0;
}

/** 判断是否为普通对象（非数组、非函数等） */
export function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null) {
    return false;
  }
  // 检查原型链
  const proto = Object.getPrototypeOf(v);
  return proto === null || proto === Object.prototype;
}

/** 断言为普通对象 */
export function assertPlainObject(
  v: unknown,
): asserts v is Record<string, unknown> {
  if (typeof v !== 'object' || v === null) {
    throw new TypeError('Expected an object');
  }
  const proto = Object.getPrototypeOf(v);
  if (proto !== null && proto !== Object.prototype) {
    throw new TypeError('Expected a plain object');
  }
}
