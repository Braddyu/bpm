const ftp_util = require('../.././../utils/ftp_util');
const utils = require('../../../../lib/utils/app_utils');
const mistake_model = require('../models/mistake_model');
const config = require('../../../../config');
const fs=require('fs');
const readline = require('readline');
const path=require('path');
const iconv = require('iconv-lite');
const schedule = require("node-schedule");


var server = config.ftp_huanghe_server;
exports.ftp_job=function(){
    ftp ();
}

function ftp() {
    ftp_util.connect(server);
    //切换目录
    ftp_util.cwd(config.ftp_huanghe_get,function(err,res){
        console.log(res);
    })

    ftp_util.list( function(err,res){
    var data=res.data;
    ftp_util.downloadFileList(config.local_haunghe_path, config.ftp_huanghe_get, function (err, res) {
        if (err) {

        } else {

            for (let i in data) {
                if ((data[i].name).indexOf("txt") > 0) {
                   readFile(data[i].name);
                }
            }
            ftp_util.end();
        }
    });
    })

}




async function readFile(fileName) {
    try{
        var  filePath = config.local_haunghe_path+"/"+fileName;
        console.log(filePath);
        let fRead =  fs.createReadStream(filePath,'binary');
        let objReadline =  readline.createInterface({
            input: fRead,
        });
        let index = 1;
        let arr = [];
        let condition = {};

        //每行读取
        objReadline.on('line',  (line)=>{
            var data = iconv.decode(new Buffer(line, 'binary'), 'gbk');
            console.log(index);
            let lineData = data.split('|');
            if (lineData.length > 0) {
                if ( !lineData[0] && (lineData[0]!='' || lineData[0].trim()!='')) {
                    errorLog(fileName,index);
                    return;
                }
                if (!lineData[1] && (lineData[1]!='' || lineData[1].trim()!='') ) {
                    errorLog(fileName,index);
                    return;
                }
                if (!lineData[2] && (lineData[2]!='' || lineData[2].trim()!='')  ) {
                    errorLog(fileName,index);
                    return;
                }
                if ( !lineData[4] && (lineData[4]!='' || lineData[4].trim()!='') ) {
                    errorLog(fileName,index);
                    return;
                }
                if ( !lineData[5] && (lineData[5]!='' || lineData[5].trim()!='') ) {
                    errorLog(fileName,index);
                    return;
                }
                if ( !lineData[6] && (lineData[6]!='' || lineData[6].trim()!='') ) {
                    errorLog(fileName,index);
                    return;
                }
                if ( !lineData[7] && (lineData[7]!='' || lineData[7].trim()!='') ) {
                    errorLog(fileName,index);
                    return;
                }
                if (!lineData[8] && (lineData[8]!='' || lineData[8].trim()!='')  ) {
                    errorLog(fileName,index);
                    return;
                }
                if (!lineData[9] &&  (lineData[9]!='' || lineData[9].trim()!='') ) {
                    errorLog(fileName,item);
                    return;
                }
                if (!lineData[10] &&  (lineData[10]!='' || lineData[10].trim()!='') ) {
                    errorLog(fileName,index);
                    return;
                }

                if (!lineData[11] && (lineData[11]!='' || lineData[11].trim()!='') ) {
                    errorLog(fileName,index);
                    return;
                }
                var condition_task = {};

                condition_task.BOSS_CODE = lineData[0];//BOSS订单编码
                condition_task.customer_code = lineData[1];//客户单号
                condition_task.salesperson_code = lineData[2];//受理人员工号
                condition_task.mistake_time = lineData[3];//工单时间
                condition_task.business_code = lineData[4];//受理业务类型编码
                condition_task.business_name = lineData[5];//受理业务类型名称
                condition_task.city_code = lineData[6];//地市
                condition_task.country_code = lineData[7];//区县
                condition_task.channel_id = lineData[8];//渠道id
                condition_task.channel_code = lineData[9];//渠道编码
                condition_task.check_status = lineData[10];//工单状态
                condition_task.remark = lineData[11];//状态描述
                condition_task.status = 0;//派单状态
                condition_task.dispatch_remark = '';//派单说明
                condition_task.insert_time = new Date();//插入时间it
                arr.push(condition_task);
            }

            index ++;
        });
         objReadline.on('close', ()=>{
             mistake_model.$ProcessMistake.create(arr,  function (error, rs) {

                 if (error) {

                 } else {
                     console.log("数据插入到数据库成功", index);
                     var arr1 = [];
                     //将插入成功的文件记录到日志表中
                     condition.insert_time = new Date();//插入时间
                     condition.file_no = index;//文件行数
                     condition.file_name = fileName;//文件名
                     condition.Success_failure = 1;//是否成功 0表示:失败。1表示：成功'
                     condition.Remarks = "文件数据插入成功";
                     arr1.push(condition);
                     mistake_model.$ProcessFtpMistakeReadlogs.create(arr1, function (err, re) {
                         if (err) {

                         } else {
                             var oldFilrPath = config.local_haunghe_path+fileName;
                             var newFilrPath =  config.local_haunghe_path+'READ/'+fileName;
                             fs.rename(oldFilrPath, newFilrPath, function (err) {
                                 if (err) {
                                     console.error(err);
                                     return;
                                 }
                                 console.log('文件移动成功')
                             });

                         }
                     });
                 }
             });
         });
    }catch(e){
        console.log(e);
    }
}

function errorLog(fileName,item) {
    var p = new Promise(function (resolve, reject) {
        var condition = {};
        var arr = [];
        condition.insert_time = new Date();//插入时间
        condition.file_no = '第'+(parseInt(item)+1)+'行出错';//文件行数
        condition.file_name = fileName;//文件名
        condition.Success_failure = 0;//是否成功 0表示:失败。1表示：成功
        condition.Remarks = "数据读取异常";//备注
        arr.push(condition);
        mistake_model.$ProcessFtpMistakeReadlogs.create(arr, function (err, re) {
            if (err) {
                resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, err));
            } else {
                var oldFilrPath = config.local_haunghe_path+fileName;
                var newFilrPath =config.local_haunghe_path+'FALL/'+fileName;
                fs.rename(oldFilrPath, newFilrPath, function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('未读取文件移动成功')
                });
                resolve(utils.returnMsg(true, '0000', '插入数据成功。', re, null));
            }
        });
    });
    return p;
}


