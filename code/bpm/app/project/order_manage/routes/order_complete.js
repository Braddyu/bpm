var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var completeService = require('../services/order_complete_service');
var nodeTransferService = require('../../bpm_resource/services/node_transfer_service');
var userService = require('../../workflow/services/user_service');

/**
 * 获取我的已办集合
 */
router.route('/list').post(function(req,res){
    console.log("开始获取我的已办集合...")
    // 获取提交信息
    var userNo = req.session.current_user.user_no;//用户编号
    var page = req.body.page;//页码
    var length = req.body.rows;//每页条数
    var proc_code = req.body.proc_code;//流程编码
    var startDate = req.body.startDate;//创建时间
    var endDate = req.body.endDate;//创建时间
    var work_order_number = req.body.work_order_number;
    console.log("开始获取我的已办集合,用户编号",userNo)

    // 验证流程名是否为空
    if(!userNo) {
        utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        return;
    }

    userService.getUsreRolesByUserNo(userNo).then(function(result){
        console.log(result);
        if(result){
            completeService.getMyCompleteTaskQuery4Eui(page,length,userNo,result,proc_code,startDate,endDate,work_order_number).then(function(taskresult){

                utils.respJsonData(res, taskresult);
            }).catch(function(err_inst){
                // console.log(err_inst);
                console.log("route-getMyTaskList","获取我的已办数据异常",err_inst);
                utils.respMsg(res, false, '1000', '获取数据异常', null, err_inst);

            });
        }else{
            utils.respMsg(res, false, '1000', '无用户数据', null, null);
        }
    }).catch(function(err_inst){
        // console.log(err_inst);
        logger.error("route-getUsreRolesByUserNo","根据用户编号获取用户角色异常",err_inst);
        utils.respMsg(res, false, '1000', '获取数据异常', null, err_inst);
    });
});
/**
 * 获取工单的流程日志
 */
router.route("/logs").post(function(req,res){
    console.log("开始获取流程日志...")
    var inst_id=req.body.inst_id;
    var user_no='';
    var page=req.body.page;
    var rows=req.body.rows;
    console.log("inst_id:",inst_id)
    if(!inst_id){
        utils.respMsg(res, false, '1000', '流程实例inst_id不能为空', null, null);
    }
    nodeTransferService.find_log(inst_id,user_no,page,rows).then(function(rs){

        utils.respJsonData(res,rs);
    });
});





module.exports = router;

