var schedule = require("node-schedule");
var task_job = require("./task_job");
var config = require('../../../../config');


var mistake = config.switchDetail.mistake_switch;
var mistake_distribute = config.switchDetail.mistake_distribute_switch;


//定时判断差错工单是否超时
schedule.scheduleJob(config.mistake_switch_core, function(){
    if(mistake){
        task_job.task_job();
    }
});


//差错工单派发定时任务
schedule.scheduleJob(config.mistake_distribute_cron, function(){
    if(mistake_distribute){
        task_job.mistake_distribute_task();
    }
});

