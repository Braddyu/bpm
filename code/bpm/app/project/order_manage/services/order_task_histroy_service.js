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
        // pageNow = (pageNow == '0') ? 1 : parseInt(pageNow);
        // pageSize = parseInt(pageSize);
        //{"proc_inst_task_name":"{ObjectId$ne:省营业销售部派发}"}
        /*   {
           $limit: 10
       },*/
        var user_roles = mongoose.Types.ObjectId('5a24aab506255330b47e45e1');
        user_model.$User.aggregate([
            {
                $match: {
                    user_roles:{$in:[user_roles ]}
                   // user_no:"admin"
                }
            },
            {
                $lookup:{
                    from: "common_bpm_proc_task_histroy",
                    localField: "proc_inst_task_assignee",
                    foreignField: "user_no",
                    as: "task_histroy_data"
                }
            },

            {
                $unwind: {path: "$task_histroy_data", preserveNullAndEmptyArrays: true}
            },

            {
                $match:{
                    "task_histroy_data.proc_code":"p-201",
                    "task_histroy_data.proc_inst_task_assignee":"admin"

                }
            },

            {
                $addFields : {
                    task_histroy_data_id :"$task_histroy_data._id"
                }

            },

           {
               $group : {
                   _id:{user_no:"$user_no",user_name:"$user_name"},
                   count : {$sum : 1}
                   }
           },

            {
                $project : {
                    "_id": 0, "user_no" : "$_id.user_no", "user_name" : "$_id.user_name", "count" : 1}
            },

            {
              $limit: 10
            },

        ]).exec(function (err, res) {
            if (err) {
                reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
            } else {
                resolve(res);
                console.log(res);
             }
        })
    });
    return p;
};
