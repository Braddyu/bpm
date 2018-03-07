var model_org=require("../models/user_model");
var Promise=require("bluebird");
var utils = require('../../../../lib/utils/app_utils');
var mysql_pool=require("../../../../lib/mysql_pool");
var mysql_pool_promise=require("../../../../lib/mysql_pool_peason_athena_promise");
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID;

exports.sync_data_from_Athena=function(){
    sync_data_from_Athena ();
}

//sync_data_from_Athena();

async function sync_data_from_Athena(){
    await update_grid_manager_data();//网格经理
    await update_hall_manager_data();//厅经理
    await update_salesperson_data();//营业员
}


/**
 *  从雅典娜更新厅经理人员数据
 * @returns {bluebird|exports|module.exports}   hall_manager_info
 */
function update_hall_manager_data(){
    return new Promise(async(resolve,reject)=>{
        let sql = "select '' id,t.channel_id orgId,TRIM(t.hall_manager_tel) phone,t.hall_manager_name name from hall_manager_info t";
        let condition ={};
        let result =await mysql_pool_promise.queryPromise(sql,condition);
        if(!result){
            console.log("获取mysql厅经理人员总数失败");
        }else {
            //console.log(result.length);
            savePeason(result,1,resolve);
            resolve();
            console.log("获取mysql厅经理人员总数成功");
        }
    });
}

/**
 *  从雅典娜更新网格经理人员数据
 * @returns {bluebird|exports|module.exports}
 */
function update_grid_manager_data(){
    return new Promise(async(resolve,reject)=>{
        let sql = "select TRIM(t.grid_manager_tel) phone,t.grid_manager_name name,t.grid_manager_id id,t.grid_coding orgId from grid_manager_info t group by phone,orgId";
        let condition ={};
        let result =await mysql_pool_promise.queryPromise(sql,condition);
        if(!result){
            console.log("获取mysql网格经理人员总数失败");
        }else {
            console.log(result);
            savePeason(result,3,resolve);
            resolve();
            console.log("获取mysql网格经理人员总数成功");
        }
    });
}


/**
 *  从雅典娜更新营业员人员数据
 * @returns {bluebird|exports|module.exports}  salesperson_info
 */
function update_salesperson_data(){
    return new Promise(async(resolve,reject)=>{
        let sql = "select TRIM(t.salesperson_tel) phone,t.salesperson_name name,t.salesperson_id id,t.channel_id orgId from salesperson_info t";
        let condition ={};
        let result =await mysql_pool_promise.queryPromise(sql,condition);
        if(!result){
            console.log("获取mysql营业员人员总数失败");
        }else {
            console.log(result);
            savePeason(result,2,resolve);
            resolve();
            console.log("获取mysql营业员人员总数成功");
        }
    });
}

/**
 * 保存或修改人员
 * @param result
 * @param type 1厅经理  2营业员  3网格经理
 */
