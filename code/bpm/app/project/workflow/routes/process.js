var express = require('express');
var router = express.Router();
//var processService = require('../../../bpm/services/bpm_service');
var model = require('../../bpm_resource/models/process_model');
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../../bpm_resource/services/instance_service');
var proc = require('../services/process_service');
var user = require('../services/user_service');
var dict = require('../services/dict_service');
var logger = require('../../../../lib/logHelper').helper;
var config = require('../../../../config');




/**
 * 根据字典编号查询字典数据
 */
router.route('/dict')
    // -------------------------------query查询字典数据-------------------------------
    .get(function(req,res){
        // 分页条件
        var dict_code = req.query.dict_code;
        if(!dict_code){
            utils.respMsg(res, false, '2001', '字典编码不能为空。', null, null);
            return;
        }
        // 调用
        dict.getDictSelectData(dict_code)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                console.log('err');
                console.log(err);
            });

    });


/*router.get('/', function(req, res, next) {
    utils.authentication(req,res);
    res.render('bpm/process/process', {
        title: '首页' ,
        subtitle: 'Hello',
        appuri: '/bpm',
        layout:'themes/admin/layout_v1',
        //menuid:'/home',
    });

});

router.get('/flow.html', function(req, res, next) {

    res.render('bpm/process/flow', {
        title: '首页' ,
        subtitle: 'Hello',
        layout:'themes/admin/blank',
        //menuid:'/home',
    });

});
*/
router.get('/process_chart', function(req, res, next) {

    res.render(config.project.appviewurl+'common/app/process_chart', {
        title: '首页' ,
        subtitle: 'Hello',
        layout:'themes/admin/blank',
        //menuid:'/home',
    });

});

//展示流程进程
router.get('/show/progressed', function(req, res, next) {

    res.render('bpm/process/process_showChart', {
        title: '首页' ,
        subtitle: 'Hello',
        layout:'themes/admin/blank',
        //menuid:'/home',
    });
});


router.route('/processChangeStatus/:id')
    // -------------------------------启用、禁用操作-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//流程基本属性id
        var value = req.body.proc_status;
        var flag = req.body.flag;

        // 调用启用、禁用方法
        proc.processChangeStatus(id, value, flag, function(result) {
            utils.respJsonData(res, result);
        });
    });
//
//
//
router.route('/process')

    // -------------------------------query查询流程基本属性列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var filterParam1 = req.query.filterParam1;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        if(filterParam1){
            conditionMap['$or'] = [{'proc_code':new RegExp(filterParam1)},{'proc_name':new RegExp(filterParam1)}];
        }

        proc.getProcessList4Page()
            .then(function(result){

                utils.respJsonData(res, result);

            })
            .catch(function(err){
                console.log('err');
                console.log(err);
                logger.error("route-query","查询流程基本属性",err);
            });

    });




router.route('/procbase')
    // -------------------------------query查询流程基本属性列表不分页-------------------------------
    .get(function(req,res){
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

      // 分页条件
        var filterParam1 = req.query.filterParam1;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        var conditionMap = {};
        if(filterParam1){
            conditionMap['$or'] = [{'proc_code':new RegExp(filterParam1)},{'proc_name':new RegExp(filterParam1)}];
        }

        proc.getProcessList(page, length, conditionMap)
            .then(function(result){
console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                utils.respJsonData(res, result);

            })
            .catch(function(err){
                console.log('err');
                console.log(err);
                logger.error("route-query","查询流程基本属性",err);
            });


    })
    // -------------------------------create添加流程基本属性-------------------------------
    .post(function(req,res) {
        // 获取提交信息
        var proc_code = req.body.proc_code;//流程编码
        var proc_name = req.body.proc_name;//流程名
        var catalog = req.body.catalog;//流程类别
        var memo = req.body.memo;//流程备注

        // 验证流程名是否为空
        if (!proc_name) {
            utils.respMsg(res, false, '2001', '流程名不能为空。', null, null);
            return;
        }
        // 验证流程编码是否为空
        if (!proc_code) {
            utils.respMsg(res, false, '2002', '流程编码不能为空。', null, null);
            return;
        }
        proc.createProcess(proc_code, proc_name, catalog, memo)
            .then(function (result) {
                utils.respJsonData(res, result);
            })
            .catch(function (err) {
                // utils.respJsonData(res, err);
                logger.error("route-post","添加流程基本属性",err);
            });
    });


