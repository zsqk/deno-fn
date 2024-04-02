import { assert } from 'https://deno.land/std@0.217.0/assert/assert.ts';
import { logicCalculate, LogicOperator } from './calculate-logic.ts';

const data = {
  a: 65537,
  b: 1,
  c: 'asdf',
  c1: 0,
  d: 'asdf',
  d1: '0',
  e: 0,
  f: 0,
  f1: '',
  g: '',
  g1: ' ',
  h: 100,
  h1: 'asdfqwerzxcv',
  j: 100240250, 
  j1: 'adsfqwerzxcv+*/1',
  k: 12454989, 
  k1: 'adsfqwerzxcv',
};

// and a>-1 true  a>65535 true
Deno.test('test-and-aa-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
        { field: 'a', operator: LogicOperator.greaterThan, value: 65535 },
      ],
    }),
  );
});

// and a>-1 true  a>65540 false
Deno.test('test-and-aa-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
        { field: 'a', operator: LogicOperator.greaterThan, value: 65540 },
      ],
    }),
  );
});

Deno.test('test-and-abc-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
        { field: 'b', operator: LogicOperator.equals, value: '01' },
        { field: 'c', operator: LogicOperator.notEqual, value: 'asdfg' },
      ],
    }),
  );
});

Deno.test('test-and-abc-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
        { field: 'b', operator: LogicOperator.equals, value: '00' },
        { field: 'c', operator: LogicOperator.notEqual, value: 'asdfg' },
      ],
    }),
  );
});

Deno.test('test-and-fghjk-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'f', operator: LogicOperator.greaterThanOrEqual, value: 0 },
        { field: 'g', operator: LogicOperator.lessThanOrEqual, value: '0' },
        { field: 'h1', operator: LogicOperator.startsWith, value: 'asd' },
        { field: 'j', operator: LogicOperator.endsWith, value: '250' },
        { field: 'k1', operator: LogicOperator.includes, value: 'ads' },
      ],
    }),
  );
});

Deno.test('test-and-fghjk-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'f', operator: LogicOperator.greaterThanOrEqual, value: 0 },
        { field: 'g', operator: LogicOperator.lessThanOrEqual, value: '0' },
        { field: 'h1', operator: LogicOperator.startsWith, value: 'ad' },
        { field: 'j', operator: LogicOperator.endsWith, value: '25' },
        { field: 'k1', operator: LogicOperator.includes, value: 'ads' },
      ],
    }),
  );
});

//test  or

Deno.test('test-or-a-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.lessThan, value: 66666 },
        { field: 'a', operator: LogicOperator.lessThan, value: 0 },
      ],
    }),
  );
});
Deno.test('test-or-a-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.lessThan, value: -1 },
        { field: 'a', operator: LogicOperator.lessThan, value: 65537 },
      ],
    }),
  );
});

Deno.test('test-or-a-123-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: 65537 },
        { field: 'a', operator: LogicOperator.lessThan, value: 65537 },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );
});

Deno.test('test-or-a-123-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: 65537 },
        { field: 'a', operator: LogicOperator.lessThan, value: 65537 },
        { field: 'a', operator: LogicOperator.equals, value: 65538 },
      ],
    }),
  );
});

// or a>66666 false   b<1  true
Deno.test('test-or-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: 66666 },
        { field: 'b', operator: LogicOperator.lessThan, value: 2 },
      ],
    }),
  );
});

// or a>66666 false   b<0  false
Deno.test('test-or-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: 66666 },
        { field: 'b', operator: LogicOperator.lessThan, value: 0 },
      ],
    }),
  );
});

// const data = {
//     a: 65537,
//     c: 'asdf',
//     c1: 0,
//     d: 'asdf',
//     d1: '0',
//   };
Deno.test('test-and-134-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: 0 },
        { field: 'c', operator: LogicOperator.equals, value: 'asdf' },
        { field: 'd1', operator: LogicOperator.equals, value: '0' },
      ],
    }),
  );
});
Deno.test('test-and-134-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: 0 },
        { field: 'c1', operator: LogicOperator.equals, value: 'asdf' },
        { field: 'd', operator: LogicOperator.equals, value: '0' },
      ],
    }),
  );
});
Deno.test('test-or-134-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: 666666 },
        { field: 'c', operator: LogicOperator.equals, value: 'asdf' },
        { field: 'd', operator: LogicOperator.equals, value: '0' },
      ],
    }),
  );
});
Deno.test('test-or-134-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.greaterThan, value: 666666 },
        { field: 'c1', operator: LogicOperator.equals, value: 'asdf' },
        { field: 'd', operator: LogicOperator.equals, value: '0' },
      ],
    }),
  );
});
// const data = {
//     a: 65537,
//     e: 0,
//     f: 0,
//     f1: '',
//     g: '',
//     g1: ' ',
//     h: 100,
//     h1: 'asdfqwerzxcv',
//     j: 100240251 - 1, // 先计算结果
//     j1: 'adsfqwerzxcv+*/1',
//     k: 12455054 - 65, // 先计算结果
//     k1: 'adsfqwerzxcv',
//   };

Deno.test('test-OR-1237890-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.lessThan, value: 66666 },
        { field: 'a', operator: LogicOperator.greaterThan, value: '0' },
        { field: 'e', operator: LogicOperator.equals, value: '0' },
        { field: 'h', operator: LogicOperator.endsWith, value: '100' },
        { field: 'j', operator: LogicOperator.startsWith, value: '100' },
        { field: 'k', operator: LogicOperator.includes, value: '13' },
      ],
    }),
  );
});

Deno.test('test-OR-1237890-false', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.lessThan, value: 666 },
        { field: 'a', operator: LogicOperator.greaterThan, value: '0' },
        { field: 'e', operator: LogicOperator.equals, value: '-1' },
        { field: 'h', operator: LogicOperator.endsWith, value: '10' },
        { field: 'j', operator: LogicOperator.startsWith, value: '2' },
        { field: 'k', operator: LogicOperator.includes, value: '13' },
      ],
    }),
  );
});
