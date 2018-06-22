/**
 * 草稿箱
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;

//构造流程实例流转当前信息Schema对象
var commonProcessDraftsSchema = new Schema(
    {

        proc_code : String,// 流程编码
        proc_name : { type: String,  required: true ,index: true },// 流程名
        proc_ver : Number,// 流程版本号
        catalog:Number,//流程类别
        proc_title :  { type: String,  required: true ,index: true },//流程标题
        proc_cur_user : String,//创建人
        proc_cur_user_name : String,//创建人姓名
        proc_cur_arrive_time : Date,//当前流程到达时间
        proc_cur_task_item_conf : String,//当前流程节点配置信息(当前配置阶段编码)
        proc_start_user:String,//流程发起人(开始用户)
        proc_start_user_name : String,// 流程发起人名(开始用户姓名)
        proc_create_time : Date,// 草稿箱创建时间
        proc_content : String,// 流程派单内容
        proc_work_day : Number,//工作天数
        proc_start_user_role_code:[], //流程发起人角色
        proc_start_user_role_names:String, //流程发起人角色
        dtafts_attachment_id:String, //附件id

    },
    {collection: "common_bpm_proc_drafts"}// mongodb集合名
);

// 草稿箱model
exports.$ProcessDreafts = mongoose.model('CommonCoreProcessDreafts', commonProcessDraftsSchema);
