var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var service = require('../service/suggestion_servie');
var utils = require('../../../../lib/utils/app_utils');

/***
 * 意见填写的跳转页面
 */
router.route('/list').get(function(req,res){
    console.log(req.session.current_user);
    res.render(config.project.appviewurl+'/project/suggestion/suggestion',{
        title: '意见填写' ,
        subtitle: 'Hello',
        layout:'themes/admin/layout',
        currentUser:req.session.current_user
    });
});
/***
 * 添加意见的路由
 */
router.route('/insert').post(function(req,res){
    var user_name= req.body.user_name;//用户名
    var user_tel = req.body.user_tel;//用户电话
    var user_org = req.body.user_org;//用户机构
    var user_title = req.body.user_title;//建议标题
    var suggestion_contents = req.body.suggestion_contents;//建议内容
    var rewMap={};
    rewMap.user_name=user_name;
    rewMap.user_tel =user_tel;
    rewMap.user_org =user_org;
    rewMap.suggestion_title =user_title;
    rewMap.suggestion_contents =suggestion_contents;

    try{
        service.create_sugg(rewMap).then(function(rs){
            utils.respJsonData(res,rs);
        });
    }catch (err){
        console.log(err)
        utils.respJsonData(res,{"data":null,"error":err,"success":false,"code":'2000','msg':"查询数据库错误"})
    }
    //res.send("shefas");
});

//当用户登陆时候取得所有的 用户信息
router.route('/find').post(function(req,res){
    var user_no=req.body.user_no;
    console.log(user_no)
    if(user_no){
        try{
            service.find_org(user_no).then(function(rs){
                utils.respJsonData(res,rs)
            })
        }catch (err) {
            console.log(err)
            resolve({"data":null,"success":false,"code":'1000','msg':"查询用户错误","error":err})
        }
    }else{
        resolve({"data":null,"success":false,"code":'1000','msg':"用户编号不能为空"})
    }

})

/**
 * 查询&搜索建议数据
 */

router.route("/find_user").post(function(req,res){
    try{
        service.find_user().then(function(rs){
            utils.respJsonData(res,rs);
        })
    }catch (err){
        console.log(err);
        utils.respJsonData(res,{"data":null,"success":false,"code":"2000","error":err,"msg":"查询数据错误"})
    }
})

//查询意见建议列表
router.route("/suggestion_list").post(function(req,res){
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++343443",)
    var condition={};
    var page = req.body.page;
    var size = req.body.rows;
    var handler_name=req.body.handler_name;
    var user_name=req.body.user_name;
    var start_date=req.body.start_date;
    var end_date=req.body.end_date;
    var handle_status=req.body.handle_status

    //处理状态参数
    if(handle_status){
        condition.handle_status=handle_status;
    }
    //处理人参数
    if(handler_name){
        condition.handler_name=handler_name;
    }
    //意见发起人参数
    if(user_name){
        condition.user_name=user_name;
    }
    var com={};
    if(start_date){
        com["$get"]=start_date
    }
    if(end_date){
        com["$lt"]=end_date
    }
    if(com.length){
        condition.create_date=com;
    }

    console.log("#################################################3")
    service.find_sugg(condition,page,size).then(function(rs){
        console.log("_______________________________________________")
        // console.log(rs);
        utils.respJsonData(res,rs);
    }).catch(function(err) {
        console.log(err);
        utils.respJsonData(res, {"data": null, "error": err, "code": "2000", "msg": "查询数据错误", "success": false});
    })
})
//检测权限
router.route("/check_power").post(function(req,res){
    if(req.session.current_user_role.role_level=='1'){
        utils.respJsonData(res,{"isAdmin":true});
    }else{
        utils.respJsonData(res,{"isAdmin":false});
    }
})
//更新处理建议意见反馈
router.route("/update_suggestion").post(function(req,res){
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body)
    var _id=req.body._id;
    var handle_contents=req.body.handle_contents;
    console.log(req.body)
    var condition={};

    if(_id){
        condition._id=_id;
    }else{
        utils.respJsonData(res,{"error":null,"data":null,"code":"2000","msg":"id不能为空","success":false})
    }
    service.update_suggestion(condition,handle_contents).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err){
        utils.respJsonData(res,{"error":err,"data":null,"code":"1000","msg":"更新数据错误","success":false})
    })
})


//删除意见建议数据 通过_id
router.route("/deleteById").post(function(req,res){
    console.log(req.body,"+++++++++++++++")
    var _id=req.body._id;
    if(!_id){
     utils.respJsonData(res,{"error":null,"data":null,"code":"2000","msg":"id不能为空","success":false});
     return ;
    }
    service.deleteByIdService(_id).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err){
        utils.respJsonData(res,{"error":err,"data":null,"code":"1000","msg":"删除数据错误","success":false})

    })
})


module.exports = router;
