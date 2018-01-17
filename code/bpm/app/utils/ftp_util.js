var Client = require('ftp');
var c = new Client();
var fs = require('fs');


/**
 * 连接ftp
 * @param server 连接ftp服务器配置,如
 * {
    host: '192.168.9.66',
    port: 21,
    user: 'test',
    password: '123456'
}
 */
exports.connect=function(server){
    c.connect(server);
}
/**
 * 关闭连接
 */
exports.end=function(){
    c.end();

}
/**
 *

 * @param path 本地文件，如foo.txt
 * @param zcomp 服务器文件，如foo_copy.txt
 * @param cb 回调函数
 */
exports.uploadFile=function(path,zcomp,cb){

    c.put(path, zcomp, function(err) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:path+'上传至'+zcomp+'成功'});
        }

    });
}

/**
 * 下载单个文件
 * @param server
 * @param path
 * @param zcomp
 * @param cb
 */

exports.downloadFile=function(path,zcomp,cb){

    c.get(zcomp, function(err, stream) {
        if (err){
            cb(err);
        }else{
            stream.once('close', function() { c.end(); });
            stream.pipe(fs.createWriteStream(path));
            cb(null,{success:true,data:zcomp+'下载至'+path+'成功'});
        }

    });
}


/**
 * 下载文件夹下的文件
 * @param server
 * @param path
 * @param zcomp
 * @param cb
 */
exports.downloadFileList=function(path,zcomp,cb){

    c.list(function(err, list) {
        if (err){
            cb(err);
        }else{
            if(list.length>0){
                for(let item=0;item<list.length;item++){
                    //只下载文件
                    if(list[item].type=='-'){
                        c.get(list[item].name, function(err, stream) {
                            if (err){
                                cb(err);
                            }else{
                                stream.once('close', function() { c.end(); });
                                stream.pipe(fs.createWriteStream(path+"/"+list[item].name));
                                if(item == list.length-1){
                                    cb(null,{success:true,data:zcomp+' 下载至 '+path+' 成功'});
                                }
                            }
                        });
                    }
                }
            }

        }

    });

}


/**
 * 获取文件列表
 * @param server
 * @param cb
 */
exports.list=function(cb){

    c.list(function(err, list) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:list})
        }

    });
}


/**
 * 创建目录
 * @param server
 * @param path 创建目录
 * @param cb
 */
exports.mkdirs=function(path,cb){

    var paths=path.split("/");
    let mkpath="";
    for(let item=0;item < paths.length; item++){
            if(paths[item]){
                mkpath+="/"+paths[item];
                let p=mkpath;
                 c.cwd(p, function(err) {
                    if (err){
                        c.mkdir(p, function(err) {
                            if (err){
                                cb(err);
                            }else{
                                if(item == paths.length-1){
                                    cb(null,{success:true,data:'创建目录:'+path+'成功'});
                                }
                            }
                        });
                    }else{
                        if(item == paths.length-1){
                            cb(null,{success:true,data:'创建目录:'+path+'成功'});
                        }
                    }

                });
            }
        }

}

/**
 * 删除文件夹
 * @param server
 * @param path
 * @param cb
 */
exports.rmdir=function(path,cb){

    c.rmdir(path, function(err) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:'删除文件夹:'+path+'成功'});
        }
    });
}


/**
 *  打印工作目录，返回主机的当前目录
 * @param server
 * @param cb
 */
exports.pwd=function(cb){
    c.pwd( function(err,res) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:res});
        }
});
}

/**
 * 删除文件
 * @param server
 * @param path
 * @param cb
 */
exports.del=function(path,cb){

    c.delete(path, function(err) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:'删除文件:'+path+'成功'});
        }

    });
}

/**
 * 判断文件夹是否存在
 * @param server
 * @param path
 * @param cb
 */
exports.cwd=function(path,cb){

    c.cwd(path, function(err) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:path+'存在'});
        }

    });
}










