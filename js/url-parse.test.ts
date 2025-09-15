import { assertEquals, assertThrows } from '@std/assert';
import {
  parseQueryInt,
  parseQueryNumber,
  parseQueryNumbers,
  parseQueryPositiveInt,
  parseQueryPositiveInts,
  parseQueryStringArray,
  sanitizeString,
} from './url-parse.ts';

// parseQueryString 函数不存在，已删除相关测试

Deno.test('parseQueryPositiveInt', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '1');
  url.searchParams.set('b', '2');
  url.searchParams.set('c', '');
  url.searchParams.set('d', '0');
  url.searchParams.set('e', 'null');
  url.searchParams.set('g', '-1');
  url.searchParams.set('h', '1.5');
  url.searchParams.set('i', 'abc');
  const a = url.searchParams.get('a');
  const b = url.searchParams.get('b');
  const c = url.searchParams.get('c');
  const d = url.searchParams.get('d');
  const e = url.searchParams.get('e');
  const g = url.searchParams.get('g');
  const h = url.searchParams.get('h');
  const i = url.searchParams.get('i');

  assertEquals(parseQueryPositiveInt(a), 1);
  assertEquals(parseQueryPositiveInt(b), 2);
  assertEquals(parseQueryPositiveInt(c), undefined);
  assertThrows(() => parseQueryPositiveInt(d), TypeError); // 0 不是正整数
  assertThrows(() => parseQueryPositiveInt(e), TypeError);
  assertThrows(() => parseQueryPositiveInt(g), TypeError); // 负数不是正整数
  assertThrows(() => parseQueryPositiveInt(h), TypeError); // 小数不是整数
  assertThrows(() => parseQueryPositiveInt(i), TypeError); // 非数字字符串
});

Deno.test('parseQueryStringArray #1', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', 'a,b,c');
  url.searchParams.set('b', 'x|y|z');
  url.searchParams.set('c', '');
  url.searchParams.set('d', 'a,,c');
  url.searchParams.set('e', '<script>,b,c');

  assertEquals(parseQueryStringArray(url.searchParams.get('a')), [
    'a',
    'b',
    'c',
  ]);
  assertEquals(
    parseQueryStringArray(url.searchParams.get('b'), { separator: '|' }),
    ['x', 'y', 'z'],
  );
  assertEquals(parseQueryStringArray(url.searchParams.get('c')), undefined);
  assertThrows(
    () => parseQueryStringArray(url.searchParams.get('d')),
    TypeError,
  );
  assertEquals(parseQueryStringArray(url.searchParams.get('e')), [
    '<script>',
    'b',
    'c',
  ]);
});

Deno.test('parseQueryStringArray with sanitization', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '<script>,alert(1),</script>');
  url.searchParams.set('b', 'hello!world,test@email');
  url.searchParams.set('c', '你好!世界,test#123');

  // 测试使用 sanitizeWithSeparator
  // 注意：sanitizeString 会将 <script>,alert(1),</script> 转换为 ,script,,alert,1,,,,script,
  // 分割后包含空字符串，所以会抛出错误
  assertThrows(
    () =>
      parseQueryStringArray(url.searchParams.get('a'), {
        sanitizeWithSeparator: true,
      }),
    TypeError,
  );

  assertEquals(
    parseQueryStringArray(url.searchParams.get('b'), {
      sanitizeWithSeparator: true,
    }),
    ['hello', 'world', 'test', 'email'],
  );

  assertEquals(
    parseQueryStringArray(url.searchParams.get('c'), {
      sanitizeWithSeparator: true,
    }),
    ['你好', '世界', 'test', '123'],
  );

  // 测试不使用 sanitizeWithSeparator（<script> 标签中的字符被认为是安全的）
  assertEquals(
    parseQueryStringArray(url.searchParams.get('a')),
    ['<script>', 'alert(1)', '</script>'],
  );
});

