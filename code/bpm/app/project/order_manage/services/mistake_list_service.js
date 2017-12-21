
var process_model = require('../../bpm_resource/models/process_model');
var user_model = require('../../bpm_resource/models/user_model');
var mistake_model = require('../models/mistake_model');
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../services/instance_service');
var nodeTransferService=require("../services/node_transfer_service");
/**
 * 查询差错工单列表
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getMistakeListPage= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){
        // var arr=[];
        // for(var i=0;i<100;i++){
        //     var task={};
        //     task.mistake_time='20171219';
        //       task.BOSS_NUM = '2222222222',
        //         task.city_code = '851',
        //         task.staff_num ='333333',
        //         task.channel_type='3' ,//渠道类型
        //         task.  channel_org ='3333333'  ,//渠道组织
        //     task.   business_num ='231321321312',//业务编码
        //         task.   business_name ='业务1',//业务名称
        //         task.   check_status ='3',//稽核状态
        //         task.  check_remark ='备注',//稽核备注
        //         task.  status=0,//派单状态0:未派单 1:已派单 -1:派单失败
        //         task.   remark=''//派单备注
        //     arr.push(task);
        //
        // }
        // mistake_model.$ProcessMistake.create(arr,function(err,rs){
        //
        // })

        utils.pagingQuery4Eui(mistake_model.$ProcessMistake, page, size, conditionMap, resolve, '',  {});

    });

    return p;
};

/**
 * 差错工单派单
 * @param queryDate
 * @returns {Promise}
 */
