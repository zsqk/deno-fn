import { onlyRun } from './run.ts';

/**
 * [deno] 生成一个 SSH 密钥 (Ed25519)
 */
export async function genKey({ email = 'test@ssh.org' } = {}): Promise<{
  keyPath: string;
  pubPath: string;
}> {
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
