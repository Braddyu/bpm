var Promise = require('bluebird');
var cacheManager = require('cache-manager');

const key_profix = 'cm_' ;


function cache_util(opt) {
    if (!opt) opt = {};

    this.__cache_type = opt.cache_type ? opt.cache_type : 'mem';
    this.__cache_url = opt.cache_url ? opt.cache_url : '';

}

module.exports.factory = function (opt) {

    if(!this.cache_util_inst ){


        this.cache_util_inst =new cache_util(opt);

        if(this.__cache_type  === 'memcached' ){
            var memcachedStore = require('cache-manager-memcached-store')

            this.cache_util_inst.memoryCache = cacheManager.caching({
                store: memcachedStore,
                // http://memcache-plus.com/initialization.html - see options
                options: {
                    hosts: [this.__cache_url]
                }
            })

        }

        else{

            this.cache_util_inst.memoryCache = cacheManager.caching({store: 'memory',promiseDependency:Promise});

        }

    }
    return this.cache_util_inst;

}


cache_util.prototype.getVal = function(id, cb) {

    this.memoryCache.get(key_profix+id, function (err, result) {
        if (err) { return cb(err); }

        if (result) {
            return cb(null, result);
        }


    });

}

cache_util.prototype.setVal = function(id, val ,ttl) {

    this.memoryCache.set(key_profix+id, val, {ttl: ttl}, function(err) {

        if (err) { throw err; }


    });

}


const prefix_proc = 'p_' ;
cache_util.prototype.getProcess = function(id,cb) {

    this.getVal(prefix_proc+id,function(err,v){

        if(err){
            cb(err);
        }
        else
            cb(null,v);

    });

}

cache_util.prototype.setProcess = function(id,v,cb) {

    this.setVal(prefix_proc+id, v,function(err){
        console.log(err);
    })

}





const prefix_proc_define = 'p_d_' ;
cache_util.prototype.getProcessDefine = function(id,cb) {

    this.getVal(prefix_proc_define+id,function(err,v){

        if(err){
            cb(err);
        }
        else
            cb(null,v);

    });

}
cache_util.prototype.setProcessDefine = function(id,v,cb) {

    this.setVal(prefix_proc_define+id, v,function(err){
        console.log(err);
    })

}





const prefix_proc_step = 'p_s_' ;
cache_util.prototype.getProcessDefineStep = function(id,cb) {

    this.getVal(prefix_proc_step+id,function(err,v){

        if(err){
            cb(err);
        }
        else
            cb(null,v);

    });

}


cache_util.prototype.setProcessDefineStep = function(id,v,cb) {

    this.setVal(prefix_proc_step+id, v,function(err){
        console.log(err);
    })

}





