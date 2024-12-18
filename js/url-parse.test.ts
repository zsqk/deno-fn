import { assertEquals, assertThrows } from '@std/assert';
import { parseQueryPositiveInt, parseQueryString } from './url-parse.ts';

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
  assertEquals(parseQueryString(e), null);
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
  assertEquals(parseQueryPositiveInt(e), null);
  assertThrows(() => parseQueryPositiveInt(g), TypeError); // 负数不是正整数
  assertThrows(() => parseQueryPositiveInt(h), TypeError); // 小数不是整数
  assertThrows(() => parseQueryPositiveInt(i), TypeError); // 非数字字符串
});
