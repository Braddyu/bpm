/**
 * 获取URL传过来的参数
 */
function UrlSearch() {
    var name,value;
    var str=location.href; //取得整个地址栏
    var num=str.indexOf("?")
    str=str.substr(num+1); //取得所有参数

    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        }
    }
}
var Request = new UrlSearch(); //实例化
var step_id = Request.step_id;
var  base_id = Request.base_id;

// 单行文本模板
var textTemplate =
    '<div class="field" id="field_{{index}}" onclick="fieldClickEvent(this, {{index}})">'+
        '<div class="field-actions">'+
            '<i class="fa fa-plus-circle copy" title="复制" id="copy_{{index}}"></i>'+
            '<i class="fa fa-minus-circle delete" title="删除" id="delete_{{index}}"></i>'+
        '</div>'+
        '<div class="control-group">'+
            '<label class="control-label"><span id="title_label_{{index}}">单行文字</span></label>'+
            '<div class="controls">'+
                '<input type="hidden" name="step_id" value="'+step_id+'">'+
                '<input type="hidden" name="field_title" value="单行文字" id="field_title_{{index}}">'+
                '<input type="text" name="field_default_value" value="" disabled="disabled" style="width:70%" id="field_default_value_{{index}}">'+
                '<input type="hidden" name="field_name" value="" id="field_name_{{index}}">'+
                '<input type="hidden" name="field_option_content" value="" id="field_option_{{index}}">'+
                '<input type="hidden" name="field_type" value="TextField" id="field_type_{{index}}">'+
                '<input type="hidden" name="field_sort" value="1" id="field_sort_{{index}}">'+
                '<input type="hidden" name="field_is_required" value="0" id="field_is_required_{{index}}">'+
                '<input type="hidden" name="field_is_read" value="0" id="field_is_read_{{index}}">'+
                '<input type="hidden" name="field_is_check" value="0" id="field_is_check_{{index}}">'+
                '<input type="hidden" name="field_reg_exp" value="" id="field_reg_exp_{{index}}">'+
                '<input type="hidden" name="field_least_character" value="" id="field_least_character_{{index}}">'+
                '<input type="hidden" name="field_more_character" value="" id="field_more_character_{{index}}">'+
                '<input type="hidden" name="field_option_type" value="" id="field_option_type_{{index}}">'+
                '<input type="hidden" name="field_option_value" value="" id="field_option_value_{{index}}">'+
                '<input type="hidden" name="field_remark" value="" id="field_remark_{{index}}">'+
            '</div>'+
        '</div>'+
    '</div>';

// 多行文本模板
var textAreaTemplate =
    '<div class="field" id="field_{{index}}" onclick="fieldClickEvent(this, {{index}})">'+
        '<div class="field-actions">'+
            '<i class="fa fa-plus-circle copy" title="复制" id="copy_{{index}}"></i>'+
            '<i class="fa fa-minus-circle delete" title="删除" id="delete_{{index}}"></i>'+
        '</div>'+
        '<div class="control-group">'+
            '<label class="control-label"><span id="title_label_{{index}}">多行文字</span></label>'+
            '<div class="controls">'+
                '<input type="hidden" name="step_id" value="'+step_id+'">'+
                '<input type="hidden" name="field_title" value="多行文字" id="field_title_{{index}}">'+
                '<textarea name="field_default_value" rows="3" disabled="disabled" style="width:70%" id="field_default_value_{{index}}"></textarea>'+
                '<input type="hidden" name="field_name" value="" id="field_name_{{index}}">'+
                '<input type="hidden" name="field_option_content" value="" id="field_option_{{index}}">'+
                '<input type="hidden" name="field_type" value="TextArea" id="field_type_{{index}}">'+
                '<input type="hidden" name="field_sort" value="1" id="field_sort_{{index}}">'+
                '<input type="hidden" name="field_is_required" value="0" id="field_is_required_{{index}}">'+
                '<input type="hidden" name="field_is_read" value="0" id="field_is_read_{{index}}">'+
                '<input type="hidden" name="field_is_check" value="0" id="field_is_check_{{index}}">'+
                '<input type="hidden" name="field_reg_exp" value="" id="field_reg_exp_{{index}}">'+
                '<input type="hidden" name="field_least_character" value="" id="field_least_character_{{index}}">'+
                '<input type="hidden" name="field_more_character" value="" id="field_more_character_{{index}}">'+
                '<input type="hidden" name="field_option_type" value="" id="field_option_type_{{index}}">'+
                '<input type="hidden" name="field_option_value" value="" id="field_option_value_{{index}}">'+
                '<input type="hidden" name="field_remark" value="" id="field_remark_{{index}}">'+
            '</div>'+
        '</div>'+
    '</div>';
