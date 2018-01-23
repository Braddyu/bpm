const ftp_util = require('../.././../utils/ftp_util');
const utils = require('../../../../lib/utils/app_utils');
const mistake_model = require('../models/mistake_model');
const config = require('../../../../config');
const fs=require('fs');
const path=require('path');
const iconv = require('iconv-lite');
const date=new Date;
const year=date.getFullYear();
var month=date.getMonth()+1;
month =(month<10 ? "0"+month:month);
var mydate = (year.toString()+month.toString());
var readfileName = 'PUSH_ORDER_20171227_0850_CHECK_RESULT';

var server = config.ftp_huanghe_server;

ftp_util.connect(server);

/*ftp_util.list(function(err,res){
  var data=res.data;
  //获取服务器文件
    for(let i in data){
        //zcomp
        //console.log(data[i].name);
        ftp_util.downloadFileList('content',data[i].name,function (err,res) {
            //console.log(res);

        });
    }

})*/
readFile()


ftp_util.end();

function readFile() {
    var  filrPath = path.join(__dirname,'content/PUSH_ORDER_20171227_0853_CHECK_RESULT.txt');
    fs.readFile(filrPath,function (err,result) {
        var data = iconv.decode(result, 'gbk');
        console.log(data);
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
                        condition_task.customer_number = lineData[1];//客户单号
                        condition_task.acceptance_number = lineData[2];//受理人员工号
                        condition_task.accept_business_type_code = lineData[3];//受理业务类型编码
                        condition_task.accept_business_type_name = lineData[4];//受理业务类型名称
                        condition_task.city_code = lineData[5];//地市
                        condition_task.country_code = lineData[6];//区县
                        condition_task.institutions = lineData[7];//机构
                        condition_task.channel_code = lineData[8];//渠道编码
                        condition_task.work_order_status = lineData[9];//工单状态
                        condition_task.remark = lineData[10];//状态描述
                        condition_task.status = 0;//派单状态
                        condition_task.dispatch_remark = '';//派单说明
                        condition_task.insert_time = new Date();//插入时间it
                       /* for(var it in condition_task){
                            //console.log(condition_task['customer_number'].replace(/(^s*)|(s*$)/g, "").length)
                            if((it!= 'dispatch_remark')&&(it!= 'insert_time'&&it!= 'status') && (condition_task[it].replace(/(^s*)|(s*$)/g, "").length ==1)){

                                //str.indexOf(" ") == -1
                               // console.log("数据"+condition_task[it]);
                                //console.log("第"+item+"行格式异常");
                                console.log("数据it"+"----"+it);
                                console.log("数据1"+"----"+condition_task['customer_number']+"---------------"+"行数"+item);

                                //console.log("数据2"+"---"+typeof (condition_task[it]));

                            }

                        }*/
                        arr.push(condition_task);
                    }
                }
                console.log(arr);
                await new Promise(function(resolve,reject){
                    mistake_model.$ProcessFtpMistake.create(arr, function (error, rs) {
                        if(error){
                            resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, error));
                        }else{
                            console.log("数据插入到数据库成功",item);
                            var arr1 =[];
                            //将插入成功的文件记录到日志表中
                            condition.insert_time = new Date();//插入时间
                            condition.file_no = item;//文件行数
                            condition.file_name = 'PUSH_ORDER_20171227_0853_CHECK_RESULT';//文件名
                            condition.Success_failure = 1;//是否成功 0表示:失败。1表示：成功'
                            condition.Remarks = "文件数据插入成功";
                            arr1.push(condition);
                            mistake_model.$ProcessFtpMistakeReadlogs.create(arr1, function(err,re) {
                                if(err){
                                    resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, err));
                                }else{
                                    resolve(utils.returnMsg(true, '0000', '插入数据成功。', re, null));
                                }
                            });

                            resolve(utils.returnMsg(true, '0000', '插入数据成功。', rs, null));
                            //将出入到数据库的文件拷贝到/usr/read文件夹下
                            ftp_util.uploadFile(filrPath,config.ftp_huanghe_put,function (err,result) {
                                if (err) {
                                    resolve(utils.returnMsg(false, '1000', '移动数据异常。', null, er));
                                } else {
                                    resolve(utils.returnMsg(true, '0000', '移动数据成功。', result, null));
                                }
                            })

                           /* ssh.copyFiles(server,files,'/usr/Read',function(er,result) {
                                if (er) {
                                    resolve(utils.returnMsg(false, '1000', '移动数据异常。', null, er));
                                } else {
                                    resolve(utils.returnMsg(true, '0000', '移动数据成功。', result, null));
                                }
                            });*/
                        }
                    });
                });
            }();
        }catch (e){
            condition.insert_time = new Date();//插入时间
            condition.file_no = item;//文件行数
            condition.file_name = i;//文件名
            condition.Success_failure = 0;//是否成功 0表示:失败。1表示：成功
            condition.Remarks = "数据读取异常";//备注
            arr.push(condition);
            mistake_model.$ProcessFtpMistakeReadlogs.create(arr, function(err,re) {
                if(err){
                    resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, err));
                }else{
                    resolve(utils.returnMsg(true, '0000', '插入数据成功。', re, null));
                }
            });
            //将出错的文件拷贝到/usr/Failread文件夹下
            ftp_util.uploadFile(filrPath,config.ftp_huanghe_put,function (err,result) {
                if (err) {
                    resolve(utils.returnMsg(false, '1000', '移动数据异常。', null, er));
                } else {
                    resolve(utils.returnMsg(true, '0000', '移动数据成功。', result, null));
                }
            })
            /*ssh.copyFiles(server,i,'/usr/Failread',function(er,result){
                if(er){
                    resolve(utils.returnMsg(false, '1000', '移动数据异常。', null, er));
                }else{
                    resolve(utils.returnMsg(true, '0000', '移动数据成功。', result, null));
                }
            });*/


        }



     })

}


