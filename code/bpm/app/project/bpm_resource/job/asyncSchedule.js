var schedule = require("node-schedule");
var orgasync = require("./async_athena_data");
var everyday_send_sms = require("./everyday_send_sms");
var peasonsync_add = require("./async_peason_data_add");

var config = require('../../../../config');

var orgFlag = config.switchDetail.athena_switch;
var peasonFlag = config.switchDetail.athena_app_switch;
var sendsmsFlag = config.switchDetail.send_sms_switch;
schedule.scheduleJob(config.athena_org_switch_core, function(){
    if(orgFlag){
        console.log('运行了。');
      orgasync.sync_data_from_Athena();
    }
});

schedule.scheduleJob(config.athena_peason_switch_core, function(){
    if(peasonFlag){
        //console.log('运行了。app');
        peasonsync_add.sync_data_from_Athena();
    }
});

schedule.scheduleJob(config.send_sms_switch_core, function(){
    if(sendsmsFlag){
        everyday_send_sms.sync_send_sms();
    }
});
