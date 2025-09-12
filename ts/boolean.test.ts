import { assertBoolean, isBoolean } from './boolean.ts';
import { assert, assertThrows } from '@std/assert';

Deno.test('isBoolean', () => {
  // 测试有效的布尔值
  assert(isBoolean(true));
  assert(isBoolean(false));

  // 测试无效的值
  assert(!isBoolean(0));
  assert(!isBoolean(1));
  assert(!isBoolean('true'));
  assert(!isBoolean('false'));
  assert(!isBoolean(''));
  assert(!isBoolean(null));
  assert(!isBoolean(undefined));
  assert(!isBoolean([]));
  assert(!isBoolean({}));
  assert(!isBoolean('string'));
});

Deno.test('assertBoolean', () => {
  // 测试有效的布尔值
  assertBoolean(true);
  assertBoolean(false);

  // 测试无效的值
  assertThrows(
    () => assertBoolean(0),
    TypeError,
    'should be boolean but 0',
  );
  assertThrows(
    () => assertBoolean(1),
    TypeError,
    'should be boolean but 1',
  );
  assertThrows(
    () => assertBoolean('true'),
    TypeError,
    'should be boolean but "true"',
  );
  assertThrows(
    () => assertBoolean('false'),
    TypeError,
    'should be boolean but "false"',
  );
  assertThrows(
    () => assertBoolean(''),
    TypeError,
    'should be boolean but ""',
  );
  assertThrows(
    () => assertBoolean(null),
    TypeError,
    'should be boolean but null',
  );
  assertThrows(
    () => assertBoolean(undefined),
    TypeError,
    'should be boolean but undefined',
  );
  assertThrows(
    () => assertBoolean([]),
    TypeError,
    'should be boolean but []',
  );
  assertThrows(
    () => assertBoolean({}),
    TypeError,
    'should be boolean but {}',
  );
  assertThrows(
    () => assertBoolean('string'),
    TypeError,
    'should be boolean but "string"',
  );
});

Deno.test('assertBoolean with allow null', () => {
  // 测试允许 null 的情况
  assertBoolean(true, { allow: 'null' });
  assertBoolean(false, { allow: 'null' });
  assertBoolean(null, { allow: 'null' });

  // 测试不允许 undefined 的情况
  assertThrows(
    () => assertBoolean(undefined, { allow: 'null' }),
    TypeError,
    'should be boolean but undefined',
  );
  assertThrows(
    () => assertBoolean(0, { allow: 'null' }),
    TypeError,
    'should be boolean but 0',
  );
});

Deno.test('assertBoolean with allow undefined', () => {
  // 测试允许 undefined 的情况
  assertBoolean(true, { allow: 'undefined' });
  assertBoolean(false, { allow: 'undefined' });
  assertBoolean(undefined, { allow: 'undefined' });

  // 测试不允许 null 的情况
  assertThrows(
    () => assertBoolean(null, { allow: 'undefined' }),
    TypeError,
    'should be boolean but null',
  );
  assertThrows(
    () => assertBoolean(0, { allow: 'undefined' }),
    TypeError,
    'should be boolean but 0',
  );
});

Deno.test('assertBoolean with allow null-undefined', () => {
  // 测试允许 null 和 undefined 的情况
  assertBoolean(true, { allow: 'null-undefined' });
  assertBoolean(false, { allow: 'null-undefined' });
  assertBoolean(null, { allow: 'null-undefined' });
  assertBoolean(undefined, { allow: 'null-undefined' });

  // 测试不允许其他类型的情况
  assertThrows(
    () => assertBoolean(0, { allow: 'null-undefined' }),
    TypeError,
    'should be boolean but 0',
  );
  assertThrows(
    () => assertBoolean('string', { allow: 'null-undefined' }),
    TypeError,
    'should be boolean but "string"',
  );
});

Deno.test('assertBoolean with custom genErr', () => {
  // 测试自定义错误生成函数
  const customError = (v: unknown) =>
    new Error(`Custom: should be boolean but ${JSON.stringify(v)}`);

  assertBoolean(true, { genErr: customError });
  assertBoolean(false, { genErr: customError });

  assertThrows(
    () => assertBoolean(0, { genErr: customError }),
    Error,
    'Custom: should be boolean but 0',
  );

  assertThrows(
    () => assertBoolean('string', { genErr: customError }),
    Error,
    'Custom: should be boolean but "string"',
  );

  assertThrows(
    () => assertBoolean(null, { genErr: customError }),
    Error,
    'Custom: should be boolean but null',
  );
});
