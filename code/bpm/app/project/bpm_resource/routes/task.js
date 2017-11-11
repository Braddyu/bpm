var express = require('express');
var router = express.Router();
var logger = require('../../../../lib/logHelper').helper;
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../services/instance_service');
var nodeTransferService=require("../services/node_transfer_service");
var userService = require('../../workflow/services/user_service');



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

router.route('/accept')
    // -------------------------------任务认领接口-------------------------------
    .post(function(req,res) {
        var id = req.body.id;//任务id
        var userNo = req.body.user_no;//任务userJson

        // 任务是否为空
        if(!id) {
            utils.respMsg(res, false, '2001', 'id不能为空。', null, null);
            return;
        }
        //防止同时操作情况，先查询该任务是否已经被认领
        inst.getTaskById(id).then(function(resulttask){
            if(resulttask.success){
                //如果未认领就调用认领操作方法
                if(resulttask.data._doc.proc_inst_task_sign == 0){
                    //根据用户编号，查询用户名
                    userService.getUsreNameByUserNo(userNo).then(function(nameresult){
                        //调用任务认领方式
                        inst.acceptTask(id,userNo,nameresult)
                            .then(function(result){
                                utils.respJsonData(res, result);
                            })
                            .catch(function(err_inst){
                                // console.log(err_inst);
                                logger.error("route-acceptTask","任务认领异常",err_inst);
                                utils.respMsg(res, false, '1000', '认领任务异常', null, err_inst);
                            });
                    });
                }else{
                    utils.respMsg(res, false, '1002', '任务已被其他人员认领。', null, null);
                }
            }else{
                utils.respJsonData(res, resulttask);
            }
        }).catch(function(err_inst){
            // console.log(err_inst);
            logger.error("route-getTaskById","获取任务异常",err_inst);
            utils.respMsg(res, false, '1000', '获取任务异常', null, err_inst);
        });


    });


router.route('/complete')
    // -------------------------------完成任务接口-------------------------------
    .post(function(req,res) {
        var id = req.body.id;//任务id
        var memo = req.body.memo;//处理意见
        var user_code = req.body.user_no;//处理人编码
        var params = req.body.params;//流转参数
        var biz_vars = req.body.biz_vars;//业务变量
        var proc_vars = req.body.proc_vars;//流程变量
        // 任务是否为空
        if(!id) {
            utils.respMsg(res, false, '2001', '任务ID不能为空。', null, null);
            return;
        }
        inst.getTaskById(id).then(function(taskresult){
            if(taskresult.success){
                var node_code = taskresult.data._doc.proc_inst_task_code;
                //流程流转方法
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                console.log(id,node_code,user_code,true,memo,params,biz_vars,proc_vars);
                console.info(params)
                nodeTransferService.transfer(id,node_code,user_code,true,memo,params,biz_vars,proc_vars).then(function(result1){
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",id,node_code,user_code,true,memo,params)
                    utils.respJsonData(res, result1);
                }).catch(function(err_inst){
                    // console.log(err_inst);
                    logger.error("route-transfer","流程流转异常",err_inst);
                    utils.respMsg(res, false, '1000', '流程流转异常', null, err_inst);
                });
            }else{
                utils.respJsonData(res, taskresult);
            }
        }).catch(function(err_inst){
            logger.error("route-getTaskById","获取任务异常",err_inst);
            utils.respMsg(res, false, '1000', '获取任务异常', null, err_inst);
        });
    });

router.route('/query').post(function(req,res){
    var taskid = req.body.taskId;
    var flag = req.body.flag;//标识
    if(taskid){
        inst.getCompTaskById(taskid,flag).then(function(result){
            utils.respJsonData(res,result);
        });
    }else{
        utils.respMsg(res, false, '1000', '任务ID为空', null, null);
    }
});

//指派任务的方法
router.route("/assign/task").post(function(req,res){
    var task_id=req.body.task_id;
    var node_code=req.body.node_code;
    var user_no=req.body.user_no;
    var assign_user_no=req.body.assign_user_no;
    var proc_title=req.body.proc_title;
    var biz_vars=req.body.biz_vars;//业务变量
    var proc_vars=req.body.proc_vars;//流程变量
    var memo=req.body.memo;//流程变量
    if(task_id){
        nodeTransferService.assign_transfer(task_id,node_code,user_no,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(rs){
            utils.respJsonData(res,rs);
        }).catch(function(err){
            utils.respMsg(res, false, '1000', 'rouute-assign/task', null, err);
        });
    }else{
        utils.respMsg(res, false, '1000', '任务ID为空', null, null);
    }

});

