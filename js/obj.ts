import { every } from './iterator.ts';

/**
 * 判断对象是否为空对象
 *
 * 与 `JSON.stringify(obj) === '{}'` 效果一致.
 */
export function isEmptyObj(
  obj: Record<string, unknown>,
) {
  const arr = Object.values(obj);
  return arr.every((v) => v === undefined);
}

/**
 * 是否为空
 *
 * 1. `undefined`, `{}`, `{a:undefined}`, `[]`, `[undefined]` is empty.
 * 2. `null`, `0`, `''`, `0n`, `false`, `{a:null}`, `[null]` is not empty.
 * 3. 支持 Map 和 Set.
 */
export function isEmpty(obj: unknown) {
  if (obj === undefined) {
    return true;
  }
  if (obj === null) {
    return false;
  }
  if (typeof obj === 'object') {
    if (obj instanceof Map || obj instanceof Set) {
      return obj.size === 0 ||
        every(obj.values(), obj.size, (v) => v === undefined);
    }
    return isEmptyObj(obj as Record<string, unknown>);
  }
  return false;
}
