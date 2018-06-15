var model_org = require("../models/user_model");
var process_extend_model = require("../models/process_extend_model");
var Promise = require("bluebird");
var utils = require('../../../../lib/utils/app_utils');

var mysql_pool_promise = require("../../../../lib/mysql_pool_athena");



exports.sync_data_from_Athena = function () {
    sync_data_from_Athena();
}

function sync_data_from_Athena() {
    update_data();
}
/**
 *  从雅典娜更新人员数据
 * @returns {bluebird|exports|module.exports}   hall_manager_info
 */
function update_data() {
    return new Promise(async (resolve, reject) => {
        let sql='SELECT ' +
            'aa.work_id, ' +
            'aa.phone, ' +
            'aa. NAME, ' +
            'group_concat(aa.orgIds) orgIds, ' +
            'group_concat(aa.roleIds) roleIds ' +
            'FROM ' +
            '( ' +
            'SELECT ' +
            'max(t1.work_id) work_id, ' +
            't1.phone, ' +
            't1. NAME, ' +
            'group_concat(t1.orgId) orgIds, ' +
            'group_concat(t1.roleId) roleIds ' +
            'FROM ' +
            '( ' +
            '( ' +
            'SELECT ' +
            'TRIM(hall_manager_tel) phone, ' +
            'hall_manager_name NAME, ' +
            'TRIM(hall_manager_tel) work_id, ' +
            'channel_id orgId, ' +
            '\'5a266868bfb42d1e9cdd5c6e\' roleId ' +
            'FROM ' +
            'hall_manager_info ' +
            ') ' +
            'UNION ALL ' +
            '( ' +
            'SELECT ' +
            'TRIM(salesperson_tel) phone, ' +
            'salesperson_name NAME, ' +
            'salesperson_id work_id, ' +
            'channel_id orgId, ' +
            '\'5a26418c5eb3fe1068448753\' roleId ' +
            'FROM ' +
            'salesperson_info ' +
            ') ' +
            'UNION ALL ' +
            '( ' +
            'SELECT ' +
            'TRIM(t.grid_manager_tel) phone, ' +
            't.grid_manager_name NAME, ' +
            't.grid_manager_id work_id, ' +
            't.grid_coding orgId, ' +
            '\'5a264057c819ed211853907a\' roleId ' +
            'FROM ' +
            '( ' +
            'SELECT ' +
            '*, count(1) count ' +
            'FROM ' +
            'grid_manager_info ' +
            'WHERE ' +
            'grid_coding IS NOT NULL ' +
            'GROUP BY ' +
            'grid_coding, ' +
            'grid_manager_tel ' +
            'ORDER BY ' +
            'count DESC ' +
            ') t ' +
            'GROUP BY ' +
            't.grid_coding ' +
            ') ' +
            'ORDER BY ' +
            'work_id desc ' +
            ') t1 ' +
            'WHERE ' +
            't1.phone IS NOT NULL ' +
            'AND t1.`NAME` IS NOT NULL ' +
            'AND ( ' +
            'LENGTH(t1.phone) = 12 ' +
            'OR LENGTH(t1.phone) = 11 ' +
            ') ' +
            'AND t1.orgId IS NOT NULL ' +
            'AND t1.orgId != \'\' ' +
            'GROUP BY ' +
            't1.phone ' +
            ') aa ' +
            'GROUP BY ' +
            'aa.work_id ' ;
        let condition = {};
        console.log(sql);
        let result = await mysql_pool_promise.queryPromise(sql, condition);
        if (!result) {
            console.log("获取mysql人员总数失败");
        } else {
            console.log(result.length);
            let size = 500;
            let pool_size = Math.ceil(result.length / size);
            console.log('pool_size', pool_size)
            for (let i = 0; i < pool_size; i++) {
                console.log("=================第", i, "次====================");

                let start = i * size;
                let end = ((i + 1) * size) > result.length ? result.length : ((i + 1) * size);
                await savePeason(result.slice(start, end));
            }

            console.log("获取mysql人员总数成功");
        }
    });
}

/**
 * 保存或修改人员
 * @param result
 * @param type 1厅经理  2营业员  3网格经理
 */