//  单项选择模板
var radioBtnTemplate=
    '<div class="field" id="field_{{index}}" onclick="fieldClickEvent(this, {{index}})">'+
        '<div class="field-actions">'+
            '<i class="fa fa-plus-circle copy" title="复制" id="copy_{{index}}"></i>'+
            '<i class="fa fa-minus-circle delete" title="删除" id="delete_{{index}}"></i>'+
        '</div>'+
        '<div class="control-group">'+
            '<label class="control-label"><span id="title_label_{{index}}">单项选择</span></label>'+
                '<div class="controls">'+
                    '<div class="choices" id="choices_{{index}}">'+
                    '<label class="radio" id="choice_label_{{index}}_0"><input type="radio" value="选项值" disabled="disabled" id="radio_{{index}}_0"><span id="option_name_{{index}}_0">选项名</span></label>'+
                    '<label class="radio" id="choice_label_{{index}}_1"><input type="radio" value="选项值" disabled="disabled" id="radio_{{index}}_1"><span id="option_name_{{index}}_1">选项名</span></label>'+
                    '<label class="radio" id="choice_label_{{index}}_2"><input type="radio" value="选项值" disabled="disabled" id="radio_{{index}}_2"><span id="option_name_{{index}}_2">选项名</span></label>'+
                '</div>'+
                '<input type="hidden" name="step_id" value="'+step_id+'">'+
                '<input type="hidden" name="field_title" value="单项选择" id="field_title_{{index}}">'+
                '<input type="hidden" name="field_default_value" value="" id="field_default_value_{{index}}">'+
                '<input type="hidden" name="field_name" value="" id="field_name_{{index}}">'+
                '<input type="hidden" name="field_option_content" value="选项名,选项名,选项名" id="field_option_{{index}}">'+
                '<input type="hidden" name="field_type" value="RadioButton" id="field_type_{{index}}">'+
                '<input type="hidden" name="field_sort" value="1" id="field_sort_{{index}}">'+
                '<input type="hidden" name="field_is_required" value="0" id="field_is_required_{{index}}">'+
                '<input type="hidden" name="field_is_read" value="0" id="field_is_read_{{index}}">'+
                '<input type="hidden" name="field_is_check" value="0" id="field_is_check_{{index}}">'+
                '<input type="hidden" name="field_reg_exp" value="" id="field_reg_exp_{{index}}">'+
                '<input type="hidden" name="field_least_character" value="" id="field_least_character_{{index}}">'+
                '<input type="hidden" name="field_more_character" value="" id="field_more_character_{{index}}">'+
                '<input type="hidden" name="field_option_type" value="0" id="field_option_type_{{index}}">'+
                '<input type="hidden" name="field_option_value" value="选项值,选项值,选项值" id="field_option_value_{{index}}">'+
                '<input type="hidden" name="field_second_type" value="1" id="field_second_type_{{index}}">'+
                '<input type="hidden" name="field_second_value" value="0" id="field_second_value_{{index}}">'+
                '<input type="hidden" name="field_remark" value="" id="field_remark_{{index}}">'+
            '</div>'+
        '</div>'+
    '</div>' ;

