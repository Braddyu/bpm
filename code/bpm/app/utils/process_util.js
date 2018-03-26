var config = require('../../config');
var moment = require('moment');
var http=require('http');

/**
 *
 * @param mobile 电话
 * @param params json对象数据中的key必须与config.js中tmplet_key中变量一致:
 * {
 * "procName":"预警工单",
 * "orderNo":"100000000001"
 * }
 * @param tmplet_key 模板编码，必须在config.js定义
 */
exports.sendSMS=function(mobile,params,tmplet_key){
    return  new Promise(function(resolve,reject){
        try{
            let isOpen = config.OPEN_SMS_ALL;
            let open=false;
            if(tmplet_key){

                //是否开启短信服务
                var OPEN_SMS=config.OPEN_SMS;
                //验证码登录
                var OPEN_LOGIN_SMS=config.OPEN_LOGIN_SMS
                //抄送
                var GRID_COPY_SMS=config.GRID_COPY_SMS

                //是否开通短信登录
                if(tmplet_key == 'VALIDATION' && OPEN_LOGIN_SMS){
                    open = true;
                }else if(tmplet_key == 'VALIDATION'){
                    reject("短信服务未开启");
                    return;
                }

                //是否开通工单派发接收短信
                if(tmplet_key == 'SMS_TEMPLET_ORDER' && OPEN_SMS){
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
            }

            if(isOpen && open){
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

// var moment = require('moment');
// var postData={
//     'jobId':'GDBH2018123387571',//工单系统订单编号
//     'orderId':'85916388675304',//BOSS订单ID即客户单号
//     'orderCode':'85920171227122448B01434015',//BOSS订单编码
//     'suggestion':'审核成功',//补录意见
//     'crmTradeDate':'20171227'//推送的日期（黄河推送给工单系统原数据的日期）
// }

// var options={
//         // hostname:'135.10.38.80',
//         // port:9090,
//         path:'/ewfs/client/ewf4store/repair.do',
//         method:'POST',
//         headers:{
//         'Content-Type':'text/plan; charset=UTF-8'
//     }
// }
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

