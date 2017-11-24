var model_user=require("../models/user_model");
var Pormise=require("bluebird");
var async=require("async");
var utils = require('../../../../lib/utils/app_utils');
var new_model=require("../models/newest_user_model");
var mysql_pool=require("../../../../lib/mysql_pool_for_athena");
var mysql_pool_bpm=require("../../../../lib/mysql_pool_for_mysql");
var fs=require("fs");



// print();
// function print(){
    // let sql="select * from common_role_info";
    // mysql_pool.query(sql,function(err,res){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         for(var i in res){
    //             fs.appendFile('D:/123.txt',"\n", function (err) {
    //                 if (err) throw err;
    //                 console.log('添加完成');
    //             });
    //             fs.appendFile('D:/123.txt',JSON.stringify(res[i]), function (err) {
    //                 if (err) throw err;
    //                 console.log('添加完成');
    //             });
    //
    //         }
    //
    //     }
    // });
//     model_user.$Role.find({},function(err,res){
//         if(err){
//             console.log(err);
//         }else{
//             fs.appendFile('D:/123.txt',JSON.stringify(res), function (err) {
//                 if (err) throw err;
//                 console.log('添加完成');
//             });
//
//         }
//
//
//     })
//
// }
//
// Promise.all([]).then(function(array){
//     for(var i in array){
//         console.log(array[i]);
//     }
//
// });
// link_org_for_anthen_main().then(function(rs){
//     console.log(rs);
//
// });
//
// function link_org_for_anthen_main(){
//     // let sql="";
//     return new Promise(function(resolve,reject){
//         mysql_pool.query("select * from common_role_info",[],function(error,result){
//             if(error){
//                 resolve({"data":null,"error":error,"msg":"查询athena 的role错误"});
//             }else{
//                 link_org_for_anthen_sub(0,result,resolve);
//                 // resolve({"data":result,"error":null,"msg":"让老子看看"});
//
//             }
//         });
//     });
// }
//
// function link_org_for_anthen_sub(k,array,resolve){
//     if(array&&array.length>k){
//         var role=array[k];
//         model_user.$Role.find({"role_name":role.rolename},function(error,result){
//            if(error){
//                console.log(error);
//                resolve({"data":null,"error":error,"msg":"mongoDB 你搞毛线啊  ！"});
//            } else{
//                if(result.length>0){
//                     console.log(result);
//                    k++;
//                    link_org_for_anthen_sub(k,array,resolve);
//                }else{
//                    k++;
//                    link_org_for_anthen_sub(k,array,resolve);
//                }
//            }
//         });
//     }else{
//         resolve({"data":null,"error":null,"msg":"卧槽  终于搞完了 ！"});
//         return ;
//     }
//
//
// }

// var async=require("async");


// // console.time('series');
// async.series({
//     one: function(callback) {
//         callback(null, 'one');//callback('i am err','one');异常处理
//     },
//     two: function(callback) {
//         callback(null, 'two');
//
//     },
// }, function(error, result) {
//     //最后结果
//     console.log('error: ' + error);
//     console.log('result: ' + result);
//     console.timeEnd('series');
// });
// link_user_and_role_main().then(function(rs){
//     console.log(rs);
//
// });

// async.series({
//     one: update_org_pid_main(),
//     two: update_role_main(),
//     three:update_user_main(),
//     four:link_user_and_org_main(),
//     five:link_user_and_role_main()
// },function(err, results) {
//     console.log(results);
// }});


//(),(),(),link_user_and_role_main()
// async.series([
//
//
//     ,
//     ,
//     (),
//     (),
//     (),
//
//     // console.log("完成了链接用户USER 和 ROLE 之间的 数据",rs);
//
// ],function(err, results) {
//     console.log(err);
//     console.log(results);
// });

// async.waterfall([
//     function(cb){
//         update_org_main().then(function(rs){
//             console.log(rs);
//             cb(null,1,2);
//         });
//     },
//
//     function(a,b,cb){
//         console.log(a,b);
//         update_org_pid_main().then(function(rs){
//             console.log(rs);
//             cb(null, 3, 4);
//         });
//
//     },
//     function(arg1, arg2, callback){
//         update_role_main().then(function(rs){
//             console.log(rs);
//             callback(null, 5,6);
//         });
//         // arg1 now equals 'one' and arg2 now equals 'two'
//
//     },
//     function(arg1, arg2, callback){
//         update_user_main().then(function(rs){
//             console.log(rs);
//             callback(null, 7,8);
//         });
//         // arg1 now equals 'one' and arg2 now equals 'two'
//     },
//     function(arg1, arg2, callback){
//         link_user_and_org_main().then(function(rs){
//             console.log(rs);
//             callback(null, 9);
//         });
//         // arg1 now equals 'one' and arg2 now equals 'two'
//     },
//     function(arg1, callback){
//         console.log(arg1);
//         link_user_and_role_main().then(function(rs){
//
//          callback(null, 'done');
//         });
//         // arg1 now equals 'three'
//
//     }
// ], function (err, result) {
//     // result now equals 'done'
//     console.log(result);
// });

