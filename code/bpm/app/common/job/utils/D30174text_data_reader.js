/**
 * 数据读取工具类
 */

var fs = require('fs');
var readline = require('readline');
var iconv = require('iconv-lite');
exports.read=function(fReadName,charset,callBack){
    var fRead = fs.createReadStream(fReadName);
    var readList=[];
    //fRead.setEncoding("utf-8")
    fs.readFile(fReadName, 'binary',function(err,data){
        if(err){
            console.log("error");
        }else{
            var str = iconv.decode(data, 'gbk');
            var listdata = [];
            listdata = str.split("\n");
            listdata.forEach(function (element, index, array) {
                var data = [];
                data = element.split("\t");
                readList.push(data);
            });
            //console.log(readList);
            callBack(readList);
        }
    });
//    var fRead = fs.createReadStream(fReadName,"win1251");
//    var objReadline = readline.createInterface({ input: fRead});
//    var readList=[];
//    objReadline.on('line', function(line){
//        var lineTem=line.split("\t");
//        //var str = iconv.decode(lineTem, 'GBK');
//        readList.push(lineTem);
//    });
//    objReadline.on("close",function(){
//        callBack(readList);
//        objReadline.close();
//    });
};
