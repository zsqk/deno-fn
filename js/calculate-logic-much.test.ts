import { assert } from '@std/assert/assert';
import { logicCalculate, LogicOperator } from './calculate-logic.ts';

const data = {
  a: 65537,
  b: 0,
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

// and a>-1 true  a<65540 true
//
Deno.test('test-and-and-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );
});

Deno.test('test-and-and-false-1', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: 65537 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65538 },
      ],
    }),
  );
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: 65537 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
      ],
    }),
  );
});

Deno.test('test-or-and-a-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 99999 },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 65537 },
      ],
    }),
  );
});

Deno.test('test-or-and-a-false-2', () => {
  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 65540 },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 66 },
      ],
    }),
  );
  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            {
              field: 'a',
              operator: LogicOperator.lessThanOrEqual,
              value: -1,
            },
            {
              field: 'a',
              operator: LogicOperator.greaterThanOrEqual,
              value: 65540,
            },
          ],
        },
        { field: 'a', operator: LogicOperator.equals, value: 66 },
      ],
    }),
  );
}),
  Deno.test('test-and-or-a-true', () => {
    assert(
      logicCalculate(data, {
        condition: 'AND',
        rules: [
          {
            condition: 'OR',
            rules: [
              {
                field: 'a',
                operator: LogicOperator.greaterThan,
                value: -1,
              },
              {
                field: 'a',
                operator: LogicOperator.lessThan,
                value: 65540,
              },
            ],
          },
          { field: 'a', operator: LogicOperator.equals, value: 65537 },
        ],
      }),
    );
    assert(
      logicCalculate(data, {
        condition: 'AND',
        rules: [
          {
            condition: 'OR',
            rules: [
              {
                field: 'a',
                operator: LogicOperator.greaterThan,
                value: -1,
              },
              {
                field: 'a',
                operator: LogicOperator.greaterThanOrEqual,
                value: 65540,
              },
            ],
          },
          { field: 'a', operator: LogicOperator.equals, value: 65537 },
        ],
      }),
    );
  });

Deno.test('test-and-or-a-false-3', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              field: 'a',
              operator: LogicOperator.lessThan,
              value: -1,
            },
            {
              field: 'a',
              operator: LogicOperator.greaterThan,
              value: 65540,
            },
          ],
        },
        { field: 'a', operator: LogicOperator.startsWith, value: 65537 },
      ],
    }),
  );
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              field: 'a',
              operator: LogicOperator.equals,
              value: -1,
            },
            {
              field: 'a',
              operator: LogicOperator.greaterThan,
              value: 65540,
            },
          ],
        },
        { field: 'a', operator: LogicOperator.includes, value: 65537 },
      ],
    }),
  );
});

Deno.test('test-or-or-a-false-4', () => {
  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              field: 'a',
              operator: LogicOperator.lessThan,
              value: -1,
            },
            {
              field: 'a',
              operator: LogicOperator.greaterThan,
              value: 65540,
            },
          ],
        },
        { field: 'a', operator: LogicOperator.startsWith, value: 6557 },
      ],
    }),
  );
});

Deno.test('test-or-or-a-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              field: 'a',
              operator: LogicOperator.equals,
              value: -1,
            },
            {
              field: 'a',
              operator: LogicOperator.greaterThan,
              value: 65540,
            },
          ],
        },
        { field: 'a', operator: LogicOperator.includes, value: 65537 },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              field: 'a',
              operator: LogicOperator.equals,
              value: -1,
            },
            {
              field: 'a',
              operator: LogicOperator.lessThanOrEqual,
              value: 65540,
            },
          ],
        },
        { field: 'a', operator: LogicOperator.includes, value: 6557 },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              field: 'a',
              operator: LogicOperator.greaterThanOrEqual,
              value: -1,
            },
            {
              field: 'a',
              operator: LogicOperator.equals,
              value: 65540,
            },
          ],
        },
        { field: 'a', operator: LogicOperator.includes, value: 6557 },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              field: 'a',
              operator: LogicOperator.greaterThanOrEqual,
              value: -1,
            },
            {
              field: 'a',
              operator: LogicOperator.lessThan,
              value: 65540,
            },
          ],
        },
        { field: 'a', operator: LogicOperator.includes, value: 6557 },
      ],
    }),
  );
});

