var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_file_service');
var userService = require('../../workflow/services/user_service');
/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    console.log("开始获取已归档集合...")

    var userNo = req.session.current_user.user_no;//用户编号
    var work_order_number = req.body.work_order_number;
    var proc_start_time = req.body.proc_start_time;
    var proc_inst_task_complete_time = req.body.proc_inst_task_complete_time;
    var proc_code = req.body.proc_code;
    var is_overtime = req.body.is_overtime;
    var page = req.body.page;//页码
    var length = req.body.rows;//每页条数
    console.log("开始获取我的已归档集合,用户编号",userNo,work_order_number)

    // 验证流程名是否为空
    if(!userNo) {
        utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        return;
    }

    userService.getUsreRolesByUserNo(userNo).then(function(result){
        console.log(result);
        if(result){
            service.getMyArchiveTaskQuery4Eui(page,length,userNo,work_order_number,proc_start_time,proc_inst_task_complete_time,is_overtime,proc_code,result).then(function(taskresult){
                utils.respJsonData(res, taskresult);
            }).catch(function(err_inst){
                // console.log(err_inst);
                console.log("route-getMyarchiveTaskList","获取我的已归档异常",err_inst);
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
})


module.exports = router;
