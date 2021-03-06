var mongoUtils = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
var model = require('../../bpm_resource/models/process_model');
var mistake_model = require('../models/mistake_model');
var process_extend_model = require('../../bpm_resource/models/process_extend_model');
var dict_model = require('../../workflow/models/dict_model');
var process_utils = require('../../../utils/process_util');
var sshClient = require('../../../utils/sshClient');
var utils = require('../../../../lib/utils/app_utils');
var xlsx = require('node-xlsx');
var fs = require('fs');
var moment = require('moment');
var config = require('../../../../config');
/**
 * 工单列表分页
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getOrderListPage = function (page, size, conditionMap) {

    var p = new Promise(function (resolve, reject) {

        utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '', {});

    });

    return p;
};

/**
 * 获取所有工单列表
 * @returns {Promise}
 */
exports.getAllOrder = function () {

    var p = new Promise(function (resolve, reject) {
        model.$ProcessInst.find({}, function (err, result) {
            if (err) {
                console.log('获取所有工单列表失败', err);
                resolve({'success': false, 'code': '1000', 'msg': '获取所有工单列表失败', "error": err});
            } else {
                resolve(result)
                //resolve({'success':true,'code':'0000','msg':'获取所有工单列表成功',"data":result,"error":null});
            }
        });

    });
    return p;
};

/**
 * 创建excel文件
 */
function createExcelOrderList(list) {
    const headers = [
        '工单标题',
        '所属流程',
        '版本',
        '当前处理节点',
        '状态',
        '申请人',
        '创建时间'
    ];

    var data = [headers];

    list.map(c => {
        var doc = c._doc;
        const tmp = [
            doc.proc_title,
            doc.proc_name,
            doc.proc_ver,
            doc.proc_cur_task_name,
            doc.proc_inst_status,
            doc.proc_start_user_name,
            doc.proc_start_time
        ]

        data.push(tmp);
    });
    var ws = {
        s: {
            "!row": [{wpx: 67}]
        }
    };
    ws['!cols'] = [{wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}, {wpx: 100}];


    return xlsx.build([{name: 'Sheet1', data: data}], ws);
}

exports.createExcelOrderList = createExcelOrderList;


/**
 * 获取所有流程
 * @returns {Promise}
 */
exports.getAllProBase = function () {

    var p = new Promise(function (resolve, reject) {
        model.$ProcessBase.find({"status": "1"}, function (err, result) {
            if (err) {
                console.log('获取所有流程失败', err);
                resolve({'success': false, 'code': '1000', 'msg': '获取所有流程失败', "error": err});
            } else {
                resolve({'success': true, 'code': '0000', 'msg': '获取所有流程成功', "data": result, "error": null});

            }
        });

    });
    return p;
};

/**
 * 获取对应流程的详细节点信息
 * @returns {Promise}
 */
