import { assertEquals, assertThrows } from '@std/assert';
import { yuanToRMBFen } from './amount.ts';

Deno.test('yuanToRMBFen converts yuan to fen correctly', () => {
  assertEquals(yuanToRMBFen(1), 100);
  assertEquals(yuanToRMBFen(1.23), 123);
  assertEquals(yuanToRMBFen('1.23'), 123);
  assertEquals(yuanToRMBFen('1.1'), 110); // 可能包含浮点误差
  assertThrows(() => yuanToRMBFen(NaN), Error);
});
