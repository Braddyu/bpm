const process_model = require('../../../../app/project/bpm_resource/models/process_model');
const user_model = require('../../../../app/project/bpm_resource/models/user_model');
var service = require('../services/mistake_list_service');
var utils = require('../../../../lib/utils/app_utils');
var dictModel = require('../../workflow/models/dict_model');
var config = require('../../../../config');
var process_utils = require('../../../utils/process_util');

exports.task_job=function(){
    task ();
}

async function task() {
    try{
        //查询未归档未超时的差错工单和预警工单
        let instList=await process_model.$ProcessInst.find({"proc_inst_status":{$nin:4},"proc_code":{$in:['p-201']},"is_overtime":'0',"proc_cur_task_name" :"厅店处理回复"});
       console.log(instList.length);
        let now=new Date().getTime();
        for(let item in instList){
            let proc_vars=JSON.parse(instList[item].proc_vars);
            let endTime=new Date(proc_vars.end_time).getTime();
            //判断是否是超时
            if(now > endTime){
                var conditions = {_id: instList[item]._id};
                var update = {$set: {is_overtime:1}};
                var options = {};
                process_model.$ProcessInst.update(conditions, update, options,async function (error) {
                    if(error) {
                    }else {
                        let taskList=await process_model.$ProcessInstTask.find({"proc_inst_id":instList[item]._id,"proc_inst_task_status" :0})
                        if(taskList.length>0){
                            let userList=await user_model.$User.find({"user_no":taskList[0].proc_inst_task_assignee});
                            //发送短信通知当前节点处理人
                  /*          if (userList.length>0) {
                                var process_utils = require('../../../utils/process_util');
                                var mobile = userList[0].user_phone;

                                var params = {
                                    "procName": instList[item].proc_title,
                                    "orderNo":  instList[item].work_order_number
                                }
                                process_utils.sendSMS(mobile, params, "SMS_TEMPLET_ORDER").then(function (rs) {
                                    console.log("短信发送成功");
                                }).catch(function (err) {
                                    console.log("短信发送失败", err);
                                });
                            }*/
                        }
                    }
                });
            }
        }
    }catch(e){
        console.log("处理超时任务失败",e);
    }
}

exports.mistake_distribute_task = function () {
    var queryDate = "";
    var check_status = "";
    var business_name = "";
    var flag = "";
    var order_number = "";
    var city_code = "";

    var status= 0;//派单状态
    var user_no ="13511927000";
    var work_id = "18600834";
    var user_name = "曹锡江";
    var role_name = "省级管理人员";
    var mlog_id ='';
    var datas = [];
    var data = {};
    var match = {};
    match['dict_code'] = {$in:["mistake_task_date", "mistake_task_check_status",
            "mistake_task_business_name", "mistake_take_order_number","mistake_task_flag","mistake_task_city_code"]};
    match.dict_status = 1;
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
    ]).exec(function (err, res) {
        if(res.length){
            for(let item in res){
                var dict = res[item];
                if (dict.dict_code == "mistake_task_date") {
                    queryDate = dict.dict_attr_info.field_value;
                }else if(dict.dict_code == "mistake_task_check_status"){
                    check_status =  dict.dict_attr_info.field_value;
                }else if(dict.dict_code == "mistake_task_business_name"){
                    business_name = dict.dict_attr_info.field_value;
                }else if(dict.dict_code == "mistake_task_flag"){
                    flag = dict.dict_attr_info.field_value;
                }else if(dict.dict_code == "mistake_take_order_number"){
                    order_number = dict.dict_attr_info.field_value;
                }else if(dict.dict_code == "mistake_task_city_code"){
                    city_code = dict.dict_attr_info.field_value;
                }
            }

            // 开关未开时停止程序继续向下执行
            if (flag == "0") {
                return false;
            }

            new Promise(function(resolve,reject){
                var conditionMap = {}
                if(queryDate){
                    conditionMap.mistake_time =queryDate.replace(/\-/g,'');
                }
                if(status){
                    var dataIntArr=[]
                    status=status.split(",").forEach(function(data,index,arr){
                        dataIntArr.push(+data);
                    });  ;
                    conditionMap.status={$in:dataIntArr};
                }else{
                    conditionMap.status={$nin:[-2]};
                }
                if(check_status){
                    conditionMap.remark=check_status;
                }
                if(business_name){
                    conditionMap.business_name=business_name;
                }
                service.getMistakeListPage(0,20,conditionMap).then(function(result){
                    if (result.success) {
                        resolve(result);
                    }else{
                        console.log("=================","差错工单派单失败:","{查询工单数量失败}","=================");
                    }
                });
            }).then(function(result){
                if (order_number < result.total) {
                    // 超量情况发送短信给管理员并返回
                    process_utils.sendSMS(user_no,"","MISTAKE_DISTRIBUTE_TASK","");
                    return false;
                }
                data.proc_code = config.mistake_proc_code;
                data.proc_name = config.mistake_proc_name;
                data.dispatch_time = queryDate;
                data.create_user_no = work_id?work_id:user_no;
                data.create_user_name = "13511927000";
                data.update_user_no = '';
                data.dispatch_cond_one = check_status?check_status:'';
                data.dispatch_cond_thr = business_name?business_name:'';
                data.dispatch_cond_two = city_code?city_code:'';
                data.create_time = new Date();
                //0表示派单中，1表示：派单全部成功。2表示：派单部分成功。3表示：派单全部失败。
                data.status = 0;
                data.dispatch_remark = '';
                datas.push(data);

                service.addMistakeLog(datas).then(function(result){
                    mlog_id = result.data[0]._id.toString();
                    service.getInterface(queryDate,data.dispatch_cond_one,user_no,user_name,role_name,data.dispatch_cond_thr,data.dispatch_cond_two,data.create_user_no,status,mlog_id).then(function(dispres){
                        console.log("=================","差错工单派单结果:",dispres,"=================");
                    });
                });
            });

        }
    });
}


