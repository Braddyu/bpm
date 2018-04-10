
var process_extend_model = require('../../bpm_resource/models/process_extend_model');
var user_model = require('../../bpm_resource/models/user_model');
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;
var xlsx = require('node-xlsx');
var moment = require('moment');

/**
 * 工单统计
 * @param org_id 机构id
 * @param proc_code 流程编码
 * @param level  区域等级
 * @param dispatch_time 派单时间
 * @param startDate 插入时间
 * @param endDate 插入时间
 * @returns {Promise}
 */
exports.getStatisticsListPage= function(org_id,proc_code,level,status,startDate,endDate) {

    var p = new Promise(function(resolve,reject){
        let obj_org_id=[];
        let match={};
        let foreignField;
        for(let item in org_id){
            obj_org_id.push(new mongoose.Types.ObjectId(org_id[item]))
        }
        //等级为2表示省公司,
        if(level==2){
            foreignField='province_id';
        } else if(level==3){
            //地市
            foreignField='city_id';
            //地市的编码长度要于等于3
            //match.company_code={"$regex": /^.{1,3}$/}
        } else if(level==4){
            //区县
            foreignField='county_id';
            //区县的编码长度要小于等于4
            //match.company_code={"$regex": /^.{1,4}$/}
        } else if(level==5) {
            //网格
            foreignField = 'channel_id';
            //区县的编码长度要小于等于4
            //match.company_code = {"$regex": /^.{1,8}$/}
        }
        //}else if(level==6){
        //    //渠道
        //    foreignField='channel_id';
        //}
        //状态为1当前用户的所拥有的机构，为0表示下钻
        if(status==1){
            match._id={$in:obj_org_id};
        }else{
            if(level==5){
                match.if_money_audit_org=1
                match.audit_org_pid={$in:org_id};
            }else{
                match.org_pid={$in:org_id};
            }
        }
        console.log("match",match,foreignField);

        //查询统计表
        var statistics={};
        var inst={};
        //流程编码
        if(proc_code){
            statistics['proc_code']=proc_code;
        }

        var compare={};
        //开始时间
        if(startDate){
            compare['$gte']=new Date(startDate);
        }
        //结束时间
        if(endDate){
            //结束时间追加至当天的最后时间
            compare['$lte']=new Date(endDate+' 23:59:59');
        }
        //时间查询
        if(!isEmptyObject(compare)){
            inst['proc_start_time']=compare;
        }

        console.log("statistics",statistics);
        console.log("inst",inst);
        //依机构表为主表，关联统计表和实例表

        user_model.$CommonCoreOrg.aggregate([
            {
                $match: match
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_task_moneyaudit_statistics",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: foreignField,
                    as: "statistics",
                    restrictSearchWithMatch: statistics
                }
            },
          {
                $unwind : { path: "$statistics", preserveNullAndEmptyArrays: true }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_inst",
                    startWith: "$statistics.proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "_id",
                    as: "inst",
                    restrictSearchWithMatch: inst
                }
            },
         /*   {
                $lookup: {
                    from: "common_bpm_proc_inst",
                    localField: 'statistics.proc_inst_id',
                    foreignField: "_id",
                    as: "inst"
                }
            },*/
            {
                $unwind :{ path: "$inst", preserveNullAndEmptyArrays: true }
            },
            {
                $group: {
                    _id: "$_id",
                    org_fullname: {$first: "$org_fullname"},
                    company_code: {$first: "$company_code"},
                    org_id: {$first: "$_id"},
                    total: {
                        $sum: {
                            $cond: {
                                if: {$in: ["$inst.proc_inst_status", [1, 2, 3, 4]]},
                                then: {$sum: 1},
                                else: 0
                            }
                        }
                    },
                    success: {$sum: {$cond: {if: {$in: ["$inst.proc_inst_status", [4]]}, then: {$sum: 1}, else: 0}}},
                    overtime: {
                        $sum: {
                            $cond: {
                                if: {$and: [{$in: ["$inst.is_overtime", [0]]}, {$in: ["$inst.proc_inst_status", [4]]}]},
                                then: {$sum: 1},
                                else: 0
                            }
                        }
                    },
                    one_file: {
                        $sum: {
                            $cond: {
                                if: {$and: [{$in: ["$inst.refuse_number", [0]]}, {$in: ["$inst.proc_inst_status", [4]]}]},
                                then: {$sum: 1},
                                else: 0
                            }
                        }
                    },
                }
            },
            {
                $sort :{ total:-1}
            },
        ]).exec(function(err,res){
            if(err){
                reject(utils.returnMsg(false, '1000', '查询统计失败。',null,err));
            }else{
                var result={rows:res,success:true};
                resolve(result);

            }

        })

    });

    return p;
};


