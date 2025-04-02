import { assert } from '@std/assert';
import { encodeToGbk } from './gbk.ts';

Deno.test('encodeToGbk-gb2312', () => {
  const src = '你好';
  const gbk = encodeToGbk(src);
  assert(gbk === 'C4E3BAC3');
});

Deno.test('encodeToGbk-gbk', () => {
  const src = '喆堃';
  const gbk = encodeToGbk(src);
  assert(gbk === '86B488D2');
});