// 多项选择模板
var checkBoxTemplate =
    '<div class="field" id="field_{{index}}" onclick="fieldClickEvent(this, {{index}})">'+
        '<div class="field-actions">'+
            '<i class="fa fa-plus-circle copy" title="复制" id="copy_{{index}}"></i>'+
            '<i class="fa fa-minus-circle delete" title="删除" id="delete_{{index}}"></i>'+
        '</div>'+
        '<div class="control-group">'+
            '<label class="control-label"><span id="title_label_{{index}}">多项选择</span></label>'+
            '<div class="controls">'+
                '<div class="choices" id="checks_{{index}}">'+
                    '<label class="checkbox" id="check_label_{{index}}_0"><input type="checkbox" value="选项值" disabled="disabled" id="check_{{index}}_0"><span id="check_name_{{index}}_0">选项名</span></label>'+
                    '<label class="checkbox" id="check_label_{{index}}_1"><input type="checkbox" value="选项值" disabled="disabled" id="check_{{index}}_1"><span id="check_name_{{index}}_1">选项名</span></label>'+
                    '<label class="checkbox" id="check_label_{{index}}_2"><input type="checkbox" value="选项值" disabled="disabled" id="check_{{index}}_2"><span id="check_name_{{index}}_2">选项名</span></label>'+
                '</div>'+
                '<input type="hidden" name="step_id" value="'+step_id+'">'+
                '<input type="hidden" name="field_title" value="多项选择" id="field_title_{{index}}">'+
                '<input type="hidden" name="field_default_value" value="" id="field_default_value_{{index}}">'+
                '<input type="hidden" name="field_name" value="" id="field_name_{{index}}">'+
                '<input type="hidden" name="field_option_content" value="选项名,选项名,选项名" id="field_option_{{index}}">'+
                '<input type="hidden" name="field_type" value="CheckBox" id="field_type_{{index}}">'+
                '<input type="hidden" name="field_sort" value="1" id="field_sort_{{index}}">'+
                '<input type="hidden" name="field_is_required" value="0" id="field_is_required_{{index}}">'+
                '<input type="hidden" name="field_is_read" value="0" id="field_is_read_{{index}}">'+
                '<input type="hidden" name="field_is_check" value="0" id="field_is_check_{{index}}">'+
                '<input type="hidden" name="field_reg_exp" value="" id="field_reg_exp_{{index}}">'+
                '<input type="hidden" name="field_least_character" value="" id="field_least_character_{{index}}">'+
                '<input type="hidden" name="field_more_character" value="" id="field_more_character_{{index}}">'+
                '<input type="hidden" name="field_option_type" value="0" id="field_option_type_{{index}}">'+
                '<input type="hidden" name="field_option_value" value="选项值,选项值,选项值" id="field_option_value_{{index}}">'+
                '<input type="hidden" name="field_remark" value="" id="field_remark_{{index}}">'+
            '</div>'+
        '</div>'+
    '</div>';

// 下拉框模板
var dropDownTemplate =
    '<div class="field" id="field_{{index}}" onclick="fieldClickEvent(this, {{index}})">'+
        '<div class="field-actions">'+
            '<i class="fa fa-plus-circle copy" title="复制" id="copy_{{index}}"></i>'+
            '<i class="fa fa-minus-circle delete" title="删除" id="delete_{{index}}"></i>'+
        '</div>'+
        '<div class="control-group">'+
            '<label class="control-label"><span id="title_label_{{index}}">下拉框</span></label>'+
            '<div class="controls">'+
                '<select class="choices" style="width:70%" disabled="disabled" id="select_{{index}}">' +
                    '<option value="">请选择</option>' +
                    '<option value="选项值" id="sel_option_{{index}}_0">选项名</option>' +
                    '<option value="选项值" id="sel_option_{{index}}_1">选项名</option>' +
                    '<option value="选项值" id="sel_option_{{index}}_2">选项名</option>' +
                '</select>'+
                '<input type="hidden" name="step_id" value="'+step_id+'">'+
                '<input type="hidden" name="field_title" value="下拉框" id="field_title_{{index}}">'+
                '<input type="hidden" name="field_default_value" value="" id="field_default_value_{{index}}">'+
                '<input type="hidden" name="field_name" value="" id="field_name_{{index}}">'+
                '<input type="hidden" name="field_option_content" value="选项名,选项名,选项名" id="field_option_{{index}}">'+
                '<input type="hidden" name="field_type" value="DropDown" id="field_type_{{index}}">'+
                '<input type="hidden" name="field_sort" value="1" id="field_sort_{{index}}">'+
                '<input type="hidden" name="field_is_required" value="0" id="field_is_required_{{index}}">'+
                '<input type="hidden" name="field_is_read" value="0" id="field_is_read_{{index}}">'+
                '<input type="hidden" name="field_is_check" value="0" id="field_is_check_{{index}}">'+
                '<input type="hidden" name="field_reg_exp" value="" id="field_reg_exp_{{index}}">'+
                '<input type="hidden" name="field_least_character" value="" id="field_least_character_{{index}}">'+
                '<input type="hidden" name="field_more_character" value="" id="field_more_character_{{index}}">'+
                '<input type="hidden" name="field_option_type" value="0" id="field_option_type_{{index}}">'+
                '<input type="hidden" name="field_option_value" value="选项值,选项值,选项值" id="field_option_value_{{index}}">'+
                '<input type="hidden" name="field_remark" value="" id="field_remark_{{index}}">'+
            '</div>'+
        '</div>'+
    '</div>';