Deno.test('parseQueryNumber', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '123');
  url.searchParams.set('b', '12.34');
  url.searchParams.set('c', '');
  url.searchParams.set('d', 'abc');
  url.searchParams.set('e', 'Infinity');
  url.searchParams.set('f', 'NaN');

  assertEquals(parseQueryNumber(url.searchParams.get('a')), 123);
  assertEquals(parseQueryNumber(url.searchParams.get('b')), 12.34);
  assertEquals(parseQueryNumber(url.searchParams.get('c')), undefined);
  assertThrows(() => parseQueryNumber(url.searchParams.get('d')), TypeError);
  assertThrows(() => parseQueryNumber(url.searchParams.get('e')), TypeError);
  assertThrows(() => parseQueryNumber(url.searchParams.get('f')), TypeError);
});

Deno.test('parseQueryInt', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '123');
  url.searchParams.set('b', '12.34');
  url.searchParams.set('c', '');
  url.searchParams.set('d', 'abc');
  url.searchParams.set('e', '-123');
  url.searchParams.set('f', '0');

  assertEquals(parseQueryInt(url.searchParams.get('a')), 123);
  assertThrows(() => parseQueryInt(url.searchParams.get('b')), TypeError);
  assertEquals(parseQueryInt(url.searchParams.get('c')), undefined);
  assertThrows(() => parseQueryInt(url.searchParams.get('d')), TypeError);
  assertEquals(parseQueryInt(url.searchParams.get('e')), -123);
  assertEquals(parseQueryInt(url.searchParams.get('f')), 0);
});

Deno.test('parseQueryPositiveInts', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '1,2,3');
  url.searchParams.set('b', '');
  url.searchParams.set('c', '1,0,3');
  url.searchParams.set('d', '1,-2,3');
  url.searchParams.set('e', '1,abc,3');

  assertEquals(parseQueryPositiveInts(url.searchParams.get('a')), [1, 2, 3]);
  assertEquals(parseQueryPositiveInts(url.searchParams.get('b')), undefined);
  assertThrows(
    () => parseQueryPositiveInts(url.searchParams.get('c')),
    TypeError,
  );
  assertThrows(
    () => parseQueryPositiveInts(url.searchParams.get('d')),
    TypeError,
  );
  assertThrows(
    () => parseQueryPositiveInts(url.searchParams.get('e')),
    TypeError,
  );
});

Deno.test('parseQueryNumbers', () => {
  const url = new URL('https://example.com/path');
  url.searchParams.set('a', '1,2,3');
  url.searchParams.set('b', '-1.5,0,1.5');
  url.searchParams.set('c', '');
  url.searchParams.set('d', '1|2|3');
  url.searchParams.set('e', '1,abc,3');
  url.searchParams.set('f', '1,Infinity,3');
  url.searchParams.set('g', '1,NaN,3');

  assertEquals(parseQueryNumbers(url.searchParams.get('a')), [1, 2, 3]);
  assertEquals(parseQueryNumbers(url.searchParams.get('b')), [-1.5, 0, 1.5]);
  assertEquals(parseQueryNumbers(url.searchParams.get('c')), undefined);
  assertEquals(
    parseQueryNumbers(url.searchParams.get('d'), { separator: '|' }),
    [1, 2, 3],
  );
  assertThrows(() => parseQueryNumbers(url.searchParams.get('e')), TypeError);
  assertThrows(() => parseQueryNumbers(url.searchParams.get('f')), TypeError);
  assertThrows(() => parseQueryNumbers(url.searchParams.get('g')), TypeError);
});

