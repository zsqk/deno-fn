// ms 到结构化的时间
// 结构化的时间到 ms
// 渲染 ms 时间 (通过结构化)

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
): {
  y: number;
  w: number;
  d: number;
  h: number;
  m: number;
  s: number;
  ms: number;
} {
  // 总 ms 数
  const { ms } = time;

  /** 要返回的最终结果 */
  const res = { y: 0, w: 0, d: 0, h: 0, m: 0, s: 0, ms: 0 };

  // ms 精度
  res.ms = ms % 1000;

  /** 总秒数 */
  const s = (ms - res.ms) / 1000;

  // s 精度
  res.s = s % 60;

  /** 总分钟数 */
  const m = (s - res.s) / 60;

  res.m = m % 60;

  const h = (m - res.m) / 60;

  res.h = h % 24;

  /** 总天数 */
  const d = (h - res.h) / 24;

  // 不足一年的天数
  let leftDays: number;

  // 考虑闰年
  if (opt.leapyear) {
    const leftDaysL = d % 1461;
    res.y = (d - leftDaysL) / 1461 * 4;
    leftDays = leftDaysL % 365;
    res.y += (leftDaysL - leftDays) / 365;
  } else {
    leftDays = d % 365;
    // 整年数
    res.y = (d - leftDays) / 365;
  }

  // 不足一周的天数
  res.d = leftDays % 7;

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
  time: {
    y: number;
    w: number;
    d: number;
    h: number;
    m: number;
    s: number;
    ms: number;
  },
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
