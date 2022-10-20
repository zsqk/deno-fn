import {
  assertObjectMatch,
} from 'https://deno.land/std@0.131.0/testing/asserts.ts';

import { parserUA, parserUACommon } from './ua.ts';

const iPadUA =
  `Mozilla/5.0 (iPad; CPU OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19H12 AliApp(DingTalk/6.5.45) com.laiwang.DingTalk/26191496 Channel/201200 Pad/iPad language/zh-Hans-CN UT4Aplus/0.0.6 WK`;
const androidUA =
  `Mozilla/5.0 (Linux; U; Android 10; zh-CN; EVR-AL00 Build/HUAWEIEVR-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 UWS/3.22.1.210 Mobile Safari/537.36 AliApp(DingTalk/6.5.45) com.alibaba.android.rimet/26284409 Channel/227200 language/zh-CN abi/64 Hmos/1 UT4Aplus/0.2.25 colorScheme/light`;

Deno.test('ua-dingtalk', () => {
  const iPadRes = parserUA(iPadUA);
  assertObjectMatch(iPadRes, { isDingtalk: true, dingtalkVersion: '6.5.45' });

  const androidRes = parserUA(androidUA);
  assertObjectMatch(androidRes, {
    isDingtalk: true,
    dingtalkVersion: '6.5.45',
    isHmos: true,
    hmosVersion: '1',
  });
});

Deno.test('debug-parserUACommon', () => {
  const res1 = parserUACommon(iPadUA);
  console.log('res1', res1);

  const res2 = parserUACommon(androidUA);
  console.log('res2', res2);
});