Deno.test('sanitizeString', () => {
  // 测试基本功能（默认替换为空字符串）
  assertEquals(sanitizeString('hello world'), 'hello world');
  assertEquals(sanitizeString('abc123'), 'abc123');
  assertEquals(sanitizeString('user_name'), 'user_name');
  assertEquals(sanitizeString('hello!world'), 'helloworld');
  assertEquals(sanitizeString('test@email.com'), 'testemailcom');

  // 测试使用自定义替换字符
  assertEquals(
    sanitizeString('hello!world', { replaceWith: '_' }),
    'hello_world',
  );
  assertEquals(
    sanitizeString('test@email.com', { replaceWith: '.' }),
    'test.email.com',
  );
  assertEquals(
    sanitizeString('<script>alert(1)</script>', { replaceWith: '-' }),
    '-script-alert-1---script-',
  );
  assertEquals(sanitizeString('[test]', { replaceWith: '_' }), '_test_');

  // 测试非 ASCII 字符（应该保留）
  assertEquals(sanitizeString('你好世界'), '你好世界');
  assertEquals(sanitizeString('こんにちは'), 'こんにちは');
  assertEquals(sanitizeString('안녕하세요'), '안녕하세요');

  // 测试混合字符和自定义替换
  assertEquals(
    sanitizeString('hello@世界', { replaceWith: '_' }),
    'hello_世界',
  );
  assertEquals(
    sanitizeString('test!你好#world', { replaceWith: '-' }),
    'test-你好-world',
  );
  assertEquals(
    sanitizeString('안녕!@#$%^&*하세요', { replaceWith: '.' }),
    '안녕........하세요',
  );

  // 测试空字符串
  assertEquals(sanitizeString(''), '');

  // 测试只包含特殊字符的字符串
  assertEquals(sanitizeString('!@#$%^&*()'), '');
  assertEquals(
    sanitizeString('!@#$%^&*()', { replaceWith: '_' }),
    '__________',
  );

  // 测试空格相关
  assertEquals(sanitizeString('  hello  world  '), '  hello  world  ');
  assertEquals(sanitizeString('\thello\nworld\r'), '\thello\nworld\r');
});

// ========== 边界情况和异常情况测试 ==========

Deno.test('parseQueryNumber - 边界情况', () => {
  // 测试 null 和 undefined 字符串
  assertEquals(parseQueryNumber(null), undefined);
  assertEquals(parseQueryNumber('undefined'), undefined);
  assertEquals(parseQueryNumber(''), undefined);

  // 测试带空格的数字
  assertEquals(parseQueryNumber('  123  '), 123);
  assertEquals(parseQueryNumber('  12.34  '), 12.34);

  // 测试科学计数法
  assertEquals(parseQueryNumber('1e2'), 100);
  assertEquals(parseQueryNumber('1.5e-2'), 0.015);

  // 测试负数
  assertEquals(parseQueryNumber('-123'), -123);
  assertEquals(parseQueryNumber('-12.34'), -12.34);

  // 测试零
  assertEquals(parseQueryNumber('0'), 0);
  assertEquals(parseQueryNumber('0.0'), 0);

  // 测试边界值
  assertEquals(
    parseQueryNumber('1.7976931348623157e+308'),
    1.7976931348623157e+308,
  );
  assertEquals(
    parseQueryNumber('-1.7976931348623157e+308'),
    -1.7976931348623157e+308,
  );

  // 测试无效输入
  assertThrows(
    () => parseQueryNumber('abc'),
    TypeError,
    'invalid query number: abc',
  );
  assertThrows(
    () => parseQueryNumber('Infinity'),
    TypeError,
    'invalid query number: Infinity',
  );
  assertThrows(
    () => parseQueryNumber('-Infinity'),
    TypeError,
    'invalid query number: -Infinity',
  );
  assertThrows(
    () => parseQueryNumber('NaN'),
    TypeError,
    'invalid query number: NaN',
  );
  assertThrows(
    () => parseQueryNumber('1.2.3'),
    TypeError,
    'invalid query number: 1.2.3',
  );
  assertThrows(
    () => parseQueryNumber('++123'),
    TypeError,
    'invalid query number: ++123',
  );
});