exports.getProcDefineDetail = function (proc_code, proc_inst_task_code) {

    var p = new Promise(function (resolve, reject) {
        model.$ProcessDefine.find({"proc_code": proc_code}, function (err, result) {
            if (err) {
                console.log('获取流程信息失败', err);
                resolve({'success': false, 'code': '1000', 'msg': '获取流程详细信息失败', "error": err});
            } else {
                console.log('获取流程信息结果', result);
                //获取开始节点信息，因为第一节点为"开始"，所以这里获取第二节点"processDefineDiv_node_2"为开始节点
                if (result.length > 0) {
                    var resultData = {};
                    var nodesArray = [];
                    var proc_define = JSON.parse(result[0].proc_define);
                    var nodes = proc_define.nodes;
                    var lines = proc_define.lines;
                    var processDefineDiv_node;
                    //当前节点名称
                    var nodeName;
                    //是否是结束节点
                    var isEnd = false;
                    //开始节点
                    var start_node;
                    //开始处理节点，即开始节点的下一节点
                    var start_next_node;
                    //获取开始节点
                    for (var item in nodes) {
                        if (nodes[item].type == 'start  round') {
                            start_node = item;
                        }
                    }
                    //获取开始处理节点，即实际的开始节点
                    for (var item in lines) {
                        if (lines[item].from == start_node) {
                            start_next_node = lines[item].to;
                        }
                    }
                    console.log("实际开始节点start_next_node:", start_next_node);
                    //如果是发起工单
                    if (!proc_inst_task_code) {
                        proc_inst_task_code = start_next_node;
                        processDefineDiv_node = nodes[proc_inst_task_code];
                        nodeName = processDefineDiv_node.name;
                    } else {
                        //中间节点处理
                        processDefineDiv_node = nodes[proc_inst_task_code];
                    }
                    console.log("processDefineDiv_node：", processDefineDiv_node);
                    //类型为"chat"表示有分支,获取分支节点
                    if (processDefineDiv_node.type == 'chat') {

                        for (var item in lines) {
                            var line = lines[item];
                            //判断是否是第二节点的分支
                            if (line.from == proc_inst_task_code) {
                                var toNode = line.to;
                                //判断下一节点分支是否存在结束节点，如果存在则即可归档
                                if (nodes[toNode].type == 'end  round') {
                                    isEnd = true;
                                } else {
                                    nodesArray.push(nodes[line.from]);

                                }
                            }
                        }
                    }
                    //判断是否属于归档节点
                    if (isEnd) {
                        resultData.flag = "3";
                    } else if (proc_inst_task_code == start_next_node) {
                        //判断是否属于发起节点
                        resultData.flag = "1";
                        resultData.nodeName = nodeName;
                    } else {
                        //判断是否属于中间处理节点
                        resultData.flag = "2";
                    }
                    resolve({'success': true, 'code': '0000', 'msg': '获取流程详细信息成功', "data": resultData, "error": null});

                } else {
                    resolve({'success': false, 'code': '1001', 'msg': '获取流程详细信息失败', "error": "获取当前节点信息失败"});

                }

            }
        });

    });

    return p;
};

/**
 * 获取流程的详细处理界面
 * @param proc_code
 * @returns {Promise}
 */
exports.getViewUrl = function (proc_code) {

    var p = new Promise(function (resolve, reject) {
        //获取对应的字典
        dict_model.$.find({"dict_code": "order_detail_view"}, function (err, result) {
            if (err) {
                console.log('获取字典失败', err);
                reject({'success': false, 'code': '1000', 'msg': '获取字典失败', "error": err});
            } else {
                //只能是一个
                if (result.length == 1) {
                    var res = result[0];
                    var dictId = res._id;
                    //查找对应的界面配置
                    dict_model.$DictAttr.find({"dict_id": dictId}, function (err, result) {
                        if (err) {
                            console.log('获取字典失败', err);
                            reject({'success': false, 'code': '1001', 'msg': '获取字典失败', "error": err});
                        } else {
                            //获取所以对应流程的详细处理界面的配置信息
                            if (result.length > 0) {
                                for (let i = 0; i < result.length; i++) {
                                    var res = result[i];
                                    if (res.field_name == proc_code) {
                                        resolve({
                                            'success': true,
                                            'code': '0000',
                                            'msg': '获取流程详细信息成功',
                                            "data": res.field_value,
                                            "error": null
                                        });
                                        break;
                                    }
                                }

                            } else {
                                reject({'success': false, 'code': '1002', 'msg': '获取字典失败'});

                            }
                        }
                    })
                } else {
                    reject({'success': false, 'code': '1000', 'msg': '获取字典失败'});

                }
            }
        })


    });

    return p;
};
/**
 * 获取订单的详细信息
 * @param inst_id
 * @returns {Promise}
 */