// update_sales_for_athena_app_main().then(function(rs){
//     console.log(rs);
// });
// function link_athena_app_user_to_org(){
//
//
//
//
// }
// test();
// function test(){
// model_user.$User.remove({"login_account":null},function(err,res){
//    if(err){
//        console.log(err);
//    } else{
//        console.log(res);
//
//    }
//
// });
//
//
// }
//  link_channel_to_grid_main();

// link_grid_to_district_main();

//
// function (){}
link_hall_manager_to_org_main();
function link_hall_manager_to_org_main(){
    model_user.$User.find({"user_roles":{$in:["5a0e52054d6a1c2d121c09aa"]}},function(error,result){
        if(error){
            console.log(error);
        }else{
            link_hall_manager_to_org_sub(0,result);
        }

    });

}

function link_hall_manager_to_org_sub(k,array){
    if(array&&array.length>k){
        var user=array[k];
        var user_name=user.user_name;
        let sql="select * from hall_manager_info where 1=1 and hall_manager_name=? and hall_manager_tel=?";
        console.log(sql,[user_name,user.user_phone]);

        mysql_pool_bpm.query(sql,[user_name,user.user_phone],function(err,res){
            if(err){

                console.log(err);
            }else{
                if(res.length>0){
                    var channel_name=res[0].channel_name;
                    model_user.$CommonCoreOrg.find({"org_name":channel_name},function(error,result){
                        if(error){
                            console.log(error);

                        }else{
                            if(result.length>0){
                                var flag=false;
                                for(var i in user.user_org){
                                    if( user.user_org[i]==result[0]._id){
                                        flag=true;
                                    }
                                }

                                if(flag){

                                    k++; link_hall_manager_to_org_sub(k,array);

                                }else{
                                    user.user_org.push(result[0]._id);
                                    model_user.$User.update({"_id":user._id},{$set:{"user_org":user.user_org}},{},function(errors,results){
                                        if(errors){
                                            console.log(errors);
                                        }else{
                                            k++;
                                            link_hall_manager_to_org_sub(k,array);
                                        }
                                    });
                                }
                            }else{
                                k++;
                                link_hall_manager_to_org_sub(k,array);

                            }
                        }
                    });
                }else{
                    k++;
                    link_hall_manager_to_org_sub(k,array);
                }
            }
        });

    }else{
        return ;
    }


}


// update_hall_mannager_main();



function update_hall_mannager_main(){
    // model_user.$User.find({},function(err,res){
    //     if(err){
    //         console.log(err);
    //
    //     }else{
    //         update_hall_mannager_sub(0,res);
    //     }
    // });

    let sql="select a.* from hall_manager_info a "
    mysql_pool_bpm.query(sql,function(err,res){
        if(err){
            console.log(err);

        }else{
            update_hall_mannager_sub(0,res);

        }

    });

}


function update_hall_mannager_sub(k,array){
    if(array&&array.length>k){

        // var user=array[k];
        // model_user.$User.find({"user_name":user.user_name,"user_phone":user.user_phone},function(err,res){
        //     if(err){
        //         console.log(err);
        //
        //     }else{
        //         if(res.length>1){
        //             model_user.$User.remove({"_id":user._id},function(error,result){
        //                 if(error){
        //
        //                     console.log(error);
        //                 }else{
        //                     k++;
        //                     update_hall_mannager_sub(k,array);
        //                 }
        //             });
        //
        //         }else{
        //             k++;
        //             update_hall_mannager_sub(k,array);
        //         }
        //     }
        //
        // });
        var manager=array[k];
        // var salesperson_tel=sale.salesperson_tel;
        // var salesperson_name=sale.salesperson_name;
        var role_id="5a0e52054d6a1c2d121c09aa";
        var map ={};
        map.login_account=manager.hall_manager_tel;//sale.login_account;// : String,// 登录账号
        map.user_status=1;// : Number,// 用户状态
        map.user_id=manager.id;//:String,//用户ID
        map.user_no=manager.id;// : String,// 用户工号
        map.user_name=manager.hall_manager_name;// : String,// 用户姓名
        map.user_gender="";//;// : String,// 用户性别
        map.user_phone=manager.hall_manager_tel;// : String,// 用户手机
        map.user_tel=manager.hall_manager_tel;;// : String,// 用户联系电话
        map.user_email="";//sale.user_email;// : String,// 用户邮箱
        map.login_password="123456";//sale.login_password;// : String,// 登录密码
        map.user_org=[];//sale.user_org;// : {type: Schema.Types.ObjectId, ref: 'CommonCoreOrg'},// 所在部门
        map.user_sys="";//sale.user_sys;// : String,// 所属系统
        map.user_org_desc="";//sale.user_org_desc;//:String,//所属系统的 描述
        map.theme_name="";//sale.theme_name;// : String,// 使用主题
        map.theme_skin="";// : String,// 使用皮肤
        map.user_photo="";// : String,// 用户头像/照片
        map.sys_roles=[];// : [{type: Schema.Types.ObjectId}],// 菜单访问权限使用角色
        map.user_roles=[role_id];//:[{type:Schema.Types.ObjectId}],//流程使用的角色
        map.boss_id="";//:String=""//对接外部系统专用的 Boss_id
        map.smart_visual_sys_user_id="";  //:String,//慧眼系统的 User_id
        map.athena_sys_user_id="";//:String=""///Athena系统的user_id
        map.athena_app_sys_user_id=manager.id;//"";//:String,//Athena_app系统的user_id
        map.inspect_sys_user_id="";//:String,//稽查系统的user_id
        map.token="";//String//不知道是什么东西，留着吧
        map.special_sign="";//:String,//也不知道是什么东西 留着把

        // console.log(manager);

        model_user.$User.find({"user_name":manager.hall_manager_name,"user_phone":manager.hall_manager_tel},function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"这都错误  简直了"});
            }else{
                console.log(result.length);
                if(result.length>0){
                    //存放到异常数据数据库
                    var user_role=result[0].user_roles;
                    var flag=false;
                    for(var i in user_role){
                        if(user_role[i]==role_id){
                            flag=true;
                        }
                    }
                    console.log(user_role);
                    console.log(flag);
                    if((typeof user_role)=="string"){
                        if(!flag){
                            model_user.$User.update({"_id":result[0]._id},{$set:{"user_role":[user_role,role_id]}},function(errors,results){
                                if(errors){
                                    console.log(errors);
                                }else{
                                    k++;
                                    update_hall_mannager_sub(k,array);
                                }
                            });
                        }else{
                            k++;
                            update_hall_mannager_sub(k,array);
                        }


                    }else{
                        if(!flag){
                            model_user.$User.update({"_id":result[0]._id},{$set:{"user_role":user_role.push(role_id)}},function(errors,results){
                                if(errors){
                                    console.log(errors);
                                }else{
                                    k++;
                                    update_hall_mannager_sub(k,array);
                                }
                            });
                        }else{
                            k++;
                            update_hall_mannager_sub(k,array);
                        }


                    }


                }else{
                    //create
                    model_user.$User.create(map,function(err,res){
                        if(err){
                            console.log(err);
                            resolve({"data":null,"error":err,"msg":"卧槽 这都可以错  不科学"});
                        }else{
                            k++;
                            update_hall_mannager_sub(k,array);
                        }
                    });
                }
            }
        });

    }else{
        return ;
    }

}

