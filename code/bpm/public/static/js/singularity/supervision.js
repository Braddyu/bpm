/**
 * Created by admin on 2016/9/18.
 */
var id = jQuery.getUrlParam('id');

$(document).ready(function () {
    listing_level();
    initPage();
    if (id != undefined) {
        $("#problem_attachment").attr('type', 'hidden');
        $("#submitinfo").attr("onclick", "toUpdata()");
        $("#subReset").remove();
        $("#submitinfo").html("<i class='fa fa-plus-square'></i>&nbsp;&nbsp;&nbsp;更&nbsp;&nbsp;新");

        setTimeout('toEdit()', 50);
    } else {
        $("#problem_description").val('');
        $("#distribution_level").combo('readonly', true);
        //$("#single_subject").attr('work_order_number', 'GZ-DB-' + new Date().format('yyyyMMdd-hhmmss'));
        //$("#div_distribution_object").hide();//隐藏标签
        //$("#div_distribution_object").show();//隐藏标签
    }

});


function initPage() {

    var org_unity = 'GS';
    // var url = basePath + '/api/supervision/supervision/initPages.do?org_unity=' + org_unity;
    var url = basePath + '/api/supervision/mongodb_supervision/mongoInitPages.do';
    $.getJSON(url, function (json) {
        /*用户名称*/
        $("#user_name").val(json.userInfo[0]);
        /*公司名称*/
        $("#org_name").val(json.userInfo[1]);
        /*联系电话*/
        $("#user_phone").val(json.userInfo[2]);

        /**/
        $("input[name='user']").attr("readOnly", true);

        /*责任公司*/
        $('#liability_company').combobox({
            data: json.data,
            editable: false,
            valueField: 'org_code',
            textField: 'org_fullname',
            /*设置是否多选*/
            multiple: false,
            required: true,
            formatter: function (row) {
                var opts = $(this).combobox('options');
                return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField];
            },
            /*派发级别*/
            onChange: function () {
                $('#div_distribution_object').hide();
                $("#distribution_level").combo('readonly', false);
                var dict_code = 'distribution_level';
                $("#distribution_level").combobox({
                    url: basePath + '/api/aptitude/org/org_station/findMaintainPro.do?dict_code=' + dict_code,
                    method: 'get',
                    editable: false,
                    valueField: 'field_value',
                    textField: 'field_name',
                    id: 'id',
                    /*设置是否多选*/
                    multiple: false,
                    required: true,
                    formatter: function (row) {
                        var opts = $(this).combobox('options');
                        return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField];
                    },
                    /*派发对象*/
                    onChange: function (valueField) {
                        //valueField   派发级别：level_GS--省级  level_WHZX--地市级  level_WHZ--区县级
                        var value = valueField.split('_')[1];
                        // var value= valueField.substr(6,valueField.length-1);
                        //value        派发级别：GS--省级        WHZX--地市级         WHZ--区县级
                        if (value != 'GS') {
                            $('#div_distribution_object').show();
                            var temp = $('#liability_company').combo('getValue');
                            var url = basePath + '/api/supervision/supervision/initPages.do?org_unity=' + value + '&temp=' + temp;
                            $.getJSON(url, function (json) {
                                $('#distribution_object').combobox({
                                    data: json.data,
                                    editable: false,
                                    valueField: 'id',
                                    textField: 'org_name',
                                    /*设置是否多选*/
                                    multiple: false,
                                    required: true,
                                    formatter: function (row) {
                                        var opts = $(this).combobox('options');
                                        return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField];
                                    },
                                });
                            });
                        } else {
                            $('#div_distribution_object').hide();
                            $('#distribution_object').combo('setValue', '');
                        }
                    }
                });
            }
        });
    });
}


