import { compress, decompress, genKeyStr } from './lz-string.ts';
import { assertEquals, assertNotEquals } from '@std/assert';

Deno.test('lz-string-d', () => {
  const d1 = compress('中文');
  const d2 = decompress(d1);
  assertEquals(d2, '中文');
});

Deno.test('genKeyStr', () => {
  assertNotEquals(genKeyStr().slice(0, 3), 'ABC');
});

Deno.test('lz-string-c', () => {
  const dict = genKeyStr();
  const d1 = compress('中文', dict);
  const d2 = decompress(d1, dict);
  assertEquals(d2, '中文');
});

Deno.test('lz-string-decompress-error', () => {
  const d2 = decompress('test');
  assertEquals(d2, null);

  {
    const d1 = compress('中文', genKeyStr());
    const d2 = decompress(d1);
    assertNotEquals(d2, '中文');
  }
});
