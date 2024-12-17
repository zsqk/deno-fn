import { assertIsError } from '@std/assert';
import { delay } from '@std/async/delay';
// deno-lint-ignore no-unused-vars
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
  // 👇 手动查看类型符合预期
  // (name: string) => number | void
  // const nf1 = safeWarpSync((name: string) => 1, () => {});
  // (name: string) => number
  // const nf2 = safeWarpSync((name: string) => 1, () => 2);

  // 👇 预期类型错误
  // const nf3 = safeWarpSync((name: string) => Promise.resolve(1), () => 2);
  // const nf4 = safeWarpSync(async (name: string) => 1, () => 2);

  // 👇 手动查看类型符合预期
  // (name: string) => Promise<void | number>
  // const anf1 = safeWarp(async (name: string) => 1, () => {});
  // (name: string) => Promise<number>
  // const anf2 = safeWarp(async (name: string) => 1, () => 2);

  // 👇 预期类型错误
  // const anf3 = safeWarp((name: string) => 1, () => 2);
});
