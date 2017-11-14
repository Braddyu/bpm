
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
exports.getProcDefineDetail= function(proc_code,proc_inst_task_code) {

    var p = new Promise(function(resolve,reject){
        model.$ProcessDefine.find({"proc_code":proc_code},function(err,result){
            if(err){
                console.log('获取流程信息失败',err);
                resolve({'success':false,'code':'1000','msg':'获取流程详细信息失败',"error":err});
            }else{
                console.log('获取流程信息结果',result);
                //获取开始节点信息，因为第一节点为"开始"，所以这里获取第二节点"processDefineDiv_node_2"为开始节点
                if(result.length>0){
                    var resultData={};
                    var nodesArray=[];
                    var proc_define=JSON.parse(result[0].proc_define);
                    var nodes=proc_define.nodes;
                    var lines=proc_define.lines;
                    var processDefineDiv_node;
                    //当前节点名称
                    var nodeName;
                    //是否是结束节点
                    var isEnd=false;
                    //开始节点
                    var start_node;
                    //开始处理节点，即开始节点的下一节点
                    var start_next_node;
                    //获取开始节点
                    for(var item in nodes){
                        if(nodes[item].type=='start  round'){
                            start_node=item;
                        }
                    }
                    //获取开始处理节点，即实际的开始节点
                    for(var item in lines){
                        if(lines[item].from==start_node){
                            start_next_node=lines[item].to;
                        }
                    }
                    console.log("实际开始节点start_next_node:",start_next_node);
                    //如果是发起工单
                    if(!proc_inst_task_code){
                        proc_inst_task_code=start_next_node;
                        processDefineDiv_node=nodes[proc_inst_task_code];
                        nodeName=processDefineDiv_node.name;
                    }else{
                        //中间节点处理
                        processDefineDiv_node=nodes[proc_inst_task_code];
                    }
                    console.log("processDefineDiv_node：",processDefineDiv_node);
                    //类型为"chat"表示有分支,获取分支节点
                    // if(processDefineDiv_node.type=='chat' ){
                    //
                    //     for(var item in lines){
                    //        var line=lines[item];
                    //        //判断是否是第二节点的分支
                    //        if(line.from==proc_inst_task_code){
                    //            var toNode=line.to;
                    //            //判断下一节点分支是否存在结束节点，如果存在则即可归档
                    //            if(nodes[toNode].type=='end  round'){
                    //                isEnd=true;
                    //            }else{
                    //                 nodesArray.push(nodes[line.from]);
                    //
                    //            }
                    //        }
                    //     }
                    // }
                    //判断是否属于归档节点
                    if(isEnd){
                        resultData.flag="3" ;
                    }else if(proc_inst_task_code==start_next_node){
                        //判断是否属于发起节点
                        resultData.flag="1" ;
                        resultData.nodeName=nodeName;
                    }else{
                        //判断是否属于中间处理节点
                        resultData.flag="2" ;
                    }
                    resolve({'success':true,'code':'0000','msg':'获取流程详细信息成功',"data":resultData,"error":null});

                }else{
                    resolve({'success':false,'code':'1001','msg':'获取流程详细信息失败',"error":"获取当前节点信息失败"});

                }

            }
        });

    });

    return p;
};
