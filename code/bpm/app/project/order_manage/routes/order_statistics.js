/**
 * 预警工单，差错工单统计
 * @type {*|youjian}
 *
 */
var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var memcached_utils = require('../../../../lib/memcached_utils.js');
var service = require('../services/order_statistics_service');

/**
 * 统计列表
 */
router.route('/list').post(function(req,res){
    console.log("开始获取统计列表...",req.body);
    var org_id = req.body.org_id.split(",");//机构编号
    var proc_code = req.body.proc_code;//流程编号
    var level = req.body.level;//机构等级
    var status = req.body.status;//是否返回到当前所在机构
    var startDate = req.body.startDate;//开始插入时间
    var endDate = req.body.endDate;//结束插入时间
    var areaCode = req.body.area_code;// 区域编码
    var channel_enterprise_type = req.body.channel_enterprise_type;//渠道类型 0:实体  1：政企
    console.log("params",org_id,proc_code,level,status,startDate,endDate,areaCode,channel_enterprise_type);
    // 调用分页
    service.getStatisticsListPage(org_id,proc_code,level,status,startDate,endDate,channel_enterprise_type)
        .then(function(result){
           //  console.log("获取所有工单列表成功",result);channel_enterprise_type
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取所有工单列表失败',err);
            var data={rows:[],success:true};
            utils.respJsonData(res, data);
        });
})

/**
 * 导出工单统计查询出来的数据
 */