// 数字模板
var numberTemplate=
    '<div class="field" id="field_{{index}}" onclick="fieldClickEvent(this, {{index}})">'+
        '<div class="field-actions">'+
            '<i class="fa fa-plus-circle copy" title="复制" id="copy_{{index}}"></i>'+
            '<i class="fa fa-minus-circle delete" title="删除" id="delete_{{index}}"></i>'+
        '</div>'+
        '<div class="control-group">'+
            '<label class="control-label"><span id="title_label_{{index}}">数字</span></label>'+
            '<div class="controls">'+
                '<input type="hidden" name="step_id" value="'+step_id+'">'+
                '<input type="hidden" name="field_title" value="数字" id="field_title_{{index}}">'+
                '<input type="text" name="field_default_value" value="" disabled="disabled" style="width:70%" id="field_default_value_{{index}}">'+
                '<input type="hidden" name="field_name" value="" id="field_name_{{index}}">'+
                '<input type="hidden" name="field_option_content" value="" id="field_option_{{index}}">'+
                '<input type="hidden" name="field_type" value="NumberField" id="field_type_{{index}}">'+
                '<input type="hidden" name="field_sort" value="1" id="field_sort_{{index}}">'+
                '<input type="hidden" name="field_is_required" value="0" id="field_is_required_{{index}}">'+
                '<input type="hidden" name="field_is_read" value="0" id="field_is_read_{{index}}">'+
                '<input type="hidden" name="field_is_check" value="0" id="field_is_check_{{index}}">'+
                '<input type="hidden" name="field_reg_exp" value="0" id="field_reg_exp_{{index}}">'+
                '<input type="hidden" name="field_least_character" value="" id="field_least_character_{{index}}">'+
                '<input type="hidden" name="field_more_character" value="" id="field_more_character_{{index}}">'+
                '<input type="hidden" name="field_option_type" value="" id="field_option_type_{{index}}">'+
                '<input type="hidden" name="field_option_value" value="" id="field_option_value_{{index}}">'+
                '<input type="hidden" name="field_remark" value="" id="field_remark_{{index}}">'+
            '</div>'+
        '</div>'+
    '</div>';
// 日期模板
var dateTemplate=
    '<div class="field" id="field_{{index}}" onclick="fieldClickEvent(this, {{index}})">'+
        '<div class="field-actions">'+
            '<i class="fa fa-plus-circle copy" title="复制" id="copy_{{index}}"></i>'+
            '<i class="fa fa-minus-circle delete" title="删除" id="delete_{{index}}"></i>'+
        '</div>'+
        '<div class="control-group">'+
            '<label class="control-label"><span id="title_label_{{index}}">日期</span></label>'+
            '<div class="controls">'+
                '<input type="hidden" name="step_id" value="'+step_id+'">'+
                '<input type="hidden" name="field_title" value="" id="field_title_{{index}}">'+
                '<div data-role="date">' +
                    '<input type="text" name="field_default_value" value="" disabled="disabled" style="width:70%" id="field_default_value_{{index}}">' +
                    '<span class="day_of_week"><i class="fa fa-calendar"></i></span></div>'+
                '</div>'+
                '<input type="hidden" name="field_name" value="日期" id="field_name_{{index}}">'+
                '<input type="hidden" name="field_option_content" value="" id="field_option_{{index}}">'+
                '<input type="hidden" name="field_type" value="DateField" id="field_type_{{index}}">'+
                '<input type="hidden" name="field_sort" value="1" id="field_sort_{{index}}">'+
                '<input type="hidden" name="field_is_required" value="0" id="field_is_required_{{index}}">'+
                '<input type="hidden" name="field_is_read" value="0" id="field_is_read_{{index}}">'+
                '<input type="hidden" name="field_is_check" value="0" id="field_is_check_{{index}}">'+
                '<input type="hidden" name="field_reg_exp" value="" id="field_reg_exp_{{index}}">'+
                '<input type="hidden" name="field_least_character" value="" id="field_least_character_{{index}}">'+
                '<input type="hidden" name="field_more_character" value="" id="field_more_character_{{index}}">'+
                '<input type="hidden" name="field_option_type" value="" id="field_option_type_{{index}}">'+
                '<input type="hidden" name="field_option_value" value="" id="field_option_value_{{index}}">'+
                '<input type="hidden" name="field_remark" value="" id="field_remark_{{index}}">'+
            '</div>'+
        '</div>'+
    '</div>';
