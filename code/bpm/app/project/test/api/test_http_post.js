// var assert = require("assert");
// var nodegrass = require("nodegrass");
// var utils = require('../../lib/utils/app_utils');
// var inst = require('../../server/api/services/instance_service');
//
//
// var host="10.201.253.162";
// var port="30003";
// // var host="localhost";
// // var port="3003";
//
//
//
// var REQ_HEADERS = {
//     'Content-Type': 'application/x-www-form-urlencoded'
// };
// //获取流程数据列表
// function getProcessList(){
//     var p = new Promise(function(resolve,reject) {
//         nodegrass.post("http://"+host+":"+port+"/v1/process/list",
//             function (res, status, headers) {
//                 resolve(JSON.parse(res));
//             },
//             REQ_HEADERS,
//             {page: 1, rows: 50,time:new Date()},
//             'utf8').on('error', function (e) {
//             console.log("Got error: " + e.message);
//             resolve({'success':false,'code':'1000','msg':'获取流程列表数据异常'});
//         });
//     });
//     return p;
// }
// //创建流程实例
// function createInstance(proc_code,proc_ver,userNo,title){
//     var p = new Promise(function(resolve,reject) {
//         nodegrass.post("http://"+host+":"+port+"/v1/instance/createInstance",
//             function (res, status, headers) {
//                 resolve(JSON.parse(res));
//             },
//             REQ_HEADERS,
//             {proc_code:proc_code,proc_ver:proc_ver,user_no:userNo,title: title,time:new Date()},
//             'utf8').on('error', function (e) {
//             console.log("Got error: " + e.message);
//             resolve({'success':false,'code':'1000','msg':'创建流程实例异常'});
//         });
//     });
//     return p;
// }
// //禁用流程实例
// function cancleInstance(instId){
//     var p = new Promise(function(resolve,reject) {
//         nodegrass.post("http://"+host+":"+port+"/v1/instance/cancleInstance",
//             function (res, status, headers) {
//                 resolve(JSON.parse(res));
//             },
//             REQ_HEADERS,
//             {inst_id:instId,time:new Date()},
//             'utf8').on('error', function (e) {
//             console.log("Got error: " + e.message);
//             resolve({'success':false,'code':'1000','msg':'禁用流程实例异常'});
//         });
//     });
//     return p;
// }
// //启用流程实例
// function enableInstance(instId){
//     var p = new Promise(function(resolve,reject) {
//         nodegrass.post("http://"+host+":"+port+"/v1/instance/enableInstance",
//             function (res, status, headers) {
//                 resolve(JSON.parse(res));
//             },
//             REQ_HEADERS,
//             {inst_id:instId,time:new Date()},
//             'utf8').on('error', function (e) {
//             console.log("Got error: " + e.message);
//             resolve({'success':false,'code':'1000','msg':'启用流程实例异常'});
//         });
//     });
//     return p;
// }
//
// //任务认领
// function acceptTask(id,userNo){
//     var p = new Promise(function(resolve,reject) {
//         nodegrass.post("http://"+host+":"+port+"/v1/task/accept",
//             function (res, status, headers) {
//                 resolve(JSON.parse(res));
//             },
//             REQ_HEADERS,
//             {id:id,user_no:userNo,time:new Date()},
//             'utf8').on('error', function (e) {
//             console.log("Got error: " + e.message);
//             resolve({'success':false,'code':'1000','msg':'任务认领异常'});
//         });
//     });
//     return p;
// }
// //获取待办数据列表
// function getMyTaskList(){
//     var p = new Promise(function(resolve,reject) {
//         nodegrass.post("http://"+host+":"+port+"/v1/task/todo",
//             function (res, status, headers) {
//                 resolve(JSON.parse(res));
//             },
//             REQ_HEADERS,
//             {user_no:'100021',page: 1, rows: 50,time:new Date()},
//             'utf8').on('error', function (e) {
//             console.log("Got error: " + e.message);
//             resolve({'success':false,'code':'1000','msg':'获取待办数据异常'});
//         });
//     });
//     return p;
// }
//
// //任务完成
// function completeTask(id,userNo,memo,params){
//     var p = new Promise(function(resolve,reject) {
//         nodegrass.post("http://"+host+":"+port+"/v1/task/complete",
//             function (res, status, headers) {
//                 resolve(JSON.parse(res));
//             },
//             REQ_HEADERS,
//             {id:id,user_no:userNo,memo:memo,params:params,time:new Date()},
//             'utf8').on('error', function (e) {
//             console.log("Got error: " + e.message);
//             resolve({'success':false,'code':'1000','msg':'任务完成异常'});
//         });
//     });
//     return p;
// }
//
//
//
// var process,task,accept,complete;
// describe('ProcessInteface', function() {
//     describe('#processOrInstanceHttp()', function() {
//
//         //获取流程数据列表
//         it("getProcessListHttp", function() {
//             console.log("********************************   获取流程数据列表http-post开始   *************************************");
//             return getProcessList().then(function(result){
//                 console.log("********************************   获取流程数据列表http-post结束   *************************************");
//                 assert.equal(result.success, true);
//                 process = result;
//             });
//         });
//         //
//         // //创建流程实例
//         it("createInstanceHttp", function() {
//             console.log("********************************   创建流程实例http-post开始   *************************************");
//             if(process && process.success && process.rows.length > 0){
//                 return createInstance('t_104',1,'100021','POST流程实例测试用例').then(function(result){
//                     console.log("********************************   创建流程实例http-post结束   *************************************");
//                     assert.equal(result.success, true);
//                     task = result;
//                 }).catch(function(err){
//                     console.error("创建流程实例错误：",err);
//                     // throw new Error(err);
//                 });
//             }else{
//                 assert.equal(false, true);
//             }
//         });
//         // // //终止流程实例
//         it("cancleInstanceHttp", function() {
//             console.log("********************************   终止流程实例http-post开始   *************************************");
//             if(task && task.success){
//                 return cancleInstance(task.data[0].proc_inst_id).then(function(result){
//                     console.log("********************************   终止流程实例http-post结束   *************************************");
//                     assert.equal(result.success, true);
//                 }).catch(function(err){
//                     console.error("终止流程实例错误：",err);
//                     // throw new Error(err);
//                 });
//             }else{
//                 assert.equal(false, true);
//             }
//         });
//         // //启用流程实例
//         it("enableInstanceHttp", function() {
//             console.log("********************************   启用流程实例http-post开始   *************************************");
//             if(task && task.success){
//                 console.log("task===",task);
//                 return enableInstance(task.data[0].proc_inst_id).then(function(result){
//                     console.log("********************************   启用流程实例http-post结束   *************************************");
//                     assert.equal(result.success, true);
//                 }).catch(function(err){
//                     console.error("启用流程实例错误：",err);
//                     // throw new Error(err);
//                 });
//             }else{
//                 assert.equal(false, true);
//             }
//         });
//         //
//         // //获取待办数据列表
//         it("getMyTaskListHttp", function() {
//             console.log("********************************   获取待办数据列表http-post开始   *************************************");
//             return getMyTaskList().then(function(result){
//                 console.log(result);
//                 console.log("********************************   获取待办数据列表http-post结束   *************************************");
//                 assert.equal(result.success, true);
//             });
//         });
//         //
//         // //任务认领
//         it("acceptTaskHttp", function() {
//             console.log("********************************   任务认领http-post开始   *************************************");
//             if(task && task.success){
//                 var taskid = task.data[0]._id.toString();
//                 var instId = task.data[0].proc_inst_id;
//                 var userno = '100021';
//                 return acceptTask(taskid,userno).then(function(result){
//                     console.log("********************************   任务认领http-post结束   *************************************");
//                     assert.equal(result.success, true);
//                     accept = result;
//                 }).catch(function(err){
//                     //删除流程实例
//                     inst.instDeleteById(instId);
//                     //删除任务
//                     inst.taskDelete(instId);
//                     console.error("认领任务错误：",err);
//                     // throw new Error(err);
//                 });
//             }else{
//                 assert.equal(false, true);
//             }
//         });
//         //
//         // //任务完成并流转
//         it("completeTaskHttp", function() {
//             console.log("********************************   任务完成http-post开始   *************************************");
//             if(accept && accept.success){
//                 var taskid = task.data[0]._id.toString();
//                 var instId = task.data[0].proc_inst_id;
//                 return completeTask(taskid,"100021","通过",JSON.stringify({"flag":1})).then(function(result){
//                     console.log("********************************   任务完成http-post结束   *************************************");
//                     assert.equal(result.success, true);
//                     //删除流程实例
//                     inst.instDeleteById(instId);
//                     //删除任务
//                     inst.taskDelete(instId);
//                 }).catch(function(err){
//                     //删除流程实例
//                     inst.instDeleteById(instId);
//                     //删除任务
//                     inst.taskDelete(instId);
//                     console.error("任务完成错误：",err);
//                     // throw new Error(err);
//                 });
//             }else{
//                 assert.equal(false, true);
//             }
//         });
//
//     });
// });