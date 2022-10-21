type OSName =
  | 'macOS'
  | 'Windows'
  | 'Android'
  | 'HarmonyOS'
  | 'iOS'
  | 'iPadOS'
  | 'Chrome OS'
  | 'unknown';

type SoftwareName = '钉钉' | '支付宝' | '微信' | '企业微信' | '飞书' | 'Lark' | 'unknown';

export function parserUA(ua: string): {
  isDingtalk: boolean;
  dingtalkVersion: string | null;
  hmosVersion: string | null;
  isMobile: boolean;
  os: OSName;
  softwareName: SoftwareName;
} {
  const base = Object.fromEntries(
    parserUACommon(ua).map(({ key, ...rest }) => [key, rest]),
  );

  let os: OSName = 'unknown';
  let softwareName: SoftwareName = 'unknown';

  let isDingtalk = false;
  let dingtalkVersion: string | null = null;
  const aliapp = base['AliApp'];
  if (aliapp && aliapp.info.length === 1) {
    // 根据真实 UA 猜测, 如果阿里将来 UA 变动, 可能导致出错
    const [{ key, version }] = parserUACommon(aliapp.info[0]);
    if (key === 'DingTalk') {
      isDingtalk = true;
      dingtalkVersion = version!;
      softwareName = '钉钉';
    }
    if (key === 'AP') {
      softwareName = '支付宝';
    }
  }

  // 简单识别 OS 信息
  for (const info of base['Mozilla'].info) {
    // TODO: 从 13 开始, 改名为 iPadOS
    if (info === 'iPad') {
      os = 'iPadOS';
      break;
    }
    if (info === 'iPhone') {
      os = 'iOS';
      break;
    }
    if (info === 'Macintosh') {
      os = 'macOS';
      break;
    }
    if (info.startsWith('Windows NT')) {
      os = 'Windows';
      break;
    }
    if (info.startsWith('Android')) {
      os = 'Android';
      break;
    }
    if (info.startsWith('CrOS')) {
      os = 'Chrome OS';
      break;
    }
  }

  // 鸿蒙 OS 识别
  let hmosVersion: string | null = null;
  const hmos = base['Hmos'];
  if (hmos) {
    os = 'HarmonyOS';
    hmosVersion = hmos.version!;
  }

  if (base['MicroMessenger']) {
    softwareName = '微信';
  }
  if (base['wxwork']) {
    softwareName = '企业微信';
  }

  if (base['Lark']) {
    softwareName = 'Lark';
    if (base['ChannelName'].version === 'Feishu') {
      softwareName = '飞书';
    }
  }

  return {
    isDingtalk,
    dingtalkVersion,
    hmosVersion,
    isMobile: base['Mobile'] !== undefined,
    os,
    softwareName,
  };
}

export function parserUACommon(
  ua: string,
): { key: string; version?: string; info: string[] }[] {
  const arr: { key: string; version?: string; info: string[] }[] = [];
  let temp = '';
  let isBlock = false;

  const insert = () => {
    if (!temp) {
      return;
    }
    const [key, version] = temp.split('/');
    arr.push({ key, version, info: [] });
    temp = '';
  };
  for (const s of ua) {
    if (s === '(') {
      // 开始附加信息
      isBlock = true;

      // 处理特定情况附加信息前没有空格的问题
      insert();
    } else if (s === ')') {
      // 结束附加信息写入
      isBlock = false;
      arr[arr.length - 1].info.push(...temp.split(';').map((v) => v.trim()));
      temp = '';
    } else if (s === ' ' && !isBlock) {
      // 结束一段信息
      insert();
    } else if (!temp && s === ' ') {
      // 避免首位空字符串写入
      continue;
    } else {
      temp += s;
    }
  }
  insert();
  return arr;
}
