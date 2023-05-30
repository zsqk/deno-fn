// ms 到结构化的时间
// 结构化的时间到 ms
// 渲染 ms 时间 (通过结构化)

import {
  MillisecondTimestamp,
  MonthString,
  UnixTimestamp,
} from '../ts/time';

/**
 * 已被分析并且结构化的时间
 */
type AnalyzedTime = {
  /** 年 */
  y: number;
  /** 周 */
  w: number;
  /** 天 */
  d: number;
  /** 小时 */
  h: number;
  /** 分钟 */
  m: number;
  /** 秒 */
  s: number;
  /** 毫秒 */
  ms: number;
};

/**
 * 渲染毫秒时间
 *
 * 默认为 2 精度, 比如 `1h30m20s` 保留精度后为 `1h30m`.
 *
 * @param ms
 * @returns
 */
export function msRender(ms: number): string {
  const { y, w, d, h, m, s, ms: msLeft } = timeAnalyze({ ms });
  if (y) {
    return `${y}年${w}周`;
  }
  if (w) {
    return `${w}周${d}日`;
  }
  if (d) {
    return `${d}日${h}小时`;
  }
  if (h) {
    return `${h}小时${m}分`;
  }
  if (m) {
    return `${m}分${s}秒`;
  }
  if (s) {
    return `${s}.${msLeft.toString().padStart(3, '0')}秒`;
  }
  return `${msLeft}毫秒`;
}

/**
 * 分析毫秒时间
 *
 * 1. 超过 1000 ms 的使用 s.
 * 2. 超过 60 s 的使用 m.
 * 3. 超过 60 m 的使用 h.
 * 4. 超过 24 h 的使用 d.
 * 5. 超过 7 d 的使用 w.
 * 6. 超过 365 d 的使用 y.
 */
export function timeAnalyze(
  time: { ms: number },
  opt: { leapyear?: boolean } = {},
): AnalyzedTime {
  // 总 ms 数
  const { ms } = time;

  /** 要返回的最终结果 */
  const res = { y: 0, w: 0, d: 0, h: 0, m: 0, s: 0, ms: 0 };

  // ms 精度
  res.ms = ms % 1000;

  /** 总秒数 */
  const s = (ms - res.ms) / 1000;
  if (s === 0) {
    return res;
  }

  // s 精度
  res.s = s % 60;

  /** 总分钟数 */
  const m = (s - res.s) / 60;
  if (m === 0) {
    return res;
  }

  // m 精度
  res.m = m % 60;

  /** 总小时数 */
  const h = (m - res.m) / 60;
  if (h === 0) {
    return res;
  }

  // h 精度
  res.h = h % 24;

  /** 总天数 */
  const d = (h - res.h) / 24;
  if (d === 0) {
    return res;
  }

  /** 不足一年的天数 */
  let leftDays: number;

  if (opt.leapyear) {
    // 考虑闰年
    const leftDaysL = d % 1461; // 1461 为每四年 (包含闰年) 的总天数
    res.y = (d - leftDaysL) / 1461 * 4;
    leftDays = leftDaysL % 365;
    res.y += (leftDaysL - leftDays) / 365;
  } else {
    leftDays = d % 365;
    // set 整年数
    res.y = (d - leftDays) / 365;
  }

  // set 不足一周的天数
  res.d = leftDays % 7;

  // set 不足一年的周数
  res.w = (leftDays - res.d) / 7;

  return res;
}

/**
 * 总和已分析的时间
 * @param time
 * @param opt
 * @returns
 */
