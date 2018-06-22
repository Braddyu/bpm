// var assert = require("assert");
// var inst = require('../../server/api/services/instance_service');
// var proc = require('../../server/core/bpm/services/process_service');
// var nodeTransferService=require("../../server/api/services/node_transfer_service");
//
// var proc_code = 't_101';
// var proc_ver = 1;
// var proc_title = '分支流程实例测试用例';
// var user_code = '100001';
// var procdefine = "{\"title\":\"iflow1\",\"nodes\":{\"processDefineDiv_node_1\":{\"name\":\"node_1\",\"left\":87,\"top\":158,\"type\":\"start  round\",\"width\":24,\"height\":24,\"alt\":true},\"processDefineDiv_node_2\":{\"name\":\"申请\",\"left\":183,\"top\":162,\"type\":\"chat\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_4\":{\"name\":\"审核1\",\"left\":334,\"top\":18,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_6\":{\"name\":\"审核2\",\"left\":371,\"top\":125,\"type\":\"node\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_7\":{\"name\":\"审核3\",\"left\":366,\"top\":247,\"type\":\"node\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_9\":{\"name\":\"审核4\",\"left\":318,\"top\":360,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_14\":{\"name\":\"node_14\",\"left\":558,\"top\":200,\"type\":\"end  round\",\"width\":24,\"height\":24,\"alt\":true}},\"lines\":{\"processDefineDiv_line_3\":{\"from\":\"processDefineDiv_node_1\",\"to\":\"processDefineDiv_node_2\",\"name\":\"通过\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_10\":{\"from\":\"processDefineDiv_node_2\",\"to\":\"processDefineDiv_node_4\",\"name\":\"money>=10 && money<=20\",\"type\":\"lr\",\"alt\":true,\"m\":303.5},\"processDefineDiv_line_11\":{\"from\":\"processDefineDiv_node_2\",\"to\":\"processDefineDiv_node_6\",\"name\":\"money>20&&money<=30\",\"type\":\"lr\",\"alt\":true,\"m\":303.5},\"processDefineDiv_line_12\":{\"from\":\"processDefineDiv_node_2\",\"to\":\"processDefineDiv_node_7\",\"name\":\"money>30&&money<=40\",\"type\":\"lr\",\"alt\":true,\"m\":302.5},\"processDefineDiv_line_13\":{\"from\":\"processDefineDiv_node_2\",\"to\":\"processDefineDiv_node_9\",\"name\":\"default\",\"type\":\"lr\",\"alt\":true,\"m\":301.5},\"processDefineDiv_line_15\":{\"from\":\"processDefineDiv_node_4\",\"to\":\"processDefineDiv_node_14\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_16\":{\"from\":\"processDefineDiv_node_6\",\"to\":\"processDefineDiv_node_14\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_17\":{\"from\":\"processDefineDiv_node_7\",\"to\":\"processDefineDiv_node_14\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_18\":{\"from\":\"processDefineDiv_node_9\",\"to\":\"processDefineDiv_node_14\",\"name\":\"\",\"type\":\"sl\",\"alt\":true}},\"areas\":{},\"initNum\":19}";
// var itemconfig = "[{\"_id\":\"594391abff6eed2780eb6cb8\",\"item_code\":\"processDefineDiv_line_3\",\"item_type\":\"sl\",\"item_el\":\"\",\"item_remark\":\"\"},{\"item_code\":\"processDefineDiv_line_10\",\"item_type\":\"lr\",\"item_el\":\"money>=10 && money<=20\",\"item_remark\":\"\",\"_id\":\"59439240ff6eed2780eb6cb9\"},{\"item_code\":\"processDefineDiv_line_11\",\"item_type\":\"lr\",\"item_el\":\"money>20&&money<=30\",\"item_remark\":\"\",\"_id\":\"59439240ff6eed2780eb6cba\"},{\"item_code\":\"processDefineDiv_line_12\",\"item_type\":\"lr\",\"item_el\":\"money>30&&money<=40\",\"item_remark\":\"\",\"_id\":\"59439240ff6eed2780eb6cbb\"},{\"item_code\":\"processDefineDiv_line_13\",\"item_type\":\"lr\",\"item_el\":\"default\",\"item_remark\":\"\",\"_id\":\"59439240ff6eed2780eb6cbc\"},{\"proc_id\":\"594389fbff6eed2780eb6cb6\",\"proc_code\":\"p_102\",\"version\":1,\"proc_define_id\":\"59438a49ff6eed2780eb6cb7\",\"item_code\":\"processDefineDiv_node_4\",\"item_type\":\"task\",\"item_sms_warn\":\"0\",\"item_show_text\":\"总经办\",\"item_assignee_type\":\"2\",\"item_assignee_role\":\"59391795316b851be48e0149\",\"item_assignee_role_code\":\"r_004\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"594389fbff6eed2780eb6cb6\",\"proc_code\":\"p_102\",\"version\":1,\"proc_define_id\":\"59438a49ff6eed2780eb6cb7\",\"item_code\":\"processDefineDiv_node_6\",\"item_type\":\"node\",\"item_sms_warn\":\"0\",\"item_show_text\":\"张三\",\"item_assignee_type\":\"1\",\"item_assignee_user\":\"593917ec316b851be48e014b\",\"item_assignee_user_code\":\"100021\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"594389fbff6eed2780eb6cb6\",\"proc_code\":\"p_102\",\"version\":1,\"proc_define_id\":\"59438a49ff6eed2780eb6cb7\",\"item_code\":\"processDefineDiv_node_7\",\"item_type\":\"node\",\"item_sms_warn\":\"0\",\"item_show_text\":\"总经办\",\"item_assignee_type\":\"2\",\"item_assignee_role\":\"59391795316b851be48e0149\",\"item_assignee_role_code\":\"r_004\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"594389fbff6eed2780eb6cb6\",\"proc_code\":\"p_102\",\"version\":1,\"proc_define_id\":\"59438a49ff6eed2780eb6cb7\",\"item_code\":\"processDefineDiv_node_2\",\"item_type\":\"chat\",\"item_sms_warn\":\"0\",\"item_show_text\":\"文安国\",\"item_assignee_type\":\"1\",\"item_assignee_user\":\"5833af661f6f447482f4e895\",\"item_assignee_user_code\":\"100001\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"594389fbff6eed2780eb6cb6\",\"proc_code\":\"p_102\",\"version\":1,\"proc_define_id\":\"59438a49ff6eed2780eb6cb7\",\"item_code\":\"processDefineDiv_node_9\",\"item_type\":\"task\",\"item_sms_warn\":\"0\",\"item_show_text\":\"审核1\",\"item_assignee_type\":\"3\",\"item_assignee_ref_task\":\"processDefineDiv_node_4\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"}]";
//
// var process,task,accept,complete;
//
// describe('ProcessBranchInstance', function() {
//     describe('#InstanceBranch()', function() {
//         console.log("********************************   分支流程测试用例开始   *************************************");
//         //创建流程基本信息
//         it("createBranchProcess", function() {
//             return proc.createProcess(proc_code,"test_branch",1,"测试用例分支流程")
//                 .then(function(rs){
//                     // console.log("---------------",rs);
//                     assert.equal(rs.success, true);
//                     process = rs;
//                 })
//                 .catch(function(err){
//                     //删除流程基本信息及定义信息
//                      proc.procDelete(proc_code);
//                     console.error("创建流程基本信息错误：",err);
//                     throw new Error(err);
//                 });
//         });
//         //创建流程定义信息
//         it("createBranchProcessDefine", function() {
//             //      //构造流程定义保存参数
//                  var processDefineEntity = {};
//             if(process && process.success){
//                 console.log("----process----",process);
//                 processDefineEntity.proc_id = process.data._id.toString();//流程基本属性ID
//                 processDefineEntity.proc_code = proc_code;//流程编码
//                 processDefineEntity.proc_name = "test_name";//流程名称
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
//                         console.error("创建流程定义信息错误：",err);
//                         // throw new Error(err);
//                     });
//             }else{
//                 console.error("流程基本信息新增异常.....");
//             }
//
//         });
//         //创建并启动流程实例
//         it("createBranchInstance", function() {
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
//         it("acceptBranchTask", function() {
//             if(task && task.success){
//                 var taskid = task.data[0]._doc._id.toString();
//                 var instId = task.data[0]._doc.proc_inst_id;
//                 return inst.acceptTask(taskid,user_code,'文安国')
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
//         it("completeBranchTask", function() {
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
//         it("procBranchTransfer", function() {
//             if(complete && complete.success){
//                 var taskid = task.data[0]._doc._id.toString();
//                 var node_code = task.data[0]._doc.proc_inst_task_code;
//                 var instId = task.data[0]._doc.proc_inst_id;
//                 var conditionMap = {};
//                  conditionMap.money = 40;
//                  //流程流转方法
//                  return nodeTransferService.transfer(taskid,node_code,"100001",true,null,JSON.stringify(conditionMap))
//                     .then(function(rs){
//                         // console.log("---------------",rs);
//                         assert.equal(rs.success, true);
//
//                         //删除流程基本信息及定义信息
//                         proc.procDelete(proc_code);
//                         proc.procDefineDelete(proc_code);
//                         //删除流程实例
//                         inst.instDelete(proc_code);
//                         //删除任务
//                         inst.taskDelete(instId);
//                         console.log("********************************   分支流程测试用例结束   *************************************");
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
//     });
// });