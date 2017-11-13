/**
 * Created by zhaojing on 2016/9/7.
 */
var model = require('../../bpm_resource/models/process_model');
var utils = require('../../../utils/app_utils');
var proc_service = require('./process_service');

/**
 * 获取流程监控信息列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getProcessMonitorList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, cb, '', {'proc_start_time':-1});
};

/**
 * 获取流程监控的流程图信息
 * @param proc_inst_id
 * @param cb
 */
exports.getProcessInfo = function(proc_inst_id, cb){
    var result = {};
    model.$ProcessInst.find({'_id':proc_inst_id}).populate({'path':'proc_define_id','model':'CommonCoreProcessDefine'}).exec(function(procInstError,procInstResult){
        if(procInstError){
            cb({'success': false, 'code': '1001', 'msg': '获取流程定义信息时出现异常'});
        }else{
            if(procInstResult[0]._doc.proc_define_id){
                result.processInstInfo = procInstResult[0]._doc;
                result.processChart = procInstResult[0]._doc.proc_define_id._doc.proc_define;//获取流程图
                model.$ProcessInstTask.find({'proc_inst_id':proc_inst_id}).exec(function(err3,rs3){
                    if(err3){
                        cb({'success': false, 'code': '1002', 'msg': '获取流程历史信息时出现异常'});
                    }else{
                        var processInstTasks = [];
                        for(var i=0;i<rs3.length;i++){
                            processInstTasks.push(rs3[i]._doc);
                        }
                        result.processInstTasks = processInstTasks;
                        cb({'success': true, 'code': '0000', 'result': result});
                    }
                });
            }else{
                cb({'success': false, 'code': '1003', 'msg': '未找到对应的流程图信息'});
            }
        }
    });
}

/**
 * 获取待处理人信息
 * @param proc_inst_id
 * @param cb
 */
exports.getPendingUsers = function(proc_inst_id, cb){
    proc_service.getPendingUsers(proc_inst_id,cb);
}

/**
 * 获取流程回退的节点
 * @param proc_inst_id
 * @param cb
 */
exports.rollbackProcInst = function(proc_inst_id, cb){
    proc_service.rollbackProcInst(proc_inst_id,cb);
}

/**
 * 流程回退方法
 */
exports.doRollbackProcInst = function(define_id,proc_inst_id,code,name,cb){
    proc_service.doRollbackProcInst(define_id,proc_inst_id,code,name,cb);
}

/**
 * 获取流程历史信息
 * @param proc_inst_id
 * @param cb
 */
exports.getProcInstTask = function(proc_inst_id,cb){
    proc_service.getProcInstTasks(proc_inst_id,cb);
}

/**
 * 删除流程历史信息
 * @param proc_inst_task_ids
 * @param cb
 */
exports.removeProcInstTasks = function(proc_inst_task_ids,cb){
    proc_service.removeProcInstTasks(proc_inst_task_ids,cb);
}

/**
 * 手动修改流程当前节点处理人
 * @param proc_inst_id
 * @param proc_cur_user
 * @param proc_cur_user_name
 * @param cb
 */
exports.updateProcInstCurUser = function(proc_inst_id,proc_cur_user,proc_cur_user_name,cb){
    proc_service.updateProcInstCurUser(proc_inst_id,proc_cur_user,proc_cur_user_name,cb);
}

/**
 * 刷流程待处理人数据
 * @param proc_inst_id
 * @param users
 * @param cb
 */
exports.updateProcInstPendingtUsers = function(proc_inst_id,users,cb){
    proc_service.updateProcInstPendingtUsers(proc_inst_id,users,cb);
}
