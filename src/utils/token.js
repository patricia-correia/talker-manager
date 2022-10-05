const crypto = require('crypto');

const getToken = () => crypto.randomBytes(8).toString('hex');

module.exports = getToken;