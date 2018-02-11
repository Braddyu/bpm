var assert = require("assert");
 var nodegrass = require("nodegrass");
 var utils = require('../../../../lib/utils/app_utils');
 var inst = require('../../bpm_resource/services/instance_service');
var ObjectID = require('mongodb').ObjectID;


var host="127.0.0.1";
 var port="30002";
 // var host="localhost";
 // var port="3003";



 var REQ_HEADERS = {
     'Content-Type': 'application/x-www-form-urlencoded',
     'token':'MdHk08AaAwif7X9s6VHPiDkKZ'
 };

 //流程实例当前节点处理信息
 function getCurrent_users(node_code,proc_task_id){
     var p = new Promise(function(resolve,reject) {
         nodegrass.post("https://"+host+":"+port+"/gdgl/api/process_instance/get/current_users/info",
             function (res, status, headers) {
                 resolve(JSON.parse(res));
             },
             REQ_HEADERS,
             {node_code:node_code,proc_task_id:proc_task_id},
             'utf8').on('error', function (e) {
             console.log("Got error: " + e.message);
             resolve({'success':false,'code':'1000','msg':'获取流程实例当前节点处理信息数据异常'});
         });
     });
     return p;
 }


//流程实例下一节点名称和处理人信息
function getnodeAnduser(node_code,proc_task_id,proc_inst_id,user_no,params){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/process_instance/next/nodeAnduser",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {node_code:node_code,proc_task_id:proc_task_id,proc_inst_id:proc_inst_id,user_no:user_no,params:params},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取流程实例下一节点名称和处理人信息数据异常'});
        });
    });
    return p;
}

//流程实例列表信息列表
function getProcessList(proc_code,page,rows,user_no){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/process_instance/list",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {proc_code:proc_code,user_no:user_no,page:page,rows:rows},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取流程实例列表信息列表数据异常'});
        });
    });
    return p;
}

//创建流程实例直接流转到下一节点
function createAndAcceptAssign(proc_code,proc_ver,title,user_no,user_name,node_code,assign_user_no,memo,proc_vars,biz_vars,params,joinup_sys,next_name){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/process_instance/createAndAcceptAssign",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {proc_code:proc_code,title:title,user_no:user_no,user_name:user_name,
                node_code:node_code,assign_user_no:assign_user_no,memo:memo,proc_vars:proc_vars,biz_vars:biz_vars,params:params,joinup_sys:joinup_sys,next_name:next_name},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取流程实例列表信息列表数据异常'});
        });
    });
    return p;
}

 //获取我的待办任务集合
 function getTodo(user_no,page,rows,joinup_sys){
     var p = new Promise(function(resolve,reject) {
         nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/todo",
             function (res, status, headers) {
                 resolve(JSON.parse(res));
             },
             REQ_HEADERS,
             {user_no:user_no,page:page,rows:rows,joinup_sys:joinup_sys,a:""},
             'utf8').on('error', function (e) {
             console.log("Got error: " + e.message);
             resolve({'success':false,'code':'1000','msg':'获取获取我的待办任务集合数据异常'});
         });
     });
     return p;
 }


 //查询某一条待办的详细信息
 function getSingleTodo(user_no,inst_id){
     var p = new Promise(function(resolve,reject) {
         nodegrass.post("https://"+host+":"+port+"/gdgl/api/process/single/todo",
             function (res, status, headers) {
                 resolve(JSON.parse(res));
             },
             REQ_HEADERS,
             {user_no:user_no,inst_id:inst_id},
             'utf8').on('error', function (e) {
             console.log("Got error: " + e.message);
             resolve({'success':false,'code':'1000','msg':'获取某一条待办的详细信息数据异常'});
         });
     });
     return p;
 }

//获取我的已办任务集合
function getTaskhavetodo(user_no,page,rows,joinup_sys){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/havetodo",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {user_no:user_no,page:page,rows:rows,joinup_sys:joinup_sys,a:""}, 'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取我的已办任务集合数据异常'});
        });
    });
    return p;
}


//获取指定任务
function getTaskquery(taskId){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/query",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {taskId:taskId},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取指定任务信息数据异常'});
        });
    });
    return p;
}


//认领任务
function taskaccepto(id,user_no){
    console.log(user_no);
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/accept",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {id:id,user_no:user_no,s:""},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'认领任务异常'});
        });
    });
    return p;
}


//完成任务
function taskcomplete(id,user_no,memo,params,proc_vars,biz_vars){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/complete",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {id:id,user_no:user_no,memo:memo,params:params,proc_vars:proc_vars,biz_vars:biz_vars},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'完成任务异常'});
        });
    });
    return p;
}


