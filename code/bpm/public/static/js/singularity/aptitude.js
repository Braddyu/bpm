/* 扩展Jquery,提供获取地址栏参数的方法------------------------------------------------------*/
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
})(jQuery);

/* 启动页面直接加载的JQuery-------------------------------------------------------------- */
var tempOrgId = $.getUrlParam("id");
var tempOrgPid = $.getUrlParam("org_pid");
var condition = $.getUrlParam("condition");
var tempOrgUnity = $.getUrlParam("org_unity");
var area = $.getUrlParam("area");
var dataMsg;
$(document).ready(function () {
    /*初始化上级数据*/
    initPage();
});

//预先查询新增信息的上级机构信息
function initPage() {
    $.ajax({
        url: basePath+"/api/aptitude/org/org_station/preOrgInfo.do",
        method: "get",
        data: {orgId: (condition == "modify") ? tempOrgPid : tempOrgId},
        success: function (data) {
            if (data.success == true) {
                var data = data.data;
                $("#belong_org_unity").val(data[0].org_name);
                $("#belong_org_unity").attr('data-value', data[0].org_unity);
                $("#belong_org_unity").attr('top-value', data[0].top_id);
                $("#belong_city").attr('area_code', data[0].belong_city);
                $("#date_orgcode").val(data[0].org_code);
                /*获取集中稽核类别*/
                showDW(data[0].maintain_professional);
                /*获取区域*/
                var subCode = (data[0].org_code.substr(0, 9));//截取org_code
                $.ajax({
                    url: basePath+'/api/aptitude/org/org_station/findArea.do',
                    method: 'post',
                    data: {
                        subCode: subCode,
                        belong_city: data[0].belong_city
                    },
                    success: function (result) {
                        if (result.success == true) {
                            var data =new Array();
                            $("#belong_area").combobox({
                                data:result.data,
                                editable: false,
                                valueField: 'id',
                                textField: 'area_name',
                                formatter: function (row) {
                                    var opts = $(this).combobox('options');
                                    return '<input type="checkbox" class="combobox-checkbox">' + row[opts.valueField] + '-' + row[opts.textField];
                                },
                                onLoadSuccess:function(){
                                    if(area!=undefined){
                                        $("#belong_area").combobox("setValue",area);
                                    }

                                },
                            });

                            $("#belong_city").val(result.dataCity[0].area_name);
                            /* 判断操作类型：新增 -- 修改 -- 详情 */
                            showChoice();
                        }
                    }
                });
            }
        }
    });
}

//集中稽核类别多项
function showDW(maintain_code) {
    var codes = maintain_code.split(",");
    var code = '';
    for (var k in codes) {
        if (k != codes.length - 1) {
            code += "'" + codes[k] + "',";
        } else {
            code += "'" + codes[k] + "'"
        }
    }
    var tip_text = {id:'',field_value:'',field_name:'请选择集中稽核类别'};
    $("#maintain_professional").combobox({
        url: basePath+'/api/aptitude/org/org_station/findMaintainPro.do?maintain=' + code + '&dict_code=aptitude_maintina_professional',
        reqParam:{tip_text:tip_text},
        method: 'get',
        editable: false,
        valueField: 'field_value',
        textField: 'field_name',
        multiple: true,
        formatter: function (row) {
            var opts = $(this).combobox('options');
            return '<input type="checkbox" class="combobox-checkbox">' + row[opts.valueField] + '-' + row[opts.textField];
        },
    });
}

/* 判断操作类型：新增 -- modify：修改 -- details：详情 */
function showChoice() {
    if (condition == "details" && condition != "") {
        findDetails();
    } else if (condition == "modify" && condition != "") {
        findDetails();
    } else {
        $("#org_remark").val("");
    }
}

