var model_user=require("../models/user_model");
var Pormise=require("bluebird");
var utils = require('../../../../lib/utils/app_utils');
var new_model=require("../models/newest_user_model");
var async=require("async");

//
//
//用于更新数据表（org） 因为 OA 系统 导入的org 表格 中的 省公司和 市公司 实在同一级别 因此需要通过字段判别，
//把省公司的级别提升一级，同时市公司放在省公司的下面 ，构成从属关系。
// function update_org_ascend(){
//
//
//
//
// }
// update_org_pid_main().then(function(rs){
//    console.log(rs);
//
// });


//更新org的 PID 的 主函数
function update_org_pid_main(){
    return new Pormise(function(resolve,reject){
        new_model.$CommonCoreOrg.find({},function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"第二次使用mongo数据出错  完全不让人活了 "});
            }else{
                if(result.length>0){
                    var k=0;
                    update_org_sub_async(k,result,resolve);
                }else{
                    resolve({"data":null,"error":null,"msg":"查询数据 失败 >>>>>>>>> fuck! "});
                }
            }
        });
    });
}

//更新org的 PID 的 副函数；
function update_org_sub_async(k,array,resolve){
    if(array&&array.length>k){
        var org=array[k];
        // var _id=org._id;
        var pid=org.org_pid;
        var org_name=org.org_name;
        if(pid!="0"){
            new_model.$CommonCoreOrg.find({"_id":pid},function(e,r){
                if(e){
                    console.log(e);
                    resolve({"data":null,"error":e,"msg":"查询数据 失败 >>>>>>>>> fuck! "});
                } else{
                    if(r.length>0){
                        var parent=r[0];
                        model_user.$CommonCoreOrg.find({"org_name":parent.org_name},function(es,rs){
                            if(es){
                                console.log(es);
                                resolve({"data":null,"error":es,"msg":"最后一步  最后一步  查询org_name 报错 坑爹啊  "});
                            } else{
                                if(rs.length>0){
                                    console.log("匹配到了数据  开始更新");
                                    var map = {};
                                    map.org_pid=rs[0]._id;
                                    model_user.$CommonCoreOrg.find({"org_name":org_name},function(errors,results){
                                        if(errors){
                                            console.log(errors);
                                            resolve({"data":null,"error":errors,"msg":"个锤子的 还错！  "});
                                        }else{
                                            if(results.length>0){
                                                model_user.$CommonCoreOrg.update({"_id":results[0]._id},{$set:map},{},function(err,res){
                                                    if(err){
                                                        console.log(err);
                                                        resolve({"data":null,"error":err,"msg":"再错了  我也不改动了  "});
                                                    }else{
                                                        k++;
                                                        update_org_sub_async(k,array,resolve);
                                                    }

                                                });
                                            }else{
                                                k++;
                                                update_org_sub_async(k,array,resolve);
                                            }
                                        }
                                    });

                                }else{
                                    k++;
                                    update_org_sub_async(k,array,resolve);
                                }
                            }

                        });

                    }else{
                        console.log("不存在  parent_id");
                        k++;
                        update_org_sub_async(k,array,resolve);
                    }

                }

            });
        }else{
            k++;
            update_org_sub_async(k,array,resolve);
        }

    }else{
        resolve({"data":null,"error":null,"msg":"everything is over ! "});
        return;

    }
}



// });
//用于更新 org 的主函数使用方法 ：首先去外部提供的数据库表中 查询数据，然后去正在使用的org表格中 通过关键字 org_name 对比更新或者 插入
function update_org_main (){
    return new Pormise(function(resolve,reject){
        new_model.$CommonCoreOrg.find({},function(error,result){
            if(error){
                // console.log(error);
                resolve({"data":null,"error":error,"msg":"初次使用mongo数据出错  让不让人 活了  "});
            }else{
                if(result.length>0){
                    update_org(0,result,resolve);
                }else{
                    resolve({"data":null,"error":null,"msg":"卧槽 查询不到数据！"});
                    
                }
            }
        });

    });
}
//这里是 update_org_main 用于控制异步的方法
function update_org(k,array,resolve){
    if(array&&array.length>k){
        var condition={};
        var org=array[k];
        var org_name=org.org_name;
        condition.org_name=org_name;
        model_user.$CommonCoreOrg.find(condition,function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"查询原来的失败啦  还是 org 表 这不科学"});
            }else{
                if(result.length>0){
                    console.log("org  哦  原来你也在这里 ");
                    k++;
                    update_org(k,array,resolve);
                }else{
                    var map={};
                    map.org_name=org.org_name;
                    map.org_code_desc=org.org_code_desc;
                    map.org_fullname=org.org_fullname;
                    map.company_code=org.company_code;
                    map.level=org.level;
                    map.org_order=org.org_order;
                    map.org_type=org.org_type;
                    map.org_pid=org.org_pid;
                    map.company_no=org.company_no;
                    map.parentcode_desc=org.parentcode_desc;
                    map.org_status=org.org_status;
                    map.org_belong=org.org_belong;
                    map.midifytime=org.midifytime;
                    map.org_code=org.org_code;
                    map.smart_visual_sys_org_id="";
                    map.athena_sys_org_id="";
                    map.athena_app_sys_org_id="";
                    map.inspect_sys_org_id="";
                    model_user.$CommonCoreOrg.create(map,function(e,r){
                       if(e){
                           console.log(e);
                           resolve({"data":null,"error":e,"msg":"org 完全不给面子都不让老子插入数据库"});
                       }else{
                           k++;
                           update_org(k,array,resolve);
                       }
                    });
                }
            }
        });

    }else{
        resolve({"data":null,"error":null,"msg":"everything is over ! "});
        return ;
    }
}