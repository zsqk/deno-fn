import { assertEquals } from 'https://deno.land/std@0.131.0/testing/asserts.ts';
import { hashString } from './hash.ts';

Deno.test('hash', async () => {
  {
    const res = await hashString('SHA-256', 'zsqk');
    assertEquals(
      res,
      '3203acbd276e9b5ba6500032355e0ea336e38453999b83a6816f5fa043a11011',
    );
  }

  {
    const res = await hashString('SHA-1', 'zsqk');
    assertEquals(
      res,
      '4c4c3eadf45e524bb7243e3b4e4953361eb650a3',
    );
  }
});
