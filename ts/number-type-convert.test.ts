import { assert, assertThrows } from '@std/assert';
import { toInt, toPositiveInt } from './number-type-convert.ts';

Deno.test('toInt', () => {
  assert(toInt('123') === 123);
  assert(toInt('0') === 0);
  assert(toInt('-1') === -1);
  assertThrows(() => toInt('123.456'), TypeError);
  assertThrows(() => toInt('abc'), TypeError);
  assertThrows(() => toInt(undefined), TypeError);
  assertThrows(() => toInt(null), TypeError);
  assertThrows(() => toInt({}), TypeError);
});

Deno.test('toPositiveInt', () => {
  assert(toPositiveInt('123') === 123);
  assertThrows(() => toInt('123.456'), TypeError);
  assertThrows(() => toInt('abc'), TypeError);
  assertThrows(() => toPositiveInt('0'), TypeError);
  assertThrows(() => toPositiveInt('-1'), TypeError);
});
