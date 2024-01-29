// alternative implementation
/**
 * 计算时间间隔中星期的天数
 * @param before
 * @param after
 * @returns [总天数, 周一天数, 周二天数, 周三天数, 周四天数, 周五天数, 周六天数, 周日天数]
 */
export function getWeekday(
  before: Date,
  after: Date,
): [number, number, number, number, number, number, number, number] {
  if (before > after) {
    throw new Error('before cannot > after');
  }

  let weekdayall = 0;
  let weekday1 = 0;
  let weekday2 = 0;
  let weekday3 = 0;
  let weekday4 = 0;
  let weekday5 = 0;
  let weekday6 = 0;
  let weekday7 = 0;
  // 获取 before 的第一时间
  const beforeDay = new Date(
    `${before.getFullYear()}-${before.getMonth() + 1}-${before.getDate()}`,
  );
  // 获取 after 的最后时间
  const afterDay = new Date(
    `${after.getFullYear()}-${after.getMonth() + 1}-${after.getDate()}`,
  );
  // 24 * 60 * 60 * 1,000 = 86,400,000 毫秒
  const MILLISECONDS_ONE_DAY = 86400000;

  // 两个时间中间包含多少天
  let days = (afterDay.getTime() - beforeDay.getTime()) /
      MILLISECONDS_ONE_DAY + 1;
  weekdayall = days;

  // 如果不是从周一开始
  switch (before.getDay()) {
    case 2:
      weekday2++;
      weekday3++;
      weekday4++;
      weekday5++;
      weekday6++;
      weekday7++;
      days -= 6;
      break;
    case 3:
      weekday3++;
      weekday4++;
      weekday5++;
      weekday6++;
      weekday7++;
      days -= 5;
      break;
    case 4:
      weekday4++;
      weekday5++;
      weekday6++;
      weekday7++;
      days -= 4;
      break;
    case 5:
      weekday5++;
      weekday6++;
      weekday7++;
      days -= 3;
      break;
    case 6:
      weekday6++;
      weekday7++;
      days -= 2;
      break;
    case 0:
      weekday7++;
      days -= 1;
      break;
    default:
      break;
  }

  // 如果不是从周日结束
  switch (after.getDay()) {
    case 1:
      weekday1++;
      days -= 1;
      break;
    case 2:
      weekday1++;
      weekday2++;
      days -= 2;
      break;
    case 3:
      weekday1++;
      weekday2++;
      weekday3++;
      days -= 3;
      break;
    case 4:
      weekday1++;
      weekday2++;
      weekday3++;
      weekday4++;
      days -= 4;
      break;
    case 5:
      weekday1++;
      weekday2++;
      weekday3++;
      weekday4++;
      weekday5++;
      days -= 5;
      break;
    case 6:
      weekday1++;
      weekday2++;
      weekday3++;
      weekday4++;
      weekday5++;
      weekday6++;
      days -= 6;
      break;
    default:
      break;
  }

  const weeks = Math.floor(days / 7);

  return [
    weekdayall,
    weekday1 += weeks,
    weekday2 += weeks,
    weekday3 += weeks,
    weekday4 += weeks,
    weekday5 += weeks,
    weekday6 += weeks,
    weekday7 += weeks,
  ];
}