Deno.test('parseQueryInt - 边界情况', () => {
  // 测试 null 和 undefined 字符串
  assertEquals(parseQueryInt(null), undefined);
  assertEquals(parseQueryInt('undefined'), undefined);
  assertEquals(parseQueryInt(''), undefined);

  // 测试带空格的整数
  assertEquals(parseQueryInt('  123  '), 123);
  assertEquals(parseQueryInt('  -123  '), -123);

  // 测试小数（应该抛出错误）
  assertThrows(() => parseQueryInt('12.34'), TypeError);
  assertEquals(parseQueryInt('12.0'), 12); // 12.0 会被转换为整数 12

  // 测试科学计数法整数
  assertEquals(parseQueryInt('1e3'), 1000);
  assertThrows(() => parseQueryInt('1e-3'), TypeError); // 1e-3 = 0.001 不是整数

  // 测试边界值
  assertEquals(parseQueryInt('9007199254740991'), 9007199254740991); // Number.MAX_SAFE_INTEGER
  assertEquals(parseQueryInt('-9007199254740991'), -9007199254740991); // Number.MIN_SAFE_INTEGER

  // 测试无效输入
  assertThrows(() => parseQueryInt('abc'), TypeError);
  assertThrows(() => parseQueryInt('Infinity'), TypeError);
  assertThrows(() => parseQueryInt('NaN'), TypeError);
});

Deno.test('parseQueryPositiveInt - 边界情况', () => {
  // 测试 null 和 undefined 字符串
  assertEquals(parseQueryPositiveInt(null), undefined);
  assertEquals(parseQueryPositiveInt('undefined'), undefined);
  assertEquals(parseQueryPositiveInt(''), undefined);

  // 测试带空格的正整数
  assertEquals(parseQueryPositiveInt('  123  '), 123);

  // 测试零和负数（应该抛出错误）
  assertThrows(() => parseQueryPositiveInt('0'), TypeError);
  assertThrows(() => parseQueryPositiveInt('-1'), TypeError);
  assertThrows(() => parseQueryPositiveInt('-123'), TypeError);

  // 测试小数（应该抛出错误）
  assertThrows(() => parseQueryPositiveInt('12.34'), TypeError);
  assertEquals(parseQueryPositiveInt('1.0'), 1); // 1.0 会被转换为整数 1

  // 测试边界值
  assertEquals(parseQueryPositiveInt('1'), 1);
  assertEquals(parseQueryPositiveInt('9007199254740991'), 9007199254740991);

  // 测试无效输入
  assertThrows(() => parseQueryPositiveInt('abc'), TypeError);
  assertThrows(() => parseQueryPositiveInt('Infinity'), TypeError);
  assertThrows(() => parseQueryPositiveInt('NaN'), TypeError);
});

Deno.test('parseQueryStringArray - 边界情况', () => {
  // 测试 null 和 undefined 字符串
  assertEquals(parseQueryStringArray(null), undefined);
  assertEquals(parseQueryStringArray('undefined'), undefined);
  assertEquals(parseQueryStringArray(''), undefined);

  // 测试只包含分隔符的字符串
  assertThrows(() => parseQueryStringArray(','), TypeError);
  assertThrows(() => parseQueryStringArray(',,,'), TypeError);
  assertThrows(() => parseQueryStringArray('|', { separator: '|' }), TypeError);

  // 测试包含空元素的数组
  assertThrows(() => parseQueryStringArray('a,,c'), TypeError);
  assertThrows(() => parseQueryStringArray(',a,b,'), TypeError);
  assertThrows(() => parseQueryStringArray('a, ,c'), TypeError);

  // 测试单个元素
  assertEquals(parseQueryStringArray('single'), ['single']);
  assertEquals(parseQueryStringArray('single', { separator: '|' }), ['single']);

  // 测试特殊分隔符
  assertEquals(parseQueryStringArray('a;b;c', { separator: ';' }), [
    'a',
    'b',
    'c',
  ]);
  assertEquals(parseQueryStringArray('a b c', { separator: ' ' }), [
    'a',
    'b',
    'c',
  ]);
  assertEquals(parseQueryStringArray('a\tb\tc', { separator: '\t' }), [
    'a',
    'b',
    'c',
  ]);

  // 测试包含不安全字符的字符串
  // 注意：<script> 标签中的 < 和 > 字符在 assertSafeString 中被认为是安全的
  // 因为它们可以用于比较操作和泛型等合法场景
  assertEquals(parseQueryStringArray('a<script>b'), ['a<script>b']);
  assertEquals(parseQueryStringArray('a,b<script>c'), ['a', 'b<script>c']);
  assertEquals(parseQueryStringArray('a,b,c<script>'), ['a', 'b', 'c<script>']);

  // 测试 sanitizeWithSeparator 功能
  assertEquals(
    parseQueryStringArray('a<script>b,c', { sanitizeWithSeparator: true }),
    ['a', 'script', 'b', 'c'],
  );
  assertEquals(
    parseQueryStringArray('a!b@c#d', {
      sanitizeWithSeparator: true,
      separator: '!',
    }),
    ['a', 'b', 'c', 'd'],
  );
});

