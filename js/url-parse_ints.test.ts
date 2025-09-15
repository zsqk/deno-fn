import { assertEquals, assertThrows } from '@std/assert';
import { parseQueryInts } from './url-parse.ts';

Deno.test('parseQueryInts', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '1,2,3');
  url.searchParams.set('b', '-1,0,1');
  url.searchParams.set('c', '');
  url.searchParams.set('d', '1|2|3');
  url.searchParams.set('e', '1,abc,3');
  url.searchParams.set('f', '1.5,2,3');
  url.searchParams.set('g', 'abc');
  url.searchParams.set('h', '1|2|');

  assertEquals(parseQueryInts(url.searchParams.get('a')), [1, 2, 3]);
  assertEquals(parseQueryInts(url.searchParams.get('b')), [-1, 0, 1]);
  assertEquals(parseQueryInts(url.searchParams.get('c')), undefined);
  assertEquals(
    parseQueryInts(url.searchParams.get('d'), { separator: '|' }),
    [1, 2, 3],
  );
  assertThrows(() => parseQueryInts(url.searchParams.get('e')), TypeError);
  assertThrows(() => parseQueryInts(url.searchParams.get('f')), TypeError);
  assertThrows(() => parseQueryInts(url.searchParams.get('g')), TypeError);
  assertEquals(
    parseQueryInts(url.searchParams.get('h'), { separator: '|' }),
    [1, 2],
  );
});

Deno.test('parseQueryInts - 边界情况', () => {
  // 测试 null 和 undefined 字符串
  assertEquals(parseQueryInts(null), undefined);
  assertEquals(parseQueryInts('undefined'), undefined);
  assertEquals(parseQueryInts(''), undefined);

  // 测试只包含分隔符的字符串
  assertThrows(() => parseQueryInts(','), TypeError);
  assertThrows(() => parseQueryInts(',,,'), TypeError);

  // 测试包含空元素的数组
  assertThrows(() => parseQueryInts('1,,3'), TypeError);
  assertEquals(parseQueryInts(',1,2,'), [1, 2]);
  assertThrows(() => parseQueryInts('1,,'), TypeError);
  assertEquals(parseQueryInts(',1,'), [1]);

  // 测试单个整数
  assertEquals(parseQueryInts('123'), [123]);
  assertEquals(parseQueryInts('-123'), [-123]);

  // 测试特殊分隔符
  assertEquals(parseQueryInts('1;2;3', { separator: ';' }), [1, 2, 3]);
  assertEquals(parseQueryInts('1 2 3', { separator: ' ' }), [1, 2, 3]);
  assertEquals(parseQueryInts('|1|2|', { separator: '|' }), [1, 2]);
  assertEquals(parseQueryInts('|1|2', { separator: '|' }), [1, 2]);

  // 测试小数（应该抛出错误）
  assertThrows(
    () => parseQueryInts('1,2.5,3'),
    TypeError,
    'invalid query int array: 1,2.5,3',
  );
  assertEquals(parseQueryInts('1,2.0,3'), [1, 2, 3]);

  // 测试无效输入
  assertThrows(
    () => parseQueryInts('1,abc,3'),
    TypeError,
    'invalid query int array: 1,abc,3',
  );
  assertThrows(
    () => parseQueryInts('1,Infinity,3'),
    TypeError,
    'invalid query int array: 1,Infinity,3',
  );
});

Deno.test('parseQueryInts - 复杂场景错误处理', () => {
  // 测试各种错误情况下的行为
  const testCases = [
    {
      input: '1,2.5,3',
      func: () => parseQueryInts('1,2.5,3'),
      expectedError: 'invalid query int array: 1,2.5,3',
    },
    {
      input: '1,,c',
      func: () => parseQueryInts('1,,c'),
      expectedError: 'invalid query int array: 1,,c',
    },
    {
      input: '1,,',
      func: () => parseQueryInts('1,,'),
      expectedError: 'invalid query int array: 1,,',
    },
    {
      input: ',,',
      func: () => parseQueryInts(',,'),
      expectedError: 'invalid query int array: ,,',
    },
  ];

  for (const testCase of testCases) {
    assertThrows(testCase.func, TypeError, testCase.expectedError);
  }
});
