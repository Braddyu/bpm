/**
 * Created by zhuxj on 2017/06/28..
 * 实名违规数据写入
 */

var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/core/utils/mysql_util');
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));
var pool_ydn = mysql.createPool($util.extend({}, config.ydn_mysql));

exports.auditControl = function () {
    console.log('START--------------------------实名违规（异动监控）-------------------------------');
    pool_ydn.getConnection(function (err, connection) {
        if (err != null) {
            console.log(err.message);
        } else {

            var mToday = new Date();
            var mYear = mToday.getFullYear();
            var mMonth = add_zero(mToday.getMonth() + 1);
            var mDay = add_zero(mToday.getDate() - 1);

            var timeStr = mYear + mMonth + mDay;
            console.log(timeStr);

            var warningTime = mYear + '-' + mMonth + '-' + mDay;

            var sql = "SELECT a.*,b.head_photo_path,b.real_photo_path,b.update_photo_path,b.audit_status,b.remark "
                + " FROM back_real_name_info_" + timeStr + " as a  LEFT JOIN back_real_name_photo_info_" + timeStr + " as b "
                + " ON a.serial_number=b.serial_number  WHERE a.audit_result='未通过人证合一开户成功'";

            console.log("======sql======" + sql);
            connection.query(sql, function (err, result) {
                console.log("err:" + err);
                console.log("result:" + result.length);
                connection.release();
                for (var i = 0; i < result.length; i++) {
                    var param = {};
                    param.warning_type = "实名违规";//预警类型
                    param.describes = '未通过人证合一开户成功';//预警说明
                    param.category = 1;//类别：1、重点业务稽核，2、常态抽查稽核，3、异动监控
                    param.pro_status = 0;//处理状态
                    param.warning_time = warningTime;//预警时间

                    //图片处理
                    var head_photo_path = config.project.photo_ywcj_url + '/static/images/china_mobile.png';
                    if (result[i].head_photo_path != "" && result[i].head_photo_path != undefined && result[i].head_photo_path != 'undefined') {
                        head_photo_path = config.project.photo_ydn_url + result[i].head_photo_path;
                    }
                    var real_photo_path = config.project.photo_ywcj_url + '/static/images/china_mobile.png';
                    if (result[i].real_photo_path != "" && result[i].real_photo_path != undefined && result[i].real_photo_path != 'undefined') {
                        real_photo_path = config.project.photo_ydn_url + result[i].real_photo_path;
                    }
                    var update_photo_path = config.project.photo_ywcj_url + '/static/images/china_mobile.png';
                    if (result[i].update_photo_path != "" && result[i].update_photo_path != undefined && result[i].update_photo_path != 'undefined') {
                        update_photo_path = config.project.photo_ydn_url + result[i].update_photo_path;
                    }

                    var remarksHtm = '<tr>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">手机号码：</td>';
                    remarksHtm += '<td width="20%">' + result[i].phone_number + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">身份证姓名：</td>';
                    remarksHtm += '<td width="20%">' + result[i].id_name + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">身份证号码：</td>';
                    remarksHtm += '<td width="21%">' + result[i].id_number + '</td>';
                    remarksHtm += '</tr>';
                    remarksHtm += '<tr>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">性别：</td>';
                    remarksHtm += '<td width="20%">' + result[i].sex + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">民族：</td>';
                    remarksHtm += '<td width="20%">' + result[i].nation + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">出生年月日：</td>';
                    remarksHtm += '<td width="21%">' + result[i].birthday + '</td>';
                    remarksHtm += '</tr>';
                    remarksHtm += '<tr>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">身份证地址：</td>';
                    remarksHtm += '<td width="20%">' + result[i].id_address + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">操作员姓名：</td>';
                    remarksHtm += '<td width="20%">' + result[i].operate_name + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">操作员工号：</td>';
                    remarksHtm += '<td width="21%">' + result[i].operate_number + '</td>';
                    remarksHtm += '</tr>';
                    remarksHtm += '<tr>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">订单号：</td>';
                    remarksHtm += '<td width="20%">' + result[i].order_number + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">操作类型：</td>';
                    remarksHtm += '<td width="20%">' + result[i].operate_type + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">渠道名称：</td>';
                    remarksHtm += '<td width="21%">' + result[i].channel_name + '</td>';
                    remarksHtm += '</tr>';
                    remarksHtm += '<tr>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">审核时间：</td>';
                    remarksHtm += '<td width="20%">' + result[i].audit_time + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">失败原因：</td>';
                    remarksHtm += '<td width="20%">' + result[i].failure_reason + '</td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">审核结果：</td>';
                    remarksHtm += '<td width="21%">' + result[i].audit_result + '</td>';
                    remarksHtm += '</tr>';
                    remarksHtm += '<tr>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">头像照片：</td>';
                    remarksHtm += '<td width="20%"><img src="' + head_photo_path + '" width="100px" height="100px"/></td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">实体店实景照片：</td>';
                    remarksHtm += '<td width="20%"><img src="' + real_photo_path + '" width="100px" height="100px"/></td>';
                    remarksHtm += '<td class="info widget-caption themeprimary" width="13%" style="vertical-align:middle;">更新照片：</td>';
                    remarksHtm += '<td width="21%"><img src="' + update_photo_path + '" width="100px" height="100px"/></td>';
                    remarksHtm += '</tr>';

                    param.remarks = remarksHtm;//预警内容

                    batchAddObject(param);
                }

            });
        }
    });
};

function batchAddObject(param) {
    console.log("======param======" + param);
    pool.getConnection(function (err, connection) {
        if (err != null) {
            console.log(err.message);
        } else {
            /*保存数据*/
            var sql = 'insert into  ywcj_workbench_audit(';
            var values = ' values(';
            var params = [];
            for (var k in param) {
                if (param[k] != '') {
                    sql += k + ',';
                    values += '?,';
                    params.push(param[k]);
                }
            }
            sql = sql.substring(0, sql.length - 1) + ')';
            values = values.substring(0, values.length - 1) + ')';
            sql += values;

            console.log("======sql======" + sql);
            connection.query(sql, params, function (err, data) {
                console.log("err:" + err);
                console.log("data:" + data);
                connection.release();
            });
        }
    });
}

//时间加0方法
function add_zero(temp) {
    if (temp < 10) return "0" + temp;
    else return temp;
}
