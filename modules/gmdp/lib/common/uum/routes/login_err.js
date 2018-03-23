/**
 * Created by zhaojing on 2016/3/09.
 */

var express = require('express');
var router = express.Router();

var utils = require('../../core/utils/app_utils');
var service = require('../services/login_service');
var config = require('../../../../config');
router.route('/')

    // -------------------------------query查询列表-------------------------------
    .get(function(req,res){
        var page = req.query.page;
        var size = req.query.rows;
        var queryDate = req.query.queryDate;
        var user_no = req.query.user_no

        var map = {};
        if(queryDate){
            map.login_date =queryDate;
        }
        if(user_no){
            map.user_no = user_no;
        }
        service.getLogsList(page, size,map,function(result){
            utils.respJsonData(res, result);
        });
    })



router.route('/delete:id').delete(function (req,res) {
    var ids = req.params.id;
    service.delete(ids,function(result){
        utils.respJsonData(res, result);
    });
})


module.exports = router;