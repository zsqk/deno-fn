/**
 * [Deno] 执行命令
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
