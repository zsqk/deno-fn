import { delay } from 'https://deno.land/std@0.153.0/async/delay.ts';

/**
 * 判断一个错误是否是网络错误, 如果是网络错误, 一般可以重试
 * @param err 需要判断的错误, 需要继承 `Error`
 * @returns 返回是否是网络错误
 */
export function isNetworkError(err: Error): boolean {
  if (
    err.name === 'ConnectionError' ||
    err.name === 'ConnectionReset' ||
    err.name === 'ConnectionRefused' ||
    err.name === 'TimedOut' ||
    err.message.includes('tls handshake eof') ||
    err.message.includes('failed to lookup address information') ||
    err.message.includes('Could not check if server accepts SSL connections')
  ) {
    return true;
  }
  return false;
}

/**
 * [高阶函数] 网络错误时自动重试
 * @param fn 函数本身, 需要为异步
 * @param opt 参数
 */
// deno-lint-ignore no-explicit-any
export function autoRetry<T extends Array<any>, R>(
  fn: (...rest: T) => Promise<R>,
  { retry = 3, isRetryable = isNetworkError, delayms = 0, timeout = 0 }: {
    /** 可重试次数, 默认为 3 */
    retry?: number;
    /** 判断发生错误后是否可以重试 */
    isRetryable?: (err: Error) => boolean;
    /** 延迟时间, 毫秒, 默认不延迟 */
    delayms?: number;
    /** 超时时间, 毫秒, 默认不限 */
    timeout?: number;
  } = {},
) {
  let left = retry;
  let timeoutError: Error;
  const max = Date.now() + timeout;
  return async (...rest: T) => {
    while (left > 0) {
      if (timeout && Date.now() > max) {
        break;
      }
      left--;
      console.log(`第 ${retry - left} 次尝试`);
      try {
        const res = await fn(...rest);
        return res;
      } catch (err: unknown) {
        if (!(err instanceof Error)) {
          throw new Error(`${err}`);
        }
        if (isRetryable(err)) {
          timeoutError = err;
          delayms && await delay(delayms);
          continue;
        }
        throw err;
      }
    }
    timeoutError.message += ` and retryed ${retry - left} times`;
    throw timeoutError;
  };
}