exports.orderDetail = function (change_id, status) {

    var p = new Promise(function (resolve, reject) {
        //待办查询任务表，其它的查询实例表
        if (status == 2) {
            //获取对应的任务详情
            model.$ProcessInstTask.find({"_id": change_id}, function (err, result) {
                if (err) {
                    console.log('获取任务信息失败', err);
                    reject({'success': false, 'code': '1000', 'msg': '获取任务信息失败1', "error": err});
                } else {
                    if (result.length == 1) {
                        resolve({'success': true, 'code': '0000', 'msg': '获取任务信息成功', "data": result[0], "error": null});
                    } else {
                        reject({'success': false, 'code': '1000', 'msg': '获取任务信息失败2'});

                    }
                }
            })
        } else {
            //获取对应的工单详情
            model.$ProcessInst.find({"_id": change_id}, function (err, result) {
                if (err) {
                    console.log('获取工单信息失败', err);
                    reject({'success': false, 'code': '1000', 'msg': '获取工单信息失败3', "error": err});
                } else {
                    if (result.length == 1) {
                        resolve({'success': true, 'code': '0000', 'msg': '获取工单信息成功', "data": result[0], "error": null});
                    } else {
                        reject({'success': false, 'code': '1000', 'msg': '获取工单信息失败4'});

                    }
                }
            })
        }


    });

    return p;
};

/**
 * 回传
 * @param result1 结果
 * @param proc_code  流程编码
 * @param proc_inst_id 订单编码
 * @returns {Promise}
 */
exports.repare = function (result1, proc_code, proc_inst_id, memo) {

    return new Promise(async function (resolve, reject) {

        //如果是差错工单归档则进行回传黄河数据,注：暂时不回传和不对调
        if (result1.success && proc_code == 'p-201') {
            backHuangHe(proc_inst_id,memo).then(function (res) {
                resolve(res);
            }).catch(function (err) {
                reject(err);
            })

        } else if (result1.success && proc_code == 'p-109') {
            //预警工单归档回调雅典娜接口
            postChannel(proc_inst_id).then(function (res) {
                resolve(res);
            }).catch(function (err) {
                reject(err);
            })
        } else {
            resolve(result1);
        }


    });

};

/**
 * 调用黄河接口
 */
function postHuanghe(proc_inst_id, mistakeRes, memo, order_num) {
    return new Promise(function (resolve, reject) {

        var _id = mistakeRes[0]._id;
        var postData = {
            "jobId": order_num,
            "orderId":  mistakeRes[0].customer_code,
            "orderCode":mistakeRes[0].BOSS_CODE,
            "suggestion": memo,
            "crmTradeDate": mistakeRes[0].mistake_time
        };
        var options={};
        //1:表示不通过补录，11：表示通过补录，两个回传地址不同
        if(mistakeRes[0].status==1){
            options = config.repair_huanghe;
        }else if(mistakeRes[0].status==11){
            options = config.repair_pass_huanghe;
        }

        console.log(postData);
        //开始回传
        process_utils.httpPost(postData, options).then(function (rs) {
            // ret_code 对应关系：
            // -1 = 服务器异常
            //  0 = 补录成功
            //  1 = 补录失败
            //  2 = BOSS订单编码为空
            //  3 = 附件为空
            //  4 = 非法文件
            var conditions = {_id: _id};
            var update = {};
            var rs_json = JSON.parse(rs);
            if (rs_json.ret_code == 0) {
                update.status = 3;
                if(mistakeRes[0].status==1){
                    update.dispatch_remark = "不通过工单补录成功";
                }else if(mistakeRes[0].status==11){
                    update.dispatch_remark = "通过工单补录成功";
                }
            } else {
                update.status = 2;
                if(mistakeRes[0].status==1){
                    update.dispatch_remark = "不通过工单回传结果:" + rs_json.ret_msg;
                }else if(mistakeRes[0].status==11){
                    update.dispatch_remark = "通过工单回传结果:" + rs_json.ret_msg;
                }

            }
            //修改状态
            mistake_model.$ProcessMistake.update(conditions, update, {}, function (errors) {
                if (errors) {
                    reject({'success': false, 'code': '1000', 'msg': '修改回传黄河状态失败', "error": err});
                } else {
                    resolve({'success': true, 'code': '2000', 'msg': '回传黄河成功', "error": null});
                }
            });
        }).catch(function (err) {
            reject({'success': false, 'code': '1000', 'msg': '回传黄河失败', "error": err});
        });

    })
}


