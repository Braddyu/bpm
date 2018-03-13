var model_org=require("../models/user_model");
var Promise=require("bluebird");
var utils = require('../../../../lib/utils/app_utils');
var mysql_pool=require("../../../../lib/mysql_pool");
var mysql_pool_promise=require("../../../../lib/mysql_pool_athena_promise");
var fs = require('fs');
var config = require('../../../../config');

var org_sync_data_from_Athena_url = config.org_sync_data_from_Athena_url;

exports.sync_data_from_Athena=function(){
    sync_data_from_Athena ();
}

 //sync_data_from_Athena();

async function sync_data_from_Athena(){
       await update_country_data();
       await update_grid_data();
      await update_channel_data();
}


/**
 * 更新区县编码为雅典娜的编码
 * @returns {bluebird}
 */
function update_country_data(){
    return new Promise(async(resolve,reject)=>{
        let sql = "SELECT "+
            "   areacode, "+
            "   areadesc "+
            " FROM "+
            " common_region_info "+
            " WHERE "+
            " areatype = '2' "+
            "  AND is_regular_area = '1' "+
            " AND `status` = '1'";//3网格
        let condition ={};
        let result =await mysql_pool_promise.queryPromise(sql,condition);
        if(!result){
            console.log("获取mysql区县数据总数失败");
        }else {
            console.log(result);
            for(let i=0;i<result.length;i++){
                var porgname = result[i].areadesc.replace("(县级名)","").replace("县","").replace("市","").replace("特区","").replace("区","").replace("公司","").replace("自治","");
                var orgname = new RegExp(porgname);
                var parm = {"org_name":orgname,"level" : 4};
                await model_org.$CommonCoreOrg.find(parm,function (err,resp) {
                    if (resp.length > 0) {
                        let updates = {$set: {"company_code":result[i].areacode,"org_type":"区县"}};
                        let options ={};
                        //更新本身
                        model_org.$CommonCoreOrg.update( {"_id":resp[0]._id},updates,options,function(err,updateRes){
                            console.log("更新结果："+JSON.stringify(updateRes));
                            if(i==result.length-1){
                                resolve();
                                console.log("=================================区县数据处理结束==============================");
                            }

                        });
                    }
                })

            }


        }
    });
}

/**
 *  从雅典娜更新网格数据到工单系统
 * @returns {bluebird|exports|module.exports}
 */
function update_grid_data(){
    return new Promise(async(resolve,reject)=>{
        let sql = "SELECT "+
            "a.areacode orgcode, "+
            "a.areadesc orgname, "+
            "b.areacode p_orgcode, "+
            "b.areadesc p_orgname,a.areatype orgtype"+
            " FROM "+
            "common_region_info a "+
            " LEFT JOIN common_region_info b ON a.parentarea = b.areacode "+
            " WHERE "+
            "a.areatype = '3' "+
            " AND a.is_regular_area = '1' AND a.`status` = '1' ";//3网格
        let condition ={};
        let result =await mysql_pool_promise.queryPromise(sql,condition);
            if(!result){
                console.log("获取mysql网格数据总数失败");
            }else {
                console.log(result);
                getAthenaGrid(result,resolve);
                resolve();
                console.log("=================================网格数据处理结束==============================");
            }
    });
}

/**
 *  从雅典娜更新渠道数据到工单系统
 * @returns {bluebird|exports|module.exports}
 */
function update_channel_data(){
    return new Promise(async(resolve,reject)=>{
        let sql = "select t.grid_code as p_orgcode,"+
            " t.channel_id as orgcode,"+
            " '' as orgpath,"+
            " t.channel_name as orgname,"+
            " 4 as orgtype,"+
            "1 as orgorder,"+
            "t.status as status "+
            "from channel2_develop_baseinfo t"+
            " where t.status =1"//4渠道
        let condition ={};
        let result =await mysql_pool_promise.queryPromise(sql,condition);
        if(!result){
            console.log("获取mysql渠道数据总数失败");
        }else {
            console.log(result);
            getAthenaGrid(result,resolve);
            resolve();
            console.log("=================================渠道数据处理结束==============================");
        }
    });
}

