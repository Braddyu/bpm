/**
 * Created by zhaojing on 2016/8/4.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;

//构造工作交接Schema对象
var workTurnOverSchema = new Schema(
    {
        leave_user_id : String,// 移交人员id
        leave_user_account : String,// 移交人员账号
        leave_user_name : String,// 移交人员姓名
        leave_user_tag : Number,// 移交人员内外部标记
        turn_user_id : String,// 接收人员id
        turn_user_account : String,// 接收人员账号
        turn_user_name : String,// 接收人员姓名
        turn_user_tag : Number,// 接收人员内外部标记
        team_id : String,//班组id
        team_code : String,//班组编码
        team_name : String,//班组名称
        org_id : String,// 公司id
        org_code : String,//公司编码
        org_name : String,// 公司名称
        city_code : String,//地市编码
        city_name : String,//地市名称
        area_code : String,//区县编码
        area_name : String,//区县名称
        exp_date : Number,//有效期(天)
        create_time : Date,// 创建时间
        status : Number// 状态(1、待审核;2、审核通过;3、作废)
    },
    {collection: "common_bpm_proc_work_turn_over"}// mongodb集合名
);

// 工作交接model
exports.$WorkTurnOver = mongoose.model('WorkTurnOverSchema', workTurnOverSchema);
