/*

RPC lib

wuqingfa@139。com

REF：
http://www.squaremobius.net/amqp.node/channel_api.html#connect


*/
var events = require('./events/');
var amqp = require('amqplib');
var request = require('amqplib-rpc').request;
var Promise = require('bluebird');

var hostname = require('os').hostname();
var host_ip = getIPAdress();

var rpc_msg_regx = /(\"([^,^\"]+)\":\"([^:^\"]+)\")|(\"([^,^\"]+)\":([\\d]+))/;
var min_task = 30;

function rpc(opt) {
    if (!opt) opt = {};

    this.__url = opt.url ? opt.url : 'amqp://guest:guest@localhost:5672';
    this.__callTimeout = opt.callTimeout ? opt.callTimeout : 2000;
    this.__debug = opt.debug ? opt.debug : false;

    //开发调试模式，在开发调试模式，将在队列名称上增加主机IP，作为队列名称
    this.__dev = opt.dev ? opt.dev : true;

    //连接参数
    this.__socketOptions = opt.socketOptions ? opt.socketOptions :
        {
            noDelay:false,
            timeout: 2000,
            keepAlive:true,
            keepAliveDelay:1,
            reconnect:true
        };

    this.__sentOption = {expiration:this.__callTimeout};
    this.__consumeOpts = {noAck: true,expiration:this.__callTimeout} ;
    this.__queueOpts =  {noAck: false,exclusive: true} ;

    //请求超时（业务操作请求的过期，过期后服务端将不做处理）
    this.__bizCallTimeout = opt.bizCallTimeout ? opt.bizCallTimeout : 10000;

    //RPC服务端处理通道数量，建议通道数30-70
    this._num_channel = opt.num_channel ? opt.num_channel : 30;
    //RPC 服务连接检测间隔(ms)
    this.__keepaliveTIme = opt.keepaliveTIme ? opt.keepaliveTIme : 2000;

}


//获取本机IP地址
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


//获取RPC连接
rpc.prototype._getConnection = function()  {

    var self = this;
    self.rpc_status = true ;
    return new Promise(function(resolve,reject) {

        if (self.__conn) {

            resolve(self.__conn);
            done();

        } else {
            self.__conn = null;
        }

        var $this = self;


        amqp.connect($this.__url, self.__socketOptions)
            .then(function (connection) {

                $this.rpc_status = true ;

                connection.on('error',function (err) {

                    console.log('rpc connect error');
                    if(connection){

                        connection.close();
                        connection = null ;

                        $this.__conn = null;
                    }
                    $this.rpc_status = false ;


                });
                connection.on('close',function (err) {
                    console.log('rpc connect close');
                    if(connection){
                        connection.close();
                        connection = null ;

                        $this.__conn = null;
                    }
                    $this.rpc_status = false ;

                });

                $this.__conn = connection;
                resolve($this.__conn);
            })
            .catch(function (err) {
                reject(err);
            });
    });

}

// RPC 服务器等回调处理（promise）
function reg_service_cb (msg,cb){

    return new Promise(function(resolve,reject) {


        if(!(cb instanceof Function)) {
            var resp = {success:false,msg:"error cb is not func",code:1001};

            reject(resp);
        }
        else{


            var json = rpc_msg_regx.test(msg.content.toString()) ? JSON.parse(msg.content.toString()) : msg.content.toString();

            var req_info =json.rpc_req_info ? json.rpc_req_info : {} ;

            if (req_info.req_time && req_info.req_timeout) {

                //time out 过期的消息，忽略
                var curDate = new Date();
                if (curDate.getTime() - req_info.req_time > req_info.req_timeout) {

                    //返回结果
                    var result = {success: false, message: 'rpc ignore', code: '300'};
                    result.resp_time = curDate.getTime();
                    result.host = hostname;
                    reject(result);

                    done();
                }

            }


            cb(json)
                .then(function(resp){
                    resolve(resp);

                })
                .catch(function (err) {

                    var resp = {success:false,msg:err,code:1001};
                    reject(resp);
                })
        }


    });
}

//ack msg
function reg_ack (ch,msg,response,duration) {

    var resp = {} ;
    resp.body = response ;
    resp.rpc_resp_info = { server : hostname ,
        duration:duration,
        correlationId:msg.properties.correlationId
    } ;
    //
    //response.rpc_resp_info = { server : hostname ,
    //    duration:duration,
    //    correlationId:msg.properties.correlationId
    //} ;

    var responseString = JSON.stringify(resp);
    ch.sendToQueue(msg.properties.replyTo,
        new Buffer(responseString.toString()),
        {correlationId: msg.properties.correlationId});
    ch.ack(msg);


}
//启动Channel，并注册RPC服务(promise方式)
function reg_service_invoke (conn,queueName,chNum,cb) {

    var numChannel = chNum ? chNum : 1;


    for(var iChannel=0;iChannel<numChannel;iChannel++){

        conn.createChannel()
            .then(function(ch) {

                var q = queueName;
                var ok = ch.assertQueue(q, {durable: false});
                var ok = ok.then(function() {
                    ch.prefetch(1);
                    return ch.consume(q, reply);
                });


                return ok.then(function() {

                    console.log('RPC Service ['+queueName+'] Ready.');

                });

                function reply(msg) {


                    var currDate = new Date().getTime();
                    reg_service_cb(msg,cb)
                        .then(function(resp){

                            var serverduration =  (new Date().getTime()) - currDate ;
                            reg_ack(ch,msg,resp,serverduration);

                        })
                        .catch(function(err){

                            var serverduration =  (new Date().getTime()) - currDate ;
                            reg_ack(ch,msg,err,serverduration);

                        });

                }
            })
            .catch(function (err) {
                console.log('RPC servce reg error,create channel error:'+err);
            });

    }
}
//RPC 服务注册入口(promise)
rpc.prototype.reg = function(queue, cb,taskNum) {

    var num_channel = taskNum ?taskNum :min_task ;

    if(num_channel < min_task) num_channel = min_task ;


    if(!(cb instanceof Function)) {
        console.log('reg cb is not callback func');
        cb= function () {
            console.log('warn rpc service callback not define');
        }
    }

    var queueName = this.__dev ? queue + '@' + host_ip : queue;
    
    self = this ;


    self.reg_start(queueName,num_channel,cb);

    //RPC连接的状态检测，如果连接错误，将尝试重新连接RCP，并注册服务
    setInterval(function () {

        if(self.rpc_status == false){

            console.log('start reconnect');
            self.reg_start(queueName,self._num_channel,cb);

        }
    },self.__keepaliveTIme);

}


//RPC服务注册处理模块
rpc.prototype.reg_start = function(queueName,num_channel,cb) {

    self = this ;
    self._getConnection()
        .then(function(conn) {


            reg_service_invoke(conn,queueName, num_channel,cb);

        })
        .catch(function (err) {

            console.log(err);



        });

}


//RPC 调用处理函数
rpc.prototype.call_invoke = function(connection,queueName, req) {

    return new Promise(function(resolve, reject) {

         var callDate = new Date().getTime();
         request(connection, queueName, req, {timeout: self.__callTimeout,sendOpts:self.__sentOption,consumeOpts:self.__consumeOpts,queueOpts:self.__queueOpts})
            .then(function (replyMessage) {

                var resp = JSON.parse(replyMessage.content) ;


                resp.rpc_call_duration =  (new Date()).getTime() - callDate ;

                resolve(resp); 

            })
            .catch(function (err) {
                
                reject(err);

            })
            .finally(function() {
               
            });

    });
        

}


function setClientInfo(req,timeout){

    var reqTimeout = timeout  ? timeout : 30000 ;

    var curDate = new Date();
    req.rpc_req_info = {
        host : hostname,
        host_ip : host_ip,
        req_time : curDate.getTime(),
        req_timeout : reqTimeout
    }

}
//RPC 服务调用入口(Promise方式调用)
rpc.prototype.invoke = function(queue, body) {

    self = this;
    return new Promise(function(resolve, reject) {

        self._getConnection()
            .then(function (conn) {
            
               var queueName = self.__dev ? queue + '@' + host_ip : queue;

               var req  = {};

               req.body =body ;

               setClientInfo(req,self.__bizCallTimeout);

               return self.call_invoke(conn,queueName,req);

            })
             .then(function (resp) {
                resolve(resp);
             })
            .catch(function (err) {
                //console.log('create:'+err);
                events.emit('rpc:error','err');
                console.log(err);
                reject(err);

            });
        });
}



//RPC 服务调用入口（callback方式调用）
rpc.prototype.call = function(queue, body,cb) {

    if(!(cb instanceof Function)) {
        console.log('call cb is not callback func');
        cb= function (err,resp) {

            console.log(resp);

        }
    }

    self = this;

    self._getConnection()
        .then(function (conn) {

            var queueName = self.__dev ? queue + '@' + host_ip : queue;

            var req  = {};

            req.body =body ;

            setClientInfo(req,self.__bizCallTimeout);
            return self.call_invoke(conn,queueName,req);

        })
        .then(function (resp) {
           // resolve(resp);
            cb(null,resp);
        })
        .catch(function (err) {

            cb(err);

        });

}

//RPC 初始化
module.exports.factory = function (opt) {

    //if(!this.rpc_inst )
    //    this.rpc_inst =new rpc(opt);
    //return this.rpc_inst;

    return new rpc(opt);
}


//RPC 初始化
module.exports.factoryClient = function (opt) {

    //if(!this.rpc_inst )
    //    this.rpc_inst =new rpc(opt);
    //return this.rpc_inst;

    return new rpc(opt);
}