function getAthenaGrid(result){
    let j=0;
    let k=0;
    for(let i in result){
        model_org.$CommonCoreOrg.find({"company_code": result[i].orgcode},function(err,res) {
           // console.log(result[i]);
            if (res) {
                if(res.length>0) {
                    //获取网格数据

                    var level = 4;
                    var parm = {};
                    let org_type="";
                    if(result[i].orgtype==3){
                     console.log("获取网格数据父节点名称："+result[i].p_orgname);
                        // var porgname = result[i].p_orgname.replace("县公司","").replace("市公司","").replace("特区公司","").replace("区公司","").replace("自治","").replace("苗族布依族","").replace("布依族苗族","");
                         var porgname = result[i].p_orgname.replace("(县级名)","").replace("县","").replace("市","").replace("特区","").replace("区","").replace("公司","").replace("自治","");

                        var orgname = new RegExp(porgname);
                        parm = {"org_name":orgname,"level" : level};
                        org_type="网格";
                    }
                    if(result[i].orgtype==4){
                        level=5;
                        parm = {"company_code":result[i].p_orgcode};
                        org_type="渠道";
                    }
                    model_org.$CommonCoreOrg.find(parm,function (err,resp) {
                        console.log("find parent over:"+resp);
                        if (resp) {//获取区县名与网格数据相等的对应区县
                            if (resp.length == 1) {
                                let options ={};
                                //更新本身
                                model_org.$CommonCoreOrg.update( {"company_code": res[0].company_code},{$set: {"org_pid":resp[0]._id,"org_type":org_type}},options,function(err,updateRes){
                                    console.log("更新结果："+JSON.stringify(updateRes));
                                    if(updateRes){
                                        j++;
                                        console.log("更新网格数据成功 j = "+j);
                                        console.log("添加网格数据成功 k = "+k);
                                    }else{
                                        console.log("更新网格数据失败");
                                    }
                                });


                            } else{
                                //名称对应不上的数据,直接写入c盘
                                console.log("名称对应不上的数据,直接写入指定盘");
                                writeFile(org_sync_data_from_Athena_url+"\\file_updata_"+result[i].p_orgname+"_"+result[i].orgcode+".txt",JSON.stringify(result[i]));
                            }
                        } else {
                            console.log(err);
                        }
                    })
                }else{//网格没有的数据进行插入
                     saveGrid(result[i]);
                     k++;
                }
            } else {
                console.log(err)
            }
        })
    };
}

/**
 * 保存没有的网格与渠道数据
 * @param mysqlData
 */
function saveGrid(mysqlData){
    var  inst={};
    var level = 4;
    var parm = {};
    let org_type="";
  if(mysqlData.orgtype==3){
        // var porgname =mysqlData.p_orgname.replace("县公司","").replace("市公司","").replace("特区公司","").replace("区公司","").replace("自治","").replace("苗族布依族","").replace("布依族苗族","");
        var porgname = mysqlData.p_orgname.replace("(县级名)","").replace("县","").replace("市","").replace("特区","").replace("区","").replace("公司","").replace("自治","");

        var orgname = new RegExp(porgname);
        parm = {"org_name":orgname,"level" : level};
        org_type="网格";
    }
    if(mysqlData.orgtype==4){
        level=5;
        parm = {"company_code":mysqlData.p_orgcode};
        org_type="渠道";
    }
    model_org.$CommonCoreOrg.find(parm,function (err,resp) {
        console.log("saveGrid find parent over:"+resp);
        if (resp) {
            //获取区县名与网格数据相等的对应区县
            if (resp.length > 0) {
                console.log("saveGrid 写入对应父节点id");
                inst.org_pid =  resp[0]._id;// 机构父节点
            } else {//名称对应不上的数据,直接写入e盘
                inst.org_pid =  "";// 机构父节点
                console.log("saveGrid 名称对应不上的数据,直接写入指定盘");
                writeFile(org_sync_data_from_Athena_url+"\\file_add_"+mysqlData.p_orgname+"_"+mysqlData.orgcode+".txt",JSON.stringify(mysqlData));
            }
            // inst.org_code_desc = mysqlData.orgpath;// 机构编号
            inst.org_name = mysqlData.orgname;// 机构名
            inst.org_fullname = mysqlData.orgname;// 机构全名
            inst.company_code =  mysqlData.orgcode;// 公司编号
            if(mysqlData.orgtype==3){
                inst.level= 5;//网格
            }
            else if(mysqlData.orgtype == 4){
                inst.level= 6;//渠道
            }
            // inst.org_order =  mysqlData.orgorder;// 排序号
            inst.org_type =  org_type;// 机构类型
            inst.company_no= "";//empid
            inst.parentcode_desc =  "";// 机构父节点描述
            inst.org_status =  "1";// 机构状态
            inst.org_belong =  "";// 属于
            inst.midifytime =  new Date();// 修改时间
            inst.org_code =  "";// 机构编号
            inst.childCount =  "";// 子机构数
            inst.smart_visual_sys_org_id= "";//慧眼系统的org_id
            inst.athena_sys_org_id= "";//Athena系统的org_id
            inst.athena_app_sys_org_id="";
            var arr = [];
            arr.push(inst);
            console.log("saveGrid 插入实体："+JSON.stringify(arr));
            //插入mql有的mongo没有的网格和渠道数据
            model_org.$CommonCoreOrg.create(arr,function(error,rs){
                if(error){
                    console.log("添加网格数据失败");
                }else{
                    console.log("添加网格数据成功");
                }
            });


        }


    });
}


function writeFile(file,result){
    fs.writeFile(file, result, function(err){
        if(err)
            console.log("fail " + err);
        else {
            console.log("写入文件ok");
            // fs.close();
        }
    })
}
