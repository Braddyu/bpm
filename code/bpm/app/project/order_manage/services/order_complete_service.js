var model = require('../../bpm_resource/models/process_model');

var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;
var inst = require('../../bpm_resource/services/instance_service');
var process_model = require('../../bpm_resource/models/process_model');


/**
 * 获取我的已办任务列表分页方法
 * @param userCode
 * @param paramMap
 */
exports.getMyCompleteTaskQuery4Eui = function (page, size, userCode, paramMap, proc_code, startDate, endDate, work_order_number,task_type) {

    var p = new Promise(function (resolve, reject) {
        var userArr = [];
        userArr.push(userCode);
        var conditionMap = {};
        //proc_inst_task_user_org  进行模糊匹配
        let work_id=paramMap.work_id;
        //有的工号为'',为了防止查到空工号的任务
        if(!work_id)work_id='@@@@@@@';
        conditionMap['$or'] = [{'proc_inst_task_assignee': {'$in': userArr}},{'proc_inst_task_work_id':work_id}];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_task_status = 1;
        if (proc_code) {
            conditionMap.proc_code = proc_code;
        }
        if (work_order_number) {
            conditionMap.work_order_number = work_order_number;
        }
		if(task_type){
            conditionMap.proc_inst_task_code = task_type;
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




/**
 * 获取我的已办任务列表分页方法
 * @param userCode
 * @param paramMap
 */
exports.getMyCompleteTaskQueryCustomer = function (page, size, userCode, paramMap, proc_code, startDate, endDate, work_order_number,task_type) {

    var p = new Promise(function (resolve, reject) {
        var userArr = [];
        userArr.push(userCode);
        var conditionMap = {};
        //proc_inst_task_user_org  进行模糊匹配
        let work_id=paramMap.work_id;
        //有的工号为'',为了防止查到空工号的任务
        if(!work_id)work_id='@@@@@@@';
        conditionMap['$or'] = [{'proc_inst_task_assignee': {'$in': userArr}},{'proc_inst_task_work_id':work_id}];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_task_status = 5;
        if (proc_code) {
            conditionMap.proc_code = proc_code;
        }
        if (work_order_number) {
            conditionMap.work_order_number = work_order_number;
        }
        if(task_type){
            conditionMap.proc_inst_task_code = task_type;
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


/**
 * 工单任务转派
 */
exports.turn2SendTask = function(userInfo,instId){
    var p = new Promise(function(resolve, reject){
        process_model.$ProcessInst.find({'_id':instId},function(err,rs){
            var proc_cur_task_code_3 = "processDefineDiv_node_3";
            if(!err){
                var inst = rs[0];
                // 工单已归档
                if(inst.proc_inst_status == 4){
                    resolve(utils.returnMsg(false,"0001","派单失败:工单已归档",null,null));
                }else if(inst.proc_cur_task != proc_cur_task_code_3){
                    resolve(utils.returnMsg(false,"0001","该工单营业员已处理，待您审核，若您审核通过归档则不能转派；若您拒绝，才能重新转派。",null,null));
                }else{
                    // 查询任务表当前任务
                    process_model.$ProcessInstTask.find({"proc_inst_id":instId,"proc_inst_task_status":0},function(err,result){
                        if(err){
                            resolve(utils.returnMsg(false,"0001","派单失败:查询当前任务出错",null,err));
                        }else{
                            if(result.length == 1){
                                // 修改任务表
                                var update = {};
                                update.proc_inst_task_arrive_time = new Date();
                                update.proc_inst_task_handle_time = new Date();
                                update.proc_inst_task_assignee_name = userInfo.user_name;
                                update.proc_inst_task_assignee = userInfo.user_no;
                                update.proc_inst_task_work_id = userInfo.work_id;
                                update.proc_inst_task_user_org = userInfo.user_org;
                                update.proc_inst_task_user_role = userInfo.user_roles;
                                process_model.$ProcessInstTask.update({"_id":result[0]._id},{$set:update},{safe:true},function(err,result){
                                    console.log(result);
                                });
                                resolve(utils.returnMsg(true,"0000","派单成功",null,null));
                            }else{
                                resolve(utils.returnMsg(false,"0001","派单失败:查询当前任务出错",null,null));
                            }
                        }
                    });
                }
            }else{
                resolve(utils.returnMsg(false,"0001","派单失败:查询实例出错",null,null));
            }
        })
    })
    return p;
}
/**
 * 列出所有的任务类型
 */
exports.listAllTaskType = function(){
    var p = new Promise(function(resolve, reject){
        process_model.$JobSetp.find({},function(err,result){
            if(err){
                resolve(utils.returnMsg(false,"0001","查询数据失败",null,err));
            }else{
                resolve(utils.returnMsg(true,"0000","查询数据成功",result,null));
            }
        });
    })
    return p;
}
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
