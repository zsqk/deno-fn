# deno-fn / somefn

<a href="https://deno.land/x/somefn"><img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fsomefn%2Fmod.ts" alt="somefn latest /x/ version" /></a>

some functions for deno

**This project is still under development, and the parameters of the functions**
**are subject to change.**

Generic JS Functions (Browser Environment Compatible):

- hash
  - SHA1
  - SHA256
  - SHA512
- HMAC
  - SHA256
  - SHA512
- Uint8Array to hex string tools
  [hexString()](https://deno.land/x/somefn@v0.26.0/js/hash.ts?s=hexString)
- Text append BOM, for older Windows software
  [textWithBOM()](https://deno.land/x/somefn@v0.26.0/js/str.ts?s=textWithBOM)
- Generate random string (based on Web API `crypto`)
  [genRandomString()](https://deno.land/x/somefn@v0.26.0/js/str.ts?s=genRandomString)
- [RSA signing of data](https://deno.land/x/somefn@v0.26.0/js/hash.ts?s=rasSign)

Functions that depend on the Deno runtime:

- `gitChanges` View Git changes.

Other features:

- CSV using the Deno standard library <https://deno.land/std@0.193.0/csv/mod.ts>
- XML recommends using `npm:fast-xml-parser`
- Uint8Array to HEX string <https://deno.land/std@0.217.0/encoding/hex.ts>