function link_grid_to_district_main(){
    model_user.$CommonCoreOrg.find({"level" : 5},function(error,result){
        if(error){
            console.log(error);

        }else{
            link_grid_to_district_sub(0,result);
        }
    });
}

function link_grid_to_district_sub(k,array){
    if(array&&array.length>k){
        var org=array[k];
        var org_name=org.org_name;

        let sql="select * from common_org_info where 1=1 and orgname like '%"+org_name+"'";
        let sql_bak="select * from common_org_info where 1=1 and orgname=?";
        mysql_pool.query(sql,function(err,res){
            if(err){
                console.log(err);
            }else{
                // if(res.length>1){
                //     for(var i in res){
                //         console.log(res[i].orgname);
                //     }
                //     console.log(org_name,res.length,k);
                // }else if(res.length>0){
                //     console.log(res[0].orgname,org_name,res.length,k);
                // }

                console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                if(res.length>0){
                    var org_pid=res[0].superorgid;
                    let sql ="select * from common_org_info where 1=1 and orgid=?";
                    mysql_pool.query(sql,[org_pid],function(e,r){
                        if(e){
                            console.log(e);
                        }else{
                            if(r.length>0){
                                var orgname=r[0].orgname;
                                console.log(orgname);
                                model_user.$CommonCoreOrg.find({"level" : 4,"org_type":"县公司"},function(es,rs){
                                    if(es){
                                        console.log(es);
                                    }else{
                                        if(rs.length>0){

                                            compara_org(0,rs,org,r,function(){
                                                k++;
                                                link_grid_to_district_sub(k,array);
                                            });

                                        }else{

                                        }
                                    }
                                });


                            }else{
                                k++;
                                link_grid_to_district_sub(k,array);
                            }
                        }
                    });

                }else{
                    k++;
                    link_grid_to_district_sub(k,array);
                }

                // if(res.length>1){
                //     //这个就比较麻烦；多条数据匹配
                //     //这样吧 记录号码
                //
                //
                // }else if(res.length==1){
                //
                //
                //
                // }else{
                //
                //
                //
                // }
            }

        });
    }else{
        return ;
    }
}

function compara_org(k,array,org,r,cb){
    // console.log("____________________________________________________________________");
    if(array&&array.length>k){
        var orgs=array[k];
        var orgname=r[0].orgname;
        let org_name=orgs.org_name;
        // console.log(org_name.substr(0,2),orgname.substr(0,2));
        if(org_name.indexOf("市")==-1&&(org_name.substr(0,2)==orgname.substr(0,2))){

            console.log("  匹配上了  ");
            model_user.$CommonCoreOrg.update({"_id":org._id},{$set:{"org_pid":orgs._id}},{},function(err,res){
                if(err){
                    console.log(err);

                }else{
                    k++;
                    compara_org(k,array,org,r,cb);

                }
            });

        }else{
            k++;
            compara_org(k,array,org,r,cb);
        }

    }else{
        cb();
    }

}
// link_channel_to_grid_main();