//指派任务给人
function assigntask(task_id,user_no,memo,assign_user_no,node_code,proc_vars,biz_vars){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/assign/task",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {task_id:task_id,user_no:user_no,memo:memo,assign_user_no:assign_user_no,node_code:node_code,proc_vars:proc_vars,biz_vars:biz_vars},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'指派任务给人异常'});
        });
    });
    return p;
}


//分公司稽核指派任务
function nterimtask(proc_inst_id,task_id,user_no,user_name,assign_user_no,memo,assign_user_no,proc_title,node_code,proc_vars,biz_vars){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/assign/interim_task",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {proc_inst_id:proc_inst_id,task_id:task_id,user_no:user_no,user_name:user_name,assign_user_no:assign_user_no,
                proc_title:proc_title,memo:memo,node_code:node_code,proc_vars:proc_vars,biz_vars:biz_vars},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'分公司稽核指派任务异常'});
        });
    });
    return p;
}


//获取任务处理日志
function getTasklogs(user_no,inst_id,page,rows){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/logs",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {user_no:user_no,inst_id:inst_id,page:page,rows:rows},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取任务处理日志数据异常'});
        });
    });
    return p;
}


//处理日志集合
function getLoglist(status,user_no,begin_date,end_date,page,rows){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/log/list",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {status:status,user_no:user_no,begin_date:begin_date,end_date:end_date,page:page,rows:rows},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取处理日志集合数据异常'});
        });
    });
    return p;
}

//获取已完成的节点编号信息
function getNodecode(proc_inst_id){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/complete/node/codes",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {proc_inst_id:proc_inst_id}, 'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取已完成的节点编号信息数据异常'});
        });
    });
    return p;
}


//区县公司调账营业员非销户归档
function getPigeonhole(proc_inst_id){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/pigeonhole",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {proc_inst_id:proc_inst_id},'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'区县公司调账营业员非销户归档异常'});
        });
    });
    return p;
}


//完成任务慧眼系统添加
function taskfinish(user_no,task_id){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/finish/task",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {user_no:user_no,task_id:task_id},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'完成任务慧眼系统添加异常'});
        });
    });
    return p;
}


//任务回退接口
function taskback(task_id,user_no,memo,node_code,node_name){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/task/back",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {task_id:task_id,user_no:user_no,memo:memo,node_code:node_code,node_name:node_name},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'任务回退异常'});
        });
    });
    return p;
}


