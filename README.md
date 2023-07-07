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
  [hexString()](https://deno.land/x/somefn@v0.26.0/js/hash.ts?s=hexString)
- 文本加 BOM, 用于 Windows 老款软件
  [textWithBOM()](https://deno.land/x/somefn@v0.26.0/js/str.ts?s=textWithBOM)
- 随机字符串 (基于 crypto)
  [genRandomString()](https://deno.land/x/somefn@v0.26.0/js/str.ts?s=genRandomString)
- [为数据进行 RSA 签名](https://deno.land/x/somefn@v0.26.0/js/hash.ts?s=rasSign)

依赖 Deno 运行时的功能:

- `gitChanges` 查看 Git 变动.

说明:

- CSV 使用 Deno 标准库 <https://deno.land/std@0.193.0/csv/mod.ts>
- XML 建议使用 `npm:fast-xml-parser`
