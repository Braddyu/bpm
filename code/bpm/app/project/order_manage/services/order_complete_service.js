var model = require('../../bpm_resource/models/process_model');

var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;


/**
 * 获取我的已办任务列表分页方法
 * @param userCode
 * @param paramMap
 */
exports.getMyCompleteTaskQuery4Eui = function (page, size, userCode, paramMap, proc_code, startDate, endDate, work_order_number) {

    var p = new Promise(function (resolve, reject) {
        var userArr = [];
        userArr.push(userCode);
        var conditionMap = {};
        //proc_inst_task_user_org  进行模糊匹配
        let work_id=paramMap.work_id;
        //有的工号为'',为了防止查到空工号的任务
        if(!work_id)work_id='@@@@@@@';
        conditionMap['$or'] = [{'proc_inst_task_assignee': {'$in': userArr}},{'proc_inst_task_work_id':work_id}, {
            'proc_inst_task_user_role': {'$in': paramMap.roles},
            'proc_inst_task_user_org': paramMap.orgs
        }];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_task_status = 1;
        if (proc_code) {
            conditionMap.proc_code = proc_code;
        }
        if (work_order_number) {
            conditionMap.work_order_number = work_order_number;
        }
        var compare = {};
        //开始时间
        if (startDate) {
            compare['$gte'] = new Date(startDate);
        }
        //结束时间
        if (endDate) {
            //结束时间追加至当天的最后时间
            compare['$lte'] = new Date(endDate + ' 23:59:59');
        }
        //时间查询
        if (!isEmptyObject(compare)) {
            conditionMap['proc_inst_task_complete_time'] = compare;
        }
        console.log(conditionMap);
        utils.pagingQuery4Eui(model.$ProcessTaskHistroy, page, size, conditionMap, resolve, '', {proc_inst_task_complete_time: -1});
    });
    return p;
};


function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
