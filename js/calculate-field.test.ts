// import { fieldCalculate2 as fieldCalculate } from './calculate-field.ts';
import { fieldCalculate } from './calculate-field.ts';
import { assertEquals } from '@std/assert/assert_equals';
import { assertThrows } from '@std/assert/assert_throws';

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

  // 浮点误差, 浮点数乘法
  assertEquals(
    fieldCalculate(data, '0.1 * 0.2'.split(' ')),
    0.02,
  );

  // 浮点误差, 浮点数加法
  assertEquals(fieldCalculate(data, '0.1 + 0.2'.split(' ')), 0.3);
  assertEquals(fieldCalculate(data, '10000.1 + 0.2'.split(' ')), 10000.3);

  // 浮点误差, 浮点数减法
  assertEquals(fieldCalculate(data, '0.3 - 0.1'.split(' ')), 0.2);

  // 浮点误差, 浮点数除法
  assertEquals(fieldCalculate(data, '0.3 / 0.1'.split(' ')), 3);

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
