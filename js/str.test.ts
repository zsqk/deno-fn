import { isSafeString } from './str.ts';
import { assert } from 'https://deno.land/std@0.131.0/testing/asserts.ts';

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
