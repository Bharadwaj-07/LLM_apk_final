const crypto = require('crypto');

const randomData = crypto.randomBytes(256).toString('base64');
console.log(randomData);
