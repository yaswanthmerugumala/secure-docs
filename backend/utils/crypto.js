const crypto = require('crypto');

const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes = 64 hex chars

const encryptDocument = (plainText) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(plainText, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
};

const decryptDocument = (encryptedHex, ivHex) => {
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

// 🔐 NEW: Deterministic hash for keyword lookup
const hashKeyword = (keyword) => {
  return crypto.createHash('sha256').update(keyword).digest('hex');
};

module.exports = {
  encryptDocument,
  decryptDocument,
  hashKeyword // ← don’t forget to export this
};
