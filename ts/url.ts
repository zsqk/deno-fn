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
): SafeString | undefined {
  if (query === null) {
    return undefined;
  }
  const trimmedQuery = query.trim();
  if (trimmedQuery === 'undefined' || trimmedQuery === '') {
    return undefined;
  }
  if (!isSafeString(trimmedQuery)) {
    throw new TypeError(`invalid query string: ${query}`);
  }
  return trimmedQuery;
}

/**
 * Convert URL query parameter value to array of strings
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 * @returns An array of strings, null, or undefined
 *          - Returns null if input is null
 *          - Returns undefined if input is empty string
 *          - Returns array of strings for valid input
 *          - Throws TypeError for invalid input
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryStringArray(
  query: string | null,
  { separator = ',' }: { separator?: string } = {},
): string[] | undefined {
  if (query === null || query === 'undefined' || query === '') {
    return undefined;
  }

  try {
    const arr = query
      .split(separator)
      .map((v) => parseQueryString(v) ?? '')
      .filter(Boolean);

    return arr.length === 0 ? undefined : arr;
  } catch (_err) {
    throw new TypeError(`invalid query string array: ${query}`);
  }
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

/**
 * Convert URL query parameter value to array of positive integers
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 * @returns An array of positive integers, null, or undefined
 *          - Returns null if input is null
 *          - Returns undefined if input is empty string
 *          - Returns array of positive integers for valid input
 *          - Throws TypeError for invalid input
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryPositiveInts(
  query: string | null,
): number[] | undefined {
  if (query === null || query === 'undefined' || query === '') {
    return undefined;
  }
  try {
    return query.split(',').map(toPositiveInt);
  } catch (_err) {
    throw new TypeError(`invalid query positive int array: ${query}`);
  }
}
