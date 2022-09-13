import { onlyRun } from './run.ts';

export async function genKey({ email = 'test@ssh.org' } = {}) {
  const path = Deno.makeTempDirSync();
  const c = [
    'ssh-keygen',
    '-t',
    'ed25519',
    '-C',
    email,
    '-f',
    `${path}/key`,
    `-q`,
    `-N`,
    '',
  ];
  await onlyRun(c);
  return { keyPath: `${path}/key`, pubPath: `${path}/key.pub` };
}
