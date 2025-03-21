import { assertEquals, assertThrows } from '@std/assert';
import {
  parseQueryInt,
  parseQueryInts,
  parseQueryNumber,
  parseQueryNumbers,
  parseQueryPositiveInt,
  parseQueryPositiveInts,
  parseQueryString,
  parseQueryStringArray,
  sanitizeString,
} from './url-parse.ts';

Deno.test('parseQueryString', () => {
  const url = new URL(
    'https://example.com/path?a=1&b=2&c=&d=d&e=null&f=undefined',
  );
  url.searchParams.set('b', '中');
  url.searchParams.set('g', ' ');
  url.searchParams.set('h', ';abc');
  const a = url.searchParams.get('a');
  const b = url.searchParams.get('b');
  const c = url.searchParams.get('c');
  const d = url.searchParams.get('d');
  const e = url.searchParams.get('e');
  const f = url.searchParams.get('f');
  const g = url.searchParams.get('g');
  console.log({ a, b, c, d, e, f, g });
  assertEquals(parseQueryString(a), '1');
  assertEquals(parseQueryString(b), '中');
  assertEquals(parseQueryString(c), undefined);
  assertEquals(parseQueryString(d), 'd');
  assertEquals(parseQueryString(e), 'null');
  assertEquals(parseQueryString(f), undefined);
  assertEquals(parseQueryString(g), undefined);
  assertThrows(() => parseQueryString(';abc'), TypeError);
});

Deno.test('parseQueryPositiveInt', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '1');
  url.searchParams.set('b', '2');
  url.searchParams.set('c', '');
  url.searchParams.set('d', '0');
  url.searchParams.set('e', 'null');
  url.searchParams.set('g', '-1');
  url.searchParams.set('h', '1.5');
  url.searchParams.set('i', 'abc');
  const a = url.searchParams.get('a');
  const b = url.searchParams.get('b');
  const c = url.searchParams.get('c');
  const d = url.searchParams.get('d');
  const e = url.searchParams.get('e');
  const g = url.searchParams.get('g');
  const h = url.searchParams.get('h');
  const i = url.searchParams.get('i');

  assertEquals(parseQueryPositiveInt(a), 1);
  assertEquals(parseQueryPositiveInt(b), 2);
  assertEquals(parseQueryPositiveInt(c), undefined);
  assertThrows(() => parseQueryPositiveInt(d), TypeError); // 0 不是正整数
  assertThrows(() => parseQueryPositiveInt(e), TypeError);
  assertThrows(() => parseQueryPositiveInt(g), TypeError); // 负数不是正整数
  assertThrows(() => parseQueryPositiveInt(h), TypeError); // 小数不是整数
  assertThrows(() => parseQueryPositiveInt(i), TypeError); // 非数字字符串
});

Deno.test('parseQueryStringArray #1', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', 'a,b,c');
  url.searchParams.set('b', 'x|y|z');
  url.searchParams.set('c', '');
  url.searchParams.set('d', 'a,,c');
  url.searchParams.set('e', '<script>,b,c');

  assertEquals(parseQueryStringArray(url.searchParams.get('a')), [
    'a',
    'b',
    'c',
  ]);
  assertEquals(
    parseQueryStringArray(url.searchParams.get('b'), { separator: '|' }),
    ['x', 'y', 'z'],
  );
  assertEquals(parseQueryStringArray(url.searchParams.get('c')), undefined);
  assertEquals(parseQueryStringArray(url.searchParams.get('d')), ['a', 'c']);
  assertThrows(
    () => parseQueryStringArray(url.searchParams.get('e')),
    TypeError,
  );
});

Deno.test('parseQueryStringArray with sanitization', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '<script>,alert(1),</script>');
  url.searchParams.set('b', 'hello!world,test@email');
  url.searchParams.set('c', '你好!世界,test#123');

  // 测试使用 sanitizeWithSeparator
  assertEquals(
    parseQueryStringArray(url.searchParams.get('a'), {
      sanitizeWithSeparator: true,
    }),
    ['script', 'alert', '1', 'script'],
  );

  assertEquals(
    parseQueryStringArray(url.searchParams.get('b'), {
      sanitizeWithSeparator: true,
    }),
    ['hello', 'world', 'test', 'email'],
  );

  assertEquals(
    parseQueryStringArray(url.searchParams.get('c'), {
      sanitizeWithSeparator: true,
    }),
    ['你好', '世界', 'test', '123'],
  );

  // 测试不使用 sanitizeWithSeparator（应该抛出错误）
  assertThrows(
    () => parseQueryStringArray(url.searchParams.get('a')),
    TypeError,
  );
});

Deno.test('parseQueryNumber', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '123');
  url.searchParams.set('b', '12.34');
  url.searchParams.set('c', '');
  url.searchParams.set('d', 'abc');
  url.searchParams.set('e', 'Infinity');
  url.searchParams.set('f', 'NaN');

  assertEquals(parseQueryNumber(url.searchParams.get('a')), 123);
  assertEquals(parseQueryNumber(url.searchParams.get('b')), 12.34);
  assertEquals(parseQueryNumber(url.searchParams.get('c')), undefined);
  assertThrows(() => parseQueryNumber(url.searchParams.get('d')), TypeError);
  assertThrows(() => parseQueryNumber(url.searchParams.get('e')), TypeError);
  assertThrows(() => parseQueryNumber(url.searchParams.get('f')), TypeError);
});

