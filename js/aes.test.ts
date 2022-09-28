import {
  decrypt,
  decryptBase,
  encrypt,
  encryptBase,
  genAesKey,
} from './aes.ts';
import { assertEquals } from 'https://deno.land/std@0.131.0/testing/asserts.ts';

Deno.test('encrypt-decrypt-1', async () => {
  const d1 = await encrypt(
    'aaabWe22zMdfpVVF6kFsZ9E4ODL1wjjykB5ifzjLzzz',
    '中文',
  );
  const d2 = await decrypt('aaabWe22zMdfpVVF6kFsZ9E4ODL1wjjykB5ifzjLzzz', d1);
  assertEquals(d2, '中文');
});

Deno.test('genAesKey', async () => {
  {
    const [_k, u] = await genAesKey(
      'AES-CBC',
    );
    assertEquals(u.length, 24);
  }

  {
    const [_k, u] = await genAesKey(
      'AES-GCM',
    );
    assertEquals(u.length, 24);
  }

  {
    const [_k, u] = await genAesKey(
      'AES-GCM',
      128,
    );
    assertEquals(u.length, 16);
  }

  {
    const [_k, u] = await genAesKey(
      'AES-CBC',
      256,
    );
    assertEquals(u.length, 32);
  }
});

Deno.test('encrypt-decrypt-cbc128', async () => {
  const [k] = await genAesKey(
    'AES-CBC',
    128,
  );
  const iv = new Uint8Array(16).map(() => Math.trunc(256 * Math.random()));
  const d1 = await encryptBase(
    k,
    iv,
    '中文',
  );
  const d2 = await decryptBase(k, iv, d1);
  assertEquals(d2, '中文');
});

Deno.test('encrypt-decrypt-cbc256', async () => {
  const [k] = await genAesKey(
    'AES-CBC',
    256,
  );
  const iv = new Uint8Array(16).map(() => Math.trunc(256 * Math.random()));
  const d1 = await encryptBase(
    k,
    iv,
    '中文',
  );
  const d2 = await decryptBase(k, iv, d1);
  assertEquals(d2, '中文');
});

Deno.test('encrypt-decrypt-gcm256', async () => {
  const [k] = await genAesKey(
    'AES-GCM',
    256,
  );
  const iv = new Uint8Array(12).map(() => Math.trunc(256 * Math.random()));
  const d1 = await encryptBase(
    k,
    iv,
    '中文',
  );
  const d2 = await decryptBase(k, iv, d1);
  assertEquals(d2, '中文');
});

Deno.test('encrypt-decrypt-gcm192', async () => {
  const [k] = await genAesKey(
    'AES-GCM',
  );
  const iv = new Uint8Array(12).map(() => Math.trunc(256 * Math.random()));
  const d1 = await encryptBase(
    k,
    iv,
    '中文',
  );

  const d2 = await decryptBase(k, iv, d1);
  assertEquals(d2, '中文');
});
