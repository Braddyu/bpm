
var model = require('../../bpm_resource/models/process_model');

var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;

/**
 * 获取我的待办数据
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
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