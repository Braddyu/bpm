/**
 * @author: xiangyong
 * @datetime: 2018-06-01 18:28
 * @Description: 加解密工具类
 **/

var crypto = require('crypto');

/**
 * 加密
 * @param algorithm   --加密类型，部分类型：'blowfish','aes-256-cbc','cast','des','des3','idea','rc2','rc4','seed'
 * @param key --加密关键字
 * @param buf  --要加密的内容
 * @returns {string}
 */
exports.cipher = function(algorithm, key, buf) {
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, key);
    encrypted += cip.update(buf, 'binary', 'hex');
    encrypted += cip.final('hex');
    return encrypted
};

/**
 * 解密
 * @param algorithm --解密类型 与加密类型一致
 * @param key --解密关键字 与加密关键字一致
 * @param encrypted -- 加密的内容
 * @returns {string}
 */
exports.decipher = function(algorithm, key, encrypted) {
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(encrypted, 'hex', 'binary');
    decrypted += decipher.final('binary');
    return decrypted
};

// function cipher1(algorithm, key, buf) {
//     var encrypted = "";
//     var cip = crypto.createCipher(algorithm, key);
//     encrypted += cip.update(buf, 'binary', 'hex');
//     encrypted += cip.final('hex');
//     return encrypted
// };
//
// function decipher1(algorithm, key, encrypted) {
//     var decrypted = "";
//     var decipher = crypto.createDecipher(algorithm, key);
//     decrypted += decipher.update(encrypted, 'hex', 'binary');
//     decrypted += decipher.final('binary');
//     return decrypted
// };

// console.log(cipher1('rc4','abc','zgydgzfgs2018'));
// console.log(decipher1('rc4','abc','518390a457fee48d069c6523ab'));