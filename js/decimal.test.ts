import { assertEquals } from '@std/assert';
import { toIntFromFloat } from './decimal.ts';

Deno.test('toIntFromFloat', () => {
  assertEquals(toIntFromFloat('1.23'), { int: 123, precision: 2 });
  assertEquals(toIntFromFloat('3.3333333333331235'), {
    int: 333333333333312,
    precision: 14,
  });
});
