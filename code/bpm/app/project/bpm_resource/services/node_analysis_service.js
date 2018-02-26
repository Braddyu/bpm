/**
 * Created by aurora on 2017/6/12.
 */
var model = require('../models/process_model');
var model_user=require("../models/user_model");
var utils = require('../../../utils/app_utils');
var Promise = require("bluebird");
var proc=require("./instance_service");
var querystring = require('querystring');
var nodeDetail,data_define;

/**
 * @param resolve
 * @constructor
 *
 * @desc 当没有查询到结果时候调用的方法
 */
var NoFound=(resolve)=>{
    resolve({"data":null,"error":null,"msg":"没有查询到结果","code":"1000","success":false});
}

//查找当前节点相关的下一节点或者上一节点的信息方法 主要是读取解析节点配置文件和节点信息文件
/**
 *
 * @param process_define_id 流程定义ID
 * @param node_code(node_id) 节点Id
 * @param flag 标志位 ture 查询下一节点信息 false查询上一节点信息
 * var params={};
 * params.money=30;
 * getNode("59438a49ff6eed2780eb6cb7","processDefineDiv_node_2",params,true)
 */
//getNode的对外方法
exports.getNode=getNode;
function getNode(process_define_id,node_code,params,flag){
    return new Promise(async function(resolve) {
        let rs = await model.$ProcessDefine.find({"_id": process_define_id});
        if (rs.length==0) {
            resolve(utils.returnMsg(false, '1001', '没有查询流程定义', null, null));
            return ;
        }
        var process_define = JSON.parse(rs[0].proc_define);
        var item_config = JSON.parse(rs[0].item_config);
        var nodes = process_define.nodes;
        if (flag) {
            var node_detail;
            for (let node in nodes) {
                if (node == node_code) {
                    node_detail = nodes[node];
                }
            }
            let type = node_detail.type;
            var node_array = await getValidNode(process_define, node_code, flag);
            if (type == "chat") {
                var valid_node = await deleteInvalidNode(process_define, item_config, node_array, node_code, params,)
                if (valid_node.length != 1) {
                    resolve(utils.returnMsg(false, '9999', '有效节点删除不完全，或者错误', valid_node, null));
                } else {
                    var result = choiceNode(item_config, process_define, node_code, valid_node[0]);
                    resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
                }
            } else if (type == "fork") {
                var result = choiceNode(item_config, process_define, node_code, node_array[0]);
                resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
            } else {
                if (node_array.length != 1) {
                    // console.error("节点信息错误");
                    resolve(utils.returnMsg(false, '1000', '有效节点删除不完全，或者错误', null, null));
                } else {
                    var result = choiceNode(item_config, process_define, node_code, node_array[0]);

                    resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
                }
            }
        } else {
            var result = findNode(item_config, process_define, node_code, flag);
            resolve(utils.returnMsg(true, '0000', '查找上一节点信息正常', result, null));
        }
    });
}

/**
 * 流程流转中查找下一节点
 * @type {getNode}
 */
exports.getNextnode=getNextnode;
function getNextnode(inst_id,node_code,params,flag){
    return new Promise(async function(resolve) {
        let rs = await model.$ProcessInst.find({"_id":inst_id})
        if (rs.length==0) {
            resolve(utils.returnMsg(false, '1001', '没有到流程实例', null, null));
            return ;
        }
        var process_define = JSON.parse(rs[0].proc_define);
        var item_config = JSON.parse(rs[0].item_config);
        var nodes = process_define.nodes;
        if (flag) {
            var node_detail;
            for (let node in nodes) {
                if (node == node_code) {
                    node_detail = nodes[node];
                }
            }
            let type = node_detail.type;
            var node_array = await getValidNode(process_define, node_code, flag);
            if (type == "chat") {
                var valid_node = await deleteInvalidNode(process_define, item_config, node_array, node_code, params,)
                if (valid_node.length != 1) {
                    resolve(utils.returnMsg(false, '9999', '有效节点删除不完全，或者错误', valid_node, null));
                } else {
                    var result = choiceNode(item_config, process_define, node_code, valid_node[0]);
                    resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
                }
            } else if (type == "fork") {
                var result = choiceNode(item_config, process_define, node_code, node_array[0]);
                resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
            } else {
                if (node_array.length != 1) {
                    // console.error("节点信息错误");
                    resolve(utils.returnMsg(false, '1000', '有效节点删除不完全，或者错误', null, null));
                } else {
                    var result = choiceNode(item_config, process_define, node_code, node_array[0]);

                    resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
                }
            }
        } else {
            var result = findNode(item_config, process_define, node_code, flag);
            resolve(utils.returnMsg(true, '0000', '查找上一节点信息正常', result, null));
        }
    });
}
/**
 * 获取实例中的节点配置
 * @type {getInstNode}
 */
exports.getInstNode=getInstNode;
function getInstNode(rs,node_code,params,flag){
    return new Promise(async function(resolve) {
        var process_define = JSON.parse(rs[0].proc_define);
        var item_config = JSON.parse(rs[0].item_config);
        var nodes = process_define.nodes;
        if (flag) {
            var node_detail;
            for (let node in nodes) {
                if (node == node_code) {
                    node_detail = nodes[node];
                }
            }
            let type = node_detail.type;
            var node_array = await getValidNode(process_define, node_code, flag);
            if (type == "chat") {
                var valid_node = await deleteInvalidNode(process_define, item_config, node_array, node_code, params,)
                if (valid_node.length != 1) {
                    resolve(utils.returnMsg(false, '9999', '有效节点删除不完全，或者错误', valid_node, null));
                } else {
                    var result = choiceNode(item_config, process_define, node_code, valid_node[0]);
                    resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
                }
            } else if (type == "fork") {
                var result = choiceNode(item_config, process_define, node_code, node_array[0]);
                resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
            } else {
                if (node_array.length != 1) {
                    // console.error("节点信息错误");
                    resolve(utils.returnMsg(false, '1000', '有效节点删除不完全，或者错误', null, null));
                } else {
                    var result = choiceNode(item_config, process_define, node_code, node_array[0]);
                    resolve(utils.returnMsg(true, '0000', '查询结果正常', result, null));
                }
            }
        } else {
            var result = findNode(item_config, process_define, node_code, flag);
            resolve(utils.returnMsg(true, '0000', '查找上一节点信息正常', result, null));
        }
    });
}


/**
 *
 * @param item_config
 * @param process_define
 * @param node_code
 * @param flag
 * @returns {{}}
 *
 * @desc //解析节点信息 获取节点信息  包括配置信息和节点信息
 */
function findNode(item_config,process_define,node_code,flag){
    var result={};
    var lines=process_define.lines;
    for(var line in lines){
        var from=lines[line].from;
        var to=lines[line].to;
        if(flag){
            //ture  next node detail   false :last_detail
            if(node_code==from){
                for (var i=0;i<item_config.length;i++){
                    var item_info=item_config[i];
                    var item_code=item_info.item_code;
                    if(from==item_code){
                        result.current_detail=item_info;
                    }
                }
                for (var j=0;j<item_config.length;j++){

                    var item_info_t=item_config[j];
                    var item_code_t=item_info_t.item_code;
                    if(to==item_code_t){
                        result.next_detail=item_info_t;
                    }
                }
                result.next_node=findNodeDetail(process_define,to);
            }
        }else{
            if(node_code==to){
                for (var i=0;i<item_config.length;i++){
                    var item_info=item_config[i];
                    var item_code=item_info.item_code;
                    if(to==item_code){
                        result.current_detail=item_info;
                    }
                }
                for (var j=0;j<item_config.length;j++){

                    var item_info_t=item_config[j];
                    var item_code_t=item_info_t.item_code;
                    if(from==item_code_t){
                        result.last_detail=item_info_t;
                    }
                }
                result.last_node=findNodeDetail(process_define,from);
            }
        }
    }
    result.current_node=findNodeDetail(process_define,node_code);
    return result;
}

//查询分支节点的下一节点和当前节点信息
function choiceNode(item_config,process_define,current_node,next_node){
    var result={};
    if(current_node!=null){
        for (var i=0;i<item_config.length;i++){
            var item_info=item_config[i];
            var item_code=item_info.item_code;
            if(current_node==item_code){
                result.current_detail=item_info;
            }

        }
        result.current_node=findNodeDetail(process_define,current_node);
    }
    if(next_node!=null){
        for (var j=0;j<item_config.length;j++){

            var item_info_t=item_config[j];
            var item_code_t=item_info_t.item_code;
            if(next_node==item_code_t){
                result.next_detail=item_info_t;
            }
        }
        result.next_node=findNodeDetail(process_define,next_node);
    }
    return result;
}

//choiceNode()对外的方法
exports.getNodeInfo=function(item_config,process_define,current_node,next_node){
    var result={};
    if(current_node!=null){
        for (var i=0;i<item_config.length;i++){
            var item_info=item_config[i];
            var item_code=item_info.item_code;
            if(current_node==item_code){
                result.current_detail=item_info;
            }
        }
        result.current_node=findNodeDetail(process_define,current_node);
    }
    if(next_node!=null){
        for (var j=0;j<item_config.length;j++){

            var item_info_t=item_config[j];
            var item_code_t=item_info_t.item_code;
            if(next_node==item_code_t){
                result.next_detail=item_info_t;
            }
        }
        result.next_node=findNodeDetail(process_define,next_node);
    }
    // console.log(result);
    return result;
}
//查找首位节点(开始节点)
exports.findFirstNode=function(process_define){
    var lines=process_define.lines;
    var nodes=process_define.nodes;
    var map={};
    map.first_node="";
    circleFind(nodes,lines,map);
    return map.first_node;
}

function findFirstNode(process_define){
    var lines=process_define.lines;
    var nodes=process_define.nodes;
    var map={};
    map.first_node="";
    circleFind(nodes,lines,map);
    return map.first_node;
}

//递归查找首位节点
function circleFind(nodes,lines,map){
    //查找开始节点
    for(var item in nodes){
        var node=nodes[item];
        if(node.type=='start  round'){
            for(var item2 in lines){
                var line=lines[item2];
                if(line.from==item){
                    map.first_node=line.to;
                    return;
                }
            }
        }
    }
}
//findNodeDetail function
/**
 *
 * @param process_define
 * @param node_code
 * @returns {*}
 *
 * @desc 查找节点配置信息
 */
function findNodeDetail(process_define,node_code){
    var nodes=process_define.nodes
    var detail;
    // console.info(process_define.nodes);
    for(var node in nodes){
        if(node_code==node){
            detail=nodes[node];
        }
    }
    return detail;
}


/**
 *
 * @param process_define Object (the process——define——file)
 * @param node_code  String  (current node`s code)
 * @param flag  boolean (true :return the array of next_node;false :return the array of  last_node)
 * @returns {Array}
 *
 * @desc 查找所有的有效节点（flag=true 下一所有有效节点；反之上一步所有有效节点）
 */
//getValidNode 的对外方法
exports.getNodeArray=getValidNode;
var getValidNode= (process_define,node_code,flag)=>{
    var lines=process_define.lines;
    var allNextNode=[];
    for (var line in lines){
        var to =lines[line].to;
        var from =lines[line].from;
        if(node_code==from){
            allNextNode.push(to);
        }
    }
    return allNextNode;
}





/**
 *
 * @param str
 * @param condition
 * @param resolve
 * @returns {*}
 *
 * @desc //判断路径有效否方法 //使用原理  使用eval 表达式来判断是否有效 //同时在这里 使用了节点路线表达式的解析 获取了所有需要传递的参数 //如果参数没有传完 会提示错误
 */
function determinChoice(str, condition,resolve) {
    var map;
    var array=new Array();
    var result = "";
    var flag = true
    if(str){
    }
    map=choiceDetermin(str)
    array=map;
    if(array.length>0){
        try{
            for (var item in condition) {
                if ((typeof condition[item]) == "string") {
                    result += "var " + item + " ='" + condition[item] + "';" ;
                } else {
                    result += "var " + item + " = " + condition[item] + ";" ;
                }
            }
            result+=str;
            return eval(result)
        }catch(e){
            return false;
        }
    }
}


/**
 *
 * @param line
 * @param item_config
 * @returns {*|Document.item_el}
 *
 * @desc //找到配置文件中的 参数表达式
 */
function findEval(line,item_config){
    for(var item in item_config){
        var temp=item_config[item];
        var item_code=temp.item_code;
        if(line==item_code){
            return temp.item_el;
        }

    }
}



exports.findParams=function (proc_inst_id,node_code){
    return new Promise(async function(resolve,reject){
       let result=await model.$ProcessInst.find({"_id":proc_inst_id});
       if(result.length==0){NoFound(resolve);return ;}
        var allArray=[]
        var item_config=JSON.parse(result[0].item_config);
        var proc_define=JSON.parse(result[0].proc_define);
        var nodeArray=getValidNode(proc_define,node_code,true)
        var lines=proc_define.lines;
        for(var line in lines){
            var from =lines[line].from;
            var to = lines[line].to;
            for(var node in nodeArray){
                if(nodeArray[node]==to){
                    var evalStr=findEval(line,item_config);
                    var array_params=choiceDetermin(evalStr)
                    for(var i=0;i<array_params.length;i++){
                        var temp=array_params[i];
                        if(!contains(allArray,temp)){
                            allArray.push(temp);
                        }
                    }
                }
            }
        }
        resolve(utils.returnMsg(true, '0000', '，查询参数正常', allArray, null)) ;
    });

}

//删除数组中的无效节点
/**
 *
 * @param process_define
 * @param item_config
 * @param node_array
 * @param node_code
 * @param params
 * @returns {bluebird}
 *
 * @desc
 */
function deleteInvalidNode(process_define,item_config,node_array,node_code,params){
    return new Promise(async (resolve)=>{
        var status_default=true;
        var lines=process_define.lines;
        var params_key_array=[];
        for (var param in params) {
            //把params的key全部放入数组中
            params_key_array.push(param);
        }
        for(var line in lines){
            var from=lines[line].from;
            var to =lines[line].to;
            var name=await findEval(line,item_config);

            if(node_code==from){
                var eval_flag=false;
                for(var j=0;j<params_key_array.length;j++){
                    var key=params_key_array[j];
                    var index=name.indexOf(key);
                    if(index != -1){
                        eval_flag=true;
                    }
                }
                if(eval_flag){
                    // return false this next_node is invalid node; return true this next_node is valid;
                    var invalid_flag= await determinChoice(name,params,resolve);
                    if(invalid_flag){
                        status_default=false;
                    }else{
                        // 删除    无效节点",to
                        node_array=await remove(node_array,to);
                    }
                } else{
                    //匹配不上当前节点
                    if(status_default){
                        //匹配不到走默认路线
                    }else{
                        //匹配到了删除默认路线
                        node_array=remove(node_array,to);
                    }
                }
            }
        }
        resolve(node_array);
    })

}

//删除数组中的指定元素
function remove (arr,value) {
    if(arr){
        var endIndex=-1;
        for( var i=0;i<arr.length;i++) {
            if (arr[i] == value) {
                endIndex=i;
            }
        }
        if(endIndex==-1){
            return arr;
        }else{

            return arr.slice(0,endIndex).concat(arr.slice(endIndex+1,arr.length))
        }
    }
};


/**
 *
 * @param varArray
 * @returns {{}}
 *
 * @desc 把线上参数和符号 分离出来
 */
function isAlpha(varArray){
    var varyMap={};
    var codeArray=[];
    for(var i=65;i<90;i++){
        codeArray.push(i);
    }
    codeArray.push(95);
    for (var i =97;i<122;i++){
        codeArray.push(i);

    }
    for(var i =0;i<varArray.length;i++){
        var codeStr=varArray[i];
        if(codeStr!='false'&&codeStr!='true'){
            var code=codeStr[0].charCodeAt();
            if(contains(codeArray,code)){
                // console.log(codeStr,"   是变量");
                varyMap[codeStr]="null";
            }
        }
    }
    return varyMap;
}

/**
 *
 * @param string
 * @param arrays
 * @returns {Array}
 *
 * @desc 解析表达式
 */
function analysisStr(string,arrays){
    var varArray=[];
    var tempSet=0;
    if(!contains(arrays,0)){
        arrays=[0].concat(arrays);
    }

    if(!contains(arrays,string.length+1)){
        arrays=arrays.concat([string.length+1]);
    }
    for (var i =1; i<arrays.length;i++){
        var start=arrays[i-1];
        var end=arrays[i];
        var temp=string.substring(start,end);
        if(temp.length>0){
            varArray.push(temp);
        }
    }
    return varArray;
}

/**
 *
 * @param sampleSet
 * @param arrays
 * @returns {*}
 *
 * @desc 合并数组方法
 */

function mergeArray(sampleSet,arrays){
    for(var item in sampleSet){
        var temp=sampleSet[item];
        arrays=arrays.concat(temp);
    }
    return arrays;
}

/**
 *
 * @param arrays
 * @returns {*}
 *
 * @desc 对数组进行排序
 */
