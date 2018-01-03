
var process_model = require('../../bpm_resource/models/process_model');
var user_model = require('../../bpm_resource/models/user_model');
var mistake_model = require('../models/mistake_model');
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../../bpm_resource/services/instance_service');
var nodeTransferService=require("../../bpm_resource/services/node_transfer_service");
var process_extend_service = require("../../bpm_resource/services/process_extend_service");
var moment = require('moment');
/**
 * 查询差错工单列表
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getMistakeListPage= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){
        utils.pagingQuery4Eui(mistake_model.$ProcessMistake, page, size, conditionMap, resolve, '',  {});

    });

    return p;
};

/**
 * 差错工单派单
 * @param queryDate
 * @returns {Promise}
 */
exports.dispatch= function(queryDate,user_no,user_name,role_name) {
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
                                var proc_name=res[0].proc_name;
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
                                        //开始派单
                                        insertMistakes(mistakeRes,queryJson,three_node_config,proc_code,proc_name,user_no,user_name,role_name,queryDate).then(function(result){
                                           resolve(result);
                                        }).catch(function(err){
                                            reject(err);
                                        });

                                    }else{
                                        return  reject({'success':false,'code':'1000','msg':'差错工单第三节点只可配置参照角色',"error":null});

                                    }
                                }else{
                                    return   reject({'success':false,'code':'1000','msg':'第三节点无配置信息',"error":err});

                                }
                            }
                        }
                    })
                }else{
                    return   reject({'success':false,'code':'1000','msg':'无可派差错工单',"error":err});

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
        utils.pagingQuery4Eui(mistake_model.$ProcessMistakeLogs, page, size, conditionMap, resolve, '',  {});

    });

    return p;
};

/**
 * 派发差错工单
 * @param mistakeRes 差错工单结果集
 * @param queryJson
 * @returns {Promise.<void>}
 */
 function insertMistakes(mistakeRes,queryJson,three_node_config,proc_code,proc_name,user_no,user_name,role_name,queryDate){

        return new Promise(function(resolve,reject){

            //成功数
            var successCount=0;
            //失败数
            var failCount=0;
            for(let i=0;i<mistakeRes.length;i++){
                let mistake=mistakeRes[i];
                let channel_org=mistake.channel_org;
                //业务名称
                let business_name=mistake.business_name;

                 insertMistake(mistake,business_name,channel_org,queryJson,three_node_config,proc_code,user_name,role_name,queryDate).then(function(result){
                    //成功派单
                    if(result=='successCount'){
                        successCount++;
                    }else if(result=='failCount'){
                        //派单失败
                        failCount++;
                    }
                    //全部处理完成
                    if((failCount+successCount)==mistakeRes.length){
                        var datas=[];
                        var data={};
                        data.proc_code=proc_code;
                        data.proc_name=proc_name;
                        data.dispatch_time=queryDate;
                        data.create_user_no=user_no;
                        data.create_user_name=user_name;
                        data.update_user_no='';
                        data.create_time=new Date();
                        //1表示：派单全部成功。2表示：派单部分成功。3表示：派单全部失败。
                        if(successCount==mistakeRes.length){
                            data.status=1;
                        }else if(failCount==mistakeRes.length){
                            data.status=3;
                        }else{
                            data.status=2;
                        }
                        data.dispatch_remark='工单派发:成功数为'+successCount+" 失败数为"+failCount;
                        datas.push(data);
                        //将派发结果插入日志表中
                        mistake_model.$ProcessMistakeLogs.create(datas,function(err){
                            if(err){
                                reject({'success':false,'code':'1000','msg':'插入统计表失败',"error":err});
                            }else{
                                resolve({'success':true,'code':'1000','msg':'工单派发:成功数为'+successCount+" 失败数为"+failCount});

                            }
                        })
                    }else{

                    }

                }).catch(function(e){
                    reject(e);
                });
            }

        })
}

