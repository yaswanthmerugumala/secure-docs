const crypto = require('crypto');

// Generate a random 32-byte AES key
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('Generated AES Key:', encryptionKey);
