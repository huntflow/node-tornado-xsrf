# XSRF token library compatible with tornado

Basically reimplemented for node.js algorithm from tornado. Allows to interop between tornado and node.js services.


## API

XSRF tokens in tornado cosist of 4 parts separated by pipe symbol `|`: version (this lib supports only version 2), bit mask, token itself (masked by, well, a mask) and timestamp: `$version|$mask|$token|$timestamp`, for example `2|c6f1fb92|756729199a209536ffcfab54893adf63|1686129179`.

- `decodeToken(tokenStr: string): [number, Buffer, number]` parses string token into parts: version, token and timestamp
- `makeToken(existingToken?: string): string` creates or updates token. If existingToken is passed it will be updated with the new mask
- `compareTokens(token1: string, token2: string): boolean` — parses and compares tokens
