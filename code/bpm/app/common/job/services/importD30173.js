/**
 * Created by sx on 2017/9/28.
 */
var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/core/utils/mysql_util');
var async= require("async");
//ftp读取文件列表并保持到本地工具
var ftpUtil = require('../utils/ftpUtil');
//文件内容读取工具
var textReader = require('../utils/text_data_reader');
// 使用连接池，提升性能
var ywcj_pool =mysql.createPool($util.extend({}, config.mysql));


/*
 1.获取目录下的所有文件名
 2.取出D31073.AVL文件
 3.读取D30173文件内容，封装为List<String[]>
 4.数据过滤，对源数据进行过滤，每个地市每个类型汇总成一条数据List<String[]>
 5.构建批量sql，导入数据库
 */
function insertDb(fileName,connectionProperties){
    var date=new Date();
    //   /appdata/channel/YwjhData/zdyw/D30173_999_00120170630000001.AVL
    //var nameArr = filePath.split("/");
    //var fileName = nameArr[6];
    var currDate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    //根据filePath 读取到文件内容，并返回数据集合List<String[]>
    textReader.readForNamNum(fileName,connectionProperties,function(dataList,connectionProperties){
        //过滤获取到的文件内容集合
        if(dataList){
            dataList = doFilterD30173(dataList);
        }
        if(!dataList){
            console.log(currDate + fileName + " 导入完成，共导入成功0条数据.");
        }else{
            //将文件中的地市转换为数据库中的标准名称，方便关联查询
            var cityList = ['贵阳','贵安','黔西南','黔东南','黔南','六盘水','遵义','安顺','毕节','铜仁'];
            //单条插入
            var sqlList = sqlBuilder(fileName,cityList,dataList,connectionProperties);
            ywcj_pool.getConnection(function (err, connection) {
                if (err != null) {
                    console.log("获取数据库连接失败" + err);
                    ftpUtil.renameFileOnFail1(connectionProperties,fileName,"写入数据错误-获取数据库连接失败");
                } else {
                    connection.beginTransaction(function(err){
                        if(err){
                            console.log(err.message);
                            ftpUtil.renameFileOnFail1(connectionProperties,fileName,"写入数据错误-开启事务失败");
                        }else{
                            var funs={};
                            var i=0;
                            var j=0;
                            for(;i<sqlList.length;i++){
                                funs["fn"+i]=function(done){
                                    var currSql=sqlList[j++];
                                    connection.query(currSql, function (err, result) {
                                        done(err,"");
                                    });
                                };
                            }
                            async.series(funs,function(){
                                /*如果出现错误，就回滚。若无错误则提交。提交出现错误，也回滚*/
                                if(err){
                                    connection.rollback(function(){ });
                                    ftpUtil.renameFileOnFail1(connectionProperties,fileName,"写入数据错误");

                                }else{
                                    connection.commit(function(errc){
                                        if(errc){
                                             //导入文件失败后对文件进行重命名操作(移动文件到error目录)
                                             ftpUtil.renameFileOnFail1(connectionProperties,fileName);
                                            //回滚
                                            connection.rollback(function(){});
                                            err=errc;
                                            console.log(err);
                                        }else{
                                            console.log("D31073文件导入提交成功了");
                                             //导入成功后对文件进行重命名操作(移动文件到success目录)
                                             ftpUtil.renameFileOnSuccess1(connectionProperties,fileName);

                                             //原始数据插入完成后执行的操作，插入完成后根据地市名称更新地市编码(areaCode)字段
                                             updateAreaCode(fileName);
                                        }
                                    });
                                }
                                //释放数据库连接
                                connection.release();
                            });
                        }
                    });
                }
            });
        }
    });
}




//插入完成后根据地市名称更新地市编码(areaCode)字段
function updateAreaCode(fileName){
    //从文件名中取出年月日，D30173_999_00120170630000001.AVL
    var month = fileName.substring(14,22);
    var sql = "update ywjh_resources_audit t set areaCode = "
    sql += "(select areacode from common_region_info where areatype = 1 and short_name = t.area) "
    sql += "where day = ";
    sql =+ "'" + month + "'";

}


