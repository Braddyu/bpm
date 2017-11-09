/**
 * Created by zhuxj on 2017/07/07..
 * 资金稽核数据写入
 */

var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/core/utils/mysql_util');
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));
var pool_ydn = mysql.createPool($util.extend({}, config.ydn_mysql));

var transaction_util = require('../../tools/transaction_util');

exports.moneyAuditControl = function () {
    console.log('START--------------------------资金稽核（数据写入）-------------------------------');

    pool.getConnection(function (err, connection) {
        if (err != null) {
            console.log("获取数据库连接失败" + err);
        } else {
            var sql = "select capitalId from ywjh_money_audit where capitalId=(select MAX(capitalId) from ywjh_money_audit)";
            console.log("======sql======" + sql);
            connection.query(sql, function (err, info) {
                connection.release();
                if (err) {
                    console.log(err);
                } else {
                    console.log(info);

                    if (info) {
                        if (info[0]) {
                            console.log(info[0].capitalId);
                            if (info[0].capitalId) {
                                getObject(info[0].capitalId);
                            } else {
                                getObject(0);
                            }
                        }

                    }

                }

            });
        }
    });

};

function getObject(capitalId) {
    pool_ydn.getConnection(function (err, connection) {
        if (err != null) {
            console.log(err.message);
        } else {

            var sql = "SELECT id,tradeTime AS day, '0' parentAreaCode,payorg areaCode,payorg area,'2' as  level,'1' type,"
                + " convert(SUM(bankAmount)/10000,decimal(10,4)) AS receivable,"
                + " convert(SUM(bankAmount)/10000,decimal(10,4)) AS netReceipts,"
                + " convert(SUM(bankAmount)/10000,decimal(10,4)) AS paid,'0' AS poor"
                + " FROM channel_online_capital_notionalpooling where id > " + capitalId + " GROUP BY tradeTime,payorg";

            console.log("======sql======" + sql);
            connection.query(sql, function (err, result) {

                if (err) {
                    console.log("err:" + err);
                } else {

                    console.log("result:" + result);
                    console.log("result:" + result.length);
                    connection.release();

                    addAllObject(result);

                }

            });
        }
    });
}

function addAllObject(result) {

    pool.getConnection(function (err, connection) {
        if (err != null) {
            console.log("获取数据库连接失败" + err);
        } else {
            connection.beginTransaction(function (err) {
                if (err) {
                    //事务开启失败
                    connection.release();
                    console.log("开始事务失败" + err);
                } else {
                    forObjArry(1);
                    function forObjArry(x) {
                        if (x < result.length) {
                            var dataObj = result[x];
                            var p = {};
                            p.day = dataObj.day;
                            p.parentAreaCode = dataObj.parentAreaCode;
                            p.areaCode = dataObj.areaCode;
                            p.area = dataObj.area;
                            p.level = dataObj.level;
                            p.type = dataObj.type;
                            p.receivable = dataObj.receivable;
                            p.netReceipts = dataObj.netReceipts;
                            p.paid = dataObj.paid;
                            p.poor = dataObj.poor;
                            p.capitalId = dataObj.id;

                            transaction_util.saveObject(p, connection, 'ywjh_money_audit', function (err) {
                                if (err) {
                                    //关闭数据库连接，返回错误信息到页面
                                    connection.release();
                                    console.log("保存错误" + err);
                                } else {
                                    x += 1;
                                    forObjArry(x);
                                }
                            });
                        } else {
                            //提交事务
                            transaction_util.commit(connection);
                        }
                    }
                }
            })
        }
    })
}