//多条件、多条件 111
Deno.test('test-and-and-and-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
      ],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdf',
        },
      ],
    }),
  );
});

Deno.test('test-and-and-and-false-5', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: 65537 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
      ],
    }),
  );

  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdd',
        },
      ],
    }),
  );
});
// 110
Deno.test('test-and-and-or-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
      ],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdf',
        },
      ],
    }),
  );
});

Deno.test('test-and-and-or-false-6', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },
      ],
    }),
  );

  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdd',
        },
      ],
    }),
  );
});

// 101
Deno.test('test-and-or-and-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
      ],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdf',
        },
      ],
    }),
  );
});

Deno.test('test-and-or-and-false-7', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
      ],
    }),
  );

  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdd',
        },
      ],
    }),
  );
});

// 100
Deno.test('test-and-or-or-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
      ],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            {
              field: 'b',
              operator: LogicOperator.greaterThanOrEqual,
              value: 1,
            },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdf',
        },
      ],
    }),
  );
});

Deno.test('test-and-or-or-false-8', () => {
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 65537 },
          ],
        },
      ],
    }),
  );

  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: 655555 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: 1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdf',
        },
      ],
    }),
  );
});

//011
Deno.test('test-or-and-and-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
      ],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            {
              field: 'b',
              operator: LogicOperator.lessThan,
              value: 1,
            },
            {
              field: 'b',
              operator: LogicOperator.greaterThanOrEqual,
              value: 0,
            },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdd',
        },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            {
              field: 'b',
              operator: LogicOperator.lessThan,
              value: 1,
            },
            {
              field: 'b',
              operator: LogicOperator.greaterThan,
              value: 0,
            },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asd',
        },
      ],
    }),
  );
});

Deno.test('test-or-and-and-false-9', () => {
  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: 0 },
          ],
        },
      ],
    }),
  );

  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            {
              field: 'b',
              operator: LogicOperator.lessThan,
              value: -1,
            },
            {
              field: 'b',
              operator: LogicOperator.greaterThanOrEqual,
              value: 0,
            },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdd',
        },
      ],
    }),
  );
});

//010
Deno.test('test-or-and-or-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 655340 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
      ],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            {
              field: 'b',
              operator: LogicOperator.lessThan,
              value: 1,
            },
            {
              field: 'b',
              operator: LogicOperator.greaterThanOrEqual,
              value: 0,
            },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdd',
        },
      ],
    }),
  );
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.greaterThan, value: -1 },
            { field: 'a', operator: LogicOperator.lessThan, value: 6553 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            {
              field: 'b',
              operator: LogicOperator.lessThan,
              value: 1,
            },
            {
              field: 'b',
              operator: LogicOperator.greaterThan,
              value: 0,
            },
          ],
        },
        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asd',
        },
      ],
    }),
  );
});

//001
Deno.test('test-or-or-and-false-11', () => {
  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: 1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },
      ],
    }),
  );

  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: 1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },

        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdd',
        },
      ],
    }),
  );
});

//000
Deno.test('test-or-or-or-false-12', () => {
  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: 1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },
      ],
    }),
  );

  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            { field: 'b', operator: LogicOperator.greaterThan, value: 1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
        {
          condition: 'AND',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },

        {
          field: 'h1',
          operator: LogicOperator.startsWith,
          value: 'asdd',
        },
      ],
    }),
  );
});

//3层逻辑 000
Deno.test('test-or-or-or-or-false-13', () => {
  assert(
    !logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              condition: 'OR',
              rules: [{
                field: 'h1',
                operator: LogicOperator.startsWith,
                value: 'asdd',
              }],
            },
            { field: 'b', operator: LogicOperator.greaterThan, value: 1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },
      ],
    }),
  );
});

Deno.test('test-or-or-or-or-true', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        {
          condition: 'OR',
          rules: [
            {
              condition: 'OR',
              rules: [{
                field: 'h1',
                operator: LogicOperator.startsWith,
                value: 'asd',
              }],
            },
            { field: 'b', operator: LogicOperator.greaterThan, value: 1 },
            { field: 'b', operator: LogicOperator.lessThan, value: -1 },
          ],
        },
        {
          condition: 'OR',
          rules: [
            { field: 'a', operator: LogicOperator.lessThan, value: -1 },
            { field: 'a', operator: LogicOperator.greaterThan, value: 655340 },
          ],
        },
      ],
    }),
  );
});
