import { assertEquals } from 'https://deno.land/std@0.131.0/testing/asserts.ts';
import {
  decrypt,
  decryptBase,
  encrypt,
  encryptBase,
  genAesKey,
} from './aes.ts';

Deno.test('genIV-1', () => {
  const times = 100000;
  const l = 16;

  console.time('Math.random');
  for (let i = 0; i < times; i++) {
    new Uint8Array(l).map(() => Math.trunc(256 * Math.random()));
  }
  console.timeEnd('Math.random');

  console.time('crypto.getRandomValues');
  for (let i = 0; i < times; i++) {
    window.crypto.getRandomValues(new Uint8Array(l));
  }
  console.timeEnd('crypto.getRandomValues');
});

Deno.test('genKey-1', async () => {
  const times = 1000;
  const content = '中文';

  {
    console.time('genkey');
    for (let i = 0; i < times; i++) {
      const d1 = await encrypt(
        'aaabWe22zMdfpVVF6kFsZ9E4ODL1wjjykB5ifzjLzzz',
        content,
      );
      const d2 = await decrypt(
        'aaabWe22zMdfpVVF6kFsZ9E4ODL1wjjykB5ifzjLzzz',
        d1,
      );
      assertEquals(d2, content);
    }
    console.timeEnd('genkey');
  }

  {
    console.time('oncekey');
    const [k] = await genAesKey(
      'AES-CBC',
    );
    const iv = new Uint8Array(16).map(() => Math.trunc(256 * Math.random()));
    for (let i = 0; i < times; i++) {
      const d1 = await encryptBase(
        k,
        iv,
        content,
      );
      const d2 = await decryptBase(k, iv, d1);
      assertEquals(d2, content);
    }
    console.timeEnd('oncekey');
  }
});
