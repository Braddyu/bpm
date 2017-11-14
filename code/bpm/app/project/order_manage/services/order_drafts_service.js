
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
exports.getDraftsListPage= function(page,size,paramMap) {
    var p = new Promise(function(resolve,reject){
        utils.pagingQuery4Eui(model.$ProcessDreafts, page, size, paramMap, resolve, '',  {});

    });

    return p;
};
/**
 * 保存草稿箱
 * @param drafts
 */
exports.saveDrafts= function(drafts) {
    var arr=[];
    arr.push(drafts);
    var p = new Promise(function(resolve,reject) {
        //写入数据 创建任务
        model.$ProcessDreafts.create(arr, function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '保存草稿箱出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '保存草稿箱成功。', rs, null));
            }
        })
    });
    return p;
};

/**
 * 删除草稿
 * @param drafts
 * @returns {Promise}
 */
exports.deleteDrafts= function(_id) {

    var p = new Promise(function(resolve,reject) {
        //写入数据 创建任务
        model.$ProcessDreafts.remove({_id:_id}, function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '删除草稿箱出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '删除草稿箱成功。', rs, null));
            }
        })
    });
    return p;
};