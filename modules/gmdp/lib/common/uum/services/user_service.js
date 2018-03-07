var model = require('../../core/models/user_model');
var utils = require('../../core/utils/app_utils');
var config = require('../../../../config');

/**
 * 分页查询用户列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getUserList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$, page, size, conditionMap, cb, ['user_org', 'user_sys', 'user_roles']);
};

/**
 * 根据系统获取角色
 * @param sys_id
 * @param cb
 */
exports.getRoleBySys = function(sys_id, cb) {
    var fields = {_id:1, role_name: 1};
    var options = {};
    model.$CommonCoreRole.find({role_status:1, sys_id: sys_id}, fields, options, function(error, result) {
        if(error) {
            cb(new Array());
        }
        else {
            cb(result);
        }
    });
}

/**
 * 新增用户
 */
exports.saveUser = function(data, sysid, roleids, orgid, cb) {
    try{
        // 检查账号是否存在
        model.$.count({login_account:data.login_account}, function(count_error, count) {
            if(count_error) {
                cb(utils.returnMsg(false, '1001', '新增用户时出现异常', null, count_error));
            }
            else {
                if(count > 0) {
                    cb(utils.returnMsg(false, '1002', '账号已存在', null, count_error));
                }
                else {
                    // 按规则设置密码
                    var password = data.login_account + config.project.password_suffix;
                    data.login_password = utils.encryptDataByMD5(password);

                    // var sys = model.$CommonCoreSys({_id:sysid});
                    // data.user_sys = sys;
                    data.user_sys = sysid;

                    var org = model.$CommonCoreOrg({_id:orgid});
                    //data.user_org = org;
                    data.user_org.push(org);
                    roleids=roleids.toString().split(",");
                    roleids.forEach(function(roleid) {
                        var role = model.$CommonCoreRole({_id:roleid});
                        data.user_roles.push(role);
                    });

                    // 实例模型，调用保存方法
                    model.$(data).save(function(error){
                        if(error) {
                            cb(utils.returnMsg(false, '1000', '新增用户时出现异常', null, error));
                        }
                        else {
                            cb(utils.returnMsg(true, '0000', '新增用户成功', null, null));
                        }
                    });
                }
            }
        });
    }
    catch(e){
        cb(utils.returnMsg(false, '1001', '新增用户时出现异常', null, e));
    }
};

/**
 * 获取用户详情
 * @param userid
 * @param cb
 */
exports.getUser = function(userid, cb){
    model.$.find({_id:userid}, function(error, result) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '获取用户信息时出现异常', null, error));
        }
        else {
            if(result.length == 0) {
                cb(utils.returnMsg(false, '1001', '未能获取该用户信息', null, null));
            }
            else {
                cb(utils.returnMsg(true, '0000', '获取用户信息成功', result[0], null));
            }
        }
    });
};

/**
 * 修改用户信息
 * @param id
 * @param data
 * @param sysid
 * @param roleids
 * @param orgid
 * @param cb
 */
exports.updateUser = function(id, data, sysid, roleids, orgid, cb) {
    try{
        // 检查账号是否存在
        console.log("roleids     ,",roleids);
        console.log("data     ,",data,sysid,roleids,orgid,id);
        model.$.count({login_account:data.login_account,_id:{$ne:id}}, function(count_error, count) {
            if (count_error) {
                console.error(count_error)
                cb(utils.returnMsg(false, '1001', '修改用户时出现异常', null, count_error));
            }
            else {
                if (count > 0) {
                    cb(utils.returnMsg(false, '1002', '账号已存在', null, count_error));
                }
                else {
                    // var sys = model.$CommonCoreSys({_id: sysid});
                    data.user_sys = sysid;

                    var org = model.$CommonCoreOrg({_id: orgid});
                    //data.user_org = org;
                    data.user_org.push(org);
                    roleids=roleids.toString().split(",");
                    roleids.forEach(function (roleid) {
                        var role = model.$CommonCoreRole({_id: roleid});
                        data.user_roles.push(roleid);
                    });

                    var conditions = {_id: id};
                    var update = {$set: data};

                    var options = {};
                    console.error(data)
                    model.$.update(conditions, update, options, function (error) {
                        if (error) {
                            cb(utils.returnMsg(false, '1000', '修改用户信息时出现异常。', null, error));
                        }
                        else {
                            cb(utils.returnMsg(true, '0000', '修改用户信息成功。', null, null));
                        }
                    });
                }
            }
        });
    }
    catch(e){
        cb(utils.returnMsg(false, '1001', '修改用户信息时出现异常', null, e));
    }
}

/**
 * 重置密码
 * @param userid
 * @param cb
 */
