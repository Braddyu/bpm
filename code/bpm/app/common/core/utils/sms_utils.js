/**
 * Created by zhaojing on 2016/9/28.
 */
var soap = require('soap');
var config = require('../../../../config');
var smsModel = require('../models/sms_model');

/**
 * 保存待发送短信(数组)
 */
exports.saveMessageByArray = function(paramsArray,cb){
    smsModel.$.create(paramsArray,function(err,docs){
        if(err){
            cb({'success':false, code: '1001', 'msg':'保存数据库出现异常'});
        }else{
            cb({'success':true, code: '0000', 'msg':'保存成功'});
        }
    });
}

/**
 * 保存待发送短信信息
 * @param params{}    短信信息
 * @param cb          回调函数
 */
exports.saveMessage = function(params,cb){
    if(!isEmptyObject(params)){
        if(!params.sms_phone){
            cb({'success':false, code: '1001', 'msg':'sms_phone不能为空'});
        }else{
            if(!params.sms_content){
                cb({'success':false, code: '1002', 'msg':'sms_content不能为空'});
            }else{
                if(!params.sms_type){
                    cb({'success':false, code: '1003', 'msg':'sms_type不能为空'});
                }else{
                    if(!params.sms_user_id){
                        cb({'success':false, code: '1004', 'msg':'sms_user_id不能为空'});
                    }else{
                        if(!params.sms_user_tag){
                            cb({'success':false, code: '1005', 'msg':'sms_user_tag不能为空'});
                        }else{
                            var smsEntity = {
                                sms_phone : params.sms_phone,
                                sms_content:params.sms_content,
                                sms_send_time:null,
                                sms_status:2,
                                sms_msg:'',
                                sms_type : params.sms_type,
                                sms_user_id : params.sms_user_id,
                                sms_user_tag : params.sms_user_tag,
                                sms_send_count : 0,
                                sms_create_time : new Date()
                            };
                            if(params.sms_client_ip){
                                smsEntity.sms_client_ip = params.sms_client_ip;
                                smsEntity.sms_client_name = params.sms_client_name;
                            }else{
                                smsEntity.sms_server_ip = getIPAdress();
                                smsEntity.sms_server_name = require('os').hostname();
                            }
                            smsModel.$(smsEntity).save(function(err){
                                if(err){
                                    cb({'success':false, code: '1006', 'msg':'保存数据库出现异常'});
                                }else{
                                    cb({'success':true, code: '0000', 'msg':'保存成功'});
                                }
                            });
                        }
                    }
                }
            }
        }
    }else{
        cb({'success':false, code: '1007', 'msg':'参数不能为空'});
    }
}

/**
 * 发送短信
 * @param phone        电话号码
 * @param msgcontent   短信内容
 * @param params{}     附加参数
 * @param callback     回调函数
 */
exports.sendMessage = function(phone,msgcontent,params,callback){
    var debug = config.sms.debug;
    if(debug){
        var url = config.sms.url;
        var xml = {xmlstring:'<?xml version="1.0" encoding="GBK"?>'
                + '<xml>'
                    + '<message>'
                        + '<OneRecord>'
                            + '<desttermid>'+ phone +'</desttermid>'                                  //电话号码
                            + '<username>'+config.sms.username+'</username>'                          //分配的用户名
                            + '<password>'+config.sms.password+'</password>'                          //分配的密码
                            + '<licence>'+config.sms.licence+'</licence>'                             //分配的序列号
                            + '<msgcontent><![CDATA['+ msgcontent +']]></msgcontent>'                 //短信正文
                            + '<systeminfo><![CDATA['+ config.sms.systeminfo +']]></systeminfo>'      //所属系统
                        + '</OneRecord>'
                    + '</message>'
                + '</xml>'};

        soap.createClient(url, function(err, client) {
            if(err){
                console.log("短信发送失败，因为："+err);
            }else{
                client.setEndpoint("http://10.195.175.117:8091/newSmsWebService/services/SMSService.SMSServiceHttpSoap11Endpoint/");

                client.SMSService.SMSServiceHttpSoap11Endpoint.SmsSendMQ(xml,function(error, result, raw, soapHeader){
                    var rs = parseInt(result.return);
                    var sms;
                    switch (rs)
                    {
                        case 0:
                            sms = {'success':true, 'msg':"短信发送成功"};
                            break;
                        case 1:
                            sms = {'success':false, 'msg':"短信发送发送失败，因为：用户名未找到"};
                            break;
                        case 2:
                            sms = {'success':false, 'msg':"短信发送发送失败，因为：密码不匹配"};
                            break;
                        case 3:
                            sms = {'success':false, 'msg':"短信发送发送失败，因为：xml解析出错"};
                            break;
                        case 4:
                            sms = {'success':false, 'msg':"短信发送发送失败，因为：短信超量"};
                            break;
                        case 5:
                            sms = {'success':false, 'msg':"短信发送发送失败，因为：licence过期"};
                            break;
                        case 6:
                            sms = {'success':false, 'msg':"短信发送发送失败，因为：licence不正确"};
                            break;
                        case 7:
                            sms = {'success':false, 'msg':"短信发送发送失败，因为：xml参数缺失"};
                            break;
                        case 10:
                            sms = {'success':false, 'msg':"短信发送发送失败，因为：调用异常"};
                            break;
                        default:
                            sms = {'success':false, 'msg':"未知错误："+rs};
                            break;
                    }
                    var smsEntity = {
                        sms_send_time:new Date(),
                        sms_status:sms.success?1:0,
                        sms_msg:sms.msg,
                        sms_send_count:params.sms_send_count+1
                    }
                    smsModel.$.update({_id:params.id},{$set:smsEntity},{},function(err){
                        if(err){
                            callback({'success':false, 'msg':"更新数据库出现异常"});
                        }else{
                            callback(sms);
                        }
                    });
                });
            }
        });
    }else{
        var smsEntity = {
            sms_send_time:new Date(),
            sms_status:1,
            sms_msg:'测试短信发送成功',
            sms_send_count:params.sms_send_count+1
        }
        smsModel.$.update({_id:params.id},{$set:smsEntity},{},function(err){
            if(err){
                callback({'success':false, 'msg':"更新数据库出现异常"});
            }else{
                callback({'success':true, 'msg':"测试短信发送成功"});
            }
        });
    }
}

function getIPAdress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}

/**
 * 判断对象是否为空
 * @param o
 * @returns {boolean}
 */
function isEmptyObject(o) {
    for (var i in o)
        return false;
    return true;
}