function link_channel_to_grid_main(){
    model_user.$CommonCoreOrg.find({"level" : 6},function(error,result){
        if(error){
            console.log(error);
        }else{
            link_channel_to_grid_sub(0,result);
        }
    });
}

function link_channel_to_grid_sub(k,array){
    if(array&&array.length>k){
        var org=array[k];
        var channel_id=org.org_code_desc;
        let sql="select * from salesperson_info where 1=1 and channel_id=?";
        mysql_pool_bpm.query(sql,[channel_id],function(err,res){
            if(err){
                console.log(err);
            }else{
                if(res.length>0){
                    var grid_coding=res[0].grid_coding;
                    console.log(typeof grid_coding);
                    if(grid_coding){
                        console.log(111111111111111111);

                    }else{
                        console.log(222222222222222222);
                    }
                    if(grid_coding){
                        model_user.$CommonCoreOrg.find({"org_code_desc":grid_coding},function(error,result){
                            if(error){
                                console.log(error);
                            }else{
                                var org_pid=result[0]._id;
                                model_user.$CommonCoreOrg.update({"_id":org.id},{$set:{"org_pid":org_pid}},{},function(errors,results){
                                    if(errors){
                                        console.log(errors);
                                    }else{
                                        k++;
                                        link_channel_to_grid_sub(k,array);
                                    }
                                });
                            }
                        });

                    }else{
                        model_user.$CommonCoreOrg.update({"_id":org.id},{$set:{"org_pid":null}},{},function(errors,results){
                            if(errors){
                                console.log(errors);
                            }else{
                                k++;
                                link_channel_to_grid_sub(k,array);
                            }
                        });
                    }
                }else{
                    k++;
                    link_channel_to_grid_sub(k,array);
                }

            }

        });

        // "org_code_desc" : "88000137"
    }else{
        return ;

    }


}


function update_grid__main(){

    let sql="select DISTINCT a.grid_coding,a.grid_name from salesperson_info a";
    mysql_pool_bpm.query(sql,function(error,result){
        if(error){
            console.log(error);
        }else{
            console.log(result);
            update_grid_sub(0,result);
        }
    });
}

function update_grid_sub(k,array){
    if(array&&array.length>k){
        console.log("wsssssssssssssssssssssssssssssssssssssss");
        var grid=array[k];
        console.log(grid);
        var map={};
        map.org_code_desc=grid.grid_coding;// : String,// 机构编号
        map.org_name=grid.grid_name;// : String,// 机构名
        map.org_fullname=grid.grid_name;// : String,// 机构全名
        map.company_code="";// : String,// 公司编号
        map.level=5;//:String,//层级
        map.org_order="";// : Number,// 排序号
        map.org_type="网格";// : String,// 机构类型
        map.org_pid="";// : String,// 机构父节点
        map.company_no="";//:String,//empid
        map.parentcode_desc="";// : String,// 机构父节点描述
        map.org_status=1;// : Number,// 机构状态
        map.org_belong=0;// : String,// 属于
        map.midifytime=new Date();// : Date,// 修改时间
        map.org_code="";// : String,// 机构编号
        map.childCount="";// : Number,// 子机构数
        map.smart_visual_sys_org_id="";//:String,//慧眼系统的org_id
        map.athena_sys_org_id="";//:String=//,//Athena系统的org_id
        map.athena_app_sys_org_id="";//:String,//Athena_app系统的org_id
        map.inspect_sys_org_id="";//:String,//稽查系统的org_id

        model_user.$CommonCoreOrg.find({"org_code_desc":grid.grid_coding},function(error,result){
            if(error){
                console.log(error);
            }else{
                if(result.length>0){
                    k++;
                    update_grid_sub(k,array );
                }else{
                    model_user.$CommonCoreOrg.create(map,function(err,res){
                        if(err){
                            console.log(err);
                        }else{
                            k++;
                            update_grid_sub(k,array);
                        }
                    });

                }

            }

        });

    }else{
        return ;
    }


}


function link_user_channel_org_main(){
    model_user.$User.find({},function(error,result){
        if(error){
            console.log(error);
        }else{
            link_user_channel_org_sub(0,result);
        }
    });
}

