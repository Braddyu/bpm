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
 * 获取客户不配合工单
 * @param userCode
 * @param paramMap
 */
exports.getMyCompleteTaskQueryCustomer = function (page, size, userCode, paramMap, proc_code, startDate, endDate, work_order_number,task_type) {

    var p = new Promise(function (resolve, reject) {
        var conditionMap = {};
        conditionMap.proc_inst_status = 5;
        if (proc_code) {
            conditionMap.proc_code = proc_code;
        }
        if (work_order_number) {
            conditionMap.work_order_number = work_order_number;
        }
        if(task_type){
            conditionMap.proc_inst_task_code = task_type;
        }
        console.log(conditionMap);
        var ProcessInst =utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '', {proc_inst_task_complete_time: -1});
    });
    return p;
};


/**
 * 重启客户不配合工单
 * @param id 实例Id
 */
exports.acceptBatch = function (id) {
    var p = new Promise(function (resolve, reject) {
        // 查询任务表当前历史任务
        process_model.$ProcessTaskHistroy.find({"proc_inst_id":id},async function(err,result){
            if(err){
                resolve(utils.returnMsg(false,"0001","历史数据查询异常！",null,err));
            }else{
                var taskHistroy=result[0];
                var arr = [];
                var condition_task = {};
                condition_task.proc_inst_id =taskHistroy.proc_inst_id; // 流程流转当前信息ID
                condition_task.proc_inst_task_code =taskHistroy.proc_inst_task_code;// 流程当前节点编码(流程任务编号)
                condition_task.proc_inst_task_name =taskHistroy.proc_inst_task_name;// 流程当前节点名称(任务名称)
                condition_task.proc_inst_task_type =taskHistroy.proc_inst_task_type;// 流程当前节点类型(任务类型)
                condition_task.proc_inst_task_title =taskHistroy.proc_inst_task_title;// 任务标题
                condition_task.proc_name=taskHistroy.proc_name;//所属流程
                condition_task.proc_code=taskHistroy.proc_code; //所属流程编码
                condition_task.proc_inst_task_arrive_time=taskHistroy.proc_inst_task_arrive_time;// 流程到达时间
                condition_task.proc_inst_task_handle_time=taskHistroy.proc_inst_task_handle_time;// 流程认领时间
                condition_task.proc_inst_task_complete_time=taskHistroy.proc_inst_task_complete_time;// 流程完成时间
                condition_task.proc_inst_task_status=0;// 流程当前状态 0-未处理，1-已完成
                condition_task.proc_inst_task_assignee=taskHistroy.proc_inst_task_assignee;// 流程处理人code
                condition_task.proc_inst_task_assignee_name=taskHistroy.proc_inst_task_assignee_name;// 流程处理人名
                condition_task.proc_inst_task_work_id=taskHistroy.proc_inst_task_work_id;// 流程处理人工号
                condition_task.proc_inst_task_user_role=taskHistroy.proc_inst_task_user_role;// 流程处理用户角色ID
                condition_task.proc_inst_task_user_role_name=taskHistroy.proc_inst_task_user_role_name;// 流程处理用户角色名
                condition_task.proc_inst_task_user_org=taskHistroy.proc_inst_task_user_org;// 流程处理用户组织ID
                condition_task.proc_inst_task_user_org_name=taskHistroy.proc_inst_task_user_org_name;// 流程处理用户组织名
                condition_task.proc_inst_task_params=taskHistroy.proc_inst_task_params;// 流程参数(任务参数)
                condition_task.proc_inst_task_claim=taskHistroy.proc_inst_task_claim;// 流程会签
                condition_task.proc_inst_task_sign=taskHistroy.proc_inst_task_sign;// 流程签收(0-未认领，1-已认领)
                condition_task.proc_inst_task_sms=taskHistroy.proc_inst_task_sms;// 流程是否短信提醒
                condition_task.proc_inst_task_remark=taskHistroy.proc_inst_task_remark;// 流程处理意见
                //condition_task.proc_inst_biz_vars=taskHistroy.String,// 流程业务实例变量
                condition_task.proc_inst_node_vars=taskHistroy.proc_inst_node_vars;// 流程实例节点变量
                condition_task.proc_inst_prev_node_code=taskHistroy.proc_inst_prev_node_code,// 流程实例上一处理节点编号
                    condition_task.proc_inst_prev_node_handler_user=taskHistroy.proc_inst_prev_node_handler_user;// 流程实例上一节点处理人编号
                condition_task.proc_task_start_user_role_names=taskHistroy.proc_task_start_user_role_names;//流程发起人角色
                condition_task.proc_task_start_user_role_code=taskHistroy.proc_task_start_user_role_code; //流程发起人id
                condition_task.proc_task_start_name=taskHistroy.proc_task_start_name;//流程发起人姓名
                //condition_task.proc_task_work_day=taskHistroy.Number,//天数
                //condition_task.proc_task_ver=taskHistroy.Number,//版本号
                //condition_task.proc_task_name=taskHistroy.{ type: String,  required: false ,index: true },//流程名
                //condition_task.proc_task_content=taskHistroy.String,// 流程派单内容
                //condition_task.proc_task_code=taskHistroy.String,// 流程编码
                //condition_task.proc_start_time=taskHistroy.Date,// 流程发起时间(开始时间)
                condition_task.proc_vars=taskHistroy.proc_vars;// 流程变量
                condition_task.joinup_sys=taskHistroy.joinup_sys;//所属系统编号
                //condition_task.skip=taskHistroy.Number,//是否为跳过节点任务
                condition_task.next_name=taskHistroy.next_name;//下一节点处理人姓名
                condition_task.proc_back=taskHistroy.proc_back;//判断为回退任务 1:为回退任务 0:为正常流转
                condition_task.previous_step=taskHistroy.previous_step;//上一节点任务id
                //condition_task.publish_status=taskHistroy.Number,//1 发布 0-未发布
                condition_task.work_order_number=taskHistroy.work_order_number;//工单编号
                //condition_task.is_overtime=taskHistroy.Number//是否超时，0-未超时，1-超时
                await process_model.$ProcessInstTask.create(arr);
                await process_model.$ProcessInst.update({_id:taskHistroy.proc_inst_id},{$set: {proc_inst_status: 2,proc_cur_task_remark:"重启的工单"}});
                if(result.length>0){
                    const  res=await  new Promise(resolve => {
                        resolve({'success': true, 'code': '0000', 'msg':'重启客户不配合工单成功!'});
                    });
                    resolve(res);
                }
            }
        });

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
        //let work_id=paramMap.work_id;
        //有的工号为'',为了防止查到空工号的任务
       //if(!work_id)work_id='@@@@@@@';
        //conditionMap['$or'] = [{'proc_task_history': {'$in': userArr}},{'proc_task_history[0].proc_inst_task_work_id':work_id}];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_status = 5;
        if (proc_code) {
            conditionMap.proc_code = proc_code;
        }
        if (work_order_number) {
            conditionMap.work_order_number = work_order_number;
        }
        if(task_type){
            conditionMap.proc_inst_task_code = task_type;
        }

        console.log(conditionMap);
        var ProcessInst =utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '', {proc_inst_task_complete_time: -1});
    });
    return p;
};


