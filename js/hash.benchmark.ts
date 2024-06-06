import { hmac as hmacDiff } from 'hmac/mod.ts';
import { assertEquals } from '@std/assert/assert_equals';
import { encodeBase64 } from '@std/encodin2/base64';
import { hmac } from './hash.ts';

Deno.test('hmac', async () => {
  const data =
    'GET&%2F&AccessKeyId%3Dtestid%26Action%3DDescribeDedicatedHosts%26Format%3DXML%26SignatureMethod%3DHMAC-SHA1%26SignatureNonce%3D3ee8c1b8-xxxx-xxxx-xxxx-xxxxxxxxx%26SignatureVersion%3D1.0%26Timestamp%3D2016-02-23T12%253A46%253A24Z%26Version%3D2014-05-26';
  const secret = 'testsecret&';
  const sres = 'rARsF+BIg8pZ4e0ln6Z96lBMDms=';
  const times = 5000;

  // 实验组 n (正常)
  console.time('hmac-n');
  for (let i = 0; i < times; i++) {
    const res = await hmac({ hash: 'SHA-1', s: secret }, data);
    assertEquals(encodeBase64(res), sres);
  }
  console.timeEnd('hmac-n');

  // 实验组 k (优化 key)
  console.time('hmac-k');
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-1' },
    true,
    ['sign', 'verify'],
  );
  for (let i = 0; i < times; i++) {
    const res = await hmac(cryptoKey, data);
    assertEquals(encodeBase64(res), sres);
  }
  console.timeEnd('hmac-k');

  // 对照组
  console.time('diff');
  for (let i = 0; i < times; i++) {
    const res = hmacDiff('sha1', secret, data, 'utf8', 'base64');
    assertEquals(res, sres);
  }
  console.timeEnd('diff');

  // 结论, 在频次较低的使用场景下, 二者没有明显差别.
  // 在频次较高的使用场景下, 频繁生成 crypto key 可能有额外消耗, 可以优化.
});
