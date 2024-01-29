import {
  assertEquals,
  assertRejects,
} from 'https://deno.land/std@0.154.0/testing/asserts.ts';

import { onlyRun, run } from './run.ts';
import { delay } from 'https://deno.land/std@0.190.0/async/delay.ts';

Deno.test('run-base', async () => {
  const { res } = await run('pwd', { cwd: '/' });
  assertEquals(res, '/\n');
});

Deno.test('run-null', async () => {
  await assertRejects(
    () => run('somenull'),
    Error,
    'command or file not found: somenull',
  );
});

Deno.test('onlyRun', async () => {
  const c = await onlyRun('pwd');
  assertEquals(c, 0);
});

Deno.test('timeout', async () => {
  await assertRejects(
    () => run('curl https://www.baidu.com', { timeout: 1 }),
    Error,
    'timeout',
  );

  await assertRejects(
    () => onlyRun('curl https://www.baidu.com', { timeout: 1 }),
    Error,
    'timeout',
  );

  await delay(3000);
});
