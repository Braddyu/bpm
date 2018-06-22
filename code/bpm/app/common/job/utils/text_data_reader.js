/**
 * 数据读取工具类
 */
var readline = require('readline');
var fs = require('fs');
var iconv=require('iconv-lite');
//ftp读取文件列表并保持到本地工具
var ftpUtil = require('../utils/ftpUtil');
// exports.readForNamNum=function(fReadName,connectionProperties,callBack){
//     var fRead = fs.createReadStream(fReadName);
//     fRead.setEncoding(connectionProperties.charset)
//     var objReadline = readline.createInterface({ input: fRead});
//     var readList=[];
//     objReadline.on('line',(line)=>{
//         var lineTem=line.split(connectionProperties.split);
//         readList.push(lineTem);
//     });
//     objReadline.on("close",function(){
//         callBack(readList,connectionProperties);
//         objReadline.close();
//     });
// };

/**
 *
 * @param fReadName 文件名
 * @param connectionProperties ftp配置数据
 * @param callBack 回调函数
 * 读取本地指定文件的内容，并构造原始数据集合（一行是一个数据项），作为数据过滤的原始数据。
 */
exports.readForNamNum=function(fReadName,connectionProperties,callBack){
    var charset="gbk";
    var readList=[];
    fs.readFile(connectionProperties.temDir+fReadName,function(err,buffer) {
        if (err) {
            console.log(err);
            ftpUtil.renameFileOnFail1(connectionProperties, fReadName, ftpUtil.errType.FILEREAD_ERROR);
        } else {
            if (buffer.toString().indexOf("�") == -1) {
                charset = "utf-8";
            }
            var data = iconv.decode(buffer, charset);
            var sourceList = data.split("\n");
            sourceList.forEach(function (lineData, index, array) {
                if (lineData) {
                    //替换字符串中的 \r
                    lineData = lineData.replace("\r", "");
                    var lineDataList = lineData.split(connectionProperties.split);
                    if (lineDataList && lineDataList.length > 0) {
                        readList.push(lineDataList);
                    }
                }
            });
            callBack(readList, connectionProperties);
        }
    });
}
