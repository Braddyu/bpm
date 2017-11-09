/**
 * Created by Administrator on 2017/08/21.
 */
var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/core/utils/mysql_util');
// 使用连接池，提升性能
var ydn_pool = mysql.createPool($util.extend({}, config.ydn_mysql));

var model = require('gmdp').init_gmdp.core_user_model;
exports.orgSync = function () {
    console.log('START--------------------------机构数据同步-------------------------------');
    ydn_pool.getConnection(function (err, connection) {
        if (err != null) {
            console.log("获取数据库连接失败" + err);
        } else {
            var sql = "select * from common_org_info";
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

    var peg = 0;

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
                    if(rs==null||rs==''){
                        org.org_pid = dataObj.superorgid;
                        model.$CommonCoreOrg(org).save(function (error, data) {
                            if (error) {
                                console.log(">>>error:" + error);
                            } else {
                                console.log(">>>data:"+data);
                            }
                            x += 1;
                            forObjArry(x);
                        });
                    }else{
                        //修改PID父节点
                        var org_id = rs[0]._id;
                        var superorgid = dataObj.superorgid;
                        ydn_pool.getConnection(function (err, connection) {
                            if (err != null) {
                                console.log("获取数据库连接失败" + err);
                            } else {
                                var sql = "select * from common_org_info where orgid='" + superorgid +"'";
                                console.log("======sql======" + sql);
                                connection.query(sql, function (err, info) {
                                    connection.release();
                                    if (err) {
                                        console.log(err);
                                        x += 1;
                                        forObjArry(x);
                                    } else {

                                        if(info!=null && info[0]!=null){
                                            var orgInfo = {};
                                            orgInfo.org_code = info[0].orgcode;
                                            orgInfo.org_type = info[0].orgtype;
                                            orgInfo.org_status = info[0].status;
                                            orgInfo.org_order = info[0].orgorder;
                                            orgInfo.org_belong = info[0].areacode;
                                            orgInfo.org_name = info[0].orgname;
                                            orgInfo.org_fullname = info[0].orgpath;

                                            model.$CommonCoreOrg.find(orgInfo, function(err, rst) {
                                                if(err){
                                                    console.log(">>>err:" + err);
                                                }else{
                                                    console.log(rst+rst[0]);
                                                    if(rst!=null && rst[0]!=null){
                                                        var orgEntity = {};
                                                        orgEntity.org_pid = rst[0]._id;
                                                        var conditions = {_id: org_id};
                                                        var update = {$set: orgEntity};
                                                        var options = {};
                                                        model.$CommonCoreOrg.update(conditions, update, options, function (error) {
                                                            if(error) {
                                                                console.log(">>>error:" + error);
                                                            }
                                                            x += 1;
                                                            forObjArry(x);

                                                        });

                                                    }else {
                                                        x += 1;
                                                        forObjArry(x);
                                                    }
                                                }
                                            });
                                        }else{
                                            x += 1;
                                            forObjArry(x);
                                        }

                                    }

                                });
                            }
                        });

                    }
                }
            });


        } else {

            if(peg==0){
                forObjArry(0);
                peg = 1;
            }else{
                console.log(">>>写入完成<<<");
                updateCount();//机构节点统计，区分当前节点是否存在子节点
            }
        }
    }

}


function updateCount() {
    console.log(">>>开始更新<<<");
    model.$CommonCoreOrg.find(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result.length);
            forOrgArry(0);
            function forOrgArry(i) {
                if (i < result.length) {
                    var id = result[i]._id;
                    model.$CommonCoreOrg.find({ org_pid: id },function(err, ts) {
                        if(err){
                            console.log(err);
                        }else{
                            var data = {};
                            data.child_count = ts.length;
                            var conditions = {_id: id};
                            var update = {$set: data};
                            var options = {};
                            model.$CommonCoreOrg.update(conditions, update, options, function (error) {
                                if (error) {
                                    console.log(error);
                                }else {
                                    console.log(">>>更新第"+i+"条数据成功<<<");
                                    i += 1;
                                    forOrgArry(i);
                                }
                            });

                        }

                    });

                }else {
                    console.log(">>>更新完成<<<");
                }

            }
        }
    });
}