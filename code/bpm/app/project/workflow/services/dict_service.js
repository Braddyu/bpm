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
exports.openTask = function(params){
    // update query date
    function updateQueryDate(params){
        return new Promise(function(resolve,reject){
            dictModel.$.find({'dict_code':"mistake_task_date"},function(err,result){
                if(err){
                    resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, err));
                }else if(result.length == 0){
                    resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                }else{
                    var conditions = {"dict_id": result[0]._id};
                    var update = {$set: {"field_value": params.query_date}};
                    dictModel.$DictAttr.update(conditions,update,{safe:true}, function (errors,updateResult){
                        if(updateResult.ok > 0){
                            resolve(utils.returnMsg(true, '0000', '更新数据成功。', params, null));
                        }else{
                            resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                        }
                    })
                }
            })
        });
    }

    // update check status
    function updateCheckStatus(res){
        return new Promise(function(resolve,reject){
            if(res.success){
                dictModel.$.find({'dict_code':"mistake_task_check_status"},function(err,result){
                    if(err){
                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, err));
                    }else if(result.length == 0){
                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                    }else{
                        var conditions = {"dict_id": result[0]._id};
                        var update = {$set: {"field_value": res.data.check_status}};
                        dictModel.$DictAttr.update(conditions,update,{safe:true}, function (errors,updateResult){
                            if(updateResult.ok > 0){
                                resolve(utils.returnMsg(true, '0000', '更新数据成功。', res.data, null));
                            }else{
                                resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                            }
                        })
                    }
                })
            }else{
                resolve(result);
            }
        });
    }

    // update business name
    function updateBusinessName(res){
        return new Promise(function(resolve,reject){
            if(res.success){
                dictModel.$.find({'dict_code':"mistake_task_business_name"},function(err,result){
                    if(err){
                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, err));
                    }else if(result.length == 0){
                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                    }else{
                        var conditions = {"dict_id": result[0]._id};
                        var update = {$set: {"field_value": res.data.business_name}};
                        dictModel.$DictAttr.update(conditions,update,{safe:true}, function (errors,updateResult){
                            if(updateResult.ok > 0){
                                resolve(utils.returnMsg(true, '0000', '更新数据成功。', res.data, null));
                            }else{
                                resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                            }
                        })
                    }
                })
            }else{
                resolve(result);
            }
        });

    }

    // update city code
    function updateCityCode(res){
        return new Promise(function(resolve,reject){
            if(res.success){
                dictModel.$.find({'dict_code':"mistake_task_city_code"},function(err,result){
                    if(err){
                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, err));
                    }else if(result.length == 0){
                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                    }else{
                        var conditions = {"dict_id": result[0]._id};
                        var update = {$set: {"field_value": res.data.city_code}};
                        dictModel.$DictAttr.update(conditions,update,{safe:true}, function (errors,updateResult){
                            if(updateResult.ok > 0){
                                resolve(utils.returnMsg(true, '0000', '更新数据成功。', res.data, null));
                            }else{
                                resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                            }
                        })
                    }
                })
            }else{
                resolve(result);
            }
        });

    }
    // update flag
    function updateFlag(res){
        return new Promise(function(resolve,reject){
            if(res.success){
                dictModel.$.find({'dict_code':"mistake_task_flag"},function(err,result){
                    if(err){
                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, err));
                    }else if(result.length == 0){
                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, null));
                    }else{
                        var conditions = {"dict_id": result[0]._id,"field_value":0};
                        var update = {
                            $set: {
                                "field_checked": 0,
                            }
                        };
                        dictModel.$DictAttr.update(conditions,update,{safe:true}, function (errors,updateResult){
                            if(updateResult.ok > 0){
                                conditions = {"dict_id": result[0]._id,"field_value":1};
                                update = {
                                    $set: {
                                        "field_checked": 1,
                                    }
                                }
                                dictModel.$DictAttr.update(conditions,update,{safe:true}, function (errors,updateResult){
                                    if(updateResult.ok > 0){
                                        resolve(utils.returnMsg(true, '0000', '开关开启成功。', null, null));
                                    }else{
                                        resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, errors));
                                    }
                                });
                            }else{
                                resolve(utils.returnMsg(false, '0001', '开关开启失败。', null, errors));
                            }

                        });
                    }
                })
            }else{
                resolve(result);
            }
        })

    }

    return updateQueryDate(params).then(updateCheckStatus).then(updateBusinessName).then(updateCityCode).then(updateFlag);
};

/**
 * 关闭差错工单派单定时任务
 */
exports.closeTask = function(){
    var p = new Promise(function(resolve,reject){
        dictModel.$.find({'dict_code':"mistake_task_flag"},function(err,result){
            if(err){
                resolve(utils.returnMsg(false, '0001', '开关关闭失败。', null, err));
            }else if(result.length == 0){
                resolve(utils.returnMsg(false, '0001', '开关关闭失败。', null, null));
            }else{
                var conditions = {"dict_id": result[0]._id,"field_value":0};
                var update = {
                    $set: {
                        "field_checked": 1,
                    }
                };
                dictModel.$DictAttr.update(conditions,update,{safe:true}, function (errors,updateResult){
                    if(updateResult.ok > 0){
                        conditions = {"dict_id": result[0]._id,"field_value":1};
                        update = {
                            $set: {
                                "field_checked": 0,
                            }
                        }
                        dictModel.$DictAttr.update(conditions,update,{safe:true}, function (errors,updateResult){
                            if(updateResult.ok > 0){
                                resolve(utils.returnMsg(true, '0000', '更新开关状态成功。', null, null));
                            }else{
                                resolve(utils.returnMsg(false, '0001', '更新开关状态失败。', null, errors));
                            }
                        });
                    }else{
                        resolve(utils.returnMsg(false, '0001', '更新开关状态失败。', null, errors));
                    }

                });
            }

        });


    });
    return p;
};
/**
 * 获取差错工单派单定时任务开关状态
 */
exports.getSwitch = function(){
    var p = new Promise(function(resolve,reject){
        var match = {};
        match['dict_code'] = "mistake_task_flag";
        dictModel.$.aggregate([
            {
                $match:match
            },
            {
                $graphLookup: {
                    from: "common_dict_attr_info",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "dict_id",
                    as: "dict_attr_info",
                    restrictSearchWithMatch: {}
                }
            },
            {
                $unwind: {path: "$dict_attr_info", preserveNullAndEmptyArrays: true}
            },
            {
                $match:{"dict_attr_info.field_status":1,"dict_attr_info.field_checked":1}
            },
        ]).exec(function(err, res){
            if(res.length > 0){
                resolve(utils.returnMsg(true, '0000', '获取数据成功。', res[0], null));
            }
        });
    });
    return p;
};
