

// 获取所属县区
function getCities(code){

    $('#city_id').combobox({
        method: 'get',
        url: basePath+'/api/nt_resource/manage_resource_public_route/queryCity?code='+code,
        editable:false,
        valueField:'id',
        textField:'area_name',
        multiple:false,
        required:false,
        onLoadSuccess:function(){
            var data = $('#city_id').combobox('getData');
            if(data!=null&&data!=''&&data!=undefined){
                if(data.length>0){
                    $("#city_id ").combobox('setValue',data[0].id);
                }
            }
            if(data.length!=0){
                getCounty(data[0].id,true)
            }else{
                getCounty(null,true)
            }
        },
        onSelect:function(){
            var city_id = $('#city_id').combobox("getValues");
            getCounty(city_id,false);
        }
    });
}
/*// 获取所属县区
function getCounty(city_id){
    $('#area_id').combobox({
        method: 'get',
        url:basePath+ '/api/nt_resource/manage_resource_public_route/queryCounty?city='+city_id,
        editable:false,
        valueField:'id',
        textField:'area_name',
        multiple:false,
        required:false,
        onLoadSuccess:function(){
            var data = $('#area_id').combobox('getData');
            if(data.length>0){
                $("#area_id ").combobox('setValue',data[0].id);
            }
        },

    });
}*/
// 打开页面  带入区县
function openPage(title,type, value,city,area,types, callback) {

    $('#budgetModel').show();

    $('#budgetModel').mydialog({
        title:title,
        width: 900,
        height: 300,
        top:100,
        modal: true,
        myButtons:[
            {
                text:'确定',
                btnCls:'btn btn-blue my_btn_class',
                handler:function(){
                    callback(value,city,area,types);
                    //点击一次后关闭该按钮
                    $(".my_btn_class").each(function(i,v){
                        $(v).attr("disabled","disabled");
                    })
                }
            },
            {
                text:'关闭',
                btnCls:'btn btn-danger',
                handler:function(){
                    closeDialog1();
                }
            }
        ]
    });
}
//双击打开修改页面

function toModify(codes,org_name, lineId, lineArea_id, city) {
    var city = city;
    var code = codes;
    // 获得选择行
    var rows = $('#simpledatatable').datagrid('getChecked');
    if (rows.length == 0) {
        msgError('提示,请选择一条数据再进行修改班组信息');
        return false;
    }
    var area;
    var area_ids;
    var ids;
    var type = "one";
    if (rows.length == 1) {
        ids = rows[0].id;
        city = rows[0].CITY_ID;
        area = rows[0].COUNTY_ID;
    } else {
        type = "much";
        ids = [];
        for (var i = 0; i < rows.length; i++) {
            area = rows[i].COUNTY_ID;
            if (i != 0) {
                area_ids = rows[i - 1].COUNTY_ID;
            }
            if (area_ids != area && i != 0) {
                alert('对不起你选择的设置维护班组的区县不在同一区县！');
                return false;
            }
            ids.push(rows[i].id);
            city = rows[i].CITY_ID;
        }
    }
    var id;
    if (lineId != undefined) {
        id = lineId;
    } else {
        id = ids;
    }
    var area_id;
    if (lineArea_id != undefined) {
        area_id = lineArea_id;
    } else {
        area_id = area;
    }
    ;
    $.ajax({
        url: basePath + '/api/nt_resource/manage_resource_public_route/getCompany?area_id=' + area_id + '&code=' + code,
        type: 'get',
        success: function (data) {
            if (data.success) {
                openPage("修改班组信息", "edit", id, city, area_id, type, callback);
                $("#org_company").textbox('setValue', data.GS[0].org_name);
                $("#WHZX").textbox('setValue', data.WHZX[0].org_name);
                $("#ZD").textbox('setValue', data.ZD[0].org_name);
            } else {
                alert('该地区类别下对应的维护班组不存在');
            }
        }
    })

    $("#org_code1").combotree({
        url: basePath + '/api/nt_resource/manage_resource_public_route/queryOrgInfo?code=' + code + '&area_id=' + area_id + "&city=" + city,
        method: 'get',
        valueField: 'id',
        textField: 'text',
        onLoadSuccess: function () {
            if (org_name != undefined && org_name != null && org_name != '' && org_name != 'null') {
                $("#org_code1").combotree('setValue', org_name)
            }
        },
        onClick:function (n) {
            var flag=$('#org_code1').tree('isLeaf',n.target);
            if(!flag){
                msgError( '只能选择班组！' );
                $("#org_code1").combotree('setValue', '')
            }else{
                if(n.org_unity!='ZDFZZ'){
                    $("#orgId").val(n.code)
                }else{
                    msgError( '只能选择班组！' );
                    $("#org_code1").combotree('setValue', '')
                }

            }
        }
    });
}