function link_user_channel_org_sub(k,array){
    if(array&&array.length>k){
        var user=array[k];
        var user_name=user.user_name;
        var user_org=user.user_org;
        var user_no=user.user_no;
        // var param=[];
        // param.push(user_name);


        let sql="select * from salesperson_info where 1=1 and salesperson_name=? and salesperson_id=? ";
        console.log(sql,[user_name,user_no]);

        mysql_pool_bpm.query(sql,[user_name,user_no],function(err,res){
            if(err){
                console.log(err);
            }else{
                // console.log("ssssssssssssssssssssssssssssss");
                if(res.length>0){
                    var channel_id=res[0].channel_id;
                    var channel_name=res[0].channel_name;

                    model_user.$CommonCoreOrg.find({"org_code_desc":channel_id,"org_name":channel_name},function(error,result){
                        if(error){
                            console.log(error);
                        }else{
                            if(result.length>0){
                                var org_id=result[0]._id;
                                var flag=false;
                                for(var i in user_org){
                                    var org=user_org[i];
                                    if(org==org_id){
                                        flag=true;
                                    }
                                }

                                if(flag){
                                    //有的 时候 不用更新
                                    k++;
                                    link_user_channel_org_sub(k,array);

                                }else{
                                    //没有 直接 新增进去
                                    user_org.push(org_id);
                                    model_user.$User.update({"_id":user._id},{$set:{"user_org":user_org}},{},function(errors,results){
                                        if(errors){
                                            console.log(errors);

                                        }else{
                                            k++;
                                            link_user_channel_org_sub(k,array);
                                        }
                                    });

                                }
                            }else{
                                k++;
                                link_user_channel_org_sub(k,array);
                            }
                        }
                    });

                }else{
                    k++;
                    link_user_channel_org_sub(k,array);
                }
            }
        });

    }else{
        return ;

    }
}

function create_org_channel_main(){
    return new Promise(function(resolve,reject){
        let sql="select distinct a.channel_id ,a.channel_name from salesperson_info a";
        mysql_pool_bpm.query(sql,function(err,res){
            if(err){
                console.log(err);
            }else{
                console.log(res);
                create_org_channel_sub(0,res,resolve);
            }
        });

        // model_user.$CommonCoreOrg.find({},function(err,res){
        //     if(err){
        //         console.log(err);
        //     }else{
        //         create_org_sub(0,res,resolve);
        //
        //     }
        // });
        // let sql="select * from salesperson_info";
        // mysql_pool_bpm.query(sql,function(error,result){
        //     if(error){
        //         console.log(error);
        //         resolve({"data":null,"error":error,"msg":"链接数据库 能靠谱点么》？？"});
        //     }else{
        //         // console.log(result);
        //         create_org_sub(0,result,resolve);
        //         // update_sales_for_athena_app_sub(0,result,resolve);
        //     }
        // });

    });
}


function create_org_channel_sub(k,array,resolve){
    if(array&&array.length>k){
        var chanel=array[k];
        var map={};
        map.org_code_desc=chanel.channel_id;// : String,// 机构编号
        map.org_name=chanel.channel_name;// : String,// 机构名
        map.org_fullname=chanel.channel_name;// : String,// 机构全名
        map.company_code="";// : String,// 公司编号
        map.level=6;//:String,//层级
        map.org_order="";// : Number,// 排序号
        map.org_type="渠道/营业厅";// : String,// 机构类型
        map.org_pid="";// : String,// 机构父节点
        map.company_no="";//:String,//empid
        map.parentcode_desc="";// : String,// 机构父节点描述
        map.org_status=1;// : Number,// 机构状态
        map.org_belong=0;// : String,// 属于
        map.midifytime=new Date();// : Date,// 修改时间
        map.org_code="";// : String,// 机构编号
        map.childCount="";// : Number,// 子机构数
        map.smart_visual_sys_org_id="";//:String,//慧眼系统的org_id
        map.athena_sys_org_id="";//:String=//,//Athena系统的org_id
        map.athena_app_sys_org_id="";//:String,//Athena_app系统的org_id
        map.inspect_sys_org_id="";//:String,//稽查系统的org_id

        model_user.$CommonCoreOrg.find({"org_code_desc":chanel.channel_id},function(error,result){
            if(error){
                console.log(error);
            }else{
                if(result.length>0){
                    k++;
                    create_org_channel_sub(k,array,resolve);

                }else{
                    model_user.$CommonCoreOrg.create(map,function(err,res){
                        if(err){
                            console.log(err);
                        }else{
                            k++;
                            create_org_channel_sub(k,array,resolve);
                        }
                    });

                }

            }

        });




        // var user=array[k];
        // // console.log(user);
        // var org_type=user.org_type;
        // var org_fullname=user.org_name;
        //
        //
        // if(org_type=="分公司"){
        //     console.log(org_fullname);
        //     var map={};
        //     // var str="232423";
        //     map.org_fullname=org_fullname.substr(0,org_fullname.indexOf("分公司"))+"市";
        //     // console.log(map);
        //     if(map.org_fullname){
        //         // console.log(map);
        //         model_user.$CommonCoreOrg.update({"_id":user._id},{$set:map},{},function(err,res){
        //             if(err){
        //                 console.log(err);
        //             }else{
        //                 k++;
        //                 create_org_sub(k,array,resolve);
        //             }
        //         });
        //     }else{
        //         k++;
        //         create_org_sub(k,array,resolve);
        //     }
        // }else if(org_type=="县公司"){
        //     console.log(org_fullname);
        //     var map={};
        //     map.org_fullname=org_fullname.substr(0,org_fullname.indexOf("公司"))+"县";
        //     if(map.org_fullname){
        //         // console.log(map);
        //         model_user.$CommonCoreOrg.update({"_id":user._id},{$set:map},{},function(err,res){
        //             if(err){
        //                 console.log(err);
        //             }else{
        //                 k++;
        //                 create_org_sub(k,array,resolve);
        //             }
        //         });
        //     }else{
        //         k++;
        //         create_org_sub(k,array,resolve);
        //     }
        //
        // }else{
        //     k++;
        //     create_org_sub(k,array,resolve);
        // }

        // var user_name=user.salesperson_name;
        // var district_name=user.district_name;
        // var city_name=user.city_name+"分公司";
        // var
        // model_user.$CommonCoreOrg.find({org_name})
        // model_user.$User.find({"user_name":user_name},function(err,res){
        //
        //     if(err){
        //         console.log(err);
        //     }else{
        //         console.log(res);
        //     }
        // });
        // var city_name=user.city_name;
        // var district_name=user.district_name;
        // model_user.$CommonCoreOrg.find({},function(err,res){
        //     if(err){
        //         console.log(err);
        //         resolve({"data":null,"error":err,"msg":"errorrorororor r"});
        //     }else{
        //
        //
        //
        //
        //     }
        // });



    }else{
        // resolve({"data":null,"error":null,"msg":"卧槽 开工啦 结束了啦"});
        return ;
    }
}


