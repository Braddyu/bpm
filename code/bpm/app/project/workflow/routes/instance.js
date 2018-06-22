var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var inst = require('../../bpm_resource/services/instance_service');
var config = require('../../../../config');

//展示流程进程
router.get('/show/progressed', function(req, res, next) {

    res.render(config.project.appviewurl+'common/app/instance_showChart', {
        title: '首页' ,
        subtitle: 'Hello',
        layout:'themes/admin/blank',
        //menuid:'/home',
    });

});

router.route('/list')

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
        // 调用分页


        inst.getInstanceQuery4EuiList(page,length,conditionMap)
            .then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                console.log('err');
                console.log(err);
            });
    });

router.route('/query')

    // -------------------------------query查询流程基本属性列表-------------------------------
    .get(function(req,res){
        var condition={};
        var proc_inst_id=req.query.proc_inst_id;
        condition.proc_inst_id=proc_inst_id;
        if(!proc_inst_id){
            utils.respMsg(res, false, '2001', 'id不能为空。', null, null);
            return;
        }
        inst.getInstByID(proc_inst_id).then(function(result){
                utils.respJsonData(res, result);
            })
            .catch(function(err){
                console.log('err');
                console.log(err);
            });

        //processService.getProcessInstList4Page(page, length, conditionMap, function(result){
        //    utils.respJsonData(res, result);
        //});
    })

    // -------------------------------create添加流程基本属性-------------------------------
    .post(function(req,res){

        // 获取提交信息
        var proc_id = req.body.proc_id;//流程编码
        var proc_code = 'proce_code'//req.body.proc_code;//流程编码
        var proc_name = 'proc_name';//req.body.proc_name;//流程名
        var proc_biz_code= req.body.proc_biz_code;//业务ID
        var proc_title =req.body.proc_title;//业务标题

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

        inst.checkCode(1,proc_biz_code,null)
            .then(function(data){

                var processBaseEntity = {};
                processBaseEntity.proc_id = proc_id;
                processBaseEntity.proc_code = proc_code;
                processBaseEntity.proc_name = proc_name;
                processBaseEntity.proc_biz_code = proc_biz_code;
                processBaseEntity.proc_title = proc_title;
                processBaseEntity.proc_create_time = new Date();
                processBaseEntity.proc_creator = '';//req.session.current_user.user_name;
                processBaseEntity.proc_inst_status = 1;

                // 调用业务层保存方法
                return inst.startInstance(proc_id,proc_code,proc_name,proc_title,proc_biz_code);

            })
            .then(function(result){

                utils.respJsonData(res, result);
                //utils.respMsg(res, false, '2002', 'err。'+err_inst, null, null);

            })
            .catch(function(err_inst){
                console.log(err_inst);
                utils.respMsg(res, false, '2002', 'err。'+err_inst, null, null);
            });
    });

router.route('/inst/:id')
    // -------------------------------update修改流程基本属性信息-------------------------------
    .put(function(req,res) {


        var id = req.params.id;//流程基本属性id

        // 获取提交信息
        var proc_id = req.body.proc_id;//流程编码
        var proc_code = 'proce_code'//req.body.proc_code;//流程编码
        var proc_name = 'proc_name';//req.body.proc_name;//流程名
        var proc_biz_code= req.body.proc_biz_code;//业务ID
        var proc_title =req.body.proc_title;//业务标题



        // 验证流程名是否为空
        if(!id) {
            utils.respMsg(res, false, '2001', 'id不能为空。', null, null);
            return;
        }
        // 验证流程编码是否为空
        if(!proc_title) {
            utils.respMsg(res, false, '2002', '标题不能为空。', null, null);
            return;
        }
        // 调用业务层保存方法
        var instEntity = {};
        instEntity.proc_title = proc_title;
        instEntity.proc_biz_code = proc_biz_code;

        inst.changeInstance(id,instEntity)
            .then(function(result){

                utils.respJsonData(res, result);

            })
            .catch(function(err_inst){
                console.log(err_inst);
                utils.respMsg(res, false, '2002', 'err。'+err_inst, null, null);
            });

    });


router.route('/instChangeStatus/:id')
    // -------------------------------启用、禁用操作-------------------------------
    .put(function(req,res) {
        var id = req.params.id;//流程基本属性id
        var value = req.body.proc_status;
        var flag = req.body.flag;

        // 调用启用、禁用方法
        inst.instChangeStatus(id,value)
            .then(function(result){

                utils.respJsonData(res, result);

            })
            .catch(function(err_inst){
                console.log(err_inst);
                utils.respMsg(res, false, '2002', 'err。'+err_inst, null, null);
            });
    });

router.route('/handler/logs')
    // -------------------------------流程实例处理日志-------------------------------
    .get(function(req,res) {
        var id = req.query.proc_inst_id;//流程实例id
        var status = req.query.proc_inst_status;//流程实例状态
        // 分页参数
        var page = req.query.page;
        var length = req.query.rows;

        // 调用方法
        inst.getInstHandlerLogsList(page,length,id,status)
            .then(function(result){

                utils.respJsonData(res, result);

            })
            .catch(function(err_inst){
                console.log(err_inst);
                utils.respMsg(res, false, '2002', 'err。'+err_inst, null, null);
            });
    });

router.route('/back')
    // -------------------------------流程实例回退-------------------------------
    .put(function(req,res) {
        var id = req.body.proc_inst_id;//流程实例id
        var node_code = req.body.node_code;//流程实例状态

        // 调用方法
        inst.procInstBack(id,node_code)
            .then(function(result){

                utils.respJsonData(res, result);

            })
            .catch(function(err_inst){
                console.log(err_inst);
                utils.respMsg(res, false, '2002', 'err。'+err_inst, null, null);
            });
    });

router.route('/scrap')
    // -------------------------------流程实例废弃-------------------------------
    .put(function(req,res) {
        var id = req.body.proc_inst_id;//流程实例id

        // 调用方法
        inst.procInstScrap(id)
            .then(function(result){

                utils.respJsonData(res, result);

            })
            .catch(function(err_inst){
                console.log(err_inst);
                utils.respMsg(res, false, '2002', 'err。'+err_inst, null, null);
            });
    });

module.exports = router;
