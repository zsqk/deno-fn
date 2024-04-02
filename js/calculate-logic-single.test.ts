import { assert } from 'https://deno.land/std@0.217.0/assert/assert.ts';
import { logicCalculate, LogicOperator } from './calculate-logic.ts';
import { assertThrows } from 'https://deno.land/std@0.217.0/assert/assert_throws.ts';

const data: Record<string, string | number> = {
  a: 65537,
  a1: 'asdf',
  a2: 1.0000000000000001,
  a3: 'asdfqwerasdfqwerasdfqwerasdfqwer',
  b: 0,
  b1: 'asdfqwer',
  b2: 0.99999999999999998,
  c: 'asdf',
  c1: 0,
  c2: '0',
  e: 0,
  e1: '123',
  e2: 'asdqwe',
  f: 0,
  f1: '',
  g: 'undefined',
  g1: ' ',
  h: 100,
  h1: 'asdfqwerzxcv',
  j: 100240250,
  j1: 'adsfqwerzxcv+*/1',
  k: 12454989,
  k1: 'adsfqwerzxcv',
  k2: 'sdfasdf021.',
  m: '12',
  m1: 12,
  m2: '22',
  m3: '1',
  m4: '3',
};

// greaterThan 大于
Deno.test('test-greaterThan-notExist-false-0', () => {
  assertThrows(() =>
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'n', operator: LogicOperator.greaterThan, value: -1 }],
    }), 'not found');
});

Deno.test('test-greaterThan-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'm',
        operator: LogicOperator.greaterThan,
        value: ' 011',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'a', operator: LogicOperator.greaterThan, value: -1 }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'a',
        operator: LogicOperator.greaterThan,
        value: 0,
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'a3',
        operator: LogicOperator.greaterThan,
        value: 'asdf',
      }],
    }),
  );
});

Deno.test('test-greaterThan-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'a',
        operator: LogicOperator.greaterThan,
        value: '66666',
      }],
    }),
  );
});
Deno.test('test-greaterThan-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'a',
        operator: LogicOperator.greaterThan,
        value: 'asdfq',
      }],
    }),
  );
});

// 超过14位，精度不正确
Deno.test('test-greaterThan-false-3', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'a2',
        operator: LogicOperator.greaterThan,
        value: 1,
      }],
    }),
  );
});

Deno.test('test-greaterThan-false-4', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'a3',
        operator: LogicOperator.greaterThan,
        value: 'asdfqwerasdfqwerasdfqwerasdfqwerqwe',
      }],
    }),
  );
});
Deno.test('test-greaterThan-false-5', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'a3',
        operator: LogicOperator.greaterThan,
        value: 'asdfqwerasdfqwerasdfqwerasdfqwer',
      }],
    }),
  );
});

// lessThan 小于
// const data = {
// b: 0,
// b1: 'asdfqwer',
// b2: 0.999999999999998,
// };
Deno.test('test-lessThan-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'b', operator: LogicOperator.lessThan, value: 65540 }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'b', operator: LogicOperator.lessThan, value: '65537' }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'b1',
        operator: LogicOperator.lessThan,
        value: `asdfqwerq`,
      }],
    }),
  );
});

Deno.test('test-lessThan-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'b', operator: LogicOperator.lessThan, value: -1 }],
    }),
  );
});

Deno.test('test-lessThan-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'b2', operator: LogicOperator.lessThan, value: 1 }],
    }),
  );
});

Deno.test('test-lessThan-false-3', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'b', operator: LogicOperator.lessThan, value: `-2` }],
    }),
  );
});
Deno.test('test-lessThan-false-4', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'b1',
        operator: LogicOperator.lessThan,
        value: `asdfqwer`,
      }],
    }),
  );
});

Deno.test('test-lessThan-false-5', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'b1',
        operator: LogicOperator.lessThan,
        value: 99999999999999999999999,
      }],
    }),
  );
});

