var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var todoService = require('../services/order_todo_service');
var userService = require('../../workflow/services/user_service');
var inst = require('../../bpm_resource/services/instance_service');
var formidable=require("formidable");

/**
 * 获取我的待办集合
 */
router.route('/list').post(function(req,res){
    console.log("开始获取我的待办....")
    // 获取提交信息
    var userNo = req.session.current_user.user_no;//用户编号
    var page = req.body.page;//页码
    var length = req.body.rows;//
    var proc_code = req.body.proc_code;//所属流程
    var work_order_number = req.body.work_order_number;
    var proc_inst_task_sign = req.body.proc_inst_task_sign;

    console.log("用户编号",userNo)
    // 验证用户编号是否为空
    if(!userNo) {
        utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        return;
    }

    userService.getUsreRolesByUserNo(userNo).then(function(result){
        console.log(result);
        if(result){
            inst.getMyTaskQuery4Eui(page,length,userNo,"",proc_code,work_order_number,proc_inst_task_sign).then(function(taskresult){
                console.log(taskresult)
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
/**
 * 认领任务
 */
router.route('/accept')
// -------------------------------任务认领接口-------------------------------
    .post(function (req, res) {
        var id = req.body.id;//任务id
        var userNo = req.session.current_user.user_no;;//任务userJson

        // 任务是否为空
        if (!id) {
            utils.respMsg(res, false, '2001', 'id不能为空。', null, null);
            return;
        }
        if (!userNo) {
            utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(userNo).then(function (rs) {
                if (rs.success && rs.data.length == 1) {
                    //防止同时操作情况，先查询该任务是否已经被认领
                    inst.getTaskById(id).then(function (resulttask) {
                        if (resulttask.success) {
                            //如果未认领就调用认领操作方法
                            if (resulttask.data._doc.proc_inst_task_sign == 0) {
                                //根据用户编号，查询用户名
                                userService.getUsreNameByUserNo(userNo).then(function (nameresult) {
                                    //调用任务认领方式
                                    inst.acceptTask(id, userNo, nameresult)
                                        .then(function (result) {
                                            utils.respJsonData(res, result);
                                        })
                                        .catch(function (err_inst) {
                                            // console.log(err_inst);
                                            logger.error("route-acceptTask", "任务认领异常", err_inst);
                                            utils.respMsg(res, false, '1000', '认领任务异常', null, err_inst);
                                        });
                                });
                            } else {
                                utils.respMsg(res, false, '1002', '任务已被其他人员认领。', null, null);
                            }
                        } else {
                            utils.respJsonData(res, resulttask);
                        }
                    }).catch(function (err_inst) {
                        // console.log(err_inst);
                        logger.error("route-getTaskById", "获取任务异常", err_inst);
                        utils.respMsg(res, false, '1000', '获取任务异常', null, err_inst);
                    });
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            }).catch(function (err_inst) {
                // console.log(err_inst);
                logger.error("route-getUserInfo", "获取用户信息异常", err_inst);
                utils.respMsg(res, false, '1000', '获取用户信息异常', null, err_inst);
            });
        }

    });


/**
 * 批量认领任务
 */
router.route('/acceptBatch')
// -------------------------------任务认领接口-------------------------------
    .post(function (req, res) {
        console.log("开始批量认领..", req.body);
        var ids = req.body.ids;//任务id
        var userNo = req.session.current_user.user_no;;//任务userJson
        console.log(ids);
        // 任务是否为空
        if (!ids) {
            utils.respMsg(res, false, '2001', 'id不能为空。', null, null);
            return;
        }
        if (!userNo) {
            utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(userNo).then(async function (rs) {
                if (rs.success && rs.data.length == 1) {
                    let ids_arr=ids.split(',');

                    let accept_already=0;
                    let accept_success=0;
                    let accept_fail=0;

                    for(let i=0;i<ids_arr.length;i++){
                        let id = ids_arr[i];
                        //防止同时操作情况，先查询该任务是否已经被认领
                        let  resulttask= await inst.getTaskById(id);
                        if (resulttask.success) {
                            try{
                                if(resulttask.data._doc.proc_inst_task_sign == 0){
                                    let  nameresult= await  userService.getUsreNameByUserNo(userNo);
                                    let  result= await  inst.acceptTask(id, userNo, nameresult);
                                    if(result.success){
                                        accept_success++
                                    }else{
                                        accept_fail++;
                                    }
                                }else{
                                    accept_already++;
                                }
                            }catch(e){
                                accept_fail++;
                            }

                        }else{
                            accept_fail++;
                        }

                        /*.then( function (resulttask) {
                            if (resulttask.success) {
                                //如果未认领就调用认领操作方法
                                if (resulttask.data._doc.proc_inst_task_sign == 0) {
                                    //根据用户编号，查询用户名
                                      userService.getUsreNameByUserNo(userNo).then( function (nameresult) {
                                        //调用任务认领方式
                                         inst.acceptTask(id, userNo, nameresult)
                                            .then(function (result) {
                                                if(result.success){
                                                    accept_success++
                                                }else{
                                                    accept_fail++;
                                                }
                                            })
                                            .catch(function (err_inst) {
                                                accept_fail++;
                                            });
                                    });
                                } else {
                                    accept_already++;
                                }
                            } else {
                                accept_fail++;
                            }
                        }).catch(function (err_inst) {
                            accept_fail++;
                        });*/
                    }

                   const  result=await  new Promise(resolve => {
                       resolve({'success': true, 'code': '0000', 'msg': '认领成功任务数量:'+accept_success+';失败数量:'+accept_fail+';已被认领数量:'+accept_already});
                    });
                    console.log(result);
                    utils.respJsonData(res, result);

                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            }).catch(function (err_inst) {

                utils.respMsg(res, false, '1000', '获取用户信息异常', null, err_inst);
            });
        }

    });

module.exports = router;
