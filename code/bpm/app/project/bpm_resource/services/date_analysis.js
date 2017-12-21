/**
 * Created by aurora on 2017/6/27.
 */
// JavaScript source code

var model_user=require("../models/user_model");
var model = require('../models/process_model');
var Pormise=require("bluebird");
var utils = require('../../../../lib/utils/app_utils')
var nodeAnalysis=require("./node_analysis_service");
var nodeTransfer=require("./node_transfer_service");
var timeKeyArray = [];//存放Key



function outDate(){
    var P=new Promise(function(resolve,reject){
        var query=model.$ProcessInstTask.find({'proc_inst_task_status':0});
        query.exec(function(err,rs){
            if(err){
                console.log(err);
                reject(utils.returnMsg(false, '1000', '查询未完成任务失败！', null, err));
            } else{
                resolve(utils.returnMsg(true, '0000', '查询未完成任务成功！', rs, null));
            }
        });

    }).then(function(rss){
        var data=rss.data;
        console.log("data      ",data)
        for(var i=0;i<data.length;i++){
            var tasks=data[i];
            var proc_inst_id=tasks.proc_inst_id;
            var node_id=tasks.proc_inst_task_code;
            var proc_inst_task_arrive_time=tasks.proc_inst_task_arrive_time;
            var querys=model.$ProcessInst.find({});
            var _id=tasks._id;
            if(proc_inst_id){
                querys.where("_id",proc_inst_id);
            }
            querys.exec(function(err,rs){
                if(err){
                    console.log(err);
                    reject(utils.returnMsg(false, '1000', '查询实例化表失败！', null, err));
                }  else{
                    for (var j=0;j<rs.length;j++){
                        var insts=rs[j];
                        var proc_define_id=insts.proc_define_id;
                        var item_config=JSON.parse(insts.item_config);
                        var process_define=JSON.parse(insts.proc_define);

                        // console.log(item_config);
                        // console.log(process_define);
                        // console.log(node_id);
                        var nodeInfo=nodeAnalysis.getNodeInfo(item_config,process_define,node_id,null);//item_config,process_define,current_node,next_node
                        // nodeAnalysis.getNode(proc_define_id,node_id,{},true);
                        // console.log(nodeInfo);
                        var current_detail=nodeInfo.current_detail;
                        var item_overtime_afterAction_type=current_detail.item_overtime_afterAction_type//: 1,
                        var item_overtime_afterAction_info=current_detail.item_overtime_afterAction_info;//: '自动流转到下一个节点',
                        var item_overtime=current_detail.item_overtime.toString();
                        // console.log(typeof item_overtime,"     ",item_overtime);
                        var over_time=timeAnalysis(item_overtime);
                        // console.log(result);
                        var current=new Date().getTime();
                        console.log("current   ",current);
                        console.log("ovwr_time   ",over_time);
                        console.log("proc_inst_task_arrive_time",proc_inst_task_arrive_time.getTime());
                        var time=proc_inst_task_arrive_time.getTime()+over_time;
                        console.log(time,"      ",current)
                        if(time<current){
                            // console.log("卧槽超时了");
                            if(item_overtime_afterAction_type==1){
                                //  自动流转到下一节点
                                nodeTransfer.transfer(_id,node_id,"Sys'",true,"","");
                            }else if(item_overtime_afterAction_type==2){
                                //自动流转到下节点 并通知
                                nodeTransfer.transfer(_id,node_id,"Sys'",true,"","").then(function(){
                                    var info={};
                                    info.message="您有任务超时，已经自动进行默认处理！"
                                    info.proc_inst_task_id=tasks._id;
                                    info.proc_inst_id=tasks.proc_inst_id;
                                    info.proc_inst_task_code=tasks.proc_inst_task_code;
                                    info.proc_inst_task_name=tasks.proc_inst_task_name;
                                    info.proc_inst_task_status=tasks.proc_inst_task_status;
                                    info.proc_inst_task_assignee=tasks.proc_inst_task_assignee;
                                    info.proc_inst_task_assignee_name=tasks.proc_inst_task_assignee_name;
                                    info.proc_inst_task_user_role=tasks.proc_inst_task_user_role;
                                    info.proc_inst_task_user_role_name=tasks.proc_inst_task_user_role_name;
                                    message(info);

                                });

                            }else if(item_overtime_afterAction_type==3){
                                //通知
                                var info={};
                                info.message="您有任务超时未处理，请及时处理";
                                info.proc_inst_task_id=tasks._id;
                                info.proc_inst_id=tasks.proc_inst_id;
                                info.proc_inst_task_code=tasks.proc_inst_task_code;
                                info.proc_inst_task_name=tasks.proc_inst_task_name;
                                info.proc_inst_task_status=tasks.proc_inst_task_status;
                                info.proc_inst_task_assignee=tasks.proc_inst_task_assignee;
                                info.proc_inst_task_assignee_name=tasks.proc_inst_task_assignee_name;
                                info.proc_inst_task_user_role=tasks.proc_inst_task_user_role;
                                info.proc_inst_task_user_role_name=tasks.proc_inst_task_user_role_name;
                                message(info);
                            }
                            //超时的方法

                        }else{
                           //正常执行
                        }
                    }
                }

            });

        }

    }).catch(function(e){
       console.log(e);
    });



}

