import { pullGitRepo } from './git.ts';

Deno.test('pullGitRepo', async () => {
  const res = await pullGitRepo('https://github.com/zsqk/deno-fn.git');
  console.log(res);
});
