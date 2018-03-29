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
        var SCLASS_ID=" = 643 ";//差错工单
        if (condition.SCLASS_ID=="644"){//预警工单
            tableName="wf_warning_max_data_t";
            SCLASS_ID = " in (603, 604, 605, 463) ";
        }
        let start =(pageNow-1)*pageSize;
        var  sql ="select distinct j.id, " +
            "                j.task_id, " +
            "                j.sclass_id, " +
            "                j.job_id, " +
            "                j.title, " +
            "                j.created, " +
            "                p.desc_text as orderTxt, " +
            "                jc.name as wfName, " +
            "                js.name as stepName, " +
            "                ja.name as statusName, " +
            "                j.bak_1 as month, " +
            "                u.user_name as caller,             " +
            "                DATE_FORMAT(j.finish_date,\"%Y-%m-%d %H:%i:%s\") AS finish_date, " +
            "                j.last_solvedate,           " +
            "                IF(j.JOB_TIMEOUT=1, '未超时','超时') AS timeout, " +
            "                j.INITIATOR, " +
            "                j.initiator_name, " +
            "                func_sc_param('sm.aibsm.zg.st_gdlx', p.order_type) as orderTpye, " +
            "                u.login_name, " +
            "                t.chlCallerNum, " +
            "                t.mngCallerNum, " +
            "                (select p.msisdn from wm_user p where p.id = j.INITIATOR) as initiatorPhone, " +
            "                t.chlId, " +
            "                t.chlName, " +
            "                t.chlCaller, " +
            "                t.chlCallerTel, " +
            "                p.field_1, " +
            "                t.chlSolvemeth, " +
            "                t.mngId, " +
            "                t.mngName, " +
            "                t.mngCaller, " +
            "                t.mngCallerTel, " +
            "                t.mngSolvemeth " +
            "  from wf_view_total_data j, " +
            "       wf_job_step js, " +
            "       wf_job_status ja, " +
            "       wf3_job_sclass jc, " +
            "       wm_user u, " +
            "       provinces_cities_order p, " +tableName+" t  "+

            " where 1 = 1 " +
            "   and j.cur_step = js.id " +
            "   and j.cur_status = ja.id " +
            "   and j.SCLASS_ID = jc.id " +
            "   and j.caller = u.id " +
            "   and j.JOB_ID = t.job_id " +
            "   and j.JOB_ID = p.job_id "+
            "   and j.SCLASS_ID "+SCLASS_ID;
        if (condition.job_id){
            sql +="  and j.job_id like "+"'%"+condition.job_id+"%'";
        }
        if (condition.chlId){
            sql +="  and t.chlId="+condition.chlId;
        }
        if (condition.startDate && condition.endDate){
            sql +="  and  DATE_FORMAT(j.created,\"%Y-%m-%d\") BETWEEN "+"'"+condition.startDate+"'"+" And "+"'"+condition.endDate+"'";
        }
        if (condition.startDate && !condition.endDate){
            sql +="  and  DATE_FORMAT(j.created,\"%Y-%m-%d\") BETWEEN "+"'"+condition.startDate+"'"+" And "+"'"+"DATE_FORMAT("+new Date().toLocaleString()+",\"%Y-%m-%d\")"+"'";
        }
        if (!condition.startDate && condition.endDate){
            sql +="  and  DATE_FORMAT(j.created,\"%Y-%m-%d\") < "+"'"+condition.endDate+"'";
            //console.log(sql);
        }
        sql += " limit "+start+","+pageSize;

         var countsql="select count(*) as totalnum   from wf_view_total_data j, " +
             "       wf_job_step js, " +
             "       wf_job_status ja, " +
             "       wf3_job_sclass jc, " +
             "       wm_user u, " +
             "       provinces_cities_order p, " +tableName+" t  "+
             " where 1 = 1 " +
             "   and j.cur_step = js.id " +
             "   and j.cur_status = ja.id " +
             "   and j.SCLASS_ID = jc.id " +
             "   and j.caller = u.id " +
             "   and j.JOB_ID = t.job_id " +
             "   and j.JOB_ID = p.job_id " +
             "   and j.SCLASS_ID "+SCLASS_ID;
        if (condition.job_id){
            countsql +="  and j.job_id like "+"'%"+condition.job_id+"%'";
        }
        if (condition.chlId){
            countsql +="  and t.chlId="+condition.chlId;
        }
        if (condition.startDate && condition.endDate){
            countsql +="  and  DATE_FORMAT(j.created,\"%Y-%m-%d\") BETWEEN "+"'"+condition.startDate+"'"+" And "+"'"+condition.endDate+"'";
        }
        if (condition.startDate && !condition.endDate){
            countsql +="  and  DATE_FORMAT(j.created,\"%Y-%m-%d\") BETWEEN "+"'"+condition.startDate+"'"+" And "+"'"+"DATE_FORMAT("+new Date().toLocaleString()+",\"%Y-%m-%d\")"+"'";
        }
        if (!condition.startDate && condition.endDate){
            countsql +="  and  DATE_FORMAT(j.created,\"%Y-%m-%d\") < "+"'"+condition.endDate+"'";
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

/**
 *  历史工单详情
 * @param orderId
 */
exports.getOrderHistoryDetail = function(orderId) {
    var p = new Promise(async function(resolve,reject){
        var rtnInfo = [];
        var  sql =
                    "SELECT "+
                        "j.`TITLE`,"+
                        "j.`ORIGIN_SYS`,"+
                        "DATE_FORMAT( j.`HAPPEN_DATE`,'%Y-%m-%d %H:%i:%s') AS happenDate,"+
                        "wr.`NAME` AS roleName,"+
                        "DATE_FORMAT( j.`STARTDATE`,'%Y-%m-%d %H:%i:%s') AS startDate,"+
                        "wu.`USER_NAME` AS userName,"+
                        "j.`WORK_DAY` as workDay,"+
                        "DATE_FORMAT(j.finish_date,'%Y-%m-%d %H:%i:%s') AS finishDate,"+
                        "j.`INITIATOR_INFO` ,"+
                        "j.`REMARKS`,"+
                        "pco.`ORDER_TYPE`,"+
                        "pco.`DESC_TEXT`,"+
                        "pco.`FIELD_1`,"+
                        "wjt.`PRE_DAYCOUNT`,"+
                        "DATE_FORMAT(wjt.`PRE_FINISHDATE`,'%Y-%m-%d %H:%i:%s') AS preFinishDate,"+
                        "wjt.`REMARKS` AS handleOpinion "+
                        //"wjs.`NAME` AS className " +
                     "FROM "+
                         "wf3_job j "+
                            "LEFT JOIN wm_user wu ON wu.`ID` = j.`INITIATOR` "+
                            "LEFT JOIN `wm_role` wr ON wr.`ID` = j.`INITIATOR_ROLE` "+
                            "LEFT JOIN `provinces_cities_order` pco ON pco.`JOB_ID` = j.`JOB_ID` "+
                            "LEFT JOIN `wf3_job_task` wjt ON wjt.`JOB_ID` = j.`JOB_ID`" +
                            //"LEFT JOIN `wf3_job_sclass` wjs ON wjs.`ID` = j.`SCLASS_ID`"
                    "WHERE j.job_id = "+ orderId;

        var hisTaskSql =
            "SELECT  " +
            "   wjs.`NAME` AS 'stepName', " +
            "   wu.`USER_NAME` AS 'userName', " +
            "   wja.`NAME` AS 'action', " +
            "   wjs.`CREATED` AS 'startDate', " +
            "   DATE_FORMAT(wjth.`created`,'%Y-%m-%d %H:%i:%s') AS 'finishDate', " +
            "   wjth.`cur_solvemeth` AS 'solvemeth' " +
            "FROM " +
            "  `wf3_job_task_his` wjth  " +
            "  LEFT JOIN `wf_job_step` wjs  " +
            "    ON wjs.`ID` = wjth.`cur_step`  " +
            "  LEFT JOIN `wm_user` wu ON wu.`ID` = wjth.`caller` " +
            "  LEFT JOIN `wf_job_action` wja ON wja.`id` = wjth.`cur_action` " +
            "WHERE " +
            "   wjth.`job_id` = " + orderId +
            " ORDER BY wjth.`created` ASC; ";

        var fileSql = "SELECT s.`SAVE_PATH`,s.`LOCAL_NAME` FROM `sp_sys_annex` s WHERE s.`ATTR_1` = " + orderId;

        pool_hh_history.query(sql,function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }else{
                rtnInfo[0] = result[0];
                pool_hh_history.query(hisTaskSql,function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }else{
                        rtnInfo[0].historyTasks = result;
                            pool_hh_history.query(fileSql,function (err, result) {
                                if (err) {
                                    console.log('[SELECT ERROR] - ', err.message);
                                    return;
                                }else{
                                    rtnInfo[0].files = result;
                                    resolve(rtnInfo);
                                }
                            })
                    }
                });
            }
        });
    });
    return p;
};





