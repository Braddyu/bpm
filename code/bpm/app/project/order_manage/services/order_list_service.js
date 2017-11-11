
var model = require('../../bpm_resource/models/process_model');

var utils = require('../../../../lib/utils/app_utils');
var logger = require('../../../../lib/logHelper').helper;

/**
 * 工单列表分页
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getOrderListPage= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){

        utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '',  {});

    });

    return p;
};
/**
 * 获取所有流程
 * @returns {Promise}
 */
exports.getAllProBase= function() {

    var p = new Promise(function(resolve,reject){
        model.$ProcessBase.find({"status":"1"},function(err,result){
            if(err){
                console.log('获取所有流程失败',err);
                resolve({'success':false,'code':'1000','msg':'获取所有流程失败',"error":err});
            }else{
                resolve({'success':true,'code':'0000','msg':'获取所有流程成功',"data":result,"error":null});

            }
        });

    });

    return p;
};

/**
 * 获取对应流程的详细节点信息
 * @returns {Promise}
 */
exports.getProcDefineDetail= function(proc_code) {

    var p = new Promise(function(resolve,reject){
        model.$ProcessDefine.find({"proc_code":proc_code},function(err,result){
            if(err){
                console.log('获取流程信息失败',err);
                resolve({'success':false,'code':'1000','msg':'获取流程详细信息失败',"error":err});
            }else{
                console.log('获取流程信息结果',result);
                //获取开始节点信息，因为第一节点为"开始"，所以这里获取第二节点"processDefineDiv_node_2"为开始节点
                if(result.length>0){
                    var nodes=JSON.parse(result[0].proc_define).nodes;
                    resolve({'success':true,'code':'0000','msg':'获取流程详细信息成功',"data":nodes.processDefineDiv_node_2,"error":null});

                }else{
                    resolve({'success':false,'code':'1001','msg':'获取流程详细信息失败',"error":"获取当前节点信息失败"});

                }

            }
        });

    });

    return p;
};
