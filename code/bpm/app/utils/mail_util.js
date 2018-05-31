/**
 * @author: xiangyong
 * @datetime: 2018-05-30 09:12
 * @Description:
 **/

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../../config');


// 开启一个 SMTP 连接池
let transport = nodemailer.createTransport(smtpTransport({
    host: config.email.host, // 主机
    secure: true, // 使用 SSL
    secureConnection: true, // 使用 SSL
    port: config.email.port, // SMTP 端口
    auth: {
        user: config.email.user,
        pass: config.email.password
    }
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
exports.sendMail = function (recipient, subject, html) {
    return  new Promise(async function(resolve,reject){
        try{
            if(recipient){
                transport.sendMail({

                    from: config.email.user,
                    to: recipient,
                    subject: subject,
                    html: html

                }, function (error, response) {
                    if (error) {
                        console.log(error);
                        resolve({'success':false,'msg':'发送邮件异常'});
                    }else{
                        console.log('邮件发送成功');
                        resolve({'success':true,'msg':'发送邮件成功'});
                    }

                    transport.close(); // 如果没用，关闭连接池

                });
            }else{
                resolve({'success':false,'msg':'目标地址不存在。'});
            }


        }catch (e){
            console.log(e);
            resolve({'success':false,'msg':'发送邮件异常'});
        }
    });

}