function message(map){
    console.error(map)

}

//判断是否超期的模块

// var string = "1时分1天"

// var time = timeAnalysis(string);
// console.log(time)




function timeAnalysis(str) {
    var time = 0;
    var timeMap = {};

    //判断是否有天 时，分 这几个关键字
    var day_set = str.indexOf("天");
    var hour_set = str.indexOf("时");
    var min_set = str.indexOf("分");
    console.log(day_set,hour_set,min_set);
    timeMap.day_set = day_set;
    timeMap.hour_set = hour_set;
    timeMap.min_set = min_set;

    for (var item in timeMap) {
        if (timeMap[item] == -1) {
            console.log(item, "不存在");
        } else {
            timeKeyArray.push(item);
        }
    }

    if (timeKeyArray.length > 0) {
        //存在关键字（天）
        //判断序列
       findMini(timeKeyArray,timeMap);
        var string =str;
        var temp=-1;
        for (var k=0 ;k< timeKeyArray.length;k++) {
            var key = timeKeyArray[k];
            if (key =="day_set") {
                if(temp==0){
                    var set=timeMap[key]
                    if(temp==set){
                        var day_str="0" ;
                    }else{
                        var day_str = string.substring(temp, set);
                    }

                    temp=set;
                }else{
                    var set=timeMap[key]
                    if(temp==set){
                       var  day_str="0";

                    }else{
                        var day_str = string.substring(temp+1, set);
                    }
                    temp+=set;
                }
                // string = string.substring(set + 1,string.length );
                console.log("temp    ",temp , "    set    ",set,"      day     _str    ",day_str,"   djfdkfjdk    ",string);
                var day_num = Number(day_str);
                time += day_num*24*60*60*1000;
                console.log(time);

            } else if (key == "hour_set") {
                if(temp==-1){
                    var set = timeMap[key]
                    if(temp==set){
                        var hour_str="0";
                    }else{
                        var hour_str = string.substring(temp, set);
                    }
                    temp=set;

                }else{
                    var set = timeMap[key]
                    if(temp==set){
                        var hour_str ="0";

                    }else{
                        var hour_str = string.substring(temp+1, set);
                    }

                    temp=set;
                }

                console.log("temp    ",temp ,"     set    ",set,"    hour     _str    ",hour_str,"   djfdkfjdk    ",string);
                var hour_num = Number(hour_str);
                if(hour_num>24){
                    return 0;
                }else{
                    time += hour_num *  60 * 60 * 1000;
                }

                console.log(time);

            } else if (key == "min_set") {
                if(temp==-1){
                    var set = timeMap[key];
                    if(set==temp){
                        var min_str = "0";

                    }else{
                        var min_str = string.substring(temp, set);

                    }
                    temp=set;
                }else{
                    var set = timeMap[key]
                    if(set==temp){
                        var min_str ="0"

                    }else{
                        var min_str = string.substring(temp+1, set);
                    }

                    temp=set;
                }
                console.log("temp    ",temp-set ,"    set    ",set,"    min     _str    ",min_str,"   djfdkfjdk    ",string);
                var min_num = Number(min_str);
                if(min_num>60){
                    return 0;
                }else{
                    time += min_num  * 60 * 1000;
                }

                console.log(time);
            }


        }
        console.log(time);


    } else {
        //不存在关键字，纯数字模式
        time=Number(str) * 60 * 1000;
    }

    return time;

}

function findMini(timeKeyArray,map){
    var tempKey;
    var flag=false;
    for(var i=0;i<timeKeyArray.length;i++){
        var key =timeKeyArray[i];
        var value=map[key];
        for (var j=i+1;j<timeKeyArray.length;j++){
            var keys =timeKeyArray[j];
            var values=map[keys];
            console.log("values   ",values,"    value  ",value);
            if(value>values){
                console.log(i,"  i ",j,"  j  ","发生交换");
                console.log(timeKeyArray)
                tempKey=timeKeyArray[i];
                timeKeyArray[i]=timeKeyArray[j];
                timeKeyArray[j]=tempKey;
                console.log(timeKeyArray);
                console.log("交换完成");
            }
        }
    }
    for(var k=0;k<timeKeyArray.length;k++){
        var key_ =timeKeyArray[k];
        var value_=map[key_];
        var h=k+1

        if(h<timeKeyArray.length){
            var keys_=timeKeyArray[h];
            var values_=map[keys_];
            if(value_>values_){
                flag=true;
            }
        }
    }
    if(flag){
        findMini(timeKeyArray,map);
    }else{
        return timeKeyArray;
    }
}



