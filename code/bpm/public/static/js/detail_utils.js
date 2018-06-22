/*====================网络资源管理详情页面公用js====================*/
/*2016-10-24
 刘滔
 根据datagrid动态加载详情页面
 * */
var detailWinStr =''
    +'<label class="col-sm-2 control-label text-align-right">@key</label>'
    +'<div class="col-sm-4">'
    +'       <input class="easyui-validatebox form-control" readonly="readonly" value="@value" type="text" onmouseover="this.title=this.value">'
    +'</div>';
/*
 index:当前Header的索引
 flag:模板
 * */
function rtnStr(flag){
    var result='';
    //获取Header
    $('#simpledatatable').find("th").each(function(idx,val){
        if(idx>0){    //排除input按钮
            var str = detailWinStr;
            str = str.replace('@key',val.innerText);
            str = str.replace('@value',$(val).attr("data-options").match(/field:'(\S*)',width/)[1]);
            if(idx%2!=0){
                result+= ' <div class="form-group">'+str;
            }else{
                result+=str+'</div>';
            }
        }
    });
    return result;
}


function intDetail(){
    $('#newWindow').append(rtnStr(1));
}
/*/!*打开新的window*!/
function openWindow(title,event){
    console.info(event);
    //读取当前选中行的数据
    event = arguments[0]||window.event || event;
    var srcEle = event.target || event.srcElement;
    $('#newWindow').html(rtnStr(1));
    loadRow(srcEle);
    $('#newWindow').window({
        width:900,
        height:600,
        modal:true,
        title:title,
        top:100
        //href:url,
    }).css("display","");

}*/

function loadRow (ele){
    var rows = $('#simpledatatable').datagrid('getChecked')[0];
    $('#newWindow input').each(function(idx,input){
        var node = $('#newWindow input').get(idx);
        for(var i in rows){
            if(i==node.attributes['value'].nodeValue){
                node.attributes['value'].nodeValue = rows[i];
            }
        }
    });
}