Deno.test('parseQueryNumbers - 边界情况', () => {
  // 测试 null 和 undefined 字符串
  assertEquals(parseQueryNumbers(null), undefined);
  assertEquals(parseQueryNumbers('undefined'), undefined);
  assertEquals(parseQueryNumbers(''), undefined);

  // 测试只包含分隔符的字符串
  assertThrows(() => parseQueryNumbers(','), TypeError);
  assertThrows(() => parseQueryNumbers(',,,'), TypeError);

  // 测试包含空元素的数组
  assertThrows(() => parseQueryNumbers('1,,3'), TypeError);
  assertThrows(() => parseQueryNumbers(',1,2,'), TypeError);
  assertEquals(parseQueryNumbers('1, ,3'), [1, 0, 3]);

  // 测试单个数字
  assertEquals(parseQueryNumbers('123'), [123]);
  assertEquals(parseQueryNumbers('12.34'), [12.34]);

  // 测试特殊分隔符
  assertEquals(parseQueryNumbers('1;2;3', { separator: ';' }), [1, 2, 3]);
  assertEquals(parseQueryNumbers('1 2 3', { separator: ' ' }), [1, 2, 3]);

  // 测试科学计数法
  assertEquals(parseQueryNumbers('1e2,2e-1,3e3'), [100, 0.2, 3000]);

  // 测试负数
  assertEquals(parseQueryNumbers('-1,-2.5,3'), [-1, -2.5, 3]);

  // 测试无效输入
  assertThrows(
    () => parseQueryNumbers('1,abc,3'),
    TypeError,
    'invalid query number array: 1,abc,3',
  );
  assertThrows(
    () => parseQueryNumbers('1,Infinity,3'),
    TypeError,
    'invalid query number array: 1,Infinity,3',
  );
  assertThrows(
    () => parseQueryNumbers('1,NaN,3'),
    TypeError,
    'invalid query number array: 1,NaN,3',
  );
});

Deno.test('parseQueryPositiveInts - 边界情况', () => {
  // 测试 null 和 undefined 字符串
  assertEquals(parseQueryPositiveInts(null), undefined);
  assertEquals(parseQueryPositiveInts('undefined'), undefined);
  assertEquals(parseQueryPositiveInts(''), undefined);

  // 测试只包含分隔符的字符串
  assertThrows(() => parseQueryPositiveInts(','), TypeError);
  assertThrows(() => parseQueryPositiveInts(',,,'), TypeError);

  // 测试包含空元素的数组
  assertThrows(() => parseQueryPositiveInts('1,,3'), TypeError);
  assertThrows(() => parseQueryPositiveInts(',1,2,'), TypeError);

  // 测试单个正整数
  assertEquals(parseQueryPositiveInts('123'), [123]);

  // 测试零和负数（应该抛出错误）
  assertThrows(
    () => parseQueryPositiveInts('1,0,3'),
    TypeError,
    'invalid query positive int array: 1,0,3',
  );
  assertThrows(
    () => parseQueryPositiveInts('1,-2,3'),
    TypeError,
    'invalid query positive int array: 1,-2,3',
  );

  // 测试小数（应该抛出错误）
  assertThrows(
    () => parseQueryPositiveInts('1,2.5,3'),
    TypeError,
    'invalid query positive int array: 1,2.5,3',
  );

  // 测试无效输入
  assertThrows(
    () => parseQueryPositiveInts('1,abc,3'),
    TypeError,
    'invalid query positive int array: 1,abc,3',
  );
  assertThrows(
    () => parseQueryPositiveInts('1,Infinity,3'),
    TypeError,
    'invalid query positive int array: 1,Infinity,3',
  );
});

