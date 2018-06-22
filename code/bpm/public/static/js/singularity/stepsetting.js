var base_id = jQuery.getUrlParam('base_id');

/* 启动页面直接加载的JQuery-------------------------------------------------------------- */
$(document).ready(function () {
    getExaminePro('aptitude_maintina_professional');
    if (base_id != undefined) {
        findAll();
    } else {
        /*基本信息数据模块*/
        $("#next_reset").attr('disabled', true);
        //$("#works_name").attr('base_code', 'BH' + new Date().format('yyyyMMddhhmmss'));
        $("#next_step").attr('onclick', 'nextSaveBasicInfo()');
        $("#next_reset").attr('onclick', 'reset()');
        $("#addStep").attr('onclick', 'prompt()');
    }
});

function findAll() {
    $.ajax({
        url: basePath + '/api/process_management/step_setting/findAll.do',
        method: "post",
        async: false,
        data: {base_id: base_id},
        success: function (data) {
            if (data.success == true) {

                var dateSteps = data.rows;
                var dateStep = dateSteps[0];

                var dataBase = data.total;
                var date = dataBase[0];

                if(dateSteps!=null){
                    dataBase = data.total;
                    date = dataBase[0];
                }

                /*基础信息部分*/
                $("#maintain_professional").combobox('setValue', date.base_major);
                $("#works_name").textbox('setValue', date.base_name);
                $("#works_code").textbox('setValue', date.base_code);
                $("#works_base_status").combobox('setValue', date.base_status);
                $("#works_remark").val(date.base_remark);

                //$("#works_heet_type").attr('base_type',date.base_type);
                $("#works_name").attr('base_id', date.base_id);

                var codes = date.base_type.split(",");
                $("#works_heet_type").combobox('setValues', codes);

                $(":input").attr('disabled', true);
                $(".easyui-combobox").combo('readonly', true);
                $("#next_reset").attr('disabled', false);
                $("#next_reset").attr('onclick', 'reset()');
                /*激活动态添加步骤按钮*/
                //addStep();
                $("#addStep").attr('onclick', 'addStep()');

                /*步骤部分*/
                if(dateSteps != null){
                    $.each(dateSteps, function (i, value) {
                        addStep();
                        /*附件上传*/
                        if(value.step_is_pic == 1){
                            $("#step_attachment_" + index).show();
                            $("#div_step_file_" + index).hide();
                            $("#file_name_"+ index).attr('href', basePath + '/' + value.file_path);
                            $("#file_name_"+ index).text(value.file_name);
                        }else {
                            $("#step_attachment_" + index).hide();
                        }
                        /*人员条件*/
                        $("#human_requirements_" + index).combobox('setValue',value.human_requirements);

                        $("#step_order_" + index).val(value.step_order);
                        $("#step_number_" + index).val(value.step_number);
                        $("#step_name_" + index).val(value.step_name);
                        // step_is_pic: $("#step_is_pic_" + index).is(':checked') ? 1 : 0,
                        // step_is_tude: $("#step_is_tude_" + index).is(':checked') ? 1 : 0,
                        value.step_is_pic == 1 ? $("#step_is_pic_" + index).attr("checked", true) : $("#step_is_pic_" + index).attr("checked", false);
                        $("#step_pic_num_" + index).val(value.step_pic_num);
                        value.step_is_tude == 1 ? $("#step_is_tude_" + index).attr("checked", true) : $("#step_is_tude_" + index).attr("checked", false);
                        value.step_is_sault_source == 1 ? $("#step_is_sault_source_" + index).attr("checked", true) : $("#step_is_sault_source_" + index).attr("checked", false);
                        value.step_is_standardized_reply == 1 ? $("#step_is_standardized_reply_" + index).attr("checked", true) : $("#step_is_standardized_reply_" + index).attr("checked", false);
                        value.step_is_arrive == 1 ? $("#step_is_arrive_" + index).attr("checked", true) : $("#step_is_arrive_" + index).attr("checked", false);
                        $("#step_remark_" + index).val(value.step_remark);
                        $("#step_represent_" + index).val(value.step_represent);

                        $("#step_name_" + index).attr('step_id', value.step_id);
                        $("#addStep").attr('onclick', 'addStep()');

                        /*添加时光轴*/
                        addTimeLine(index);
                        $("#saveStep_" + index).html('<i class="fa fa-edit"></i>&nbsp;&nbsp;修改');
                        $("#saveStep_" + index).attr('onclick', 'ediStep(' + index + ',' + value.step_order + ')');
                        if($("#step_is_pic_" + index).is(':checked')){
                            $("#div_step_pic_num_" + index).show();
                            $("#div_step_pic_attachment_" + index).show();
                        } else {
                            $("#div_step_pic_num_" + index).hide();
                            $("#div_step_pic_attachment_" + index).hide();
                        }

                        readOnlyStep(index, true);
                    });
                }
            } else {
                msgError(data.msg);
            }
        },
    });
}

