import { assertEquals } from '@std/assert/assert_equals';
import { hashString, hmac } from './hash.ts';
import { encodeHex } from '@std/encoding/hex';

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

Deno.test('hmac', async () => {
  {
    const res = await hmac({ hash: 'SHA-256', s: 'zsqk' }, 'hi');
    assertEquals(
      encodeHex(res),
      '7de51598b2a4519966ada19d9ee34c8f5ed161649c044645689453466f733c35',
    );
  }

  {
    const res = await hmac({ hash: 'SHA-512', s: 'zsqk' }, 'hi');
    assertEquals(
      encodeHex(res),
      '55f289fd45d9a766b028e2c35fc8965b989e47965cf97b9aeec67d535d1880cea8c972e33b9e682d4efc4849c3847a7a9acab3892414c1a4c2c78abd09272569',
    );
  }
});
