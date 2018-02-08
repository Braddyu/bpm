/**
 * Created by aurora on 2017/6/15.
 */
var model_user=require("../models/user_model");
var model = require('../models/process_model');
var Promise = require("bluebird");
var nodeAnalysisService=require("./node_analysis_service");
var utils = require('../../../../lib/utils/app_utils');
var nodegrass = require("nodegrass");
var REQ_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded'
};
//
/**
 *
 * @param resolve
 * @constructor
 *
 * @desc 当没有查询到结果时候调用的方法
 */
var NoFound=(resolve)=>{
  resolve({"data":null,"error":null,"msg":"没有查询到结果","code":"1000","success":false});
}
//触发事件的实际执行模块
/**
 * @param url_address  触发事件 访问的 外部接口
 * @param task_id
 * @param user_no
 * @returns {bluebird}
 *
 * @desc 用于触发事件的外部接口访问模块，同时吧访问记录和状态 记录下来
 */

 function visit(url_address,task_id,user_no){ //触发事件 访问的接口；
    var map={};
    return new Promise(async function(resolve,reject){
      let result = await  model.$ProcessInstTask.find({"_id":task_id});
      if(!result.length){
        NoFound(resolve);
        return ;
      }
      map.proc_inst_task_name =result[0].proc_inst_task_name;
      map.proc_inst_task_assignee_name=result[0].proc_inst_task_assignee_name;
      map.proc_inst_biz_vars=result[0].proc_inst_biz_vars;
      map.proc_inst_task_assignee=result[0].proc_inst_task_assignee;
      let r = await model.$ProcessInst.find({"_id":result[0].proc_inst_id});
      if(!r.length){NoFound(resolve);return ;}
        map. proc_name=r[0].proc_name;// : "采购测试流程"
        map.proc_ver= r[0].proc_ver;//" : NumberInt(4)
        map.proc_title=r[0].proc_title;//" : "采购测试流程"
        map.proc_cur_task_name=r[0].proc_cur_task_name;//" : "总经办审核"
        nodegrass.post(url_address,
            async function (res, status, headers) {
                if(status==200){
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
                    await model.$ProcessNetBase.create(arr);
                    resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true})
                }else{
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
                    await model.$ProcessNetBase.create(arr);
                    resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true});
                }
            },
            REQ_HEADERS,
            {page:1,rows:15,time:new Date(),param:map},
            'utf8').on('error', async function (e) {
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
            await model.$ProcessNetBase.create(arr);
            resolve({"data":null,"error":null,"msg":"触发事件记录正常","code":"0000","success":true})

            });
        });
}


//触发节点信息事件
/**
 *
 * @param detail
 * @param user_no
 * @param task_id
 * @param flag
 * @returns {bluebird}
 *
 * @desc 用于流程触发事件的控制器
 */
