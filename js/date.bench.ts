// deno bench js/date.bench.ts

import { getWeekday as getWeekday2 } from './date.ts';
import { getWeekday } from './date.altimpl.ts';

Deno.bench('getWeekday bench #1 altimpl', () => {
  getWeekday(new Date('2022-05-01 11:12 +8'), new Date());
});

Deno.bench('getWeekday bench #2', () => {
  getWeekday2(new Date('2022-05-01 11:12 +8'), new Date());
});