function postChannel(proc_inst_id) {
    return new Promise(function (resolve, reject) {
        //获取对应的工单详情
        model.$ProcessInst.find({"_id": proc_inst_id}, function (err, result) {
            if (err) {
                console.log('获取工单信息失败', err);
                reject({'success': false, 'code': '1000', 'msg': '获取工单信息失败', "error": err});
            } else {
                let warn_date = JSON.parse(result[0].proc_vars).time;
                //回传地址
                var options = config.repair_channel;
                //开始回传
                process_utils.httpPostChannel(proc_inst_id, warn_date, options).then(function (rs) {
                    resolve({'success': true, 'code': '1000', 'msg': '回传雅典娜', "error": null});
                }).catch(function (err) {

                    reject({'success': false, 'code': '1000', 'msg': '回传雅典娜失败', "error": err});
                });
            }
        })


    })
}


/**
 * 上传文件
 * @param files
 * @param task_id
 * @returns {Promise}
 */
exports.upload_images = function (files, task_id, user_name) {

    var p = new Promise(function (resolve, reject) {

        model.$ProcessInstTask.find({"_id": task_id}, function (err, res) {
            if (err) {
                reject({'success': false, 'code': '1000', 'msg': '获取任务信息错误', "error": null});
            } else {
                if (res.length == 1) {
                    let path = config.local_path + res[0].work_order_number;
                    //如果有上传文件
                    if (files && files.length > 0) {
                        //判断文件夹是否存在
                        fs.exists(path, function (exists) {
                            if (!exists)
                                fs.mkdir(path, function (err) {
                                    if (err)
                                        console.log("创建文件夹错误", err);
                                    else {
                                        var data = {};
                                        data.proc_task_id = task_id;
                                        data.proc_inst_id = res[0].proc_inst_id;
                                        data.proc_inst_task_code = res[0].proc_inst_task_code;
                                        if(res[0].proc_inst_task_type){
                                            data.proc_inst_task_type = res[0].proc_inst_task_type;
                                        }else{
                                            data.proc_inst_task_type = res[0].proc_inst_task_name;
                                        }

                                        data.user_name = user_name;
                                        data.proc_code = res[0].proc_code;
                                        data.proc_name = res[0].proc_name;
                                        for (let item in files) {
                                            let file = files[item];
                                            console.log("path:", file.path, file.originalname);
                                            fs.rename(file.path, path + "/" + file.originalname, function (err) {
                                                if (err)
                                                    console.log("文件移动错误", err);
                                                var datas = [];
                                                data.file_path = path + "/" + file.originalname;
                                                data.file_name = file.originalname;
                                                data.status = 0;
                                                data.insert_time = new Date();
                                                datas.push(data);
                                                //插入附件表
                                                process_extend_model.$ProcessTaskFile.create(datas, function () {
                                                    if (item == files.length - 1) {
                                                        resolve({
                                                            'success': true,
                                                            'code': '2000',
                                                            'msg': '节点流转成功',
                                                            "error": null
                                                        });

                                                    }
                                                })
                                            })
                                        }
                                    }
                                })
                            else {
                                var data = {};
                                data.proc_task_id = task_id;
                                data.proc_inst_id = res[0].proc_inst_id;
                                data.proc_inst_task_code = res[0].proc_inst_task_code;
                                if(res[0].proc_inst_task_type){
                                    data.proc_inst_task_type = res[0].proc_inst_task_type;
                                }else{
                                    data.proc_inst_task_type = res[0].proc_inst_task_name;
                                }
                                data.user_name = user_name;
                                data.proc_code = res[0].proc_code;
                                data.proc_name = res[0].proc_name;
                                for (let item in files) {
                                    let file = files[item];
                                    console.log("path:", file.path, file.originalname);
                                    fs.rename(file.path, path + "/" + file.originalname, function (err) {
                                        if (err)
                                            console.log("文件移动错误", err);
                                        var datas = [];
                                        data.file_path = path + "/" + file.originalname;
                                        data.file_name = file.originalname;
                                        data.status = 0;
                                        data.insert_time = new Date();
                                        datas.push(data);
                                        //插入附件表
                                        process_extend_model.$ProcessTaskFile.create(datas, function () {
                                            if (item == files.length - 1) {
                                                resolve({
                                                    'success': true,
                                                    'code': '2000',
                                                    'msg': '节点流转成功',
                                                    "error": null
                                                });

                                            }
                                        })
                                    })
                                }
                            }

                        })
                    } else {
                        resolve({'success': true, 'code': '2000', 'msg': '节点流转成功', "error": null});
                    }
                } else {
                    reject({'success': false, 'code': '1000', 'msg': '获取任务不存在', "error": null});
                }
            }
        })
    });

    return p;
};