router.route("/logs").post(function(req,res){
    var inst_id=req.body.inst_id;
    var user_no=req.body.user_no;
    var page=req.body.page;
    var rows=req.body.rows;
    if(!inst_id){
        utils.respMsg(res, false, '1000', '流程实例inst_id不能为空', null, null);
    }
    nodeTransferService.find_log(inst_id,user_no,page,rows).then(function(rs){
        utils.respJsonData(res,rs);
    });
});
/**
 * 查询日志集合
 */
router.route("/log/list").post(function(req,res){
    var status=req.body.status;
    var user_no=req.body.user_no;
    var begin_date=req.body.begin_date;
    var end_date=req.body.end_date;
    var page=req.body.page;
    var rows=req.body.rows;
    
    nodeTransferService.log_list(status,user_no,begin_date,end_date,page,rows).then(function(rs){
        utils.respJsonData(res,rs);
    });
});

/**
 * 已完成任务节点编号集合
 */
router.route('/complete/node/codes').post(function(req,res){
    var inst_id = req.body.proc_inst_id;
    inst.queryCompTask(inst_id).then(function(rs){
        utils.respJsonData(res,rs);
    });
});

/**
 *批量处理
 */
router.route("/batch").post(function(req,res){
    var user_no=req.body.user_no;//当前处理人id
    var user_name=req.body.user_name;//当前处理人姓名
    var proc_inst_id=req.body.proc_inst_id;//当前实例id

    inst.do_batch(user_no,user_name,proc_inst_id).then(function(rs){
        utils.respJsonData(res,rs);
    });
});

//批量派发
router.route("/payout").post(function(req,res){
    var task_id=req.body.task_id;
    var node_code=req.body.node_code;
    var user_no=req.body.user_no;
    var assign_user_no=req.body.assign_user_no;//以逗号隔开
    var proc_title=req.body.proc_title;
    var biz_vars=req.body.biz_vars;//业务变量
    var proc_vars=req.body.proc_vars;//流程变量
    var memo=req.body.memo;//流程变量

    if(task_id){
        nodeTransferService.do_payout(task_id,node_code,user_no,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(rs){
            utils.respJsonData(res,rs);
        }).catch(function(err){
            logger.error("route-payout","批量派发异常",err);
            utils.respMsg(res, false, '1000', 'payout', null, err);
        });
    }else{
        utils.respMsg(res, false, '1000', '任务ID为空', null, null);
    }

});


//指派任务完成的方法针对深度滑稽(分公司处理)
router.route("/assign/interim_task").post(function(req,res){
    var inst_id = req.body.proc_inst_id;//实例id
    var task_id = req.body.task_id;//任务id
    var node_code = req.body.node_code;//任务编号
    var user_code = req.body.user_no;//当前处理人编号
    var user_name = req.body.user_name;//当前处理人姓名
    var assign_user_no =req.body.assign_user_no;//指派人编号
    var proc_title = req.body.proc_title;
    var biz_vars = req.body.biz_vars;//业务变量
    var proc_vars = req.body.proc_vars;//流程变量
    var memo = req.body.memo;//处理意见

    if(inst_id){
        inst.getInterimTaskById(inst_id,node_code).then(function(rs){
            if(rs.success && task_id){
                if(rs.data.length == 1){
                    nodeTransferService.assign_transfer(task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(rs){
                        rs.success=true;
                        rs.finish=1;
                        utils.respJsonData(res,rs);
                    }).catch(function(err){
                        logger.error("route-assign/interim_task","指派任务异常",err);
                        utils.respMsg(res, false, '1000', 'rouute-assign/task', null, err);
                    });
                }else if(rs.data.length > 1){
                    nodeTransferService.interim_completeTask(task_id,memo).then(function(rs){
                        rs.success=true;
                        rs.finish=0;
                        utils.respJsonData(res,rs);
                    }).catch(function(err){
                        logger.error("route-assign/interim_task","获取未完成任务异常+++++++",err);
                        utils.respMsg(res, false, '1000', '', null, err);
                    });
                }else{
                    utils.respMsg(res, false, '1000', '任务失效', null, err);
                }
            }else{
                utils.respMsg(res, false, '1000', '任务ID为空', null, null);
            }
        }).catch(function(err){
            logger.error("route-assign/interim_task","获取任务异常",err);
            utils.respMsg(res, false, '1000', 'rouute-assign/interim_task', null, err);
        });
    }else{
        utils.respMsg(res, false, '1000', '实例ID为空', null, null);
        return ;
    }
});



router.route("/process_info").post(function(req,res){
    var proc_code = req.body.proc_code; //流程编码
    if(proc_code){
        nodeTransferService.process_infomation(proc_code).then(function(rs){
            utils.respJsonData(res,rs);
        }).catch (function(err){
            utils.respMsg(res, false, '1000', '流程编码信息为空', null, null);
        });
    }else{
        utils.respMsg(res, false, '1000', '流程编码为空', null, null);
    }

});

module.exports = router;