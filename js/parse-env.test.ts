import { assertEquals } from 'https://deno.land/std@0.144.0/testing/asserts.ts';
import { parseEnv } from './parse-env.ts';

const testContent = `PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
NAME="Debian GNU/Linux"
VERSION_ID="9"
VERSION="9 (stretch)"
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
`;

Deno.test('parseEnv', () => {
  const res = parseEnv(testContent);
  assertEquals(res.get('PRETTY_NAME'), 'Debian GNU/Linux 9 (stretch)');
  assertEquals(res.get('ID'), 'debian');
  assertEquals(res.size, 8);
});
