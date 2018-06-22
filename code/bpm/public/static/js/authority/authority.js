/**
 * 用于判断按钮的显示与否，把要判断的按钮包含在action标签里面
 * 格式： <action shiroName="type:auth"></action>
 * 其中type为按钮的类别：menu：菜单类，put：put类，delete：delet类，post：post类，get：get类
 * auth：为权限编码；
 * 如格式：<action shiroName="post:addUser"></action>
 */
$(document).ready(function(){
    getRoleAction();
});

function getRoleAction(){
    var data = [];
    var num = 0;
    var flag = false;
    $('action').each(function(i,v){
        flag = false;
        for(var i=0;i<num;i++){
            if(data[i].shiroName==$(v).attr('shiroName')){
                flag = true;
                break;
            }
        }
        if(!flag){
            data.push({shiroName:$(v).attr('shiroName')});
            num++;
        }
    });
    if(num==0){
        return;
    }else{
        var resData = (num==1?data[0]:{shiros:JSON.stringify(data)});
    $.ajax({
        url:basePath+'/api/authority/route/shiroAuth?num='+num,
        type:'post',
        data:resData,
        dataType:'json',
        success:function(result){
            if(num==1){
                if(!result.auth){
                    $("action").each(function(i,v){
                        $(v).hide();
                    });
                }
            }else{
            for(var i=0;i<num;i++){
                var shiroName = result[i].shiroName;
                var flag = result[i].auth;
                $("action").each(function(i,v){
                    if($(v).attr('shiroName')==shiroName&&!flag){
                        $(v).hide();
                    }
                });
            }
            }
        },
        error:function(){//如果报错那就显示权限
        }
    });
    }
}