router.route('/procbase/:id')
    // -------------------------------update修改流程基本属性信息-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//流程基本属性id
        //console.log(req.body.proc_code);
        var proc_code = req.body.proc_code;//流程编码
        var proc_name = req.body.proc_name;//流程名
        // 验证流程名是否为空
        if(!proc_name) {
            utils.respMsg(res, false, '2001', '流程名不能为空。', null, null);
            return;
        }
        // 验证流程编码是否为空
        if(!proc_code) {
            utils.respMsg(res, false, '2002', '流程编码不能为空。', null, null);
            return;
        }
        proc.checkCode(1,proc_code,id).then(function (result) {
            if(result.success){
                //构造流程基本属性信息保存参数
                var processBaseEntity = {};
                processBaseEntity.proc_code = proc_code;
                processBaseEntity.proc_name = proc_name;
                processBaseEntity.opt_time = new Date();
                processBaseEntity.opt_user = '';//req.session.current_user.user_name;
                // 调用修改方法
                proc.updateProcessBase(id, processBaseEntity).then(function(result2) {
                    var processDefineEntity = {};
                    processDefineEntity.proc_code = proc_code;//流程编码
                    processDefineEntity.proc_name = proc_name;//流程名称
                    processDefineEntity.opt_time = new Date();
                    processDefineEntity.opt_user = '';//req.session.current_user.user_name;
                    var conditionMap = {};
                    if(id){
                        conditionMap.proc_id = id;
                    }
                    //修改流程定义基本信息
                    proc.updateProcessDefineByConditions({'proc_id':id}, processDefineEntity).then(function(result1) {
                        if(result1.success){
                            var processItemEntity = {};
                            processItemEntity.proc_code = proc_code;//流程编码
                            proc.getProcessDefineList(1,100,conditionMap).then(function(result1){
                                    if(result1.rows.length > 0){
                                        var i = 0;
                                        //防止异步respJsonData时报错：Can't set headers after they are sent. 的问题
                                        updateDefineItemProCodeByFor(i,result1.rows,processItemEntity.proc_code,res);
                                    }
                                })
                                .catch(function(err){
                                    console.log('err');
                                    console.log(err);
                                    logger.error("route-put","修改流程基本属性",err);
                                });
                        }else{
                            logger.error("route-put","修改流程基本属性",{'success':false, 'code':'1000', 'msg':'修改失败'});
                            utils.respJsonData(res, {'success':false, 'code':'1000', 'msg':'修改失败'});
                        }
                    }).catch(function(err){
                        console.log('err');
                        console.log(err);
                        logger.error("route-put","修改流程基本属性",err);
                    });
                }).catch(function(err){
                    console.log('err');
                    console.log(err);
                    logger.error("route-put","修改流程基本属性",err);
                });
            }else{
                utils.respJsonData(res, result);
            }
        }).catch(function(err){
            console.log('err');
            console.log(err);
            logger.error("route-put","修改流程基本属性",err);
        });
    });
/**
 * 防止异步respJsonData时报错：Can't set headers after they are sent
 * @param i
 * @param arr
 * @param proc_code
 * @param res
 */
