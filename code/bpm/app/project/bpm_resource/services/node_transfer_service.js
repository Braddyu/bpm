/**
 * Created by aurora on 2017/6/15.
 */
var model_user=require("../models/user_model");
var model = require('../models/process_model');
var Promise = require("bluebird");
var nodeAnalysisService=require("./node_analysis_service");
var utils = require('../../../../lib/utils/app_utils');
var instanceService =require("./instance_service");
var nodegrass = require("nodegrass");
var REQ_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded'
};



//触发事件的实际执行模块
/**
 *
 *
 * @param url_address  触发事件 访问的 外部接口
 * @param task_id
 * @param user_no
 * @returns {bluebird}
 */
function visit(url_address,task_id,user_no){
    var map={};
    var p = new Promise(function(resolve,reject){
        model.$ProcessInstTask.find({"_id":task_id},function(error,result){
            if(error){
                console.log(error);
            }else{
                if(result.length>0){
                    map.proc_inst_task_name =result[0].proc_inst_task_name;
                    map.proc_inst_task_assignee_name=result[0].proc_inst_task_assignee_name;
                    map.proc_inst_biz_vars=result[0].proc_inst_biz_vars;
                    map.proc_inst_task_assignee=result[0].proc_inst_task_assignee;
                    var proc_inst_id=result[0].proc_inst_id;
                    model.$ProcessInst.find({"_id":proc_inst_id},function(e,r){
                        if(e){
                            console.log(e);
                            resolve({"data":null,"error":e,"msg":"触发事件记录出现异常","code":"1003","success":false});
                        }else{
                            if(r.length>0){
                                map. proc_name=r[0].proc_name;// : "采购测试流程"
                                map.proc_ver= r[0].proc_ver;//" : NumberInt(4)
                                map.proc_title=r[0].proc_title;//" : "采购测试流程"
                                map.proc_cur_task_name=r[0].proc_cur_task_name;//" : "总经办审核"
                                nodegrass.post(url_address,
                                    function (res, status, headers) {
                                        if(status==200){
                                            console.log("访问且成功完成")
                                            var condition={};
                                            condition.proc_task_id=task_id;//:String,//task_id
                                            condition.user_no=user_no;// : String,//,  required: true,index:  true   },//
                                            condition.opt_time=new Date();// : Date,// 访问时间
                                            condition.memo="";// : String,// 访问备注
                                            condition.path_url=url_address//:String,//类别
                                            condition.status_code=status//// : String,//访问接口返回状态码
                                            condition.response_info=res;//:String//返回信息
                                            var arr=[];
                                            arr.push(condition);
                                            model.$ProcessNetBase.create(arr,function(error,result){
                                                if(error){
                                                    console.log(error);
                                                    resolve({"data":null,"error":error,"msg":"触发事件记录出现异常","code":"1004","success":false});
                                                }else{
                                                    resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true})
                                                }
                                            });
                                        }else{
                                            console.log("访问失败");
                                            var condition={};
                                            condition.proc_task_id=task_id;//:String,//task_id
                                            condition.user_no=user_no;// : String,//,  required: true,index:  true   },//
                                            condition.opt_time=new Date();// : Date,// 访问时间
                                            condition.memo="";// : String,// 访问备注
                                            condition.path_url=url_address//:String,//类别
                                            condition.status_code=status//// : String,//访问接口返回状态码
                                            condition.response_info=res;//:String//返回信息
                                            var arr=[];
                                            arr.push(condition);
                                            model.$ProcessNetBase.create(arr,function(error,result){
                                                if(error){
                                                    resolve({"data":null,"error":error,"msg":"触发事件记录出现异常","code":"1005","success":false});
                                                }else{
                                                    resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true})
                                                }
                                            });

                                        }
                                    },
                                    REQ_HEADERS,
                                    {page:1,rows:15,time:new Date(),param:map},
                                    'utf8').on('error', function (e) {
                                    console.log("访问失败");
                                    var condition={};
                                    condition.proc_task_id=task_id;//:String,//task_id
                                    condition.user_no=user_no;// : String,//,  required: true,index:  true   },//
                                    condition.opt_time=new Date();// : Date,// 访问时间
                                    condition.memo="error";// : String,// 访问备注
                                    condition.path_url=url_address//:String,//类别
                                    condition.status_code="404"//// : String,//访问接口返回状态码
                                    condition.response_info=e;//:String//返回信息
                                    var arr=[];
                                    arr.push(condition);
                                    model.$ProcessNetBase.create(arr,function(error,result){
                                        if(error){
                                            resolve({"data":null,"error":error,"msg":"触发事件记录出现异常","code":"1001","success":false});
                                        }else{
                                            resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true})
                                        }
                                    });
                                });
                            }else{
                                resolve({"data":null,"error":null,"msg":"触发事件记录出现异常","code":"1001","success":false});

                            }
                        }
                    });
                }else{
                    model.$ProcessTaskHistroy.find({"proc_task_id" :task_id},function(errors,results){
                       if(errors){
                           console.log(errors);
                           resolve({"data":null,"error":errors,"msg":"触发事件记录出现异常","code":"1001","success":false});
                       }else{
                           if(results.length>0){
                               map.proc_inst_task_name =results[0].proc_inst_task_name;
                               map.proc_inst_task_assignee_name=results[0].proc_inst_task_assignee_name;
                               map.proc_inst_biz_vars=results[0].proc_inst_biz_vars;
                               map.proc_inst_task_assignee=results[0].proc_inst_task_assignee;
                               var proc_inst_id=results[0].proc_inst_id;
                               model.$ProcessInst.find({"_id":proc_inst_id},function(es,rs){
                                   if(es){
                                       console.log(es);
                                   }else{
                                       if(r.length>0){
                                           map. proc_name=r[0].proc_name;// : "采购测试流程"
                                           map.proc_ver= r[0].proc_ver;//" : NumberInt(4)
                                           map.proc_title=r[0].proc_title;//" : "采购测试流程"
                                           map.proc_cur_task_name=r[0].proc_cur_task_name;//" : "总经办审核"
                                           nodegrass.post(url_address,
                                               function (res, status, headers) {
                                                   if(status==200){
                                                       console.log("访问且成功完成")
                                                       var condition={};
                                                       condition.proc_task_id=task_id;//:String,//task_id
                                                       condition.user_no=user_no;// : String,//,  required: true,index:  true   },//
                                                       condition.opt_time=new Date();// : Date,// 访问时间
                                                       condition.memo="";// : String,// 访问备注
                                                       condition.path_url=url_address//:String,//类别
                                                       condition.status_code=status//// : String,//访问接口返回状态码
                                                       condition.response_info=res;//:String//返回信息
                                                       var arr=[];
                                                       arr.push(condition);
                                                       model.$ProcessNetBase.create(arr,function(error,result){
                                                           if(error){
                                                               console.log(error);
                                                               resolve({"data":null,"error":error,"msg":"触发事件记录出现异常","code":"1001","success":false});
                                                           }else{
                                                               resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true})
                                                           }
                                                       });
                                                   }else{
                                                       console.log("访问失败");
                                                       var condition={};
                                                       condition.proc_task_id=task_id;//:String,//task_id
                                                       condition.user_no=user_no;// : String,//,  required: true,index:  true   },//
                                                       condition.opt_time=new Date();// : Date,// 访问时间
                                                       condition.memo="";// : String,// 访问备注
                                                       condition.path_url=url_address//:String,//类别
                                                       condition.status_code=status//// : String,//访问接口返回状态码
                                                       condition.response_info=res;//:String//返回信息
                                                       var arr=[];
                                                       arr.push(condition);
                                                       model.$ProcessNetBase.create(arr,function(error,result){
                                                           if(error){
                                                               resolve({"data":null,"error":error,"msg":"触发事件记录出现异常","code":"1001","success":false});
                                                           }else{
                                                               resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true})
                                                           }
                                                       });

                                                   }
                                               },
                                               REQ_HEADERS,
                                               {page:1,rows:15,time:new Date(),param:map},
                                               'utf8').on('error', function (e) {
                                               console.log("访问失败");
                                               var condition={};
                                               condition.proc_task_id=task_id;//:String,//task_id
                                               condition.user_no=user_no;// : String,//,  required: true,index:  true   },//
                                               condition.opt_time=new Date();// : Date,// 访问时间
                                               condition.memo="error";// : String,// 访问备注
                                               condition.path_url=url_address//:String,//类别
                                               condition.status_code="404"//// : String,//访问接口返回状态码
                                               condition.response_info=e;//:String//返回信息
                                               var arr=[];
                                               arr.push(condition);
                                               model.$ProcessNetBase.create(arr,function(error,result){
                                                   if(error){
                                                       resolve({"data":null,"error":error,"msg":"触发事件记录出现异常","code":"1001","success":false});
                                                   }else{
                                                       resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true})
                                                   }
                                               });
                                           });

                                       }else{
                                           resolve({"data":null,"error":null,"msg":"触发事件记录出现异常","code":"1001","success":false});
                                       }
                                   }
                               });

                           }else{
                               resolve({"data":null,"error":null,"msg":"触发事件记录出现异常","code":"1001","success":false});
                           }

                       }

                    });
                }
            }

        });

    });
    return p;
}


//触发节点信息事件
function touchNode(detail,user_no,task_id,flag){
    // var current_detail=data.current_detail;
    var p = new Promise(function (resolve,reject){
        if(flag){
            //到达节点触发
            if(detail){
                var item_touchEvent_type=detail.item_touchEvent_type;
                if(item_touchEvent_type==1){
                    //到达节点触发
                    console.log("到达节点触发")
                    var item_filePath=detail.item_filePath;
                    visit(item_filePath,task_id,user_no).then(function(rs){
                        resolve({"data":rs.data,"error":rs.error,"msg":rs.msg,"code":rs.code,"success":rs.success});
                    });
                }else{
                    resolve({"data":null,"error":null,"msg":"触发事件无需求","code":"0000","success":true});
                }
            }else {
                resolve({"data":null,"error":null,"msg":"触发事件记录异常","code":"0000","success":true})
            }
        }else{
            //节点完成之后触发
            if(detail){
                var item_touchEvent_type=detail.item_touchEvent_type;
                if(item_touchEvent_type==2){

                    //节点完成之后触发
                    console.log("节点完成之后触发")
                    var item_filePath=detail.item_filePath;
                    visit(item_filePath,task_id,user_no).then(function(rs){
                        resolve({"data":rs.data,"error":rs.error,"msg":rs.msg,"code":rs.code,"success":rs.success});
                    });
                }else{
                    resolve({"data":null,"error":null,"msg":"触发事件无需求","code":"0000","success":true})
                }
            }else {
                resolve({"data":null,"error":new Error("没有current_detail信息 "),"msg":"触发事件记录异常","code":"1001","success":false})
            }
        }
    });
    return p;

}
/**
 * 流程流转方法
 * @param proc_inst_task_id 任务ID
 * @param node_code 当前操作的节点code
 * @param user_code 操作人 code
 * @param opts 具体操作  ture-下一步，false-驳回
 * @param memo
 * @param param_json_str 做分支选择节点的时候使用的参数 参数格式为json键值对字符串，当不为分支选择节点时传递空字符串
 * @param biz_vars 业务实例变量 json字符串
 */
