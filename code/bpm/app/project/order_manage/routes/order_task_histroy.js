var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_task_histroy_service');

/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    var page = req.body.page;
    var size = req.body.rows;
    var condition={};
    if (req.body.startDate) {
        condition.startDate = req.body.startDate;//开始时间
    }else {
        condition.startDate= new Date().toLocaleString();
    }

    if (req.body.endDate) {
        condition.endDate = req.body.endDate;//结束时间
    }else{
        condition.endDate=new Date().toLocaleString();
    }
    if (req.body.user_no) {
        condition.user_no = req.body.user_no;//boss工号
    }
    service.getTaskHistoryList(condition,page,size).then(function (taskresult) {
        utils.respJsonData(res, taskresult);
    }).catch(function(err){
        console.log('获取信息失败',err);
    });
})
module.exports = router;