function updateDefineItemProCodeByFor(i,arr,proc_code,res){
    var itemArray = [];
    if(arr && i<arr.length){
        var ic = JSON.parse(arr[i]._doc.item_config);//取出该流程定义的节点配置信息json对象
        for(var j=0;j<ic.length;j++){
            ic[j].proc_code = proc_code;
            itemArray.push(ic[j]);
        }
        var itemjsonstr = JSON.stringify(itemArray);//将修改后的节点配置中的流程编号数据转换成json字符串
        arr[i]._doc.item_config = itemjsonstr;
        // 调用修改方法
        proc.updateProcessDefine(arr[i]._doc._id, arr[i]._doc).then(function(result4) {
            if(arr.length-1 == i){
                utils.respJsonData(res, {'success':true, 'code':'0000', 'msg':'修改流程信息成功'});
            }
            updateDefineItemProCodeByFor(++i,arr,proc_code,res);
        }).catch(function(err){
            console.log('err');
            console.log(err);
            logger.error("route-put","修改流程定义",err);
        });
    }
}

router.route('/versionStatus/:id')
    // -------------------------------启用、禁用操作-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//流程基本属性id
        var value = req.body.proc_status;
        var flag = req.body.flag;

        // 调用启用、禁用方法
        proc.processChangeStatus(id, value, flag, function(result) {
            utils.respJsonData(res, result);
        });
    });
//
/**
 * 流程版本
 */
