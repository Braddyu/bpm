const fs=require('fs');
const inst = require("../../bpm_resource/models/process_model")
var moment = require('moment');
const config = require('../../../../config');
const ftp_util = require('../.././../utils/ftp_util');
const server = config.ftp_gdglFile_server;

var Client = require('ftp');
var c = new Client();

var schedule = require("node-schedule");
var rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = config.gdglFile_server_time.hour;
rule.minute = config.gdglFile_server_time.minute;
schedule.scheduleJob(rule, function(){
    find_write();
});

async function find_write() {
    let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let date = moment().subtract(0, 'days').format('YYYY-MM-DD');
    let proc_code = "p-201";
    let proc_inst_status = 4;
    let result = await  inst.$ProcessInst.find({'proc_code':proc_code,'proc_inst_status':proc_inst_status,'proc_inst_task_complete_time':{$gte: new Date(yesterday), $lte: new Date(date)}});
    if (!fs.existsSync(config.writeLoad)) {
        fs.mkdirSync(config.writeLoad);
    }
    let fileName = 'gdgl_Pigeonhole_'+yesterday.replace(/-/g,'')+'.txt';
    for(let i in result){
        let inst_id = result[i].id;
        let BOSS_CODE = JSON.parse(result[i].proc_vars).BOSS_CODE;
        let  data = (inst_id+'|'+BOSS_CODE+'|'+yesterday);
        fs.writeFileSync(config.writeLoad+fileName,data,{encoding:'utf-8'},function(err){
            if(err){
                console.log("文件写入失败")
            }else{
                console.log("文件写入成功");
            }
        })
    }
    ftp_util.connect(server);
      ftp_util.uploadFile(config.writeLoad+fileName,config.ftp_gdglFile_server_put+fileName,function(errs,result){
               if(errs){
               console.log(errs);
               }else{
                   console.log(result)
                   ftp_util.end();
               }
           })
}

