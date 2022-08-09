/**
 * Uint8Array to number
 * - `[ 0, 0, 0, 25 ]` => `25`
 * - `[ 1, 145 ]` => `401`
 * @param u8a 一个 Uint8Array 格式的数据.
 * @returns 一个十进制整数.
 */
export function u8aToInt(u8a: Uint8Array): number {
  let n = 0;
  for (let i = 0; i < u8a.length; i++) {
    const m = u8a.length - i - 1;
    if (m === 0) {
      n += u8a[i];
    } else {
      n += m * 256 * u8a[i];
    }
  }
  return n;
}

/**
 * int(number) to Uint8Array
 * @param int 一个十进制整数.
 * @returns 一个 Uint8Array 格式的数据.
 */
export function intToU8a(
  int: number,
  { l = 'auto' }: { l?: number | 'auto' } = {},
): Uint8Array {
  let left = int;
  if (typeof l === 'number') {
    const arr: number[] = Array(l);
    for (let i = l - 1; i > -1; i--) {
      const n = left % 256;
      arr[i] = n;
      left = Math.trunc(left / 256);
    }
    if (left > 0) {
      console.warn(`intToU8a left ${left} * 256 * ${l}`);
    }
    return new Uint8Array(arr);
  }
  const arr: number[] = [];
  do {
    const n = left % 256;
    arr.push(n);
    left = Math.trunc(left / 256);
    if (left === 0) {
      break;
    }
  } while (true);
  return new Uint8Array(arr.reverse());
}
