import { fieldCalculate2 as fieldCalculate } from './calculate-field.ts';
// import { fieldCalculate } from './calculate-field.ts';
import { assertEquals } from 'https://deno.land/std@0.217.0/assert/assert_equals.ts';
import { assertThrows } from 'https://deno.land/std@0.217.0/assert/assert_throws.ts';

Deno.test('test2', () => {
  const data = {
    a: '1',
    b: '2',
    c: '3',
  };

  // 括号在前面
  assertEquals(fieldCalculate(data, '( a + b ) * c'.split(' ')), 9);

  // 括号在后面
  assertEquals(fieldCalculate(data, 'c * ( a + b )'.split(' ')), 9);

  // 属性乘以数字
  assertEquals(fieldCalculate(data, '( a + b ) * 5'.split(' ')), 15);

  // 平行的两个括号
  assertEquals(
    fieldCalculate(data, '( a + b ) * 5 * ( a + c )'.split(' ')),
    60,
  );

  assertEquals(
    fieldCalculate(data, '( a + b * 3 + ( a + c ) ) * 5'.split(' ')),
    55,
  );

  // 使用其他数据
  assertEquals(
    fieldCalculate({ ...data, a: 10 }, '( a + b ) * 4'.split(' ')),
    48,
  );

  // 抛错
  assertThrows(() => {
    const calculateField = '( a + d ) * c'.split(' ');
    fieldCalculate(data, calculateField);
  }, 'd');
});
