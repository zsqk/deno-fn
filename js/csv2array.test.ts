import { assertEquals } from 'https://deno.land/std@0.131.0/testing/asserts.ts';
import { csv2array } from './csv2array.ts';

Deno.test('csv2array', () => {
  const arr = csv2array(`a,b,c
1,2,3`);
  assertEquals(arr.length, 2);
  assertEquals(arr[0].length, 3);
  assertEquals(arr[0][0], 'a');
  assertEquals(arr[0][1], 'b');
  assertEquals(arr[1][0], '1');
});
