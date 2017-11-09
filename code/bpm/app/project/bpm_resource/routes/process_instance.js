var express = require('express');
var router = express.Router();
var logger = require('../../../../lib/logHelper').helper;
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../services/instance_service');
var nodeTransferService=require("../services/node_transfer_service");
var userService = require('../services/user_service');
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

    // 调用
    //p-108 渠道酬金 undefined 00000 管理员 processDefineDiv_node_3 00000 {"audit_id":"1800","table_name":"ywcj_workbench_audit"}
    console.log(proc_code,proc_title,proc_ver,user_code,userName,node_code,assign_user_no,biz_vars);
    inst.createInstance(proc_code,proc_ver,proc_title,"",proc_vars,biz_vars,user_code,userName)
        .then(function(result){
          if(result.success){
              var task_id=result.data[0]._id;
              inst.acceptTask(task_id,user_code,userName).then(function(rs){
                  if(rs.success){
                     console.log("11111111111",task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars);
                    //  nodeTransferService.assign_transfer(task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(results){
                     nodeTransferService.do_payout(task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(results){
                         utils.respJsonData(res,results);
                     });
                  }else{
                      utils.respJsonData(res,rs);
                  }

              })
          }else{
              utils.respJsonData(res,result);

          }

        }).catch(function(err){
            console.log('err');
            // console.log(err);
            logger.error("route-createInstance","创建流程实例异常",err);
        });
});


/**
 *  -------------------------------针对小朱制造的方法 用于第二节点之后的信息查询-------------------------------
 */
router.route("/getSecondNodeInfo").post(function(req,res){
    var proc_code = req.body.proc_code;
    // 分页参数
    var proc_ver = req.body.proc_ver;
    var proc_title = req.body.title;
    nodeAnalysisService.getSecondNodeInfo(proc_code,proc_ver,proc_title).then(function(rs){
        utils.respJsonData(res, rs);
    });
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
        // 调用
        inst.createInstance(proc_code,proc_ver,proc_title,user_code,"",proc_vars,biz_vars)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                console.log('err');
                // console.log(err);
                logger.error("route-createInstance","创建流程实例异常",err);
            });
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
    if(user_no){
        conditionMap.proc_start_user = user_no;
    }
    if(proc_code){
        conditionMap.proc_code = proc_code;
    }else{
        utils.respMsg(res, false, '1000', '流程编号不能为空', null, null);
        return;
    }
        // 调用分页
        inst.getInstanceQuery4EuiList(page,length,conditionMap)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                console.log('err');
                // console.log(err);
                logger.error("route-list","查询流程实例集合异常",err);
            });
    });
/**
 *  -------------------------------终止流程实例接口-------------------------------
 */
router.route('/cancleInstance').post(function(req,res){
        // 分页条件
        var inst_id = req.body.inst_id;

        inst.cancleInstance(inst_id)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                console.log('err');
                // console.log(err);
                logger.error("route-cancleInstance","取消流程实例异常",err);
            });
    });
/**
 *  -------------------------------启用流程实例接口-------------------------------
 */
router.route('/enableInstance').post(function(req,res){
        // 分页条件
        var inst_id = req.body.inst_id;

        inst.instChangeStatus(inst_id,1)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                console.log('err');
                // console.log(err);
                logger.error("route-startInstance","启用流程实例异常",err);
            });
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
        }
        conditionMap.proc_start_user = user_no;
        conditionMap.proc_inst_status = 4;//已归档的数据
        //调用方法
        inst.getProcInstHistoryList(page,length,conditionMap).then(function(result){
            utils.respJsonData(res, result);
        }).catch(function(err_inst){
            // console.log(err_inst);
            logger.error("route-history","获取历史数据异常",err_inst);
            utils.respMsg(res, false, '1000', '获取历史数据异常', null, err_inst);
        });

    });
//getNextNodeAndUser 获取下一步节点或者操作人
router.route("/next/nodeAnduser").post(function(req,res){
    var node_code=req.body.node_code;
    var proc_task_id=req.body.proc_task_id;
    var proc_inst_id=req.body.proc_inst_id;
    var user_no=req.body.user_no;
    var params_str=req.body.params;
    var params={};
    if(params_str){
        params=JSON.parse(params_str);
    }
    nodeAnalysisService.getNextNodeAndHandlerInfo(node_code,proc_task_id,proc_inst_id,params,user_no).then(function(rs){
        utils.respJsonData(res,rs);
    });
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
    });
});




module.exports = router;
