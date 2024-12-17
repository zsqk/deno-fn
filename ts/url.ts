import { isSafeString, SafeString } from './string.ts';

/**
 * Convert URL query parameter value to string
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 * @returns A SafeString, null, or undefined
 *          - Returns null if input is null or "null"
 *          - Returns undefined if input is "undefined" or empty string
 *          - Returns trimmed SafeString for valid input
 *          - Throws TypeError for invalid input
 *
 * @author iugo <code@iugo.dev>
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