// delect_user_main();
// model_user.$User.remove({"user_name":null,"user_no":null,"login_account":null,"user_status":null},function(err,res){
//    if(err){
//        console.log(err);
//    } else{
//        console.log(res);
//
//    }
//
// });
// update_sales_for_athena_app_main();
function delect_user_main(){
    return new Promise(function(resolve,reject){

        model_user.$User.find({},function(err,res){
           if(err){
               console.log(err);
           }else{
               delect_user_sub(0,res,resolve);

           }
        });
    });
}


function delect_user_sub(k,array,resolve){
    if(array&&array.length>k){
        var user=array[k];
        // console.log(user);
        var user_name=user.user_name;
        var user_no=user.user_no;
        model_user.$User.find({"user_name":user_name,"user_no":user_no},function(err,res){
           if(err){
               console.log(err);
               resolve({"data":null,"error":error,"msg":"这里这里  zheli   错了"});
           } else{
                if(res.length>1){
                    var _id=res[0]._id;
                    model_user.$User.remove({"_id":_id},function(error,result){
                        if(error){
                            console.log(error);
                            resolve({"data":null,"error":error,"msg":"这里这里  错了"});
                        }else{
                            k++;
                            delect_user_sub(k,array,resolve);
                        }
                    });

                }else{
                    k++;
                    delect_user_sub(k,array,resolve);
                }
           }

        });


    }else{
        resolve({"data":null,"error":null,"msg":"搞完了 ！"});
        return ;

    }
}
function update_sales_for_athena_app_main(){
    return new Promise(function(resolve,reject){
        let sql="select * from salesperson_info";
        mysql_pool_bpm.query(sql,function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"链接数据库 能靠谱点么》？？"});
            }else{
                console.log(result);
                update_sales_for_athena_app_sub(0,result,resolve);
            }
        });
    });
}

function update_sales_for_athena_app_sub(k,array,resolve){
    if(array&&array.length>k){
        var sale=array[k];
        var salesperson_tel=sale.salesperson_tel;
        var salesperson_name=sale.salesperson_name;
        var role_id="5a0e56b14f6a3d30801694a31";
        var map ={};
        map.login_account=sale.salesperson_tel;//sale.login_account;// : String,// 登录账号
        map.user_status=1;// : Number,// 用户状态
        map.user_id=sale.salesperson_id;//:String,//用户ID
        map.user_no=sale.salesperson_id;// : String,// 用户工号
        map.user_name=sale.salesperson_name;// : String,// 用户姓名
        map.user_gender="";//;// : String,// 用户性别
        map.user_phone=sale.salesperson_tel;// : String,// 用户手机
        map.user_tel=sale.salesperson_tel;// : String,// 用户联系电话
        map.user_email="";//sale.user_email;// : String,// 用户邮箱
        map.login_password="123456";//sale.login_password;// : String,// 登录密码
        map.user_org="";//sale.user_org;// : {type: Schema.Types.ObjectId, ref: 'CommonCoreOrg'},// 所在部门
        map.user_sys="";//sale.user_sys;// : String,// 所属系统
        map.user_org_desc="";//sale.user_org_desc;//:String,//所属系统的 描述
        map.theme_name="";//sale.theme_name;// : String,// 使用主题
        map.theme_skin="";// : String,// 使用皮肤
        map.user_photo="";// : String,// 用户头像/照片
        map.sys_roles=[];// : [{type: Schema.Types.ObjectId}],// 菜单访问权限使用角色
        map.user_roles=[role_id];//:[{type:Schema.Types.ObjectId}],//流程使用的角色
        map.boss_id="";//:String=""//对接外部系统专用的 Boss_id
        map.smart_visual_sys_user_id="";  //:String,//慧眼系统的 User_id
        map.athena_sys_user_id="";//:String=""///Athena系统的user_id
        map.athena_app_sys_user_id=sale.id;//"";//:String,//Athena_app系统的user_id
        map.inspect_sys_user_id="";//:String,//稽查系统的user_id
        map.token="";//String//不知道是什么东西，留着吧
        map.special_sign="";//:String,//也不知道是什么东西 留着把

        model_user.$User.find({"user_name":salesperson_name,"athena_app_sys_user_id":{$ne:null}},function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"这都错误  简直了"});
            }else{
                if(result.length>1){
                    //存放到异常数据数据库

                    sale.abnormal_type="数据异常";
                    model_user.$User_bak.create(sale,function(err,res){
                        console.log("1111111111111111111111111111111");
                        if(err){
                            console.log(err);
                            resolve({"data":null,"error":err,"msg":"我去他爹的 这还错"});
                        }else{
                            k++;
                            update_sales_for_athena_app_sub(k,array,resolve);
                        }
                    });
                }else{
                    //create
                    model_user.$User.create(map,function(err,res){
                        if(err){
                            console.log(err);
                            resolve({"data":null,"error":err,"msg":"卧槽 这都可以错  不科学"});
                        }else{
                            k++;
                            update_sales_for_athena_app_sub(k,array,resolve);
                        }
                    });
                }
            }
        });

    }else{

        resolve({"data":null,"error":null,"msg":"卧槽  终于 搞完了"});
        return ;

    }


}