function listing_level() {
    var dict_code = 'listing_level';
    $("#listing_level").combobox({
        url: basePath + '/api/aptitude/org/org_station/findMaintainPro.do?dict_code=' + dict_code,
        method: 'get',
        editable: false,
        valueField: 'field_value',
        textField: 'field_name',
        id: 'id',
        /*设置是否多选*/
        multiple: false,
        required: true,
        formatter: function (row) {
            var opts = $(this).combobox('options');
            return '<input type="checkbox" class="combobox-checkbox">'+ row[opts.valueField] +'-' + row[opts.textField];
        }
    })
}

function save() {
    if (validateDate()) {
        msgConfirm("确认保存数据？", function (result) {
            if (result) {
                $.ajaxFileUpload({
                    url: basePath + '/api/supervision/supervision/saveSupervision.do',
                    secureuri: false,
                    method: "post",
                    fileElementId: "problem_attachment",
                    data: {
                        user_name: $("#user_name").val(),
                        org_name: $("#org_name").val(),
                        user_phone: $("#user_phone").val(),
                        // single_class:$("#user_phone").textbox('getValue'),
                        // single_subject:$("#single_subject").textbox('getValue'),
                        single_class: $("#single_class").textbox('getValue'),
                        single_subject: $("#single_subject").textbox('getValue'),
                        job_acceptance_time: $("#job_acceptance_time").val(),
                        job_completion_time: $("#job_completion_time").val(),
                        liability_company: $("#liability_company").combo('getValue'),
                        distribution_level: $("#distribution_level").combo('getValue'),
                        /*三元符：派发级别为公司时 派发对象就是公司*/
                        distribution_object: $("#distribution_level").combo('getValue') == 'GS' ? $("#liability_company").combo('getValue') : $("#distribution_object").combo('getValue'),
                        /*挂牌等级*/
                        listing_level: $("#listing_level").combo('getValue'),
                        /*附件上传*/
                        //problem_attachment:$("#problem_attachment").val(),
                        problem_description: $("#problem_description").val(),
                        /*工单编号*/
                        //work_order_number:$("#work_order_number").attr('work_order_number'),
                        work_order_number: 'GZ-DB-' + new Date().format('yyyyMMdd-hhmmss'),
                    },
                    dataType: 'JSON',
                    success: function (data) {
                        //console.log(data);
                        var result = $.parseJSON(data.replace(/<.*?>/ig, ""));
                        if (result.success == true) {
                            msgSuccess(result.msg);
                            window.location.href = basePath + '/supervision';
                        } else {
                            msgError(result.msg);
                        }
                    }
                });
            }
        });
    }

}

/*表單驗證*/
function validateDate() {
    /*工单类别*/
    var single_class = $("#single_class").textbox('getValue');
    if (single_class == "") {
        msgeAlert_warn("请选择工单类别！");
        return false;
    }

    /*工单主题*/
    var single_subject = $("#single_subject").textbox('getValue');
    if (single_subject == "") {
        msgeAlert_warn("请输入工单主题！");
        return false;
    }

    /*工单受理时限*/
    var job_acceptance_time = $("#job_acceptance_time").val();
    if (job_acceptance_time == "") {
        msgeAlert_warn("请选择工单受理时限！");
        return false;
    }

    /*工单完成时限*/
    var job_completion_time = $("#job_completion_time").val();
    if (job_completion_time == "") {
        msgeAlert_warn("请选择工单完成时限！");
        return false;
    }

    /*责任公司*/
    var liability_company = $("#liability_company").combo('getValue');
    if (liability_company == "") {
        msgeAlert_warn("请选择责任公司！");
        return false;
    }
    /*派发级别*/
    var distribution_level = $("#distribution_level").combo('getValue');
    if (distribution_level == "") {
        msgeAlert_warn("请选择派发级别！");
        return false;
    }

    /*派发对象*/
    if (distribution_level != 'GS') {
        var distribution_object = $("#distribution_object").combo('getValue');
        if (distribution_object == "") {
            msgeAlert_warn("请选择派发对象！");
            return false;
        }
    }

    if (id == undefined) {
        /*问题附件*/
        var problem_attachment = $("#problem_attachment").val();
        //alert(problem_attachment);
        if (problem_attachment == "") {
            msgeAlert_warn("请选择上传问题附件！");
            return false;
        }
    }

    return true;
}

