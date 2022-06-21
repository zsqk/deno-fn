import { getComputeInfo } from '../mod.ts';

Deno.test('getComputeInfo', async () => {
  const res = await getComputeInfo(true);
  console.log('res', res);
});
