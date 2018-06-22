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

function doSearch(){
    $('#dataTable').datagrid('reload', {
        'work_order_code': $('#work_order_code').val(),
        'work_order_name': $("#work_order_name").val(),
        'assess_category': $("#assess_category").combobox('getValue'),
        'assess_year': $('#assess_year').combobox('getValue'),
        'assess_month': $('#assess_month').combobox('getValue'),
        'profession': $('#profession').combobox('getValue'),
        'assess_level': $('#assess_level').combobox('getValue'),
        'city': $('#city').combobox('getValue'),
        'county': $('#county').combobox('getValue'),
        'company_id': $('#company_id').combobox('getValue')
        });
    /*$.ajax({
        url: basePath + '/api/assess_mgt/assess_task/assess_task_route/test',
        type: 'get',
        success: function (result) {
        }
    });*/
}

// 重置按钮事件
function doReset() {
    $('#work_order_code').textbox('setValue', '');
    $("#work_order_name").textbox('setValue', '');
    $("#assess_category").combobox('setValue', '');
    $('#assess_year').combobox('setValue', '');
    $('#assess_month').combobox('setValue', '');
    $('#profession').combobox('setValue', '');
    $('#assess_level').combobox('setValue', '');
    $('#city').combobox('setValue', '');
    $('#county').combobox('setValue', '');
    $('#company_id').combobox('setValue', '');
}

