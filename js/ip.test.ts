import { assert } from '@std/assert/assert';
import { checkIPv4 } from './ip.ts';

Deno.test('ipv4', () => {
  // 不允许无效的字符
  assert(!checkIPv4(''));

  assert(!checkIPv4('a.a.a.a'), '不应该允许出现特殊字符');

  assert(!checkIPv4('1.1.1.a'), '不应该允许出现特殊字符');

  assert(!checkIPv4('1.1.1. 1'), '不应该允许出现特殊字符');

  assert(!checkIPv4('300.1.1.1'), '不应该允许超位');

  assert(!checkIPv4('1.1.1.1.1'), '不允许长度超长');

  assert(checkIPv4('1.1.1.1'));
});
