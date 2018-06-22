var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/money_audit_list_service2');
var inst = require('../../bpm_resource/services/instance_service');
var nodeTransferService=require("../../bpm_resource/services/node_transfer_service");
var userService = require('../../workflow/services/user_service');
var nodeAnalysisService=require("../../bpm_resource/services/node_analysis_service");
var config = require('../../../../config');
var multer = require('multer')
var upload = multer({ dest: config.local_path });
var process_extend_model = require('../../bpm_resource/models/process_extend_model');
var fs = require('fs');
var path = require('path');
var urlencode = require('urlencode');

/**
 * 资金稽核工单列表
 */
router.route('/list').post(function(req,res){
    console.log(req.session.current_user);
    console.log("开始获取所有工单列表...");
    var userNo = req.session.current_user.user_no;//用户编号
    var page = req.body.page;
    var size = req.body.rows;
    var work_order_number = req.body.work_order_number;

    var proc_code = "zj_102";//流程编码
    //var proc_peason_type = req.body.proc_peason_type;//流程编码
    //var startDate = req.body.startDate;//创建时间
    //var endDate = req.body.endDate;//创建时间
    var conditionMap = {proc_start_user:userNo};
    if(proc_code){
        conditionMap.proc_code=proc_code;
    }
    if(work_order_number){
        conditionMap.work_order_number=work_order_number;
    }
    //var compare={};
    ////开始时间
    //if(startDate){
    //    compare['$gte']=new Date(startDate);
    //}
    ////结束时间
    //if(endDate){
    //    //结束时间追加至当天的最后时间
    //    compare['$lte']=new Date(endDate+' 23:59:59');
    //}
    ////时间查询
    //if(!isEmptyObject(compare)){
    //    conditionMap['proc_start_time']=compare;
    //}


    // 调用分页
    service.getOrderListPage(page,size,conditionMap)
        .then(function(result){
           // console.log("获取所有工单列表成功"+result);
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取所有工单列表失败',err);

        });
})

/**
 * 资金稽核工单派单
 */
router.route('/moneyAudit').post(function(req,res){

    var assign_user_no= req.body.assign_user_no;//稽核状态
    var proc_title= req.body.proc_title;//业务名称
    var proc_inst_name= req.body.proc_inst_name;//业务名称
    var work_day= req.body.work_day;//业务名称
    var start_time= req.body.start_time;//业务名称
    var end_time= req.body.end_time;//业务名称
    var proc_content= req.body.proc_content;//业务名称
    var orgId= req.body.orgId;//机构id
    var proc_vars_parm = {};
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+JSON.stringify(req.body))
    proc_vars_parm.proc_title=proc_title;
    proc_vars_parm.proc_inst_name=proc_inst_name;
    proc_vars_parm.work_day=work_day;
    proc_vars_parm.start_time=start_time;
    proc_vars_parm.end_time=end_time;
    proc_vars_parm.proc_content=proc_content;

    var user_no=req.session.current_user.user_no;
    var user_name=req.session.current_user.user_name;
    var role_name="资金稽核负责人";
    proc_vars_parm.role_name=role_name;
    proc_vars_parm.user_name=user_name;
    proc_vars_parm.user_no=user_no;

    service.moneyAudit(proc_title, user_no,user_name,role_name, assign_user_no,proc_vars_parm,orgId)
        .then(function(result){
            console.log("派发工单成功",result);
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            utils.respJsonData(res, err);
            console.log('派发工单失败',err);

        });
})



/**
 * 资金稽核工单处理
 */
