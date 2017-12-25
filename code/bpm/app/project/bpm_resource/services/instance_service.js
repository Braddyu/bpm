/**
 * wuqingfa@139.com
 *
 *
 * 流程实例 Instance 处理服务
 * 1、新建流程实例
 * 2、终止流程实例
 * 3、完成流程实例
 *
 * 查询
 * 1、获取流程实例列表
 * 2、获取我的流程实例
 * 3、获取流程实例信息
 *
 *
 */

var model_user=require("../models/user_model");
var model = require('../models/process_model');
var Promise = require("bluebird")
var proc = require('./process_service');
var nodeAnalysisService=require("./node_analysis_service");
var userService = require('../../workflow/services/user_service');
var utils = require('../../../utils/app_utils');
var nodeTransferService=require("./node_transfer_service");
var nodeDetail,data_define;


//创建子流程实例
exports.createSubjectInstance=function(data,node_array,user_code,parent_proc_inst_id,param_json_str){
    var params;
    console.log("--------------------------------============================================");
    //判断参数 和解析参数
    if(!(param_json_str==null||param_json_str==""||param_json_str=="undefined"||param_json_str=="{}")){
        var params_json=JSON.parse(param_json_str);
        // console.log(params_json)
        var flag=true;
        for(var items_ in params_json){
            flag=false;
        }
        if(flag){
            resolve(utils.returnMsg(false, '1001', '参数解析不正确。', null, null));
        }else{
            params=params_json;
        }
    }else{
        params={};
    }
    var p=new Promise(function(resolve,reject){
        for(var node in node_array){
            //调用创建子流程的 方法
            createSubInst(data[0],node_array[node],user_code,parent_proc_inst_id,params).then(function (rs){
                if(rs.success){
                    resolve(utils.returnMsg(true, '0000', '子流程实例创建启动成功。', null, null));
                }

            }).catch(function(err){
                console.log(err);
            });
        }
    });
    return p;

}


/**@author huanghaohao
 * 用于创建子流程的方法
 * @param data 节点信息参数（node——detail ）
 * @param node 当前结点
 * @param user_code 当前用户
 * @param parent_proc_inst_id  主流程实例化ID
 * @param params 参数
 */

function createSubInst(data,node,user_code,parent_proc_inst_id,params){
    var p=new Promise(function(resolve,reject){
        var condition={};
        var item_config=JSON.parse(data.item_config);
        var  proc_define=JSON.parse(data.proc_define);
        var node_detail=nodeAnalysisService.getNodeInfo(item_config,proc_define,node,null);
        var next_detail=node_detail.current_detail;
        var next_node=node_detail.current_node;
        //查询主流程的实例化
        model.$ProcessInst.find({"_id":parent_proc_inst_id},function(err,resultss){
            var proc_define_id=resultss[0].proc_define_id;
            //查询下一节点的执行人或者执行角色信息
            nodeAnalysisService.findNextHandler(user_code,proc_define_id,node,params,parent_proc_inst_id).then(function(rs){
                if(rs.success){
                    var org=rs.data;
                    condition.proc_cur_task_name=next_node.name;//节点中文名称
                    condition.proc_cur_task=next_detail.item_code;//节点code
                    var item_assignee_type=next_detail.item_assignee_type;
                    var current_opt=[];
                    //下一步操作为指定人时
                    if(item_assignee_type==1){
                        //单个人的操作
                        current_opt.push(next_detail.item_assignee_user);
                        condition.current_opt=current_opt;
                    }
                    //
                    if(item_assignee_type==2||item_assignee_type==3||item_assignee_type==4){
                        //多人操作
                        var item_assignee_role_code= next_detail.item_assignee_role_code;
                        var role_id=item_assignee_role_code;
                        condition.current_opt=role_id;

                    }

                    //组织
                    condition.proc_inst_task_user_org=org.user_org_id;//String  //流程处理用户的组织

                    if(org.proc_inst_task_assignee){
                        condition.proc_inst_task_assignee=org.proc_inst_task_assignee;
                    }
                    if(org.proc_inst_task_assignee_name){
                        condition.proc_inst_task_assignee_name=org.proc_inst_task_assignee_name;
                    }


                    //创建子流程的实例化
                    saveSubIns(condition,data,user_code,parent_proc_inst_id).then(function(insresult){
                        if(insresult.success){
                            condition.proc_inst_task_title = data.proc_title;
                            //创建子流程的任务表
                            insertSubTask(insresult,condition,node_detail).then(function(taskresult){
                                resolve(taskresult);
                            }).catch(function(err){
                                console.log(err);
                            });
                        }else{
                            resolve(insresult);
                        }

                    }).catch(function(err){
                        console.log(err);
                    });
                }
            })
        })

    });

    return p;
}

//子流程的任务表插入
/**
 *
 * @param result
 * @param condition 写入数据库的信息
 * @param node_detail 节点信息
 */
