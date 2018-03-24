/**
 * youjian
 * 2017/12/22
 */
var process_extend_model = require('../models/process_extend_model');
var process_model = require('../models/process_model');
var user_model = require('../models/user_model');
var utils = require('../../../../lib/utils/app_utils')
var nodeAnalysisService=require('../services/node_analysis_service')
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
var moment = require('moment');
var process_util = require('../../../utils/process_util');
/**
 * 插入统计表
 * @param inst_id 实例ID
 * @param dispatch_time 派单时间
 * @returns {Promise}
 */
exports.addStatistics = function(inst_id,dispatch_time) {

    var p = new Promise(async function(resolve,reject) {

        let inst_result= await process_model.$ProcessInst.find({"_id":inst_id});
        if(inst_result.length ==0){
            reject(utils.returnMsg(false, '1000', '查找实例错误。',null,null));
            return;
        }
        //判断统计表中是否存在工单
        let statistics_result= await  process_extend_model.$ProcessTaskStatistics.find({"proc_inst_id":inst_id});
        //判断统计信息是否存在
        if(statistics_result.length > 0){
            reject(utils.returnMsg(false, '1000', '已有的统计。',null,null));
            return;
        }

        //查找实例ID在实例表中是否存在
       let task_result = await  process_model.$ProcessInstTask.find({"proc_inst_id":inst_id,"proc_inst_task_type":"厅店处理回复"})
        if(task_result.length ==0){
            reject(utils.returnMsg(false, '1000', '查找任务错误。',null,null));
            return;
        }
        var statistics={};
        var task=task_result[0];
        var org_id=task.proc_inst_task_user_org;
        //实例id
        statistics.proc_inst_id=inst_id;
        //派单时间
        statistics.dispatch_time=dispatch_time;
        //所属流程
        statistics.proc_code=task.proc_code;
        //被派单渠道所属人编号
        statistics.user_no=task.proc_inst_task_assignee;
        //被派单渠道所属人
        statistics.user_name=task.proc_inst_task_assignee_name;
        ///被派单渠道所属人电话号码，因为渠道的账号手机号和编号为同一个
        statistics.user_phone=task.proc_inst_task_assignee;

        //查找用户信息
        let user_result= await user_model.$User.find({"user_no":task.proc_inst_task_assignee} );
        if(user_result.length==0 ){
            reject(utils.returnMsg(false, '1000', '查找用户错误。',null,org_id));
            return;
        }
        //被派渠道工号
        statistics.work_id=user_result[0].work_id;
        //查找渠道信息
        let channel_result= await user_model.$CommonCoreOrg.find({"_id":org_id,"level":6} );
        if(channel_result.length !=1 ){
            reject(utils.returnMsg(false, '1000', '查找渠道错误。',null,org_id));
            return;
        }
        //所属渠道
        statistics.channel_id=channel_result[0].id;
        //所属渠道
        statistics.channel_code=channel_result[0].company_code;
        ///所属渠道名称
        statistics.channel_name=channel_result[0].org_fullname;
        //查找网格
        let grid_result= await  user_model.$CommonCoreOrg.find({"_id":channel_result[0].org_pid});
        if(grid_result.length !=1){
            reject(utils.returnMsg(false, '1000', '查找网格错误。',null,channel_result[0].org_pid));
            return;
        }
        statistics.grid_id=grid_result[0].id;
        statistics.grid_name=grid_result[0].org_name;
        statistics.grid_code=grid_result[0].company_code;

        let county_result;
        //如果渠道的上一级为区域直辖,则渠道和网格一致，这是查的所属网格其实为所属区县
        if(grid_result[0].level==4){
            statistics.grid_id=channel_result[0].id;
            statistics.grid_name=channel_result[0].org_name;
            statistics.grid_code=channel_result[0].company_code;

            statistics.county_id=grid_result[0].id;
            statistics.county_name=grid_result[0].org_name;
            statistics.county_code=grid_result[0].company_code;
            county_result=grid_result;
        }else{
            //查找区县
            county_result  = await  user_model.$CommonCoreOrg.find({"_id":grid_result[0].org_pid,"level":4});
            if(county_result.length !=1){
                reject(utils.returnMsg(false, '1000', '查找网格错误。',null,grid_result[0].org_pid));
                return;
            }
            statistics.county_id=county_result[0].id;
            statistics.county_name=county_result[0].org_name;
            statistics.county_code=county_result[0].company_code;
        }

        //查找地州
        let city_result= await  user_model.$CommonCoreOrg.find({"_id":county_result[0].org_pid,"level":3});
        if(city_result.length !=1){
            reject(utils.returnMsg(false, '1000', '查找地州错误。',null,county_result[0].org_pid));
            return;
        }
        statistics.city_id=city_result[0].id;
        statistics.city_name=city_result[0].org_name;
        statistics.city_code=city_result[0].company_code;

        //查找省
        let province_result= await  user_model.$CommonCoreOrg.find({"_id":city_result[0].org_pid,"level":2});
        if(province_result.length !=1){
            reject(utils.returnMsg(false, '1000', '查找地州错误。',null,city_result[0].org_pid));
            return;
        }
        statistics.province_id=province_result[0].id;
        statistics.insert_time=new Date();
        var arr=[];
        arr.push(statistics);
        let insert= await process_extend_model.$ProcessTaskStatistics.create(arr);
        if(insert.length!=0)
            resolve(utils.returnMsg(true, '2000', '插入统计表成功。',null,insert));
        else
            reject(utils.returnMsg(false, '1000', '插入统计表错误。',null,insert));
    });
    return p;
}


