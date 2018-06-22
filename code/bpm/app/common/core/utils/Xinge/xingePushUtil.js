/**Create By fuweilian  2016-10-23*/
var Xinge = require('./Xinge');
var accessId  = 2100240116;//推送目标应用id
var secretKey = 'bef3964175a5f1bf9511a9dc69d386c4';//推送密钥
var XingeApp = new Xinge.XingeApp(accessId, secretKey);

module.exports ={
    /**
     * 推送消息给单个设备
     * @param {string}   deviceToken           设备token
     * @param {Message}  message               推送的消息
     * @param {int}      environment           向iOS设备推送时必填，1表示推送生产环境；2表示推送开发环境。Android可不填。
     * @param {Function} ca(err, result) 回调函数
     */
    pushToSingDevice:function(deviceToken, message, environment){
        XingeApp.pushToSingleDevice(deviceToken, message, environment, function(err, result){
            console.log(result);
        });
    },
    /**
     * 推送消息给单个账户或别名
     * @param {string}   account               账户或别名
     * @param {Message}  message               推送的消息
     * @param {int}      environment           向iOS设备推送时必填，1表示推送生产环境；2表示推送开发环境。Android可不填
     * @param {Function} callback(err, result) 回调函数
     */
    pushToSingleAccount:function(account, message, environment, cb){
        XingeApp.pushToSingleAccount('account', androidMessage, function(err, result){
            cb(err,result);
        });
    },
    /**
     * 推送消息给批量账号
     * @param {array}    accounts    账号数组
     * @param {Message}  message     推送的消息
     * @param {int}      environment 向iOS设备推送时必填，1表示推送生产环境；2表示推送开发环境。Android可不填
     * @param {Function} callback    回调函数
     */
    pushByAccounts:function(accounts, message, environment,cb){
        XingeApp.pushByAccounts(accounts, message, environment, function(err, result){
           cb(err,result);
        });
    },
    /**
     * 推送消息到所有设备
     * @param {Message}  message               推送的消息
     * @param {int}      environment           向iOS设备推送时必填，1表示推送生产环境；2表示推送开发环境。Android可不填
     * @param {Function} callback(err, result) 回调函数
     */
    pushToAllDevices:function(message, environment,cb){
        XingeApp.pushToAllDevices(message, environment, function(err, result){
            console.log(result);
        });
    },
    /**
     * 根据指定的tag推送消息
     * @param {array}    tags                  指定推送目标的tag列表，每个tag是一个string
     * @param {string}   tagOperation          多个tag的运算关系，取值为AND或OR
     * @param {Message}  message               推送的消息
     * @param {int}      environment           向iOS设备推送时必填，1表示推送生产环境；2表示推送开发环境。Android可不填
     * @param {Function} callback(err, result) 回调函数
     */
    pushByTags:function(tags, tagOperation, message, environment,cb){
        XingeApp.pushByTags(tags, tagOperation, message, environment, function(err, result){
            cb(err,result);
        });
    }
};