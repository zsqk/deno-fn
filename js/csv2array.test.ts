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

// https://datatracker.ietf.org/doc/html/rfc4180

Deno.test('csv2array-double-quotes-5', () => {
  const arr = csv2array(`"aaa","bbb","ccc"
zzz,yyy,xxx`);
  assertEquals(
    JSON.stringify(arr),
    JSON.stringify([['aaa', 'bbb', 'ccc'], ['zzz', 'yyy', 'xxx']]),
  );
});

Deno.test('csv2array-double-quotes-6', () => {
  const arr = csv2array(`"aaa","b
bb","ccc"
zzz,yyy,xxx`);
  assertEquals(
    JSON.stringify(arr),
    JSON.stringify([[
      'aaa',
      `b
bb`,
      'ccc',
    ], ['zzz', 'yyy', 'xxx']]),
  );
});

Deno.test('csv2array-double-quotes-7', () => {
  const arr = csv2array(`"aaa","b""bb","ccc"`);
  assertEquals(
    JSON.stringify(arr),
    JSON.stringify([[
      'aaa',
      `b"bb`,
      'ccc',
    ], ['zzz', 'yyy', 'xxx']]),
  );
});
