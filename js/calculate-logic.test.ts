import { assert } from '@std/assert/assert';
import {
  logicCalculate,
  LogicOperator,
  LogicRelationship,
} from './calculate-logic.ts';

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

Deno.test('test-arrIntersect', () => {
  type Data = { skuWhiteList: string; skuBlackList: string };
  const data: Data = { skuWhiteList: '12,3,4', skuBlackList: '5,6,7' };
  // 单项相符
  assert(
    logicCalculate(data, {
      condition: 'AND',
      rules: [{
        field: 'skuWhiteList',
        operator: LogicOperator.arrIntersect,
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
        operator: LogicOperator.arrIntersect,
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
        operator: LogicOperator.arrIntersect,
        value: '1',
      }],
    }),
  );
});
