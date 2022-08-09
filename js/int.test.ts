import { assertEquals } from 'https://deno.land/std@0.151.0/testing/asserts.ts';
import { intToU8a, u8aToInt } from './int.ts';

Deno.test('u8aToInt', () => {
  assertEquals(u8aToInt(new Uint8Array([0, 0, 0, 25])), 25);
  assertEquals(u8aToInt(new Uint8Array([1, 145])), 401);
});

Deno.test('intToU8a', () => {
  assertEquals(intToU8a(25, { l: 4 }), new Uint8Array([0, 0, 0, 25]));
  assertEquals(intToU8a(401, { l: 2 }), new Uint8Array([1, 145]));
  assertEquals(intToU8a(1048576, { l: 1 }), new Uint8Array([0]));
  assertEquals(intToU8a(25, { l: 'auto' }), new Uint8Array([25]));
  assertEquals(intToU8a(401, { l: 'auto' }), new Uint8Array([1, 145]));
});