function insertSubTask(result,condition,node_detail){

    var proc_inst_task_assignee,proc_inst_task_assignee_name,proc_inst_task_sign;
    var proc_inst_task_user_role,proc_inst_task_user_role_name
    //单人操作
    if(node_detail.current_detail.item_assignee_type==1){
        proc_inst_task_assignee=node_detail.current_detail.item_assignee_user_code;
        proc_inst_task_assignee_name=node_detail.current_detail.item_show_text;
        proc_inst_task_user_role ="";
        proc_inst_task_user_role_name="";
        proc_inst_task_sign=1;// : Number,// 流程签收(0-未认领，1-已认领)
    }
    //多人操作
    if(node_detail.current_detail.item_assignee_type==2||node_detail.current_detail.item_assignee_type==3||node_detail.current_detail.item_assignee_type==4){
        proc_inst_task_assignee="";
        proc_inst_task_assignee_name="";
        proc_inst_task_user_role =node_detail.current_detail.item_assignee_role;
        proc_inst_task_user_role_name=node_detail.current_detail.item_show_text;
        proc_inst_task_sign=0;// : Number,// 流程签收(0-未认领，1-已认领)
    }

    // var current_node=condition.proc_cur_task;
    var p=new Promise(function(resolve,reject){
        nodeAnalysisService.findParams(result.data,condition.proc_cur_task).then(function(result_t){
            var proc_inst_task_params=result_t.data
            var task={};
            task.work_order_number = condition.work_order_number;//工单编号
            task.proc_inst_id=result.data;// : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
            task.proc_inst_task_code=condition.proc_cur_task;// : String,// 流程当前节点编码(流程任务编号)
            task.proc_inst_task_name=condition.proc_cur_task_name;// : String,// 流程当前节点名称(任务名称)
            task.proc_inst_task_type=node_detail.current_detail.task;// : String,// 流程当前节点类型(任务类型)
            task.proc_inst_task_title=node_detail.proc_inst_task_title;// : String,// 任务标题
            task.proc_inst_task_arrive_time=new Date();// : Date,// 流程到达时间
            task.proc_inst_task_handle_time="";//: Date,// 流程认领时间
            task.proc_inst_task_complete_time="";// : Date,// 流程完成时间
            task.proc_inst_task_status=0;// : Number,// 流程当前状态
            task.proc_inst_task_assignee=proc_inst_task_assignee;//: array,// 流程处理人ID
            task.proc_inst_task_assignee_name=proc_inst_task_assignee_name;// : array,// 流程处理人名
            task.proc_inst_task_user_role =proc_inst_task_user_role;//: String,// 流程处理用户角色ID
            task.proc_inst_task_user_role_name=proc_inst_task_user_role_name;// : String,// 流程处理用户角色名
            task.proc_inst_task_user_org=condition.proc_inst_task_user_org;//String  //流程处理用户的组织
            // task.proc_inst_task_user_org_name=condition.proc_inst_task_user_org_name;//String  //流程处理用户的组织名称；
            task.proc_inst_task_params=proc_inst_task_params;// : String,// 流程参数(任务参数)
            task.proc_inst_task_claim="";// : Number,// 流程会签
            task.proc_inst_task_sign=proc_inst_task_sign;// : Number,// 流程签收(0-未认领，1-已认领)
            task.proc_inst_task_sms="";//"// : String// 流程处理意见
            task.proc_inst_task_remark="";

            var arr=[];
            arr.push(task);
            //写入数据 创建任务
            model.$ProcessInstTask.create(arr,function(error,rs){
                if(error) {
                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",error);
                    // reject('新增流程实例信息时出现异常。'+error);
                    resolve(utils.returnMsg(false, '1000', '子流程实例创建启动出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '子流程实例创建启动成功。', rs, null));
                }
            });

        })

    });
    return p;

}


/**
 * 常见子流程实例化的方法
 * @param dataMap  写入数据库参数
 * @param data  写入数据库参数
 * @param user_code 当前用户
 * @param parent_proc_inst_id 主流程实例化Id
 */
function saveSubIns(dataMap,data,user_code,parent_proc_inst_id){
    // console.log("parent_proc_inst_id                         ",parent_proc_inst_id);
    var p=new Promise(function(resolve,reject){
        if(dataMap){
            var  inst={}
            inst.proc_id =data.proc_id;// 流程实例ID
            inst.proc_define_id =data.proc_define_id;//{type: Schema.Types.ObjectId, ref: 'CommonCoreProcessDefine'}, 流程图ID
            inst.proc_code =data.proc_code// 流程编码
            inst.parent_id=1; // 子节点
            inst.parent_proc_inst_id=parent_proc_inst_id;//父流程实例化ID
            inst.proc_name=data.proc_name;// 流程名
            inst.proc_ver=data.version;// 流程版本号
            inst.catalog="";//流程类别
            inst.proce_reject_params="";//是否驳回
            inst.proc_instance_code="";//实例编码
            inst.proc_title=data.proc_title;//流程标题
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month = myDate.getMonth()+1;
            var day = myDate.getDate();
            var randomNumber = parseInt(((Math.random()*9+1)*100000));
            inst.work_order_number="GDBH"+year+month+day+randomNumber;//工单编码
            inst.proc_cur_task=dataMap.proc_cur_task;// 流程当前节点编码

            inst.proc_cur_task_name=dataMap.proc_cur_task_name;// 流程当前节点名称

            inst.proc_cur_user=dataMap.current_opt;//{type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},当前流程处理人ID

            inst.proc_cur_user_name ='';//: String,当前流程处理人名

            inst.proc_cur_arrive_time=new Date();// : Date,当前流程到达时间
            inst.proc_cur_task_item_conf="";// : String,//当前流程节点配置信息(当前配置阶段编码)

            inst.proc_start_user=user_code;//:String,//流程发起人(开始用户)
            inst.proc_start_user_name="";// : String,// 流程发起人名(开始用户姓名)

            inst.proc_start_time=new Date();// : Date,// 流程发起时间(开始时间)
            inst.proc_params="";// : String,// 流转参数
            inst.proc_inst_status=2;  // : Number,// 流程流转状态 1 已启用  0 已禁用,2 流转中，3 子流程流转中  ，4 归档
            inst.proc_attached_type="";// : Number,// 流程附加类型(1:待办业务联系函;2:待办工单;3:待办考核;4:其他待办)
            inst.proce_attached_params="";// : {},// 流程附加属性
            inst.proce_reject_params="";// : {},// 流程驳回附加参数
            inst.proc_cur_task_code_num="";// : String,//节点编号
            inst.proc_task_overtime="";// : [],//超时时间设置
            inst.proc_cur_task_overtime="";// : Date,//当前节点的超时时间
            inst.proc_cur_task_remark="";// : String,//节点备注
            inst.proc_city="";// : String,// 地市
            inst.proc_county="";// : String,// 区县
            inst.proc_org="";// : String, // 组织
            inst.proc_cur_task_overtime_sms="";// : Number,//流程当前节点超时短信标记(1:待处理，2:已处理，3:不需要处理)
            inst.proc_cur_task_overtime_sms_count="";// : Number,//流程当前节点超时短信发送次数
            inst.proc_pending_users=dataMap.current_opt;// : []//当前流程的待处理人信息
            inst.proc_define=data.proc_define;//流程定义文件
            inst.item_config=data.item_config;//流程节点信息
            var arr = [];
            arr.push(inst);
            //写入数据库
            model.$ProcessInst.create(arr,function(error,rs){
                if(error) {
                    // reject('新增流程实例信息时出现异常。'+error);
                    console.log(error)
                    reject(utils.returnMsg(false, '1000', '新增子流程实例信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '新增子流程实例信息成功。', rs[0]._doc._id, null));

                }
            });


        }


    });
    return p;

}

/**
 *创建流程实例化的方法
 * @param proc_code
 * @param proc_ver
 * @param proc_title
 * @param user_code
 * @param param_json_str //参数
 * @param biz_vars_json //业务变量json字符串
 */


exports.createInstance=function(proc_code,proc_ver,proc_title,param_json_str,proc_vars_json,biz_vars_json,user_code,user_name){
    var promise = new Promise(function(resolve,reject){
        var params;
        //解析参数
        if(!(!param_json_str || param_json_str=="undefined"||param_json_str=="{}")){
            var params_json=JSON.parse(param_json_str);
            // console.log(params_json)
            var flag=true;
            for(var items_ in params_json){
                flag=false;
            }
            if(flag){
                reject(utils.returnMsg(false, '1001', '参数解析不正确。', null, null));
            }else{
                params=params_json;
            }
        }else{
            params={};
        }
       //user_org_name   user_org
        var conditionMap = {};
        if(proc_code){
            conditionMap.proc_code = proc_code;
        }else{
            resolve({'success':false, 'code':'2001', 'msg':'流程编码不能为空。'});
        }
        if(proc_ver){
            conditionMap.version = proc_ver;
        }
        if(!proc_title){
            resolve({'success':false, 'code':'2001', 'msg':'流程实例标题不能为空。'});
        }
        conditionMap.status = 1;
        //获取流程定义信息
        proc.getProcessDefineByConditionMap(conditionMap)
            .then(function(rs){
                var success=rs.success;
                var data=rs.data;
                data_define=data;
                if(success){
                    //找到开始节点

                    var firstNode=nodeAnalysisService.findFirstNode(JSON.parse(data.proc_define));

                    //获取节点信息
                    nodeAnalysisService.getNode(data._id,firstNode,params,true)
                        .then(function(rss){
                            console.log("node in fo   and  note the request node_code and info");
                            // console.log(rss);


                            //获取下一节点的操作人 或者 操作角色信息
                            nodeAnalysisService.findNextHandler(user_code,data._id,firstNode,params,"").then(function(rsss){
                                var condition={};
                                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++???",rsss);
                                if(rss.success&&rsss.success){
                                    // console.log(rss.data);

                                    model_user.$User.find({'user_no':user_code},function(err,resu){
                                        if(err){
                                            console.log(err);
                                            resolve({'success':false, 'code':'2001', 'msg':'发起人id错误。'});
                                        }else{
                                            //查询用户所拥有的角色
                                            find(resu[0].user_roles.toString()).then(function(role){
                                                if(role.success){
                                                    condition.proc_start_user_role_names = role.data.toString().split(',');
                                                    console.log(condition.proc_start_user_role_names,'0000000');
                                                    condition.proc_start_user_role_code = resu[0].user_roles.toString();
                                                    condition.proc_start_user_name =user_name;

                                                    var node_detail=rss.data;
                                                    console.log(rss,'node_detailnode_detail')
                                                    var orgs=rsss.data;
                                                    nodeDetail=node_detail;
                                                    console.log(nodeDetail,'nodeDetailnodeDetail');

                                                    var current_detail = node_detail.current_detail;//当前节点信息
                                                    var current_node = node_detail.current_node;//当前节点code

                                                    condition.proc_cur_task_name=current_node.name;//节点中文名称
                                                    condition.proc_cur_task=current_detail.item_code;//节点code
                                                    condition.proc_inst_node_vars=current_detail.item_node_var;//节点变量
                                                    var item_assignee_type=current_detail.item_assignee_type;

                                                    var current_opt=[];
                                                    if(item_assignee_type==1){
                                                        //单个人的操作
                                                        current_opt.push(current_detail.item_assignee_user);
                                                        condition.current_opt=current_opt;
                                                        condition.proc_inst_task_complete_time = new Date();
                                                        condition.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)
                                                    }

                                                    if(item_assignee_type==2||item_assignee_type==3||item_assignee_type==4){
                                                        //多人操作
                                                        var item_assignee_role_code= current_detail.item_assignee_role_code;

                                                    }

                                                    //组织机构的 编号和名称
                                                    // condition.proc_inst_task_user_org_name=orgs.user_org_name;
                                                    condition.proc_inst_task_user_org=orgs.user_org_id;
                                                    if(orgs.proc_inst_task_assignee){
                                                        condition.proc_inst_task_assignee=orgs.proc_inst_task_assignee;
                                                    }
                                                    if(orgs.proc_inst_task_assignee_name){
                                                        condition.proc_inst_task_assignee_name=orgs.proc_inst_task_assignee_name;
                                                    }
                                                    condition.proc_vars = proc_vars_json;
                                                    console.log(condition);
                                                    //写入数据库 创建流程实例化方法
                                                    saveIns(condition,proc_code,proc_title,user_code).then(function(insresult){
                                                        if(insresult.success){
                                                            console.log('创建实例成功了吗');
                                                            model.$ProcessInst.find({'_id':insresult.data},function(err,rs){
                                                                if(err){
                                                                    console.log(err);
                                                                }else{
                                                                    console.log(rs);
                                                                    condition.work_order_number = rs[0].work_order_number;
                                                                    condition.proc_task_start_user_role_code = rs[0].proc_start_user_role_code;
                                                                    condition.proc_task_start_user_role_names = rs[0].proc_start_user_role_names;
                                                                    condition.proc_task_start_name = user_name;
                                                                    condition.proc_inst_task_title = proc_title;
                                                                    condition.proc_inst_biz_vars = biz_vars_json;
                                                                    condition.proc_vars = proc_vars_json;
                                                                    condition.proc_inst_task_title = proc_title;
                                                                    condition.proc_inst_biz_vars = biz_vars_json;
                                                                    condition.proc_vars = proc_vars_json;
                                                                    condition.proc_code = rs[0].proc_code;
                                                                    condition.proc_name = rs[0].proc_name;
                                                                     if(nodeDetail.next_detail)      {
                                                                         //创建流程任务
                                                                         insertTask(insresult,condition).then(function(taskresult){
                                                                             resolve(taskresult);
                                                                         });
                                                                     }  else{
                                                                         resolve(utils.returnMsg(false, '1000', '创建失败，无法找到下一节点',null));

                                                                     }
                                                                }
                                                            });
                                                        }else{
                                                            resolve(insresult);
                                                        }
                                                    });
                                                }else{
                                                    resolve(utils.returnMsg(false, '1000', '没有这个角色。',null,role));
                                                }

                                            });
                                        }
                                    });
                                }else{
                                    resolve(rsss);
                                }
                            });
                        }).catch(function(err){
                        reject('获取流程信息失败 '+err);
                    });
                }
            })
            .catch(function(err){
                reject('获取流程信息失败 '+err);

            });
    });
    return promise;
}

/*
查询用户所拥有的角色
 */
function find(role_code){
    var p = new Promise(function(resolve,reject){
        if(role_code){
            if(role_code.length>1){
                model_user.$Role.find({'_id':{$in:role_code.split(",")}},function(err,rs){
                    if(err){
                        console.log(err);
                    }else{
                        var roleNames = '';
                        if(rs.length>0){
                            for(var i=0;i<rs.length;i++){
                                var roleName = rs[i].role_name;
                                roleNames +=roleName+',';
                            }
                            roleNames = roleNames.substring(0,roleNames.length-1);
                            resolve(utils.returnMsg(true, '0000', '查询成功。', roleNames, null));
                        }
                    }
                });
            }
            else{
                model_user.$Role.find({'_id':role_code},function(err,rs){
                    if(err){
                        console.log(err);
                    }else{
                        var roleNames = '';
                        if(rs.length>0){
                            for(var i=0;i<rs.length;i++){
                                var roleName = rs[i].role_name;
                                roleNames +=roleName+',';
                            }
                            roleNames = roleNames.substring(0,roleNames.length-1);
                            resolve(utils.returnMsg(true, '0000', '查询成功。', roleNames, null));
                        }
                    }
                });
            }
        }else{
            resolve(utils.returnMsg(false, '1000', '没有这个角色。',null,null));
        }
    });
    return p;
}
/**
 * 新增流程任务
 * @param result
 * @param condition
 */
function insertTask(result,condition){
    var proc_inst_task_assignee,proc_inst_task_assignee_name,proc_inst_task_sign;
    var proc_inst_task_user_role,proc_inst_task_user_role_name

    if(  nodeDetail.next_detail.item_assignee_type==1){
        proc_inst_task_assignee=nodeDetail.next_detail.item_assignee_user_code;
        proc_inst_task_assignee_name=nodeDetail.next_detail.item_show_text;
        proc_inst_task_user_role ="";
        proc_inst_task_user_role_name="";
        proc_inst_task_sign=1;// : Number,// 流程签收(0-未认领，1-已认领)
    }
    if( nodeDetail.next_detail.item_assignee_type==2||nodeDetail.next_detail.item_assignee_type==3||nodeDetail.next_detail.item_assignee_type==4){
        proc_inst_task_assignee="";
        proc_inst_task_assignee_name="";
        proc_inst_task_user_role =nodeDetail.next_detail.item_assignee_role;
        proc_inst_task_user_role_name=nodeDetail.next_detail.item_show_text;
        proc_inst_task_sign=0;// : Number,// 流程签收(0-未认领，1-已认领)
    }

    if(condition.proc_inst_task_assignee){
        proc_inst_task_assignee=condition.proc_inst_task_assignee;
    }
    if( condition.proc_inst_task_assignee_name){
        proc_inst_task_assignee_name=condition.proc_inst_task_assignee_name;
    }

    var current_node=condition.proc_cur_task;
    var p=new Promise(function(resolve,reject){
        var task={};
        nodeAnalysisService.findParams(result.data,condition.proc_cur_task).then(function(result_t){
            var proc_inst_task_params=result_t.data;
            task.work_order_number=condition.work_order_number//工单编号
            task.proc_inst_id=result.data;// : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
            task.proc_inst_task_code=condition.proc_cur_task;// : String,// 流程当前节点编码(流程任务编号)
            task.proc_inst_task_name=condition.proc_cur_task_name;// : String,// 流程当前节点名称(任务名称)
            task.proc_inst_task_title=condition.proc_inst_task_title;// : String,// 任务标题proc_inst_task_title
            task.proc_inst_task_type=nodeDetail.next_node.task;// : String,// 流程当前节点类型(任务类型)
            task.proc_inst_task_arrive_time=new Date();// : Date,// 流程到达时间
            task.proc_inst_task_handle_time="";//: Date,// 流程认领时间
            task.proc_inst_task_complete_time="";// : Date,// 流程完成时间
            task.proc_inst_task_status=0;// : Number,// 流程当前状态
            task.proc_inst_task_assignee=proc_inst_task_assignee;//: array,// 流程处理人ID
            task.proc_inst_task_assignee_name=proc_inst_task_assignee_name;// : array,// 流程处理人名
            if(proc_inst_task_user_role.indexOf(",")!=-1){
                task.proc_inst_task_user_role =proc_inst_task_user_role.split(",");

            }else{
                task.proc_inst_task_user_role =[proc_inst_task_user_role];

            }
           //: String,// 流程处理用户角色ID
            task.proc_inst_task_user_role_name=proc_inst_task_user_role_name;// : String,// 流程处理用户角色名
            if(condition.proc_inst_task_user_org)
            task.proc_inst_task_user_org=condition.proc_inst_task_user_org;//String  //流程处理用户的组织
            // task.proc_inst_task_user_org_name=condition.proc_inst_task_user_org_name;//String  //流程处理用户的组织名称；
            task.proc_inst_task_params=proc_inst_task_params;// : String,// 流程参数(任务参数)
            task.proc_inst_task_claim="";// : Number,// 流程会签
            task.proc_inst_task_sign=proc_inst_task_sign;// : Number,// 流程签收(0-未认领，1-已认领)
            task.proc_inst_task_sms="";//"// : String// 流程处理意见
            task.proc_inst_task_remark="";
            task.proc_inst_biz_vars=condition.proc_inst_biz_vars;//实例变量
            task.proc_inst_node_vars=condition.proc_inst_node_vars;//流程节点变量
            task.proc_vars=condition.proc_vars;//流程变量
            task.proc_task_start_name = condition.proc_start_user_name;//流程发起人姓名
            task.proc_task_start_user_role_names = condition.proc_start_user_role_names;//流程发起人角色
            task.proc_task_start_user_role_code = condition.proc_start_user_role_code;//流程发起人id
            task.proc_code=condition.proc_code;
            task.proc_name=condition.proc_name;
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&",condition);

            var arr=[];
            arr.push(task);
            //写入数据库创建流程任务表
            model.$ProcessInstTask.create(arr,function(error,rs){
                if(error) {
                    // reject('新增流程实例信息时出现异常。'+error);
                    console.log(error);
                    reject(utils.returnMsg(false, '1000', '流程实例创建启动出现异常。', null, error));
                }
                else {
                    console.log(rs,'这个是什么呢');
                    resolve(utils.returnMsg(true, '0000', '流程实例创建启动成功。', rs, null));


                }
            });

        });

    });
    return p;

}

// function findUserCodeByUserId(userIdArray){
//     var userCodeArray=[];
//     var query=model_user.$User.find({});
//     query.where("_id",{"$in":userIdArray});
//     query.exec(function (error, rs){
//         console.info(rs);
//     });
// }
/**
 * 保存流程实例数据
 * @param dataMap 参数
 * @param proc_code 流程编码
 * @param proc_title 流程名称
 * @param user_code 当前用户
 */
function saveIns(dataMap,proc_code,proc_title,user_code){
    var p = new Promise(function(resolve,reject) {
        if(dataMap){
            var  inst={}
            inst.proc_id =data_define.proc_id;// 流程实例ID
            inst.proc_define_id =data_define._id;//{type: Schema.Types.ObjectId, ref: 'CommonCoreProcessDefine'}, 流程图ID
            inst.proc_code =proc_code// 流程编码
            inst.parent_id=0// 父节点
            inst.parent_proc_inst_id=""//父流程id
            inst.proc_name=data_define.proc_name;// 流程名
            inst.proc_ver=data_define.version;// 流程版本号
            inst.catalog="";//流程类别
            inst.proce_reject_params="";//是否驳回
            inst.proc_instance_code="";//实例编码
            inst.proc_title=proc_title;//流程标题
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month = myDate.getMonth()+1;
            var day = myDate.getDate();
            var randomNumber = parseInt(((Math.random()*9+1)*100000));
            inst.work_order_number="GDBH"+year+month+day+randomNumber;//工单编号
            inst.proc_cur_task=dataMap.proc_cur_task;// 流程当前节点编码

            inst.proc_cur_task_name=dataMap.proc_cur_task_name;// 流程当前节点名称

            inst.proc_cur_user=dataMap.current_opt;//{type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},当前流程处理人ID

            inst.proc_cur_user_name ='';//: String,当前流程处理人名

            inst.proc_cur_arrive_time=new Date();// : Date,当前流程到达时间
            inst.proc_cur_task_item_conf="";// : String,//当前流程节点配置信息(当前配置阶段编码)

            inst.proc_start_user=user_code;//:String,//流程发起人(开始用户)
            inst.proc_start_user_name=dataMap.proc_start_user_name;// : String,// 流程发起人名(开始用户姓名)

            inst.proc_start_time=new Date();// : Date,// 流程发起时间(开始时间)
            inst.proc_params="";// : String,// 流转参数
            inst.proc_inst_status=2;  // : Number,// 流程流转状态 1 已启用  0 已禁用,2 流转中，3 归档
            inst.proc_attached_type="";// : Number,// 流程附加类型(1:待办业务联系函;2:待办工单;3:待办考核;4:其他待办)
            inst.proce_attached_params="";// : {},// 流程附加属性
            inst.proce_reject_params="";// : {},// 流程驳回附加参数
            inst.proc_cur_task_code_num="";// : String,//节点编号
            inst.proc_task_overtime="";// : [],//超时时间设置
            inst.proc_cur_task_overtime="";// : Date,//当前节点的超时时间
            inst.proc_cur_task_remark="";// : String,//节点备注
            inst.proc_city="";// : String,// 地市
            inst.proc_county="";// : String,// 区县
            inst.proc_org="";// : String, // 组织
            inst.proc_cur_task_overtime_sms="";// : Number,//流程当前节点超时短信标记(1:待处理，2:已处理，3:不需要处理)
            inst.proc_cur_task_overtime_sms_count="";// : Number,//流程当前节点超时短信发送次数
            inst.proc_pending_users=dataMap.current_opt;// : []//当前流程的待处理人信息
            inst.proc_start_user_role_code = dataMap.proc_start_user_role_code;//流程发起人角色id
            inst.proc_start_user_role_names = dataMap.proc_start_user_role_names;//流程发起人角色名
            inst.proc_define=data_define.proc_define;//流程定义文件
            inst.item_config=data_define.item_config;//流程节点信息
            inst.proc_vars=dataMap.proc_vars;//流程变量

            var arr = [];
            arr.push(inst);
            //写入数据库创建流程
            model.$ProcessInst.create(arr,function(error,rs){
                if(error) {
                    // reject('新增流程实例信息时出现异常。'+error);
                    console.log(error)
                    reject(utils.returnMsg(false, '1000', '新增流程实例信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '新增流程实例信息成功。', rs[0]._doc._id, null));

                }
            });

        }
    });
    return p;
}



/**
 * 启用、禁用操作
 * @param id
 * @param value
 * @param flag
 * @param cb
 */
exports.instChangeStatus = function(id, value){

    var p = new Promise(function(resolve,reject){

        var conditions = {_id: id};
        var update = {$set: {proc_inst_status:value}};
        var options = {};
        var db = model.$ProcessInst;

        db.update(conditions, update, options, function (error) {
            if(error) {
                console.log(error);
                resolve(utils.returnMsg(false, '1000', '启用、禁用操作出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '启用、禁用操作成功。', null, null));
            }
        });

    });

    return p;


}

/**
 * 终止流程实例
 * @param inst_id
 * @returns {bluebird|exports|module.exports}
 */
exports.cancleInstance= function(inst_id) {

    var p = new Promise(function(resolve,reject){

        var data = {proc_inst_status:0};
        var conditions = {_id: inst_id};
        var update = {$set: data};

        var options = {};
        //更改流程实例状态
        model.$ProcessInst.update(conditions, update, options, function (error) {
            if(error) {
                console.log(error);
                resolve(utils.returnMsg(false, '1000', '终止流程实例时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '终止流程实例成功。', null, null));
            }
        });
    });
    return p;
};


/**
 * 修改流程实例
 * @param id
 * @param data
 * @returns {bluebird|exports|module.exports}
 */
exports.changeInstance= function(id,data) {

    var p = new Promise(function(resolve,reject){

        var conditions = {_id: id};
        var update = {$set: data};

        var options = {};
        model.$ProcessInst.update(conditions, update, options, function (error) {
            if(error) {
                console.log(error);
                reject(utils.returnMsg(false, '1000', '修改流程实例时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '修改流程实例成功。', null, null));
            }
        });


    });

    return p;
};


/**
 * 完成流程实例
 * @param id
 * @returns {bluebird|exports|module.exports}
 */
exports.completeInstance= function(id) {
    var p = new Promise(function(resolve,reject){
        var data = {proc_inst_status:4};//完成流程归档
        var conditions = {_id: id};
        var update = {$set: data};

        var options = {};
        model.$ProcessInst.update(conditions, update, options, function (error) {
            if(error) {
                console.log(error);
                resolve(utils.returnMsg(false, '1000', '流程实例归档时出现异常。', null, error));
            }
            else {
                resolve(utils.returnMsg(true, '0000', '流程实例归档成功。', null, null));
            }
        });
    });

    return p;
};

/**
 * 刷流程待处理人数据
 * @param proc_inst_id
 * @param users
 */
exports.updateProcInstPendingtUsers = function(proc_inst_id,users){
    var p = new Promise(function(resolve,reject){
        var udata = {
            proc_pending_users:users
        }
        var update = {$set: udata};
        var options = {};
        model.$ProcessInst.update({'_id':proc_inst_id}, update, options, function (error) {
            if(error) {
                console.log(error);
                resolve({'success': false, 'code': '1000', 'msg': '刷流程待处理人数据出现异常'});
            }else {
                resolve({'success': true, 'code': '0000', 'msg': '刷流程待处理人数据成功'});
            }
        });
    });
    return p;
}

exports.getnstanceStep= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessInstTaskHistroy, page, size, conditionMap, resolve, '',  {});


    });

    return p;
};

/**
 * 获取流程实例信息（by id）
 * @param inst_id
 * @returns {bluebird|exports|module.exports}
 */

exports.getInstByID = function(id) {

    var p = new Promise(function(resolve,reject){
        var query = model.$ProcessInst.find({});
        query.where('_id', id);
        query.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '无法获取流程实例信息。', null, error));
            } else {
                if(rs.length ==0 )
                {
                    resolve(utils.returnMsg(false, '1001', '无此流程实例编号:'+id, null, null));
                }else{
                    resolve(utils.returnMsg(true, '0000', '获取流程实例成功。', rs[0]._doc, null));
                }
            }
        });
    });

    return p;

}



/**
 * 获取流程实例列表
 * @returns {bluebird|exports|module.exports}
 */
exports.getnstanceList= function(conditionMap) {
    var p = new Promise(function(resolve,reject){
        var query = model.$ProcessInst.find({});
        // 设置当前页查询条件
        if(conditionMap){
            for(var key in conditionMap){
                query.where(key, conditionMap[key]);
            }
        }
        query.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '获取流程实例信息异常。', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '查询流程实例成功。', rs, null));
            }
        });
    });
    return p;
};
/**
 * 获取流程实例分页列表
 * @returns {bluebird|exports|module.exports}
 */
