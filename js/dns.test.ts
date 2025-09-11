import { queryDoH } from './dns.ts';

Deno.test('test-dns', async () => {
  const result = await queryDoH('example.com');
  console.log(result);
});