exports.dispatch= function(queryDate) {
    //处理流程
    var proc_code='p-201';

    var p = new Promise(function(resolve,reject){
        //查询状态为0的，即未派单的差错工单
        mistake_model.$ProcessMistake.find({"mistake_time":queryDate,"status":0},function(err,mistakeRes){
            if(err){
                console.log('获取差错工单待派单失败',err);
                reject({'success':false,'code':'1000','msg':'获取差错工单待派单失败',"error":err});
            }else{
                if(mistakeRes.length>0){
                    //获取差错工单流程配置信息
                    process_model.$ProcessDefine.find({"proc_code":proc_code},function(err,res){
                        if(err){
                            console.log('获取差错工单流程信息失败',err);
                            reject({'success':false,'code':'1000','msg':'获取差错工单流程信息失败',"error":err});
                            return;
                        }else{
                            if(res.length>0){
                                /** 首先查找差错工单第三节点配置信息，且第三节点只可配置第二配置项**/

                                var proc_define=JSON.parse(res[0].proc_define);
                                var item_config=JSON.parse(res[0].item_config);
                                var lines=proc_define.lines;
                                var nodes=proc_define.nodes;
                                //第三节点配置信息
                                var three_node_config;
                                //获取开始节点
                                for(let item in nodes){
                                    var node=nodes[item];
                                    if(node.type=='start  round'){
                                        //获取第二节点
                                        for(let item1 in lines){
                                            var line=lines[item1];
                                            if(line.from==item){
                                                //获取第三节点
                                                for(let item2 in lines){
                                                    var line2=lines[item2];
                                                    if(line2.from==line.to){
                                                        //获取第三节点配置信息
                                                        for(let item3 in item_config){
                                                            var node3=item_config[item3];
                                                            //  console.log(node3);
                                                            if(node3.item_code==line2.to){
                                                                three_node_config=node3;
                                                                break;
                                                            }
                                                        }
                                                        break;
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                        break;
                                    }
                                }
                                /** 其次根据第三节点配置就是，然后依据每条差错工单的渠道编码查找对应的指派账号，进行工单指派**/
                                if(three_node_config){
                                    var queryJson={};
                                    //只能配置参照角色
                                    if(three_node_config.item_assignee_type==2){
                                        //如果有配置角色
                                        if(three_node_config.item_assignee_role){
                                            queryJson.user_roles=three_node_config.item_assignee_role;
                                        }
                                        console.log("派单数量",mistakeRes.length);
                                        //成功计数
                                        let successCount=0;
                                        //失败计数
                                        let failCount=0;
                                        //开始派单
                                        for(let i=0;i<mistakeRes.length;i++){
                                            let mistake=mistakeRes[i];
                                            let channel_org=mistake.channel_org;
                                            //业务名称
                                            let business_name=mistake.business_name;
                                            //根据渠道查找每一个对应机构编号
                                            user_model.$CommonCoreOrg.find({"company_code":channel_org},function(err,res){
                                                if(err){
                                                    reject({'success':false,'code':'1000','msg':'查找机构系统错误',"error":err});
                                                    return;
                                                }else{
                                                    //机构只能对于一个
                                                    if(res.length==1){
                                                        //获取机构id
                                                        queryJson.user_org=res[0]._id;
                                                        let orgName=res[0].org_name;
                                                        //查找用户
                                                        user_model.$User.find(queryJson,function(err,res){
                                                            if(err){
                                                                reject({'success':false,'code':'1000','msg':'找用户系统错误',"error":err});
                                                                return;
                                                            }else{
                                                                //账号只能对于一个
                                                                if(res.length==1){
                                                                    //用户编号
                                                                    var user_no=res[0].user_no;
                                                                    //用户姓名
                                                                    var user_name=res[0].user_name;
                                                                    var proc_ver;
                                                                    var proc_title = orgName+" "+business_name+"差错工单";
                                                                    var user_code = 'admin';
                                                                    var assign_user_no=user_no;
                                                                    var userName='系统管理员';
                                                                    var node_code=three_node_config.item_code;
                                                                    var proc_vars=JSON.stringify(mistake);
                                                                    var biz_vars;
                                                                    var memo='差错工单派发成功';

                                                                    //创建工单，分发任务
                                                                    inst.createInstance(proc_code,proc_ver,proc_title,"",proc_vars,biz_vars,user_code,userName)
                                                                        .then(function(result){

                                                                            if(result.success){
                                                                                var task_id=result.data[0]._id;
                                                                                inst.acceptTask(task_id,user_code,userName).then(function(rs){
                                                                                    if(rs.success){
                                                                                        nodeTransferService.do_payout(task_id,node_code,user_code,assign_user_no,proc_title,biz_vars,proc_vars,memo).then(function(results){
                                                                                            //成功派发
                                                                                            if(results.success){
                                                                                                var conditions = {_id: mistake._id};
                                                                                                var update = {$set: {"status":1,"remark":"派发成功"}};
                                                                                                var options = {};
                                                                                                //修改对应的差错工单状态以及备注
                                                                                                mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                                                                    if(errors){
                                                                                                        reject({'success':false,'code':'1000','msg':'修改错误5',"error":errors});
                                                                                                        return;
                                                                                                    }else{
                                                                                                        successCount++;
                                                                                                        //全部执行完后
                                                                                                        if((failCount+successCount)==mistakeRes.length){
                                                                                                            resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});
                                                                                                        }
                                                                                                    }
                                                                                                })
                                                                                            }else{
                                                                                                var conditions = {_id: mistake._id};
                                                                                                var update = {$set: {"status":-1,"remark":"错误原因:派单失败3"+results.msg}};
                                                                                                var options = {};
                                                                                                //修改对应的差错工单状态以及备注
                                                                                                mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                                                                    if(errors){
                                                                                                        reject({'success':false,'code':'1000','msg':'修改错误6',"error":errors});
                                                                                                        return;
                                                                                                    }else{
                                                                                                        failCount++;
                                                                                                        if((failCount+successCount)==mistakeRes.length){
                                                                                                            resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});
                                                                                                        }
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        });
                                                                                    }else{
                                                                                        var conditions = {_id: mistake._id};
                                                                                        var update = {$set: {"status":-1,"remark":"错误原因:派单失败2"+rs.msg}};
                                                                                        var options = {};
                                                                                        //修改对应的差错工单状态以及备注
                                                                                        mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                                                            if(errors){
                                                                                                reject({'success':false,'code':'1000','msg':'修改错误7',"error":errors});
                                                                                                return;
                                                                                            }else{
                                                                                                failCount++;
                                                                                                if((failCount+successCount)==mistakeRes.length){
                                                                                                    resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    }

                                                                                })
                                                                            }else{
                                                                                var conditions = {_id: mistake._id};
                                                                                var update = {$set: {"status":-1,"remark":"错误原因:派单失败1"+result.msg}};
                                                                                var options = {};
                                                                                //修改对应的差错工单状态以及备注
                                                                                mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                                                    if(errors){
                                                                                        reject({'success':false,'code':'1000','msg':'修改错误8',"error":errors});
                                                                                        return;
                                                                                    }else{
                                                                                        failCount++;
                                                                                        if((failCount+successCount)==mistakeRes.length){
                                                                                            resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});
                                                                                        }
                                                                                    }
                                                                                })
                                                                            }
                                                                        }).catch(function(err){
                                                                    });


                                                                }else if(res.length>1){
                                                                    var conditions = {_id: mistake._id};
                                                                    var update = {$set: {"status":-1,"remark":"错误原因: 查找用户为多个，无法具体指定"}};
                                                                    var options = {};
                                                                    //修改对应的差错工单状态以及备注
                                                                    mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                                            if(errors){
                                                                                reject({'success':false,'code':'1000','msg':'修改错误4',"error":errors});
                                                                                return;
                                                                            }else{
                                                                                failCount++;
                                                                                if((failCount+successCount)==mistakeRes.length){
                                                                                    resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});
                                                                                }
                                                                            }

                                                                    })
                                                                }else{
                                                                    var conditions = {_id: mistake._id};
                                                                    var update = {$set: {"status":-1,"remark":"错误原因: 找不到对应用户"}};
                                                                    var options = {};
                                                                    //修改对应的差错工单状态以及备注
                                                                    mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                                        if(errors){
                                                                            reject({'success':false,'code':'1000','msg':'修改错误3',"error":errors});
                                                                            return;
                                                                        }else{
                                                                            failCount++;
                                                                            if((failCount+successCount)==mistakeRes.length){
                                                                                resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});
                                                                            }
                                                                        }
                                                                    })
                                                                }

                                                            }
                                                        })
                                                    }else if(res.length>1){
                                                        var conditions = {_id: mistake._id};
                                                        var update = {$set: {"status":-1,"remark":"错误原因: 对应多个机构,无法具体指定"}};
                                                        var options = {};
                                                        //修改对应的差错工单状态以及备注
                                                        mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                            if(errors){
                                                                reject({'success':false,'code':'1000','msg':'修改错误1',"error":errors});
                                                                return;
                                                            }else{
                                                                failCount++;
                                                                if((failCount+successCount)==mistakeRes.length){
                                                                    resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});
                                                                }
                                                            }
                                                        })
                                                    }else{
                                                        var conditions = {_id: mistake._id};
                                                        var update = {$set: {"status":-1,"remark":"错误原因: 找不到对应机构"}};
                                                        var options = {};
                                                        //修改对应的差错工单状态以及备注
                                                        mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                            if(errors){
                                                                reject({'success':false,'code':'1000','msg':'修改错误2',"error":errors});
                                                                return;
                                                            }else{
                                                                failCount++;
                                                                if((failCount+successCount)==mistakeRes.length){
                                                                    resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});
                                                                }
                                                            }
                                                        })
                                                    }
                                                }
                                            });
                                        }

                                    }else{
                                        reject({'success':false,'code':'1000','msg':'差错工单第三节点只可配置参照角色',"error":null});
                                        return;
                                    }
                                }else{
                                    reject({'success':false,'code':'1000','msg':'第三节点无配置信息',"error":err});
                                    return;
                                }
                            }
                        }
                    })
                }else{
                    reject({'success':false,'code':'1000','msg':'无可派差错工单',"error":err});

                }
            }
        });
    });

    return p;
};


