var config = require('../../../../config');
//var history_model = require('../models/history_model');
var utils = require('../../../../lib/utils/app_utils');
var mysql  = require('mysql');
var pool = mysql.createPool(config.mysqlYadianna);
var xlsx = require('node-xlsx');

//一个网格多个网格经理
exports.getGriddingList= function(condition,pageNow,pageSize) {
    var p = new Promise(async function(resolve,reject){
        console.log(pageNow,pageSize);
        let start;
        if (pageNow&&pageSize){
             start =(parseInt(pageNow)-1)*parseInt(pageSize);
        }
        var  sql ="SELECT\n" +
            "\t*\n" +
            "FROM\n" +
            "\tgrid_manager_info\n" +
            "WHERE\n" +
            "\tgrid_coding IN (\n" +
            "\t\tSELECT\n" +
            "\t\t\tgrid_coding\n" +
            "\t\tFROM\n" +
            "\t\t\t(\n" +
            "\t\t\t\tSELECT\n" +
            "\t\t\t\t\t*\n" +
            "\t\t\t\tFROM\n" +
            "\t\t\t\t\tgrid_manager_info\n" +
            "\t\t\t\tWHERE\n" +
            "\t\t\t\t\tgrid_coding IS NOT NULL\n" +
            "\t\t\t\tGROUP BY\n" +
            "\t\t\t\t\tgrid_coding,\n" +
            "\t\t\t\t\tgrid_manager_tel\n" +
            "\t\t\t\tORDER BY\n" +
            "\t\t\t\t\tgrid_coding\n" +
            "\t\t\t) a\n" +
            "\t\tGROUP BY\n" +
            "\t\t\ta.grid_coding\n" +
            "\t\tHAVING\n" +
            "\t\t\tcount(1) > 1\n" +
            "\t)\n" +
            "GROUP BY\n" +
            "\tgrid_coding,\n" +
            "\tgrid_manager_tel\n" +
            "ORDER BY grid_coding";
        if (pageNow&&pageSize){
            sql += " limit "+start+","+parseInt(pageSize);
        }

        var  sqlExt ="SELECT\n" +
            "\t*\n" +
            "FROM\n" +
            "\tgrid_manager_info\n" +
            "WHERE\n" +
            "\tgrid_coding IN (\n" +
            "\t\tSELECT\n" +
            "\t\t\tgrid_coding\n" +
            "\t\tFROM\n" +
            "\t\t\t(\n" +
            "\t\t\t\tSELECT\n" +
            "\t\t\t\t\t*\n" +
            "\t\t\t\tFROM\n" +
            "\t\t\t\t\tgrid_manager_info\n" +
            "\t\t\t\tWHERE\n" +
            "\t\t\t\t\tgrid_coding IS NOT NULL\n" +
            "\t\t\t\tGROUP BY\n" +
            "\t\t\t\t\tgrid_coding,\n" +
            "\t\t\t\t\tgrid_manager_tel\n" +
            "\t\t\t\tORDER BY\n" +
            "\t\t\t\t\tgrid_coding\n" +
            "\t\t\t) a\n" +
            "\t\tGROUP BY\n" +
            "\t\t\ta.grid_coding\n" +
            "\t\tHAVING\n" +
            "\t\t\tcount(1) > 1\n" +
            "\t)\n" +
            "GROUP BY\n" +
            "\tgrid_coding,\n" +
            "\tgrid_manager_tel\n" +
            "ORDER BY grid_coding";
        pool.query(sql,function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }else{
                pool.query(sqlExt,function (err, res) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }else{
                        console.log(result);
                        resolve(utils.returnMsg4EasyuiPaging(true, '0000', '分页查询成功。', result, res.length));

                    }
                });

            }
        });
    });
    return p;
};

/**
 * 创建excel文件(一个网格多个网格经理)
 */
exports.createExcelOrderList_misdata = function createExcelOrderList(data) {
    let list=data.rows;
    console.log(list);
    const headers = [
        '手机号码',
        '姓名',
        '工号',
        '网格编码',
        '网格名称',
        '区县编码',
        '区县名称',
        '地州编码',
        '地州名称',
        '城市编码',
        '城市名称',
    ];
    var data = [headers];
    list.map(c => {
        const tmp = [
            c.grid_manager_tel,
            c.grid_manager_name,
            c.grid_manager_id,
            c.channel_id,
            c.channel_name,
            c.grid_coding,
            c.grid_name,
            c.district_code,
            c.district_name,
            c.city_code,
            c.city_name,
        ]
        data.push(tmp);
    });
    var ws = {
        s: {
            "!row": [{wpx: 67}]
        }
    };
    ws['!cols'] = [{wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100},{wpx: 100},{wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100},{wpx: 100}];
    return xlsx.build([{name: 'Sheet1', data: data}], ws);
}