// equals 等于 字符串
// c: 'asdf',
// c1: 0,
// c2: '0',
Deno.test('test-equals-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c', operator: LogicOperator.equals, value: 'asdf' }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c1', operator: LogicOperator.equals, value: 0 }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c1', operator: LogicOperator.equals, value: '0' }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c2', operator: LogicOperator.equals, value: 0 }],
    }),
  );
});
Deno.test('test-equals-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'c',
        operator: LogicOperator.equals,
        value: 'asdfqwer',
      }],
    }),
  );
});
Deno.test('test-equals-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c1', operator: LogicOperator.equals, value: 6 }],
    }),
  );
});

Deno.test('test-equals-false-3', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c1', operator: LogicOperator.equals, value: '6' }],
    }),
  );
});

Deno.test('test-equals-false-4', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c2', operator: LogicOperator.equals, value: 6 }],
    }),
  );
});

//------------------------------------
//对于字符串首尾的空格是否去除？回车符号是否去除？

// notEqual 不等于
// const data = {
// c: 'asdf',
// c1: 0,
// c2: '0',
// };

Deno.test('test-notEqual-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'c',
        operator: LogicOperator.notEqual,
        value: 'asdfqwer',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c2', operator: LogicOperator.notEqual, value: 100 }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c1', operator: LogicOperator.notEqual, value: 100 }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c1', operator: LogicOperator.notEqual, value: '100' }],
    }),
  );
});
Deno.test('test-notEqual-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c', operator: LogicOperator.notEqual, value: 'asdf' }],
    }),
  );
});

Deno.test('test-notEqual-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c1', operator: LogicOperator.notEqual, value: 0 }],
    }),
  );
});
Deno.test('test-notEqual-false-3', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'c1',
        operator: LogicOperator.notEqual,
        value: '  0',
      }],
    }),
  );
});
Deno.test('test-notEqual-false-4', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'c2', operator: LogicOperator.notEqual, value: 0 }],
    }),
  );
});

// e:0 greaterThanOrEqual 大于等于 (类似语法糖)
// const data = {
// e: 0,
// e1: '123',
// e2: 'asdqwe',
// };
Deno.test('test-greaterThanOrEqual-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'e1',
        operator: LogicOperator.greaterThanOrEqual,
        value: 123,
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'e',
        operator: LogicOperator.greaterThanOrEqual,
        value: '0',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'e',
        operator: LogicOperator.greaterThanOrEqual,
        value: -14,
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'e',
        operator: LogicOperator.greaterThanOrEqual,
        value: 0,
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'e1',
        operator: LogicOperator.greaterThanOrEqual,
        value: -14,
      }],
    }),
  );
});
Deno.test('test-greaterThanOrEqual-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'e',
        operator: LogicOperator.greaterThanOrEqual,
        value: '999999',
      }],
    }),
  );
});

Deno.test('test-greaterThanOrEqual-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'e',
        operator: LogicOperator.greaterThanOrEqual,
        value: 1,
      }],
    }),
  );
});

Deno.test('test-greaterThanOrEqual-false-3', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'e1',
        operator: LogicOperator.greaterThanOrEqual,
        value: 1230,
      }],
    }),
  );
});

// lessThanOrEqual 小于等于 (类似语法糖)
Deno.test('test-lessThanOrEqual-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'f',
        operator: LogicOperator.lessThanOrEqual,
        value: 0,
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'f',
        operator: LogicOperator.lessThanOrEqual,
        value: 65536,
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'f1',
        operator: LogicOperator.lessThanOrEqual,
        value: ' 11',
      }],
    }),
  );
});
Deno.test('test-lessThanOrEqual-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'f',
        operator: LogicOperator.lessThanOrEqual,
        value: -14,
      }],
    }),
  );
});

// isValid 不等于 null, 不等于 undefined 并且不等于空字符串 (没有 value, 或特定 value)

Deno.test('test-isValid-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'g1', operator: LogicOperator.isValid, value: ' ' }],
    }),
  );
});

//  (如果为数字则转为字符串)startsWith 以什么开头
// const data = {
//   h: 100,
//   h1: 'asdfqwerzxcv',
// };

