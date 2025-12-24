import { assertEquals, assertThrows } from '@std/assert';
import { yuanToRMBFen } from './amount.ts';

Deno.test('yuanToRMBFen converts yuan to fen correctly', () => {
  assertEquals(yuanToRMBFen(1), 100);
  assertEquals(yuanToRMBFen(1.23), 123);
  assertEquals(yuanToRMBFen('1.23'), 123);
  assertEquals(yuanToRMBFen('1.1'), 110); // 可能包含浮点误差
  assertEquals(yuanToRMBFen('01.12'), 112);
  assertEquals(yuanToRMBFen('0'), 0);
  assertEquals(yuanToRMBFen('0.00'), 0);
  assertEquals(yuanToRMBFen('-10.00'), -1000);
  assertThrows(() => yuanToRMBFen(NaN), Error, 'valid number');
  assertThrows(() => yuanToRMBFen(Infinity), Error, 'not finite');
  assertThrows(() => yuanToRMBFen(1.123), Error, 'precision is too long');
  assertThrows(() => yuanToRMBFen(''), Error, 'valid number');
  assertThrows(() => yuanToRMBFen('a1'), Error, 'valid number');
  assertThrows(
    () => yuanToRMBFen(Number.MAX_SAFE_INTEGER),
    Error,
    'too large',
  );
});