router.route('/version')
    // -------------------------------query查询流程定义内容列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var filterParam2 = req.query.filterParam2;
        var proc_id = req.query.proc_id;
        var _id = req.query.id;
        // 分页参数
        var page = req.query.page;
        if(page==0){
            page=1;
        }
        var length = req.query.rows;

        var conditionMap = {};
        if(filterParam2){
            conditionMap.proc_code = filterParam2;
        }
        if(proc_id){
            conditionMap.proc_id = proc_id;
        }
        if(_id){
            conditionMap._id = _id;
        }
        // 调用分页
        proc.getProcessDefineList(page,length,conditionMap).then(function(result1){
                if(_id){
                    result1.items = JSON.parse(result1.rows[0]._doc.item_config);
                    utils.respJsonData(res, result1);
                }else{
                    utils.respJsonData(res, result1);
                }
            })
            .catch(function(err){
                console.log('err');
                console.log(err);
                logger.error("route-query-define","查询流程定义",err);
            });
    })
    // -------------------------------create添加流程定义内容-------------------------------
    .post(function(req,res){
        // 获取提交信息
        var proc_code = req.body.proc_code;//流程编码
        var proc_name = req.body.proc_name;//流程名称
        var proc_define = req.body.proc_define;//流程图定义信息

        var lineNodeDatas = JSON.parse(req.body.lineNodeDatas);//流程图连接线数据
        var taskNodeDatas = JSON.parse(req.body.taskNodeDatas);//流程图任务节点数据

        // 验证流程编码是否为空
        if(!proc_code) {
            utils.respMsg(res, false, '2001', '流程编码不能为空。', null, null);
            return;
        }
        console.log();
        //根据流程编码获取流程基本属性信息
        proc.getProcessBaseInfoByProcCode(proc_code).then(function(result1){
            //构造流程定义保存参数
            var processDefineEntity = {};
            processDefineEntity.proc_id = result1._id;//流程基本属性ID
            processDefineEntity.proc_code = proc_code;//流程编码
            processDefineEntity.proc_name = proc_name;//流程名称
            if(!result1.proc_latest_ver){
                processDefineEntity.version = 1;//流程版本号
            }else{
                processDefineEntity.version = parseInt(result1.proc_latest_ver) + 1;//流程版本号
            }
            processDefineEntity.proc_define = proc_define;//流程图定义信息
            processDefineEntity.opt_time = new Date();
            processDefineEntity.opt_user = '';//req.session.current_user.user_name;
            processDefineEntity.status = 1;
            var itemArray = [];
            processDefineEntity.item_config = JSON.stringify(itemArray);
            //保存流程定义信息
            proc.saveProcessDefine(processDefineEntity).then(function(result2){
                if(result2.success){
                    //构造流程基本属性信息保存参数
                    var processBaseEntity = {};
                    processDefineEntity._id = result2.data;
                    processBaseEntity.proc_latest_ver = processDefineEntity.version;
                    //更新流程基本属性信息
                    proc.updateProcessBase(processDefineEntity.proc_id, processBaseEntity).then(function(result3){
                        if(result3.success){
                            // var itemArray = [];
                            for(var i=0; i<lineNodeDatas.length; i++){
                                var processItemEntity = {};
                                //processItemEntity._id = lineNodeDatas[i]._id;
                                processItemEntity.proc_id = result1._id;
                                processItemEntity.proc_code = proc_code;
                                processItemEntity.version = processDefineEntity.version;
                                processItemEntity.proc_define_id = processDefineEntity._id;
                                processItemEntity.item_code = lineNodeDatas[i].item_code;
                                processItemEntity.item_type = lineNodeDatas[i].item_type;
                                processItemEntity.item_el = lineNodeDatas[i].item_el;
                                processItemEntity.item_remark = lineNodeDatas[i].item_remark;

                                itemArray.push(processItemEntity);
                            }
                            for(var i=0; i<taskNodeDatas.length; i++){
                                var processItemEntity = {};
                                //processItemEntity._id = taskNodeDatas[i]._id;
                                processItemEntity.proc_id = result1._id;
                                processItemEntity.proc_code = proc_code;
                                processItemEntity.version = processDefineEntity.version;
                                processItemEntity.proc_define_id = processDefineEntity._id;
                                processItemEntity.item_code = taskNodeDatas[i].item_code;
                                processItemEntity.item_type = taskNodeDatas[i].item_type;
                                processItemEntity.item_sms_warn = taskNodeDatas[i].item_sms_warn;
                                processItemEntity.item_show_text = taskNodeDatas[i].selectVal;
                                if(taskNodeDatas[i].selectType == 1){//参与人
                                    processItemEntity.item_assignee_type = taskNodeDatas[i].selectType;
                                    processItemEntity.item_assignee_user = taskNodeDatas[i].item_assignee_user;
                                    processItemEntity.item_assignee_user_name = taskNodeDatas[i].item_remark;
                                    processItemEntity.item_assignee_user_code = taskNodeDatas[i].item_assignee_user_code;
                                    processItemEntity.item_assignee_ref_task = '';
                                    processItemEntity.item_assignee_role = '';
                                    processItemEntity.item_assignee_role_code = '';
                                    processItemEntity.item_assignee_role_tag = '';
                                    processItemEntity.item_assignee_role_level = '';
                                    processItemEntity.item_assignee_role_name = '';
                                    processItemEntity.item_assignee_ref_cur_org = '';
                                    processItemEntity.item_assignee_org_ids = '';
                                    processItemEntity.item_assignee_org_names = '';
                                    processItemEntity.item_assignee_ref_type ='';
                                }else if(taskNodeDatas[i].selectType == 2){//参与角色
                                    processItemEntity.item_assignee_type = taskNodeDatas[i].selectType;
                                    processItemEntity.item_assignee_role = taskNodeDatas[i].item_assignee_role;
                                    processItemEntity.item_assignee_role_code = taskNodeDatas[i].item_assignee_role_code;
                                    processItemEntity.item_assignee_role_tag = taskNodeDatas[i].item_assignee_role_tag;
                                    processItemEntity.item_assignee_role_level = taskNodeDatas[i].item_assignee_role_level;
                                    processItemEntity.item_assignee_role_name = taskNodeDatas[i].item_assignee_role_name;
                                    processItemEntity.item_assignee_org_ids = taskNodeDatas[i].item_assignee_org_ids;
                                    processItemEntity.item_assignee_org_names = taskNodeDatas[i].item_assignee_org_names;
                                    processItemEntity.item_assignee_ref_cur_org = '';
                                    processItemEntity.item_assignee_ref_type ='';
                                }else if(taskNodeDatas[i].selectType == 3){//参照人
                                    processItemEntity.item_assignee_type = taskNodeDatas[i].selectType;
                                    processItemEntity.item_assignee_ref_task = taskNodeDatas[i].item_assignee_ref_task;
                                    processItemEntity.item_assignee_role = taskNodeDatas[i].item_assignee_role;
                                    processItemEntity.item_assignee_role_code = taskNodeDatas[i].item_assignee_role_code;
                                    processItemEntity.item_assignee_role_tag = taskNodeDatas[i].item_assignee_role_tag;
                                    processItemEntity.item_assignee_role_level = taskNodeDatas[i].item_assignee_role_level;
                                    processItemEntity.item_assignee_role_name = taskNodeDatas[i].item_assignee_role_name;
                                    processItemEntity.item_assignee_ref_cur_org = taskNodeDatas[i].item_assignee_ref_cur_org;
                                    processItemEntity.item_assignee_ref_type = taskNodeDatas[i].item_assignee_ref_type;
                                    processItemEntity.item_assignee_org_ids = '';
                                    processItemEntity.item_assignee_org_names = '';
                                }
                                processItemEntity.item_node_var = taskNodeDatas[i].item_node_var;
                                processItemEntity.item_step_code = taskNodeDatas[i].item_step_code;
                                processItemEntity.item_code_num = taskNodeDatas[i].item_code_num;
                                processItemEntity.item_overtime = taskNodeDatas[i].item_overtime;
                                processItemEntity.item_overtime_afterAction_type = taskNodeDatas[i].item_overtime_afterAction_type;
                                processItemEntity.item_overtime_afterAction_info = taskNodeDatas[i].item_overtime_afterAction_info;
                                processItemEntity.item_touchEvent_type = taskNodeDatas[i].item_touchEvent_type;
                                processItemEntity.item_touchEvent_info = taskNodeDatas[i].item_touchEvent_info;
                                processItemEntity.item_filePath = taskNodeDatas[i].item_filePath;
                                processItemEntity.item_funName = taskNodeDatas[i].item_funName;
                                processItemEntity.item_remark = taskNodeDatas[i].item_remark;

                                itemArray.push(processItemEntity);
                            }
                            if(itemArray.length > 0){
                                var itemjsonstr = JSON.stringify(itemArray);
                                console.log("itemjsonstr==add===="+itemjsonstr);
                                processDefineEntity.item_config = itemjsonstr;
                                // 调用修改方法
                                proc.updateProcessDefine(processDefineEntity._id, processDefineEntity).then(function(result4) {
                                    utils.respJsonData(res, result4);
                                }).catch(function(err){
                                    console.log('err');
                                    console.log(err);
                                    logger.error("route-post-define","新增流程定义",err);
                                });
                            }else{
                                utils.respJsonData(res, result3);
                            }
                        }else{
                            utils.respJsonData(res, result3);
                        }
                    }).catch(function(err){
                        console.log('err');
                        console.log(err);
                        logger.error("route-post-define","新增流程定义",err);
                    });
                }else{
                    utils.respJsonData(res, result2);
                }
            }).catch(function(err){
                console.log('err');
                console.log(err);
                logger.error("route-post-define","新增流程定义",err);
            });
        }).catch(function(err){
            console.log('err');
            console.log(err);
            logger.error("route-post-define","新增流程定义",err);
        });
    });

