import { fieldCalculate, fieldCalculateEval } from './calculate-field.ts';

const data = {
  a: '1',
  b: '2',
  c: '3',
};

Deno.bench('fieldCalculate-format', () => {
  fieldCalculate(data, '( a + b ) * c'.split(' ')), 9;
  fieldCalculate(data, 'c * ( a + b )'.split(' ')), 9;
  fieldCalculate(data, '( a + b ) * 5'.split(' ')), 15;
  fieldCalculate(data, '( a + b ) * 5 * ( a + c )'.split(' ')), 60;
  fieldCalculate(data, '0.1 * 0.2'.split(' ')), 0.02;
  fieldCalculate(data, '0.1 + 0.2'.split(' ')), 0.3;
  fieldCalculate(data, '10000.1 + 0.2'.split(' ')), 10000.3;
  fieldCalculate(data, '0.3 - 0.1'.split(' ')), 0.2;
  fieldCalculate(data, '0.3 / 0.1'.split(' ')), 3;
  fieldCalculate({ ...data, a: 10 }, '( a + b ) * 4'.split(' ')), 48;
});
Deno.bench('fieldCalculate-eval', () => {
  fieldCalculateEval(data, '( a + b ) * c'.split(' ')), 9;
  fieldCalculateEval(data, 'c * ( a + b )'.split(' ')), 9;
  fieldCalculateEval(data, '( a + b ) * 5'.split(' ')), 15;
  fieldCalculateEval(data, '( a + b ) * 5 * ( a + c )'.split(' ')), 60;
  fieldCalculateEval(data, '0.1 * 0.2'.split(' ')), 0.02;
  fieldCalculateEval(data, '0.1 + 0.2'.split(' ')), 0.3;
  fieldCalculateEval(data, '10000.1 + 0.2'.split(' ')), 10000.3;
  fieldCalculateEval(data, '0.3 - 0.1'.split(' ')), 0.2;
  fieldCalculateEval(data, '0.3 / 0.1'.split(' ')), 3;
  fieldCalculateEval({ ...data, a: 10 }, '( a + b ) * 4'.split(' ')), 48;
});
