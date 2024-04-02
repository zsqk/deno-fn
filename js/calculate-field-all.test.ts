import { fieldCalculate } from './calculate-field.ts';
import { assertEquals } from 'https://deno.land/std@0.217.0/assert/assert_equals.ts';

Deno.test('testAddAndSub-true', () => {
  const data = {
    a: '100',
    a1: 1,
    b: '2',
    b1: 2,
    c: '3',
    c1: 3,
  };
  //数值之间是否有空格，有影响？

  // * 字符串*字符串
  assertEquals(fieldCalculate(data, 'a + b'.split(' ')), 102);
  // * 数字*字符串
  assertEquals(fieldCalculate(data, 'a + a1'.split(' ')), 101);
  // * 数字*数字
  assertEquals(fieldCalculate(data, 'a1 + b1'.split(' ')), 3);

  assertEquals(fieldCalculate(data, '1.5 + 2.5'.split(' ')), 4);

  assertEquals(fieldCalculate(data, '0.001 + 0.0002'.split(' ')), 0.0012);

  assertEquals(fieldCalculate(data, '1 + 0.0002'.split(' ')), 1.0002);

  // - 字符串-字符串
  assertEquals(fieldCalculate(data, 'a - b'.split(' ')), 98);
  // - 数字-字符串
  assertEquals(fieldCalculate(data, 'a - a1'.split(' ')), 99);
  // - 数字-数字
  assertEquals(fieldCalculate(data, 'a1 - b1'.split(' ')), -1);

  assertEquals(fieldCalculate(data, '1.5 - 2.5'.split(' ')), -1);

  assertEquals(fieldCalculate(data, '2 - 0.05'.split(' ')), 1.95);

  assertEquals(fieldCalculate(data, '0.003 - 0.002'.split(' ')), 0.001);
});

//存在bug，但是代码未处理
Deno.test('testMulAndDiv-true', () => {
  const data = {
    a: '100',
    a1: 1,
    b: '2',
    b1: 2,
    c: '3',
    c1: 3,
  };

  assertEquals(fieldCalculate(data, 'a * b'.split(' ')), 200);

  assertEquals(fieldCalculate(data, 'a * a1'.split(' ')), 100);

  assertEquals(fieldCalculate(data, 'a1 * b1'.split(' ')), 2);

  assertEquals(fieldCalculate(data, '1.5 * 2'.split(' ')), 3);

  assertEquals(fieldCalculate(data, '0.5 * 0.22'.split(' ')), 0.11);

  assertEquals(fieldCalculate(data, '1.2 * 0.5'.split(' ')), 0.6);

  assertEquals(fieldCalculate(data, 'a / b'.split(' ')), 50);

  assertEquals(fieldCalculate(data, 'a / a1'.split(' ')), 100);

  assertEquals(fieldCalculate(data, 'a1 / b1'.split(' ')), 1 / 2);

  assertEquals(fieldCalculate(data, 'a1 / 0'.split(' ')), Infinity);

  assertEquals(fieldCalculate(data, '3 / 0.02'.split(' ')), 150);

  assertEquals(fieldCalculate(data, '3.0 / 1.5'.split(' ')), 2);

  assertEquals(fieldCalculate(data, '0 / 1.5'.split(' ')), 0);

  assertEquals(fieldCalculate(data, '0.4 / 0.02'.split(' ')), 20);
});

//此处  assertEquals(fieldCalculate(data, '1.5 * 2'.split(' ')), 3);
Deno.test('testMulAndDiv-true-1', () => {
  const data = {
    a: '100',
    a1: 1,
    b: '2',
    b1: 2,
    c: '3',
    c1: 3,
    d: '0.5',
  };
  assertEquals(fieldCalculate(data, '1.5 * 2'.split(' ')), 3);
  assertEquals(fieldCalculate(data, 'd * 2'.split(' ')), 1);
});

Deno.test('testRemain-true', () => {
  const data = {
    a: '100',
    a1: 3,
    b: '2',
    b1: 2,
    c: '3',
    c1: 3,
  };
  // * 字符串*字符串
  assertEquals(fieldCalculate(data, 'a % b'.split(' ')), 0);
  // * 数字*字符串
  assertEquals(fieldCalculate(data, 'a % a1'.split(' ')), 1);
  // * 数字*数字
  assertEquals(fieldCalculate(data, 'a1 % b1'.split(' ')), 1);
});

// 测试括号
Deno.test('testBracket-true', () => {
  const data = {
    a: '100',
    a1: 3,
    b: '2',
    b1: 2,
    c: '3',
    c1: 3,
    d: 'asdf',
  };

  // 正确使用;
  assertEquals(fieldCalculate(data, '( a1 % b1 ) * 10'.split(' ')), 10);
  assertEquals(
    fieldCalculate(data, '( ( 2 + 3 ) + a1 % b1 ) * 10'.split(' ')),
    60,
  );
  assertEquals(
    fieldCalculate(data, '2 + ( 2 % 3 ) - 10'.split(' ')),
    -6,
  );
  assertEquals(
    fieldCalculate(data, ' 2 + 3 % 5'.split(' ')),
    5,
  );
  assertEquals(
    fieldCalculate(data, '( 2 + 3 ) * ( 5 - 2 )'.split(' ')),
    15,
  );

  assertEquals(
    fieldCalculate(data, '( ( 2 + 3 ) * 2 ) - 1'.split(' ')),
    9,
  );

  assertEquals(
    fieldCalculate(data, '10 - ( ( 5 - 2 ) * 2 )'.split(' ')),
    4,
  );
});

