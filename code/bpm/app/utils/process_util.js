var config = require('../../config');
var moment = require('moment');
var http=require('http');
var model = require('../project/bpm_resource/models/process_model');
/**
 *
 * @param mobile 电话
 * @param params json对象数据中的key必须与config.js中tmplet_key中变量一致:
 * {
 * "procName":"预警工单",
 * "orderNo":"100000000001"
 * }
 * @param tmplet_key 模板编码，必须在config.js定义
 * @param proc_code 允许发送短信的流程
 */
exports.sendSMS=function(mobile,params,tmplet_key){
    return  new Promise(function(resolve,reject){
        try{
            console.log("mobile",mobile,"params",params,"tmplet_key",tmplet_key);
            let open=false;
            if(tmplet_key){

                //是否开启工单派发短信通知服务
                var OPEN_ORDER_SMS=config.OPEN_ORDER_SMS;
                //验证码登录
                var OPEN_LOGIN_SMS=config.OPEN_LOGIN_SMS
                //抄送
                var GRID_COPY_SMS=config.GRID_COPY_SMS
                //差错工单系统自动派单
                var MISTAKE_DISTRIBUTE_TASK_SMS = config.MISTAKE_DISTRIBUTE_TASK_SMS;

                var MONEY_AUDIT_SMS = config.MONEY_AUDIT_SMS;

                //是否开通短信登录
                if(tmplet_key == 'VALIDATION' && OPEN_LOGIN_SMS){
                    open = true;
                }else if(tmplet_key == 'VALIDATION'){
                    reject("短信服务未开启");
                    return;
                }
                //是否开通工单派发接收短信
                if(tmplet_key == 'SMS_TEMPLET_ORDER' && OPEN_ORDER_SMS){
                    open = true;
                }else if(tmplet_key == 'SMS_TEMPLET_ORDER'){
                    reject("短信服务未开启");
                    return;
                }

                //是否开通工单抄送接收短信
                if(tmplet_key == 'GRID_COPY' && GRID_COPY_SMS){
                    open = true;
                }else if(tmplet_key == 'GRID_COPY'){
                    reject("短信服务未开启");
                    return;
                }

                //差错工单派单定时任务短信提醒
                if(tmplet_key == 'MISTAKE_DISTRIBUTE_TASK' && MISTAKE_DISTRIBUTE_TASK_SMS){
                    open = true;
                }else if(tmplet_key == 'MISTAKE_DISTRIBUTE_TASK'){
                    reject("短信服务未开启");
                    return;
                }
                //资金稽核定时任务短信提醒
                if(tmplet_key == 'SMS_TEMPLET_MONEY_AUDIT_ORDER' && MONEY_AUDIT_SMS){
                    open = true;
                }else if(tmplet_key == 'GRID_COPY'){
                    reject("短信服务未开启");
                    return;
                }
            }

            if( open){
                //获取请求内容
                var postContent=config.SMS.postContent;
                var SMS_TEMPLET;
                //短信模板
                if(tmplet_key){
                    SMS_TEMPLET=config[tmplet_key];
                    if(SMS_TEMPLET){
                        for(let key in params){
                            SMS_TEMPLET=SMS_TEMPLET.replace(key,params[key]);
                        }
                    }else{
                        reject("短信模板不存在");
                        return;
                    }

                }
                console.log("开始发送",SMS_TEMPLET);
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
             /* var req=http.request(options, function(res) {
                    console.log('Status:',res.statusCode);
                    console.log('headers:',JSON.stringify(res.headers));
                    res.setEncoding('utf-8');
                    res.on('data',function(chun){
                        console.log('body分隔线---------------------------------\r\n');
                        console.info(chun);
                        let sms={
                            sms_content:SMS_TEMPLET,
                            sms_phone:mobile,
                            sms_create_time:new Date()
                        }
                        model.$CommonSmsInfo(sms).save();
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
                req.end();*/
            }else{
                reject("短信服务未开启");
            }

        }catch (e){
            console.log(e);
            reject("发送短信错误");
        }
    })
}

/**
 * post请求
 * @param postContent 请求数据
 * @param options 请求地址：如
 * {
        hostname:'135.10.38.80',
        port:9090,
        path:'/ewfs/client/ewf4store/repair.do',
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }
 * @returns {Promise}
 */
