/**fuweilian 文件的下载与回显公共router*/
var express = require('express');
var config = require('../config');
var router = express.Router();
var $util = require('../app/common/core/utils/mysql_util');
router.get("/downLoadFile",function(req,res,next){
    var pre_path = config.pre_upload_url.pre_path;
    var file = req.query.file_url;
    //console.log("jinlail:",file);
    var fileName = req.query.file_name;
    if(file==''||file==null||file==undefined){
       $util.jsonWrite(res,"文件地址不对");
    }else{
        try{
            var temp = pre_path + file;
            var files = temp.replace(/\\/g, "/");//把地址中'\'转换为'/'
            console.log(files);
            var date = new Date();
            var _ctx = files.substring(files.lastIndexOf("."),files.length);
            if(fileName == '' && fileName == undefined){
                fileName == date.getTime()+_ctx;
            }
            //console.log(_ctx);
            //res.download(files,date.getTime()+_ctx);
            res.download(files,fileName);
        }catch(err){
            console.warn(err.message);
        }

    }
});
module.exports=router;