// 依赖 Deno 的常用函数

import { parseEnv } from './js/parse-env.ts';

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
    error = err as Error;
  }
  return [error, res];
}

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
    const p = new Deno.Command('hostname');
    const s = await p.output();
    hostname = new TextDecoder().decode(s.stdout).replace('\n', '');
  }

  // get os
  if (os === 'darwin') {
    os = 'mac';
  }

  // get version
  if (Deno.build.os === 'darwin') {
    const p = new Deno.Command('sw_vers', {
      args: ['-productVersion'],
    });
    version = new TextDecoder().decode(p.outputSync().stdout).replace('\n', '');
  }
  if (Deno.build.os === 'linux') {
    const p = new Deno.Command('cat', {
      args: ['/etc/os-release'],
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
    const osRelease = parseEnv(new TextDecoder().decode(p.outputSync().stdout));
    version = (osRelease.get('ID') ?? 'linux') +
      (osRelease.get('VERSION_ID') ?? '');
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
