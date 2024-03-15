import { fieldCalculate } from './calculate-field.ts';
import { assertEquals } from 'https://deno.land/std@0.217.0/assert/assert_equals.ts';
import { assertThrows } from 'https://deno.land/std@0.217.0/assert/assert_throws.ts';

Deno.test('test', () => {
  const data = {
    a: '1',
    b: '2',
    c: '3',
  };
  assertEquals(fieldCalculate(data, '( a + b ) * c'.split(' ')), 9);
  assertEquals(fieldCalculate(data, '( a + b ) * 5'.split(' ')), 15);
  assertEquals(
    fieldCalculate({ ...data, a: 10 }, '( a + b ) * 4'.split(' ')),
    48,
  );

  assertThrows(() => {
    const calculateField = '( a + d ) * c'.split(' ');
    fieldCalculate(data, calculateField);
  }, 'd');
});
