/**
 * 常见问题Service.
 */
var model_common_problem=require("../../suggestion/model/model_common_problem");
var utils = require('../../../../lib/utils/app_utils');

/***
 * 常见问题添加
 */
exports.add_common_problem  =function (arr){
    return new Promise(async function(resolve,reject){
        await model_common_problem.$CommonProblem.create(arr);
        resolve({'success':true,'code':'2000','msg':'添加问答成功',"error":null});
    });
};

/***
 * 列出常见问题
 */
exports.list_answers  =function list_answers(condition,page,size){
    return new Promise(function(resolve){
        utils.pagingQuery4Eui(model_common_problem.$CommonProblem, page, size, condition, resolve, '',
            {});
    });
};


//删除常见问题 By ID
exports.deleteById=function(_id){
    return new Promise(async function(resolve){
        let rs= await model_common_problem.$CommonProblem.remove({'_id':_id});
        resolve({"data":rs,"code":"0000","success":true,"msg":"删除信息成功"})
    })
}
// 更新常见问题
exports.update_problem = function(condition,params){
    return new Promise(async function(resolve){
        let rs=await model_common_problem.$CommonProblem.update(condition,{$currentDate:{"update_time":true},$set:{"suggestion_title":params.suggestion_title,
                "answer":params.answer,"update_by":params.update_by}});
        resolve({"success":true,"error":null,"data":rs,"code":"0000","msg":"更新成功"});
    })
}