// 电话模板
var telTemplate=
    '<div class="field" id="field_{{index}}" onclick="fieldClickEvent(this, {{index}})">'+
        '<div class="field-actions">'+
            '<i class="fa fa-plus-circle copy" title="复制" id="copy_{{index}}"></i>'+
            '<i class="fa fa-minus-circle delete" title="删除" id="delete_{{index}}"></i>'+
        '</div>'+
        '<div class="control-group">'+
            '<label class="control-label"><span id="title_label_{{index}}">电话</span></label>'+
            '<div class="controls">'+
                '<input type="hidden" name="step_id" value="'+step_id+'">'+
                '<input type="hidden" name="field_title" value="电话" id="field_title_{{index}}">'+
                '<input type="tel" name="field_default_value" value="" disabled="disabled" style="width:70%" id="field_default_value_{{index}}">'+
                '<input type="hidden" name="field_name" value="" id="field_name_{{index}}">'+
                '<input type="hidden" name="field_option_content" value="" id="field_option_{{index}}">'+
                '<input type="hidden" name="field_type" value="TelephoneField" id="field_type_{{index}}">'+
                '<input type="hidden" name="field_sort" value="1" id="field_sort_{{index}}">'+
                '<input type="hidden" name="field_is_required" value="0" id="field_is_required_{{index}}">'+
                '<input type="hidden" name="field_is_read" value="0" id="field_is_read_{{index}}">'+
                '<input type="hidden" name="field_is_check" value="0" id="field_is_check_{{index}}">'+
                '<input type="hidden" name="field_reg_exp" value="" id="field_reg_exp_{{index}}">'+
                '<input type="hidden" name="field_least_character" value="" id="field_least_character_{{index}}">'+
                '<input type="hidden" name="field_more_character" value="" id="field_more_character_{{index}}">'+
                '<input type="hidden" name="field_option_type" value="" id="field_option_type_{{index}}">'+
                '<input type="hidden" name="field_option_value" value="" id="field_option_value_{{index}}">'+
                '<input type="hidden" name="field_remark" value="" id="field_remark_{{index}}">'+
            '</div>'+
        '</div>'+
    '</div>';

