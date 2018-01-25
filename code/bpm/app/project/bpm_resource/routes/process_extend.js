/**
 * 某些特殊需求的针对性接口
 * @type {*|youjian}
 */

var express = require('express');
var router = express.Router();
var logger = require('../../../../lib/logHelper').helper;
var utils = require('../../../../lib/utils/app_utils');
var process_extend_service=require("../services/process_extend_service");
var nodeAnalysisService=require("../services/node_analysis_service");
var proc = require('../services/process_service');


/**
 * 针对预警工单和差错工单的统计接口
 * 描述:将工单对应的区域信息插入统计表中
 * 注：因为此接口是单独针对预警工单和差错工单的接口，在找渠道时，需要强制在绘制流程图时，厅店节点的名称必须是"厅店处理回复"
 */
exports.process_extend=function() {

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


    router.route('/addStatistics').post(function (req, res) {
        console.log("开始运行...");
        // 获取提交信息
        var inst_id = req.body.inst_id;//实例ID
        var dispatch_time = req.body.dispatch_time;//派单时间
        console.log("参数为:", inst_id, dispatch_time);
        if (!inst_id) {
            utils.respMsg(res, false, '2001', '实例ID不得为空。', null, null);
            return;
        }
        //将实例信息和区域信息插入统计表
        process_extend_service.addStatistics(inst_id, dispatch_time).then(function (rs) {
            utils.respJsonData(res, rs);
        }).catch(function (e) {
            utils.respJsonData(res, e);
        });
    });

    /**
     * 针对雅典娜抄送信息给网格经理
     */
    router.route('/copyToSend').post(function (req, res) {
        console.log("开始运行...");
        // 获取提交信息
        var inst_id = req.body.inst_id;//实例ID
        console.log("参数为:", inst_id);
        if (!inst_id) {
            utils.respMsg(res, false, '2001', '实例ID不得为空。', null, null);
            return;
        }
        //抄送给网格经理
        process_extend_service.copyToSend(inst_id).then(function (rs) {
            utils.respJsonData(res, rs);
        }).catch(function (e) {
            utils.respJsonData(res, e);
        });
    });


    /**
     * 暂时查询任务账号
     */
    router.route('/query').get(function (req, res) {

        var proc_code = req.query.proc_code;

        var user_name = req.query.user_name;
        console.log(proc_code,user_name);
        //将实例信息和区域信息插入统计表
        process_extend_service.query(proc_code,user_name).then(function (rs) {
            utils.respJsonData(res, rs);
        }).catch(function (e) {
            utils.respJsonData(res, e);
        });
    });

    return router;
}
