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

// 关闭窗口
function closeWindow(){
    $('#openWindow').window('close');
}
// 打开页面  带入区县
function openPage(title,type, value) {
    $('#openWindow').show();
    $('#openWindow').mydialog({
        title:title,
        width: 900,
        height: 500,
        top:100,
        modal: true,
        myButtons:[
            /*{
             text:'确定',
             btnCls:'btn btn-blue',
             handler:function(){
             closeWindow();
             }
             },*/
            {
                text:'关闭',
                btnCls:'btn btn-danger',
                handler:function(){
                    closeWindow();
                }
            }
        ]
    });
}