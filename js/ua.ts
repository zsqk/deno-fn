export function parserUA(ua: string): {
  isDingtalk: boolean;
  dingtalkVersion: string | null;
  isHmos: boolean;
  hmosVersion: string | null;
} {
  const base = Object.fromEntries(
    parserUACommon(ua).map(({ key, ...rest }) => [key, rest]),
  );
  let isDingtalk = false;
  let dingtalkVersion: string | null = null;
  {
    const aliapp = base['AliApp'];
    if (aliapp && aliapp.info.length === 1) {
      // 根据真实 UA 猜测, 如果阿里将来 UA 变动, 可能导致出错
      const [{ key, version }] = parserUACommon(aliapp.info[0]);
      if (key === 'DingTalk') {
        isDingtalk = true;
        dingtalkVersion = version!;
      }
    }
  }

  let isHmos = false;
  let hmosVersion: string | null = null;
  {
    const hmos = base['Hmos'];
    if (hmos) {
      isHmos = true;
      hmosVersion = hmos.version!;
    }
  }

  return { isDingtalk, dingtalkVersion, isHmos, hmosVersion };
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