Deno.test('test-startsWith-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'h', operator: LogicOperator.startsWith, value: 100 }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'h', operator: LogicOperator.startsWith, value: 1 }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'h1',
        operator: LogicOperator.startsWith,
        value: 'asdf',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'h1',
        operator: LogicOperator.startsWith,
        value: 'asdfqwerzxcv',
      }],
    }),
  );
});

Deno.test('test-startsWith-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'h', operator: LogicOperator.startsWith, value: 0 }],
    }),
  );
});

Deno.test('test-startsWith-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'h1',
        operator: LogicOperator.startsWith,
        value: 'q',
      }],
    }),
  );
});
// (如果为数字则转为字符串) endsWith 以什么结尾
// const data = {
// j: 100240251 - 1,
// j1: 'adsfqwerzxcv+*/1',
// };
Deno.test('test-endsWith-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'j1',
        operator: LogicOperator.endsWith,
        value: 'adsfqwerzxcv+*/1',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'j',
        operator: LogicOperator.endsWith,
        value: '0',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'j',
        operator: LogicOperator.endsWith,
        value: '100240250',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'j',
        operator: LogicOperator.endsWith,
        value: '0',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'j1',
        operator: LogicOperator.endsWith,
        value: '1',
      }],
    }),
  );
});

Deno.test('test-endsWith-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'j',
        operator: LogicOperator.endsWith,
        value: '251',
      }],
    }),
  );
});

Deno.test('test-endsWith-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'j1',
        operator: LogicOperator.endsWith,
        value: 'fqwe+*/1',
      }],
    }),
  );
});
// (如果为数字则转为字符串) includes 包含
// k: 12455054 - 65, 12454989
// k1: 'adsfqwerzxcv',
// k2: 'sdfasdf021.',
// m: 12,

Deno.test('test-includes-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'k2',
        operator: LogicOperator.includes,
        value: '021.',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'k',
        operator: LogicOperator.includes,
        value: '89',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'k',
        operator: LogicOperator.includes,
        value: '12454989',
      }],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'k2',
        operator: LogicOperator.includes,
        value: 21,
      }],
    }),
  );
});

Deno.test('test-includes-num-num-is', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'k',
        operator: LogicOperator.includes,
        value: 12,
      }],
    }),
  );
});

Deno.test('test-includes-num-num-not', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'k',
        operator: LogicOperator.includes,
        value: 123,
      }],
    }),
  );
});

Deno.test('test-includes-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'k',
        operator: LogicOperator.includes,
        value: '12459',
      }],
    }),
  );
});

Deno.test('test-includes-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'k1',
        operator: LogicOperator.includes,
        value: 22,
      }],
    }),
  );
});

//此处有错误 ，当m1为数字12时，结果错误
// beinclude
Deno.test('test-beIncludes-true-1', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'm',
        operator: LogicOperator.beIncludes,
        value: '22,12,32',
      }],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'm2',
        operator: LogicOperator.beIncludes,
        value: '32,22',
      }],
    }),
  );
});
Deno.test('test-beIncludes-true-2', () => {
  //m1 为数字 12
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'm1',
        operator: LogicOperator.beIncludes,
        value: '22,12,32',
      }],
    }),
  );
  //m1 为数字 12 value中包含"1 2"
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'm1',
        operator: LogicOperator.beIncludes,
        value: '22,1 2,32',
      }],
    }),
  );
});

//此处有错误，m为'12'，未被value包含，预期结果应为false
Deno.test('test-beIncludes-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'm',
        operator: LogicOperator.beIncludes,
        value: '22,122,32',
      }],
    }),
  );
});

//此处有错误，m3为'1'，未被value包含，预期结果应为false
Deno.test('test-beIncludes-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'm3',
        operator: LogicOperator.beIncludes,
        value: '122,122,32',
      }],
    }),
  );
});

//此处有错误，m4为'3'，未被value包含，预期结果应为false
Deno.test('test-beIncludes-false-3', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'm4',
        operator: LogicOperator.beIncludes,
        value: '122,122,32',
      }],
    }),
  );
});