exports.transfer=function(proc_inst_task_id,node_code,user_code,opts,memo,param_json_str,biz_vars,proc_vars){

    var p=new Promise(function(resolve,reject){
        var params = eval('(' + param_json_str + ')');
        var org={};
        //解析参数
        // if(!(!param_json_str||param_json_str=="undefined"||param_json_str=="{}")){
        //
        //     var params_json=JSON.parse(param_json_str);
        //     // console.log(params_json)
        //     var flag=true;
        //     for(var items_ in params_json){
        //         flag=false;
        //     }
        //     if(flag){
        //         resolve(utils.returnMsg(false, '1001', '参数解析不正确。', null, null));
        //     }else{
        //         params=params_json;
        //     }
        // }else{
        //     params={};
        // }
        if(opts){
            console.log('进来了吗');
            //同意流转
            //查询当前节点的下一节点信息
            var task_id_array=[];
            model.$ProcessInstTask.find({"_id":proc_inst_task_id},function(err,rs){
                if(err){
                    resolve(utils.returnMsg(false, '1001', '查询数据不正确。', null,err));
                }else{
                    if(rs.length>0){
                        var proc_inst_id=rs[0].proc_inst_id;
                        //查找流程实例化
                        model.$ProcessInst.find({"_id":proc_inst_id},function(error,rss){
                            if(rss.length>0){
                                var proc_define_id=rss[0].proc_define_id;
                                var prev_node=rss[0].proc_cur_task;
                                var prev_user=rss[0].proc_cur_user;
                                var proc_define=JSON.parse(rss[0].proc_define);
                                var item_config=JSON.parse(rss[0].item_config);
                                if(!prev_user){
                                    prev_user = user_code;
                                }
                                //查找节点信息
                                nodeAnalysisService.getNode(proc_define_id,node_code,params,true).then(function(rs){
                                    touchNode(rs.data.next_detail,user_code,proc_inst_task_id,true).then(function(resultss){
                                        if(resultss.success){
                                            if(rs.success){
                                                var current_detail=rs.data.current_detail;
                                                var item_type=current_detail.item_type;//当前节点的类型
                                                console.log("ccccccccccccccccccccccccc",item_type);
                                                if(!proc_vars){
                                                    proc_vars = rss[0].proc_vars;
                                                }
                                                if(item_type=="fork"){
                                                    // 并行节点起点的流转
                                                    // create subject process_inst and the inst_task
                                                    var proc_define=JSON.parse(rss[0].proc_define);
                                                    var item_config=JSON.parse(rss[0].item_config);
                                                    var data = {proc_inst_status:3};
                                                    if(proc_vars){
                                                        data = {proc_inst_status:3,proc_vars:proc_vars};
                                                    }else{
                                                        proc_vars = rss[0].proc_vars;
                                                    }
                                                    var conditions = {_id: proc_inst_id};
                                                    var update = {$set: data};
                                                    var options = {};
                                                    //更新原主流程实例化的 状态 进入子流程流转状态
                                                    model.$ProcessInst.update(conditions, update, options, function (errors) {
                                                        if(errors) {
                                                            console.log(errors);
                                                            resolve(utils.returnMsg(false, '1001', '流程流转中时出现异常。', null, errors));
                                                        }else {
                                                            var condition={_id:proc_inst_task_id}
                                                            var datas={proc_inst_task_status:1,proc_inst_task_assignee:user_code,proc_inst_task_complete_time:new Date(),proc_inst_task_remark:memo};
                                                            var updates={$set:datas};
                                                            model.$ProcessInstTask.update(condition, updates, options,function(errr,result_update){
                                                                if(errr){
                                                                    resolve(utils.returnMsg(false, '1001', '流程流转中时出现异常。', null, errr));
                                                                }else{
                                                                    touchNode(current_detail,user_code,proc_inst_task_id,false).then(function(rest){
                                                                        if(rest.success){
                                                                            model.$ProcessInstTask.find({'_id':proc_inst_task_id},function(e,r){
                                                                                if(e){
                                                                                    console.log(e);
                                                                                    resolve(utils.returnMsg(false, '1001', '流程流转中时出现异常。', null, e));
                                                                                }else{
                                                                                    var obj=new Object(r[0]._doc);
                                                                                    obj.proc_task_id=obj._id;
                                                                                    delete obj._id;
                                                                                    var arr_c=[];
                                                                                    arr_c.push(obj);
                                                                                    // console.log(r);4
                                                                                    model.$ProcessTaskHistroy.create(arr_c, function (errs,results){
                                                                                        if(errs){
                                                                                            console.log(errs);
                                                                                            resolve(utils.returnMsg(false, '1001', '流程流转中时出现异常。', null, errs));
                                                                                        }else{
                                                                                            var node_Array=nodeAnalysisService.getNodeArray(proc_define,node_code);
                                                                                            console.log("ajlskflksjadfsjafkljsadlfj:sadfksa-----------________________________1111_______",node_Array);
                                                                                            var k=0;
                                                                                            forkTaskCreate(item_config, proc_define, node_Array, k, user_code, proc_define_id, params, proc_inst_id, resolve, task_id_array,biz_vars,prev_node,prev_user,proc_vars);
                                                                                            resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息时出现异常。',task_id_array, null))
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }else{
                                                                            resolve(rest);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }else{
                                                    var next_node=rs.data.next_node;
                                                    var next_detail=rs.data.next_detail;
                                                    var current_detail=rs.data.current_detail;
                                                    var type=next_node.type;
                                                    console.log("ddddddddddddddddddd",type)
                                                    if(type=="end  round"){
                                                        //归档
                                                        //到达最后一步 不可以流转
                                                        //往实例表中 插入数据
                                                        overFunction(current_detail,proc_inst_id, proc_inst_task_id,user_code,memo).then(function(rs){
                                                            resolve(rs);
                                                        })

                                                    }else if(type=="join"){
                                                        //会签
                                                        //调用会签流转的方法
                                                        joinFunction(proc_inst_id, resolve, reject, node_code, params, proc_inst_task_id,user_code,biz_vars,prev_node,prev_user,proc_vars);//proc_inst_id, resolve, reject, node_code, params, proc_inst_task_id,user_code

                                                    }else{
                                                        //流转（进入普通task的流转的方法）
                                                        //可以流转的状态
                                                        console.log("++++++++++++++++++++++++++++++++++++++")
                                                        //调用普通流转的方法
                                                        normal_process(current_detail,next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,node_code,params,biz_vars,prev_node,prev_user,proc_vars,memo);//next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params
                                                    }
                                                }
                                            }else{
                                                resolve(rs);

                                            }

                                        }else{
                                            resolve(resultss);

                                        }

                                    })

                                });

                            }else{
                                resolve(utils.returnMsg(false, '1001', '查询数据不正确。', null,null));
                            }
                        });


                    }else{
                        resolve(utils.returnMsg(false, '1001', '查询数据不正确。', null,null));
                    }
                }
            });
        }else{
            //驳回的处理方法
            rejectFunction(proc_inst_task_id, node_code, params, reject, resolve, memo,org);
        }

    })
    return p;
}
// exports.transfer=function(proc_inst_task_id,node_code,user_code,opts,memo,param_json_str,biz_vars,proc_vars){
//     var p=new Promise(function(resolve,reject){
//         var params;
//         var org={};
//         //解析参数
//         if(!(!param_json_str||param_json_str=="undefined"||param_json_str=="{}")){
//             var params_json=JSON.parse(param_json_str);
//             // console.log(params_json)
//             var flag=true;
//             for(var items_ in params_json){
//                 flag=false;
//             }
//             if(flag){
//                 resolve(utils.returnMsg(false, '1001', '参数解析不正确。', null, null));
//             }else{
//                 params=params_json;
//             }
//         }else{
//             params={};
//         }

//         if(opts){
//             //同意流转
//             //查询当前节点的下一节点信息
//             var task_id_array=[];
//             model.$ProcessInstTask.find({"_id":proc_inst_task_id},function(err,rs){
//                 if(err){
//                     resolve(utils.returnMsg(false, '1001', '查询数据不正确。', null,err));
//                 }else{
//                     if(rs.length>0){
//                         var proc_inst_id=rs[0].proc_inst_id;
//                         //查找流程实例化
//                         model.$ProcessInst.find({"_id":proc_inst_id},function(error,rss){
//                             if(rss.length>0){
//                                 var proc_define_id=rss[0].proc_define_id;
//                                 var prev_node=rss[0].proc_cur_task;
//                                 var prev_user=rss[0].proc_cur_user;
//                                 var proc_define=JSON.parse(rss[0].proc_define);
//                                 var item_config=JSON.parse(rss[0].item_config);
//                                 if(!prev_user){
//                                     prev_user = user_code;
//                                 }
//                                 //查找节点信息
//                                 nodeAnalysisService.getNode(proc_define_id,node_code,params,true).then(function(rs){
//                                     touchNode(rs.data.next_detail,user_code,proc_inst_task_id,true).then(function(resultss){
//                                         if(resultss.success){
//                                             if(rs.success){
//                                                 var current_detail=rs.data.current_detail;
//                                                 var item_type=current_detail.item_type;//当前节点的类型
//                                                 console.log("ccccccccccccccccccccccccc",item_type);
//                                                 if(item_type=="fork"){
//                                                     // 并行节点起点的流转
//                                                     // create subject process_inst and the inst_task
//                                                     var proc_define=JSON.parse(rss[0].proc_define);
//                                                     var item_config=JSON.parse(rss[0].item_config);
//                                                     var data = {proc_inst_status:3};
//                                                     if(proc_vars){
//                                                         data = {proc_inst_status:3,proc_vars:proc_vars};
//                                                     }else{
//                                                         proc_vars = rss[0].proc_vars;
//                                                     }
//                                                     var conditions = {_id: proc_inst_id};
//                                                     var update = {$set: data};
//                                                     var options = {};
//                                                     //更新原主流程实例化的 状态 进入子流程流转状态
//                                                     model.$ProcessInst.update(conditions, update, options, function (errors) {
//                                                         if(errors) {
//                                                             console.log(errors);
//                                                             resolve(utils.returnMsg(false, '1001', '流程流转中时出现异常。', null, errors));
//                                                         }else {
//                                                             var condition={_id:proc_inst_task_id}
//                                                             var datas={proc_inst_task_status:1,proc_inst_task_assignee:user_code,proc_inst_task_complete_time:new Date(),proc_inst_task_remark:memo};
//                                                             var updates={$set:datas};
//                                                             model.$ProcessInstTask.update(condition, updates, options,function(errr,result_update){
//                                                                 if(errr){
//                                                                     resolve(utils.returnMsg(false, '1001', '流程流转中时出现异常。', null, errr));
//                                                                 }else{
//                                                                     touchNode(current_detail,user_code,proc_inst_task_id,false).then(function(rest){
//                                                                         if(rest.success){
//                                                                             model.$ProcessInstTask.find({'_id':proc_inst_task_id},function(e,r){
//                                                                                 if(e){
//                                                                                     console.log(e);
//                                                                                     resolve(utils.returnMsg(false, '1001', '流程流转中时出现异常。', null, e));
//                                                                                 }else{
//                                                                                     var obj=new Object(r[0]._doc);
//                                                                                     obj.proc_task_id=obj._id;
//                                                                                     delete obj._id;
//                                                                                     var arr_c=[];
//                                                                                     arr_c.push(obj);
//                                                                                     // console.log(r);4
//                                                                                     model.$ProcessTaskHistroy.create(arr_c, function (errs,results){
//                                                                                         if(errs){
//                                                                                             console.log(errs);
//                                                                                             resolve(utils.returnMsg(false, '1001', '流程流转中时出现异常。', null, errs));
//                                                                                         }else{
//                                                                                             var node_Array=nodeAnalysisService.getNodeArray(proc_define,node_code);
//                                                                                             console.log("ajlskflksjadfsjafkljsadlfj:sadfksa-----------________________________1111_______",node_Array);
//                                                                                             var k=0;
//                                                                                             forkTaskCreate(item_config, proc_define, node_Array, k, user_code, proc_define_id, params, proc_inst_id, resolve, task_id_array,biz_vars,prev_node,prev_user,proc_vars);
//                                                                                             resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息时出现异常。',task_id_array, null))
//                                                                                         }
//                                                                                     });
//                                                                                 }
//                                                                             });
//                                                                         }else{
//                                                                             resolve(rest)
//                                                                         }
//                                                                     })

//                                                                 }
//                                                             });
//                                                         }
//                                                     });
//                                                 }else{
//                                                     var next_node=rs.data.next_node;
//                                                     var next_detail=rs.data.next_detail;
//                                                     var current_detail=rs.data.current_detail;
//                                                     var type=next_node.type;
//                                                     console.log("ddddddddddddddddddd",type)
//                                                     if(type=="end  round"){
//                                                         //归档
//                                                         //到达最后一步 不可以流转
//                                                         //往实例表中 插入数据
//                                                         console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
//                                                         overFunction(current_detail,proc_inst_id, proc_inst_task_id,user_code,memo).then(function(rs){
//                                                             resolve(rs);
//                                                         })

//                                                     }else if(type=="join"){
//                                                         //会签
//                                                         //调用会签流转的方法
//                                                         joinFunction(proc_inst_id, resolve, reject, node_code, params, proc_inst_task_id,user_code,biz_vars,prev_node,prev_user,proc_vars);//proc_inst_id, resolve, reject, node_code, params, proc_inst_task_id,user_code

//                                                     }else{
//                                                         //流转（进入普通task的流转的方法）
//                                                         //可以流转的状态
//                                                         console.log("++++++++++++++++++++++++++++++++++++++")
//                                                         //调用普通流转的方法
//                                                         normal_process(current_detail,next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,node_code,params,biz_vars,prev_node,prev_user,proc_vars);//next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params
//                                                     }
//                                                 }
//                                             }else{
//                                                 resolve(rs);

//                                             }

//                                         }else{
//                                             resolve(resultss);

//                                         }

//                                     })

//                                 });

//                             }else{
//                                 resolve(utils.returnMsg(false, '1001', '查询数据不正确。', null,null));
//                             }
//                         });


//                     }else{
//                         resolve(utils.returnMsg(false, '1001', '查询数据不正确。', null,null));
//                     }
//                 }
//             });
//         }else{
//             //驳回的处理方法
//             rejectFunction(proc_inst_task_id, node_code, params, reject, resolve, memo,org);
//         }

//     })
//     return p;
// }

function forkTaskCreate(item_config, proc_define, node_Array, k, user_code, proc_define_id, params, proc_inst_id, resolve, task_id_array,biz_vars,prev_node,prev_user,proc_vars) {
    if(node_Array && node_Array.length>k){
        var results = nodeAnalysisService.getNodeInfo(item_config, proc_define, node_Array[k], null);
        var current_detail = results.current_detail;
        var current_nodes = results.current_node
        nodeAnalysisService.findCurrentHandler(user_code, proc_define_id, node_Array[k], params, proc_inst_id).then(function (rs) {
            console.log(rs)
            nodeAnalysisService.findParams(proc_inst_id, node_Array[k]).then(function (result_t) {
                // console.log("ajlskflksjadfsjafkljsadlfj:sadfksa-----------________________3333_______________", node_Array[k]);
                // console.log(next_detail);
                // console.log(next_nodes);
                var proc_cur_task = current_detail.item_code;
                var proc_inst_node_vars = current_detail.item_node_var;
                var proc_cur_task_name = current_nodes.type;
                var org = rs.data;
                var proc_inst_task_params = result_t.data;
                // resolve(utils.returnMsg(true, '0000', '流转流程实例成功。', null, null));
                //创建下一步流转任务
                var condition_task = {};
                condition_task.proc_inst_task_sign = 0;// : Number,// 流程签收(0-未认领，1-已认领)
                condition_task.proc_inst_id = proc_inst_id;//: {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
                condition_task.proc_inst_task_code = proc_cur_task;// : String,// 流程当前节点编码(流程任务编号)
                condition_task.proc_inst_task_name =current_nodes.name;//: String,// 流程当前节点名称(任务名称)
                condition_task.proc_inst_task_type = proc_cur_task_name;//: String,// 流程当前节点类型(任务类型)
                condition_task.proc_inst_task_arrive_time = new Date();//,// 流程到达时间
                condition_task.proc_inst_task_handle_time = '';//,// 流程认领时间
                condition_task.proc_inst_task_complete_time = "";// : Date,// 流程完成时间
                condition_task.proc_inst_task_status = 0;// : Number,// 流程当前状态 0-未处理，1-已完成，2-拒绝
                if (current_detail.item_assignee_type == 1) {
                    condition_task.proc_inst_task_assignee = current_detail.item_assignee_user_code;//: String,// 流程处理人code
                    condition_task.proc_inst_task_assignee_name = current_detail.item_show_text;//: String,// 流程处理人名
                    condition_task.proc_inst_task_complete_time = new Date();
                    condition_task.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)
                }
                if (current_detail.item_assignee_type == 2 || current_detail.item_assignee_type == 3|| current_detail.item_assignee_type == 4) {
                    condition_task.proc_inst_task_user_role = current_detail.item_assignee_role;// : String,// 流程处理用户角色ID
                    condition_task.proc_inst_task_user_role_name = current_detail.item_show_text;// : String,// 流程处理用户角色名

                }
                // condition_task.proc_inst_task_user_org_name=org.user_org_name;
                condition_task.proc_inst_task_user_org = org.user_org_id;

                if (org.proc_inst_task_assignee) {
                    condition_task.proc_inst_task_assignee = org.proc_inst_task_assignee;
                }
                if (org.proc_inst_task_assignee_name) {
                    condition_task.proc_inst_task_assignee_name = org.proc_inst_task_assignee_name;
                }
                condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
                condition_task.proc_inst_node_vars = proc_inst_node_vars;// 流程节点变量
                condition_task.proc_inst_biz_vars = biz_vars;// : String,// 业务实例变量
                condition_task.proc_inst_prev_node_code = prev_node;// : String,// 上一节点编号
                condition_task.proc_inst_prev_node_handler_user = prev_user;// : String,// 上一节点处理人编号
                condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
                condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
                condition_task.proc_inst_task_sms = "";// Number,// 流程是否短信提醒
                condition_task.proc_inst_task_remark = "";// : String// 流程处理意见
                condition_task.proc_vars = proc_vars;// 流程变量

                var arr = [];
                arr.push(condition_task);
                console.log(condition_task);
                //创建新流转任务
                model.$ProcessInstTask.create(arr, function (error, rs) {
                    if (error) {
                        // resolve('新增流程实例信息时出现异常。'+error);
                        resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, error));
                    } else {
                        task_id_array.push(rs.data);
                        forkTaskCreate(item_config, proc_define, node_Array,++k, user_code, proc_define_id, params, proc_inst_id, resolve, task_id_array,biz_vars,prev_node,prev_user,proc_vars);

                    }

                });
            });

        })
    }
}


//驳回方法
function rejectFunction(proc_inst_task_id, node_code, params, reject, resolve, memo,org) {
//驳回
    model.$ProcessInstTask.find({"_id": proc_inst_task_id}, function (err, rs) {
        var proc_inst_id = rs[0].proc_inst_id;
        model.$ProcessInst.find({"_id": proc_inst_id}, function (error, rss) {
            var proc_define_id = rss[0].proc_define_id;

            nodeAnalysisService.getNode(proc_define_id, node_code, params, false).then(function (rs) {
                var last_node = rs.data.last_node;
                var last_detail = rs.data.last_datail;
                var proc_cur_task = last_detail.item_code;
                var proc_cur_task_name = last_node.name;
                var proc_cur_user;
                if (last_detail.item_assignee_type == 1) {
                    proc_cur_user = last_detail.item_assignee_user;
                } else {
                    proc_cur_user = last_detail.item_assignee_role;
                }
                var proc_cur_user_name = last_detail.item_show_text;
                var conditions = {_id: proc_inst_id};
                var data = {};
                data.proc_cur_task_name = proc_cur_task_name;
                data.proc_cur_task = proc_cur_task;
                data.proc_cur_user = proc_cur_user;
                data.proc_cur_user_name = proc_cur_user_name;
                data.proce_reject_params = "true";
                var update = {$set: data};
                var options = {};
                model.$ProcessInst.update(conditions, update, options, function (errors) {
                    if (errors) {
                        resolve(utils.returnMsg(false, '1001', '流转流程驳回时出现异常。', null, errors));
                    } else {
                        //修改当前任务状态
                        var condition_update = {};
                        condition_update.proc_inst_task_status = 2;
                        condition_update.proc_inst_task_complete_time = new Date();
                        condition_update.proc_inst_task_remark = memo;
                        model.$ProcessInstTask.update({_id: proc_inst_task_id}, {$set: condition_update}, {}, function (errors) {
                            if (errors) {
                                resolve(utils.returnMsg(false, '1001', '驳回时修改当前任务出现异常。', null, errors));
                            }
                            else {
                                // resolve(utils.returnMsg(true, '0000', '流转流程实例成功。', null, null));
                                //给驳回节点发送任务
                                var condition_task = {};
                               nodeAnalysisService.findParams(proc_inst_id,node_code).then(function(result_t){
                                   var proc_inst_task_params=result_t.data
                                   condition_task.proc_inst_task_sign = 0;// : Number,// 流程签收(0-未认领，1-已认领)
                                   condition_task.proc_inst_id = proc_inst_id;//: {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
                                   condition_task.proc_inst_task_code = proc_cur_task;// : String,// 流程当前节点编码(流程任务编号)
                                   condition_task.proc_inst_task_name = proc_cur_task_name;//: String,// 流程当前节点名称(任务名称)
                                   condition_task.proc_inst_task_type = last_node.name;//: String,// 流程当前节点类型(任务类型)
                                   condition_task.proc_inst_task_arrive_time = new Date();//,// 流程到达时间
                                   condition_task.proc_inst_task_handle_time = '';//,// 流程认领时间
                                   condition_task.proc_inst_task_complete_time = "";// : Date,// 流程完成时间
                                   condition_task.proc_inst_task_status = 0;// : Number,// 流程当前状态 0-未处理，1-已完成，2-拒绝
                                   if (last_detail.item_assignee_type == 1) {
                                       condition_task.proc_inst_task_assignee = last_detail.item_assignee_user_code;//: String,// 流程处理人code
                                       condition_task.proc_inst_task_assignee_name = last_detail.item_show_text;//: String,// 流程处理人名
                                       condition_task.proc_inst_task_complete_time = new Date();
                                       condition_task.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)

                                   }
                                   if (last_detail.item_assignee_type == 2||last_detail.item_assignee_type==3||last_detail.item_assignee_type==4) {
                                       condition_task.proc_inst_task_user_role = last_detail.item_assignee_role;// : String,// 流程处理用户角色ID
                                       condition_task.proc_inst_task_user_role_name = last_detail.item_show_text;// : String,// 流程处理用户角色名
                                   }
                                   condition_task.proc_inst_task_user_org=org.user_org;
                                   // condition_task.proc_inst_task_user_org_name=org.user_org_name;

                                   condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
                                   condition_task.proc_inst_task_claim = "";//: Number,// 流程会签

                                   condition_task.proc_inst_task_sms = "";// Number,// 流程是否短信提醒
                                   // condition_task.proc_inst_task_remark = memo;// : String// 流程处理意见

                                   var arr = [];
                                   arr.push(condition_task);
                                   model.$ProcessInstTask.create(arr, function (error, rs) {
                                       if (error) {
                                           // reject('新增流程实例信息时出现异常。'+error);
                                           reject(utils.returnMsg(false, '1000', '驳回节点新建任务时出现异常。', null, error));
                                       }
                                       else {
                                           resolve(utils.returnMsg(true, '0000', '驳回成功。', null, null));
                                       }
                                   });
                               })
                            }
                        });
                    }
                });
            });
        });

    });
}

//会签流程方法
function joinFunction(proc_inst_id, resolve, reject, node_code, params, proc_inst_task_id,user_code,biz_vars,prev_node,prev_user,proc_vars,memo) {
    var condition={_id:proc_inst_task_id}
    var datas={proc_inst_task_status:1,proc_inst_task_assignee:user_code,proc_inst_task_complete_time:new Date(),proc_inst_task_remark:memo};
    var updates={$set:datas};
    //更新原任务
    model.$ProcessInstTask.update(condition, updates, {}, function (errors,results) {
        if (errors) {
            console.log(errors)
            resolve(utils.returnMsg(false, '1001', '归档流程实例时出现异常。', null, errors));
        } else {

            var query=model.$ProcessInstTask.find({});
            if (proc_inst_id != null) {
                query.where("proc_inst_id", proc_inst_id);
            }
            query.where("proc_inst_task_status",0);
            query.sort({proc_inst_task_complete_time: -1});
            query.exec(function (err, rs){
                if (err) {
                    console.log(err)
                    resolve(utils.returnMsg(false, '1001', '读取归档数据时出现异常。', null, err));

                }else{
                    if(rs.length>0){
                        resolve(utils.returnMsg(true, '0000', '正常运转。', null, null));
                    }else{
                        model.$ProcessInst.find({_id:proc_inst_id},function(err,result){
                            if(err){
                                console.log(err)
                                resolve(utils.returnMsg(false, '1001', '读取归档数据时出现异常。', null, err));
                            }else{
                                var proc_define_id=result[0].proc_define_id;
                                nodeAnalysisService.getNode(proc_define_id, node_code, params, true).then(function (results) {
                                    var next_detail = results.data.next_detail;
                                    var current_detail=results.data.current_detail;
                                    var next_node = results.data.next_node;
                                    normal_process(current_detail,next_detail, next_node, proc_inst_id, resolve, reject,proc_define_id,proc_inst_task_id,user_code,node_code,params,biz_vars,prev_node,prev_user,proc_vars,memo);//next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node
                                });

                            }

                        });

                    }

                }

            });

        }
    });
}

//归档function        current_detail,proc_inst_id, proc_inst_task_id,user_code,memo
function overFunction(current_detail,proc_inst_id, proc_inst_task_id,user_code,memo) {
    var data = {};
    data.proc_inst_task_status=1;
    data.proc_inst_task_complete_time=new Date();
    data.proc_inst_task_handler_code=user_code;
    data.proc_inst_task_remark=memo;
    var conditions = {_id: proc_inst_task_id};
    var update = {$set: data};
    var options = {};
    var p=new Promise(function(resolve,reject){
       // 更新当前任务的状态
        model.$ProcessInstTask.update(conditions, update, options, function (errors,resultss) {
            if (errors) {
                console.log(errors);
                resolve(utils.returnMsg(false, '1001', '归档流程实例时出现异常。', null, errors));
            }else {
                touchNode(current_detail,user_code,proc_inst_task_id,false).then(function(rest){
                    if(rest.success){
                        model.$ProcessInstTask.find({'_id':proc_inst_task_id},function(e,r){
                            if(e){
                                console.log(e);
                                resolve(utils.returnMsg(false, '1001', '归档流程实例时出现异常。', null, e));
                            }else{
                                var obj=new Object(r[0]._doc)
                                obj.proc_task_id=obj._id;
                                delete obj._id;
                                var arr_c=[];
                                arr_c.push(obj)
                                // console.log(arr_c);1
                                model.$ProcessTaskHistroy.create(arr_c, function (errs,results){
                                    if(errs){
                                        console.log(errs);
                                        resolve(utils.returnMsg(false, '1001', '归档流程实例时出现异常。', null, errs));
                                    }else{
                                        // console.log(resultss)
                                        var query = model.$ProcessInstTask.find({});
                                        if (proc_inst_id != null) {
                                            query.where("proc_inst_id", proc_inst_id);
                                        }
                                        query.sort({proc_inst_task_complete_time: -1});
                                        //查询所有的该流程的任务过程 存到历史中去
                                        query.exec(function (err, rs) {
                                            if (err) {
                                                console.log(err)
                                                resolve(utils.returnMsg(false, '1001', '读取归档数据时出现异常。', null, err));
                                            } else {
                                                var proc_task_history = JSON.stringify(rs);
                                                var data = {proc_inst_status: 4, proc_task_history: proc_task_history};
                                                var conditions = {_id: proc_inst_id};
                                                var update = {$set: data};
                                                var options = {};
                                                //吧所有的任务过程写入流程实例化的历史中去  同时更新状态
                                                model.$ProcessInst.update(conditions, update, options, function (errors) {
                                                    if (errors) {
                                                        console.log(errors)
                                                        resolve(utils.returnMsg(false, '1001', '归档流程实例时出现异常。', null, errors));
                                                    }
                                                    else {
                                                        model.$ProcessInstTask.remove({"proc_inst_id":proc_inst_id},function(error,results){
                                                            if(error){
                                                                resolve(utils.returnMsg(false, '1001', '归档流程实例时出现异常。', null, error));
                                                            }else{
                                                                resolve(utils.returnMsg(true, '0000', '归档流程实例成功。', null, null));

                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }else{
                        resolve(rest)
                    }
                })

            }
        });
    });
    return p;
}


function deleteById(ids,k){
    if(ids&&ids.length>k){
        instanceService.taskDelete(ids[k]).then(function(rs){
            k++;
            deleteById(ids,k)
        })
    }
}


//正常流转方法
function normal_process(current_detail,next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params,biz_vars,prev_node,prev_user,proc_vars,memo) {
    var proc_cur_task = next_detail.item_code;
    var proc_inst_node_vars = next_detail.item_node_var;
    var proc_cur_task_name = next_node.name;
    var proc_cur_user;
    if (next_detail.item_assignee_type == 1) {
        proc_cur_user = next_detail.item_assignee_user;

    } else {
        // proc_cur_user = user_code;
        // proc_cur_user = next_detail.item_assignee_role;
    }
    var proc_cur_user_name = next_detail.item_show_text;

    var conditions = {_id: proc_inst_id};
    var data = {};
    data.proc_cur_task_name = proc_cur_task_name;
    data.proc_cur_task = proc_cur_task;
    data.proc_cur_user = proc_cur_user;
    data.proc_cur_user_name = proc_cur_user_name;
    data.proc_inst_status=2;
    data.proc_vars = proc_vars;
    var update = {$set: data};
    var options = {};
    //更新流程实例化状态和参数
    model.$ProcessInst.update(conditions, update, options, function (errors) {
        if (errors) {
            console.log(errors)
            reject(utils.returnMsg(false, '1001', '流转流程实例时出现异常。', null, errors));
        }
        else {

            var conditions_original={"_id":proc_inst_task_id}
            var data_original={};
            data_original.proc_inst_task_complete_time=new Date();
            data_original.proc_inst_task_status=1
            data_original.proc_inst_task_assignee=user_code;
            data_original.proc_inst_task_remark = memo;
            var update_original={$set:data_original}
            //更新当前流程任务
            model.$ProcessInstTask.update(conditions_original, update_original, options, function (error,results){
                if(error){
                    console.log(error);
                    resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, error));

                }else{
                    console.log(results);
                    touchNode(current_detail,user_code,proc_inst_task_id,false).then(function(rest){
                        if(rest.success){
                            model.$ProcessInstTask.find({'_id':proc_inst_task_id},function(e,r){
                                if(e){
                                    console.log(e);
                                    resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, e));
                                }
                                else{

                                    var obj=new Object(r[0]._doc)
                                    obj.proc_task_id=obj._id;
                                    delete obj._id;
                                    var arr_c=[];
                                    arr_c.push(obj)
                                    var role_code = r[0].proc_task_start_user_role_code;//发起人角色id
                                    var role_name = r[0].proc_task_start_user_role_names;//发起人角色名
                                    var name = r[0].proc_task_start_name;//流程发起人
                                    var proc_code = r[0].proc_code;//流程编码
                                    var proc_name = r[0].proc_name;//流程名称
                                    // console.log(arr_c);2
                                    model.$ProcessTaskHistroy.create(arr_c, function (es,results){
                                        if(es){
                                            console.log(es);
                                            resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, es));
                                        }else{

                                            //建立下一步流程任务
                                            //查找下一步执行人的角色或者参入人 等等信息
                                            nodeAnalysisService.findNextHandler(user_code,proc_define_id,current_node,params,proc_inst_id).then(function(rs){
                                                nodeAnalysisService.findParams(proc_inst_id,current_node).then(function(result_t){
                                                    console.log("ksjfksadjfksdfjsdkjfsdkfjlsdjfksadfasdfj000000000000000000000000",rs.data);
                                                    var org=rs.data;
                                                    var proc_inst_task_params=result_t.data;
                                                    // resolve(utils.returnMsg(true, '0000', '流转流程实例成功。', null, null));

                                                    //创建下一步流转任务

                                                    var condition_task = {};
                                                    condition_task.proc_inst_task_sign = 0;// : Number,// 流程签收(0-未认领，1-已认领)
                                                    condition_task.proc_inst_id = proc_inst_id;//: {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
                                                    condition_task.proc_inst_task_code = proc_cur_task;// : String,// 流程当前节点编码(流程任务编号)
                                                    condition_task.proc_inst_task_name = proc_cur_task_name;//: String,// 流程当前节点名称(任务名称)
                                                    condition_task.proc_inst_task_type = next_node.name;//: String,// 流程当前节点类型(任务类型)
                                                    condition_task.proc_inst_task_arrive_time = new Date();//,// 流程到达时间
                                                    condition_task.proc_inst_task_handle_time = '';//,// 流程认领时间
                                                    condition_task.proc_inst_task_complete_time = "";// : Date,// 流程完成时间
                                                    condition_task.proc_inst_task_status = 0;// : Number,// 流程当前状态 0-未处理，1-已完成，2-拒绝
                                                    if (next_detail.item_assignee_type == 1) {
                                                        condition_task.proc_inst_task_assignee = next_detail.item_assignee_user_code;//: String,// 流程处理人code
                                                        condition_task.proc_inst_task_assignee_name = next_detail.item_show_text;//: String,// 流程处理人名
                                                        condition_task.proc_inst_task_complete_time = new Date();
                                                        condition_task.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)

                                                    }
                                                    if (next_detail.item_assignee_type == 2||next_detail.item_assignee_type == 3||next_detail.item_assignee_type == 4) {
                                                        condition_task.proc_inst_task_user_role = (next_detail.item_assignee_role).indexOf(",")?(next_detail.item_assignee_role).split(","):[next_detail.item_assignee_role];// : String,// 流程处理用户角色ID
                                                        condition_task.proc_inst_task_user_role_name = next_detail.item_show_text;// : String,// 流程处理用户角色名

                                                    }
                                                    // condition_task.proc_inst_task_user_org_name=org.user_org_name;
                                                    condition_task.proc_inst_task_user_org=org.user_org_id;

                                                    if(org.proc_inst_task_assignee) {
                                                        condition_task.proc_inst_task_assignee = org.proc_inst_task_assignee;
                                                    }
                                                    if(org.proc_inst_task_assignee_name){
                                                        condition_task.proc_inst_task_assignee_name=org.proc_inst_task_assignee_name;
                                                    }
                                                    async function xunhuan () {
                                                        if (params && 'undefined' != params.flag && !params.flag) {
                                                            let step_first = await  model.$ProcessInstTask.find({
                                                                'proc_inst_id': r[0].proc_inst_id,
                                                                'proc_inst_task_code': proc_cur_task

                                                            });
                                                            condition_task.proc_inst_id = step_first[0].proc_inst_id;
                                                            condition_task.proc_inst_task_assignee = step_first[0].proc_inst_task_assignee;
                                                            condition_task.proc_inst_task_assignee_name = step_first[0].proc_inst_task_assignee_name;

                                                            // condition_task.proc_inst_task_user_role = (next_detail.item_assignee_role).indexOf(",")?(next_detail.item_assignee_role).split(","):[next_detail.item_assignee_role];
                                                            condition_task.proc_inst_task_user_role_name = next_detail.item_assignee_role_name;
                                                            condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
                                                            condition_task.proc_inst_node_vars = proc_inst_node_vars;// 流程节点变量
                                                            condition_task.proc_inst_biz_vars = biz_vars;// : String,// 业务实例变量
                                                            condition_task.proc_inst_task_title = step_first[0].proc_inst_task_title;
                                                            condition_task.proc_inst_prev_node_code = r[0].proc_inst_task_code;// : String,// 上一节点编号
                                                            condition_task.proc_inst_prev_node_handler_user = prev_user;// : String,// 上一节点处理人编号
                                                            condition_task.proc_vars =r[0].proc_vars;// 流程变量
                                                            condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
                                                            condition_task.proc_inst_task_sms = next_detail.item_sms_warn;// Number,// 流程是否短信提醒
                                                            condition_task.proc_inst_task_remark = "";
                                                            //condition_task.proc_inst_task_remark = r[0].proc_inst_task_remark;// : String// 流程处理意见
                                                        }
                                                        else{
                                                         
                                                            
                                                            condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
                                                            condition_task.proc_inst_node_vars = proc_inst_node_vars;// 流程节点变量
                                                            condition_task.proc_inst_biz_vars = biz_vars;// : String,// 业务实例变量
                                                            condition_task.proc_inst_prev_node_code = r[0].proc_inst_task_code;// : String,// 上一节点编号
                                                            condition_task.proc_inst_prev_node_handler_user = r[0].proc_inst_task_assignee_name;// : String,// 上一节点处理人编号
                                                            condition_task.proc_vars = r[0].proc_vars;// 流程变量
                                                            condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
                                                            condition_task.proc_inst_task_sms = next_detail.item_sms_warn;// Number,// 流程是否短信提醒
                                                            condition_task.proc_inst_task_remark = "";// : String// 流程处理意见
                                                        }
                                                       
                                                    }

                                                        xunhuan().then(function(res){ 
                                                            var arr = [];
                                                            condition_task.proc_code=proc_code;//流程编码
                                                            condition_task.proc_name=proc_name;//流程名称
                                                            condition_task.proc_task_start_user_role_names = role_name;//流程发起人角色
                                                            condition_task.proc_task_start_user_role_code = role_code;//流程发起人id
                                                            condition_task.proc_task_start_name = name;//流程发起人角色
                                                            arr.push(condition_task);
                                                            //创建新流转任务
                                                            model.$ProcessInstTask.create(arr, function (error, rs) {
                                                                if (error) {
                                                                    // resolve('新增流程实例信息时出现异常。'+error);
                                                                    resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, error));
                                                                }else {
                                                                    //如果是发短信,目前库的user_no即电话号码，所以直接使用user_no
                                                                    if(condition_task.proc_inst_task_assignee && condition_task.proc_inst_task_sms=='1' ){
                                                                        var process_utils = require('../../../utils/process_util');
                                                                        var mobile=condition_task.proc_inst_task_assignee;

                                                                        var params= {
                                                                            "procName":proc_name,
                                                                            "orderNo":condition_task.proc_inst_id
                                                                        }
                                                                        process_utils.sendSMS(mobile,params).then(function(rs){
                                                                            console.log("短信发送成功");
                                                                        }).catch(function(err){
                                                                            console.log("短信发送失败",err);
                                                                        });
                                                                    }
                                                                    console.log("))))))))))))))))))))))))))))))))))))))))))))))s")
                                                                    console.log(rs);
                                                                    resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常。', rs, null))
                                                                }
                                                            });
                                                            // resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常833333。',res, null));
                                                        }).catch(function(err){
                                                            console.log(err);
                                                        });
                                                });
                                            });
                                        }

                                    })
                                }
                            })
                        }else{
                            resolve(rest);
                        }
                    })
                }
            });
        }
    });
}

// function normal_process(current_detail,next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params,biz_vars,prev_node,prev_user,proc_vars,memo) {
//     var proc_cur_task = next_detail.item_code;
//     var proc_inst_node_vars = next_detail.item_node_var;
//     var proc_cur_task_name = next_node.name;
//     var proc_cur_user;
//     if (next_detail.item_assignee_type == 1) {
//         proc_cur_user = next_detail.item_assignee_user;

//     } else {
//         // proc_cur_user = user_code;
//         // proc_cur_user = next_detail.item_assignee_role;
//     }
//     var proc_cur_user_name = next_detail.item_show_text;

//     var conditions = {_id: proc_inst_id};
//     var data = {};
//     data.proc_cur_task_name = proc_cur_task_name;
//     data.proc_cur_task = proc_cur_task;
//     data.proc_cur_user = proc_cur_user;
//     data.proc_cur_user_name = proc_cur_user_name;
//     data.proc_inst_status=2;
//     data.proc_vars = proc_vars;
//     var update = {$set: data};
//     var options = {};
//     //更新流程实例化状态和参数
//     model.$ProcessInst.update(conditions, update, options, function (errors) {
//         if (errors) {
//             console.log(errors)
//             reject(utils.returnMsg(false, '1001', '流转流程实例时出现异常。', null, errors));
//         }
//         else {

//             var conditions_original={"_id":proc_inst_task_id}
//             var data_original={};
//             data_original.proc_inst_task_complete_time=new Date();
//             data_original.proc_inst_task_status=1
//             data_original.proc_inst_task_assignee=user_code;
//             data_original.proc_inst_task_remark = memo;
//             var update_original={$set:data_original}
//             //更新当前流程任务
//             model.$ProcessInstTask.update(conditions_original, update_original, options, function (error,results){
//                 if(error){
//                     console.log(error);
//                     resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, error));

//                 }else{
//                     console.log(results);
//                     touchNode(current_detail,user_code,proc_inst_task_id,false).then(function(rest){
//                         if(rest.success){
//                             model.$ProcessInstTask.find({'_id':proc_inst_task_id},function(e,r){
//                                 if(e){
//                                     console.log(e);
//                                     resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, e));
//                                 }else{
//                                     var obj=new Object(r[0]._doc)
//                                     obj.proc_task_id=obj._id;
//                                     delete obj._id;
//                                     var arr_c=[];
//                                     arr_c.push(obj)
//                                     // console.log(arr_c);2
//                                     model.$ProcessTaskHistroy.create(arr_c, function (es,results){
//                                         if(es){
//                                             console.log(es);
//                                             resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, es));
//                                         }else{

//                                             //建立下一步流程任务

//                                             //查找下一步执行人的角色或者参入人 等等信息
//                                             nodeAnalysisService.findNextHandler(user_code,proc_define_id,current_node,params,proc_inst_id).then(function(rs){
//                                                 nodeAnalysisService.findParams(proc_inst_id,current_node).then(function(result_t){
//                                                     console.log("ksjfksadjfksdfjsdkjfsdkfjlsdjfksadfasdfj000000000000000000000000",rs.data)
//                                                     var org=rs.data;
//                                                     var proc_inst_task_params=result_t.data;
//                                                     // resolve(utils.returnMsg(true, '0000', '流转流程实例成功。', null, null));
//                                                     //创建下一步流转任务
//                                                     var condition_task = {};
//                                                     condition_task.proc_inst_task_sign = 0;// : Number,// 流程签收(0-未认领，1-已认领)
//                                                     condition_task.proc_inst_id = proc_inst_id;//: {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
//                                                     condition_task.proc_inst_task_code = proc_cur_task;// : String,// 流程当前节点编码(流程任务编号)
//                                                     condition_task.proc_inst_task_name = proc_cur_task_name;//: String,// 流程当前节点名称(任务名称)
//                                                     condition_task.proc_inst_task_type = next_node.name;//: String,// 流程当前节点类型(任务类型)
//                                                     condition_task.proc_inst_task_arrive_time = new Date();//,// 流程到达时间
//                                                     condition_task.proc_inst_task_handle_time = '';//,// 流程认领时间
//                                                     condition_task.proc_inst_task_complete_time = "";// : Date,// 流程完成时间
//                                                     condition_task.proc_inst_task_status = 0;// : Number,// 流程当前状态 0-未处理，1-已完成，2-拒绝
//                                                     if (next_detail.item_assignee_type == 1) {
//                                                         condition_task.proc_inst_task_assignee = next_detail.item_assignee_user_code;//: String,// 流程处理人code
//                                                         condition_task.proc_inst_task_assignee_name = next_detail.item_show_text;//: String,// 流程处理人名
//                                                         condition_task.proc_inst_task_complete_time = new Date();
//                                                         condition_task.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)

//                                                     }
//                                                     if (next_detail.item_assignee_type == 2||next_detail.item_assignee_type == 3) {
//                                                         condition_task.proc_inst_task_user_role = next_detail.item_assignee_role;// : String,// 流程处理用户角色ID
//                                                         condition_task.proc_inst_task_user_role_name = next_detail.item_show_text;// : String,// 流程处理用户角色名

//                                                     }
//                                                     // condition_task.proc_inst_task_user_org_name=org.user_org_name;
//                                                     condition_task.proc_inst_task_user_org=org.user_org_id;

//                                                     if(org.proc_inst_task_assignee) {
//                                                         condition_task.proc_inst_task_assignee = org.proc_inst_task_assignee;
//                                                     }
//                                                     if(org.proc_inst_task_assignee_name){
//                                                         condition_task.proc_inst_task_assignee_name=org.proc_inst_task_assignee_name;
//                                                     }
//                                                     condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
//                                                     condition_task.proc_inst_node_vars = proc_inst_node_vars;// 流程节点变量
//                                                     condition_task.proc_inst_biz_vars = biz_vars;// : String,// 业务实例变量
//                                                     condition_task.proc_inst_prev_node_code = prev_node;// : String,// 上一节点编号
//                                                     condition_task.proc_inst_prev_node_handler_user = prev_user;// : String,// 上一节点处理人编号
//                                                     condition_task.proc_vars = proc_vars;// 流程变量
//                                                     condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
//                                                     condition_task.proc_inst_task_sms = "";// Number,// 流程是否短信提醒
//                                                     condition_task.proc_inst_task_remark = "";// : String// 流程处理意见

//                                                     var arr = [];
//                                                     arr.push(condition_task);
//                                                     //创建新流转任务
//                                                     model.$ProcessInstTask.create(arr, function (error, rs) {
//                                                         if (error) {
//                                                             // resolve('新增流程实例信息时出现异常。'+error);
//                                                             resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常。', null, error));
//                                                         }else {
//                                                             resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常。', rs, null))
//                                                         }
//                                                     });
//                                                 });
//                                             });
//                                         }

//                                     })
//                                 }
//                             })
//                         }else{
//                             resolve(rest);
//                         }
//                     })
//                 }
//             });
//         }
//     });
// }

//指定人的流程任务建立及相关任务的完成

/**
 *
 * @param proc_task_id 当前任务Id
 * @param node_code  指定的下一步节点 编号
 * @param user_code 当前节点 操作人
 * @param assign_user_code  指定的下一步节点操作人
 * @param proc_title
 * @param biz_vars
 * @returns {bluebird}
 */
exports.assign_transfer=function(proc_task_id,node_code,user_code,assign_user_code,proc_title,biz_vars,proc_vars,memo){
    console.log(proc_task_id,node_code,user_code,assign_user_code,proc_title,biz_vars,proc_vars,memo);
    //next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params
    var p = new  Promise(function(resolve,reject){


        model.$ProcessInstTask.find({"_id":proc_task_id},function(err,rs){
            if(err){
                console.log(err);
                resolve(utils.returnMsg(false, '1000', '流程流转出现异常1。', null, err));
            }else{
                if(rs.length>0){
                   var proc_inst_id= rs[0].proc_inst_id;
                   model.$ProcessInst.find({"_id":proc_inst_id},function(errs,res){
                       if(errs){
                           resolve(utils.returnMsg(false, '1000', '流程流转出现异常2。', null, errs));

                       }else{
                           if(res.length>0) {
                               var prev_node = res[0].proc_cur_task;
                               var proc_code=res[0].proc_code;
                               var proc_name=res[0].proc_name;
                               var inst_id=res[0]._id;
                               console.log("cuurent     ______",res);
                               var prev_user = res[0].proc_cur_user;
                               var proc_define = JSON.parse(res[0].proc_define);
                               var item_config = JSON.parse(res[0].item_config);
                               console.log("item_config111",item_config);
                               var nodes = proc_define.nodes
                               var next_node = nodes[node_code];
                               var current_node=nodes[prev_node];
                               var next_detail, current_detail;

                               for (var item in  item_config) {
                                   // console.log(item_config)
                                   // console.log(item_config[item].item_code);
                                   if (item_config[item].item_code == prev_node) {
                                       current_detail = item_config[item];
                                   }
                                   if(item_config[item].item_code == node_code){

                                       next_detail=item_config[item];
                                   }
                               }
                               // console.log(item_config);
                               if (!prev_user) {
                                   prev_user = user_code;
                               }
                               console.log("current_detail    ",current_detail,prev_node,"\n",current_node);
                               console.log("next_detail       ",next_detail,node_code,"\n",next_node);
                               // var proc_cur_task = current_detail.item_code;
                               // var proc_cur_task_name = current_node.name;
                               //是否短信通知
                               var item_sm_warn=next_detail.item_sms_warn;
                               if(!next_detail||!current_detail){
                                   resolve(utils.returnMsg(false, '1010', '节点信息异常', null));
                                   return;
                               }
                               console.log(next_detail,'next_detailnext_detailaaaa');
                               //var proc_inst_node_vars = next_detail.item_node_var;
                               if(res[0].proc_code=='p-108'){
                                   //针对稽核系统
                                   var proc_inst_node_vars = item_config[2].item_node_var;
                               }else{
                                   var proc_inst_node_vars = next_detail.item_node_var;
                               }
                                //var proc_inst_node_vars = current_detail.item_node_var;
                                console.log(proc_inst_node_vars,'proc_inst_node_varsproc_inst_node_vars11');
                               var proc_cur_user;
                               if (current_detail.item_assignee_type == 1) {
                                   proc_cur_user = current_detail.item_assignee_user;

                               } else {
                                   // proc_cur_user = next_detail.item_assignee_role;
                               }
                               var proc_cur_user_name = current_detail.item_show_text;

                               var conditions = {_id: proc_inst_id};
                               var data = {};
                               data.proc_cur_task_name = next_node.name;
                               data.proc_cur_task = next_detail.item_code;

                               data.proc_cur_user = proc_cur_user;
                               data.proc_cur_user_name = proc_cur_user_name;
                               data.proc_inst_status = 2;
                               if(proc_vars){
                                   data.proc_vars=proc_vars;
                               }else{
                                   proc_vars = res[0].proc_vars;
                               }
                               var update = {$set: data};
                               var options = {};
                               //更新流程实例化状态和参数
                               model.$ProcessInst.update(conditions, update, options, function (error, result) {
                                   if (error) {
                                       console.log(error)
                                       resolve(utils.returnMsg(false, '1000', '流程流转出现异常3。', null, error));
                                   } else {
                                       var condition = {"_id": proc_task_id}
                                       var datas = {};
                                       datas.proc_inst_task_complete_time = new Date();
                                       datas.proc_inst_task_status = 1;
                                       datas.proc_inst_task_assignee = user_code;
                                       datas.proc_inst_task_remark = memo;
                                       var updates = {$set: datas};
                                       console.log("指派任务完成任务之时的 更新原来的任务的条件   ，" ,condition);
                                       model.$ProcessInstTask.update(condition, updates, options, function (errors, results) {
                                           if (errors) {
                                               console.log(errors);
                                               resolve(utils.returnMsg(false, '1000', '流程流转出现异常4。', null, errors));
                                           } else {
                                               model.$ProcessInstTask.find({"_id": proc_task_id},function(e,r){
                                                   if(e){
                                                       console.log(e);
                                                       resolve(utils.returnMsg(false, '1000', '流程流转出现异常4。', null, e));
                                                   }else{

                                                       console.log("1111111111111111111111111111111111",r);
                                                       var obj=new Object(r[0]._doc);
                                                       obj.proc_task_id=obj._id;
                                                       delete obj._id;
                                                       var arr_c=[];
                                                       arr_c.push(obj);
                                                       // console.log(r);3
                                                       model.$ProcessTaskHistroy.create(arr_c,function (es,ress){
                                                           if(es){
                                                               console.log(es);
                                                               resolve(utils.returnMsg(false, '1000', '流程流转出现异常5。', null, es));
                                                           }else{
                                                               console.log("指派任务时候  完成指派之前的 原来任务 方法的更新结果",results);
                                                               touchNode(current_detail, user_code, proc_task_id, false).then(function (rs) {
                                                                   if (rs.success) {
                                                                       model_user.$User.find({"user_no": assign_user_code}, function (errorss, resultss) {
                                                                           if (errorss) {
                                                                               console.log(errorss);
                                                                               resolve(utils.returnMsg(false, '1000', '流程流转出现异常5。', null, errorss));
                                                                           } else {
                                                                               if (resultss.length > 0) {
                                                                                   var user_org = resultss[0].user_org;
                                                                                   var user_name = resultss[0].user_name;
                                                                                   var user_roles = resultss[0].user_roles.toString();
                                                                                   nodeAnalysisService.findParams(proc_inst_id, node_code).then(function (result_t) {
                                                                                       // console.log("ksjfksadjfksdfjsdkjfsdkfjlsdjfksadfasdfj000000000000000000000000",rs.data)
                                                                                       // var org=rs.data;
                                                                                       var proc_inst_task_params = result_t.data;
                                                                                       // resolve(utils.returnMsg(true, '0000', '流转流程实例成功。', null, null));
                                                                                       //创建下一步流转任务
                                                                                       var condition_task = {};
                                                                                       condition_task.proc_inst_id = proc_inst_id;//: {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
                                                                                       condition_task.proc_inst_task_code = next_detail.item_code;// : String,// 流程当前节点编码(流程任务编号)
                                                                                       condition_task.proc_inst_task_name = next_node.name;//: String,// 流程当前节点名称(任务名称)
                                                                                       condition_task.proc_inst_task_type = next_node.name;//: String,// 流程当前节点类型(任务类型)
                                                                                       condition_task.proc_inst_task_arrive_time = new Date();//,// 流程到达时间
                                                                                       condition_task.proc_inst_task_handle_time = new Date();//,// 流程认领时间
                                                                                       condition_task.proc_inst_task_complete_time = "";// : Date,// 流程完成时间
                                                                                       condition_task.proc_inst_task_status = 0;// : Number,// 流程当前状态 0-未处理，1-已完成，2-拒绝
                                                                                       // if (next_detail.item_assignee_type == 1) {
                                                                                       //     condition_task.proc_inst_task_assignee = next_detail.item_assignee_user_code;//: String,// 流程处理人code
                                                                                       condition_task.proc_inst_task_assignee_name = user_name;//: String,// 流程处理人名
                                                                                       // }
                                                                                       // if (next_detail.item_assignee_type == 2||next_detail.item_assignee_type == 3) {
                                                                                       condition_task.proc_inst_task_user_role = user_roles;// : String,// 流程处理用户角色ID
                                                                                       //     condition_task.proc_inst_task_user_role_name = next_detail.item_show_text;// : String,// 流程处理用户角色名
                                                                                       //
                                                                                       // }
                                                                                       // condition_task.proc_inst_task_user_org_name=org.user_org_name;
                                                                                       condition_task.proc_inst_task_user_org = user_org;

                                                                                       // if(org.proc_inst_task_assignee) {
                                                                                       //     condition_task.proc_inst_task_assignee = org.proc_inst_task_assignee;
                                                                                       // }
                                                                                       // if(org.proc_inst_task_assignee_name){
                                                                                       //     condition_task.proc_inst_task_assignee_name=org.proc_inst_task_assignee_name;
                                                                                       // }
                                                                                       condition_task.proc_inst_task_title = proc_title;
                                                                                       condition_task.proc_inst_biz_vars = biz_vars;
                                                                                       condition_task.proc_inst_prev_node_code = prev_node;
                                                                                       condition_task.proc_inst_prev_node_handler_user = prev_user;
                                                                                       condition_task.proc_inst_node_vars = proc_inst_node_vars;
                                                                                       condition_task .proc_code=proc_code;
                                                                                       condition_task .proc_name=proc_name;
                                                                                       if(proc_vars){
                                                                                           condition_task.proc_vars=proc_vars;
                                                                                       }
                                                                                       console.error(proc_title)
                                                                                       condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
                                                                                       condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
                                                                                       condition_task.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)
                                                                                       condition_task.proc_inst_task_sms =item_sm_warn;// Number,// 流程是否短信提醒
                                                                                       condition_task.proc_inst_task_remark = "";// : String// 流程处理意见
                                                                                       condition_task.proc_inst_task_assignee = assign_user_code;
                                                                                       var arr = [];
                                                                                       arr.push(condition_task);
                                                                                       //创建新流转任务
                                                                                       model.$ProcessInstTask.create(arr, function (error, rs) {
                                                                                           if (error) {
                                                                                               // resolve('新增流程实例信息时出现异常。'+error);
                                                                                               resolve(utils.returnMsg(false, '1000', '流程流转新增任务信息时出现异常7。', null, error));
                                                                                           } else {

                                                                                               //如果是发短信
                                                                                               if(rs && item_sm_warn=='1' && resultss[0].user_phone){
                                                                                                   var process_utils = require('../../../utils/process_util');
                                                                                                   var mobile=resultss[0].user_phone;
                                                                                                   var params= {
                                                                                                       "procName":proc_name,
                                                                                                       "orderNo":inst_id
                                                                                                   }
                                                                                                   process_utils.sendSMS(mobile,params).then(function(rs){
                                                                                                       console.log("短信发送成功");
                                                                                                   }).catch(function(err){
                                                                                                       console.log("短信发送失败",err);
                                                                                                   });
                                                                                               }
                                                                                               touchNode(next_detail,user_code,rs[0]._id,true).then(function(res){
                                                                                                   if(res.success){
                                                                                                       resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常82222。', rs, null))
                                                                                                   }else{
                                                                                                       resolve(rs);
                                                                                                   }
                                                                                               });
                                                                                           }
                                                                                       });
                                                                                   });
                                                                               } else {
                                                                                   resolve(utils.returnMsg(false, '0000', '流程流转新增任务信息异常9。', null, null))
                                                                               }
                                                                           }
                                                                       });
                                                                   } else {
                                                                       resolve(rs)
                                                                   }
                                                               });
                                                           }
                                                       });
                                                   }
                                               });
                                               //节点完成的时候触发的接口事件
                                           }
                                       });
                                   }
                               });
                           }else{
                                   resolve(utils.returnMsg(false, '1000', '流程流转出现异常10。', null, null));
                           }
                       }
                   });
                }else{
                    resolve(utils.returnMsg(false, '1000', '流程流转出现异常11。', null, null));
                }
            }
        });
        // var condition={"_id"}
        //
        // var conditions_original={"_id":proc_inst_task_id}
        // var data_original={};
        // data_original.proc_inst_task_complete_time=new Date();
        // data_original.proc_inst_task_status=1
        // data_original.proc_inst_task_assignee=user_code;
        // var update_original={$set:data_original}
        // var options={};
        // //更新当前流程任务
        // model.$ProcessInstTask.update(conditions_original, update_original, options, function (error,results){
        //
        //
        //
        //
        // })

    });
    return p;
}

exports.find_log=function(inst_id,user_no,page, size){
    var p = new Promise(function(resolve,reject){
        var query=model.$ProcessInst.find({});
        if(inst_id){
            query.where("_id",inst_id);
        }
        query.exec(function(err,res){
            if(err){
                resolve(utils.returnMsg(false, '1000', '查询流程实例出现异常。', null, err));
            }else{
                if(res.length > 0){
                    var mod = model.$ProcessInstTask;
                    var conditionMap = {};
                    console.log(res[0]);
                    console.log(res[0]._doc.proc_inst_status);
                    conditionMap.proc_inst_id = inst_id;
                    if(res[0]._doc.proc_inst_status == '4') {//实例归档
                        mod = model.$ProcessTaskHistroy;
                    }else{
                         conditionMap.proc_inst_task_status = 1;
                    }
                    if(user_no){
                        conditionMap.proc_inst_task_assignee = user_no;
                    }
                    utils.pagingQuery4Eui(mod, page, size, conditionMap, resolve, '',  {proc_cur_arrive_time:-1});
                }else{
                    resolve(utils.returnMsg(false, '1000', '查询流程实例无数据。', null, null));
                }
            }
        });
    });
    return p;

};

exports.log_list=function(status,user_no,begin_date,end_date,page, size){
    var p = new Promise(function(resolve,reject){

        var mod = model.$ProcessInstTask;
        var conditionMap = {};
        if(status && status == '1') {//已处理
            mod = model.$ProcessTaskHistroy;
        }else{
            status = '0';
        }
        conditionMap.proc_inst_task_status = status;
        if(begin_date && end_date){
            conditionMap.proc_inst_task_arrive_time = {'$gte':new Date(begin_date),'$lte':new Date(end_date)};
        }else{
            if(begin_date){
                conditionMap.proc_inst_task_arrive_time = {'$gte':new Date(begin_date)};//大于等于开始时间
            }
            if(end_date){
                conditionMap.proc_inst_task_arrive_time = {'$lte':new Date(end_date)};//小于等于结束时间
            }
        }

        if(user_no){
            conditionMap.proc_inst_task_assignee = user_no;
        }
        utils.pagingQuery4Eui(mod, page, size, conditionMap, resolve, '',  {proc_cur_arrive_time:-1});

    });
    return p;

}


// exports.find_log=function(inst_id,user_no){
//     var p = new Promise(function(resolve,reject){
//         var query=model.$ProcessTaskHistroy.find({});
//         if(inst_id){
//             query.where("proc_inst_id",inst_id);
//         }
//         if(user_no){
//             query.where("proc_inst_task_assignee",user_no);
//
//         }
//         query.sort({"proc_inst_task_complete_time" :1});
//         query.exec(function(err,res){
//             if(err){
//                 resolve(utils.returnMsg(false, '1000', '查询处理日志出现异常。', null, err));
//
//             }else{
//                 resolve(utils.returnMsg(true, '0000', '查询处理日志成功。', res, null));
//             }
//         })
//     })
// return p;
//
// }

/**
 *批量派发
 *
 */

exports.do_payout=function(proc_task_id,node_code,user_code,assign_user_code,proc_title,biz_vars,proc_vars,memo){
    console.log(proc_task_id,node_code,user_code,assign_user_code,proc_title,biz_vars,proc_vars,memo);
    //next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params
    var p = new  Promise(function(resolve,reject){
        model.$ProcessInstTask.find({"_id":proc_task_id},function(err,rs){
            if(err){
                console.log(err);
                resolve(utils.returnMsg(false, '1000', '流程流转出现异常1。', null, err));
            }else{
                console.log(rs,'这个rs是什么呢根据task_id查询出来的任务');
                if(rs.length>0){
                    var proc_inst_id= rs[0].proc_inst_id;//z在查询出来的任务中获取实例id
                    model.$ProcessInst.find({"_id":proc_inst_id},function(errs,res){//用实例id查询出实例
                        if(errs){
                            resolve(utils.returnMsg(false, '1000', '流程流转出现异常2。', null, errs));

                        }else{
                            console.log(res,'这个res是什么呢这是条实例信息');
                            if(res.length>0) {
                                var prev_node = res[0].proc_cur_task;
                                var proc_name=res[0].proc_name;
                                var inst_id=res[0]._id;
                                console.log("cuurent     ______",res);
                                var prev_user = res[0].proc_cur_user;
                                var proc_define = JSON.parse(res[0].proc_define);

                                var item_config = JSON.parse(res[0].item_config);

                                var nodes = proc_define.nodes
                                var next_node = nodes[node_code];
                                var current_node=nodes[prev_node];
                                var next_detail, current_detail;
                                for (var item in  item_config) {
                                    // console.log(item_config)
                                    // console.log(item_config[item].item_code);
                                    if (item_config[item].item_code == prev_node) {
                                        current_detail = item_config[item];
                                    }
                                    if(item_config[item].item_code == node_code){
                                        next_detail=item_config[item];
                                    }
                                }
                                // console.log(item_config);
                                if (!prev_user) {
                                    prev_user = user_code;
                                }
                                console.log("current_detail    ",current_detail,prev_node,"\n",current_node);
                                console.log("next_detail       ",next_detail,node_code,"\n",next_node);
                                // var proc_cur_task = current_detail.item_code;
                                // var proc_cur_task_name = current_node.name;
                                console.log(next_detail,'next_detailnext_detailssss');
                                var proc_inst_node_vars = next_detail.item_node_var;
                                //是否短信通知
                                var item_sm_warn=next_detail.item_sms_warn;
                                // var proc_inst_node_vars = current_detail.item_node_var;
                                var proc_cur_user;
                                if (current_detail.item_assignee_type == 1) {
                                    proc_cur_user = current_detail.item_assignee_user;

                                } else {
                                    // proc_cur_user = next_detail.item_assignee_role;
                                }
                                var proc_cur_user_name = current_detail.item_show_text;

                                var conditions = {_id: proc_inst_id};
                                var data = {};
                                data.proc_cur_task_name = next_node.name;
                                data.proc_cur_task = next_detail.item_code;
                                data.proc_cur_user = proc_cur_user;
                                data.proc_cur_user_name = proc_cur_user_name;
                                data.proc_inst_status = 2;
                                if(proc_vars){
                                    data.proc_vars=proc_vars;
                                }else{
                                    proc_vars = res[0].proc_vars;
                                }
                                var update = {$set: data};
                                var options = {};
                                //更新流程实例化状态和参数
                                model.$ProcessInst.update(conditions, update, options, function (error, result) {
                                    if (error) {
                                        console.log(error)
                                        resolve(utils.returnMsg(false, '1000', '流程流转出现异常3。', null, error));
                                    } else {
                                        console.log(result,'这个result是什么呢，是不是更新派发人任务的');
                                        var condition = {"_id": proc_task_id}
                                        var datas = {};
                                        datas.proc_inst_task_complete_time = new Date();
                                        datas.proc_inst_task_status = 1;
                                        datas.proc_inst_task_assignee = user_code;
                                        datas.proc_inst_task_remark = memo;
                                        var updates = {$set: datas};
                                        console.log("指派任务完成任务之时的 更新原来的任务的条件   ，" ,condition);
                                        model.$ProcessInstTask.update(condition, updates, options, function (errors, results) {
                                            if (errors) {
                                                console.log(errors);
                                                resolve(utils.returnMsg(false, '1000', '流程流转出现异常4。', null, errors));
                                            } else {
                                                model.$ProcessInstTask.find({"_id": proc_task_id},function(e,r){
                                                    if(e){
                                                        console.log(e);
                                                        resolve(utils.returnMsg(false, '1000', '流程流转出现异常4。', null, e));
                                                    }else{
                                                        var obj=new Object(r[0]._doc);
                                                        obj.proc_task_id=obj._id;
                                                        delete obj._id;
                                                        var arr_c=[];
                                                        arr_c.push(obj);
                                                        var role_code = r[0].proc_task_start_user_role_code;//流程发起人角色编码
                                                        var role_name = r[0].proc_task_start_user_role_names;//流程发起人角色
                                                        var name = r[0].proc_task_start_name;//流程发起人名
                                                        var proc_name = r[0].proc_name;
                                                        var proc_code = r[0].proc_code;
                                                        // console.log(r);3
                                                        model.$ProcessTaskHistroy.create(arr_c,function (es,ress){
                                                            if(es){
                                                                console.log(es);
                                                                resolve(utils.returnMsg(false, '1000', '流程流转出现异常5。', null, es));
                                                            }else{
                                                                console.log("指派任务时候  完成指派之前的 原来任务 方法的更新结果",results);
                                                                touchNode(current_detail, user_code, proc_task_id, false).then(function (rs) {
                                                                    console.log(rs);
                                                                    if (rs.success) {
                                                                        //循环给下一节点处理人派发任务
                                                                        async function xunhuan() {
                                                                            var users = [];
                                                                            users = assign_user_code.split(',');
                                                                            console.log(users);
                                                                            for (var i = 0; i < users.length; i++) {
                                                                                var user_no = users[i];
                                                                                console.log(user_no,'qqqqqqqqqqqqqqqqqqqqqqqqqq');
                                                                                let resultss = await  model_user.$User.find({"user_no": user_no});

                                                                                if (resultss.length>0) {
                                                                                    console.log("resultss[0]",resultss[0]);
                                                                                    var user_org = resultss[0].user_org;
                                                                                    var user_name = resultss[0].user_name;
                                                                                    var user_roles = resultss[0].user_roles.toString();
                                                                                    //获取流程定义
                                                                                    let result_t = await nodeAnalysisService.findParams(proc_inst_id, node_code);

                                                                                    // console.log("ksjfksadjfksdfjsdkjfsdkfjlsdjfksadfasdfj000000000000000000000000",rs.data)
                                                                                    // var org=rs.data;
                                                                                    console.log(result_t);
                                                                                    var proc_inst_task_params = result_t.data;
                                                                                    // resolve(utils.returnMsg(true, '0000', '流转流程实例成功。', null, null));
                                                                                    //创建下一步流转任务
                                                                                    console.log("创建下一步流转任务");
                                                                                    var condition_task = {};
                                                                                    condition_task.proc_inst_id = proc_inst_id;//: {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
                                                                                    condition_task.proc_inst_task_code = next_detail.item_code;// : String,// 流程当前节点编码(流程任务编号)
                                                                                    condition_task.proc_inst_task_name = next_node.name;//: String,// 流程当前节点名称(任务名称)
                                                                                    condition_task.proc_inst_task_type = next_node.name;//: String,// 流程当前节点类型(任务类型)
                                                                                    condition_task.proc_inst_task_arrive_time = new Date();//,// 流程到达时间
                                                                                    condition_task.proc_inst_task_handle_time = new Date();//,// 流程认领时间
                                                                                    condition_task.proc_inst_task_complete_time = "";// : Date,// 流程完成时间
                                                                                    condition_task.proc_inst_task_status = 0;// : Number,// 流程当前状态 0-未处理，1-已完成，2-拒绝
                                                                                    // if (next_detail.item_assignee_type == 1) {
                                                                                    //    condition_task.proc_inst_task_assignee = next_detail.item_assignee_user_code;//: String,// 流程处理人code
                                                                                    condition_task.proc_inst_task_assignee_name = user_name;//: String,// 流程处理人名
                                                                                    // }
                                                                                    // if (next_detail.item_assignee_type == 2||next_detail.item_assignee_type == 3) {
                                                                                    condition_task.proc_inst_task_user_role = user_roles;// : String,// 流程处理用户角色ID
                                                                                    //     condition_task.proc_inst_task_user_role_name = next_detail.item_show_text;// : String,// 流程处理用户角色名
                                                                                    //
                                                                                    // }
                                                                                    // condition_task.proc_inst_task_user_org_name=org.user_org_name;
                                                                                    condition_task.proc_inst_task_user_org = user_org;

                                                                                    // if(org.proc_inst_task_assignee) {
                                                                                    //     condition_task.proc_inst_task_assignee = org.proc_inst_task_assignee;
                                                                                    // }
                                                                                    // if(org.proc_inst_task_assignee_name){
                                                                                    //     condition_task.proc_inst_task_assignee_name=org.proc_inst_task_assignee_name;
                                                                                    // }
                                                                                    condition_task.proc_inst_task_title = proc_title;
                                                                                    condition_task.proc_inst_biz_vars = biz_vars;
                                                                                    condition_task.proc_inst_prev_node_code = prev_node;
                                                                                    condition_task.proc_inst_prev_node_handler_user = prev_user;
                                                                                    condition_task.proc_inst_node_vars = proc_inst_node_vars;

                                                                                    if (proc_vars) {
                                                                                        condition_task.proc_vars = proc_vars;
                                                                                    }
                                                                                    console.error(proc_title)
                                                                                    condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
                                                                                    condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
                                                                                    condition_task.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)
                                                                                    condition_task.proc_inst_task_sms = item_sm_warn;// Number,// 流程是否短信提醒
                                                                                    condition_task.proc_inst_task_remark = "";// : String// 流程处理意见
                                                                                    condition_task.proc_inst_task_assignee = user_no;
                                                                                    //console.log(r[0].proc_start_user_role_names,'sghdssdshg');
                                                                                   condition_task.proc_task_start_user_role_names = role_name;//流程发起人角色
                                                                                    condition_task.proc_task_start_user_role_code = role_code;//流程发起人id
                                                                                    condition_task.proc_task_start_name = name;//流程发起人姓名
                                                                                    condition_task.proc_name=proc_name;
                                                                                    condition_task.proc_code=proc_code;
                                                                                    // var arr = [];
                                                                                    // arr.push(condition_task);
                                                                                    //创建新流转任务
                                                                                    console.log(condition_task,'55555555555555555555555555');
                                                                                    let rs = await model.$ProcessInstTask.create(condition_task);
                                                                                    console.log("任务:",rs,'这个是一条任务吗？');
                                                                                    //如果是发短信
                                                                                    if(rs && item_sm_warn=='1' &&resultss[0].user_phone){
                                                                                        var process_utils = require('../../../utils/process_util');
                                                                                        var mobile=resultss[0].user_phone;

                                                                                        var params= {
                                                                                            "procName":proc_name,
                                                                                            "orderNo":inst_id
                                                                                        }
                                                                                        process_utils.sendSMS(mobile,params).then(function(rs){
                                                                                           console.log("短信发送成功");
                                                                                        }).catch(function(err){
                                                                                            console.log("短信发送失败",err);
                                                                                        });
                                                                                    }
                                                                                    let res = await touchNode(next_detail, user_code, rs._id, true);
                                                                                    console.log(i);
                                                                                }else{
                                                                                    resolve(utils.returnMsg(false, '1000', '下一节点人查询错误。',null, null));
                                                                                }
                                                                            }
                                                                            return res;
                                                                        }
                                                                        xunhuan().then(function(res){
                                                                            //将任务信息返回给调用接口方
                                                                            console.log(res,'这个是不是返回给他们的信息');
                                                                            resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常81111。',res, null));
                                                                        }).catch(function(err){
                                                                            console.log(err);
                                                                        });
                                                                    }else {
                                                                        resolve(rs)
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                                //节点完成的时候触发的接口事件
                                            }
                                        });
                                    }
                                });
                            }else{
                                resolve(utils.returnMsg(false, '1000', '流程流转出现异常10。', null, null));
                            }
                        }
                    });
                }else{
                    resolve(utils.returnMsg(false, '1000', '流程流转出现异常11。', null, null));
                }
            }
        });
    });
    return p;
};



/**
 *针对稽核流程分公司人处理自己的任务
 * @param task_id 任务id
 * @param memo 处理内容
 */

exports.interim_completeTask= function(taskId,memo) {
    var p = new Promise(function(resolve,reject){
        var udata = {
            proc_inst_task_status:1,
            proc_inst_task_complete_time : new Date(),
            proc_inst_task_remark : memo
        }
        var update = {$set: udata};
        var options = {};
        //根据任务id更新需要完成的任务状态
        model.$ProcessInstTask.update({'_id':taskId}, update, options, function (error,result) {
            if(error) {
                resolve({'success': false, 'code': '1000', 'msg': '完成任务出现异常'});
            }else {
                model.$ProcessInstTask.find({'_id':taskId},function(e,r){
                    if(e){
                        console.log(e);
                        resolve({'success': false, 'code': '1000', 'msg': '完成任务出现异常'});
                    }else{
                        // console.log(r[0]);
                        //将任务id赋值给历史表中的任务id
                        var obj=new Object(r[0]._doc)
                        console.log(obj._id);
                        obj.proc_task_id=obj._id;
                        console.log(obj.proc_task_id)
                        delete obj._id;
                        console.log(obj);

                        var arr_c=[];
                        arr_c.push(obj)
                        // console.log(arr_c);
                        //在任务历史表中创建已完成的任务
                        model.$ProcessTaskHistroy.create(arr_c, function (err,results){
                            if(err){
                                console.log(err);
                                resolve({'success': false, 'code': '1000', 'msg': '完成任务出现异常'});
                            }else{
                                // console.log(results);
                                resolve({'success': true, 'code': '0000', 'msg': '完成任务成功','data':r[0]._doc});
                            }
                        });
                    }
                });
            }
        });
    });
    return p;
};

/*
根据流程编码查询流程信息
 */
exports.process_infomation=function(proc_code){
    var p =  new Promise(function(resolve,reject){
        //根据流程编码查询流程信息
        model.$ProcessBase.find({'proc_code':proc_code},function(err,result){
            if(err){
                console.log(err);
                resolve({'success': false, 'code': '1000', 'msg': '查询流程信息出现异常'});
            }else{
                console.log(result);
                resolve({'success': true, 'code': '0000', 'msg': '查询流程信息成功','data':result});
            }
        });
    });
  return p;
};