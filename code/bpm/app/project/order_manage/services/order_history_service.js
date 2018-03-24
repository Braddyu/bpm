var config = require('../../../../config');
var history_model = require('../models/history_model');
var mysql  = require('mysql');
var pool_hh_history = mysql.createPool(config.hh_mysql);
/**
 * 工单列表分页
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getHistoryList= function() {
    var p = new Promise(async function(resolve,reject){

        var  sql ="select distinct j.id,\n" +
            "                j.task_id,   -- 任务id\n" +
            "                j.job_id,    -- 工单id\n" +
            "                j.title,       -- 标题\n" +
            "                j.PRE_SOLVEMETH,-- 派单内容\n" +
            "                jc.name as wfName,-- 类型\n" +
            "                u.id as bossId,   -- 当前处理人BOSS工号\n" +
            "                u.user_name as caller, -- 当前处理人\n" +
            "                js.name as stepName,   -- 步骤名称\n" +
            "                ja.name as statusName, --\n" +
            "                j.FINISH_FLAG,         --     \n" +
            "                j.caller_role,         -- 角色\n" +
            "                j.created,\n" +
            "                DATE_FORMAT(j.finish_date,\"%y-%m-%d %H:%i:%s\") AS finish_date,\n" +
            "                j.last_solvedate,\n" +
            "                IF(j.JOB_TIMEOUT=1, '未超时','超时') AS timeout\n" +
            "\n" +
            "  from v_wf3_job_all_t j,\n" +
            "       wf_job_step     js,\n" +
            "       wf_job_status   ja,\n" +
            "       wf3_job_sclass  jc,\n" +
            "       wm_user         u\n" +
            " where 1 = 1\n" +
            "   and j.cur_step = js.id \n" +
            "   and j.cur_status = ja.id \n" +
            "   and j.SCLASS_ID = jc.id \n" +
            "   and j.caller = u.id\n" +
            "   and j.CALLER_ROLE=998\n" +
            "   order by j.created desc";
        pool_hh_history.query(sql,function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }else{
                console.log(result);
                resolve(result);
            }
        });

    });
    return p;
};


// text();
// function text() {
//
//     var  sql = "select distinct j.id,\n" +
//         "                j.task_id,\n" +
//         "                j.job_id,\n" +
//         "                j.title,\n" +
//         "                jc.name as wfName,\n" +
//         "                js.name as stepName,\n" +
//         "                ja.name as statusName,\n" +
//         "                j.FINISH_FLAG,\n" +
//         "                u.user_name as caller,\n" +
//         "                j.caller_role,\n" +
//         "                j.created,\n" +
//         "                j.finish_date as finish_date,\n" +
//         "                j.last_solvedate,\n" +
//         "                j.JOB_TIMEOUT as timeout\n" +
//         "  from v_wf3_job_all_t j,\n" +
//         "       wf_job_step     js,\n" +
//         "       wf_job_status   ja,\n" +
//         "       wf3_job_sclass  jc,\n" +
//         "       wm_user         u\n" +
//         " where 1 = 1\n" +
//         "   and j.cur_step = js.id \n" +
//         "   and j.cur_status = ja.id \n" +
//         "   and j.SCLASS_ID = jc.id \n" +
//         "   and j.caller = u.id\n" +
//         "   and j.CALLER_ROLE=999\n" +
//         "   order by j.created desc";
//
//     pool_hh_history.query(sql,function (err, result) {
//         if (err) {
//             console.log('[SELECT ERROR] - ', err.message);
//             return;
//         }
//         console.log(result);
//
//     });
// }





