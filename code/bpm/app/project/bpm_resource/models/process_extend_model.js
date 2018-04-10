/**
 * Created by youjian on 2017/12/22.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;


//针对预警工单与差错工单的统计model
var commonProcessTaskStatisticsSchema = new Schema(
    {
        proc_inst_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 实例ID
        user_no:String,//所属用户编号
        work_id:String,//用户工号
        user_name:String,//所属用户姓名
        user_phone:String,//所属用户电话
        channel_id:{type: Schema.Types.ObjectId},//渠道ID
        channel_code:String,//渠道编码
        channel_name:String,//渠道名称
        grid_code:String,//网格编码
        grid_name:String,//网格名称
        grid_id:{type: Schema.Types.ObjectId},//网格ID
        county_code:String,//区县编码
        county_name:String,//区县名称
        county_id:{type: Schema.Types.ObjectId},//区县ID
        city_code:String,//地州编码
        city_name:String,//地州名称
        city_id:{type: Schema.Types.ObjectId},//地市ID
        province_id:{type: Schema.Types.ObjectId},//省级ID
        proc_code:String,//流程编码
        dispatch_time:String,//派单时间
        insert_time:Date,//插入时间
    },
    {collection: "common_bpm_proc_task_statistics"}// mongodb集合名
);

// 针对预警工单与差错工单的统计model
exports.$ProcessTaskStatistics = mongoose.model('CommonCoreProcessTaskStatistics', commonProcessTaskStatisticsSchema);


//针对资金稽核工单的统计model
var commonProcessMoneyAuditTaskStatisticsSchema = new Schema(
    {
            proc_inst_id : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 实例ID
            user_no:String,//所属用户编号
            work_id:String,//用户工号
            user_name:String,//所属用户姓名
            user_phone:String,//所属用户电话
            channel_id:{type: Schema.Types.ObjectId},//政企或自营厅ID
            channel_code:String,//政企或自营厅
            channel_name:String,//政企或自营厅名称
            county_code:String,//区县编码
            county_name:String,//区县名称
            county_id:{type: Schema.Types.ObjectId},//区县ID
            city_code:String,//地州编码
            city_name:String,//地州名称
            city_id:{type: Schema.Types.ObjectId},//地市ID
            province_id:{type: Schema.Types.ObjectId},//省级ID
            proc_code:String,//流程编码
            dispatch_time:String,//派单时间
            insert_time:Date,//插入时间
    },
    {collection: "common_bpm_proc_task_moneyaudit_statistics"}// mongodb集合名
);

// 针对预警工单与差错工单的统计model
exports.$ProcessTaskMoneyAuditStatistics = mongoose.model('CommonCoreProcessMoneyAuditTaskStatistics', commonProcessMoneyAuditTaskStatisticsSchema);


//针对文件上传
var commonProcessTaskFileSchema = new Schema(
    {
        proc_inst_id : {type: Schema.Types.ObjectId}, // 实例ID
        proc_task_id : {type: Schema.Types.ObjectId}, // 任务ID
        proc_code:String,//所属流程编码
        proc_name:String,//所属流程
        proc_inst_task_code:String,//所属流程节点
        proc_inst_task_type:String,//所属用户电话
        user_no:String,//文件上传用户编号
        user_name:String,//文件上传人
        file_path:String,//文件路径
        file_name:String,//文件名称
        status:Number,//是否上传，0：未上传，1：已上传，-1：上传失败
        insert_time:Date,//插入时间
    },
    {collection: "common_bpm_proc_task_file"}// mongodb集合名
);

// 针对文件上传
exports.$ProcessTaskFile = mongoose.model('CommonCoreProcessTaskFile', commonProcessTaskFileSchema);