Deno.test('testBracket-false-1', () => {
  const data = {
    a: '100',
    a1: 3,
    b: '2',
    b1: 2,
    c: '3',
    c1: 3,
    d: 'asdf',
  };
  //只有（  (a undefined is not a number
  assertEquals(fieldCalculate(data, '( a % b'.split(' ')), 0);
});
Deno.test('testBracket-false-2', () => {
  const data = {
    a: '100',
    a1: 3,
    b: '2',
    b1: 2,
    c: '3',
    c1: 3,
    d: 'asdf',
  };
  // 只有）
  assertEquals(fieldCalculate(data, ') a % b'.split(' ')), 0);
});
Deno.test('testBracket-false-3', () => {
  const data = {
    a: '100',
    a1: 3,
    b: '2',
    b1: 2,
    c: '3',
    c1: 3,
    d: 'asdf',
  };
  //()中没有内容
  assertEquals(fieldCalculate(data, '() a % a1'.split(' ')), 1);
});

//复杂运算测试用例
Deno.test('test-complex-true', () => {
  const data = {
    a: '100',
    a1: 33,
    b: '2',
    b1: 22,
    c: '3',
    c1: 3,
    d: 'asdf',
  };
  // 正确使用
  assertEquals(fieldCalculate(data, 'a + b - c'.split(' ')), 99);
  assertEquals(fieldCalculate(data, 'a * b / 50'.split(' ')), 4);
  assertEquals(fieldCalculate(data, '( a + b ) * c / 50'.split(' ')), 306 / 50);
  assertEquals(
    fieldCalculate(data, '( a + b ) * 100 / 2 + 50'.split(' ')),
    5150,
  );
  assertEquals(
    fieldCalculate(data, '( ( a + b ) * 100 / 2 + 50 ) / 25'.split(' ')),
    206,
  );

  assertEquals(
    fieldCalculate(data, '( ( a + b ) * 100 / 2 + 50 ) - 25 * 2'.split(' ')),
    5100,
  );

  assertEquals(
    fieldCalculate(
      data,
      '( ( ( a + b ) * 100 / 2 + 50 ) - 25 * 2 ) / c'.split(' '),
    ),
    1700,
  );

  assertEquals(
    fieldCalculate(
      data,
      '( ( ( a + b ) * 100 / 2 + 50 ) - 25 * 2 ) / ( c * 5 ) % 20'.split(' '),
    ),
    0,
  );
  assertEquals(
    fieldCalculate(
      data,
      '( ( ( ( a + b ) * 100 / 2 + 50 ) - 25 * 2 ) / c ) + 0.1'.split(' '),
    ),
    1700.1,
  );

  assertEquals(
    fieldCalculate(
      data,
      ' ( a + b ) * 100 / 2 + 50  - 25 * 2 * c + 0.111111111'.split(' '),
    ),
    5000.111111111,
  );

  assertEquals(
    fieldCalculate(
      data,
      ' ( a + b ) * 100 / 2 + 50  - 25 * 2 * c + 0.111111111 - 0.11'.split(' '),
    ),
    5000.001111111,
  );
});
// 此处有错误，代码未更正
Deno.test('test-complex-true-1', () => {
  const data = {
    a: '100',
    a1: 33,
    b: '2',
    b1: 22,
    c: '3',
    c1: 3,
    d: 'asdf',
  };
  assertEquals(
    fieldCalculate(
      data,
      '( ( ( ( a + b ) * 100 / 2 + 50 ) - 25 * 2 ) / c ) * 0.1'.split(' '),
    ),
    170,
  );
});

//测试溢出
Deno.test('test-overflow', () => {
  const data = {
    a: '9999999999999999999999999999999999999999',
  };
  // 溢出问题
  assertEquals(fieldCalculate(data, 'a + 10'.split(' ')), 1e+40 + 80);
});

//测试非法字符
Deno.test('test-error', () => {
  const data = {
    a: '9999999999999999999999999999999999999999',
  };
  // 错误
  assertEquals(fieldCalculate(data, '2 + 2a'.split(' ')), 2e+40);
});

//此处连个运算符的方式，预期应提出错误，代码未修改
Deno.test('test-error', () => {
  const data = {
    a: '9999999999999999999999999999999999999999',
  };
  // 错误
  assertEquals(fieldCalculate(data, '2 + + 3'.split(' ')), 5);
});

//测试非法字符
// Deno.test('test-error', () => {
//   const data = {
//     a: '9999999999999999999999999999999999999999',
//   };
//   // 错误
//   assertEquals(fieldCalculate({}, 'a * 3'.split(' ')), 6);
// });
