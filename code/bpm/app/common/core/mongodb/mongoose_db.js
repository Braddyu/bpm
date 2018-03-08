/**
 * Created by ShiHukui on 2016/2/22.
 */

var mongooses = require('mongoose');
 var config   = require('../../../../config');
// var logger = require('../common/logger');
//慧眼数据地址

mongooses.Promise=Promise;
var $mongooses = null;
exports.inits = function() {
    if($mongooses == null) {
        $mongooses= mongooses.createConnection(config.hy_mongdb.url,
            {
                server: {poolSize: config.hy_mongdb.poolsize}/*,
                user: config.mongdb.user,
                pass: config.mongdb.pass*/
            },
            function (err) {
                if (err) {
                    //logger.error('connect to %s error: ', config.mongodb_url, err.message);
                    console.log('connect to %s error: ',  err.message);
                    process.exit(1);
                }
            });
        var db1 = mongooses.connection;
        db1.on('error', function () {
            // console.error.bind(console, 'connection error:');
            console.log('慧眼db error ', ' is connected')
        });
        db1.once('open', function () {
            // we're connected!
            console.log('慧眼db ', ' is connected')
        });
    }
    return $mongooses;
}