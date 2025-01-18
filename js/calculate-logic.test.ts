import { assert } from '@std/assert/assert';
import { logicCalculate, LogicOperator } from './calculate-logic.ts';

const data = {
  a: '1',
  b: '2',
  n: 1,
};

// 测试隐性类型转换
Deno.test('test-type', () => {
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'a', operator: LogicOperator.equals, value: 1 }],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'n', operator: LogicOperator.equals, value: '1' }],
    }),
  );
});

Deno.test('test-equals-and', () => {
  assert(logicCalculate(data, {
    condition: 'AND',
    rules: [{ field: 'a', operator: LogicOperator.equals, value: '1' }],
  }));

  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{ field: 'a', operator: LogicOperator.equals, value: '2' }],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        { field: 'a', operator: LogicOperator.equals, value: '1' },
        { field: 'b', operator: LogicOperator.equals, value: '2' },
      ],
    }),
  );
});

Deno.test('test-equals-or', () => {
  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'a', operator: LogicOperator.equals, value: '2' },
        { field: 'b', operator: LogicOperator.equals, value: '2' },
      ],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'OR',
      rules: [
        { field: 'n', operator: LogicOperator.equals, value: '5' },
        { field: 'b', operator: LogicOperator.equals, value: '2' },
        { field: 'a', operator: LogicOperator.equals, value: '2' },
      ],
    }),
  );
});

Deno.test('test-arrIntersecting', () => {
  type Data = { skuWhiteList: string; skuBlackList: string };
  const data: Data = { skuWhiteList: '12,3,4', skuBlackList: '5,6,7' };
  // 单项相符
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skuWhiteList',
        operator: LogicOperator.arrIntersecting,
        value: '12',
      }],
    }),
  );

  // 多项相符
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skuWhiteList',
        operator: LogicOperator.arrIntersecting,
        value: '12,3',
      }],
    }),
  );

  // 不相符
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skuWhiteList',
        operator: LogicOperator.arrIntersecting,
        value: '1',
      }],
    }),
  );
});

Deno.test('test-arrDisjoint', () => {
  type Data = { skuWhiteList: string; skuBlackList: string };
  const data: Data = { skuWhiteList: '12,3,4', skuBlackList: '5,6,7' };

  // 单个值相交
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skuBlackList',
        operator: LogicOperator.arrDisjoint,
        value: '5',
      }],
    }),
  );

  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skuBlackList',
        operator: LogicOperator.arrDisjoint,
        value: '100',
      }],
    }),
  );

  // 部分不相交, 部分不相交. 也要算为相交失败.
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skuBlackList',
        operator: LogicOperator.arrDisjoint,
        value: '1,6',
      }],
    }),
  );

  // 完全不相交的情况
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skuBlackList',
        operator: LogicOperator.arrDisjoint,
        value: '8,9',
      }],
    }),
  );

  // 组合测试：白名单相交且黑名单不相交
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          field: 'skuWhiteList',
          operator: LogicOperator.arrIntersecting,
          value: '12',
        },
        {
          field: 'skuBlackList',
          operator: LogicOperator.arrDisjoint,
          value: '5',
        },
      ],
    }),
  );
});
