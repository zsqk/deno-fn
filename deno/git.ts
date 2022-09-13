import { getRunData } from '../mod.ts';

/**
 * 拉取 Git 仓库最新内容
 *
 * 需要 git 支持.
 */
export async function pullGitRepo(repo: string, opt: {
  /** SSH 密钥文件地址 */
  keyPath?: string;
  /** 指定特定分支 */
  branch?: string;
  /** clone 深度. 默认 1. */
  depth?: string;
  /** 存放 Git 仓库文件的目录. 默认创建临时目录. */
  dirPath?: string;
  /** 是否要跳过 SSH HOST 检查 (仅在特殊情况下使用) */
  skipHostKeyCheck?: boolean;
} = {}) {
  // 根据需求创建临时目录
  const tempPath = opt.dirPath ?? Deno.makeTempDirSync();
  Deno.chdir(tempPath);

  let branchParam: Array<string> = [];
  if (opt.branch) {
    branchParam = ['-b', opt.branch];
  }

  let sshParam: Array<string> = [];
  const sshCommand: string[] = [];
  if (opt.keyPath) {
    sshCommand.push(`-i ${opt.keyPath}`);
  }
  if (opt.skipHostKeyCheck) {
    sshCommand.push(`-o UserKnownHostsFile=/dev/null`);
    sshCommand.push(`-o StrictHostKeyChecking=no`);
  }
  if (sshCommand.length) {
    sshParam = ['-c', `core.sshCommand=ssh ${sshCommand.join(' ')}`];
  }
  const depthParam: Array<string> = ['--depth', opt.depth ?? '1'];
  const command: Array<string> = [
    'git',
    'clone',
    ...sshParam,
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
 * [参考文档](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
 * @param repoPath repo 在本地的 path
 */
export async function gitChanges(repoPath: string) {
  const output = await getRunData(['git', 'status', '--short'], repoPath);

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
