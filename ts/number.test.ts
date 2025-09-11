import { assert, assertThrows } from '@std/assert';
import {
  assertNaturalNumber,
  assertPositiveInteger,
  isNaturalNumber,
  isPositiveInteger,
} from './number.ts';

// 测试 isNaturalNumber 函数
Deno.test('isNaturalNumber', () => {
  // 应该返回 true 的情况
  assert(isNaturalNumber(0) === true);
  assert(isNaturalNumber(1) === true);
  assert(isNaturalNumber(42) === true);
  assert(isNaturalNumber(Number.MAX_SAFE_INTEGER) === true);

  // 应该返回 false 的情况
  assert(isNaturalNumber(-1) === false);
  assert(isNaturalNumber(-0.5) === false);
  assert(isNaturalNumber(0.5) === false);
  assert(isNaturalNumber(Number.MAX_SAFE_INTEGER + 1) === false);
  assert(isNaturalNumber('123') === false);
  assert(isNaturalNumber(null) === false);
  assert(isNaturalNumber(undefined) === false);
  assert(isNaturalNumber({}) === false);
  assert(isNaturalNumber([]) === false);
});

// 测试 isPositiveInteger 函数
Deno.test('isPositiveInteger', () => {
  // 应该返回 true 的情况
  assert(isPositiveInteger(1) === true);
  assert(isPositiveInteger(42) === true);
  assert(isPositiveInteger(Number.MAX_SAFE_INTEGER) === true);

  // 应该返回 false 的情况
  assert(isPositiveInteger(0) === false);
  assert(isPositiveInteger(-1) === false);
  assert(isPositiveInteger(-0.5) === false);
  assert(isPositiveInteger(0.5) === false);
  assert(isPositiveInteger(Number.MAX_SAFE_INTEGER + 1) === false);
  assert(isPositiveInteger('123') === false);
  assert(isPositiveInteger(null) === false);
  assert(isPositiveInteger(undefined) === false);
  assert(isPositiveInteger({}) === false);
  assert(isPositiveInteger([]) === false);
});

// 测试 assertNaturalNumber 默认情况
Deno.test('assertNaturalNumber - default (no allow)', () => {
  // 应该通过的情况
  let value: unknown = 0;
  assertNaturalNumber(value);
  assert(typeof value === 'number' && value === 0);

  value = 1;
  assertNaturalNumber(value);
  assert(typeof value === 'number' && value === 1);

  value = 42;
  assertNaturalNumber(value);
  assert(typeof value === 'number' && value === 42);

  // 应该抛出错误的情况
  assertThrows(() => assertNaturalNumber(-1), TypeError);
  assertThrows(() => assertNaturalNumber(0.5), TypeError);
  assertThrows(() => assertNaturalNumber('123'), TypeError);
  assertThrows(() => assertNaturalNumber(null), TypeError);
  assertThrows(() => assertNaturalNumber(undefined), TypeError);
  assertThrows(() => assertNaturalNumber({}), TypeError);
});

// 测试 assertNaturalNumber 允许 null
Deno.test('assertNaturalNumber - allow null', () => {
  // 应该通过的情况
  let value: unknown = 0;
  assertNaturalNumber(value, { allow: 'null' });
  assert(typeof value === 'number' && value === 0);

  value = null;
  assertNaturalNumber(value, { allow: 'null' });
  assert(value === null);

  // 应该抛出错误的情况
  assertThrows(() => assertNaturalNumber(-1, { allow: 'null' }), TypeError);
  assertThrows(
    () => assertNaturalNumber(undefined, { allow: 'null' }),
    TypeError,
  );
  assertThrows(() => assertNaturalNumber('123', { allow: 'null' }), TypeError);
});

// 测试 assertNaturalNumber 允许 undefined
Deno.test('assertNaturalNumber - allow undefined', () => {
  // 应该通过的情况
  let value: unknown = 0;
  assertNaturalNumber(value, { allow: 'undefined' });
  assert(typeof value === 'number' && value === 0);

  value = undefined;
  assertNaturalNumber(value, { allow: 'undefined' });
  assert(value === undefined);

  // 应该抛出错误的情况
  assertThrows(
    () => assertNaturalNumber(-1, { allow: 'undefined' }),
    TypeError,
  );
  assertThrows(
    () => assertNaturalNumber(null, { allow: 'undefined' }),
    TypeError,
  );
  assertThrows(
    () => assertNaturalNumber('123', { allow: 'undefined' }),
    TypeError,
  );
});

// 测试 assertNaturalNumber 允许 null 和 undefined
Deno.test('assertNaturalNumber - allow null and undefined', () => {
  // 应该通过的情况
  let value: unknown = 0;
  assertNaturalNumber(value, { allow: 'null-undefined' });
  assert(typeof value === 'number' && value === 0);

  value = null;
  assertNaturalNumber(value, { allow: 'null-undefined' });
  assert(value === null);

  value = undefined;
  assertNaturalNumber(value, { allow: 'null-undefined' });
  assert(value === undefined);

  // 应该抛出错误的情况
  assertThrows(
    () => assertNaturalNumber(-1, { allow: 'null-undefined' }),
    TypeError,
  );
  assertThrows(
    () => assertNaturalNumber('123', { allow: 'null-undefined' }),
    TypeError,
  );
});