function sortArray(arrays){
    for(var i =0;i<arrays.length;i++){
        for (var j=i+1;j<arrays.length;j++){
            if(arrays[i]>arrays[j]){
                var temp;
                temp=arrays[i];
                arrays[i]=arrays[j]
                arrays[j]=temp;
            }
        }

    }
    var tempArray= arrays
    for (var i =1;i<tempArray.length;i++){
        var start=tempArray[i-1];
        var end =tempArray[i];
        if(start==end){
            arrays=remove(arrays,end);
        }
    }
    return arrays;
}


/**
 *
 * @param sampleSet
 * @returns {*}
 *
 * @desc 对配置线上表达式参数符号去重
 */
function deleteDuplicate(sampleSet){
    for(var item in sampleSet){
        if(item=="<="){
            var temp=sampleSet[item];
            var temps=sampleSet["<"];
            if(temp.length>0&&temps.length>0){
                for(var i = 0 ;i<temp.length;i++){
                    if(contains(temps,temp[i])){
                        temps=remove(temps,temp[i]);
                    }
                }
                sampleSet["<"]=temps;
            }
        }else if(item==">="){
            var temp=sampleSet[item];
            var temps=sampleSet[">"];
            if(temp.length>0&&temps.length>0){
                for(var i = 0 ;i<temp.length;i++){
                    if(contains(temps,temp[i])){
                        temps=remove(temps,temp[i]);
                    }
                }
                sampleSet[">"]=temps;
            }
        }
    }

    return sampleSet;
}

/**
 *
 * @param string
 * @param single
 * @param sets
 * @param set
 * @param sampleSet
 * @returns {*}
 *
 *
 * @desc 在解析线上参数表达式的时候对线上参数 进行解析
 */
function findAllSample(string,single,sets,set,sampleSet){
    var temp =new String(string);
    if (set != -1) {
        if(single==">"||single=="<"||single=="("||single==")"){
            var lastSet=temp.lastIndexOf(single);
            if (set ==lastSet) {
                sampleSet[single]=sets;
                return sampleSet;
            } else {
                if(set==0){
                    temp=temp.substring(set);
                    set=temp.indexOf(single);
                    if(!contains(sets,set)){
                        sets.push(set);
                    }
                    if(!contains(sets,set+1)){
                        sets.push(set+1);
                    };
                    findAllSample(string, single, sets, set,sampleSet);

                }else {
                    temp = temp.substring(set + 1);
                    var tempSet=temp.indexOf(single);
                    tempSet+=1;
                    set +=tempSet;
                    if(!contains(sets,set)){
                        sets.push(set);
                    }
                    if(!contains(sets,set+1)){
                        sets.push(set+1);
                    };
                    if(set==lastSet){
                        sampleSet[single]=sets;
                        return sampleSet;
                    }else{
                        findAllSample(string, single, sets, set,sampleSet);
                    }

                }
            }

        }else{
            var lastSet=temp.lastIndexOf(single);
            if (set ==lastSet) {
                sampleSet[single]=sets;
                return sampleSet;
            } else {
                if(set==0){
                    temp=temp.substring(set);
                    set=temp.indexOf(single);
                    if(!contains(sets,set)){
                        sets.push(set);
                    }
                    if(!contains(sets,set+2)){
                        sets.push(set+2);
                    }
                    findAllSample(string, single, sets, set,sampleSet);

                }else {
                    temp = temp.substring(set + 1);
                    var tempSet=temp.indexOf(single);
                    tempSet+=1;
                    set +=tempSet;
                    if(!contains(sets,set)){
                        sets.push(set);
                    }
                    if(!contains(sets,set+2)){
                        sets.push(set+2);
                    }
                    if(set==lastSet){
                        sampleSet[single]=sets;
                        return sampleSet;
                    }else{
                        findAllSample(string, single, sets, set,sampleSet);
                    }

                }
            }

        }
    }
}

/**
 *
 * @param arr
 * @param obj
 * @returns {boolean}
 *
 * @desc 对数组检测是否包含某个元素
 */
function contains(arr,obj){
    for(var i=0;i<arr.length;i++){
        if(obj==arr[i]){
            return true;
        }
    }
    return false;
}

/**
 *
 * @param str
 * @returns {Array}
 *
 * @desc 对所有下步节点进行解析，通过线上表达式判定是否，为下一步要执行的节点
 */

function choiceDetermin(str){
    var sampleSet = {};
    var arrays=[];
    var arrs=[]
    if(str){
        var string = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        var sample = ["(", ")", "&&", "||", ">", "<", "==", ">=", "<="]
        for (var i = 0; i < sample.length; i++) {
            var single = sample[i];
            var set = 0;
            var sets=[];
            findAllSample(string,single,sets,set,sampleSet);
        }
        //去重 <= <    和    >= >
        sampleSet=deleteDuplicate(sampleSet);
        //合并
        arrays=mergeArray(sampleSet,arrays);
        arrays=sortArray(arrays);
        //分析那些节点为下一步有效节点
        var varArray=analysisStr(string,arrays);
        var map=isAlpha(varArray);

        for(var item in map){
            arrs.push(item);
        }
    }
    return arrs;
}

/**
 * @param user_code
 */
exports.findOrg=findOrg

var findOrg=async(user_code,reject)=>{
    var org_info={};
    let rs=await model_user.$User.find({"user_no":user_code});
    if(rs.length!=1)reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, null));
    org_info.user_org=rs[0].user_org;
    let org= await model_user.$CommonCoreOrg.find({"_id":org_info.user_org});
    if(org.length==0)reject(utils.returnMsg(false, '1000', '查询机构信息错误', null, null));
    org_info.user_org_name=result[0].org_name;
    return org_info;
}
// //查找上级人员
// function find_up(user_code, reject, user_org_id, returnMap, resolve) {
//     var item_assignee_role;
//     var org_array=[];
//     //上级
//
//     model_user.$User.find({"user_no": user_code},function(err,rs) {
//         if (err) {
//             console.log(err);
//             reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, err))
//         } else {
//             if (rs.length > 0) {
//                 user_org_id = rs[0].user_org;
//                 model_user.$CommonCoreOrg.find({"_id": user_org_id}, function (error, result) {
//                     if (error) {
//                         console.log(error)
//                         reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, error))
//
//                     } else {
//                         user_org_id = result[0].org_pid;
//                         org_array.push(user_org_id);
//                         model_user.$CommonCoreOrg.find({"org_pid": user_org_id}, function (est, rst) {
//                             if (est) {
//                                 console.log(est);
//                                 reject(utils.returnMsg(false, '1000', '查询用户jigou 信息错误', null, rst))
//                             } else {
//                                 if (rst.length > 0) {
//                                     for (var i = 0; rst.length > i; i++) {
//                                         org_array.push(rst[i]._id);
//                                     }
//                                     returnMap.user_org_id = org_array;
//                                     returnMap.proc_inst_task_assignee = "";
//                                     returnMap.proc_inst_task_assignee_name = "";
//                                     resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));
//                                 } else {
//                                     reject(utils.returnMsg(false, '1000', '查询用户jigou 信息错误', null, null))
//                                 }
//                             }
//                         });
//                     }
//
//                 })
//
//             } else {
//                 reject(utils.returnMsg(false, '1000', '查询用户jigou 信息错误', null, null))
//             }
//
//         }
//     })
// }

// function find_up_bak(user_code, user_org_id, returnMap) {
//     return new Promise(function (resolve,reject) {
//         var item_assignee_role;
//         var org_array = [];
//         //上级
//         model_user.$User.find({"user_no": user_code}, function (err, rs) {
//             if (err) {
//                 console.log(err);
//                 reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, err))
//             } else {
//                 if (rs.length > 0) {
//                     user_org_id = rs[0].user_org;
//                     model_user.$CommonCoreOrg.find({"_id": user_org_id}, function (error, result) {
//                         if (error) {
//                             console.log(error)
//                             reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, error))
//
//                         } else {
//                             user_org_id = result[0].org_pid;
//                             org_array.push(user_org_id);
//                             model_user.$CommonCoreOrg.find({"org_pid": user_org_id}, function (est, rst) {
//                                 if (est) {
//                                     console.log(est);
//                                     reject(utils.returnMsg(false, '1000', '查询用户jigou 信息错误', null, rst))
//                                 } else {
//                                     if (rst.length > 0) {
//                                         for (var i = 0; rst.length > i; i++) {
//                                             org_array.push(rst[i]._id);
//                                         }
//                                         returnMap.user_org_id = org_array;
//                                         returnMap.proc_inst_task_assignee = "";
//                                         returnMap.proc_inst_task_assignee_name = "";
//                                         resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));
//                                     } else {
//                                         reject(utils.returnMsg(false, '1000', '查询用户jigou 信息错误', null, null))
//                                     }
//                                 }
//                             });
//                         }
//
//                     })
//                 } else {
//                     reject(utils.returnMsg(false, '1000', '查询用户jigou 信息错误', null, null))
//                 }
//             }
//         })
//     })
//
// }




//找到所有的 市级公司
/**
 *
 * @param org
 * @param arr
 * @returns {Promise<void>}
 *
 * @desc 使用递归方法 查找所有机构子节点
 */
async function find_all_org(org,arr){
    arr.push(org);
    let t =await model_user.$CommonCoreOrg.find({"_id":org});
    let res=await model_user.$CommonCoreOrg.find({"org_pid":org});
    for (let i in res){
        let level=res[i].level;
        if(!level){
            level=5
        }
        if(level<6)find_all_org(res[i]._id,arr);
    }
}
//
// async function find_all_Sameorg(org,arr){
//     arr.push(org);
//     let t =await model_user.$CommonCoreOrg.find({"_id":org});
//     let res=await model_user.$CommonCoreOrg.find({"org_pid":org});
//     for (let i in res){
//         find_all_org(res[i]._id,arr)
//     }
// }

// exports.getAssiantMain=function(user_no,role_no,proc_code,param_json_str,node_code){
//     var params={};
//     return new Promise((resolve,reject)=>{
//         model_user.$User.find({"user_no":user_no},function(err,res){
//             if(err){
//                 console.log(err);
//
//             }else{
//                 var condition={};
//                 condition.org=res[0].user_org;
//                 condition.roles=[role_no];
//                 getAssiant(condition).then((rs)=>{
//                     if(!(!param_json_str||param_json_str=="undefined"||param_json_str=="{}")){
//
//                         var params_json=JSON.parse(param_json_str);
//                         var flag=true;
//                         for(var items_ in params_json){
//                             flag=false;
//                         }
//                         if(flag){
//                             resolve(utils.returnMsg(false, '1001', '参数解析不正确。', null, null));
//                         }else{
//                             params=params_json;
//                         }
//                     }else{
//                         params={};
//                     }
//                     model.$ProcessDefine.find({"proc_code":proc_code},function(error,result){
//                         if(error){
//                             console.log(error);
//
//                         }else{
//                             if(result.length){
//                                 var proc_define=JSON.parse(result[0].proc_define);
//                                 //获取节点详细信息
//                                 var nodes=proc_define.nodes;
//                                 //获取节点之间关系
//                                 var lines=proc_define.lines;
//                                 getNode(result[0].proc_id,node_code,params,true).then((rss)=>{
//                                     if(rss.success){
//                                         var next_detail=rss.data.next_detail;
//                                         var next_node=rss.data.next_node;
//                                         var node_code = next_detail.item_code
//                                         var node_name = next_node.name
//                                         var array = [];
//                                         for(let i in rs){
//                                             var map = {};
//                                             map.user_no = rs[i].user_no;
//                                             map.user_name = rs[i].user_name;
//                                             map.node_name = node_name;
//                                             map.node_code = node_code;
//                                             array.push(map);
//                                         }
//                                         resolve(utils.returnMsg(true, '0000', '查询用户org', array, null));
//                                     }else{
//                                         resolve(rss);
//                                     }
//                                 })
//
//                             }else{
//
//                                 resolve(utils.returnMsg(false, '1000', '查询用户信息错误', null, errs))
//
//                             }
//
//                         }
//
//
//                     });
//                 })
//             }
//         })
//     })
// }
//
//
// //condition  roles[role_id] org[org_id]
// function getAssiant(condition){
//     return new Promise((resolve)=>{
//         find_all_org_main(condition.org).then((rs)=>{
//             model_user.$User.find({"user_roles":{$in:condition.roles},"user_org":{$in:rs}},function(err,res){
//                 if(err){
//                     console.log(err)
//                 }else{
//                     resolve(res);
//                 }
//             })
//         })
//     })
// }

// //找到市级公司的
// function find_all_org_main(orgs){
//     return new Promise((resolve)=>{
//         var arr=[];
//         model_user.$CommonCoreOrg.find({"_id":{$in:orgs}},function(err,res){
//             if(res.length){
//                 var array=find_level_3(res);
//                 arr.push(orgs[0]);
//                 find_all_org(array,arr);
//                 resolve(arr);
//             }
//         });
//
//     })
//
// }

//
// //使用递归方式找到所有的市公司
// async function find_level_3(res){
//     var arr=res.map(function(org,index,input){
//         if(org.level==3){
//             return org._id;
//         }else if(org.level>3){
//             model_user.$CommonCoreOrg.find({"_id":org.org_pid},function(error,result){
//                 if(result.length){
//                     if(result[0].level==3){
//                         return result[0]._id;
//                     }else{
//                         find_level_3(result[0]._id)
//                     }
//                 }
//             });
//         }
//         else if(org.level<3){
//             model_user.$CommonCoreOrg.find({"org_pid":org._id},function(error,result){
//                 if(result.length){
//                     if(result[0].level==3){
//                         return result[0]._id;
//                     }else{
//                         find_level_3(result[0]._id)
//                     }
//                 }
//             });
//         }
//     });
//     return arr;
// }

/**
 *
 * @param user_code
 * @param reject
 * @param proc_inst_id
 * @param node_code
 * @param params
 */
