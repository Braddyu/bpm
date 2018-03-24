var model = require('../../core/models/user_model');
var utils = require('../../../common/core/utils/app_utils');
/**
 * 分页查询
 * @param page
 * @param size
 * @param name
 * @param cb
 */
exports.getLogsList = function(page, size,map, cb) {
    utils.pagingQuery4Eui(model.$CommonUserLoginErrorLog, page, size,map, cb,'',{login_time:-1});
};

exports.delete = function(ids, cb) {
       var id = ids.split(',');
           model.$CommonUserLoginErrorLog.remove({'_id':{$in:id}},function(err,resu){
               if(err){
                   cb(utils.returnMsg(false, '1000', '删除数据时出现异常', null, err));
               }else{
                   cb(utils.returnMsg(true, '0000', '删除数据成功', null, null));
               }
           });
    };