/**
 * 获取派单日志详情
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.dispatch_logs= function(page,size,conditionMap) {

    var p = new Promise(function(resolve,reject){
        try{
            var query1 = conditionMap;

            // mistake_model.$ProcessMistake.aggregate() .match({
            //    // mistake_time:'20171219'
            // }).group({
            //     _id: { status: { $sum: "$status"} },
            //     mistake_time: { $min: "$mistake_time"},
            //     status:{ $min: "$status"},
            //     count: { $sum: 1 }
            // }).group({
            //     _id: { mistake_time: { $min: "$mistake_time"} },
            //     mistake_time: { $min: "$mistake_time"},
            //     success_dispatch:{$max: { $cond: { if:  { $gte: [ "$status", 1 ] }, then:"$count" , else: 0 }}},
            //     fail_dispatch:{$max: { $cond: { if:  { $gte: [ "$status", -1 ] }, then:"$count" , else: 0 }}},
            // }).skip((page-1)*size)
            //     .limit(parseInt(size))
            //     .exec(function(err,res1){
            //         if(err){
            //             reject({'success':false,'code':'1000','msg':'查询统计失败',"error":err});
            //         }else{
            //             mistake_model.$ProcessMistake.aggregate().match({
            //                 // mistake_time:'20171219'
            //             }).group({
            //                     _id: {mistake_time: {$min: "$mistake_time"}}
            //                 }
            //             ).exec(function(err,res){
            //                     if(err){
            //                         reject({'success':false,'code':'1000','msg':'查询统计失败',"error":err});
            //                     }else{
            //                         var result={};
            //                         result.rows=res1;
            //                         result.total=res.length;
            //                         resolve(result);
            //                     }
            //
            //                 });
            //         }
            //
            //     });

        }catch(e){
            console.log("错误1",e);
        }


    });

    return p;
};