function touchNode(detail,user_no,task_id,flag){
    return  new Promise(async function (resolve,reject){
        if(flag){
            //到达节点触发
            if(detail){
                if(detail.item_touchEvent_type==1){
                    //到达节点触发
                    //console.log("到达节点触发")
                    var item_filePath=detail.item_filePath;
                    let r=await visit(item_filePath,task_id,user_no);
                    resolve(r);
                }else{
                    resolve({"data":null,"error":null,"msg":"触发事件无需求","code":"0000","success":true});
                }
            }else {
                resolve({"data":null,"error":null,"msg":"触发事件记录异常","code":"0000","success":true})
            }
        }else{
            //节点完成之后触发
            if(detail){
                if(detail.item_touchEvent_type==2){
                    //节点完成之后触发
                    //console.log("节点完成之后触发")
                    var item_filePath=detail.item_filePath;
                    let rs =await visit(item_filePath,task_id,user_no);
                    resolve(rs);
                }else{
                    resolve({"data":null,"error":null,"msg":"触发事件无需求","code":"0000","success":true})
                }
            }else {
                resolve({"data":null,"error":new Error("没有current_detail信息 "),"msg":"触发事件记录异常","code":"1001","success":false})
            }
        }
    })

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
 *
 * @desc 自动流转方法，用于普通流转，也是整个流转的的控制器
 */
exports.transfer=function(proc_inst_task_id,node_code,user_code,opts,memo,param_json_str,biz_vars,proc_vars,next_name){
  return new Promise(async function(resolve,reject){
      var params = eval('(' + param_json_str + ')');
      var org={};
      if(opts) {        //同意流转       //查询当前节点的下一节点信息
          var task_id_array = [];
          let rs = await model.$ProcessInstTask.find({"_id": proc_inst_task_id});
          if (!rs.length) {
              NoFound(resolve);
              return;
          }
          var proc_inst_id=rs[0].proc_inst_id;

          let rss = await model.$ProcessInst.find({"_id": rs[0].proc_inst_id});
          if (!rss.length) {
              NoFound(resolve);
              return;
          }
          var proc_define_id = rss[0].proc_define_id;
          var prev_node = rss[0].proc_cur_task;
          var prev_user = rss[0].proc_cur_user;
          var proc_define = JSON.parse(rss[0].proc_define);
          var item_config = JSON.parse(rss[0].item_config);
          if (!prev_user) {
              prev_user = user_code;
          }
          let results = await nodeAnalysisService.getNode(proc_define_id, node_code, params, true);
          if (!results.success) {
              resolve(results);
              return;
          }
          let resultss = await touchNode(results.data.next_detail, user_code, proc_inst_task_id, true);
          if (!resultss.success) {
              resolve(resultss);
              return;
          }
          var current_detail = results.data.current_detail;
          var item_type = current_detail.item_type;//当前节点的类型
          if (!proc_vars) {
              proc_vars = rss[0].proc_vars;
          }
          if (item_type == "fork") {      // 并行节点起点的流转     // create subject process_inst and the inst_task
              var proc_define = JSON.parse(rss[0].proc_define);
              var item_config = JSON.parse(rss[0].item_config);
              var data = {proc_inst_status: 3};
              if (proc_vars) {
                  data = {proc_inst_status: 3, proc_vars: proc_vars};
              } else {
                  proc_vars = rss[0].proc_vars;
              }
              var conditions = {_id: proc_inst_id};
              var update = {$set: data};
              var options = {};
              await model.$ProcessInst.update(conditions, update, options);//更新原主流程实例化的 状态 进入子流程流转状态
              var condition = {_id: proc_inst_task_id}
              var datas = {
                  proc_inst_task_status: 1,
                  proc_inst_task_assignee: user_code,
                  proc_inst_task_complete_time: new Date(),
                  proc_inst_task_remark: memo
              };
              var updates = {$set: datas};
              await model.$ProcessInstTask.update(condition, updates, options);
              let rest = await touchNode(current_detail, user_code, proc_inst_task_id, false);
              if (!rest.success) {
                  resolve(rest);
                  return;
              }
              let r = await model.$ProcessInstTask.find({'_id': proc_inst_task_id});
              if (!r.length) {
                  NoFound(resolve);
                  return;
              }
              var obj = new Object(r[0]._doc);
              obj.proc_task_id = obj._id;
              delete obj._id;
              var arr_c = [];
              arr_c.push(obj);
              await model.$ProcessTaskHistroy.create(arr_c);
              var node_Array = nodeAnalysisService.getNodeArray(proc_define, node_code);
              var k = 0;
              await forkTaskCreate(item_config, proc_define, node_Array, k, user_code, proc_define_id, params, proc_inst_id, resolve, task_id_array, biz_vars, prev_node, prev_user, proc_vars);
              resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息时出现异常。', task_id_array, null));
          } else {
              var next_node = results.data.next_node;
              var next_detail = results.data.next_detail;
              var current_detail = results.data.current_detail;
              var type = next_node.type;
              if (type == "end  round") {//归档//到达最后一步 不可以流转 //往实例表中 插入数据
                 let rs_s = await overFunction(current_detail, proc_inst_id, proc_inst_task_id, user_code, memo, next_name);
                  resolve(rs_s);
              } else if (type == "join") {//会签//调用会签流转的方法
                  await joinFunction(proc_inst_id, resolve, reject, node_code, params, proc_inst_task_id, user_code, biz_vars, prev_node, prev_user, proc_vars);//proc_inst_id, resolve, reject, node_code, params, proc_inst_task_id,user_code
              } else {//流转（进入普通task的流转的方法）//可以流转的状态//调用普通流转的方法
                  await normal_process(current_detail, next_detail, next_node, proc_inst_id, resolve, reject, proc_define_id, proc_inst_task_id, user_code, node_code, params, biz_vars, prev_node, prev_user, proc_vars, memo);//next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params
              }
          }
      }else{
          //驳回的处理方法
            rejectFunction(proc_inst_task_id, node_code, params, reject, resolve, memo,org);
      }
  })
}

//并行分支任务创建
function forkTaskCreate(item_config, proc_define, node_Array, k, user_code, proc_define_id, params, proc_inst_id, resolve, task_id_array,biz_vars,prev_node,prev_user,proc_vars) {
    if(node_Array && node_Array.length>k){
        var results = nodeAnalysisService.getNodeInfo(item_config, proc_define, node_Array[k], null);
        var current_detail = results.current_detail;
        var current_nodes = results.current_node
        nodeAnalysisService.findCurrentHandler(user_code, proc_define_id, node_Array[k], params, proc_inst_id).then(function (rs) {
            nodeAnalysisService.findParams(proc_inst_id, node_Array[k]).then(function (result_t) {
                var proc_cur_task = current_detail.item_code;
                var proc_inst_node_vars = current_detail.item_node_var;
                var proc_cur_task_name = current_nodes.type;
                var org = rs.data;
                var proc_inst_task_params = result_t.data;
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
/**
 *
 * @param proc_inst_task_id
 * @param node_code
 * @param params
 * @param reject
 * @param resolve
 * @param memo
 * @param org
 * @returns {Promise<void>}
 *
 * @desc 用于流程的驳回
 */
async function rejectFunction(proc_inst_task_id, node_code, params, reject, resolve, memo,org) {
//驳回
    let rs_s=await model.$ProcessInstTask.find({"_id": proc_inst_task_id});
    if(!rs_s.length){NoFound(resolve);return ; }
    var proc_inst_id = rs_s[0].proc_inst_id;
    let rss=await model.$ProcessInst.find({"_id": proc_inst_id});
    if(!rss.length){NoFound(resolve);return ;}
    var proc_define_id = rss[0].proc_define_id;
    let rs=await nodeAnalysisService.getNode(proc_define_id, node_code, params, false);
    if(!rs.success){resolve(rs);return ;}
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
    await model.$ProcessInst.update(conditions, update, options);
    var condition_update = {};
    condition_update.proc_inst_task_status = 2;
    condition_update.proc_inst_task_complete_time = new Date();
    condition_update.proc_inst_task_remark = memo;
    await model.$ProcessInstTask.update({_id: proc_inst_task_id}, {$set: condition_update}, {});
    var condition_task = {};
    let result_s=await nodeAnalysisService.findParams(proc_inst_id,node_code);
    if(!result_s.success){resolve(result_s);return ;}
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
    condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
    condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
    condition_task.proc_inst_task_sms = "";// Number,// 流程是否短信提醒
    var arr = [];
    arr.push(condition_task);
    await model.$ProcessInstTask.create(arr);
    resolve(utils.returnMsg(true, '0000', '驳回成功。', null, null));

}

//会签流程方法
/**
 *
 * @param proc_inst_id
 * @param resolve
 * @param reject
 * @param node_code
 * @param params
 * @param proc_inst_task_id
 * @param user_code
 * @param biz_vars
 * @param prev_node
 * @param prev_user
 * @param proc_vars
 * @param memo
 * @returns {Promise<void>}
 *
 * @desc 用于会签节点的流转，当会签所有子节点结束才会进入会签节点流转，否则等待
 *
 */
async function joinFunction(proc_inst_id, resolve, reject, node_code, params, proc_inst_task_id,user_code,biz_vars,prev_node,prev_user,proc_vars,memo) {
    var condition={_id:proc_inst_task_id}
    var datas={proc_inst_task_status:1,proc_inst_task_assignee:user_code,proc_inst_task_complete_time:new Date(),proc_inst_task_remark:memo};
    var updates={$set:datas};
    //更新原任务
    await model.$ProcessInstTask.update(condition, updates, {});
    let cd={}
    if (proc_inst_id != null) {
        cd.proc_inst_id= proc_inst_id;
    }
    cd.proc_inst_task_status=0;
    let rs=await model.$ProcessInstTask.find(cd);
    if(!rs.length){NoFound(resolve);return ;}
    let result=await model.$ProcessInst.find({_id:proc_inst_id});
    if(!result.length){NoFound(resolve);return ;}
    var proc_define_id=result[0].proc_define_id;
    let results=await nodeAnalysisService.getNode(proc_define_id, node_code, params, true);
    if(!results.success){resolve(results);return ;}
    var next_detail = results.data.next_detail;
    var current_detail=results.data.current_detail;
    var next_node = results.data.next_node;
    normal_process(current_detail,next_detail, next_node, proc_inst_id, resolve, reject,proc_define_id,proc_inst_task_id,user_code,node_code,params,biz_vars,prev_node,prev_user,proc_vars,memo);//next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node

}

//归档function
/**
 *
 * @param current_detail
 * @param proc_inst_id
 * @param proc_inst_task_id
 * @param user_code
 * @param memo
 * @param next_name
 * @returns {bluebird}
 *
 * @desc 用于流程归档；
 */
function overFunction(current_detail,proc_inst_id, proc_inst_task_id,user_code,memo,next_name) {

    return new Promise(async function(resolve,reject){
        var data = {};
        data.proc_inst_task_status=1;
        data.proc_inst_task_complete_time=new Date();
        data.proc_inst_task_handler_code=user_code;
        data.proc_inst_task_remark=memo;
        data.next_name = next_name;
        data.proc_back = 0;
        var conditions = {_id: proc_inst_task_id};
        var update = {$set: data};
        var options = {};
       // 更新当前任务的状态
        await model.$ProcessInstTask.update(conditions, update, options);
        let rest=await touchNode(current_detail,user_code,proc_inst_task_id,false);
        if(!rest.success){resolve(rest);return ;}
        let r=await model.$ProcessInstTask.find({'_id':proc_inst_task_id});
        if(!r.length){NoFound(resolve);return ;}
        var obj=new Object(r[0]._doc)
        obj.proc_task_id=obj._id;
        delete obj._id;
        var arr_c=[];
        arr_c.push(obj)
        await model.$ProcessTaskHistroy.create(arr_c);
        let cd={};
        if (proc_inst_id != null) {
            cd.proc_inst_id=proc_inst_id;
        }
        let rs=await model.$ProcessInstTask.find(cd).sort({proc_inst_task_complete_time: -1});
        if(!rs.length){NoFound(resolve);return ;}
        var proc_task_history = JSON.stringify(rs);
        var data1 = {proc_inst_status: 4, proc_task_history: proc_task_history};
        var conditions1 = {_id: proc_inst_id};
        var update1 = {$set: data1};
        var options1 = {};
        //吧所有的任务过程写入流程实例化的历史中去  同时更新状态
        await model.$ProcessInst.update(conditions1, update1, options1);
        await model.$ProcessInstTask.remove({"proc_inst_id":proc_inst_id});
        resolve(utils.returnMsg(true, '0000', '归档流程实例成功。', null, null));
    });

}


//正常流转方法
/**
 *
 * @param current_detail
 * @param next_detail
 * @param next_node
 * @param proc_inst_id
 * @param resolve
 * @param reject
 * @param proc_define_id
 * @param proc_inst_task_id
 * @param user_code
 * @param current_node
 * @param params
 * @param biz_vars
 * @param prev_node
 * @param prev_user
 * @param proc_vars
 * @param memo
 * @returns {Promise<void>}
 *
 * @desc 用于正常流转，非fork 非chat 等特殊流转
 */
async function normal_process(current_detail,next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params,biz_vars,prev_node,prev_user,proc_vars,memo) {
    var proc_cur_task = next_detail.item_code;
    var proc_inst_node_vars = next_detail.item_node_var;
    var proc_cur_task_name = next_node.name;
    var proc_cur_user;
    if (next_detail.item_assignee_type == 1) {
        proc_cur_user = next_detail.item_assignee_user;
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
    await model.$ProcessInst.update(conditions, update, options);
    var conditions_original={"_id":proc_inst_task_id}
    var data_original={};
    data_original.proc_inst_task_complete_time=new Date();
    data_original.proc_inst_task_status=1
    data_original.proc_inst_task_assignee=user_code;
    data_original.proc_inst_task_remark = memo;
    data_original.proc_back = 0;
    var update_original={$set:data_original}
    await model.$ProcessInstTask.update(conditions_original, update_original, options);
    // let rest=await touchNode(current_detail,user_code,proc_inst_task_id,false);
    // if(rest.success){resolve(rest);return ;}
    let r=await model.$ProcessInstTask.find({'_id':proc_inst_task_id});
    if(!r.length){NoFound(resolve);return ;}
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
    var publish_status = r[0].publish_status;
    var work_order_number   = r[0].work_order_number;
    let results=await model.$ProcessTaskHistroy.create(arr_c);
    //建立下一步流程任务
    //查找下一步执行人的角色或者参入人 等等信息
    let rs=await nodeAnalysisService.findNextHandler(user_code,proc_define_id,current_node,params,proc_inst_id);
    if(!rs.success){resolve(rs);return ;}
    let result_t=await nodeAnalysisService.findParams(proc_inst_id,current_node);
    var org=rs.data;
    var proc_inst_task_params=result_t.data;
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
    condition_task.proc_inst_task_user_org=org.user_org_id;


    if(org.proc_inst_task_assignee) {
        condition_task.proc_inst_task_assignee = org.proc_inst_task_assignee;
    }
    if(org.proc_inst_task_assignee_name){
        condition_task.proc_inst_task_assignee_name=org.proc_inst_task_assignee_name;
    }
           // resolve(ergodic(r,condition_task,proc_cur_task,next_detail,proc_inst_task_params,proc_inst_node_vars,biz_vars,proc_code,proc_name));
    async function loop () {
        if (params && 'undefined' != params.flag && !params.flag) {
            let step_first = await  model.$ProcessInstTask.find({
                'proc_inst_id': r[0].proc_inst_id,
                'proc_inst_task_code': proc_cur_task

            });
            condition_task.next_name = step_first[0].next_name;
            condition_task.proc_back = 1;
            condition_task.joinup_sys = step_first[0].joinup_sys;//工单所属编号
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
            condition_task.next_name = r[0].next_name;
            condition_task.proc_back = 1;
            condition_task.joinup_sys = r[0].joinup_sys;//工单所属编号
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

    loop().then(async function(res) {
        var arr = [];
        condition_task.proc_code = proc_code;//流程编码
        condition_task.proc_name = proc_name;//流程名称
        condition_task.proc_task_start_user_role_names = role_name;//流程发起人角色
        condition_task.proc_task_start_user_role_code = role_code;//流程发起人id
        condition_task.proc_task_start_name = name;//流程发起人角色
        condition_task.publish_status = publish_status;
        condition_task.work_order_number = work_order_number;
        arr.push(condition_task);
        //创建新流转任务
        let rs = await model.$ProcessInstTask.create(arr);
        //如果是发短信,目前库的user_no即电话号码，所以直接使用user_no
        if (condition_task.proc_inst_task_assignee && condition_task.proc_inst_task_sms == '1') {
            var process_utils = require('../../../utils/process_util');
            var mobile = condition_task.proc_inst_task_assignee;
            var params = {
                "procName": proc_name,
                "orderNo": condition_task.proc_inst_id
            }
            process_utils.sendSMS(mobile, params, "SMS_TEMPLET_ORDER").then(function (rs) {
                console.log("短信发送成功");
            }).catch(function (err) {
                console.log("短信发送失败", err);
            });
        }

        resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常。', rs, null));
    });

}

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
 * @desc 用于指派流转任务
 */
exports.assign_transfer=function(proc_task_id,node_code,user_code,assign_user_code,proc_title,biz_vars,proc_vars,memo,next_name,proc_back){
   return new  Promise(async function(resolve,reject){
       let rs= await  model.$ProcessInstTask.find({"_id":proc_task_id});
       if(!rs.length){NoFound(resolve);return ;}
       var proc_inst_id= rs[0].proc_inst_id;
       let res=await model.$ProcessInst.find({"_id":proc_inst_id});
       if(!res.length){NoFound(resolve);return ;}
       var prev_node = rs[0].proc_inst_task_code;
       var proc_code=res[0].proc_code;
       var proc_name=res[0].proc_name;
       var inst_id=res[0]._id;
       var prev_user = res[0].proc_cur_user;
       var proc_define = JSON.parse(res[0].proc_define);
       var item_config = JSON.parse(res[0].item_config);
       var nodes = proc_define.nodes
       var next_node = nodes[node_code];
       var current_node=nodes[prev_node];
       var next_detail, current_detail;
       for (var item in  item_config) {
           if (item_config[item].item_code == prev_node) {
               current_detail = item_config[item];
           }
           if(item_config[item].item_code == node_code){
               next_detail=item_config[item];
           }
       }
       if (!prev_user) {
           prev_user = user_code;
       }
       //是否短信通知
       var item_sm_warn=next_detail.item_sms_warn;
       if(!next_detail||!current_detail){
           resolve(utils.returnMsg(false, '1010', '节点信息异常', null));
           return;
       }
       var proc_inst_node_vars = next_detail.item_node_var;
       var proc_cur_user;
       if (current_detail.item_assignee_type == 1) {
           proc_cur_user = current_detail.item_assignee_user;
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
       await model.$ProcessInst.update(conditions, update, options);
       var condition = {"_id": proc_task_id}
       var datas = {};
       datas.proc_inst_task_complete_time = new Date();
       datas.proc_inst_task_status = 1;
       datas.proc_inst_task_assignee = user_code;
       datas.proc_inst_task_remark = memo;
       datas.next_name = next_name;
       if(proc_back=='1'){
           datas.proc_back = proc_back;
       }else{
           datas.proc_back = 0;
       }
       var updates = {$set: datas};
       await model.$ProcessInstTask.update(condition, updates, options);
       let r = await model.$ProcessInstTask.find({"_id": proc_task_id});
       if(!r.length){NoFound(resolve);return ;}
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
       var joinup_sys = r[0].joinup_sys;//工单所属系统编号
       var proc_back = 0;
       var previous_step  = proc_task_id;
       var publish_status = r[0].publish_status;
       var work_order_number = r[0].work_order_number;
       var proc_task_ver = r[0].proc_task_ver;
       await model.$ProcessTaskHistroy.create(arr_c);
       let rs_s=await touchNode(current_detail, user_code, proc_task_id, false);
       if (!rs_s.success) {resolve(rs_s);return ;}
       let resultss=await model_user.$User.find({"user_no": assign_user_code});
       if(!resultss.length){NoFound(resolve);return ;}
       var user_org = resultss[0].user_org;
       var user_name = resultss[0].user_name;
       var user_roles = resultss[0].user_roles;
       let result_t=await nodeAnalysisService.findParams(proc_inst_id, node_code);
       var proc_inst_task_params = result_t.data;
       //创建下一步流转任务
       var condition_task = {};
       condition_task.proc_task_ver = proc_task_ver;
       condition_task.publish_status =publish_status;
       condition_task.work_order_number = work_order_number;
       condition_task.proc_inst_id = proc_inst_id;//: {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
       condition_task.proc_inst_task_code = next_detail.item_code;// : String,// 流程当前节点编码(流程任务编号)
       condition_task.proc_inst_task_name = next_node.name;//: String,// 流程当前节点名称(任务名称)
       condition_task.proc_inst_task_type = next_node.name;//: String,// 流程当前节点类型(任务类型)
       condition_task.proc_inst_task_arrive_time = new Date();//,// 流程到达时间
       condition_task.proc_inst_task_handle_time = new Date();//,// 流程认领时间
       condition_task.proc_inst_task_complete_time = "";// : Date,// 流程完成时间
       condition_task.proc_inst_task_status = 0;// : Number,// 流程当前状态 0-未处理，1-已完成，2-拒绝
       condition_task.proc_inst_task_assignee_name = user_name;//: String,// 流程处理人名
       condition_task.proc_inst_task_user_role = user_roles;// : String,// 流程处理用户角色ID
       condition_task.proc_inst_task_user_org = user_org;
       condition_task.proc_inst_task_title = proc_title;
       condition_task.proc_inst_biz_vars = biz_vars;
       condition_task.proc_inst_prev_node_code = prev_node;
       condition_task.proc_inst_prev_node_handler_user = prev_user;
       condition_task.proc_inst_node_vars = proc_inst_node_vars;
       if(proc_vars){
           condition_task.proc_vars=proc_vars;
       }
       condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
       condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
       condition_task.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)
       condition_task.proc_inst_task_sms =item_sm_warn;// Number,// 流程是否短信提醒
       condition_task.proc_inst_task_remark = "";// : String// 流程处理意见
       condition_task.proc_inst_task_assignee = assign_user_code;
       condition_task.proc_task_start_user_role_names = role_name;//流程发起人角色
       condition_task.proc_task_start_user_role_code = role_code;//流程发起人id
       condition_task.proc_task_start_name = name;//流程发起人姓名
       condition_task.proc_name=proc_name;
       condition_task.proc_code=proc_code;
       condition_task.joinup_sys = joinup_sys;//工单所属系统编号
       condition_task.next_name = '';
       condition_task.proc_back = proc_back;
       condition_task.previous_step = previous_step;
       var arr = [];
       arr.push(condition_task);
       //创建新流转任务
       let result =  await model.$ProcessInstTask.create(arr[0]);
       if(!result){NoFound(resolve);return ;};
       //如果是发短信
       if(rs && item_sm_warn=='1' && resultss[0].user_phone){
           var process_utils = require('../../../utils/process_util');
           var mobile=resultss[0].user_phone;
           var params= {
               "procName":proc_name,
               "orderNo":inst_id
           }
           await process_utils.sendSMS(mobile,params,"SMS_TEMPLET_ORDER").then(function(rs){
               console.log("短信发送成功");
           }).catch(function(err){
               console.log("短信发送失败",err);
           });
       }
       var conditions = {_id: result.proc_inst_id};
       var data = {};
       data.proc_cur_task = next_detail.item_code;
       data.proc_cur_task_name = next_node.name;
       var update = {$set: data};
       var options = {};
       await model.$ProcessInst.update(conditions,update,options);
       let res_s=await touchNode(next_detail,user_code,proc_task_id,true);
       //resolve(res_s);
       resolve({'success': true, 'code': '0000', 'msg': '任务流转正常','data':result});
   });
}
/**
 *
 * @param inst_id
 * @param user_no
 * @param page
 * @param size
 * @returns {bluebird}
 * @desc 用于查找历史记录
 */
exports.find_log=function(inst_id,user_no,page, size){
    return new Promise(async function(resolve,reject){
        var cd={};
        if(inst_id){
            cd._id=inst_id;
        }
        let res=await model.$ProcessInst.find(cd);
        if(!res.length){NoFound(resolve);return ;}

        var mod = model.$ProcessInstTask;
        var conditionMap = {};
        conditionMap.proc_inst_id = inst_id;
        if(res[0]._doc.proc_inst_status == '4') {//实例归档
            mod = model.$ProcessTaskHistroy;
        }
        if(user_no){
            conditionMap.proc_inst_task_assignee = user_no;
        }
        utils.pagingQuery4Eui(mod, page, size, conditionMap, resolve, '',  {proc_cur_arrive_time:-1});
    });
};


/**
 *
 * @param status
 * @param user_no
 * @param begin_date
 * @param end_date
 * @param page
 * @param size
 * @returns {bluebird}
 *
 * @description 用于查找历史记录
 */
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


/**
 *批量派发
 *
 */

exports.do_payout=function(proc_task_id,node_code,user_code,assign_user_code,proc_title,biz_vars,proc_vars,memo){
    //next_detail, next_node, proc_inst_id, resolve,reject,proc_define_id,proc_inst_task_id,user_code,current_node,params
    return new Promise(async function(resolve,reject){
        let rs=await model.$ProcessInstTask.find({"_id":proc_task_id});
        if(!rs.length){NoFound(resolve);return ;}
        var proc_inst_id= rs[0].proc_inst_id;//z在查询出来的任务中获取实例id
        let res=await model.$ProcessInst.find({"_id":proc_inst_id});
        if(!res.length){NoFound(resolve);return ;}
        var prev_node = res[0].proc_cur_task;
        var proc_name=res[0].proc_name;
        var inst_id=res[0]._id;
        var prev_user = res[0].proc_cur_user;
        var proc_define = JSON.parse(res[0].proc_define);
        var item_config = JSON.parse(res[0].item_config);
        var nodes = proc_define.nodes
        var next_node = nodes[node_code];
        var current_node=nodes[prev_node];
        var next_detail, current_detail;
        for (var item in  item_config) {
            if (item_config[item].item_code == prev_node) {
                current_detail = item_config[item];
            }
            if(item_config[item].item_code == node_code){
                next_detail=item_config[item];
            }
        }
        if (!prev_user) {
            prev_user = user_code;
        }
        var proc_inst_node_vars = next_detail.item_node_var;
        //是否短信通知
        var item_sm_warn=next_detail.item_sms_warn;
        var proc_cur_user;
        if (current_detail.item_assignee_type == 1) {
            proc_cur_user = current_detail.item_assignee_user;
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
        await model.$ProcessInst.update(conditions, update, options);
        var condition = {"_id": proc_task_id}
        var datas = {};
        datas.proc_inst_task_complete_time = new Date();
        datas.proc_inst_task_status = 1;
        datas.proc_inst_task_assignee = user_code;
        datas.proc_inst_task_remark = memo;
        var updates = {$set: datas};
        await model.$ProcessInstTask.update(condition, updates, options);
        let r= await model.$ProcessInstTask.find({"_id": proc_task_id});
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
        var joinup_sys = r[0].joinup_sys;//工单所属系统编号
        var proc_back = r[0].proc_back;
        var previous_step = proc_task_id;
        var publish_status = r[0].publish_status;
        var work_order_number = r[0].work_order_number;
        var proc_task_ver = r[0].proc_task_ver;
        await model.$ProcessTaskHistroy.create(arr_c);
        let rs_s=await touchNode(current_detail, user_code, proc_task_id, false);
        if(!rs_s.success){resolve(rs_s);return ;}
        //循环给下一节点处理人派发任务
        var taskid = '';
        async function round_task() {
            var users = [];
            users = assign_user_code.split(',');
            for (var i = 0; i < users.length; i++) {
                var user_no = users[i];
                let resultss = await  model_user.$User.find({"user_no": user_no});
                if (!resultss.length) {
                    NoFound(resolve);
                    return;
                }
                var user_org = resultss[0].user_org;
                var user_name = resultss[0].user_name;
                var user_roles = resultss[0].user_roles;
                //获取流程定义
                let result_t = await nodeAnalysisService.findParams(proc_inst_id, node_code);
                var proc_inst_task_params = result_t.data;
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
                condition_task.proc_inst_task_assignee_name = user_name;//: String,// 流程处理人名
                condition_task.proc_inst_task_user_role = user_roles;// : String,// 流程处理用户角色ID
                condition_task.proc_inst_task_user_org = user_org;
                condition_task.proc_inst_task_title = proc_title;
                condition_task.proc_inst_biz_vars = biz_vars;
                condition_task.proc_inst_prev_node_code = prev_node;
                condition_task.proc_inst_prev_node_handler_user = prev_user;
                condition_task.proc_inst_node_vars = proc_inst_node_vars;
                if (proc_vars) {
                    condition_task.proc_vars = proc_vars;
                }
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
                condition_task.proc_name = proc_name;
                condition_task.proc_code = proc_code;
                condition_task.joinup_sys = joinup_sys;//工单所属系统编号
                condition_task.next_name = "";//下一节点处理人姓名
                condition_task.proc_back = proc_back;//是否为回退任务
                condition_task.previous_step = previous_step;//上一节点任务id
                condition_task.publish_status = publish_status;
                condition_task.work_order_number = work_order_number;
                condition_task.proc_task_ver = proc_task_ver;
                //创建新流转任务
                let rs = await model.$ProcessInstTask.create(condition_task);
                taskid = rs._id;
                //如果是发短信
                if (rs && item_sm_warn == '1' && resultss[0].user_phone) {
                    var process_utils = require('../../../utils/process_util');
                    var mobile = resultss[0].user_phone;

                    var params = {
                        "procName": proc_name,
                        "orderNo": inst_id
                    }
                    process_utils.sendSMS(mobile, params, "SMS_TEMPLET_ORDER").then(function (rs) {
                        console.log("短信发送成功");
                    }).catch(function (err) {
                        console.log("短信发送失败", err);
                    });
                }
                let resss = await touchNode(next_detail, user_code, rs._id, true);
                if(!resss.success){
                    resolve(resss);
                }

            }

            res[0].pay_task_id = taskid;
            return res;
        }
        round_task().then(function (res) {
            //将任务信息返回给调用接口方
            resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常81111。', res, null));
        }).catch(function (err) {
            console.log(err);
        });
    });

};


/**
 *针对稽核流程分公司人处理自己的任务
 * @param task_id 任务id
 * @param memo 处理内容
 */

exports.interim_completeTask= function(taskId,memo) {
    return new Promise(async function(resolve,reject){
        var udata = {
            proc_inst_task_status:1,
            proc_inst_task_complete_time : new Date(),
            proc_inst_task_remark : memo
        }
        var update = {$set: udata};
        var options = {};
        //根据任务id更新需要完成的任务状态
        await model.$ProcessInstTask.update({'_id':taskId}, update, options);
        let r= await model.$ProcessInstTask.find({'_id':taskId});
        if(!r.length){NoFound(resolve);return ;}
        //将任务id赋值给历史表中的任务id
        var obj=new Object(r[0]._doc)
        obj.proc_task_id=obj._id;
        delete obj._id;
        var arr_c=[];
        arr_c.push(obj)
        //在任务历史表中创建已完成的任务
        await model.$ProcessTaskHistroy.create(arr_c);
        resolve({'success': true, 'code': '0000', 'msg': '完成任务成功','data':r[0]._doc});
    });
};

/*
根据流程编码查询流程信息
 */
exports.process_infomation=function(proc_code){
   return new Promise(async function(resolve,reject){
        //根据流程编码查询流程信息
        let result=await model.$ProcessBase.find({'proc_code':proc_code});
        if(!result.length){NoFound(resolve);return ;}
        resolve({'success': true, 'code': '0000', 'msg': '查询流程信息成功','data':result});
    });
};


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
exports.assigntransfer=function(proc_task_id,node_code,user_code,assign_user_code,proc_title,biz_vars,proc_vars,memo){
    return new  Promise(async function(resolve,reject){
        let rs=await model.$ProcessInstTask.find({"_id":proc_task_id});
        if(!rs.length){NoFound(resolve);return ;}
        var proc_inst_id= rs[0].proc_inst_id;
        let res=await model.$ProcessInst.find({"_id":proc_inst_id});
        if(!res.length) {NoFound(resolve);return ;}
        var prev_node = res[0].proc_cur_task;
        var inst_id=res[0]._id;
        var prev_user = res[0].proc_cur_user;
        var proc_define = JSON.parse(res[0].proc_define);
        var item_config = JSON.parse(res[0].item_config);
        var nodes = proc_define.nodes
        var next_node = nodes[node_code];
        var next_detail, current_detail;
        for (var item in  item_config) {
            if (item_config[item].item_code == prev_node) {
                current_detail = item_config[item];
            }
            if(item_config[item].item_code == node_code){
                next_detail=item_config[item];
            }
        }
        if (!prev_user) {
            prev_user = user_code;
        }
        //是否短信通知
        var item_sm_warn=next_detail.item_sms_warn;
        if(!next_detail||!current_detail){
            resolve(utils.returnMsg(false, '1010', '节点信息异常', null));
            return;
        }
        var proc_inst_node_vars = next_detail.item_node_var;
        var skip = next_detail.item_jump;
        var proc_cur_user;
        if (current_detail.item_assignee_type == 1) {
            proc_cur_user = current_detail.item_assignee_user;
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
        await model.$ProcessInst.update(conditions, update, options);
        var condition = {"_id": proc_task_id}
        var datas = {};
        datas.proc_inst_task_complete_time = new Date();
        datas.proc_inst_task_status = 1;
        datas.proc_inst_task_assignee = user_code;
        datas.proc_inst_task_remark = memo;
        var updates = {$set: datas};
        await model.$ProcessInstTask.update(condition, updates, options);
        let r=await  model.$ProcessInstTask.find({"_id": proc_task_id});
        if(!r.length){NoFound(resolve);return ;}
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
        var joinup_sys = r[0].joinup_sys;//工单所属系统编号
        await model.$ProcessTaskHistroy.create(arr_c);
        let rs_s=await touchNode(current_detail, user_code, proc_task_id, false);
        if(!rs_s.success){resolve(rs_s);return ;}
        let resultss=await model_user.$User.find({"user_no": assign_user_code});
        if (!resultss.length) {NoFound(resolve);return ;}
        var user_org = resultss[0].user_org;
        var user_name = resultss[0].user_name;
        var user_roles = resultss[0].user_roles;
        let result_t=await nodeAnalysisService.findParams(proc_inst_id, node_code);
        var proc_inst_task_params = result_t.data;
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
        condition_task.proc_inst_task_assignee_name = user_name;//: String,// 流程处理人名
        condition_task.proc_inst_task_user_role = user_roles;// : String,// 流程处理用户角色ID
        condition_task.proc_inst_task_user_org = user_org;
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
        condition_task.proc_inst_task_params = proc_inst_task_params;// : String,// 流程参数(任务参数)
        condition_task.proc_inst_task_claim = "";//: Number,// 流程会签
        condition_task.proc_inst_task_sign = 1;// : Number,// 流程签收(0-未认领，1-已认领)
        condition_task.proc_inst_task_sms =item_sm_warn;// Number,// 流程是否短信提醒
        condition_task.proc_inst_task_remark = "";// : String// 流程处理意见
        condition_task.proc_inst_task_assignee = assign_user_code;
        condition_task.proc_task_start_user_role_names = role_name;//流程发起人角色
        condition_task.proc_task_start_user_role_code = role_code;//流程发起人id
        condition_task.proc_task_start_name = name;//流程发起人姓名
        condition_task.proc_name=proc_name;
        condition_task.proc_code=proc_code;
        condition_task.joinup_sys = joinup_sys;//工单所属系统编号
        condition_task.skip = skip;
        var arr = [];
        arr.push(condition_task);
        //创建新流转任务
        let rs_r=await model.$ProcessInstTask.create(arr);
        if(rs_r && item_sm_warn=='1' && resultss[0].user_phone){
            var process_utils = require('../../../utils/process_util');
            var mobile=resultss[0].user_phone;
            var params= {
                "procName":proc_name,
                "orderNo":inst_id
            }
            process_utils.sendSMS(mobile,params,"SMS_TEMPLET_ORDER").then(function(rs){
                console.log("短信发送成功");
            }).catch(function(err){
                console.log("短信发送失败",err);
            });
        }
        let res_s= await touchNode(next_detail,user_code,rs[0]._id,true);
        if(res_s.success){
            resolve(utils.returnMsg(true, '1000', '流程流转新增任务信息正常82222。', rs_r, null))
        }else{
            resolve(res_s);
        }
    });
}

/**
 * 仅仅 是完成任务
 * @param task_id
 * @param user_no
 */
exports.finish_task=(task_id,user_no)=>{
    return new Promise (async(resolve ,reject )=>{
        let rs=await model.$ProcessInstTask.update({"_id":task_id},{$set:{"item_assignee_user_code":user_no,"proc_inst_task_status":1}});
        resolve({"data":rs,"msg":"update the task ,","code":"00000","success":true});
    })
}