exports.httpPost=function(postContent,options){
    return  new Promise(function(resolve,reject){
        try{
                console.log("postContent",JSON.stringify(postContent));
                console.log("options",JSON.stringify(options));
                //返回结果
                var result={};
                //发送请求
                var req=http.request(options, function(res) {
                    console.log('Status:',res.statusCode);
                    console.log('headers:',JSON.stringify(res.headers));
                    res.setEncoding('utf-8');
                    let result="";
                    res.on('data',function(chun){
                        console.log('body分隔线---------------------------------\r\n');
                        console.info(chun);
                        result+=chun;

                    });
                    res.on('end',function(){
                        resolve(result);
                        console.log('No more data in response.********');
                    });
                });

                req.on('error',function(err){
                    console.error(err);
                    reject(err);

                });
                console.log(new Buffer(JSON.stringify(postContent)).toString('base64'));
                req.write(new Buffer(JSON.stringify(postContent)).toString('base64'));
                req.end();


        }catch (e){
            console.log(e);
            reject("post请求错误");
        }
    })

};


/**
 * 调用雅典娜接口
 * @param proc_inst_id
 * @param warn_date
 * @param options
 * @returns {Promise}
 */
exports.httpPostChannel=function(proc_inst_id,warn_date,options){
    return  new Promise(function(resolve,reject){
        try{
            let postContent='<?xml version="1.0"?>' +
                '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
                ' xmlns:sam="http://controller.webServiceTo4A.channel2.gz.cmcc/"  ' +
                'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
                'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
                '<soap:Header/>' +
                '<soap:Body>' +
                '<sam:warnFile><' +
                'proc_inst_id>'+proc_inst_id+'</proc_inst_id>' +
                '<warn_date>'+warn_date+'</warn_date><' +
                '/sam:warnFile>' +
                '</soap:Body>' +
                '</soap:Envelope>';

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
                resolve(err);

            });
            req.write(postContent);
            req.end();


        }catch (e){
            console.log(e);
            reject("post请求错误");
        }
    })

};
var postData={
    jobId: 'GDBH201848221525',
    orderId: '85514055864734',
    orderCode: '85520180502082448B55405628',
    crmTradeDate: '20180502',
    suggestion:'补录'
}

var options={
    hostname:'135.10.20.51',
    port:8080,
    path:'/ewfs/client/ewf4store/repaper.do',
    method:'POST',
    headers:{
        'Content-Type':'text/plan; charset=UTF-8'
    }
}
/*this.httpPost(postData,options).then(function (rs) {
    console.log(rs);
    //{"ret_code":"0","ret_msg":"工单复核归档成功"}
})*/
// var moment = require('moment');
// var postData={
//     'jobId':'GDBH2018123387571',//工单系统订单编号
//     'orderId':'85916388675304',//BOSS订单ID即客户单号
//     'orderCode':'85920171227122448B01434015',//BOSS订单编码
//     'suggestion':'审核成功',//补录意见
//     'crmTradeDate':'20171227'//推送的日期（黄河推送给工单系统原数据的日期）
// }
/*var postData={ jobId: 'GDBH201848355375',
    orderId: '85213957521259',
    orderCode: '85220180401202350B29078450',
    suggestion: '通过',
    crmTradeDate: '20180401' }

var options={
        hostname:'135.10.38.80',
        port:9090,
        path:'/ewfs/client/ewf4store/repair.do',
        method:'POST',
        headers:{
        'Content-Type':'text/plan; charset=UTF-8'
    }
}



this.httpPost(postData,options).then(function (rs) {
console.log(rs);
})*/
// var base=new Buffer(JSON.stringify(postData)).toString('base64');

// var en=new Buffer(base, 'base64').toString();;
//
// var options={
//      hostname:'localhost',
//      port:8080,
//     path:'/channel2/services/DataSync',
//     method:'POST',
//     headers:{
//         'Content-Type': 'application/soap+xml; charset=utf-8'
//     }
// }
//
//
// this.httpPostChannel('1','2',options).then(function(res){
//     console.log("成功",res);
// }).catch(function(res){
//     console.log("失败",res);
// })