exports.getInstanceQuery4EuiList= function(page,size,conditionMap) {
    var p = new Promise(function(resolve,reject){
        utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '',  {proc_cur_arrive_time:-1});
    });
    return p;
};


/**
 * 获取我的流程实例列表
 * @returns {bluebird|exports|module.exports}
 */
exports.getMyInstList= function(userCode) {
    var p = new Promise(function(resolve,reject){
        var query = model.$ProcessInst.find({});
        query.where('proc_start_user', userCode);//根据流程发起人来查询
        query.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '无法获取流程实例列表信息。', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '获取流程实例列表成功。', rs, null));
            }
        });
    });
    return p;
};

/**
 * 获取我的待办任务列表分页方法
 * @param userCode
 * @param paramMap
 */
exports.getMyTaskQuery4Eui= function(page,size,userCode,paramMap) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var conditionMap = {};
        //proc_inst_task_user_org  进行模糊匹配
        conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles}},{'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_task_status = 0;
        console.log(conditionMap);
        utils.pagingQuery4Eui(model.$ProcessInstTask, page, size, conditionMap, resolve, '',  {proc_inst_task_arrive_time:-1});
    });
    return p;
};

/**
 * 获取我的已办任务列表分页方法
 * @param userCode
 * @param paramMap
 */
