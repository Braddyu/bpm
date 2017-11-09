/**
 * Created by zhaojing on 2016/8/4.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;

//构造触发事件，访问接口基本属性Schema对象
var commonProcessTouchedInfoSchema = new Schema(
    {
        proc_task_id:String,//task_id
        user_no : String,//,  required: true,index:  true   },//
        opt_time : Date,// 访问时间
        memo : String,// 访问备注
        path_url:String,//类别
        status_code : String,//访问接口返回状态码
        response_info:String//返回信息

    },
    {collection: "common_bpm_net_info_visit_base"}// mongodb集合名
);

// 构造触发事件，访问接口基本属性基本属性model
var CommonProcessNetBase = mongoose.model('CommonProcessNetBase', commonProcessTouchedInfoSchema);
exports.$ProcessNetBase = CommonProcessNetBase;

//构造流程基本属性Schema对象
var commonProcessBaseSchema = new Schema(
    {
        proc_code : { type: String, index: { unique: true } },// 流程编码
        proc_name : { type: String,  required: true,index:  true   },// 流程名
        proc_latest_ver : Number,// 流程最后版本号
        opt_time : Date,// 流程创建时间
        memo : String,// 流程备注
        catalog:String,//类别
        engine_version:String,//流程引擎版本
        proc_user : String,// 流程创建人
        status : String//状态
    },
    {collection: "common_bpm_proc_base"}// mongodb集合名
);

// 流程基本属性model
var CommonCoreProcessBase = mongoose.model('CommonCoreProcessBase', commonProcessBaseSchema);
exports.$ProcessBase = CommonCoreProcessBase;

//构造流程定义Schema对象
var commonProcessDefineSchema = new Schema(
    {
        proc_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessBase'}, // 流程基本属性ID
        proc_code : { type: String,  required: true ,index: true },// 流程编码
        proc_name : String,// 流程名
        version : Number,// 流程版本号
        proc_define : String,// 流程定义内容
        memo:String,//备注
        item_config:String,//节点配置
        opt_time : Date,// 流程创建时间
        opt_user : String,// 流程创建人
        status : String//状态
    },
    {collection: "common_bpm_proc_define"}// mongodb集合名
);

// 流程定义model
exports.$ProcessDefine = mongoose.model('CommonCoreProcessDefine', commonProcessDefineSchema);

//构造流程节点配置Schema对象
var commonProcessItemSchema = new Schema(
    {
        proc_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessBase'}, // 流程基本属性ID
        proc_code : String,// 流程编码
        proc_ver : Number,// 流程版本号
        proc_define_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessDefine'},// 流程实例ID
        item_code : String,// 节点编码
        item_type : String,// 节点类型
        item_el : String,// 节点表达式
        item_sms_warn : Number,// 是否短信提醒
        item_sign : String,// 是否会签
        item_assignee_type : Number, // 参与类型
        item_assignee_role : String, // 参与角色(职务)
        item_assignee_role_code : String, // 参与角色编码
        item_assignee_role_name : String, // 参与角色名称
        item_assignee_role_tag : String, // 参与角色标志
        item_assignee_role_level : String, // 参与角色级别
        item_assignee_org_ids : String, // 参与机构id
        item_assignee_org_names : String, // 参与机构名称
        item_assignee_ref_task : String,// 参照人
        item_assignee_ref_type : String,// 参照人类别 1-当前人，2-当前机构
        item_assignee_ref_cur_org : String,// 参照人当前机构
        item_assignee_user : String,// 参与人
        item_assignee_user_name : String,// 参与人姓名
        item_assignee_user_code : String,// 参与人编码
        item_show_text : String,// 显示内容
        item_step_code : String,// 步骤编码
        item_node_var : String,// 节点变量
        item_code_num : String,//节点编号
        item_overtime : String,//超时时间(单位：分钟)
        item_overtime_afterAction_type : Number,//超时后续动作类型
        item_overtime_afterAction_info : String,//超时后续动作内容
        item_touchEvent_type : Number,//触发事件类型
        item_touchEvent_info : String,//触发事件内容
        item_filePath : String,//文件路径
        item_funName : String,//方法名
        item_remark : String//节点备注
    },
    {collection: "common_bpm_proc_item_cfg"}// mongodb集合名
);

// 流程节点配置model
exports.$ProcessItem = mongoose.model('CommonCoreProcessItem', commonProcessItemSchema);

//构造流程实例流转当前信息Schema对象
var commonProcessInstSchema = new Schema(
    {
        proc_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessBase'}, // 流程实例ID
        proc_define_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessDefine'},// 流程图ID
        proc_code : String,// 流程编码
        parent_id: String,// 父节点
        parent_proc_inst_id:String,//父流程实例化ID
        proc_name : { type: String,  required: true ,index: true },// 流程名
        proc_ver : Number,// 流程版本号
        catalog:Number,//流程类别
        proce_reject_params : String,//是否驳回
        proc_instance_code:String,//实例编码
        proc_title :  { type: String,  required: true ,index: true },//流程标题
        proc_cur_task : String,// 流程当前节点编码
        proc_cur_task_name : String,// 流程当前节点名称
        proc_cur_user : String,//{type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},//当前流程处理人ID
        proc_cur_user_name : String,//当前流程处理人名
        proc_cur_arrive_time : Date,//当前流程到达时间
        proc_cur_task_item_conf : String,//当前流程节点配置信息(当前配置阶段编码)
        proc_start_user:String,//流程发起人(开始用户)
        proc_start_user_name : String,// 流程发起人名(开始用户姓名)
        proc_start_time : Date,// 流程发起时间(开始时间)
        proc_params : String,// 流转参数
        proc_inst_status : Number,// 流程流转状态 1 已启用  0 已禁用,2 流转中，3子流程流转中 ,4  归档,5 回退，6 废弃
        proc_attached_type : Number,// 流程附加类型(1:待办业务联系函;2:待办工单;3:待办考核;4:其他待办)
        proce_attached_params : {},// 流程附加属性
        proce_reject_params : {},// 流程驳回附加参数
        proc_cur_task_code_num : String,//节点编号
        proc_task_overtime : [],//超时时间设置
        proc_cur_task_overtime : Date,//当前节点的超时时间
        proc_cur_task_remark : String,//节点备注
        proc_city : String,// 地市
        proc_county : String,// 区县
        proc_org : String, // 组织
        proc_cur_task_overtime_sms : Number,//流程当前节点超时短信标记(1:待处理，2:已处理，3:不需要处理)
        proc_cur_task_overtime_sms_count : Number,//流程当前节点超时短信发送次数
        proc_pending_users : [],//当前流程的待处理人信息
        proc_task_history:String,//处理任务历史记录
        proc_define:String,//流程描述文件
        item_config:String,//流程节点配置信息
        proc_vars:String,//流程变量
        proc_start_user_role_code:[], //流程发起人角色
        proc_start_user_role_names:String, //流程发起人角色
        proc_inst_opt_user:String,//流程实例操作人--回退、废弃操作
        proc_inst_opt_user_name:String,//流程实例操作人姓名
        proc_opt_time:Date,//流程实例操作时间


    },
    {collection: "common_bpm_proc_inst"}// mongodb集合名
);

// 流程流转当前信息model
exports.$ProcessInst = mongoose.model('CommonCoreProcessInst', commonProcessInstSchema);
//构造流程流转信息Schema对象
var commonProcessInstTaskSchema = new Schema(
    {
        proc_inst_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
        proc_inst_task_code : String,// 流程当前节点编码(流程任务编号)
        proc_inst_task_name : String,// 流程当前节点名称(任务名称)
        proc_inst_task_type : String,// 流程当前节点类型(任务类型)
        proc_inst_task_title : String,// 任务标题
        proc_inst_task_arrive_time : Date,// 流程到达时间
        proc_inst_task_handle_time : Date,// 流程认领时间
        proc_inst_task_complete_time : Date,// 流程完成时间
        proc_inst_task_status : Number,// 流程当前状态 0-未处理，1-已完成
        proc_inst_task_assignee : String,// 流程处理人code
        proc_inst_task_assignee_name : String,// 流程处理人名
        proc_inst_task_user_role : String,// 流程处理用户角色ID
        // proc_inst_task_handler_code:String,//实际处理人
        proc_inst_task_user_role_name : String,// 流程处理用户角色名
        proc_inst_task_user_org : String,// 流程处理用户组织ID
        proc_inst_task_user_org_name : String,// 流程处理用户组织名
        proc_inst_task_params : String,// 流程参数(任务参数)
        proc_inst_task_claim : Number,// 流程会签
        proc_inst_task_sign : Number,// 流程签收(0-未认领，1-已认领)
        proc_inst_task_sms : Number,// 流程是否短信提醒
        proc_inst_task_remark : String,// 流程处理意见
        proc_inst_biz_vars : String,// 流程业务实例变量
        proc_inst_node_vars : String,// 流程实例节点变量
        proc_inst_prev_node_code : String,// 流程实例上一处理节点编号
        proc_inst_prev_node_handler_user : String,// 流程实例上一节点处理人编号
        proc_task_start_user_role_names:String,//流程发起人角色
        proc_task_start_user_role_code:[], //流程发起人id
        proc_task_start_name:String,//流程发起人姓名
        proc_vars : String// 流程变量
    },
    {collection: "common_bpm_proc_inst_task"}// mongodb集合名
);

// 流程流转信息model
exports.$ProcessInstTask = mongoose.model('CommonCoreProcessInstTask', commonProcessInstTaskSchema);

//构造流程流转历史信息Schema对象
var commonProcessTaskHistroySchema = new Schema(
    {
        proc_inst_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
        proc_task_id:String,//task_id
        proc_inst_task_code : String,// 流程当前节点编码(流程任务编号)
        proc_inst_task_name : String,// 流程当前节点名称(任务名称)
        proc_inst_task_type : String,// 流程当前节点类型(任务类型)
        proc_inst_task_title : String,// 任务标题
        proc_inst_task_arrive_time : Date,// 流程到达时间
        proc_inst_task_handle_time : Date,// 流程认领时间
        proc_inst_task_complete_time : Date,// 流程完成时间
        proc_inst_task_status : Number,// 流程当前状态 0-未处理，1-已完成
        proc_inst_task_assignee : String,// 流程处理人code
        proc_inst_task_assignee_name : String,// 流程处理人名
        proc_inst_task_user_role : String,// 流程处理用户角色ID
        // proc_inst_task_handler_code:String,//实际处理人
        proc_inst_task_user_role_name : String,// 流程处理用户角色名
        proc_inst_task_user_org : String,// 流程处理用户组织ID
        proc_inst_task_user_org_name : String,// 流程处理用户组织名
        proc_inst_task_params : String,// 流程参数(任务参数)
        proc_inst_task_claim : Number,// 流程会签
        proc_inst_task_sign : Number,// 流程签收(0-未认领，1-已认领)
        proc_inst_task_sms : Number,// 流程是否短信提醒
        proc_inst_task_remark : String,// 流程处理意见
        proc_inst_biz_vars : String,// 流程业务实例变量
        proc_inst_node_vars : String,// 流程实例节点变量
        proc_inst_prev_node_code : String,// 流程实例上一处理节点编号
        proc_inst_prev_node_handler_user : String,// 流程实例上一节点处理人编号
        proc_task_start_user_role_names:String,//流程发起人角色
        proc_task_start_user_role_code:[], //流程发起人id
        proc_task_start_name:String,//流程发起人姓名
        proc_vars : String,// 流程变量
    },
    {collection: "common_bpm_proc_task_histroy"}// mongodb集合名
);

// 流程流转历史信息model
exports.$ProcessTaskHistroy = mongoose.model('CommonCoreProcessTaskHistroy', commonProcessTaskHistroySchema);
//构造流程流转历史信息Schema对象
// var commonProcessInstTaskHistroySchema = new Schema(
//     {
//             proc_inst_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
//             proc_inst_task_code : String,// 流程当前节点编码(流程任务编号)
//             proc_inst_task_name : String,// 流程当前节点名称(任务名称)
//             proc_inst_task_type : String,// 流程当前节点类型(任务类型)
//             proc_inst_task_arrive_time : Date,// 流程到达时间
//             proc_inst_task_handle_time : Date,// 流程认领时间
//             proc_inst_task_complete_time : Date,// 流程完成时间
//             proc_inst_task_status : Number,// 流程当前状态
//             proc_inst_task_assignee : String,// 流程处理人ID
//             proc_inst_task_assignee_name : String,// 流程处理人名
//             proc_inst_task_params : String,// 流程参数(任务参数)
//             proc_inst_task_claim : Number,// 流程会签
//             proc_inst_task_sign : Number,// 流程签收(0-未认领，1-已认领)
//             proc_inst_task_sms : Number,// 流程是否短信提醒
//             proc_inst_task_remark : String// 流程处理意见
//     },
//     {collection: "common_bpm_proc_inst_task_histroy"}// mongodb集合名
// );
//
// // 流程流转历史信息model
// exports.$ProcessInstTaskHistroy = mongoose.model('CommonCoreProcessInstTaskHistroy', commonProcessInstTaskHistroySchema);
