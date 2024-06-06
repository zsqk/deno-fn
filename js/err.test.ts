import { assertIsError } from 'https://deno.land/std@0.217.0/assert/assert_is_error.ts';
import { delay } from 'https://deno.land/std@0.217.0/async/delay.ts';
import { autoRetry, safeWarp, safeWarpSync } from './err.ts';

Deno.test('autoRetry', async () => {
  async function test(time: number) {
    await delay(time);
    if (Math.random() > 0.01) {
      throw new Error('some error');
    }
    return 1;
  }

  const fn = autoRetry(test, { retry: 5, isRetryable: () => true });

  await fn(1).catch((err) => {
    assertIsError(err, Error, 'retryed');
  });
});

Deno.test('safeWarpSync and safeWarp', () => {
  const nf1 = safeWarpSync((name: string) => 1, () => {});
  const nf2 = safeWarpSync((name: string) => 1, () => 2);
  // 👇 预期类型错误
  // const nf3 = safeWarpSync((name: string) => Promise.resolve(1), () => 2);
  // const nf4 = safeWarpSync(async (name: string) => 1, () => 2);

  const anf1 = safeWarp(async (name?: string) => 1, () => {});
  const anf2 = safeWarp(async (name: string) => 1, () => 2);
  // 👇 预期类型错误
  // const anf3 = safeWarp((name: string) => 1, () => 2);
});
