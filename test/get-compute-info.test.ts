import { assert, assertEquals } from '@std/assert';

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
