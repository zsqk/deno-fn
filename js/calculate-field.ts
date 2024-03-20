import { addition, division, multiplication, subtraction } from './decimal.ts';

type FieldName = string;

type MathOperator = '+' | '-' | '*' | '/' | '%';
type CalculateOperator = '(' | ')' | MathOperator;
type CalculateField = (FieldName | number | CalculateOperator)[];

/**
 * 是否为数学符号
 */
function isMathOperator(v: unknown): v is MathOperator {
  if (v === '+' || v === '-' || v === '*' || v === '/' || v === '%') {
    return true;
  }
  return false;
}

/**
 * 是否为计算符号
 */
function isCalculateOperator(v: unknown): v is CalculateOperator {
  if (v === '(' || v === ')' || isMathOperator(v)) {
    return true;
  }
  return false;
}

/**
 * 是否为可用的字段 Field
 */
export function isCalculateField(cf: unknown): cf is CalculateField {
  if (!Array.isArray(cf)) {
    return false;
  }
  for (let i = 0; i < cf.length; i++) {
    const v = cf[i];
    if (typeof v !== 'number' && typeof v !== 'string') {
      return false;
    }
    if (v === '(' || isMathOperator(v)) {
      // ( 的右边必须是数值或 ( 而非符号.
      // 计算符号的右边必须是数值或 ( 而非其他符号.
      const right = cf[i + 1];
      if (typeof right !== 'number' && typeof right !== 'string') {
        return false;
      }
      if (isMathOperator(right) || right === ')') {
        return false;
      }
    }
    if (v === ')' || isMathOperator(v)) {
      // ) 的左边必须是数值或 ) 而非符号.
      // 计算符号的左边必须是数值或 ) 而非其他符号.
      const left = cf[i - 1];
      if (typeof left !== 'number' && typeof left !== 'string') {
        return false;
      }
      if (isMathOperator(left) || left === '(') {
        return false;
      }
    }
  }
  return true;
}

function remainder(x: number, y: number) {
  return x % y;
}

/**
 * 计算字段
 * @param data
 * @param calculateField
 * @param options
 * @returns
 *
 * @todo 替换 `eval` 以避免浮点误差
 */
export function fieldCalculate(
  data: Record<string, string | number>,
  calculateField: CalculateField,
  { debug }: { debug?: boolean } = {},
): number {
  const keys = Object.keys(data);

  const calculateCode = calculateField.reduce<string>((acc, v) => {
    if (
      typeof v === 'number' || !Number.isNaN(Number(v)) ||
      isCalculateOperator(v)
    ) {
      return `${acc}${v}`;
    }
    if (keys.includes(v)) {
      const num = Number(data[v]);
      if (Number.isNaN(num)) {
        throw new Error(`invalid data: ${v} ${data[v]} is not a number`);
      }
      return `${acc}${num}`;
    }
    throw new Error(`invalid data: key ${v} not found`);
  }, '');

  if (debug) {
    console.log('calculateCode', calculateCode);
  }

  return eval(calculateCode);
}

function nestCalculate(
  data: Record<string, string | number>,
  calculateField: (FieldName | number | MathOperator)[],
) {
  /**
   * +, - 这类权重 11 的运算符索引数组
   */
  const indexsFor11: number[] = [];
  /**
   * *, /, % 这类权重 12 的运算符索引数组
   */
  const indexsFor12: number[] = [];

  for (let i = 0; i < calculateField.length; i++) {
    const v = calculateField[i];
    if (v === '*' || v === '/' || v === '%') {
      indexsFor12.push(i);
    }
    if (v === '+' || v === '-') {
      indexsFor11.push(i);
    }
  }

  function getVal(v: number | string) {
    let n = typeof v === 'number' ? v : Number(v);
    if (Number.isNaN(n)) {
      n = Number(data[v]);
      if (Number.isNaN(n)) {
        throw new Error(`invalid data: ${v} ${data[v]} is not a number`);
      }
    }
    return n;
  }

  if (indexsFor11.length !== 0 && indexsFor12.length !== 0) {
    // 支持混合运算符优先级
    const newArr = [...calculateField];
    for (const i of indexsFor12) {
      const o = newArr[i];
      if (o === '*') {
        newArr[i + 1] = multiplication(
          getVal(newArr[i - 1]),
          getVal(newArr[i + 1]),
        );
      }
      if (o === '/') {
        newArr[i + 1] = division(
          getVal(newArr[i - 1]),
          getVal(newArr[i + 1]),
        );
      }
      if (o === '%') {
        newArr[i + 1] = remainder(
          getVal(newArr[i - 1]),
          getVal(newArr[i + 1]),
        );
      }
      newArr[i - 1] = '';
      newArr[i] = '';
    }
    return newArr.filter((v) => v !== '').reduce<number>((acc, v, i, arr) => {
      if (isCalculateOperator(v)) {
        return acc;
      }
      const n = getVal(v);
      if (i === 0) {
        return n;
      }
      switch (arr[i - 1]) {
        case '+':
          return addition(acc, n);
        case '-':
          return subtraction(acc, n);
        default:
          throw new Error('invalid isCalculateOperator');
      }
    }, 0);
  }

  return calculateField.reduce<number>((acc, v, i, arr) => {
    if (isCalculateOperator(v)) {
      return acc;
    }
    const n = getVal(v);
    if (i === 0) {
      return n;
    }
    switch (arr[i - 1]) {
      case '+':
        return addition(acc, n);
      case '-':
        return subtraction(acc, n);
      case '*':
        return multiplication(acc, n);
      case '/':
        return division(acc, n);
      case '%':
        return remainder(acc, n);
      default:
        throw new Error('invalid isCalculateOperator');
    }
  }, 0);
}

export function fieldCalculate2(
  data: Record<string, string | number>,
  calculateField: CalculateField,
  { debug }: { debug?: boolean } = {},
): number {
  if (debug) {
    console.log('data', data);
    console.log('calculateField', calculateField);
  }
  // console.log('data', data);
  // console.log('calculateField', calculateField);

  /**
   * 找到 calculateField 中的最后一个 `(`
   */
  const index1 = calculateField.findLastIndex((v) => {
    if (v === '(') {
      return true;
    }
    return false;
  });

  // 如果存在 `(`, 就先计算括号内的
  if (index1 !== -1) {
    /**
     * 找到 `(` 后的第一个 `)`
     */
    const relativeIndex2 = calculateField.slice(index1).findIndex((v) => {
      if (v === ')') {
        return true;
      }
      return false;
    });
    if (relativeIndex2 === -1) {
      throw new Error(`invalid calculateField index1 ${index1}`);
    }

    const index2 = relativeIndex2 + index1;

    if (debug) {
      console.log(`( 的索引为 ${index1}, ) 的索引为 ${index2}`);
      console.log(
        '本次要计算的内容为',
        calculateField.slice(index1 + 1, index2),
      );
    }

    // 逐个计算
    const nest = nestCalculate(data, calculateField.slice(index1 + 1, index2));

    if (debug) {
      console.log('计算结果', nest);
      console.log('新数组前半部分', calculateField.slice(0, index1));
      console.log('新数组后半部分', calculateField.slice(index2 + 1));
    }
    return fieldCalculate2(data, [
      ...calculateField.slice(0, index1),
      nest,
      ...calculateField.slice(index2 + 1),
    ]);
  }

  // 如果不存在 `(`, 就直接计算
  return nestCalculate(data, calculateField);
}
