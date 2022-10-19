import { ensureDirSync } from 'https://deno.land/std@0.147.0/fs/mod.ts';

/**
 * 文本文件简易复制
 */
export function copyMapSync(
  /** 原文件夹地址, 以 `/` 结尾 */
  src: string,
  /** 新文件夹地址, 以 `/` 结尾 */
  dest: string,
  {
    fn,
    filter,
  }: {
    /** map 函数 */
    fn: (c: string, name: string, dir: string) => string | null;
    /** 过滤函数 */
    filter?: (name: string, dir: string) => boolean;
  },
): void {
  function map(path: string) {
    for (const dirEntry of Deno.readDirSync(src + path)) {
      if (dirEntry.isDirectory) {
        ensureDirSync(dest + path + dirEntry.name);
        map(path + dirEntry.name + '/');
      }
      if (dirEntry.isFile) {
        if (filter && !filter(dirEntry.name, path)) {
          continue;
        }
        const c = fn(
          Deno.readTextFileSync(src + path + dirEntry.name),
          dirEntry.name,
          path,
        );
        if (c === null) {
          continue;
        }
        Deno.writeTextFileSync(dest + path + dirEntry.name, c);
      }
    }
  }
  map('');
}
