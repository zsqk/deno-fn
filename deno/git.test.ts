import { pullGitRepo } from './git.ts';

Deno.test('pullGitRepo', async () => {
  const res = await pullGitRepo('git@github.com:zsqk/deno-fn.git');
  console.log(res);
});