exports.findNextHandler=function(user_code,proc_define_id,node_code,params,proc_inst_id) {
    var user_org_id, org_pid, type;
    var returnMap = {};
    var p=new Promise(function(resolve,reject){
        model.$ProcessDefine.find({"_id":proc_define_id}, function (errs, result) {
            if (errs) {
                console.log(errs);
                reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, errs))
            } else {
                // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                if (result.length > 0) {
                    // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    // console.log(result);
                    var proc_define = JSON.parse(result[0].proc_define);
                    var item_config = JSON.parse(result[0].item_config);

                    // var proc_define_id=result[0].proc_define_id;

                    getNextnode(proc_inst_id,node_code,params,true).then(function(rs){


                        if(!rs.success){
                            resolve(utils.returnMsg(false, '1001', '节点获取失败', null, rs));
                            return;
                        }
                        var data=rs.data;
                        var current_detail=data.current_detail;
                        var current_node=data.current_node;

                        var next_node=data.next_node;
                        // console.log("next______________________________________node",data);
                        if(next_node.type=="end  round"){
                            var query = model_user.$User.find({});
                            query.where("user_no", user_code);
                            query.exec(function (err, rs) {
                                if (err) {
                                    console.log(err);
                                    reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                } else {

                                    user_org_id = rs[0].user_org;
                                }
                            }).then(function () {
                                returnMap.proc_inst_task_assignee="";
                                returnMap.proc_inst_task_assignee_name="";
                                returnMap.user_org_id=user_org_id;
                                resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))
                            })

                        }else{
                            var next_detail=data.next_detail;
                            // var item_assignee_ref_task=next_detail.item_assignee_ref_task;
                            // var results=choiceNode(item_config,proc_define,item_assignee_ref_task,null);
                            var results=choiceNode(item_config,proc_define,next_detail.item_code,node_code);
                             console.log("result   ",results);
                            var ref_node_detail=results.current_detail;
                            // var ref_item_assignee_type=ref_node_detail.item_assignee_type
                            // if()
                            // var item_assignee_role=ref_node_detail.item_assignee_role//: '595cafd7e3c7c90e1c599732',
                            var item_assignee_ref_cur_org=next_detail.item_assignee_ref_cur_org//: '1',
                            var item_assignee_ref_type=next_detail.item_assignee_ref_type;//// 参照人类别 1-当前人，2-当前机构
                            /**
                             *  \"item_assignee_ref_cur_org\": \"1\",
                             \"item_assignee_ref_type\": \"2\",
                             \"item_assignee_type\": 3,
                             *
                             */
                            type=next_detail.item_assignee_type
                            if(type==1){
                                //单人
                                model_user.$User.find({"user_no":user_code},function(err,result){
                                    if(err){
                                        console.log(err);
                                        reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                    }else{
                                        if(result.length>0){
                                            returnMap.user_org_id=result[0].user_org;
                                            returnMap.proc_inst_task_assignee="";
                                            returnMap.proc_inst_task_assignee_name="";
                                            resolve(utils.returnMsg(true, '00000', '查询用户org', returnMap, null))
                                        }else{
                                            resolve(utils.returnMsg(false, '10000', '查询无用户数据',null, err))
                                        }
                                    }
                                })
                            }else if(type==2){

                                // 角色
                                var item_assignee_org_ids;
                                if(next_detail.item_assignee_org_ids){
                                    if(next_detail.item_assignee_org_ids.indexOf(",")!=-1){
                                        item_assignee_org_ids = next_detail.item_assignee_org_ids.split(",");
                                    }else{
                                        item_assignee_org_ids = [next_detail.item_assignee_org_ids];
                                    }
                                    returnMap.user_org_id=item_assignee_org_ids;
                                    returnMap.proc_inst_task_assignee="";
                                    returnMap.proc_inst_task_assignee_name="";
                                    resolve(utils.returnMsg(true, '00000', '查询用户org', returnMap, null))
                                }else{
                                    returnMap.user_org_id="";
                                    returnMap.proc_inst_task_assignee="";
                                    returnMap.proc_inst_task_assignee_name="";
                                    resolve(utils.returnMsg(true, '00000', '查询用户org', returnMap, null))
                                }/*else{
                                    model_user.$User.find({"user_no":user_code},function(err,result){
                                        if(err){
                                            console.log(err);
                                            reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                        }else{
                                            if(result.length>0){
                                                returnMap.user_org_id=result[0].user_org;
                                                returnMap.proc_inst_task_assignee="";
                                                returnMap.proc_inst_task_assignee_name="";
                                                resolve(utils.returnMsg(true, '00000', '查询用户org', returnMap, null))
                                            }else{
                                                resolve(utils.returnMsg(false, '10000', '查询无用户数据',null, err))
                                            }
                                        }
                                    })
                                }*/



                            }else if(type==3){
                                //参考



                                if(item_assignee_ref_type==1){

                                    //当前人  1
                                    //1. 提取参照节点
                                    //2.去任务表 根据节点和proc_define_id 找到相对应的任务执行完成人（操作人）
                                    //3.提取操作人的信息（user_no,org_no）

                                    model.$ProcessInstTask.find({"proc_inst_id" : proc_inst_id,"proc_inst_task_code" : item_assignee_ref_task},function(err,results){
                                        if(err){
                                            console.log(err)
                                            reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                        }else{
                                            // console.log("resultsresultsresultsresultsresultsresultsresultsresultsresultsresults \n",results)
                                            returnMap.proc_inst_task_assignee=results[0].proc_inst_task_assignee;
                                            returnMap.proc_inst_task_assignee_name=results[0].proc_inst_task_assignee
                                            returnMap.user_org_id=results[0].proc_inst_task_user_org;
                                            resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))
                                        }
                                    })

                                }else if(item_assignee_ref_type==2){
                                    //参照人

                                    if (item_assignee_ref_cur_org == 1) {
                                        //同级
                                        if(proc_inst_id){
                                            //
                                            model.$ProcessInstTask.find({"proc_inst_id" : proc_inst_id,"proc_inst_task_code" : item_assignee_ref_task},function(err,results){
                                                if(err){
                                                    console.log(err)
                                                    reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                                }else{
                                                    // console.log("resultsresultsresultsresultsresultsresultsresultsresultsresultsresults \n",results)
                                                    model_user.$User.find({"user_no":results[0].proc_inst_task_assignee},function(e_a,r_a){
                                                        if(e_a){
                                                            reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, e_a));
                                                        }else{
                                                            user_org_id = r_a[0].user_org;
                                                            returnMap.user_org_id=user_org_id;
                                                            returnMap.proc_inst_task_assignee="";
                                                            returnMap.proc_inst_task_assignee_name="";
                                                            resolve(utils.returnMsg(true, '10000', '查询用户org1', returnMap, null))
                                                        }
                                                    });

                                                }
                                            })

                                        }else{
                                            var query = model_user.$User.find({});
                                            query.where("user_no", user_code);
                                            query.exec(function (err, rs) {
                                                if (err) {
                                                    console.log(err);
                                                    reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                                } else {
                                                    user_org_id = rs[0].user_org;
                                                    returnMap.user_org_id=user_org_id;
                                                    returnMap.proc_inst_task_assignee="";
                                                    returnMap.proc_inst_task_assignee_name="";
                                                    resolve(utils.returnMsg(true, '10000', '查询用户org1', returnMap, null))
                                                }
                                            }) ;

                                        }


                                    } else if (item_assignee_ref_cur_org == 2) {
                                        //上级
                                        if(proc_inst_id){
                                            model.$ProcessInstTask.find({"proc_inst_id" : proc_inst_id,"proc_inst_task_code" : item_assignee_ref_task},function(err,results){
                                                if(err){
                                                    console.log(err)
                                                    reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                                }else{
                                                    // console.log("resultsresultsresultsresultsresultsresultsresultsresultsresultsresults \n",results)
                                                    // returnMap.proc_inst_task_assignee=results[0].proc_inst_task_assignee;
                                                    if(results.length>0){
                                                        find_up(results[0].proc_inst_task_assignee, reject, user_org_id, returnMap, resolve);
                                                    }else{
                                                        reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                    }
                                                }
                                            });

                                        }else{

                                            find_up(user_code, reject, user_org_id, returnMap, resolve);
                                        }

                                    }else if(item_assignee_ref_cur_org == 3){
                                        //下级
                                        if(proc_inst_id){
                                            model.$ProcessInstTask.find({"proc_inst_id" : proc_inst_id,"proc_inst_task_code" : item_assignee_ref_task},function(errors,results){
                                                if(errors){
                                                    console.log(errors);
                                                    reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, errors));
                                                }else{
                                                    // console.log("resultsresultsresultsresultsresultsresultsresultsresultsresultsresults \n",results)
                                                    // returnMap.proc_inst_task_assignee=results[0].proc_inst_task_assignee;
                                                    // find_up(results[0].proc_inst_task_assignee, reject, user_org_id, returnMap, resolve);
                                                    if(results.length>0){
                                                        model_user.$User.find({"user_no":results[0].proc_inst_task_assignee},function(err,rs){
                                                            if (err) {
                                                                console.log(err);
                                                                reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, err))
                                                            } else {
                                                                if(rs.length>0){
                                                                    // user_org_id = ;
                                                                    model_user.$CommonCoreOrg.find({"org_pid": {$in:rs[0].user_org}}, function (error, result) {
                                                                        if (error) {
                                                                            console.log(error)
                                                                            reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, error))
                                                                        } else {
                                                                            var arr_t=[];
                                                                            for(var i=0;result.length>i;i++){
                                                                                arr_t.push(result[i]._id);
                                                                            }
                                                                            user_org_id = arr_t;
                                                                            // user_org_id = result[0].org_pid;
                                                                            // returnMap.item_assignee_role = item_assignee_role;
                                                                            returnMap.user_org_id = arr_t;
                                                                            returnMap.proc_inst_task_assignee="";
                                                                            returnMap.proc_inst_task_assignee_name="";
                                                                            resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));
                                                                        }
                                                                    })
                                                                }else{

                                                                    reject(utils.returnMsg(false, '1000', '查询budao用户信息', null, null))
                                                                }
                                                            }

                                                        })

                                                    }else{
                                                        reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, null))
                                                    }
                                                }
                                            });



                                        }else{

                                            //下级
                                            var query = model_user.$User.find({});
                                            query.where("user_no", user_code);
                                            query.exec(function (err, rs) {
                                                if (err) {
                                                    console.log(err);
                                                    reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, err))
                                                } else {
                                                    if(rs.length>0){
                                                        user_org_id = rs[0].user_org;
                                                    }else{

                                                        reject(utils.returnMsg(false, '1000', '查询budao用户信息', null, null))
                                                    }


                                                }
                                            }).then(function () {
                                                model_user.$CommonCoreOrg.find({"org_pid": user_org_id}, function (error, result) {
                                                    if (error) {
                                                        console.log(error)
                                                        reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, error))
                                                    } else {
                                                        user_org_id = result[0].org_pid;
                                                    }

                                                }).then(function () {
                                                    returnMap.item_assignee_role = item_assignee_role;
                                                    returnMap.user_org_id = [user_org_id];
                                                    returnMap.proc_inst_task_assignee="";
                                                    returnMap.proc_inst_task_assignee_name="";
                                                    resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));
                                                })
                                            })
                                        }


                                    }else if(item_assignee_ref_cur_org == 4){
                                        //上上级
                                        //user_code, reject, user_org_id, returnMap, resolve
                                        if(proc_inst_id){
                                            model.$ProcessInstTask.find({"proc_inst_id" : proc_inst_id,"proc_inst_task_code" : item_assignee_ref_task},function(error,result){
                                                if(error){
                                                    console.log(error);
                                                    reject(utils.returnMsg(false, '1000', '查询用户信息错误', null,error))
                                                }else{
                                                    if(result.length>0){
                                                        find_up_up(result[0].proc_inst_task_assignee, reject, user_org_id, returnMap, resolve)

                                                    }else{
                                                        reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, null))

                                                    }

                                                }
                                            })

                                        }else{
                                            find_up_up(user_code, reject, user_org_id, returnMap, resolve);
                                            // find_up_up(result[0].proc_inst_task_assignee, reject, user_org_id, returnMap, resolve)
                                        }

                                    }
                                }
                            }
                        }

                    })
                }else{
                    reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, null))


                }
            }
        })

    });
    return p;

}

function find_up_up(user_code, reject, user_org_id, returnMap, resolve){
    var org_array=[];
    model_user.$User.find({"user_no": user_code},function(e,r){
        if(e){
            console.log(e);
            reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, e))
        }else{
            if(r.length>0){
                model_user.$CommonCoreOrg.find({"_id":{$in:r[0].user_org}},function(es,rs){

                    if(es){
                        console.log(es);
                        reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, es))
                    }else{
                        if(rs.length>0){
                            model_user.$CommonCoreOrg.find({"_id":{$in:rs[0].org_pid}},function(err,res){
                                if(err){
                                    console.log(err);
                                    reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                }else{
                                    org_array.push(res[0]._id);
                                    model_user.$CommonCoreOrg.find({"_id":res[0].org_pid},function(error,result){
                                        if(error){
                                            console.log(error);
                                            reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, error))
                                        }else{

                                            if(result.length>0){
                                                model_user.$CommonCoreOrg.find({"org_pid":result[0]._id},function(errors,results){
                                                    if(errors){
                                                        console.log(errors);
                                                    }else{
                                                        if(results.length>0){
                                                            for(var i =0;i<results.length;i++){
                                                                org_array.push(results[i]._id);
                                                            }
                                                            returnMap.user_org_id = org_array;
                                                            returnMap.proc_inst_task_assignee="";
                                                            returnMap.proc_inst_task_assignee_name="";
                                                            resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));
                                                        }else{
                                                            reject(utils.returnMsg(false, '10000', '查询用户信息错误', null, null))
                                                        }
                                                    }
                                                })
                                            }else{
                                                reject(utils.returnMsg(false, '10000', '查询用户信息错误', null, null))
                                            }
                                        }
                                    })
                                }
                            })
                        }else{
                            reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, null))
                        }
                    }
                })
            }else{
                reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, null))
            }
        }
    })

}

exports.findCurrentHandler=function(user_code,proc_define_id,node_code,params,proc_inst_id) {
    var user_org_id, type;
    var returnMap = {};
    var p=new Promise(function(resolve,reject){
        model.$ProcessDefine.find({"_id":proc_define_id}, function (errs, result) {
            if (errs) {
                console.log(errs)
                reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, errs))
            } else {
                // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                if (result.length > 0) {
                    // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                    // console.log(result);
                    var proc_define = JSON.parse(result[0].proc_define);
                    var item_config = JSON.parse(result[0].item_config);

                    // var proc_define_id=result[0].proc_define_id;

                    getNextnode(proc_inst_id,node_code,params,true).then(function(rs){

                        // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",)
                        // console.log(rs)
                        var data=rs.data;
                        var current_detail=data.current_detail;
                        var current_node=data.current_node;


                        // console.log("next______________________________________node",data);
                        if(current_node.type=="end  round"){
                            var query = model_user.$User.find({});
                            query.where("user_no", user_code);
                            query.exec(function (err, rs) {
                                if (err) {
                                    console.log(err);
                                    reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                } else {
                                    user_org_id = rs[0].user_org;
                                }
                            }).then(function () {
                                returnMap.proc_inst_task_assignee="";
                                returnMap.proc_inst_task_assignee_name="";
                                returnMap.user_org_id=user_org_id;
                                resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))
                            })

                        }else{
                            var current_detail=data.current_detail;
                            var item_assignee_ref_task=current_detail.item_assignee_ref_task;
                            var results=choiceNode(item_config,proc_define,item_assignee_ref_task,null);
                            var ref_node_detail=results.current_detail;
                            var item_assignee_ref_cur_org=current_detail.item_assignee_ref_cur_org//: '1',
                            var item_assignee_ref_type=current_detail.item_assignee_ref_type;//// 参照人类别 1-当前人，2-当前机构

                            type=current_detail.item_assignee_type
                            if(type==1){
                                //单人
                                model_user.$User.find({"user_no":user_code},function(err,result){
                                    if(err){
                                        console.log(err)
                                        reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                    }else{
                                        returnMap.user_org_id=result[0].user_org;
                                        returnMap.proc_inst_task_assignee="";
                                        returnMap.proc_inst_task_assignee_name="";
                                        resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))

                                    }

                                })
                            }else if(type==2){
                                // 角色
                                var item_assignee_org_ids = current_detail.item_assignee_org_ids;
                                returnMap.proc_inst_task_assignee="";
                                returnMap.proc_inst_task_assignee_name="";
                                returnMap.user_org_id=item_assignee_org_ids;
                                resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))

                            }else if(type==3){

                                if(item_assignee_ref_type==1){
                                    //当前人  1
                                    //1. 提取参照节点
                                    //2.去任务表 根据节点和proc_define_id 找到相对应的任务执行完成人（操作人）
                                    //3.提取操作人的信息（user_no,org_no）

                                    model.$ProcessInstTask.find({"proc_inst_id" : proc_inst_id,"proc_inst_task_code" : item_assignee_ref_task},function(err,results){
                                        if(err){
                                            console.log(err)
                                            reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                        }else{
                                            // console.log("resultsresultsresultsresultsresultsresultsresultsresultsresultsresults \n",results)
                                            returnMap.proc_inst_task_assignee=results[0].proc_inst_task_assignee;
                                            returnMap.proc_inst_task_assignee_name=results[0].proc_inst_task_assignee
                                            returnMap.user_org_id=results[0].proc_inst_task_user_org
                                            resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))
                                        }
                                    })

                                }else if(item_assignee_ref_type==2){
                                    //参照人

                                    if (item_assignee_ref_cur_org == 1) {
                                        //同级
                                        var query = model_user.$User.find({});
                                        query.where("user_no", user_code);
                                        query.exec(function (err, rs) {
                                            if (err) {
                                                console.log(err);
                                                reject(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
                                            } else {
                                                user_org_id = rs[0].user_org;
                                                returnMap.user_org_id=user_org_id;
                                                returnMap.proc_inst_task_assignee="";
                                                returnMap.proc_inst_task_assignee_name="";
                                                resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))
                                            }
                                        }) ;


                                    } else if (item_assignee_ref_cur_org == 2) {
                                        //上级
                                        var query = model_user.$User.find({});
                                        query.where("user_no", user_code);
                                        query.exec(function (err, rs) {
                                            if (err) {
                                                console.log(err);
                                                reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, err))
                                            } else {
                                                user_org_id = rs[0].user_org;
                                            }
                                        }).then(function () {
                                            model_user.$CommonCoreOrg.find({"_id": user_org_id}, function (error, result) {
                                                if (error) {
                                                    console.log(error)
                                                    reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, error))

                                                } else {
                                                    user_org_id = result[0].org_pid;
                                                }

                                            }).then(function () {
                                                returnMap.item_assignee_role = item_assignee_role;
                                                returnMap.user_org_id = user_org_id;
                                                returnMap.proc_inst_task_assignee="";
                                                returnMap.proc_inst_task_assignee_name="";
                                                resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));
                                            })
                                        })
                                    }
                                }
                            }
                        }

                    })
                }else{
                    reject(utils.returnMsg(false, '1000', '查询用户信息错误', null, null))


                }
            }
        })

    });
    return p;

}


function findUserByOrgs(orgs, i, item_assignee_role,array,node_name,node_code) {
    if(orgs&&orgs.length>i){
        if (orgs[i]) {
            var conta = {"user_org": orgs[i], "user_roles": item_assignee_role};
            if(orgs[i]=='0'){
                conta = {"user_roles": item_assignee_role};
            }
            model_user.$User.find(conta, function (err, result) {
                if (err) {
                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, err));
                } else {
                    //    var map={};
                    if(result.length>0){
                        for (var index = 0; index < result.length; index++) {
                            var map={};
                            map.user_no = result[index].user_no;//: "00001"
                            map.user_name = result[index].user_name;// : "系统管理员"
                            map.node_name=node_name;
                            map.node_code=node_code;
                            array.push(map)

                        }

                        // map.user_no = result[0].user_no;//: "00001"
                        // map.user_name = result[0].user_name;// : "系统管理员"
                        // map.node_name=node_name;
                        // map.node_code=node_code;
                        // array.push(map)
                        i++;
                        findUserByOrg(orgs, i, item_assignee_role, resolve,array,node_name,node_code)
                    }else{
                        return ;
                    }

                }
            });
        }

    }else{
        resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
    }
}