Deno.test('parseQueryInt', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '123');
  url.searchParams.set('b', '12.34');
  url.searchParams.set('c', '');
  url.searchParams.set('d', 'abc');
  url.searchParams.set('e', '-123');
  url.searchParams.set('f', '0');

  assertEquals(parseQueryInt(url.searchParams.get('a')), 123);
  assertThrows(() => parseQueryInt(url.searchParams.get('b')), TypeError);
  assertEquals(parseQueryInt(url.searchParams.get('c')), undefined);
  assertThrows(() => parseQueryInt(url.searchParams.get('d')), TypeError);
  assertEquals(parseQueryInt(url.searchParams.get('e')), -123);
  assertEquals(parseQueryInt(url.searchParams.get('f')), 0);
});

Deno.test('parseQueryPositiveInts', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '1,2,3');
  url.searchParams.set('b', '');
  url.searchParams.set('c', '1,0,3');
  url.searchParams.set('d', '1,-2,3');
  url.searchParams.set('e', '1,abc,3');

  assertEquals(parseQueryPositiveInts(url.searchParams.get('a')), [1, 2, 3]);
  assertEquals(parseQueryPositiveInts(url.searchParams.get('b')), undefined);
  assertThrows(
    () => parseQueryPositiveInts(url.searchParams.get('c')),
    TypeError,
  );
  assertThrows(
    () => parseQueryPositiveInts(url.searchParams.get('d')),
    TypeError,
  );
  assertThrows(
    () => parseQueryPositiveInts(url.searchParams.get('e')),
    TypeError,
  );
});

Deno.test('parseQueryInts', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '1,2,3');
  url.searchParams.set('b', '-1,0,1');
  url.searchParams.set('c', '');
  url.searchParams.set('d', '1|2|3');
  url.searchParams.set('e', '1,abc,3');
  url.searchParams.set('f', '1.5,2,3');

  assertEquals(parseQueryInts(url.searchParams.get('a')), [1, 2, 3]);
  assertEquals(parseQueryInts(url.searchParams.get('b')), [-1, 0, 1]);
  assertEquals(parseQueryInts(url.searchParams.get('c')), undefined);
  assertEquals(
    parseQueryInts(url.searchParams.get('d'), { separator: '|' }),
    [1, 2, 3],
  );
  assertThrows(() => parseQueryInts(url.searchParams.get('e')), TypeError);
  assertThrows(() => parseQueryInts(url.searchParams.get('f')), TypeError);
});

Deno.test('parseQueryNumbers', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '1,2,3');
  url.searchParams.set('b', '-1.5,0,1.5');
  url.searchParams.set('c', '');
  url.searchParams.set('d', '1|2|3');
  url.searchParams.set('e', '1,abc,3');
  url.searchParams.set('f', '1,Infinity,3');
  url.searchParams.set('g', '1,NaN,3');

  assertEquals(parseQueryNumbers(url.searchParams.get('a')), [1, 2, 3]);
  assertEquals(parseQueryNumbers(url.searchParams.get('b')), [-1.5, 0, 1.5]);
  assertEquals(parseQueryNumbers(url.searchParams.get('c')), undefined);
  assertEquals(
    parseQueryNumbers(url.searchParams.get('d'), { separator: '|' }),
    [1, 2, 3],
  );
  assertThrows(() => parseQueryNumbers(url.searchParams.get('e')), TypeError);
  assertThrows(() => parseQueryNumbers(url.searchParams.get('f')), TypeError);
  assertThrows(() => parseQueryNumbers(url.searchParams.get('g')), TypeError);
});

Deno.test('sanitizeString', () => {
  // 测试基本功能（默认替换为空字符串）
  assertEquals(sanitizeString('hello world'), 'hello world');
  assertEquals(sanitizeString('abc123'), 'abc123');
  assertEquals(sanitizeString('user_name'), 'user_name');
  assertEquals(sanitizeString('hello!world'), 'helloworld');
  assertEquals(sanitizeString('test@email.com'), 'testemailcom');

  // 测试使用自定义替换字符
  assertEquals(
    sanitizeString('hello!world', { replaceWith: '_' }),
    'hello_world',
  );
  assertEquals(
    sanitizeString('test@email.com', { replaceWith: '.' }),
    'test.email.com',
  );
  assertEquals(
    sanitizeString('<script>alert(1)</script>', { replaceWith: '-' }),
    '-script-alert-1---script-',
  );
  assertEquals(sanitizeString('[test]', { replaceWith: '_' }), '_test_');

  // 测试非 ASCII 字符（应该保留）
  assertEquals(sanitizeString('你好世界'), '你好世界');
  assertEquals(sanitizeString('こんにちは'), 'こんにちは');
  assertEquals(sanitizeString('안녕하세요'), '안녕하세요');

  // 测试混合字符和自定义替换
  assertEquals(
    sanitizeString('hello@世界', { replaceWith: '_' }),
    'hello_世界',
  );
  assertEquals(
    sanitizeString('test!你好#world', { replaceWith: '-' }),
    'test-你好-world',
  );
  assertEquals(
    sanitizeString('안녕!@#$%^&*하세요', { replaceWith: '.' }),
    '안녕........하세요',
  );

  // 测试空字符串
  assertEquals(sanitizeString(''), '');

  // 测试只包含特殊字符的字符串
  assertEquals(sanitizeString('!@#$%^&*()'), '');
  assertEquals(
    sanitizeString('!@#$%^&*()', { replaceWith: '_' }),
    '__________',
  );

  // 测试空格相关
  assertEquals(sanitizeString('  hello  world  '), '  hello  world  ');
  assertEquals(sanitizeString('\thello\nworld\r'), '\thello\nworld\r');
});
