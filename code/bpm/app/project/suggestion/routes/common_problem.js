/*
 * 常见问题Route
 */
var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var service = require('../service/common_problem_service');
var utils = require('../../../../lib/utils/app_utils');

//添加常见问题
router.route('/saveCommProblem').post(function(req,res){
    var suggestion_title= req.body.suggestion_title;//标题
    var answer = req.body.answer;//解答
    var commonProblemMap={};
    commonProblemMap.suggestion_title=suggestion_title;
    commonProblemMap.answer =answer;
    var userName = req.session.current_user.user_name;
    commonProblemMap.creator = userName;
    commonProblemMap.create_time = new Date();
    commonProblemMap.update_by = "";
    commonProblemMap.update_time = "";
    try{
        service.add_common_problem(commonProblemMap).then(function(rs){
            utils.respJsonData(res,rs);
        });
    }catch (err){
        console.log(err)
        utils.respJsonData(res,{"data":null,"error":err,"success":false,"code":'2000','msg':"保存问答错误"})
    }
    //res.send("shefas");
});

//列出常见问题
router.route("/list_answers").post(function(req,res){
    var condition={};
    var suggestion_title = req.body.suggestion_title;
    if (suggestion_title) {
        condition.suggestion_title = suggestion_title;
    }
    var page = req.body.page;
    var size = req.body.rows;
    service.list_answers(condition,page,size).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err) {
        console.log(err);
        utils.respJsonData(res, {"data": null, "error": err, "code": "2000", "msg": "查询数据错误", "success": false});
    })
});

//删除常见问题
router.route("/deleteById").post(function(req,res){
    var _id=req.body._id;
    if(!_id){
        utils.respJsonData(res,{"error":null,"data":null,"code":"2000","msg":"id不能为空","success":false});
        return ;
    }
    service.deleteById(_id).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err){
        utils.respJsonData(res,{"error":err,"data":null,"code":"1000","msg":"删除数据出错","success":false})

    })
})
//修改常见问题
router.route("/update_problem").post(function(req,res){
    var _id=req.body._id;
    var suggestion_title=req.body.suggestion_title;
    var answer = req.body.answer;
    var params = {};
    var condition={};
    if(_id){
        condition._id=_id;
        params.suggestion_title = suggestion_title;
        params.answer = answer;
        params.update_by = req.session.current_user.user_name;
    }else{
        utils.respJsonData(res,{"error":null,"data":null,"code":"2000","msg":"id不能为空","success":false})
    }
    service.update_problem(condition,params).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err){
        utils.respJsonData(res,{"error":err,"data":null,"code":"1000","msg":"更新数据出错","success":false})
    })
})

module.exports = router;
