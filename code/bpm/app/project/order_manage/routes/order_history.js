var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_history_service');
/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    var page = req.body.page;
    var size = req.body.rows;
    var condition={};
    if (req.body.SCLASS_ID) {
        condition.SCLASS_ID = req.body.SCLASS_ID;//
    }
    if (req.body.startDate) {
        condition.startDate = req.body.startDate;//开始时间
    }
    if (req.body.endDate) {
        condition.endDate = req.body.endDate;//结束时间
    }
    if (req.body.chlId) {
        condition.chlId = req.body.chlId;//被派单渠道id
    }
    if (req.body.job_id) {
        condition.job_id = req.body.job_id;//工单id
    }
    service.getHistoryList(condition,page,size).then(function (taskresult) {
       utils.respJsonData(res, taskresult);
    })
})
module.exports = router;