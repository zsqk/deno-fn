// 依赖 Deno 的常用函数

import { readAll } from 'https://deno.land/std@0.144.0/streams/conversion.ts';
import { parseEnv } from './js/parse-env.ts';
import { getRunData } from './deno/run.ts';

/**
 * [Deno] 解析 JSON 格式的 Deno.Reader 为 JS 对象
 * @deprecated 因为 Deno 支持 Request 所以不再需要该功能.
 * @param reqBody
 * @returns
 */
export async function readBody(reqBody?: Deno.Reader): Promise<unknown> {
  if (reqBody === undefined) {
    return {};
  }
  const buf: Uint8Array = await readAll(reqBody);
  const str = new TextDecoder('utf-8').decode(buf);
  return JSON.parse(str);
}

/**
 * [Deno] Load Environment Variables
 * @param path environment file
 */
export function loadENV(
  path = './.env',
): [Error | null, Record<string, string>] {
  let error: Error | null = null;
  const res: Record<string, string> = {};
  try {
    Deno.readTextFileSync(path)
      .split('\n')
      .forEach((v) => {
        const i = v.indexOf('=');
        if (i === -1) {
          return;
        }
        const k = v.slice(0, i);
        const val = v.slice(i + 1);
        res[k] = val;
        Deno.env.set(k, val);
      });
  } catch (err) {
    error = err;
  }
  return [error, res];
}

export { getRunData };

type ComputeInfo = {
  hostname: string;
  os: string;
  version: string;
};

/**
 * [Deno] 获取计算机信息
 */
export async function getComputeInfo(): Promise<ComputeInfo> {
  let hostname = 'unknown';
  let os: string = Deno.build.os;
  let version = '';

  // get hostname
  if (Deno.build.os === 'darwin' || Deno.build.os === 'linux') {
    const p = Deno.run({ cmd: ['hostname'], stdout: 'piped' });
    hostname = new TextDecoder().decode(await p.output()).replace('\n', '');
    p.close();
  }

  // get os
  if (Deno.build.os === 'darwin') {
    os = 'mac';
  }

  // get version
  if (Deno.build.os === 'darwin') {
    const p = Deno.run({
      cmd: ['sw_vers', '-productVersion'],
      stdout: 'piped',
    });
    version = new TextDecoder().decode(await p.output()).replace('\n', '');
    p.close();
  }
  if (Deno.build.os === 'linux') {
    const p = Deno.run({
      cmd: ['cat', '/etc/os-release'],
      stdout: 'piped',
    });
    // cat /etc/os-release demo
    // PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
    // NAME="Debian GNU/Linux"
    // VERSION_ID="9"
    // VERSION="9 (stretch)"
    // ID=debian
    // HOME_URL="https://www.debian.org/"
    // SUPPORT_URL="https://www.debian.org/support"
    // BUG_REPORT_URL="https://bugs.debian.org/"
    const osRelease = parseEnv(new TextDecoder().decode(await p.output()));
    version = (osRelease.get('ID') ?? 'linux') +
      (osRelease.get('VERSION_ID') ?? '');
    p.close();
  }

  return { hostname, os, version };
}

/**
 * [Deno] 根据计算机信息自动生成名称
 */
export async function getComputeKey(): Promise<string> {
  const { hostname, os } = await getComputeInfo();
  return ''.concat(
    os,
    hostname,
    '-',
    Deno.env.get('USER') ?? 'unknown',
  );
}
