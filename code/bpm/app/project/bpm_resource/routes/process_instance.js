var express = require('express');
var router = express.Router();
var logger = require('../../../../lib/logHelper').helper;
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../services/instance_service');
var nodeTransferService=require("../services/node_transfer_service");
var userService = require('../../workflow/services/user_service');
var nodeAnalysisService=require("../services/node_analysis_service");



/**
 *  -------------------------------用于创建任务 直接到分配到第三节点-------------------------------
 */
router.route("/createAndAcceptAssign").post(function(req,res){

    // 分页条件
    var proc_code = req.body.proc_code;
    // 分页参数
    var proc_ver = req.body.proc_ver;
    var proc_title = req.body.title;
    var user_code = req.body.user_no;
    var assign_user_no=req.body.assign_user_no;
    var userName=req.body.user_name;
    var node_code=req.body.node_code;//要流转到的节点编号
    var biz_vars=req.body.biz_vars;
    var proc_vars=req.body.proc_vars;
    var memo=req.body.memo;
    if(!assign_user_no){
        utils.respMsg(res, false, '2001', '下一节点处理人编号为空', null, null);
        return;
    }
    if(!user_code){
        utils.respMsg(res, false, '2001', '当前处理人编号为空', null, null);
    }else{
          //判断用户是否存在
            inst.userInfo(user_code).then(function(rs){
                if(rs.success && rs.data.length==1){
                    //创建实例,并生成任务
                    inst.createInstance(proc_code,proc_ver,proc_title,"",proc_vars,biz_vars,user_code,userName)
                        .then(function(result){
                            if(result.success){
                                var task_id=result.data[0]._id;
                                //认领任务
                                inst.acceptTask(task_id,user_code,userName).then(function(rs){
                                    if(rs.success){
                                        console.log("11111111111",task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars);
                                        //  nodeTransferService.assign_transfer(task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(results){
                                        //批量派发
                                        nodeTransferService.do_payout(task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(results){
                                            utils.respJsonData(res,results);
                                        }).catch(function(err_inst){
                                            // console.log(err_inst);
                                            logger.error("route-do_payout","派发任务异常",err_inst);
                                            utils.respMsg(res, false, '1000', '派发任务异常', null, err_inst);
                                        });
                                    }else{
                                        utils.respJsonData(res,rs);
                                    }
                                }).catch(function(err_inst){
                                    // console.log(err_inst);
                                    logger.error("route-acceptTask","认领任务异常",err_inst);
                                    utils.respMsg(res, false, '1000', '认领任务异常', null, err_inst);
                                });
                            }else{
                                utils.respJsonData(res,result);
                            }

                        }).catch(function(err){
                        console.log('err');
                        logger.error("route-createInstance","创建流程实例异常",err);
                    });
                }else{
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
    }
});


/**
 *  -------------------------------针对小朱制造的方法 用于第二节点之后的信息查询-------------------------------
 */
router.route("/getSecondNodeInfo").post(function(req,res){
    var proc_code = req.body.proc_code;
    // 分页参数
    var proc_ver = req.body.proc_ver;
    var proc_title = req.body.title;
    if(proc_code){
        nodeAnalysisService.getSecondNodeInfo(proc_code,proc_ver,proc_title).then(function(rs){
            utils.respJsonData(res, rs);
        }).catch(function(err_inst){
            logger.error("route-getSecondNodeInfo","信息查询异常",err_inst);
            utils.respMsg(res, false, '1000', '信息查询异常', null, err_inst);
        });
    }else{
        utils.respMsg(res, false, '2001', '流程编号为空', null, null);
    }

});
/**
 *  -------------------------------创建流程实例接口-------------------------------
 */
router.route('/createInstance').post(function(req,res){
        // 分页条件
        var proc_code = req.body.proc_code;
        // 分页参数
        var proc_ver = req.body.proc_ver;
        var proc_title = req.body.title;
        var user_code = req.body.user_no;
        var biz_vars = req.body.biz_vars;
        var proc_vars = req.body.proc_vars;
        if(!proc_code){
            utils.respMsg(res, false, '2001', '流程编号为空', null, null);
            return;
        }
        if(!user_code){
            utils.respMsg(res, false, '1000', '当前处理人编号为空', null, null);
        }else{
            //判断用户是否存在
            inst.userInfo(user_code).then(function(rs){
                if(rs.success && rs.data.length==1){
                    // 调用
                    inst.createInstance(proc_code,proc_ver,proc_title,user_code,"",proc_vars,biz_vars)
                        .then(function(result){
                            utils.respJsonData(res, result);
                        }).catch(function(err){
                            console.log('err');
                            logger.error("route-createInstance","创建流程实例异常",err);
                            utils.respMsg(res, false, '1000', '创建流程实例异常', null, err);
                        });
                }else{
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    });
/**
 *  -------------------------------查询流程实例接口-------------------------------
 */
router.route('/list').post(function(req,res){
    // 分页参数
    var page = req.body.page;
    var length = req.body.rows;
    var proc_code = req.body.proc_code;
    var user_no = req.body.user_no;
    var conditionMap = {};
        if(proc_code){
            conditionMap.proc_code = proc_code;
        }else{
            utils.respMsg(res, false, '2001', '流程编号不能为空', null, null);
            return;
        }
        if(!user_no){
            utils.respMsg(res, false, '1000', '当前处理人编号为空', null, null);
        }else{
            //判断用户是否存在
            inst.userInfo(user_no).then(function (rs) {
                if(rs.success &&　rs.data.length == 1){
                    conditionMap.proc_start_user = user_no;
                    // 调用分页
                    inst.getInstanceQuery4EuiList(page,length,conditionMap).then(function(result){
                            utils.respJsonData(res, result);
                        }).catch(function(err){
                            console.log('err');
                            logger.error("route-list","查询流程实例集合异常",err);
                            utils.respMsg(res, false, '1000', '查询流程实例集合异常', null, err);
                        });
                }else{
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            })
        }
        });
/**
 *  -------------------------------终止流程实例接口-------------------------------
 */
router.route('/cancleInstance').post(function(req,res){
        // 流程实例id
        var inst_id = req.body.inst_id;
        if(inst_id){
            //更改流程实例状态
            inst.cancleInstance(inst_id).then(function(result){
                    utils.respJsonData(res, result);
                }).catch(function(err){
                    console.log('err');
                    logger.error("route-cancleInstance","取消流程实例异常",err);
                    utils.respMsg(res, false, '1000', '取消流程实例异常', null, err);
                });
        }else{
            utils.respMsg(res, false, '2001', '流程实例编号为空', null, null);
        }
    });
/**
 *  -------------------------------启用流程实例接口-------------------------------
 */
router.route('/enableInstance').post(function(req,res){
        // 流程实例id
        var inst_id = req.body.inst_id;
      if(inst_id){
          //启用、禁用操作
          inst.instChangeStatus(inst_id,1).then(function(result){
                  utils.respJsonData(res, result);
              }).catch(function(err){
                  console.log('err');
                  logger.error("route-startInstance","启用流程实例异常",err);
                  utils.respMsg(res, false, '1000', '启用流程实例异常', null, err);
              });
      }else{
          utils.respMsg(res, false, '2001', '流程实例编号为空', null, null);
      }
    });



router.route('/history')
    // -------------------------------获取流程实例历史数据接口-------------------------------
    .post(function(req,res) {
        var user_no = req.body.user_no;//用户编号
        var page = req.body.page;
        var length = req.body.rows;
        var conditionMap = {};
        // 用户编号是否为空
        if(!user_no) {
            utils.respMsg(res, false, '2001', '用户编号不能为空。', null, null);
            return;
        }else{
            //判断用户是否存在
            inst.userInfo(user_no).then(function(rs){
                if(rs.success && rs.data.length == 1){
                    conditionMap.proc_start_user = user_no;
                    conditionMap.proc_inst_status = 4;//已归档的数据
                    //调用方法
                    inst.getProcInstHistoryList(page,length,conditionMap).then(function(result){
                        utils.respJsonData(res, result);
                    }).catch(function(err_inst){
                        logger.error("route-history","获取历史数据异常",err_inst);
                        utils.respMsg(res, false, '1000', '获取历史数据异常', null, err_inst);
                    });
                }else{
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
        }
    });
//getNextNodeAndUser 获取下一步节点或者操作人
router.route("/next/nodeAnduser").post(function(req,res){
    var node_code=req.body.node_code;
    var proc_task_id=req.body.proc_task_id;
    var proc_inst_id=req.body.proc_inst_id;
    var user_no=req.body.user_no;
    var params_str=req.body.params;
    var params = eval('(' + params_str + ')');

    // var params={};
    // if(params_str){
    //     params=JSON.parse(params_str);
    // }
    if(!proc_task_id){
        utils.respMsg(res, false, '2001', '任务编号不能为空', null, null);
        return;
    }
    if(!proc_inst_id){
        utils.respMsg(res, false, '2001', '实例编号不能为空', null, null);
        return;
    }
    if(!user_no){
        utils.respMsg(res, false, '2001', '处理人编号不能为空', null, null);
    }else{
            //判断用户是否存在
            inst.userInfo(user_no).then(function(rs){
                if(rs.success && rs.data.length == 1){
                    nodeAnalysisService.getNextNodeAndHandlerInfo(node_code,proc_task_id,proc_inst_id,params,user_no).then(function(rs){
                        utils.respJsonData(res,rs);
                    }).catch(function(err_inst){
                        logger.error("route-getNextNodeAndHandlerInfo","获取下一节点数据异常",err_inst);
                        utils.respMsg(res, false, '1000', '获取下一节点数据异常', null, err_inst);
                    });
                }else{
                    utils.respMsg(res, false, '1000', '用户不存在', null, null);
                }
            });
    }
});


//获取当前节点操作人信息
router.route("/get/current_users/info").get(function(req,res){
    var task_id=req.query.proc_task_id;
    var node_code=req.query.node_code;
    if(task_id){
        utils.respJsonData(res,{"success":false,"msg":"任务ID不能为空","code":1000})
    }
    if(node_code){
        utils.respJsonData(res,{"success":false,"msg":"节点编号不能为空","code":1000})
    }
    nodeAnalysisService.findCurrentHandlers(task_id,node_code).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err_inst){
        logger.error("route-findCurrentHandlers","获取当前操作人数据异常",err_inst);
        utils.respMsg(res, false, '1000', '获取当前操作人数据异常', null, err_inst);
    });

});

//获取所有的下一节点 node_code node el
router.route("/get/next_nodes/info").get(function(req,req){
    var task_id=req.query.proc_task_id;
    var node_code=req.query.node_code;
    if(task_id){
        utils.respJsonData(res,{"success":false,"msg":"查询下一节点信息失败","code":1000})
    }
    if(node_code){
        utils.respJsonData(res,{"success":false,"msg":"查询下一节点信息失败","code":1000})
    }
    nodeAnalysisService.getAllNextNodeAndInfo(task_id,node_code).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err_inst){
        logger.error("route-getAllNextNodeAndInfo","获取所有下一节点信息异常",err_inst);
        utils.respMsg(res, false, '1000', '获取所有下一节点信息异常', null, err_inst);
    });
});




module.exports = router;
