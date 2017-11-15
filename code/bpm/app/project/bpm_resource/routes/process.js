var express = require('express');
var router = express.Router();
var utils = require('../../../utils/app_utils');
var proc = require('../services/process_service');
var config = require('../../../../config');
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


module.exports = router;