// 测试 assertPositiveInteger 默认情况
Deno.test('assertPositiveInteger - default (no allow)', () => {
  // 应该通过的情况
  let value: unknown = 1;
  assertPositiveInteger(value);
  assert(typeof value === 'number' && value === 1);

  value = 42;
  assertPositiveInteger(value);
  assert(typeof value === 'number' && value === 42);

  // 应该抛出错误的情况
  assertThrows(() => assertPositiveInteger(0), TypeError);
  assertThrows(() => assertPositiveInteger(-1), TypeError);
  assertThrows(() => assertPositiveInteger(0.5), TypeError);
  assertThrows(() => assertPositiveInteger('123'), TypeError);
  assertThrows(() => assertPositiveInteger(null), TypeError);
  assertThrows(() => assertPositiveInteger(undefined), TypeError);
  assertThrows(() => assertPositiveInteger({}), TypeError);
});

// 测试 assertPositiveInteger 允许 null
Deno.test('assertPositiveInteger - allow null', () => {
  // 应该通过的情况
  let value: unknown = 1;
  assertPositiveInteger(value, { allow: 'null' });
  assert(typeof value === 'number' && value === 1);

  value = null;
  assertPositiveInteger(value, { allow: 'null' });
  assert(value === null);

  // 应该抛出错误的情况
  assertThrows(() => assertPositiveInteger(0, { allow: 'null' }), TypeError);
  assertThrows(() => assertPositiveInteger(-1, { allow: 'null' }), TypeError);
  assertThrows(
    () => assertPositiveInteger(undefined, { allow: 'null' }),
    TypeError,
  );
  assertThrows(
    () => assertPositiveInteger('123', { allow: 'null' }),
    TypeError,
  );
});

// 测试 assertPositiveInteger 允许 undefined
Deno.test('assertPositiveInteger - allow undefined', () => {
  // 应该通过的情况
  let value: unknown = 1;
  assertPositiveInteger(value, { allow: 'undefined' });
  assert(typeof value === 'number' && value === 1);

  value = undefined;
  assertPositiveInteger(value, { allow: 'undefined' });
  assert(value === undefined);

  // 应该抛出错误的情况
  assertThrows(
    () => assertPositiveInteger(0, { allow: 'undefined' }),
    TypeError,
  );
  assertThrows(
    () => assertPositiveInteger(-1, { allow: 'undefined' }),
    TypeError,
  );
  assertThrows(
    () => assertPositiveInteger(null, { allow: 'undefined' }),
    TypeError,
  );
  assertThrows(
    () => assertPositiveInteger('123', { allow: 'undefined' }),
    TypeError,
  );
});

// 测试 assertPositiveInteger 允许 null 和 undefined
Deno.test('assertPositiveInteger - allow null and undefined', () => {
  // 应该通过的情况
  let value: unknown = 1;
  assertPositiveInteger(value, { allow: 'null-undefined' });
  assert(typeof value === 'number' && value === 1);

  value = null;
  assertPositiveInteger(value, { allow: 'null-undefined' });
  assert(value === null);

  value = undefined;
  assertPositiveInteger(value, { allow: 'null-undefined' });
  assert(value === undefined);

  // 应该抛出错误的情况
  assertThrows(
    () => assertPositiveInteger(0, { allow: 'null-undefined' }),
    TypeError,
  );
  assertThrows(
    () => assertPositiveInteger(-1, { allow: 'null-undefined' }),
    TypeError,
  );
  assertThrows(
    () => assertPositiveInteger('123', { allow: 'null-undefined' }),
    TypeError,
  );
});

// 测试自定义错误生成器
Deno.test('assertNaturalNumber - custom error generator', () => {
  const customError = new Error('Custom error message');
  const genErr = () => customError;

  assertThrows(
    () => assertNaturalNumber(-1, { genErr }),
    Error,
    'Custom error message',
  );
  assertThrows(
    () => assertNaturalNumber(null, { genErr }),
    Error,
    'Custom error message',
  );
});

Deno.test('assertPositiveInteger - custom error generator', () => {
  const customError = new Error('Custom error message');
  const genErr = () => customError;

  assertThrows(
    () => assertPositiveInteger(0, { genErr }),
    Error,
    'Custom error message',
  );
  assertThrows(
    () => assertPositiveInteger(null, { genErr }),
    Error,
    'Custom error message',
  );
});

// 测试边界值
Deno.test('assertNaturalNumber - boundary values', () => {
  // 测试最大安全整数
  let value: unknown = Number.MAX_SAFE_INTEGER;
  assertNaturalNumber(value);
  assert(value === Number.MAX_SAFE_INTEGER);

  // 测试超出安全整数范围
  assertThrows(
    () => assertNaturalNumber(Number.MAX_SAFE_INTEGER + 1),
    TypeError,
  );
});

Deno.test('assertPositiveInteger - boundary values', () => {
  // 测试最大安全整数
  const value = Number.MAX_SAFE_INTEGER;
  assertPositiveInteger(value);
  assert(value === Number.MAX_SAFE_INTEGER);

  // 测试超出安全整数范围
  assertThrows(
    () => assertPositiveInteger(Number.MAX_SAFE_INTEGER + 1),
    TypeError,
  );

  // 测试 0（应该失败）
  assertThrows(() => assertPositiveInteger(0), TypeError);
});
