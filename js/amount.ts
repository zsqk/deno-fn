import { RMBFen } from '@zsqk/somefn/ts/number';

/**
 * Convert yuan to fen (minor unit)
 * (Also supports RMB, USD, EUR, GBP and other currencies that use 1 main unit = 100 minor units)
 */
export function yuanToRMBFen(v: string | number): RMBFen {
  if (v === '') {
    throw new Error(`Empty input is not a valid number`);
  }
  const yuan = Number(v);
  if (Number.isNaN(yuan)) {
    throw new Error(`Not a valid number, please check the input: ${v}`);
  }
  if (!Number.isFinite(yuan)) {
    throw new Error(
      `Number is not finite, please check the input: ${v}`,
    );
  }
  if ((String(v).split('.')[1] ?? '').length > 2) {
    throw new Error(
      `Number precision is too long, please check the input: ${v}`,
    );
  }

  const fen = Math.round(yuan * 100);
  if (!Number.isSafeInteger(fen)) {
    throw new Error(
      `Number is too large (may lose precision), max value in yuan is ${
        Math.round(Number.MAX_SAFE_INTEGER / 100)
      }, please check the input: ${v}`,
    );
  }
  return fen;
}
