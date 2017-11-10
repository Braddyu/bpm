var express = require('express');
var router = express.Router();
//var processService = require('../../../bpm/services/bpm_service');
var model = require('../../bpm_resource/models/process_model');
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../../bpm_resource/services/instance_service');
var service = require('../services/order_list_service');
var logger = require('../../../../lib/logHelper').helper;
var config = require('../../../../config');

/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    console.log("begin");
    var page = req.body.page;
    var size = req.body.rows;
    var conditionMap = {};

    // 调用分页
    service.getOrderListPage(page,size,conditionMap)
        .then(function(result){
           console.log(result);
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('err');
            console.log(err);
        });
})



module.exports = router;
