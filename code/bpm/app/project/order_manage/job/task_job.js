
const utils = require('../../../../lib/utils/app_utils');
const process_model = require('../../../../app/project/bpm_resource/models/process_model');
const user_model = require('../../../../app/project/bpm_resource/models/user_model');
const config = require('../../../../config');
const fs=require('fs');
const path=require('path');
const schedule = require("node-schedule");
var rule = new schedule.RecurrenceRule();

//周一到周日的24点执行
// rule.dayOfWeek = [0, new schedule.Range(1, 6)];
// rule.hour = 24;
// rule.minute = 0;
//定时任务
// schedule.scheduleJob(rule, function(){
//         task();
//  });

async function task() {
    try{
        //查询未归档未超时的差错工单和预警工单
        let instList=await process_model.$ProcessInst.find({"proc_inst_status":{$nin:4},"proc_code":{$in:['p-109','p-201']},"is_overtime":'0'});
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
                            if (userList.length>0) {
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
                            }
                        }
                    }
                });
            }
        }
    }catch(e){
        console.log("处理超时任务失败",e);
    }



}




