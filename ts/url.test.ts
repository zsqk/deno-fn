import { assertEquals, assertThrows } from '@std/assert';
import { parseQueryString } from './url.ts';

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
