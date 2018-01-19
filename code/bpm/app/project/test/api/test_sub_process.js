// var assert = require("assert");
// var inst = require('../../server/api/services/instance_service');
// var proc = require('../../server/core/bpm/services/process_service');
// var nodeTransferService=require("../../server/api/services/node_transfer_service");
//
// var proc_code = 't_102';
// var proc_ver = 1;
// var proc_title = '子流程实例测试用例';
// var user_code = '100021';
// var procdefine = "{\"title\":\"iflow1\",\"nodes\":{\"processDefineDiv_node_1\":{\"name\":\"开始\",\"left\":35,\"top\":187,\"type\":\"start  round\",\"width\":24,\"height\":24,\"alt\":true},\"processDefineDiv_node_3\":{\"name\":\"采购申请\",\"left\":102,\"top\":183,\"type\":\"fork\",\"width\":102,\"height\":33,\"alt\":true},\"processDefineDiv_node_4\":{\"name\":\"财务审核\",\"left\":277,\"top\":115,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_5\":{\"name\":\"综合审核\",\"left\":278,\"top\":178,\"type\":\"task\",\"width\":103,\"height\":29,\"alt\":true},\"processDefineDiv_node_6\":{\"name\":\"采购审核\",\"left\":286,\"top\":290,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_8\":{\"name\":\"总经办审核\",\"left\":724,\"top\":192,\"type\":\"join\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_9\":{\"name\":\"结束\",\"left\":861,\"top\":187,\"type\":\"end  round\",\"width\":24,\"height\":24,\"alt\":true},\"processDefineDiv_node_22\":{\"name\":\"财务三级经理\",\"left\":425,\"top\":113,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_23\":{\"name\":\"财务二级经理\",\"left\":591,\"top\":108,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_24\":{\"name\":\"综合二级经理\",\"left\":450,\"top\":181,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true}},\"lines\":{\"processDefineDiv_line_18\":{\"from\":\"processDefineDiv_node_8\",\"to\":\"processDefineDiv_node_9\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_19\":{\"from\":\"processDefineDiv_node_1\",\"to\":\"processDefineDiv_node_3\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_26\":{\"from\":\"processDefineDiv_node_3\",\"to\":\"processDefineDiv_node_4\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_27\":{\"from\":\"processDefineDiv_node_4\",\"to\":\"processDefineDiv_node_22\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_28\":{\"from\":\"processDefineDiv_node_22\",\"to\":\"processDefineDiv_node_23\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_29\":{\"from\":\"processDefineDiv_node_23\",\"to\":\"processDefineDiv_node_8\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_30\":{\"from\":\"processDefineDiv_node_3\",\"to\":\"processDefineDiv_node_5\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_31\":{\"from\":\"processDefineDiv_node_5\",\"to\":\"processDefineDiv_node_24\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_32\":{\"from\":\"processDefineDiv_node_24\",\"to\":\"processDefineDiv_node_8\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_33\":{\"from\":\"processDefineDiv_node_3\",\"to\":\"processDefineDiv_node_6\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_34\":{\"from\":\"processDefineDiv_node_6\",\"to\":\"processDefineDiv_node_8\",\"name\":\"\",\"type\":\"sl\",\"alt\":true}},\"areas\":{},\"initNum\":35}";
// var itemconfig = "[{\"proc_id\":\"5948d48c1e44341d089e29a4\",\"proc_code\":\"p_104\",\"version\":1,\"proc_define_id\":\"5948db4b7889d32380695e29\",\"item_code\":\"processDefineDiv_node_3\",\"item_type\":\"fork\",\"item_sms_warn\":\"0\",\"item_show_text\":\"张三\",\"item_assignee_type\":\"1\",\"item_assignee_user\":\"593917ec316b851be48e014b\",\"item_assignee_user_name\":\"\",\"item_assignee_user_code\":\"100021\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"5948d48c1e44341d089e29a4\",\"proc_code\":\"p_104\",\"version\":1,\"proc_define_id\":\"5948db4b7889d32380695e29\",\"item_code\":\"processDefineDiv_node_4\",\"item_type\":\"task\",\"item_sms_warn\":\"0\",\"item_show_text\":\"周袁弘\",\"item_assignee_type\":\"1\",\"item_assignee_user\":\"56f4face6d7364a8369c0328\",\"item_assignee_user_name\":\"\",\"item_assignee_user_code\":\"zhouyuanhong\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"5948d48c1e44341d089e29a4\",\"proc_code\":\"p_104\",\"version\":1,\"proc_define_id\":\"5948db4b7889d32380695e29\",\"item_code\":\"processDefineDiv_node_22\",\"item_type\":\"task\",\"item_sms_warn\":\"0\",\"item_show_text\":\"部门经理\",\"item_assignee_type\":\"2\",\"item_assignee_role\":\"593680e521f3ca18047839cf\",\"item_assignee_role_code\":\"r_101\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"5948d48c1e44341d089e29a4\",\"proc_code\":\"p_104\",\"version\":1,\"proc_define_id\":\"5948db4b7889d32380695e29\",\"item_code\":\"processDefineDiv_node_23\",\"item_type\":\"task\",\"item_sms_warn\":\"0\",\"item_show_text\":\"处室经理\",\"item_assignee_type\":\"2\",\"item_assignee_role\":\"5936806a21f3ca18047839cb\",\"item_assignee_role_code\":\"r_100\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"5948d48c1e44341d089e29a4\",\"proc_code\":\"p_104\",\"version\":1,\"proc_define_id\":\"5948db4b7889d32380695e29\",\"item_code\":\"processDefineDiv_node_5\",\"item_type\":\"task\",\"item_sms_warn\":\"0\",\"item_show_text\":\"演示用户\",\"item_assignee_type\":\"1\",\"item_assignee_user\":\"57344d083a256bf91e524f63\",\"item_assignee_user_name\":\"\",\"item_assignee_user_code\":\"50001\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"5948d48c1e44341d089e29a4\",\"proc_code\":\"p_104\",\"version\":1,\"proc_define_id\":\"5948db4b7889d32380695e29\",\"item_code\":\"processDefineDiv_node_24\",\"item_type\":\"task\",\"item_sms_warn\":\"0\",\"item_show_text\":\"孙继军\",\"item_assignee_type\":\"1\",\"item_assignee_user\":\"56f4fae86d7364a8369c032e\",\"item_assignee_user_name\":\"\",\"item_assignee_user_code\":\"sunjijun\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"5948d48c1e44341d089e29a4\",\"proc_code\":\"p_104\",\"version\":1,\"proc_define_id\":\"5948db4b7889d32380695e29\",\"item_code\":\"processDefineDiv_node_6\",\"item_type\":\"task\",\"item_sms_warn\":\"0\",\"item_show_text\":\"测试人员\",\"item_assignee_type\":\"2\",\"item_assignee_role\":\"56f1f3a278ee01fc4bed1008\",\"item_assignee_role_code\":\"tester\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"},{\"proc_id\":\"5948d48c1e44341d089e29a4\",\"proc_code\":\"p_104\",\"version\":1,\"proc_define_id\":\"5948db4b7889d32380695e29\",\"item_code\":\"processDefineDiv_node_8\",\"item_type\":\"join\",\"item_sms_warn\":\"0\",\"item_show_text\":\"总经办\",\"item_assignee_type\":\"2\",\"item_assignee_role\":\"59391795316b851be48e0149\",\"item_assignee_role_code\":\"r_004\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":\"\",\"item_overtime_afterAction_type\":\"\",\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":\"\",\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\"}]";
//
// var process,task,accept,complete;
//
// describe('ProcessSubInstance', function() {
//     describe('#InstanceSub()', function() {
//         console.log("********************************   子流程测试用例开始   *************************************");
//         //创建流程基本信息
//         it("createSubProcess", function() {
//             return proc.createProcess(proc_code,"test_sub",1,"测试用例子流程")
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
//         it("createSubProcessDefine", function() {
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
//         it("createSubInstance", function() {
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
//         it("acceptSubTask", function() {
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
//         it("completeSubTask", function() {
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
//         it("procSubTransfer", function() {
//             if(complete && complete.success){
//                 var taskid = task.data[0]._doc._id.toString();
//                 var node_code = task.data[0]._doc.proc_inst_task_code;
//                 var instId = task.data[0]._doc.proc_inst_id;
//                  //流程流转方法
//                  return nodeTransferService.transfer(taskid,node_code,"100021",true,null,null)
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
//                         console.log("********************************   子流程测试用例结束   *************************************");
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