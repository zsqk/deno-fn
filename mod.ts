// 依赖 Deno 的常用函数

import { readAll } from 'https://deno.land/std@0.118.0/streams/conversion.ts';

/**
 * [Deno] 解析 JSON 格式的 body
 * @param reqBody
 * @returns
 */
export async function readBody(reqBody?: Deno.Reader) {
  if (reqBody === undefined) {
    return {};
  }
  const buf: Uint8Array = await readAll(reqBody);
  const str = new TextDecoder('utf-8').decode(buf);
  return JSON.parse(str);
}

/**
 * [Deno] 加载 环境变量文件
 * @param path 环境变量文件路径
 */
export function loadENV(path = './.env'): void {
  try {
    Deno.readTextFileSync(path)
      .split('\n')
      .forEach((v) => {
        const i = v.indexOf('=');
        if (i === -1) {
          return;
        }
        Deno.env.set(v.slice(0, i), v.slice(i + 1));
      });
  } catch (err) {
    // 可能为文件不存在
    console.warn('loadENV', err);
  }
}
