import { isSafeString } from './string.ts';
import { assert } from '@std/assert';

Deno.test('isSafeString', () => {
  assert(isSafeString(''));
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
