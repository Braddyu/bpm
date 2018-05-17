var model = require('../../bpm_resource/models/process_model');
var process_extend_service = require("../../bpm_resource/services/process_extend_service");
var process_extend_model = require('../../bpm_resource/models/process_extend_model');
var utils = require('../../../../lib/utils/app_utils');
var process_model = require('../../bpm_resource/models/process_model');
var user_model = require('../../bpm_resource/models/user_model');

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
exports.getMyCompleteTaskQueryCustomer = function (page, rows, startDate, endDate, work_order_number, task_type) {

    var p = new Promise(function (resolve, reject) {
        var conditionMap = {};
        conditionMap.proc_inst_status = 7;
        conditionMap.proc_code = 'p-201';
        if (work_order_number) {
            conditionMap.work_order_number = work_order_number;
        }
        if(task_type){
            conditionMap.proc_inst_task_code = task_type;
        }
        console.log(conditionMap);

        var ProcessInst =utils.pagingQuery4Eui(model.$ProcessInst, page, rows, conditionMap, resolve, '', {proc_inst_task_complete_time: -1});
    });
    return p;
};


/**
 * 重启客户不配合工单
 * @param id 实例Id
 */
exports.acceptBatch = function (inst_id,user_name,user_no) {
    var p = new Promise(function (resolve, reject) {
        model.$ProcessTaskHistroy.find({"proc_inst_id":inst_id},function(err,res){
            if(err || res.length == 0){
                reject({'success': false, 'code': '1000', 'msg': '重派失败0', "error": null})
            }else{
                let task_history={};
                let task_arr=[];
                //获取复核的节点信息
                for(let i in res){
                    let his=JSON.parse(JSON.stringify(res[i]));
                    delete his["_id"];
                    task_arr.push(his);
                    if(his.proc_inst_task_type=='厅店处理回复'){
                        task_history=res[i];
                    }
                }

                //修改工单状态，将归档工单改为处理中，已经新增复核字段
                model.$ProcessInst.update({_id:inst_id},{$set:{proc_inst_status:2,proc_cur_arrive_time:new Date(),proc_cur_task:'processDefineDiv_node_3',proc_cur_task_name : "厅店处理回复"}},{},function(err){
                    let history={};
                    history.proc_inst_task_assignee=user_no;
                    history.proc_inst_task_assignee_name=user_name;
                    history.proc_inst_task_remark="重派意见:客户不配合工单重派";
                    history.proc_inst_task_status=1;
                    history.joinup_sys=task_history.joinup_sys;
                    history.proc_name=task_history.proc_name;
                    history.proc_code=task_history.proc_code;
                    history.proc_task_start_user_role_names=task_history.proc_task_start_user_role_names;
                    history.proc_task_start_name=task_history.proc_task_start_name;
                    history.proc_vars=task_history.proc_vars;
                    history.proc_inst_task_title=task_history.proc_inst_task_title;
                    history.proc_inst_task_complete_time=new Date();
                    history.proc_inst_task_handle_time=new Date();
                    history.proc_inst_task_arrive_time=new Date();
                    history.proc_inst_id=task_history.proc_inst_id;
                    history.proc_task_start_user_role_code=task_history.proc_task_start_user_role_code;
                    history.proc_inst_task_name ="客户不配合工单重派"
                    history.work_order_number =task_history.work_order_number
                    task_arr.push(history)


                    task_history.proc_inst_task_status=0;
                    task_history.proc_inst_task_remark='';
                    task_history=JSON.parse(JSON.stringify(task_history))
                    delete task_history["_id"];
                    task_history.proc_inst_task_complete_time=new Date();
                    task_history.proc_inst_task_handle_time=new Date();
                    task_history.proc_inst_task_arrive_time=new Date();
                    task_arr.push(task_history);
                    console.log(task_arr);
                    //将历史表的中记录重新插入任务表，表示此工单重新处理
                    model.$ProcessInstTask.create(task_arr,function(err){
                        console.log(err);
                        if(err){
                            reject({'success': false, 'code': '1000', 'msg': '重派失败1', "error": null})
                        }else{
                            model.$ProcessTaskHistroy(history).save(function(err){
                                if(err){
                                    reject({'success': false, 'code': '1000', 'msg': '重派失败2', "error": null})
                                }else{
                                    resolve({'success': true, 'code': '2000', 'msg': '重派成功', "error": null})
                                }
                            })
                        }

                    })


                })
            }


        })
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
                }else if(inst.proc_inst_status == 7){
                    resolve(utils.returnMsg(false,"0001","转派失败:客户不配合，请移至客户不配合重新处理",null,null));
                }else if(inst.proc_cur_task != proc_cur_task_code_3){
                    resolve(utils.returnMsg(false,"0001","此工单已至省公司，不可转派。",null,null));
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
                                    if(err){
                                        resolve(utils.returnMsg(false,"0001","派单失败:创建任务失败",null,null));
                                    }else{
                                        //转派则删除原先工单在统计表中的统计信息，重新插入当前工单的统计信息
                                        process_extend_model.$ProcessTaskStatistics.remove({ "proc_inst_id":instId},function(err,res){
                                            if(err){
                                                resolve(utils.returnMsg(true,"0000","派单成功:删除统计失败",null,null));
                                            }else{
                                                user_model.$CommonCoreOrg.find({_id:{$in:userInfo.user_org},level:6},function(err,res){
                                                    if(err){
                                                        resolve(utils.returnMsg(true,"0000","派单成功:查找重派人员机构失败",null,null));
                                                    }else if(res.length==0){
                                                        resolve(utils.returnMsg(true,"0000","派单成功:重派人员无所在渠道，无法进行统计",null,null));
                                                    }else if(res.length>1){
                                                        resolve(utils.returnMsg(true,"0000","派单成功:重派人员所在渠道有多个，无法进行统计",null,null));
                                                    }else{
                                                        //将差错工单结果插入统计表
                                                        process_extend_service.addStatistics(instId, JSON.parse(cur_task.proc_vars).mistake_time, res[0].company_code).then(function (rs) {
                                                            resolve(utils.returnMsg(true,"0000","派单成功",null,null));
                                                        }).catch(function (e) {
                                                            resolve(utils.returnMsg(true,"0000","派单成功：插入统计表失败",null,null));
                                                        });
                                                    }
                                                })


                                            }
                                        })
                                    }

                                });


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
