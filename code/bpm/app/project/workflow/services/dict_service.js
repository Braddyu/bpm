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


/**
 * 开启差错工单派单定时任务
 */
exports.openTask = function(check_status,business_code,city_code,work_order_number,mistake_task_phone){
    return new Promise(async function(resolve,reject){
        await dictModel.$DictAttr.update( {"field_name": "mistake_task_flag"}, {$set: {"field_value": 1}})
        await dictModel.$DictAttr.update( {"field_name": "mistake_task_check_status"}, {$set: {"field_value": check_status}})
        await dictModel.$DictAttr.update( {"field_name": "mistake_task_business_code"}, {$set: {"field_value": business_code}})
        await dictModel.$DictAttr.update( {"field_name": "mistake_task_city_code"}, {$set: {"field_value": city_code}})
        await dictModel.$DictAttr.update( {"field_name": "mistake_task_order_number"}, {$set: {"field_value": work_order_number}})
        await dictModel.$DictAttr.update( {"field_name": "mistake_task_phone"}, {$set: {"field_value": mistake_task_phone}})
        resolve(utils.returnMsg(true, '1000', '开启成功。', null, null));

    })

};

/**
 * 关闭差错工单派单定时任务
 */
exports.closeTask = function(){
    var p = new Promise(function(resolve,reject){
         dictModel.$DictAttr.update( {"field_name": "mistake_task_flag"}, {$set: {"field_value": 0}},function(err) {
             if(err){
                 resolve(utils.returnMsg(false, '1000', '关闭失败。', null, null));
             }else{
                 resolve(utils.returnMsg(true, '1000', '关闭成功。', null, null));
             }
         })

    });
    return p;
};



/**
 * 获取差错工单派单定时任务筛选条件
 */
exports.getConditions = function(){
    var p = new Promise(function(resolve,reject){
        dictModel.$.aggregate([
            {
                $match:{"dict_code" : "mistake_task_code"}
            },
            {
                $lookup: {
                    from: "common_dict_attr_info",
                    localField: '_id',
                    foreignField: "dict_id",
                    as: "dict_attr_info"
                }
            },
            {
                $unwind: {path: "$dict_attr_info", preserveNullAndEmptyArrays: true}
            },
            {
                $project:{
                    field_name:"$dict_attr_info.field_name",
                    field_value:"$dict_attr_info.field_value"
                }
            }
        ]).exec(function (err, res) {
            if(err){
                resolve(utils.returnMsg(false, '0001', '开启开关失败:查询筛选条件失败!', null, err));
            }else{
                if(res.length>0){
                    var data = {};
                    for (let item in res) {
                        let dict = res[item];
                        data[dict.field_name]=dict.field_value;
                    }
                    resolve(utils.returnMsg(true, '0000', 'success!', data, null));
                }else{
                    resolve(utils.returnMsg(false, '0001', '请添加定时派单字典!', null, err));
                }

            }

        })
    });
    return p;
};
