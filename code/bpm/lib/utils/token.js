/**
 * Created by do1-35 on 2016/9/27.
 */
// sign with default (HMAC SHA256)
var fs = require("fs-extra");
var jsonWebToken = require('jsonwebtoken');
var path = require('path');
var app_utils = require('./app_utils');
var config = require('../../../config');
module.exports = {
    getEncodeToken2:function (strObj){
        //var md5 = require("../utils/md5");

        var token = jsonWebToken.sign({ foo: strObj }, 'token');

        //backdate a jsonWebToken 30 seconds
        //var older_token = jsonWebToken.sign({ foo: 'user_id,org_id', iat: Math.floor(Date.now() / 1000) - 30 }, 'token');

        var older_token = jsonWebToken.sign({ foo: strObj, iat: Math.floor(Date.now() / 1000) - 30 }, 'token');

        // console.log('pem_path:'+path.join(__dirname , 'token_public.pem'));

        // sign with RSA SHA256
        //var cert = fs.readFileSync(path.join('app/common/utils','token.pem'));  // get private key

        var cert = fs.readFileSync(path.join(__dirname,'token.pem'));  // get private key

        //var token = jsonWebToken.sign({ foo: 'user_id,org_id' }, cert, { algorithm: 'RS256'});

        var token = jsonWebToken.sign({ foo: strObj }, cert, { algorithm: 'RS256'});

        // sign asynchronously
        //jsonWebToken.sign({ foo: 'user_id,org_id' }, cert, { algorithm: 'RS256' }, function(err, token) {

        jsonWebToken.sign({ foo: strObj }, cert, { algorithm: 'RS256' }, function(err, token) {
            //console.log(token);
        });
        return token;
    },

    /*解析token方法*/
    resolveToken2:function(tokenJson){
        var token = tokenJson.split("#")[0];

        var resultDecoded;
        // console.warn('token:',token);
        try{
            var decoded =jsonWebToken.decode(token,path.join(__dirname,'token_public.pem'));
            // console.info(decoded.iat);
            if(decoded.iat <= Date.now()){
                //判断token的时效
                resultDecoded = decoded;
            }
            resultDecoded = decoded;
        }catch(err){
            console.error('tokenError:', err.message)
            resultDecoded = '解析token串失败';
        }finally {
            return resultDecoded;
        }
    },
    getEncodeToken:function (strObj){
        var token = {foo:strObj,sn:app_utils.getUUID()};

        return app_utils.encryptDataByDes4V4(config.app.v4.token_secret_key, config.app.v4.token_secret_iv, JSON.stringify(token));
    },
    resolveToken:function(tokenJson){
        if(tokenJson) {
            tokenJson = tokenJson.split('#')[0];
            var token = app_utils.decryptDataByDes4V4(config.app.v4.token_secret_key, config.app.v4.token_secret_iv, tokenJson);
            return JSON.parse(token);
        }
        else {
            return null;
        }
    }
}
/*var token = module.exports.getEncodeToken('sjdkfsjkfjskdjks');
console.log(token);
console.log(module.exports.resolveToken(token));*/

