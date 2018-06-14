/**
 * @author: xiangyong
 * @datetime: 2018-05-30 09:12
 * @Description:
 **/

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../../config');
var encryptutil = require('./encrypt_util');
var useModel = require('../project/bpm_resource/models/user_model');


// 开启一个 SMTP 连接池
let transport = nodemailer.createTransport(smtpTransport({
    host: config.email.host, // 主机
    secure: true, // 使用 SSL
    secureConnection: true, // 使用 SSL
    port: config.email.port, // SMTP 端口
    auth: {
        user: config.email.user,
        pass: encryptutil.decipher('rc4','abc',config.email.password)
    }
}));

/**
 * @param {String} recipient 收件人--发件人可以是多个以逗号隔开的邮箱地址数组
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
exports.sendMail = function (recipient, subject, html) {
    return  new Promise(async function(resolve,reject){
        try{
            if(recipient && recipient.length > 0){
                transport.sendMail({
                    from: config.email.user,
                    to: recipient,
                    subject: subject,
                    html: html

                }, function (error, response) {
                    var status = 'success';
                    var succ = true;
                    var msg = '发送邮件成功';
                    if (error) {
                        console.log(error);
                        status = 'fail-'+error;
                        succ = false;
                        msg = '发送邮件异常';
                    }else{
                        console.log('邮件发送成功');
                    }
                    saveEmailLog(config.email.user,recipient, subject, html,status);
                    resolve({'success':succ,'msg':msg});
                    transport.close(); // 如果没用，关闭连接池

                });
            }else{
                saveEmailLog(config.email.user,recipient, subject, html,'fail-目标地址不存在');
                resolve({'success':false,'msg':'目标地址不存在。'});
            }


        }catch (e){
            console.log(e);
            saveEmailLog(config.email.user,recipient, subject, html,'fail-'+e);
            resolve({'success':false,'msg':'发送邮件异常'});
        }
    });

};

//保存邮件发送日志
async function saveEmailLog(fromuser,recipient, subject, html,status){
    var logs = {};
    logs.from = fromuser;
    logs.recipient = recipient;
    logs.subject = subject;
    logs.context = html;
    logs.send_status = status;
    logs.send_date = new Date();
    console.log('插入邮件发送日志开始。。。');
    await useModel.$CommonEmailLogSchema.create(logs);
}