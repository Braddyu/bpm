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
        parent_proc_inst_id:String,//父流程实例化ID
        proc_name : String,// 流程名
        proc_ver : Number,// 流程版本号
        proc_title :  { type: String,  required: true ,index: true },//流程标题
        proc_cur_task_item_conf : String,//当前流程节点配置信息(当前配置阶段编码)
        dtafts_user:String,//草稿箱用户
        dtafts_user_name : String,// 草稿箱用户名称
        dtafts_create_time : Date,// 草稿箱创建时间
        proc_content : String,// 流程派单内容
        proc_work_day : Number,//工作天数
        dtafts_attachment_id:String, //附件id

    },
    {collection: "common_bpm_proc_drafts"}// mongodb集合名
);

// 草稿箱model
exports.$ProcessDreafts = mongoose.model('CommonCoreProcessDreafts', commonProcessDraftsSchema);
