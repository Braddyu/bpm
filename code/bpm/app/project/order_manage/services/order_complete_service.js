
var model = require('../../bpm_resource/models/process_model');

var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;


/**
 * 获取我的已办任务列表分页方法
 * @param userCode
 * @param paramMap
 */
exports.getMyCompleteTaskQuery4Eui= function(page,size,userCode,paramMap,proc_code,startDate,endDate,work_order_number) {

    var p = new Promise(function(resolve,reject){
        var userArr = [];
        userArr.push(userCode);
        var conditionMap = {};
        //proc_inst_task_user_org  进行模糊匹配
        conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':paramMap.orgs}];
        // conditionMap['$or'] = [{'proc_inst_task_assignee':{'$in':userArr}},{'proc_inst_task_user_role':{'$in':paramMap.roles},'proc_inst_task_user_org':{'$in':paramMap.orgs}}];
        conditionMap.proc_inst_task_status = 1;
        if(proc_code){
            conditionMap.proc_code=proc_code;
        }
        if(work_order_number){
            conditionMap.work_order_number=work_order_number;
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
            conditionMap['proc_inst_task_complete_time']=compare;
        }
        console.log(conditionMap);
        utils.pagingQuery4Eui(model.$ProcessTaskHistroy, page, size, conditionMap, resolve, '',  {proc_inst_task_complete_time:-1});
    });
    return p;
};



/**
 * 获取已归档数据
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getMyArchiveTaskQuery4Eui= function(page,size,userNo,work_order_number) {

    var p = new Promise(function(resolve,reject){
        var match={'proc_inst_task_assignee':userNo};
        if(work_order_number){
            match.work_order_number=work_order_number;
        }
        model.$ProcessTaskHistroy.aggregate([
            {
                $match: match
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
                $unwind : { path: "$inst", preserveNullAndEmptyArrays: true }
            },
            {
                $match: {'inst.proc_inst_status':4}
            },
            {
                $group: {
                    _id : "$proc_inst_id",
                    proc_title:{$first:"$proc_inst_task_title"},
                    proc_name:{$first:"$proc_name"},
                    proc_code:{$first:"$proc_code"},
                    proc_cur_task_name:{$first:"$inst.proc_cur_task_name"},
                    proc_ver:{$first:"$inst.proc_ver"},
                    proc_start_user_name:{$first:"$inst.proc_start_user_name"},
                    proc_cur_arrive_time:{$first:"$inst.proc_cur_arrive_time"},
                    work_order_number:{$first:"$inst.work_order_number"},
                }
            }
        ]).exec(function(err,res){
            if(err){
                reject(utils.returnMsg(false, '1000', '查询统计失败。',null,err));
            }else{
                var result={rows:res,success:true};
                model.$ProcessTaskHistroy.aggregate([
                    {
                        $match: match
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
                        $unwind : { path: "$inst", preserveNullAndEmptyArrays: true }
                    },
                    {
                        $match: {'inst.proc_inst_status':4}
                    },
                    {
                        $group: {
                            _id : "$proc_inst_id"

                        }
                    },
                    {
                        $group: {
                            _id : "$_id",
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

function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