function link_user_and_role_main(){
    return new Promise(function(resolve,reject){
        model_user.$User.find({},function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"角link org to user错误 2"});
            }else{
                link_user_and_role_sub(0,result,resolve);

            }
        });
    });
}
//

function link_user_and_role_sub(k,array,resolve){
    if(array&&array.length>k){
        var user=array[k];

        if(user){
            var roles=user.user_roles;
            new_model.$Role.find({"_id":{$in:roles}},function(error,result){
                if(error){
                    console.log(error);
                    resolve({"data":null,"error":error,"msg":"funcking   !!!!"});
                }else{
                    if(result.length>0){
                        var role_names=[];
                        for(var i in result){
                            var role=result[i];
                            role_names.push(role.role_name);
                        }

                        model_user.$Role.find({"role_name":{$in:role_names}},function(errors,results){
                            if(errors){
                                console.log(errors);
                                resolve({"data":null,"error":errors,"msg":"funcking   !!!!"});
                            } else{
                                if(results.length>0){
                                    let role_ids=[];
                                    for(var m in results){
                                        role_ids.push(results[m]._id);
                                    }
                                    console.log(role_ids);
                                    model_user.$User.update({"_id":user._id},{$set:{"user_roles":role_ids}},{},function(e,r){
                                        if(e){
                                            console.log(e);
                                            resolve({"data":null,"error":e,"msg":"funcking   !!!!"});
                                        }else{
                                            k++;
                                            link_user_and_role_sub(k,array,resolve);
                                        }
                                    });

                                }else{
                                    k++;
                                    link_user_and_role_sub(k,array,resolve);
                                }
                            }
                        });

                    }else{
                        k++;
                        link_user_and_role_sub(k,array,resolve);

                    }
                }
            });

        }else{
            k++;
            link_user_and_role_sub(k,array,resolve);
        }

    }else{
     resolve({"data":null,"error":null,"msg":"角link or 2"});
     return ;
    }
}


function link_user_and_org_main(){
    return new Promise(function(resolve,reject){
        model_user.$User.find({},function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"角link org to user错误 2"});
            }else{
                link_user_and_org_sub(0,result,resolve);
            }

        });
    });
}

function link_user_and_org_sub(k,array,resolve){
    if(array&&array.length>k){
        var user=array[k];
        var user_org=user.user_org;
        new_model.$CommonCoreOrg.find({"_id":user_org},function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"角link org to user错误 3"});
            }else{
                if(result.length>0){
                    var org_name=result[0].org_name;
                    model_user.$CommonCoreOrg.find({"org_name":org_name},function(errors,results){
                       if(errors){
                           console.log(errors);
                           resolve({"data":null,"error":errors,"msg":"角link org to user错误 4"});
                       }else{
                           if(results.length>0){
                               // var org_id=results[0]._id;
                               var map={};
                               map.user_org=results[0]._id;
                               model_user.$User.update({"_id":user._id},{$set:map},{},function(e,r){
                                   if(e){
                                       console.log(e);
                                       resolve({"data":null,"error":e,"msg":"角link org to user错误 5"});
                                   }else{
                                       k++;
                                       link_user_and_org_sub(k,array,resolve);
                                   }
                               });
                           }else{
                               k++;
                               link_user_and_org_sub(k,array,resolve);
                           }
                       }
                    });
                }else{
                    k++;
                    link_user_and_org_sub(k,array,resolve);
                }
            }
        });
    }else{
        resolve({"data":null,"error":null,"msg":"角link org to user is over"});
        return ;

    }

}

//
function update_user_main(){
    return new Promise(function(resolve,reject){
        new_model.$User.find({},function(error,result){
            if(error){
                console.log(error);
            }else{
                update_user_sub(0,result,resolve);
            }
        });
    });
}