/*获取集中稽核类别*/
function getExaminePro(dict_code) {
    $("#maintain_professional").combobox({
        //url: basePath+'/api/aptitude/org/org_station/findMaintainPro.do?dict_code=' + dict_code,
        url: basePath + '/api/process_management/step_setting/findMaintainPro.do?dict_code=' + dict_code,
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
            return '<input type="checkbox" class="combobox-checkbox">' + row[opts.valueField] + '-' + row[opts.textField];
        },
        onChange: function (valueField) {
            getWorkSheetType(valueField);
        }
    });
}

$("#works_heet_type").click(function () {
    $.messager.alert("温馨提示", "请先选择集中稽核类别！", "warning");
});

/*工单类型*/
function getWorkSheetType(value) {
    //$.messager.alert("提示",value,"info");
    $("#works_heet_type").combobox({
        url: basePath + '/api/process_management/step_setting/findWorkSheetType.do?field_parent_value=' + value,
        method: 'get',
        editable: false,
        valueField: 'field_value',
        textField: 'field_name',
        /*设置是否多选*/
        multiple: true,
        required: true,
        formatter: function (row) {
            var opts = $(this).combobox('options');
            return '<input type="checkbox" class="combobox-checkbox">' + row[opts.valueField] + '-' + row[opts.textField];
        },
    });
}

/*保存基础数据*/
function nextSaveBasicInfo() {
    if (validateDate()) {
        // if (true) {
        msgeConfirm("是否确定下一步？", function (result) {
            if (result) {
                $.ajax({
                    url: basePath + '/api/process_management/step_setting/saveBasicInfo.do',
                    method: "post",
                    data: {
                        base_major: $("#maintain_professional").combobox('getValues') + "",
                        base_type: $("#works_heet_type").combobox('getValues') + "",
                        base_name: $("#works_name").textbox('getValue'),
                        base_remark: $("#works_remark").val(),
                        base_code: $("#works_code").textbox('getValue')
                    },
                    success: function (data) {
                        if (data.success == true) {
                            $("#works_name").attr('base_id', data.base_id);
                            $(":input").attr('disabled', true);
                            $(".easyui-combobox").combo('readonly', true);
                            $("#next_reset").attr('disabled', false);
                            msgSuccess(data.msg);
                            /*激活动态添加步骤按钮*/
                            //addStep();
                            $("#addStep").attr('onclick', 'addStep()');

                        } else {
                            msgError(data.msg);
                        }
                    },
                });
            }
        });
    }
}

