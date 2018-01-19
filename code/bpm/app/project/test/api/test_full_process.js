// var assert = require("assert");
// var inst = require('../../server/api/services/instance_service');
// var proc = require('../../server/core/bpm/services/process_service');
// var nodeTransferService=require("../../server/api/services/node_transfer_service");
// var model_user=require("../../server/core/models/user_model");
// var model=require("../../server/core/bpm/models/process_model");
// var utils = require('../../lib/utils/app_utils');
//
// var proc_code = 't_104';
// var proc_ver = 1;
// var proc_title = '完整流程测试用例';
// var user_code = '100021';
// var procdefine = "{\"title\":\"iflow1\",\"nodes\":{\"processDefineDiv_node_1\":{\"name\":\"开始\",\"left\":13,\"top\":173,\"type\":\"start  round\",\"width\":24,\"height\":24,\"alt\":true},\"processDefineDiv_node_2\":{\"name\":\"通知\",\"left\":285,\"top\":373,\"type\":\"fork\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_3\":{\"name\":\"主管审核\",\"left\":232,\"top\":67,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_4\":{\"name\":\"部门副职\",\"left\":231,\"top\":170,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_5\":{\"name\":\"申请\",\"left\":85,\"top\":167,\"type\":\"chat\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_6\":{\"name\":\"部门正职\",\"left\":219,\"top\":262,\"type\":\"chat\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_7\":{\"name\":\"会签1\",\"left\":419,\"top\":341,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_8\":{\"name\":\"会签2\",\"left\":426,\"top\":413,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_9\":{\"name\":\"会签完毕\",\"left\":567,\"top\":360,\"type\":\"join\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_10\":{\"name\":\"财务审核\",\"left\":492,\"top\":184,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_11\":{\"name\":\"结束\",\"left\":721,\"top\":188,\"type\":\"end  round\",\"width\":24,\"height\":24,\"alt\":true}},\"lines\":{\"processDefineDiv_line_12\":{\"from\":\"processDefineDiv_node_1\",\"to\":\"processDefineDiv_node_5\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_15\":{\"from\":\"processDefineDiv_node_5\",\"to\":\"processDefineDiv_node_3\",\"name\":\"\",\"type\":\"lr\",\"alt\":true,\"m\":209.5},\"processDefineDiv_line_16\":{\"from\":\"processDefineDiv_node_5\",\"to\":\"processDefineDiv_node_4\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_17\":{\"from\":\"processDefineDiv_node_5\",\"to\":\"processDefineDiv_node_6\",\"name\":\"\",\"type\":\"lr\",\"alt\":true,\"m\":208},\"processDefineDiv_line_18\":{\"from\":\"processDefineDiv_node_3\",\"to\":\"processDefineDiv_node_4\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_19\":{\"from\":\"processDefineDiv_node_4\",\"to\":\"processDefineDiv_node_6\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_20\":{\"from\":\"processDefineDiv_node_6\",\"to\":\"processDefineDiv_node_2\",\"name\":\"\",\"type\":\"tb\",\"alt\":true,\"m\":332.5},\"processDefineDiv_line_21\":{\"from\":\"processDefineDiv_node_2\",\"to\":\"processDefineDiv_node_7\",\"name\":\"\",\"type\":\"lr\",\"alt\":true,\"m\":407},\"processDefineDiv_line_22\":{\"from\":\"processDefineDiv_node_2\",\"to\":\"processDefineDiv_node_8\",\"name\":\"\",\"type\":\"lr\",\"alt\":true,\"m\":406.5},\"processDefineDiv_line_23\":{\"from\":\"processDefineDiv_node_8\",\"to\":\"processDefineDiv_node_9\",\"name\":\"\",\"type\":\"lr\",\"alt\":true,\"m\":547.5},\"processDefineDiv_line_24\":{\"from\":\"processDefineDiv_node_7\",\"to\":\"processDefineDiv_node_9\",\"name\":\"\",\"type\":\"lr\",\"alt\":true,\"m\":548},\"processDefineDiv_line_25\":{\"from\":\"processDefineDiv_node_9\",\"to\":\"processDefineDiv_node_6\",\"name\":\"\",\"type\":\"tb\",\"alt\":true,\"m\":314},\"processDefineDiv_line_26\":{\"from\":\"processDefineDiv_node_6\",\"to\":\"processDefineDiv_node_10\",\"name\":\"\",\"type\":\"tb\",\"alt\":true,\"m\":238},\"processDefineDiv_line_27\":{\"from\":\"processDefineDiv_node_10\",\"to\":\"processDefineDiv_node_11\",\"name\":\"\",\"type\":\"sl\",\"alt\":true}},\"areas\":{},\"initNum\":28}";
// var itemconfig = "[{\"_id\":\"595cb30b3beda10924cb0f0e\",\"item_code\":\"processDefineDiv_line_15\",\"item_type\":\"tb\",\"item_el\":\"flag==1\",\"item_remark\":\"\"},{\"_id\":\"595cb30b3beda10924cb0f0f\",\"item_code\":\"processDefineDiv_line_16\",\"item_type\":\"tb\",\"item_el\":\"flag==2\",\"item_remark\":\"\"},{\"_id\":\"595cb30b3beda10924cb0f10\",\"item_code\":\"processDefineDiv_line_17\",\"item_type\":\"sl\",\"item_el\":\"flag==3\",\"item_remark\":\"\"},{\"_id\":\"595cb30b3beda10924cb0f11\",\"item_code\":\"processDefineDiv_line_20\",\"item_type\":\"lr\",\"item_el\":\"flag==true\",\"item_remark\":\"\"},{\"_id\":\"595cb30b3beda10924cb0f12\",\"item_code\":\"processDefineDiv_line_26\",\"item_type\":\"sl\",\"item_el\":\"flag==false\",\"item_remark\":\"\"},{\"_id\":\"595cb30b3beda10924cb0f13\",\"item_code\":\"processDefineDiv_node_5\",\"item_type\":\"chat\",\"item_sms_warn\":0,\"item_assignee_role\":\"56d80e3ca6fbe05a1394ad93\",\"item_assignee_role_code\":\"devpoler\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_assignee_role_name\":\"开发人员\",\"item_assignee_org_ids\":\"594638e77445275f19bb163f\",\"item_assignee_org_names\":\"项目研发室\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_ref_task\":\"\",\"item_assignee_ref_cur_org\":\"\",\"item_assignee_ref_type\":\"\",\"item_assignee_type\":2,\"item_show_text\":\"组织：项目研发室;\\n\\n职务：开发人员;\"},{\"item_code\":\"processDefineDiv_node_3\",\"item_type\":\"task\",\"item_sms_warn\":0,\"item_assignee_ref_task\":\"processDefineDiv_node_5\",\"item_assignee_role\":\"595cafd7e3c7c90e1c599732\",\"item_assignee_role_code\":\"r_014\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_name\":\"部门主管\",\"item_assignee_role_level\":\"2\",\"item_assignee_ref_cur_org\":\"1\",\"item_assignee_ref_type\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"_id\":\"595cb30b3beda10924cb0f14\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_assignee_type\":3,\"item_show_text\":\"参照节点：申请;\\n\\n参照类型：当前机构;\\n\\n当前机构：同级;\\n\\n职务：部门主管;\"},{\"item_code\":\"processDefineDiv_node_4\",\"item_type\":\"task\",\"item_sms_warn\":0,\"item_assignee_ref_task\":\"processDefineDiv_node_3\",\"item_assignee_role\":\"595caf83e3c7c90e1c59972c\",\"item_assignee_role_code\":\"r_012\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_name\":\"部门副职\",\"item_assignee_role_level\":\"2\",\"item_assignee_ref_cur_org\":\"1\",\"item_assignee_ref_type\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"_id\":\"595cb30b3beda10924cb0f15\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_assignee_type\":3,\"item_show_text\":\"参照节点：主管审核;\\n\\n参照类型：当前机构;\\n\\n当前机构：同级;\\n\\n职务：部门副职;\"},{\"_id\":\"595cb30b3beda10924cb0f16\",\"item_code\":\"processDefineDiv_node_2\",\"item_type\":\"fork\",\"item_sms_warn\":0,\"item_assignee_ref_task\":\"processDefineDiv_node_6\",\"item_assignee_role\":\"595cafb1e3c7c90e1c599730\",\"item_assignee_role_code\":\"r_013\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_assignee_role_name\":\"部门正职\",\"item_assignee_ref_cur_org\":\"1\",\"item_assignee_ref_type\":\"1\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_assignee_type\":3,\"item_show_text\":\"参照节点：部门正职;\\n\\n参照类型：当前人;\"},{\"_id\":\"595cb30b3beda10924cb0f17\",\"item_code\":\"processDefineDiv_node_7\",\"item_type\":\"task\",\"item_sms_warn\":0,\"item_assignee_role\":\"56f1f3a278ee01fc4bed1008\",\"item_assignee_role_code\":\"tester\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_assignee_role_name\":\"测试人员\",\"item_assignee_org_ids\":\"594638e77445275f19bb1639,594638e77445275f19bb163f\",\"item_assignee_org_names\":\"项目管控室,项目研发室\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_ref_task\":\"\",\"item_assignee_ref_cur_org\":\"\",\"item_assignee_ref_type\":\"\",\"item_assignee_type\":2,\"item_show_text\":\"组织：项目管控室,项目研发室;\\n\\n职务：测试人员;\"},{\"_id\":\"595cb30b3beda10924cb0f18\",\"item_code\":\"processDefineDiv_node_8\",\"item_type\":\"task\",\"item_sms_warn\":0,\"item_assignee_role\":\"59391760316b851be48e0145\",\"item_assignee_role_code\":\"r_003\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_assignee_role_name\":\"采购管理\",\"item_assignee_org_ids\":\"594638e77445275f19bb1644\",\"item_assignee_org_names\":\"综合业务部\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_ref_task\":\"\",\"item_assignee_ref_cur_org\":\"\",\"item_assignee_ref_type\":\"\",\"item_assignee_type\":2,\"item_show_text\":\"组织：综合业务部;\\n\\n职务：采购管理;\"},{\"item_code\":\"processDefineDiv_node_9\",\"item_type\":\"join\",\"item_sms_warn\":0,\"item_assignee_ref_task\":\"processDefineDiv_node_6\",\"item_assignee_role\":\"595cafb1e3c7c90e1c599730\",\"item_assignee_role_code\":\"r_013\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_name\":\"部门正职\",\"item_assignee_role_level\":\"2\",\"item_assignee_ref_cur_org\":\"1\",\"item_assignee_ref_type\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"_id\":\"595cb30b3beda10924cb0f19\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_assignee_type\":3,\"item_show_text\":\"参照节点：部门正职;\\n\\n参照类型：当前机构;\\n\\n当前机构：同级;\\n\\n职务：部门正职;\"},{\"_id\":\"595cb30b3beda10924cb0f1a\",\"item_code\":\"processDefineDiv_node_10\",\"item_type\":\"task\",\"item_sms_warn\":0,\"item_assignee_role\":\"59391760316b851be48e0145\",\"item_assignee_role_code\":\"r_003\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_assignee_role_name\":\"采购管理\",\"item_assignee_org_ids\":\"594638e77445275f19bb1647\",\"item_assignee_org_names\":\"财务部\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_ref_task\":\"\",\"item_assignee_ref_cur_org\":\"\",\"item_assignee_ref_type\":\"\",\"item_assignee_type\":2,\"item_show_text\":\"组织：财务部;\\n\\n职务：采购管理;\"},{\"proc_id\":\"595cabc83beda10924cb0f0c\",\"proc_code\":\"p_107\",\"version\":1,\"proc_define_id\":\"595cb1d03beda10924cb0f0d\",\"item_code\":\"processDefineDiv_node_6\",\"item_type\":\"chat\",\"item_sms_warn\":\"0\",\"item_show_text\":\"参照节点：部门副职;\\n\\n参照类型：当前机构;\\n\\n当前机构：同级;\\n\\n职务：部门正职;\",\"item_assignee_type\":\"3\",\"item_assignee_ref_task\":\"processDefineDiv_node_4\",\"item_assignee_role\":\"595cafb1e3c7c90e1c599730\",\"item_assignee_role_code\":\"r_013\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_assignee_role_name\":\"部门正职\",\"item_assignee_ref_cur_org\":\"1\",\"item_assignee_ref_type\":\"2\",\"item_assignee_org_ids\":\"\",\"item_assignee_org_names\":\"\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"}]";
//
// var process,task,accept,complete;
//
// var params = {}
// // params.processDefineDiv_node_5 = { "flag": 3 }
// params.processDefineDiv_node_6 = { "flag": true };
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
//
// function testFullTransfer(instId){
//     var p = new Promise(function(resolve,reject) {
//         fullTransfer(instId,function(result){
//             resolve(result);
//         })
//     });
//     return p;
// }
//
// function fullTransfer(instId,cb){
//     // var p = new Promise(function(resolve,reject) {
//         model.$ProcessInst.find({"$or":[{"_id":instId},{"parent_proc_inst_id":instId}]},function(err,ress){
//             if(err){
//                 console.error("查询流程实例异常.....");
//                 cb(utils.returnMsg(false, '1000', '查询流程实例异常', null, err));
//             }else{
//                 if(ress.length > 0){
//                     var instIdArr = [];
//                     for(var i = 0;i<ress.length;i++){
//                         instIdArr.push(ress[i]._doc._id.toString());
//                     }
//                     //根据实例ID查找未处理的任务数据
//                     model.$ProcessInstTask.find({"proc_inst_id" :{"$in":instIdArr},"proc_inst_task_status":0},function(error,results){
//                         if(error){
//                             console.error("查询任务异常.....");
//                             cb(utils.returnMsg(false, '1000', '查询任务异常', null, error));
//                         }else{
//                             var map = {};
//                             var tidArr = [];
//                             console.log(results);
//                             if(results.length == 0){
//                                 tidArr = [];
//                                 console.log("流程流转完成....");
//                                 console.log("********************************   完整流程测试用例结束   *************************************");
//                                 // assert(true,true);
//                                 //删除流程基本信息及定义信息
//                                 // proc.procDelete(proc_code);
//                                 // proc.procDefineDelete(proc_code);
//                                 //删除流程实例
//                                 // inst.instDelete(proc_code);
//                                 //删除任务
//                                 // inst.taskDelete(instIdArr);
//                                 // resolve(utils.returnMsg(true, '0000', '流转完成', null, null));
//                                 cb(utils.returnMsg(true, '0000', '流转完成', null, null));
//                             }else if(results.length == 1){
//                                 tidArr.push(results[0]._id);
//
//                             }else if(results.length > 1){
//                                 for(var i=0;i<results.length;i++){
//                                     tidArr.push(results[i]._id);
//                                 }
//                             }
//                             console.log("tidArr====",tidArr);
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
//                                                         fullTransfer(instId,cb);
//
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
//                                     }).catch(function(err){
//                                         //删除流程基本信息及定义信息
//                                         // proc.procDelete(proc_code);
//                                         console.error("认领、完成任务错误：",err);
//                                         throw new Error(err);
//                                     });
//                                 }).catch(function(err){
//                                     //删除流程基本信息及定义信息
//                                     // proc.procDelete(proc_code);
//                                     console.error("查询用户信息错误：",err);
//                                     throw new Error(err);
//                                 });
//                             }else{
//                                 cb(utils.returnMsg(true, '0000', '流转完成', null, null));
//                             }
//                         }
//                     });
//                 }
//             }
//         });
//
//     // });
//     // return p;
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
//         model_user.$User.find(condition,function(errs,res){
//             if(errs){
//                 console.log(errs);
//                 resolve(new Array());
//             }else{
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
//             if(result.success){
//                 inst.completeTaskList(tarr)
//                     .then(function(rs){
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
//
//
// // describe('ProcessFullInstance', function() {
//     describe('#InstanceFull()', function() {
//         console.log("********************************   完整流程测试用例开始   *************************************");
//         //创建流程基本信息
//         it("createFullProcess", function() {
//             return proc.createProcess(proc_code,"test_full",1,"测试用例完整流程")
//                 .then(function(rs){
//                     // console.log("---------------",rs);
//                     assert.equal(rs.success, true);
//                     process = rs;
//                 })
//                 .catch(function(err){
//                     //删除流程基本信息及定义信息
//                      proc.procDelete(proc_code);
//                     console.error("创建完整流程基本信息错误：",err);
//                     throw new Error(err);
//                 });
//         });
//         //创建流程定义信息
//         it("createFullProcessDefine", function() {
//             //      //构造流程定义保存参数
//                  var processDefineEntity = {};
//             if(process && process.success){
//                 // console.log("----process----",process);
//                 processDefineEntity.proc_id = process.data._id.toString();//流程基本属性ID
//                 processDefineEntity.proc_code = proc_code;//流程编码
//                 processDefineEntity.proc_name = "test_full";//流程名称
//                 processDefineEntity.version = 1;//流程版本号
//                 processDefineEntity.proc_define = procdefine;//流程图定义信息
//                 processDefineEntity.opt_time = new Date();
//                 processDefineEntity.opt_user = '';//req.session.current_user.user_name;
//                 processDefineEntity.status = 1;
//                 processDefineEntity.item_config = itemconfig;
//                 return proc.saveProcessDefine(processDefineEntity).then(function(rs){
//                         // console.log("---------------",rs);
//                         assert.equal(rs.success, true);
//                     })
//                     .catch(function(err){
//                         //删除流程基本信息及定义信息
//                         proc.procDelete(proc_code);
//                         proc.procDefineDelete(proc_code);
//                         console.error("创建完整流程定义信息错误：",err);
//                         // throw new Error(err);
//                     });
//             }else{
//                 console.error("创建完整流程定义异常.....");
//             }
//
//         });
//         //创建并启动流程实例
//         it("createFullInstance", function() {
//             if(process && process.success) {
//                 return inst.createInstance(proc_code, proc_ver, proc_title, user_code,'')
//                     .then(function (rs) {
//                         // console.log("---------------",rs);
//                         assert.equal(rs.success, true);
//                         task = rs;
//                     })
//                     .catch(function (err) {
//                         //删除流程基本信息及定义信息
//                         proc.procDelete(proc_code);
//                         proc.procDefineDelete(proc_code);
//                         //删除流程实例
//                         inst.instDelete(proc_code);
//                         console.error("创建并启动流程实例错误：", err);
//                         // throw new Error(err);
//                     });
//             }else{
//                 console.error("流程定义信息新增异常.....");
//             }
//         });
//         //任务认领
//         it("acceptFullTask", function() {
//             if(task && task.success){
//                 var taskid = task.data[0]._doc._id.toString();
//                 var instId = task.data[0]._doc.proc_inst_id;
//                 return inst.acceptTask(taskid,user_code,'张三')
//                     .then(function(rs){
//                         // console.log("---------------",rs);
//                         assert.equal(rs.success, true);
//                         accept = rs;
//                     })
//                     .catch(function(err){
//                         //删除流程基本信息及定义信息
//                         proc.procDelete(proc_code);
//                         proc.procDefineDelete(proc_code);
//                         //删除流程实例
//                         inst.instDelete(proc_code);
//                         //删除任务
//                          inst.taskDelete(instId);
//                         console.error("认领任务错误：",err);
//                         // throw new Error(err);
//                     });
//             }else{
//                 console.log("创建实例异常.....");
//             }
//         });
//         //任务完成
//         it("completeFullTask", function() {
//             if(accept && accept.success){
//                 var taskid = task.data[0]._doc._id.toString();
//                 var instId = task.data[0]._doc.proc_inst_id;
//                 return inst.completeTask(taskid)
//                     .then(function(rs){
//                         // console.log("---------------",rs);
//                         assert.equal(rs.success, true);
//                         complete = rs;
//                     })
//                     .catch(function(err){
//                         //删除流程基本信息及定义信息
//                         proc.procDelete(proc_code);
//                         proc.procDefineDelete(proc_code);
//                         //删除流程实例
//                         inst.instDelete(proc_code);
//                         //删除任务
//                         inst.taskDelete(instId);
//                         console.error("完成任务错误：",err);
//                         // throw new Error(err);
//                     });
//             }else{
//                 console.log("认领任务异常.....");
//             }
//         });
//         //流程流转
//         it("procFullTransfer", function() {
//             if(complete && complete.success){
//                 var taskid = task.data[0]._doc._id.toString();
//                 var node_code = task.data[0]._doc.proc_inst_task_code;
//                 var instId = task.data[0]._doc.proc_inst_id;
//                 var param = {};
//                 param.flag = 1;
//                  //流程流转方法
//                  return nodeTransferService.transfer(taskid,node_code,"100021",true,null,JSON.stringify(param))
//                     .then(function(rs){
//                         // console.log("---------------",rs);
//                         assert.equal(rs.success, true);
//
//                     })
//                     .catch(function(err){
//                         //删除流程基本信息及定义信息
//                         proc.procDelete(proc_code);
//                         proc.procDefineDelete(proc_code);
//                         //删除流程实例
//                         inst.instDelete(proc_code);
//                         //删除任务
//                         inst.taskDelete(instId);
//                         console.error("流程流转错误：",err);
//                         // throw new Error(err);
//                     });
//             }else{
//                 console.log("完成任务异常.....");
//             }
//         });
//
//         //全流程流转
//         it("procIntactTransfer", function(done) {
//             if(complete && complete.success){
//                 this.timeout(13000);
//                 var instId = task.data[0]._doc.proc_inst_id;
//                  //流程流转方法
//                return testFullTransfer(instId).then(function(result){
//                     console.log("=====result=====",result);
//                     assert.equal(result.success, true);
//                     done();
//                 });
//             }else{
//                 console.log("完成任务异常.....");
//             }
//         });
//     });
// // });