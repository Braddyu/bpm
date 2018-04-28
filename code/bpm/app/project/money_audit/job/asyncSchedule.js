var schedule = require("node-schedule");
var config = require('../../../../config');
var service = require('../services/money_audit_list_service');

var flag = config.switchDetail.money_audit_switch;

schedule.scheduleJob(config.money_audit_switch_core, function(){
    if(flag){
        //查出 未归档的资金稽核工单实例，遍历
        service.getMoneyAudtiProcInsts()
            .then(function(result){
                var data = result.data;

                console.log("获取未归档的资金稽核工单实例成功"+JSON.stringify(result));
            })
            .catch(function(err){
                console.log('获取未归档的资金稽核工单实例失败',err);
            });
    }
});

