const crypto = require('crypto');

// Generate a secure random JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('='.repeat(50));
console.log('JWT SECRET KEY GENERATED:');
console.log('='.repeat(50));
console.log(jwtSecret);
console.log('='.repeat(50));
console.log('Copy this key and paste it in your .env file as:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('='.repeat(50));