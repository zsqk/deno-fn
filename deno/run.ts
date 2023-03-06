import { delay } from 'https://deno.land/std@0.177.0/async/delay.ts';

/**
 * [Deno] 执行命令
 * @deprecated 使用 `run` 替代以支持更多参数
 * @param command 需要执行的命令
 * @returns 命令执行结果
 */
export async function getRunData(
  command: string[],
  path?: string,
): Promise<string> {
  /** 进程 */
  const run = Deno.run({
    cmd: command,
    cwd: path,
    stdout: 'piped',
    stderr: 'piped',
  });

  try {
    /** 状态 */
    const s1 = await run.status();

    /** 信息 */
    const stderr = await run.stderrOutput();
    if (!s1.success) {
      const r1err = new TextDecoder().decode(stderr);
      throw new Error(`${s1.code} ${r1err}`);
    }

    const res = new TextDecoder().decode(await run.output());

    return res;
  } finally {
    run.close();
  }
}

/**
 * [Deno] 执行命令
 * @param command 需要运行的命令
 * @param opt 参数
 * @returns
 */
// 因为该函数一定返回一个 Promise, 所以 async 是有意义的. 暂时关闭该 lint rule.
// deno-lint-ignore require-await
export async function run(
  command: string[] | string,
  {
    stdout = 'piped',
    stderr = 'piped',
    /**
     * 超时时间, 单位 ms
     */
    timeout = 5000,
    ...opt
  }: Omit<Parameters<typeof Deno.run>[0], 'cmd'> & { timeout?: number } = {},
): Promise<{
  /** 返回结果 */
  res: string;
  /** 错误信息 */
  errMsg: string;
  /** 结果错误码, 无错为 0 */
  code: number;
}> {
  let res = '';
  let errMsg = '';
  let code = 0;

  /** 进程 */
  let p: Deno.Process;
  const cmd = typeof command === 'string' ? command.split(' ') : command;

  /** 超时中断控制器 */
  const ac = new AbortController();

  try {
    p = Deno.run({
      stdout,
      stderr,
      ...opt,
      cmd,
    });
  } catch (err) {
    if (!(err instanceof Error)) {
      throw new Error(`${err}`);
    }
    if (err.name === 'NotFound') {
      console.error(err);
      err.message = `command or file not found: ${cmd[0]}`;
    }
    throw err;
  }

  const timeoutPromise = delay(timeout, { signal: ac.signal }).then(() => {
    p.kill();
    p.close();
    throw new Error('timeout');
  });

  const exePromise = (async () => {
    try {
      /** 执行状态 */
      const s = await p.status();
      code = s.code;

      // 返回信息
      if (stdout === 'piped') {
        res = new TextDecoder().decode(await p.output());
      }

      // 错误信息
      if (stderr === 'piped') {
        const stderr = await p.stderrOutput();
        if (s.success) {
          errMsg += `no error.`;
        }
        errMsg += new TextDecoder().decode(stderr);
      }
      ac.abort();
      return { res, errMsg, code };
    } finally {
      p.close();
    }
  })();

  return Promise.race([timeoutPromise, exePromise]);
}

/**
 * [Deno] 执行命令 (不需要获取返回数据)
 * @param command 需要运行的命令
 * @param opt 参数
 * @returns
 */
export async function onlyRun(
  command: string[] | string,
  opt?: Omit<Parameters<typeof Deno.run>[0], 'cmd' | 'stdout' | 'stderr'> & {
    timeout?: number;
  },
): Promise<number> {
  const { code } = await run(command, {
    ...opt,
    stderr: 'inherit',
    stdout: 'inherit',
  });
  return code;
}
