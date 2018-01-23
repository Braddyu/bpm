var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/mistake_list_service');
var xss = require('xss');

/**
 * 工单列表
 */
// router.use(function (req, res, next) {
//     console.log(req.headers);
//
//     console.log(req.query,req.body,req.params);
//
//     //反正XSS攻击，过滤html字符，处理get请求
//     if(req.query){
//         var query=req.query;
//         for(let item in query){
//             req.query[item]=xss(query[item])
//         }
//     }
//     //处理post请求
//     if(req.body){
//         var body=req.body;
//         for(let item in body){
//             req.body[item]=xss(body[item])
//         }
//     }
//     next();
// });
router.route('/list').post(function(req,res){
    console.log("开始获取所有工单列表...");
    var queryDate = req.body.queryDate;//查询时间
    var status = req.body.status;//查询状态
    var city_code= req.body.city_code;//地市编码
    var check_status= req.body.check_status;//稽核状态
    var page = req.body.page;
    var size = req.body.rows;
    var conditionMap = {}
    if(queryDate){
        conditionMap.mistake_time =queryDate.replace(/\-/g,'');
    }
    if(status){
        status=status.split(",");
        conditionMap.status={$in:status};
    }
    if(city_code){
        conditionMap.city_code=city_code;
    }
    if(check_status){
        conditionMap.check_status=check_status;
    }
    console.log("conditionMap",conditionMap);
    // 调用分页
    service.getMistakeListPage(page,size,conditionMap)
        .then(function(result){
            console.log("获取所有工单列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取所有工单列表失败',err);

        });
})


/**
 * 差错工单派单
 */
router.route('/dispatch').post(function(req,res){
    console.log("开始派单...");
    var queryDate = req.body.queryDate.replace(/\-/g,'');//查询时间
    if(!queryDate){
        var result={"success":false,"msg":"查询时间不得为空"};
        utils.respJsonData(res, result);
        return;
    }
    var user_no=req.session.current_user.user_no;
    var user_name=req.session.current_user.user_name;
    var role_name=req.session.current_user.user_roles[0].role_name;

   // 调用分页
    service.dispatch(queryDate,user_no,user_name,role_name)
        .then(function(result){
            console.log("派发工单成功",result);
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            utils.respJsonData(res, err);
            console.log('派发工单失败',err);

        });
})
/**
 * 派单日志
 */
router.route('/dispatch_logs').post(function(req,res){
    console.log("开始获取派单日志...");
    var queryDate = req.body.queryDate;//查询时间
    var status = req.body.status;
    var page = req.body.page;
    var size = req.body.rows;
    console.log("queryDate",req.body);
    console.log("page",page);
    console.log("size",size);
    var conditionMap = {}
    if(queryDate){
        conditionMap.dispatch_time = queryDate.replace(/\-/g,'') ;
    }
    if(status){
        conditionMap.status =status;
    }
    // 调用分页
    service.dispatch_logs(page,size,conditionMap)
        .then(function(result){
            console.log("获取派单日志成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('派发工单失败',err);
            utils.respJsonData(res, err);


        });
})


module.exports = router;
