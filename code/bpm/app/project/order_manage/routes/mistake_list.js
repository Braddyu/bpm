var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/mistake_list_service');
var dict_service = require('../../workflow/services/dict_service');
var config = require('../../../../config');
var xss = require('xss');

/**
 * 工单列表
 */

router.route('/list').post(function(req,res){
    console.log("开始获取所有工单列表...");
    var queryDate = req.body.queryDate;//查询时间
    var status = req.body.status;//查询状态
    var check_status= req.body.check_status;//稽核状态
    var business_name= req.body.business_name;//业务名称
    var city_code= req.body.city_code;//地州

    var page = req.body.page;
    var size = req.body.rows;
    var conditionMap = {}
    if(queryDate){
        conditionMap.mistake_time =queryDate.replace(/\-/g,'');
    }
    console.log(conditionMap.mistake_time,"==================");
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
router.route('/dispatch').post(function(req,resp){
    console.log("开始派单...");
    var queryDate = req.body.queryDate.replace(/\-/g,'');//查询时间
    var check_status= req.body.check_status;//稽核状态
    var business_name= req.body.business_name;//业务名称
    var city_code= req.body.city_code;//地州
    var mlog_id= req.body.mlog_id;//预先插入的日志ID
    var status= req.body.status;//派单状态
    if(!queryDate){
        var result={"success":false,"msg":"查询时间不得为空"};
        utils.respJsonData(res, result);
        return;
    }
    var user_no=req.session.current_user.user_no;
    var work_id=req.session.current_user.work_id;
    var user_name=req.session.current_user.user_name;
    var role_name=req.session.current_user.user_roles[0].role_name;

    var mlog_id ='';

    var datas = [];
    var data = {};
    data.proc_code = config.mistake_proc_code;
    data.proc_name = config.mistake_proc_name;
    data.dispatch_time = queryDate;
    data.create_user_no = work_id?work_id:user_no;
    data.create_user_name = user_name;
    data.update_user_no = '';
    data.dispatch_cond_one = check_status?check_status:'';
    data.dispatch_cond_thr = business_name?business_name:'';
    data.create_time = new Date();
    //0表示派单中，1表示：派单全部成ond_two = city_code?city_code:'';
    //     data.dispatch_c功。2表示：派单部分成功。3表示：派单全部失败。
    data.status = 0;
    data.dispatch_remark = '';
    datas.push(data);

    service.addMistakeLog(datas).then(function(result){
        mlog_id = result.data[0]._id.toString();
        service.getInterface(queryDate,data.dispatch_cond_one,user_no,user_name,role_name,data.dispatch_cond_thr,data.dispatch_cond_two,data.create_user_no,status,mlog_id).then(function(dispres){
            utils.respJsonData(resp, dispres);
        });
    });

})

/**
 * 根据条件查询是否有派单的日志
 */
router.route('/mistakelog').post(function(req,res){
    var queryDate = req.body.queryDate;//查询时间
    var city_code= req.body.city_code;//地市编码
    var check_status= req.body.check_status;//稽核状态
    var business_name= req.body.business_name;//业务名称
    var city_code= req.body.city_code;//地州
    var conditionMap = {};
    if(queryDate){
        conditionMap.dispatch_time =queryDate.replace(/\-/g,'');
    }
    if(city_code){
        conditionMap.dispatch_cond_two=city_code;
    }
    if(check_status){
        conditionMap.dispatch_cond_one=check_status;
    }
    if(business_name){
        conditionMap.dispatch_cond_thr=business_name;
    }
    conditionMap.proc_code = config.mistake_proc_code;
    conditionMap.proc_name = config.mistake_proc_name;
    service.dispatch_logs_date(conditionMap).then(function (result) {
        utils.respJsonData(res, result);
    }).catch(function(err){
        console.log('获取所有工单列表失败',err);

    });
});

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

    var city_code = req.body.city_code;
    var work_order_number = req.body.work_order_number;

    var conditionMap = {}
    if(city_code){
        conditionMap['statistics.city_code']=city_code;
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

    var city_code = req.query.city_code;
    var work_order_number = req.query.work_order_number;

    var conditionMap = {}

    if(city_code){
        conditionMap['statistics.city_code']=city_code;
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

/**
 * 开启差错工单派单定时任务
 */
router.route("/openTask").post(function(req,res){
    //var query_date = req.body.query_date.replace(/\-/g,'');;
    var check_status = req.body.check_status;
    var business_name = req.body.business_name;
    var city_code = req.body.city_code;
    var work_order_number = req.body.work_order_number;
    var params = {};
    /*if (query_date){
        params['query_date'] = query_date;
    }else{
        params['query_date'] = "";
    }*/
    if(check_status && 0!=check_status){
        params['check_status'] = check_status;
    }else{
        params['check_status'] = "";
    }
    if (business_name && 0!=business_name) {
        params['business_name'] = business_name;
    }else{
        params['business_name'] = "";
    }
    if (city_code && 0!=city_code) {
        params['city_code'] = city_code;
    }else{
        params['city_code'] = "";
    }
    params['work_order_number'] = work_order_number;

    dict_service.openTask(params).then(function(result){
        if(result.success){
            utils.respJsonData(res,result);
        }
    });
});
/**
 * 关闭差错工单派单定时任务
 */
router.route("/closeTask").post(function(req,res){
    dict_service.closeTask().then(function(result){
        if(result.success){
            utils.respJsonData(res,result);
        }
    });
});
/**
 * 获取差错工单派单定时任务开关状态
 */
router.route("/getSwitch").get(function(req,res){
    dict_service.getSwitch().then(function(result){
        utils.respJsonData(res,result);
    });
});

/**
 * 获取筛选条件
 */
router.route("/getConditions").get(function(req,res){
    dict_service.getConditions().then(function(result){
        utils.respJsonData(res,result);
    });
});


/**
 * 获取黄河通过的差错工单
 */
router.route("/getHuanghePassOrder").post(function(req,res){
    console.log("开始获取黄河通过工单..");
    let beginDate= req.body.beginDate;
    let endDate= req.body.endDate;
    let dataCount= req.body.dataCount;
    let tradeTypeCode= req.body.tradeTypeCode;
    service.getHuanghePassOrderList(beginDate,endDate,dataCount,tradeTypeCode)
        .then(function(result){
            utils.respJsonData(res, result);
        }) .catch(function(err){
        utils.respJsonData(res, err);
    });
});

router.route("/huangheFileDownload/:tradeId").get(function(req,res){
    console.log("开始下载黄河附件..");
    let tradeId= req.params.tradeId;
    service.huangheFileDownload(tradeId)
        .then(function(buffer){

            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=' + tradeId + '.pdf'
            );
            res.end(buffer, 'binary');
        }) .catch(function(err){
        utils.respJsonData(res, err);
    });
});

module.exports = router;
