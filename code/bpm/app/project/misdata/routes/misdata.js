var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/misdata_service');
var path = require('path');
var fs = require('fs');
var urlencode = require('urlencode');
/**
 * 一个网格多个网格经理
 */
router.route('/misdataList').post(function(req,res){
    var page = req.body.page;
    var size = req.body.rows;
    var condition={};
    console.log("333");
    service.getGriddingList(condition,page,size).then(function (taskresult) {
       utils.respJsonData(res, taskresult);
    })
})

/**
 * 导出一个网格多个网格经理查询出来的数据
 */
router.route('/export_excel_misdata').get(function(req,res){
    console.log("开始获取列表数据...");
    service.getGriddingList().then(service.createExcelOrderList_misdata).then(excelBuf=>{
        const date = new Date();
        const filename ='一个网格多个网格经理'+date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + date.getDate()+ '.xlsx';
        // 解决不同浏览器下载文件名称乱码
        var userAgent = (req.headers['user-agent']||'').toLowerCase();
        res.set('Content-Type', 'application/octet-stream;charset=utf-8');
        if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
        } else if(userAgent.indexOf('firefox') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
        } else {
            res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
        }
        res.end(excelBuf, 'binary');
    }).catch(e=>{
        console.log('ERROR: export_excel');
        console.error(e);
        utils.respJsonData(res, {
            error: '服务器出现了问题，请稍候再试'
        });
    })
})

//网格经理-营业员同一工号不同手机号
router.route('/jobNumberList').post(function(req,res){
    var page = req.body.page;
    var size = req.body.rows;
    var condition={};
    service.getJobNumberList(condition,page,size).then(function (taskresult) {
        utils.respJsonData(res, taskresult);
    })
})

/**
 * 导出网格经理-营业员同一工号不同手机号查询出来的数据
 */
router.route('/export_excel_jobNumber').get(function(req,res){
    console.log("开始获取列表数据...");
    service.getJobNumberList().then(service.createExcelOrderList_jobNumber).then(excelBuf=>{
        const date = new Date();
        const filename ='网格经理-营业员同一工号不同手机号'+date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + date.getDate()+ '.xlsx';
        // 解决不同浏览器下载文件名称乱码
        var userAgent = (req.headers['user-agent']||'').toLowerCase();
        res.set('Content-Type', 'application/octet-stream;charset=utf-8');
        if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
        } else if(userAgent.indexOf('firefox') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
        } else {
            res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
        }
        res.end(excelBuf, 'binary');
    }).catch(e=>{
        console.log('ERROR: export_excel');
        console.error(e);
        utils.respJsonData(res, {
            error: '服务器出现了问题，请稍候再试'
        });
    })
})

//厅经理-营业员同一渠道同一姓名不同手机号
router.route('/mobilePhoneList').post(function(req,res){
    var page = req.body.page;
    var size = req.body.rows;
    var condition={};
    service.getMobilePhoneList(condition,page,size).then(function (taskresult) {
        utils.respJsonData(res, taskresult);
    })
})

/**
 * 导出厅经理-营业员同一渠道同一姓名不同手机号查询出来的数据
 */
router.route('/export_excel_mobile').get(function(req,res){
    console.log("开始获取列表数据...");
    service.getMobilePhoneList().then(service.createExcelOrderList_mobile).then(excelBuf=>{
        const date = new Date();
        const filename ='厅经理-营业员同一渠道同一姓名不同手机号'+date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + date.getDate()+'.xlsx';
        // 解决不同浏览器下载文件名称乱码
        var userAgent = (req.headers['user-agent']||'').toLowerCase();
        res.set('Content-Type', 'application/octet-stream;charset=utf-8');
        if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
        } else if(userAgent.indexOf('firefox') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
        } else {
            res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
        }
        res.end(excelBuf, 'binary');
    }).catch(e=>{
        console.log('ERROR: export_excel');
        console.error(e);
        utils.respJsonData(res, {
            error: '服务器出现了问题，请稍候再试'
        });
    })
})


//网格经理工号为空
router.route('/gridManagerList').post(function(req,res){
    var page = req.body.page;
    var size = req.body.rows;
    var condition={};
    service.getGridManagerList(condition,page,size).then(function (taskresult) {
        utils.respJsonData(res, taskresult);
    })
})
/**
 * 导出厅经理-营业员同一渠道同一姓名不同手机号查询出来的数据
 */
router.route('/export_excel_gridManager').get(function(req,res){
    console.log("开始获取列表数据...");
    service.getGridManagerList().then(service.createExcelOrderList_gridManager).then(excelBuf=>{
        const date = new Date();
        const filename ='网格经理工号为空'+date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + date.getDate()+'.xlsx';
        // 解决不同浏览器下载文件名称乱码
        var userAgent = (req.headers['user-agent']||'').toLowerCase();
        res.set('Content-Type', 'application/octet-stream;charset=utf-8');
        if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
        } else if(userAgent.indexOf('firefox') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
        } else {
            res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
        }
        res.end(excelBuf, 'binary');
    }).catch(e=>{
        console.log('ERROR: export_excel');
        console.error(e);
        utils.respJsonData(res, {
            error: '服务器出现了问题，请稍候再试'
        });
    })
})


//厅经理手机号为空
router.route('/hallManagerInfoList').post(function(req,res){
    var page = req.body.page;
    var size = req.body.rows;
    var condition={};
    service.gethallManagerInfoList(condition,page,size).then(function (taskresult) {
        utils.respJsonData(res, taskresult);
    })
})
/**
 * 厅经理手机号为空
 */
router.route('/export_excel_hallManager').get(function(req,res){
    console.log("开始获取列表数据...");
    service.gethallManagerInfoList().then(service.createExcelOrderList_hallManager).then(excelBuf=>{
        const date = new Date();
        const filename ='厅经理手机号为空'+date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + date.getDate()+ '.xlsx';
        res.setHeader('Content-Type','application/vnd.openxmlformats;charset=utf-8');
        // 解决不同浏览器下载文件名称乱码
        var userAgent = (req.headers['user-agent']||'').toLowerCase();
        res.set('Content-Type', 'application/octet-stream;charset=utf-8');

        if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
        } else if(userAgent.indexOf('firefox') >= 0) {
            res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"');
        } else {
            res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
        }
        res.end(excelBuf, 'binary');
    }).catch(e=>{
        console.log('ERROR: export_excel');
        console.error(e);
        utils.respJsonData(res, {
            error: '服务器出现了问题，请稍候再试'
        });
    })
})

module.exports = router;