//网格经理-营业员同一工号不同手机号
exports.getJobNumberList= function(condition,pageNow,pageSize) {
    var p = new Promise(async function(resolve,reject){
        let start;
        if (pageNow&&pageSize){
            start =(parseInt(pageNow)-1)*parseInt(pageSize);
        }
        var  sql ="select *from (\n" +
            "SELECT\n" +
            "    a.grid_manager_id,a.grid_manager_name,\ta.grid_manager_tel,b.salesperson_name,b.salesperson_tel\n" +
            "FROM\n" +
            "\tgrid_manager_info a\n" +
            "LEFT JOIN salesperson_info b ON a.grid_manager_id = salesperson_id\n" +
            "GROUP BY\n" +
            "\ta.grid_manager_id\n" +
            ") a\n" +
            "where a.grid_manager_tel!=a.salesperson_tel";
        if (pageNow&&pageSize){
            sql += " limit "+start+","+parseInt(pageSize);
        }
        var  sqlExt ="select COUNT(*) as COUNT from (\n" +
            "            SELECT\n" +
            "        a.grid_manager_id,a.grid_manager_name,\ta.grid_manager_tel,b.salesperson_name,b.salesperson_tel\n" +
            "        FROM\n" +
            "        grid_manager_info a\n" +
            "        LEFT JOIN salesperson_info b ON a.grid_manager_id = salesperson_id\n" +
            "        GROUP BY\n" +
            "        a.grid_manager_id\n" +
            "    ) a\n" +
            "        where a.grid_manager_tel!=a.salesperson_tel";
        pool.query(sql,function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }else{
                pool.query(sqlExt,function (err, res) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }else{
                        console.log(result);
                        resolve(utils.returnMsg4EasyuiPaging(true, '0000', '分页查询成功。', result, res[0].COUNT));

                    }
                });
            }
        });
    });
    return p;
};

/**
 * 创建excel文件(网格经理-营业员同一工号不同手机号)
 */
exports.createExcelOrderList_jobNumber = function createExcelOrderList(data) {
    let list=data.rows;
    console.log(list);
    const headers = [
        '工号',
        '网格经理名字',
        '网格经理电话',
        '营业员姓名',
        '营业员手机号',
    ];
    var data = [headers];
    list.map(c => {
        const tmp = [
            c.grid_manager_id,
            c.grid_manager_name,
            c.grid_manager_tel,
            c.salesperson_name,
            c.salesperson_tel,
        ]
        data.push(tmp);
    });
    var ws = {
        s: {
            "!row": [{wpx: 67}]
        }
    };
    ws['!cols'] = [{wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100},{wpx: 100}];
    return xlsx.build([{name: 'Sheet1', data: data}], ws);
}

//厅经理-营业员同一渠道同一姓名不同手机号
exports.getMobilePhoneList= function(condition,pageNow,pageSize) {
    var p = new Promise(async function(resolve,reject){
        let start;
        if (pageNow&&pageSize){
            start =(parseInt(pageNow)-1)*parseInt(pageSize);
        }
        var  sql ="SELECT\n" +
            "\t*\n" +
            "FROM\n" +
            "\t(\n" +
            "\t\tSELECT\n" +
            "\t\t\ta.salesperson_id,\n" +
            "\t\t\ta.channel_id,\n" +
            "\t\t\ta.salesperson_name,\n" +
            "\t\t\ta.salesperson_tel,\n" +
            "\t\t\tb.hall_manager_name,\n" +
            "\t\t\tb.hall_manager_tel\n" +
            "\t\tFROM\n" +
            "\t\t\tsalesperson_info a\n" +
            "\t\tLEFT JOIN hall_manager_info b ON a.channel_id = b.channel_id\n" +
            "\t\tAND a.salesperson_name = b.hall_manager_name\n" +
            "\t\tWHERE\n" +
            "\t\t\ta.channel_id IS NOT NULL\n" +
            "\t\tAND a.salesperson_tel IS NOT NULL\n" +
            "\t) a\n" +
            "WHERE\n" +
            "\ta.salesperson_tel != a.hall_manager_tel";
        if (pageNow&&pageSize){
            sql += " limit "+start+","+parseInt(pageSize);
        }

        var  sqlExt="SELECT\n" +
            "\tCOUNT(*) AS COUNT\n" +
            "FROM\n" +
            "\t(\n" +
            "\t\tSELECT\n" +
            "\t\t\ta.salesperson_id,\n" +
            "\t\t\ta.channel_id,\n" +
            "\t\t\ta.salesperson_name,\n" +
            "\t\t\ta.salesperson_tel,\n" +
            "\t\t\tb.hall_manager_name,\n" +
            "\t\t\tb.hall_manager_tel\n" +
            "\t\tFROM\n" +
            "\t\t\tsalesperson_info a\n" +
            "\t\tLEFT JOIN hall_manager_info b ON a.channel_id = b.channel_id\n" +
            "\t\tAND a.salesperson_name = b.hall_manager_name\n" +
            "\t\tWHERE\n" +
            "\t\t\ta.channel_id IS NOT NULL\n" +
            "\t\tAND a.salesperson_tel IS NOT NULL\n" +
            "\t) a\n" +
            "WHERE\n" +
            "\ta.salesperson_tel != a.hall_manager_tel";
        pool.query(sql,function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }else{
                pool.query(sqlExt,function (err, res) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }else{
                        console.log(result);
                        resolve(utils.returnMsg4EasyuiPaging(true, '0000', '分页查询成功。', result, res[0].COUNT));

                    }
                });
            }
        });
    });
    return p;
};

