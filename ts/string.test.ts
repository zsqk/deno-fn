import { isSafeString, isStrictSafeString } from './string.ts';
import { assert } from '@std/assert';

Deno.test('isStrictSafeString', () => {
  assert(isStrictSafeString('9'));
  assert(isStrictSafeString('0'));
  assert(isStrictSafeString('a'));
  assert(isStrictSafeString('z'));
  assert(isStrictSafeString('A'));
  assert(isStrictSafeString('Z'));
  assert(isStrictSafeString('1234567890'));
  assert(!isStrictSafeString('Z_'));
  assert(!isStrictSafeString('_Z'));
  assert(!isStrictSafeString('.'));
  assert(!isStrictSafeString('a🥳'));
  assert(
    !isStrictSafeString(`
`),
  );
});

Deno.test('isSafeString', () => {
  assert(isSafeString(''));
  assert(isSafeString('-'));
  assert(isSafeString('('));
  assert(isSafeString(')'));
  assert(isSafeString('/'));
  assert(isSafeString('1 2'));
  assert(isSafeString('中'));
  assert(!isSafeString(' '));
  assert(isSafeString('123'));
  assert(isSafeString('abc'));
  assert(isSafeString('abc 123'));
  assert(isSafeString('abcZXC'));
  assert(isSafeString('abc123'));
  assert(isSafeString('abc_123'));
  assert(!isSafeString('abc!123'));
  assert(!isSafeString(';'));
  assert(!isSafeString(';abc'));
  assert(!isSafeString('abc;'));
  assert(!isSafeString('abc;123'));
  assert(!isSafeString('abc;123;'));
});