router.route('/process/version/:id')
    // -------------------------------update修改流程实例内容-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//流程实例id
        var proc_define = req.body.proc_define;//流程图定义信息

        var lineNodeDatas = JSON.parse(req.body.lineNodeDatas);//流程图连接线数据
        var taskNodeDatas = JSON.parse(req.body.taskNodeDatas);//流程图任务节点数据
        var processDefineEntity = {};
        processDefineEntity.proc_define = proc_define;
        processDefineEntity.opt_time = new Date();
        processDefineEntity.opt_user = '';//req.session.current_user.user_name;

        proc.getProcessDefineById(id).then(function(result2){
            var itemArray = [];
            for(var i=0; i<lineNodeDatas.length; i++){
                var processItemEntity = {};
                processItemEntity.proc_id = result2.proc_id;
                processItemEntity.proc_code = result2.proc_code;
                processItemEntity.version = result2.version;
                processItemEntity.proc_define_id = id;
                if(lineNodeDatas[i]._id == ''){
                    processItemEntity.item_code = lineNodeDatas[i].item_code;
                    processItemEntity.item_type = lineNodeDatas[i].item_type;
                    processItemEntity.item_el = lineNodeDatas[i].item_el;
                    processItemEntity.item_remark = lineNodeDatas[i].item_remark;
                }else{
                    processItemEntity = model.$ProcessItem(lineNodeDatas[i]);
                    processItemEntity.isNew = false;
                }
                itemArray.push(processItemEntity);
            }
            for(var i=0; i<taskNodeDatas.length; i++){
                var processItemEntity = {};
                processItemEntity.proc_id = result2.proc_id;
                processItemEntity.proc_code = result2.proc_code;
                processItemEntity.version = result2.version;
                processItemEntity.proc_define_id = id;
                if(taskNodeDatas[i]._id == ''){
                    processItemEntity.item_code = taskNodeDatas[i].item_code;
                    processItemEntity.item_type = taskNodeDatas[i].item_type;
                    processItemEntity.item_sms_warn = taskNodeDatas[i].item_sms_warn;
                    processItemEntity.item_show_text = taskNodeDatas[i].selectVal;
                    if(taskNodeDatas[i].selectType == 1){//参与人
                        processItemEntity.item_assignee_type = taskNodeDatas[i].selectType;
                        processItemEntity.item_assignee_user = taskNodeDatas[i].item_assignee_user;
                        processItemEntity.item_assignee_user_name = taskNodeDatas[i].item_remark;
                        processItemEntity.item_assignee_user_code = taskNodeDatas[i].item_assignee_user_code;
                        processItemEntity.item_assignee_ref_task = '';
                        processItemEntity.item_assignee_role = '';
                        processItemEntity.item_assignee_role_code = '';
                        processItemEntity.item_assignee_role_tag = '';
                        processItemEntity.item_assignee_role_level = '';
                        processItemEntity.item_assignee_role_name = '';
                        processItemEntity.item_assignee_ref_cur_org = '';
                        processItemEntity.item_assignee_org_ids = '';
                        processItemEntity.item_assignee_org_names = '';
                        processItemEntity.item_assignee_ref_type = '';
                    }else if(taskNodeDatas[i].selectType == 2){//参与角色
                        processItemEntity.item_assignee_type = taskNodeDatas[i].selectType;
                        processItemEntity.item_assignee_role = taskNodeDatas[i].item_assignee_role;
                        processItemEntity.item_assignee_role_code = taskNodeDatas[i].item_assignee_role_code;
                        processItemEntity.item_assignee_role_tag = taskNodeDatas[i].item_assignee_role_tag;
                        processItemEntity.item_assignee_role_level = taskNodeDatas[i].item_assignee_role_level;
                        processItemEntity.item_assignee_role_name = taskNodeDatas[i].item_assignee_role_name;
                        processItemEntity.item_assignee_org_ids = taskNodeDatas[i].item_assignee_org_ids;
                        processItemEntity.item_assignee_org_names = taskNodeDatas[i].item_assignee_org_names;
                        processItemEntity.item_assignee_ref_cur_org = '';
                        processItemEntity.item_assignee_ref_type = '';
                    }else if(taskNodeDatas[i].selectType == 3){//参照人
                        processItemEntity.item_assignee_type = taskNodeDatas[i].selectType;
                        processItemEntity.item_assignee_ref_task = taskNodeDatas[i].item_assignee_ref_task;
                        processItemEntity.item_assignee_role = taskNodeDatas[i].item_assignee_role;
                        processItemEntity.item_assignee_role_code = taskNodeDatas[i].item_assignee_role_code;
                        processItemEntity.item_assignee_role_tag = taskNodeDatas[i].item_assignee_role_tag;
                        processItemEntity.item_assignee_role_level = taskNodeDatas[i].item_assignee_role_level;
                        processItemEntity.item_assignee_role_name = taskNodeDatas[i].item_assignee_role_name;
                        processItemEntity.item_assignee_ref_cur_org = taskNodeDatas[i].item_assignee_ref_cur_org;
                        processItemEntity.item_assignee_ref_type = taskNodeDatas[i].item_assignee_ref_type;
                        processItemEntity.item_assignee_org_ids = '';
                        processItemEntity.item_assignee_org_names = '';
                    }
                    processItemEntity.item_node_var = taskNodeDatas[i].item_node_var;
                    processItemEntity.item_step_code = taskNodeDatas[i].item_step_code;
                    processItemEntity.item_code_num = taskNodeDatas[i].item_code_num;
                    processItemEntity.item_overtime = taskNodeDatas[i].item_overtime;
                    processItemEntity.item_overtime_afterAction_type = taskNodeDatas[i].item_overtime_afterAction_type;
                    processItemEntity.item_overtime_afterAction_info = taskNodeDatas[i].item_overtime_afterAction_info;
                    processItemEntity.item_touchEvent_type = taskNodeDatas[i].item_touchEvent_type;
                    processItemEntity.item_touchEvent_info = taskNodeDatas[i].item_touchEvent_info;
                    processItemEntity.item_filePath = taskNodeDatas[i].item_filePath;
                    processItemEntity.item_funName = taskNodeDatas[i].item_funName;
                    processItemEntity.item_remark = taskNodeDatas[i].item_remark;
                }else{
                    if(taskNodeDatas[i].selectType == 1){//参与人
                        taskNodeDatas[i].item_assignee_role = '';
                        taskNodeDatas[i].item_assignee_role_code = '';
                        taskNodeDatas[i].item_assignee_role_tag = '';
                        taskNodeDatas[i].item_assignee_role_level = '';
                        taskNodeDatas[i].item_assignee_role_name = '';
                        taskNodeDatas[i].item_assignee_ref_task = '';
                        taskNodeDatas[i].item_assignee_org_ids = '';
                        taskNodeDatas[i].item_assignee_org_names = '';
                        taskNodeDatas[i].item_assignee_ref_cur_org = '';
                        processItemEntity.item_assignee_ref_type = '';
                    }else if(taskNodeDatas[i].selectType == 2){//参与角色
                        taskNodeDatas[i].item_assignee_user = '';
                        taskNodeDatas[i].item_assignee_user_code = '';
                        taskNodeDatas[i].item_assignee_ref_task = '';
                        taskNodeDatas[i].item_assignee_ref_cur_org = '';
                        processItemEntity.item_assignee_ref_type = '';
                    }else if(taskNodeDatas[i].selectType == 3){//参照人
                        taskNodeDatas[i].item_assignee_user = '';
                        taskNodeDatas[i].item_assignee_user_code = '';
                        taskNodeDatas[i].item_assignee_org_ids = '';
                        taskNodeDatas[i].item_assignee_org_names = '';
                    }
                    taskNodeDatas[i].item_assignee_type = taskNodeDatas[i].selectType;
                    taskNodeDatas[i].item_show_text = taskNodeDatas[i].selectVal;
                    processItemEntity = model.$ProcessItem(taskNodeDatas[i]);
                    processItemEntity.isNew = false;
                }
                itemArray.push(processItemEntity);
            }
            if(itemArray.length > 0){
                var itemjsonstr = JSON.stringify(itemArray);
                processDefineEntity.item_config = itemjsonstr;
            }
            // 调用修改方法
            proc.updateProcessDefine(id, processDefineEntity).then(function(result1) {
                utils.respJsonData(res, result1);
            }).catch(function(err){
                console.log('err');
                console.log(err);
                logger.error("route-put-define","修改流程定义",err);
            });
        }).catch(function(err){
            console.log('err');
            console.log(err);
            logger.error("route-put-define","修改流程定义",err);
        });
    });

