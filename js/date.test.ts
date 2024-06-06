import {
  getMonths,
  parseDate,
  timeAnalyze,
  timeSummarize,
  toUnixTimestamp,
} from './date.ts';
import { assertThrows } from '@std/testing/asserts';
import { assertEquals } from '@std/assert/assert_equals';
import { getWeekday as getWeekday2 } from './date.ts';
import { getWeekday } from './date.altimpl.ts';

Deno.test('renderTime', () => {
  assertEquals(
    timeAnalyze({ ms: 61111 }),
    { y: 0, w: 0, d: 0, h: 0, m: 1, s: 1, ms: 111 },
  );

  const now = Date.now();
  assertEquals(
    timeSummarize(timeAnalyze({ ms: now })),
    now,
  );

  assertEquals(
    timeAnalyze({ ms: 1659147770282 }),
    { y: 52, w: 31, d: 6, h: 2, m: 22, s: 50, ms: 282 },
  );

  assertEquals(
    timeSummarize(
      timeAnalyze({ ms: now }, { leapyear: true }),
      { leapyear: true },
    ),
    now,
  );

  assertEquals(
    timeAnalyze({ ms: 1659147770282 }, { leapyear: true }),
    { y: 52, w: 30, d: 0, h: 2, m: 22, s: 50, ms: 282 },
  );
});

Deno.test({
  name: 'getMonths 错误',
  fn() {
    assertThrows(() => {
      getMonths(
        toUnixTimestamp('2021/01/14 GMT+08:00'),
        toUnixTimestamp('2021/01/03 GMT+08:00'),
        { timezone: 'GMT+08:00' },
      );
    });
  },
});

Deno.test({
  name: 'getMonths 本月部分',
  fn() {
    const { months, before, after } = getMonths(
      toUnixTimestamp('2021/01/03 GMT+08:00'),
      toUnixTimestamp('2021/01/14 GMT+08:00'),
      { timezone: 'GMT+08:00' },
    );
    assertEquals(months, []);
    assertEquals(before, [1609603200, 1610553600]);
    assertEquals(after, undefined);
  },
});

Deno.test({
  name: 'getMonths 相邻两月不跨年',
  fn() {
    const { months, before, after } = getMonths(
      toUnixTimestamp('2021/01/03 GMT+08:00'),
      toUnixTimestamp('2021/02/14 GMT+08:00'),
      { timezone: 'GMT+08:00' },
    );
    assertEquals(months, []);
    assertEquals(before, [1609603200, 1613232000]);
    assertEquals(after, undefined);
  },
});

Deno.test({
  name: 'getMonths 相邻两月跨年',
  fn() {
    const { months, before, after } = getMonths(
      toUnixTimestamp('2020/12/03 GMT+08:00'),
      toUnixTimestamp('2021/01/14 GMT+08:00'),
      { timezone: 'GMT+08:00' },
    );
    assertEquals(months, []);
    assertEquals(before, [1606924800, 1610553600]);
    assertEquals(after, undefined);
  },
});

Deno.test({
  name: 'getMonths 普通多月',
  fn() {
    const { months, before, after } = getMonths(
      toUnixTimestamp('2021/01/03 GMT+08:00'),
      toUnixTimestamp('2021/04/14 GMT+08:00'),
      { timezone: 'GMT+08:00' },
    );
    assertEquals(months, ['202102', '202103']);
    assertEquals(before, [1609603200, 1612108799]);
    assertEquals(after, [1617206400, 1618329600]);
  },
});

Deno.test({
  name: 'getMonths 跨年多月',
  fn() {
    const { months, before, after } = getMonths(
      toUnixTimestamp('2020/11/03 GMT+08:00'),
      toUnixTimestamp('2021/04/14 GMT+08:00'),
      { timezone: 'GMT+08:00' },
    );
    assertEquals(months, ['202012', '202101', '202102', '202103']);
    assertEquals(before, [1604332800, 1606751999]);
    assertEquals(after, [1617206400, 1618329600]);
  },
});

Deno.test({
  name: 'getMonths 跨多年',
  fn() {
    const { months, before, after } = getMonths(
      toUnixTimestamp('2019/11/03 GMT+08:00'),
      toUnixTimestamp('2021/04/14 GMT+08:00'),
      { timezone: 'GMT+08:00' },
    );
    assertEquals(months, [
      '201912',
      '202001',
      '202002',
      '202003',
      '202004',
      '202005',
      '202006',
      '202007',
      '202008',
      '202009',
      '202010',
      '202011',
      '202012',
      '202101',
      '202102',
      '202103',
    ]);
    assertEquals(before, [1572710400, 1575129599]);
    assertEquals(after, [1617206400, 1618329600]);
  },
});

Deno.test('parseDate-s1', () => {
  const date = new Date('2021/08/03');
  const res = parseDate(date);
  assertEquals(res, {
    y: '2021',
    m: '08',
    d: '03',
    h: '00',
    min: '00',
    s: '00',
  });
});

Deno.test('parseDate-s2', () => {
  const date = new Date('2021/08/03 09:02:03');
  const res = parseDate(date);
  assertEquals(res, {
    y: '2021',
    m: '08',
    d: '03',
    h: '09',
    min: '02',
    s: '03',
  });
});

Deno.test('parseDate-s3', () => {
  const date = new Date('2021/08/03 09:02:03');
  const d = parseDate(date);
  assertEquals(`.${d.h + d.min + d.s}`, '.090203');
  assertEquals(`.${d.h}`, '.09');
});

Deno.test('getWeekday test #1 diff time', () => {
  const before = new Date('2024-01-01 11:12');
  const after = new Date('2024-01-26 15:00');
  const expected = [26, 4, 4, 4, 4, 4, 3, 3];

  assertEquals(
    getWeekday2(before, after),
    expected,
  );

  assertEquals(
    getWeekday(before, after),
    expected,
  );
});

Deno.test('getWeekday test #2 from monday with timezone', () => {
  // 暂时不支持时区设置
});

Deno.test('getWeekday test #3 from monday', () => {
  const before = new Date('2024-01-01');
  const after = new Date('2024-01-26');
  const expected = [26, 4, 4, 4, 4, 4, 3, 3];

  assertEquals(
    getWeekday2(before, after),
    expected,
  );

  assertEquals(
    getWeekday(before, after),
    expected,
  );
});

Deno.test('getWeekday test #4 from wendesday', () => {
  const before = new Date('2024-01-03');
  const after = new Date('2024-01-26');
  const expected = [24, 3, 3, 4, 4, 4, 3, 3];

  assertEquals(
    getWeekday2(before, after),
    expected,
  );

  assertEquals(
    getWeekday(before, after),
    expected,
  );
});

Deno.test('getWeekday test #5 end sunday', () => {
  const before = new Date('2024-01-03');
  const after = new Date('2024-01-28');
  const expected = [26, 3, 3, 4, 4, 4, 4, 4];

  assertEquals(
    getWeekday2(before, after),
    expected,
  );

  assertEquals(
    getWeekday(before, after),
    expected,
  );
});
