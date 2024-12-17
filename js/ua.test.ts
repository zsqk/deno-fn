import { assertEquals, assertObjectMatch } from '@std/assert';

import { parserUA, parserUACommon } from './ua.ts';

const iPadUA =
  `Mozilla/5.0 (iPad; CPU OS 15_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/19H12 AliApp(DingTalk/6.5.45) com.laiwang.DingTalk/26191496 Channel/201200 Pad/iPad language/zh-Hans-CN UT4Aplus/0.0.6 WK`;
const androidUA =
  `Mozilla/5.0 (Linux; U; Android 10; zh-CN; EVR-AL00 Build/HUAWEIEVR-AL00) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 UWS/3.22.1.210 Mobile Safari/537.36 AliApp(DingTalk/6.5.45) com.alibaba.android.rimet/26284409 Channel/227200 language/zh-CN abi/64 Hmos/1 UT4Aplus/0.2.25 colorScheme/light`;
const androidRes = parserUA(androidUA);
const macosUA =
  `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36`;
const iPhoneUA =
  `Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1`;
const windowsUA =
  `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36`;
const crUA =
  `Mozilla/5.0 (X11; CrOS x86_64 14816.131.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36`;
const weixinUA =
  `Mozilla/5.0 (Linux; Android 7.0; FRD-AL00 Build/HUAWEIFRD-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043602 Safari/537.36 MicroMessenger/6.5.16.1120 NetType/WIFI Language/zh_CN`;
const workweixinUA =
  `Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 wxwork/2.1.5 MicroMessenger/6.3.22`;
const alipayUA =
  `Mozilla/5.0 (Linux; U; Android 10; zh-CN; H9493 Build/52.1.A.3.49) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/69.0.3497.100 UWS/3.21.0.169 Mobile Safari/537.36 AlipayChannelId/5136 UCBS/3.21.0.169_200731162109 NebulaSDK/1.8.100112 Nebula AlipayDefined(nt:WIFI,ws:411|0|3.5,ac:sp) AliApp(AP/10.2.0.8026) AlipayClient/10.2.0.8026 Language/zh-Hans useStatusBar/true isConcaveScreen/false Region/CN NebulaX/1.0.0 Ariver/1.0.0`;
const alipayRes = parserUA(alipayUA);
const feishuUA =
  `Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1 Lark/5.21.3 LarkLocale/zh_CN ChannelName/Feishu LKBrowserIdentifier/3CDCC4D9-6106-40EF-97E2-F39C858C6E03`;
const feishuRes = parserUA(feishuUA);

Deno.test('ua-sw', () => {
  const iPadRes = parserUA(iPadUA);
  assertObjectMatch(iPadRes, {
    isDingtalk: true,
    dingtalkVersion: '6.5.45',
    softwareName: '钉钉',
  });

  assertObjectMatch(androidRes, {
    isDingtalk: true,
    dingtalkVersion: '6.5.45',
    softwareName: '钉钉',
  });

  assertObjectMatch(alipayRes, { softwareName: '支付宝' });

  const weixinRes = parserUA(weixinUA);
  assertObjectMatch(weixinRes, { softwareName: '微信' });

  const workweixinRes = parserUA(workweixinUA);
  assertObjectMatch(workweixinRes, {
    softwareName: '企业微信',
  });

  assertObjectMatch(feishuRes, {
    softwareName: '飞书',
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
  assertObjectMatch(androidRes, {
    os: 'HarmonyOS',
    hmosVersion: '1',
  });
});

Deno.test('debug-parserUACommon', () => {
  const res1 = parserUACommon(iPadUA);
  assertEquals(res1.length, 10);
  console.log('res1', res1);

  const res2 = parserUACommon(androidUA);
  assertEquals(res2.length, 15);
  console.log('res2', res2);
});