/**
 * 导出工单统计查询结果
 * @param org_id 机构id
 * @param proc_code 流程编码
 * @param level  区域等级
 * @param dispatch_time 派单时间
 * @param startDate 插入时间
 * @param endDate 插入时间
 * @returns {Promise}
 */
exports.exportStatisticsList= function(org_id,proc_code,level,status,startDate,endDate) {

    var p = new Promise(function(resolve,reject){
        let obj_org_id=[];
        for(let item in org_id){
            obj_org_id.push(new mongoose.Types.ObjectId(org_id[item]))
        }

        var match={};
        var foreignField;
        var sort=1;
        //等级为2表示省公司,
        //等级为2表示省公司,
        if(level==2){
            foreignField='province_id';
        } else if(level==3){
            //地市
            foreignField='city_id';
            //地市的编码长度要于等于3
            //match.company_code={"$regex": /^.{1,3}$/}
        } else if(level==4){
            //区县
            foreignField='county_id';
            //区县的编码长度要小于等于4
            //match.company_code={"$regex": /^.{1,4}$/}
        } else if(level==5) {
            //网格
            foreignField = 'channel_id';
            //区县的编码长度要小于等于4
            //match.company_code = {"$regex": /^.{1,8}$/}
        }
        //}else if(level==6){
        //    //渠道
        //    foreignField='channel_id';
        //}
        //状态为1当前用户的所拥有的机构，为0表示下钻
        if(status==1){
            match._id={$in:obj_org_id};
        }else{
            if(level==5){
                match.if_money_audit_org=1
                match.audit_org_pid={$in:org_id};
            }else{
                match.org_pid={$in:org_id};
            }
        }
        console.log("match",match);

        //查询统计表
        var statistics={};
        //流程编码
        if(proc_code){
            statistics['proc_code']=proc_code;
        }


        var compare={};
        var inst={};
        //开始时间
        if(startDate){
            compare['$gte']=new Date(startDate);
        }
        //结束时间
        if(endDate){
            //结束时间追加至当天的最后时间
            compare['$lte']=new Date(endDate+' 23:59:59');
        }
        //时间查询
        if(!isEmptyObject(compare)){
            inst['proc_start_time']=compare;
        }

        console.log("statistics",statistics);
        //依机构表为主表，关联统计表和实例表
        user_model.$CommonCoreOrg.aggregate([
            {
                $match: match
            },

            {
                $graphLookup: {
                    from: "common_bpm_proc_task_moneyaudit_statistics",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: foreignField,
                    as: "statistics",
                    restrictSearchWithMatch: statistics
                }
            },
            {
                $unwind : { path: "$statistics", preserveNullAndEmptyArrays: true }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_inst",
                    startWith: "$statistics.proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "_id",
                    as: "inst",
                    restrictSearchWithMatch: inst
                }
            },
            {
                $unwind :{ path: "$inst", preserveNullAndEmptyArrays: true }
            },
            {
                $group : {
                    _id : "$_id",
                    org_fullname:{ $first: "$org_fullname" },
                    company_code:{ $first: "$company_code" },
                    org_id:{ $first: "$_id" },
                    total:{$sum: { $cond: { if:  { $in: [ "$inst.proc_inst_status", [1,2,3,4] ] }, then:{ $sum: 1 } , else: 0 }}},
                    success:{$sum: { $cond: { if:  { $in: [ "$inst.proc_inst_status", [4] ] }, then:{ $sum: 1 } , else: 0 }}},
                    overtime:{$sum: { $cond: { if:  {$and:[{ $in: [ "$inst.is_overtime", [0] ]},{$in: [ "$inst.proc_inst_status", [4] ]}]}, then:{ $sum: 1 } , else: 0 }}},
                    one_file:{$sum: { $cond: { if:  {$and:[{ $in: [ "$inst.refuse_number", [0] ]},{$in: [ "$inst.proc_inst_status", [4] ]}]}, then:{ $sum: 1 } , else: 0 }}},

                }
            },
            {
                $sort :{ company_code:sort}
            },
        ]).exec(function(err,res){
            if(err){
                reject(utils.returnMsg(false, '1000', '查询统计失败。',null,err));
            }else{
                resolve(res);

            }

        })

    });

    return p;
};


