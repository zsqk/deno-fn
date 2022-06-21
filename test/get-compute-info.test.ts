import { getComputeInfo } from "../mod.ts";

// cat /etc/os-release demo
// PRETTY_NAME="Debian GNU/Linux 9 (stretch)"
// NAME="Debian GNU/Linux"
// VERSION_ID="9"
// VERSION="9 (stretch)"
// ID=debian
// HOME_URL="https://www.debian.org/"
// SUPPORT_URL="https://www.debian.org/support"
// BUG_REPORT_URL="https://bugs.debian.org/"

Deno.test('getComputeInfo', async () => {
    const res = await getComputeInfo(true);
    console.log('res', res)
})