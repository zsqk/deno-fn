/**
 * 解析 env
 * 比如 `cat /etc/os-release`
 */
export function parseEnv(str: string) {
  // 不支持换行值.
  // 如果存在重复的值, 则后者覆盖前者.
  // 如果检查出无效值, 则跳过.
  const m = new Map<string, string>();
  for (const kv of str.split('\n')) {
    const i = kv.indexOf('=');
    if (i === -1) {
      continue;
    }
    const k = kv.slice(0, i);
    let v = kv.slice(i + 1);
    if (v[0] === '"') {
      const lastIndex = v.length - 1;
      if (v[lastIndex] !== '"') {
        continue;
      }
      // 去除双引号
      v = v.slice(1, lastIndex);
    }
    m.set(k, v);
  }
  return m;
}
