var model = require('../models/process_model');
var model_user=require("../models/user_model");
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
var utils = require('../../../utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;
var model_org = require("../models/user_model");
var ObjectID = require('mongodb').ObjectID;


/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.editUser = function(id,login_account, phone,user_status,work_id, user_name,user_org,edit_type) {

    var p = new Promise(function(resolve,reject){

        let inst = {};

        if (!edit_type) {
            reject(utils.returnMsg( false, '1000', '操作类型不能为空。', null, null));
        }

        if (!id && edit_type == 1) {
            reject(utils.returnMsg( false, '1000', '修改id不能为空。', null, null));
        }

        if (!login_account && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '账号不能为空。', null, null));
        } else {
            inst.login_account = login_account;
        }

        if (!phone && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '电话不能为空。', null, null));
        } else {
            inst.user_phone = phone;
            inst.user_tel = phone;
            inst.user_no = phone;
        }

        if (!user_status && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '用户状态不能为空。', null, null));
        } else {
            inst.user_status = user_status;
        }

        if (!work_id && edit_type == 0) {
            reject(utils.returnMsg(false, '1000', '工号不能为空。', null, null));
        } else {
            inst.work_id = work_id;
        }

        if (!user_name && edit_type == 0) {
            reject(utils.returnMsg(false, '1000', '姓名不能为空。', null, null));
        } else {
            inst.user_name = user_name;
        }

        if (!user_org && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '机构不能为空。', null, null));
        } else {
            let user_orgids = new Set();
            let orgIds = eval(JSON.parse(user_org));
            for (let i = 0; i < orgIds.length; i++) {
                user_orgids.add(ObjectID(orgIds[i]));
            }
            inst.user_org = [...user_orgids];
        }

        if(edit_type == 0){//新增，补齐字段
            inst.user_id = "";
            inst.user_gender = "";
            inst.user_email = "";
            var password = phone + '@cmcc';
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
            inst.user_roles = [];
            model_user.$User(inst).save(function(error,result){
                if(error) {
                    reject(utils.returnMsg(false, '1000', '新增用户信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '新增用户信息成功。', result._id, null));
                }
            });

        }else if(edit_type==1){//修改
            var conditions = {"_id": ObjectID(id)};
            var update = {$set: inst};
            var options = {};
            model_org.$User.update(conditions, update, options).update(function(error,result){
                if(error) {
                    reject(utils.returnMsg(false, '1000', '修改用户信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '修改用户信息成功。',id, null));
                }
            });
        }else{
            reject(utils.returnMsg(false, '1000', '修改用户信息时出现异常。', null, null));
        }

    });

    return p;

};

/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.delUser = function(id) {

    var p = new Promise(function(resolve,reject){

        let inst = {'user_status':0};

        if (!id) {
            reject(utils.returnMsg( false, '1000', 'id不能为空。', null, null));
        }


        var conditions = {"_id": ObjectID(id)};
        var update = {$set: inst};
        var options = {};
        model_org.$User.update(conditions, update, options).update(function(error,result){
            if(error) {
                reject(utils.returnMsg(false, '1000', '删除用户信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '删除用户信息成功。', null));
            }
        });


    });

    return p;

};


/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.editOrg = function(id,org_code, org_name,org_fullname,org_order, org_pid,org_status,org_remark,level,edit_type) {

    var p = new Promise(function(resolve,reject){

        let inst = {};

        if (!edit_type) {
            reject(utils.returnMsg( false, '1000', '操作类型不能为空。', null, null));
        }

        if (!id && edit_type == 1) {
            reject(utils.returnMsg( false, '1000', '修改id不能为空。', null, null));
        }

        if (!org_code && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '机构编号不能为空。', null, null));
        } else {
            inst.org_code = org_code;
        }

        if (!org_name && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '机构名不能为空。', null, null));
        } else {
            inst.org_name = org_name;
        }

        if (!org_fullname && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '机构全名不能为空。', null, null));
        } else {
            inst.org_fullname = org_fullname;
        }

        if (!org_order && edit_type == 0) {
            reject(utils.returnMsg(false, '1000', '排序号不能为空。', null, null));
        } else {
            inst.org_order = org_order;
        }

        if (!org_pid && edit_type == 0) {
            reject(utils.returnMsg(false, '1000', '机构父节点不能为空。', null, null));
        } else {
            inst.org_pid = org_pid;
        }

        if (!org_status && edit_type == 0) {
            reject(utils.returnMsg(false, '1000', '机构状态不能为空。', null, null));
        } else {
            inst.org_status = org_status;
        }

        if (!org_remark && edit_type == 0) {
            reject(utils.returnMsg(false, '1000', '机构描述不能为空。', null, null));
        } else {
            inst.org_remark = org_remark;
        }

        if (!level && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '机构级别不能为空。', null, null));
        } else {
            inst.level = level;
            if(level==1){
                inst.org_type = '总部';
            }else if(level==2){
                inst.org_type = '二级机构';
            }else if(level==3){
                inst.org_type = '地市';
            }else if(level==4){
                inst.org_type = '区县';
            }else if(level==5){
                inst.org_type = '网格';
            }else if(level==6){
                inst.org_type = '渠道';
            }
        }

        if(edit_type == 0){//新增，补齐字段
            inst.__v = 0;
            model_user.$CommonCoreOrg(inst).save(function(error,result){
                if(error) {
                    reject(utils.returnMsg(false, '1000', '新增机构信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '新增机构信息成功。', result._id, null));
                }
            });

        }else if(edit_type==1){//修改
            var conditions = {"_id": ObjectID(id)};
            var update = {$set: inst};
            var options = {};
            model_org.$CommonCoreOrg.update(conditions, update, options).update(function(error,result){
                if(error) {
                    reject(utils.returnMsg(false, '1000', '修改机构信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '修改机构信息成功。',id, null));
                }
            });
        }else{
            reject(utils.returnMsg(false, '1000', '修改机构信息时出现异常。', null, null));
        }

    });

    return p;

};


/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.delOrg = function(id) {

    var p = new Promise(function(resolve,reject){

        let inst = {'org_status':0};

        if (!id) {
            reject(utils.returnMsg( false, '1000', 'id不能为空。', null, null));
        }


        var conditions = {"_id": ObjectID(id)};
        var update = {$set: inst};
        var options = {};
        model_org.$CommonCoreOrg.update(conditions, update, options).update(function(error,result){
            if(error) {
                reject(utils.returnMsg(false, '1000', '删除机构信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '删除机构信息成功。', null));
            }
        });


    });

    return p;

};

/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.editRole = function(id,role_code, role_name,role_tag,role_level, role_status,role_remark,role_order,edit_type) {

    var p = new Promise(function(resolve,reject){

        let inst = {};

        if (!edit_type) {
            reject(utils.returnMsg( false, '1000', '操作类型不能为空。', null, null));
        }

        if (!id && edit_type == 1) {
            reject(utils.returnMsg( false, '1000', '修改id不能为空。', null, null));
        }

        if (!role_code && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '角色编码不能为空。', null, null));
        } else {
            inst.role_code = role_code;
        }

        if (!role_name && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '角色名称不能为空。', null, null));
        } else {
            inst.role_name = role_name;
        }

        if (!role_tag && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '角色标志不能为空。', null, null));
        } else {
            inst.role_tag = role_tag;
        }

        if (!role_level && edit_type == 0) {
            reject(utils.returnMsg(false, '1000', '角色级别不能为空。', null, null));
        } else {
            inst.role_level = role_level;
        }

        if (!role_status && edit_type == 0) {
            reject(utils.returnMsg(false, '1000', '状态不能为空。', null, null));
        } else {
            inst.role_status = role_status;
        }

        if (!role_remark && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '角色描述不能为空。', null, null));
        } else {
            inst.role_remark = role_remark;
        }

        if (!role_order && edit_type == 0) {
            reject(utils.returnMsg( false, '1000', '序号不能为空。', null, null));
        } else {
            inst.role_order = role_order;
        }

        if(edit_type == 0){//新增，补齐字段
            inst.sys_id = "56f20ec0c2b4db9c2a7dfe7a";
            inst.__v = 0;
            model_user.$Role(inst).save(function(error,result){
                if(error) {
                    reject(utils.returnMsg(false, '1000', '新增角色信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '新增角色信息成功。', result._id, null));
                }
            });

        }else if(edit_type==1){//修改
            var conditions = {"_id": ObjectID(id)};
            var update = {$set: inst};
            var options = {};
            model_org.$Role.update(conditions, update, options).update(function(error,result){
                if(error) {
                    reject(utils.returnMsg(false, '1000', '修改角色信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '修改角色信息成功。',id, null));
                }
            });
        }else{
            reject(utils.returnMsg(false, '1000', '修改角色信息时出现异常。', null, null));
        }

    });

    return p;

};

/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.delRole = function(id) {

    var p = new Promise(function(resolve,reject){

        let inst = {'role_status':0};

        if (!id) {
            reject(utils.returnMsg( false, '1000', 'id不能为空。', null, null));
        }


        var conditions = {"_id": ObjectID(id)};
        var update = {$set: inst};
        var options = {};
        model_org.$Role.update(conditions, update, options).update(function(error,result){
            if(error) {
                reject(utils.returnMsg(false, '1000', '删除角色信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '删除角色信息成功。', null));
            }
        });


    });

    return p;

};

/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.editUserRole = function(id,roleIds) {

    var p = new Promise(function(resolve,reject){

        let inst = {'role_status':0};

        if (!id) {
            reject(utils.returnMsg( false, '1000', 'id不能为空。', null, null));
        }

        if (!roleIds) {
            reject(utils.returnMsg( false, '1000', '角色id不能为空。', null, null));
        }else{
            let user_roleids = new Set();
            let role_Ids = eval(JSON.parse(roleIds));
            for (let i = 0; i < role_Ids.length; i++) {
                user_roleids.add(ObjectID(role_Ids[i]));
            }
            inst.user_roles = [...user_roleids];
        }


        var conditions = {"_id": ObjectID(id)};
        var update = {$set: inst};
        var options = {};
        model_org.$User.update(conditions, update, options).update(function(error,result){
            if(error) {
                reject(utils.returnMsg(false, '1000', '修改用户信息时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '修改用户信息成功。',id, null));
            }
        });
    });

    return p;

};


/**
 *
 * @param proc_code
 * @param proc_name
 * @returns {Promise}
 */
exports.editRoleMenus = function(roleId,menuIds) {

    var p = new Promise(function(resolve,reject){

        // 清空role_id相关数据
        var conditions = {role_id: roleId};
        var menusJson = JSON.parse(menuIds);
        //model.$CommonRoleMenuOptModel
        model_org.$CommonRoleMenuOpt.remove(conditions, function (error) {
            if (error) {
                reject(utils.returnMsg(false, '1000', '分配角色权限时出现异常。', null, error));
            }
            else {
                var menus = new Array();
                // 解析data数据
                menusJson.forEach(function(data){
                    // 菜单
                    if(data.type == 1) {
                        //var menu = model.$CommonMenuInfoModel({_id: data.id});
                        var menu = model_org.$CommonCoreRoleMenu({_id: data.id});
                        menus.push({role_id:role_id,menu_id:menu,menu_opts:[]});
                    }
                    // 操作
                    else {
                        menus.forEach(function(menu){
                            if(menu.menu_id._id == data.pid) {
                                //var opt = model.$CommonMenuOptModel({_id: data.id});
                                var opt = model_org.$CommonCoreMenuOpt({_id: data.id});
                                menu.menu_opts.push(opt);
                            }
                        });
                    }
                });
                // 批量保存菜单信息
                //model.$CommonRoleMenuOptModel
                model_org.$CommonRoleMenuOpt.create(menus, function(err, docs) {
                    if(error) {
                        reject(utils.returnMsg(false, '1001', '分配角色权限时出现异常。', null, error));
                    }
                    else {
                        resolve(utils.returnMsg(true, '0000', '分配角色权限成功。', null, null));
                    }
                });
            }
        });
    });

    return p;

};