/**
 * 工单列表
 * @param org_id
 * @param proc_code
 * @param level
 * @param status
 * @param dispatch_time
 * @param startDate
 * @param endDate
 * @returns {Promise}
 */
exports.exportDetailList= function(org_id,proc_code,level,status,startDate,endDate,proc_inst_task_type,channel_code,channel_work_id,work_order_number) {

    var p = new Promise(function(resolve,reject){
        let obj_org_id=[];
        console.log("org_id",org_id,level);
        if(org_id instanceof Array){
            for(let item in org_id){
                obj_org_id.push(new mongoose.Types.ObjectId(org_id[item]))
            }
        }else{
            obj_org_id.push(new mongoose.Types.ObjectId(org_id))
        }
        //查询统计表
        var statistics = {};
        if (level == 2) {
            statistics['province_id'] = {$in: obj_org_id};
        } else if (level == 3) {
            //地市
            statistics['city_id'] = {$in: obj_org_id};
        } else if (level == 4) {
            //区县
            statistics['county_id'] = {$in: obj_org_id};
        } else if (level == 5) {
            //网格
            statistics['channel_id'] = {$in: obj_org_id};
        }

        //流程编码
        var two_histroy={};
        //流程编码
        if(proc_code){
            statistics['proc_code']=proc_code;
            two_histroy={"proc_inst_task_type" : "资金稽核负责人"}
        }

        var compare={};
        var inst={};
        //开始时间
        if(startDate){
            compare['$gte']=new Date(startDate);
        }
        //结束时间
        if(endDate){
            //结束时间追加至当天的最后时间
            compare['$lte']=new Date(endDate+' 23:59:59');
        }
        console.log("channel_work_id",channel_work_id,"channel_code",channel_code);
        //渠道编码
        if(channel_code){
            statistics['channel_code']=channel_code;
        }
        //BOSS工号
        if(channel_work_id){
            statistics['work_id']=channel_work_id;
        }

        //查询实例
        var inst_match={};
        //时间查询
        if(!isEmptyObject(compare)){
            inst_match['inst.proc_start_time']=compare;
        }
        //总数
        if(status==1){
            inst_match['inst.proc_inst_status']={$in:[1,2,3,4]};
        }
        //归档数
        if(status==2){
            inst_match['inst.proc_inst_status']={$in:[4]};
        }
        //未超时归档数
        if(status==3){
            inst_match['inst.is_overtime']=0;
            inst_match['inst.proc_inst_status']=4;

        }
        //一次归档工单
        if(status==4){
            inst_match['inst.refuse_number']=0;
            inst_match['inst.proc_inst_status']=4;

        }
        if(work_order_number) {
            inst_match['inst.work_order_number']=work_order_number;
        }
        let task_flag=true;
        var task_search={"proc_inst_task_status":0}
        if(proc_inst_task_type){
            if(proc_inst_task_type=='complete'){
                inst_match={"inst.proc_inst_status":{$in:[4]}};
            }else{
                task_search.proc_inst_task_type=proc_inst_task_type;
                task_flag=false;
            }
        }
        console.log("task_search",task_search,proc_inst_task_type=='complete');
        console.log("statistics",statistics);
        //依机构表为主表，关联统计表和实例表
        process_extend_model.$ProcessTaskMoneyAuditStatistics.aggregate([
            {
                $match: statistics
            },
           {
                $lookup: {
                    from: "common_bpm_proc_inst",
                    localField: 'proc_inst_id',
                    foreignField: "_id",
                    as: "inst"
                }
            },
            {
                $match: inst_match
            },

            {
                $unwind : { path: "$inst", preserveNullAndEmptyArrays: true }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_inst_task",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    as: "task",
                    restrictSearchWithMatch: task_search
                }
            },
            {
                $unwind : { path: "$task", preserveNullAndEmptyArrays: task_flag }
            },
            {
                $lookup: {
                    from: "common_bpm_user_info",
                    localField: 'task.proc_inst_task_assignee',
                    foreignField: "user_no",
                    as: "user"
                }
            },
            {
                $unwind : { path: "$user", preserveNullAndEmptyArrays: task_flag }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_task_histroy",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    as: "channel_histroy",
                    restrictSearchWithMatch: {"proc_inst_task_type" : "厅店处理回复"}
                }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_task_histroy",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    as: "two_histroy",
                    restrictSearchWithMatch: two_histroy
                }
            },
            {
                $addFields: {

                    proc_title:  "$inst.proc_title",
                    proc_name: "$inst.proc_name",
                    proc_vars: "$inst.proc_vars",
                    is_overtime: "$inst.is_overtime",
                    proc_start_time: "$inst.proc_start_time",
                    proc_start_user_name: "$inst.proc_start_user_name",
                    proc_inst_task_type: "$task.proc_inst_task_type",
                    work_order_number: "$inst.work_order_number",
                    proc_inst_task_assignee_name:  "$task.proc_inst_task_assignee_name",
                    proc_inst_status:  "$inst.proc_inst_status",
                    channel_histroy:  "$channel_histroy.proc_inst_task_remark",
                    work_id:  "$user.work_id",
                    channel_work_id:  "$work_id",

                }
            }
        ]).exec(function(err,res){
            if(err){
                reject(utils.returnMsg(false, '1000', '查询统计失败。',null,err));
            }else{

                resolve({"data":res,"proc_code":proc_code});
            }
        })

    });

    return p;
};


