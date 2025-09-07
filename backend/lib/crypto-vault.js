const crypto = require('crypto');
const KEYHEX = process.env.VAULT_KEY_32 || ''; // expect 64 hex chars -> 32 bytes
const KEY = Buffer.from(KEYHEX, 'hex');
const ALGO = 'aes-256-gcm';

function ensureKey() {
  if (!KEYHEX || KEY.length !== 32) {
    throw new Error('VAULT_KEY_32 must be set to 64 hex chars (32 bytes)');
  }
}

function encryptJson(obj){
  ensureKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const plaintext = JSON.stringify(obj);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // store iv + tag + ct as base64 string (safe for bytea/text)
  return Buffer.concat([iv, tag, ct]).toString('base64');
}

function decryptBlob(b64){
  ensureKey();
  const buf = Buffer.from(b64, 'base64');
  const iv = buf.slice(0,12);
  const tag = buf.slice(12,28);
  const ct = buf.slice(28);
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ct), decipher.final()]);
  return JSON.parse(dec.toString('utf8'));
}

module.exports = { encryptJson, decryptBlob };
