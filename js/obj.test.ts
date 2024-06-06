import { assertEquals } from '@std/assert/assert_equals';

import { isEmpty, isEmptyObj } from './obj.ts';

Deno.test('isEmptyObj-fn', () => {
  const obj = {};
  const obj1 = { a: undefined };
  const obj2 = { a: undefined, b: 12345 };

  const MAX = 1000000;

  const isEmpty1 = (obj: object) => {
    return JSON.stringify(obj) === '{}';
  };

  assertEquals(isEmptyObj(obj), isEmpty1(obj));
  assertEquals(isEmptyObj(obj1), isEmpty1(obj1));
  assertEquals(isEmptyObj(obj2), isEmpty1(obj2));

  // 经测试, `JSON.stringify(obj) === '{}'` 会更慢, 所以不采用.

  console.time('isEmpty1');
  for (let i = 1; i < MAX; i++) {
    isEmpty1(obj);
    isEmpty1(obj1);
    isEmpty1(obj2);
  }
  console.timeEnd('isEmpty1');

  console.time('isEmptyObj');
  for (let i = 1; i < MAX; i++) {
    isEmptyObj(obj);
    isEmptyObj(obj1);
    isEmptyObj(obj2);
  }
  console.timeEnd('isEmptyObj');
});

Deno.test('isEmpty-fn', () => {
  const d1 = '';
  const d2 = 0;
  const d3 = false;
  const d4 = 0n;
  const d5 = { a: null };
  const d6 = [null];
  const d7 = null;
  const d8 = new Map();
  d8.set('a', 1);
  const d9 = new Set([1]);
  const d10 = new Set([undefined, 1]);

  assertEquals(isEmpty(d1), false);
  assertEquals(isEmpty(d2), false);
  assertEquals(isEmpty(d3), false);
  assertEquals(isEmpty(d4), false);
  assertEquals(isEmpty(d5), false);
  assertEquals(isEmpty(d6), false);
  assertEquals(isEmpty(d7), false);
  assertEquals(isEmpty(d8), false);
  assertEquals(isEmpty(d9), false);
  assertEquals(isEmpty(d10), false);

  const e1 = undefined;
  const e2 = {};
  const e3 = { a: undefined };
  const e4: unknown[] = [];
  const e5 = [undefined];
  const e6 = new Map();
  const e7 = new Set();
  const e8 = new Set([undefined]);

  assertEquals(isEmpty(e1), true);
  assertEquals(isEmpty(e2), true);
  assertEquals(isEmpty(e3), true);
  assertEquals(isEmpty(e4), true);
  assertEquals(isEmpty(e5), true);
  assertEquals(isEmpty(e6), true);
  assertEquals(isEmpty(e7), true);
  assertEquals(isEmpty(e8), true);
});
