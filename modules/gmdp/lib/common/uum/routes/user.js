/**
 * Created by ShiHukui on 2016/2/19.
 */
var express = require('express');
var router = express.Router();


var utils = require('../../../common/core/utils/app_utils');
var userService = require('../services/user_service');

router.route('/')
    .get(function(req,res){
        // 分页条件
        var filter_name = req.query.filter_name;
        var filter_sys = req.query.filter_sys;
        var filter_org = req.query.filter_org;

        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(filter_name){
            conditionMap['$or'] = [{'login_account':new RegExp(filter_name)},{'user_name':new RegExp(filter_name)}];
        }
        if(filter_sys) {
            conditionMap.user_sys = filter_sys;
        }
        if(filter_org && filter_org != '请选择机构/部门') {
            conditionMap.user_org = filter_org;
        }

        // 调用分页
        userService.getUserList(page, length, conditionMap,  function(result){

            utils.respJsonData(res, result);
        });
    })

    .post(function(req,res){
        // 获取提交信息
        var login_account = req.body.login_account;
        var user_no = req.body.user_no;
        var user_name = req.body.user_name;
        var user_gender = req.body.user_gender;
        var user_phone = req.body.user_phone;
        var user_email = req.body.user_email;
        var user_status = req.body.user_status;
        //var user_orgs = req.body.user_orgs;
        var user_sys = req.body.user_sys;
        // 数组特殊处理
        //var user_org = user_orgs.split(',');
        var user_org = req.body.user_roles ? [req.body.user_org] : req.body['user_org[]'];
        var user_role = req.body.user_roles ? [req.body.user_roles] : req.body['user_roles[]'];//只选一个角色时req.body.user_roles有值，req.body['user_roles[]']为undefined，选多个角色时相反
        // var user_role = (req.body.user_roles && req.body.user_roles instanceof Array) ? req.body.user_roles : [req.body.user_roles];// : req.body['user_roles[]'];
        var user_duties = (req.body.user_duties && req.body.user_duties instanceof Array) ? req.body.user_duties : [req.body.user_duties];// ? [req.body.user_duties] : req.body['user_duties[]'];

        // 验证
        if(!login_account) {
            utils.respMsg(res, false, '2001', '登陆账号不能为空。', null, null);
        }
        if(!user_sys) {
            utils.respMsg(res, false, '2002', '归属系统不能为空。', null, null);
        }
        if(!user_status) {
            utils.respMsg(res, false, '2003', '状态不能为空。', null, null);
        }
        if(!user_role) {
            utils.respMsg(res, false, '2004', '拥有角色不能为空。', null, null);
        }
        if(!user_no) {
            utils.respMsg(res, false, '2005', '用户编号不能为空。', null, null);
        }
        if(!user_name) {
            utils.respMsg(res, false, '2006', '用户姓名不能为空。', null, null);
        }
        if(!user_org) {
            utils.respMsg(res, false, '2007', '所在机构/部门不能为空1。', null, null);
        }
        if(!user_gender) {
            utils.respMsg(res, false, '2008', '所在机构/部门不能为空。', null, null);
        }
        // 验证通过组装数据
        var data = {};
        data.login_account = login_account;
        data.user_status = parseInt(user_status);
        data.user_no = user_no;
        data.user_name = user_name;
        data.user_gender = parseInt(user_gender);
        data.user_roles = new Array();
        data.user_org = new Array();
        if(user_phone){
            data.user_phone = user_phone;
        }
        if(user_email){
            data.user_email = user_email;
        }
        if(user_duties) {
            data.user_duties = user_duties;
        }
        else {
            data.user_duties = [];
        }
        userService.saveUser(data, user_sys, user_role, user_org, function(result) {
            utils.respJsonData(res, result);
        });
    });

/**
 * 获取角色数据
 */
