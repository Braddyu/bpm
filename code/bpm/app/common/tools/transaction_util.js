/**
 * Created by ZHUXJ on 2016/9/14.
 * 事务管理工具
 */
var config = require('../../../config');

/**
 * 通用保存数据到数据库
 * @param p 要保存的数据
 * @param connection 数据库连接，执行完成以后由调用者关闭
 * @param tableName 表明
 * @param cb 回调函数，返回错误信息
 */
exports.saveObject = function (p, connection, tableName, cb) {
    var sql = 'insert into ' + tableName + ' (';
    var values = ' values(';
    var params = [];
    for (var k in p) {
        if (p[k] != '') {
            sql += k + ',';
            values += '?,';
            params.push(p[k]);
        }
    }
    sql = sql.substring(0, sql.length - 1) + ')';
    values = values.substring(0, values.length - 1) + ')';
    sql += values;
    connection.query(sql, params, function (err, data) {
        cb(err, data);
    });
}
//事务的提交
exports.commit = function (connection) {
    connection.commit(function (err, info) {
        if (err) {
            connection.rollback(function (err) {
                console.log("保存失败: " + err);
                connection.release();
            });
        } else {
            console.log("保存成功: " + info);
        }
    });
}