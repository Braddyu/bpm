var config = require('../../../../config');
var history_model = require('../models/history_model');
var utils = require('../../../../lib/utils/app_utils');
var mysql  = require('mysql');
var pool_hh_history = mysql.createPool(config.hh_mysql);
/**
 * 历史工单列表分页
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getHistoryList= function(condition,pageNow,pageSize) {
    var p = new Promise(async function(resolve,reject){
        var tableName="wf_max_data_t";
        var SCLASS_ID=" =643 ";
        if (condition.SCLASS_ID=="644"){
            tableName="wf_warning_max_data_t";
            SCLASS_ID = " in (603, 604, 605, 463) ";
        }
        let start =(pageNow-1)*pageSize;
        var  sql ="select distinct j.id,\n" +
            "                j.task_id,\n" +
            "                j.sclass_id,\n" +
            "                j.job_id,\n" +
            "                j.title,\n" +
            "                j.created,\n" +
            "                p.desc_text as orderTxt,\n" +
            "                jc.name as wfName,\n" +
            "                js.name as stepName,\n" +
            "                ja.name as statusName,\n" +
            "                j.bak_1 as month,\n" +
            "                u.user_name as caller,            \n" +
            "                DATE_FORMAT(j.finish_date,\"%Y-%m-%d %H:%i:%s\") AS finish_date,\n" +
            "                j.last_solvedate,          \n" +
            "                IF(j.JOB_TIMEOUT=1, '未超时','超时') AS timeout,\n" +
            "                j.INITIATOR,\n" +
            "                j.initiator_name,\n" +
            "                func_sc_param('sm.aibsm.zg.st_gdlx', p.order_type) as orderTpye,\n" +
            "                u.login_name,\n" +
            "                t.chlCallerNum,\n" +
            "                t.mngCallerNum,\n" +
            "                (select p.msisdn from wm_user p where p.id = j.INITIATOR) as initiatorPhone,\n" +
            "                t.chlId,\n" +
            "                t.chlName,\n" +
            "                t.chlCaller,\n" +
            "                t.chlCallerTel,\n" +
            "                p.field_1,\n" +
            "                t.chlSolvemeth,\n" +
            "                t.mngId,\n" +
            "                t.mngName,\n" +
            "                t.mngCaller,\n" +
            "                t.mngCallerTel,\n" +
            "                t.mngSolvemeth\n" +
            "  from wf_view_total_data j,\n" +
            "       wf_job_step js,\n" +
            "       wf_job_status ja,\n" +
            "       wf3_job_sclass jc,\n" +
            "       wm_user u,\n" +
            "       provinces_cities_order p, " +tableName+" t \n"+

            " where 1 = 1\n" +
            "   and j.cur_step = js.id\n" +
            "   and j.cur_status = ja.id\n" +
            "   and j.SCLASS_ID = jc.id\n" +
            "   and j.caller = u.id\n" +
            "   and j.JOB_ID = t.job_id\n" +
            "   and j.JOB_ID = p.job_id\n"+
            "   and j.SCLASS_ID "+SCLASS_ID;
        if (condition.job_id){
            sql +="\n and j.job_id like "+"'%"+condition.job_id+"%'";
        }
        if (condition.chlId){
            sql +="\n and t.chlId="+condition.chlId;
        }
        if (condition.startDate && condition.endDate){
            sql +="\n and  DATE_FORMAT(j.created,\"%Y-%m-%d\") BETWEEN "+"'"+condition.startDate+"'"+" And "+"'"+condition.endDate+"'";
        }
        if (condition.startDate && !condition.endDate){
            sql +="\n and  DATE_FORMAT(j.created,\"%Y-%m-%d\") BETWEEN "+"'"+condition.startDate+"'"+" And "+"'"+"DATE_FORMAT("+new Date().toLocaleString()+",\"%Y-%m-%d\")"+"'";
        }
        if (!condition.startDate && condition.endDate){
            sql +="\n and  DATE_FORMAT(j.created,\"%Y-%m-%d\") < "+"'"+condition.endDate+"'";
            //console.log(sql);
        }
        sql += " limit "+start+","+pageSize;

         var countsql="select count(*) as totalnum   from wf_view_total_data j,\n" +
             "       wf_job_step js,\n" +
             "       wf_job_status ja,\n" +
             "       wf3_job_sclass jc,\n" +
             "       wm_user u,\n" +
             "       provinces_cities_order p, " +tableName+" t \n"+
             " where 1 = 1\n" +
             "   and j.cur_step = js.id\n" +
             "   and j.cur_status = ja.id\n" +
             "   and j.SCLASS_ID = jc.id\n" +
             "   and j.caller = u.id\n" +
             "   and j.JOB_ID = t.job_id\n" +
             "   and j.JOB_ID = p.job_id\n" +
             "   and j.SCLASS_ID "+SCLASS_ID;
        if (condition.job_id){
            countsql +="\n and j.job_id like "+"'%"+condition.job_id+"%'";
        }
        if (condition.chlId){
            countsql +="\n and t.chlId="+condition.chlId;
        }
        if (condition.startDate && condition.endDate){
            countsql +="\n and  DATE_FORMAT(j.created,\"%Y-%m-%d\") BETWEEN "+"'"+condition.startDate+"'"+" And "+"'"+condition.endDate+"'";
        }
        if (condition.startDate && !condition.endDate){
            countsql +="\n and  DATE_FORMAT(j.created,\"%Y-%m-%d\") BETWEEN "+"'"+condition.startDate+"'"+" And "+"'"+"DATE_FORMAT("+new Date().toLocaleString()+",\"%Y-%m-%d\")"+"'";
        }
        if (!condition.startDate && condition.endDate){
            countsql +="\n and  DATE_FORMAT(j.created,\"%Y-%m-%d\") < "+"'"+condition.endDate+"'";
        }
        pool_hh_history.query(sql,function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }else{
                pool_hh_history.query(countsql,function (err, rescount) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }else{
                        resolve(utils.returnMsg4EasyuiPaging(true, '0000', '分页查询成功。', result, rescount[0].totalnum));
                    }
                });

            }
        });
    });
    return p;
};