/**
 * 对每条差错工单进行判断，成功则派发工单
 * @param mistake
 * @param business_name
 * @param channel_org
 * @param queryJson
 * @param three_node_config
 * @param proc_code
 * @returns {Promise}
 */
function insertMistake(mistake,business_name,channel_org,queryJson,three_node_config,proc_code,user_name,role_name,queryDate){
   return  new Promise(function(resolve,reject){
       //机构和业务名称必须存在
       if(channel_org && business_name) {

           //根据渠道查找每一个对应机构编号
           user_model.$CommonCoreOrg.find({"company_code": channel_org}, function (err, res) {
               if (err) {
                   return ({'success': false, 'code': '1000', 'msg': '查找机构系统错误', "error": err});
               } else {
                   //机构只能对于一个
                   if (res.length == 1) {
                       //获取机构id
                       queryJson.user_org = res[0]._id;
                       let orgName = res[0].org_name;
                       //查找用户
                       user_model.$User.find(queryJson, function (err, res) {
                           if (err) {
                               reject({'success': false, 'code': '1000', 'msg': '找用户系统错误', "error": err});
                           } else {
                               //账号只能对于一个
                               if (res.length == 1) {
                                   //用户编号
                                   var user_no = res[0].user_no;

                                   var proc_ver;
                                   var proc_title = orgName + " " + business_name + "差错工单";
                                   var user_code = 'admin';
                                   var assign_user_no = user_no;
                                   var userName = '系统管理员';
                                   var node_code = three_node_config.item_code;
                                   //直接向mistake中插入key不可行，这里先将对象转对json字符串再转为json
                                   var mistak_json = JSON.stringify(mistake);
                                   mistake = JSON.parse(mistak_json);

                                   mistake.start_user=role_name;
                                   mistake.start_user_name=user_name;
                                   mistake.time=queryDate;//文件中的派单时间
                                   mistake.start_time=moment().format('YYYY-MM-DD HH:mm:ss');
                                   mistake.work_day=7;
                                   mistake.end_time=moment().add(mistake.work_day,"days").format('YYYY-MM-DD HH:mm:ss');
                                   var proc_vars = JSON.stringify(mistake);
                                   var biz_vars;
                                   var memo = '差错工单派发成功';

                                   //创建工单，分发任务
                                   inst.createInstance(proc_code, proc_ver, proc_title, "", proc_vars, biz_vars, user_code, userName,"errorSys_node")
                                       .then(function (result) {
                                           if (result.success) {
                                               var task_id = result.data[0]._id;
                                               inst.acceptTask(task_id, user_code, userName).then(function (rs) {
                                                   if (rs.success) {
                                                       nodeTransferService.do_payout(task_id, node_code, user_code, assign_user_no, proc_title, biz_vars, proc_vars, memo).then(function (results) {
                                                           console.log(results);
                                                           //成功派发
                                                           if (results.success) {
                                                               var conditions = {_id: mistake._id};
                                                               var update = {
                                                                   $set: {
                                                                       "status": 1,
                                                                       "dispatch_remark": "派发成功",
                                                                       "proc_inst_id": results.data[0]._id
                                                                   }
                                                               };
                                                               var options = {};
                                                               //修改对应的差错工单状态以及备注
                                                               mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                                   if (errors) {
                                                                       reject({
                                                                           'success': false,
                                                                           'code': '1000',
                                                                           'msg': '修改错误5',
                                                                           "error": errors
                                                                       });
                                                                   } else {
                                                                       //将差错工单结果插入统计表
                                                                       process_extend_service.addStatistics(results.data[0]._id, queryDate).then(function (rs) {
                                                                           console.log("插入统计表成功", rs);
                                                                       }).catch(function (e) {
                                                                           console.log("插入统计表失败", e);
                                                                       });
                                                                       resolve("successCount");
                                                                   }
                                                               })
                                                           } else {
                                                               var conditions = {_id: mistake._id};
                                                               var update = {
                                                                   $set: {
                                                                       "status": -1,
                                                                       "dispatch_remark": "错误原因:派单失败3" + results.msg
                                                                   }
                                                               };
                                                               var options = {};
                                                               //修改对应的差错工单状态以及备注
                                                               mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                                   if (errors) {
                                                                       reject({
                                                                           'success': false,
                                                                           'code': '1000',
                                                                           'msg': '修改错误6',
                                                                           "error": errors
                                                                       });
                                                                   } else {
                                                                       resolve("failCount");
                                                                   }
                                                               })
                                                           }
                                                       });
                                                   } else {
                                                       var conditions = {_id: mistake._id};
                                                       var update = {
                                                           $set: {
                                                               "status": -1,
                                                               "dispatch_remark": "错误原因:派单失败2" + rs.msg
                                                           }
                                                       };
                                                       var options = {};
                                                       //修改对应的差错工单状态以及备注
                                                       mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                           if (errors) {
                                                               reject({
                                                                   'success': false,
                                                                   'code': '1000',
                                                                   'msg': '修改错误7',
                                                                   "error": errors
                                                               });
                                                           } else {
                                                               resolve("failCount");
                                                           }
                                                       })
                                                   }

                                               })
                                           } else {
                                               var conditions = {_id: mistake._id};
                                               var update = {
                                                   $set: {
                                                       "status": -1,
                                                       "dispatch_remark": "错误原因:派单失败1" + result.msg
                                                   }
                                               };
                                               var options = {};
                                               //修改对应的差错工单状态以及备注
                                               mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                                   if (errors) {
                                                       reject({
                                                           'success': false,
                                                           'code': '1000',
                                                           'msg': '修改错误8',
                                                           "error": errors
                                                       });
                                                   } else {
                                                       resolve("failCount");
                                                   }
                                               })
                                           }
                                       }).catch(function (err) {
                                   });


                               } else if (res.length > 1) {
                                   var conditions = {_id: mistake._id};
                                   var update = {$set: {"status": -1, "dispatch_remark": "错误原因: 查找用户为多个，无法具体指定"}};
                                   var options = {};
                                   //修改对应的差错工单状态以及备注
                                   mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                       if (errors) {
                                           reject({'success': false, 'code': '1000', 'msg': '修改错误4', "error": errors});
                                       } else {
                                           resolve("failCount");
                                       }

                                   })
                               } else {
                                   var conditions = {_id: mistake._id};
                                   var update = {$set: {"status": -1, "dispatch_remark": "错误原因: 找不到对应用户"}};
                                   var options = {};
                                   //修改对应的差错工单状态以及备注
                                   mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                                       if (errors) {
                                           reject({'success': false, 'code': '1000', 'msg': '修改错误3', "error": errors});
                                       } else {
                                           resolve("failCount");
                                       }
                                   })
                               }

                           }
                       })
                   } else if (res.length > 1) {
                       var conditions = {_id: mistake._id};
                       var update = {$set: {"status": -1, "dispatch_remark": "错误原因: 对应多个机构,无法具体指定"}};
                       var options = {};
                       //修改对应的差错工单状态以及备注
                       mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                           if (errors) {
                               reject({'success': false, 'code': '1000', 'msg': '修改错误1', "error": errors});
                           } else {
                               resolve("failCount");
                           }
                       })
                   } else {
                       var conditions = {_id: mistake._id};
                       var update = {$set: {"status": -1, "dispatch_remark": "错误原因: 找不到对应机构"}};
                       var options = {};
                       //修改对应的差错工单状态以及备注
                       mistake_model.$ProcessMistake.update(conditions, update, options, function (errors) {
                           if (errors) {
                               reject({'success': false, 'code': '1000', 'msg': '修改错误2', "error": errors});
                           } else {
                               resolve("failCount");
                           }
                       })
                   }
               }

           });
       }else{
               resolve("failCount");
       }
   })
}