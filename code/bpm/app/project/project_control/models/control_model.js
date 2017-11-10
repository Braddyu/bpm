/**
 * Created by zhaojing on 2016/3/30.
 */
// 引入mongoose工具类
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",true);

Promise = require("bluebird");

mongoose.Promise=Promise;

var Schema = mongoose.Schema;