exports.getMyCompleteTaskQuery4Eui= function(page,size,userCode,paramMap) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var conditionMap = {};
        //proc_inst_task_user_org  进行模糊匹配
        conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles}},{'proc_inst_task_user_org':{$in:paramMap.orgs}}];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_task_status = 1;
        console.log(conditionMap);
        utils.pagingQuery4Eui(model.$ProcessTaskHistroy, page, size, conditionMap, resolve, '',  {proc_inst_task_arrive_time:-1});
    });
    return p;
};

/**
 * 获取我的待办任务列表
 * @param userCode
 * @param roleArr
 */
exports.getMyTaskList= function(userCode,roleArr,orgArr) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var query = model.$ProcessInstTask.find({"$or":[{'proc_inst_task_assignee':{"$in":userArr}},{'proc_inst_task_user_role':{"$in":roleArr},'proc_inst_task_user_org':{"$in":orgArr}}],'proc_inst_task_status':0});
        query.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '获取我的待办信息异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '获取我的待办成功。', rs, null));
            }
        });
    });
    return p;
};

/**
 * 获取我的已办任务列表
 * @param userCode
 * @param roleArr
 */
exports.getMyCompleteTaskList= function(userCode,roleArr,orgArr) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var query = model.$ProcessInstTask.find({"$or":[{'proc_inst_task_assignee':{"$in":userArr}},{'proc_inst_task_user_role':{"$in":roleArr},'proc_inst_task_user_org':{"$in":orgArr}}],'proc_inst_task_status':1});
        query.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '获取我的已办信息异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '获取我的已办成功。', rs, null));
            }
        });
    });
    return p;
};

