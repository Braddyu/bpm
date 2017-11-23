var express = require('express');
var router = express.Router();
var utils = require('../../../utils/app_utils');
var proc = require('../services/process_service');
var config = require('../../../../config');
var nodeAnalysisService=require("../services/node_analysis_service");
//process
/**
 *  -------------------------------获取流程定义集合接口-------------------------------
 */

router.route('/list').post(function(req,res){
        var page = req.body.page;
        var size = req.body.rows;
        var conditionMap = {};
        conditionMap.status = 1;
        // 调用分页
        proc.getProcessBaseList(page,size,conditionMap)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                console.log('err');
                console.log(err);
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
router.route("/show/process").get(function(req,res){
    var condition={};
    var proc_code=req.query.proc_code;
    var proc_inst_id=req.query.proc_inst_id;
    condition.proc_inst_id=proc_inst_id;
    proc.getShowProcess(condition).then(function(rs){
        utils.respJsonData(res,rs);
    });
});

//调用流程进度的页面
router.get('/show/progressed', function(req, res, next) {

    res.render(config.project.appviewurl+'common/app/process_showChart', {
        title: '首页' ,
        subtitle: 'Hello',
        layout:'themes/admin/blank',
        //menuid:'/home',
    });
});

//调用流程进度和处理日志的页面
router.get('/show/andProgressed', function(req, res, next) {

    res.render(config.project.appviewurl+'common/app/instance_showChart', {
        title: '首页' ,
        subtitle: 'Hello',
        layout:'themes/admin/blank',
        //menuid:'/home',
    });
});
//
//流程处理日志
router.route("/handler/logs").get(function(req,res){
    var condition={};
    var proc_inst_id=req.query.proc_inst_id;
    var page = req.query.page;
    var size = req.query.size;

    condition.proc_inst_id=proc_inst_id;
    proc.getProcHandlerLogsList(page,size,condition).then(function(rs){
        utils.respJsonData(res,rs);
    });
});
/**
 *未生成实例，获取第三节点处理人
 */
router.route("/getNodeUser").post(function(req,res){
    //流程编码
    var proc_code=req.body.proc_code;
    //派单人
    var user_no=req.body.user_no;
    //参数
    var params=req.body.params;
    nodeAnalysisService.getNodeAndHandlerInfo(proc_code,user_no,params).then(function(rs){
        console.log("下一节点处理人:",rs);
        utils.respJsonData(res,rs);
    });
});

/**
 * 节点详细信息，是否存在归档，拒绝节点
 */
router.route("/nodeDetail").post(function(req,res){
    //流程编码
    var proc_code=req.body.proc_code;
    //节点信息
    var node_code=req.body.node_code;
    nodeAnalysisService.getNodeDetail(proc_code,node_code).then(function(rs){
        console.log("下一节点处理人:",rs);
        utils.respJsonData(res,rs);
    });
});
module.exports = router;
