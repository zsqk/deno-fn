# somefn [![npm version](https://img.shields.io/npm/v/@zsqk/somefn.svg?style=flat)](https://www.npmjs.com/package/@zsqk/somefn) ![node version](https://img.shields.io/node/v/@zsqk/somefn.svg?style=flat)

some functions for browser

通用 JS 功能 (浏览器环境兼容):

- hash
  - SHA1
  - SHA256
  - SHA512
- HMAC
  - SHA256
  - SHA512
- Uint8Array to hex string tools

## dev

publish:

```sh
npm run tsc && cp package*.json build && cp README.md build
npm publish ./build --access public
```
