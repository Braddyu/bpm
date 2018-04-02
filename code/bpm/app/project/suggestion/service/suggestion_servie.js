var model_sugg=require("../../suggestion/model/model_suggestion");
var model_user=require('../../bpm_resource/models/user_model')
var utils = require('../../../../lib/utils/app_utils');


/**
 * 查找建议发起人
 */


exports.find_user=function (){
    return new Promise(async function(resolve){
        var arr=[];
        let user_names=await model_sugg.$AdviceFeedback.distinct("user_name",{})
        for(let i in user_names){
            let map={"user_name":user_names[i]}
            arr.push(map);
        }
        resolve(arr)
    })
}

exports.update_suggestion=function(condition,handle_contents){
    return new Promise(async function(resolve){
        var set=0;
        if(handle_contents){
            set=1
        }
        var handle_date = new Date();
        let rs=await model_sugg.$AdviceFeedback.update(condition,{$set:{"handle_contents":handle_contents,"handle_status":set,"handle_date":handle_date}});
        resolve({"success":true,"error":null,"data":rs,"code":"0000","msg":"更新成功"});
    })
}
/***
 * 意见添加
 */
exports.create_sugg  =function (condition){
    return new Promise(async function(resolve,reject){

        condition.create_date=new Date();//
        condition.handle_status=0;//意见状态,1已处理，0未处理
        condition.handler_name="";//处理人
        condition.handle_date = "";// 处理时间
        condition.handle_contents = "";// 处理意见
        // adv.handl_time//处理时间
        await model_sugg.$AdviceFeedback.create(condition);
        resolve({'success':true,'code':'2000','msg':'添加意见成功',"error":null});
    });
};

/***
 * 意见查询
 */
exports.find_sugg = function sugg_find(condition,page,size){
    return new Promise(function(resolve){
        utils.pagingQuery4Eui(model_sugg.$AdviceFeedback, page, size, condition, resolve, '',  {});
    });
}

//查找用户组织和信息
exports.find_org=(user_no)=>{
    return new Promise(async(resolve)=>{
        let user=await model_user.$User.find({"user_no":user_no})
        if(!user.length){
            resolve({"data":null,"success":false,"code":'1000','msg':"未查询到用户数据"})
        }
        let org= await model_user.$CommonCoreOrg.find({"_id":{$in:user[0].user_org}});
        if(!org.length){
            resolve({"data":null,"success":false,"code":'1000','msg':"未查询到组织数据"})
        }
        resolve({"data":{"org_name":org[0].org_name,"user_tel":user[0].user_phone},"code":"0000","success":true,"msg":"查询用户组织成功"})
    })
}



//删除意见建议信息 By ID
exports.deleteByIdService=function(_id){
    return new Promise(async function(resolve){
        let rs= await model_sugg.$AdviceFeedback.remove({'_id':_id});
        resolve({"data":rs,"code":"0000","success":true,"msg":"删除信息成功"})
    })
}