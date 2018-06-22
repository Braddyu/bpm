/**
 * 第一步：调用ftp工具连接远程ftp服务器
 * 第二步：获取指定目录的指定格式的文件列表
 * 第三步：读取文件内容（放入本地）
 * 第四步：关闭ftp连接
 */
var path = require('path');
var fs = require('fs');
var Client = require('ftp');
var urlencode = require('urlencode');

/**
 *
 * @param connectionProperties ftp配置数据
 * @param callback 回调函数
 * 读取ftp服务器相关文件，并保存到本地public/files 下，并返回下载文件的路径
 */
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
                    console.log("目录为空！");
                    c.end();
                }else{
                    list.forEach(function (element, index, array) {
                        var fileName=element.name;
                        if(fileName.startsWith(connectionProperties.start)&&fileName.endsWith(connectionProperties.end)){
                            console.log(fileName);
                            c.get(connectionProperties.basePath+fileName,function(err,stream) {
                                if (err){
                                    console.log(err);
                                    flag++;
                                    //做文件导入失败处理...
                                    exports.renameFileOnFail1(connectionProperties,fileName,exports.errType.FTP_ERROR);
                                    c.end();
                                } else{
                                    try{
                                        stream.once("close",function(){
                                            //获取存储在本地的数据并封装成可执行的sql返回
                                            callback(fileName,connectionProperties);
                                            flag++;
                                            if(flag==list.length){
                                                console.log("执行end ftp链接！");
                                                c.end();
                                            }
                                        });
                                        //此处目标路径目录配置为项目目录开始
                                        var writable = fs.createWriteStream(connectionProperties.temDir+fileName,connectionProperties.charset);
                                        stream.pipe(writable);
                                    }catch(e){
                                        flag++;
                                        exports.renameFileOnFail1(connectionProperties,fileName,exports.errType.FTP_ERROR);
                                    }
                                }
                            });
                        }else{
                            flag++;
                            if(flag==list.length){
                                console.log("执行end ftp链接！");
                                c.end();
                            }
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

//导入成功后对文件进行重命名操作(移动文件到success目录)
exports.renameFileOnSuccess=function(connectionProperties, srcPath, targetPath){
    var c = new Client();
    var path1 = "/" + srcPath;
    var path2 = "/" + targetPath;

    var dir2 = path2.substring(0,path2.lastIndexOf("/"));
    c.mkdir(dir2);
    c.rename(path1, path2);
}

//导入文件失败后对文件进行重命名操作(移动文件到error目录)
exports.renameFileOnFail=function(connectionProperties, srcPath, targetPath){
    var c = new Client();
    var path1 = "/" + srcPath;
    var path2 = "/" + targetPath;
    var dir2 = path2.substring(0,path2.lastIndexOf("/"));
    Client.mkdir(dir2);
    client.rename(path1, path2);
}

var SUCCESSPATH="success/";
var ERRORPATH="error/";


//导入成功后对文件进行重命名操作(移动文件到success目录)
exports.renameFileOnSuccess1=function(connectionProperties,fileName){
    var c = new Client();
    //ftp链接已成功
    c.on("ready",function(){
        var oleFilePath=connectionProperties.basePath+fileName;
        var newFileDir=connectionProperties.basePath+SUCCESSPATH;
        var newFilePath=newFileDir+fileName;
        c.mkdir(newFileDir,function(err){
            if(err){
                console.log(err);
            }
            c.rename(oleFilePath,newFilePath,function(err){
                if(err){
                    console.log("文件移动失败"+err);
                    c.end();
                }else{
                    console.log("文件移动成功");
                    //如果文件名长度大于22 ，则截取前22个字符加上 .CHK 再讲修改后的文件移动到 success 目录里。
                    if(fileName.length>22){
                        newFileName=fileName.substring(0,22)+".CHK";
                        c.rename(connectionProperties.basePath+newFileName,newFileDir+newFileName,function(err){
                            if(err){
                                console.log("长文件转短文件失败！"+err);
                                c.end();
                            }else{
                                c.end();
                            }
                        });
                    }else{
                        c.end();
                    }
                }
            });
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
    //链接ftp
    c.connect(connectionProperties);
}

//导入文件失败后对文件进行重命名操作(移动文件到error目录)
exports.renameFileOnFail1=function(connectionProperties,fileName,errType){
    var c = new Client();
    //ftp链接已成功
    c.on("ready",function(){
        var oleFilePath=connectionProperties.basePath+fileName;
        var newFileDir=connectionProperties.basePath+ERRORPATH;
        var newFilePath=newFileDir+fileName+"."+errType;
        //创建目录
        c.mkdir(newFileDir,function(err){
            if(err){
                console.log(err);
            }
            c.rename(oleFilePath,newFilePath,function(err){
                if(err){
                    console.log("文件移动失败"+err);
                    c.end();
                }else{
                    console.log("文件移动成功");
                    //如果文件名长度大于22 ，则截取前22个字符加上 .CHK 再讲修改后的文件移动到 success 目录里。
                    if(fileName.length>22){
                        newFileName=fileName.substring(0,22)+".CHK";
                        c.rename(connectionProperties.basePath+newFileName,newFileDir+newFileName,function(err){
                            if(err){
                                console.log("长文件转短文件失败！"+err);
                                c.end();
                            }else{
                                c.end();
                            }
                        });
                    }else{
                        c.end();
                    }
                }
            });
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
    //链接ftp
    c.connect(connectionProperties);
}

exports.errType={
    FTP_ERROR:"FTP_ERROR",                          //ftp错误
    FILEREAD_ERROR:"FILEREAD_ERROR",               //读取文件错误
    DATAFILTER_ERROR:"DATAFILTER_ERROR",          //数据过滤错误
    FILEPARSE_ERROR:"FILEPARSE_ERROR",            //文件解析错误
    IMPORTDATA_ERROR:"IMPORTDATA_ERROR"           //写入数据错误
}