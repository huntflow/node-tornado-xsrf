const crypto = require('crypto');

/**
 * @type {(data: Buffer, mask: Buffer) => Buffer}
 */
function maksData(data, mask) {
  const result = Buffer.from(data);
  for (let i = 0; i < data.length; i++) {
    result[i] ^= mask[i % mask.length] || 0;
  }

  return result;
}

/**
 * @type {(tokenStr: string) => [number, Buffer, number]}
 */
function decodeToken(tokenStr) {
  const parts = tokenStr.split('|');

  if (!parts[1] || !parts[2]) {
    throw new Error('Malformed token');
  }

  const token = maksData(Buffer.from(parts[2], 'hex'), Buffer.from(parts[1], 'hex'));
  const timestamp = Number(parts[3]);

  return [2, token, timestamp];
}

/**
 * @type {(fromCookie?: string) => [number, Buffer, number]}
 */
function getRawToken(fromCookie = '') {
  let version = 2;
  let token = crypto.randomBytes(16);
  let timestamp = Math.round(Date.now() / 1000);

  if (fromCookie) {
    [version, token, timestamp] = decodeToken(fromCookie);
  }

  return [version, token, timestamp];
}

/**
 * @type {(fromCookie?: string) => string}
 */
function makeToken(fromCookie = undefined) {
  const [version, token, timestamp] = getRawToken(fromCookie);
  const mask = crypto.randomBytes(4);
  return [version, mask.toString('hex'), maksData(token, mask).toString('hex'), timestamp].join(
    '|'
  );
}

/**
 * @type {(t1: string, t2: string) => boolean}
 */
function compareTokens(t1, t2) {
  const [, t1Buf] = decodeToken(t1);
  const [, t2Buf] = decodeToken(t2);

  return t1Buf.equals(t2Buf);
}


exports.decodeToken = decodeToken;
exports.makeToken = makeToken;
exports.compareTokens = compareTokens;