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
exports.getMyArchiveTaskQuery4Eui = function (page, size, userNo, work_order_number) {

    var p = new Promise(function (resolve, reject) {
        var match = {'proc_inst_task_assignee': userNo};
        if (work_order_number) {
            match.work_order_number = work_order_number;
        }
        page = parseInt(page);
        size = parseInt(size);
        if (page == 0) {
            page = 1;
        }

        console.log(match);
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
                $unwind: {path: "$inst", preserveNullAndEmptyArrays: true}
            },
            {
                $match: {'inst.proc_inst_status': 4}
            }
            ,
            {
                $group: {
                    _id: "$proc_inst_id",
                    proc_title: {$first: "$proc_inst_task_title"},
                    proc_name: {$first: "$proc_name"},
                    proc_code: {$first: "$proc_code"},
                    proc_start_time: {$first: "$inst.proc_start_time"},
                    proc_cur_task_name: {$first: "$inst.proc_cur_task_name"},
                    refuse_number: {$first: "$inst.refuse_number"},
                    is_overtime: {$first: "$inst.is_overtime"},
                    proc_vars: {$first: "$inst.proc_vars"},
                    proc_start_user_name: {$first: "$inst.proc_start_user_name"},
                    proc_inst_task_complete_time: {$first: "$inst.proc_inst_task_complete_time"},
                    work_order_number: {$first: "$inst.work_order_number"},
                }
            }, {
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
                        $unwind: {path: "$inst", preserveNullAndEmptyArrays: true}
                    },
                    {
                        $match: {'inst.proc_inst_status': 4}
                    },
                    {
                        $group: {
                            _id: "$proc_inst_id"

                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            count: {$sum: 1}
                        }
                    }
                ]).exec(function (err, res) {
                    if (err) {
                        reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
                    } else {
                        if (res.length == 0) {
                            result.total = 0;
                        } else {
                            result.total = res[0].count;
                        }
                        resolve(result);

                    }
                })
            }
        })

    });
    return p;
};