//获取我的流程历史列表
function getHistory(user_no,page,rows){
    var p = new Promise(function(resolve,reject) {
        nodegrass.post("https://"+host+":"+port+"/gdgl/api/process_instance/history",
            function (res, status, headers) {
                resolve(JSON.parse(res));
            },
            REQ_HEADERS,
            {user_no:user_no,page:page,rows:rows},
            'utf8').on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve({'success':false,'code':'1000','msg':'获取任务处理日志数据异常'});
        });
    });
    return p;
}


 //var process,task,accept,complete;
 //describe('ProcessInteface', function() {
 //    describe('#processOrInstancehttps()', function() {
 //
 //        ////获取流程数据列表ok
 //        //it("getProcessList", function() {
 //        //    console.log("********************************   获取流程数据列表https-post开始   *************************************");
 //        //    return getProcessList('p-999',1,10,'admin').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   获取流程数据列表https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        ////获取我的待办任务集合ok
 //        //it("getTodo", function() {
 //        //    console.log("********************************   获取我的待办任务集合https-post开始   *************************************");
 //        //    return getTodo('777',1,50,'warnSys_node').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   获取我的待办任务集合https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        ////获取我的已办任务集合ok
 //        //it("getTaskhavetodo", function() {
 //        //    console.log("********************************   获取我的已办任务集合https-post开始   *************************************");
 //        //    return getTaskhavetodo('777',1,10,'warnSys_node').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   获取我的已办任务集合https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        ////获取处理日志集合ok
 //        //it("getLoglist", function() {
 //        //    console.log("********************************   获取处理日志集合https-post开始   *************************************");
 //        //    return getLoglist('0','admin','2017-09-19','2018-01-29',1,10).then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   获取处理日志集合https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        //
 //        ////获取我的流程历史列表ok
 //        //it("getHistory", function() {
 //        //    console.log("********************************   获取我的流程历史列表https-post开始   *************************************");
 //        //    return getHistory('wenanguo',1,10).then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   获取我的流程历史列表https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //
 //        var taskid= "";
 //        var pro_inst_id="";
 //        //创建流程实例  ok
 //        it("createAndAcceptAssign", function() {
 //            console.log("********************************   创建流程实例https-post开始   *************************************");
 //            var map= {}
 //            map.flag="";
 //            return createAndAcceptAssign('p-999',1,'完整测试流程测试','admin','系统管理员','processDefineDiv_node_2','admin','处理内容测试','','',JSON.stringify(map),'warnSys_node',"系统管理员").then(function(result){
 //                console.log(result);
 //                 taskid=result.data[0].pay_task_id;
 //                 pro_inst_id=result.data[0]._id;
 //                console.log("********************************  创建流程实例https-post结束   *************************************");
 //                //assert.equal(result.success, true);
 //                process = result;
 //            });
 //        });
 //
 //        //流程实例下一节点名称和处理人信息  ok
 //        //it("getnodeAnduser", function() {
 //        //    console.log("********************************   流程实例下一节点名称和处理人信息https-post开始   *************************************");
 //        //    var map= {}
 //        //    map.flag="";
 //        //    return getnodeAnduser('processDefineDiv_node_2',taskid,pro_inst_id,'admin',JSON.stringify(map)).then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   流程实例下一节点名称和处理人信息https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //
 //
 //        ////获取任务处理日志  ok
 //        //it("getTasklogs", function() {
 //        //    console.log("********************************   获取任务处理日志https-post开始   *************************************");
 //        //    return getTasklogs('admin',taskid,1,10).then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   获取任务处理日志https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //
 //        //
 //        ////流程实例当前节点处理信息   报错
 //        //it("getCurrent_users", function() {
 //        //    console.log("********************************   流程实例当前节点处理信息https-post开始   *************************************");
 //        //    return getCurrent_users('processDefineDiv_node_2',pro_inst_id).then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   流程实例当前节点处理信息https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //
 //        //
 //        ////查询某一条待办的详细信息
 //        //it("getSingleTodo", function() {
 //        //    console.log("********************************   查询某一条待办的详细信息https-post开始   *************************************");
 //        //    return getSingleTodo('admin','5a3c5fe72f5a2810909fab1d').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************  查询某一条待办的详细信息https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //
 //
 //        ////获取指定任务
 //        //it("getTaskquery", function() {
 //        //    console.log("********************************   获取指定任务https-post开始   *************************************");
 //        //    return getTaskquery("5a7fe09de4cae91f2c9ed897").then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   获取指定任务https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        //
 //        ////认领任务
 //        //it("taskaccepto", function() {
 //        //    console.log("********************************  认领任务https-post开始   *************************************");
 //        //    return taskaccepto('5a7fa77c7ae5c52cd42df515','777').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   认领任务https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        //
 //        ////完成任务
 //        //it("taskcomplete", function() {
 //        //    console.log("********************************  完成任务https-post开始   *************************************");
 //        //    var map= {}
 //        //    map.flag="";
 //        //    return taskcomplete('5a7fa77c7ae5c52cd42df515','admin','完成任务测试',JSON.stringify(map),'','').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   完成任务https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        //
 //        ////指派任务给人
 //        //it("assigntask", function() {
 //        //    console.log("********************************  指派任务给人https-post开始   *************************************");
 //        //    return assigntask('id','wenanguo','完成任务测试','19976994015','processDefineDiv_node_2','','').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   指派任务给人https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        ////分公司稽核指派任务
 //        //it("nterimtask", function() {
 //        //    console.log("********************************  分公司稽核指派任务https-post开始   *************************************");
 //        //    return nterimtask('proc_inst_id','task_id','wenanguo','文安国','完成任务测试','19976994015','标题','processDefineDiv_node_2','','').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   分公司稽核指派任务https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        //
 //        //
 //
 //
 //
 //        ////获取已完成的节点编号信息  服务直接崩了
 //        //it("getNodecode", function() {
 //        //    console.log("********************************   获取已完成的节点编号信息https-post开始   *************************************");
 //        //    return getNodecode('5a7fe09de4cae91f2c9ed894').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   获取已完成的节点编号信息https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        ////区县公司调账营业员非销户归档
 //        //it("getPigeonhole", function() {
 //        //    console.log("********************************   区县公司调账营业员非销户归档https-post开始   *************************************");
 //        //    return getPigeonhole('proc_inst_id').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************  区县公司调账营业员非销户归档https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //        //
 //        ////完成任务慧眼系统添加
 //        //it("taskfinish", function() {
 //        //    console.log("********************************  完成任务https-post开始   *************************************");
 //        //    return taskfinish('wenanguo','task_id').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   完成任务https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //
 //        ////任务回退接口
 //        //it("taskback", function() {
 //        //    console.log("********************************  任务回退接口https-post开始   *************************************");
 //        //    return taskback('task_id','wenanguo','完成任务测试','node_code','node_name').then(function(result){
 //        //        console.log(result);
 //        //        console.log("********************************   任务回退接口https-post结束   *************************************");
 //        //        //assert.equal(result.success, true);
 //        //        process = result;
 //        //    });
 //        //});
 //
 //
 //
 //    });
 //});