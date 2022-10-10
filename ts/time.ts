/** 秒 */
export type Second = number;

/** 毫秒 */
export type Millisecond = number;

/** UNIX 时间戳(毫秒) */
export type MillisecondTimestamp = number;

/** UNIX 时间戳(秒) */
export type UnixTimestamp = number;

export function isUnixTimestamp(v: unknown): v is UnixTimestamp {
  return Number.isSafeInteger(v);
}
