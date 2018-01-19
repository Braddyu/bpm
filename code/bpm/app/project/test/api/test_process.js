// var assert = require("assert");
// var inst = require('../../server/api/services/instance_service');
// var proc = require('../../server/core/bpm/services/process_service');
// var nodeTransferService=require("../../server/api/services/node_transfer_service");
//
// var proc_code = 't_100';
// var proc_ver = 1;
// var proc_title = '顺序流程实例测试用例';
// var user_code = 'gongli';
// var instId='';
// var procdefine = "{\"title\":\"iflow1\",\"nodes\":{\"processDefineDiv_node_1\":{\"name\":\"开始\",\"left\":86,\"top\":121,\"type\":\"start  round\",\"width\":24,\"height\":24,\"alt\":true},\"processDefineDiv_node_2\":{\"name\":\"采购申请\",\"left\":179,\"top\":122,\"type\":\"task\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_3\":{\"name\":\"总经办审核\",\"left\":337,\"top\":123,\"type\":\"chat\",\"width\":102,\"height\":30,\"alt\":true},\"processDefineDiv_node_4\":{\"name\":\"结束\",\"left\":517,\"top\":127,\"type\":\"end  round\",\"width\":24,\"height\":24,\"alt\":true}},\"lines\":{\"processDefineDiv_line_5\":{\"from\":\"processDefineDiv_node_1\",\"to\":\"processDefineDiv_node_2\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_6\":{\"from\":\"processDefineDiv_node_2\",\"to\":\"processDefineDiv_node_3\",\"name\":\"\",\"type\":\"sl\",\"alt\":true},\"processDefineDiv_line_7\":{\"from\":\"processDefineDiv_node_3\",\"to\":\"processDefineDiv_node_4\",\"name\":\"\",\"type\":\"sl\",\"alt\":true}},\"areas\":{},\"initNum\":9}";
// var itemconfig = "[{\"_id\":\"593d0bbc58b60c0748e8d0f6\",\"item_code\":\"processDefineDiv_line_5\",\"item_type\":\"sl\",\"item_el\":\"\",\"item_remark\":\"\",\"proc_code\":\"t_100\"},{\"item_code\":\"processDefineDiv_node_2\",\"item_type\":\"task\",\"item_sms_warn\":0,\"item_assignee_user\":\"56f4f15c08d4ef302d0a15c1\",\"item_assignee_user_code\":\"gongli\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":null,\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"_id\":\"593d0bd258b60c0748e8d0f7\",\"item_assignee_role\":\"\",\"item_assignee_role_code\":\"\",\"item_assignee_role_tag\":\"\",\"item_assignee_role_level\":\"\",\"item_assignee_ref_task\":\"\",\"item_assignee_type\":1,\"item_show_text\":\"龚利\",\"proc_code\":\"t_100\"},{\"item_code\":\"processDefineDiv_node_3\",\"item_type\":\"chat\",\"item_sms_warn\":0,\"item_assignee_role\":\"59391795316b851be48e0149\",\"item_assignee_role_code\":\"r_004\",\"item_assignee_role_tag\":\"1\",\"item_assignee_role_level\":\"2\",\"item_step_code\":\"\",\"item_code_num\":\"\",\"item_overtime\":null,\"item_overtime_afterAction_type\":null,\"item_overtime_afterAction_info\":\"\",\"item_touchEvent_type\":null,\"item_touchEvent_info\":\"\",\"item_filePath\":\"\",\"item_funName\":\"\",\"item_remark\":\"\",\"_id\":\"593d100d99446e00b899c2b1\",\"item_assignee_user\":\"\",\"item_assignee_user_code\":\"\",\"item_assignee_ref_task\":\"\",\"item_assignee_type\":2,\"item_show_text\":\"总经办\",\"proc_code\":\"t_100\"}]";
//
// var process,task,accept,complete;
//
// describe('ProcessInstance', function() {
//     describe('#Instance()', function() {
//         console.log("********************************   顺序流程测试用例开始   *************************************");
//         //创建流程基本信息
//         it("createProcess", function() {
//             return proc.createProcess(proc_code,"test_name",1,"测试用例顺序流程")
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
//         it("createProcessDefine", function() {
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
//         it("createInstance", function() {
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
//         it("acceptTask", function() {
//             if(task && task.success){
//                 var taskid = task.data[0]._doc._id.toString();
//                 var instId = task.data[0]._doc.proc_inst_id;
//                 return inst.acceptTask(taskid,user_code,'龚莉')
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
//         it("completeTask", function() {
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
//         it("procTransfer", function() {
//             if(complete && complete.success){
//                 var taskid = task.data[0]._doc._id.toString();
//                 var node_code = task.data[0]._doc.proc_inst_task_code;
//                 var instId = task.data[0]._doc.proc_inst_id;
//                 var conditionMap = {};
//                  conditionMap.m = 40;
//                  //流程流转方法
//                  return nodeTransferService.transfer(taskid,node_code,"100021",true,null,JSON.stringify(conditionMap))
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
//                         console.log("********************************   顺序流程测试用例结束   *************************************");
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
//
//         });
//
//
//     });
// });