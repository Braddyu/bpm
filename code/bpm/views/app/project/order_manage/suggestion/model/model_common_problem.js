// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;
mongoose.Promise=Promise;

var commonProblem = new Schema(
    {
        suggestion_title:String,//意见标题
        answer:String,//解答
        creator:String,//创建人
        create_time:Date,//创建时间
        update_by:String,// 更新人
        update_time:Date// 更新时间
    },
    {collection: "common_problem_answer"}// mongodb集合名
);

//意见model
exports.$CommonProblem = mongoose.model('commonProblem', commonProblem);