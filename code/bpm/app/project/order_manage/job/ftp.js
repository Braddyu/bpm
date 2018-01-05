const fileName = "coverflow-3.0.1.zip";
const promisify = require('util').promisify;
const rf = require('fs');
const iconv = require('iconv-lite');
const path = require('path');
const mistake_model = require('../models/mistake_model');
const utils = require('../../../../lib/utils/app_utils');
const ssh = require('../../../utils/sshClient');
const schedule = require("node-schedule");
const config = require('../../../../config');
var rule     = new schedule.RecurrenceRule();
 rule.dayOfWeek = [0, new schedule.Range(1, 6)];
 rule.hour =9;
 rule.minute = 0;
// var times2    = [1,31];
// rule.second  = times2;
// rule.hour  = times3; rule1.minute = 0;
  schedule.scheduleJob(rule, function(){
     ftp();
 });

var server = config.ftp_huanghe_server;
function ftp() {
    var Client = require('ssh2').Client;
    var conn = new Client();
    conn.on('ready', function() {
        console.log('Client :: ready');
        conn.sftp(function(err, sftp,resolve,reject) {
            //判断需要读取的文件夹是否存在
            sftp.exists('/usr/ftp',function (rs) {
                if(rs){
                    console.log("文件夹存在");
                }else{
                    console.log("文件夹不存在");
                    sftp.mkdirsSync('/usr/ftp',function (err) {
                        if(err){
                            console.log("创建文件夹失败");
                            resolve(utils.returnMsg(false, '1000', '创建文件夹失败。', null, error));
                        }else{
                            console.log("创建文件夹成功");
                            reject(utils.returnMsg(true, '0000', '创建文件夹成功。', null, null));
                        }
                    });
                }
            });
            if (err) throw err;
            //获取文件夹下所有文件目录
            ssh.GetFileOrDirList(server,'/usr/ftp',true,function(err,files){
                if(err){
                    console.log(err);
                }else{
                    if(files.length>0){
                        const  ReadDirAsync=(filePath,opt)=>{
                            return new Promise((resolve,reject)=>{
                                sftp.readFile(filePath,opt,function(err,list){
                                    if(err){
                                        reject(err);
                                    }
                                    resolve(list);
                                });
                            });
                        }
                        !async function(){
                            for(let i of files){
                                console.log(i)
                                //将读取的文件转码
                                let content=await ReadDirAsync(i,'binary');
                                //console.log(iconv.decode(content, 'gbk'));
                                var data = iconv.decode(content, 'gbk');
                                let datas=data.split("\n");
                                var arr = [];
                                var item;
                                var condition = {};
                                try{
                                    !async function(){
                                            for(item in datas){
                                                let lineData=datas[item].split('|');
                                                if(lineData.length>1){
                                                    var condition_task = {};
                                                    condition_task.BOSS_NUM = lineData[0];//BOSS订单编码
                                                    condition_task.staff_num = lineData[1];//营业员工号
                                                    condition_task.mistake_time = lineData[3];//日期
                                                    condition_task.business_num = lineData[4];//业务编码
                                                    condition_task.business_name = lineData[5];//业务名称
                                                    condition_task.city_code = lineData[6];//地市编码
                                                    condition_task.country_code = lineData[7];//区县编码
                                                    condition_task.channel_org = lineData[8];//渠道组织
                                                    condition_task.channel_type = lineData[9];//渠道类型
                                                    condition_task.check_status = lineData[10];//稽核状态
                                                    condition_task.remark = lineData[11];//稽核说明
                                                    condition_task.status = 0;//派单状态
                                                    condition_task.dispatch_remark = '';//派单说明
                                                    condition_task.insert_time = new Date();//插入时间
                                                      arr.push(condition_task);
                                                }
                                            }
                                        console.log(arr);
                                        await new Promise(function(resolve,reject){
                                            mistake_model.$ProcessMistake.create(arr, function (error, rs) {
                                                if(error){
                                                    resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, error));
                                                }else{
                                                    console.log("数据插入到数据库成功",item);
                                                    resolve(utils.returnMsg(true, '0000', '插入数据成功。', rs, null));
                                                    //将出入到数据库的文件拷贝到/usr/read文件夹下
                                                    ssh.copyFiles(server,files,'/usr/Read',function(er,result) {
                                                        if (er) {
                                                            resolve(utils.returnMsg(false, '1000', '移动数据异常。', null, er));
                                                        } else {
                                                            resolve(utils.returnMsg(true, '0000', '移动数据成功。', result, null));
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    }();
                                }catch(e){
                                    //condition.dispatch_time = //派单时间
                                    condition.insert_time = new date();//插入时间
                                    condition.file_no = item;//文件行数
                                    condition.file_name = i;//文件名
                                    condition.Success_failure = 0;//是否成功 0表示:失败。1表示：成功
                                    condition.Remarks = "数据读取异常";//备注
                                    arr.push(condition);
                                    mistake_model.$ProcessMistakeReadlogs(arr, function(err,re) {
                                        if(err){
                                            resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, err));
                                        }else{
                                            resolve(utils.returnMsg(true, '0000', '插入数据成功。', re, null));
                                        }
                                    });
                                    //将出错的文件拷贝到/usr/Failread文件夹下
                                    ssh.copyFiles(server,i,'/usr/Failread',function(er,result){
                                        if(er){
                                            resolve(utils.returnMsg(false, '1000', '移动数据异常。', null, er));
                                        }else{
                                            resolve(utils.returnMsg(true, '0000', '移动数据成功。', result, null));
                                        }
                                    });
                                }
                            }
                        }();
                    }
                }
            });
        });
    }).connect(config.ftp_huanghe_server);
}


// ftp();
