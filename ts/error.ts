/**
 * 断言传入值是一个 Error
 * 常用在错误处理 catch 中.
 * @param v
 */
export function assertError(v: unknown): asserts v is Error {
  if (!(v instanceof Error)) {
    throw new TypeError(`should be Error but ${v}`);
  }
}

/**
 * [类型] 函数返回结果
 *
 * @description 可能出现错误的结果 (类似 Rust Result)
 */
export type Result<T, E extends Error = Error, L extends boolean = true> =
  L extends true ? [E, null] | [true, null] | [null, T]
    : [E, null] | [null, T];
