import { assert, assertEquals } from '@std/assert';

import { gitChanges, pullGitRepo } from './git.ts';

// git clone https://github.com/zsqk/deno-fn.git --depth 1
// Cloning into 'deno-fn'...
// remote: Enumerating objects: 57, done.
// remote: Counting objects: 100% (57/57), done.
// remote: Compressing objects: 100% (52/52), done.
// remote: Total 57 (delta 0), reused 36 (delta 0), pack-reused 0
// Receiving objects: 100% (57/57), 31.94 KiB | 281.00 KiB/s, done.
Deno.test('pullGitRepo-o1', async () => {
  const dir = Deno.makeTempDirSync();
  const c = new Deno.Command('git', {
    args: ['clone', 'https://github.com/zsqk/deno-fn.git', '--depth', '1'],
    cwd: dir,
  });
  const o = await c.output();
  const stdout = new TextDecoder().decode(o.stdout);
  const stderr = new TextDecoder().decode(o.stderr);
  assert(o.success);
  console.log({ stdout, stderr, dir });
  assert((stdout + stderr).includes('Cloning into'));
  // assert(stdout.includes('Cloning into'));
  // assert(stdout.includes('remote: Enumerating objects'));
  // assert(stdout.includes('remote: Counting objects'));
  // assert(stdout.includes('remote: Compressing objects'));
  // assert(stdout.includes('remote: Total'));
});

Deno.test('pullGitRepo-https', async () => {
  const res = await pullGitRepo('https://github.com/zsqk/deno-fn.git');
  console.log(res);
});

Deno.test('pullGitRepo-ssh', async () => {
  const keyString = Deno.env.get('TEST_SSH_KEY') ?? '';
  if (keyString.length < 1) {
    throw new Error('缺乏有效 SSH KEY, 无法进一步测试');
  }
  const res = await pullGitRepo(
    'git@github.com:zsqk/deno-fn.git',
    { skipHostKeyCheck: true, keyString },
  );
  console.log(res);
});

Deno.test('gitChanges-newfile', async () => {
  const path = await pullGitRepo('https://github.com/zsqk/deno-fn.git');
  console.log(path);

  Deno.writeTextFileSync(path + '/deno-fn/test.txt', '');
  const res1 = await gitChanges(path + '/deno-fn');
  assertEquals(res1, {
    stagedFiles: [],
    notStagedFiles: [{ type: 'newfile', fileName: 'test.txt' }],
  });

  const p2 = new Deno.Command('git', {
    args: ['add', '.'],
    cwd: path + '/deno-fn',
  });
  await p2.output();

  const res2 = await gitChanges(path + '/deno-fn');
  assertEquals(res2, {
    stagedFiles: [{ type: 'newfile', fileName: 'test.txt' }],
    notStagedFiles: [],
  });
});

Deno.test('gitChanges-modified', async () => {
  const path = await pullGitRepo('https://github.com/zsqk/deno-fn.git');
  console.log(path);

  Deno.writeTextFileSync(path + '/deno-fn/README.md', '');
  const res1 = await gitChanges(path + '/deno-fn');
  assertEquals(res1, {
    stagedFiles: [],
    notStagedFiles: [{ type: 'modified', fileName: 'README.md' }],
  });

  const p2 = new Deno.Command('git', {
    args: ['add', '.'],
    cwd: path + '/deno-fn',
  });
  await p2.output();

  const res2 = await gitChanges(path + '/deno-fn');
  assertEquals(res2, {
    stagedFiles: [{ type: 'modified', fileName: 'README.md' }],
    notStagedFiles: [],
  });
});

Deno.test('gitChanges-rename', async () => {
  const path = await pullGitRepo('https://github.com/zsqk/deno-fn.git');
  console.log('path', path);

  Deno.rename(path + '/deno-fn/README.md', path + '/deno-fn/README1.md');
  const res1 = await gitChanges(path + '/deno-fn');
  assertEquals(res1, {
    stagedFiles: [],
    notStagedFiles: [
      { type: 'deleted', fileName: 'README.md' },
      { type: 'newfile', fileName: 'README1.md' },
    ],
  });

  const p2 = new Deno.Command('git', {
    args: ['add', '.'],
    cwd: path + '/deno-fn',
  });
  await p2.output();

  const res2 = await gitChanges(path + '/deno-fn');
  assertEquals(res2, {
    stagedFiles: [{
      type: 'renamed',
      fileNameOld: 'README.md',
      fileNameNew: 'README1.md',
    }],
    notStagedFiles: [],
  });
});

Deno.test('gitChanges-delete', async () => {
  const path = await pullGitRepo('https://github.com/zsqk/deno-fn.git');
  console.log(path);

  Deno.removeSync(path + '/deno-fn/README.md');
  const res1 = await gitChanges(path + '/deno-fn');
  assertEquals(res1, {
    stagedFiles: [],
    notStagedFiles: [{ type: 'deleted', fileName: 'README.md' }],
  });

  const p2 = new Deno.Command('git', {
    args: ['add', '.'],
    cwd: path + '/deno-fn',
  });
  await p2.output();

  const res2 = await gitChanges(path + '/deno-fn');
  assertEquals(res2, {
    stagedFiles: [{ type: 'deleted', fileName: 'README.md' }],
    notStagedFiles: [],
  });
});

// TODO: add test
// Deno.test('genGitPush', async () => {
//   await genGitPush({
//     repoName: '',
//     repoURI: '',
//     sshPrivateKey: '',
//   });
// });
