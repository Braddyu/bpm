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

/**
 * 插入统计表
 * @param inst_id 实例ID
 * @param dispatch_time 派单时间
 * @returns {Promise}
 */
exports.addStatistics = function(inst_id,dispatch_time) {

    var p = new Promise(function(resolve,reject) {
        process_model.$ProcessInst.find({"_id":inst_id},function(err,res){
            if(err){
                reject(utils.returnMsg(false, '1000', '查找实例错误。',null,err));
            }else{
                //判断统计表中是否存在工单
                process_extend_model.$ProcessTaskStatistics.find({"proc_inst_id":inst_id},function(err,res){
                    if(err){
                        console.log("error:查找统计表错误");
                        reject(utils.returnMsg(false, '1000', '查找统计表错误。',null,err));
                    }else{
                        //判断统计信息是否存在
                        if(res.length==0){
                            //查找实例ID在实例表中是否存在
                            process_model.$ProcessInstTask.find({"proc_inst_id":inst_id,"proc_inst_task_type":"厅店处理回复"},function(err,res){
                                if(err){
                                    console.log("error:查找实例错误");
                                    reject(utils.returnMsg(false, '1000', '查找任务错误。',null,err));
                                }else{
                                    var statistics={};
                                    if(res.length==1){

                                        var task=res[0];
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
                                        //查找任务的机构，渠道的类别为:6
                                         user_model.$CommonCoreOrg.find({"_id":org_id,"level":6},function(err,res){
                                             if(err){
                                                 reject(utils.returnMsg(false, '1000', '查找机构错误1。',null,err));
                                             }else{
                                                 //渠道级别必须只能是一个
                                                 if(res.length==1){
                                                     //所属渠道
                                                     statistics.channel_id=res[0].id;
                                                     //所属渠道
                                                     statistics.channel_code=res[0].company_code;
                                                     ///所属渠道名称
                                                     statistics.channel_name=res[0].org_fullname;
                                                     //查找网格
                                                     user_model.$CommonCoreOrg.find({"_id":res[0].org_pid},function(err,res){
                                                         if(err){
                                                             reject(utils.returnMsg(false, '1000', '查找网格错误。',null,err));
                                                         }else{
                                                             //渠道的网格必须对应一个
                                                             if(res.length==1){
                                                                 statistics.grid_id=res[0].id;
                                                                 //查找区县
                                                                 user_model.$CommonCoreOrg.find({"_id":res[0].org_pid},function(err,res){
                                                                     if(err){
                                                                         reject(utils.returnMsg(false, '1000', '查找区县错误。',null,err));
                                                                     }else{
                                                                         //渠道的区县必须对应一个
                                                                         if(res.length==1){
                                                                             statistics.county_id=res[0].id;
                                                                             //查找地市
                                                                             user_model.$CommonCoreOrg.find({"_id":res[0].org_pid},function(err,res){
                                                                                 if(err){
                                                                                     reject(utils.returnMsg(false, '1000', '查找地市错误。',null,err));
                                                                                 }else{
                                                                                     //渠道的地市必须对应一个
                                                                                     if(res.length==1){
                                                                                         statistics.city_id=res[0].id;
                                                                                         //查找省级
                                                                                         user_model.$CommonCoreOrg.find({"_id":res[0].org_pid},function(err,res){
                                                                                             if(err){
                                                                                                 reject(utils.returnMsg(false, '1000', '查找地市错误。',null,err));
                                                                                             }else{
                                                                                                 //渠道的省级必须对应一个
                                                                                                 if(res.length==1){
                                                                                                     statistics.province_id=res[0].id;
                                                                                                     statistics.insert_time=new Date();
                                                                                                     var arr=[];
                                                                                                     arr.push(statistics);
                                                                                                     //插入统计表中
                                                                                                     process_extend_model.$ProcessTaskStatistics.create(arr,function(err){
                                                                                                         if(err){
                                                                                                             reject(utils.returnMsg(false, '1000', '创建统计任务失败。',null,err));
                                                                                                         }else{
                                                                                                             resolve(utils.returnMsg(true, '2000', '创建统计信息成功。',null,null));
                                                                                                         }
                                                                                                     });

                                                                                                 }else if(res.length>1){
                                                                                                     resolve(utils.returnMsg(false, '1000', '渠道对应多个省级，无法指定具体。',null,null));

                                                                                                 }else{
                                                                                                     resolve(utils.returnMsg(false, '1000', '不存在的省级。',null,null));

                                                                                                 }
                                                                                             }
                                                                                         })

                                                                                     }else if(res.length>1){
                                                                                         resolve(utils.returnMsg(false, '1000', '渠道对应多个地市，无法指定具体。',null,null));

                                                                                     }else{
                                                                                         resolve(utils.returnMsg(false, '1000', '不存在的地市。',null,null));

                                                                                     }
                                                                                 }
                                                                             })
                                                                         }else if(res.length>1){
                                                                             resolve(utils.returnMsg(false, '1000', '渠道对应多个区县，无法指定具体。',null,null));

                                                                         }else{
                                                                             resolve(utils.returnMsg(false, '1000', '不存在的区县。',null,null));

                                                                         }
                                                                     }
                                                                 })
                                                             }else if(res.length>1){
                                                                 resolve(utils.returnMsg(false, '1000', '渠道对应多个网格，无法指定具体。',null,null));

                                                             }else{
                                                                 resolve(utils.returnMsg(false, '1000', '不存在的网格。',null,null));

                                                             }
                                                         }
                                                     });
                                                 }else if(res.length>1){
                                                     resolve(utils.returnMsg(false, '1000', '存在多个渠道，无法指定具体。',null,null));
                                                 }else{
                                                     resolve(utils.returnMsg(false, '1000', '不存在的渠道。',null,null));
                                                 }
                                             }

                                       })
                                    }else if(res.length>1){
                                        resolve(utils.returnMsg(false, '1000', '存在多个任务。',null,null));
                                    }else{
                                        resolve(utils.returnMsg(false, '1000', '任务不存在。',null,null));
                                    }
                                }
                            });
                        }else{
                            resolve(utils.returnMsg(false, '1000', '已存在的统计信息。',null,null));
                        }


                    }
                })
            }

        });

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
        process_model.$ProcessInstTask.find({'proc_inst_id':inst_id,'proc_inst_task_status':0},function(err,res){
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
                                    console.log('抄送信息为:',data[0].user_no,'您的所辖渠道管理员',task.proc_inst_task_assignee_name,task.proc_inst_task_title,'有一份工单待处理');
                                    resolve(utils.returnMsg(true, '2000', '抄送成功。',null,null));
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