/* 根据ID查詢详情------------------------------------------------------------------------*/
function findDetails() {
    $.ajax({
        url: basePath+'/api/aptitude/org/org_station/findById.do',
        method: 'get',
        data: {org_id: tempOrgId},
        success: function (data) {
            if (data.success == true) {
                var result = data.data;
                var p_data = data.p_data;
                $("#belong_org_unity").val(p_data[0].org_name);

                $("#belong_area").combobox('setValue', result[0].belong_area);


                /*获取集中稽核类别--判断下拉选项中是否有该值*/
                var dateOptions = $("#maintain_professional").combobox('getData');
                var maintain_professional = (result[0].maintain_professional).split(",");
                var newOpt = [];
                for(var k in dateOptions){
                    for(var m in maintain_professional){
                        if(dateOptions[k].field_value == maintain_professional[m]){
                            newOpt.push(maintain_professional[m]);
                        }
                   }
                }
                if(condition == "modify" ){
                    $("#org_malfunction").val(result[0].org_malfunction);
                    var org_auxiliary= result[0].org_unity=='ZDFZZ' ?  '2': "1";
                    $("#org_auxiliary").val(org_auxiliary);
                    $("#orgId").val(result[0].org_unity)

                }else{
                    var org_malfunction=  result[0].org_malfunction==1? '否':'是';
                    var org_auxiliary=  result[0].org_auxiliary==1? '维护班组':'辅助站';
                    $("#org_malfunction").val(org_malfunction);
                    $("#org_auxiliary").val(org_auxiliary);
                    $("#org_compay").val(result[0].org_compay);
                }

                console.log(newOpt);
                $("#maintain_professional").combobox('setValues', newOpt);
                $("#org_code").val(result[0].org_code);
                $("#org_name").val(result[0].org_name);
                $("#org_director").val(result[0].org_director);
                $("#fax").val(result[0].fax);
                $("#email").val(result[0].email);
                $("#link_phone").val(result[0].link_phone);
                $("#org_address").val(result[0].org_address);
                $("#org_remark").val(result[0].org_remark);

            }
        }
    });

}

/* 新增数据提交 ----------------------------------------------------------------------- */
function submitInfo() {
    var org_unity;
    var org_unity_name;
	var org_auxiliary=$("#org_auxiliary").val();
	if(org_auxiliary==2){
		    org_unity = "ZDFZZ";
            org_unity_name = "驻点";
	}else{
		    org_unity = "ZD";
            org_unity_name = "驻点";
	}
           


    /*$.messager.alert("操作温馨提示", "操作成功！","info");*/
    /*判断表单验证*/
    if (validateDate(org_unity_name, '1')) {
        var orgName = $("#org_name").val();
        var code=$("#org_code").val();
        var org_code=(code==undefined ||code.length<8)?  $("#date_orgcode").val():$("#org_code").val();
        $.ajax({
            url: basePath+"/api/aptitude/org/org_station/orgName.do",
            method: "post",
            data: {
                id:"",
                orgName:orgName,
                org_code:org_code ,
            },
            success: function (data) {
                if (data.success == true) {
                    if(data.data[0].total==0){
                        msgConfirm('确定保存数据？', function (result) {
                            if (result) {
                                $.ajax({
                                    url: basePath+"/api/aptitude/org/org_station/addOrgInfo.do",
                                    method: "post",
                                    data: {
                                        org_pid: tempOrgId,
                                        org_unity: org_unity,
                                        //所属城市和县区
                                        belong_city: $("#belong_city").attr("area_code"),
                                        belong_area: $("#belong_area").combobox('getValue'),
                                        org_malfunction:$("#org_malfunction").val(),
                                        belong_org_unity: $("#belong_org_unity").attr("data-value"),
                                        top_id: $("#belong_org_unity").attr("top-value"),
                                        maintain_professional: $("#maintain_professional").combobox('getValues') + "",
                                        org_director: $("#org_director").val(),
                                        fax: $("#fax").val(),
                                        email: $("#email").val(),
                                        link_phone: $("#link_phone").val(),
                                        org_code: $("#date_orgcode").val() + $("#org_code").val(),
                                        org_name: $("#org_name").val(),
                                        org_address: $("#org_address").val(),
                                        org_remark: $("#org_remark").val(),

                                    },
                                    success: function (data) {
                                        if (data.success == true) {
                                            msgSuccess(data.msg);
                                            window.location.href = basePath+'/org_change';
                                        } else {
                                            msgError(data.msg);
                                        }
                                    }
                                });
                            }
                        });
                    }else{
                        msgError('对不起该组织名称已经存在！请重新输入！');
                        return
                    }
                } else {
                    msgError(data.msg);
                    return
                }
            }
        });

    }
}




