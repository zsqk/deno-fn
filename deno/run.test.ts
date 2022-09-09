import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.154.0/testing/asserts.ts';

import { onlyRun, run } from './run.ts';

Deno.test('run', async () => {
  const { res } = await run('pwd');
  assert(res.length > 0);
});

Deno.test('onlyRun', async () => {
  const c = await onlyRun('pwd');
  assertEquals(c, 0);
});
