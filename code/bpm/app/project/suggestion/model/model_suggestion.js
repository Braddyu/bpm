
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;
mongoose.Promise=Promise;

var commonProcessDraftsAdvice = new Schema(
    {
        user_name:String,//用户名
        user_org:String,//机构
        user_tel:String,//用户电话号码
        suggestion_title:String,//标题
        create_date:Date,//插入日期
        suggestion_contents:String,//类容
        handle_status:Number,//意见状态,1已处理，0未处理
        handler_name:String,//处理人
        handle_date:Date,//处理时间
        handle_contents:String//处理意见
    },
    {collection: "common_bpm_avice_info"}// mongodb集合名
);

//意见model
exports.$AdviceFeedback = mongoose.model('commonProcessDraftsAdvice', commonProcessDraftsAdvice);