// ========== 复杂场景和集成测试 ==========

Deno.test('复杂场景 - URL 查询参数解析', () => {
  // 模拟真实的 URL 查询参数场景
  const url = new URL('https://example.com/api/search');
  url.searchParams.set('q', 'hello world');
  url.searchParams.set('page', '1');
  url.searchParams.set('size', '10');
  url.searchParams.set('tags', 'javascript,typescript,deno');
  url.searchParams.set('categories', '1,2,3');
  url.searchParams.set('price_range', '10.5,99.99');
  url.searchParams.set('sort', 'name,date');
  url.searchParams.set('active', 'true');
  url.searchParams.set('ids', '1,2,3,4,5');

  // 测试各种类型的参数解析
  assertEquals(parseQueryPositiveInt(url.searchParams.get('page')), 1);
  assertEquals(parseQueryPositiveInt(url.searchParams.get('size')), 10);

  assertEquals(parseQueryStringArray(url.searchParams.get('tags')), [
    'javascript',
    'typescript',
    'deno',
  ]);
  assertEquals(parseQueryStringArray(url.searchParams.get('sort')), [
    'name',
    'date',
  ]);

  assertEquals(parseQueryPositiveInts(url.searchParams.get('categories')), [
    1,
    2,
    3,
  ]);
  assertEquals(parseQueryPositiveInts(url.searchParams.get('ids')), [
    1,
    2,
    3,
    4,
    5,
  ]);

  assertEquals(parseQueryNumbers(url.searchParams.get('price_range')), [
    10.5,
    99.99,
  ]);
});

Deno.test('复杂场景 - 错误处理和恢复', () => {
  // 测试各种错误情况下的行为
  const testCases = [
    {
      input: 'invalid',
      func: () => parseQueryNumber('invalid'),
      expectedError: 'invalid query number: invalid',
    },
    {
      input: '1,invalid,3',
      func: () => parseQueryNumbers('1,invalid,3'),
      expectedError: 'invalid query number array: 1,invalid,3',
    },
    {
      input: '1,0,3',
      func: () => parseQueryPositiveInts('1,0,3'),
      expectedError: 'invalid query positive int array: 1,0,3',
    },
  ];

  for (const testCase of testCases) {
    assertThrows(testCase.func, TypeError, testCase.expectedError);
  }
});

Deno.test('复杂场景 - 特殊字符处理', () => {
  // 测试 sanitizeString 的各种特殊字符组合
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  assertEquals(sanitizeString(specialChars), '_');
  assertEquals(
    sanitizeString(specialChars, { replaceWith: '-' }),
    '-'.repeat(10) + '_' + '-'.repeat(18),
  );

  // 测试混合内容
  const mixed = 'hello!@#world$%^test';
  assertEquals(sanitizeString(mixed), 'helloworldtest');
  assertEquals(
    sanitizeString(mixed, { replaceWith: '_' }),
    'hello___world___test',
  );

  // 测试 Unicode 字符
  const unicode = '你好!@#世界$%^测试';
  assertEquals(sanitizeString(unicode), '你好世界测试');
  assertEquals(
    sanitizeString(unicode, { replaceWith: '-' }),
    '你好---世界---测试',
  );
});

Deno.test('复杂场景 - 性能和大数据量测试', () => {
  // 测试大数组解析
  const largeArray = Array.from({ length: 1000 }, (_, i) => i.toString()).join(
    ',',
  );
  const result = parseQueryNumbers(largeArray);
  assertEquals(result?.length, 1000);
  assertEquals(result?.[0], 0);
  assertEquals(result?.[999], 999);

  // 测试大字符串清理
  const largeString = 'hello!@#world$%^test'.repeat(100);
  const cleaned = sanitizeString(largeString, { replaceWith: '_' });
  assertEquals(cleaned.length, largeString.length);
  assertEquals(cleaned.includes('!'), false);
  assertEquals(cleaned.includes('@'), false);
  assertEquals(cleaned.includes('#'), false);
});
