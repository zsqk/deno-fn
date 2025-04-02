import gbkMapJSON from './gbk-map.json' with { type: 'json' };
const gbkMap: Record<string, number> = gbkMapJSON;

/**
 * 将字符串编码为 GBK 编码
 * @param src 字符串
 * @returns GBK 编码
 *
 * @author iugo <code@iugo.dev>
 */
export function encodeToGbk(src: string): string {
  let res = '';
  for (let D = 0; D < src.length; D++) {
    const char = src.charAt(D);
    const charCode = src.codePointAt(D);
    if (!charCode || charCode > 0xFFFF) {
      throw Error('can not encode to gbk, not support');
    }
    /**
     * GBK 码点
     */
    let e = gbkMap[charCode.toString()]?.toString(16).toUpperCase();
    if (e && e.length % 2 !== 0) {
      e = '0' + e;
    }
    if (' ' === char) {
      res += '20';
    } else if (19968 > charCode) {
      // 不是中文字符
      let t = charCode.toString(16);
      t && t.length % 2 !== 0 && (t = '0' + t), (res += t);
    } else {
      if (!e) throw Error('can not encode to gbk, not match');
      res += e;
    }
  }
  return res;
}