/**
 * 获取附件日志
 * @param inst_id
 */
exports.fileLogs = function (inst_id) {
    return new Promise(function (resolve, reject) {
        process_extend_model.$ProcessTaskFile.find({"proc_inst_id": inst_id}, function (err, res) {
            if (err) {
                reject({'success': false, 'code': '1000', 'msg': '获取附件日志失败', "error": null});
            } else {
                var data = {"rows": res};
                resolve(data);
            }
        })
    });
}

/**
 * 复核已归档工单
 * @param inst_id
 * @param node
 * @param check_memo
 * @param user_name
 * @param user_no
 * @returns {Promise}
 */
exports.checkFile = function (inst_id, status,check_memo,user_name,user_no) {

    return new Promise(function (resolve, reject) {
        //0：表示复核通过，1：表示复核不通过
        console.log("status",status);
        if(status=='0'){
            model.$ProcessInst.find({_id:inst_id},function(err,res){
                if(res && res.length >0){
                    if(res[0].is_check=='0'){
                        resolve({'success': true, 'code': '2000', 'msg': '复核通过的工单不可重复复核！', "error": null})
                    }else{
                        let his={};
                        his.proc_name=res[0].proc_name;
                        his.proc_code=res[0].proc_code;
                        his.proc_task_start_user_role_names=res[0].proc_task_start_user_role_names;
                        his.proc_task_start_name=res[0].proc_task_start_name;
                        his.proc_vars=res[0].proc_vars;
                        his.proc_inst_task_remark='复核意见：复核通过';
                        his.proc_inst_task_sign=1;
                        his.proc_inst_task_assignee=user_no;
                        his.proc_inst_task_assignee_name=user_name;
                        his.proc_inst_task_status=1;
                        his.proc_inst_task_complete_time=new Date();
                        his.proc_inst_task_handle_time=new Date();
                        his.proc_inst_task_arrive_time=new Date();
                        his.proc_inst_task_title=res[0].proc_inst_task_title;
                        his.proc_inst_task_name='归档工单复核';
                        his.proc_inst_id=inst_id;
                        his.work_order_number=res[0].work_order_number;
                        model.$ProcessTaskHistroy.create(his,function(err,doc){
                            if(err){
                                reject({'success': false, 'code': '1000', 'msg': '复核失败00', "error": null})
                            }else{
                                model.$ProcessInst.update({_id:inst_id},{$set:{is_check:0,check_time:new Date(),check_user_no:user_no,check_user_name:user_name}},{},function(err){
                                    resolve({'success': true, 'code': '2000', 'msg': '复核成功', "error": null})
                                })
                            }
                        })
                    }
                }
            })

        }else{
            model.$ProcessTaskHistroy.find({"proc_inst_id":inst_id},function(err,res){
                if(err || res.length == 0){
                    reject({'success': false, 'code': '1000', 'msg': '复核失败0', "error": null})
                }else{
                    let task_history={};
                    let task_arr=[];
                    //获取复核的节点信息
                    for(let i in res){
                        let his=JSON.parse(JSON.stringify(res[i]));
                        delete his["_id"];
                        task_arr.push(his);
                        if(his.proc_inst_task_type=='厅店处理回复'){
                            task_history=res[i];
                        }
                    }

                    //修改工单状态，将归档工单改为处理中，已经新增复核字段
                    model.$ProcessInst.update({_id:inst_id},{$set:{is_check:1,proc_inst_status:2,check_time:new Date(),check_user_no:user_no,check_user_name:user_name,proc_cur_task:'processDefineDiv_node_3',proc_cur_task_name : "厅店处理回复"}},{},function(err){
                        let history={};
                        history.proc_inst_task_assignee=user_no;
                        history.proc_inst_task_assignee_name=user_name;
                        history.proc_inst_task_remark="复核意见:"+check_memo;
                        history.proc_inst_task_status=1;
                        history.joinup_sys=task_history.joinup_sys;
                        history.proc_name=task_history.proc_name;
                        history.proc_code=task_history.proc_code;
                        history.proc_task_start_user_role_names=task_history.proc_task_start_user_role_names;
                        history.proc_task_start_name=task_history.proc_task_start_name;
                        history.proc_vars=task_history.proc_vars;
                        history.proc_inst_task_title=task_history.proc_inst_task_title;
                        history.proc_inst_task_complete_time=new Date();
                        history.proc_inst_task_handle_time=new Date();
                        history.proc_inst_task_arrive_time=new Date();
                        history.proc_inst_id=task_history.proc_inst_id;
                        history.proc_task_start_user_role_code=task_history.proc_task_start_user_role_code;
                        history.proc_inst_task_name ="归档工单复核"
                        history.work_order_number =task_history.work_order_number
                        task_arr.push(history)


                        task_history.proc_inst_task_status=0;
                        task_history.proc_inst_task_remark='';
                        task_history=JSON.parse(JSON.stringify(task_history))
                        delete task_history["_id"];
                        task_history.proc_inst_task_complete_time=new Date();
                        task_history.proc_inst_task_handle_time=new Date();
                        task_history.proc_inst_task_arrive_time=new Date();
                        task_arr.push(task_history);
                        console.log(task_arr);
                        //将历史表的中记录重新插入任务表，表示此工单重新处理
                        model.$ProcessInstTask.create(task_arr,function(err){
                            console.log(err);
                            if(err){
                                reject({'success': false, 'code': '1000', 'msg': '复核失败1', "error": null})
                            }else{
                                model.$ProcessTaskHistroy(history).save(function(err){
                                    if(err){
                                        reject({'success': false, 'code': '1000', 'msg': '复核失败2', "error": null})
                                    }else{
                                        resolve({'success': true, 'code': '2000', 'msg': '复核成功', "error": null})
                                    }
                                })
                            }

                        })


                    })
                }


            })
        }


    })
}
/**
 * 上传文件
 * @param files
 * @param fileID
 * @returns {Promise}
 */
