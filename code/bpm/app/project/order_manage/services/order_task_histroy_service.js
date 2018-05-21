var config = require('../../../../config');
var history_model = require('../models/history_model');
var utils = require('../../../../lib/utils/app_utils');
var mysql  = require('mysql');
var pool_hh_history = mysql.createPool(config.mysql);
var process_model = require('../../bpm_resource/models/process_model');
var user_model = require('../../bpm_resource/models/user_model');
var mongoose = require('mongoose');

/**
 * 管理员处理统计
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise} condition,pageNow,pageSize
 */
exports.getTaskHistoryList=function(condition,pageNow,pageSize){
    var p = new Promise(function (resolve, reject) {
        var user_roles = mongoose.Types.ObjectId('5a9f3bf5a8cfe7000e40fe41');
        var fields = {};
        fields.user_roles={$in:[user_roles]};
        var user_nos=[];
        var userResults=[];
        var resultCount=[];
        var resultcond=[];

        var compare = {};
        //开始时间
        if (condition.startDate) {
            compare['$gte'] = new Date(condition.startDate);
        }
        //结束时间
        if (condition.endDate) {
            compare['$lte'] = new Date(condition.endDate+' 23:59:59');
        }
        //console.log(compare,"eeeeeeeeeeeee");
        user_model.$User.find(fields, function(error, result) {
            if(error) {
                console.log(error);
            }else {
                console.log(result,"-----------");
                userResults = result;
                for(var k in result){
                    user_nos.push(result[k].user_no);
                }
                process_model.$ProcessTaskHistroy.aggregate([
                    {
                        $match: {
                            proc_inst_task_assignee:{$in:user_nos},
                            proc_code: "p-201",
                            proc_inst_task_code : { $ne : "processDefineDiv_node_2" },
                            proc_inst_task_handle_time:compare

                        }
                    },
                    {
                        $group : {
                            _id:{
                                proc_inst_task_assignee:"$proc_inst_task_assignee"
                            },
                            count : {$sum:1}
                        }
                    }
                ]).exec(function (err, res) {
                    console.log(res,"++++++++");
                    if (err) {
                        reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
                    } else {
                        for(var idx in userResults){
                            var user = userResults[idx];
                            if (res.length>0){
                                for(var ix in res){
                                    var task = res[ix];
                                     if(task._id.proc_inst_task_assignee==user.user_no){
                                         resultCount.push({user_no: user.user_no, count: task.count,user_name:user.user_name,work_id:user.work_id });
                                     }
                                }
                            }else {
                                resultCount.push({ user_no: user.user_no, count: 0,user_name:user.user_name,work_id:user.work_id });
                            }
                        }
                        for(var idx in userResults){
                            for(var ix in resultCount){
                                if(resultCount[ix].user_no==userResults[idx].user_no){
                                    userResults.splice(idx,1);
                                }
                            }
                        }
                        console.log(userResults,"00000000000000000000000");
                        if (userResults.length>0){
                            for (var i in userResults){
                                resultCount.push({user_no: userResults[i].user_no, count: 0,user_name:userResults[i].user_name,work_id:userResults[i].work_id });
                            }
                        }
                        if(condition.work_id){
                            for(let  i in resultCount){
                                console.log(resultCount[i]);
                                if (resultCount[i].work_id==condition.work_id){
                                    resultcond.push(resultCount[i]);
                                    resolve(resultcond);
                                }else{
                                    resolve(resultcond);
                                }
                            }
                        }else {
                            resolve(resultCount);
                        }
                    }
                })

            }
        });

    });
    return p;
};