/**
 * 创建excel文件(厅经理-营业员同一渠道同一姓名不同手机号)
 */
exports.createExcelOrderList_mobile = function createExcelOrderList(data) {
    let list=data.rows;
    console.log(list);
    const headers = [
        '工号',
        '渠道编码',
        '营业员姓名',
        '营业员手机号',
        '厅经理姓名',
        '厅经理手机号'
    ];
    var data = [headers];
    list.map(c => {
        const tmp = [
            c.salesperson_id,
            c.channel_id,
            c.salesperson_name,
            c.salesperson_tel,
            c.hall_manager_name,
            c.hall_manager_tel,
        ]
        data.push(tmp);
    });
    var ws = {
        s: {
            "!row": [{wpx: 67}]
        }
    };
    ws['!cols'] = [{wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100},{wpx: 100}];
    return xlsx.build([{name: 'Sheet1', data: data}], ws);
}

//网格经理工号为空
exports.getGridManagerList= function(condition,pageNow,pageSize) {
    var p = new Promise(async function(resolve,reject){
        let start;
        if (pageNow&&pageSize){
            start =(parseInt(pageNow)-1)*parseInt(pageSize);
        }
        var  sql ="SELECT * FROM grid_manager_info  WHERE  grid_manager_id IS NULL ";
        if (pageNow&&pageSize){
            sql += " limit "+start+","+parseInt(pageSize);
        }

        var  sqlExt ="SELECT count(1) AS count FROM grid_manager_info  WHERE  grid_manager_id IS NULL ";
        pool.query(sql,function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }else{
                pool.query(sqlExt,function (err, res) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }else{
                        console.log(result);
                        resolve(utils.returnMsg4EasyuiPaging(true, '0000', '分页查询成功。', result, res[0].count));

                    }
                });
            }
        });
    });
    return p;
};

/**
 * 创建excel文件(网格经理工号为空)
 */
exports.createExcelOrderList_gridManager = function createExcelOrderList(data) {
    let list=data.rows;
    console.log(list);
    const headers = [
        '手机号码',
        '姓名',
        '工号',
        '网格编码',
        '网格名称',
        '区县编码',
        '区县名称',
        '地州编码',
        '地州名称',
        '城市编码',
        '城市名称',

    ];
    var data = [headers];
    list.map(c => {
        const tmp = [
            c.grid_manager_tel,
            c.grid_manager_name,
            c.grid_manager_id,
            c.channel_id,
            c.channel_name,
            c.grid_coding,
            c.grid_name,
            c.district_code,
            c.district_name,
            c.city_code,
            c.city_name,
        ]
        data.push(tmp);
    });
    var ws = {
        s: {
            "!row": [{wpx: 67}]
        }
    };
    ws['!cols'] = [{wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 300},{wpx: 100},{wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}];
    return xlsx.build([{name: 'Sheet1', data: data}], ws);
}


//厅经理手机号为空
exports.gethallManagerInfoList= function(condition,pageNow,pageSize) {
    var p = new Promise(async function(resolve,reject){
        let start;
        if (pageNow&&pageSize){
            start =(parseInt(pageNow)-1)*parseInt(pageSize);
        }
        var  sql ="SELECT * FROM hall_manager_info WHERE hall_manager_tel IS NULL";
        if (pageNow&&pageSize){
            sql += " limit "+start+","+parseInt(pageSize);
        }
        var  sqlExt ="SELECT count(1) AS count FROM hall_manager_info WHERE hall_manager_tel IS NULL";
        pool.query(sql,function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }else{
                pool.query(sqlExt,function (err, res) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        return;
                    }else{
                        console.log(result);
                        resolve(utils.returnMsg4EasyuiPaging(true, '0000', '分页查询成功。', result, res[0].count));

                    }
                });
            }
        });
    });
    return p;
};

/**
 * 创建excel文件(厅经理手机号为空)
 */
exports.createExcelOrderList_hallManager = function createExcelOrderList(data) {
    let list=data.rows;
    console.log(list);
    const headers = [
        '手机号码',
        '姓名',
        '渠道编码',
        '渠道名称',
        '网格编码',
        '网格名称',
        '区县编码',
        '区县名称',
        '城市编码',
        '城市名称',

    ];
    var data = [headers];
    list.map(c => {
        const tmp = [
            c.hall_manager_tel,
            c.hall_manager_name,
            c.channel_id,
            c.channel_name,
            c.grid_coding,
            c.grid_name,
            c.district_code,
            c.district_name,
            c.city_code,
            c.city_name,
        ]
        data.push(tmp);
    });
    var ws = {
        s: {
            "!row": [{wpx: 67}]
        }
    };
    ws['!cols'] = [{wpx: 100},{wpx: 100}, {wpx: 100}, {wpx: 300}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}];
    return xlsx.build([{name: 'Sheet1', data: data}], ws);
}