exports.again_images = function (files, inst_id, user_name) {

    var p = new Promise(function (resolve, reject) {

        //如果有上传文件
        if (files && files.length > 0) {

            model.$ProcessInst.find({"_id": inst_id}, function (err, res) {
                if (err) {
                    reject({'success': false, 'code': '1000', 'msg': '获取任务信息错误', "error": null});
                } else {
                    if (res.length == 1) {
                        let path = config.local_path + res[0].work_order_number;
                        //判断文件夹是否存在
                        fs.exists(path, function (exists) {
                            if (!exists) {
                                fs.mkdir(path, function (err) {
                                    if (err)
                                        console.error(err);
                                    else {
                                        var data = {};
                                        data.proc_task_id = new mongoose.Types.ObjectId('000000000000');
                                        data.proc_inst_id = inst_id;
                                        data.proc_inst_task_code = '补传附件';
                                        data.proc_inst_task_type = '补传附件';
                                        data.user_name = user_name;
                                        data.proc_code = res[0].proc_code;
                                        data.proc_name = res[0].proc_name;
                                        for (let item in files) {
                                            let file = files[item];
                                            console.log("path:", file.path, file.originalname, path);
                                            fs.rename(file.path, path + "/" + file.originalname, function (err) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    var datas = [];
                                                    data.file_path = path + "/" + file.originalname;
                                                    data.file_name = file.originalname;
                                                    data.status = 0;
                                                    data.insert_time = new Date();
                                                    datas.push(data);
                                                    console.log(datas);
                                                    //插入附件表
                                                    process_extend_model.$ProcessTaskFile.create(datas, function (err) {
                                                        if (err) {
                                                            reject({
                                                                'success': false,
                                                                'code': '1000',
                                                                'msg': '节点流转成功，但附件上传失败',
                                                                "error": null
                                                            });
                                                        } else {
                                                            if (item == files.length - 1) {
                                                                resolve({
                                                                    'success': true,
                                                                    'code': '2000',
                                                                    'msg': '节点流转成功',
                                                                    "error": null
                                                                });

                                                            }
                                                        }
                                                    })
                                                }

                                            });
                                        }
                                    }
                                });
                            } else {
                                var data = {};
                                data.proc_task_id = new mongoose.Types.ObjectId('000000000000');
                                data.proc_inst_id = inst_id;
                                data.proc_inst_task_code = '补传附件';
                                data.proc_inst_task_type = '补传附件';
                                data.user_name = user_name;
                                data.proc_code = res[0].proc_code;
                                data.proc_name = res[0].proc_name;
                                for (let item in files) {
                                    let file = files[item];
                                    console.log("path:", file.path, file.originalname, path);
                                    fs.rename(file.path, path + "/" + file.originalname, function (err) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var datas = [];
                                            data.file_path = path + "/" + file.originalname;
                                            data.file_name = file.originalname;
                                            data.status = 0;
                                            data.insert_time = new Date();
                                            datas.push(data);
                                            console.log(datas);
                                            //插入附件表
                                            process_extend_model.$ProcessTaskFile.create(datas, function (err) {
                                                if (err) {
                                                    reject({
                                                        'success': false,
                                                        'code': '1000',
                                                        'msg': '节点流转成功，但附件上传失败',
                                                        "error": null
                                                    });
                                                } else {
                                                    if (item == files.length - 1) {
                                                        resolve({
                                                            'success': true,
                                                            'code': '2000',
                                                            'msg': '节点流转成功',
                                                            "error": null
                                                        });

                                                    }
                                                }
                                            })
                                        }

                                    });
                                }
                            }
                        });

                    } else {
                        reject({'success': false, 'code': '1000', 'msg': '获取任务不存在', "error": null});
                    }
                }
            })


        } else {
            resolve({'success': true, 'code': '2000', 'msg': '节点流转成功', "error": null});
        }


    });

    return p;
}

