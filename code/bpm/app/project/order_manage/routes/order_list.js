var express = require('express');
var router = express.Router();
//var processService = require('../../../bpm/services/bpm_service');
var model = require('../../bpm_resource/models/process_model');
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../../bpm_resource/services/instance_service');
var proc = require('../services/order_list_service');
var logger = require('../../../../lib/logHelper').helper;
var config = require('../../../../config');


router.route('/list').post(function(req,res){
  console.log("=====order_list=========");
})



module.exports = router;