export function timeSummarize(
  time: AnalyzedTime,
  opt: {
    /** 是否考虑闰年 */
    leapyear?: boolean;
    /** 要返回时间的类型, 默认为 ms */
    type?: 'ms' | 's' | 'm' | 'h' | 'd';
  } = {},
): number {
  const { y, w, d, h, m, s, ms } = time;

  /** days by year */
  let yd = y * 365;
  if (opt.leapyear) {
    yd += Math.floor(y / 4);
  }

  /** days by weeks */
  const wd = w * 7;

  /** all days */
  const ad = d + wd + yd;
  if (opt.type === 'd') {
    return ad;
  }

  // TODO: all week

  /** all hours */
  const ah = ad * 24 + h;
  if (opt.type === 'h') {
    return ah;
  }

  /** all minutes */
  const am = ah * 60 + m;
  if (opt.type === 'm') {
    return am;
  }

  /** all s */
  const as = am * 60 + s;
  if (opt.type === 's') {
    return as;
  }

  /** all ms */
  const ams = as * 1000 + ms;

  return ams;
}

/**
 * 获取月份
 * @author iugo <code@iugo.dev>
 */
export function getMonths(
  /** 开始时间 (包含) */
  startAt: UnixTimestamp,
  /** 结束时间 (包含) */
  endAt: UnixTimestamp,
  opt: { timezone?: string } = {},
): {
  /** 月份, 202101 */
  months: string[];
  /** 之前的 不足一个月 */
  before?: [UnixTimestamp, UnixTimestamp];
  /** 之后的 不足一个月 */
  after?: [UnixTimestamp, UnixTimestamp];
} {
  if (startAt > endAt) {
    throw new Error(`时间段选择有误, 开始时间不该大于结束时间`);
  }

  const months: string[] = [];
  /** 开始时间的毫秒时间戳 */
  const startMillisecond = startAt * 1000;
  /** 结束时间的毫秒时间戳 */
  const endMillisecond = endAt * 1000;
  /** 开始 Date */
  const start = new Date(startMillisecond);
  /** 结束 Date */
  const end = new Date(endMillisecond);
  /** 开始年份 */
  let startYear = start.getFullYear();
  /** 结束年份 */
  let endYear = end.getFullYear();
  /** 开始月份 */
  let startMonth = start.getMonth() + 1;
  /** 结束月份 */
  let endMonth = end.getMonth() + 1;

  // 如果在同一个月份, 则直接返回基础数值
  if (startYear === endYear && startMonth === endMonth) {
    return { months: [], before: [startAt, endAt] };
  }

  let before: [UnixTimestamp, UnixTimestamp] | undefined = undefined;
  if (startMillisecond !== getBeginningOfMonth(start, opt)) {
    before = [startAt, Math.trunc(getEndOfMonth(start, opt) / 1000)];
    if (startMonth === 12) {
      startYear += 1;
      startMonth = 1;
    } else {
      startMonth += 1;
    }
  }

  let after: [UnixTimestamp, UnixTimestamp] | undefined = undefined;
  if (endMillisecond !== getEndOfMonth(end, opt)) {
    after = [Math.trunc(getBeginningOfMonth(end, opt) / 1000), endAt];
    if (endMonth === 1) {
      endYear -= 1;
      endMonth = 12;
    } else {
      endMonth -= 1;
    }
  }

  // 如果没有一个完整的月
  if (endYear < startYear || (startYear === endYear && endMonth < startMonth)) {
    return { months: [], before: [startAt, endAt] };
  }

  // 特殊情况考虑完毕, 下面开始计算 months

  // 如果在同一年, 则只计算月差
  if (startYear === endYear) {
    for (let m = startMonth; m <= endMonth; m++) {
      months.push(`${startYear}${m.toString().padStart(2, '0')}`);
    }
  } else {
    for (let m = startMonth; m <= 12; m++) {
      months.push(`${startYear}${m.toString().padStart(2, '0')}`);
    }
    for (let y = startYear + 1; y < endYear; y++) {
      months.push(
        `${y}01`,
        `${y}02`,
        `${y}03`,
        `${y}04`,
        `${y}05`,
        `${y}06`,
        `${y}07`,
        `${y}08`,
        `${y}09`,
        `${y}10`,
        `${y}11`,
        `${y}12`,
      );
    }
    for (let m = 1; m <= endMonth; m++) {
      months.push(`${endYear}${m.toString().padStart(2, '0')}`);
    }
  }

  // TODO: 如果不在同一年, 则计算开始与 12 的差, 结束与 1 的差
  // TODO: 如果年差超过 1, 则附加 多出来年份的每一月

  return { months, before, after };
}

