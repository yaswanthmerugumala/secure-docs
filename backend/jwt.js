const crypto = require('crypto');

// Generate a random secret key for JWT (e.g., 256-bit secret)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('JWT Secret:', jwtSecret);
