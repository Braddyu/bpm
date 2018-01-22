// var inst = require('../server/api/services/instance_service');
// var proc = require('../server/core/bpm/services/process_service');
// var nodeTransferService=require("../server/api/services/node_transfer_service");
// var model_user=require("../server/core/models/user_model");
// var model=require("../server/core/bpm/models/process_model");
//
// var params = {};
// // params.processDefineDiv_node_5 = { "flag": 3 }
// params.processDefineDiv_node_6 = { "flag": true };
//
// //根据实例ID查找未处理的任务数据
// model.$ProcessInstTask.find({"proc_inst_id" :{"$in":[ '5964bd872b489722245e01f7',
//     '5964bdba5e142524d0078d7d',
//     '5964bdba5e142524d0078d7e' ]},"proc_inst_task_status":0},function(error,results){
//     console.log(results);
// });

var nodegrass = require("nodegrass");
var host="127.0.0.1";
var port="30002";
// var host="10.201.253.162";
// var port="30003";

var REQ_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

var bizv={};
bizv.bizid = '12432354235234';
bizv.tablename = 'test';
var procv = {};
procv.bizid = '2348723942';
var paras = {};
paras.flag = true;



// nodegrass.post("http://"+host+":"+port+"/v1/task/complete",
//     function (res, status, headers) {
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {id: '59f2f014329abd15b093d9ab',memo:'烦烦烦烦烦烦烦烦烦烦烦烦烦烦烦', user_no: '1',params:JSON.stringify(paras),biz_vars:JSON.stringify(bizv),time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'启动流程实例异常'});
// });


// nodegrass.post("http://"+host+":"+port+"/v1/instance/createInstance",
//     function (res, status, headers) {
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {proc_code: 'p_107',title:'完整流程测试', user_no: '00000',biz_vars:JSON.stringify(bizv),proc_vars:JSON.stringify(procv),time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'启动流程实例异常'});
// });

// nodegrass.post("http://"+host+":"+port+"/v1/instance/createAndAcceptAssign",
//     function (res, status, headers) {
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {proc_code: 'p-108',title:'10月21日超低购4G+手机合约活动（5月17日至11月30日） 渠道业务预警工单', user_no: '8673',assign_user_no:'zhouyuanhong',user_name:'PAN系统管理员',node_code:'processDefineDiv_node_2',biz_vars:JSON.stringify(bizv),time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'启动流程实例异常'});
// });
// nodegrass.post("http://"+host+":"+port+"/v1/task/logs",
//     function (res, status, headers) {
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {inst_id: '5987fc84810a7700110fda26', user_no: '',time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'获处理日志数据异常'});
// });
//nodegrass.post("http://"+host+":"+port+"/v1/task/log/list",
//    function (res, status, headers) {
//        var json = JSON.parse(res);
//
//        console.log("json===",json);
//    },
//    REQ_HEADERS,
//    {status: '0', user_no: '',begin_date:'2017-10-10',end_date:'2017-10-19',time:new Date()},
//    'utf8').on('error', function (e) {
//    console.log("Got error: " + e.message);
//    resolve({'success':false,'code':'1000','msg':'获处理日志数据异常'});
//});

// "http://192.168.1.105:3002/v1/task/payout"
// nodegrass.post("http://"+host+":"+port+"/v1/task/payout",
//     function (res, status, headers) {
//         console.log('-------------------',res);
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {task_id:'59f96452a64d980c58a2338a',node_code:'processDefineDiv_node_2',proc_title:'10月21日超低购4G+手机合约活动（5月17日至11月30日） 渠道业务预警工单',assign_user_no:'SGS_0001',userName:'系统管理员',biz_vars:'',proc_vars:'',memo:'11233',time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'获处理日志数据异常'});
// });



// nodegrass.post("http://"+host+":"+port+"/v1/instance/createAndAcceptAssign",
//     function (res, status, headers) {
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {proc_code: 'p-108',title:'深度稽核派单测试', user_no: '00000',assign_user_no:'70001,00007,71000,zhouyuanhong',user_name:'测试',node_code:'processDefineDiv_node_3',biz_vars:JSON.stringify(bizv),time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'启动流程实例异常'});
// });

// nodegrass.post("http://"+host+":"+port+"/v1/task/assign/interim_task",
//     function (res, status, headers) {
//         console.log('-------------------',res);
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {inst_id:'59ef093908a13b001152f838',node_code:'processDefineDiv_node_2',user_no:'60001',user_name:'主管',time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'获处理日志数据异常'});
// });


// nodegrass.post("http://"+host+":"+port+"/v1/task/assign/task",
//     function (res, status, headers) {
//         console.log('-------------------',res);
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {proc_inst_id:'59f2efd9d6c8af001184cf25',task_id:'59f2ff4d49dd66103cefb74b',node_code:'processDefineDiv_node_3',user_code:'1',user_name:'系统管理员',assign_user_no:'7539',proc_title:'超低购4G+手机合约活动（5月17日至11月30日） 指标预警',biz_vars:'',
//         proc_vars:'{\\"time\\":\\"20171021\\",\\"type\\":\\"1\\",\\"remark\\":\\"超低购4G+手机合约活动（5月17日至11月30日）@28元套餐8元购[策划];38元套餐8元购[策划];58元套餐8元购[策划]@凤冈县龙泉镇和平路永诚手机专卖店(KF)\\"}',memo:'ni hao ',time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'获处理日志数据异常'});
// });


// nodegrass.post("http://"+host+":"+port+"/v1/task/batch",
//     function (res, status, headers) {
//         console.log('-------------------',res);
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {user_no:'60001',user_name:'主管',proc_inst_id:'59eff4912bc4100011cddf16',time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'获处理日志数据异常'});
// });

// nodegrass.post("http://"+host+":"+port+"/v1/task/query",
//     function (res, status, headers) {
//         console.log('-------------------',res);
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {taskId:'59fad762162df30011f527e1',flag:'1',time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'获处理日志数据异常'});
// });
//
// nodegrass.post("http://"+host+":"+port+"/gdgl/api/task/todo",
//     function (res, status, headers) {
//         console.log('-------------------',res);
//         var json = JSON.parse(res);
//
//         console.log("json===",json);
//     },
//     REQ_HEADERS,
//     {user_no:'13984126789',page:'1',rows:'20',time:new Date()},
//     'utf8').on('error', function (e) {
//     console.log("Got error: " + e.message);
//     resolve({'success':false,'code':'1000','msg':'获处理日志数据异常'});
// });

// var service = require("../services/instance_service");
// service.do_payout('59c0e0899f5f8b001190b6e6');