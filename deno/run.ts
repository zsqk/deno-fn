import { delay } from '@std/async/delay';

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
  }: Deno.CommandOptions & { timeout?: number } = {},
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

  const cmd = typeof command === 'string' ? command.split(' ') : command;

  /** 超时中断控制器 */
  const ac = new AbortController();

  /** 命令 */
  const c = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    stdout,
    stderr,
    ...opt,
  });

  /** 进程 */
  let p: Deno.ChildProcess;
  try {
    p = c.spawn();
  } catch (err) {
    if (!(err instanceof Error)) {
      throw new Error(`${err}`);
    }
    if (err.name === 'NotFound') {
      err.message = `command or file not found: ${cmd[0]}`;
    }
    throw err;
  }

  const timeoutPromise = delay(timeout, { signal: ac.signal }).then(() => {
    p.kill();
    throw new Error('timeout');
  });

  const exePromise = (async () => {
    // 返回信息
    /** 执行结果 */
    const o = await p.output();
    res = new TextDecoder().decode(o.stdout);
    if (o.success) {
      errMsg += `no error.`;
    }
    errMsg += new TextDecoder().decode(o.stderr);
    ac.abort();
    return { res, errMsg, code: o.code };
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
  opt?: Omit<Deno.CommandOptions, 'stdout' | 'stderr'> & {
    timeout?: number;
  },
): Promise<number> {
  const { code, res, errMsg } = await run(command, opt);
  if (code !== 0) {
    throw new Error(errMsg);
  }
  res && console.log(res);
  return code;
}
