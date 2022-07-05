/**
 * 类似 Array.prototype.every()
 */
export function every<T>(
  it: IterableIterator<T>,
  size: number,
  fn: (v: T) => boolean,
) {
  for (let i = 0; i < size; i++) {
    if (!fn(it.next().value)) {
      return false;
    }
  }
  return true;
}

/**
 * 类似 Array.prototype.some()
 */
export function some<T>(
  it: IterableIterator<T>,
  size: number,
  fn: (v: T) => boolean,
) {
  for (let i = 0; i < size; i++) {
    if (fn(it.next().value)) {
      return true;
    }
  }
  return false;
}
