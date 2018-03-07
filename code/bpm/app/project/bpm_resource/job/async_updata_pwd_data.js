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

sync_data_from_Athena();

async function sync_data_from_Athena(){
    //await update_hall_manager_data();//更新密码
    //await  del_hall_manager_data();
}


/**
 *  更新工单系统密码
 * @returns {bluebird|exports|module.exports}   hall_manager_info
 */
function update_hall_manager_data(){
    return new Promise(async(resolve,reject)=>{
        updataPeasonPwd();
        resolve();
    });
}


/**
 *  删除工单系统重复数据
 * @returns {bluebird|exports|module.exports}   hall_manager_info
 */
function del_hall_manager_data(){
    return new Promise(async(resolve,reject)=>{
        delPeasonRest();
        resolve();
    });
}


/**
 * 修改人员密码
 * @param
 * @param
 */
function updataPeasonPwd(){
    var a=0;
    model_org.$User.find({},function(err,resp) {
        if (resp) {
            if (resp.length > 0) {
                for (let i in resp) {
                    var conditions = {"_id": resp[i]._id};

                    var password = resp[i].login_account + '@cmcc';

                    var update = {$set: {"login_password": utils.encryptDataByMD5(password)}};
                    var options = {};
                    model_org.$User.update(conditions, update, options, function (error) {
                        if (error) {
                            writeFile("e:\\peasondata\\file_updata_pwd.txt",JSON.stringify(resp[i]))
                            console.log('修改用户信息时出现异常。' + error);
                        }
                        else {a++;
                            console.log('修改用户信息成功。'+a);

                        }
                    });
                }
            }
        }
    })
}


/**
 * 修改人员密码
 * @param
 * @param
 */
function delPeasonRest(){
    var a=0;
    model_org.$User.aggregate([
        { $group : {
            _id: {login_account:"$login_account"},
            count: { $sum: 1 }
        }},
        {
            $match: {count: { $gt: 1 } }
        }
    ]).exec(function(err,res){
        if(err){
            console.log("查询失败");
        }else{
            console.log("查询成功"+res);
            if (res) {
                if (res.length > 0) {
                    for (let i in res) {
                        a+=res[i].count;
                        console.log(res[i]._id.login_account+"@@@"+a);

                        var data = {login_account:res[i]._id.login_account};
                        model_org.$User.remove(data,function (error, rs) {
                            if (error) {
                                console.log("删除失败"+error);
                            } else {
                                console.log("删除成功");
                            }
                        });
                    }
                }
            }
        }
    })
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
