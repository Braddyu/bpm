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
        var user_roles = mongoose.Types.ObjectId('5a24aab506255330b47e45e1');
        var fields = {};
        fields.user_roles=user_roles;
        var user_nos=[];
        var conditionTaskHistroy={};
        conditionTaskHistroy.proc_inst_task_assignee={$in:user_nos};
        if(condition.startDate){
            conditionTaskHistroy.startDate={$gte :condition.startDate};
        }else {
            conditionTaskHistroy.startDate={$gte :new Date().toLocaleString()};
        }
        if(condition.endDate){
            conditionTaskHistroy.endDate={$lte:condition.endDate};
        }else {
            conditionTaskHistroy.endDate={$lte:new Date().toLocaleString()};
        }
        var results=[];
        var resultCount=[];
        var resultcond=[];
        user_model.$User.find(fields, function(error, result) {
            if(error) {
                console.log(error);
            }else {
                results = result;
                for(var k in result){
                    user_nos.push(result[k].user_no);
                }
                process_model.$ProcessTaskHistroy.aggregate([
                    {
                        $match: {
                            proc_inst_task_assignee:{$in:user_nos},
                            proc_inst_task_name : { $ne : "省营业销售部派发" }
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
                    if (err) {
                        reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
                    } else {
                        console.log(res);
                        for(var idx in results){
                            var user = results[idx];
                            console.log(user.user_no);
                            for(var ix in res){
                                var task = res[ix];
                                if(task._id.proc_inst_task_assignee==user.user_no){
                                    resultCount.push({user_no: user.user_no, count: task.count,user_name:user.user_name });
                                }else{
                                    resultCount.push({ user_no: user.user_no, count: 0,user_name:user.user_name });
                                    break;
                                }
                            }

                        }
                        if(condition.user_no){
                            for(let  i in resultCount){
                                console.log(resultCount[i]);
                                if (resultCount[i].user_no==condition.user_no){
                                    resultcond.push(resultCount[i]);
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
