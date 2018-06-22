/**
 * Created by zhaojing on 2016/10/10.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../core/mongodb/mongoose_utils');

var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;

//构造短信Schema对象
var commonSmsSchema = new Schema(
    {
        sms_phone : String,// 手机号
        sms_content : String,// 短信内容
        sms_send_time : Date,// 短信发送时间
        sms_status : Number,// 状态(1:成功；0:失败；2:待发送)
        sms_msg : String,// 短信发送成功与否消息
        sms_type : String,//短信类型(101:工单;102:考核;103:eoms故障工单;104:维护对象未配置;105:工单追回;106:到达拍照工单提醒;201:忘记密码)
        sms_user_id : String,//发送用户id
        sms_user_tag : String,//发送用户类型(1:内部;2:外部)
        sms_server_ip : String,//发送服务器ip
        sms_server_name : String,//发送服务器Name
        sms_client_ip : String,//发送客户端ip
        sms_client_name : String,//发送客户端Name
        sms_send_count : Number,//发送次数
        sms_create_time : Date,// 短信创建时间
    },
    {collection: "common_sms_info"}// mongodb集合名
);

// 短信model
var CommonCoreSms = mongoose.model('CommonCoreSms', commonSmsSchema);
exports.$ = CommonCoreSms;
