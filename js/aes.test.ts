import { decrypt, encrypt, genAesKey, genIV } from './aes.ts';
import { assertEquals } from 'https://deno.land/std@0.217.0/assert/assert_equals.ts';

Deno.test('encrypt-decrypt-1', async () => {
  const [k, u] = await genAesKey(
    'AES-CBC',
    'aaabWe22zMdfpVVF6kFsZ9E4ODL1wjjykB5ifzjLzzz',
  );
  const d1 = await encrypt(
    k,
    u.slice(16),
    '中文',
  );
  const d2 = await decrypt(k, u.slice(16), {
    encodingType: 'base64',
    data: d1,
  });
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
  const iv = genIV(16, 'Math.random');
  const d1 = await encrypt(
    k,
    iv,
    '中文',
  );
  const d2 = await decrypt(k, iv, {
    encodingType: 'base64',
    data: d1,
  });
  assertEquals(d2, '中文');
});

Deno.test('encrypt-decrypt-cbc256', async () => {
  const [k] = await genAesKey(
    'AES-CBC',
    256,
  );
  const iv = genIV(16, 'getRandomValues');
  const d1 = await encrypt(
    k,
    iv,
    '中文',
  );
  const d2 = await decrypt(k, iv, {
    encodingType: 'base64',
    data: d1,
  });
  assertEquals(d2, '中文');
});

Deno.test('encrypt-decrypt-gcm256', async () => {
  const [k] = await genAesKey(
    'AES-GCM',
    256,
  );
  const iv = genIV(12, 'getRandomValues');
  const d1 = await encrypt(
    k,
    iv,
    '中文',
  );
  const d2 = await decrypt(k, iv, {
    encodingType: 'base64',
    data: d1,
  });
  assertEquals(d2, '中文');
});

Deno.test('encrypt-decrypt-gcm192', async () => {
  const [k] = await genAesKey(
    'AES-GCM',
  );
  const iv = genIV(12, 'Math.random');
  const d1 = await encrypt(
    k,
    iv,
    '中文',
  );

  const d2 = await decrypt(k, iv, {
    encodingType: 'base64',
    data: d1,
  });
  assertEquals(d2, '中文');
});
