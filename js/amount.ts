import { RMBFen } from '@zsqk/somefn/ts/number';

/**
 * Convert yuan to fen (minor unit)
 * (Also supports RMB, USD, EUR, GBP and other currencies that use 1 main unit = 100 minor units)
 */
export function yuanToRMBFen(v: string | number): RMBFen {
  const n = Number(v) * 100;
  if (Number.isNaN(n)) {
    throw new Error(`Not a valid number, please check the input: ${v}`);
  }
  if (!Number.isFinite(n)) {
    throw new Error(
      `Number is too large (may lose precision), max value in yuan is ${
        Math.round(Number.MAX_SAFE_INTEGER / 100)
      }, please check the input: ${v}`,
    );
  }
  if (typeof v === 'string' && (v.split('.')[1] ?? '').length > 2) {
    throw new Error(
      `Number precision is too long, please check the input: ${v}`,
    );
  }
  return Math.round(n);
}
