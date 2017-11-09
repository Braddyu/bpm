/**
 * Created by Administrator on 2017/08/21.
 */
var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/core/utils/mysql_util');
// 使用连接池，提升性能
var ydn_pool = mysql.createPool($util.extend({}, config.ydn_mysql));

var model = require('gmdp').init_gmdp.core_user_model;
exports.userSync = function () {
    console.log('START--------------------------用户数据同步-------------------------------');
    ydn_pool.getConnection(function (err, connection) {
        if (err != null) {
            console.log("获取数据库连接失败" + err);
        } else {
            var sql = "SELECT A.loginname,A.`password`,B.gender,B.empname,B.mobile,B.email,D.* FROM common_user_info AS A ";
            sql +=" LEFT JOIN common_emp_info AS B ON  A.empid = B.empid";
            sql +=" LEFT JOIN common_emp_org AS C ON A.empid = C.empid";
            sql +=" LEFT JOIN common_org_info AS D ON C.orgid = D.orgid";
            console.log("======sql======" + sql);
            connection.query(sql, function (err, info) {
                connection.release();
                if (err) {
                    console.log(err);
                } else {
                   batchAdd(info);
                }

            });
        }
    });

};

function batchAdd(result) {
    forObjArry(0);
    function forObjArry(x) {
        if (x < result.length) {

            var dataObj = result[x];
            var org = {};
            org.org_code = dataObj.orgcode;
            org.org_type = dataObj.orgtype;
            org.org_status = dataObj.status;
            org.org_order = dataObj.orgorder;
            org.org_belong = dataObj.areacode;
            org.org_name = dataObj.orgname;
            org.org_fullname = dataObj.orgpath;

            model.$CommonCoreOrg.find(org, function(err, rs) {
                if(err){
                    console.log(">>>err:" + err);
                    x += 1;
                    forObjArry(x);
                }else{
                    // 验证通过组装数据
                    var data = {};
                    data.login_account = dataObj.loginname;
                    data.login_password = 'e10adc3949ba59abbe56e057f20f883e';//初始密码123456
                    data.user_status = parseInt(dataObj.status);
                    data.user_no = 'FGS_' + dataObj.loginname;//用户编号唯一
                    data.user_name = dataObj.empname;
                    if(dataObj=='女'){
                        data.user_gender = 0;
                    }else{
                        data.user_gender = 1;
                    }
                    data.user_phone = dataObj.mobile;
                    data.user_email = dataObj.email;
                    data.user_duties = [];
                    var sys = model.$CommonCoreSys({_id:'57ff3789b641270aa4533089'});
                    data.user_sys = sys;
                    data.user_roles = new Array();
                    var role = model.$CommonCoreRole({_id:'57ff3bb5b641270aa453308a'});
                    data.user_roles.push(role);
                    if(rs[0]){
                        var org = model.$CommonCoreOrg({_id: rs[0]._id});
                        data.user_org = org;
                    }
                    try{
                        // 检查账号是否存在
                        model.$.count({login_account:data.login_account}, function(count_err, count) {
                            if(count_err) {
                                console.log(">>>count_err:" + count_err);
                                x += 1;
                                forObjArry(x);
                            }
                            else {
                                if(count > 0) {
                                    console.log(">>>账号已存在<<<");
                                    x += 1;
                                    forObjArry(x);
                                } else {
                                    // 实例模型，调用保存方法
                                    model.$(data).save(function(error){
                                        if(error) {
                                            console.log(">>>error:" + error);
                                        }else {
                                            console.log(">>>新增用户成功<<<");
                                            x += 1;
                                            forObjArry(x);
                                        }
                                    });
                                }
                            }
                        });
                    }
                    catch(e){
                        console.log(">>>新增用户时出现异常<<<");
                        x += 1;
                        forObjArry(x);
                    }

                }
            });


        } else {
            console.log(">>>写入完成<<<");
        }
    }

}