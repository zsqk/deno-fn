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