function savePeason(result) {
    return new Promise(async (resolve, reject) => {
        let count = 0;
        /**
         *,因为同步的账号信息可能会被人工增加其他角色，
         * 这里获取网格经理，厅经理，营业员的角色，如果修改的人员的角色有除了这三种角色外的角色，则保留那个角色
         */
        let roles = ['5a26418c5eb3fe1068448753', '5a266868bfb42d1e9cdd5c6e', '5a264057c819ed211853907a'];
        /**
         *,因为同步的账号信息可能会被人工增加其他机构，
         * 这里获取除了网格，渠道之外的组织是为了判断修改的账号的组织是否存在之外的组织,
         * 如果存在则保留，只修改用户渠道和网格组织
         */
        let core_org = await model_org.$CommonCoreOrg.find({"level": {$nin: [5, 6]}});
        let core_org_id = [];
        for (let i = 0; i < core_org.length; i++) {
            core_org_id.push((core_org[i]._id).toString());
        }
        for (let i in result) {
            let inst = {};
            let user_org = new Set();
            let sys_roles = new Set();
            let orgIds = result[i].orgIds.split(",");
            let roleIds = result[i].roleIds.split(",");
            //查找人员信息
            model_org.$User.find({"user_no": result[i].phone}, async function (err, resp) {
                if(err){
                    count++;
                    if (count == result.length) {
                        resolve();
                    }
                    console.log("查询用户错误",err);
                }else {
                    console.log("i:", i);
                    await  model_org.$CommonCoreOrg.find({"company_code": {$in: orgIds}}, function (err, res) {
                        if(err){
                            count++;
                            if (count == result.length) {
                                resolve();
                            }
                            console.log("查询机构错误",err);
                        }else{
                            console.log("company_code", orgIds);
                            if (res) {
                                for (let k = 0; k < res.length; k++) {
                                    user_org.add(res[k]._id);
                                }

                                //遍历角色
                                for (let k = 0; k < roleIds.length; k++) {
                                    sys_roles.add(roleIds[k]);
                                }

                                //用户存在则修改
                                if (resp && resp.length == 1) {
                                    let user_roles_local = resp[0].user_roles;
                                    let user_org_local = resp[0].user_org;

                                    //判断是否存在需要保留的角色
                                    for (let j = 0; j < user_roles_local.length; j++) {
                                        //表示此角色不为同步的三种角色，保留
                                        if (roles.indexOf(user_roles_local[j].toString()) == -1) {
                                            sys_roles.add(user_roles_local[j]);
                                        }
                                    }

                                    //判断是否存在需要保留的组织
                                    for (let j = 0; j < user_org_local.length; j++) {
                                        //表示此角色在渠道和网格之外，保留
                                        if (core_org_id.indexOf(user_org_local[j].toString()) > -1) {
                                            user_org.add(user_org_local[j]);
                                        }
                                    }


                                    inst.user_roles = [...sys_roles];
                                    inst.user_org = [...user_org];
                                    //以前是手机号为user_no,后来发现手机号会变，但是工号不会
                                    //这里用工号做唯一标识，厅经理和网格经理的还是用手机号
                                    inst.user_no = result[i].phone;
                                    inst.work_id = result[i].work_id;
                                    inst.user_name = result[i].NAME;
                                    inst.login_account = result[i].phone;
                                    inst.user_phone = result[i].phone;
                                    inst.user_tel = result[i].phone;
                                    model_org.$User.update({"_id": resp[0]._id}, inst, function (err) {
                                        count++;
                                        if (count == result.length) {
                                            resolve();
                                        }
                                    })

                                } else if (resp && resp.length > 1) {
                                    model_org.$User.remove({"user_no": result[i].phone}, function (err) {
                                        inst.login_account = result[i].phone;
                                        inst.user_status = 1;
                                        inst.user_id = "";
                                        inst.work_id = result[i].work_id;
                                        inst.user_no = result[i].phone;
                                        inst.user_name = result[i].NAME;
                                        inst.user_gender = "";
                                        inst.user_phone = result[i].phone;
                                        inst.user_tel = result[i].phone;
                                        inst.user_email = "";
                                        var password = result[i].phone + '@cmcc';
                                        inst.login_password = utils.encryptDataByMD5(password);
                                        inst.user_sys = "56f20ec0c2b4db9c2a7dfe7a";
                                        inst.user_org_desc = "";
                                        inst.theme_name = "themes/beyond/";
                                        inst.theme_skin = "deepblue";
                                        inst.user_photo = "";
                                        inst.smart_visual_sys_user_id = "";
                                        inst.athena_sys_user_id = "";
                                        inst.athena_app_sys_user_id = "";
                                        inst.inspect_sys_user_id = "";
                                        inst.token = "";
                                        inst.special_sign = "";
                                        inst.__v = 0;
                                        inst.user_roles = [...sys_roles];
                                        inst.user_org = [...user_org];

                                        // 实例模型，调用保存方法
                                        new model_org.$User(inst).save(function (err) {
                                            count++;
                                            if (count == result.length) {
                                                resolve();
                                            }
                                        });
                                    })
                                } else {
                                    //获取角色
                                    //console.log(3);
                                    inst.login_account = result[i].phone;
                                    inst.user_status = 1;
                                    inst.user_id = "";
                                    inst.work_id = result[i].work_id;
                                    inst.user_no = result[i].phone;
                                    inst.user_name = result[i].NAME;
                                    inst.user_gender = "";
                                    inst.user_phone = result[i].phone;
                                    inst.user_tel = result[i].phone;
                                    inst.user_email = "";
                                    var password = result[i].phone + '@cmcc';
                                    inst.login_password = utils.encryptDataByMD5(password);
                                    inst.user_sys = "56f20ec0c2b4db9c2a7dfe7a";
                                    inst.user_org_desc = "";
                                    inst.theme_name = "themes/beyond/";
                                    inst.theme_skin = "deepblue";
                                    inst.user_photo = "";
                                    inst.smart_visual_sys_user_id = "";
                                    inst.athena_sys_user_id = "";
                                    inst.athena_app_sys_user_id = "";
                                    inst.inspect_sys_user_id = "";
                                    inst.token = "";
                                    inst.special_sign = "";
                                    inst.__v = 0;
                                    inst.user_roles = [...sys_roles];
                                    inst.user_org = [...user_org];

                                    model_org.$User.find({"work_id": result[i].work_id}, function (err, res) {

                                        if (res && res.length == 1) {
                                            let user_roles_local = res[0].user_roles;
                                            let user_org_local = res[0].user_org;
                                            model_org.$User.remove({"_id": res[0]._id}, function (err) {
                                                //判断是否存在需要保留的角色
                                                for (let j = 0; j < user_roles_local.length; j++) {
                                                    //表示此角色不为同步的三种角色，保留
                                                    if (roles.indexOf(user_roles_local[j].toString()) == -1) {
                                                        sys_roles.add(user_roles_local[j]);
                                                    }
                                                }

                                                //判断是否存在需要保留的组织
                                                for (let j = 0; j < user_org_local.length; j++) {
                                                    //表示此角色在渠道和网格之外，保留
                                                    if (core_org_id.indexOf(user_org_local[j].toString()) > -1) {
                                                        user_org.add(user_org_local[j]);
                                                    }
                                                }
                                                inst.user_roles = [...sys_roles];
                                                inst.user_org = [...user_org];
                                                // 实例模型，调用保存方法
                                                new model_org.$User(inst).save(function (err) {
                                                    count++;
                                                    console.log("update success",count);
                                                    if (count == result.length) {
                                                        resolve();
                                                    }
                                                });
                                            })
                                        } else if (res && res.length > 1) {
                                            model_org.$User.remove({"work_id": result[i].work_id}, function (err) {
                                                // 实例模型，调用保存方法
                                                new model_org.$User(inst).save(function (err) {
                                                    count++;
                                                    if (count == result.length) {
                                                        resolve();
                                                    }
                                                });
                                            })
                                        } else {
                                            // 实例模型，调用保存方法
                                            new model_org.$User(inst).save(function (err) {
                                                console.log("add success");
                                                count++;
                                                if (count == result.length) {
                                                    resolve();
                                                }
                                            });

                                        }
                                    })
                                }
                            }
                        }

                    });
                    await process_extend_model.$ProcessTaskStatistics.update({"work_id":result[i].work_id},{$set:{user_name: result[i].NAME,user_phone: result[i].phone}},{multi:true},function(err,res){})
                }
            });

        }
        ;

    })

}


