import {
  assertArray,
  assertNonEmptyArray,
  assertPlainObject,
  assertUnknownObject,
  isNonEmptyArray,
  isPlainObject,
  isUnknownObject,
} from './object.ts';
import { assert, assertThrows } from '@std/assert';

Deno.test('isUnknownObject', () => {
  assert(isUnknownObject({}));
  assert(isUnknownObject({ a: 1 }));
  assert(isUnknownObject({ a: 'b', c: 2 }));
  assert(!isUnknownObject(null));
  assert(!isUnknownObject(undefined));
  assert(!isUnknownObject('string'));
  assert(!isUnknownObject(123));
  assert(!isUnknownObject(true));
  assert(isUnknownObject([])); // 数组也是对象
});

Deno.test('assertUnknownObject', () => {
  assertUnknownObject({});
  assertUnknownObject({ a: 1 });

  assertThrows(
    () => assertUnknownObject(null),
    TypeError,
    'Expected an object',
  );
  assertThrows(
    () => assertUnknownObject(undefined),
    TypeError,
    'Expected an object',
  );
  assertThrows(
    () => assertUnknownObject('string'),
    TypeError,
    'Expected an object',
  );
});

Deno.test('assertArray', () => {
  assertArray([]);
  assertArray([1, 2, 3]);

  assertThrows(() => assertArray({}), TypeError, 'Expected an array');
  assertThrows(() => assertArray(null), TypeError, 'Expected an array');
  assertThrows(() => assertArray('string'), TypeError, 'Expected an array');
});

Deno.test('isNonEmptyArray', () => {
  assert(isNonEmptyArray([1, 2, 3]));
  assert(isNonEmptyArray(['a']));
  assert(!isNonEmptyArray([]));
  assert(!isNonEmptyArray({}));
  assert(!isNonEmptyArray(null));
  assert(!isNonEmptyArray('string'));
});

Deno.test('assertNonEmptyArray', () => {
  assertNonEmptyArray([1, 2, 3]);
  assertNonEmptyArray(['a']);

  assertThrows(
    () => assertNonEmptyArray([]),
    TypeError,
    'should be non-empty array but []',
  );
  assertThrows(
    () => assertNonEmptyArray({}),
    TypeError,
    'should be non-empty array but {}',
  );
  assertThrows(
    () => assertNonEmptyArray(null),
    TypeError,
    'should be non-empty array but null',
  );
});

Deno.test('assertNonEmptyArray with genErr', () => {
  // 测试自定义错误生成函数
  const customError = (v: unknown) =>
    new Error(`Custom: should be non-empty array but ${JSON.stringify(v)}`);

  assertNonEmptyArray([1, 2, 3], { genErr: customError });
  assertNonEmptyArray(['a'], { genErr: customError });

  // 测试空数组时使用自定义错误
  assertThrows(
    () => assertNonEmptyArray([], { genErr: customError }),
    Error,
    'Custom: should be non-empty array but []',
  );

  // 测试非数组时使用自定义错误
  assertThrows(
    () => assertNonEmptyArray({}, { genErr: customError }),
    Error,
    'Custom: should be non-empty array but {}',
  );

  assertThrows(
    () => assertNonEmptyArray(null, { genErr: customError }),
    Error,
    'Custom: should be non-empty array but null',
  );
});

Deno.test('isPlainObject', () => {
  assert(isPlainObject({}));
  assert(isPlainObject({ a: 1 }));
  assert(isPlainObject(Object.create(null)));
  assert(!isPlainObject([]));
  assert(!isPlainObject(new Date()));
  assert(!isPlainObject(new RegExp('test')));
  assert(!isPlainObject(function () {}));
  assert(!isPlainObject(null));
  assert(!isPlainObject(undefined));
  assert(!isPlainObject('string'));
});

Deno.test('assertPlainObject', () => {
  assertPlainObject({});
  assertPlainObject({ a: 1 });
  assertPlainObject(Object.create(null));

  assertThrows(
    () => assertPlainObject([]),
    TypeError,
    'Expected a plain object',
  );
  assertThrows(
    () => assertPlainObject(new Date()),
    TypeError,
    'Expected a plain object',
  );
  assertThrows(
    () => assertPlainObject(function () {}),
    TypeError,
    'Expected an object',
  );
  assertThrows(() => assertPlainObject(null), TypeError, 'Expected an object');
  assertThrows(
    () => assertPlainObject('string'),
    TypeError,
    'Expected an object',
  );
});
