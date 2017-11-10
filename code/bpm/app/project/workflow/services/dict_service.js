var dictModel = require('../models/dict_model');
var Promise = require("bluebird")
var utils = require('../../../../lib/utils/app_utils');

/**
 * 获取字典下拉框数据
 * @param cb
 */
exports.getDictSelectData = function(dict_code) {
    console.log("dict_code:"+dict_code);

    var p = new Promise(function(resolve,reject){
        var fields = {field_value:1, field_name:1}; // 待返回的字段
        var options = {sort: { 'field_order': 1}};
        dictModel.$.find({dict_code:dict_code, dict_status:1}, function(err, dict){
            if(err) {
                resolve(new Array());
            }
            else {
                if(dict.length > 0) {
                    dictModel.$DictAttr.find({field_status:1, dict_id:dict[0]},fields, options, function(error, dictAttrs){
                        if(error) {
                            resolve(new Array());
                        }
                        else {
                            //console.log(dictAttrs);
                            resolve(dictAttrs);
                        }
                    });
                }
                else {
                    resolve(new Array());
                }
            }
        });
    });

    return p;
}
/**
 * 获取用户列表
 * @param page
 * @param size
 * @param conditionMap
 */
exports.getUserList= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){
        utils.pagingQuery4Eui(model.$User, page, size, conditionMap, resolve, '',  {});
    });
    return p;
};

/**
 * 获取角色列表
 * @param page
 * @param size
 * @param conditionMap
 */
exports.getRoleList= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){
        utils.pagingQuery4Eui(model.$Role, page, size, conditionMap, resolve, '',  {});
    });
    return p;
};

/**
 * 获取用户角色列表
 * @param page
 * @param size
 * @param conditionMap
 */
exports.getUserRoleList= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){
        utils.pagingQuery4Eui(model.$UserRole, page, size, conditionMap, resolve, '',  {});
    });
    return p;
};