/*返回*/
function reset() {
    msgeConfirm("确定修改基本信息编辑？", function (result) {
        if (result) {
            /*激活提示需保存步骤按钮*/
            $("#addStep").attr('onclick', 'prompt()');
            $("#next_step").html('<i class="fa fa-level-down"></i>更&nbsp;&nbsp;新');
            $("#next_step").attr('onclick', 'nextUpdateBasicInfo()');

            $(":input").attr('disabled', false);
            $(".easyui-combobox").combo('readonly', false);
            $("#next_reset").attr('disabled', true);

            /*开启基础信息下拉框及更新按钮*/
            // $("input[type='checkbox']").attr('disabled', true);
            $("button[name='step']").attr("disabled", true);


        }
    });
}

/*更新基础信息*/
function nextUpdateBasicInfo() {
    if (validateDate()) {
        msgeConfirm("是否更新基础信息？", function (result) {
            if (result) {
                $.ajax({
                    url: basePath + '/api/process_management/step_setting/updateBasicInfo.do',
                    method: "post",
                    data: {
                        base_id:base_id,
                        base_major: $("#maintain_professional").combobox('getValues') + "",
                        base_type: $("#works_heet_type").combobox('getValues') + "",
                        //base_name: $("#works_name").val(),
                        base_name: $("#works_name").textbox('getValue'),
                        base_remark: $("#works_remark").val(),
                        base_code: $("#works_code").textbox('getValue')//未知base_code
                    },
                    success: function (data) {
                        if (data.success == true) {
                            $(":input").attr('disabled', true);
                            $(".easyui-combobox").combo('readonly', true);
                            $("#next_reset").attr('disabled', false);
                            msgSuccess(data.msg);
                            /*激活动态添加步骤按钮*/
                            //addStep();
                            $("#addStep").attr('onclick', 'addStep()');
                            $("button[name='step']").attr("disabled", false);
                        } else {
                            msgError(data.msg);
                        }
                    }
                });
            }
        });
    }
}

/*基础数据表单验证*/
function validateDate() {
    var maintain_professional = $("#maintain_professional").combobox('getValues') + "";
    if (maintain_professional == "") {
        msgeAlert_warn("请选择集中稽核类别！");
        return false;
    }

    var works_heet_type = $("#works_heet_type").combobox('getValues') + "";
    if (works_heet_type == "") {
        msgeAlert_warn("请选择工单类型！");
        return false;
    }

    //var works_name = $("#works_name").val();
    var works_name = $("#works_name").textbox('getValue');
    if (works_name == "") {
        msgeAlert_warn("请输入工单名称！");
        return false;
    }
    return true;
}

/**步骤模块后端JS*******************************************************************************************/

/*保存步骤并显示时光轴*/
/**
 * index:按钮操着
 * serial_number：序号提示
 * */
function saveStep(index, serial_number) {
    if (validateDateByStep(index, serial_number)) {
        // alert($("#step_attachment_" + index).val());
        msgeConfirm("是否保存步骤数据 ？", function (result) {
            if (result) {

                //图片上传的ajax
                var fileElemID = "step_attachment_"+index;
                $.ajaxFileUpload({
                    url: basePath + '/api/process_management/step_setting/saveStepInfo.do',
                    secureuri: true,
                    method: "post",
                    fileElementId:fileElemID,
                    data: {
                        index:index,
                        //step_id:$("#step_name_"+index).attr('step_id'),
                        step_base_id: $("#works_name").attr('base_id'),
                        step_name: $("#step_name_" + index).val(),
                        step_is_pic: $("#step_is_pic_" + index).is(':checked') ? 1 : 0,
                        step_pic_num: $("#step_pic_num_" + index).val(),
                        step_is_tude: $("#step_is_tude_" + index).is(':checked') ? 1 : 0,
                        step_is_sault_source: $("#step_is_sault_source_" + index).is(':checked') ? 1 : 0,
                        step_is_standardized_reply: $("#step_is_standardized_reply_" + index).is(':checked') ? 1 : 0,
                        step_is_arrive: $("#step_is_arrive_" + index).is(':checked') ? 1 : 0,
                        step_remark: $("#step_remark_" + index).val(),
                        step_represent: $("#step_represent_" + index).val(),
                        step_order: $("#step_order_" + index).val(),
                        step_number: $("#step_number_" + index).val(),
                        human_requirements:$("#human_requirements_"+index).combobox('getValue')
                        //step_form_layout:
                        //附件上传
                        // step_pic_attachment: $("#step_pic_attachment_" + index).val(),
                    },
                    dataType: 'JSON',
                    success: function (result) {
                        console.warn('result:',result);
                        var data = $.parseJSON(result.replace(/<.*?>/ig, ""));
                        if (data.success == true) {
                            msgSuccess(data.msg);

                            $("#step_name_" + index).attr('step_id', data.step_id);
                            $("#addStep").attr('onclick', 'addStep()');

                            // /*附件上传*/
                            $("#div_step_file_" + index).hide();
                            $("#file_name_"+ index).attr('href', basePath + '/' + data.filePath);
                            $("#file_name_"+ index).text(data.fileName);


                            /*添加时光轴*/
                            addTimeLine(index);
                            $("#saveStep_" + index).html('<i class="fa fa-edit"></i>&nbsp;&nbsp;修改');
                            $("#saveStep_" + index).attr('onclick', 'ediStep(' + index + ',' + serial_number + ')');

                            readOnlyStep(index, true);
                        } else {
                            msgError(data.msg);
                        }
                    }
                });
            }
        });

    }
}


