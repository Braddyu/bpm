/**
 * 组织机构共通js
 * zhaoqingna 2016-11-19
*/
// 组织层次编码
var orgUnity = ["0", "GS", "BSC", "WHZX", "WHZ", "ZD","ZDFZZ" , "ZDFZZZD"];
// 详情按钮事件
function toDetail(pramId,pramOrgUnity) {
    var id = "";
    var org_unity = "";
    // 获得选择行
    if (pramId != 1) {
        id = pramId;
        org_unity = pramOrgUnity;
    } else {
        var rows = $('#simpledatatable').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行操作');
            return false;
        }
        id = rows[0].id;
        org_unity = rows[0].org_unity;
    }

    var $update = $("#update");
    // 组织机构层次（GS-集中稽核公司，BSC-办事处，WHZX-维护中心，WHZ-维护站，ZD-驻点（维护组））
    if (org_unity == orgUnity[1]) {
        toCompanyInfo(id, org_unity);
    }
    if (org_unity == orgUnity[2]) {
        toOfficeInfo(id, org_unity);
    }
    if (org_unity == orgUnity[3]) {
        toCenterInfo(id, org_unity);
    }
    if (org_unity == orgUnity[4]) {
        toStationInfo(id, org_unity);
    }
    if (org_unity == orgUnity[5]) {
        toStagnationInfo(id, org_unity);
    }
    if (org_unity == orgUnity[6]) {
        toStagnationInfo(id, org_unity);
    }
    if (org_unity == orgUnity[7]) {
        toAuxiliaryInfo(id, org_unity);
    }
}
// 查看公司详情
function toCompanyInfo(org_pid, org_unity) {
    window.location.href = basePath + '/org_company_info?id=' + org_pid + '&org_unity=' + org_unity;
}
// 查看办事处详情
function toOfficeInfo(org_pid, org_unity) {
    window.location.href = basePath + '/org_office_info?id=' + org_pid + '&org_unity=' + org_unity;
}
// 查看维护中心详情
function toCenterInfo(org_pid, org_unity) {
    window.location.href = basePath + '/org_center_info?id=' + org_pid + '&org_unity=' + org_unity;
}
// 查看维护站详情
function toStationInfo(org_pid, org_unity) {
    window.location.href = basePath + '/org_station_info?id=' + org_pid + '&org_unity=' + org_unity + '&condition=details';
}
// 查看维护组详情
function toStagnationInfo(org_pid, org_unity) {
    window.location.href = basePath + '/org_stagnation_info?id=' + org_pid + '&org_unity=' + org_unity + '&condition=details';
}
// 查看辅助干线详情
function toAuxiliaryInfo(org_pid, org_unity) {
    window.location.href = basePath + '/org_auxiliary_info?id=' + org_pid + '&org_unity=' + org_unity + '&condition=details';
}
// 重置按钮事件
function doReset() {
    $('#org_code').val("");
    $("#org_name").val("");
    $("#city").combobox('setValue', '');
    $('#org_unity').combobox('setValue', '');
    $('#profession').combobox('setValue', '');
}

// 查询按钮事件
function doSearch() {
    $("#update").attr('disabled', 'disabled');
    $("#detail").attr('disabled', 'disabled');
    $("#delete").attr('disabled', 'disabled');
    $('#simpledatatable').datagrid('reload',
        {
            'org_code': $('#org_code').val(),
            'org_name': $("#org_name").val(),
            'belong_area': $("#city").combobox('getValue'),
            'org_unity': $('#org_unity').combobox('getValue'),
            'maintain_professional': $('#profession').combobox('getValue')
        }
    );
}

//集中稽核公司信息导出
function orgGSExport(){
    window.location = basePath + "/api/aptitude/org/org_excel/orgInfoExport";
}
//集中稽核公司及以下信息导出
function orgExport(){
    window.location = basePath + "/api/aptitude/org/org_excel/allOrgInfoExport";
}

function loopJsonArray(arr, temp) {
    var text = "";
    if (temp != null) {
        var dataArr = temp.split(",");
        for (var i in dataArr) {
            for (var j in arr) {
                if (arr[j].id == dataArr[i]) {
                    text += arr[j].text + ",";
                }
            }
        }
        return text.substring(0, text.length - 1);
    } else {
        return text;
    }
}