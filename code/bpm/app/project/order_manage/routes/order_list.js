var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_list_service');
var inst = require('../../bpm_resource/services/instance_service');
var nodeTransferService = require("../../bpm_resource/services/node_transfer_service");
var userService = require('../../workflow/services/user_service');
var nodeAnalysisService = require("../../bpm_resource/services/node_analysis_service");
var config = require('../../../../config');
var multer = require('multer')
var upload = multer({dest: config.local_path});
var process_extend_model = require('../../bpm_resource/models/process_extend_model');
var fs = require('fs');
var path = require('path');
var urlencode = require('urlencode');
/**
 * 工单列表
 */
router.route('/list').post(function (req, res) {
    console.log(req.session.current_user);
    console.log("开始获取所有工单列表...");
    var userNo = req.session.current_user.user_no;//用户编号
    var page = req.body.page;
    var size = req.body.rows;
    var work_order_number = req.body.work_order_number;

    var proc_code = req.body.proc_code;//流程编码
    var startDate = req.body.startDate;//创建时间
    var endDate = req.body.endDate;//创建时间
    var conditionMap = {proc_start_user: userNo};
    if (proc_code) {
        conditionMap.proc_code = proc_code;
    }
    if (work_order_number) {
        conditionMap.work_order_number = work_order_number;
    }
    var compare = {};
    //开始时间
    if (startDate) {
        compare['$gte'] = new Date(startDate);
    }
    //结束时间
    if (endDate) {
        //结束时间追加至当天的最后时间
        compare['$lte'] = new Date(endDate + ' 23:59:59');
    }
    //时间查询
    if (!isEmptyObject(compare)) {
        conditionMap['proc_start_time'] = compare;
    }


    // 调用分页
    service.getOrderListPage(page, size, conditionMap)
        .then(function (result) {
            console.log("获取所有工单列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function (err) {
            console.log('获取所有工单列表失败', err);

        });
})

//导出所有工单列表
/*router.route('/export_excel').get(function (req,res) {
    service.getAllOrder( )
        .then(service.createExcelOrderList)
        .then(excelBuf=>{
            console.log('excelBuf1====>',excelBuf);
        const date = new Date();
    const filename =
        date.getFullYear() + '-' +(date.getMonth() + 1) + '-' + date.getDate();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + filename + '.xlsx'
    );
    res.end(excelBuf, 'binary');
})
.catch(e=>{
        console.log('ERROR: export_excel');
    console.error(e);
    utils.respJsonData(res, {
        error: '服务器出现了问题，请稍候再试'
    });
})

});*/
/**
 * 工单类型即所有流程
 */
router.route('/proBase').get(function (req, res) {
    console.log("开始获取工单类型下拉框.......");
    service.getAllProBase()
        .then(function (result) {
            console.log("获取下拉框结果:", result.success);
            if (result.success) {
                utils.respJsonData(res, result.data);
            }
        })
        .catch(function (err) {
            console.log('获取下拉框失败', err);

        });
})

/**
 * 获取对应流程的第二节点信息，即发起工单的开始节点信息
 */
router.route('/procDefineDetail').post(function (req, res) {
    //流程编码
    var proc_code = req.body.proc_code;
    console.log(proc_code);
    if (!proc_code) {
        utils.respMsg(res, false, '2001', '流程编码不能为空。', null, null);
        return;
    }
    //节点信息
    var node_code = req.body.node_code;
    if (!node_code) {
        utils.respMsg(res, false, '2001', '节点编码不能为空。', null, null);
        return;
    }
    nodeAnalysisService.getNodeDetail(proc_code, node_code).then(function (rs) {
        console.log("当前节点操作信息:", rs);
        utils.respJsonData(res, rs);
    }).catch(function (err_inst) {
        // console.log(err_inst);
        logger.error("route-getProcHandlerLogsList", "获取数据异常", err_inst);
        utils.respMsg(res, false, '1000', '获取数据异常', null, err_inst);
    });
})


/**
 * 获取下一步节点或者操作人
 */

router.route("/nextNodeUser").post(function (req, res) {
    console.log("开始获取下一节点处理人...");
    var node_code = req.body.node_code;
    var proc_task_id = req.body.proc_task_id;
    var proc_inst_id = req.body.proc_inst_id;
    var user_no = req.session.current_user.user_no;
    var params_str = req.body.params;
    var params = {};
    if (params_str) {
        params = JSON.parse(params_str);
    }
    nodeAnalysisService.getNextNodeAndHandlerInfo(node_code, proc_task_id, proc_inst_id, params, user_no).then(function (rs) {
        console.log("下一节点处理人:", rs);
        utils.respJsonData(res, rs);
    });
});


/**
 * 指派任务
 */

router.post('/assignTask', upload.array("images"), function (req, res, next) {
    console.log("开始分配任务...")
    //文件路径
    var files = req.files;
    var task_id = req.body.proc_task_id;
    var node_code = req.body.next_code;
    var user_no = req.session.current_user.user_no;
    var assign_user_no = req.body.assign_user_no;
    var proc_title = req.body.proc_inst_task_title;
    var biz_vars = req.body.biz_vars;//业务变量
    var proc_vars = req.body.proc_vars;//流程变量
    var memo = req.body.memo;//流程变量
    if (task_id) {
        nodeTransferService.assign_transfer(task_id, node_code, user_no, assign_user_no, proc_title, biz_vars, proc_vars, memo).then(function (rs) {
            if (rs.success) {
                service.upload_images(files, task_id).then(function (result) {
                    utils.respJsonData(res, result);
                }).catch(function (err) {
                    utils.respMsg(res, false, '1000', '上传附件失败', null, err);
                })
            } else {
                //删除文件
                for (let item in files) {
                    let file = files[item];
                    fs.unlinkSync(file.path);
                }
                utils.respJsonData(res, rs);
            }
        }).catch(function (err) {
            utils.respMsg(res, false, '1000', 'rouute-assign/task', null, err);
        });
    } else {
        utils.respMsg(res, false, '1000', '任务ID为空', null, null);
    }

});

/**
 * 完成任务
 */
router.post('/complete', function (req, res, next) {
    console.log("开始完成任务...");
    // var files=req.files;
    var id = req.body.proc_task_id;//任务id
    var memo = req.body.memo;//处理意见
    var user_code = req.session.current_user.user_no;//处理人编码
    var handle = req.body.handle;//操作
    var params = "";//流转参数
    //通过或者归档
    if (handle == '1') {
        params = '{\"flag\":true}';
        // params.flag=true;
    } else if (handle == '0') {
        params = '{\"flag\":false}';
        //params.flag=false;
    }
    var biz_vars;
    var proc_vars;
    // 任务是否为空
    if (!id) {
        utils.respJsonData(res, false, '2001', '任务ID不能为空。', null, null);
        return;
    }


    inst.proving_Id(id).then(function (rs) {
        if (rs.success && rs.data[0].proc_inst_task_status == 1) {
            utils.respMsg(res, false, '0000', '任务已完成不能重复完成', null, null);
            return;
        } else {
            try {
                if (!user_code) {
                    utils.respMsg(res, false, '2001', '处理人编码不能为空。', null, null);
                    return;
                } else {
                    //判断用户是否存在
                    inst.userInfo(user_code).then(function (rs) {
                        if (rs.success && rs.data.length == 1) {
                            inst.getTaskById(id).then(function (taskresult) {

                                if (taskresult.success) {
                                    var node_code = taskresult.data._doc.proc_inst_task_code;
                                    var proc_inst_id = taskresult.data.proc_inst_id;
                                    var proc_code = taskresult.data.proc_code;
                                    //流程流转方法

                                    console.log(id, node_code, user_code, true, memo, params, biz_vars, proc_vars);
                                    console.info(params)
                                    nodeTransferService.transfer(id, node_code, user_code, true, memo, params, biz_vars, proc_vars).then(function (result1) {
                                        console.log(result1);
                                        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", id, node_code, user_code, true, memo, params)

                                        //归档时,回传黄河数据
                                        if (handle == 1) {
                                            service.repare(result1, proc_code, proc_inst_id, memo).then(function (result) {
                                                utils.respJsonData(res, result);
                                            }).catch(function (err) {
                                                utils.respJsonData(res, err);
                                            })
                                        } else {
                                            //拒绝时，重置超时时间
                                            service.updateOvertime(result1).then(function () {
                                                utils.respJsonData(res, result1);
                                            }).catch(function (err) {
                                                utils.respJsonData(res, err);
                                            })

                                        }

                                    }).catch(function (err_inst) {
                                        // console.log(err_inst);
                                        console.log("route-transfer", "流程流转异常", err_inst);
                                        utils.respMsg(res, false, '1000', '流程流转异常', null, err_inst);
                                    });
                                } else {
                                    utils.respJsonData(res, taskresult);
                                }
                            }).catch(function (err_inst) {
                                console.log("route-getTaskById", "获取任务异常", err_inst);
                                utils.respMsg(res, false, '1000', '获取任务异常', null, err_inst);
                            });
                        } else {
                            utils.respMsg(res, false, '1000', '用户不存在', null, null);
                        }
                    });
                }
            } catch (e) {
                utils.respMsg(res, false, '1000', '查询错误', null, e);
            }
        }
    });

});

/**
 * 针对不同的流程展示不同的流程详细界面
 */
router.get('/showDetailView', function (req, res, next) {

    var proc_code = req.query.proc_code;
    //获取字典中配置对应流程的详proc_code细处理界面
    service.getViewUrl(proc_code)
        .then(function (result) {

            if (result.success) {
                //界面跳转
                res.render(config.project.appviewurl + result.data, {
                    title: '首页',
                    subtitle: 'Hello',
                    layout: 'themes/admin/layout',
                });
            }
        })
        .catch(function (err) {
            console.log('获取字典信息失败', err);

        });

});

/**
 * 获取工单的详细信息
 */
router.post('/orderDetail', function (req, res) {
    console.log("开始获取工单详情...");
    //状态1:已发起的工单,2：我的待办,3:我的已办
    var status = req.body.status;
    //状态为1和3时，此为实例ID；状态为2时，为任务id
    var change_id = req.body.change_id;
    var user_name = req.session.current_user.user_name;//处理人姓名
    //获取对应的详情数据
    service.orderDetail(change_id, status)
        .then(function (result) {
            result.userName = user_name;
            console.log(result);
            utils.respJsonData(res, result);
        })
        .catch(function (err) {
            console.log('获取字典信息失败', err);

        });

});


router.post('/fileLogs', function (req, res) {
    console.log("开始附件日志...");
    var inst_id = req.body.inst_id;

    //获取对应的详情数据
    service.fileLogs(inst_id)
        .then(function (result) {
            utils.respJsonData(res, result);
        })
        .catch(function (err) {
            console.log('附件日志失败', err);

        });

});

router.get('/download/:fileID', function (req, res, next) {
    console.log("开始下载...");
    // 实现文件下载
    var fileID = req.params.fileID;
    process_extend_model.$ProcessTaskFile.find({"_id": fileID}, function (err, result) {
        if (err) {
            utils.respJsonData(res, "下载文件失败");
        } else {
            if (res.length = 1) {
                var filePath = result[0].file_path;
                var fileName = result[0].file_name;
                console.log(fileName);
                fs.exists(filePath, function (exists) {
                    if (exists) {
                        var stats = fs.statSync(filePath);
                        if (stats.isFile()) {
                            res.set({
                                'Content-Type': 'application/octet-stream',
                                'Content-Disposition': 'attachment;filename=' + urlencode(fileName),
                                'Content-Length': stats.size
                            });
                            fs.createReadStream(filePath).pipe(res);
                        } else {
                            res.end(404);
                        }
                    }
                })

            } else {
                utils.respJsonData(res, "下载文件失败");
            }
        }
    })

});

/**
 * 上传附件
 */
router.post('/uploadFile', upload.array("file"), function (req, res, next) {
    console.log("开始上传...");
    // 实现文件上传
    //状态为1表示新增附件，状态为0表示补传
    var status = req.body.status;
    //状态为1表示实例id，状态为0表示附件id
    var change_id = req.body.proc_task_id;
    console.log("status", status, "change_id", change_id);
    var files = req.files;
    var user_name = req.session.current_user.user_name;//处理人姓名
    console.log(user_name);
    service.upload_images(files, change_id, user_name).then(function (result) {
        utils.respJsonData(res, result);
    }).catch(function (err) {
        utils.respMsg(res, false, '1000', '上传失败', null, err);
    })
    /*    if (status == 1) {
            service.upload_images(files, change_id).then(function (result) {
                utils.respJsonData(res, result);
            }).catch(function (err) {
                utils.respMsg(res, false, '1000', '上传失败', null, err);
            })
        } else {
            var user_name = req.session.current_user.user_name;//处理人姓名
            service.again_images(files, change_id, user_name).then(function (result) {
                utils.respJsonData(res, result);
            }).catch(function (err) {
                utils.respMsg(res, false, '1000', '上传失败', null, err);
            })
        }*/


});


router.post('/deleteFile', function (req, res) {
    console.log("开始删除附件...");
    var id = req.body.id;
    process_extend_model.$ProcessTaskFile.find({"_id": id}, function (err, result) {
        if (err) {
            utils.respJsonData(res, {success: false});
        } else {
            fs.exists(result[0].file_path, function (exists) {
                if (exists) {
                    fs.unlink(result[0].file_path, function (err) {
                        if (err) throw err;
                        process_extend_model.$ProcessTaskFile.remove({"_id": id}, function (err, result) {
                            if (err) {
                                utils.respJsonData(res, {success: false});
                            } else {
                                utils.respJsonData(res, {success: true});
                            }
                        });
                    })
                } else {
                    process_extend_model.$ProcessTaskFile.remove({"_id": id}, function (err, result) {
                        if (err) {
                            utils.respJsonData(res, {success: false});
                        } else {
                            utils.respJsonData(res, {success: true});
                        }
                    });
                }
            })

        }
    });


});

function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}

module.exports = router;