/**
 * 创建excel文件
 */
function createExcelOrderList(list) {
    const headers = [
        '区域编码',
        '区域名称',
        '工单数',
        '归档工单数',
        '未超时归档工单数',
        '一次归档工单数',
        '工单归档率',
        '工单及时归档率',
        '一次归档率',
    ];

    var data = [headers];

    list.map(c=>{
        //工单归档率计算
        let filing_rate="0%";
        if(c.success==0|| c.total==0){
            filing_rate= "0%";
        }else{
            var re=((parseInt(c.success)/c.total).toFixed(5)*100).toFixed(3);
            if(re==0){
                filing_rate="0%";
            }else{
                filing_rate= re+"%";
            }
        }
        //工单及时归档率
        let timely_filing_rate= "0%";
        if(c.overtime==0 || c.total==0){
            timely_filing_rate= "0%";
        }else{
            var re=((parseInt(c.overtime)/c.total).toFixed(5)*100).toFixed(3);
            if(re==0){
                timely_filing_rate="0%";
            }else{
                timely_filing_rate= re+"%";
            }

        }
        //一次工单及时归档率
        let one_filing_rate= "0%";
        if(c.one_file==0 || c.total==0){
            timely_filing_rate= "0%";
        }else{
            var re=((parseInt(c.one_file)/c.total).toFixed(5)*100).toFixed(3);
            if(re==0){
                one_filing_rate="0%";
            }else{
                one_filing_rate= re+"%";
            }

        }
        const tmp = [
            c.company_code,
            c.org_fullname,
            c.total,
            c.success,
            c.overtime,
            c.one_file,
            filing_rate,
            timely_filing_rate,
            one_filing_rate
        ]

        data.push(tmp);
    });
    var ws = {
        s:{
            "!row" : [{wpx: 67}]
        }
    };
    ws['!cols']= [{wpx: 100},{wpx: 300},{wpx: 100},{wpx: 100},{wpx: 100},{wpx: 100},{wpx: 100}];


    return xlsx.build([{name:'Sheet1',data:data}],ws);
}

exports.createExcelOrderList = createExcelOrderList;




