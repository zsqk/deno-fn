import { toInt, toPositiveInt } from '../ts/number-type-convert.ts';
import { assertSafeString, SafeString } from '../ts/string.ts';

/**
 * 清理净化字符串
 * @param str - 需要清理净化的字符串
 * @param options - Configuration options
 *                 配置选项
 * @param options.replaceWith - 用于替换特殊字符的字符串
 *                           默认为空字符串 ''
 * @returns 清理净化后的字符串
 */
export function sanitizeString(
  str: string,
  {
    /**
     * 用于替换特殊字符的字符串
     * 默认为空字符串 ''
     */
    replaceWith = '',
  }: {
    replaceWith?: string;
  } = {},
): string {
  // 移除 ASCII 范围内的特殊字符 (除了空格、数字、字母和下划线)
  // ASCII 范围: 0x21-0x2F (! " # $ % & ' ( ) * + , - . /)
  //            0x3A-0x40 (: ; < = > ? @)
  //            0x5B-0x5E ([ \ ] ^)
  //            0x60 (`)
  //            0x7B-0x7E ({ | } ~)
  return str.replace(
    /[\x21-\x2F\x3A-\x40\x5B-\x5E\x60\x7B-\x7E]/g,
    replaceWith,
  );
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
 * parseQueryStringArray('|a|b|c', { separator: '|' }) // returns ['a', 'b', 'c']
 * parseQueryStringArray('a|b|c|', { separator: '|' }) // returns ['a', 'b', 'c']
 * parseQueryStringArray('|a|b|c|', { separator: '|' }) // returns ['a', 'b', 'c']
 * parseQueryStringArray(',a,b,c,') // returns ['a', 'b', 'c']
 * parseQueryStringArray('a,,b') // throws TypeError
 * parseQueryStringArray('a,,') // throws TypeError
 * parseQueryStringArray(',,a') // throws TypeError
 * parseQueryStringArray('a,') // returns ['a']
 * parseQueryStringArray(',a') // returns ['a']
 * parseQueryStringArray('') // returns undefined
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryStringArray(
  query: string | null,
  {
    separator = ',',
    sanitizeWithSeparator = false,
  }: {
    /**
     * 用于分割字符串的分隔符
     * 默认为逗号 ','
     */
    separator?: string;
    /**
     * 用于替换特殊字符的字符串
     * 默认不进行特殊字符替换 (如果出现会报错)
     */
    sanitizeWithSeparator?: boolean;
  } = {},
): SafeString[] | undefined {
  if (query === null || query === 'undefined' || query === '') {
    return undefined;
  }

  const queryString = sanitizeWithSeparator
    ? sanitizeString(query, { replaceWith: separator })
    : query;

  try {
    const arr = queryString.split(separator);

    // 如果分割后所有元素都是空字符串，抛出错误
    if (arr.every((v) => v === '')) {
      throw new TypeError(`invalid query string array: ${query}`);
    }

    // 检查是否包含连续的分隔符（中间有空字符串）
    // 例如: "a,,c" 或 "a,b,," 或 ",,a"
    const hasConsecutiveSeparators = arr.some((v, i) =>
      v === '' && i > 0 && i < arr.length - 1
    );
    if (hasConsecutiveSeparators) {
      throw new TypeError(`invalid query string array: ${query}`);
    }

    // 检查是否以分隔符结尾且前面有字符串（如 "a,," 或 "a|b|"）
    // 但如果以分隔符开头（如 ",a,"），则允许
    // 注释中的示例表明以分隔符结尾是被允许的，所以移除这个检查

    // 过滤掉空字符串，然后验证每个元素
    const filteredArr = arr.filter((v) => v !== '');

    for (const v of filteredArr) {
      assertSafeString(v);
    }

    return filteredArr.length === 0 ? undefined : filteredArr;
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
 * 1. 允许特定分隔符, 默认为 `,`
 * 2. 将每一项转为整型
 * 3. 允许头尾有分隔符, 但不允许数组中间有空项
 * 4. 验证所有整数都为正整数
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 * @param options - Configuration options
 *                 配置选项
 * @param options.separator - Delimiter used to split the string (默认为逗号 ',')
 *                          用于分割字符串的分隔符
 * @returns An array of positive integers or undefined
 *          返回正整数数组或 undefined
 *          - Returns undefined if input is null, "undefined" or empty string
 *            当输入为 null、"undefined" 或空字符串时返回 undefined
 *          - Returns array of positive integers for valid input
 *            对于有效的数字输入返回正整数数组
 *          - Throws TypeError for invalid input or non-positive integers
 *            当输入无效或包含非正整数时抛出 TypeError
 *
 * @example
 * parseQueryPositiveInts('1,2,3') // returns [1, 2, 3]
 * parseQueryPositiveInts('-1,0,1') // throws TypeError
 * parseQueryPositiveInts('0,1') // throws TypeError
 * parseQueryPositiveInts('-1,1') // throws TypeError
 * parseQueryPositiveInts('') // returns undefined
 * parseQueryPositiveInts('1|2|3', { separator: '|' }) // returns [1, 2, 3]
 * parseQueryPositiveInts('abc') // throws TypeError
 * parseQueryPositiveInts('1,2,c') // throws TypeError
 * parseQueryPositiveInts('1,,c') // throws TypeError
 * parseQueryPositiveInts('1,,') // throws TypeError
 * parseQueryPositiveInts(',,') // throws TypeError
 * parseQueryPositiveInts(',1,') // return [1]
 * parseQueryPositiveInts('|1|2|', { separator: '|' }) // return [1, 2]
 * parseQueryPositiveInts('|1|2', { separator: '|' }) // return [1, 2]
 * parseQueryPositiveInts('1|2|', { separator: '|' }) // return [1, 2]
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryPositiveInts(
  query: string | null,
  { separator = ',' }: { separator?: string } = {},
): number[] | undefined {
  try {
    // 完全依赖 parseQueryInts 进行解析
    const ints = parseQueryInts(query, { separator });
    if (ints === undefined) {
      return undefined;
    }

    // 只添加正整数验证：检查是否有负数或 0
    for (const num of ints) {
      if (num <= 0) {
        throw new TypeError(`invalid query positive int array: ${query}`);
      }
    }

    return ints;
  } catch (error) {
    // 如果 parseQueryInts 抛出错误，重新抛出正确的错误消息
    if (
      error instanceof TypeError &&
      error.message.includes('invalid query int array')
    ) {
      throw new TypeError(`invalid query positive int array: ${query}`);
    }
    throw error;
  }
}

/**
 * Convert URL query parameter value to array of integers
 * 将 URL 查询参数值转换为整数数组
 *
 * 1. 允许特定分隔符, 默认为 `,`
 * 2. 将每一项转为整型
 * 3. 允许头尾有分隔符, 但不允许数组中间有空项
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 * @param options - Configuration options
 *                 配置选项
 * @param options.separator - Delimiter used to split the string (默认为逗号 ',')
 *                          用于分割字符串的分隔符
 * @returns An array of integers or undefined
 *          返回整数数组或 undefined
 *          - Returns undefined if input is null, "undefined" or empty string
 *            当输入为 null、"undefined" 或空字符串时返回 undefined
 *          - Returns array of integers for valid input
 *            对于有效的数字输入返回整数数组
 *          - Throws TypeError for invalid input
 *            当输入无效时抛出 TypeError
 *
 * @example
 * parseQueryInts('1,2,3') // returns [1, 2, 3]
 * parseQueryInts('-1,0,1') // returns [-1, 0, 1]
 * parseQueryInts('') // returns undefined
 * parseQueryInts('1|2|3', { separator: '|' }) // returns [1, 2, 3]
 * parseQueryInts('abc') // throws TypeError
 * parseQueryInts('1,2,c') // throws TypeError
 * parseQueryInts('1,,c') // throws TypeError
 * parseQueryInts('1,,3') // throws TypeError
 * parseQueryInts('1,,') // throws TypeError
 * parseQueryInts(',,') // throws TypeError
 * parseQueryInts(',1,') // return [1]
 * parseQueryInts('|1|2|', { separator: '|' }) // return [1, 2]
 * parseQueryInts('|1|2', { separator: '|' }) // return [1, 2]
 * parseQueryInts('1|2|', { separator: '|' }) // return [1, 2]
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryInts(
  query: string | null,
  { separator = ',' }: { separator?: string } = {},
): number[] | undefined {
  if (query === null || query === 'undefined' || query === '') {
    return undefined;
  }
  try {
    const arr = query.split(separator);
    // 如果分割后所有元素都是空字符串，抛出错误
    if (arr.every((v) => v === '')) {
      throw new TypeError(`invalid query int array: ${query}`);
    }

    // 检查是否包含连续的分隔符（中间有空字符串）
    // 例如: "1,,3" 或 "1,2,," 或 ",,1"
    const hasConsecutiveSeparators = arr.some((v, i) =>
      v === '' && i > 0 && i < arr.length - 1
    );
    if (hasConsecutiveSeparators) {
      throw new TypeError(`invalid query int array: ${query}`);
    }

    // 检查是否以分隔符结尾且前面有数字（如 "1,," 或 "1|2|"）
    // 但如果以分隔符开头（如 ",1,"），则允许
    // 注释中的示例表明以分隔符结尾是被允许的，所以移除这个检查

    // 过滤掉空字符串，然后转换为整数
    const result = arr.filter((v) => v !== '').map(toInt);
    return result.length === 0 ? undefined : result;
  } catch (_err) {
    throw new TypeError(`invalid query int array: ${query}`);
  }
}

/**
 * Convert URL query parameter value to array of numbers
 * 将 URL 查询参数值转换为数字数组
 *
 * @param query - URL query parameter value (typically from url.searchParams.get())
 *               URL 查询参数值（通常来自 url.searchParams.get()）
 * @param options - Configuration options
 *                 配置选项
 * @param options.separator - Delimiter used to split the string (默认为逗号 ',')
 *                          用于分割字符串的分隔符
 * @returns An array of numbers or undefined
 *          返回数字数组或 undefined
 *          - Returns undefined if input is null, "undefined" or empty string
 *            当输入为 null、"undefined" 或空字符串时返回 undefined
 *          - Returns array of numbers for valid input (包括整数和浮点数)
 *            对于有效的数字输入返回数字数组（包括整数和浮点数）
 *          - Throws TypeError for invalid input or NaN/Infinity values
 *            当输入无效或为 NaN/Infinity 时抛出 TypeError
 *
 * @example
 * parseQueryNumbers('1,2,3') // returns [1, 2, 3]
 * parseQueryNumbers('-1.5,0,1.5') // returns [-1.5, 0, 1.5]
 * parseQueryNumbers('') // returns undefined
 * parseQueryNumbers('1|2|3', { separator: '|' }) // returns [1, 2, 3]
 * parseQueryNumbers('abc') // throws TypeError
 *
 * @author iugo <code@iugo.dev>
 */
export function parseQueryNumbers(
  query: string | null,
  { separator = ',' }: { separator?: string } = {},
): number[] | undefined {
  if (query === null || query === 'undefined' || query === '') {
    return undefined;
  }
  try {
    const arr = query.split(separator).map((v) => {
      const num = parseQueryNumber(v);
      if (num === undefined) {
        throw new TypeError(`invalid number: ${v}`);
      }
      return num;
    });
    return arr.length === 0 ? undefined : arr;
  } catch (_err) {
    throw new TypeError(`invalid query number array: ${query}`);
  }
}
