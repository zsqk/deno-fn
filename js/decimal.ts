/**
 * 将浮点数转为整数形式 (仅支持 15 位精度)
 * @param v
 * @returns
 */
export function toIntFromFloat(v: string): {
  int: number;
  precision: number;
} {
  const subv = v.slice(0, 16);
  const i = subv.indexOf('.');
  if (i === -1 || i === 15) {
    return { int: Number(subv), precision: 0 };
  }

  const int = Number(subv.replace('.', ''));
  return { int, precision: subv.length - i - 1 };
}

/**
 * 加法 (避免浮点误差/舍入误差)
 * @param x
 * @param y
 * @returns
 */
export function addition(x: number, y: number): number {
  let maxPrecision = 0;
  if (!Number.isInteger(x)) {
    maxPrecision = toIntFromFloat(x.toString()).precision;
  }
  if (!Number.isInteger(y)) {
    const yPrecision = toIntFromFloat(x.toString()).precision;
    if (yPrecision > maxPrecision) {
      maxPrecision = yPrecision;
    }
  }
  if (maxPrecision) {
    const p = Math.pow(10, maxPrecision);
    return (x * p + y * p) / p;
  }
  return x + y;
}

/**
 * 减法 (避免浮点误差/舍入误差)
 * @param x
 * @param y
 * @returns
 */
export function subtraction(x: number, y: number): number {
  let maxPrecision = 0;
  if (!Number.isInteger(x)) {
    maxPrecision = toIntFromFloat(x.toString()).precision;
  }
  if (!Number.isInteger(y)) {
    const yPrecision = toIntFromFloat(x.toString()).precision;
    if (yPrecision > maxPrecision) {
      maxPrecision = yPrecision;
    }
  }
  if (maxPrecision) {
    const p = Math.pow(10, maxPrecision);
    return (x * p - y * p) / p;
  }
  return x - y;
}

/**
 * 乘法 (避免浮点误差/舍入误差)
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Multiplication
 * @param x
 * @param y
 * @returns
 */
export function multiplication(x: number, y: number): number {
  let power = 0;
  let res = 1;
  let isFloat = false;
  if (!Number.isInteger(x)) {
    const { int, precision } = toIntFromFloat(x.toString());
    power += precision;
    res *= int;
    isFloat = true;
  }
  if (!Number.isInteger(y)) {
    const { int, precision } = toIntFromFloat(y.toString());
    power += precision;
    res *= int;
    isFloat = true;
  }
  if (isFloat) {
    return res / Math.pow(10, power);
  }
  return x * y;
}

/**
 * 除法 (避免浮点误差/舍入误差)
 * @param x
 * @param y
 * @returns
 */
export function division(x: number, y: number): number {
  let power = 0;
  let res = x;
  let isFloat = false;
  if (!Number.isInteger(x)) {
    const { int, precision } = toIntFromFloat(x.toString());
    power += precision;
    res = int;
    isFloat = true;
  }
  if (!Number.isInteger(y)) {
    const { int, precision } = toIntFromFloat(y.toString());
    power -= precision;
    res /= int;
    isFloat = true;
  }
  if (isFloat) {
    return res / Math.pow(10, power);
  }
  return x / y;
}