/**
 * 标记客户不配合的工单
 * @param id,memo ,result1
 */
exports.updateInstTask = function (id,memo,result1) {
    return new Promise(async function (resolve, reject) {
        if (id) {
            let res = await model.$ProcessTaskHistroy.find({proc_task_id: id});
            await model.$ProcessInst.update({_id:res[0].proc_inst_id},{$set: {proc_inst_status: 7,proc_cur_task_remark:memo}});
            resolve(result1)
        }
    })
}
/**
 * 重置超时时间
 * @param result1
 */
exports.updateOvertime = function (result1) {

    return new Promise(async function (resolve, reject) {
        if (result1.success) {
            let data = result1.data[0];

            //获取任务id
            let _id = data._id;
            let proc_vars = JSON.parse(data.proc_vars);
            let work_day = parseInt(proc_vars.work_day);
            //获取实例id
            let proc_inst_id = data.proc_inst_id;

            let inset_result= await  model.$ProcessInst.find({_id:proc_inst_id});
            //如果工单未超时，则重置处理时间
            if(inset_result[0].is_overtime==0){
                //任务到达时间即为超时时间的开始时间
                let proc_inst_task_arrive_time = moment(new Date(data.proc_inst_task_arrive_time)).format('YYYY-MM-DD HH:mm:ss');

                console.log(proc_inst_task_arrive_time);
                //到达时间+工作天数=结束时间
                let end_time = moment(new Date(new Date(new Date(data.proc_inst_task_arrive_time)
                    .setDate(new Date(data.proc_inst_task_arrive_time)
                        .getDate() + work_day))))
                    .format('YYYY-MM-DD HH:mm:ss');
                //重新修改流程参数
                proc_vars.start_time = proc_inst_task_arrive_time;
                proc_vars.end_time = end_time;

                proc_vars = JSON.stringify(proc_vars)
                let conditions = {_id: proc_inst_id};
                let update = {$set: {proc_vars: proc_vars}};
                let options = {};
                await  model.$ProcessInst.update(conditions, update, options);
                conditions = {_id: _id};
                await model.$ProcessInstTask.update(conditions, update, options);

            }
            resolve(result1)

        }
    })
}

