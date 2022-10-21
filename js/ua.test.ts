import {
  assertEquals,
  assertObjectMatch,
} from 'https://deno.land/std@0.131.0/testing/asserts.ts';

import { parserUA, parserUACommon } from './ua.ts';

const iPadUA =
  `Mozilla/5.0 (iPad; CPU OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19H12 AliApp(DingTalk/6.5.45) com.laiwang.DingTalk/26191496 Channel/201200 Pad/iPad language/zh-Hans-CN UT4Aplus/0.0.6 WK`;
const androidUA =
  `Mozilla/5.0 (Linux; U; Android 10; zh-CN; EVR-AL00 Build/HUAWEIEVR-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 UWS/3.22.1.210 Mobile Safari/537.36 AliApp(DingTalk/6.5.45) com.alibaba.android.rimet/26284409 Channel/227200 language/zh-CN abi/64 Hmos/1 UT4Aplus/0.2.25 colorScheme/light`;
const macosUA =
  `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36`;
const iPhoneUA =
  `Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1`;
const windowsUA =
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36`;
const crUA =
  `Mozilla/5.0 (X11; CrOS x86_64 14816.131.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`;

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

Deno.test('ua-os', () => {
  {
    const res = parserUA(macosUA);
    assertObjectMatch(res, { os: 'macOS' });
  }
  {
    const res = parserUA(iPhoneUA);
    assertObjectMatch(res, { os: 'iOS' });
  }
  {
    const res = parserUA(windowsUA);
    assertObjectMatch(res, { os: 'Windows' });
  }

  {
    const res = parserUA(crUA);
    assertObjectMatch(res, { os: 'Chrome OS' });
  }
});

Deno.test('debug-parserUACommon', () => {
  const res1 = parserUACommon(iPadUA);
  assertEquals(res1.length, 10);
  console.log('res1', res1);

  const res2 = parserUACommon(androidUA);
  assertEquals(res2.length, 15);
  console.log('res2', res2);
});
