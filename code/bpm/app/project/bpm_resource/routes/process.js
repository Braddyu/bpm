var express = require('express');
var router = express.Router();
var utils = require('../../../utils/app_utils');
var logger = require('../../../../lib/logHelper').helper
var proc = require('../services/process_service');
var config = require('../../../../config');
var nodeAnalysisService = require("../services/node_analysis_service");
var nodeTransferService=require("../services/node_transfer_service");
var inst = require('../services/instance_service');
//process
/**
 *  -------------------------------获取流程定义集合接口-------------------------------
 */
exports.process=function() {
    //中间件用来验证令牌
    router.use(function (req, res, next) {
        var url = req.url.indexOf('?') > -1 ? req.url.substring(0, req.url.indexOf('?')) : req.url;

        //获取令牌接口以及流程图不做验证
        if (url == '/token' || url == '/show/progressed' || url == '/show/process') {
            next();
        } else {
            //验证令牌是否正确
            if (req.headers.token || req.query.token || req.body.token) {
                //优先从header中获取，其次get和post
                var token = req.headers.token ? req.headers.token : (req.query.token ? req.query.token : req.body.token);
                nodeAnalysisService.valiateToken(token).then(function (re) {
                    if (re.success) {
                        next();
                    } else {
                        utils.respJsonData(res, re);
                    }
                });
            } else {
                utils.respJsonData(res, utils.returnMsg(false, '1000', '未传入令牌', null, null));
            }
        }

    });
    router.route('/list').post(function (req, res) {
        var page = req.body.page;
        var size = req.body.rows;
        var conditionMap = {};
        conditionMap.status = 1;
        // 调用分页
        proc.getProcessBaseList(page, size, conditionMap)
            .then(function (result) {
                utils.respJsonData(res, result);
            })
            .catch(function (err) {
                console.log(err);
                logger.error("route-getProcessBaseList", "获取流程定义集合数据异常", err);
                utils.respMsg(res, false, '1000', '获取流程定义集合数据异常', null, err);
            });
    });
// //展示流程进程
// router.get('/show/progressed', function(req, res, next) {
//     res.render('e:/xy/ylcq/guizhou/bpm/code/bpm/server/api/views/bpm/process/process_showChart', {
//         title: '首页' ,
//         subtitle: 'Hello',
//         layout:'themes/admin/blank',
//         //menuid:'/home',
//     });
// });
//流程进度
    /**
     * ----------------------展示流程进程当前信息--------------------------
     */
    router.route("/show/process").get(function (req, res) {

        var condition = {};
        var proc_code = req.query.proc_code;
        var proc_inst_id = req.query.proc_inst_id;
        if (!proc_inst_id) {
            utils.respMsg(res, false, '2001', '流程流转当前信息ID不能为空。', null, null);
            return;
        }
        condition.proc_inst_id = proc_inst_id;

        proc.getShowProcess(condition).then(function (rs) {
            utils.respJsonData(res, rs);
        }).catch(function (err_inst) {
            // console.log(err_inst);
            logger.error("route-getShowProcess", "获取流程流转当前信息数据异常", err_inst);
            utils.respMsg(res, false, '1000', '获取流程流转当前信息数据异常', null, err_inst);
        });
    });
    /**
     * -----------------------调用流程进度图的页面---------------------------
     */
    router.get('/show/progressed', function (req, res, next) {
        console.log("ssssssss")
        res.render(config.project.appviewurl + 'common/app/process_showChart', {
            title: '首页',
            subtitle: 'Hello',
            layout: 'themes/admin/blank',
        });
    });

    /**
     * ------------------调用流程进度图的页面-----------------------------------
     */
    router.get('/show/andProgressed', function (req, res, next) {

        res.render(config.project.appviewurl + 'common/app/instance_showChart', {
            title: '首页',
            subtitle: 'Hello',
            layout: 'themes/admin/blank',
            //menuid:'/home',
        });
    });

    /**
     * -----------------------流程处理日志--------------------------------------
     */
    router.route("/handler/logs").get(function (req, res) {
        var condition = {};
        var proc_inst_id = req.query.proc_inst_id;
        if (!proc_inst_id) {
            utils.respMsg(res, false, '2001', '流程流转当前信息ID不能为空。', null, null);
            return;
        }
        var page = req.query.page;
        var size = req.query.size;
        condition.proc_inst_id = proc_inst_id;
        proc.getProcHandlerLogsList(page, size, condition).then(function (rs) {
            utils.respJsonData(res, rs);
        }).catch(function (err_inst) {
            // console.log(err_inst);
            logger.error("route-getProcHandlerLogsList", "获取流程处理日志数据异常", err_inst);
            utils.respMsg(res, false, '1000', '获取流程处理日志数据异常', null, err_inst);
        });
    });
    /**
     *------------未生成实例，获取第三节点处理人------------------------
     */
    router.route("/getNodeUser").post(function (req, res) {
        //流程编码
        var proc_code = req.body.proc_code;
        //派单人
        var user_no = req.body.user_no;
        //参数
        var params = req.body.params;
        console.log(params);
        if (!user_no) {
            utils.respMsg(res, false, '2001', '派单人姓名不能为空。', null, null);
            return;
        }
        if (!proc_code) {
            utils.respMsg(res, false, '2001', '流程编码不能为空。', null, null);
            return;
        }
        nodeAnalysisService.getNodeAndHandlerInfo(proc_code, user_no, params).then(function (rs) {
            console.log("下一节点处理人:", rs);
            utils.respJsonData(res, rs);
        }).catch(function (err_inst) {
            // console.log(err_inst);
            logger.error("route-getProcHandlerLogsList", "获取第三节点处理人数据异常", err_inst);
            utils.respMsg(res, false, '1000', '获取第三节点处理人数据异常', null, err_inst);
        });
    });

    /**
     * 查询节点详细信息，是否存在归档，拒绝节点
     */
    router.route("/nodeDetail").post(function (req, res) {
        //流程编码
        var proc_code = req.body.proc_code;
        console.log(proc_code);
        if (!proc_code) {
            utils.respMsg(res, false, '2001', '流程编码不能为空。', null, null);
            return;
        }
        //节点信息
        var node_code = req.body.node_code;
        if (!node_code) {
            utils.respMsg(res, false, '2001', '节点编码不能为空。', null, null);
            return;
        }
        nodeAnalysisService.getNodeDetail(proc_code, node_code).then(function (rs) {
            console.log("下一节点处理人:", rs);
            utils.respJsonData(res, rs);
        }).catch(function (err_inst) {
            // console.log(err_inst);
            logger.error("route-getProcHandlerLogsList", "获取数据异常", err_inst);
            utils.respMsg(res, false, '1000', '获取数据异常', null, err_inst);
        });
    });


    /**
     * 用户用雅典娜系统的营业员数据同步的接口
     * 参数1 sys_name="athena" 同步雅典娜拉取营业员数据
     */
    router.route("/data/info").post(function (req, res) {
        // var sys_name=req.body.sys_name;//系统名称参数
        var role_type = req.body.role_type;//查询的角色类型
        var condition = {};
        if (role_type) {
            if (role_type == "sales") {
                condition.user_roles = "5a26418c5eb3fe1068448753";//查询营业员
            } else if (role_type == "hall_manager") {
                condition.user_roles = "5a266868bfb42d1e9cdd5c6e";//查询厅经理
            } else if (role_type == "grid_manager") {
                condition.user_roles = "5a264057c819ed211853907a";//查询网格jinli
            } else {
                utils.respMsg(res, false, '1000', '系统参数不匹配，请重新核对', null, null);
            }
            proc.sendSalesDataToAthena(condition).then(function (rs) {
                utils.respJsonData(res, rs);
            }).catch(function (err) {
                logger.error("route-sendSalesDataToAthena", "获取数据异常", err);
                utils.respMsg(res, false, '1000', '获取数据异常', null, err);
            });
        } else {
            proc.sendSalesDataToAthena_other().then(function (rs) {
                utils.respJsonData(res, rs);
            }).catch(function (err) {
                logger.error("route-sendSalesDataToAthena", "获取数据异常", err);
                utils.respMsg(res, false, '1000', '获取数据异常', null, err);
            });
        }

    });
    /**
     *  跳过节点的三合一接口(慧眼系统)
     *
     */
    router.route("/exampleAndTask").post(function (req, res) {
        var proc_code = req.body.proc_code;
        var proc_ver = req.body.proc_ver;
        var user_no = req.body.user_no;
        var params = req.body.params;
        var node_code = req.body.node_code;
        var joinup_sys = req.body.joinup_sys;
        var user_name = req.body.user_name;
        var proc_vars = req.body.proc_vars;
        var proc_title = req.body.proc_title;
        var memo = req.body.memo;
        var assign_user_no = req.body.assign_user_no;
        var biz_vars = req.body.biz_vars;
        if (!user_no) {
            utils.respMsg(res, false, '2001', '派单人姓名不能为空。', null, null);
            return;
        }
        if (!proc_code) {
            utils.respMsg(res, false, '2001', '流程编码不能为空。', null, null);
            return;
        }
        if (!node_code) {
            utils.respMsg(res, false, '2001', '节点编码不能为空。', null, null);
            return;
        }
        nodeAnalysisService.find_role(user_no).then(function (rs) {
            var user_info = rs.data;
            console.log(user_info[0].user_roles, "aaa123");
            if (rs.success) {
                nodeAnalysisService.example_task(user_no, proc_code, params, node_code, joinup_sys, user_name, proc_vars, user_info[0].user_roles, proc_title, proc_ver).then(function (rs) {
                    if (rs.success) {
                        console.log(rs, 'lslkdkdo');
                        var task_id = rs.data[0]._id;
                        //认领任务
                        inst.acceptTask(task_id, user_no, user_name).then(function (rs) {
                            if (rs.success) {
                                nodeTransferService.assigntransfer(task_id, node_code, user_no, assign_user_no, proc_title, biz_vars, proc_vars, memo).then(function (results) {
                                    utils.respJsonData(res, results);
                                }).catch(function (err_inst) {
                                    // console.log(err_inst);
                                    logger.error("route-do_payout", "派发任务异常", err_inst);
                                    utils.respMsg(res, false, '1000', '派发任务异常', null, err_inst);
                                });
                            } else {
                                utils.respJsonData(res, rs);
                            }
                        }).catch(function (err_inst) {
                            logger.error("route-acceptTask", "认领任务异常", err_inst);
                            utils.respMsg(res, false, '1000', '认领任务异常', null, err_inst);
                        });
                    } else {
                        //utils.respJsonData(res,result);
                    }
                });
            } else {

            }
        });
    });

    /**
     *  跳过节点的任务新建和下下节点任务的指派
     *
     */

    router.route("/skip/node/user/info").post(function (req, res) {
        var proc_code = req.body.proc_code;
        var user_no = req.body.user_no;
        var params = req.body.params;
        var node_code = req.body.node_code;
        var task_id = req.body.task_id;
        if (!user_no) {
            utils.respMsg(res, false, '2001', '派单人姓名不能为空。', null, null);
            return;
        }
        if (!proc_code) {
            utils.respMsg(res, false, '2001', '流程编码不能为空。', null, null);
            return;
        }
        if (!node_code) {
            utils.respMsg(res, false, '2001', '节点编码不能为空。', null, null);
            return;
        }

        nodeAnalysisService.skipNodeAndGetHandlerInfo(user_no, proc_code, params, node_code, task_id).then(function (rs) {
            utils.respJsonData(res, rs);
        });
    });

    /**
     *  查询某一条待办的接口，返回这条待办的对象数据
     *
     */
    router.route("/single/todo").post(function (req, res) {
        var _id = req.body.inst_id;//实例Id
        var user_no = req.body.user_no;//当前任务处理人
        inst.getMyTaskQuery(_id, user_no)
            .then(function (result) {
                utils.respJsonData(res, result);
            })
            .catch(function (err) {
                logger.error("route-getTaskByid", "根据任务_id获取我的待办数据异常", err);
                utils.respMsg(res, false, '1000', '获取数据异常', null, err);
            })

    });

    router.route("/assiant/node").post((req, res) => {
        var node_code = req.body.node_code;
        var user_no = req.body.user_no;
        var proc_code = req.body.proc_code;
        var params = req.body.params;
        var flag = req.body.flag;
        var role_no;
        if (flag) {
            role_no = "5a264057c819ed2118539079"

        } else {

            utils.respMsg(res, false, '2001', 'fanzheng  jiushi cuole 。', null, null);

        }

        nodeAnalysisService.getAssiantMain(user_no, role_no, proc_code, params, node_code).then((rs) => {
            utils.respJsonData(res, rs);
        });

    });

    /**
     * 获取令牌
     */
    router.route("/token").get(function (req, res) {
        var key=req.query.key;
        //必须传入key=gdgl
        if(key && key =='gdgl'){
            //获取请求ip
            var ip = req.headers['x-forwarded-for'] ||
                req.ip ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress || '';
            if(ip.split(',').length>0){
                ip = ip.split(',')[0]
            }
            nodeAnalysisService.token(ip).then(function(re){
                utils.respJsonData(res, re);
            });
        }else{
            utils.respJsonData(res, utils.returnMsg(false, '1000', '错误的参数。', null, null));
        }
    });
   return router;
}
