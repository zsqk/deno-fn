import {
  fromUnicodeStr,
  genRandomString,
  genSafeString,
  isSafeString,
  textWithBOM,
} from './str.ts';
import {
  assert,
  assertEquals,
} from 'https://deno.land/std@0.192.0/testing/asserts.ts';

Deno.test('isSafeString', () => {
  assert(isSafeString('9'));
  assert(isSafeString('0'));
  assert(isSafeString('a'));
  assert(isSafeString('z'));
  assert(isSafeString('A'));
  assert(isSafeString('Z'));
  assert(!isSafeString('.'));
  assert(!isSafeString('a🥳'));
  assert(
    !isSafeString(`
`),
  );
});

Deno.test('genSafeString', () => {
  const len = 65536;

  console.time('genSafeString');
  genSafeString(len);
  console.timeEnd('genSafeString');

  assertEquals(genSafeString(5).length, 5);
  assertEquals(typeof genSafeString(5)[4], 'string');
  console.log('genSafeString(5)', genSafeString(5));
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
