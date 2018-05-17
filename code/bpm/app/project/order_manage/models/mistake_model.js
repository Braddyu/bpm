/**
 * 差错工单
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",true);
var Schema = mongoose.Schema;

//构造流程实例流转当前信息Schema对象
var commonCoreProcessMistake = new Schema(
    {
        mistake_time : String,// 时间
        BOSS_CODE : String,// BOSS订单编码
        city_code : String,// 地市编码
        country_code : String,// 区县编码
        salesperson_code : String,// 营业员工号
        customer_code:String,//客户单号
        org:String,//机构
        channel_code :  String,//渠道组织
        channel_id : String,//渠道id
        business_code : String,//业务编码
        business_name : String,//业务名称
        check_status : String,//稽核状态
        remark : String,//稽核说明
        proc_inst_id: Schema.Types.ObjectId,//实例编码
        status:Number,//派单状态,-2:派单失败-1:派单失败，0:未派单 1:已派单 ，2：回传失败 3：回传成功，4：表示黄河复核工单
        insert_time:Date,
        dispatch_remark:String//派单说明

    },
    {collection: "common_bpm_mistake"}// mongodb集合名
);

// 差错工单model
exports.$ProcessMistake = mongoose.model('CommonCoreProcessMistake', commonCoreProcessMistake);


var commonCoreProcessMistakeLogs = new Schema(
    {
        proc_code : String,// 流程编码
        proc_name : String,// 流程名称
        dispatch_time : String,// 派单时间
        create_user_no : String,// 创建者编号
        create_user_name : String,// 创建者姓名
        create_time:Date,//创建时间
        update_user_no :  String,//修改者工号
        status:Number,//派单状态0表示：正在派单中。1表示：派单全部成功。11，表示黄河稽核通过的数据派单成功，2表示：派单部分成功。3表示：派单全部失败。4:复核黄河工单成功，
        dispatch_remark:String,//派单描述
        dispatch_cond_one:String,//派单条件1
        dispatch_cond_two:String,//派单条件2
        dispatch_cond_thr:String,//派单条件3
        dispatch_finish_time:Date//派单结束时间

    },
    {collection: "common_bpm_mistake_logs"}// mongodb集合名
);

// 差错工单日志model
exports.$ProcessMistakeLogs = mongoose.model('CommonCoreProcessMistakeLogs', commonCoreProcessMistakeLogs);

var commonCoreProcessMistakeReadlogs = new Schema(
    {
        //dispatch_time : String,// 派单时间
        insert_time : String,// 插入时间
        file_no : String,// 文件行数
        file_name : String,//文件名
        Success_failure:Number,//是否成功 0表示:失败。1表示：成功
        Remarks :  String,//备注
    },
    {collection: "common_bpm_mistake_logs"}// mongodb集合名
);

// 读取差错工单文件日志model
exports.$ProcessMistakeReadlogs = mongoose.model('CommonCoreProcessMistakeReadlogs', commonCoreProcessMistakeReadlogs);


var commonFtpCoreProcessMistakeReadlogs = new Schema(
    {
        //dispatch_time : String,// 派单时间
        insert_time : String,// 插入时间
        file_no : String,// 文件行数
        file_name : String,//文件名
        Success_failure:Number,//是否成功 0表示:失败。1表示：成功
        Remarks :  String,//备注
    },
    {collection: "common_bpm_ftp_mistake_logs"}// mongodb集合名
);

// 读取ftp差错工单文件日志model
exports.$ProcessFtpMistakeReadlogs = mongoose.model('CommonFtpCoreProcessMistakeReadlogs', commonFtpCoreProcessMistakeReadlogs);