import { httpsreq } from './httpsreq.ts';
import { assertEquals } from '@std/assert';

Deno.test('httpsreq-get', async () => {
  const res = await httpsreq('https://api.ipify.org?format=json');
  console.log(res);
  console.log(await res.text());
});

Deno.test('httpsreq-post', async () => {
  const body = 'lalala🥳';
  const url = 'https://httpbin.org/anything';
  const method = 'POST';
  const res = await httpsreq(url, {
    method,
    body,
  });
  const resJson = await res.json();
  // console.log(resJson);
  assertEquals(resJson.method, method);
  assertEquals(resJson.data, body);
  assertEquals(resJson.url, url);
});
