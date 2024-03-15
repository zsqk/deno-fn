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

export function fieldCalculate(
  data: Record<string, string | number>,
  calculateField: CalculateField,
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
        throw new Error(`invalid data: ${v} is not a number`);
      }
      return `${acc}${num}`;
    }
    throw new Error(`invalid data: key ${v} not found`);
  }, '');

  return eval(calculateCode);
}
