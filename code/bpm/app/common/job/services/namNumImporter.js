/**
 * Created by Administrator on 2017/09/26.
 * 实名违规 文件导入 定时调度
 */
var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/core/utils/mysql_util');
var async=require("async");

//ftp读取文件列表并保持到本地工具
var ftpUtil = require('../utils/ftpUtil');
//文件内容读取工具
var textReader = require('../utils/text_data_reader');
//数据过滤器
var dataFilter = require('../utils/data_filter');

// 使用连接池，提升性能
var ywcj_pool =mysql.createPool($util.extend({}, config.mysql));

//是否批量插入 ，默认为true
var batchAdd = false;

/*将数据插入数据库
* 第一步：读取本地文件 封装成为 List<String[]>
* 第二步：调用过滤器对 List<String[]> 数据进行过滤
* 第三步：将过滤后的数据插入本地数据库
* */
function insertDb(fileName,connectionProperties){
    var date=new Date();
    var currDate=date.getFullYear()+"-"+("0"+(date.getMonth()+1)).slice(-2)+"-"+date.getDate();
    //根据filePath 读取到文件内容，并返回数据集合List<String[]>
    textReader.readForNamNum(fileName,connectionProperties,function(dataList,connectionProperties){
        //过滤获取到的文件内容集合
        if(dataList){
            if(connectionProperties.flag==4){
                dataList=dataFilter.doFilterForNamNum4(currDate,dataList);
            }else{
                dataList=dataFilter.doFilterForNamNum1_3(currDate,dataList);
            }

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
                        ftpUtil.renameFileOnFail1(connectionProperties,fileName,ftpUtil.errType.IMPORTDATA_ERROR);
                    } else {
                        connection.beginTransaction(function(err){
                            if(err){
                                console.log(err.message);
                                ftpUtil.renameFileOnFail1(connectionProperties,fileName,ftpUtil.errType.IMPORTDATA_ERROR);
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
                                async.series(funs,function(err,result){
                                    /*如果出现错误，就回滚。若无错误则提交。提交出现错误，也回滚*/
                                    if(err){
                                        connection.rollback(function(){ });
                                        ftpUtil.renameFileOnFail1(connectionProperties,fileName,ftpUtil.errType.IMPORTDATA_ERROR);
                                    }else{
                                        connection.commit(function(errc){
                                            if(errc){
                                                connection.rollback(function(){ });
                                                err=errc;
                                            }else{
                                                console.log("实名违规任务调度数据插入提交成功了");
                                                console.log(currDate + filePath + " 导入完成，共导入成功"+j+"条数据.");
                                                //成功后，移动ftp 当前文件
                                                ftpUtil.renameFileOnSuccess1(connectionProperties,fileName);
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
    console.log('START--------------------------实名违规 文件导入 定时调度-------------------------------');
    //调用ftp连接工具，获取到指定文件内容数据
    ftpUtil.readFtpFileData(config.sftpUtil1,insertDb);
    ftpUtil.readFtpFileData(config.sftpUtil2,insertDb);
    ftpUtil.readFtpFileData(config.sftpUtil3,insertDb);
    ftpUtil.readFtpFileData(config.sftpUtil4,insertDb);
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
   switch (connectionProperties.flag){
       case 1:
           valuesSql="insert into ywcj_workbench_audit(warning_type,describes,remarks,category,pro_status,warning_time) values (";
           valuesSql+="'实名违规',";
           valuesSql+="'同一身份证办理了5个以上(不含5个)手机号',";
           valuesSql+="'"+values[0]+"',";
           valuesSql+="'"+1+"',";
           valuesSql+="'"+0+"',";
           valuesSql+="'"+values[1]+"'";
           valuesSql+=")";
           break;
       case 2:
           valuesSql="insert into ywcj_workbench_audit(warning_type,describes,remarks,category,pro_status,warning_time) values (";
           valuesSql+="'实名违规',";
           valuesSql+="'非贵州身份证办理贵州移动号码',";
           valuesSql+="'"+values[0]+"',";
           valuesSql+="'"+1+"',";
           valuesSql+="'"+0+"',";
           valuesSql+="'"+values[1]+"'";
           valuesSql+=")";
           break;
       case 3:
           valuesSql="insert into ywcj_workbench_audit(warning_type,describes,remarks,category,pro_status,warning_time) values(";
           valuesSql+="'非二代身份证入网',";
           valuesSql+="'非身份证入网',";
           valuesSql+="'"+values[0]+"',";
           valuesSql+="'"+1+"',";
           valuesSql+="'"+0+"',";
           valuesSql+="'"+values[1]+"'";
           valuesSql+=")";
           break;
       case 4:
           valuesSql="insert into ywcj_workbench_audit(warning_type,describes,remarks,category,pro_status,warning_time) values(";
           valuesSql+="'工号异常',";
           valuesSql+="'"+values[2]+"',";
           valuesSql+="'"+values[0]+"',";
           valuesSql+="'"+3+"',";
           valuesSql+="'"+0+"',";
           valuesSql+="'"+values[1]+"'";
           valuesSql+=") ";
           break;
   }
    return valuesSql;
}
