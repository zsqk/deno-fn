/** 字符串对象 */
export type StringObject = { [key: string]: string };

/** 空对象 */
export type EmptyObject = Record<string, never>;

/** 未知对象 */
export type UnknownObject = Record<string, unknown>;

/** 判断是否为未知对象 */
export function isUnknownObject(v: unknown): v is UnknownObject {
  if (typeof v !== 'object' || v === null) {
    return false;
  }
  return true;
}
