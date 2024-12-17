import { toInt, toPositiveInt } from './number-type-convert.ts';
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

/**
 * Convert URL query parameter value to number
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 * @returns A number, null, or undefined
 *          - Returns null if input is null or "null"
 *          - Returns undefined if input is "undefined" or empty string
 *          - Returns number for valid numeric input
 *          - Throws TypeError for invalid input
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryNumber(
  query: string | null,
): number | null | undefined {
  if (query === null || query === 'null') {
    return null;
  }
  if (query === '') {
    return undefined;
  }
  const trimmedQuery = query.trim();
  const num = Number(trimmedQuery);
  if (!Number.isFinite(num)) {
    throw new TypeError(`invalid query number: ${query}`);
  }
  return num;
}

/**
 * Convert URL query parameter value to integer
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 * @returns A number, null, or undefined
 *          - Returns null if input is null or "null"
 *          - Returns undefined if input is "undefined" or empty string
 *          - Returns integer for valid numeric input
 *          - Throws TypeError for invalid input
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryInt(query: string | null): number | null | undefined {
  const num = parseQueryNumber(query);
  if (num === null || num === undefined) {
    return num;
  }
  return toInt(num);
}

/**
 * Convert URL query parameter value to positive integer
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 * @returns A number, null, or undefined
 *          - Returns null if input is null or "null"
 *          - Returns undefined if input is "undefined" or empty string
 *          - Returns positive integer for valid numeric input
 *          - Throws TypeError for invalid input
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryPositiveInt(
  query: string | null,
): number | null | undefined {
  const num = parseQueryNumber(query);
  if (num === null || num === undefined) {
    return num;
  }
  return toPositiveInt(num);
}
