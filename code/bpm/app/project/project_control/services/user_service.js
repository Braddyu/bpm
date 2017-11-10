var model = require('../../bpm_resource/models/user_model');
var model = require('../../bpm_resource/models/process_model');
var userService = require('./user_service');
var Promise = require("bluebird")
var utils = require('../../../../lib/utils/app_utils');
var tree = require('../../../../lib/utils/tree_utils');
var config = require('../../../../config');


/**
 * 根据user_no获取人员roles id
 * @param page
 * @param size
 * @param conditionMap
 */
exports.getUsreRolesByUserNo= function(userNo) {
    var p = new Promise(function(resolve,reject){
        var query = model.$User.find({'user_no':userNo,'user_status':1});
        query.exec(function(error,result){
            if (error) {
                var resuMap = {};
                resuMap.orgs = null;
                resuMap.roles = [];
                resolve(resuMap);
            } else {
                resolve(setRoleIdArr(result));
            }
        });
    });
    return p;
};

/**
 * 获取我的待办任务列表分页方法
 * @param userCode
 * @param paramMap
 */
exports.getMyTaskQuery4Eui= function(page,size,userCode,paramMap) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var conditionMap = {};
        //proc_inst_task_user_org  进行模糊匹配
        conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':eval("/"+paramMap.orgs+"/")}];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_task_status = 0;
        console.log(conditionMap);
        utils.pagingQuery4Eui(model.$ProcessInstTask, page, size, conditionMap, resolve, '',  {proc_inst_task_arrive_time:-1});
    });
    return p;
};

/**
 * 获取我的已办任务列表分页方法
 * @param userCode
 * @param paramMap
 */
exports.getMyCompleteTaskQuery4Eui= function(page,size,userCode,paramMap) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var conditionMap = {};
        //proc_inst_task_user_org  进行模糊匹配
        conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':eval("/"+paramMap.orgs+"/")}];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_task_status = 1;
        console.log(conditionMap);
        utils.pagingQuery4Eui(model.$ProcessTaskHistroy, page, size, conditionMap, resolve, '',  {proc_inst_task_arrive_time:-1});
    });
    return p;
};



/**
 * 获取我的待办任务列表
 * @param userCode
 * @param roleArr
 */
exports.getMyTaskList= function(userCode,roleArr,orgArr) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var query = model.$ProcessInstTask.find({"$or":[{'proc_inst_task_assignee':{"$in":userArr}},{'proc_inst_task_user_role':{"$in":roleArr},'proc_inst_task_user_org':{"$in":orgArr}}],'proc_inst_task_status':0});
        query.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '获取我的待办信息异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '获取我的待办成功。', rs, null));
            }
        });
    });
    return p;
};

/**
 * 获取我的已办任务列表
 * @param userCode
 * @param roleArr
 */
exports.getMyCompleteTaskList= function(userCode,roleArr,orgArr) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var query = model.$ProcessInstTask.find({"$or":[{'proc_inst_task_assignee':{"$in":userArr}},{'proc_inst_task_user_role':{"$in":roleArr},'proc_inst_task_user_org':{"$in":orgArr}}],'proc_inst_task_status':1});
        query.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '获取我的已办信息异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '获取我的已办成功。', rs, null));
            }
        });
    });
    return p;
};

function setRoleIdArr(arr){
    var resuMap = {};
    var result = [];
    if(arr && arr.length > 0){
        var roles = arr[0]._doc.user_roles;
        for(var i=0;i<roles.length;i++){
            result.push(roles[i].toString());
        }
        resuMap.orgs = arr[0]._doc.user_org?arr[0]._doc.user_org:null;
        resuMap.roles = result;
    }
    return resuMap;
}