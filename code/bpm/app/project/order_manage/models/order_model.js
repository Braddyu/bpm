

var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;


var  applicationDetail= new Schema(
    {
        application_code:{type: String},//业务编码
        proc_inst_id:{type: String},//实例化ID
        proc_base_code:{type: String},
        proc_base_name:{type: String},//所属流程名称
        proc_base_ver:{type:String},
        node_code:{type:String},//节点编号
        node_name:{type:String},//节点名称
        application_create_user_no:{type: String,required: true},//申请用户Code
        application_create_user_name:{type: String,required: true},//申请用户名称
        application_code:{type: String,required: true}, //编码
        application_title:{type: String,required: true}, //标题
        application_dapartment:{type: String},//申请人单位
        application_status:{type: Number,required: true},//申请状态 0:保存状态 1：正常流转中 2：归档结束
        application_content_desciption:{type: String,required: true}, //申请描述
        start_date:{type: String,required: true},//申请开始时间
        end_time:{type: Date},//申请结束时间
    },
    {collection: "bunisses_application_detaill" }// mongodb集合名
);

// 流程基本属性model
var bunisses_application_detaill = mongoose.model('bunisses_application_detaill', applicationDetail);

exports.$applicationDetail = bunisses_application_detaill;

var applicationHandlerDetail=new Schema({
   application_detail_id:{type: Schema.Types.ObjectId, ref: 'bunisses_application_detaill'},//application_detail表的ID
    next_node_handler_user_no:{type:String},//下一节点处理人名称
    next_node_handler_user_name:{type:String},//下一节点处理人名称
    next_node_code:{type:String},//下一节点编号
    next_node_name:{type:String},//下一节点名称
   proc_task_id:{type:String},//流程任务Id
   handler_node_code:{type:String},//处理节点编号
    handler_node_name:{type:String},//处理节点名称
   application_handler_user_no:{type: String},//当前申请处理人
   application_handler_user_name:{type: String},//当前申请处理人姓名
    application_handler_date:{type: Date},//处理日期
    application_handler_content:{type: String}//处理内容

},{collection: "bunisses_application_handler_detaill" }// mongodb集合名
);
var bunisses_application_handler_detaill = mongoose.model('bunisses_application_handler_detaill', applicationHandlerDetail);

exports.$applicationHandlerDetail = bunisses_application_handler_detaill;

var applicationAttachmentDetail=new Schema({
        application_detail_id:{type: String },//application_detail表的ID
        bunisses_application_handler_detaill_id:{type:String},//applicationHandlerDetail表的ID
        attachment_type:{type: String},//附件类型
        attachment_address:{type: String},//附件存放地址
        attachment_content:{type: String},//附件内容
        attachment_name:{type: String},//附件名称
        attachment_date:{type: Date}//附件存放日期
    },{collection: "bunisses_application_attachment_detaill" }// mongodb集合名
);
var bunisses_application_attachment_detaill = mongoose.model('bunisses_application_attachment_detaill', applicationAttachmentDetail);

exports.$applicationAttachmentDetail = bunisses_application_attachment_detaill;


