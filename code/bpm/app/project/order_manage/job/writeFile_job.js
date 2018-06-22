const fs=require('fs');
const inst = require("../../bpm_resource/models/process_model");
const task_file = require("../../bpm_resource/models/process_extend_model")
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
   if(config.switchDetail.errData_switch){
       find_write();
       write_file();
   }
});
async function find_write() {
    var arr = [];
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
        let  data = (inst_id+'|'+BOSS_CODE+'|'+yesterday+'\r\n');
        arr.push(data);
    }
    fs.writeFileSync(config.writeLoad+fileName,arr.join(''),{encoding:'utf-8'},function(err){
        if(err){
            console.log("文件写入失败")
        }else{
            console.log("文件写入成功");
        }
    })
    ftp_util.connect(server);
      ftp_util.uploadFile(config.writeLoad+fileName,config.ftp_gdglFile_server_put+fileName,function(errs,result){
               if(errs){
               console.log(errs);
               }else{
                   console.log(result)
                   ftp_util.end();
               }
           });
}
async function write_file(){
    var arr = [];
    let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    let date = moment().subtract(0, 'days').format('YYYY-MM-DD');
    let proc_code = "p-201";
    let proc_inst_status = 4;
    let result = await  inst.$ProcessInst.find({'proc_code':proc_code,'proc_inst_status':proc_inst_status,'proc_inst_task_complete_time':{$gte: new Date(yesterday), $lte: new Date(date)}});
    let fileName = 'gdgl_logs_filePath_'+yesterday.replace(/-/g,'')+'.txt';
    for(let i in result){
        let inst_id = result[i]._id;
        let logs_mes = await inst.$ProcessTaskHistroy.find({'proc_inst_id':inst_id});
        if(logs_mes.length>0){
            for(let j in logs_mes){
                let task_id = logs_mes[j].proc_task_id;
                let instId = logs_mes[j].proc_inst_id.toString();
                let proc_inst_task_name = logs_mes[j].proc_inst_task_name;
                let proc_inst_task_assignee_name = logs_mes[j].proc_inst_task_assignee_name;
                let year = logs_mes[j].proc_inst_task_complete_time.getFullYear();
                let month = logs_mes[j].proc_inst_task_complete_time.getMonth()+1;
                let day = logs_mes[j].proc_inst_task_complete_time.getDate();
                let hours = logs_mes[j].proc_inst_task_complete_time.getHours();
                let min = logs_mes[j].proc_inst_task_complete_time.getMinutes();
                let seconds = logs_mes[j].proc_inst_task_complete_time.getSeconds();
                let proc_inst_task_complete_time = (year+'-'+month+'-'+day+' '+hours+':'+min+':'+seconds)
                let proc_inst_task_remark = logs_mes[j].proc_inst_task_remark;
                let file_mes = await task_file.$ProcessTaskFile.find({'proc_inst_id':instId,'proc_task_id':task_id});
                var file_path ;
                if(file_mes.length==0){
                    file_path = '';
                }else{
                    file_path = file_mes[0].file_path;
                }
                var file_name;
                if(file_mes.length==0){
                    file_name = '';
                }else{
                    file_name = file_mes[0].file_name;
                }
                let data = (instId+'|'+task_id+'|'+proc_inst_task_name+'|'+proc_inst_task_assignee_name+'|'+proc_inst_task_complete_time+'|'+proc_inst_task_remark+'|'+file_path+'|'+file_name+'\r\n');
               arr.push(data);
            }
        }
    }
    fs.writeFileSync(config.writeLoad+fileName,arr.join(''),{encoding:'utf-8'},function(err){
        if(err){
            console.log(err)
            console.log("文件写入失败")
        }else{
            console.log("文件写入成功");
        }
    })
    ftp_util.connect(server);
    ftp_util.uploadFile(config.writeLoad+fileName,config.ftp_logs_filePath+fileName,function(errs,result){
        if(errs){
            console.log(errs);
        }else{
            console.log(result)
            ftp_util.end();
        }
    });
}
