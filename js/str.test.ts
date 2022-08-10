import { genRandomString, genSafeString, isSafeString } from './str.ts';
import { assert } from 'https://deno.land/std@0.131.0/testing/asserts.ts';
import { assertEquals } from 'https://deno.land/std@0.151.0/testing/asserts.ts';

Deno.test('isSafeString', () => {
  assert(isSafeString('9'));
  assert(isSafeString('0'));
  assert(isSafeString('a'));
  assert(isSafeString('z'));
  assert(isSafeString('A'));
  assert(isSafeString('Z'));
  assert(!isSafeString('.'));
  assert(!isSafeString('a🥳'));
  assert(
    !isSafeString(`
`),
  );
});

Deno.test('genSafeString', () => {
  const len = 65536;

  console.time('genSafeString');
  genSafeString(len);
  console.timeEnd('genSafeString');

  assertEquals(genSafeString(5).length, 5);
  assertEquals(typeof genSafeString(5)[4], 'string');
  console.log('genSafeString(5)', genSafeString(5));
});

Deno.test('genRandomString', () => {
  const len = 65536;

  console.time('genRandomString');
  genRandomString(len);
  console.timeEnd('genRandomString');

  assertEquals(genRandomString(5).length, 5);
  assertEquals(typeof genRandomString(5)[4], 'string');
  console.log('genRandomString(5)', genRandomString(5));
});
