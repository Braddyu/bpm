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
    //var  SCLASS_ID=req.body.SCLASS_ID;
    //var title = req.body.title;
    var condition={};
    if (req.body.SCLASS_ID) {
        condition.SCLASS_ID = req.body.SCLASS_ID;
    }
    // if (title) {
    //     condition.title = title;
    // }
    service.getHistoryList(condition,page,size).then(function (taskresult) {
       utils.respJsonData(res, taskresult);
    })
})
module.exports = router;