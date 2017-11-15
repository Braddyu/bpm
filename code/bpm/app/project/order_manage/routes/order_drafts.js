var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_drafts_service');
var formidable=require("formidable");

/**
 * 获取我的草稿箱列表
 */
router.route('/list').post(function(req,res){
    console.log("开始获取我的草稿箱....")
    // 获取提交信息
    var userNo = req.session.current_user.user_no;//用户编号
    var page = req.body.page;//页码
    var rows = req.body.rows;//每页条数
    var conditionMap = {dtafts_user:userNo};
    console.log("用户编号",userNo);
    // 调用分页
    service.getDraftsListPage(page,rows,conditionMap)
        .then(function(result){
            console.log("获取我的草稿箱列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取我的草稿箱列表失败',err);

        });
});

/**
 * 暂存草稿箱
 */
router.route('/saveDrafts').post(function(req,res){
    console.log("开始保存我的草稿箱....")
    // 获取提交信息
    var userNo = req.session.current_user.user_no;//用户编号
    var userName = req.session.current_user.user_name;//用户编号

    var _id=req.body._id;
    //工单标题
    var proc_title=req.body.proc_title;
    //工单类型/流程名称
    var proc_name=req.body.proc_name;
    //工单类型/流程编码
    var proc_code=req.body.proc_code;
    //工作天数
    var proc_work_day=req.body.proc_work_day;
    //派单内容
    var proc_content=req.body.proc_content;
    //处理意见
    var proc_inst_task_remark=req.body.proc_inst_task_remark;

    var drafts={};

    drafts.proc_title=proc_title;
    drafts.dtafts_user=userNo;
    drafts.dtafts_user_name=userName;
    drafts.proc_code=proc_code;
    drafts.proc_name=proc_name;
    drafts.proc_content=proc_content;
    drafts.proc_work_day=proc_work_day;
    drafts.dtafts_create_time=new Date();

    console.log("用户编号",drafts);
    // 调用分页
    service.saveDrafts(drafts,_id)
        .then(function(result){
            console.log("获取我的草稿箱列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取我的草稿箱列表失败',err);

        });
});

/**
 * 删除我的草稿
 */
router.route('/deleteDrafts').post(function(req,res){
    console.log("开始删除草稿....")
    var _id=req.body._id;
    // 删除草稿
    service.deleteDrafts(_id)
        .then(function(result){
            console.log("获取我的草稿箱列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取我的草稿箱列表失败',err);

        });
});

module.exports = router;
