import { timeAnalyze, timeSummarize } from './date.ts';
import { assertEquals } from 'https://deno.land/std@0.131.0/testing/asserts.ts';

Deno.test('renderTime', () => {
  assertEquals(
    timeAnalyze({ ms: 61111 }),
    { y: 0, w: 0, d: 0, h: 0, m: 1, s: 1, ms: 111 },
  );

  const now = Date.now();
  assertEquals(
    timeSummarize(timeAnalyze({ ms: now })),
    now,
  );

  assertEquals(
    timeAnalyze({ ms: 1659147770282 }),
    { y: 52, w: 31, d: 6, h: 2, m: 22, s: 50, ms: 282 },
  );

  assertEquals(
    timeSummarize(
      timeAnalyze({ ms: now }, { leapyear: true }),
      { leapyear: true },
    ),
    now,
  );

  assertEquals(
    timeAnalyze({ ms: 1659147770282 }, { leapyear: true }),
    { y: 52, w: 30, d: 0, h: 2, m: 22, s: 50, ms: 282 },
  );
});
