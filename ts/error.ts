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
