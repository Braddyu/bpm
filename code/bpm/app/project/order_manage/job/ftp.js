const ftp_util = require('../.././../utils/ftp_util');
const config = require('../../../../config');


var server = config.ftp_huanghe_server;

ftp_util.connect(server);

ftp_util.list(function(err,res){
  var data=res.data;
  //获取服务器文件
    for(let i in data){
        //zcomp
        //console.log(data[i].name);
        ftp_util.downloadFileList('content',data[i].name,function (err,res) {
            //console.log(res);

        });
    }



})

ftp_util.end();