function update_user_sub(k,array,resolve){
    if(array&&array.length>k){
        var user=array[k];
        var user_no=user.user_no;
        var map={};
         map.login_account=user.login_account;// : String,// 登录账号
         map.user_status=user.user_status;// : Number,// 用户状态
         map.user_id=user.user_id;//:String,//用户ID
         map.user_no=user.user_no;// : String,// 用户工号
         map.user_name=user.user_name;// : String,// 用户姓名
         map.user_gender=user.user_gender;// : String,// 用户性别
         map.user_phone=user.user_phone;// : String,// 用户手机
         map.user_tel=user.user_tel;// : String,// 用户联系电话
         map.user_email=user.user_email;// : String,// 用户邮箱
         map.login_password=user.login_password;// : String,// 登录密码
         map.user_org=user.user_org;// : {type: Schema.Types.ObjectId, ref: 'CommonCoreOrg'},// 所在部门
         map.user_sys=user.user_sys;// : String,// 所属系统
         map.user_org_desc=user.user_org_desc;//:String,//所属系统的 描述
         map.theme_name=user.theme_name;// : String,// 使用主题
         map.theme_skin=user.theme_skin;// : String,// 使用皮肤
         map.user_photo=user.user_photo;// : String,// 用户头像/照片
         map.sys_roles=user.user_roles;// : [{type: Schema.Types.ObjectId}],// 菜单访问权限使用角色
         map.user_roles=user.process_roles;//:[{type:Schema.Types.ObjectId}],//流程使用的角色
         map.boss_id="";//:String=""//对接外部系统专用的 Boss_id
         map.smart_visual_sys_user_id="";  //:String,//慧眼系统的 User_id
         map.athena_sys_user_id="";//:String=""///Athena系统的user_id
         map.athena_app_sys_user_id="";//:String,//Athena_app系统的user_id
         map.inspect_sys_user_id="";//:String,//稽查系统的user_id
         map.token="";//String//不知道是什么东西，留着吧
         map.special_sign="";//:String,//也不知道是什么东西 留着把

        model_user.$User.find({"user_no":user_no},function(error,result){
            if(error){
                console.log(error);
            }else{
                if(result.length>0){
                    //update
                    model_user.$User.update({"_id":result[0]._id},{$set:map},{},function(errors,results){
                        if(errors){
                            console.log(errors);
                            resolve({"data":null,"error":errors,"msg":"插入角色表错误 2"});
                        }else{
                            k++;
                            update_user_sub(k,array,resolve);
                        }


                    });
                }else{
                    //create
                    model_user.$User.create(map,function(errors,results){
                        if(errors){
                            console.log(errors);
                        }else{
                            k++;
                            update_user_sub(k,array,resolve);
                        }
                    });
                }

            }
        });

    }else{
        resolve({"data":null,"error":null,"msg":"game is over  ~~! 2"});
        return ;
    }


}

function update_role_main(){
    return new Promise(function(resolve,reject){
        new_model.$Role.find({},function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"查询角色表错误 "});
            }else{
                if(result.length>0){
                    // console.log(result);
                    update_role_sub(0,result,resolve);
                    // model_user.$Role.create(result,function(err,res){
                    //     if(err){
                    //         console.log(err);
                    //         resolve({"data":null,"error":err,"msg":"插入角色表错误 "});
                    //     }else{
                    //         resolve({"data":null,"error":null,"msg":"time is over "});
                    //     }
                    // });
                }
            }
        });
    });
}

function update_role_sub(k,array,resolve){
    if(array&&array.length>k){
        var role=array[k];
        var role_name=role.role_name;
        model_user.$Role.find({"role_name":role_name},function(error,result){
            if(error){
                console.log(error);
                resolve({"data":null,"error":error,"msg":"插入角色表错误1 "});
            }else{
                var map={};
                map.role_code=role.role_code;//: String,//角色编码
                map.role_name=role.role_name;//: String,//角色名称
                map.role_tag=role.role_tag;//: Number,//角色标志：1-内部，2-外部
                map.role_level=role.role_level;//: Number,//角色级别：1-省级，2-市级，3-县级
                map.role_status=role.role_status;//:Number,//状态：1-有效，2-停用
                map.role_remark=role.role_remark;//:String,//角色描述
                map.role_order= role.role_order;//: Number,//序号
                map.smart_visual_sys_role_id="";//:String,//慧眼系统的role_id
                map.athena_sys_role_id="";//:String=//,//Athena系统的role_id
                map.athena_app_sys_role_id="";//:String,//Athena_app系统的role_id
                map.inspect_sys_role_id="";//:String,//稽查系统的role_id
                if(result.length>0){
                    model_user.$Role.update({"_id":result[0]._id},{$set:map},{},function(errors,results){
                        if(error){
                            console.log(errors);
                            resolve({"data":null,"error":errors,"msg":"插入角色表错误 2"});
                        }else{
                            console.log(results);
                            k++;
                            update_role_sub(k,array,resolve);
                        }
                    });

                }else{
                    // delete role._id;
                    model_user.$Role.create(map,function(errors,results){
                        if(errors){
                            console.log(errors);
                            resolve({"data":null,"error":errors,"msg":"插入角色表错误3 "});
                        }else{
                            console.log(results);
                            k++;
                            update_role_sub(k,array,resolve);
                        }

                    });
                }
            }
        });
    }else{
        resolve({"data":null,"error":null,"msg":"time is over "});
        return ;

    }



}
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