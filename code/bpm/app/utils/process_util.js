var config = require('../../config');
var moment = require('../../node_modules/moment');
var http=require('http');

/**
 *
 * @param mobile 电话
 * @param params 格式:
 * {
 * "procName":"预警工单",
 * "orderNo":"100000000001"
 * }
 */
exports.sendSMS=function(mobile,params){
    return  new Promise(function(resolve,reject){
        try{
            //是否开启短信服务
            var isOpen=config.OPEN_SMS;
            if(isOpen){
                //获取请求内容
                var postContent=config.SMS.postContent;
                //短信模板
                var SMS_TEMPLET=config.SMS_TEMPLET;
                SMS_TEMPLET=SMS_TEMPLET.replace('proc',params.procName).replace('order',params.orderNo);
                console.log(SMS_TEMPLET);
                //加上时间戳
                postContent.PubInfo.TransactionTime=moment().format('YYYYMMDDHHmmss');
                //短信发送号码
                postContent.Request.BusiParams.DestNum=mobile;
                postContent.Request.BusiParams.Content=SMS_TEMPLET;
                console.log(JSON.stringify(postContent));
                var options={
                    hostname:'135.10.51.8',
                    port:41500,
                    path:'/CRMService',
                    method:'POST',
                    headers:{
                        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
                        'Content-Length':Buffer.byteLength(JSON.stringify(postContent))
                    }
                }
                //返回结果
                var result={};
                //发送请求
                var req=http.request(options, function(res) {
                    console.log('Status:',res.statusCode);
                    console.log('headers:',JSON.stringify(res.headers));
                    res.setEncoding('utf-8');
                    res.on('data',function(chun){
                        console.log('body分隔线---------------------------------\r\n');
                        console.info(chun);
                        resolve(chun);
                    });
                    res.on('end',function(){
                        console.log('No more data in response.********');
                    });
                });

                req.on('error',function(err){
                    console.error(err);
                    reject(err);

                });
                req.write(JSON.stringify(postContent));
                req.end();
            }else{
                reject("短信服务未开启");
            }

        }catch (e){
            console.log(e);
            reject(e);
        }
    })



};