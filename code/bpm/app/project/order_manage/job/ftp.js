// const ftp_util = require('../.././../utils/ftp_util');
// const utils = require('../../../../lib/utils/app_utils');
// const mistake_model = require('../models/mistake_model');
// const config = require('../../../../config');
// const fs=require('fs');
// const path=require('path');
// const iconv = require('iconv-lite');
//
//
// var server = config.ftp_huanghe_server;
//
// ftp_util.connect(server);
//
// ftp_util.list(function(err,res){
//     var data=res.data;
//     //获取服务器文件
//     for(let i in data){
//         ftp_util.downloadFileList('content',data[i].name,function (err,res) {
//             readFile(data[i].name);
//         });
//     }
// })
//
// ftp_util.end();
//
// function readFile(fileName) {
//     var  filrPath = path.join(__dirname,'content/'+fileName);
//     fs.readFile(filrPath,function (err,result) {
//         var data = iconv.decode(result, 'gbk');
//         let datas=data.split("\n");
//         var arr = [];
//         var condition = {};
//         var items;
//         !async function () {
//             for (let item in datas) {
//                 items = item;
//                 let lineData = datas[item].split('|');
//                 if (lineData.length > 1) {
//                     /* for (let k = 0; k < 11; k++) {
//                          if (lineData[k].match(/\s/) != null || !lineData[k]) {
//                              errorLog(fileName, item);
//                              return;
//                          }
//
//                      }*/
//
//                     if (lineData[0].match(/\s/) != null || !lineData[0]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[1].match(/\s/) != null || !lineData[1]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[2].match(/\s/) != null || !lineData[2]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[3].match(/\s/) != null || !lineData[3]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[4].match(/\s/) != null || !lineData[4]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[5].match(/\s/) != null || !lineData[5]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[6].match(/\s/) != null || !lineData[6]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[7].match(/\s/) != null || !lineData[7]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[8].match(/\s/) != null || !lineData[8]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[9].match(/\s/) != null || !lineData[9]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     if (lineData[10].match(/\s/) != null || !lineData[10]) {
//                         errorLog(fileName,item);
//                         return;
//                     }
//                     var condition_task = {};
//                     condition_task.BOSS_NUM = lineData[0];//BOSS订单编码
//                     condition_task.customer_number = lineData[1];//客户单号
//                     condition_task.acceptance_number = lineData[2];//受理人员工号
//                     condition_task.accept_business_type_code = lineData[3];//受理业务类型编码
//                     condition_task.accept_business_type_name = lineData[4];//受理业务类型名称
//                     condition_task.city_code = lineData[5];//地市
//                     condition_task.country_code = lineData[6];//区县
//                     condition_task.institutions = lineData[7];//机构
//                     condition_task.channel_code = lineData[8];//渠道编码
//                     condition_task.work_order_status = lineData[9];//工单状态
//                     condition_task.remark = lineData[10];//状态描述
//                     condition_task.status = 0;//派单状态
//                     condition_task.dispatch_remark = '';//派单说明
//                     condition_task.insert_time = new Date();//插入时间it
//                     arr.push(condition_task);
//                 }
//             }
//             //console.log(arr);
//             await new Promise(function (resolve, reject) {
//                 mistake_model.$ProcessFtpMistake.create(arr, function (error, rs) {
//                     if (error) {
//                         resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, error));
//                     } else {
//                         console.log("数据插入到数据库成功", items);
//                         var arr1 = [];
//                         //将插入成功的文件记录到日志表中
//                         condition.insert_time = new Date();//插入时间
//                         condition.file_no = items;//文件行数
//                         condition.file_name = fileName;//文件名
//                         condition.Success_failure = 1;//是否成功 0表示:失败。1表示：成功'
//                         condition.Remarks = "文件数据插入成功";
//                         arr1.push(condition);
//                         mistake_model.$ProcessFtpMistakeReadlogs.create(arr1, function (err, re) {
//                             if (err) {
//                                 resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, err));
//                             } else {
//                                 var oldFilrPath = path.join(__dirname, 'content/'+fileName);
//                                 var newFilrPath = path.join(__dirname, 'content/READ/'+fileName);
//                                 fs.rename(oldFilrPath, newFilrPath, function (err) {
//                                     if (err) {
//                                         console.error(err);
//                                         return;
//                                     }
//                                     console.log('文件移动成功')
//                                 });
//                                 resolve(utils.returnMsg(true, '0000', '插入数据成功。', re, null));
//                             }
//                         });
//
//
//                         resolve(utils.returnMsg(true, '0000', '插入数据成功。', rs, null));
//
//                     }
//                 });
//             });
//         }();
//     })
// }
//
// function errorLog(fileName,item) {
//     var p = new Promise(function (resolve, reject) {
//         var condition = {};
//         var arr = [];
//         condition.insert_time = new Date();//插入时间
//         condition.file_no = '第'+(parseInt(item)+1)+'行出错';//文件行数
//         condition.file_name = fileName;//文件名
//         condition.Success_failure = 0;//是否成功 0表示:失败。1表示：成功
//         condition.Remarks = "数据读取异常";//备注
//         arr.push(condition);
//         mistake_model.$ProcessFtpMistakeReadlogs.create(arr, function (err, re) {
//             if (err) {
//                 resolve(utils.returnMsg(false, '1000', '插入数据异常。', null, err));
//             } else {
//                 var oldFilrPath = path.join(__dirname, 'content/'+fileName);
//                 var newFilrPath = path.join(__dirname, 'content/FALL/'+fileName);
//                 fs.rename(oldFilrPath, newFilrPath, function (err) {
//                     if (err) {
//                         console.error(err);
//                         return;
//                     }
//                     console.log('未读取文件移动成功')
//                 });
//                 resolve(utils.returnMsg(true, '0000', '插入数据成功。', re, null));
//             }
//         });
//     });
//     return p;
// }
//
//
