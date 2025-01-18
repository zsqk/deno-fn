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

// 测试数组相交操作 - 白名单场景
// 当value中的值与目标数组有交集时返回true
Deno.test('test-arrIntersecting', () => {
  type Data = { skus: string };
  const data: Data = { skus: '12,3,4' };
  // 单项相符 - 白名单包含指定值时通过
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skus',
        operator: LogicOperator.arrIntersecting,
        value: '12',
      }],
    }),
  );

  // 多项相符 - 白名单包含多个指定值时通过
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skus',
        operator: LogicOperator.arrIntersecting,
        value: '12,3',
      }],
    }),
  );

  // 不相符 - 白名单不包含指定值时失败
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skus',
        operator: LogicOperator.arrIntersecting,
        value: '1',
      }],
    }),
  );
});

// 测试数组不相交操作 - 黑名单场景
// 当value中的值与目标数组完全没有交集时返回true
Deno.test('test-arrDisjoint', () => {
  type Data = { skus: string };
  const data: Data = { skus: '5,6,7' };

  // 单个黑名单值匹配 - 有交集应该失败
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skus',
        operator: LogicOperator.arrDisjoint,
        value: '5', // skuBlackList
      }],
    }),
  );

  // 黑名单不匹配 - 完全无交集应该通过
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skus',
        operator: LogicOperator.arrDisjoint,
        value: '100', // skuBlackList
      }],
    }),
  );

  // 部分相交场景 - 只要有一个值相交就算失败
  assert(
    !logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skus',
        operator: LogicOperator.arrDisjoint,
        value: '1,6', // skuBlackList
      }],
    }),
  );

  // 完全不相交场景 - 应该通过
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skus',
        operator: LogicOperator.arrDisjoint,
        value: '8,9', // skuBlackList
      }],
    }),
  );

  // 组合测试：要求在白名单中且不在黑名单中
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [
        {
          field: 'skus',
          operator: LogicOperator.arrIntersecting,
          value: '5', // skuWhiteList
        },
        {
          field: 'skus',
          operator: LogicOperator.arrDisjoint,
          value: '9', // skuBlackList
        },
      ],
    }),
  );
});

Deno.test('test-arrContains', () => {
  // 完全包含
  assert(logicCalculate({ skus: '1,2' }, {
    condition: 'AND',
    rules: [{
      field: 'skus',
      operator: LogicOperator.arrContains,
      value: '1,2,3',
    }],
  }));

  // 完全包含 (与字符串包含不同, 可以调换顺序)
  assert(logicCalculate({ skus: '2,1' }, {
    condition: 'AND',
    rules: [{
      field: 'skus',
      operator: LogicOperator.arrContains,
      value: '1,2,3',
    }],
  }));

  // 未完全包含
  assert(
    !logicCalculate({ skus: '2,1,4' }, {
      condition: 'AND',
      rules: [{
        field: 'skus',
        operator: LogicOperator.arrContains,
        value: '1,2,3',
      }],
    }),
  );
});