/**
 * 工单任务转派
 */
exports.turn2SendTask = function(userInfo,instId,reason){
    var p = new Promise(function(resolve, reject){
        process_model.$ProcessInst.find({'_id':instId},function(err,rs){
            var proc_cur_task_code_3 = "processDefineDiv_node_3";
            if(!err){
                var inst = rs[0];
                // 工单已归档，状态4：表示已归档；5：表示客户不配合
                if(inst.proc_inst_status == 4  ){
                    resolve(utils.returnMsg(false,"0001","转派失败:工单已归档",null,null));
                }else if(inst.proc_inst_status == 5){
                    resolve(utils.returnMsg(false,"0001","转派失败:客户不配合，请移至客户不配合重新处理",null,null));
                }else if(inst.proc_cur_task != proc_cur_task_code_3){
                    resolve(utils.returnMsg(false,"0001","该工单营业员已处理，待您审核，若您审核通过归档则不能转派；若您拒绝，才能重新转派。",null,null));
                }else{
                    // 查询任务表当前任务
                    process_model.$ProcessInstTask.find({"proc_inst_id":instId,"proc_inst_task_status":0},function(err,result){
                        if(err){
                            resolve(utils.returnMsg(false,"0001","派单失败:查询当前任务出错",null,err));
                        }else{
                            if(result.length == 1){
                                var cur_task = result[0];
                                // 修改原任务状态并将其插入到历史表
                                var time = new Date();
                                process_model.$ProcessInstTask.update({"_id":result[0]._id},{$set:{"proc_inst_task_status":1,"proc_inst_task_remark":"转派原因:"+reason,"proc_inst_task_complete_time":time}},{safe:true},function(err,result){
                                    var task_history = {};
                                    task_history.__v = cur_task.__v;
                                    task_history.work_order_number = cur_task.work_order_number;
                                    task_history.previous_step = cur_task.previous_step;
                                    task_history.proc_back = cur_task.proc_back;
                                    task_history.next_name = cur_task.next_name;
                                    task_history.joinup_sys = cur_task.joinup_sys;
                                    task_history.proc_code = cur_task.proc_code;
                                    task_history.proc_name = cur_task.proc_name;
                                    task_history.proc_task_start_name = cur_task.proc_task_start_name;
                                    task_history.proc_task_start_user_role_names = cur_task.proc_task_start_user_role_names;
                                    task_history.proc_inst_task_assignee = cur_task.proc_inst_task_assignee;
                                    task_history.proc_inst_task_remark = "转派原因:"+reason;
                                    task_history.proc_inst_task_sms = cur_task.proc_inst_task_sms;
                                    task_history.proc_inst_task_sign = cur_task.proc_inst_task_sign;
                                    task_history.proc_inst_task_claim = cur_task.proc_inst_task_claim;
                                    task_history.proc_inst_task_params = cur_task.proc_inst_task_params;
                                    task_history.proc_vars = cur_task.proc_vars;
                                    task_history.proc_inst_node_vars = cur_task.proc_inst_node_vars;
                                    task_history.proc_inst_prev_node_handler_user = cur_task.proc_inst_prev_node_handler_user;
                                    task_history.proc_inst_prev_node_code = cur_task.proc_inst_prev_node_code;
                                    task_history.proc_inst_task_title = cur_task.proc_inst_task_title;
                                    task_history.proc_inst_task_assignee_name = cur_task.proc_inst_task_assignee_name;
                                    task_history.proc_inst_task_status = 1;
                                    task_history.proc_inst_task_complete_time = time;
                                    task_history.proc_inst_task_handle_time = cur_task.proc_inst_task_handle_time;
                                    task_history.proc_inst_task_arrive_time = cur_task.proc_inst_task_arrive_time;
                                    task_history.proc_inst_task_type = cur_task.proc_inst_task_type;
                                    task_history.proc_inst_task_name = cur_task.proc_inst_task_name;
                                    task_history.proc_inst_id = cur_task.proc_inst_id;
                                    task_history.proc_task_id = cur_task._id;
                                    task_history.proc_task_start_user_role_code = cur_task.proc_task_start_user_role_code;
                                    task_history.proc_inst_task_user_org = cur_task.proc_inst_task_user_org;
                                    task_history.proc_inst_task_user_role = cur_task.proc_inst_task_user_role;
                                    process_model.$ProcessTaskHistroy.create(task_history,function(err,result){});
                                });
                                // 新增一条任务
                                var inst_task = {};
                                inst_task.proc_inst_task_work_id = userInfo.work_id;
                                inst_task.proc_inst_id = cur_task.proc_inst_id;
                                inst_task.proc_inst_task_code = cur_task.proc_inst_task_code;
                                inst_task.proc_inst_task_name = cur_task.proc_inst_task_name;
                                inst_task.proc_inst_task_type = cur_task.proc_inst_task_type;
                                inst_task.proc_inst_task_arrive_time = new Date();
                                inst_task.proc_inst_task_handle_time = new Date();
                                inst_task.proc_inst_task_complete_time = "";
                                inst_task.proc_inst_task_status = 0;
                                inst_task.proc_inst_task_assignee_name = userInfo.user_name;
                                inst_task.proc_inst_task_title = cur_task.proc_inst_task_title;
                                inst_task.proc_inst_prev_node_code = cur_task.proc_inst_prev_node_code;
                                inst_task.proc_inst_prev_node_handler_user = cur_task.proc_inst_prev_node_handler_user;
                                inst_task.proc_inst_node_vars = cur_task.proc_inst_node_vars;
                                inst_task.proc_vars = cur_task.proc_vars;
                                inst_task.proc_inst_task_params = cur_task.proc_inst_task_params;
                                inst_task.proc_inst_task_claim = cur_task.proc_inst_task_claim;
                                inst_task.proc_inst_task_sign = cur_task.proc_inst_task_sign;
                                inst_task.proc_inst_task_sms = cur_task.proc_inst_task_sms;
                                inst_task.proc_inst_task_remark = "";
                                inst_task.proc_inst_task_assignee = userInfo.user_no;
                                inst_task.proc_task_start_user_role_names = cur_task.proc_task_start_user_role_names;
                                inst_task.proc_task_start_name = cur_task.proc_task_start_name;
                                inst_task.proc_name = cur_task.proc_name;
                                inst_task.proc_code = cur_task.proc_code;
                                inst_task.joinup_sys = cur_task.joinup_sys;
                                inst_task.next_name = cur_task.next_name;
                                inst_task.proc_back = cur_task.proc_back;
                                inst_task.previous_step = cur_task.previous_step;
                                inst_task.work_order_number = cur_task.work_order_number;
                                inst_task.proc_task_start_user_role_code = cur_task.proc_task_start_user_role_code;
                                inst_task.proc_inst_task_user_org = userInfo.user_org;
                                inst_task.proc_inst_task_user_role = userInfo.user_roles;
                                inst_task.__v = cur_task.__v;
                                process_model.$ProcessInstTask.create(inst_task,function(err,result){
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