/* 更新数据提交 ----------------------------------------------------------------------- */
//维护站
function update() {
    if($("input[name='isSubmit']").val()=='false'){
        msgError(dataMsg);
        return;
    }
    var org_unity;
    var org_unity_name;
    var malfunction=$("#org_malfunction").val();
    var org_auxiliary=$("#org_auxiliary").val();
    if(org_auxiliary==2){
        org_unity = "ZDFZZ";
        org_unity_name = "辅助站";
    }else{
        org_unity = "ZD";
        org_unity_name = "驻点";
    }

    /*判断表单验证*/
    if (validateDate(org_unity_name,'2')) {
        var orgName = $("#org_name").val();
        var code=$("#org_code").val();
        var org_code=(code==undefined ||code.length<8)?  $("#date_orgcode").val():$("#org_code").val();
        $.ajax({
            url: basePath+"/api/aptitude/org/org_station/orgName.do",
            method: "post",
            data: {
                id:tempOrgId,
                orgName:orgName,
                org_code:org_code ,
            },
            success: function (data) {
                if (data.success == true) {
                    if(data.data[0].total==0){

                        msgConfirm('确定更改数据？', function (result) {
                            if (result) {
                                $.ajax({
                                    url: basePath+"/api/aptitude/org/org_station/updateOrgInfo.do",
                                    method: "post",
                                    data: {
                                        id: tempOrgId,
                                        //所属城市和县区
                                        belong_area: $("#belong_area").combobox('getValue'),
                                        maintain_professional: $("#maintain_professional").combobox('getValues') + "",
                                        org_director: $("#org_director").val(),
                                        fax: $("#fax").val(),
                                        email: $("#email").val(),
                                        link_phone: $("#link_phone").val(),
                                        org_name: $("#org_name").val(),
                                        org_address: $("#org_address").val(),
                                        org_remark: $("#org_remark").val(),
                                        org_malfunction:$("#org_malfunction").val(),
                                        org_unity:org_unity,
                                    },
                                    success: function (data) {
                                        if (data.success == true) {
                                            msgSuccess(data.msg);
                                            window.location.href = basePath+'/org_change';
                                        } else {
                                            msgError(data.msg);
                                        }
                                    }
                                })
                            }
                        });
                    }else{
                        msgError('对不起该组织名称已经存在！请重新输入！');
                        return;
                    }
                } else {
                    msgError(data.msg);
                    return;
                }
            }
        });

    }
}

/* org_code验证------------------------------------------------------------------*/
function validateCodes() {
    var orgcode = $("#date_orgcode").val() + $("#org_code").val();
    $.ajax({
        url: basePath+"/api/aptitude/org/org_company/validateCode",
        method: "post",
        data: {code: orgcode},
        success: function (data) {
            $("#org_code").attr("data-status", data);
            var org_code = $("#org_code").attr("data-status");
            var codevalidate = $("#org_code").val();
            var reg = /^\d{3}$/;
            if (!reg.test(codevalidate)) {
                $("#org_code_warn").css({color: 'red'});
                $("#org_code_warn").html("x");
                $.messager.alert("温馨提示", "机构编码为三位有效数字!", "warning");
                return false;
            }
            if (org_code == "false") {
                $("#org_code_warn").css({color: 'red'});
                $("#org_code_warn").html("x");
                $.messager.alert("温馨提示", "机构编码验证失败!", "warning");
                return false;
            }
            $("#org_code_warn").css({color: 'blue'});
            $("#org_code_warn").html("√");
        }
    });
}

/* name验证------------------------------------------------------------------*/
function validateNameAdd() {
    var orgName = $("#org_name").val();
    var code=$("#org_code").val();
    var org_code=(code==undefined ||code.length<8)?  $("#date_orgcode").val():$("#org_code").val();
    $.ajax({
        url: basePath+"/api/aptitude/org/org_station/orgName.do",
        method: "post",
        data: {
            id:"",
            orgName:orgName,
            org_code:org_code ,
        },
        success: function (data) {
            if (data.success == true) {
                if(data.data[0].total==0){
                    return;
                }else{
                    msgError('对不起该组织名称已经存在！请重新输入！');

                }
            } else {
                msgError(data.msg);
            }
        }
    });
}

function validateName() {
    var orgName = $("#org_name").val();
    var code=$("#org_code").val();
    var org_code=(code==undefined ||code.length<8)?  $("#date_orgcode").val():$("#org_code").val();
    $.ajax({
        url: basePath+"/api/aptitude/org/org_station/orgName.do",
        method: "post",
        data: {
            id:tempOrgId,
            orgName:orgName,
            org_code:org_code ,
        },
        success: function (data) {
            if (data.success == true) {
                if(data.data[0].total==0){
                    return;
                }else{
                    msgError('对不起该组织名称已经存在！请重新输入！');
                }
            } else {
                msgError(data.msg);
            }
        }
    });
}

