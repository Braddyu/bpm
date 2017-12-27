var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var todoService = require('../services/order_todo_service');
var userService = require('../../workflow/services/user_service');
var formidable=require("formidable");

/**
 * 获取我的待办集合
 */
router.route('/list').post(function(req,res){
    console.log("开始获取我的待办....")
    // 获取提交信息
    var userNo = req.session.current_user.user_no;//用户编号
    var page = req.body.page;//页码
    var length = req.body.rows;//每页条数
    var proc_code = req.body.proc_code;//流程编码
    var startDate = req.body.startDate;//创建时间
    var endDate = req.body.endDate;//创建时间
    console.log("用户编号",userNo)
    // 验证用户编号是否为空
    if(!userNo) {
        utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        return;
    }

    userService.getUsreRolesByUserNo(userNo).then(function(result){
        console.log(result);
        if(result){
            todoService.getMyTaskQuery4Eui(page,length,userNo,result,proc_code,startDate,endDate).then(function(taskresult){
               // console.log(taskresult)
                utils.respJsonData(res, taskresult);
            }).catch(function(err_inst){
                // console.log(err_inst);
                console.log("route-getMyTaskList","获取我的待办数据异常",err_inst);
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


module.exports = router;
