/**
 * Created by ZhaoQingna on 2017/03/17.
 */
var utils = require('gmdp').init_gmdp.core_app_utils;
var mysql_util = require('gmdp').init_gmdp.mysql_utils;

/**
 * 查询基站告警信息
 * @constructor
 */
exports.getStationAlarmInfo=function(res_id, cb){
    if(!res_id) {
        cb(utils.returnMsg(false,1000,'工单维护对象ID为空',null,null));
    }
    var res_obj_id_arr = res_id.split("|");
    // 物理站ID
    var int_id=null;
    if(res_obj_id_arr.length>=2){
        int_id=res_obj_id_arr[1];
    }
    if(!int_id){
        // 物理站ID不存在
        cb(utils.returnMsg(true,0000,'查询基站告警信息成功',[],null));
    }
    // 取故障发生在72小时内且故障未清除未读取的数据
    var sql = 'SELECT emosGdNo,maintainObjName,faultDescription,faultHappenTime ' +
        'FROM Examine_api.log_api_emos_gen_elect ' +
        //'WHERE faultHappenTime>=date_sub(now(),interval 72 hour) ' +
        'WHERE now() < finishTimeLimit AND now() > faultHappenTime '+
        'AND clearStatus=100 AND status=1 AND resId=? ' +
        'ORDER BY faultHappenTime desc, insertDt desc ';
    var params = [int_id];
    console.warn(sql+"params:"+params);
    mysql_util.query(sql, params, function (err, result) {
        if(err){
            cb(utils.returnMsg(false,1001,'查询基站告警信息异常',[],null));
        }else{
            cb(utils.returnMsg(true,0000,'查询基站告警信息成功',result,null));
        }
    });
};
/**
 *  基站发电生成工单成功后更新其EMOS告警信息读取状态
 * @param emosGdNo
 * @param work_order_code
 * @param cb
 */
exports.updateEmosGenlect= function (emosGdNo, work_order_code, cb){
    var sql = 'update Examine_api.log_api_emos_gen_elect ' +
        'set status=2, dwGdNo=?, readDt=now() ' +
        'where emosGdNo=? ';
    var params=[];
    params.push(work_order_code);
    params.push(emosGdNo);
    console.warn("sql:"+sql+",params:"+params);
    mysql_util.query(sql, params, function (error, result) {
        if(error){
            cb({"success" : false,"code":'1001','msg':'更新基站发电告警信息读取状态异常'});
        }else{
            cb({"success" : true,"code":'0000','msg':'更新基站发电告警信息读取状态成功'});
        }
    });
}