/**
 * 重新回传黄河
 * @param result1
 * @returns {Promise}
 */
exports.doBackOrder = function (status, queryDate, city_code) {

    return new Promise(function (resolve, reject) {
        let match={"status": status};
        if(queryDate){
            match.mistake_time=queryDate.replace(/\-/g,'');
        }
        if(city_code){
            match.city_code=city_code
        }

        mistake_model.$ProcessMistake.find(match,function(err,resMis){
            let count = 0;
            if(resMis.length ==0){
                resolve({'success': true, 'code': '1000', 'msg': '无回传数据', "error": null});
                return;
            }

            for(let i = 0;i < resMis.length; i++)
                model.$ProcessTaskHistroy.find({"proc_inst_id":resMis[i].proc_inst_id},function(err,res){
                backHuangHe(resMis[i].proc_inst_id,res[0].proc_inst_task_remark,ftp_util).then(function (res) {
                    count++;
                    if(count == resMis.length ){
                        resolve({'success': true, 'code': '1000', 'msg': '回传成功', "error": null});

                    }
                }).catch(function (err) {
                    count++;
                    if(count == resMis.length ){
                        resolve({'success': true, 'code': '1000', 'msg': '回传成功', "error": null});

                    }
                })
            }).sort({"proc_inst_task_arrive_time":-1}).limit(1)


        })




    })
}


function backHuangHe(proc_inst_id,memo) {

    return new Promise(async function (resolve, reject) {
        //获取附件信息
        let fileRes = await  process_extend_model.$ProcessTaskFile.find({"proc_inst_id": proc_inst_id});
        //获取差错工单信息
        let mistakeRes = await  mistake_model.$ProcessMistake.find({"proc_inst_id": proc_inst_id});
        if (mistakeRes.length == 0) {
            reject({'success': false, 'code': '1000', 'msg': '不存在的差错工单', "error": null});
            return;
        }
        let res = await model.$ProcessInst.find({"_id": proc_inst_id});
        if (res.length == 0) {
            reject({'success': false, 'code': '1000', 'msg': '不存在的工单', "error": null});
            return;
        }
        var order_num = res[0].work_order_number;
        //如果有上传附件
        if (fileRes.length > 0) {
            //文件上传至ftp服务器，然后回传结果给黄河
            var server = config.sftp_huanghe_server;
            var mistake_time = mistakeRes[0].mistake_time;
            var path = config.sftp_huanghe_put + "/" + mistake_time.substring(0, 4) + "/" + mistake_time.substring(4, 6) + "/" + mistake_time.substring(6, 8) + "/" + order_num;
            sshClient.mkFile(server,path, function (err, res) {
                if (err) {
                    console.log(err);
                    reject({'success': false, 'code': '1000', 'msg': 'sftp创建文件夹失败', "error": err});
                } else {
                    var count = 0;
                    //将当前工单的附件传到sftp上
                    for (let index = 0; index < fileRes.length; index++) {
                        sshClient.UploadFile(server,fileRes[index].file_path, path + "/" + fileRes[index].file_name, function (err, resFile) {
                            var conditions = {_id: fileRes[index]._id};
                            var update = {};
                            if (err) {
                                console.log(err);
                                update.status = -1;
                            } else {
                                count++;
                                update.status = 1;
                                //全部上传成功则回调黄河接口
                                if (count == fileRes.length) {
                                    postHuanghe(proc_inst_id, mistakeRes, memo, order_num).then(function (res) {
                                        resolve(res);
                                    }).catch(function (err) {
                                        reject(res);
                                    })
                                }
                            }
                            //修改状态
                            process_extend_model.$ProcessTaskFile.update(conditions, update, {}, function (errors) {
                            });
                        });
                    }
                }
            })

        } else {
            postHuanghe(proc_inst_id, mistakeRes, memo, order_num).then(function (res) {
                resolve(res);
            }).catch(function (err) {
                reject(res);
            })
        }

    })
}