router.route('/export_excel').get(function(req,res){
    console.log("开始导出统计列表...");
    var org_id = req.query.org_id.split(",");//机构编号
    var proc_code = req.query.proc_code;//流程编号
    var level = req.query.level;//机构等级
    var status = req.query.status;//是否返回到当前所在机构
    var startDate = req.query.startDate;//开始插入时间
    var endDate = req.query.endDate;//结束插入时间
    var areaCode = req.query.area_code;// 区域编码

    // 调用分页
    service.getStatisticsListPage(org_id,proc_code,level,status,startDate,endDate)
        .then(service.createExcelOrderList)
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
 * 上级机构
 */
router.route('/pre_org').post(function(req,res){
    console.log("开始上级机构...");
    var org_id = req.body.org_id;//机构编号
    console.log("params",org_id);
    // 调用分页
    service.pre_org(org_id)
        .then(function(result){
           console.log("获取上级机构成功",result);
           utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取上级机构失败',err);
            utils.respJsonData(res, err);

        });
})

/**
 * 获取工单明细列表
 */
router.route('/detail_list').post(function(req,res){
    let start =new Date().getTime();
    console.log("获取工单明细列表1...");
    var org_id = req.body.org_id;//机构编号
    var page = req.body.page;//页码
    var size = req.body.rows;//每页大小
    var level = req.body.level;//区域等级
    var status = req.body.status;//查询状态,1:为总数，2：归档数 3:未超时
    var proc_code = req.body.proc_code;//流程编号
    // var dispatch_time = req.body.dispatch_time;//派单时间
    var startDate = req.body.startDate;//开始插入时间
    var endDate = req.body.endDate;//结束插入时间
    var channel_enterprise_type = req.body.channel_enterprise_type;//查询渠道类型
    console.log("params",org_id,level,status,proc_code,startDate,endDate);
    // 调用分页
    service.detail_list(page,size,org_id,level,status,proc_code,startDate,endDate,"","","","",channel_enterprise_type)
        .then(function(result){
            let end =new Date().getTime();
            console.log(end-start,"ms");
            utils.respJsonData(res, result);

        })
        .catch(function(err){
            console.log('获取信息失败',err);
            utils.respJsonData(res, err);

        });
})
/**
 * 获取渠道详情
 */
router.route('/channel_detail_list').post(function(req,res){
    console.log("获取工单明细列表2...");
    let start = new Date().getTime()
    var page = req.body.page;//页码
    var size = req.body.rows;//每页大小
    var status = req.body.status;//查询状态,1:为总数，2：归档数
    var proc_code = req.body.proc_code;//流程编号
  //  var dispatch_time = req.body.dispatch_time;//派单时间
    var proc_inst_task_type = req.body.proc_inst_task_type;//工单状态
    var startDate = req.body.startDate;//开始插入时间
    var endDate = req.body.endDate;//结束插入时间
    var work_order_number = req.body.work_order_number;//工单编号
    var channel_code = req.body.channel_code;//渠道编码
    var channel_work_id = req.body.channel_work_id;//被派渠道BOSS工号
    var user_org=req.session.current_user.user_org;
    var user_no=req.session.current_user.user_no;
    console.log("params",status,proc_code,startDate,endDate,page,size,proc_inst_task_type);
    service.local_user(user_org,user_no)
        .then(function(result){
            if(result.success){
                let level = result.data.level;
                let org_id = result.data.org_id;
                console.log(org_id,level);
                // 调用分页
                service.detail_list(page,size,org_id,level,status,proc_code,startDate,endDate,proc_inst_task_type,work_order_number,channel_code,channel_work_id)
                    .then(function(result){
                        let end = new Date().getTime()
                        console.log(end-start,"ms");
                        utils.respJsonData(res, result);
                    })
                    .catch(function(err){
                        console.log('获取列表失败');
                        var rows={rows:[],total:0,success:true}
                        utils.respJsonData(res, rows);

                    });
            }else{
                var rows={rows:[],total:0,success:true}
                utils.respJsonData(res, rows);
            }
        })
        .catch(function(err){
            console.log('获取当前登录机构失败',err);

        });


})

/**
 *导出详细资料
 */
router.route('/export_excel_detail').get(function(req,res){
    console.log("开始导出统计工单明细列表...");
    let start_time=new Date().getTime();
    var org_id = req.query.org_id;//机构编号
    var randomStr = req.query.randomStr;//随机数
    var proc_code = req.query.proc_code;//流程编号
    var level = req.query.level;//机构等级
    var status = req.query.status;//是否返回到当前所在机构
    var startDate = req.query.startDate;//开始插入时间
    var endDate = req.query.endDate;//结束插入时间
    var proc_inst_task_type = req.query.proc_inst_task_type;//工单状态
    var channel_code = req.query.channel_code;//渠道编码
    var channel_work_id = req.query.channel_work_id;//被派渠道BOSS工号
    var work_order_number = req.query.work_order_number;//工单号
    var channel_enterprise_type = req.query.channel_enterprise_type;//查询渠道类型
    console.log("params",org_id,proc_code,level,status,startDate,endDate);
    console.log("channel_work_id",channel_work_id,"channel_code",channel_code);

    var  istodo=req.query.todo;//是否所辖渠道点击
    //1：表示为所辖渠道点击
    if(istodo == 1){
        var user_org=req.session.current_user.user_org;
        var user_no=req.session.current_user.user_no;
        service.local_user(user_org,user_no)
            .then(function(result) {
                console.log(result)
                if (result.success) {
                    level = result.data.level;
                    org_id = result.data.org_id;
                    console.log("istodo:",istodo,org_id,level,"randomStr",randomStr)

                    // 调用分页
                    service.exportDetailList(org_id,proc_code,level,status,startDate,endDate,proc_inst_task_type,channel_code,channel_work_id,work_order_number,randomStr,channel_enterprise_type)
                        .then(service.createExcelOrderDetail)
                        .then(excelBuf=>{
                            let end_time=new Date().getTime();
                            console.log((end_time-start_time),'ms');
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
                }
            })
    }else{
        service.exportDetailList(org_id,proc_code,level,status,startDate,endDate,proc_inst_task_type,channel_code,channel_work_id,work_order_number,randomStr,channel_enterprise_type)
            .then(service.createExcelOrderDetail)
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
    }

})


/**
 * 获取当前登录用户的机构和级别
 */
router.route('/local_user').post(function(req,res){
    console.log("获取登录账号机构..");
    var user_org=req.session.current_user.user_org;
    var user_no=req.session.current_user.user_no;

    service.local_user(user_org,user_no)
        .then(function(result){
            console.log(result);
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取当前登录机构失败',err);

        });
})
/**
 * 获取Memcached中的值
 */
router.route('/getMemcachedValue').post(function(req,res){
    var randomStr = req.body.randomStr;//随机数
    memcached_utils.getVal(randomStr,function(err,res1){
        if(err){
            utils.respJsonData(res, {'success': false, 'code': '1000', 'msg': '获取Memcached失败', "error": null});
        }else{
           if(res1){
               utils.respJsonData(res, {'success': true, 'code': '1000', 'msg': '获取Memcached成功', 'data': res1,"error": null});
           }else{
               utils.respJsonData(res, {'success': true, 'code': '1000', 'msg': '不存在的值','data': 0, "error": null});
           }

        }

    })
})

/**
 * 获取派单量
 * @param monthArray :日期
 */
router.route('/getMonitoringView').post(function(req,res){
    var monthArray = req.body.monthArray;//当前月的所有日期
   // console.log(monthArray);
    service.getMonitoring(monthArray).then(function(result){
            console.log(result,"qqqqqqq");
            utils.respJsonData(res, result);
        }).catch(function(err){
            console.log('获取派单量失败',err);

        });
})

/**
 * 获取特定时间的派单量和归档量
 * @param today :派单时间
 */
router.route('/getArchiveView').post(function(req,res){
    var today = req.body.today;//当前月的所有日期
    console.log(today);
    service.getArchive(today).then(function(result){
        console.log(result,"321");
        utils.respJsonData(res, result);
    }).catch(function(err){
        console.log('获取特定时间的派单量和归档量失败',err);

    });
})


/**
 * 获取工单流转量
 * @param monthArray :日期
 */
router.route('/getCirculationView').post(function(req,res){
    var monthArray = req.body.monthArray;//当前月的所有日期
    console.log(monthArray);
    service.getCirculation(monthArray).then(function(result){
        console.log(result,"qqqqqqq");
        utils.respJsonData(res, result);
    }).catch(function(err){
        console.log('获取派单量失败',err);

    });
})

/**
 * 获取用户活跃量
 * @param monthArray :日期
 */
router.route('/getLivelyView').post(function(req,res){
    var monthArray = req.body.monthArray;//当前月的所有日期
    console.log(monthArray);
    service.getLively(monthArray).then(function(result){
        console.log(result,"用户活跃度统计！");
        utils.respJsonData(res, result);
    }).catch(function(err){
        console.log('获取派单量失败',err);

    });
})

/**
 * 获取系统使用量
 * @param monthArray :日期
 */
router.route('/getEmployView').post(function(req,res){
    var monthArray = req.body.monthArray;//当前月的所有日期
    console.log(monthArray);
    service.getEmploy(monthArray).then(function(result){
        console.log(result,"用户系统使用量统计！");
        utils.respJsonData(res, result);
    }).catch(function(err){
        console.log('获取派单量失败',err);

    });
})

module.exports = router;
