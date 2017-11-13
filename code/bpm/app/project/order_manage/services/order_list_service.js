
var model = require('../../bpm_resource/models/process_model');

var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;
var nodeAnalysisService=require("./node_analysis_service");

var nodeTransferService=require("./node_transfer_service");
/**
 * 工单列表分页
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getOrderListPage= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '',  {});

    });

    return p;
};
/**
 * 获取所有流程
 * @returns {Promise}
 */
exports.getAllProBase= function() {

    var p = new Promise(function(resolve,reject){
        model.$ProcessBase.find({"status":"1"},function(err,result){
            if(err){
                console.log('获取所有流程失败',err);
                resolve({'success':false,'code':'1000','msg':'获取所有流程失败',"error":err});
            }else{
                resolve({'success':true,'code':'0000','msg':'获取所有流程成功',"data":result,"error":null});

            }
        });

    });

    return p;
};

/**
 * 获取对应流程的详细节点信息
 * @returns {Promise}
 */
exports.getProcDefineDetail= function(proc_code) {

    var p = new Promise(function(resolve,reject){
        model.$ProcessDefine.find({"proc_code":proc_code},function(err,result){
            if(err){
                console.log('获取流程信息失败',err);
                resolve({'success':false,'code':'1000','msg':'获取流程详细信息失败',"error":err});
            }else{
                console.log('获取流程信息结果',result);
                //获取开始节点信息，因为第一节点为"开始"，所以这里获取第二节点"processDefineDiv_node_2"为开始节点
                if(result.length>0){
                    var nodes=JSON.parse(result[0].proc_define).nodes;
                    resolve({'success':true,'code':'0000','msg':'获取流程详细信息成功',"data":nodes.processDefineDiv_node_2,"error":null});

                }else{
                    resolve({'success':false,'code':'1001','msg':'获取流程详细信息失败',"error":"获取当前节点信息失败"});

                }

            }
        });

    });

    return p;
};
/**
 * 验证角色
 * @param userNo
 * @returns {Promise}
 */
exports.getUsreRolesByUserNo= function(userNo) {
    var p = new Promise(function(resolve,reject){
        var query = model.$User.find({'user_no':userNo,'user_status':1});
        query.exec(function(error,result){
            if (error) {
                var resuMap = {};
                resuMap.orgs = null;
                resuMap.roles = [];
                resolve(resuMap);
            } else {
                resolve(setRoleIdArr(result));
            }
        });
    });
    return p;
};
function setRoleIdArr(arr){
    var resuMap = {};
    var result = [];
    if(arr && arr.length > 0){
        var roles = arr[0]._doc.user_roles;
        for(var i=0;i<roles.length;i++){
            result.push(roles[i].toString());
        }
        resuMap.orgs = arr[0]._doc.user_org?arr[0]._doc.user_org:null;
        resuMap.roles = result;
    }
    return resuMap;
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
    var promise = new Promise(function(resolve,reject){
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
                            console.log(rss);


                            //获取下一节点的操作人 或者 操作角色信息
                            nodeAnalysisService.findNextHandler(user_code,data._id,firstNode,params,"").then(function(rsss){
                                var condition={};
                                if(rss.success&&rsss.success){
                                    // console.log(rss.data);

                                    model_user.$User.find({'user_no':user_code},function(err,resu){
                                        if(err){
                                            console.log(err);
                                            resolve({'success':false, 'code':'2001', 'msg':'发起人id错误。'});
                                        }else{
                                            find(resu[0].user_roles.toString()).then(function(role){
                                                if(role.success){
                                                    condition.proc_start_user_role_names = role.data.toString().split(',');
                                                    console.log(condition.proc_start_user_role_names,'0000000');
                                                    condition.proc_start_user_role_code = resu[0].user_roles.toString();
                                                    condition.proc_start_user_name =user_name;

                                                    var node_detail=rss.data;
                                                    var orgs=rsss.data;
                                                    nodeDetail=node_detail;
                                                    var next_detail=node_detail.next_detail;
                                                    var next_node=node_detail.next_node;
                                                    condition.proc_cur_task_name=next_node.name;//节点中文名称
                                                    condition.proc_cur_task=next_detail.item_code;//节点code
                                                    condition.proc_inst_node_vars=next_detail.item_node_var;//节点变量
                                                    var item_assignee_type=next_detail.item_assignee_type;

                                                    var current_opt=[];
                                                    if(item_assignee_type==1){
                                                        //单个人的操作
                                                        current_opt.push(next_detail.item_assignee_user);
                                                        condition.current_opt=current_opt;
                                                        condition.proc_inst_task_complete_time = new Date();
                                                        condition.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)
                                                    }

                                                    if(item_assignee_type==2||item_assignee_type==3){
                                                        //多人操作
                                                        var item_assignee_role_code= next_detail.item_assignee_role_code;

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
                                                                    condition.proc_task_start_user_role_code = rs[0].proc_start_user_role_code;
                                                                    condition.proc_task_start_user_role_names = rs[0].proc_start_user_role_names;
                                                                    condition.proc_task_start_name = user_name;

                                                                    condition.proc_inst_task_title = proc_title;
                                                                    condition.proc_inst_biz_vars = biz_vars_json;
                                                                    condition.proc_vars = proc_vars_json; condition.proc_inst_task_title = proc_title;
                                                                    condition.proc_inst_biz_vars = biz_vars_json;
                                                                    condition.proc_vars = proc_vars_json;


                                                                    //创建流程任务
                                                                    insertTask(insresult,condition).then(function(taskresult){
                                                                        resolve(taskresult);
                                                                    });
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
/**
 * 新增流程任务
 * @param result
 * @param condition
 */
function insertTask(result,condition){
    var proc_inst_task_assignee,proc_inst_task_assignee_name,proc_inst_task_sign;
    var proc_inst_task_user_role,proc_inst_task_user_role_name
    if(nodeDetail.next_detail.item_assignee_type==1){
        proc_inst_task_assignee=nodeDetail.next_detail.item_assignee_user_code;
        proc_inst_task_assignee_name=nodeDetail.next_detail.item_show_text;
        proc_inst_task_user_role ="";
        proc_inst_task_user_role_name="";
        proc_inst_task_sign=1;// : Number,// 流程签收(0-未认领，1-已认领)
    }
    if(nodeDetail.next_detail.item_assignee_type==2||nodeDetail.next_detail.item_assignee_type==3){
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
            task.proc_inst_task_user_role =proc_inst_task_user_role;//: String,// 流程处理用户角色ID
            task.proc_inst_task_user_role_name=proc_inst_task_user_role_name;// : String,// 流程处理用户角色名
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

            var arr=[];
            arr.push(task);
            //写入数据库创建流程任务表
            model.$ProcessInstTask.create(arr,function(error,rs){
                if(error) {
                    // reject('新增流程实例信息时出现异常。'+error);
                    console.log(error)
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