/**
 * 认领任务
 * @param taskId
 * @param userJson
 */
exports.acceptTask= function(taskId,userNo,userName) {
    var p = new Promise(function(resolve,reject){
        var udata = {
            proc_inst_task_sign:1,
            proc_inst_task_handle_time : new Date(),
            proc_inst_task_assignee : userNo,
            proc_inst_task_assignee_name : userName
        }
        var update = {$set: udata};
        var options = {};
        model.$ProcessInstTask.update({'_id':taskId}, update, options, function (error) {
            if(error) {
                resolve({'success': false, 'code': '1000', 'msg': '任务认领出现异常'});
            }else {
                resolve({'success': true, 'code': '0000', 'msg': '任务认领成功'});
            }
        });
    });
    return p;
};
/**
 * 批量认领任务
 * @param taskIdArr
 * @param userJson
 */
exports.acceptTaskList= function(taskIdArr,userNo,userName) {
    var p = new Promise(function(resolve,reject){
        var udata = {
            proc_inst_task_sign:1,
            proc_inst_task_handle_time : new Date(),
            proc_inst_task_assignee : userNo,
            proc_inst_task_assignee_name : userName
        }
        var update = {$set: udata};
        var options = {};
        model.$ProcessInstTask.update({'_id':{'$in':taskIdArr}}, update, options, function (error) {
            if(error) {
                resolve({'success': false, 'code': '1000', 'msg': '批量任务认领出现异常'});
            }else {
                resolve({'success': true, 'code': '0000', 'msg': '批量任务认领成功'});
            }
        });
    });
    return p;
};