function findUserByOrg(orgs, i, item_assignee_role, resolve,array,node_name,node_code) {
    if(orgs&&orgs.length>i){
        if (orgs[i]) {

            var conta = {"user_org": orgs[i], "user_roles": item_assignee_role};
            if(orgs[i]=='0'){
                conta = {"user_roles": item_assignee_role};
            }
            model_user.$User.find(conta, function (err, result) {
                if (err) {
                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, err));
                } else {
                    if(result.length>0){

                        for (var index = 0; index < result.length; index++) {
                            var map={};
                            map.user_no = result[index].user_no;//: "00001"
                            map.user_name = result[index].user_name;// : "系统管理员"
                            map.node_name=node_name;
                            map.node_code=node_code;
                            array.push(map)

                        }

                        // map.user_no = result[0].user_no;//: "00001"
                        // map.user_name = result[0].user_name;// : "系统管理员"
                        // map.node_name=node_name;
                        // map.node_code=node_code;
                        // array.push(map)
                        i++;
                        findUserByOrg(orgs, i, item_assignee_role, resolve,array,node_name,node_code)
                    }else{
                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                    }

                }
            });
        }

    }else{
        resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
    }
}
//user_code,proc_define_id,node_code,params,proc_inst_id



function findInfo(next_node, resolve, next_detail, proc_inst_id) {
    if (next_node.type == "end  round") {
        var array = []
        var map = {};
        // var node_code=next_detail.item_code
        var node_name = next_node.name
        // map.user_name=next_detail.item_show_text;
        // map.user_no=item_assignee_user_code;
        map.node_name = node_name;
        // map.node_code=node_code;
        array.push(map)
        resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))

    } else {
        var item_assignee_ref_task = next_detail.item_assignee_ref_task;
        // var results=choiceNode(item_config,proc_define,item_assignee_ref_task,null);

        var item_assignee_ref_cur_org = next_detail.item_assignee_ref_cur_org//: '1',
        var item_assignee_ref_type = next_detail.item_assignee_ref_type;//// 参照人类别 1-当前人，2-当前机构
        var item_assignee_user = next_detail.item_assignee_user;
        var item_assignee_user_code = next_detail.item_assignee_user_code;
        var item_assignee_role = next_detail.item_assignee_role;
        //  var item_assignee_roles = next_detail.item_assignee_role;
        //  var role = model_user.$Role({_id: item_assignee_roles});
        //  var item_assignee_role =[];
        //  item_assignee_role.push(role._id);
        var item_assignee_org_ids = next_detail.item_assignee_org_ids;
        var node_code = next_detail.item_code
        var node_name = next_node.name

        var type = next_detail.item_assignee_type
        if (type == 1) {
            //单人
            // model_user.$User.find({"user_no":user_code},function(err,result){
            //     if(err){
            //         console.log(err)
            //         resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, err))
            //     }else{
            var array = []
            var map = {};
            map.user_name = next_detail.item_show_text;
            map.user_no = item_assignee_user_code;
            map.node_name = node_name;
            map.node_code = node_code;
            array.push(map)
            resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
        } else if (type == 2) {
            var item_assignee_org_ids = next_detail.item_assignee_org_ids;
            var orgs = item_assignee_org_ids.split(",")


            var i = 0;
            var array = [];
            findUserByOrg(orgs, i, item_assignee_role, resolve, array, node_name, node_code);

        } else if (type == 3) {


            if (item_assignee_ref_type == 1) {

                //当前人  1
                //1. 提取参照节点
                //2.去任务表 根据节点和proc_define_id 找到相对应的任务执行完成人（操作人）
                //3.提取操作人的信息（user_no,org_no）
                model.$ProcessInstTask.find({
                    "proc_inst_id": proc_inst_id,
                    "proc_inst_task_code": item_assignee_ref_task
                }, function (err, results) {
                    if (err) {
                        console.log(err)
                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, err));
                    } else {
                        if (results.length > 0) {
                            var proc_inst_task_assignee = results[0].proc_inst_task_assignee;
                            model_user.$User.find({"user_no": proc_inst_task_assignee}, function (errs, res) {
                                if (errs) {
                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errs));
                                } else {
                                    var array = [];
                                    var map = {};
                                    map.user_no = res[0].user_no;
                                    map.user_name = res[0].user_name;
                                    map.node_name = node_name;
                                    map.node_code = node_code;
                                    array.push(map);
                                    resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
                                }
                            })

                        } else {
                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errs));
                        }

                    }
                })

            } else if (item_assignee_ref_type == 2) {

                //参照人

                if (item_assignee_ref_cur_org == 1) {
                    //tongji
                    model.$ProcessInstTask.find({
                        "proc_inst_id": proc_inst_id,
                        "proc_inst_task_code": item_assignee_ref_task
                    }, function (err, results) {
                        if (err) {
                            console.log(err)
                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, err));
                        } else {
                            if (results.length > 0) {
                                var proc_inst_task_assignee = results[0].proc_inst_task_assignee;
                                model_user.$User.find({"user_no": proc_inst_task_assignee}, function (errs, res) {
                                    if (errs) {
                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errs));
                                    } else {
                                        if (res.length > 0) {
                                            var org = res[0].user_org;
                                            model_user.$User.find({
                                                "user_org": org,
                                                "user_roles": item_assignee_role
                                            }, function (error, result) {
                                                if (error) {
                                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errs));
                                                } else {
                                                    if (result.length > 0) {
                                                        var array = [];
                                                        for (var user in result) {
                                                            var map = {};
                                                            map.user_no = result[user].user_no;
                                                            map.user_name = result[user].user_name;
                                                            map.node_name = node_name;
                                                            map.node_code = node_code;
                                                            array.push(map)
                                                        }
                                                        resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
                                                    } else {
                                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));

                                                    }
                                                }

                                            })

                                        } else {
                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                        }

                                    }
                                })

                            } else {
                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                            }
                        }
                    })

                } else if (item_assignee_ref_cur_org == 2) {
                    //上级
                    model.$ProcessInstTask.find({
                        "proc_inst_id": proc_inst_id,
                        "proc_inst_task_code": item_assignee_ref_task,
                        "proc_inst_task_status": 1
                    }, function (err, results) {
                        if (err) {
                            console.log(err)
                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, err));
                        } else {
                            if (results.length > 0) {
                                var proc_inst_task_assignee = results[0].proc_inst_task_assignee;
                                model_user.$User.find({"user_no": proc_inst_task_assignee}, function (errs, res) {
                                    if (errs) {
                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errs));
                                    } else {
                                        if (res.length > 0) {
                                            var org = res[0].user_org;
                                            model_user.$CommonCoreOrg.find({"_id": org}, function (error, result) {
                                                if (error) {
                                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, error));
                                                } else {
                                                    if (result.length > 0) {
                                                        var org_pid = result[0].org_pid;
                                                        model_user.$CommonCoreOrg.find({"_id": org_pid}, function (errors, resul) {
                                                            if (errors) {
                                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errors));

                                                            } else {
                                                                if (resul.length > 0) {
                                                                    var org_id = resul[0]._id;
                                                                    model_user.$User.find({
                                                                        "user_roles": item_assignee_role,
                                                                        "user_org": org_id
                                                                    }, function (e, r) {
                                                                        if (e) {
                                                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, e));
                                                                        } else {
                                                                            if (r.length > 0) {
                                                                                var array = [];
                                                                                for (var user in r) {
                                                                                    var map = {};
                                                                                    map.user_no = r[user].user_no;
                                                                                    map.user_name = r[user].user_name;
                                                                                    map.node_name = node_name;
                                                                                    map.node_code = node_code;
                                                                                    array.push(map);
                                                                                }
                                                                                resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
                                                                            } else {
                                                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                                            }
                                                                        }

                                                                    })

                                                                } else {
                                                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));

                                                                }
                                                            }
                                                        })

                                                    } else {
                                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                    }
                                                }
                                            })

                                        } else {

                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                        }

                                    }
                                })

                            } else {
                                model.$ProcessInstTask.find({
                                        "proc_inst_id": proc_inst_id,
                                        "proc_inst_task_code": item_assignee_ref_task}
                                    ,function(errss,resu){
                                        if(errss){
                                            console.log(errss);
                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errss));
                                        }else{
                                            if(resu.length>0){
                                                var proc_inst_task_assignee = resu[0].proc_inst_task_assignee;
                                                model_user.$User.find({"user_no": proc_inst_task_assignee}, function (errs, res) {
                                                    if (errs) {
                                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errs));
                                                    } else {
                                                        if (res.length > 0) {
                                                            var org = res[0].user_org;
                                                            model_user.$CommonCoreOrg.find({"_id": org}, function (error, result) {
                                                                if (error) {
                                                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, error));
                                                                } else {
                                                                    if (result.length > 0) {
                                                                        var org_pid = result[0].org_pid;
                                                                        model_user.$CommonCoreOrg.find({"_id": org_pid}, function (errors, resul) {
                                                                            if (errors) {
                                                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errors));
                                                                            } else {
                                                                                if (resul.length > 0) {
                                                                                    var org_id = resul[0]._id;
                                                                                    model_user.$User.find({
                                                                                        "user_roles": item_assignee_role,
                                                                                        "user_org": org_id
                                                                                    }, function (e, r) {
                                                                                        if (e) {
                                                                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, e));
                                                                                        } else {
                                                                                            if (r.length > 0) {
                                                                                                var array = [];
                                                                                                for (var user in r) {
                                                                                                    var map = {};
                                                                                                    map.user_no = r[user].user_no;
                                                                                                    map.user_name = r[user].user_name;
                                                                                                    map.node_name = node_name;
                                                                                                    map.node_code = node_code;
                                                                                                    array.push(map);
                                                                                                }
                                                                                                resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
                                                                                            } else {
                                                                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));

                                                                                }
                                                                            }
                                                                        })
                                                                    } else {
                                                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                        }

                                                    }
                                                })
                                            }else{
                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                            }
                                        }
                                    })


                            }

                        }
                    })
                } else {
                    //下级
                    model.$ProcessInstTask.find({
                        "proc_inst_id": proc_inst_id,
                        "proc_inst_task_code": item_assignee_ref_task,
                        "proc_inst_task_status": 1
                    }, function (err, results) {
                        if (err) {
                            console.log(err)
                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, err));
                        } else {
                            if (results.length > 0) {
                                var proc_inst_task_assignee = results[0].proc_inst_task_assignee;
                                model_user.$User.find({"user_no": proc_inst_task_assignee}, function (errs, res) {
                                    if (errs) {
                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errs));
                                    } else {
                                        if (res.length > 0) {
                                            var org = res[0].user_org;
                                            model_user.$CommonCoreOrg.find({"_id": org}, function (error, result) {
                                                if (error) {
                                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, error));
                                                } else {
                                                    if (result.length > 0) {
                                                        var org_pid = result[0].org_pid;
                                                        model_user.$CommonCoreOrg.find({"_id": org_pid}, function (errors, resul) {
                                                            if (errors) {
                                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, errors));

                                                            } else {
                                                                if (resul.length > 0) {
                                                                    var org_id = resul[0]._id;
                                                                    model_user.$User.find({
                                                                        "user_roles": item_assignee_role,
                                                                        "user_org": org_id
                                                                    }, function (e, r) {
                                                                        if (e) {
                                                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, e));
                                                                        } else {
                                                                            if (r.length > 0) {
                                                                                var array = [];
                                                                                for (var user in r) {
                                                                                    var map = {};
                                                                                    map.user_no = r[user].user_no;
                                                                                    map.user_name = r[user].user_name;
                                                                                    map.node_name = node_name;
                                                                                    map.node_code = node_code;
                                                                                    array.push(map)
                                                                                }
                                                                                resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
                                                                            } else {
                                                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                                            }
                                                                        }
                                                                    })
                                                                } else {
                                                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                                }
                                                            }
                                                        })

                                                    } else {
                                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                    }
                                                }
                                            })


                                        } else {
                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                        }

                                    }
                                })

                            } else {

                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                            }

                        }
                    })
                }
            }
        }
    }
}

/*
获取下一节点
 */

function findNextHandler(user_code,proc_define_id,node_code,params,proc_inst_id) {
    return new Promise(async function(resolve) {
        let result = await model.$ProcessDefine.find({"_id": proc_define_id});
        if (result.length==0) {
            resolve(utils.returnMsg(false, '1000', '查询流程定义信息错误', null, null));
            return ;
        }
        var rs = await getNextnode(proc_inst_id, node_code, params, true);
        if (!rs.success) {
            resolve(rs);
            return;
        }
        var next_node=rs.data.next_node;
        var next_detail=rs.data.next_detail;
        var data= rs.data;
        if (next_node.type == "end  round") {
            let rs = await model_user.$User.find({"user_no": user_code});
            if (rs.length!=1) {
                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                return;
            }
            let returnMap = {};
            returnMap.proc_inst_task_assignee = "";
            returnMap.proc_inst_task_assignee_name = "";
            returnMap.user_org_id = rs[0].user_org;
            resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))

        } else {
            var next_detail = data.next_detail;
            var item_assignee_ref_task = next_detail.item_assignee_ref_task;
            var item_assignee_user_code=next_detail.item_assignee_user_code;
            var item_assignee_ref_cur_org = next_detail.item_assignee_ref_cur_org//: '1',
            var item_assignee_ref_type = next_detail.item_assignee_ref_type;//// 参照人类别 1-当前人，2-当前机构

            let type = next_detail.item_assignee_type
            if (type == 1) {
                //单人
                let result =await  model_user.$User.find({"user_no": item_assignee_user_code});
                if(result.length!=1){resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));return ;}
                let returnMap = {};
                returnMap.user_org_id = result[0].user_org;
                returnMap.proc_inst_task_assignee = item_assignee_user_code;
                returnMap.proc_inst_task_assignee_name = result[0].user_name;
                resolve(utils.returnMsg(true, '00000', '查询用户org', returnMap, null));

            } else if (type == 2) {
                //角色
                let returnMap = {};
                returnMap.proc_inst_task_assignee = "";
                returnMap.proc_inst_task_assignee_name = "";
                returnMap.user_org_id = next_detail.item_assignee_org_ids ? next_detail.item_assignee_org_ids.split(",") : [];
                resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))

            } else if (type == 3) {

                if (item_assignee_ref_type == 1) {
                    //当前人  1
                    //1. 提取参照节点
                    //2.去任务表 根据节点和proc_define_id 找到相对应的任务执行完成人（操作人）
                    //3.提取操作人的信息（user_no,org_no）
                    // let results = await model.$ProcessInstTask.find({
                    //     "proc_inst_id": proc_inst_id,
                    //     "proc_inst_task_code": item_assignee_ref_task,
                    // });
                    // if (!results) {
                    //     resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                    //     return;
                    // }
                    let user = await model_user.$User.find({"user_no": user_code});
                    if (user.length!=1) {
                        resolve(utils.returnMsg(false, '10000', '查询用户org', null, null))
                    }
                    let returnMap = {};
                    returnMap.proc_inst_task_assignee = user[0].user_no;
                    returnMap.proc_inst_task_assignee_name = user[0].user_name;
                    returnMap.user_org_id = user[0].user_org;
                    resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null))

                } else if (item_assignee_ref_type == 2) {
                    //参照人
                    if (item_assignee_ref_cur_org == 1 || item_assignee_ref_cur_org == 3) {
                        //同级  下级  使用 同一个模块
                        // let results = await model.$ProcessInstTask.find({
                        //     "proc_inst_id": proc_inst_id,
                        //     "proc_inst_task_code": item_assignee_ref_task
                        // });
                        // if (results.length>0) {
                        //     let user = await model_user.$User.find({"user_no": results[0].proc_inst_task_assignee});
                        //     if (!user) {
                        //         resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                        //         return;
                        //     }
                        let user = await model_user.$User.find({"user_no":user_code});
                        if(user.length!=1){
                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误2', null, null));
                            return;
                        }
                        let but_org = await model_user.$CommonCoreOrg.find({"_id": {$in: user[0].user_org}});
                        if (but_org.length==0) {
                            resolve(utils.returnMsg(false, '10001', '查询机构信息错误5', null, null));
                            return;
                        }
                        var arr = new Array();
                        await find_all_org(but_org[0]._id, arr);
                        let returnMap = {};
                        returnMap.proc_inst_task_assignee = "";
                        returnMap.proc_inst_task_assignee_name = "";
                        returnMap.user_org_id = arr;
                        resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));

                        // }else{
                        //     resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                        //     return;
                        //
                        // }


                    } else if (item_assignee_ref_cur_org == 2) {
                        //上级
                        // let results = await model.$ProcessInstTask.find({
                        //     "proc_inst_id": proc_inst_id,
                        //     "proc_inst_task_code": item_assignee_ref_task
                        // });
                        // if (!results) {
                        //     resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                        //     return;
                        // }

                        let user = await model_user.$User.find({"user_no": user_code});
                        if (user.length!=1) {
                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误1', null, null));
                            return;
                        }
                        let but_org = await model_user.$CommonCoreOrg.find({"_id": {$in: user[0].user_org}});
                        if (but_org.length==0) {
                            resolve(utils.returnMsg(false, '10001', '查询机构信息错误3', null, null));
                            return;
                        }
                        let up_org = await model_user.$CommonCoreOrg.find({"_id": but_org[0].org_pid});
                        if (up_org.length==0) {
                            resolve(utils.returnMsg(false, '10001', '查询机构信息错误', null, null));
                            return;
                        }
                        var arr = new Array();
                        await find_all_org(up_org[0]._id, arr);
                        let returnMap = {};
                        returnMap.proc_inst_task_assignee = "";
                        returnMap.proc_inst_task_assignee_name = "";
                        returnMap.user_org_id = arr;
                        resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));

                    } else if (item_assignee_ref_cur_org == 4) {
                        //上上级
                        //user_code, reject, user_org_id, returnMap, resolve
                        // let result = await model.$ProcessInstTask.find({
                        //     "proc_inst_id": proc_inst_id,
                        //     "proc_inst_task_code": item_assignee_ref_task
                        // });
                        // if (!result) {
                        //     resolve(utils.returnMsg(false, '1000', '查询用户信息错误', null, null));
                        //     return;
                        // }
                        let user = await model_user.$User.find({"user_no": user_code});
                        if (user.length!=1) {
                            resolve(utils.returnMsg(false, '1000', '查询用户信息错误', null, error));
                            return;
                        }
                        let but_org = await model_user.$CommonCoreOrg.find({"_id": {$in: user[0].user_org}});
                        if (but_org.length==0) {
                            resolve(utils.returnMsg(false, '1000', '查询机构信息错误', null, error));
                            return;
                        }
                        let up_org = await model_user.$CommonCoreOrg.find({"_id": but_org[0].org_pid});
                        if (up_org.length==0) {
                            resolve(utils.returnMsg(false, '1000', '查询机构信息错误1', null, error));
                            return;
                        }
                        let up_up_org = await model_user.$CommonCoreOrg.find({"_id": up_org[0].org_pid});
                        if (up_up_org.length==0) {
                            resolve(utils.returnMsg(false, '1000', '查询机构信息错误2', null, error));
                            return;
                        }
                        var arr = new Array();
                        await find_all_org(up_up_org[0]._id, arr);
                        let returnMap = {};
                        returnMap.proc_inst_task_assignee = "";
                        returnMap.proc_inst_task_assignee_name = "";
                        returnMap.user_org_id = arr;
                        resolve(utils.returnMsg(true, '10000', '查询用户org', returnMap, null));
                    }
                }
            }
        }
    });
}

