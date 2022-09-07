import { assertEquals } from 'https://deno.land/std@0.154.0/testing/asserts.ts';
import { gitChanges, pullGitRepo } from './git.ts';

Deno.test('pullGitRepo', async () => {
  const res = await pullGitRepo('https://github.com/zsqk/deno-fn.git');
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

  const p2 = Deno.run({ cmd: ['git', 'add', '.'], cwd: path + '/deno-fn' });
  await p2.status();
  p2.close();

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

  const p2 = Deno.run({ cmd: ['git', 'add', '.'], cwd: path + '/deno-fn' });
  await p2.status();
  p2.close();

  const res2 = await gitChanges(path + '/deno-fn');
  assertEquals(res2, {
    stagedFiles: [{ type: 'modified', fileName: 'README.md' }],
    notStagedFiles: [],
  });
});