/*跳转表单设置*/
function toDesignForm(index, obj) {
    var step_id = $("#step_name_" + index).attr("step_id");
    var base_id = $("#works_name").attr("base_id");
    window.location.href = basePath + '/form_design?base_id=' + base_id + '&step_id=' + step_id;
}

/*步骤数据动态删除*/
function deleteStep(index, serial_number) {
    var step_id = $("#step_name_" + index).attr('step_id');
    msgeConfirm("是否删除步骤序号：" + serial_number + " ？", function (result) {
        if (result) {
            if (step_id != undefined) {
                $.ajax({
                    url: basePath + '/api/process_management/step_setting/updateStepInfo.do',
                    method: "post",
                    data: {
                        step_id: step_id,
                        step_order: $("#step_order_" + index).val(),
                    },
                    success: function (data) {
                        if (data.success == true) {
                            msgSuccess(data.delMsg);
                            $("#stepBox_" + index).remove();
                            $("#stepLine_" + index).remove();

                            /*控制提示*/
                            $("#addStep").attr('onclick', 'addStep()');
                        } else {
                            msgError(data.delMsg);
                        }
                    }
                });
            } else {

                $("#stepBox_" + index).remove();
                $("#stepLine_" + index).remove();
                msgSuccess("删除步骤 " + serial_number + " 信息数据成功！");
                /*控制提示*/
                $("#addStep").attr('onclick', 'addStep()');
            }
        }
    });
}

function ediStep(index, serial_number) {
    msgeConfirm("是否修改步骤序号：" + serial_number + " ？", function (result) {
        if (result) {
            $("input[id$='index']").attr('readOnly', false);
            $("#saveStep_" + index).html('<i class="fa fa-recycle"></i>&nbsp;&nbsp;更新');
            $("#saveStep_" + index).attr('onclick', 'nextUpdateStep(' + index + ',' + serial_number + ')');

            // $("#delStep_" + index).attr('disabled',true);
            readOnlyStep(index, false);

            $("#addStep").attr('onclick', 'prompt(' + index + ',1)');
        }
    });
}

