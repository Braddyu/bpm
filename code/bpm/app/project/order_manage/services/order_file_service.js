var model = require('../../bpm_resource/models/process_model');
var utils = require('../../../../lib/utils/app_utils');

/**
 * 工单列表分页
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */

/**
 * 获取已归档数据
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getMyArchiveTaskQuery4Eui = function (page, size, userNo, work_order_number,proc_start_time,proc_inst_task_complete_time,is_overtime,proc_code,result) {

    var p = new Promise(function (resolve, reject) {

        var inst_search={};
        let work_id=result.work_id;
        //有的工号为'',为了防止查到空工号的任务
        if(!work_id)work_id='@@@@@@@';
        if (work_order_number) {
            inst_search.work_order_number = work_order_number;
        }

        if (proc_start_time) {
            inst_search.proc_start_time =  {$gte: new Date(proc_start_time),$lte:new Date(new Date(proc_start_time).setDate(new Date(proc_start_time).getDate()+1))};
        }
        if (proc_inst_task_complete_time) {
            inst_search.proc_inst_task_complete_time = {$gte: new Date(proc_inst_task_complete_time),$lte:new Date(new Date(proc_inst_task_complete_time).setDate(new Date(proc_inst_task_complete_time).getDate()+1))};
        }
        if (is_overtime) {
            inst_search.is_overtime = parseInt(is_overtime);
        }

        if (proc_code) {
            inst_search.proc_code = proc_code;
        }
        inst_search.proc_inst_status=4;
        page = parseInt(page);
        size = parseInt(size);
        if (page == 0) {
            page = 1;
        }

        console.log(inst_search);
        model.$ProcessInst.aggregate([
            {
                $match: inst_search
            },
            {  $lookup: {
                    from: "common_bpm_proc_task_histroy",
                     localField:"_id",
                    foreignField: "proc_inst_id",
                    as: "his"
                }
            },
            {
                $match: {$or:[{"his.proc_inst_task_assignee":userNo},{"his.proc_inst_task_work_id":work_id}]}
            },
            {
                $project: {
                    _id: 1,
                    proc_title: 1,
                    proc_name: 1,
                    proc_code: 1,
                    proc_start_time: 1,
                    proc_cur_task_name: 1,
                    refuse_number: 1,
                    is_overtime: 1,
                    proc_vars: 1,
                    proc_start_user_name: 1,
                    proc_inst_task_complete_time: 1,
                    work_order_number: 1,

                }
            },
            {
                $sort: {"proc_inst_task_complete_time": -1}
            },
            {
                $skip: (page - 1) * size
            },
            {
                $limit: size
            },
        ]).exec(function (err, res) {
            if (err) {
                reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
            } else {
                var result = {rows: res, success: true};
                model.$ProcessInst.aggregate([
                    {
                        $match: inst_search
                    },
                    {  $lookup: {
                        from: "common_bpm_proc_task_histroy",
                        localField:"_id",
                        foreignField: "proc_inst_id",
                        as: "his"
                    }
                    },
                    {
                        $match: {"his.proc_inst_task_assignee":userNo}
                    },
                    {
                        $addFields: {
                            "isCount": "1"
                        }
                    },
                    {
                        $sortByCount: "$isCount"
                    }
                ]).exec(function (err, res) {
                    if (err) {
                        reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
                    } else {
                        console.log("数量",res);
                        if(res.length > 0)
                            result.total=res[0].count;
                        else
                            result.total=0;
                        resolve(result)

                    }
                })
            }
        })

    });
    return p;
};