/**
 * 获取月末时间
 * @param v 支持 Date 和 `202101...` 这样的字符串
 * @returns 月末时间的毫秒时间戳
 * @author iugo <code@iugo.dev>
 */
export function getEndOfMonth(
  v: Date | MonthString,
  opt: { timezone?: string } = {},
): MillisecondTimestamp {
  let d: Date;
  if (v instanceof Date) {
    d = v;
  } else if (typeof v === 'string') {
    let str = `${v.substring(0, 4)}/${v.substring(4, 6)}`;
    if (opt.timezone) {
      str += ' ' + opt.timezone;
    }
    d = new Date(str);
  } else {
    throw new TypeError('无效的参数类型');
  }
  if (d.toString() === 'Invalid Date') {
    throw new Error('无效的时间');
  }
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  let key = m === 12
    ? `${y + 1}/01`
    : `${y}/${(m + 1).toString().padStart(2, '0')}`;
  if (opt.timezone) {
    key += ' ' + opt.timezone;
  }
  return new Date(key).getTime() - 1000;
}

/**
 * 获取月初时间
 * @param v 支持 Date 和 `202101...` 这样的字符串
 * @returns 月初时间的毫秒时间戳
 * @author iugo <code@iugo.dev>
 */
export function getBeginningOfMonth(
  v: Date | MonthString,
  opt: { timezone?: string } = {},
): MillisecondTimestamp {
  let d: Date;
  if (v instanceof Date) {
    d = v;
  } else if (typeof v === 'string') {
    let str = `${v.substring(0, 4)}/${v.substring(4, 6)}`;
    if (opt.timezone) {
      str += ' ' + opt.timezone;
    }
    d = new Date(str);
  } else {
    throw new TypeError('无效的参数类型');
  }
  if (d.toString() === 'Invalid Date') {
    throw new Error('无效的时间');
  }
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  let str = `${y}/${m.toString().padStart(2, '0')}`;
  if (opt.timezone) {
    str += ' ' + opt.timezone;
  }
  return new Date(str).getTime();
}

/**
 * 获取 UNIX 时间戳
 * @param v 毫秒时间戳, Date, 或者生成 Date 所需的字符串
 * @returns
 */
export function toUnixTimestamp(
  v: MillisecondTimestamp | Date | string = Date.now(),
): UnixTimestamp {
  let t: number;
  if (typeof v === 'string') {
    t = new Date(v).getTime();
  } else if (v instanceof Date) {
    t = v.getTime();
  } else {
    t = v;
  }
  return Math.trunc(t / 1000);
}

/**
 * 解析 Date 对象的时间
 * @param v 需要解析的时间, 默认为当前
 * @param opt 参数
 * @returns
 */
export function parseDate(
  v:
    | Date
    | { unixMS: MillisecondTimestamp }
    | { unixS: UnixTimestamp } = new Date(),
  opt: { isUTC?: boolean } = {},
): {
  y: string;
  m: string;
  d: string;
  h: string;
  min: string;
  s: string;
} {
  let date: Date;
  if ('unixMS' in v) {
    date = new Date(v.unixMS);
  } else if ('unixS' in v) {
    date = new Date(v.unixS * 1000);
  } else {
    date = v;
  }

  if (opt.isUTC) {
    const y = date.getUTCFullYear().toString();
    const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const d = date.getUTCDate().toString().padStart(2, '0');
    const h = date.getUTCHours().toString().padStart(2, '0');
    const min = date.getUTCMinutes().toString().padStart(2, '0');
    const s = date.getUTCSeconds().toString().padStart(2, '0');

    return { y, m, d, h, min, s };
  }

  const y = date.getFullYear().toString();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const h = date.getHours().toString().padStart(2, '0');
  const min = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');

  return { y, m, d, h, min, s };
}
