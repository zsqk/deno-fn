import gbkMapJSON from './gbk-map.json' with { type: 'json' };
const gbkMap: Record<string, number> = gbkMapJSON;

export function encodeToGbk(src: string): string {
  let res = '';
  for (let D = 0; D < src.length; D++) {
    const char = src.charAt(D);
    const charCode = src.charCodeAt(D);
    /**
     * GBK 编码位点
     */
    let e = gbkMap[charCode.toString()].toString(16).toUpperCase();
    if ((e && e.length % 2 !== 0 && (e = '0' + e), ' ' === char)) {
      res += '20';
    } else if (19968 > charCode) {
      let t = charCode.toString(16);
      t && t.length % 2 !== 0 && (t = '0' + t), (res += t);
    } else {
      if (!e) throw Error('not match');
      res += e;
    }
  }
  return res;
}
