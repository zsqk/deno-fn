import { getRunData } from '../mod.ts';

/**
 * 拉取 Git 仓库最新内容
 *
 * 需要 git 支持.
 */
export async function pullGitRepo(repo: string, opt: {
  keyPath?: string;
  branch?: string;
  depth?: string;
  dirPath?: string;
} = {}) {
  // 根据需求创建临时目录
  const tempPath = opt.dirPath ?? Deno.makeTempDirSync();
  Deno.chdir(tempPath);

  let branchParam: Array<string> = [];
  if (opt.branch) {
    branchParam = ['-b', opt.branch];
  }
  let keyParam: Array<string> = [];
  if (opt.keyPath) {
    keyParam = ['-c', `core.sshCommand=ssh -i ${opt.keyPath}`];
  }
  const depthParam: Array<string> = ['--depth', opt.depth ?? '1'];
  const command: Array<string> = [
    'git',
    'clone',
    ...keyParam,
    repo,
    ...depthParam,
    ...branchParam,
  ];

  try {
    await getRunData(command, tempPath);
  } catch (err) {
    console.error(`git 拉取失败`);
    throw err;
  }

  return tempPath;
}

/**
 * 查看本地 Git 仓库的变动
 * @param repoPath repo 在本地的 path
 */
export async function gitChanges(repoPath: string) {
  const res = Deno.run({
    cmd: ['git', 'status'],
    stdout: 'piped',
    stderr: 'piped',
    cwd: repoPath,
  });
  const output = new TextDecoder('utf-8').decode(await res.output());
  const errMsg = new TextDecoder('utf-8').decode(await res.stderrOutput());
  const status = await res.status();
  res.close();
  if (!status.success) {
    throw new Error(`${status.code} ${errMsg}`);
  }

  const changesReg = /(modified|deleted|renamed|new file):(.+)/g;

  type Changes =
    | { type: 'modified'; fileName: string }
    | { type: 'deleted'; fileName: string }
    | { type: 'renamed'; fileNameOld: string; fileNameNew: string }
    | { type: 'newfile'; fileName: string };

  const stagedFiles: Changes[] = [];
  const nochangesBI = output.indexOf('Changes to be committed');
  if (nochangesBI !== -1) {
    const nochangesEI = output.slice(nochangesBI).indexOf(`\n\n`) + nochangesBI;
    const staged = output.slice(nochangesBI, nochangesEI);
    for (
      const [_, t, v] of staged.matchAll(changesReg)
    ) {
      if (t === 'renamed') {
        const [fileNameOld, fileNameNew] = v.trim().split(' -> ');
        stagedFiles.push({
          type: 'renamed',
          fileNameNew,
          fileNameOld,
        });
      }
      const fileName = v.trim();
      if (t === 'modified') {
        stagedFiles.push({ type: 'modified', fileName });
      }
      if (t === 'deleted') {
        stagedFiles.push({ type: 'deleted', fileName });
      }
      if (t === 'new file') {
        stagedFiles.push({ type: 'newfile', fileName });
      }
    }
  }

  const notStagedFiles: Changes[] = [];
  const notStagedBI = output.indexOf(`Changes not staged for commit`);
  if (notStagedBI !== -1) {
    const notStagedEI = output.slice(notStagedBI).indexOf(`\n\n`) + notStagedBI;
    const notStaged = output.slice(notStagedBI, notStagedEI);
    for (
      const [_, t, v] of notStaged.matchAll(changesReg)
    ) {
      if (t === 'renamed') {
        notStagedFiles.push({
          type: 'renamed',
          fileNameNew: v.trim(),
          fileNameOld: v.trim(),
        });
      }
      const fileName = v.trim();
      if (t === 'modified') {
        notStagedFiles.push({ type: 'modified', fileName });
      }
      if (t === 'deleted') {
        notStagedFiles.push({ type: 'deleted', fileName });
      }
    }
  }

  const untrackedBI = output.indexOf(`Untracked files`);
  if (untrackedBI !== -1) {
    const untrackedEI = output.slice(untrackedBI).indexOf(`\n\n`) + untrackedBI;
    const untracked = output.slice(untrackedBI, untrackedEI);
    const iter = untracked.matchAll(/(.+)/g);
    iter.next();
    iter.next();
    for (const [_, v] of iter) {
      notStagedFiles.push({ type: 'newfile', fileName: v.trim() });
    }
  }

  // TODO: 判断是否存在 commits 没有 push
  // TODO: 判断远端是否存在 commits 需要 pull
  // `Changes to be committed` 存在需要 commit 的数据
  // `Changes not staged for commit` 存在未暂存的数据
  // Untracked files
  return { stagedFiles, notStagedFiles };
}
