/**
 *
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",false)
var Schema = mongoose.Schema;

//历史数据一
var commonBpmWf3JobAllt = new Schema(
    {
        _id:String,
        job_id : String,
        origin_sys : Number,
        title : String,
        class_id : Number,
        sclass_id : Number,
        initiator : Number,
        initiator_role : Number,
        reg_date : Date,
        mod_date : Date,
        happen_date : Date,
        startdate : Date,
        workcount_minutes : String,
        daycount : String,
        finish_date : Date,
        solvedate : Date,
        time_unit : Number,
        job_state : Number,
        initiator_system : Number,
        version : Number,
        created : Date,
        last_upd : Date,
        created_by : Number,
        job_time: Number,
        pre_step: Number,
        pre_action : Number,
        pre_status : Number,
        pre_caller : Number,
        pre_callerrole : Number,
        pre_startdate : Date,
        pre_daycount :String,
        pre_finishdate : Date,
        pre_solvemeth : String,
        pre_solvedate : Date,
        cur_startdate : Date,
        cur_daycount : String,
        cur_finishdate : Date,
        cur_solvemeth: String,
        cur_solvedate : Date,
        cur_status : Number,
        cur_step : Number,
        cur_action : Number,
        caller : Number,
        caller_role : Number,
        cur_timeout : Number,
        task_id : Number,
        seq : Number,
        task_state : Number,
        caller_name : String,
        initiator_name : String,
        last_solvedate : Date,
        finish_flag :String,
        job_timeout : String,

    },
    {collection: "common_bpm_wf3_job_all_t"}// mongodb集合名
);
exports.$CommonBpmWf3JobAllt = mongoose.model('commonBpmWf3JobAllt', commonBpmWf3JobAllt);




//历史数据二
var commonBpmWfJobStep = new Schema(
    {
        name : String,
        sclass_id : Number,
        seq : Number,
        created_by : Number,
        created : Date,
        status : String,
        last_upd_by : Number,

    },
    {collection: "common_bpm_wf_job_step"}// mongodb集合名
);
exports.$CommonBpmWfJobStep = mongoose.model('commonBpmWfJobStep', commonBpmWfJobStep);


//历史数据三
var commonBpmWfJobStatus = new Schema(
    {
        ID : Number,
        NAME : String,
        SCLASS_ID : Number,
        SEQ : Number,
        LAST_UPD_BY : Number,
        STATUS : String,
        CREATED : Date,
        CREATED_BY: Number,

    },
    {collection: "common_bpm_wf_job_status"}// mongodb集合名
);
exports.$commonBpmWfJobStatus = mongoose.model('commonBpmWfJobStatus', commonBpmWfJobStatus);


//历史数据四
var commonBpmWf3JobSclass = new Schema(
    {
        ID : Number,
        NAME : String,
        SCLASS_ID : Number,
        SEQ : Number,
        LAST_UPD_BY : Number,
        STATUS : String,
        CREATED : Date,
        CREATED_BY: Number,

    },
    {collection: "common_bpm_wf3_job_sclass"}// mongodb集合名
);
exports.$CommonBpmWf3JobSclass = mongoose.model('commonBpmWf3JobSclass', commonBpmWf3JobSclass);

//历史数据五
var commonBpmWmUser = new Schema(
    {
        ID : Number,
        NAME : String,
        SCLASS_ID : Number,
        SEQ : Number,
        LAST_UPD_BY : Number,
        STATUS : String,
        CREATED : Date,
        CREATED_BY: Number,

    },
    {collection: "common_bpm_wm_user"}// mongodb集合名
);
exports.$CommonBpmWmUser = mongoose.model('commonBpmWmUser', commonBpmWmUser);