/* 根据ID秀修改详情------------------------------------------------------------------------*/
function toEdit() {
    $.ajax({
        url: basePath + '/api/supervision/supervision/findById.do',
        method: 'get',
        data: {id: id, type: 'edit'},
        success: function (result) {
            if (result.success == true) {
                var data = result.data[0];

                $("#liability_company").combobox('setValue', data.liability_company);
                $("#distribution_level").combo('setValue', data.distribution_level);

                $("#user_name").val(data.creator);
                $("#org_name").val(data.department);
                $("#user_phone").val(data.contact_number);

                $("#single_class").textbox('setValue', data.single_class);
                $("#single_subject").textbox('setValue', data.single_subject);

                $("#job_acceptance_time").val(data.job_completion_time);
                $("#job_completion_time").val(data.job_acceptance_time);

                /*附件上传*/
                $("#file_name").attr('href', basePath + '/' + data.file_path);
                $("#file_name").text(data.file_name);

                $("#problem_description").val(data.problem_description)
                /*工单编号*/
                $("#single_class").attr('work_order_number', data.work_order_number);

                //TODO 待回显
                $("#distribution_object").combobox('setValue', data.distribution_object);

            }
        }
    });
}
function toUpdata() {
    //alert('更新数据');
    if (validateDate()) {
        msgConfirm("确认保存数据？", function (result) {
            if (result) {
                $.ajax({
                    url: basePath + '/api/supervision/supervision/update.do',
                    method: "post",
                    data: {
                        id: id,
                        single_class: $("#single_class").textbox('getValue'),
                        single_subject: $("#single_subject").textbox('getValue'),
                        job_acceptance_time: $("#job_acceptance_time").val(),
                        job_completion_time: $("#job_completion_time").val(),
                        liability_company: $("#liability_company").combo('getValue'),
                        distribution_level: $("#distribution_level").combo('getValue'),
                        distribution_object: $("#distribution_object").combo('getValue'),
                        /*附件上传*/
                        //problem_attachment:$("#problem_attachment").val(),
                        problem_description: $("#problem_description").val(),
                    },
                    success: function (data) {
                        if (data.success == true) {
                            msgSuccess(data.msg);
                            window.location.href = basePath + '/supervision_info?id=' + id;
                        } else {
                            msgError(data.msg);
                        }
                    }
                });
            }
        });
    }
}

/*删除数据--将status(状态)字段修改为 0 */
function doDelete() {

    // 获得选择行
    var rows = $('#simpledatatable').datagrid('getChecked');
    if (rows.length == 0) {
        msgError('提示,请选择一条数据再进行删除');
        return false;
    }
    var id = ""
    for (var i = 0; i < rows.length; i++) {
        id += rows[i].id;
    }
    //id = id.substring(0, id.length - 1);
    // alert(id);
    msgConfirm('确定删除此条记录？', function (result) {
        if (result) {
            // 获取远程数据
            $.ajax({
                url: basePath + '/api/supervision/supervision/update.do',
                type: 'post',
                data: {id: id},
                success: function (data) {
                    if (data.success) {
                        msgSuccess('删除数据成功！');
                        doSearch();
                    }
                    else {
                        msgError('删除数据失败！' + ',错误代码:' + data.code);
                    }
                }
            });
        }
    });
}

function doReset() {
    $("#single_class").textbox('setValue', '');
    $("#single_subject").textbox('setValue', '');
    $("#job_acceptance_time").val('');
    $("#job_completion_time").val('');
    $("#liability_company").combobox('setValue', '');
    /*附件上传*/
    $("#problem_attachment").val('');
    $("#problem_description").val('');
}