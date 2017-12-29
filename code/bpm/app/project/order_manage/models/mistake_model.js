/**
 * 差错工单
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;

//构造流程实例流转当前信息Schema对象
var commonCoreProcessMistake = new Schema(
    {
        mistake_time : String,// 时间
        BOSS_NUM : String,// BOSS订单编码
        city_code : String,// 地市编码
        country_code : String,// 区县编码
        staff_num : String,// 营业员工号
        channel_type:String,//渠道类型
        channel_org :  String,//渠道组织
        business_num : String,//业务编码
        business_name : String,//业务名称
        check_status : String,//稽核状态
        remark : String,//稽核说明
        status:Number,//派单状态0:未派单 1:已派单 -1:派单失败
        dispatch_remark:String//派单结果

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
        status:Number,//派单状态0表示：正在派单中。1表示：派单全部成功。2表示：派单部分成功。3表示：派单全部失败。
        dispatch_remark:String//派单描述

    },
    {collection: "common_bpm_mistake_logs"}// mongodb集合名
);

// 差错工单日志model
exports.$ProcessMistakeLogs = mongoose.model('CommonCoreProcessMistakeLogs', commonCoreProcessMistakeLogs);
