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
        user_name:String,//所属用户姓名
        user_phone:String,//所属用户电话
        channel_id:{type: Schema.Types.ObjectId},//渠道ID
        channel_code:String,//渠道编码
        channel_name:String,//渠道名称
        grid_id:{type: Schema.Types.ObjectId},//网格ID
        county_id:{type: Schema.Types.ObjectId},//区县ID
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