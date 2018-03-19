var process_model = require('../../bpm_resource/models/process_model');
var model = require('../../bpm_resource/models/process_model');
var model_user=require("../../bpm_resource/models/user_model");
var process_extend_model = require('../../bpm_resource/models/process_extend_model');
var dict_model = require('../../workflow/models/dict_model');
var process_utils = require('../../../utils/process_util');
var ftp_util = require('../../../utils/ftp_util');
var utils = require('../../../../lib/utils/app_utils');
var xlsx = require('node-xlsx');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../../config');
var ObjectID = require('mongodb').ObjectID;
var inst = require('../../bpm_resource/services/instance_service');
var nodeTransferService=require("../../bpm_resource/services/node_transfer_service");

/**
 * 工单列表分页
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getOrderListPage= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '',  {proc_start_time:-1});

    });

    return p;
};

/**
 * 资金稽核工单派单
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.moneyAudit= function(proc_title, user_code,userName,role_name, assign_user_no,proc_vars_parm) {

    var p = new Promise(function(resolve,reject){
        var proc_code = "p_444";
        var proc_vars = JSON.stringify(proc_vars_parm);
        var biz_vars;
        var proc_ver;
        var next_name = "processDefineDiv_node_24";
        process_model.$ProcessDefine.find({"proc_code":proc_code},function(err,res){
            if(err){
                console.log('获取差错工单流程信息失败',err);
                return;
            }else {
                if (res.length > 0) {
                    /** 首先查找差错工单第三节点配置信息，且第三节点只可配置第二配置项**/
                    var proc_name = res[0].proc_name;
                    var proc_define = JSON.parse(res[0].proc_define);
                    var item_config = JSON.parse(res[0].item_config);
                    var lines = proc_define.lines;
                    var nodes = proc_define.nodes;
                    console.log(JSON.stringify(lines));
                    console.log(JSON.stringify(nodes));
                    //第三节点配置信息
                    var three_node_config;
                    //获取开始节点
                    for (let item in nodes) {
                        var node = nodes[item];
                        if (node.type == 'start  round') {
                            //获取第二节点
                            for (let item1 in lines) {
                                var line = lines[item1];
                                if (line.from == item) {
                                    //获取第三节点
                                    for (let item2 in lines) {
                                        var line2 = lines[item2];
                                        if (line2.from == line.to) {
                                            //获取第三节点配置信息
                                            for (let item3 in item_config) {
                                                var node3 = item_config[item3];
                                                if (node3.item_code == line2.to) {
                                                    three_node_config = node3;
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            break;
                        }
                    }

                    console.log(three_node_config);
                    /** 其次根据第三节点配置就是，然后依据每条差错工单的渠道编码查找对应的指派账号，进行工单指派**/
                    if (three_node_config) {
                        //只能配置参照角色
                        if (three_node_config.item_assignee_type == 2) {
                            var node_code = three_node_config.item_code;
                            var memo = '资金稽核派发成功';
                            //创建实例,并生成任务
                            inst.createInstance(proc_code, proc_ver, proc_title, "", proc_vars, biz_vars, user_code, userName, "errorSys_node",next_name)
                                .then(function (result) {
                                    if (result.success) {
                                        var task_id = result.data[0]._id;
                                        //认领任务
                                        inst.acceptTask(task_id, user_code, userName).then(function (rs) {
                                            if (rs.success) {
                                                //  nodeTransferService.assign_transfer(task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(results){
                                                //批量派发
                                                nodeTransferService.do_payout(task_id, node_code, user_code, assign_user_no, proc_title, biz_vars, proc_vars, memo).then(function (results) {
                                                    resolve({'success':true,'code':'1001','msg':'资金稽核派发成功',"data":null,"error":null});

                                                }).catch(function (err_inst) {
                                                    // console.log(err_inst);
                                                    reject({'success':false,'code':'1000','msg':'资金稽核派发失败',"error":err_inst});
                                                });
                                            } else {
                                                reject({'success':false,'code':'1000','msg':'资金稽核派发失败',"error":err_inst});
                                            }
                                        }).catch(function (err_inst) {
                                            // console.log(err_inst);
                                            reject({'success':false,'code':'1000','msg':'资金稽核派发失败',"error":err_inst});
                                        });
                                    } else {
                                        reject({'success':false,'code':'1000','msg':'资金稽核派发失败',"error":err_inst});
                                    }
                                }).catch(function(err){
                                reject({'success':false,'code':'1000','msg':'资金稽核派发失败',"error":err_inst});
                            });
                        }
                    }
                    resolve;
                }
            }
        });
    });

    return p;
};

/**
 * 获取机构人员
 * @returns {Promise}
 */
exports.getOrgPeason= function(orgId) {

    var p = new Promise(function(resolve,reject){
        model_user.$User.find({"user_org":{$in:[ObjectID(orgId)]}},function(err,result){
            if(err){
                console.log('获取机构人员失败',err);
                resolve({'success':false,'code':'1000','msg':'获取机构人员失败',"error":err});
            }else{
                resolve({'success':true,'code':'0000','msg':'获取机构人员成功',"data":result,"error":null});

            }
        });

    });
    return p;
};