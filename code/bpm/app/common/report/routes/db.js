var express = require('express');
var router = express.Router();

var mysqlAdapter = require("../utils/MySQLAdapter");
var msSqlAdapter = require("../utils/MSSQLAdapter");
var FirebirdAdapter = require("../utils/FirebirdAdapter");
var PostgreSQLAdapter = require("../utils/PostgreSQLAdapter");

var memcached_utils = require('gmdp').init_gmdp.core_memcached_utils;

router.post('/', function(req, res, next) {
  var dbPath = req.query.dbpath;//保存字典名称
  var dbString ="";

  var body = JSON.stringify(req.body);
    memcached_utils.getDict(function (m, g) {

      var dicDb = g.common_db_connect_info;
      if(dicDb==null||dicDb.length==0){
        alert("获取数据库连接参数失败");
        return;
      }
      for(var i =0;i<dicDb.length;i++){
        var dic = dicDb[i];
        var tempText = dic.text;
        if(tempText == dbPath){
          dbString = dic.id;
          break;
        }
      }

      var commond = JSON.parse(body);


      //替换数据库连接信息
      commond.connectionString = dbString;

      var dbName = "";
      var paras = dbString.split(";");

      paras.forEach(function(para) {

        var mykeys = para.split("=");

        if(mykeys.length>=2)
        {

          if(mykeys[0].trim() == 'Database'){

            dbName = mykeys[1].trim();
          }
        }

      });

      //处理SQL语句
      if(commond.queryString){

        //适配MYSQL无法获取数据库表结构，其他Oracle 等都需要类似的处理
        if(  commond.queryString =='SELECT TABLE_NAME, TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = \'\'' ){

          commond.queryString = commond.queryString.replace("''","'"+dbName+"'");

        }


        //处理内置参数，如用户编号，所属地区等信息
        var vcity = "852" ;
        commond.queryString = commond.queryString.replace("$city_id",vcity);
        commond.queryString = commond.queryString.replace("$org_id",vcity);

      }


      console.log(commond);

      if(commond.database == 'MS SQL'){
        msSqlAdapter.process(commond,function (result){
          // console.log(result);

          res.send(result);
        } );
      }
      else if(commond.database == 'MySQL'){
        mysqlAdapter.process(commond,function (result){
          res.send(result);
          console.log('end');
        } );
      }
      else if(commond.database == 'Firebird'){
        FirebirdAdapter.process(commond,function (result){
          // console.log(result);

          res.send(result);

          console.log('end');
        } );
      }else if(commond.database == 'PostgreSQL'){
        PostgreSQLAdapter.process(commond,function (result){
          // console.log(result);

          res.send(result);
        } );
      }

    });

});

module.exports = router;