//=======================================  传输页面  =========================================
// 打开页面  带入区县
function openPage_tsm(title,type, value,city,area,types, callback) {

    $('#budgetModel').show();

    $('#budgetModel').mydialog({
        title:title,
        width: 900,
        height: 300,
        top:100,
        modal: true,
        myButtons:[
            {
                text:'确定',
                btnCls:'btn btn-blue my_btn_class',
                handler:function(){
                    callback(value,city,area,types);
                    //点击一次后关闭该按钮
                    $(".my_btn_class").each(function(i,v){
                        $(v).attr("disabled","disabled");
                    })
                }
            },
            {
                text:'关闭',
                btnCls:'btn btn-danger',
                handler:function(){
                    closeDialog1();
                }
            }
        ]
    });
}
//双击打开修改页面

function toModify_tsm(codes,org_name, lineId, lineArea_id, city) {
    $("#work_handover").attr('style','display:block');
    var val = $("#org_company_cs").val();
    if(val==0){
        $("#org_company_cs").click();
    }
    var city = city;
    var code = codes;
    // 获得选择行
    var rows = $('#simpledatatable').datagrid('getChecked');
    if (rows.length == 0) {
        msgError('提示,请选择一条数据再进行修改班组信息');
        return false;
    }
    var area;
    var area_ids;
    var ids;
    var type = "one";
    if (rows.length == 1) {
        ids = rows[0].id;
        city = rows[0].CITY_ID;
        area = rows[0].COUNTY_ID;
    } else {
        type = "much";
        ids = [];
        for (var i = 0; i < rows.length; i++) {
            area = rows[i].COUNTY_ID;
            if (i != 0) {
                area_ids = rows[i - 1].COUNTY_ID;
            }
            if (area_ids != area && i != 0) {
                alert('对不起你选择的设置维护班组的区县不在同一区县！');
                return false;
            }
            ids.push(rows[i].id);
            city = rows[i].CITY_ID;
        }
    }
    var id;
    if (lineId != undefined) {
        id = lineId;
    } else {
        id = ids;
    }
    var area_id;
    if (lineArea_id != undefined) {
        area_id = lineArea_id;
    } else {
        area_id = area;
    }
    ;
    $.ajax({
        url: basePath + '/api/nt_resource/manage_resource_public_route/getCompany?area_id=' + area_id + '&code=' + code,
        type: 'get',
        success: function (data) {
            if (data.success) {
                openPage("修改班组信息", "edit", id, city, area_id, type, callback);
                $("#org_company").textbox('setValue', data.GS[0].org_name);
                $("#WHZX").textbox('setValue', data.WHZX[0].org_name);
                $("#ZD").textbox('setValue', data.ZD[0].org_name);
            } else {
                alert('该地区类别下对应的维护班组不存在');
            }
        }
    })

    $("#org_code1").combotree({
        url: basePath + '/api/nt_resource/manage_resource_public_route/queryOrgInfo?code=' + code + '&area_id=' + area_id + "&city=" + city,
        method: 'get',
        valueField: 'id',
        textField: 'text',
       /* onLoadSuccess: function () {
            if (org_name != undefined && org_name != null && org_name != '' && org_name != 'null') {
                $("#org_code1").combotree('setValue', org_name)
            }
        },*/
        onClick:function (n) {
            var flag=$('#org_code1').tree('isLeaf',n.target);
            if(!flag){
                msgError( '只能选择班组！' );
                $("#org_code1").combotree('setValue', '')
            }else{
                if(n.org_unity!='ZDFZZ'){
                    $("#orgId").val(n.code)
                }else{
                    msgError( '只能选择班组！' );
                    $("#org_code1").combotree('setValue', '')
                }

            }
        }
    });
}