/*
获取下一步节点或者操作人
*/
exports.getNextNodeAndHandlerInfo=function(node_code,proc_task_id,proc_inst_id,params,user_code){
    return new Promise(async function(resolve,reject){
        let rs = await model.$ProcessInst.find({"_id":proc_inst_id});
        if(rs.length==0){ resolve(utils.returnMsg(false, '1000', '查询实例化表失败 for getNextNodeAndHandlerInfo', null,null));return ;}
        let rsss =await getInstNode(rs,node_code,params,true);
        if(rsss.success==false){
            resolve(utils.returnMsg(false, '1001', '有效节点删除不完全', null, null));
            return;
        }
        var next_detail=rsss.data.next_detail;
        var next_node=rsss.data.next_node;


        var data_s=await findNextHandler(user_code,rs[0].proc_define_id,node_code,params,proc_inst_id);
        if(next_node.type=='end  round'){
            let ret_map=[];
            let temp={};
            temp.user_no="";
            temp.user_name="";
            temp.node_name=next_node.name;
            temp.node_code=next_node.type;
            ret_map.push(temp);
            resolve({"data":ret_map,"msg":"下一节点为结束节点","error":null,"success":true});
        }else{
            // item_assignee_ref_type
            if (next_detail.item_assignee_type == 1) {
                let ret_map=[];
                let temp={};
                temp.user_no=next_detail.item_assignee_user_code;
                temp.user_name=next_detail.item_show_text;
                temp.node_name=next_node.name;
                temp.node_code=next_detail.item_code;
                ret_map.push(temp);
                resolve({"data":ret_map,"msg":"查询完成","error":null,"success":true,"next_node":next_detail.item_code});
            }
            // item_assignee_ref_type : String,// 参照人类别 1-当前人，2-当前机构
            // item_assignee_type : Number, // 参与类型1  灿如人 2： 掺入角色 3 参照
            // item_assignee_type: 3,
            if (next_detail.item_assignee_type == 2||next_detail.item_assignee_type == 3) {
                    if(next_detail.item_assignee_ref_type==1){
                        let ret_map=[];
                        let temp={};
                        temp.user_no=data_s.data.proc_inst_task_assignee;
                        temp.user_name=data_s.data.proc_inst_task_assignee_name;
                        temp.node_name=next_node.name;
                        temp.node_code=next_detail.item_code;
                        ret_map.push(temp);
                        resolve({"data":ret_map,"msg":"查询完成","error":null,"success":true,"next_node":next_detail.item_code})
                    }else{

                        let match={};
                        if(next_detail.item_assignee_org_ids){
                            match.user_org={$in:data_s.data.user_org_id};
                        }
                        if(next_detail.item_assignee_role){
                            match.user_roles={$in:next_detail.item_assignee_role?next_detail.item_assignee_role.split(","):[next_detail.item_assignee_role]};
                        }
                        let res=await model_user.$User.find(match);
                        if(res.length==0){ resolve({"data":null,"msg":"查询出错","error":null,"success":false});return ;}
                        var ret_map=[];
                        for(let  i in res ){
                            let temp={};
                            temp.user_no=res[i].user_no;
                            temp.user_name=res[i].user_name;
                            temp.node_name=next_node.name;
                            temp.node_code=next_detail.item_code;
                            ret_map.push(temp);
                        }
                        resolve({"data":ret_map,"msg":"查询完成","error":null,"success":true,"next_node":next_detail.item_code});

                    }
            }
        }
    });
}
/*
查询所有的下一节点
 */
//已经优化
exports.getAllNextNodeAndInfo=function(proc_inst_task_id,node_code){
    return  new  Promise(async function(resolve){
        var maps={};
        let rs=await model.$ProcessInstTask.find({"_id":proc_inst_task_id});
        if(rs.length==0){resolve(utils.returnMsg(false, '1000', '查询实例化表失败 for getNextNodeAndHandlerInfo', null,null));}
        let res=await model.$ProcessInst.find({"_id":rs[0].proc_inst_id});
        if(res.length==0){resolve(utils.returnMsg(false, '1000', '查询实例化表失败 for getNextNodeAndHandlerInfo', null,null));}
        var proc_define=JSON.parse(res[0].proc_define);
        var item_config=JSON.parse(res[0].item_config);
        var lines=proc_define.lines;
        var nodes=proc_define.nodes;
        var allNextNode=[];
        for (let line in lines){
            var to =lines[line].to;
            var from =lines[line].from;
            if(node_code==from){
                allNextNode.push(to);
            }
        }
        for (var i=0;i<allNextNode.length;i++){
            for(var line in lines){
                var to =lines[line].to;
                var from =lines[line].from;
                var temp_node=allNextNode[i];
                if(from==node_code&&to==temp_node){
                    maps[temp_node.toString()]=line;
                }
            }
        }
        var array=[];
        for(var item in item_config){
            var item_code=item_config[item].item_code;
            for(var map in maps){
                var line=maps[map];
                var node=map;
                if(line==item_code){
                    var result_map={};
                    result_map.node=map;
                    result_map.item_el=item_config[item].item_el;
                    result_map.node_name=nodes[map].name;
                    array.push(result_map);
                }
            }
        }
        resolve(utils.returnMsg(true, '0000', '查询 ', array,null));
    });
}


//已经优化
exports.findCurrentHandlers=function(proc_task_id,node_code){
    return new Promise(async function(resolve,reject){
        let rs= await model.$ProcessInstTask.find({"_id":proc_task_id});
        if(rs.length==0){ resolve(utils.returnMsg(false, '1000', '查询任务表失败', null,null));return ;}
        let res= await model.$ProcessInst.find({"_id":rs[0].proc_inst_id});
        if(res.length==0){ resolve(utils.returnMsg(false, '1000', '查询任务表失败', null,null));return ;}
        var proc_define=JSON.parse(res[0].proc_define);
        var item_config=JSON.parse(res[0].item_config);
        var nodes=proc_define.nodes;
        var current_node=nodes[node_code];
        var current_detail;
        for(var item in item_config){
            var item_code=item_config[item].item_code
            if(item_code==node_code){
                current_detail=item_config[item];
            }
        }
        findInfo(current_node,resolve,current_detail,proc_task_id)

        model.$ProcessInstTask.find({"_id":proc_task_id},function(err,rs){
            if(err){
                resolve(utils.returnMsg(false, '1000', '查询任务表失败', null,err));

            }else{
                if(rs.length>0){
                    var proc_inst_id=rs[0].proc_inst_id;
                    model.$ProcessInst.find({"_id":proc_inst_id},function(err,res){
                        if(err){
                            resolve(utils.returnMsg(false, '1000', '查询实例表失败', null,err));

                        }else{
                            if(res.length>0){
                                var proc_define=JSON.parse(res[0].proc_define);
                                var item_config=JSON.parse(res[0].item_config);
                                var nodes=proc_define.nodes;
                                var current_node=nodes[node_code];
                                var current_detail;
                                for(var item in item_config){
                                    var item_code=item_config[item].item_code
                                    if(item_code==node_code){
                                        current_detail=item_config[item];
                                    }
                                }
                                findInfo(current_node,resolve,current_detail,proc_task_id)
                            }else{
                                resolve(utils.returnMsg(false, '1000', '查询实例表失败', null,err));
                            }
                        }
                    });

                }else{
                    resolve(utils.returnMsg(false, '1000', '查询任务表失败', null,null));
                }

            }


        })

    });
    return p;
}



exports.getSecondNodeInfo=function(proc_code,proc_ver,proc_title){
    var maps={};
    var  promise = new Promise(function(resolve,reject){
        //user_org_name   user_org

        //获取流程定义信息
        var query = model.$ProcessDefine.find({});
        if(proc_code){
            query.where('proc_code', proc_code);
        }
        if(proc_title){
            query.where("proc_name" , proc_title);
        }
        query.where('status', 1);
        query.where('version',proc_ver );
        query.sort({proc_ver:-1});
        query.exec(function(error,rs){
            if(error){
                resolve(utils.returnMsg(false, '1000', '获取流程定义信息时出现异常。', null, error));
            }else{
                if(rs.length > 0){
                    var data=rs[0]._doc;
                    var proc_define=JSON.parse(data.proc_define);
                    var item_config=JSON.parse(data.item_config);
                    var firstNode = findFirstNode(proc_define);

                    var lines=proc_define.lines;
                    var secondNode;
                    for(var line in lines){
                        var to =lines[line].to;
                        var from=lines[line].from;
                        if(firstNode==from){
                            secondNode=to;
                        }
                    }


                    var allNextNode=[];
                    for (var line in lines){
                        var to =lines[line].to;
                        var from =lines[line].from;
                        if(secondNode==from){
                            allNextNode.push(to);
                        }
                    }

                    var nodes=proc_define.nodes;
                    for (var i=0;i<allNextNode.length;i++){
                        for(var line in lines){
                            var to =lines[line].to;
                            var from =lines[line].from;
                            var temp_node=allNextNode[i];
                            if(from==secondNode&&to==temp_node){
                                maps[temp_node.toString()]=line;
                            }
                        }
                    }

                    var array=[];
                    for(var item in item_config){
                        var item_code=item_config[item].item_code;
                        for(var map in maps){
                            var line=maps[map];
                            var node=map;
                            if(line==item_code){
                                var result_map={};
                                result_map.node=map;
                                result_map.item_el=item_config[item].item_el;
                                result_map.node_name=nodes[map].name;
                                array.push(result_map);
                            }
                        }
                    }
                    resolve(utils.returnMsg(true, '0000', '查询 ', array,null));
                }else{
                    resolve(utils.returnMsg(false, '1000', '未查询到流程定义数据。', null, null));
                }
            }
        });
    });
    return promise;
}


function findSecondNode(proc_define,node_code){
    var nodes=proc_define.nodes;
    var lines=proc_define.lines;
    var node;
    for(var line in lines){
        var to =lines[line].to;
        var from=lines[line].from;
        if(node_code==to){
            node=from;
        }
    }
    return node;
}

/**
 *  三合一接口
 * @param user_no
 * @param proc_code
 * @param param_json_str
 * @param node_code
 * @param joinup_sys
 * @param user_name
 * @param proc_vars
 * @param role_code
 * @param proc_title
 * @returns {bluebird}
 */
exports.example_task=(user_no,proc_code,param_json_str,node_code,joinup_sys,user_name,proc_vars,role_code,proc_title,proc_ver)=>{
    // console.log("get Skip node handler info   .......",user_no,proc_code,param_json_str,node_code);
    return new Promise((resolve,reject)=>{
        var params=param_json_str;
        //解析参数
        if(!(!param_json_str||param_json_str=="undefined"||param_json_str=="{}")){

            let params_json=JSON.parse(param_json_str);
            var flag=true;
            for(var items_ in params_json){
                flag=false;
            }
            if(flag){
                resolve(utils.returnMsg(false, '1001', '参数解析不正确。', null, null));
            }else{
                params=params_json;
            }
        }else{
            params={};
        }

        model.$ProcessDefine.find({'proc_code':proc_code},(err,res)=>{
            if(err){
                resolve(utils.returnMsg(false, '1000', '查询流程出错', null, err));
            }else{
                if(res.length>0){
                    //获取流程id
                    var proc_define_id=res[0]._id;
                    // var node_code;
                    data_define=res;
                    var proc_define=JSON.parse(res[0].proc_define);
                    var firstNode = findFirstNode(JSON.parse(res[0].proc_define));
                    //获取节点详细信息
                    var nodes=proc_define.nodes;

                    //获取节点之间关系
                    var lines=proc_define.lines;
                    for (let  node in nodes) {
                        //console.log(nodes[node], node);
                    }
                    //节点配置信息
                    let item_config=JSON.parse(res[0].item_config);
                    // console.log(item_config);
                    var flag=false;
                    for(var node in item_config){

                        if(item_config[node].item_code==node_code){
                            if(item_config[node].item_jump==1){
                                flag=true
                            }
                        }
                    }

                    if(flag){
                        //获取起草节点的信息
                        getNode(proc_define_id,firstNode,params,flag).then(function(res){
                            if(res.success){
                                //获取 跳过之后的节点信息
                                getNode(proc_define_id,node_code,params,flag).then(function(rs){
                                    if(rs.success){
                                        nodeDetail = [];
                                        var s = {};

                                        var current_detail=res.data.current_detail;
                                        var next_detail=rs.data.next_detail;
                                        var next_node = rs.data.next_node;
                                        s.current_detail =current_detail;
                                        s.next_detail = next_detail;
                                        nodeDetail.push(s);
                                        find(role_code).then(function(role) {
                                            if (role.success) {
                                                var condition = {};
                                                condition.proc_start_user_role_names = role.data.toString().split(',');
                                                condition.proc_start_user_role_code = role_code.toString();

                                                condition.proc_start_user = user_no;
                                                condition.proc_start_user_name = user_name;
                                                condition.proc_code = proc_code;

                                                condition.proc_cur_task = current_detail.item_code;
                                                condition.proc_cur_task_name = next_node.name;
                                                condition.joinup_sys = joinup_sys;
                                                condition.proc_cur_task_name = next_detail.item_assignee_role_name;
                                                condition.proc_vars = proc_vars;
                                                //写入数据库 创建流程实例化方法
                                                saveIns(condition,proc_code,proc_title,user_no).then(function(insresult){
                                                    if(insresult.success){
                                                        model.$ProcessInst.find({'_id':insresult.data},function(err,rs){
                                                            if(err){
                                                                console.log(err);
                                                            }else{
                                                                //新加字段所属系统编号
                                                                condition.joinup_sys = rs[0].joinup_sys;
                                                                condition.work_order_number = rs[0].work_order_number;
                                                                condition.proc_task_start_user_role_code = rs[0].proc_start_user_role_code;
                                                                condition.proc_task_start_user_role_names = rs[0].proc_start_user_role_names;
                                                                condition.proc_task_start_name = user_name;
                                                                condition.proc_inst_task_title = proc_title;
                                                                //condition.proc_inst_biz_vars = biz_vars_json;
                                                                condition.proc_inst_task_title = proc_title;
                                                                //condition.proc_inst_biz_vars = biz_vars_json;
                                                                // condition.proc_vars = proc_vars_json;
                                                                condition.proc_code = rs[0].proc_code;
                                                                condition.proc_name = rs[0].proc_name;
                                                                if(nodeDetail[0].next_detail)      {
                                                                    //创建流程任务
                                                                    insertTask(insresult,condition).then(function(taskresult){
                                                                        resolve(taskresult);
                                                                        resolve(utils.returnMsg(true, '0000', '创建成功',taskresult));
                                                                    });
                                                                }  else{
                                                                    resolve(utils.returnMsg(false, '1000', '创建失败，无法找到下一节点',null));

                                                                }
                                                            }
                                                        });
                                                    }else{
                                                        console.log("shibai");
                                                    }
                                                });
                                            }
                                        });
                                    }else{
                                        resolve(rs);

                                    }
                                })
                            }
                        });
                    }
                    // resolve(utils.returnMsg(false, '1000', '查询流程出错', null, null))
                }else{
                    resolve(utils.returnMsg(false, '1000', '查询流程出错', null, null))
                }
            }
        });
    });

}

