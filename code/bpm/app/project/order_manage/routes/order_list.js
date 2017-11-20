var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_list_service');
var formidable=require("formidable");
var inst = require('../services/instance_service');
var nodeTransferService=require("../services/node_transfer_service");
var userService = require('../../workflow/services/user_service');
var nodeAnalysisService=require("../services/node_analysis_service");
/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    console.log("开始获取所有工单列表...");
    var userNo = req.session.current_user.user_no;//用户编号
    var page = req.body.page;
    var size = req.body.rows;
    console.log(req.session.current_user)
    var conditionMap = {proc_start_user:userNo};

    // 调用分页
    service.getOrderListPage(page,size,conditionMap)
        .then(function(result){
            console.log("获取所有工单列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取所有工单列表失败',err);

        });
})

/**
 * 工单类型即所有流程
 */
router.route('/proBase').get(function(req,res){
    console.log("开始获取工单类型下拉框.......");
    service.getAllProBase()
        .then(function(result){
            console.log("获取下拉框结果:",result.success);
            if(result.success){
                utils.respJsonData(res, result.data);
            }
        })
        .catch(function(err){
            console.log('获取下拉框失败',err);

        });
})

/**
 * 获取对应流程的第二节点信息，即发起工单的开始节点信息
 */
router.route('/procDefineDetail').post(function(req,res){
    //流程编码
    var proc_code=req.body.proc_code;
    //当前节点
    var proc_inst_task_code=req.body.proc_inst_task_code;

    console.log("开始获取对应流程的详细信息.......","proc_code:",proc_code,";proc_inst_task_code:",proc_inst_task_code);
    service.getProcDefineDetail(proc_code,proc_inst_task_code)
        .then(function(result){
            console.log("获取获取对应流程的详细信息结果:",result);
             utils.respJsonData(res, result);

        })
        .catch(function(err){
            console.log('获取获取对应流程的详细信息失败',err);

        });
})
/**
 * 创建工单,三合一
 */
router.route("/createAndAcceptAssign").post(function(req,res){

    var proc_code = req.body.proc_code;
    var proc_ver = req.body.proc_ver;
    var proc_title = req.body.proc_title;
    var user_code = req.session.current_user.user_no;
    var assign_user_no=req.body.assign_user_no;
    var userName=req.session.current_user.user_name;
    //var node_code=req.body.node_code;//要流转到的节点编号
    var node_code='processDefineDiv_node_3';
    var biz_vars=req.body.biz_vars;
    var proc_vars=req.body.proc_vars;
    var memo=req.body.memo;
    var proc_day=req.body.proc_work_day;//天数
    var proc_content = req.body.proc_content;

    // 调用
    //p-108 渠道酬金 undefined 00000 管理员 processDefineDiv_node_3 00000 {"audit_id":"1800","table_name":"ywcj_workbench_audit"}
    console.log(proc_code,proc_title,proc_ver,user_code,userName,node_code,assign_user_no,biz_vars);
    inst.createInstance(proc_code,proc_ver,proc_title,"",proc_vars,biz_vars,user_code,userName,proc_day,proc_content)
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
 * 创建工单
 */
router.route('/createInstance').post(function(req,res){
    console.log("开始创建工单...");
    var proc_code = req.body.proc_code;
    var userName=req.session.current_user.user_name;
    var proc_ver = req.body.proc_ver;
    var proc_title = req.body.proc_title;
    var user_code = req.session.current_user.user_no;
    var biz_vars = req.body.biz_vars;
    var proc_vars = req.body.proc_vars;
    var proc_day=req.body.proc_work_day;//天数
    var proc_content = req.body.proc_content;

    console.log(proc_code,proc_ver,proc_title,user_code,biz_vars,proc_vars);
    // 调用
    inst.createInstance(proc_code,proc_ver,proc_title,"",proc_vars,biz_vars,user_code,userName,proc_day,proc_content)
        .then(function(result){
            console.log("result===========:",result);
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('err');

        });
});

/**
 * 获取下一步节点或者操作人
  */

router.route("/nextNodeUser").post(function(req,res){
    console.log("开始获取下一节点处理人...");
    var node_code=req.body.node_code;
    var proc_task_id=req.body.proc_task_id;
    var proc_inst_id=req.body.proc_inst_id;
    var user_no= req.session.current_user.user_no;
    var params_str=req.body.params;
    var params={};
    if(params_str){
        params=JSON.parse(params_str);
    }
    nodeAnalysisService.getNextNodeAndHandlerInfo(node_code,proc_task_id,proc_inst_id,params,user_no).then(function(rs){
        console.log("下一节点处理人:",rs);
        utils.respJsonData(res,rs);
    });
});


/**
 * 指派任务
 */
router.route("/assignTask").post(function(req,res){
    console.log("开始分配任务...")
    var task_id=req.body.proc_task_id;
    var node_code=req.body.next_code;
    var user_no=req.session.current_user.user_no;
    var assign_user_no=req.body.assign_user_no;
    var proc_title=req.body.proc_inst_task_title;
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

/**
 * 完成任务
 */
router.route('/complete') .post(function(req,res) {
        console.log("开始完成任务...");
        var id = req.body.proc_task_id;//任务id
        var memo = req.body.memo;//处理意见
        var user_code = req.session.current_user.user_no;//处理人编码
        var handle = req.body.handle;//操作
        var params={};//流转参数
        //通过或者归档
        if(handle=='1'){
            params.flag=true;
         }else{
            params.flag=false;
        }
        var biz_vars;
        var proc_vars;
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
                    console.log("route-transfer","流程流转异常",err_inst);
                    utils.respMsg(res, false, '1000', '流程流转异常', null, err_inst);
                });
            }else{
                utils.respJsonData(res, taskresult);
            }
        }).catch(function(err_inst){
            console.log("route-getTaskById","获取任务异常",err_inst);
            utils.respMsg(res, false, '1000', '获取任务异常', null, err_inst);
        });
    });



module.exports = router;