function savePeason(result,type){
    var b =0;
    var a = 1;

    for(let i in result){
        let  inst={};
        a++;
        if( result[i].phone==null || result[i].phone==""){
            //电话为空  机构为空 不导入  导出到文件
            writeFile("e:\\peasondata\\file_no_tel.txt",JSON.stringify(result[i]))
            continue;
        }

        if(result[i].orgId==null ||  result[i].orgId==""){
            //电话为空  机构为空 不导入  导出到文件
            writeFile("e:\\peasondata\\file_no_org.txt",JSON.stringify(result[i]))
            continue;
        }
        //if(result[i].phone=='15086436539'){
        //    console.log(result[i]);
        //}else{
        //    continue;
        //}
        //查询此人员是否已在工单系统中  手机号和名字匹配上才更新
        model_org.$User.find({"login_account": result[i].phone,"user_name": result[i].name},function(err,resp) {
            model_org.$CommonCoreOrg.find({"company_code": result[i].orgId},function(err,res) {
                    if(resp){
                    if(resp.length>0){//已存在，做何处理
                        if (res) {
                            if (res.length > 0) {//查到orgid
                                inst = resp[0];
                                inst.user_name = result[i].name;
                                var roleId = '';
                                //增加角色
                                if (type == 1) {//厅经理
                                    roleId = ObjectID("5a266868bfb42d1e9cdd5c6e");
                                } else if (type == 2) {//营业员
                                    roleId = ObjectID("5a26418c5eb3fe1068448753");
                                } else if (type == 3) {//网格经理
                                    roleId = ObjectID("5a264057c819ed211853907a");
                                }
                                var roleIds = [];
                                var flag = true;

                                //遍历已有角色，如果有相等的就不加入了
                                for (var j=0;j<inst.user_roles.length;j++) {
                                    roleIds.push(inst.user_roles[j]);
                                    if (inst.user_roles[j].equals(roleId)) {
                                        flag = false;
                                    }
                                }

                                if (flag) {
                                    roleIds.push(roleId);
                                }

                                inst.user_roles=roleIds;


                                flag = true;
                                var orgIds = [];
                                //遍历已有机构，如果有相等的就不加入了
                                for (var j=0;j<inst.user_org.length;j++) {
                                    orgIds.push(inst.user_org[j]);
                                    if (inst.user_org[j].equals(res[0]._id)) {
                                        flag = false;
                                    }
                                }

                                if (flag) {
                                    orgIds.push(res[0]._id);
                                }

                                inst.user_org = orgIds;

                                var conditions = {"_id":resp[0]._id};
                                var update = {$set: {"user_org": orgIds,user_roles:roleIds,user_name:result[i].name,work_id:result[i].id}};

                                var options = {};
                                model_org.$User.update(conditions,update, options, function (error) {
                                    if (error) {
                                        console.log(inst);
                                        console.log('修改用户信息时出现异常。'+error);
                                    }
                                    else {
                                        console.log('修改用户信息成功。');
                                    }
                                });
                            }else {
                                writeFile("e:\\peasondata\\file_updata_no_dept.txt",JSON.stringify(result[i]))
                            }
                        }
                    }else{//不存在，添加
                        //不存在还需要用手机号查询一下，没有才增加，有的话为异常数据
                        model_org.$User.find({"login_account": result[i].phone},function(err,resp2) {
                            if (resp2){
                                if(resp2.length>0) {//异常数据
                                    writeFile("e:\\peasondata\\file_手机存在名字不对异常.txt",JSON.stringify(result[i]))
                                }else{//手机不存在才添加
                                    if (res) {
                                        if(res.length>0) {//查到orgid
                                            inst.login_account = result[i].phone;
                                            inst.user_status = 1;
                                            inst.user_id = "";
                                            inst.work_id = result[i].id;
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
                                            inst.sys_roles = [];
                                            if(type==1){//厅经理
                                                inst.user_roles = [ObjectID("5a266868bfb42d1e9cdd5c6e")];
                                            }else if(type==2){//营业员
                                                inst.user_roles = [ObjectID("5a26418c5eb3fe1068448753")];
                                            }else if(type==3){//网格经理
                                                inst.user_roles = [ObjectID("5a264057c819ed211853907a")];
                                            }
                                            inst.user_org = [res[0]._id];
                                            inst.__v = 0;
                                            // 实例模型，调用保存方法
                                            model_org.$User(inst).save(function(error,rs){
                                                if(error) {
                                                    console.log(inst);
                                                    console.log('新增用户时出现异常'+error);
                                                }
                                                else {
                                                    console.log( '新增用户成功');
                                                }
                                            });
                                        }else{//查不到部门怎么办
                                            console.log("没有部门！！！！！！！！！！！！！！！");
                                            writeFile("e:\\peasondata\\file_add_no_dept.txt",JSON.stringify(result[i]))
                                        }
                                    } else {
                                        console.log(err)
                                    }
                                }
                            }
                        });
                    }
                }
            })
        })
    };
    return ;
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