var express = require('express');
var router = express.Router();
//var processService = require('../../../bpm/services/bpm_service');
//var model = require('../../bpm_resource/models/process_model');
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../../bpm_resource/services/instance_service');
//var proc = require('../services/process_service');
var user = require('../services/user_service');
//var dict = require('../services/dict_service');
var logger = require('../../../../lib/logHelper').helper;
var config = require('../../../../config');


// -------------------------------查询我的已办数据接口-------------------------------
router.route('/havetodo').post(function(req,res){

    // 获取提交信息
    var userNo = req.body.user_no;//用户编号
    var page = req.body.page;//页码
    var length = req.body.rows;//每页条数

    // 验证流程名是否为空
    if(!userNo) {
        utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        return;
    }

    userService.getUsreRolesByUserNo(userNo).then(function(result){
        console.log(result);
        if(result){
            inst.getMyCompleteTaskQuery4Eui(page,length,userNo,result).then(function(taskresult){
                utils.respJsonData(res, taskresult);
            }).catch(function(err_inst){
                // console.log(err_inst);
                logger.error("route-getMyTaskList","获取我的已办数据异常",err_inst);
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


// -------------------------------查询我的待办数据接口-------------------------------
router.route('/todo').post(function(req,res){

    // 获取提交信息
    var userNo = req.body.user_no;//用户编号
    var page = req.body.page;//页码
    var length = req.body.rows;//每页条数

    // 验证用户编号是否为空
    if(!userNo) {
        utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        return;
    }

    userService.getUsreRolesByUserNo(userNo).then(function(result){
        console.log(result);
        if(result){
            inst.getMyTaskQuery4Eui(page,length,userNo,result).then(function(taskresult){
                utils.respJsonData(res, taskresult);
            }).catch(function(err_inst){
                // console.log(err_inst);
                logger.error("route-getMyTaskList","获取我的待办数据异常",err_inst);
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