var express = require('express');
var router = express.Router();
var logger = require('../../../../lib/logHelper').helper;
var utils = require('../../../../lib/utils/app_utils');
var proc = require('../services/process_service');
var config = require('../../../../config');
var fs = require('fs');
var urlencode = require('urlencode');
var service = require('../services/basedata_service');


// -------------------------------查询我的待办数据接口-------------------------------
exports.basedata=function() {

    //中间件
    router.use(function (req, res, next) {
        //验证令牌是否正确
            if (req.headers.token || req.query.token || req.body.token) {
            //优先从header中获取，其次get和post
            var token = req.headers.token ? req.headers.token : (req.query.token ? req.query.token : req.body.token);
            proc.valiateToken(token).then(function (re) {
                if (re.success) {
                    next();
                } else {
                    utils.respJsonData(res, re);
                }
            });
        } else {
            utils.respJsonData(res, utils.returnMsg(false, '1000', '未传入令牌', null, null));
        }

    });


    /**
     * 用户新增、修改接口
     */
    router.route('/editUser').post(function (req, res) {

        // 获取提交信息
        var id  = req.body.id;//如果修改，必须传id
        var login_account = req.body.login_account;//账号
        var phone = req.body.phone;//电话
        var user_status = req.body.user_status;//用户状态  1正常  0禁用
        var work_id = req.body.work_id;//工号
        var user_name = req.body.user_name;//姓名
        var user_org = req.body.user_org;//所属机构
        var user_gender = req.body.user_gender;//性别
        var user_email = req.body.user_email;//邮箱

        var edit_type = req.body.edit_type;//操作类型  0新增  1修改
        service.editUser(id,login_account, phone,user_status,work_id, user_name,user_org,edit_type)
        .then(function(result){
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            utils.respJsonData(res, err);
        });
    });


    /**
     * 用户删除接口
     */
    router.route('/delUser').post(function (req, res) {

        // 获取提交信息
        var id  = req.body.id;//如果修改，必须传id

        service.delUser(id)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                utils.respJsonData(res, err);
            });
    });

    /**
     * 机构新增、修改接口
     */
    router.route('/editOrg').post(function (req, res) {

        // 获取提交信息
        var id  = req.body.id;//如果修改，必须传id
        var org_code = req.body.org_code;//机构编号
        var org_name = req.body.org_name;//机构名
        var org_fullname = req.body.org_fullname;//机构全名
        var org_order = req.body.org_order;//排序号
        //var org_type = req.body.org_type;//机构类型
        var org_pid = req.body.org_pid;//机构父节点
        var org_status = req.body.org_status;//机构状态  1正常  0禁用
        var org_remark = req.body.org_remark;//机构描述
        var level = req.body.level;//机构级别



        var edit_type = req.body.edit_type;//操作类型  0新增  1修改
        console.log(JSON.stringify(req.body))
        service.editOrg(id,org_code, org_name,org_fullname,org_order, org_pid,org_status,org_remark,level,edit_type)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                utils.respJsonData(res, err);
            });
    });

    /**
     * 机构删除接口
     */
    router.route('/delOrg').post(function (req, res) {

        // 获取提交信息
        var id  = req.body.id;//如果修改，必须传id

        service.delOrg(id)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                utils.respJsonData(res, err);
            });
    });

    /**
     * 角色新增、修改接口
     */
    router.route('/editRole').post(function (req, res) {

        // 获取提交信息
        var id  = req.body.id;//如果修改，必须传id
        var role_code = req.body.role_code;//角色编码
        var role_name = req.body.role_name;//角色名称
        var role_tag = req.body.role_tag;//角色标志：1-内部，2-外部
        var role_level = req.body.role_level;//角色级别：1-省级，2-市级，3-县级
        var role_status = req.body.role_status;//状态：1-有效，2-停用
        var role_remark = req.body.role_remark;//角色描述
        var role_order = req.body.role_order;//序号
        var edit_type = req.body.edit_type;//操作类型  0新增  1修改
        console.log(JSON.stringify(req.body))
        service.editRole(id,role_code, role_name,role_tag,role_level, role_status,role_remark,role_order,edit_type)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                utils.respJsonData(res, err);
            });
    });

    /**
     * 角色删除接口
     */
    router.route('/delRole').post(function (req, res) {

        // 获取提交信息
        var id  = req.body.id;//如果修改，必须传id

        service.delRole(id)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                utils.respJsonData(res, err);
            });
    });


    /**
     * 给用户关联角色
     */
    router.route('/editUserRole').post(function (req, res) {

        // 获取提交信息
        var id  = req.body.id;//如果修改，必须传id
        var roleIds = req.body.roleIds;//角色id

        service.editUserRole(id,roleIds)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                utils.respJsonData(res, err);
            });
    });

    /**
     * 给角色关联菜单
     */
    router.route('/editRoleMenus').post(function (req, res) {

        // 获取提交信息
        var menuIds  = req.body.menuIds;//菜单ids
        var roleId = req.body.roleId;//角色id

        service.editUser(id,login_account, phone,user_status,work_id, user_name,user_org,edit_type)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                utils.respJsonData(res, err);
            });
    });

    return router;
}