/**
 *
 * @param user_no
 * @param proc_code
 * @param param_json_str
 * @param node_code
 * @returns {bluebird}
 */
exports.skipNodeAndGetHandlerInfo=(user_no,proc_code,param_json_str,node_code,task_id)=>{
    return new Promise(async (resolve,reject)=>{
        var params=param_json_str;
        //解析参数
        if(!(!param_json_str||param_json_str=="undefined"||param_json_str=="{}")){

            let params_json=JSON.parse(param_json_str);
            var flag=true;
            for(var items_ in params_json){
                flag=false;
            }
            if(flag){
                resolve(utils.returnMsg(false, '1001', '参数解析不正确。', null, null));
            }else{
                params=params_json;
            }
        }else{
            params={};
        }
        let res=await model.$ProcessDefine.find({'proc_code':proc_code});
        if (res.length==0){
            resolve(utils.returnMsg(false, '1000', '查询流程出错', null, null));
            return ;
        }
        var proc_define_id=res[0]._id;
        var proc_define=JSON.parse(res[0].proc_define);
        var nodes=proc_define.nodes;
        var lines=proc_define.lines;
        let item_config=JSON.parse(res[0].item_config);
        // console.log(item_config);
        var flag=false;
        for(var node in item_config){
            // console.log(item_config[node].item_code,node_code);
            if(item_config[node].item_code==node_code){
                if(item_config[node].item_jump==1){
                    flag=true
                }
            }
        }
        if(flag){
            //获取 跳过之后的节点信息
            getNode(proc_define_id,node_code,params,flag).then(function(rs){
                if(rs.success){
                    var current_detail=rs.data.current_detail;
                    var next_detail=rs.data.next_detail;
                    var temp_node;
                    if(next_detail){
                        temp_node=nodes[next_detail.item_code]
                    }else{
                        for(let i in nodes){
                            if(nodes[i].type=="end  round"){
                                temp_node=nodes[i];
                                break;
                            }
                        }

                    }
                    getSkipedNodeAndHandler(temp_node, next_detail,user_no,proc_code,task_id).then((rs)=>{
                        resolve(rs);
                        return ;
                    });
                }else{
                    resolve(rs);
                }
            })
        }else{
            resolve({"data":null,"error":null,"msg":"该节点配置为不可跳过","code":"10001","success":true});
        }
    });

}
/**
 * 当跳过节点的时候获取跳过的节点的下一步处理人和节点信息
 */
