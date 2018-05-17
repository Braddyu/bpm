var process_extend_model = require('../../bpm_resource/models/process_extend_model');
var user_model = require('../../bpm_resource/models/user_model');
var process_model = require('../../bpm_resource/models/process_model');
var mongoUtils = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;
var xlsx = require('node-xlsx');
var moment = require('moment');
var memcached_utils = require('../../../../lib/memcached_utils.js');
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
exports.getStatisticsListPage = function (org_id, proc_code, level, status, startDate, endDate,channel_enterprise_type) {

    var p = new Promise(function (resolve, reject) {
        let obj_org_id = [];
        let match = {};
        let foreignField;
        for (let item in org_id) {
            obj_org_id.push(new mongoose.Types.ObjectId(org_id[item]))
        }
        //等级为2表示省公司,
        if (level == 2) {
            foreignField = 'province_id';
        } else if (level == 3) {
            //地市
            foreignField = 'city_id';
            //地市的编码长度要于等于3
            match.company_code = {"$regex": /^.{1,3}$/}
        } else if (level == 4) {
            //区县
            foreignField = 'county_id';
            //区县的编码长度要小于等于4
            match.company_code = {"$regex": /^.{1,4}$/}
        } else if (level == 5) {
            //网格
            foreignField = 'grid_id';
            //区县的编码长度要小于等于4
            match.company_code = {"$regex": /^.{1,8}$/}
        } else if (level == 6) {
            //渠道
            foreignField = 'channel_id';
        }
        //状态为1当前用户的所拥有的机构，为0表示下钻
        if (status == 1) {
            match._id = {$in: obj_org_id};
        } else {
            match.org_pid = {$in: org_id};
        }
        console.log("match", match);

        //查询统计表
        var statistics = {};
        var inst = {};
        //流程编码
        if (proc_code) {
          statistics['statistics.proc_code'] = proc_code;
        }
        if(channel_enterprise_type){
            //0:表示实体渠道 1：政企渠道
            if(channel_enterprise_type=='0'){
                statistics['statistics.channel_type']={$in:['101','102','103']}
            }else{
                var orgname = new RegExp('政企');
                statistics['statistics.channel_name']=orgname
            }
        }


        var compare = {};
        //开始时间
        if (startDate) {
            compare['$gte'] = new Date(startDate);
        }
        //结束时间
        if (endDate) {
            //结束时间追加至当天的最后时间
            compare['$lte'] = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));
        }
        //时间查询
        if (!isEmptyObject(compare)) {
            inst['inst.proc_start_time'] = compare;
        }

        console.log("statistics", statistics);
        console.log("inst", inst);
        //依机构表为主表，关联统计表和实例表
        let start_time=new Date().getTime();
        user_model.$CommonCoreOrg.aggregate([
            {
                $match: match
            },
           {
                $lookup: {
                    from: "common_bpm_proc_task_statistics",
                    localField: "_id",
                    foreignField: foreignField,
                    as: "statistics"
                }
            },
            {
                $unwind: {path: "$statistics", preserveNullAndEmptyArrays: true}
            },
            {
                $match: statistics
            },
            {
                $lookup: {
                    from: "common_bpm_proc_inst",
                    localField: "statistics.proc_inst_id",
                    foreignField: "_id",
                    as: "inst"
                }
            },
            {
                $unwind: {path: "$inst", preserveNullAndEmptyArrays: true}
            },
            {
                $match: inst
            },
           {
                $group: {
                    _id: "$_id",
                    org_fullname: {$first: "$org_fullname"},
                    company_code: {$first: "$company_code"},
                    org_id: {$first: "$_id"},
                    level:{$first: "$level"},
                    //总工单数
                    totalNum: {
                        $sum: 1
                    },
                    //归档工单数
                    fileNum: {$sum: {$cond: {if: {$eq: ["$inst.proc_inst_status", 4]}, then: {$sum: 1}, else: 0}}},
                    //未超时工单数
                    notOvertimeNum: {
                        $sum: {
                            $cond: {
                                if: {$and: [{$eq: ["$inst.is_overtime", 0]}, {$eq: ["$inst.proc_inst_status", 4]}]},
                                then: {$sum: 1},
                                else: 0
                            }
                        }
                    },
                    //一次归档工单数
                    oneFileNum: {
                        $sum: {
                            $cond: {
                                if: {$and: [{$eq: ["$inst.refuse_number", 0]}, {$eq: ["$inst.proc_inst_status", 4]}]},
                                then: {$sum: 1},
                                else: 0
                            }
                        }
                    },
                    //二次及以上归档工单数
                    twiceAuditNum:{
                        $sum: {
                            $cond: {
                                if: {$and: [{$gt: ["$inst.refuse_number", 0]}, {$eq: ["$inst.proc_inst_status", 4]}]},
                                then: {$sum: 1},
                                else: 0
                            }
                        }
                    },
                    //未补录工单数
                    untreatedNum:{
                        $sum: {
                            $cond: {
                                if: {$and: [{$eq: ["$inst.refuse_number", 0]}, {$eq: ["$inst.proc_cur_task_name", "厅店处理回复"]}]},
                                then: {$sum: 1},
                                else: 0
                         }
                        }
                    },
                    //补录工单数
                    treatedNum:{
                        $sum: {
                            $cond: {
                                if: {$and: [{$or:[{$gt: ["$inst.refuse_number", 0]},{$ne: ["$inst.proc_cur_task_name", "厅店处理回复"]}]}, {$eq: ["$inst.proc_inst_status", 2]}]},
                                then: {$sum: 1},
                                else: 0
                            }
                        }
                    },
                    //超时补录工单数
                    overtimeTreatedNum:{
                        $sum: {
                            $cond: {
                                if: {$and: [{$eq: ["$inst.is_overtime", 1]},{$or:[{$gt: ["$inst.refuse_number", 0]},{$ne: ["$inst.proc_cur_task_name", "厅店处理回复"]}]}, {$eq: ["$inst.proc_inst_status", 2]}]},
                                then: {$sum: 1},
                                else: 0
                            }
                        }
                    },
                }
            },
            {
                $sort: {total: -1}
            },
        ]).exec(function (err, staRes) {
            if (err) {
                reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
            } else {
                //统计后的组织只统计有数据的组织，没数据的组织会没有，这里将没数据的组织的数据全部为0的插入统计数据

               user_model.$CommonCoreOrg.find(match, function (err, res) {
                    if (res && res.length > 0) {
                        for (let i in res) {
                            let is_exists = false;
                            //判断统计表中的组织
                            for (let j in staRes) {
                                if (res[i].company_code == staRes[j].company_code) {
                                    is_exists = true;
                                    break;
                                }
                            }
                            if (!is_exists) {
                                let staJson = {
                                    _id: res[i]._id,
                                    org_fullname: res[i].org_fullname,
                                    company_code: res[i].company_code,
                                    org_id: res[i].org_pid,
                                    level: res[i].level,
                                    totalNum: 0,
                                    fileNum: 0,
                                    notOvertimeNum: 0,
                                    oneFileNum: 0,
                                    twiceAuditNum: 0,
                                    untreatedNum: 0,
                                    treatedNum: 0,
                                    overtimeTreatedNum: 0
                                }
                                staRes.push(staJson);
                            }
                        }
                        console.log(res);
                        let end_time = new Date().getTime();
                        console.log("时间", end_time - start_time);
                        var result = {rows: staRes, success: true,proc_code:proc_code};
                        console.log("结果", result);
                        resolve(result);

                    }
                })
            }
        });
    });

    return p;
};