exports.createExcelOrderDetail =function createExcelOrderDetail(data) {
    let list=data.data;
    let proc_code=data.proc_code;
    const headers =  [
        '工单编号',
        '派单时间',
        '标题',
        '派单内容',
        '类型',
        '当前处理人BOOS工号',
        '当前处理人',
        '当前状态',
        '是否超时',
        '超时时间',
        '工单发起人',
        '渠道编码',
        '渠道名称',
        '渠道负责人BOSS工号',
        '渠道负责人姓名',
        '渠道负责人手机号码',
        '所属网格编码',
        '所属网格名称',
        '所属区县编码',
        '所属区县名称',
        '渠道处理意见',

    ];
    if(proc_code=='p-109'){
        headers.push("网格负责人");
        headers.push("网格负责人手机号码");
        headers.push("网格处理人意见");
    }else if(proc_code=='p-201'){
        headers.push("省级稽核处理人");
        headers.push("省级稽核处理人手机号码");
        headers.push("省级稽核处理人意见");
    }

    var data = [headers];

    list.map(c=>{
        let proc_inst_task_assignee_name="";
        let work_id="";
        if(c.proc_inst_status==4){
            proc_inst_task_assignee_name =  '已归档';
            work_id='已归档'
        }else if(c.proc_inst_task_assignee_name){
            proc_inst_task_assignee_name =  c.proc_inst_task_assignee_name;
            work_id = c.work_id;
        }else{
            proc_inst_task_assignee_name = '待认领';
            work_id ='';
        }

        let proc_inst_task_type="";
        if(c.proc_inst_status==4){
            proc_inst_task_type =  '已归档';
        }else{
            proc_inst_task_type = c.proc_inst_task_type;
        }

        const tmp = [
            c.work_order_number,
            moment(new Date(c.proc_start_time)).format('YYYY-MM-DD'),
            c.proc_title,
            JSON.parse(c.proc_vars).remark,
            c.proc_name,
            work_id ,
            proc_inst_task_assignee_name,
            proc_inst_task_type,
            c.is_overtime==0 ? '未超时':'已超时',
            JSON.parse(c.proc_vars).end_time,
            c.proc_start_user_name,
            c.channel_code,
            c.channel_name,
            c.channel_work_id,
            c.user_name,
            c.user_phone,
            c.grid_code,
            c.grid_name,
            c.county_code,
            c.county_name,
            c.channel_histroy ? c.channel_histroy[0] : "",
            (c.two_histroy  && c.two_histroy.length > 0 )? c.two_histroy[0].proc_inst_task_assignee_name :'',
            (c.two_histroy  && c.two_histroy.length > 0 )? c.two_histroy[0].proc_inst_task_assignee :'',
            (c.two_histroy  && c.two_histroy.length > 0 )? c.two_histroy[0].proc_inst_task_remark :''
        ]
        data.push(tmp);
    });
    var ws = {
        s:{
            "!row" : [{wpx: 67}]
        }
    };
    ws['!cols']= [
        {wpx: 130},{wpx: 100},{wpx: 300},{wpx: 500},{wpx: 100},
        {wpx: 120},{wpx: 100},{wpx: 100},{wpx: 100},{wpx: 100},
        {wpx: 100},{wpx: 100},{wpx: 400},{wpx: 120},{wpx: 200},
        {wpx: 200},{wpx: 100},{wpx: 100},{wpx: 100},{wpx: 100},
        {wpx: 100},{wpx: 100},{wpx: 200},{wpx: 120}];

    return xlsx.build([{name:'Sheet1',data:data}],ws);
}


/**
 * 获取上级机构
 * @param org_id
 */
exports.pre_org= function(org_id) {

    return new Promise(function(resolve,reject){
        user_model.$CommonCoreOrg.find({"_id":org_id},function(err,res){
            if(err){
                reject(utils.returnMsg(false, '1000', '查询上级机构失败。',null,err));
            }else{
                if(res.length==1){
                    resolve(utils.returnMsg(true, '2000', res[0],null,null));
                }else{
                    reject(utils.returnMsg(false, '1000', '查询上级机构失败。',null,null));
                }
            }
        })
    });

};


/**
 * 查询详细列表
 * @param org_id
 * @param status
 * @param proc_code
 * @param dispatch_time
 * @param startDate
 * @param endDate
 * @returns {Promise}
 */