function getSkipedNodeAndHandler(next_node, next_detail,user_no,proc_code,task_id){
   return  new Promise(function(resolve,reject) {
        if (next_node.type == "end  round") {
            var array = []
            let map = {};
            map.node_name=next_node.name;
            map.node_code=next_node.type;
            array.push(map);
            resolve(utils.returnMsg(true, '0000', '下一节点为结束节点',array, null))

        } else {
            var item_assignee_ref_task = next_detail.item_assignee_ref_task;
            var item_assignee_ref_cur_org = next_detail.item_assignee_ref_cur_org//: '1',
            var item_assignee_ref_type = next_detail.item_assignee_ref_type;//// 参照人类别 1-当前人，2-当前机构
            // console.log("next_detail   ;", next_detail)
            var item_assignee_user = next_detail.item_assignee_user;
            var item_assignee_user_code = next_detail.item_assignee_user_code;
            var item_assignee_role = next_detail.item_assignee_role;
            var item_assignee_org_ids = next_detail.item_assignee_org_ids;
            var node_code = next_detail.item_code
            var node_name = next_node.name
            var type = next_detail.item_assignee_type
            if (type == 1) {
                //单人
                var array = []
                var map = {};
                map.user_name = next_detail.item_show_text;
                map.user_no = item_assignee_user_code;
                map.node_name = node_name;
                map.node_code = node_code;
                array.push(map)
                resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
            } else if (type == 2) {
                //角色
                var item_assignee_org_ids = next_detail.item_assignee_org_ids;
                var orgs = item_assignee_org_ids.split(",")

                // console.log("ccccccccccccccccccccccccccccccccccccccccccccc")
                // console.log(orgs)
                var i = 0;
                var array = [];
                findUserByOrg(orgs, i, item_assignee_role, resolve, array, node_name, node_code);

            } else if (type == 3) {
                //参照其他节点
                // resolve(utils.returnMsg(false, '1000', '第三节点不可配置参照人', null))
                //首先获取参照节点的信息
                if(item_assignee_ref_task){
                    if (item_assignee_ref_type == 1) {
                        //参照当前人的处理方法
                        model.$ProcessInstTask.find({"proc_code":proc_code,"proc_inst_task_code":item_assignee_ref_task,"_id":task_id},function (err_task,res_task){
                            if(err_task){
                                reoslve(err_task);
                            }else{
                                if(res_task.length>0){
                                    //有效直接使用任务的处理人信息
                                    //组成数据返回
                                    model_user.$User.find({"user_no":res_task[0].proc_inst_task_assignee},function(err_user,res_user){
                                        if(err_user){
                                            resolve(err_user);
                                        }else{
                                            var array=[];
                                            for(let i in res_user){
                                                let map={};
                                                map.user_name = res_user[i].user_name;
                                                map.user_no = res_user[i].user_no;
                                                map.node_name = node_name;
                                                map.node_code = node_code;
                                                array.push(map);
                                            }
                                            resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
                                        }


                                    })

                                    //
                                    // console.log(res_task);
                                    // resolve({"data":310})
                                }else{
                                    //不存在使用节点配置信息
                                    getRefNodeInfo(node_code,proc_code).then((rs)=>{
                                        if(rs.success){
                                            model_user.$User.find({"user_roles":{$in:item_assignee_role.split(",")},"user_org":{$in:item_assignee_org_ids.split(",")}},(err_user,res_user)=>{
                                                if(err_user){
                                                    resolve(err_user);
                                                } else{
                                                    //组成数据ObJECT 返回
                                                    // console.log(res_user);
                                                    var array=[];
                                                    for(let i in res_user){
                                                        let map={};
                                                        map.user_name = res_user[i].user_name;
                                                        map.user_no = res_user[i].user_no;
                                                        map.node_name = node_name;
                                                        map.node_code = node_code;
                                                        array.push(map);
                                                    }
                                                    resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))
                                                    // resolve({"data":311})


                                                }
                                            });
                                        }
                                    })
                                }
                            }
                        } );

                    } else if (item_assignee_ref_type == 2) {

                        //参照人

                        if (item_assignee_ref_cur_org == 1) {
                            //同级
                            //已经解决
                            model.$ProcessInstTask.find({"proc_code":proc_code,"proc_inst_task_code":item_assignee_ref_task,"_id":task_id},function(err_task,res_task){
                                if(err_task){
                                    console.log(err_task);
                                    resolve(err_task)
                                }else{
                                    if(res_task.length>0){
                                        model_user.$User.find({"user_no":res_task[0].proc_inst_task_assignee},function(err_user,res_user){
                                            if(err_user){
                                                resolve(err_user);
                                            }else{
                                                if(res_user.length>0){
                                                    var org=res_user[0].user_org;

                                                    model_user.$User.find({"user_roles":{$in:item_assignee_role.split(",")},"user_org":{$in:org}},function(errors,results){
                                                        if(errors){
                                                            resolve({"data":null,"msg":"查询出错","error":errors,"success":false});
                                                        }else{
                                                            //f返回数据
                                                            // console.log(results);
                                                            // resolve({"data":results})
                                                            var array=[];
                                                            for(let i in results){
                                                                let map={};
                                                                map.user_name = results[i].user_name;
                                                                map.user_no = results[i].user_no;
                                                                map.node_name = node_name;
                                                                map.node_code = node_code;
                                                                array.push(map);
                                                            }
                                                            resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});
                                                        }
                                                    })
                                                }else{
                                                    resolve(null)
                                                }
                                            }
                                        })
                                    }else{

                                        //已经解决的 分支
                                        //同级
                                        getRefNodeInfo(node_code,proc_code).then((rs)=>{
                                            if(rs.success){
                                                getRefNodeInfo(rs.data.item_assignee_ref_task,proc_code).then((rss)=>{
                                                    model_user.$User.find({"user_roles":{$in:rs.data.item_assignee_role.split(",")},"user_org":{$in:rss.data.item_assignee_org_ids.split(",")}},(err_user,res_user)=>{
                                                        if(err_user){
                                                            console.log(err_user)
                                                            resolve({"data":null,"msg":"查询出错","error":err_user,"success":false});
                                                        } else{
                                                            //组成数据ObJECT 返回
                                                            // console.log(res_user);
                                                            var array=[];
                                                            for(let i in res_user){
                                                                let map={};
                                                                map.user_name = res_user[i].user_name;
                                                                map.user_no = res_user[i].user_no;
                                                                map.node_name = node_name;
                                                                map.node_code = node_code;
                                                                array.push(map);
                                                            }
                                                            resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});
                                                            // resolve({"data":res_user})
                                                        }
                                                    });
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        } else if (item_assignee_ref_cur_org == 2) {
                            //已经解决
                            //上级
                            model.$ProcessInstTask.find({"proc_code":proc_code,"proc_inst_task_code":item_assignee_ref_task,"_id":task_id},function(err_task,res_task){
                                if(err_task){
                                    resolve(err_task)
                                }else{
                                    //如果参考的节点  存在数据的 时候直接说使用节点的数据
                                    if(res_task.length>0){
                                        model_user.$User.find({"user_no":res_task[0].proc_inst_task_assignee},function(err_user,res_user){
                                            if(err_user){
                                                resolve({"data":null,"msg":"查询出错","error":err_user,"success":false});
                                            }else{
                                                if(res_user.length>0){
                                                    model_user.$CommonCoreOrg.find({"_id":{$in:res_user[0].user_org}},function(err_org,res_org){
                                                        if(err_org){
                                                            console.log(err_org)
                                                            resolve(err_org)
                                                        } else{
                                                            if(res_org.length>0){
                                                                var pid=[];
                                                                for(let i in res_org){
                                                                    pid.push(res_org[i].org_pid)
                                                                }

                                                                var app = ["5a264057c819ed2118539069","5a264057c819ed211853906a","5a264057c819ed211853906b","5a264057c819ed211853906c","5a264057c819ed2118539074","5a264057c819ed2118539075"];

                                                                var user_roles = item_assignee_role.split(",");
                                                                if(user_roles[0]== app[0] || user_roles[0] == app[1]||user_roles[0]== app[2] || user_roles[0] == app[3]
                                                                    ||user_roles[0]== app[4] || user_roles[0] == app[5]||user_roles[1]== app[0] || user_roles[1] == app[1]||user_roles[1]== app[2] || user_roles[1] == app[3]
                                                                    ||user_roles[1]== app[4] || user_roles[1] == app[5]){
                                                                    for(let i in app){
                                                                        for(let y in user_roles){
                                                                            if(app[i]==user_roles[y]){
                                                                                model_user.$CommonCoreOrg.find({"org_pid":pid[0]},function(err_org,res_org){
                                                                                    if(err_org){

                                                                                    } else{
                                                                                        if(res_org.length>0){
                                                                                            var pid=[];
                                                                                            for(let i in res_org){
                                                                                                pid.push(res_org[i]._id)
                                                                                            }
                                                                                            model_user.$User.find({"user_roles":{$in:item_assignee_role.split(",")},"user_org":{$in:pid.concat(res_user[0].user_org)}},function(errors,results){
                                                                                                if(errors){
                                                                                                    resolve({"data":null,"msg":"查询出错","error":errors,"success":false});

                                                                                                }else{
                                                                                                    //合成 最后的结果数据
                                                                                                    //组成数据ObJECT 返回
                                                                                                    // console.log(results);
                                                                                                    // resolve({"data":results})
                                                                                                    var array=[];
                                                                                                    for(let i in results){
                                                                                                        let map={};
                                                                                                        map.user_name = results[i].user_name;
                                                                                                        map.user_no = results[i].user_no;
                                                                                                        map.node_name = node_name;
                                                                                                        map.node_code = node_code;
                                                                                                        array.push(map);
                                                                                                    }
                                                                                                    resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});

                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }else{

                                                                            }
                                                                        }
                                                                    }
                                                                }else{
                                                                    model_user.$User.find({"user_roles":{$in:item_assignee_role.split(",")},"user_org":{$in:pid.concat(res_user[0].user_org)}},function(errors,results){
                                                                        if(errors){
                                                                            resolve(errors);

                                                                        }else{
                                                                            //合成 最后的结果数据
                                                                            //组成数据ObJECT 返回
                                                                            // console.log(results);
                                                                            // resolve({"data":results})
                                                                            var array=[];
                                                                            for(let i in results){
                                                                                let map={};
                                                                                map.user_name = results[i].user_name;
                                                                                map.user_no = results[i].user_no;
                                                                                map.node_name = node_name;
                                                                                map.node_code = node_code;
                                                                                array.push(map);
                                                                            }
                                                                            resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});

                                                                        }
                                                                    })
                                                                }

                                                            }else{
                                                                resolve(NULL)
                                                            }
                                                        }
                                                    });


                                                }else{


                                                    resolve(NULL)

                                                }


                                            }
                                        })
                                    } else{
                                        //如果节点的数据不存在  直接使用  配置文件中的  数据 来寻找
                                        //已经解决
                                        //上级
                                        getRefNodeInfo(item_assignee_ref_task,proc_code).then((rs)=>{
                                            if(rs.success){
                                                let org=rs.data;
                                                if(rs.data.item_assignee_org_ids){
                                                    //查询出这些组织的  上级

                                                    model_user.$CommonCoreOrg.find({"_id":{$in:rs.data.item_assignee_org_ids.split(",")}},function(org_err,org_res){
                                                        if(org_err){
                                                            resolve(org_err);
                                                        }else{
                                                            var pid=[];
                                                            if(org_res.length>0){
                                                                for(let i in org_res){
                                                                    pid.push(org_res[i].org_pid);
                                                                }
                                                                model_user.$CommonCoreOrg.find({"org_pid":{$in:pid}},function(err_org,res_org){
                                                                    if(err_org){
                                                                        resolve(err_org);
                                                                    }else{

                                                                        for(let i in res_org){
                                                                            pid.push(res_org[i]._id);
                                                                        }
                                                                        model_user.$User.find({"user_org":{$in:pid},"user_roles":{$in:item_assignee_role.split(",")}},function (err_pid,res_pid){
                                                                            if(err_pid){
                                                                                resolve({"data":null,"msg":"查询出错","error":err_pid,"success":false});
                                                                            }else{
                                                                                if(res_pid.length>0){
                                                                                    var array=[];
                                                                                    for(let i in res_pid){
                                                                                        let map={};
                                                                                        map.user_name = res_pid[i].user_name;
                                                                                        map.user_no = res_pid[i].user_no;
                                                                                        map.node_name = node_name;
                                                                                        map.node_code = node_code;
                                                                                        array.push(map);
                                                                                    }
                                                                                    resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});
                                                                                }else{
                                                                                    resolve(utils.returnMsg(false, '1000', '查询用户shibai', null, null))
                                                                                }
                                                                            }
                                                                        })

                                                                    }
                                                                })

                                                            }
                                                        }
                                                    });

                                                }else{
                                                    resolve(utils.returnMsg(false, '1000', '查询用户shibai', null, null))
                                                }
                                            }
                                        });
                                    }
                                }
                            });


                        } else if(item_assignee_ref_cur_org == 4){
                            //上上级
                            //已经解决
                            model.$ProcessInstTask.find({"proc_code":proc_code,"proc_inst_task_code":item_assignee_ref_task,"_id":task_id},function(err_task,res_task){
                                if(err_task){
                                    resolve(err_task)
                                }else{
                                    //如果参考的节点  存在数据的 时候直接说使用节点的数据
                                    if(res_task.length>0){
                                        model_user.$User.find({"user_no":res_task[0].proc_inst_task_assignee},function(err_user,res_user){
                                            if(err_user){
                                                resolve({"data":null,"msg":"查询出错","error":err_user,"success":false});
                                            }else{
                                                model_user.$CommonCoreOrg.find({"_id":{$in:res_user[0].user_org}},function(err_org,res_org){
                                                    if(err_org){
                                                        console.log(err_org);
                                                        resolve(err_org);
                                                    } else{
                                                        if(res_org.length>0){
                                                            var pid=[];
                                                            //获取上级
                                                            for(let i in res_org){
                                                                pid.push(res_org[i].org_pid);
                                                            }
                                                            model_user.$CommonCoreOrg.find({"_id":{$in:pid}},function(errors,results){
                                                                if(errors){
                                                                    console.log(errors);
                                                                    resolve(errors);
                                                                }else{
                                                                    if(results.length>0){
                                                                        for(let i in results){
                                                                            pid.push(results[i].org_pid);
                                                                        }
                                                                        model_user.$CommonCoreOrg.find({"org_pid":{$in:pid}},function(err_or,res_or){
                                                                            for(let i in res_or){
                                                                                pid.push(res_or[i]._id);
                                                                            }

                                                                            model_user.$User.find({"user_org":{$in:pid},"user_roles":item_assignee_role.split(",")},function(error_s,result_s){
                                                                                if(error_s){
                                                                                    console.log(error_s);
                                                                                    resolve({"data":null,"msg":"查询出错","error":error_s,"success":false});
                                                                                }else{
                                                                                    if(result_s){
                                                                                        // resolve(result_s)
                                                                                        var array=[];
                                                                                        for(let i in result_s){
                                                                                            let map={};
                                                                                            map.user_name = result_s[i].user_name;
                                                                                            map.user_no = result_s[i].user_no;
                                                                                            map.node_name = node_name;
                                                                                            map.node_code = node_code;
                                                                                            array.push(map);
                                                                                        }
                                                                                        resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});
                                                                                    }else{
                                                                                        resolve(null);
                                                                                    }
                                                                                }
                                                                            });
                                                                        })

                                                                    }else{
                                                                        resolve(null);
                                                                    }
                                                                }
                                                            })
                                                        }else{
                                                            resolve(null)
                                                        }
                                                    }
                                                });
                                            }
                                        })
                                    } else{
                                        //如果节点的数据不存在  直接使用  配置文件中的  数据 来寻找
                                        //上上级
                                        //已经解决
                                        getRefNodeInfo(item_assignee_ref_task,proc_code).then((rs)=>{
                                            if(rs.success){
                                                // let org=rs.data;
                                                if(rs.data.item_assignee_org_ids){
                                                    model_user.$CommonCoreOrg.find({"_id":{$in:rs.data.item_assignee_org_ids.split(",")}},function(org_err,org_res){
                                                        if(org_err){
                                                            resolve(org_err);
                                                        }else{
                                                            var pid=[];
                                                            if(org_res.length>0){
                                                                //获取上级
                                                                for(let i in org_res){
                                                                    pid.push(org_res[i].org_pid);//上级
                                                                }

                                                                model_user.$CommonCoreOrg.find({"_id":{$in:pid}},function(errss,resss){
                                                                    if(errss){
                                                                        console.log(errss);
                                                                    }else{
                                                                        if(resss.length>0){
                                                                            var org_pid=[];
                                                                            //获取上上级
                                                                            for(let i in resss){
                                                                                pid.push(resss[i].org_pid)//上上级
                                                                                org_pid.push(resss[i].org_pid);
                                                                            }
                                                                            //上级
                                                                            model_user.$CommonCoreOrg.find({"org_pid":{$in:org_pid}},function(errsr,resultss){
                                                                                if(errsr){
                                                                                    resolve(errsr)
                                                                                    console.log(errsr);
                                                                                }else{
                                                                                    if(resultss.length>0){
                                                                                        //获取与上级同级
                                                                                        for(let i in resultss){
                                                                                            if(resultss[i].org_pid!=1){
                                                                                                pid.push(resultss[i]._id)
                                                                                            }
                                                                                        }

                                                                                        model_user.$User.find({"user_org":{$in:pid},"user_roles":{$in:item_assignee_role.split(",")}},function (err_pid,res_pid){
                                                                                            if(err_pid){
                                                                                                resolve(err_pid);
                                                                                                resolve({"data":null,"msg":"查询出错","error":err_pid,"success":false});
                                                                                            }else{
                                                                                                if(res_pid.length>0){
                                                                                                    var array=[];
                                                                                                    for(let i in res_pid){
                                                                                                        let map={};
                                                                                                        map.user_name = res_pid[i].user_name;
                                                                                                        map.user_no = res_pid[i].user_no;
                                                                                                        map.node_name = node_name;
                                                                                                        map.node_code = node_code;
                                                                                                        array.push(map);
                                                                                                    }
                                                                                                    resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});
                                                                                                }else{
                                                                                                    resolve(utils.returnMsg(false, '1000', '查询用户shibai', null, null))
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    }else{
                                                                                        resolve(utils.returnMsg(false, '1000', '查询用户shibai111333', null, null))

                                                                                    }
                                                                                }

                                                                            })
                                                                        }else{

                                                                            resolve(utils.returnMsg(false, '1000', '查询用户shibai111', null, null))

                                                                        }

                                                                    }
                                                                })

                                                            }
                                                        }
                                                    });

                                                }else{
                                                    resolve(utils.returnMsg(false, '1000', '查询用户shibai22222', null, null))
                                                }


                                            }
                                        })
                                    }
                                }
                            });


                        }else{
                            //下级
                            //正在处理中
                            model.$ProcessInstTask.find({"proc_code":proc_code,"proc_inst_task_code":item_assignee_ref_task,"_id":task_id},function(err_task,res_task){
                                if(err_task){
                                    resolve(err_task);
                                }else{
                                    if(res_task.length>0){
                                        //当任务节点 存在的时候的  我们可以使用 任务节点的 实际完成的 的 组织信息来寻在 下级处理的人的信息
                                        model_user.$User.find({"user_no":res_task[0].proc_inst_task_assignee},function(err_user,res_user){
                                            if(err_user){
                                                console.log(err_user);
                                                resolve(err_user);
                                            }else{
                                                if(res_user.length>0){
                                                    model_user.$CommonCoreOrg.find({"org_pid":{$in:res_user[0].user_org}},function(err_org,res_org){
                                                        if(err_org){
                                                            resolve(err_org);
                                                        }else{
                                                            if(res_org.length>0){
                                                                var pid=[]
                                                                //找到下级部门
                                                                for(let i in res_org){
                                                                    pid.push(res_org[i]._id);
                                                                }
                                                                model_user.$User.find({"user_org":{$in:pid},"user_roles":{$in:item_assignee_role.split(",")}},function(errors,results){
                                                                    if(errors){
                                                                        resolve(errors);
                                                                        resolve({"data":null,"msg":"查询出错","error":errors,"success":false});
                                                                    }else{
                                                                        //组装数据  返回给前端使用
                                                                        // console.log(results);
                                                                        // resolve({"data":results});
                                                                        var array=[];
                                                                        for(let i in results){
                                                                            let map={};
                                                                            map.user_name = results[i].user_name;
                                                                            map.user_no = results[i].user_no;
                                                                            map.node_name = node_name;
                                                                            map.node_code = node_code;
                                                                            array.push(map);
                                                                        }
                                                                        resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});
                                                                    }
                                                                });
                                                            }else{
                                                                resolve(null);
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }else{
                                        //正在处理中
                                        //当查询节点任务信息不存在的时候直接读取该点的 Org  同时依照器下级 来寻在用户
                                        getRefNodeInfo(item_assignee_ref_task,proc_code).then((rs)=>{
                                            model_user.$CommonCoreOrg.find({"org_pid":{$in:rs.data.item_assignee_org_ids.split(",")}},function(err_org,res_org){
                                                if(err_org){
                                                    resolve(err_org);
                                                }else{
                                                    if(res_org.length>0){
                                                        var pid=[];
                                                        for(let i in res_org){
                                                            pid.push(res_org[i]._id);
                                                        }
                                                        model_user.$User.find({"user_org":{$in:pid},"user_roles":{$in:item_assignee_role.split(",")}},function(errors,results){
                                                            if(errors){
                                                                resolve(errors);

                                                            }else{
                                                                //组装数据  返回给前端使用
                                                                // console.log(results);
                                                                // resolve({"data":results});
                                                                var array=[];
                                                                for(let i in results){
                                                                    let map={};
                                                                    map.user_name = results[i].user_name;
                                                                    map.user_no = results[i].user_no;
                                                                    map.node_name = node_name;
                                                                    map.node_code = node_code;
                                                                    array.push(map);
                                                                }
                                                                resolve({"data":array,"msg":"查询完成","error":null,"success":true,"next_node":node_code});

                                                            }
                                                        });
                                                    }else{

                                                        resolve(null);

                                                    }
                                                }
                                            })


                                        })

                                    }
                                }
                            });
                        }
                    }
                }else{
                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null))
                }
            }
        }
    })
    return promise;
}


//获取参照节点
function getRefNodeInfo(node_code,proc_code){
    return new Promise((resolve,reject)=> {
        model.$ProcessDefine.find({'proc_code': proc_code}, (err, res) => {
            if (err){
                resolve(utils.returnMsg(false, '1000', '查询流程', null, err));
            }else{
                if(res.length>0){
                    var proc_define_id=res[0]._id;
                    // var node_code;
                    // console.log(res[0].proc_define);
                    var proc_define=JSON.parse(res[0].proc_define);

                    //获取节点详细信息
                    var nodes=proc_define.nodes;
                    //获取节点之间关系
                    var lines=proc_define.lines;
                    // for (let  node in nodes){
                    //     console.log(nodes[node]);
                    // }
                    //节点配置信息
                    let item_config=JSON.parse(res[0].item_config);
                    // console.log(item_config);
                    var current_detail;
                    for(var node in item_config){
                        // console.log(item_config[node].item_code,node_code);
                        if(item_config[node].item_code==node_code){
                            resolve({"data":item_config[node],"error":null,"msg":"ok","success":true});
                            return ;
                        }
                    }
                }else{
                    resolve(utils.returnMsg(false, '1000', '查询流程', null, null));

                }

            }
        });
    });
}



/**
 * 获取第三节点处理人
 * @param proc_code
 * @returns {bluebird}
 */

exports.getNodeAndHandlerInfo=function(proc_code,user_no,param_json_str){
    var p=new Promise(function(resolve,reject) {
        var params=param_json_str;
        //解析参数
        if(!(!param_json_str||param_json_str=="undefined"||param_json_str=="{}")){

            var params_json=JSON.parse(param_json_str);
            var flag=true;
            for(var items_ in params_json){
                flag=false;
            }
            if(flag){
                resolve(utils.returnMsg(false, '1001', '参数解析不正确。', null, null));
            }else{
                params=params_json;
            }
        }else{
            params={};
        }
        //获取流程最大版本号信息
        var query = model.$ProcessDefine.find({});
        query.where('proc_code', proc_code);
        query.sort({ 'version': 'desc'});
        query.limit(1);
        query.exec(function (err, rs) {
            if (err) {
                resolve(utils.returnMsg(false, '1000', '查询流程', null, err))
            } else {
                if (rs.length > 0) {
                    //获取流程id
                    var proc_define_id=rs[0]._id;
                    var node_code;
                    var proc_define=JSON.parse(rs[0].proc_define);
                    //获取节点详细信息
                    var nodes=proc_define.nodes;
                    //获取节点之间关系
                    var lines=proc_define.lines;
                    //开始节点
                    var nodePar;
                    var beginNode;
                    //获取节点开始节点
                    for(var item in nodes){
                        var node=nodes[item];
                        if(node.type=='start  round'){
                            nodePar=item;
                            beginNode=item;
                        }
                    }
                    var params1;
                    //获取开始节点的下一节点，即实际派单节点的处理人
                    getNode(proc_define_id,beginNode,params1,true).then(function(rs){
                        if(!rs.success){
                            console.log(rs);
                            resolve(rs);
                            return ;
                        }
                        else{
                            var data=rs.data;
                            var next_node=data.next_node;
                            node_code=data.next_detail.item_code;
                            //获取第三节点所有处理人
                            getNode(proc_define_id,node_code,params,true).then(function(rs){
                                if(!rs.success){
                                    console.log(rs);
                                    resolve(utils.returnMsg(false, '1004', '流程图第三节点错误', null, null))  ;
                                    return ;
                                }

                                else{
                                    var data=rs.data;
                                    var next_node=data.next_node;
                                    findNodeInfo(next_node, data.next_detail,user_no).then(function(rs){
                                        resolve(rs);
                                    });
                                }


                            });

                        }

                    })

                }else{
                    resolve(utils.returnMsg(false, '1000', '查询用户信息错误1', null, null));
                }
            }
        });
    })
    return  p;
}

/**
 * 获取节点详细信息
 * @param next_node
 * @param resolve
 * @param next_detail
 */
function findNodeInfo(next_node, next_detail,user_no) {
    var promise=new Promise(function(resolve,reject) {
        if (next_node.type == "end  round") {
            var array = []
            var map = {};
            var node_name = next_node.name
            map.node_name = node_name;
            array.push(map)
            resolve(utils.returnMsg(true, '0000', '查询用户org', array, null))

        } else {

            var item_assignee_ref_task = next_detail.item_assignee_ref_task;


            var item_assignee_ref_cur_org = next_detail.item_assignee_ref_cur_org//: '1',
            var item_assignee_ref_type = next_detail.item_assignee_ref_type;//// 参照人类别 1-当前人，2-当前机构
            var item_assignee_user = next_detail.item_assignee_user;
            var item_assignee_user_code = next_detail.item_assignee_user_code;
            var item_assignee_role = next_detail.item_assignee_role;
            var item_assignee_org_ids = next_detail.item_assignee_org_ids;
            var node_code = next_detail.item_code
            var node_name = next_node.name

            var type = next_detail.item_assignee_type
            if (type == 1) {
                //单人

                var array = []
                var map = {};
                map.user_name = next_detail.item_show_text;
                map.user_no = item_assignee_user_code;
                map.node_name = node_name;
                map.node_code = node_code;
                array.push(map)
                resolve({"data":array,"msg":"查询用户org","error":null,"success":true,"next_node":node_code});
            } else if (type == 2) {
                var item_assignee_org_ids = next_detail.item_assignee_org_ids;
                var orgs = item_assignee_org_ids.split(",")

                // console.log("ccccccccccccccccccccccccccccccccccccccccccccc")
                // console.log(orgs)
                var i = 0;
                var array = [];
                findUserByOrg(orgs, i, item_assignee_role, resolve, array, node_name, node_code);

            } else if (type == 3) {
                // resolve(utils.returnMsg(false, '1000', '第三节点不可配置参照人', null))

                if (item_assignee_ref_type == 1) {
                    model_user.$User.find({"user_no": user_no}, function (errs, res) {
                        if (errs) {
                            resolve({"data":null,"msg":"查询出错","error":errs,"success":false});
                        } else {
                            var array = [];
                            var map = {};
                            map.user_no = res[0].user_no;
                            map.user_name = res[0].user_name;
                            map.node_name = node_name;
                            map.node_code = node_code;
                            array.push(map);
                            resolve({"data":array,"msg":"查询用户org","error":null,"success":true,"next_node":node_code});
                        }
                    })

                } else if (item_assignee_ref_type == 2) {

                    //参照人

                    if (item_assignee_ref_cur_org == 1) {
                        model_user.$User.find({"user_no": user_no}, function (errs, res) {
                            if (errs) {
                                resolve({"data":null,"msg":"查询出错","error":errs,"success":false});
                            } else {
                                if (res.length > 0) {
                                    var org = res[0].user_org;

                                    model_user.$User.find({
                                        "user_org": {$in:org},
                                        "user_roles": {$in:item_assignee_role.indexOf(",")!=-1?item_assignee_role.split(","):[item_assignee_role]}
                                    }, function (error, result) {
                                        if (error) {
                                            resolve({"data":null,"msg":"查询出错","error":error,"success":false});
                                        } else {
                                            // console.log("resultsresultsresultsresultsresultsresultsresultsresultsresultsresults \n", 6,  item_assignee_ref_task, org, item_assignee_role, result);
                                            if (result.length > 0) {
                                                var array = [];
                                                for (var user in result) {
                                                    var map = {};
                                                    map.user_no = result[user].user_no;
                                                    map.user_name = result[user].user_name;
                                                    map.node_name = node_name;
                                                    map.node_code = node_code;
                                                    array.push(map)
                                                }
                                                resolve({"data":array,"msg":"查询用户org","error":null,"success":true,"next_node":node_code});
                                            } else {
                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, JSON.stringify({node_code:node_code})));

                                            }
                                        }

                                    })

                                } else {
                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                }

                            }
                        })

                    } else if (item_assignee_ref_cur_org == 2) {

                        var returnMap={};
                        //查找上级机构以及同级所有机构
                        find_up_bak(user_no, "", returnMap).then(function(rs){
                            if(rs.success){
                                if(item_assignee_role.indexOf(",")!=-1){
                                    model_user.$User.find({"user_roles": {$in: item_assignee_role.split(",")},
                                        "user_org": {$in:rs.data.user_org_id}
                                    }, function (e, r) {
                                        if (e) {
                                            resolve({"data":null,"msg":"查询出错","error":e,"success":false});
                                        } else {
                                            if (r.length > 0) {
                                                var array = [];
                                                for (var user in r) {
                                                    var map = {};
                                                    map.user_no = r[user].user_no;
                                                    map.user_name = r[user].user_name;
                                                    map.node_name = node_name;
                                                    map.node_code = node_code;
                                                    array.push(map);
                                                }
                                                resolve({"data":array,"msg":"查询用户org","error":null,"success":true,"next_node":node_code});
                                            } else {
                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, JSON.stringify({node_code:node_code})));
                                            }
                                        }

                                    })
                                }else{
                                    model_user.$User.find({"user_roles": {$in: [item_assignee_role]},
                                        "user_org": {$in:rs.data.user_org_id}
                                    }, function (e, r) {
                                        if (e) {
                                            resolve({"data":null,"msg":"查询出错","error":e,"success":false});
                                        } else {
                                            if (r.length > 0) {
                                                var array = [];
                                                for (var user in r) {
                                                    var map = {};
                                                    map.user_no = r[user].user_no;
                                                    map.user_name = r[user].user_name;
                                                    map.node_name = node_name;
                                                    map.node_code = node_code;
                                                    array.push(map);
                                                }
                                                resolve({"data":array,"msg":"查询用户org","error":null,"success":true,"next_node":node_code});
                                            } else {
                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, JSON.stringify({node_code:node_code})));
                                            }
                                        }
                                    })
                                }
                            }
                        })

                    } else {
                        //下级
                        model.$ProcessInstTask.find({
                            "proc_inst_id": proc_inst_id,
                            "proc_inst_task_code": item_assignee_ref_task,
                            "proc_inst_task_status": 1
                        }, function (err, results) {
                            if (err) {
                                console.log(err)
                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, err));
                            } else {
                                model_user.$User.find({"user_no": user_no}, function (errs, res) {
                                    if (errs) {
                                        resolve({"data":null,"msg":"查询出错","error":errs,"success":false});
                                    } else {
                                        if (res.length > 0) {
                                            var org = res[0].user_org;
                                            model_user.$CommonCoreOrg.find({"_id": org}, function (error, result) {
                                                if (error) {
                                                    resolve({"data":null,"msg":"查询出错","error":error,"success":false});
                                                } else {
                                                    if (result.length > 0) {
                                                        var org_pid = result[0].org_pid;
                                                        model_user.$CommonCoreOrg.find({"_id": org_pid}, function (errors, resul) {
                                                            if (errors) {
                                                                resolve({"data":null,"msg":"查询出错","error":error,"success":false});

                                                            } else {
                                                                if (resul.length > 0) {
                                                                    var org_id = resul[0]._id;
                                                                    model_user.$User.find({
                                                                        "user_roles": item_assignee_role,
                                                                        "user_org": org_id
                                                                    }, function (e, r) {
                                                                        if (e) {
                                                                            resolve({"data":null,"msg":"查询出错","error":e,"success":false});
                                                                        } else {
                                                                            if (r.length > 0) {
                                                                                var array = [];
                                                                                for (var user in r) {
                                                                                    var map = {};
                                                                                    map.user_no = r[user].user_no;
                                                                                    map.user_name = r[user].user_name;
                                                                                    map.node_name = node_name;
                                                                                    map.node_code = node_code;
                                                                                    array.push(map)
                                                                                }
                                                                                resolve({"data":array,"msg":"查询用户org","error":null,"success":true,"next_node":node_code});
                                                                            } else {
                                                                                resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, JSON.stringify({node_code:node_code})));
                                                                            }
                                                                        }
                                                                    })
                                                                } else {
                                                                    resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, JSON.stringify({node_code:node_code})));
                                                                }
                                                            }
                                                        })

                                                    } else {
                                                        resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                                    }
                                                }
                                            })


                                        } else {
                                            resolve(utils.returnMsg(false, '10001', '查询用户信息错误', null, null));
                                        }

                                    }
                                })

                            }
                        })
                    }
                }
            }
        }
    })
    return promise;
}

