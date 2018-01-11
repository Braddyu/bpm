var Client = require('ftp');
var c = new Client();
var fs = require('fs');
/**
 *
 * @param server 连接ftp服务器配置,如
 * {
    host: '192.168.9.66',
    port: 21,
    user: 'test',
    password: '123456'
}
 * @param path 本地文件，如foo.txt
 * @param zcomp 服务器文件，如foo_copy.txt
 * @param cb 回调函数
 */
function uploadFile(server,path,zcomp,cb){
    c.connect(options);
    c.put(path, zcomp, function(err) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:path+'上传至'+zcomp+'成功'});
        }
        c.end();
    });
}

/**
 * 下载文件
 * @param server
 * @param path
 * @param zcomp
 * @param cb
 */

function downloadFile(server,path,zcomp,cb){
    c.connect(options);
    c.get(zcomp, function(err, stream) {
        if (err){
            cb(err);
        }else{
            stream.once('close', function() { c.end(); });
            stream.pipe(fs.createWriteStream(path));
            cb(null,{success:true,data:zcomp+'下载至'+path+'成功'});
        }
        c.end();
    });
}

/**
 * 获取文件列表
 * @param server
 * @param cb
 */
function list(server,cb){
    c.connect(options);
    c.list(function(err, list) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:list})
        }
        c.end();
    });
}


/**
 * 创建目录
 * @param server
 * @param path 创建目录
 * @param cb
 */
function mkdir(server,path,cb){
    c.connect(options);
    c.mkdir(path, function(err) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:'创建目录:'+path+'成功'});
        }
        c.end();
    });
}

/**
 * 删除文件夹
 * @param server
 * @param path
 * @param cb
 */
function rmdir(server,path,cb){
    c.connect(options);
    c.rmdir(path, function(err) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:'删除文件夹:'+path+'成功'});
        }
        c.end();
    });
}


/**
 *  打印工作目录，返回主机的当前目录
 * @param server
 * @param cb
 */
function pwd(server,cb){
    c.connect(options);
    c.pwd( function(err,res) {
        if (err){
            cb(err);
        }else{
            cb(null,{success:true,data:res});
        }
        c.end();
    });
}



