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
    err.message.includes('failed to lookup address information') ||
    err.message.includes('Could not check if server accepts SSL connections')
  ) {
    return true;
  }
  return false;
}
