var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/mistake_list_service');
var xss = require('xss');

/**
 * 工单列表
 */

router.route('/list').post(function(req,res){
    console.log("开始获取所有工单列表...");
    var queryDate = req.body.queryDate;//查询时间
    var status = req.body.status;//查询状态
    var city_code= req.body.city_code;//地市编码
    var check_status= req.body.check_status;//稽核状态
    var business_name= req.body.business_name;//业务名称
    var city_code= req.body.city_code;//地州

    var page = req.body.page;
    var size = req.body.rows;
    var conditionMap = {}
    if(queryDate){
        conditionMap.mistake_time =queryDate.replace(/\-/g,'');
    }
    if(status){
        var dataIntArr=[]
        status=status.split(",").forEach(function(data,index,arr){
            dataIntArr.push(+data);
        });  ;
        conditionMap.status={$in:dataIntArr};
    }else{
        conditionMap.status={$nin:[-2]};
    }
    if(city_code){
        conditionMap.city_code=city_code;
    }
    if(check_status){
        conditionMap.remark=check_status;
    }
    if(business_name){
        conditionMap.business_name=business_name;
    }
    if(city_code){
        conditionMap.city_code=city_code;
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
    var check_status= req.body.check_status;//稽核状态
    var business_name= req.body.business_name;//业务名称
    var city_code= req.body.city_code;//地州
    if(!queryDate){
        var result={"success":false,"msg":"查询时间不得为空"};
        utils.respJsonData(res, result);
        return;
    }
    var user_no=req.session.current_user.user_no;
    var user_name=req.session.current_user.user_name;
    var role_name=req.session.current_user.user_roles[0].role_name;

    // 调用分页
    service.dispatch(queryDate,check_status,user_no,user_name,role_name,business_name,city_code)
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
 * 删除
 */
router.route('/remove').post(function(req,res){
    console.log("开始删除...");
    var ids = req.body.ids;
    console.log(ids);
    // 开始删除
  service.remove(ids)
        .then(function(result){
            console.log("删除成功",result);
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

/**
 * 超时工单
 */
router.route('/overtimeList').post(function(req,res){
    console.log("开始超时工单...");
    var page = req.body.page;
    var size = req.body.rows;
    var check_status = req.body.check_status;
    var business_name = req.body.business_name;
    var city_code = req.body.city_code;
    var work_order_number = req.body.work_order_number;

    var conditionMap = {}
    if(check_status){
        conditionMap['mistake.remark']=check_status;
    }
    if(business_name){
        conditionMap['mistake.business_name']=business_name;
    }
    if(city_code){
        conditionMap['mistake.city_code']=city_code;
    }
    // 调用分页
    service.overtimeList(page,size,conditionMap,work_order_number)
        .then(function(result){
            console.log("获取派超时工单");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('超时工单失败',err);
            utils.respJsonData(res, err);


        });
})

/**
 *  导出超时工单
 */
router.route('/export_overtimeList').get(function(req,res){
    console.log("开始超时工单...");
    var page = req.body.page;
    var size = req.body.rows;
    var check_status = req.body.check_status;
    var business_name = req.body.business_name;
    var city_code = req.body.city_code;
    var work_order_number = req.body.work_order_number;

    var conditionMap = {}
    if(check_status){
        conditionMap['mistake.remark']=check_status;
    }
    if(business_name){
        conditionMap['mistake.business_name']=business_name;
    }
    if(city_code){
        conditionMap['mistake.city_code']=city_code;
    }
    // 调用分页
    service.export_overtimeList(page,size,conditionMap,work_order_number)
        .then(service.createExcelOvertimeList)
        .then(excelBuf=>{
            const date = new Date();
            const filename =
                date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + date.getDate();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + filename + '.xlsx'
            );
            res.end(excelBuf, 'binary');
        })
        .catch(e=>{
            console.log('ERROR: export_excel');
            console.error(e);
            utils.respJsonData(res, {
                error: '服务器出现了问题，请稍候再试'
            });
        })
})

module.exports = router;
