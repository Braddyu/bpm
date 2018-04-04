var model_org=require("../models/user_model");
var Promise=require("bluebird");
var utils = require('../../../../lib/utils/app_utils');
var mysql_pool=require("../../../../lib/mysql_pool");
var mysql_pool_promise=require("../../../../lib/mysql_pool_peason_athena_promise");
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;
var config = require('../../../../config');

var peson_sync_data_from_Athena_url = config.peson_sync_data_from_Athena_url;

exports.sync_data_from_Athena=function(){
    sync_data_from_Athena ();
}

//sync_data_from_Athena();

function sync_data_from_Athena(){
    update_hall_manager_data();//网格经理
}



/**
 *  从雅典娜更新人员数据
 * @returns {bluebird|exports|module.exports}   hall_manager_info
 */
function update_hall_manager_data(){
    return new Promise(async(resolve,reject)=>{
        let sql = "select t1.id,t1.phone,t1.name,group_concat(t1.orgId) orgIds,group_concat(t1.roleId) roleIds from("
        +" select TRIM(t.salesperson_tel) phone,t.salesperson_name name,t.salesperson_id id,t.channel_id orgId,'5a26418c5eb3fe1068448753' roleId from salesperson_info t"
        +" UNION ALL"
        +" select TRIM(t.hall_manager_tel) phone,t.hall_manager_name name,'' id,t.channel_id orgId,'5a266868bfb42d1e9cdd5c6e' roleId from hall_manager_info t"
        +" UNION ALL"
        +" select TRIM(t.grid_manager_tel) phone,t.grid_manager_name name,t.grid_manager_id id,t.grid_coding orgId,'5a264057c819ed211853907a' roleId from grid_manager_info t group by phone,orgId"
        +" )t1 group by t1.phone,t1.name";
        let condition ={};
        let result =await mysql_pool_promise.queryPromise(sql,condition);
        if(!result){
            console.log("获取mysql人员总数失败");
        }else {
            //console.log(result.length);
            savePeason(result,1,resolve);
           //resolve();
            console.log("获取mysql人员总数成功");
        }
    });
}

/**
 * 保存或修改人员
 * @param result
 * @param type 1厅经理  2营业员  3网格经理
 */
async function savePeason(result,type,resolve){
    var a = 1;

    for(let i in result){

        //console.log(result.length+"~~~~~~~~~~~~~~~~~~~~~~~"+a++)
        let  inst={};
        if( result[i].phone==null || result[i].phone==""){
            //电话为空  机构为空 不导入  导出到文件
           writeFile(peson_sync_data_from_Athena_url+"\\file_no_tel.txt",JSON.stringify(result[i]))
            continue;
        }

        if(result[i].orgIds==null ||  result[i].orgIds==""){
            //电话为空  机构为空 不导入  导出到文件
            writeFile(peson_sync_data_from_Athena_url+"\\file_no_org.txt",JSON.stringify(result[i]))
            continue;
        }

        //if(result[i].phone== '15808569697'){
        //
        //}else{
        //    continue;
        //}

        //查找人员信息
        let resp = await model_org.$User.find({"login_account": result[i].phone});
       // console.log(2);

        if(resp){
           // console.log(i,resp.length);
            if(resp.length>0){//已存在，不做处理
                //console.log("存在");
            }else{//不存在，添加
                //获取机构
               var orgIds = result[i].orgIds.split(",");
                var roleIds = result[i].roleIds.split(",");
                var user_org = [];
                var sys_roles = [];
                for(j=0;j<orgIds.length;j++){
                    let res = await model_org.$CommonCoreOrg.find({"company_code": orgIds[j]});
                    if(res){
                        if(res.length>0){
                            var flag = true;

                            //遍历已有机构，如果有相等的就不加入了
                            for (var k=0;k<user_org.length;k++) {
                                if (user_org[k].equals(res[0]._id)) {
                                    flag = false;
                                }
                            }

                            if (flag) {
                                user_org.push(res[0]._id);
                            }


                            flag = true;

                            //遍历角色，如果有相等的就不加入了
                            for (var k=0;k<sys_roles.length;k++) {
                                if (sys_roles[k].equals(ObjectID(roleIds[j]))) {
                                    flag = false;
                                }
                            }

                            if (flag) {
                                sys_roles.push(ObjectID(roleIds[j]));
                            }
                        }
                    }
                }

                if(user_org.length==0){
                    writeFile(peson_sync_data_from_Athena_url+"\\file_add_no_dept.txt",JSON.stringify(result[i]))
                    continue;
                }

                inst.user_roles = sys_roles;
                inst.user_org = user_org;

                //获取角色
                //console.log(3);
                inst.login_account = result[i].phone;
                inst.user_status = 1;
                inst.user_id = "";
                if(result[i].id){
                    inst.work_id = result[i].id;
                }
                inst.user_no = result[i].phone;
                inst.user_name = result[i].name;
                inst.user_gender = "";
                inst.user_phone = result[i].phone;
                inst.user_tel = result[i].phone;
                inst.user_email = "";
                var password = result[i].phone+'@cmcc';
                inst.login_password = utils.encryptDataByMD5(password);
                inst.user_sys = "56f20ec0c2b4db9c2a7dfe7a";
                inst.user_org_desc = "";
                inst.theme_name = "themes/beyond/";
                inst.theme_skin = "deepblue";
                inst.user_photo = "";
                inst.boss_id = "";
                inst.smart_visual_sys_user_id = "";
                inst.athena_sys_user_id = "";
                inst.athena_app_sys_user_id = "";
                inst.inspect_sys_user_id = "";
                inst.token = "";
                inst.special_sign = "";
                inst.__v = 0;
                writeFile(peson_sync_data_from_Athena_url+"\\file_data.txt",JSON.stringify(inst))
                // 实例模型，调用保存方法
                let rs =await model_org.$User(inst).save();
                console.log("新增用户",inst);
            }
        }

    };
    resolve();
}

function writeFile(file,result){
    fs.appendFile(file, '\r\n'+result, function(err){
        if(err)
            console.log("fail " + err);
        else {
            console.log("写入文件ok");
            // fs.close();
        }
    })
}