import { isSafeString, SafeString } from './string.ts';

/**
 * 将 URL query 字符串转换为字符串
 * @param query - URL query 字符串
 * @returns 对象
 */
export function parseQueryString(
  query: string | null,
): SafeString | null | undefined {
  if (query === null) {
    return null;
  }
  const trimmedQuery = query.trim();
  if (trimmedQuery === 'null') {
    return null;
  }
  if (trimmedQuery === 'undefined' || trimmedQuery === '') {
    return undefined;
  }
  if (!isSafeString(trimmedQuery)) {
    throw new TypeError(`invalid query string: ${query}`);
  }
  return trimmedQuery;
}
