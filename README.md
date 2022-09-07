# deno-fn / somefn

<a href="https://deno.land/x/somefn"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fsomefn%2Fmod.ts" alt="somefn latest /x/ version" /></a>

some functions for deno

通用 JS 功能 (浏览器环境兼容):

- hash
  - SHA1
  - SHA256
  - SHA512
- HMAC
  - SHA256
  - SHA512
- Uint8Array to hex string tools

依赖 Deno 运行时的功能:

- `gitChanges` 查看 Git 变动.

说明:

- csv2array 使用 Deno 标准库
  <https://github.com/denoland/deno_std/blob/0.144.0/encoding/csv.ts>
