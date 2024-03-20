import { logicCalculate, LogicOperator } from './calculate-logic.ts';

const data = {
  a: '1',
  b: '2',
};

Deno.bench('test-1', () => {
  logicCalculate(data, {
    condition: 'AND',
    rules: [{ field: 'a', operator: LogicOperator.equals, value: '1' }],
  });
});