router.route('/nextNodeAnduser').post(function(req,res){
    var node_code = req.body.node_code;
    var proc_task_id = req.body.proc_task_id;
    var proc_inst_id = req.body.proc_inst_id;
    var user_no= req.session.current_user.user_no;
    var params_str = req.body.params;

    var params = eval('(' + params_str + ')');
    // var params={};
    // if(params_str){
    //     params=JSON.parse(params_str);
    // }
    console.log(node_code+"@@"+proc_task_id+"@@"+proc_inst_id);

    if (!node_code) {
        utils.respMsg(res, false, '2001', '流程编号不能为空', null, null);
        return;
    }
    if (!proc_task_id) {
        utils.respMsg(res, false, '2001', '任务编号不能为空', null, null);
        return;
    }
    if (!proc_inst_id) {
        utils.respMsg(res, false, '2001', '实例编号不能为空', null, null);
        return;
    }
    try{
        if (!user_no) {
            utils.respMsg(res, false, '2001', '处理人编号不能为空', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(user_no).then(function (rs) {
                if (rs.success && rs.data.length == 1) {
                    try{
                        nodeAnalysisService.getNextNodeAndHandlerInfo(node_code, proc_task_id, proc_inst_id, params, user_no).then(function (rs) {
                            // console.log(rs);
                            utils.respJsonData(res, rs);
                        }).catch(function (err_inst) {
                            logger.error("route-getNextNodeAndHandlerInfo", "获取下一节点数据异常", err_inst);
                            utils.respMsg(res, false, '1000', '获取下一节点数据异常', null, err_inst);
                        });
                    }catch (err){
                        utils.respMsg(res, false, '1000', '获取下一节点数据异常', null, err);
                    }
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    }catch (e){
        utils.respMsg(res, false, '1000', '查询错误', null, e);
    }
})

/**
 * 资金稽核工单处理
 */
router.route('/getNodeUser').post(function(req,res){
    var user_no= req.session.current_user.user_no;
    var params_str = "";
   // var params = eval('(' + params_str + ')');
    // var params={};
    // if(params_str){
    //     params=JSON.parse(params_str);
    // }

    try{
        if (!user_no) {
            utils.respMsg(res, false, '2001', '处理人编号不能为空', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(user_no).then(function (rs) {
                if (rs.success && rs.data.length == 1) {
                    try{console.log("ccccccccccccccccccccccccccccccccccccccccccccc")
                        nodeAnalysisService.getNodeAndHandlerInfo("zj_102",user_no, params_str).then(function (rs) {
                            utils.respJsonData(res, rs);
                        }).catch(function (err_inst) {
                            //logger.error("route-getNextNodeAndHandlerInfo", "获取下一节点数据异常", err_inst);
                            utils.respMsg(res, false, '1000', '获取下一节点数据异常', null, err_inst);
                        });
                    }catch (err){
                        utils.respMsg(res, false, '1000', '获取下一节点数据异常', null, err);
                    }
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    }catch (e){
        utils.respMsg(res, false, '1000', '查询错误', null, e);
    }
})

/**
 * 获取机构下的人员
 */
router.route('/getOrgPeason').get(function(req,res){
    var orgId = req.query.orgId;
    console.log("开始获取机构人员下拉框......."+orgId);
    service.getOrgPeason(orgId)
        .then(function(result){
            console.log("获取下拉框结果:",result);
            if(result.success){
                utils.respJsonData(res, result.data);
            }
        })
        .catch(function(err){
            console.log('获取下拉框失败',err);

        });
})

router.route('/assignTask').post(function(req,res) {
    var task_id = req.body.task_id;//当前任务id
    var node_code = req.body.node_code;//下一节点编号
    var user_no = req.body.user_no;//当前用户编号
    var assign_user_no = req.body.assign_user_no;//下一节点处理人编号
    var proc_title = req.body.proc_title;//标题
    var biz_vars = req.body.biz_vars;//业务变量
    var proc_vars = req.body.proc_vars;//流程变量
    var memo = req.body.memo;//处理意见
    var next_name = req.body.next_name;//下一节点处理人姓名
    var proc_back = req.body.proc_back;//回退标识1-回退 0-正常流转
    if (!assign_user_no) {
        utils.respMsg(res, false, '2001', '下一节点处理人编号为空', null, null);
        return;
    }
    if (!node_code) {
        utils.respMsg(res, false, '2001', '下一节点编号为空', null, null);
        return;
    }
    if (!task_id) {
        utils.respMsg(res, false, '2001', '任务ID为空', null, null);
        return;
    }
    try {
        if (!user_no) {
            utils.respMsg(res, false, '2001', '当前处理人编号为空', null, null);
        } else {
            inst.proving_taskId(task_id).then(function (rs) {
                if (rs.data != 1) {
                    inst.userInfo(user_no).then(function (rs) {
                        if (rs.success && rs.data.length == 1) {
                            nodeTransferService.assign_transfer(task_id, node_code, user_no, assign_user_no, proc_title, biz_vars, proc_vars, memo, next_name, proc_back).then(function (rs) {
                                utils.respJsonData(res, rs);
                            }).catch(function (err) {
                                logger.error("route-assign_transfer", "信息异常", err);
                                utils.respMsg(res, false, '1000', 'route-assign_transfer', null, err);
                            });
                        } else {
                            utils.respMsg(res, false, '1000', '用户不存在', null, null);
                        }
                    });
                } else {
                    utils.respMsg(res, true, '0000', '任务已完成', null, null);
                }
            });
        }
    } catch (e) {
        utils.respMsg(res, false, '1000', '查询错误', null, e);
    }
});

router.route("/orgTreeDataAsyn").get(function (req,res) {
    //异步加载
    var condition={};
    var org_pid = req.query.org_pid;
    condition.org_pid = org_pid;
    condition.org_status =1 ;
    service.getOrgTreeDataAsyn(condition).then(function (result) {
        if(org_pid != "0"){
            utils.respJsonData(res, result);
        }else{
            utils.respJsonData(res, [{id:'0', text : "贵州移动", children:result}]);
        }
    }).catch(function(err){
        console.log('err');
        console.log(err);
    });
});

function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}

module.exports = router;