exports.detail_list= function(page,size,org_id,level,status,proc_code,startDate,endDate,proc_inst_task_type,work_order_number,channel_code,channel_work_id) {

    var p = new Promise(function(resolve,reject){
        page=parseInt(page);
        size=parseInt(size);
        if(page==0){
            page=1;
        }
        let obj_org_id=[];
        if(org_id instanceof Array){
            for(let item in org_id){
                obj_org_id.push(new mongoose.Types.ObjectId(org_id[item]))
            }
        }else{
            obj_org_id.push(new mongoose.Types.ObjectId(org_id))
        }

        //查询统计表
        var statistics={};
        //等级为2表示省公司,
        //查询统计表
        var statistics = {};
        if (level == 2) {
            statistics['province_id'] = {$in: obj_org_id};
        } else if (level == 3) {
            //地市
            statistics['city_id'] = {$in: obj_org_id};
        } else if (level == 4) {
            //区县
            statistics['county_id'] = {$in: obj_org_id};
        } else if (level == 5) {
            //网格
            statistics['channel_id'] = {$in: obj_org_id};
        }
        //}else if(level==6){
        //    //渠道
        //    foreignField='channel_id';
        //}
        //状态为1当前用户的所拥有的机构，为0表示下钻

        var two_histroy={};
        //流程编码
        if(proc_code){
            statistics['proc_code']=proc_code;
            two_histroy={"proc_inst_task_type" : "资金稽核负责人"}
        }
        //派单时间
      /*  if(dispatch_time){
            statistics['dispatch_time']=dispatch_time.replace(/\-/g,'');
        }*/
        //渠道编码
        if(channel_code){
            statistics['channel_code']=channel_code;
        }
        //BOSS工号
        if(channel_work_id){
            statistics['work_id']=channel_work_id;
        }
        var compare={};
        //开始时间
        if(startDate){
            compare['$gte']=new Date(startDate);
        }
        //结束时间
        if(endDate){
            //结束时间追加至当天的最后时间
            compare['$lte']=new Date(endDate+' 23:59:59');
        }

        var task_flag=true;
        //查询实例
        var inst_match={};
        console.log(compare);
        //时间查询
        if(!isEmptyObject(compare)){
            inst_match['inst.proc_start_time']=compare;
        }
        //总数
        if(status==1){
            inst_match['inst.proc_inst_status']={$in:[1,2,3,4]};
        }
        //归档数
        if(status==2){
            inst_match['inst.proc_inst_status']={$in:[4]};
        }
        //未超时归档数
        if(status==3){
            inst_match['inst.is_overtime']=0;
            inst_match['inst.proc_inst_status']=4;

        }
        //一次归档工单
        if(status==4){
            inst_match['inst.refuse_number']=0;
            inst_match['inst.proc_inst_status']=4;

        }
        if(work_order_number) {
            inst_match['inst.work_order_number']=work_order_number;
        }

        var task_search={"proc_inst_task_status":0}
        if(proc_inst_task_type){
            if(proc_inst_task_type=='complete'){
                inst_match={"inst.proc_inst_status":{$in:[4]}};
            }else{
                task_search.proc_inst_task_type=proc_inst_task_type;
                task_flag=false;
            }
        }
        console.log("task_search",task_search);
        console.log("statistics",statistics);
        console.log("inst_match",inst_match);

        //依机构表为主表，关联统计表和实例表
        process_extend_model.$ProcessTaskMoneyAuditStatistics.aggregate([
            {
                $match: statistics
            },
            {
                $lookup: {
                    from: "common_bpm_proc_inst",
                    localField: 'proc_inst_id',
                    foreignField: "_id",
                    as: "inst"
                }
            },
            {
                $match: inst_match
            },

            {
                $unwind : { path: "$inst", preserveNullAndEmptyArrays: true }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_inst_task",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    as: "task",
                    restrictSearchWithMatch: task_search
                }
            },
            {
                $unwind : { path: "$task", preserveNullAndEmptyArrays: task_flag }
            },
            {
                $lookup: {
                    from: "common_bpm_user_info",
                    localField: 'task.proc_inst_task_assignee',
                    foreignField: "user_no",
                    as: "user"
                }
            },
            {
                $unwind : { path: "$user", preserveNullAndEmptyArrays: task_flag }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_task_histroy",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    as: "channel_histroy",
                    restrictSearchWithMatch: {"proc_inst_task_type" : "资金稽核负责人"}
                }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_task_histroy",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    as: "two_histroy",
                    restrictSearchWithMatch: two_histroy
                }
            },
            {
                $addFields: {
                    proc_title:  "$inst.proc_title",
                    proc_name: "$inst.proc_name",
                    proc_vars: "$inst.proc_vars",
                    proc_start_time: "$inst.proc_start_time",
                    proc_start_user_name: "$inst.proc_start_user_name",
                    proc_inst_task_type: "$task.proc_inst_task_type",
                    work_order_number: "$inst.work_order_number",
                    proc_inst_task_assignee_name:  "$task.proc_inst_task_assignee_name",
                    proc_inst_status:  "$inst.proc_inst_status",
                    channel_histroy:  "$channel_histroy.proc_inst_task_remark",
                    work_id:  "$user.work_id",
                    channel_work_id:  "$work_id",

            }
            },
            {
                $skip : (page - 1) * size
            },
            {
                $limit : size
            },
        ]).exec(function(err,res){
            if(err){
                reject(utils.returnMsg(false, '1000', '查询统计失败。',null,err));
            }else{

                var result={rows:res,success:true};
                //计算总数
                process_extend_model.$ProcessTaskMoneyAuditStatistics.aggregate([
                    {
                        $match: statistics
                    },
                    {
                        $lookup: {
                            from: "common_bpm_proc_inst",
                            localField: 'proc_inst_id',
                            foreignField: "_id",
                            as: "inst"
                        }
                    },
                    {
                        $match: inst_match
                    },
                    {
                        $unwind : { path: "$inst", preserveNullAndEmptyArrays: true }
                    },
                    {
                        $graphLookup: {
                            from: "common_bpm_proc_inst_task",
                            startWith: "$proc_inst_id",
                            connectFromField: "proc_inst_id",
                            connectToField: "proc_inst_id",
                            as: "task",
                            restrictSearchWithMatch: task_search
                        }
                    },
                    {
                        $unwind : { path: "$task", preserveNullAndEmptyArrays: task_flag }
                    },
                    {
                        $addFields: {
                            proc_title:  "$inst.proc_title",
                            proc_name: "$inst.proc_name",
                            proc_vars: "$inst.proc_vars",
                            work_order_number: "$inst.work_order_number",
                            proc_start_time: "$inst.proc_start_time",
                            proc_start_user_name: "$inst.proc_start_user_name",
                            proc_inst_task_type: "$task.proc_inst_task_type",
                            proc_inst_task_assignee_name:  "$task.proc_inst_task_assignee_name",
                            proc_inst_status:  "$inst.proc_inst_status",
                        }
                    },
                    {
                        $group: {
                            _id : null,
                            count:{$sum:1}
                        }
                    }
                ]).exec(function(err,res){
                    if(err){
                        reject(utils.returnMsg(false, '1000', '查询统计失败。',null,err));
                    }else{
                        if(res.length==0){
                            result.total=0;
                        }else{
                            result.total=res[0].count;
                        }

                        resolve(result);

                    }
                })
            }
        })

    });

    return p;
};

/**
 * 获取当前登录账号的机构id和区域级别
 * @param user_org
 * @returns {{}}
 */
exports.local_user= function(user_org,user_no) {
    return new Promise(function(resolve,reject){
        var return_json={};
        let level;
        let orgs=[];
        //找到当前登录用户的最高组织级别
        for(let item in user_org){
            var org=user_org[item];
            if(level){
                if(org.level < level){
                    level=org.level;
                }
            }else{
                level=org.level;
            }
        }
        //找到最高级别的所拥有的所有组织
        for(let item in user_org){
            var org=user_org[item];
            if(org.level == level){
                orgs.push(org._id);
            }
        }
        var data={level:level,org_id:orgs};
        return_json.success=true;
        return_json.data=data;
        // console.log("level:",level,"orgs",orgs);
        resolve(return_json) ;
    })

}




function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}