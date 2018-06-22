var process_model = require("../models/process_model");
var moment = require("moment");
var process_utils = require('../../../utils/process_util');


exports.sync_send_sms = function () {
    send_sms();
}
/**
 * 统计前一天生成的工单，查询任务表中的处理人，
 * 分组获取每个处理人需要处理的工单量，进行短信发送
 */
function send_sms() {


       let yesterday= moment().subtract(1, "days").format("YYYYMMDD")
        process_model.$ProcessInst.aggregate([
            {
                $addFields: {
                    yearMonthDayUTC: { $dateToString: { format: "%Y%m%d", date: "$proc_start_time" } },
                }
            },
            {
                $match:{
                    yearMonthDayUTC:{$eq:yesterday}
                }
            },
            {
                $lookup:{
                    from:"common_bpm_proc_inst_task",
                    localField:"_id",
                    foreignField:"proc_inst_id",
                    as:"task"
                }

            },
            {
                $unwind: {path: "$task", preserveNullAndEmptyArrays: true}
            },
            {
                $match:{
                    "task.proc_inst_task_status":0
                }
            },
            {
              $project:{
                  proc_inst_task_assignee:"$task.proc_inst_task_assignee"
              }
            },
            {
                $group:{
                    _id:"$proc_inst_task_assignee",
                    count: { $sum: 1 }
                }
            }
        ]).exec(function (err, res) {

            for(let i in res){
                   var params = {
                        "num": res[i].count
                    }
                    process_utils.sendSMS(res[i]._id, params, "SMS_TEMPLET_ORDER").then(function (rs) {
                        console.log("短信发送成功");
                    }).catch(function (err) {
                        console.log("短信发送失败", err);
                    });
                }


        })

}