/* 表单验证------------------------------------------------------------------*/
function validateDate(org_unity_name, flag) {
    var belong_area = $("#belong_area").combobox('getValue');
    if (belong_area == "") {
        $.messager.alert("温馨提示", "请选择所属县区!", "warning");
        return false;
    }

    var maintain_professional = $("#maintain_professional").combobox('getValues') + "";
    if (maintain_professional == "") {
        $.messager.alert("温馨提示", "请选择集中稽核类别！", "warning");
        return false;
    }

    var org_director = $("#org_director").val();
    if (org_director == "") {
        $.messager.alert("温馨提示", "负责人不能为空!", "warning");
        return false;
    }

    var reg_fax = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/;
    var fax = $("#fax").val();
    if (!reg_fax.test(fax)) {
        $.messager.alert("温馨提示", "请输入正确传真格式!", "warning");
        return false;
    }

    var reg_email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    var email = $("#email").val();
    if (!reg_email.test(email)) {
        $.messager.alert("温馨提示", "请输入正确邮箱地址格式!", "warning");
        return false;
    }

    var reg_phone = /^1[3|4|5|8]\d{9}$/;
    var link_phone = $("#link_phone").val();
    if (!reg_phone.test(link_phone)) {
        $.messager.alert("温馨提示", "请输入有效电话号码!", "warning");
        return false;
    }

    var org_name = $("#org_name").val();
    if (org_name == "") {
        $.messager.alert("温馨提示", org_unity_name + "名称不能为空!", "warning");
        return false;
    }

    var org_address = $("#org_address").val();
    if (org_address == "") {
        $.messager.alert("温馨提示", org_unity_name + "地址不能为空!", "warning");
        return false;
    }

    if(flag=='1'){
        var org_code = $("#org_code_warn").html();
        if (org_code === "x" || org_code == '') {
            $.messager.alert("温馨提示", "机构编码验证失败!", "warning");
            return false;
        }
    }

    var malfunction=$("#org_malfunction").val();
    var org_auxiliary=$("#org_auxiliary").val();
    if(malfunction==2&&org_auxiliary==2){
        $.messager.alert("温馨提示", "对不起传输故障干线班组与辅助站不能同时存在!", "warning");
        return false;
    }

    return true;
}

function doReset() {
    $("#belong_area").combobox("setValue", "");
    $("#maintain_professional").combobox('setValues',"");
    $("#org_director").val("");
    $("#fax").val("");
    $("#email").val("");
    $("#link_phone").val("");
    $("#org_code").val("");
    $("#org_name").val("");
    $("#org_address").val("");
    $("#org_remark").val("");
}

/* 维护组传输故障干线唯一确认------------------------------------------------------------------*/

function orgMalfunction(){
    var malfunction=$("#org_malfunction").val();
    var org_auxiliary=$("#org_auxiliary").val();
    var code=$("#org_code").val();
    if(malfunction==2&&org_auxiliary==2){
        msgError('对不起传输故障干线班组与辅助站不能同时存在！');
    }
    var org_code=(code==undefined ||code.length<8)?  $("#date_orgcode").val():$("#org_code").val();
    if(malfunction=='2'){
        $.ajax({
            url: basePath+"/api/aptitude/org/org_station/orgMalfunction.do",
            method: "post",
            data: {
                id:tempOrgId,
                org_malfunction:malfunction,
                org_code:org_code ,
            },
            success: function (data) {
                if (data.success == true) {
                    if(data.data[0].total==0){
                        return;
                    }else{
                        msgError('对不起该维护站下已经存在传输故障干线班组！');
                        $("#org_malfunction").val('1')

                    }
                } else {
                    msgError(data.msg);
                }
            }
        });
    }else{
        return;
    }
}

function orgAuxiliary() {
    var orgId=$("#orgId").val();
    var org_auxiliary=$("#org_auxiliary").val();
    var org_Id=(orgId=='ZDFZZ')?'2':'1';
    var code=$("#org_code").val();
    if(org_Id!=org_auxiliary){
        $.ajax({
            url: basePath+"/api/aptitude/org/org_station/orgAuxiliary",
            method: "post",
            data: {
                org_code:code ,
                org_unity:orgId,
                id:tempOrgId,
            },
            success: function (data) {
                if (data.success == false) {
                    $("input[name='isSubmit']").val(false);
                    msgError(data.msg);
                    dataMsg=data.msg;
                    return;
                } else {
                    $("input[name='isSubmit']").val(true);
                    return
                }
            }
        });
    }else{
        $("input[name='isSubmit']").val(true);
        return;
    }
}