/*更新步骤信息*/
function nextUpdateStep(index, serial_number) {
    if (validateDateByStep(index, serial_number)) {
        //msgeConfirm("是否更新步骤序号：" + serial_number + " ？", function (result) {
            if (true) {
                $.ajax({
                    url: basePath + '/api/process_management/step_setting/updateStepInfo.do',
                    method: "post",
                    data: {
                        step_id: $("#step_name_" + index).attr('step_id'),
                        step_name: $("#step_name_" + index).val(),
                        step_is_pic: $("#step_is_pic_" + index).is(':checked') ? 1 : 0,
                        step_pic_num: $("#step_pic_num_" + index).val(),
                        step_is_tude: $("#step_is_tude_" + index).is(':checked') ? 1 : 0,
                        step_is_sault_source: $("#step_is_sault_source_" + index).is(':checked') ? 1 : 0,
                        step_is_standardized_reply: $("#step_is_standardized_reply_" + index).is(':checked') ? 1 : 0,
                        step_is_arrive: $("#step_is_arrive_" + index).is(':checked') ? 1 : 0,
                        step_remark: $("#step_remark_" + index).val(),
                        step_represent: $("#step_represent_" + index).val(),
                        step_order: $("#step_order_" + index).val(),
                        step_number: $("#step_number_" + index).val(),
                        human_requirements: $("#human_requirements_" + index).combobox('getValue')
                    },
                    success: function (data) {
                        if (data.success == true) {
                            msgSuccess(data.msg);
                            $("#addStep").attr('onclick', 'addStep()');
                            $("#saveStep_" + index).html('<i class="fa fa-edit"></i>&nbsp;&nbsp;修改');
                            $("#saveStep_" + index).attr('onclick', 'ediStep(' + index + ',' + serial_number + ')');

                            // $("#delStep_" + index).attr('disabled',false);
                            readOnlyStep(index, true);
                            /*修改时光轴数据显示*/
                            $("#lineTitle_" + index).text($("#step_order_" + index).val()+". " + $("#step_name_" + index).val());
                            $("#lineRepresent_" + index).text($("#step_represent_" + index).val());
                        } else {
                            msgError(data.msg);
                        }
                    }
                });
            }
        //});
    }
}

function readOnlyStep(index, isTrue) {
    $("#step_order_" + index).attr('readOnly', isTrue);
    $("#step_number_" + index).attr('readOnly', isTrue);
    $("#step_name_" + index).attr('readOnly', isTrue);
    $("#step_represent_" + index).attr('readOnly', isTrue);
    $("#step_is_pic_" + index).attr('disabled', isTrue);
    $("#step_pic_num_" + index).attr('disabled', isTrue);
    $("#step_is_tude_" + index).attr('disabled', isTrue);
    $("#step_is_sault_source_" + index).attr('disabled', isTrue);
    $("#step_is_standardized_reply_" + index).attr('disabled', isTrue);
    $("#step_is_arrive_" + index).attr('disabled', isTrue);
    $("#step_remark_" + index).attr('readOnly', isTrue);
    $("#human_requirements_" + index).combo('readonly', isTrue);;
}

/*动态步骤表单验证*/
function validateDateByStep(index, serial_number) {

    var reg = /^\d{1,2}$/;
    var step_order = $("#step_order_" + index).val();
    if (!reg.test(step_order)) {
        msgeAlert_warn("请输入步骤序号[ 规则为两位有效数字。如：01或者10 ]");
        //msgeAlert_warn("请输入步骤序号：" + serial_number + " 步骤编码为两位有效数字！[ 如：01或者10 ]");
        return false;
    }

    var step_number = $("#step_number_" + index).val();
    if (step_number == "") {
        msgeAlert_warn("请输入步骤编码！");
        //msgeAlert_warn("请输入步骤序号：" + serial_number + " 步骤编码！");
        return false;
    }

    var step_name = $("#step_name_" + index).val();
    if (step_name == "") {
        msgeAlert_warn("请输入步骤名称！");
        //msgeAlert_warn("请输入步骤序号：" + serial_number + " 步骤名称！");
        return false;
    }

    var step_represent = $("#step_represent_" + index).val();
    if (step_represent == "") {
        msgeAlert_warn("请输入步骤描述！");
        //msgeAlert_warn("请输入步骤序号：" + serial_number + " 步骤描述！");
        return false;
    }
    return true;
}