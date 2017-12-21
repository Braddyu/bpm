var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/mistake_list_service');

/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    console.log("开始获取所有工单列表...");
    var queryDate = req.body.queryDate;//查询时间
    var page = req.body.page;
    var size = req.body.rows;
    var conditionMap = {}
    if(queryDate){
        conditionMap = {mistake_time:queryDate.replace(/\-/g,'') ,status:0 };
    }

    // 调用分页
    service.getMistakeListPage(page,size,conditionMap)
        .then(function(result){
            console.log("获取所有工单列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取所有工单列表失败',err);

        });
})


/**
 * 差错工单派单
 */
router.route('/dispatch').post(function(req,res){
    console.log("开始派单...");
    var queryDate = req.body.queryDate.replace(/\-/g,'');//查询时间
    if(!queryDate){
        var result={"success":false,"msg":"查询时间不得为空"};
        utils.respJsonData(res, result);
        return;
    }

    // 调用分页
    service.dispatch(queryDate)
        .then(function(result){
            console.log("派发工单成功",result);
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            utils.respJsonData(res, err);
            console.log('派发工单失败',err);

        });
})
/**
 * 派单日志
 */
router.route('/dispatch_logs').post(function(req,res){
    console.log("开始获取派单日志...");
    var queryDate = req.body.queryDate.replace(/\-/g,'');//查询时间
    var page = req.body.page;
    var size = req.body.rows;

    var conditionMap = {}
    if(queryDate){
        conditionMap = {mistake_time:queryDate.replace(/\-/g,'') };
    }
    // 调用分页
    service.dispatch_logs(page,size,conditionMap)
        .then(function(result){
            console.log("派发工单成功",result);
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            utils.respJsonData(res, err);
            console.log('派发工单失败',err);

        });
})


module.exports = router;
