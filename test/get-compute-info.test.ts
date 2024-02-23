import { assert } from 'https://deno.land/std@0.217.0/assert/assert.ts';
import { assertEquals } from 'https://deno.land/std@0.217.0/assert/assert_equals.ts';

import { getComputeInfo, getComputeKey } from '../mod.ts';

Deno.test('getComputeInfo', async () => {
  const res = await getComputeInfo();
  console.log('res', res);
  assert(res.hostname);
  assert(res.os);
  assert(res.version);
});

Deno.test('getComputeKey', async () => {
  const res = await getComputeKey();
  console.log('res', res);
  assert(res);
  assertEquals(typeof res, 'string');
});
