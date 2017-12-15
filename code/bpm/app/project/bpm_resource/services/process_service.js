/**
 * wuqingfa@139.com
 *
 *
 * 流程定义处理服务
 * 1、新建流程定义
 * 2、删除流程定义
 * 3、修改流程定义信息
 *
 * 查询
 * 1、获取流程定义列表
 * 2、获取我的流程定义实例
 * 3、获取流程定义信息
 *
 *
 */

var model = require('../models/process_model');
var model_user=require("../models/user_model");

var utils = require('../../../utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;


/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.createProcess = function(proc_code,proc_name,catalog,memo) {

    var p = new Promise(function(resolve,reject){

        var data = {} ;
        data.proc_code =proc_code ;
        data.proc_name =proc_name ;
        data.proc_user = '';//req.session.current_user.user_name;
        data.opt_time =  new Date();
        data.memo = memo;
        data.catalog = catalog;
        data.engine_version = 'v1.0';
        data.status = 1;

        model.$ProcessBase(data).save(function(error,result){
            if(error) {
                logger.error("createProcess","新增流程基本属性信息时出现异常",error);
                resolve(utils.returnMsg(false, '1000', '新增流程基本属性信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '新增流程基本属性信息成功。', result, null));
            }
        });
    });

    return p;

};



/**
 * 新增流程基本属性信息
 * @param data
 * @param cb
 */
exports.saveProcessBase = function(data, cb) {
    // 实例模型，调用保存方法
    model.$ProcessBase(data).save(function(error,result){
        if(error) {
            logger.error("saveProcessBase","新增流程基本属性信息时出现异常",error);
            cb(utils.returnMsg(false, '1000', '新增流程基本属性信息时出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '新增流程基本属性信息成功。', result, null));
        }
    });
}



/**
 * 根据流程编码删除流程基本信息
 * @param proc_code
 */
exports.procDelete = function(proc_code){
    var p = new Promise(function(resolve,reject){
        var data = {proc_code:proc_code};
        model.$ProcessBase.remove(data,function (error, rs) {
            if (error) {
                logger.error("procDelete","删除测试流程基本信息异常",error);
                resolve(utils.returnMsg(false, '1000', '删除测试流程基本信息异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '删除测试流程基本信息成功。', rs, null));
            }
        });
    });
    return p;
}
/**
 * 根据流程编码删除流程定义信息
 * @param proc_code
 */
exports.procDefineDelete = function(proc_code){
    var p = new Promise(function(resolve,reject){
        var data = {proc_code:proc_code};
        model.$ProcessDefine.remove(data,function (error, rs) {
            if (error) {
                logger.error("procDefineDelete","删除测试流程定义信息异常",error);
                resolve(utils.returnMsg(false, '1000', '删除测试流程定义信息异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '删除测试流程定义信息成功。', rs, null));
            }
        });
    });
    return p;
}



/**
 * 启用、禁用操作
 * @param id
 * @param value
 * @param flag
 * @param cb
 */
exports.processChangeStatus = function(id, value, flag, cb){
    var conditions = {_id: id};
    var update = {$set: {proc_status:value}};
    var options = {};
    var db;
    if(flag == 1){
        db = model.$ProcessBase;
    }else if(flag == 2){
        db = model.$ProcessDefine;
    }
    db.update(conditions, update, options, function (error) {
        if(error) {
            cb(utils.returnMsg(false, '1002', '启用、禁用操作出现异常。', null, error));
        }
        else {
            cb(utils.returnMsg(true, '0000', '启用、禁用操作成功。', null, null));
        }
    });
}




/**
 *
 * @param id
 * @param data
 * @returns {Promise}
 */
exports.changeProcess= function(id,data) {

    var p = new Promise(function(resolve,reject){

        var conditions = {_id: id};
        var update = {$set: data};

        var options = {};
        model.$ProcessBase.update(conditions, update, options, function (error) {
            if(error) {
                logger.error("changeProcess","修改流程基本属性信息时出现异常",error);
                resolve(utils.returnMsg(false, '1001', '修改流程基本属性信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '修改流程基本属性信息成功。', null, null));
            }
        });


    });

    return p;
};

/**
 *
 * @param id
 * @param data
 * @returns {Promise}
 */
exports.changeProcessDefine= function(id,data) {

    var p = new Promise(function(resolve,reject){

        var conditions = {proc_id: id};
        var update = {$set: data};

        var options = {};
        model.$ProcessDefine.update(conditions, update, options, function (error) {
            if(error) {
                logger.error("changeProcessDefine","修改流程定义时出现异常",error);
                resolve(utils.returnMsg(false, '1001', '修改流程定义时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '修改流程定义信息成功。', null, null));
            }
        });


    });

    return p;
};




/**
 * 修改流程基本属性信息
 * @param id
 * @param data
 * @param cb
 */
exports.updateProcessBase = function(id, data) {
    var p = new Promise(function(resolve,reject){
        var conditions = {_id: id};
        var update = {$set: data};
        var options = {};
        model.$ProcessBase.update(conditions, update, options, function (error) {
            if(error) {
                logger.error("updateProcessBase","修改流程基本属性信息时出现异常",error);
                resolve(utils.returnMsg(false, '1001', '修改流程基本属性信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '修改流程基本属性信息成功。', null, null));
            }
        });
    });
    return p;
}


exports.getProcessByID= function(req,cb) {

    var resp = {};

    cb(resp);
};

function cacheIt(a,b,c){
    console.log(a);
    console.log(b);
    console.log(c);
}
exports.getProcessList= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessBase, page, size, conditionMap, resolve, '',  {});

    });

    return p;
};

exports.getProcessList4Page= function(page, size, conditionMap) {


    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessBase, page, size, conditionMap, resolve, '',  {});

    });

    return p;
};



/**
 * 根据流程定义ID获取流程信息
 * @param id
 * @returns {Promise}
 */
exports.getProcessById = function(id) {

    var p = new Promise(function(resolve,reject){
        var query = model.$ProcessBase.find({});
        query.where('proc_code', id);
        query.exec(function (error, rs) {
            if (error) {
                reject('无法获取流程信息，'+id+'。'+error);
            } else {

                if(rs.length ==0 )
                {
                   reject('无此流程编号'+id);
                }
                resolve(rs[0]);
            }
        });

    });

    return p;

}



/**
 * 编码唯一性验证
 * @param code
 * @param cb
 */

exports.checkCode= function(flag,code,id) {

    var p = new Promise(function(resolve,reject){
        var query;
        if(flag == 1){
            query =  model.$ProcessBase.find({});
            query.where('proc_code',code);
        }else if(flag == 2){
            query =  model.$ProcessBase.find({});
            query.where('proc_code',code);
            query.where({'_id':{'$ne':id}});
        }
        query.exec(function(err,rs){
            if(err){
                // reject({'success':false, 'code':'1001', 'msg':'编码唯一性验证时出现异常。'});
                logger.error("checkCode","编码唯一性验证时出现异常",err);
                resolve(utils.returnMsg(false, '1001', '编码唯一性验证时出现异常。', null, err));
            }else{
                if(rs.length > 0){
                    // resolve({'success':false, 'code':'1002', 'msg':'编码重复'});
                    logger.error("checkCode","编码重复",code);
                    resolve(utils.returnMsg(false, '1002', '编码重复。', null, null));
                }else {
                    resolve({'success':true});
                }
            }
        });
    });
    return p;
};

/**
 * 获取流程基本属性信息列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getProcessBaseList = function(page, length, conditionMap){

    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessBase, page, length, conditionMap, resolve, '',  {});

    });

    return p;

}

exports.getProcessDefineList = function(page, size, conditionMap){

    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessDefine, page, size, conditionMap, resolve, '',  {});

    });

    return p;

}


/**
 * 获取流程实例信息列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getProcessDefineList4Page = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$ProcessDefine, page, size, conditionMap, cb, null, {proc_ver:-1});
};


/**
 * 根据流程编码获取流程基本属性信息
 * @param proc_code
 * @param cb
 */
exports.getProcessBaseInfoByProcCode = function(proc_code){

    var p = new Promise(function(resolve,reject) {
        var query = model.$ProcessBase.find({});
        console.log(proc_code);
        query.where('proc_code',proc_code);
        query.exec(function(error,rs){
            if(error){
                logger.error("getProcessBaseInfoByProcCode","获取流程基本属性信息ID时出现异常",error);
                resolve(exports.returnMsg(false, '1000', '获取流程基本属性信息ID时出现异常。', null, error));
            }else{
                // console.log(rs);

                resolve(rs[0]._doc);
            }
        });
    });
    return p;
}



/**
 * 新增流程定义信息
 * @param data
 * @param cb
 */
exports.saveProcessDefine = function(data){

    var p = new Promise(function(resolve,reject) {
        // 实例模型，调用保存方法
        var arr = [];
        arr.push(data);
        model.$ProcessDefine.create(arr, function (err, docs) {
            if(err){
                logger.error("saveProcessDefine","新增流程定义信息时出现异常",err);
                resolve(utils.returnMsg(false, '1000', '新增流程定义信息时出现异常。', null, error));
            }
            else{
                // console.log(docs);
                // console.log(docs[0]._doc._id.toString());
                resolve(utils.returnMsg(true, '0000', '新增流程定义信息成功。', docs[0]._doc._id.toString(), null));
            }
        });
    });
    return p;
}





/**
 * 修改流程定义信息
 * @param conditions
 * @param data
 * @param cb
 */
exports.updateProcessDefineByConditions = function(conditions, data) {

    var p = new Promise(function(resolve,reject) {
        var update = {$set: data};
        var options = {multi: true};
        model.$ProcessDefine.update(conditions, update, options, function (error) {
            if(error) {
                logger.error("updateProcessDefineByConditions","修改流程定义信息时出现异常",error);
                resolve(utils.returnMsg(false, '1001', '修改流程定义信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '修改流程定义信息成功。', null, null));
            }
        });
    });
    return p;
}


/**
 * 修改流程定义信息
 * @param id
 * @param data
 * @param cb
 */
exports.updateProcessDefine = function(id, data) {
    var p = new Promise(function(resolve,reject) {
        var conditions = {_id: id};
        var update = {$set: data};
        var options = {};
        model.$ProcessDefine.update(conditions, update, options, function (error) {
            if(error) {
                logger.error("updateProcessDefine","修改流程定义信息时出现异常",error);
                resolve(utils.returnMsg(false, '1001', '修改流程定义信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '修改流程定义信息成功。', null, null));
            }
        });
    });
    return p;
}



/**
 * 根据流程定义id获取流程定义信息
 * @param id
 * @param cb
 */
exports.getProcessDefineById = function(id) {

    var p = new Promise(function(resolve,reject) {
        var query = model.$ProcessDefine.find({});
        query.where('_id', id);
        query.exec(function (error, rs) {
            if(error){
                logger.error("getProcessDefineById","获取流程定义信息时出现异常",error);
                resolve(utils.returnMsg(false, '1000', '获取流程定义信息时出现异常。', null, error));
            }else{
                resolve(rs[0]._doc);
            }
        });
    });

    return p;
}

/**
 * 根据条件获取流程定义信息
 * @param id
 * @param cb
 */
exports.getProcessDefineByConditionMap = function(conditionMap) {

    var p = new Promise(function(resolve,reject) {
        var query = model.$ProcessDefine.find({});
        if(conditionMap.proc_code){
            query.where('proc_code', conditionMap.proc_code);
        }
        if(conditionMap.status){
            query.where('status', conditionMap.status);
        }
        if(conditionMap.version){
            query.where('version', conditionMap.version);
        }else if(conditionMap.id){
            query.where('_id', conditionMap.id);
        }else{
            query.sort({proc_ver:-1});
        }
        query.exec(function (error, rs) {
            if(error){
                logger.error("getProcessDefineByConditionMap","获取流程定义信息时出现异常",error);
                resolve(utils.returnMsg(false, '1000', '获取流程定义信息时出现异常。', null, error));
            }else{
                if(rs.length > 0){
                    resolve(utils.returnMsg(true, '0000', '获取流程定义信息成功。', rs[0]._doc, null)); 
                }else{
                    logger.warn("getProcessDefineByConditionMap","未查询到流程定义数据",conditionMap);
                    resolve(utils.returnMsg(false, '1000', '未查询到流程定义数据。', null, null));
                }
                
            }
        });
    });
    return p;
}

//流程图展示
exports.getShowProcess=function(condition){
    var results={};
    var p = new Promise(function(resolve,reject){
        model.$ProcessInst.find({"_id":condition.proc_inst_id},function(err,rs){
            if(err){
                console.log(err);
                resolve(utils.returnMsg(false, '1000', '查询到流程实例数据错误。', null, err));
            }else{
                if(rs.length){

                    var proc_define=rs[0].proc_define;
                    var item_config=JSON.parse(rs[0].item_config);
                    results.proc_inst_status = rs[0].proc_inst_status;
                    results.proc_define=proc_define;
                    console.log('proc_define',proc_define);
                    results.flag=1;
                    results.last_node=rs[0].proc_cur_task;

                    model.$ProcessInstTask.find({"proc_inst_id" :condition.proc_inst_id},function(errs,res){
                        if(errs){
                            console.log(errs);
                            resolve(utils.returnMsg(false, '1000', '查询到流程任务数据错误。', null, err));
                        }else{
                            if(res.length>0){
                                var node_array=[];
                                var line_array=[];
                                for(var k =0;k<res.length;k++){
                                    var task_code =  res[k].proc_inst_task_code;
                                    var prve_code = res[k].proc_inst_prev_node_code;
                                    if(!prve_code){
                                        prve_code="processDefineDiv_node_1";
                                    }
                                    var process_define= JSON.parse(proc_define);
                                    var lines=process_define.lines;
                                    for(var line in lines){
                                        var from=lines[line].from;
                                        var to = lines[line].to;
                                        if(line.type=="start  round"||prve_code==from&&task_code==to){
                                            line_array.push(line);
                                            node_array.push(task_code);
                                        }

                                    }

                                }
                                results.node_array=node_array;
                                results.line_array=line_array;
                                resolve(utils.returnMsg(true, '0000', '获取流程复原数据成功。', results, null));

                            }else{
                                model.$ProcessTaskHistroy.find({"proc_inst_id":condition.proc_inst_id},function(err,rs){
                                    if(err){
                                        console.log(err);
                                        resolve(utils.returnMsg(false, '1000', '查询到流程任务数据错误。', null, err));
                                    }else{
                                        if(rs.length>0) {

                                            var node_array = [];
                                            var line_array = [];
                                            // for(var line in lines){
                                            //        if(line.type=="start  round"|| line.type=="end  round"){
                                            //            line_array.push(line);
                                            //        }
                                            // }
                                            for (var k = 0; k < rs.length; k++) {
                                                //node_array.push(rs[k].proc_inst_task_code);
                                                var code = rs[k].proc_inst_task_code;
                                                var prve_code = rs[k].proc_inst_prev_node_code;
                                                if(!prve_code){
                                                    prve_code="processDefineDiv_node_1";
                                                }
                                                var process_define = JSON.parse(proc_define);
                                                var nodes = process_define.nodes;
                                                for(var node in nodes){
                                                    var end = nodes[node].type;
                                                    if(end=="end  round"){
                                                        var node_code = node;
                                                        console.log('node_code',node_code);
                                                    }
                                                }
                                                var lines = process_define.lines;
                                                console.log('lines',lines)
                                                for (var line in lines) {
                                                    var from = lines[line].from;
                                                    var to = lines[line].to;
                                                   // if((prve_code==from && code==to)||(prve_code==from&&node==to)){
                                                        if((prve_code==from && code==to)){
                                                        line_array.push(line);
                                                        node_array.push(code);
                                                    }
                                                }
                                            }
                                            results.node_array = node_array;
                                            results.line_array = line_array;
                                            resolve(utils.returnMsg(true, '0000', '获取流程复原数据成功。', results, null));

                                        }else{
                                            resolve(utils.returnMsg(false, '1000', '查询到流程任务数据错误。', null, null));
                                        }
                                    }
                                })

                            }
                        }
                    });
                }else{
                    resolve(utils.returnMsg(false, '1000', '查询到流程实例数据错误。', null, null));
                }
            }
        });
    });
    return p;
};

//获取流程处理日志
exports.getProcHandlerLogsList=function(page,size,condition){
    var results={};
    var p = new Promise(function(resolve,reject){
        model.$ProcessInst.find({"_id":condition.proc_inst_id},function(err,rs){
            if(err){
                console.log(err);
                resolve(utils.returnMsg(false, '1000', '查询到流程实例数据错误。', null, err));
            }else{
                if(rs.length >0 ){
                    var mod = model.$ProcessInstTask;
                    var conditionMap = {};
                    conditionMap.proc_inst_id = condition.proc_inst_id;
                    if(rs[0].proc_inst_status == '4') {//实例归档
                        mod = model.$ProcessTaskHistroy;
                    }else{
                        conditionMap.proc_inst_task_status = 1;
                    }
                    utils.pagingQuery4Eui(mod, page, size, conditionMap, resolve, '',  {proc_cur_arrive_time:-1});
                }else{
                    resolve({'success':false, 'code':1001, 'msg':"没有查询到数据 请检查参数是否正确" , 'rows':rs,'total': 0});
                }
            }
        });
    });
    return p;
};


/**
 * 用于给雅典娜系统反向（拉取）用户数据的接口的服务层
 *
 * @returns {Promise}
 */
exports.sendSalesDataToAthena=function(condition){
    return  new Promise(function(resolve,reject){
        model_user.$User.find({"user_roles":condition.user_roles},function(err,res){
            if(err){
                console.log(err);
                resolve({'success':false, 'code':1001, 'msg':"没有查询到数据 请检查参数是否正确" ,"data":null,"error":err});
            }else{
                resolve(utils.returnMsg(true, '0000', '查询到流程实例数据正常。', res, null));
            }
        });
    });
}

/**
 * 用户给其他用户（拉取）用户数据的接口的服务层
 *
 * @returns {Promise}
 */
exports.sendSalesDataToAthena_other=function(condition){
    return  new Promise(function(resolve,reject){
        model_user.$User.find({},function(err,res){
            if(err){
                console.log(err);
                resolve({'success':false, 'code':1001, 'msg':"没有查询到数据 请检查参数是否正确" ,"data":null,"error":err});
            }else{
                model_user.$CommonCoreOrg.find({},function(errs,ress){
                    if(errs){
                        resolve({'success':false, 'code':1001, 'msg':"没有查询到数据 请检查参数是否正确" ,"data":null,"error":errs});

                    }else{
                        model_user.$Role.find({},function(error,result){
                            if(error){
                                resolve({'success':false, 'code':1001, 'msg':"没有查询到数据 请检查参数是否正确" ,"data":null,"error":error});
                            }else{
                                var return_data={};
                                return_data.users=res;
                                return_data.orgs=ress;
                                return_data.roles=result;
                                resolve(utils.returnMsg(true, '0000', '查询到流程实例数据正常。', return_data, null));
                            }
                        });
                    }
                });
            }
        });
    });
}






