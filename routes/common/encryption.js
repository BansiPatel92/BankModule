var method = encryption.prototype;
var crypto = require('crypto');

function encryption() {}

method.encryptMD5 = function (data,fn) {
    fn(crypto.createHash('md5').update(data).digest("hex"));
}

module.exports = encryption;