router.route('/user')
    // -------------------------------query查询用户列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var name = req.query.filter_name;
        var tel = req.query.filter_tel;
        var sysid = req.query.filter_sys;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;
        if(!page){
            page = 1;
        }
        if(!length){
            length = 100;
        }
        var conditionMap = {};
        if(name){
            conditionMap.user_name = name;
        }
        if(tel){
            conditionMap.user_tel = tel;
        }
        if(sysid){
            conditionMap.sys_id = sysid;
        }
        conditionMap.user_status = 1;
        // 调用分页
        user.getUserList(page,length,conditionMap)
            .then(function(result){

                utils.respJsonData(res, result);

            })
            .catch(function(err){
                console.log('err');
                console.log(err);
            });

    });


router.route('/role')

    // -------------------------------query查询用户列表-------------------------------
    .get(function(req,res){
        // 分页条件
        var name = req.query.role_name;
        var sysid = req.query.sys_id;
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;
        if(!page){
            page = 1;
        }
        if(!length){
            length = 100;
        }
        var conditionMap = {};
        if(name){
            conditionMap.role_name = name;
        }
        if(sysid){
            conditionMap.sys_id = sysid;
        }
        conditionMap.role_status = 1;
        // 调用分页
        user.getRoleList(page,length,conditionMap)
            .then(function(result){

                utils.respJsonData(res, result);

            })
            .catch(function(err){
                console.log('err');
                console.log(err);
            });

    });

