/**
 * 预警工单，差错工单统计
 * @type {*|youjian}
 *
 */
var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_statistics_service');

/**
 * 统计列表
 */
router.route('/list').post(function(req,res){
    console.log("开始获取统计列表...");
    var org_id = req.body.org_id;//机构编号
    var proc_code = req.body.proc_code;//流程编号
    var level = req.body.level;//机构等级
    var status = req.body.status;//是否返回到当前所在机构
    var dispatch_time = req.body.dispatch_time;//派单时间
    var startDate = req.body.startDate;//开始插入时间
    var endDate = req.body.endDate;//结束插入时间

    console.log("params",org_id,proc_code,level,status,dispatch_time,startDate,endDate);
    // 调用分页
    service.getStatisticsListPage(org_id,proc_code,level,status,dispatch_time,startDate,endDate)
        .then(function(result){
             console.log("获取所有工单列表成功",result);

            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取所有工单列表失败',err);

        });
})

/**
 * 导出工单统计查询出来的数据
 */
router.route('/export_excel').get(function(req,res){
    console.log("开始导出统计列表...");
    var org_id = req.query.org_id;//机构编号
    var proc_code = req.query.proc_code;//流程编号
    var level = req.query.level;//机构等级
    var status = req.query.status;//是否返回到当前所在机构
    var dispatch_time = req.query.dispatch_time;//派单时间
    var startDate = req.query.startDate;//开始插入时间
    var endDate = req.query.endDate;//结束插入时间

    console.log("params",org_id,proc_code,level,status,dispatch_time,startDate,endDate);
    // 调用分页
    service.exportStatisticsList(org_id,proc_code,level,status,dispatch_time,startDate,endDate)
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
    console.log("获取工单明细列表...");
    var org_id = req.body.org_id;//机构编号
    var page = req.body.page;//页码
    var size = req.body.rows;//每页大小
    var level = req.body.level;//区域等级
    var status = req.body.status;//查询状态,1:为总数，2：归档数 3:处理中
    var proc_code = req.body.proc_code;//流程编号
    var dispatch_time = req.body.dispatch_time;//派单时间
    var startDate = req.body.startDate;//开始插入时间
    var endDate = req.body.endDate;//结束插入时间
    console.log("params",org_id,level,status,proc_code,dispatch_time,startDate,endDate);
    // 调用分页
    service.detail_list(page,size,org_id,level,status,proc_code,dispatch_time,startDate,endDate)
        .then(function(result){
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取上级机构失败',err);
            utils.respJsonData(res, err);

        });
})
/**
 * 获取渠道详情
 */
router.route('/channel_detail_list').post(function(req,res){
    console.log("获取工单明细列表...");
    var page = req.body.page;//页码
    var size = req.body.rows;//每页大小
    var status = req.body.status;//查询状态,1:为总数，2：归档数
    var proc_code = req.body.proc_code;//流程编号
    var dispatch_time = req.body.dispatch_time;//派单时间
    var startDate = req.body.startDate;//开始插入时间
    var endDate = req.body.endDate;//结束插入时间
    var user_no=req.session.current_user.user_no;
    var user_org=req.session.current_user.user_org;
    var user_roles=req.session.current_user.user_roles;

    var org_id;
    var level;
    if(user_no=='admin'){
        level='2';
        org_id='5a275c0377ec2e1e844878dd';
    }else{
        //判断登录账号是否为网格经理
        for(let item in user_roles){
            var role=user_roles[item];
            //表示为网格经理的角色
            if(role.role_code=='business_grid_manager'){
                //判断登录账号是否为网格机构，即区域级别为"level" 为5
                for(let item in user_org){
                    var org=user_org[item];
                    if(org.level==5){
                        org_id=org._id;
                        level=5;
                        break;
                    }
                    break;
                }
            }
        }
    }

    console.log("params",status,proc_code,dispatch_time,startDate,endDate,page,size);
    console.log(org_id,level);
    if(org_id && level){
        // 调用分页
        service.detail_list(page,size,org_id,level,status,proc_code,dispatch_time,startDate,endDate)
            .then(function(result){
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


module.exports = router;
