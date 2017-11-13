
var model = require('../models/drafts_model');

var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;

/**
 * 获取我的草稿箱数据
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getDraftsListPage= function(page,size,userCode,paramMap) {
    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessDreafts, page, size, conditionMap, resolve, '',  {});

    });

    return p;
};