//查询
function doSearch() {
    var search = $('#searchFrom').serializeJson();
    $('#simpledatatable').datagrid('reload',search);

}
// 重置按钮事件
function doReset(){
    $('#INT_ID').val('');
    $('#ZH_LABEL').val('');
    $('#COUNTY_ID').combobox('setValue','');
    $('#CITY_ID').combobox('setValue','');

    doSearch();
}
// 关闭窗口
function closeWindow(){
    $('#newWindow').window('close');
}
$(function(){getCities()});
// 获取所属地市
function getCities(){
    $('#CITY_ID').combobox({
        method: 'get',
        url: basePath+'/api/nt_resource/manage_resource_public_route/queryCity1',
        editable:false,
        valueField:'id',
        textField:'area_name',
        multiple:false,
        required:false,
        onLoadSuccess:function(){
            var data = $('#CITY_ID').combobox('getData');
            $("#CITY_ID ").combobox('setValue',data[1].id);
            getCountries(data[1].id)
        },
        onChange:function(){
            var city = $('#CITY_ID').combobox("getValues");
            getCountries(city);
        }
    });
}
// dishi获取所属区县
function  getCountries(cityPid){
    $('#COUNTY_ID').combobox({
        method: 'get',
        url: basePath+'/api/nt_resource/manage_resource_public_route/queryCounties1?pid='+cityPid,
        editable:false,
        valueField:'id',
        textField:'area_name',
        multiple:false,
        required:false,
        onLoadSuccess:function(){
            $("#COUNTY_ID").combobox('setValue',"");
        }
    });
}
function detail(v,r,i){
    var btn = "<a href=\"javascript:openWindow('详情');\">"+v+"</a>"
    return btn;
}
$(document).ready(function(){
    //初始化加载详情窗口
    intDetail();
    /*$('#simpledatatable').datagrid({
        onLoadSuccess:function(data){
            if (data.rows.length >0) {
                $('#simpledatatable').datagrid("selectRow", 0);
            }
        }
    });*/
});


//提示信息
function msgSuccess(msg) {
    Notify(msg, 'bottom-right', '5000', 'success', 'fa-check', true);
    function showUserMsg(r){
        var btn =  "<a style=\"color:red\" href=\"javascript:void(0);\" onclick=\"openWindow('访问次数详情'"
        btn += ",'{{projcfg.appurl}}/api/notice/notice_routes/accessNotUser?not_id="+ r.not_id+"')\">"+ r.nums+"</a>"
        return btn;
    }
}


//导出
function  doExport(rms){
    var int_id=$('#INT_ID').val();
    var zh_label=$('#ZH_LABEL').val();
    var county_id=$('#COUNTY_ID').combobox('getValue');
    var city_id=$('#CITY_ID').combobox('getValue');
    if(int_id||zh_label||county_id||city_id){
        window.location = basePath+"/api/nt_resource/resource_public_export_route/export?int_id="+int_id+"&zh_label="+zh_label+"&county_id="+county_id+"&city_id="+city_id+"&tables="+rms
    }else{
        alert('请选择要导出的条件！再导出！')
    }

}