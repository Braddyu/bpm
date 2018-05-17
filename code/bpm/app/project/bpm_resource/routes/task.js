var express = require('express');
var router = express.Router();
var logger = require('../../../../lib/logHelper').helper;
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../services/instance_service');
var nodeTransferService=require("../services/node_transfer_service");
var userService = require('../../workflow/services/user_service');
var nodeAnalysisService=require("../services/node_analysis_service");
var mistakeService = require('../../order_manage/services/mistake_list_service');
var proc = require('../services/process_service');
var config = require('../../../../config');
var fs = require('fs');
var urlencode = require('urlencode');


// -------------------------------查询我的待办数据接口-------------------------------
exports.task=function() {

    //中间件
    router.use(function (req, res, next) {

        //验证令牌是否正确
        if (req.headers.token || req.query.token || req.body.token) {
            //优先从header中获取，其次get和post
            var token = req.headers.token ? req.headers.token : (req.query.token ? req.query.token : req.body.token);
            proc.valiateToken(token).then(function (re) {
                if (re.success) {
                    next();
                } else {
                    utils.respJsonData(res, re);
                }
            });
        } else {
            utils.respJsonData(res, utils.returnMsg(false, '1000', '未传入令牌', null, null));
        }

    });
    router.route('/todo').post(function (req, res) {

        // 获取提交信息
        var userNo = req.body.user_no;//用户编号
        var page = req.body.page;//页码
        var length = req.body.rows;//每页条数
        var joinup_sys = req.body.joinup_sys;//工单所属系统编号
        var proc_code = req.body.proc_code;//工单所属流程

        if (!joinup_sys) {
            utils.respMsg(res, false, '2001', '工单所属系统编号不能为空。', null, null);
            return;
        }else{
            if(config.joinup_sys.indexOf(joinup_sys)==-1){
                utils.respMsg(res, false, '2001', '工单所属系统编号不存在。', null, null);
                return ;
            }
        }

        // 验证用户编号是否为空
        if (!userNo) {
            utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(userNo).then(function (rs) {
                if (rs.success && rs.data.length == 1) {
                    // userService.getUsreRolesByUserNo(userNo).then(function (result) {
                    //     if (result) {
                            inst.getMyTaskQuery4Eui(page, length, userNo, joinup_sys, proc_code,"").then(function (taskresult) {
                                utils.respJsonData(res, taskresult);
                            }).catch(function (err_inst) {
                                // console.log(err_inst);
                                logger.error("route-getMyTaskList", "获取我的待办数据异常", err_inst);
                                utils.respMsg(res, false, '1000', '获取数据异常', null, err_inst);
                            });
                        // } else {
                        //     utils.respMsg(res, false, '1000', '无用户数据', null, null);
                        // }
                    // }).catch(function (err_inst) {
                    //     // console.log(err_inst);
                    //     logger.error("route-getUsreRolesByUserNo", "根据用户编号获取用户角色异常", err_inst);
                    //     utils.respMsg(res, false, '1000', '获取数据异常', null, err_inst);
                    // });
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    });

    // -------------------------------查询我的已办数据接口-------------------------------
    router.route('/havetodo').post(function (req, res) {

        // 获取提交信息
        var userNo = req.body.user_no;//用户编号
        var page = req.body.page;//页码
        var length = req.body.rows;//每页条数
        var joinup_sys = req.body.joinup_sys;//工单所属系统编号
        var proc_code = req.body.proc_code;//工单所属流程
        if (!joinup_sys) {
            utils.respMsg(res, false, '2001', '工单所属系统编号不能为空。', null, null);
            return;
        }else{
            if(config.joinup_sys.indexOf(joinup_sys)==-1){
                utils.respMsg(res, false, '2001', '工单所属系统编号不存在。', null, null);
                return ;
            }
        }
        // 验证流程名是否为空
        if (!userNo) {
            utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(userNo).then(function (rs) {
                if (rs.success && rs.data.length == 1) {
                    userService.getUsreRolesByUserNo(userNo).then(function (result) {
                        if (result) {
                            inst.getMyCompleteTaskQuery4Eui(page, length, userNo, result, joinup_sys, proc_code).then(function (taskresult) {
                                utils.respJsonData(res, taskresult);
                            }).catch(function (err_inst) {
                                // console.log(err_inst);
                                logger.error("route-getMyTaskList", "获取我的已办数据异常", err_inst);
                                utils.respMsg(res, false, '1000', '获取数据异常', null, err_inst);

                            });
                        } else {
                            utils.respMsg(res, false, '1000', '无用户数据', null, null);
                        }
                    }).catch(function (err_inst) {
                        // console.log(err_inst);
                        logger.error("route-getUsreRolesByUserNo", "根据用户编号获取用户角色异常", err_inst);
                        utils.respMsg(res, false, '1000', '获取数据异常', null, err_inst);
                    });
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }


    });

    router.route('/accept')
    // -------------------------------任务认领接口-------------------------------
        .post(function (req, res) {
            var id = req.body.id;//任务id
            var userNo = req.body.user_no;//任务userJson

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

// -------------------------------完成任务接口-------------------------------
    router.route('/complete').post(function (req, res) {
        var id = req.body.id;//任务id
        var memo = req.body.memo;//处理意见
        var user_code = req.body.user_no;//处理人编码
        var params = req.body.params;//流转参数
        var biz_vars = req.body.biz_vars;//业务变量
        var proc_vars = req.body.proc_vars;//流程变量
        var next_name = req.body.next_name;
        // 任务是否为空
        if (!id) {
            utils.respMsg(res, false, '2001', '任务ID不能为空。', null, null);
            return;
        }else{
            inst.proving_Id(id).then(function (rs) {
                if(rs.success&&rs.data[0].proc_inst_task_status==1){
                    utils.respMsg(res,false, '0000', '任务已完成不能重复完成', null, null);
                    return ;
                }else{
                    try{
                        if (!user_code) {
                            utils.respMsg(res, false, '2001', '处理人编码不能为空。', null, null);
                            return ;
                        } else {
                            //判断用户是否存在
                            inst.userInfo(user_code).then(function (rs) {
                                if (rs.success && rs.data.length == 1) {
                                    inst.getTaskById(id).then(function (taskresult) {
                                        if (taskresult.success) {
                                            var node_code = taskresult.data._doc.proc_inst_task_code;
                                            //流程流转方法
                                            nodeTransferService.transfer(id, node_code, user_code, true, memo, params, biz_vars, proc_vars,next_name).then(function (result1) {
                                                utils.respJsonData(res, result1);
                                            }).catch(function (err_inst) {
                                                // console.log(err_inst);
                                                logger.error("route-transfer", "流程流转异常", err_inst);
                                                utils.respMsg(res, false, '1000', '流程流转异常', null, err_inst);
                                            });
                                        } else {
                                            utils.respJsonData(res, taskresult);
                                        }
                                    }).catch(function (err_inst) {
                                        logger.error("route-getTaskById", "获取任务异常", err_inst);
                                        utils.respMsg(res, false, '1000', '获取任务异常', null, err_inst);
                                    });
                                } else {
                                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                                }
                            });
                        }
                    }catch(e){
                        utils.respMsg(res, false, '1000', '查询错误', null, e);
                    }
                }
            });
        }
    });

// -------------------------------获取指定任务接口-------------------------------
    router.route('/query').post(function(req,res){
        var taskid = req.body.taskId;//任务id
        var flag = req.body.flag;//标识
        if(taskid){
            inst.getCompTaskById(taskid,flag).then(function(result){
                utils.respJsonData(res,result);
            }).catch(function(err_inst){
                // console.log(err_inst);
                logger.error("route-getCompTaskById","获取任务异常",err_inst);
                utils.respMsg(res, false, '1000', '获取任务异常', null, err_inst);
            });
        }else{
            utils.respMsg(res, false, '2001', '任务ID为空', null, null);
        }
    });

// -------------------------------指派任务的方法的接口-------------------------------
    router.route("/assign/task").post(function(req,res){
        var task_id=req.body.task_id;//当前任务id
        var node_code=req.body.node_code;//下一节点编号
        var user_no=req.body.user_no;//当前用户编号
        var assign_user_no=req.body.assign_user_no;//下一节点处理人编号
        var proc_title=req.body.proc_title;//标题
        var biz_vars=req.body.biz_vars;//业务变量
        var proc_vars=req.body.proc_vars;//流程变量
        var memo=req.body.memo;//处理意见
        var next_name = req.body.next_name;//下一节点处理人姓名
        var proc_back = req.body.proc_back;//回退标识1-回退 0-正常流转
        if(!assign_user_no){
            utils.respMsg(res, false, '2001', '下一节点处理人编号为空', null, null);
            return;
        }
        if(!node_code){
            utils.respMsg(res, false, '2001', '下一节点编号为空', null, null);
            return;
        }
        if(!task_id){
            utils.respMsg(res, false, '2001', '任务ID为空', null, null);
            return;
        }
        try{
            if(!user_no){
                utils.respMsg(res, false, '2001', '当前处理人编号为空', null, null);
            }else{
                inst.proving_taskId(task_id).then(function (rs) {
                    if(rs.data!=1){
                        inst.userInfo(user_no).then(function(rs){
                            if(rs.success && rs.data.length == 1){
                                nodeTransferService.assign_transfer(task_id,node_code,user_no,assign_user_no,proc_title,biz_vars,proc_vars,memo,next_name,proc_back).then(function(rs){
                                    utils.respJsonData(res,rs);
                                }).catch(function(err){
                                    logger.error("route-assign_transfer","信息异常",err);
                                    utils.respMsg(res, false, '1000', 'route-assign_transfer', null, err);
                                });
                            }else{
                                utils.respMsg(res, false, '1000', '用户不存在', null, null);
                            }
                        });
                    }else{
                        utils.respMsg(res,true, '0000', '任务已完成', null, null);
                    }
                });
            }
        }catch(e){
            utils.respMsg(res, false, '1000', '查询错误', null, e);
        }
    });


// -------------------------------获取任务处理日志的接口-------------------------------
    router.route("/logs").post(function (req, res) {
        var inst_id = req.body.inst_id;//实例id
        var user_no = req.body.user_no;//当前用户编号
        var page = req.body.page;
        var rows = req.body.rows;
        if (!inst_id) {
            utils.respMsg(res, false, '2001', '流程实例inst_id不能为空', null, null);
            return;
        }
        //查询日志
        nodeTransferService.find_log(inst_id, user_no, page, rows).then(function (rs) {
            utils.respJsonData(res, rs);
        }).catch(function (err_inst) {
            // console.log(err_inst);
            logger.error("route-find_log", "获取日志信息异常", err_inst);
            utils.respMsg(res, false, '1000', '获取日志信息异常', null, err_inst);
        });
    });

// -------------------------------查询日志集合的接口-------------------------------
    router.route("/log/list").post(function (req, res) {
        var status = req.body.status;//流程流转状态
        var user_no = req.body.user_no;//当前用户id
        var begin_date = req.body.begin_date;
        var end_date = req.body.end_date;
        var page = req.body.page;
        var rows = req.body.rows;
        if (!user_no) {
            utils.respMsg(res, false, '2001', '处理人编号不能为空', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(user_no).then(function (rs) {
                if (rs.success && rs.data.length == 1) {
                    nodeTransferService.log_list(status, user_no, begin_date, end_date, page, rows).then(function (rs) {
                        utils.respJsonData(res, rs);
                    }).catch(function (err_inst) {
                        // console.log(err_inst);
                        logger.error("route-log_list", "获取日志信息异常", err_inst);
                        utils.respMsg(res, false, '1000', '获取日志信息异常', null, err_inst);
                    });
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    });


// -------------------------------已完成任务节点编号集合-------------------------------
    router.route('/complete/node/codes').post(function (req, res) {
        var inst_id = req.body.proc_inst_id;//流程实例id
        if (!inst_id) {
            utils.respMsg(res, false, '2001', '实例id为空', null, null);
            return;
        }
        //根据实例id,查询完成的任务集合
        inst.queryCompTask(inst_id).then(function (rs) {
            utils.respJsonData(res, rs);
        }).catch(function (err_inst) {
            logger.error("route-queryCompTask", "获取完成任务节点信息异常", err_inst);
            utils.respMsg(res, false, '1000', '获取完成任务节点信息异常', null, err_inst);
        });
    });


// -------------------------------批量处理接口-------------------------------
    router.route("/batch").post(function (req, res) {
        var user_no = req.body.user_no;//当前处理人id
        var user_name = req.body.user_name;//当前处理人姓名
        var proc_inst_id = req.body.proc_inst_id;//当前实例id
        if (!proc_inst_id) {
            utils.respMsg(res, false, '2001', '实例id为空', null, null);
            return;
        }
        if (!user_no) {
            utils.respMsg(res, false, '2001', '用户编号为空。', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(user_no).then(function (rs) {
                if (rs.success && rs.data.length == 1) {
                    inst.do_batch(user_no, user_name, proc_inst_id).then(function (rs) {
                        utils.respJsonData(res, rs);
                    }).catch(function (err_inst) {
                        // console.log(err_inst);
                        logger.error("route-do_batch", "指派任务异常", err_inst);
                        utils.respMsg(res, false, '1000', '指派任务异常', null, err_inst);
                    });
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    });

// -------------------------------批量派发接口-------------------------------
    router.route("/payout").post(function (req, res) {
        var task_id = req.body.task_id;//任务id
        var node_code = req.body.node_code;//当前节点编号
        var user_no = req.body.user_no;//当前用户编号
        var assign_user_no = req.body.assign_user_no;//下一节点处理人(多个人)以逗号隔开
        var proc_title = req.body.proc_title;
        var biz_vars = req.body.biz_vars;//业务变量
        var proc_vars = req.body.proc_vars;//流程变量
        var memo = req.body.memo;//流程变量
        if (!task_id) {
            utils.respMsg(res, false, '2001', '任务id为空。', null, null);
            return;
        }
        if (!assign_user_no) {
            utils.respMsg(res, false, '2001', '下一节点用户编号为空。', null, null);
            return;
        }
        if (!user_no) {
            utils.respMsg(res, false, '2001', '用户编号为空。', null, null);
        } else {
            //判断用户是否存在
            inst.userInfo(user_no).then(function (rs) {
                if (rs.success && rs.data.length == 1) {
                    //调用批量派发方法
                    nodeTransferService.do_payout(task_id, node_code, user_no, assign_user_no, proc_title, biz_vars, proc_vars, memo).then(function (rs) {
                        utils.respJsonData(res, rs);
                    }).catch(function (err) {
                        logger.error("route-do_payout", "批量派发异常", err);
                        utils.respMsg(res, false, '1000', 'payout', null, err);
                    });
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    });


// -------------------------------指派任务完成的方法针对深度滑稽(分公司处理)-------------------------------
    router.route("/assign/interim_task").post(function (req, res) {
        var inst_id = req.body.proc_inst_id;//实例id
        var task_id = req.body.task_id;//任务id
        var node_code = req.body.node_code;//下一节点编号
        var user_code = req.body.user_no;//当前处理人编号
        var user_name = req.body.user_name;//当前处理人姓名
        var assign_user_no = req.body.assign_user_no;//指派人编号
        var proc_title = req.body.proc_title;
        var biz_vars = req.body.biz_vars;//业务变量
        var proc_vars = req.body.proc_vars;//流程变量
        var memo = req.body.memo;//处理意见
        if (!inst_id) {
            utils.respMsg(res, false, '2001', '实例ID为空', null, null);
            return;
        }
        if (!task_id) {
            utils.respMsg(res, false, '2001', '任务id为空。', null, null);
            return;
        }
        if (!user_code) {
            utils.respMsg(res, false, '2001', '当前处理人编号为空。', null, null);
            return;
        } else {
            //判断用户是否存在
            inst.userInfo(user_code).then(function (rs) {
                if (rs.success && rs.data.length > 0) {
                    //根据实例id找出未完成的任务
                    inst.getInterimTaskById(inst_id, node_code).then(function (rs) {
                        if (rs.success && task_id) {
                            if (rs.data.length == 1) {
                                //当只有一个人没有完成任务时调用完成任务方法进行下一步流转
                                nodeTransferService.assign_transfer(task_id, node_code, user_code, assign_user_no, proc_title, biz_vars, proc_vars, memo).then(function (rs) {
                                    rs.success = true;
                                    rs.finish = 1;
                                    utils.respJsonData(res, rs);
                                }).catch(function (err) {
                                    logger.error("route-assign_transfer", "指派任务异常", err);
                                    utils.respMsg(res, false, '1000', 'rouute-assign/task', null, err);
                                });
                            } else if (rs.data.length > 1) {
                                //还有多个人没有完成任务时调用完成任务方法
                                nodeTransferService.interim_completeTask(task_id, memo).then(function (rs) {
                                    rs.success = true;
                                    rs.finish = 0;
                                    utils.respJsonData(res, rs);
                                }).catch(function (err) {
                                    logger.error("route-interim_completeTask", "获取未完成任务异常+++++++", err);
                                    utils.respMsg(res, false, '1000', '', null, err);
                                });
                            } else {
                                utils.respMsg(res, false, '1000', '任务失效', null, err);
                            }
                        } else {
                            utils.respMsg(res, false, '2001', '任务ID为空', null, null);
                        }
                    }).catch(function (err) {
                        logger.error("route-getInterimTaskById", "获取任务异常", err);
                        utils.respMsg(res, false, '1000', 'route-getInterimTaskById', null, err);
                    });
                } else {
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    });


// -------------------------------查询流程信息接口-------------------------------

    router.route("/process_info").post(function(req,res){
        var proc_code = req.body.proc_code; //流程编码
        if(proc_code){
            nodeTransferService.process_infomation(proc_code).then(function(rs){
                utils.respJsonData(res,rs);
            }).catch (function(err){
                logger.error("route-process_infomation","获取流程信息异常",err);
                utils.respMsg(res, false, '1000', '获取流程信息异常', null, null);
            });
        }else{
            utils.respMsg(res, false, '2001', '流程编码为空', null, null);
        }

    });


    /*
    区县公司调账(营业员--非销户)归档接口(慧眼系统)
     */
    router.route("/pigeonhole").post(function(req,res){
        var proc_inst_id=req.body.proc_inst_id;//流程实例id
        if(proc_inst_id){
            inst.goPigeonhole(proc_inst_id).then(function(rs){
                utils.respJsonData(res,rs);
            }).catch(function(err_inst){
                logger.error("route-goPigeonhole","流程归档异常",err_inst);
                utils.respMsg(res, false, '1000', '流程归档异常', null, err_inst);
            });
        }else{
            utils.respMsg(res, false, '2001', '实例编号不能为空', null, null);
        }
    });
    /**
     * 任务回退接口(慧眼系统)
     */
    router.route("/back").post(function(req,res){
        var _id=req.body.task_id;//当前任务id
        var user_no = req.body.user_no;//当前用户编号
        var memo=req.body.memo;//处理意见
        var node_code = req.body.node_code;//当前节点编码
        var node_name = req.body.node_name;//当前节点名称
        if(!_id){
            utils.respMsg(res, false, '2001', '任务编号不能为空', null, null);
            return;
        }
        if(!user_no){
            utils.respMsg(res, false, '2001', '当前节点处理人编码不能为空', null, null);
            return;
        }
        if(!node_code){
            utils.respMsg(res, false, '2001', '当前节点编码不能为空', null, null);
            return;
        }
        if(!node_name){
            utils.respMsg(res, false, '2001', '当前节点名称不能为空', null, null);
            return;
        }
        try{
            inst.proving_taskId(_id).then(function (rs){
                if(rs.data!=1){
                    inst.return_task(_id,user_no,memo,node_code,node_name).then(function(rs){
                        utils.respJsonData(res,rs);
                    }).catch(function(err_inst){
                        logger.error("return_task","任务回退异常",err_inst);
                        utils.respMsg(res, false, '1000', '任务回退异常', null, err_inst);
                    });
                }else{
                    utils.respMsg(res,true, '0000', '任务已完成', null, null);
                }
            });
        }catch(e){
            utils.respMsg(res,true, '1000', '查询错误', null, e);
        }
    });

    /**
     * 完成任务(慧眼系统)
     */
    router.route("/finish/task").post(async (req,res)=>{
        let user_no=req.body.user_no;
        let task_id=req.body.task_id;
        if(task_id&&user_no){
            utils.respJsonData(res, utils.returnMsg(false, '1000', "传入参数不正确" , null, null));
        }
        try{
            let rs=await nodeTransferService.finish_task(task_id,user_no);
            utils.respJsonData(res, rs);
        }catch(err){
            logger.error("route-/finish/task", "完成任务失败", err);
            utils.respMsg(res, false, '1000', '完成任务失败', null, );
        }
    });

    /**
     * 用户参与过的流程(慧眼系统)
     * gdgl/api/task/find/instanceId
     */
    router.route("/find/instanceId").post(function(req,res){
        let user_no=req.body.user_no;//用户编号
        let joinup_sys=req.body.joinup_sys;//所属流程编号
        try{
            inst.find_instanceId(user_no,joinup_sys).then(function (rs) {
                utils.respJsonData(res,rs);
            }).catch(function(err_inst){
                logger.error("return_task","查询流程异常",err_inst);
                utils.respMsg(res, false, '1000', '查询流程异常', null, err_inst);
            });
        }catch(e){
            utils.respMsg(res, false, '1000', '查询流程异常', null, e);
        }
    });

    /*
     将单元测试产生的数据删除
     */

    router.route("/delete").post(function(req,res){
        let joinup_sys='unitTest_node';//所属流程编号
        try{
            inst.delete(joinup_sys).then(function (rs) {
                utils.respJsonData(res,rs);
            }).catch(function(err_inst){
                logger.error("return_task","查询流程异常",err_inst);
                utils.respMsg(res, false, '1000', '查询流程异常', null, err_inst);
            });
        }catch(e){
            utils.respMsg(res, false, '1000', '查询流程异常', null, e);
        }
    });

    /**
     * 差错工单派单
     */
    router.route('/dispatch').post(function(req,res){
        console.log("开始派单...");
        var queryDate = req.body.queryDate.replace(/\-/g,'');//查询时间
        var check_status= req.body.check_status;//稽核状态
        var business_code= req.body.business_code;//业务名称
        var city_code= req.body.city_code;//地州
        var mlog_id= req.body.mlog_id;//预先插入的日志ID
        var status= req.body.status;//派单状态
        if(!queryDate){
            var result={"success":false,"msg":"查询时间不得为空"};
            utils.respJsonData(res, result);
            return;
        }
        var user_no=req.body.user_no;
        var work_id=req.body.work_id;
        var user_name=req.body.user_name;
        var role_name=req.body.role_name;

        console.log(queryDate,check_status,user_no,user_name,role_name,business_code,city_code,work_id,mlog_id);
        // 调用分页
        mistakeService.dispatch(queryDate,check_status,user_no,user_name,role_name,business_code,city_code,work_id,status,mlog_id)
            .then(function(result){
                console.log("派发工单成功",result);
            })
            .catch(function(err){
                console.log('派发工单失败',err);

            });
        utils.respJsonData(res, {'success':true,'code':'0000','msg':'系统后台正在派单中，需要一点时间请勿重复派单，在这之前您可以处理其他业务。'});
    });

  //附件下载
    router.route('/downLoad').get(function (req,res) {
        var filePath  = req.query.file_path;
        var fileName = req.query.file_name;
        if(!filePath){
            utils.respMsg(res, false, '2001', '文件路径不能为空', null, null);
            return;
        }
        if(!fileName){
            utils.respMsg(res, false, '2001', '文件名称不能为空', null, null);
            return;
        }
        fs.exists(filePath, function (exists) {
            if (exists) {
                var stats = fs.statSync(filePath);
                if (stats.isFile()) {
                    res.set({
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition': 'attachment;filename=' + urlencode(fileName),
                        'Content-Length': stats.size
                    });
                    fs.createReadStream(filePath).pipe(res);
                } else {
                    res.end(404);
                }
            }
        })
    });

    return router;
}
