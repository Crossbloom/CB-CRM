require('dotenv').config();
const { encryptJson, decryptBlob } = require('./crypto-vault');

try {
  const sample = { user: "alice", secret: "SAMPLE_SECRET" };
  const enc = encryptJson(sample);
  const dec = decryptBlob(enc);
  if (dec.user === sample.user && dec.secret === sample.secret) {
    console.log('crypto-roundtrip: OK');
  } else {
    console.log('crypto-roundtrip: MISMATCH');
  }
} catch (err) {
  console.error('crypto-test-error:', err.message);
  process.exit(2);
}