/**
 * 获取节点详细信息
 * @param proc_code
 * @param node_node
 * @returns {bluebird}
 */
exports.getNodeDetail=function(proc_code,node_code){
    var process_define,item_config;
    var promise=new Promise(function(resolve,reject){
        //获取流程最大版本号信息
        var query = model.$ProcessDefine.find({});
        query.where('proc_code', proc_code);
        query.sort({ 'version': 'desc'});
        query.limit(1);
        query.exec(function (err, rs) {
            if (err) {
                resolve(utils.returnMsg(false, '1000', '查询流程失败', null, err))
            } else {
                if (rs.length > 0) {
                    var proc_define=JSON.parse(rs[0].proc_define);
                    var item_config=JSON.parse(rs[0].item_config);
                    //归档节点
                    var end_node;
                    //获取节点详细信息
                    var nodes=proc_define.nodes;
                    //获取节点之间关系
                    var lines=proc_define.lines;
                    //获取归档节点
                    for(var item in nodes){
                        var node=nodes[item];
                        if(node.type=='end  round'){
                            end_node=item;
                        }
                    }
                    //获取所有下一节点的连接线
                    var nextLines=new Array();

                    var isEnd=false;
                    var haveRefuse=false;
                    for(var item in lines){
                        var node=lines[item];
                        //获取所有对下一节点的连接线
                        if(node.from==node_code){
                            nextLines.push(item);
                            //判断下一节点是否存在归档节点
                            if(node.to==end_node){
                                isEnd=true;
                            }
                        }

                    }
                    if(nextLines.length!=0){
                        //判断是否存在拒绝线
                        for(var index in item_config){
                            var item=item_config[index];
                            for(var line in nextLines){
                                //如果是对下一节点的连接线
                                if(item.item_code==nextLines[line]){
                                    var item_el=item.item_el;
                                    //是否是拒绝线
                                    if(item_el.indexOf("flag==false")!=-1){
                                        haveRefuse=true;
                                    }
                                }
                            }
                        }
                        var rs={};
                        rs.haveRefuse=haveRefuse;
                        rs.isEnd=isEnd;
                        resolve(utils.returnMsg(true, '1000', '查询节点成功', rs, null));
                    }else{
                        resolve(utils.returnMsg(false, '1002', '不存在的节点', null, null));

                    }

                }else{
                    resolve(utils.returnMsg(false, '1001', '不存在的流程', null, null));
                }
            }
        });
    });
    return promise;
}



/**
 * 保存流程实例数据
 * @param dataMap 参数
 * @param proc_code 流程编码
 * @param proc_title 流程名称
 * @param user_code 当前用户
 */
function saveIns(dataMap,proc_code,proc_title,user_code){
    var p = new Promise(function(resolve,reject) {
        if(dataMap){
            var  inst={}
            inst.proc_id =data_define[0].proc_id;// 流程实例ID
            inst.proc_define_id =data_define[0]._id;//{type: Schema.Types.ObjectId, ref: 'CommonCoreProcessDefine'}, 流程图ID
            inst.proc_code =proc_code// 流程编码
            inst.parent_id=0// 父节点
            inst.parent_proc_inst_id=""//父流程id
            inst.proc_name=data_define[0].proc_name;// 流程名
            inst.proc_ver=data_define[0].version;// 流程版本号
            inst.catalog="";//流程类别
            inst.proce_reject_params="";//是否驳回
            inst.proc_instance_code="";//实例编码
            inst.proc_title=proc_title;//流程标题
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month = myDate.getMonth()+1;
            var day = myDate.getDate();
            var randomNumber = parseInt(((Math.random()*9+1)*100000));
            inst.work_order_number="GDBH"+year+month+day+randomNumber;//工单编号
            inst.proc_cur_task=dataMap.proc_cur_task;// 流程当前节点编码
            inst.proc_cur_task_name=dataMap.proc_cur_task_name;// 流程当前节点名称
            inst.proc_cur_user=dataMap.current_opt;//{type: Schema.Types.ObjectId, ref: 'CommonCoreUser'},当前流程处理人ID
            inst.proc_cur_user_name ='';//: String,当前流程处理人名
            inst.proc_cur_arrive_time=new Date();// : Date,当前流程到达时间
            inst.proc_cur_task_item_conf="";// : String,//当前流程节点配置信息(当前配置阶段编码)
            inst.proc_start_user=user_code;//:String,//流程发起人(开始用户)
            inst.proc_start_user_name=dataMap.proc_start_user_name;// : String,// 流程发起人名(开始用户姓名)
            inst.proc_start_time=new Date();// : Date,// 流程发起时间(开始时间)
            inst.proc_params="";// : String,// 流转参数
            inst.proc_inst_status=2;  // : Number,// 流程流转状态 1 已启用  0 已禁用,2 流转中，3 归档
            inst.proc_attached_type="";// : Number,// 流程附加类型(1:待办业务联系函;2:待办工单;3:待办考核;4:其他待办)
            inst.proce_attached_params="";// : {},// 流程附加属性
            inst.proce_reject_params="";// : {},// 流程驳回附加参数
            inst.proc_cur_task_code_num="";// : String,//节点编号
            inst.proc_task_overtime="";// : [],//超时时间设置
            inst.proc_cur_task_overtime="";// : Date,//当前节点的超时时间
            inst.proc_cur_task_remark="";// : String,//节点备注
            inst.proc_city="";// : String,// 地市
            inst.proc_county="";// : String,// 区县
            inst.proc_org="";// : String, // 组织
            inst.proc_cur_task_overtime_sms="";// : Number,//流程当前节点超时短信标记(1:待处理，2:已处理，3:不需要处理)
            inst.proc_cur_task_overtime_sms_count="";// : Number,//流程当前节点超时短信发送次数
            inst.proc_pending_users=dataMap.current_opt;// : []//当前流程的待处理人信息
            inst.proc_start_user_role_code = dataMap.proc_start_user_role_code;//流程发起人角色id
            inst.proc_start_user_role_names = dataMap.proc_start_user_role_names;//流程发起人角色名
            inst.proc_define=data_define[0].proc_define;//流程定义文件
            inst.item_config=data_define[0].item_config;//流程节点信息
            inst.proc_vars=dataMap.proc_vars;//流程变量
            inst.joinup_sys = dataMap.joinup_sys;//工单所属系统编号

            var arr = [];
            arr.push(inst);
            //写入数据库创建流程
            model.$ProcessInst.create(arr,function(error,rs){
                if(error) {
                    // reject('新增流程实例信息时出现异常。'+error);
                    console.log(error)
                    reject(utils.returnMsg(false, '1000', '新增流程实例信息时出现异常。', null, error));
                }
                else {
                    resolve(utils.returnMsg(true, '0000', '新增流程实例信息成功。', rs[0]._doc._id, null));

                }
            });

        }
    });
    return p;
}

/*
查询用户所拥有的角色
 */
function find(role_code){
    var p = new Promise(function(resolve,reject){
        if(role_code){
            if(role_code.length>1){
                model_user.$Role.find({'_id':{$in:role_code.split(",")}},function(err,rs){
                    if(err){
                        console.log(err);
                    }else{
                        var roleNames = '';
                        if(rs.length>0){
                            for(var i=0;i<rs.length;i++){
                                var roleName = rs[i].role_name;
                                roleNames +=roleName+',';
                            }
                            roleNames = roleNames.substring(0,roleNames.length-1);
                            resolve(utils.returnMsg(true, '0000', '查询成功。', roleNames, null));
                        }
                    }
                });
            }
            else{
                model_user.$Role.find({'_id':role_code},function(err,rs){
                    if(err){
                        console.log(err);
                    }else{
                        var roleNames = '';
                        if(rs.length>0){
                            for(var i=0;i<rs.length;i++){
                                var roleName = rs[i].role_name;
                                roleNames +=roleName+',';
                            }
                            roleNames = roleNames.substring(0,roleNames.length-1);
                            resolve(utils.returnMsg(true, '0000', '查询成功。', roleNames, null));
                        }
                    }
                });
            }
        }else{
            resolve(utils.returnMsg(false, '1000', '没有这个角色。',null,null));
        }
    });
    return p;
}

exports.find_role = function(user_no){
    var p = new Promise(function(resolve,reject){
        model_user.$User.find({'user_no':user_no},function (err,rs) {
            if(err){
                console.log(err);
            }else{
                if(rs.length>0){
                    var role_code = rs.user_roles;
                    resolve(utils.returnMsg(true, '0000', '查询成功。', rs, null));
                }
            }
        })
    });
    return p;
}

/**
 * 新增流程任务
 * @param result
 * @param condition
 */
function insertTask(result,condition){
    var proc_inst_task_assignee,proc_inst_task_assignee_name,proc_inst_task_sign;
    var proc_inst_task_user_role,proc_inst_task_user_role_name
    if(  nodeDetail[0].next_detail.item_assignee_type==1){
        proc_inst_task_assignee=nodeDetail[0].next_detail.item_assignee_user_code;
        proc_inst_task_assignee_name=nodeDetail[0].next_detail.item_show_text;
        proc_inst_task_user_role ="";
        proc_inst_task_user_role_name="";
        proc_inst_task_sign=1;// : Number,// 流程签收(0-未认领，1-已认领)
    }
    if( nodeDetail[0].next_detail.item_assignee_type==2||nodeDetail[0].next_detail.item_assignee_type==3||nodeDetail.next_detail.item_assignee_type==4){
        proc_inst_task_assignee="";
        proc_inst_task_assignee_name="";
        proc_inst_task_user_role =nodeDetail[0].next_detail.item_assignee_role;
        proc_inst_task_user_role_name=nodeDetail[0].current_detail.item_show_text;
        proc_inst_task_sign=0;// : Number,// 流程签收(0-未认领，1-已认领)
    }
    if(condition.proc_inst_task_assignee){
        proc_inst_task_assignee=condition.proc_inst_task_assignee;
    }
    if( condition.proc_inst_task_assignee_name){
        proc_inst_task_assignee_name=condition.proc_inst_task_assignee_name;
    }
    var current_node=condition.proc_cur_task;
   return new Promise(async function(resolve,reject){
        var task={};
        let result_t=await findParamss(result.data,condition.proc_cur_task);
        var proc_inst_task_params=result_t.data;
        task.work_order_number=condition.work_order_number//工单编号
        task.proc_inst_id=result.data;// : {type: Schema.Types.ObjectId, ref: 'CommonCoreProcessInst'}, // 流程流转当前信息ID
        task.proc_inst_task_code=condition.proc_cur_task;// : String,// 流程当前节点编码(流程任务编号)
        task.proc_inst_task_name=condition.proc_name;// : String,// 流程当前节点名称(任务名称)
        task.proc_inst_task_title=condition.proc_inst_task_title;// : String,// 任务标题proc_inst_task_title
        task.proc_inst_task_type=condition.proc_name;// : String,// 流程当前节点类型(任务类型)
        task.proc_inst_task_arrive_time=new Date();// : Date,// 流程到达时间
        task.proc_inst_task_handle_time="";//: Date,// 流程认领时间
        task.proc_inst_task_complete_time="";// : Date,// 流程完成时间
        task.proc_inst_task_status=0;// : Number,// 流程当前状态
        task.proc_inst_task_assignee=condition.proc_start_user;//: array,// 流程处理人ID
        task.proc_inst_task_assignee_name=condition.proc_start_user_name;// : array,// 流程处理人名
        if(proc_inst_task_user_role.indexOf(",")!=-1){
            task.proc_inst_task_user_role =proc_inst_task_user_role.split(",");
        }else{
            task.proc_inst_task_user_role =[proc_inst_task_user_role];
        }
        task.proc_inst_task_user_role_name=proc_inst_task_user_role_name;// : String,// 流程处理用户角色名
        if(condition.proc_inst_task_user_org)task.proc_inst_task_user_org=condition.proc_inst_task_user_org;//String  //流程处理用户的组织
        task.proc_inst_task_params=proc_inst_task_params;// : String,// 流程参数(任务参数)
        task.proc_inst_task_claim="";// : Number,// 流程会签
        task.proc_inst_task_sign=proc_inst_task_sign;// : Number,// 流程签收(0-未认领，1-已认领)
        task.proc_inst_task_sms="";//"// : String// 流程处理意见
        task.proc_inst_task_remark="";
        task.proc_inst_biz_vars=condition.proc_inst_biz_vars;//实例变量
        task.proc_inst_node_vars=condition.proc_inst_node_vars;//流程节点变量
        task.proc_vars=condition.proc_vars;//流程变量
        task.proc_task_start_name = condition.proc_start_user_name;//流程发起人姓名
        task.proc_task_start_user_role_names = condition.proc_start_user_role_names;//流程发起人角色
        task.proc_task_start_user_role_code = condition.proc_start_user_role_code;//流程发起人id
        task.proc_code=condition.proc_code;
        task.proc_name=condition.proc_name;
        task.joinup_sys = condition.joinup_sys;
        var arr=[];
        arr.push(task);
        //写入数据库创建流程任务表
        let rs= await model.$ProcessInstTask.create(arr);
        resolve(utils.returnMsg(true, '0000', '流程实例创建启动成功。', rs, null));

   });
}


/**
 *
 * @param proc_inst_id
 * @param node_code
 * @returns {bluebird}
 *
 * 把线上所有参数解析出来
 */
function findParamss(proc_inst_id,node_code){
    return new Promise(function(resolve,reject){
        model.$ProcessInst.find({"_id":proc_inst_id},function(err,result){
            if(err){
                console.log(err);
                resolve(utils.returnMsg(false, '1000', '查询参数错误', null, null))
            }else{
                var allArray=[]
                var item_config=JSON.parse(result[0].item_config);
                var proc_define=JSON.parse(result[0].proc_define);
                var nodeArray=getValidNode(proc_define,node_code,true)
                var lines=proc_define.lines;
                for(var line in lines){
                    var from =lines[line].from;
                    var to = lines[line].to;
                    for(var node in nodeArray){
                        if(nodeArray[node]==to){
                            var evalStr=findEval(line,item_config);
                            var array_params=choiceDetermin(evalStr)
                            for(var i=0;i<array_params.length;i++){
                                var temp=array_params[i];
                                if(!contains(allArray,temp)){
                                    allArray.push(temp);
                                }
                            }
                        }
                    }
                }
                resolve(utils.returnMsg(true, '0000', '，查询参数正常', allArray, null)) ;
            }
        })
    });

}