router.route('/role/combobox')

    // -------------------------------query查询用户列表-------------------------------
    .get(function(req,res){
        // 调用
        user.getRoles()
            .then(function(result){
                utils.respJsonData(res, result);

            })
            .catch(function(err){
                console.log('err');
                console.log(err);
            });

    });

//
router.route("/orgTreeDataAsyn").get(function (req,res) {
    //异步加载
    var condition={};
    var org_pid = req.query.org_pid;
    condition.org_pid = org_pid;
    condition.org_status =1 ;
    user.getOrgTreeDataAsyn(condition).then(function (result) {
        // utils.respJsonData(res, result)
        if(org_pid != "0"){
            utils.respJsonData(res, result);
        }else{
            utils.respJsonData(res, [{id:'0', text:config.datas.tree_org.root_node_name ? config.datas.tree_org.root_node_name : "贵州移动", children:result}]);
        }
    }).catch(function(err){
        console.log('err');
        console.log(err);
    });
});


router.route("/orgTreeData").get(function (req,res) {
    user.getOrgTreeData().then(function (result) {
        utils.respJsonData(res, result)
    }).catch(function(err){
        console.log('err');
        console.log(err);
    });
});


//流程进度
router.route("/show/process").get(function(req,res){
    var condition={};
    var proc_code=req.query.proc_code;
    var proc_inst_id=req.query.proc_inst_id;
    condition.proc_inst_id=proc_inst_id;
    proc.getShowProcess(condition).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err){
        console.log('err');
        console.log(err);
    });
});

//流程处理日志
router.route("/handler/logs").get(function(req,res){
    var condition={};
    var proc_inst_id=req.query.proc_inst_id;
    // 分页参数
    var page = req.query.page;
    var length = req.query.rows;
    condition.proc_inst_id=proc_inst_id;
    proc.getProcHandlerLogsList(page,length,condition).then(function(rs){
        utils.respJsonData(res,rs);
    }).catch(function(err){
        console.log('err');
        console.log(err);
    });
});

module.exports = router;
