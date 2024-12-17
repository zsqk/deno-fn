import {
  fromUnicodeStr,
  genRandomString,
  genStrictSafeString,
  isStrictSafeString,
  textWithBOM,
} from './str.ts';
import { assert, assertEquals } from '@std/assert';

Deno.test('isStrictSafeString', () => {
  assert(isStrictSafeString('9'));
  assert(isStrictSafeString('0'));
  assert(isStrictSafeString('a'));
  assert(isStrictSafeString('z'));
  assert(isStrictSafeString('A'));
  assert(isStrictSafeString('Z'));
  assert(isStrictSafeString('1234567890'));
  assert(!isStrictSafeString('Z_'));
  assert(!isStrictSafeString('_Z'));
  assert(!isStrictSafeString('.'));
  assert(!isStrictSafeString('a🥳'));
  assert(
    !isStrictSafeString(`
`),
  );
});

Deno.test('genStrictSafeString', () => {
  const len = 65536;

  console.time('genStrictSafeString');
  genStrictSafeString(len);
  console.timeEnd('genStrictSafeString');

  assertEquals(genStrictSafeString(5).length, 5);
  assertEquals(typeof genStrictSafeString(5)[4], 'string');
  console.log('genStrictSafeString(5)', genStrictSafeString(5));
});

Deno.test('genRandomString', () => {
  const len = 65536;

  console.time('genRandomString');
  genRandomString(len);
  console.timeEnd('genRandomString');

  assertEquals(genRandomString(5).length, 5);
  assertEquals(typeof genRandomString(5)[4], 'string');
  console.log('genRandomString(5)', genRandomString(5));
});

Deno.test('fromUnicodeStr', () => {
  {
    const res = fromUnicodeStr('\\u8fd9\\u662f');
    assertEquals(res, '这是');
  }

  {
    const res = fromUnicodeStr('\\u8fd9a');
    assertEquals(res, '这a');
  }

  {
    const res = fromUnicodeStr('\\u8fd9"\\u662f');
    assertEquals(res, '这"是');
  }

  {
    const res = fromUnicodeStr('\\u8fd9"\\u662f"');
    assertEquals(res, '这"是"');
  }

  {
    const res = fromUnicodeStr('a\\u8fd9"\\u662f"');
    assertEquals(res, 'a这"是"');
  }

  {
    const res = fromUnicodeStr(`\\u8fd9
\\u662f`);
    assertEquals(
      res,
      `这
是`,
    );
  }

  {
    const res = fromUnicodeStr('\\ud83c\\udf03');
    assertEquals(res, '🌃');
  }
});

Deno.test('textWithBOM', async () => {
  const otext = `col,value
123,中文`;

  const u8a = textWithBOM(otext);
  const dir = await Deno.makeTempDir();
  await Deno.writeFile(dir + '/test.csv', u8a);

  const decoder = new TextDecoder();
  const res = await Deno.readFile(dir + '/test.csv');
  const restext = decoder.decode(res);
  console.log('res', res, decoder.decode(res));

  assertEquals(restext, otext);
});
