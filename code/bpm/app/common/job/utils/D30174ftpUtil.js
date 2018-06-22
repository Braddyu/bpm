/**
 * 第一步：调用ftp工具连接远程ftp服务器
 * 第二步：获取指定目录的指定格式的文件列表
 * 第三步：读取文件内容（放入本地）
 * 第四步：关闭ftp连接
 */
var path = require('path');
var fs = require('fs');
var Client = require('ftp');
var config = require('../../../../config');
exports.readFtpFileData=function(connectionProperties,callback){
    var c = new Client();
    c.on('ready', function () {
        console.log('ftp 连接成功！');
        c.list(connectionProperties.basePath,function (err, list) {
            if (err){
                console.log("ftp获取文件列表失败！"+err);
            } else{
                var flag=0;
                if(!list||list.length==0){
                    console.log("=====目录为空！！！！！=====");
                    c.end();
                }else {
                    list.forEach(function (element, index, array) {
                        var fileName=element.name;
                        if(fileName.startsWith(connectionProperties.start)&&fileName.endsWith(connectionProperties.end)){
                            console.log(fileName);
                            c.get(connectionProperties.basePath+fileName,function(err,stream) {
                                if (err){
                                    console.log(err);
                                } else{
                                    stream.once("close",function(){
                                        //获取存储在本地的数据并封装成可执行的sql返回
                                        callback(connectionProperties.temDir+fileName,connectionProperties,connectionProperties.basePath,fileName);
                                        flag++;
                                        if(flag==list.length){
                                            console.log("执行end ftp链接！");
                                            c.end();
                                        }
                                    });
                                    //此处目标路径目录配置为项目目录开始
                                    var writable = fs.createWriteStream(connectionProperties.temDir+fileName,connectionProperties.charset);
                                    stream.pipe(writable);
                                }
                            });
                        }else{
                            flag++;
                        }
                    });
                }

            }
        });
    });
    c.on('error',function(err){
        console.log("ftp链接失败！"+err);
    });
    c.on('close',function(err){
        console.log("ftp链接关闭！"+err);
    });
    c.on('end',function(err){
        console.log("ftp链接结束！"+err);
    });
    c.connect(connectionProperties);
};

exports.rename=function ( srcPath, targetPath,fileName,connectionProperties){
    var c = new Client();
    c.on('ready', function () {
        var path1 =  srcPath;
        if(fileName.length> 22){
             newfileName = fileName.substring(0,22) + ".CHK";
            var path2 = targetPath+newfileName;
        }else{
            var path2 = targetPath+fileName;
        }
        var dir2 = path2.substring(0,path2.lastIndexOf("/"));
        //c.mkdir(dir2);
        c.rename(path1, path2,function(result){
            c.end();
        });
    });
    c.connect(connectionProperties);
}