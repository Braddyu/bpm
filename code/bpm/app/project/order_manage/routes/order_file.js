var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_file_service');

/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    console.log("开始获取归档工单列表...");
    var page = req.body.page;
    var size = req.body.rows;
    var work_order_number = req.body.work_order_number;
    var proc_code = req.body.proc_code;//流程编码

    var conditionMap = {};
    if(proc_code){
        conditionMap.proc_code=proc_code;
    }
    if(work_order_number){
        conditionMap.work_order_number=work_order_number;
    }
    var compare={};
    // 调用分页
    service.getOrderfileListPage(page,size,conditionMap)
        .then(function(result){
            console.log("获取所有工单列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取所有工单列表失败',err);

        });
})


module.exports = router;
