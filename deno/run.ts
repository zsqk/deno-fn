/**
 * [Deno] 执行命令
 * @deprecated 使用 `run` 替代以支持更多参数
 * @param command 需要执行的命令
 * @returns 命令执行结果
 */
export async function getRunData(command: string[], path?: string) {
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
export async function run(
  command: string[] | string,
  opt: Omit<Parameters<typeof Deno.run>[0], 'cmd'> = {
    stdout: 'piped',
    stderr: 'piped',
  },
): Promise<{
  /** 返回结果 */
  res: string;
  /** 错误信息 */
  errMsg: string;
  /** 结果错误码, 无错为 0 */
  code: number;
}> {
  /** 进程 */
  const p = Deno.run({
    ...opt,
    cmd: typeof command === 'string' ? command.split(' ') : command,
  });

  let res = '';
  let errMsg = '';
  let code = 0;

  try {
    /** 执行状态 */
    const s = await p.status();
    code = s.code;

    // 返回信息
    if (opt.stdout === 'piped') {
      res = new TextDecoder().decode(await p.output());
    }

    // 错误信息
    if (opt.stderr === 'piped') {
      const stderr = await p.stderrOutput();
      if (s.success) {
        errMsg += `no error.`;
      }
      errMsg += new TextDecoder().decode(stderr);
    }
  } finally {
    p.close();
  }
  return { res, errMsg, code };
}

/**
 * [Deno] 执行命令 (不需要获取返回数据)
 * @param command 需要运行的命令
 * @param opt 参数
 * @returns
 */
export async function onlyRun(
  command: string[] | string,
  opt?: Omit<Parameters<typeof Deno.run>[0], 'cmd' | 'stdout' | 'stderr'>,
) {
  const { code } = await run(command, opt);
  return code;
}