//2.取出D31073.AVL文件 sourceList
//3.读取D30173文件内容，封装为List<String[]>
//4.数据过滤，对源数据进行过滤，每个地市每个类型汇总成一条数据List<String[]>
function doFilterD30173(sourceList){
    var data = [];
    //过滤每个地市每个类型汇总为一条数据
    if(sourceList){
        console.log(sourceList);
        for(var i=0;i<sourceList.length;i++){
            var pojoList = sourceList[i];
            var tmplist=pojoList.toString().split("\t");

            var single = {};
            // 每个地市每个类型汇总成一条数据对象
            single.city = tmplist[0];
            single.type = tmplist[1];
            single.comesCount = tmplist[3];
            single.salesCount = tmplist[4];
            single.stockCount = tmplist[5];

            data.push(single);

        }
    }
    return data;
}


//构建批量插入sql
function sqlBuilder(fileName,cityList,dataList,connectionProperties){
    var sqlList=[];
    for(var i=0;i<dataList.length;i++){
        var dataItem=dataList[i];
        //每个对象生成sql
        sqlList.push(buildSqlValuesPard(fileName,cityList,dataItem,connectionProperties));
    }
    return sqlList;
}


function buildSqlValuesPard(fileName,cityList,dataItem,connectionProperties){
    //D30173_999_00120170630000001.AVL
    // month,parentAreaCode,area,level,type,name,comesCount,salesCount,stockCount
    //安顺	魔百和	魔百和测试	10	0	10
    var valuesSql="insert into temp_ywjh_resources_audit(day,parentAreaCode,area,level,type,name,comesCount,salesCount,stockCount) values (";
    // month 日期
    var month = fileName.substring(14,22);
    var parentAreaCode = "GUIZ";
    var area = dataItem.city;
    var level = 2;
    var type = "终端类产品";
    var name = dataItem.type;
    var comesCount = dataItem.comesCount;
    var salesCount = dataItem.salesCount;
    var stockCount = dataItem.stockCount;

    //var param = getParam(dataItem);
    //var name = param.name;
    //var comesCount = param.comesCount;
    //var salesCount = param.salesCount;
    //var stockCount = param.stockCount;

    valuesSql +="'"+ month + "','" + parentAreaCode + "','" + area + "','" + level + "','" + type + "','" + name + "','" + comesCount + "','" + salesCount + "','" + stockCount+"'" ;
    valuesSql += ") "

    return valuesSql;
}

//获取name,comesCount,salesCount,stockCount
function getParam(dataItem){
    for(var i=0;i<dataItem.length;i++){
        var pojo = dataItem[i];
        var param = {};
        param.name = pojo[1];
        param.comesCount= pojo[3];
        param.salesCount= pojo[4];
        param.stockCount= pojo[5];
        return param;
    }
}




//比对获取地市名称
function getcityName(cityList,dataItem){
    //dataItem单个对象数组
    var city;
    for(var j=0;j<cityList.length;j++){
        if(city == dataItem.city){
            return city;
        }
    }

    /* for(var i=0;i<dataItem.length;i++){
     var pojo = dataItem[i];
     var city = pojo[0];
     for(var j=0;j<cityList.length;j++){
     if(city == cityList[j]){
     return city;
     }
     }
     }*/
}


//查询贵州地市名称
function getCityList(){
    ywcj_pool.getConnection(function (err, connection) {
        if (err != null) {
            console.log(err.message);
            cb("获取数据库连接失败");
        } else {
            var sql = "select short_name from common_region_info where areatype = 1";
            console.log("======sql======" + sql);
            connection.query(sql, function (err, result) {
                console.log("======result======" + result)
                connection.release();
                return result;
            });
        }
    });
}


//第一步，获取D31073文件
exports.importD30173 = function () {
    console.log('START--------------------------D30173 文件导入 定时调度-------------------------------');
    //调用ftp连接工具，获取到指定文件内容数据
    ftpUtil.readFtpFileData(config.ftpUtilD30173,insertDb);
};


