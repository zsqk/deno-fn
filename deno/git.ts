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
    cmd: ['git', 'status', '--short'],
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

  type Changes =
    | { type: 'modified'; fileName: string }
    | { type: 'deleted'; fileName: string }
    | { type: 'renamed'; fileNameOld: string; fileNameNew: string }
    | { type: 'newfile'; fileName: string };

  const stagedFiles: Changes[] = [];
  const notStagedFiles: Changes[] = [];
  for (const change of output.split('\n')) {
    const type = change.slice(0, 2);
    const fileName = change.slice(3);
    if (type === '??') {
      notStagedFiles.push({ type: 'newfile', fileName });
      continue;
    }
    if (type === '!!') {
      continue;
    }
    switch (type[0]) {
      case 'A':
        stagedFiles.push({ type: 'newfile', fileName });
        break;

      case 'M':
        stagedFiles.push({ type: 'modified', fileName });
        break;

      case 'D':
        stagedFiles.push({ type: 'deleted', fileName });
        break;

      case 'R': {
        const [fileNameOld, fileNameNew] = fileName.trim().split(' -> ');
        stagedFiles.push({
          type: 'renamed',
          fileNameNew,
          fileNameOld,
        });
        break;
      }

      default:
        // TODO: C, U
        break;
    }

    switch (type[1]) {
      case 'M':
        notStagedFiles.push({ type: 'modified', fileName });
        break;

      case 'D':
        notStagedFiles.push({ type: 'deleted', fileName });
        break;

      default:
        // TODO: A, R, C, U
        break;
    }
  }

  return { stagedFiles, notStagedFiles };
}