/**
 * 创建excel文件
 */

exports.createExcelOrderList = function createExcelOrderList(data) {
    let list=data.rows;
    let proc_code = data.proc_code;
    let headers=[];
    if(proc_code=='p-109'){
        headers = [
            '区域编码',
            '区域名称',
            '工单数',
            '归档工单数 ',
            '及时归档工单数',
            '工单归档率',
            '工单及时归档率 ',

        ];
    }else if(proc_code=='p-201'){
        headers = [
            '区域编码',
            '区域名称',
            '工单数',
            '处理工单数',
            '超时处理工单数',
            '未处理工单数',
            '归档工单数 ',
            '及时归档工单数',
            '一次归档工单数 ',
            '二次及以上归档工单数 ',
            '工单处理率',
            '工单超时处理率',
            '工单未处理率',
            '工单归档率',
            '工单及时归档率 ',
            '一次归档率 ',
            '二次及以上归档率 ',
        ];
    }


    var data = [headers];

    list.map(c => {

        //工单补录率
        let treated_rate = "0%";
        if (c.treatedNum == 0 || c.totalNum == 0) {
            treated_rate = "0%";
        } else {

            var re = ((parseInt(c.treatedNum) / c.totalNum).toFixed(5) * 100).toFixed(3);
            if (re == 0) {
                treated_rate = "0%";
            } else {
                treated_rate = re + "%";
            }

        }
        //超时补录率
        let  overtimeTreated_rate = "0%";
        if (c.overtimeTreatedNum == 0 || c.totalNum == 0) {
            overtimeTreated_rate = "0%";
        } else {
            var re = ((parseInt(c.overtimeTreatedNum) / c.totalNum).toFixed(5) * 100).toFixed(3);
            if (re == 0) {
                overtimeTreated_rate = "0%";
            } else {
                overtimeTreated_rate = re + "%";
            }
        }

        //未补录率
        let untreated_rate = "0%";
        if (c.untreatedNum == 0 || c.totalNum == 0) {
            untreated_rate = "0%";
        } else {
            var re = ((parseInt(c.untreatedNum) / c.totalNum).toFixed(5) * 100).toFixed(3);
            if (re == 0) {
                untreated_rate = "0%";
            } else {
                untreated_rate = re + "%";
            }
        }

        //工单归档率计算
        let filing_rate = "0%";
        if (c.fileNum == 0 || c.totalNum == 0) {
            filing_rate = "0%";
        } else {
            var re = ((parseInt(c.fileNum) / c.totalNum).toFixed(5) * 100).toFixed(3);
            if (re == 0) {
                filing_rate = "0%";
            } else {
                filing_rate = re + "%";
            }
        }
        //工单及时归档率
        let timely_filing_rate = "0%";
        if (c.notOvertimeNum == 0 || c.totalNum == 0) {
            timely_filing_rate = "0%";
        } else {
            var re = ((parseInt(c.notOvertimeNum) / c.totalNum).toFixed(5) * 100).toFixed(3);
            if (re == 0) {
                timely_filing_rate = "0%";
            } else {
                timely_filing_rate = re + "%";
            }

        }
        //一次工单及时归档率
        let one_filing_rate = "0%";
        if (c.oneFileNum == 0 || c.totalNum == 0) {
            timely_filing_rate = "0%";
        } else {
            var re = ((parseInt(c.oneFileNum) / c.totalNum).toFixed(5) * 100).toFixed(3);
            if (re == 0) {
                one_filing_rate = "0%";
            } else {
                one_filing_rate = re + "%";
            }

        }
        //二次稽核通过率
        let two_filing_rate = "0%";
        if (c.twiceAuditNum == 0 || c.totalNum == 0) {
            two_filing_rate = "0%";
        } else {
            var re = ((parseInt(c.twiceAuditNum) / c.totalNum).toFixed(5) * 100).toFixed(3);
            if (re == 0) {
                two_filing_rate = "0%";
            } else {
                two_filing_rate = re + "%";
            }

        }
        let tmp=[];
        if(proc_code=='p-109'){
            tmp = [
                c.company_code,
                c.org_fullname,
                c.totalNum,
                c.fileNum,
                c.notOvertimeNum,
                filing_rate,
                timely_filing_rate,
            ]
        }else if(proc_code=='p-201'){
            tmp = [
                c.company_code,
                c.org_fullname,
                c.totalNum,
                c.treatedNum,
                c.overtimeTreatedNum,
                c.untreatedNum,
                c.fileNum,
                c.notOvertimeNum,
                c.oneFileNum,
                c.twiceAuditNum,
                treated_rate,
                overtimeTreated_rate,
                untreated_rate,
                filing_rate,
                timely_filing_rate,
                one_filing_rate,
                two_filing_rate,
            ]
        }

        data.push(tmp);
    });
    var ws = {
        s: {
            "!row": [{wpx: 67}]
        }
    };
    if(proc_code=='p-109'){
        ws['!cols'] = [{wpx: 100}, {wpx: 300}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}]
    }else  if(proc_code=='p-201'){
        ws['!cols'] = [{wpx: 100}, {wpx: 300}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}
            , {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}];
    }



    return xlsx.build([{name: 'Sheet1', data: data}], ws);
}


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
exports.detail_list = function (page, size, org_id, level, status, proc_code, startDate, endDate, proc_inst_task_type, work_order_number, channel_code, channel_work_id,channel_enterprise_type) {

    var p = new Promise(function (resolve, reject) {
        page = parseInt(page);
        size = parseInt(size);
        if (page == 0) {
            page = 1;
        }
        let obj_org_id = [];
        if (org_id instanceof Array) {
            for (let item in org_id) {
                obj_org_id.push(new mongoose.Types.ObjectId(org_id[item]))
            }
        } else {
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
            statistics['grid_id'] = {$in: obj_org_id};
        } else if (level == 6) {
            //渠道
            statistics['channel_id'] = {$in: obj_org_id};
        }
        var two_histroy = {};
        //流程编码
        if (proc_code) {
            statistics['proc_code'] = proc_code;
            if (proc_code == 'p-109') {
                two_histroy = {"proc_inst_task_type": "网格经理审核"}
            } else {
                two_histroy = {"proc_inst_task_type": "省营业厅销售部稽核"}
            }
        }
        //渠道编码
        if (channel_code) {
            statistics['channel_code'] = channel_code;
        }
        //BOSS工号
        if (channel_work_id) {
            statistics['work_id'] = channel_work_id;
        }
        //渠道类型
        if(channel_enterprise_type){
            //0:表示实体渠道 1：政企渠道
            if(channel_enterprise_type=='0'){
                statistics['channel_type']={$in:['101','102','103']}
            }else{
                var orgname = new RegExp('政企');
                statistics['channel_name']=orgname
            }
        }

        var compare = {};
        //开始时间
        if (startDate) {
            compare['$gte'] = new Date(startDate);
        }
        //结束时间
        if (endDate) {
            //结束时间追加至当天的最后时间
            compare['$lte'] = new Date(new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)));
        }
        var task_flag = true;
        //查询实例
        var inst_match = {};
        console.log(compare);
        //时间查询
        if (!isEmptyObject(compare)) {
            inst_match['inst.proc_start_time'] = compare;
        }
        //总数
        if (status == 1) {
            // inst_match['inst.proc_inst_status'] = {$in: [1, 2, 3, 4]};
        }
        //补录工单数
        if (status == 2) {
            inst_match['$and'] =[{$or:[{"inst.refuse_number":{$gt:0}},{"inst.proc_cur_task_name":{$ne:"厅店处理回复"}}]}, {"inst.proc_inst_status":{$eq:2}}];
        }
        //超时补录工单数
        if (status == 3) {
            inst_match['$and'] = [{"inst.is_overtime":{$eq:1}},{$or:[{"inst.refuse_number":{$gt:0}},{"inst.proc_cur_task_name":{$ne:"厅店处理回复"}}]}, {"inst.proc_inst_status":{$eq:2}}];
        }
        //未补录工单数
        if (status == 4) {
            inst_match['$and'] = [{"inst.refuse_number":{$eq:0}}, {"inst.proc_inst_status":{$eq:2}},{"inst.proc_cur_task_name":{$eq:"厅店处理回复"}}];
        }
        //归档工单数
        if (status == 5) {
            inst_match['inst.proc_inst_status'] = 4;
        }
        //及时归档工单数
        if (status == 6) {
            inst_match['$and'] = [{"inst.is_overtime":{$eq:0}}, {"inst.proc_inst_status":{$eq:4}}];
        }
        //一次归档工单数
        if (status == 7) {
            inst_match['$and'] = [{"inst.refuse_number":{$eq:0}}, {"inst.proc_inst_status":{$eq:4}}];
        }
        //二次及以上归档工单数
        if (status == 8) {
            inst_match['$and'] = [{"inst.refuse_number":{$gt:0}}, {"inst.proc_inst_status":{$eq:4}}];
        }

        if (work_order_number) {
            inst_match['inst.work_order_number'] = work_order_number;
        }

        var task_search = {"proc_inst_task_status": 0}
        if (proc_inst_task_type) {
            if (proc_inst_task_type == 'complete') {
                inst_match = {"inst.proc_inst_status": 4};
            } else {
                inst_match = {"inst.proc_cur_task_name": proc_inst_task_type};
                task_flag = false;
            }
        }
        console.log("task_search", task_search);
        console.log("statistics", statistics);
        console.log("inst_match", inst_match);
        console.log("two_histroy", two_histroy);
        //依机构表为主表，关联统计表和实例表
        process_extend_model.$ProcessTaskStatistics.aggregate([
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
                $unwind: {path: "$inst", preserveNullAndEmptyArrays: true}
            },
            {
                $match: inst_match
            },
            {
                $skip: (page - 1) * size
            },
            {
                $limit: size
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_inst_task",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    restrictSearchWithMatch:task_search,
                    as: "task"
                }
            },
            {
                $unwind: {path: "$task", preserveNullAndEmptyArrays: task_flag}
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_task_histroy",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    restrictSearchWithMatch:{"proc_inst_task_type": "厅店处理回复" },
                    as: "channel_histroy"
                }
            },
            {
                $graphLookup: {
                    from: "common_bpm_proc_task_histroy",
                    startWith: "$proc_inst_id",
                    connectFromField: "proc_inst_id",
                    connectToField: "proc_inst_id",
                    restrictSearchWithMatch:two_histroy,
                    as: "two_histroy"
                }
            },
            {
                $addFields: {
                    proc_title: "$inst.proc_title",
                    proc_name: "$inst.proc_name",
                    proc_vars: "$inst.proc_vars",
                    proc_start_time: "$inst.proc_start_time",
                    proc_start_user_name: "$inst.proc_start_user_name",
                    proc_inst_task_type: "$task.proc_inst_task_type",
                    work_order_number: "$inst.work_order_number",
                    proc_inst_task_assignee_name: "$task.proc_inst_task_assignee_name",
                    proc_inst_status: "$inst.proc_inst_status",
                    work_id: "$task.proc_inst_task_work_id",
                    channel_histroy:"$channel_histroy.proc_inst_task_remark",
                    channel_work_id: "$work_id",

                }
            },
        ]).exec(function (err, res) {
            if (err) {
                reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
            } else {

                var result = {rows: res, success: true};
                //计算总数
                process_extend_model.$ProcessTaskStatistics.aggregate([
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
                        $count: "proc_inst_id"
                    }
                ]).exec(function (err, res) {
                    if (err) {
                        reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
                    } else {

                        if (res.length == 0) {
                            result.total = 0;
                        } else {
                            result.total = res[0].proc_inst_id;
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
exports.exportDetailList = function (org_id, proc_code, level, status, startDate, endDate, proc_inst_task_type, channel_code, channel_work_id, work_order_number,randomStr,channel_enterprise_type) {
    var p = new Promise(function (resolve, reject) {
        let obj_org_id = [];
        console.log("org_id", org_id, level);
        if (org_id instanceof Array) {
            for (let item in org_id) {
                obj_org_id.push(new mongoose.Types.ObjectId(org_id[item]))
            }
        } else {
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
            statistics['grid_id'] = {$in: obj_org_id};
        } else if (level == 6) {
            //渠道
            statistics['channel_id'] = {$in: obj_org_id};
        }
        //流程编码
        var two_histroy = {};
        var history = {};
        //流程编码
        if (proc_code) {
            statistics['proc_code'] = proc_code;
            if (proc_code == 'p-109') {
                two_histroy = {"proc_inst_task_type": "网格经理审核"}
            } else {
                two_histroy = {"proc_inst_task_type": "省营业厅销售部稽核"}
            }
        }

        var compare = {};
        var inst = {};
        //开始时间
        if (startDate) {
            compare['$gte'] = new Date(startDate);
        }
        //结束时间
        if (endDate) {
            //结束时间追加至当天的最后时间
            compare['$lte'] = new Date(new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)));
        }
        console.log("channel_work_id", channel_work_id, "channel_code", channel_code,compare);
        //渠道编码
        if (channel_code) {
            statistics['channel_code'] = channel_code;
        }
        //BOSS工号
        if (channel_work_id) {
            statistics['work_id'] = channel_work_id;
        }
        //渠道类型
        if(channel_enterprise_type){
            //0:表示实体渠道 1：政企渠道
            if(channel_enterprise_type=='0'){
                statistics['channel_type']={$in:['101','102','103']}
            }else{
                var orgname = new RegExp('政企');
                statistics['channel_name']=orgname
            }
        }

        //查询实例
        var inst_match = {};
        //时间查询
        if (!isEmptyObject(compare)) {
            inst_match['inst.proc_start_time'] = compare;
        }
        //总数
        if (status == 1) {
            // inst_match['inst.proc_inst_status'] = {$in: [1, 2, 3, 4]};
        }
        //补录工单数
        if (status == 2) {
            inst_match['$and'] =[{$or:[{"inst.refuse_number":{$gt:0}},{"inst.proc_cur_task_name":{$ne:"厅店处理回复"}}]}, {"inst.proc_inst_status":{$eq:2}}];
        }
        //超时补录工单数
        if (status == 3) {
            inst_match['$and'] = [{"inst.is_overtime":{$eq:1}},{$or:[{"inst.refuse_number":{$gt:0}},{"inst.proc_cur_task_name":{$ne:"厅店处理回复"}}]}, {"inst.proc_inst_status":{$eq:2}}];
        }
        //未补录工单数
        if (status == 4) {
            inst_match['$and'] = [{"inst.refuse_number":{$eq:0}}, {"inst.proc_inst_status":{$eq:2}},{"inst.proc_cur_task_name":{$eq:"厅店处理回复"}}];
        }
        //归档工单数
        if (status == 5) {
            inst_match['inst.proc_inst_status'] = 4;
        }
        //及时归档工单数
        if (status == 6) {
            inst_match['$and'] = [{"inst.is_overtime":{$eq:0}}, {"inst.proc_inst_status":{$eq:4}}];
        }
        //一次归档工单数
        if (status == 7) {
            inst_match['$and'] = [{"inst.refuse_number":{$eq:0}}, {"inst.proc_inst_status":{$eq:4}}];
        }
        //二次及以上归档工单数
        if (status == 8) {
            inst_match['$and'] = [{"inst.refuse_number":{$gt:0}}, {"inst.proc_inst_status":{$eq:4}}];
        }
        if (work_order_number) {
            inst_match['inst.work_order_number'] = work_order_number;
        }
        var task_search = {"proc_inst_task_status": 0}
        if (proc_inst_task_type) {
            if (proc_inst_task_type == 'complete') {
                inst_match = {"inst.proc_inst_status": 4};
            } else {
                inst_match['inst.proc_cur_task_name']= proc_inst_task_type;
            }
        }
        console.log("task_search", task_search, inst_match);
        console.log("statistics", statistics);
        //依机构表为主表，关联统计表和实例表
        process_extend_model.$ProcessTaskStatistics.aggregate([
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
                $count: "proc_inst_id"
            }
        ]).exec(function (err, res) {
            if (err) {
                reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
            } else {
               if (res.length > 0) {
                    let count = res[0].proc_inst_id;
                    console.log("总数：", count);
                    let batch_size = 2000;
                    let size = Math.ceil(count / batch_size);
                    let arr = [];
                    let counter = 0;
                    console.log("查询次数:", size);
                    for (let i = 0; i < size; i++) {
                        process_extend_model.$ProcessTaskStatistics.aggregate([
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
                                $unwind: {path: "$inst", preserveNullAndEmptyArrays: true}
                            },
                            {
                                $match: inst_match
                            },
                            {
                                $skip: i * batch_size
                            },
                            {
                                $limit: batch_size
                            },
                           {
                                $graphLookup: {
                                    from: "common_bpm_proc_inst_task",
                                    startWith: "$proc_inst_id",
                                    connectFromField: "proc_inst_id",
                                    connectToField: "proc_inst_id",
                                    restrictSearchWithMatch:task_search,
                                    as: "task"
                                }
                            },
                            {
                                $unwind: {path: "$task", preserveNullAndEmptyArrays: true}
                            },
                           {
                                $graphLookup: {
                                    from: "common_bpm_proc_task_histroy",
                                    startWith: "$proc_inst_id",
                                    connectFromField: "proc_inst_id",
                                    connectToField: "proc_inst_id",
                                    restrictSearchWithMatch:{"proc_inst_task_type": "厅店处理回复" },
                                    as: "channel_histroy"
                                }
                            },
                            {
                                $graphLookup: {
                                    from: "common_bpm_proc_task_histroy",
                                    startWith: "$proc_inst_id",
                                    connectFromField: "proc_inst_id",
                                    connectToField: "proc_inst_id",
                                    restrictSearchWithMatch:two_histroy,
                                    as: "two_histroy"
                                }
                            },
                            {
                                $addFields: {
                                    proc_title: "$inst.proc_title",
                                    proc_name: "$inst.proc_name",
                                    proc_vars: "$inst.proc_vars",
                                    proc_start_time: "$inst.proc_start_time",
                                    proc_start_user_name: "$inst.proc_start_user_name",
                                    proc_inst_task_type: "$task.proc_inst_task_type",
                                    work_order_number: "$inst.work_order_number",
                                    proc_inst_task_assignee_name: "$task.proc_inst_task_assignee_name",
                                    proc_inst_status: "$inst.proc_inst_status",
                                    work_id: "$task.proc_inst_task_work_id",
                                    channel_histroy:"$channel_histroy.proc_inst_task_remark",
                                    channel_work_id: "$work_id",

                                }
                            },


                        ]).exec(function (err, res) {
                            if (err) {
                                reject(utils.returnMsg(false, '1000', '查询统计失败。', null, err));
                            } else {
                                var hash = {};
                              res = res.reduce(function (item, next) {
                                    hash[next.work_order_number] ? '' : hash[next.work_order_number] = true && item.push(next);
                                    return item
                                }, [])
                                console.log("長度:",i, res.length);
                                arr = arr.concat(res);
                                counter++;
                                let lifetime=1000;

                                memcached_utils.setVal(randomStr,Math.round(parseFloat(counter / size) * 100),lifetime,function(err,res){
                                })
                                console.log("查询进度：", arr.length,Math.round(parseFloat(counter / size) * 100) + "%");
                               if (counter == size) {
                                    resolve({"data": arr, "proc_code": proc_code});
                                }
                            }
                        })
                    }

                }else{
                   resolve({"data": [], "proc_code": proc_code});
               }
            }
        })


    });

    return p;
};

exports.createExcelOrderDetail = function createExcelOrderDetail(data) {
    console.log("开始生成excel");
    let list = data.data;
    let proc_code = data.proc_code;
    const headers = [
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
    if (proc_code == 'p-109') {
        headers.push("网格负责人");
        headers.push("网格负责人手机号码");
        headers.push("网格处理人意见");
    } else if (proc_code == 'p-201') {
        headers.push("省级稽核处理人");
        headers.push("省级稽核处理人手机号码");
        headers.push("省级稽核处理人意见");
    }

    var data = [headers];

    list.map(c => {
        let proc_inst_task_assignee_name = "";
        let work_id = "";
        if (c.proc_inst_status == 4) {
            proc_inst_task_assignee_name = '已归档';
            work_id = '已归档'
        } else if (c.proc_inst_task_assignee_name) {
            proc_inst_task_assignee_name = c.proc_inst_task_assignee_name;
            work_id = c.work_id;
        } else {
            proc_inst_task_assignee_name = '待认领';
            work_id = '';
        }

        let proc_inst_task_type = "";
        if (c.proc_inst_status == 4) {
            proc_inst_task_type = '已归档';
        } else {
            proc_inst_task_type = c.proc_inst_task_type;
        }

        const tmp = [
            c.work_order_number,
            moment(new Date(c.proc_start_time)).format('YYYY-MM-DD'),
            c.proc_title,
            JSON.parse(c.proc_vars).remark,
            c.proc_name,
            work_id,
            proc_inst_task_assignee_name,
            proc_inst_task_type,
            c.is_overtime == 0 ? '未超时' : '已超时',
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
            (c.two_histroy && c.two_histroy.length > 0 ) ? c.two_histroy[0].proc_inst_task_assignee_name : '',
            (c.two_histroy && c.two_histroy.length > 0 ) ? c.two_histroy[0].proc_inst_task_assignee : '',
            (c.two_histroy && c.two_histroy.length > 0 ) ? c.two_histroy[0].proc_inst_task_remark : ''
        ]
        data.push(tmp);
    });


    var ws = {
        s: {
            "!row": [{wpx: 67}]
        }
    };
    ws['!cols'] = [
        {wpx: 130}, {wpx: 100}, {wpx: 300}, {wpx: 500}, {wpx: 100},
        {wpx: 120}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100},
        {wpx: 100}, {wpx: 100}, {wpx: 400}, {wpx: 120}, {wpx: 200},
        {wpx: 200}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100},
        {wpx: 100}, {wpx: 100}, {wpx: 200}, {wpx: 120}];
    var start = new Date().getTime();
    var  file=xlsx.build([{name: 'Sheet1', data: data}], ws);
    var end = new Date().getTime();
    console.log((end-start));
    return file
}


/**
 * 获取上级机构
 * @param org_id
 */
exports.pre_org = function (org_id) {

    return new Promise(function (resolve, reject) {
        user_model.$CommonCoreOrg.find({"_id": org_id}, function (err, res) {
            if (err) {
                reject(utils.returnMsg(false, '1000', '查询上级机构失败。', null, err));
            } else {
                if (res.length == 1) {
                    resolve(utils.returnMsg(true, '2000', res[0], null, null));
                } else {
                    reject(utils.returnMsg(false, '1000', '查询上级机构失败。', null, null));
                }
            }
        })
    });

};




/**
 * 获取当前登录账号的机构id和区域级别
 * @param user_org
 * @returns {{}}
 */
exports.local_user = function (user_org, user_no) {
    return new Promise(function (resolve, reject) {
        var return_json = {};
        let level;
        let orgs = [];
        //找到当前登录用户的最高组织级别
        for (let item in user_org) {
            var org = user_org[item];
            if (level) {
                if (org.level < level) {
                    level = org.level;
                }
            } else {
                level = org.level;
            }
        }
        //找到最高级别的所拥有的所有组织
        for (let item in user_org) {
            var org = user_org[item];
            if (org.level == level) {
                orgs.push(org._id);
            }
        }
        var data = {level: level, org_id: orgs};
        return_json.success = true;
        return_json.data = data;
        resolve(return_json);
    })

}


function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}