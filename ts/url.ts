import { toInt, toPositiveInt } from './number-type-convert.ts';
import { isSafeString, SafeString } from './string.ts';

/**
 * Convert URL query parameter value to string
 * 将 URL 查询参数值转换为字符串
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 *               可以为 null 或字符串类型
 * @returns A SafeString or undefined
 *          返回安全字符串或 undefined
 *          - Returns undefined if input is null, "undefined" or empty string
 *            当输入为 null、"undefined" 或空字符串时返回 undefined
 *          - Returns trimmed SafeString for valid input
 *            对于有效输入返回经过去空格处理的安全字符串
 *          - Throws TypeError for invalid input containing unsafe characters
 *            当输入包含不安全字符时抛出 TypeError
 *
 * @example
 * parseQueryString('hello') // returns 'hello'
 * parseQueryString(null) // returns undefined
 * parseQueryString('') // returns undefined
 * parseQueryString('<script>') // throws TypeError
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
 * 将 URL 查询参数值转换为字符串数组
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 *               可以为 null 或字符串类型
 * @param options - Configuration options
 *                 配置选项
 * @param options.separator - Delimiter used to split the string (默认为逗号 ',')
 *                          用于分割字符串的分隔符
 * @returns An array of strings or undefined
 *          返回字符串数组或 undefined
 *          - Returns undefined if input is null, "undefined", empty string or results in empty array
 *            当输入为 null、"undefined"、空字符串或结果为空数组时返回 undefined
 *          - Returns array of non-empty strings for valid input
 *            对于有效输入返回非空字符串数组
 *          - Throws TypeError if any element contains unsafe characters
 *            当任何元素包含不安全字符时抛出 TypeError
 *
 * @example
 * parseQueryStringArray('a,b,c') // returns ['a', 'b', 'c']
 * parseQueryStringArray('a|b|c', { separator: '|' }) // returns ['a', 'b', 'c']
 * parseQueryStringArray('') // returns undefined
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
 * 将 URL 查询参数值转换为数字
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 *               可以为 null 或字符串类型
 * @returns A number or undefined
 *          返回数字或 undefined
 *          - Returns undefined if input is null, "undefined" or empty string
 *            当输入为 null、"undefined" 或空字符串时返回 undefined
 *          - Returns parsed number for valid numeric input (包括整数和浮点数)
 *            对于有效的数字输入返回解析后的数字（包括整数和浮点数）
 *          - Throws TypeError for non-numeric input or NaN/Infinity values
 *            当输入非数字或为 NaN/Infinity 时抛出 TypeError
 *
 * @example
 * parseQueryNumber('123') // returns 123
 * parseQueryNumber('12.34') // returns 12.34
 * parseQueryNumber('abc') // throws TypeError
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryNumber(
  query: string | null,
): number | undefined {
  if (query === null || query === 'undefined' || query === '') {
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
 * 将 URL 查询参数值转换为整数
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 * @returns A number or undefined
 *          返回整数或 undefined
 *          - Returns undefined if input is null, "undefined" or empty string
 *            当输入为 null、"undefined" 或空字符串时返回 undefined
 *          - Returns integer for valid numeric input
 *            对于有效的数字输入返回整数
 *          - Throws TypeError for invalid input
 *            当输入无效时抛出 TypeError
 *
 * @example
 * parseQueryInt('123') // returns 123
 * parseQueryInt('12.34') // returns 12
 * parseQueryInt('abc') // throws TypeError
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryInt(query: string | null): number | undefined {
  if (query === null || query === 'undefined' || query === '') {
    return undefined;
  }
  const num = parseQueryNumber(query);
  if (num === undefined) {
    return undefined;
  }
  return toInt(num);
}

/**
 * Convert URL query parameter value to positive integer
 * 将 URL 查询参数值转换为正整数
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 * @returns A number or undefined
 *          返回正整数或 undefined
 *          - Returns undefined if input is null, "undefined" or empty string
 *            当输入为 null、"undefined" 或空字符串时返回 undefined
 *          - Returns positive integer for valid numeric input
 *            对于有效的数字输入返回正整数
 *          - Throws TypeError for invalid input or non-positive numbers
 *            当输入无效或非正数时抛出 TypeError
 *
 * @example
 * parseQueryPositiveInt('123') // returns 123
 * parseQueryPositiveInt('-1') // throws TypeError
 * parseQueryPositiveInt('0') // throws TypeError
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryPositiveInt(
  query: string | null,
): number | undefined {
  if (query === null || query === 'undefined' || query === '') {
    return undefined;
  }
  const num = parseQueryNumber(query);
  if (num === undefined) {
    return undefined;
  }
  return toPositiveInt(num);
}

/**
 * Convert URL query parameter value to array of positive integers
 * 将 URL 查询参数值转换为正整数数组
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 * @returns An array of positive integers or undefined
 *          返回正整数数组或 undefined
 *          - Returns undefined if input is null, "undefined" or empty string
 *            当输入为 null、"undefined" 或空字符串时返回 undefined
 *          - Returns array of positive integers for valid input
 *            对于有效的数字输入返回正整数数组
 *          - Throws TypeError for invalid input
 *            当输入无效时抛出 TypeError
 *
 * @example
 * parseQueryPositiveInts('1,2,3') // returns [1, 2, 3]
 * parseQueryPositiveInts('') // returns undefined
 * parseQueryPositiveInts('1|2|3', { separator: '|' }) // returns [1, 2, 3]
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
