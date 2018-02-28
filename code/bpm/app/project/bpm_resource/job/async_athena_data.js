var model_org=require("../models/user_model");
var Promise=require("bluebird");
var utils = require('../../../../lib/utils/app_utils');
var mysql_pool=require("../../../../lib/mysql_pool");
var mysql_pool_promise=require("../../../../lib/mysql_pool_athena_promise");
var fs = require('fs');

//exports.sync_data_from_Athena=function(){
//    sync_data_from_Athena ();
//}
//
//sync_data_from_Athena();
//
//async function sync_data_from_Athena(){
//    await update_grid_data();
//}

/**
 *  从雅典娜更新网格与渠道数据到工单系统
 * @returns {bluebird|exports|module.exports}
 */
function update_grid_data(){
    return new Promise(async(resolve,reject)=>{
        let sql = "select parent.orgcode as p_orgcode,"+
        "parent.orgname as p_orgname,"+
        " child.orgcode as orgcode,"+
        " child.orgpath as orgpath,"+
        " child.orgname as orgname,"+
        " child.orgtype as orgtype,"+
        "child.orgorder as orgorder,"+
        "child.status as status "+
        "from common_org_info child"+
        " LEFT JOIN common_org_info parent on parent.orgid = child.superorgid where child.orgtype in(3,4) order by child.orgid"//3网格  4渠道
        let condition ={};
        let result =await mysql_pool_promise.queryPromise(sql,condition);
            if(!result){
                console.log("获取mysql网格数据总数失败");
            }else {
                console.log(result);
                getAthenaGrid(result,resolve);
                console.log("获取mysql网格数据总数成功");
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
                if(res.length>0) {//获取网格数据
                    console.log("获取网格数据父节点名称："+result[i].p_orgname);
                    model_org.$CommonCoreOrg.find({"org_name": result[i].p_orgname},function (err,resp) {
                        console.log("find parent over:"+resp);
                        if (resp) {//获取区县名与网格数据相等的对应区县
                            if (resp.length > 0) {
                                //let condition = {"company_code": result[i].orgcode};
                                let updates = {$set: {"org_pid":resp[0]._id}};
                                console.log("更新条件:"+  res[0].company_code);
                                console.log("更新参数:"+updates.$set.org_pid);
                                let options ={};
                                model_org.$CommonCoreOrg.update( {"company_code": res[0].company_code},{$set: {"org_pid":resp[0]._id}},options,function(err,updateRes){
                                    console.log("更新结果："+JSON.stringify(updateRes));
                                    if(updateRes){
                                        j++;
                                        console.log("更新网格数据成功 j = "+j);
                                        console.log("添加网格数据成功 k = "+k);
                                    }else{
                                        console.log("更新网格数据失败");
                                    }
                                });
                            } else {//名称对应不上的数据,直接写入c盘
                                console.log("名称对应不上的数据,直接写入指定盘");
                                writeFile("e:\\file_"+result[i].orgcode+".txt",JSON.stringify(result[i]));
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
    model_org.$CommonCoreOrg.find({"org_name": mysqlData.p_orgname},function (err,resp) {
        console.log("saveGrid find parent over:"+resp);
        if (resp) {//获取区县名与网格数据相等的对应区县
            if (resp.length > 0) {
                console.log("saveGrid 写入对应父节点id");
                inst.org_pid =  resp[0]._id;// 机构父节点

            } else {//名称对应不上的数据,直接写入e盘
                inst.org_pid =  "";// 机构父节点
                console.log("saveGrid 名称对应不上的数据,直接写入指定盘");
                writeFile("e:\\file_"+mysqlData.orgcode+".txt",JSON.stringify(mysqlData));
            }
        }

               inst.org_code_desc = mysqlData.orgpath;// 机构编号
                inst.org_name = mysqlData.orgname;// 机构名
                inst.org_fullname = mysqlData.orgname;// 机构全名
                inst.company_code =  mysqlData.orgcode;// 公司编号
                if(mysqlData.orgtype==3){
                    inst.level= 5;//网格
                }
                else if(mysqlData.orgtype == 4){
                    inst.level= 6;//渠道
                }
                inst.org_order =  mysqlData.orgorder;// 排序号
                inst.org_type =  "";// 机构类型
                inst.company_no= "";//empid
                inst.parentcode_desc =  "";// 机构父节点描述
                inst.org_status =  mysqlData.status;// 机构状态
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