router.route('/getRoleData/:sysid')
    .get(function(req,res){
        var sysid = req.params.sysid;
        if(sysid) {
            userService.getRoleBySys(sysid, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respJsonData(res, new Array());
        }
    });

/**
 * 获取角色数据
 */
router.route('/resetpwd/:id')
    .get(function(req,res){
        var id = req.params.id;
        if(id) {
            userService.resetPwd(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '2000', '用户ID不能为空。', null, null);
        }
    });

router.route('/:id')
    .put(function(req,res){

        // 获取提交信息
        var id = req.params.id;

        var login_account = req.body.login_account;
        var user_no = req.body.user_no;
        var user_name = req.body.user_name;
        var user_gender = req.body.user_gender;
        var user_phone = req.body.user_phone;
        var user_email = req.body.user_email;
        var user_status = req.body.user_status;
        // var user_orgs = req.body.user_orgs;
        var user_sys = req.body.user_sys;
        // 数组特殊处理
        //var user_org = user_orgs.split(',');
        var user_org = req.body.user_roles ? [req.body.user_org] : req.body['user_org[]'];
        var user_role = req.body.user_roles ? [req.body.user_roles] : req.body['user_roles[]'];//只选一个角色时req.body.user_roles有值，req.body['user_roles[]']为undefined，选多个角色时相反
        // var user_role = (req.body.user_roles && req.body.user_roles instanceof Array) ? req.body.user_roles : [req.body.user_roles];
        console.log("sssssssssssssssssssssssss1",user_org);
        var user_duties = (req.body.user_duties && req.body.user_duties instanceof Array) ? req.body.user_duties : [req.body.user_duties];

        // 验证
        if(!id) {
            utils.respMsg(res, false, '2000', 'ID不能为空。', null, null);
        }
        if(!login_account) {
            utils.respMsg(res, false, '2001', '登陆账号不能为空。', null, null);
        }
        if(!user_sys) {
            utils.respMsg(res, false, '2002', '归属系统不能为空。', null, null);
        }
        if(!user_status) {
            utils.respMsg(res, false, '2003', '状态不能为空。', null, null);
        }
        if(!user_role) {
            utils.respMsg(res, false, '2004', '拥有角色不能为空。', null, null);
        }
        if(!user_no) {
            utils.respMsg(res, false, '2005', '用户编号不能为空。', null, null);
        }
        if(!user_name) {
            utils.respMsg(res, false, '2006', '用户姓名不能为空。', null, null);
        }
        if(!user_org) {
            utils.respMsg(res, false, '2007', '所在机构/部门不能为空。', null, null);
        }
        if(!user_gender) {
            utils.respMsg(res, false, '2008', '所在机构/部门不能为空。', null, null);
        }
        // 验证通过组装数据
        var data = {};
        data.login_account = login_account;
        data.user_status = parseInt(user_status);
        data.user_no = user_no;
        data.user_name = user_name;
        data.user_gender = parseInt(user_gender);
        data.user_roles = new Array();
        data.user_org = new Array();
        if(user_phone){
            data.user_phone = user_phone;
        }
        if(user_email){
            data.user_email = user_email;
        }
        if(user_duties) {
            data.user_duties = user_duties;
        }
        else {
            data.user_duties = [];
        }
        userService.updateUser(id, data, user_sys, user_role, user_org, function(result) {
            utils.respJsonData(res, result);
        });
    })

    .get(function(req,res){
        var id = req.params.id;

        if(id) {
            userService.getUser(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '2000', '用户ID不能为空。', null, null);
        }
    });

/**
 * 下载账号模板
 */
router.route('/download/templetFile')
    .get(function(req,res){
        //下载
        console.log("开始下载...");
        res.download("../public/files/templet/user_templet.xlsx");
    });

/**
 * 上传账号信息
 */
router.route('/upload/userFile').post(function(req,res) {
    //下载
    console.log("开始上传...");
    var sys_id = req.query.sys_id;
    var crypto = require('crypto');
    var formidable = require('formidable'),
        util = require('util'), fs = require('fs');

    var form = new formidable.IncomingForm(), files = [], fields = [], docs = [];
    var url;

    //存放目录
    form.uploadDir = '../public/files/user';

    form.on('field', function (field, value) {

        fields.push([field, value]);

    }).on('file', function (field, file) {
        files.push([field, file]);
        docs.push(file);

        var types = file.name.split('.');
        var date = new Date();
        var ms = Date.parse(date);
        console.log("file:",file.path);
        url = "../public/files/user/" + ms + '_' + file.name;
        fs.renameSync(file.path, url);


    }).on('end', function () {
        var xlsx = require('node-xlsx');
        //读取文件内容
        var obj = xlsx.parse(url);
        var excelObj=obj[0].data;
        // userService.insertUsers(excelObj,sys_id, function(result){
        //     console.log(result);
        //     utils.respJsonData(res, result);
        // });

        userService.insertUsers(excelObj,sys_id).then(function(result){
            utils.respJsonData(res, result);
        }).catch(function(err){
            utils.respJsonData(res, err);
        })
    });
    form.parse(req, function(err, fields, files) {
        err && console.log('formidabel error : ' + err);

        console.log('parsing done');
    });

});
module.exports = router;

/**
 * Created by ShiHukui on 2016/2/19.
 */
var express = require('express');
var router = express.Router();


var utils = require('../../../common/core/utils/app_utils');
var userService = require('../services/user_service');

router.route('/')
    .get(function(req,res){
        // 分页条件
        var filter_name = req.query.filter_name;
        var filter_sys = req.query.filter_sys;
        var filter_org = req.query.filter_org;

        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        // or 查询
        if(filter_name){
            conditionMap['$or'] = [{'login_account':new RegExp(filter_name)},{'user_name':new RegExp(filter_name)}];
        }
        if(filter_sys) {
            conditionMap.user_sys = filter_sys;
        }
        if(filter_org && filter_org != '请选择机构/部门') {
            conditionMap.user_org = filter_org;
        }

        // 调用分页
        userService.getUserList(page, length, conditionMap,  function(result){

            utils.respJsonData(res, result);
        });
    })

    .post(function(req,res){
        // 获取提交信息
        var login_account = req.body.login_account;
        var user_no = req.body.user_no;
        var user_name = req.body.user_name;
        var user_gender = req.body.user_gender;
        var user_phone = req.body.user_phone;
        var user_email = req.body.user_email;
        var user_status = req.body.user_status;
        //var user_orgs = req.body.user_orgs;
        var user_sys = req.body.user_sys;
        // 数组特殊处理
        //var user_org = user_orgs.split(',');
        var user_org = req.body.user_roles ? [req.body.user_org] : req.body['user_org[]'];
        var user_role = req.body.user_roles ? [req.body.user_roles] : req.body['user_roles[]'];//只选一个角色时req.body.user_roles有值，req.body['user_roles[]']为undefined，选多个角色时相反
        // var user_role = (req.body.user_roles && req.body.user_roles instanceof Array) ? req.body.user_roles : [req.body.user_roles];// : req.body['user_roles[]'];
        var user_duties = (req.body.user_duties && req.body.user_duties instanceof Array) ? req.body.user_duties : [req.body.user_duties];// ? [req.body.user_duties] : req.body['user_duties[]'];

        // 验证
        if(!login_account) {
            utils.respMsg(res, false, '2001', '登陆账号不能为空。', null, null);
        }
        if(!user_sys) {
            utils.respMsg(res, false, '2002', '归属系统不能为空。', null, null);
        }
        if(!user_status) {
            utils.respMsg(res, false, '2003', '状态不能为空。', null, null);
        }
        if(!user_role) {
            utils.respMsg(res, false, '2004', '拥有角色不能为空。', null, null);
        }
        if(!user_no) {
            utils.respMsg(res, false, '2005', '用户编号不能为空。', null, null);
        }
        if(!user_name) {
            utils.respMsg(res, false, '2006', '用户姓名不能为空。', null, null);
        }
        if(!user_org) {
            utils.respMsg(res, false, '2007', '所在机构/部门不能为空1。', null, null);
        }
        if(!user_gender) {
            utils.respMsg(res, false, '2008', '所在机构/部门不能为空。', null, null);
        }
        // 验证通过组装数据
        var data = {};
        data.login_account = login_account;
        data.user_status = parseInt(user_status);
        data.user_no = user_no;
        data.user_name = user_name;
        data.user_gender = parseInt(user_gender);
        data.user_roles = new Array();
        data.user_org = new Array();
        if(user_phone){
            data.user_phone = user_phone;
        }
        if(user_email){
            data.user_email = user_email;
        }
        if(user_duties) {
            data.user_duties = user_duties;
        }
        else {
            data.user_duties = [];
        }
        userService.saveUser(data, user_sys, user_role, user_org, function(result) {
            utils.respJsonData(res, result);
        });
    });

/**
 * 获取角色数据
 */
router.route('/getRoleData/:sysid')
    .get(function(req,res){
        var sysid = req.params.sysid;
        if(sysid) {
            userService.getRoleBySys(sysid, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respJsonData(res, new Array());
        }
    });

/**
 * 获取角色数据
 */
router.route('/resetpwd/:id')
    .get(function(req,res){
        var id = req.params.id;
        if(id) {
            userService.resetPwd(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '2000', '用户ID不能为空。', null, null);
        }
    });

router.route('/:id')
    .put(function(req,res){

        // 获取提交信息
        var id = req.params.id;

        var login_account = req.body.login_account;
        var user_no = req.body.user_no;
        var user_name = req.body.user_name;
        var user_gender = req.body.user_gender;
        var user_phone = req.body.user_phone;
        var user_email = req.body.user_email;
        var user_status = req.body.user_status;
        // var user_orgs = req.body.user_orgs;
        var user_sys = req.body.user_sys;
        // 数组特殊处理
        //var user_org = user_orgs.split(',');
        var user_org = req.body.user_roles ? [req.body.user_org] : req.body['user_org[]'];
        var user_role = req.body.user_roles ? [req.body.user_roles] : req.body['user_roles[]'];//只选一个角色时req.body.user_roles有值，req.body['user_roles[]']为undefined，选多个角色时相反
        // var user_role = (req.body.user_roles && req.body.user_roles instanceof Array) ? req.body.user_roles : [req.body.user_roles];
        console.log("sssssssssssssssssssssssss1",user_org);
        var user_duties = (req.body.user_duties && req.body.user_duties instanceof Array) ? req.body.user_duties : [req.body.user_duties];

        // 验证
        if(!id) {
            utils.respMsg(res, false, '2000', 'ID不能为空。', null, null);
        }
        if(!login_account) {
            utils.respMsg(res, false, '2001', '登陆账号不能为空。', null, null);
        }
        if(!user_sys) {
            utils.respMsg(res, false, '2002', '归属系统不能为空。', null, null);
        }
        if(!user_status) {
            utils.respMsg(res, false, '2003', '状态不能为空。', null, null);
        }
        if(!user_role) {
            utils.respMsg(res, false, '2004', '拥有角色不能为空。', null, null);
        }
        if(!user_no) {
            utils.respMsg(res, false, '2005', '用户编号不能为空。', null, null);
        }
        if(!user_name) {
            utils.respMsg(res, false, '2006', '用户姓名不能为空。', null, null);
        }
        if(!user_org) {
            utils.respMsg(res, false, '2007', '所在机构/部门不能为空。', null, null);
        }
        if(!user_gender) {
            utils.respMsg(res, false, '2008', '所在机构/部门不能为空。', null, null);
        }
        // 验证通过组装数据
        var data = {};
        data.login_account = login_account;
        data.user_status = parseInt(user_status);
        data.user_no = user_no;
        data.user_name = user_name;
        data.user_gender = parseInt(user_gender);
        data.user_roles = new Array();
        data.user_org = new Array();
        if(user_phone){
            data.user_phone = user_phone;
        }
        if(user_email){
            data.user_email = user_email;
        }
        if(user_duties) {
            data.user_duties = user_duties;
        }
        else {
            data.user_duties = [];
        }
        userService.updateUser(id, data, user_sys, user_role, user_org, function(result) {
            utils.respJsonData(res, result);
        });
    })

    .get(function(req,res){
        var id = req.params.id;

        if(id) {
            userService.getUser(id, function(result){
                utils.respJsonData(res, result);
            });
        }
        else {
            utils.respMsg(res, false, '2000', '用户ID不能为空。', null, null);
        }
    });

/**
 * 下载账号模板
 */
router.route('/download/templetFile')
    .get(function(req,res){
        //下载
        console.log("开始下载...");
        res.download("../public/files/templet/user_templet.xlsx");
    });

/**
 * 上传账号信息
 */
router.route('/upload/userFile').post(function(req,res) {
    //下载
    console.log("开始上传...");
    var sys_id = req.query.sys_id;
    var crypto = require('crypto');
    var formidable = require('formidable'),
        util = require('util'), fs = require('fs');

    var form = new formidable.IncomingForm(), files = [], fields = [], docs = [];
    var url;

    //存放目录
    form.uploadDir = '../public/files/user';

    form.on('field', function (field, value) {

        fields.push([field, value]);

    }).on('file', function (field, file) {
        files.push([field, file]);
        docs.push(file);

        var types = file.name.split('.');
        var date = new Date();
        var ms = Date.parse(date);
        console.log("file:",file.path);
        url = "../public/files/user/" + ms + '_' + file.name;
        fs.renameSync(file.path, url);


    }).on('end', function () {
        var xlsx = require('node-xlsx');
        //读取文件内容
        var obj = xlsx.parse(url);
        var excelObj=obj[0].data;
        // userService.insertUsers(excelObj,sys_id, function(result){
        //     console.log(result);
        //     utils.respJsonData(res, result);
        // });

        userService.insertUsers(excelObj,sys_id).then(function(result){
            utils.respJsonData(res, result);
        }).catch(function(err){
            utils.respJsonData(res, err);
        })
    });
    form.parse(req, function(err, fields, files) {
        err && console.log('formidabel error : ' + err);

        console.log('parsing done');
    });

});
module.exports = router;

