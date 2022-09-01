import {
  assertIsError,
} from 'https://deno.land/std@0.153.0/testing/asserts.ts';
import { delay } from 'https://deno.land/std@0.153.0/async/delay.ts';
import { autoRetry } from './err.ts';

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
