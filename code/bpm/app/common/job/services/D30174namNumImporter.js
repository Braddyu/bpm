/**
 * Created by Administrator on 2017/09/26.
 * 文件导入 定时调度
 */
var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/core/utils/mysql_util');
//ftp读取文件列表并保持到本地工具
var ftpUtil = require('../utils/D30174ftpUtil');
//文件内容读取工具
var textReader = require('../utils/D30174text_data_reader');
//数据过滤器
var dataFilter = require('../utils/D30174data_filter');

// 使用连接池，提升性能
var ywcj_pool =mysql.createPool($util.extend({}, config.mysql));
var async =require('async');
//是否批量插入 ，默认为true
var batchAdd = false;

/*将数据插入数据库
* 第一步：读取本地文件 封装成为 List<String[]>
* 第二步：调用过滤器对 List<String[]> 数据进行过滤
* 第三步：将过滤后的数据插入本地数据库
* */
function insertDb(filePath,connectionProperties,ftpPath,fileName){
    //var date=new Date();
    //var currDate=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    //根据filePath 读取到文件内容，并返回数据集合List<String[]>
    textReader.read(filePath,connectionProperties.charset,function(dataList){
        //过滤获取到的文件内容集合
        if(dataList){
            dataList=dataFilter.doFilter(dataList);
        }
        if(!dataList){
            console.log(currDate + filePath + " 导入完成，共导入成功0条数据.");
        }else{
            if(batchAdd){
                //批量插入

            }else{
                //单条插入
                var sqlList=sqlBuilder(dataList,connectionProperties);
                ywcj_pool.getConnection(function (err, connection) {
                    if (err != null) {
                        console.log("获取数据库连接失败" + err);
                    } else {
                        connection.beginTransaction(function(err){
                            if(err){
                                console.log(err.message);
                            }else{
                                var funs={};
                                var i=0;
                                var j=0;
                                for(;i<sqlList.length;i++){
                                    funs["fn"+i]=function(done){
                                        var currSql=sqlList[j++];
                                        //console.log(currSql);
                                        connection.query(currSql, function (err, result) {
                                            done(err,"");
                                        });
                                    };
                                }
                                async.series(funs,function(){
                                    /*如果出现错误，就回滚。若无错误则提交。提交出现错误，也回滚*/
                                    if(err){
                                        connection.rollback(function(){ });
                                    }else{
                                        connection.commit(function(errc){
                                            if(errc){
                                                ftpUtil.rename(ftpPath+fileName,ftpPath,"error/",fileName,connectionProperties);
                                                connection.rollback(function(){ });
                                                err=errc;
                                            }else{
                                                ftpUtil.rename(ftpPath+fileName,ftpPath+"success/",fileName,connectionProperties);
                                                console.log("提交成功了");
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
        }
    });
}


exports.namNumImporter = function () {
    console.log('START--------------------------定时调度-------------------------------');
    //调用ftp连接工具，获取到指定文件内容数据
    ftpUtil.readFtpFileData(config.ftpUtil1,insertDb);
};


function sqlBuilder(dataList,connectionProperties){
    var sqlList=[];
    for(var i=0;i<dataList.length;i++){
        var dataItem=dataList[i];
        sqlList.push(buildSqlValuesPard(dataItem,connectionProperties));
    }
    return sqlList;
}

function buildSqlValuesPard(values,connectionProperties){
    var valuesSql="";
           valuesSql="insert into aaaywcj_work_audit(warning_type,describes,remarks,category,pro_status,warning_time) values (";
           valuesSql+="'"+getWarningType(values[20])+"','";
           valuesSql+=values[20]+"-"+values[18]+"','";
           valuesSql+=remarkFormat(values)+"','";
           valuesSql+=2+"','";
           valuesSql+=0+"','";
           valuesSql+=values[0]+"'";
           valuesSql+=")";
    return valuesSql;
}
var WARNING_TYPS = [ "新增放号", "4G套餐", "终端销售", "行卡办理增值业务"] ;
function getWarningType(value){
    for (var i;i<WARNING_TYPS.length;i++) {
        if (value.startsWith(type)) {
            return type;
        }
    }
    return value;
}
function remarkFormat(values){
    var cc=values[14] + " - " + values[18] + " - " + values[20]
    var builder = "";
    builder+="<tr>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">操作时间：</td><td width=\"20%%\">"+values[0]+"</td>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">地市：</td><td width=\"20%%\">"+values[2]+"</td>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">区县：</td><td width=\"20%%\">"+values[4]+"</td>\n";
    builder+="</tr>\n";
    builder+="<tr>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">网格：</td><td width=\"20%%\">"+values[6]+"</td>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">渠道编码：</td><td width=\"20%%\">"+values[7]+"</td>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">渠道名称：</td><td width=\"20%%\">,"+values[8]+"</td>\n";
    builder+="</tr>\n";
    builder+="<tr>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">操作工号：</td><td width=\"20%%\">"+values[11]+"</td>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">操作人：</td><td width=\"20%%\">"+values[12]+"</td>\n";
    builder+="    <td class=\"info widget-caption themeprimary\" width=\"13%%\" style=\"vertical-align:middle;\">操作内容：</td><td width=\"20%%\">"+cc+"</td>\n";
    builder+="</tr>\n";
    return builder;
}



