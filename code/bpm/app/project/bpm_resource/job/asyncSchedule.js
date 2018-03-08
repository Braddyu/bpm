var schedule = require("node-schedule");
var orgasync = require("./async_athena_data");
var peasonsync = require("./async_peason_data");

var config = require('../../../../config');

var orgFlag = config.switchDetail.athena_switch;
var peasonFlag = config.switchDetail.athena_app_switch;

schedule.scheduleJob(config.athena_org_switch_core, function(){
    if(orgFlag){
        //console.log('运行了。');
        orgasync.sync_data_from_Athena();
    }
});

schedule.scheduleJob(config.athena_peason_switch_core, function(){
    if(peasonFlag){
        //console.log('运行了。app');
        peasonsync.sync_data_from_Athena();
    }
});