/**
 * 抄送信息给网格经理
 * @param inst_id
 */
exports.copyToSend = function(inst_id) {

    return new Promise(function(resolve,reject){
        //查询厅经理任务
        process_model.$ProcessInstTask.find({'proc_inst_id':inst_id,'proc_inst_task_status':0,"proc_inst_task_type" : "厅店处理回复"},function(err,res){
                if(err){
                    resolve(utils.returnMsg(false, '1000', '获取抄送信息失败。',null,null));
                }else{
                    if(res.length==1){
                        var task=res[0];
                        var node_code=task.proc_inst_task_code;
                        var proc_task_id=task._id;
                        var proc_inst_id=inst_id;
                        var user_no= task.proc_inst_task_assignee;
                        var params={};
                        //获取下一节点处理人
                        nodeAnalysisService.getNextNodeAndHandlerInfo(node_code,proc_task_id,proc_inst_id,params,user_no).then(function(rs){
                            if(rs.success){
                                var data=rs.data;
                                if(data.length==1){
                                    process_extend_model.$ProcessTaskStatistics.find({"proc_inst_id":inst_id},function(err,res1){
                                        if(err){
                                            resolve(utils.returnMsg(false, '1000', '错误的抄送信息1。',null,null));
                                        }else{
                                            var params = {
                                                "channelName": res1[0].channel_name,
                                                "channelCode": res1[0].channel_code,
                                                "procName":task.proc_inst_task_title,
                                                "orderNo":task.work_order_number
                                            }
                                            process_util.sendSMS(data[0].user_no,params,'GRID_COPY');
                                            resolve(utils.returnMsg(true, '2000', '抄送成功。',null,null));
                                        }
                                    })
                                }else if(data.length>1){
                                    resolve(utils.returnMsg(false, '1000', '多个抄送对象,无法指定。',null,null));
                                }else{
                                    resolve(utils.returnMsg(false, '1000', '无抄送对象。',null,null));
                                }
                            }
                            console.log("下一节点处理人:",rs);
                           // utils.respJsonData(res,rs);
                        });

                    }else{
                        resolve(utils.returnMsg(false, '1000', '错误的抄送信息。',null,null));
                    }
                }
        })
    });

}



exports.query = function(proc_code,user_name) {
    return new Promise(function(resolve,reject) {
        if(proc_code){
            process_model.$ProcessInstTask.aggregate([
                {
                    $match: {'proc_inst_task_status':0,'proc_code':proc_code}
                },
                { $project : {
                    _id : 0 ,
                    proc_inst_task_assignee : 1
                }}

            ]).exec(function(err,res){
                if(err){
                    resolve(utils.returnMsg(false, '1000', '查询错误。',null,null));
                }else{
                    resolve(utils.returnMsg(true, '0000', '查询成功。',res,null));
                }
            })
        }else if(user_name){

            user_model.$User.aggregate([
                {
                    $match: {'user_name':user_name,'user_roles':{$in:[ new mongoose.Types.ObjectId('5a264057c819ed211853907a')]}}
                },
                { $project : {
                    _id : 0 ,
                    login_account : 1
                }}

            ]).exec(function(err,res){
                if(err){
                    resolve(utils.returnMsg(false, '1000', '查询错误。',null,null));
                }else{
                    resolve(utils.returnMsg(true, '0000', '查询成功。',res,null));
                }
            })
        }else{
            resolve(utils.returnMsg(false, '1000', '查询错误。',null,null));
        }
     }
    )
}