/**
 * 获取待办数据，根据Id
 * @param taskId
 */
exports.getTaskById= function(taskId) {
    var p = new Promise(function(resolve,reject){
        var query = model.$ProcessInstTask.find({'_id':taskId});
        query.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '获取待办信息异常', null, error));
            } else {
                if(rs.length > 0){
                    resolve(utils.returnMsg(true, '0000', '获取待办成功。', rs[0], null));
                }else{
                    resolve(utils.returnMsg(false, '1000', '该ID查询无数据。', null, null));
                }
            }
        });
    });
    return p;
};

/**
 * 获取待办已办数据，根据Id（query接口调用的方法）
 * @param taskId
 */
exports.getCompTaskById= function(taskId,flag) {
    var p = new Promise(function(resolve,reject){
        var mod = model.$ProcessInstTask.find({'_id':taskId});
        //flag 等于1的时候查询任务历史表
        if(flag && flag==1){
            mod = model.$ProcessTaskHistroy.find({'proc_task_id':taskId});
        }
        // var query = model.$ProcessInstTask.find({'_id':taskId});
        mod.exec(function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '获取待办信息异常', null, error));
            } else {
                if(rs.length > 0){
                    resolve(utils.returnMsg(true, '0000', '获取待办成功。', rs[0], null));
                }else{
                    resolve(utils.returnMsg(false, '1000', '该ID查询无数据。', null, null));
                }
            }
        });
    });

    return p;
};


/**
 * 完成任务
 * @param taskId
 */
