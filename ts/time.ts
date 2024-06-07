/** 秒 */
export type Second = number;

/** 毫秒 */
export type Millisecond = number;

/** UNIX 时间戳(毫秒) */
export type MillisecondTimestamp = number;

/** UNIX 时间戳(秒) */
export type UnixTimestamp = number;

/**
 * 判断是否为 UNIX 时间戳类型
 */
export function isUnixTimestamp(v: unknown): v is UnixTimestamp {
  return Number.isSafeInteger(v);
}

/** 整月字符串(6 位), 比如 `202101` 表示 2021 年 1 月 */
export type MonthString = string;