exports.resetPwd = function(userid, cb) {
    model.$.find({_id:userid}, function(error, result) {
        if(error) {
            cb(utils.returnMsg(false, '1000', '重置密码时出现异常', null, error));
        }
        else {
            if(result.length == 0) {
                cb(utils.returnMsg(false, '1001', '重置密码时未能找到该用户', null, null));
            }
            else {

                var user = result[0];
                //var password = user.login_account + '';
                var password = user.login_account + config.project.password_suffix;

                var conditions = {_id: userid};
                var update = {$set: {login_password:utils.encryptDataByMD5(password)}};

                var options = {};
                model.$.update(conditions, update, options, function (error) {
                    if(error) {
                        cb(utils.returnMsg(false, '1002', '重置密码时出现异常', null, error));
                    }
                    else {
                        cb(utils.returnMsg(true, '0000', '重置密码成功。', null, null));
                    }
                });
            }
        }
    });
}
/**
 * 根据导入excel批量插入账号信息
 * @param excelObj
 */
exports.insertUsers = function(excelObj,sys_id,cb) {
    return new Promise(function (resolve, reject) {
        try{
            var arr=[];
            console.log("验证空");
            //首先判断是否模板存在为空的列，然后将整行有值得移到新的数组
            for(var i=0;i< excelObj.length;i++){
                var value=excelObj[i];
                if(value.length!=0){
                    for(var j=0;j<value.length;j++){
                        //用户编号
                        if(!value[j]){
                            var h=parseInt(i)+1;
                            var l=parseInt(j)+1;
                            reject(utils.returnMsg(false, '1000', '第'+h+"行，第"+l+"列为空", null, null))
                            return;
                        }

                    }
                    arr.push(value);

                }
            }

            console.log("xlsx:",arr);
            var userCount=1;
            //用户编号计数器
            var userNoCount=1;
            //用户账号计数器
            var userLoginCount=1;
            var userNoArr=[];
            //验证在数据库中是否存在
            console.log("验证存在",arr.length,arr);
            for(let i=1;i<arr.length;i++){
                var value=arr[i];
                let data={};
                data.user_no=value[0];
                data.user_name=value[1];
                data.login_account=value[2];
                data.user_phone=value[3];
                data.user_tel=value[3];

                // 检查账号编号是否存在
                model.$CommonCoreUploadUser.count({user_no:data.user_no}, function(count_error, count) {
                    if(count_error) {
                        reject(utils.returnMsg(false, '1001', '新增用户时出现异常', null, count_error));
                        return;
                    }else {
                        userNoCount++;
                        if(count>0) {
                            userNoArr.push(data.user_no);
                            console.log("用户编号:",data.user_no);
                        }else if(userNoArr.length==0) {
                            var login_account=data.login_account;
                            //检查账号是否存在
                            model.$CommonCoreUploadUser.count({login_account:login_account}, function(count_error, count) {
                                console.log("count",count);
                                userLoginCount++;
                                if(count_error) {
                                    console.log("用户账号存在");
                                    reject( utils.returnMsg(false, '1001', '新增用户时出现异常', null, count_error));
                                    return;
                                }
                                else {
                                    if(count > 0 ) {
                                        userNoArr.push(login_account);
                                    }else if(userNoArr.length==0){
                                        userCount++;
                                        //全部无重复编号和重复账号则插入数据库
                                        if(userCount==arr.length-1){
                                            //插入数据库
                                            console.log("插入数据库");
                                            var saveCount=1;
                                            for(var i=1;i< arr.length;i++){
                                                var value=arr[i];
                                                var data={};
                                                data.user_no=value[0];
                                                data.user_name=value[1];
                                                data.login_account=value[2];
                                                data.user_phone=value[3];
                                                data.user_tel=value[3];
                                                data.user_email=value[4];
                                                data.user_sys=sys_id;
                                                data.user_status=1;
                                                console.log("data,"+data);
                                                // 按规则设置密码
                                                var password = data.login_account + config.project.password_suffix;
                                                data.login_password = utils.encryptDataByMD5(password);
                                                // 检查账号编号是否存在
                                                model.$CommonCoreUploadUser(data).save(function(error){
                                                    if(error) {
                                                        reject(utils.returnMsg(false, '1001', '新增用户时出现异常', null, error)) ;
                                                        return;
                                                    }else {
                                                        saveCount++;

                                                        //全部保存返回结果
                                                        if(saveCount==excelObj.length-1){
                                                            resolve( utils.returnMsg(true, '0000', '导入成功。', null, null));
                                                        }
                                                    }
                                                });


                                            }
                                        }

                                    }

                                    //返回所有存在账号
                                    if(userLoginCount==arr.length && userNoArr.length>0){
                                        console.log("已存在账号：",userNoArr);
                                        reject( utils.returnMsg(false, '1003','用户账号'+(userNoArr)+'已存在', null,null ));
                                        return;
                                    }
                                }
                            });
                        }
                        //返回所有存在用户编号
                        if(userNoCount==arr.length && userNoArr.length>0){
                            console.log("已存在编号：",userNoArr);
                            reject(utils.returnMsg(false, '1002','用户编号'+userNoArr+'已存在',  null,null));
                            return;
                        }
                    }
                });
            }
        }
        catch(e){
            reject( utils.returnMsg(false, '1001', '导入用户时出现异常', null, e));
        }
    })




};