exports.completeTask= function(taskId) {
    var p = new Promise(function(resolve,reject){
        var udata = {
            proc_inst_task_status:1,
            proc_inst_task_complete_time : new Date()
        }
        var update = {$set: udata};
        var options = {};
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
                        var obj=new Object(r[0]._doc)
                        console.log(obj._id);
                        obj.proc_task_id=obj._id;
                        console.log(obj.proc_task_id)
                        delete obj._id;
                        console.log(obj);

                        var arr_c=[];
                        arr_c.push(obj)
                        // console.log(arr_c);
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
/**
 * 批量完成任务
 * @param taskIdArr
 */
exports.completeTaskList= function(taskIdArr) {
    var p = new Promise(function(resolve,reject){
        var udata = {
            proc_inst_task_status:1,
            proc_inst_task_complete_time : new Date()
        }
        var update = {$set: udata};
        var options = {};
        model.$ProcessInstTask.update({'_id':{'$in':taskIdArr}}, update, options, function (error) {
            if(error) {
                resolve({'success': false, 'code': '1000', 'msg': '批量完成任务出现异常'});
            }else {
                resolve({'success': true, 'code': '0000', 'msg': '批量完成任务成功'});
            }
        });
    });
    return p;
};

/**
 * 根据流程编码删除实例数据
 * @param proc_code
 */
exports.instDelete = function(proc_code){
    var p = new Promise(function(resolve,reject){
        var data = {proc_code:proc_code};
        model.$ProcessInst.remove(data,function (error, rs) {
            if (error) {
                resolve(utils.returnMsg(false, '1000', '删除测试实例异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '删除测试实例成功。', rs, null));
            }
        });
    });
    return p;
}
/**
 * 根据流程实例ID删除实例数据
 * @param proc_code
 */
exports.instDeleteById = function(id){
    var p = new Promise(function(resolve,reject){
        var data = {_id:id};
        model.$ProcessInst.remove(data,function (error, rs) {
            if (error) {
                console.log(error)
                resolve(utils.returnMsg(false, '1000', '删除测试实例异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '删除测试实例成功。', rs, null));
            }
        });
    });
    return p;
}
/**
 * 根据实例ID批量删除任务
 * @param instIdArr
 */
exports.taskDelete = function(instIdArr){
    var p = new Promise(function(resolve,reject){
        var data = {proc_inst_id:{"$in":instIdArr}};
        model.$ProcessInstTask.remove(data,function (error, rs) {
            if (error) {
                console.log(error)
                resolve(utils.returnMsg(false, '1000', '删除测试实例相关任务异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '删除测试实例相关任务成功。', rs, null));
            }
        });
    });
    return p;
}


/**
 * 获取流程实例历史数据列表集合
 * @param page
 * @param size
 * @param conditionMap
 */
exports.getProcInstHistoryList = function(page,size,conditionMap) {
    var p = new Promise(function(resolve,reject){
        utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '',  {proc_start_time:-1});
    });
    return p;
};

/**
 * 编码唯一性验证
 * @param code
 * @param cb
 */

exports.checkCode= function(flag,proc_instance_code,id) {

    var p = new Promise(function(resolve,reject){
        var query =  model.$ProcessInst.find({});
        query.where('proc_instance_code',proc_instance_code);
        if(flag == 2){
            query.where({'_id':{'$ne':id}});
        }
        query.exec(function(err,rs){
            if(err){
                console.log(err);
                resolve({'success':false, 'code':'1000', 'msg':'编码唯一性验证时出现异常。'});
            }else{
                if(rs.length > 0){
                    resolve({'success':false, 'code':'1001', 'msg':'编码重复'});
                }else {
                    resolve({'success':true});
                }
            }
        });

    });
    return p;
};


/**
 * 流程实例处理日志
 * @param page
 * @param size
 * @param inst_id
 * @param inst_status
 */
exports.getInstHandlerLogsList = function(page,size,inst_id,inst_status){
    var p = new Promise(function(resolve,reject){
        var mod = model.$ProcessInstTask;
        var conditionMap = {};
        conditionMap.proc_inst_id = inst_id;
        if(inst_status == '4') {//实例归档
            mod = model.$ProcessTaskHistroy;
        }else{
            conditionMap.proc_inst_task_status = 1;
        }
        utils.pagingQuery4Eui(mod, page, size, conditionMap, resolve, '',  {proc_cur_arrive_time:-1});
    });
    return p;
};

//回退
exports.procInstBack = function(inst_id,node_code){
    var p = new Promise(function(resolve,reject){
        var query =  model.$ProcessInstTask.find({})
        query.where('proc_inst_task_code',node_code);
        query.where('proc_inst_id',inst_id);
        query.where('proc_inst_task_status',0);
        query.sort({proc_inst_task_handle_time:-1});
        query.exec(function(err,rs){
            if(err){
                console.log(err);
                resolve(utils.returnMsg(false, '1000', '获取任务数据异常', null, error));
            }else{
                if(rs.length > 0){
                    setInstStatus(rs[0],resolve);
                }else {
                    resolve(utils.returnMsg(false, '1000', '该节点无任务数据', null, null));
                }
            }
        });
    });
    return p;
};

//回退时设置流程实例状态
function setInstStatus(task,cb){
    var prevnode = task._doc.proc_inst_prev_node_code;
    console.log('prevnode-----------',prevnode);
    if(!prevnode){
        cb(utils.returnMsg(false, '1000', '开始节点无法回退', null, null));
        return;
    }

    //获取上一节点任务数据
    var query =  model.$ProcessInstTask.find({})
    query.where('proc_inst_task_code',prevnode);
    query.where('proc_inst_id',task._doc.proc_inst_id);
    query.where('proc_inst_task_status',1);
    query.sort({proc_inst_task_handle_time:-1});
    query.exec(function(err,rs){
        if(err){
            console.log(err);
            cb(utils.returnMsg(false, '1000', '获取上一节点任务数据异常', null, error));
        }else{
            if(rs.length > 0){
                //修改流程实例状态信息
                var data = {
                    proc_inst_status:5,
                    proc_cur_task_remark : '流转中-由节点 '+task._doc.proc_inst_task_name+' 回退',
                    proc_cur_task : rs[0]._doc.proc_inst_task_code,
                    proc_cur_task_name : rs[0]._doc.proc_inst_task_name
                }
                var update = {$set: data};
                var options = {};
                model.$ProcessInst.update({'_id':rs[0]._doc.proc_inst_id}, update, options, function (error) {
                    if(error) {
                        cb(utils.returnMsg(false, '1000', '回退-流程实例状态异常', null, error));
                    }else {
                        createTask(rs[0]._doc,cb,task);
                    }
                });
            }else {
                cb(utils.returnMsg(false, '1000', '无上一节点任务数据', null, null));
            }
        }
    });


};

//回退时创建上一节点处理人的任务数据
function createTask(prevtask,cb,curtask){
    var task = {};
    task.work_order_number=prevtask.work_order_number;//工单编号
    task.proc_inst_id=prevtask.proc_inst_id;// : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
    task.proc_inst_task_code=prevtask.proc_inst_task_code;// : String,// 流程当前节点编码(流程任务编号)
    task.proc_inst_task_name=prevtask.proc_inst_task_name;// : String,// 流程当前节点名称(任务名称)
    task.proc_inst_task_title=prevtask.proc_inst_task_title;// : String,// 任务标题proc_inst_task_title
    task.proc_inst_task_type=prevtask.proc_inst_task_type;// : String,// 流程当前节点类型(任务类型)
    task.proc_inst_task_arrive_time=new Date();// : Date,// 流程到达时间
    task.proc_inst_task_handle_time=new Date();//: Date,// 流程认领时间
    task.proc_inst_task_complete_time="";// : Date,// 流程完成时间
    task.proc_inst_task_status=0;// : Number,// 流程当前状态
    task.proc_inst_task_assignee=prevtask.proc_inst_task_assignee;//: array,// 流程处理人ID
    task.proc_inst_task_assignee_name=prevtask.proc_inst_task_assignee_name;// : array,// 流程处理人名
    task.proc_inst_task_user_role =prevtask.proc_inst_task_user_role;//: String,// 流程处理用户角色ID
    task.proc_inst_task_user_role_name=prevtask.proc_inst_task_user_role_name;// : String,// 流程处理用户角色名
    task.proc_inst_task_user_org=prevtask.proc_inst_task_user_org;//String  //流程处理用户的组织
    task.proc_inst_task_params=prevtask.proc_inst_task_params;// : String,// 流程参数(任务参数)
    task.proc_inst_task_claim="";// : Number,// 流程会签
    task.proc_inst_task_sign=1;// : Number,// 流程签收(0-未认领，1-已认领)
    task.proc_inst_task_sms="";//"// : String// 流程处理意见
    task.proc_inst_task_remark="";
    task.proc_inst_biz_vars=prevtask.proc_inst_biz_vars;//实例变量
    task.proc_inst_node_vars=prevtask.proc_inst_node_vars;//流程节点变量
    task.proc_vars=prevtask.proc_vars;//流程变量

    var arr=[];
    arr.push(task);
    //写入数据库创建流程任务表
    model.$ProcessInstTask.create(arr,function(error,rs){
        if(error) {
            // reject('新增流程实例信息时出现异常。'+error);
            console.log(error)
            cb(utils.returnMsg(false, '1000', '回退流转任务出现异常。', null, error));
        }
        else {
            var data = {
                proc_inst_task_status:1,
                proc_inst_task_sign:1,
                proc_inst_task_handle_time : new Date(),
                proc_inst_task_complete_time : new Date(),
                proc_inst_task_remark:'回退给节点 '+prevtask.proc_inst_task_name
            }
            var update = {$set: data};
            var options = {};
            model.$ProcessInstTask.update({'_id':curtask._doc._id.toString()}, update, options, function (error,result) {
                if (error) {
                    console.log(error)
                    cb(utils.returnMsg(false, '1000', '回退修改当前任务异常', null, error));
                } else {
                    var obj=new Object(curtask._doc);
                    obj.proc_task_id=obj._id;
                    delete obj._id;
                    var arr_c=[];
                    arr_c.push(obj)
                    model.$ProcessTaskHistroy.create(arr_c, function (errs,results){
                        if(errs){
                            console.log(errs);
                            cb(utils.returnMsg(false, '1001', '回退时创建历史任务异常。', null, errs));
                        }else{
                            cb(utils.returnMsg(true, '0000', '回退成功。', rs, null));
                        }
                    });
                }
            });

        }
    });
};

//废弃
exports.procInstScrap = function(inst_id){
    var p = new Promise(function(resolve,reject){
        //修改流程实例状态信息
        var data = {
            proc_inst_status:6,
            proc_cur_task_remark : '流程实例废弃'
        }
        var update = {$set: data};
        var options = {};
        model.$ProcessInst.update({'_id':inst_id}, update, options, function (error) {
            if(error) {
                resolve(utils.returnMsg(false, '1000', '废弃流程实例异常', null, error));
            }else {
                //废弃成功后，相关任务如何处理？
                resolve(utils.returnMsg(true, '0000', '废弃流程实例成功', null, null));
            }
        });
    });
    return p;
};

/**
 * 根据实例id,查询完成的任务集合
 */
exports.queryCompTask = function(inst_id){
    var p = new Promise(function(resolve,reject){
        var query =  model.$ProcessInstTask.find({})
        query.where('proc_inst_id',inst_id);
        query.where('proc_inst_task_status',1);
        query.sort({proc_inst_task_handle_time:-1});
        query.exec(function(err,rs){
            if(err){
                console.log(err);
                resolve(utils.returnMsg(false, '1000', '获取任务数据异常', null, error));
            }else{
                if(rs.length > 0){
                    var arr = [];
                    for(var i=0;i<rs.length;i++){
                        arr.push(rs[i].proc_inst_task_code);
                    }
                    console.log('------',arr);
                    resolve(utils.returnMsg(true, '0000', '获取任务数据成功', arr, null));
                }else {
                    resolve(utils.returnMsg(false, '1000', '该节点无任务数据', null, null));
                }
            }
        });
    });
    return p;
};


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
                if(rs.length>0){
                    var proc_inst_id= rs[0].proc_inst_id;
                    model.$ProcessInst.find({"_id":proc_inst_id},function(errs,res){
                        if(errs){
                            resolve(utils.returnMsg(false, '1000', '流程流转出现异常2。', null, errs));

                        }else{
                            if(res.length>0) {
                                var prev_node = res[0].proc_cur_task;
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
                                var proc_inst_node_vars = next_detail.item_node_var;
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
                                                        console.log(r);
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
                                                                    console.log(rs);
                                                                    if (rs.success) {
                                                                        async function xunhuan() {
                                                                            var users = [];
                                                                            users = assign_user_code.split(',');
                                                                            console.log(users);
                                                                            for (var i = 0; i < users.length; i++) {
                                                                                var user_no = users[i];
                                                                                console.log(user_no);
                                                                                let resultss = await  model_user.$User.find({"user_no": user_no});
                                                                                if (resultss) {
                                                                                    console.log(resultss,'AAAAAAAAAAAAAAAAAAAAAAAAAA');
                                                                                    var user_org = resultss[0].user_org;
                                                                                    var user_name = resultss[0].user_name;
                                                                                    var user_roles = resultss[0].user_roles.toString();
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
                                                                                    condition_task.proc_inst_task_sms = "";// Number,// 流程是否短信提醒
                                                                                    condition_task.proc_inst_task_remark = memo;// : String// 流程处理意见
                                                                                    condition_task.proc_inst_task_assignee_name = user_name;
                                                                                    // var arr = [];
                                                                                    // arr.push(condition_task);
                                                                                    //创建新流转任务
                                                                                    let rs = await model.$ProcessInstTask.create(condition_task);
                                                                                    console.log(rs);

                                                                                    let res = await touchNode(next_detail, user_code, rs._id, true);
                                                                                    console.log(i);
                                                                                }
                                                                            }
                                                                            return "end";
                                                                        }
                                                                        xunhuan().then(function(res){
                                                                                resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常8。',res, null));
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


//批量处理
/**@param _id
 *@param proc_inst_node_vars
 *@param assign_user_code
 *@param proc_inst_task_status//是否归档的状态
 *@param
 *@param
 *
 *
 */
exports.do_batch=function(user_no,user_name,proc_inst_id){
    console.log(user_no,user_name,proc_inst_id);
    var p = new  Promise(function(resolve,reject){
        model.$ProcessInstTask.find({proc_inst_task_status:0,proc_inst_id:proc_inst_id},function(err,data){
            if(err){
                console.log(err);
                resolve(utils.returnMsg(false, '1000', '查询出错。', null, err));
            }
            else {
                if(data){
                    async function xunhuan(){
                        for(var i=0;i<data.length;i++){
                            var task = data[i];
                            var datas = {
                                proc_inst_task_status:1,
                                proc_inst_task_complete_time:new Date(),
                                proc_inst_task_remark:'由'+user_name+'手动归档'
                            };//用来保存数据
                            var update = {$set: datas};
                            var options = {};
                            console.log("第"+i+"ci");
                            let step_one=await model.$ProcessInstTask.update({'_id':task._id},update,options);
                            let step_two=await  model.$ProcessInstTask.find({'_id':task._id});
                            task.proc_task_id=step_two[0].id
                            delete step_two[0]._id;
                            let step_three=await  model.$ProcessTaskHistroy.create(task);
                            // resolve(utils.returnMsg(true, '0000', '查找出所有状态为0的数据。',step_three,null));
                        }
                        return "end"
                    }
                    xunhuan().then(function(e){
                        console.log(e,"jieshu")
                        //给当前处理人创建一个任务
                        model.$ProcessInst.find({'_id':proc_inst_id},function(err,result){
                            if(err){
                                console.log(err);
                                resolve(utils.returnMsg(false, '1000', '创建任务失败', null, err));
                            }else{
                                console.log(result,'————————');
                                var conductor = {};
                                conductor.proc_inst_id=proc_inst_id;
                                conductor.proc_task_id='';
                                conductor.proc_inst_task_code=result[0]. proc_cur_task;
                                conductor.proc_inst_task_name=result[0].proc_cur_task_name;
                                conductor.proc_inst_task_type=result[0].proc_name;
                                conductor.proc_inst_task_title=result[0].proc_title;
                                conductor.proc_inst_task_arrive_time=result[0].proc_cur_arrive_time;
                                conductor.proc_inst_task_handle_time=new Date();
                                conductor.proc_inst_task_complete_time=new Date();
                                conductor.proc_inst_task_status=1;
                                conductor.proc_inst_task_assignee=user_no;
                                conductor.proc_inst_task_assignee_name=user_name;
                                conductor.proc_inst_task_user_role='';
                                conductor.proc_inst_task_user_role_name='';
                                conductor.proc_inst_task_user_org='';
                                conductor.proc_inst_task_user_org_name='';
                                conductor.proc_inst_task_params='';
                                conductor.proc_inst_task_claim='';
                                conductor.proc_inst_task_sign='';
                                conductor.proc_inst_task_sms=result[0].proc_cur_task_overtime_sms;
                                conductor.proc_inst_task_remark='由'+user_name+'手动归档';
                                conductor.proc_inst_biz_vars='';
                                conductor.proc_inst_node_vars='';
                                conductor.proc_inst_prev_node_code='';
                                conductor.proc_inst_prev_node_handler_user='';
                                conductor.proc_vars=result.proc_vars;
                                model.$ProcessTaskHistroy.create(conductor,function(err,resultss){
                                    if(err){
                                        console.log(err);
                                        resolve(utils.returnMsg(false, '1000', '创建任务失败', null, err));
                                    }else{
                                        console.log(resultss);
                                        //resolve(utils.returnMsg(true, '0000', '创建任务成功', resultss,null ));
                                        var advance_status = {
                                            proc_inst_status : 4
                                        };
                                        var update = {$set:advance_status};
                                        var options = {};
                                        model.$ProcessInst.update({'_id':proc_inst_id},update,options,function(err,resultt){
                                            if(err){
                                                console.log(err);
                                                resolve(utils.returnMsg(false, '1000', '改变状态失败', null, err));
                                            }else{
                                                console.log(resultt);
                                                resolve(utils.returnMsg(true, '0000', '归档成功', resultt, null));
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    });
    return p;
};


/**
 * 深度稽核
 * 获取分公司的任务，根据实例id，节点编号，状态为0
 * @param taskId
 */
exports.getInterimTaskById= function(inst_id,node_code) {
    var p = new Promise(function(resolve,reject){
        model.$ProcessInstTask.find({proc_inst_id:inst_id,proc_inst_task_status:0},function(err,data){
            if (err) {
                resolve(utils.returnMsg(false, '1000', '查询任务异常', null, error));
            } else {
                resolve(utils.returnMsg(true, '0000', '查询任务成功', data, null));
            }
        });
    });
    return p;
};
/*
查询用户是否存在
 */
exports.userInfo = function(userNo){
    var p = new Promise(function(resolve,reject){
        //根据用户编码查询用户
          model_user.$User.find({user_no:userNo},function(err,data){
              if(err){
                  resolve(utils.returnMsg(false, '1000', '查询用户信息出错', null, err));
              }else{
                  if(data.length>0){
                      resolve(utils.returnMsg(true, '0000', '查询用户成功', data, null));
                  }else{
                      resolve(utils.returnMsg(false, '0000', '用户不存在', null, null));
                  }

              }
          });
    });
    return p;
}

/*
区县公司调账(营业员--非销户)归档接口
 */
exports.goPigeonhole = function(proc_inst_id){
    var p = new Promise(function(resolve,reject){
       model.$ProcessInst.find({_id:proc_inst_id},function(err,data){
           if(err){
               resolve(utils.returnMsg(false, '1000', '查询实例信息出错', null, err));
           }else{
               if(data.length>0){
                   if(data[0].proc_inst_status==4){
                       resolve(utils.returnMsg(true, '0000', '流程已经归档', data, null));
                   }else{
                       var advance_status = {
                           proc_inst_status : 4
                       };
                       var update = {$set:advance_status};
                       var options = {};
                       model.$ProcessInst.update({'_id':proc_inst_id},update,options,function(err,resultt){
                           if(err){
                               console.log(err);
                               resolve(utils.returnMsg(false, '1000', '改变状态失败', null, err));
                           }else{
                               console.log(resultt);
                               resolve(utils.returnMsg(true, '0000', '归档成功', resultt, null));
                           }
                       });
                   }
               }else{
                   resolve(utils.returnMsg(false, '0000', '流程信息不存在', null, null));
               }
           }
        })
    });
    return p;
}