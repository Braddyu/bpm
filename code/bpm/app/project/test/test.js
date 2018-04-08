// var inst = require('../server/api/services/instance_service');
// var proc = require('../server/core/bpm/services/process_service');
// var nodeTransferService=require("../server/api/services/node_transfer_service");
var model_user=require("../bpm_resource/models/user_model");
// var model=require("../server/core/bpm/models/process_model");
// updateorg();
function updateorg(){

    model_user.$CommonCoreOrg.find({"level" : {$in:[5,6]}},function (err,res) {
        if(err){
            console.log('---------')
        }else{
            if(res.length > 0){
                for (let i in res){
                    console.log(res[i]);
                    model_user.$CommonCoreOrg.update( {"_id":res[i]._id},{$set: {"org_code":res[i].company_code}},{},function(err,updateRes){
                        if(updateRes){
                            console.log("更新org_code数据成功 ");
                        }else{
                            console.log("更新org_code数据失败");
                        }
                    });
                }
            }
        }
    })
}

//
// var params = {};
// // params.processDefineDiv_node_5 = { "flag": 3 }
// params.processDefineDiv_node_6 = { "flag": true };
//
// function fullTransfer(instId){
//     var p = new Promise(function(resolve,reject) {
//         model.$ProcessInst.find({"$or":[{"_id":instId},{"parent_proc_inst_id":instId}]},function(err,ress){
//             if(err){
//                 console.error("查询流程实例异常.....");
//             }else{
//                 if(ress.length > 0){
//                     var instIdArr = [];
//                     for(var i = 0;i<ress.length;i++){
//                         instIdArr.push(ress[i]._doc._id.toString());
//                     }
//                     console.log("获取流程实例ID成功------",instIdArr);
//                     sleep(2000);
//                     //根据实例ID查找未处理的任务数据
//                     model.$ProcessInstTask.find({"proc_inst_id" :{"$in":instIdArr},"proc_inst_task_status":0},function(error,results){
//                         if(error){
//                             console.error("查询任务异常.....");
//                         }else{
//                             var map = {};
//                             var tidArr = [];
//                             console.log(results);
//                             if(results.length == 0) {
//                                 sleep(1000);
//                                 //根据实例ID查找未处理的任务数据
//                                 model.$ProcessInstTask.find({
//                                     "proc_inst_id": {"$in": instIdArr},
//                                     "proc_inst_task_status": 0
//                                 }, function (error, results2) {
//                                     console.log("result2===========",results2);
//                                     results = results2;
//                                 });
//                             }
//                             sleep(1000);
//                             console.log("results==="+results);
//                             if(results.length == 0){
//                                 console.log("流程流转完成....");
//                                 console.log("********************************   完整流程测试用例结束   *************************************");
//                                 // assert(true,true);
//                                 resolve({'success':true});
//                                 return;
//                                 //删除流程基本信息及定义信息
//                                 proc.procDelete(proc_code);
//                                 proc.procDefineDelete(proc_code);
//                                 //删除流程实例
//                                 inst.instDelete(proc_code);
//                                 //删除任务
//                                 inst.taskDelete(instId);
//                             }else if(results.length == 1){
//                                 tidArr.push(results[0]._id);
//
//                             }else if(results.length > 1){
//                                 for(var i=0;i<results.length;i++){
//                                     tidArr.push(results[i]._id);
//                                 }
//                             }
//                             if(tidArr.length > 0){
//                                 getProcessOptUsers(results[0]).then(function(rs){
//                                     console.log(" len 1 user ",rs);
//                                     acceptCompleteTask(tidArr,rs).then(function(result){
//                                         console.log(" acceptComplete 1 acceptComplete ",result);
//                                         if(result.success){
//                                             var param='';
//                                             if(results[0].proc_inst_task_code=="processDefineDiv_node_6"){
//                                                 param=JSON.stringify(params['processDefineDiv_node_6']);
//                                             }
//                                             if(results[0].proc_inst_task_code=="processDefineDiv_node_9"){
//                                                 params.processDefineDiv_node_6 = { "flag": false };
//                                             }
//                                             console.log("----param---",param);
//                                             console.log("----taskid---------",results[0]._id);
//                                             console.log("----nodecode----------------",results[0].proc_inst_task_code);
//                                             nodeTransferService.transfer(results[0]._id,results[0].proc_inst_task_code,rs.user_no,true,null,param)
//                                                 .then(function(rs){
//                                                     console.log("-------transfer--------",rs);
//                                                     if(rs.success){
//
//                                                         fullTransfer(instId).then(function(){
//                                                             console.log("-----llllll-------");
//                                                         }).catch(function(err){
//                                                             //删除流程基本信息及定义信息
//                                                             // proc.procDelete(proc_code);
//                                                             console.error("完整流程流转错误：",err);
//                                                             throw new Error(err);
//                                                         });
//                                                     }else{
//                                                         //删除流程基本信息及定义信息
//                                                         proc.procDelete(proc_code);
//                                                         proc.procDefineDelete(proc_code);
//                                                         //删除流程实例
//                                                         inst.instDelete(proc_code);
//                                                         //删除任务
//                                                         inst.taskDelete(instIdArr);
//                                                     }
//                                                 });
//                                         }
//                                     });
//                                 });
//                             }
//                         }
//                     });
//                 }
//             }
//         });
//
//     });
//     return p;
// };
//
// //根据任务获取用户数据
// function getProcessOptUsers(t){
//     var p = new Promise(function(resolve,reject) {
//         var condition = {};
//         if(t.proc_inst_task_assignee){
//             condition = {"user_no":t.proc_inst_task_assignee};
//         }else{
//             condition = {"user_org" : {"$in":t.proc_inst_task_user_org?t.proc_inst_task_user_org.split(","):[]},"user_roles" : t.proc_inst_task_user_role};
//         }
//         console.log("condition------",condition);
//         model_user.$User.find(condition,function(errs,res){
//             if(errs){
//                 console.log(errs);
//                 resolve(new Array());
//             }else{
//                 console.log("user ----3333---- ",res);
//                 resolve(res[0]);
//             }
//         })
//     });
//     return p;
// }
//
// //认领、完成任务方法
// function acceptCompleteTask(tarr,u){
//     var p = new Promise(function(resolve,reject) {
//         inst.acceptTaskList(tarr,u.user_no,u.user_name).then(function(result){
//             console.log("accept---------",result);
//             if(result.success){
//                 inst.completeTaskList(tarr)
//                     .then(function(rs){
//                         console.log("-----complete----",rs);
//                         resolve(rs);
//                     });
//             }else{
//                 resolve(result);
//             }
//         });
//     });
//     return p;
// }
//
// function sleep(numberMillis) {
//     var now = new Date();
//     var exitTime = now.getTime() + numberMillis;
//     while (true) {
//         now = new Date();
//         if (now.getTime() > exitTime)
//             return;
//     }
// }
// //ObjectId("5964b0dec950f210ac8847de")
// fullTransfer('5964cb63e73d9622f0390d61');
// // var instid = "5964b31d74ddb515bcbc82c6";
// // setTimeout("fullTransfer("+instid+")","5000");

// function getIPAdress(){
//     var interfaces = require('os').networkInterfaces();
//     for(var devName in interfaces){
//         var iface = interfaces[devName];
//         for(var i=0;i<iface.length;i++){
//             var alias = iface[i];
//             if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
//                 return alias.address;
//             }
//         }
//     }
// }

// console.log(getIPAdress());
