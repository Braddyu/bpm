/**
 * http请求工具类
 */
var http = require('http');
var needle = require('needle');
module.exports = {
    /**
     * post 方式请求外部url
     * @param url
     * @param reqparams
     * @param cb
     */
    requestByNeedlePOST:function(url,reqparams,cb){
        var s = new Date();
        needle.request('post',url, reqparams,{json:true}, function(err, resp, body) {
            if(err) {
                console.log(err);
                var cost_time = (new Date()-s);
                cb({"success":false,"code":500,"msg":"请求出现异常","cost_time":cost_time,"err":err.message});
            }
            else {
                var cost_time = (new Date()-s);
                cb({"success":true,"code":200,"msg":"请求成功","cost_time":cost_time,data:body});
                console.log('耗时：'+cost_time);
            }
        });
    },

    /**
     * 获取本机ip地址
     * @returns {*}
     */
    getIPAdress:function(){
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
};