// 单行文字设置模板
var textSetting =
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段标题   (<span class="err-msg" id="titleTip">必输项</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="单行文字" onblur="titleBlurEvent(this, {{index}})" id="label_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段名称   (<span class="err-msg" id="nameTip">由字母和下划线组成，且以字母开头</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="nameBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="name_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段默认值</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="defaultValBlurEvent(this, {{index}})" id="value_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">是否必填</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="required_{{index}}" /></div>'+
        '</div>'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">是否只读</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="read_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">最少填写字符</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="" style="width: 100px;height: 34px;" id="least_char_{{index}}" /></div>'+
        '</div>'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">最多填写字符</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="" style="width: 100px;height: 34px;" id="more_char_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">字段序号</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="1" style="width: 100px;height: 34px;" id="sort_{{index}}" /></div>'+
        '</div>'+
        '<div class="col-xs-6">' +
            '<label class="col-xs-12">是否验证</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="check_{{index}}" /></div>'+
        '</div>' +
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">验证公式</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="expBluerEvent(this, {{index}})" id="check_exp_{{index}}" /></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">备注</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="remarkBlurEvent(this, {{index}})" id="remark_{{index}}" /></div>'+
    '</div>';

// 多行文字设置模板
var textAreaSetting =
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段标题   (<span class="err-msg" id="titleTip">必输项</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="多行文字" onblur="titleBlurEvent(this, {{index}})" id="label_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段名称  (<span class="err-msg" id="nameTip">由字母和下划线组成，且以字母开头</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="nameBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="name_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段默认值</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="defaultValBlurEvent(this, {{index}})" id="value_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">' +
            '<label class="col-xs-12">是否必填</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="required_{{index}}" /></div>'+
        '</div>' +
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">字段序号</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="1" style="width: 100px;height: 34px;" id="sort_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">最少填写字符</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="" style="width: 100px;height: 34px;" id="least_char_{{index}}" /></div>'+
        '</div>'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">最多填写字符</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="" style="width: 100px;height: 34px;" id="more_char_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">备注</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="remarkBlurEvent(this, {{index}})" id="remark_{{index}}" /></div>'+
    '</div>';

// 单项选择设置模板
var radioBtnSetting =
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段标题   (<span class="err-msg" id="titleTip">必输项</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="单项选择" onblur="titleBlurEvent(this, {{index}})" id="label_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段名称   (<span class="err-msg" id="nameTip">由字母和下划线组成，且以字母开头</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="nameBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="name_set_{{index}}"></div>'+
    '</div>'+
    /*'<div class="field_setting">'+
        '<label class="col-xs-12">是否参与扣分</label>'+
        '<div class="col-xs-12">' +
            '<div class="col-xs-6"><label class="radio" style="margin:0;"><input type="radio" name="option_second" value="1" onclick="secondClickEvent(this, {{index}})"/><span>是</span></label></div>' +
            '<div class="col-xs-6"><label class="radio" style="margin:0;"><input type="radio" name="option_second" value="0" checked onclick="secondClickEvent(this, {{index}})"/><span>否</span></label></div>' +
        '</div>'+
    '</div>'+
    '<div class="field_setting" style="display:none">'+
        '<label class="col-xs-12">扣分基数   (<span class="err-msg" id="secondTip">由数字组成为整数，范围在1-100之间</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="secondBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="second_set_{{index}}"></div>'+
    '</div>'+*/
    '<div class="field_setting">'+
        '<label class="col-xs-12">选项值</label>'+
        '<div class="col-xs-12">' +
            '<div class="col-xs-6"><label class="radio" style="margin:0;"><input type="radio" name="option_value" value="0" onclick="radioValClickEvent(this, {{index}})" /><span>自定义</span></label></div>' +
            '<div class="col-xs-6"><label class="radio" style="margin:0;"><input type="radio" name="option_value" value="1" onclick="radioValClickEvent(this, {{index}})" /><span>数据字典取</span></label></div>' +
        '</div>'+
    '</div>'+
    '<div class="field_setting" id="dictSelBox" style="display:none;">'+
        '<div class="col-xs-12"><input class="easyui-combobox" style="width: 301px;height: 34px;" id="dictSelect" /></div>'+
    '</div>'+
    '<div class="field_setting" id="dictOptions" style="display:none;">'+
        '<label class="col-xs-12">选项</label>'+
        '<div class="col-xs-12"><ul class="choices-list" id="dict_potions_list"></ul></div>'+
    '</div>'+
    '<div class="field_setting" id="customOptions" style="display:none;">'+
        '<label class="col-xs-12">选项</label>'+
        '<div class="col-xs-12">' +
            '<ul class="choices-list" id="choices_list_{{index}}">'+
               /* '<li class="choice-row" id="choice_row_0">'+
                '<div class="choice-value">'+
                '<input class="choice-radio" type="radio" name="choice" value="0" onclick="choiceRadioClickEvent(this, 0, {{index}})">' +
                '<input class="choice-text" type="text" value="选项" placeholder="选项" onblur="choiceTextBlurEvent(this, 0, {{index}})">' +
                '</div>'+
                '<div class="choice-action">'+
                '<a class="add_choice" href="javascript:addChoice({{index}});"><i class="fa fa-plus-circle"></i></a>'+
                '<a class="del_choice" href="javascript:delChoice(0, {{index}});"><i class="fa fa-minus-circle"></i></a>'+
                '</div>'+
                '</li>' +
                '<li class="choice-row" id="choice_row_1">'+
                '<div class="choice-value">'+
                '<input class="choice-radio" type="radio" name="choice" value="1" onclick="choiceRadioClickEvent(this, 1, {{index}})">' +
                '<input class="choice-text" type="text" value="选项" placeholder="选项" onblur="choiceTextBlurEvent(this, 1, {{index}})">' +
                '</div>'+
                '<div class="choice-action">'+
                '<a class="add_choice" href="javascript:addChoice({{index}});"><i class="fa fa-plus-circle"></i></a>'+
                '<a class="del_choice" href="javascript:delChoice(1, {{index}});"><i class="fa fa-minus-circle"></i></a>'+
                '</div>'+
                '</li>' +
                '<li class="choice-row" id="choice_row_2">'+
                '<div class="choice-value">'+
                '<input class="choice-radio" type="radio" name="choice" value="2" onclick="choiceRadioClickEvent(this, 2, {{index}})">' +
                '<input class="choice-text" type="text" value="选项" placeholder="选项" onblur="choiceTextBlurEvent(this, 2, {{index}})">' +
                '</div>'+
                '<div class="choice-action">'+
                '<a class="add_choice" href="javascript:addChoice({{index}});"><i class="fa fa-plus-circle"></i></a>'+
                '<a class="del_choice" href="javascript:delChoice(2, {{index}});"><i class="fa fa-minus-circle"></i></a>'+
                '</div>'+
                '</li>' +*/
            '</ul>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">' +
            '<label class="col-xs-12">是否必填</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="required_{{index}}" /></div>'+
        '</div>' +
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">字段序号</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="1" style="width: 100px;height: 34px;" id="sort_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">备注</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="remarkBlurEvent(this, {{index}})" id="remark_{{index}}" /></div>'+
    '</div>';

// 多项选择设置模板
var checkBoxSetting =
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段标题   (<span class="err-msg" id="titleTip">必输项</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="多项选择" onblur="titleBlurEvent(this, {{index}})" id="label_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段名称   (<span class="err-msg" id="nameTip">由字母和下划线组成，且以字母开头</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="nameBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="name_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">选项值</label>'+
        '<div class="col-xs-12">' +
            '<div class="col-xs-6"><label class="radio" style="margin:0;"><input type="radio" name="option_value" value="0" onclick="checkValClickEvent(this, {{index}})" /><span>自定义</span></label></div>' +
            '<div class="col-xs-6"><label class="radio" style="margin:0;"><input type="radio" name="option_value" value="1" onclick="checkValClickEvent(this, {{index}})" /><span>数据字典取</span></label></div>' +
        '</div>'+
    '</div>'+
    '<div class="field_setting" id="dictSelBox" style="display:none;">'+
        '<div class="col-xs-12"><input class="easyui-combobox" style="width: 301px;height: 34px;" id="dictSelect" /></div>'+
    '</div>'+
    '<div class="field_setting" id="dictOptions" style="display:none;">'+
        '<label class="col-xs-12">选项</label>'+
        '<div class="col-xs-12"><ul class="choices-list" id="dict_potions_list"></ul></div>'+
    '</div>'+
    '<div class="field_setting" id="customOptions" style="display:none;">'+
        '<label class="col-xs-12">选项</label>'+
        '<div class="col-xs-12">' +
            '<ul class="choices-list" id="checks_list_{{index}}">'+
                /*'<li class="choice-row" id="check_row_0">'+
                '<div class="choice-value">'+
                '<input class="choice-radio" type="checkbox" name="choice" value="0" onclick="choiceCheckClickEvent(this, 0, {{index}})">' +
                '<input class="choice-text" type="text" value="选项" placeholder="选项" onblur="choiceCheckBlurEvent(this, 0, {{index}})">' +
                '</div>'+
                '<div class="choice-action">'+
                '<a class="add_choice" href="javascript:addCheckChoice({{index}});"><i class="fa fa-plus-circle"></i></a>'+
                '<a class="del_choice" href="javascript:delCheckChoice(0, {{index}});"><i class="fa fa-minus-circle"></i></a>'+
                '</div>'+
                '</li>' +
                '<li class="choice-row" id="check_row_1">'+
                '<div class="choice-value">'+
                '<input class="choice-radio" type="checkbox" name="choice" value="1" onclick="choiceCheckClickEvent(this, 1, {{index}})">' +
                '<input class="choice-text" type="text" value="选项" placeholder="选项" onblur="choiceCheckBlurEvent(this, 1, {{index}})">' +
                '</div>'+
                '<div class="choice-action">'+
                '<a class="add_choice" href="javascript:addCheckChoice({{index}});"><i class="fa fa-plus-circle"></i></a>'+
                '<a class="del_choice" href="javascript:delCheckChoice(1, {{index}});"><i class="fa fa-minus-circle"></i></a>'+
                '</div>'+
                '</li>' +
                '<li class="choice-row" id="check_row_2">'+
                '<div class="choice-value">'+
                '<input class="choice-radio" type="checkbox" name="choice" value="2" onclick="choiceCheckClickEvent(this, 2, {{index}})">' +
                '<input class="choice-text" type="text" value="选项" placeholder="选项" onblur="choiceCheckBlurEvent(this, 2, {{index}})">' +
                '</div>'+
                '<div class="choice-action">'+
                '<a class="add_choice" href="javascript:addCheckChoice({{index}});"><i class="fa fa-plus-circle"></i></a>'+
                '<a class="del_choice" href="javascript:delCheckChoice(2, {{index}});"><i class="fa fa-minus-circle"></i></a>'+
                '</div>'+
                '</li>' +*/
            '</ul>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">' +
            '<label class="col-xs-12">是否必填</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="required_{{index}}" /></div>'+
        '</div>' +
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">字段序号</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="1" style="width: 100px;height: 34px;" id="sort_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">备注</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="remarkBlurEvent(this, {{index}})" id="remark_{{index}}" /></div>'+
    '</div>';

//
var dropDownSetting =
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段标题   (<span class="err-msg" id="titleTip">必输项</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="单行文字" onblur="titleBlurEvent(this, {{index}})" id="label_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段名称   (<span class="err-msg" id="nameTip">由字母和下划线组成，且以字母开头</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="nameBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="name_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">选项值</label>'+
        '<div class="col-xs-12">' +
            '<div class="col-xs-6"><label class="radio" style="margin:0;"><input type="radio" name="option_value" value="0" onclick="selValClickEvent(this, {{index}})" /><span>自定义</span></label></div>' +
            '<div class="col-xs-6"><label class="radio" style="margin:0;"><input type="radio" name="option_value" value="1" onclick="selValClickEvent(this, {{index}})" /><span>数据字典取</span></label></div>' +
        '</div>'+
    '</div>'+
    '<div class="field_setting" id="dictSelBox" style="display:none;">'+
        '<div class="col-xs-12"><input class="easyui-combobox" style="width: 301px;height: 34px;" id="dictSelect" /></div>'+
    '</div>'+
    '<div class="field_setting" id="dictOptions" style="display:none;">'+
        '<label class="col-xs-12">选项</label>'+
        '<div class="col-xs-12"><ul class="choices-list" id="dict_potions_list"></ul></div>'+
    '</div>'+
    '<div class="field_setting" id="customOptions" style="display:none;">'+
        '<label class="col-xs-12">选项</label>'+
        '<div class="col-xs-12">' +
            '<ul class="choices-list" id="select_list_{{index}}"></ul>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">' +
            '<label class="col-xs-12">是否必填</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="required_{{index}}" /></div>'+
        '</div>' +
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">字段序号</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="1" style="width: 100px;height: 34px;" id="sort_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">备注</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="remarkBlurEvent(this, {{index}})" id="remark_{{index}}" /></div>'+
    '</div>';

//
var numberSetting =
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段标题   (<span class="err-msg">必输项</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="单行文字" onblur="titleBlurEvent(this, {{index}})" id="label_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段名称   (<span class="err-msg" id="nameTip">由字母和下划线组成，且以字母开头</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="nameBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="name_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">' +
            '<label class="col-xs-12">是否必填</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="required_{{index}}" /></div>'+
        '</div>' +
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">字段序号</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="1" style="width: 100px;height: 34px;" id="sort_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">最小值</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="" style="width: 100px;height: 34px;" id="least_char_{{index}}" /></div>'+
        '</div>'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">最大值</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="" style="width: 100px;height: 34px;" id="more_char_{{index}}" /></div>'+
        '</div>'+
    '</div>' +
    '<div class="field_setting">'+
        '<label class="col-xs-12">备注</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="remarkBlurEvent(this, {{index}})" id="remark_{{index}}" /></div>'+
    '</div>';

var dateSetting =
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段标题   (<span class="err-msg" id="titleTip">必输项</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="单行文字" onblur="titleBlurEvent(this, {{index}})" id="label_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段名称   (<span class="err-msg" id="nameTip">由字母和下划线组成，且以字母开头</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="nameBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="name_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">是否必填</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="required_{{index}}" /></div>'+
        '</div>'+
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">字段序号</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="1" style="width: 100px;height: 34px;" id="sort_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">备注</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="remarkBlurEvent(this, {{index}})" id="remark_{{index}}" /></div>'+
    '</div>';

var telSetting =
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段标题   (<span class="err-msg" id="titleTip">必输项</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="单行文字" onblur="titleBlurEvent(this, {{index}})" id="label_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">字段名称   (<span class="err-msg" id="nameTip">由字母和下划线组成，且以字母开头</span>)</label>'+
        '<div class="col-xs-12"><input class="full-width" type="text" value="" onblur="nameBlurEvent(this, {{index}})" style="border:1px solid #ffa8a8;" id="name_set_{{index}}"></div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<div class="col-xs-6">' +
            '<label class="col-xs-12">是否必填</label>'+
            '<div class="col-xs-12"><input class="easyui-combobox" style="width: 100px;height: 34px;" id="required_{{index}}" /></div>'+
        '</div>' +
        '<div class="col-xs-6">'+
            '<label class="col-xs-12">字段序号</label>'+
            '<div class="col-xs-12"><input type="text" class="easyui-numberspinner" value="1" style="width: 100px;height: 34px;" id="sort_{{index}}" /></div>'+
        '</div>'+
    '</div>'+
    '<div class="field_setting">'+
        '<label class="col-xs-12">备注</label>'+
        '<div class="col-xs-12"><input type="text" class="full-width" value="" onblur="remarkBlurEvent(this, {{index}})" id="remark_{{index}}" /></div>'+
    '</div>';
