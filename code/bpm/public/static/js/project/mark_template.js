function openPage(title, value, callback) {
    $('#templateModal').show();
    $('#templateModal').mydialog({
        title:title,
        width: 600,
        height:370,
        top:100,
        modal: true,
        myButtons:[
            {
                text:'确定',
                btnCls:'btn btn-blue',
                handler:function(){
                    callback(value);
                }
            },
            {
                text:'关闭',
                btnCls:'btn btn-danger',
                handler:function(){
                    closeCatalogDialog();
                }
            }
        ]
    });
}

function closeCatalogDialog() {
    $('#templateModal').dialog('close');
    clearCatalogForm();
}
// 清空新增表单数据
function clearCatalogForm() {
    $('#templateForm').form('reset');
}
// 新增结算模板
function doAddTemplate(value) {
    // 验证表单
    var validate = $('#templateForm').form('validate');
    if(!validate) {
        return false;
    }
    $.ajax({
        url: basePath+'/api/dynamic_patrol/valuationItems/mark_template_route/addTemplate',
        type: 'post',
        data: $('#templateForm').serializeJson(),
        success: function (result) {
            if(result.success) {
                closeCatalogDialog();
                $('#templateTree').tree('reload');
            } else {
                msgError(result.msg+',错误代码:'+result.code);
            }
        }
    });
}
//
function initTemplateTree(){
    $('#templateTree').tree({
        url:basePath+'/api/dynamic_patrol/valuationItems/mark_template_route/queryTemplate',
        method: 'get',
        animate: true,
        lines: true,
        onClick:function(node) {
            if(node.attributes.grade!='1'){
                $("#edit").attr('disabled','disabled');
            } else{
                $("#edit").removeAttr('disabled');
            }
        }
    });
}
// 修改结算模板
function toEdit(){
    // 获得选择行
    var selected = $('#templateTree').tree('getSelected');
    console.info(selected);
    if (selected ==null) {
        msgError('提示,请选择一条数据再进行修改');
        return false;
    }
    var id = selected.id;

    $("#code").val(selected.attributes.code);
    $("#status").val(selected.attributes.status);
    $("#name").val(selected.attributes.name);
    $("#remark").val(selected.attributes.remark);
    openPage("修改打分模板", id, doEdit);
}
function doEdit(value){
    // 验证表单
    var validate = $('#templateForm').form('validate');
    if(!validate) {
        return false;
    }
    $.ajax({
        url: basePath+'/api/dynamic_patrol/valuationItems/mark_template_route/editTemplate?id='+value,
        type: 'post',
        data: $('#templateForm').serializeJson(),
        success: function (data) {
            if(data.success) {
                msgSuccess(data.msg);
                closeCatalogDialog();
                $('#templateTree').tree('reload');
            }
            else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}

var markItem =
'<li id="type_{{index}}">'+
    '<div class="mark-type" style="height:46px; padding: 6px 3px;">'+
        '<input type="text" class="easyui-combobox" name="mark_item_id" id="itemFirstId_{{index}}" value="" style="height:34px;width:100%;" />'+
        '<input type="hidden" name="mark_item_code" id="itemFirstCode_{{index}}" value="" />'+
    '</div>'+
    '<ul id="typeChild_{{index}}">'+
        '<li id="norm_{{index}}_{{normIndex}}">'+
            '<div class="second-box">'+
                '<div id="itemSecond_{{index}}_{{normIndex}}" style="width:25%; height:46px; padding: 6px 3px;">'+

                '</div>'+
                '<div id="arithmetic_{{index}}_{{normIndex}}" style="width:43.8%; height:46px; padding: 6px 3px;">'+

                '</div>'+
                '<div id="score_{{index}}_{{normIndex}}" style="width:6.2%; height:46px; padding: 6px 3px;">'+
                '</div>'+
                '<div id="dataSources_{{index}}_{{normIndex}}" style="width:18.8%; height:46px; padding: 6px 3px;">'+
                '</div>'+
                '<div class="del-box" style="width:6.2%; height:46px; line-height:34px; padding: 6px 3px;">'+
                    '<a href="javascript:delItem({{index}}, {{normIndex}});" id="del_{{index}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
                '</div>'+
                '<input type="hidden" id="itemId_{{index}}_{{normIndex}}" value="" />'+
            '</div>'+
        '</li>'+
    '</ul>'+
'</li>';

var markItem2 =
'<li id="norm_{{index}}_{{normIndex}}">'+
    '<div class="second-box">'+
        '<div id="itemSecond_{{index}}_{{normIndex}}" style="width:25%; height:46px; padding: 6px 3px;">'+

        '</div>'+
        '<div id="arithmetic_{{index}}_{{normIndex}}" style="width:43.8%; height:46px; padding: 6px 3px;">'+

        '</div>'+
        '<div id="score_{{index}}_{{normIndex}}" style="width:6.2%; height:46px; padding: 6px 3px;">'+
        '</div>'+
        '<div id="dataSources_{{index}}_{{normIndex}}" style="width:18.8%; height:46px; padding: 6px 3px;">'+
        '</div>'+
        '<div class="del-box" style="width:6.2%; height:46px; line-height:34px; padding: 6px 3px;">'+
            '<a href="javascript:delItem({{index}}, {{normIndex}});" id="del_{{index}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
        '</div>'+
        '<input type="hidden" id="itemId_{{index}}_{{normIndex}}" value="" />'+
    '</div>'+
'</li>';

var norm =
    '<input type="text" class="easyui-combobox" name="mark_item_second_id" id="itemSecondId_{{index}}_{{normIndex}}" value="" style="height:34px;width:90%;" />'+
    '{{if normIndex ==0}}<a href="javascript:appendSecondItem({{index}});" style="margin-left:5px;"><i class="fa fa-plus"></i></a>{{/if}}'+
    '<input type="hidden" name="mark_item_code" id="itemSecondCode_{{index}}_{{normIndex}}" value="" />';

var arithmetic =
    '<input type="text" class="easyui-combobox" name="arithmetic" id="arithmeticId_{{index}}_{{normIndex}}" value="" style="height:34px;width:100%;" />';

var showTemplate=
    '{{each markItemArr as markItem index}}'+
    '<li id="type_{{index}}">'+
    '<div class="mark-type" style="height:46px; padding: 6px 3px;">'+
        '<input type="text" class="easyui-combobox" name="mark_item_id" id="itemFirstId_{{index}}" value="{{markItem.mark_item_id}}" style="height:34px;width:100%;" />'+
        '<input type="hidden" name="mark_item_code" id="itemFirstCode_{{index}}" value="{{markItem.mark_item_code}}" />'+
    '{{if markItem.children.length >0}}'+
        '<input type="hidden" id="superId_{{index}}" value="{{markItem.id}}" />'+
        '{{/if}}'+
    '</div>'+
    '<ul id="typeChild_{{index}}">'+
        '{{if markItem.children.length >0}}'+
        '{{each markItem.children as markItem2 normIndex}}'+
        '<li id="norm_{{index}}_{{normIndex}}">'+
            '<div class="second-box">'+
                '<div id="itemSecond_{{index}}_{{normIndex}}" style="width:25%; height:46px; padding: 6px 3px;">'+
                    '<input type="text" class="easyui-combobox" name="mark_item_id" id="itemSecondId_{{index}}_{{normIndex}}" value="{{markItem2.mark_item_id}}" style="height:34px;width:90%;" />'+
                    '{{if normIndex ==0}}<a href="javascript:appendSecondItem({{index}});" style="margin-left:5px;"><i class="fa fa-plus"></i></a>{{/if}}'+
                    '<input type="hidden" name="mark_item_code" id="itemSecondCode_{{index}}_{{normIndex}}" value="{{markItem2.mark_item_code}}" />'+
                '</div>'+
                '<div id="arithmetic_{{index}}_{{normIndex}}" style="width:43.8%; height:46px; padding: 6px 3px;"></div>'+
                '<div id="score_{{index}}_{{normIndex}}" style="width:6.2%; height:46px; padding: 6px 3px;"></div>'+
                '<div id="dataSources_{{index}}_{{normIndex}}" style="width:18.8%; height:46px; padding: 6px 3px;"></div>'+
                '<div class="del-box" style="width:6.2%; height:46px; line-height:34px; padding: 6px 3px;">'+
                    '<a href="javascript:delItem({{index}}, {{normIndex}});" id="del_{{index}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
                '</div>'+
                '<input type="hidden" id="itemId_{{index}}_{{normIndex}}" value="{{markItem2.id}}" />'+
            '</div>'+
        '</li>'+
        '{{/each}}'+
        '{{/if}}'+
        '{{if markItem.children.length ==0}}'+
        '<li id="norm_{{index}}_0">'+
            '<div class="second-box">'+
                '<div id="itemSecond_{{index}}_0" style="width:25%; height:46px; padding: 6px 3px;"></div>'+
                '<div id="arithmetic_{{index}}_0" style="width:43.8%; height:46px; padding: 6px 3px;"></div>'+
                '<div id="score_{{index}}_0" style="width:6.2%; height:46px; padding: 6px 3px;"></div>'+
                '<div id="dataSources_{{index}}_0" style="width:18.8%; height:46px; padding: 6px 3px;"></div>'+
                '<div class="del-box" style="width:6.2%; height:46px; line-height:34px; padding: 6px 3px;">'+
                    '<a href="javascript:delItem({{index}}, 0);" id="del_{{index}}_0"><i class="fa fa-remove"></i></a>'+
                '</div>'+
                '<input type="hidden" id="itemId_{{index}}_0" value="{{markItem.id}}" />'+
            '</div>'+
        '</li>'+
        '{{/if}}'+
    '</ul>'+
    '</li>'+
    '{{/each}}';
var itemConfig;
function appendMarkItem(){
    var node = $('#templateTree').tree("getSelected");
    if(node==null){
        msgError('提示,请先在左侧选择一个打分模板');
        return;
    }
    if(node.id=='0'){
        msgError('提示,请先在左侧选择一个打分模板');
        return;
    }
    var index = $("li[id^='type_']").length;
    var normIndex = 0;
    var render = template.compile(markItem);
    var html = render({index: index, normIndex:normIndex});
    $('#markItems').append(html);
    $.parser.parse('#type_'+index);
    setFirstCombox($("#itemFirstId_"+index), index, normIndex, true);
}

function appendSecondItem(index){
    var normIndex = $("li[id^='norm_"+index+"']").length;
    var data = {
        index: index,
        normIndex:normIndex
    };
    var render = template.compile(markItem2);
    var html = render(data);
    $('#typeChild_'+index).append(html);
    $.parser.parse('#norm_'+index+"_"+normIndex);

    var length = $("li[id^='norm_"+index+"']").length;
    $("#type_"+index).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});

    var pid = $("#itemFirstId_"+index).combobox("getValue");
    getSecondItem(index, normIndex, pid, true);
}
function setFirstCombox($itemFirst, index, normIndex, flag){
    $itemFirst.combobox({
        data: itemConfig,
        editable: false,
        valueField: 'id',
        textField: 'scene_name',
        multiple: false,
        required: true,
        onLoadSuccess:function(node){
            var pid =$itemFirst.combobox("getValue");
            getSecondItem(index, normIndex, pid, false);
        },
        onChange:function(newValue, oldValue){
            if(newValue==oldValue){
                return;
            }
            var allData = $itemFirst.combobox('getData');
            for(var i in allData){
                if(allData[i].id == newValue){
                    $("#itemFirstCode_"+index).val(allData[i].scene_code);
                }
            }
            getSecondItem(index, normIndex, newValue,flag);
        }
    });
}

function getSecondItem(index, normIndex, pid, flg){
    $.ajax({
        url: basePath + '/api/dynamic_patrol/valuationItems/mark_template_route/getItemConfig?pid='+pid+'&grade=1',
        type: 'get',
        success: function (result) {
            var searchData = result.data;
            var $itemSecondBox = $("#itemSecond_"+index+"_"+normIndex);
            if(searchData.length>0){
                if(flg){
                    var render = template.compile(norm);
                    var data ={
                        index: index,
                        normIndex:normIndex
                    };
                    var html = render(data);
                    $itemSecondBox.html(html);
                    $.parser.parse($itemSecondBox);
                }
                var $itemSecond = $("#itemSecondId_"+index+"_"+normIndex);
                $itemSecond.combobox({
                    data: searchData,
                    editable: false,
                    valueField: 'id',
                    textField: 'scene_name',
                    multiple: false,
                    required: true,
                    onLoadSuccess:function(){
                        var pid = $(this).combobox('getValue');
                        if(pid!=null && pid!=""){
                            getArithmetic(index, normIndex, pid, true);
                        } else {
                            $("#arithmetic_"+index+"_"+normIndex).empty();
                            $("#score_"+index+"_"+normIndex).empty();
                            $("#dataSources_"+index+"_"+normIndex).empty();
                        }
                    },
                    onChange:function(newValue, oldValue) {
                        if (newValue == oldValue) {
                            return;
                        }
                        var allData = $(this).combobox('getData');
                        for(var i in allData){
                            if(allData[i].id == newValue){
                                $("#itemSecondCode_"+index+"_"+normIndex).val(allData[i].scene_code);
                            }
                        }
                        getArithmetic(index, normIndex, newValue, true);
                    }
                });
            } else {
                var $normLi = $("li[id^='norm_"+index+"']");
                $normLi.each(function(normIndex){
                    if(normIndex !=0){
                        $(this).remove();
                    }
                });
                var length = $normLi.length;
                $("#type_"+index).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});

                $itemSecondBox.empty();
                getArithmetic(index, normIndex, pid, true);
            }
        }
    });
}
/**
 *
 * @param index
 * @param normIndex
 * @param pid
 * @param flg
 */
function getArithmetic(index, normIndex, pid, flg){
    $.ajax({
        url: basePath + '/api/dynamic_patrol/valuationItems/mark_template_route/getItemConfig?pid='+pid+'&grade=2',
        type: 'get',
        success: function (result) {
            var searchData = result.data;
            if(flg) {
                var render = template.compile(arithmetic);
                var html = render({index: index, normIndex: normIndex});
                $("#arithmetic_" + index + "_" + normIndex).html(html);
            }
            $.parser.parse("#arithmetic_"+index+"_"+normIndex);
            $("#arithmeticId_"+index+"_"+normIndex).combobox({
                data: searchData,
                editable: false,
                valueField: 'id',
                textField: 'arithmetic',
                multiple: false,
                required: true,

                onLoadSuccess:function(){
                    var $arithmetic = $("#arithmeticId_"+index+"_"+normIndex);
                    var data = $arithmetic.combobox('getData');
                    $arithmetic.combobox('select',data[0].id);
                },
                onChange: function(newValue, oldValue){
                    if (newValue == oldValue) {
                        return;
                    }
                    var allData = $("#arithmeticId_"+index+"_"+normIndex).combobox('getData');
                    for(var i in allData){
                        if(allData[i].id == newValue){
                            $("#score_"+index+"_"+normIndex).html(allData[i].score);
                            $("#dataSources_"+index+"_"+normIndex).html(allData[i].data_sources);
                        }
                    }
                }
            });
        }
    })
}

function delItem(index, normIndex){
    if($("#itemSecondId_"+index+"_"+normIndex).length >0){
        $("#norm_"+index+"_"+normIndex).remove();
        var $normLi = $("li[id^='norm_"+index+"_']");
        if($normLi.length >0){
            $normLi.each(function(newNormIndex){
                var $norm = $(this);
                $norm.attr("id", "norm_"+index+"_"+newNormIndex);
                var $itemSecond = $norm.find(".second-box").find("div:first");
                $itemSecond.attr("id", "itemSecond_"+index+"_"+newNormIndex);
                if(newNormIndex ==0){
                    var $a1 = $itemSecond.find("a");
                    if($a1.length >0){
                        $a1.attr("href","javascript:appendSecondItem("+index+");")
                    } else {
                        $itemSecond.append('<a href="javascript:appendSecondItem('+index+');" style="margin-left:5px;"><i class="fa fa-plus"></i></a>')
                    }
                }
                $norm.find("div[id^='arithmetic_']").attr("id","arithmetic_"+index+"_"+newNormIndex);
                $norm.find("div[id^='score_']").attr("id","score_"+index+"_"+newNormIndex);
                $norm.find("div[id^='dataSources_']").attr("id","dataSources_"+index+"_"+newNormIndex);
                var $delA =$norm.find("a[id^='del_']");
                $delA.attr("id","del_"+index+"_"+newNormIndex);
                $delA.attr("href","javascript:delItem("+index+", "+newNormIndex+");");
            });

        } else{
            $("#type_"+index).remove();
        }
    }else{
        $("#type_"+index).remove();
    }
    var length =$("li[id^='norm_"+index+"_']").length;
    $("#type_"+index).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});
}

function saveTemplate(){
    var data= new Array();
    var node = $('#templateTree').tree("getSelected");
    var top_id = node.attributes.top_id;
    var parent_id = node.id;
    $("li[id^='type_']").each(function(index){
        // 指标类型ID
        var markItemId = $("#itemFirstId_"+index).combobox("getValue");
        var markItemName = $("#itemFirstId_"+index).combobox("getText");
        var markItemCode = $("#itemFirstCode_"+index).val();
        var obj = {};
        $("li[id^='norm_"+index+"_']").each(function(normIndex){
            if(normIndex ==0){
                var $super = $("#superId_"+index);
                var id;
                if($super.length ==0){
                    id = $("#itemId_"+index+"_"+normIndex).val();
                } else {
                    id =$super.val();
                }

                if(id ==null || id==""){
                    obj.id = keyGenerator();
                    obj.flag ="0";
                } else {
                    obj.id = id;
                    obj.flag ="1";
                }
                obj.top_id = top_id;
                obj.parent_id = parent_id;
                obj.mark_item_id = markItemId;
                obj.mark_item_code = markItemCode;
                obj.mark_item_name = markItemName;
                obj.grade =2;
                obj.sort = index+1;
                data.push(obj);
            }

            var markItem = $("#itemSecondId_"+index+"_"+normIndex);
            if(markItem.length >0){
                var markItemId2 = markItem.combobox("getValue");
                var markItemName2 = markItem.combobox("getText");
                var markItemCode2 = $("#itemSecondCode_"+index+"_"+normIndex).val();
                var secondItem = {};
                var childId = $("#itemId_"+index+"_"+normIndex).val();
                if(childId ==null || childId==""){
                    secondItem.id = keyGenerator();
                    secondItem.flag ="0";
                } else {
                    secondItem.id = childId;
                    secondItem.flag ="1";
                }
                secondItem.top_id = top_id;
                secondItem.parent_id = obj.id;
                secondItem.mark_item_id = markItemId2;
                secondItem.mark_item_code = markItemCode2;
                secondItem.mark_item_name = markItemName2;
                secondItem.grade =3;
                secondItem.sort = (normIndex+1);
                data.push(secondItem);
            }
        })
    });
    console.info(JSON.stringify(data));
    $.ajax({
        url:basePath + '/api/dynamic_patrol/valuationItems/mark_template_route/addMarkItem',
        type: 'post',
        data: {dataArr:JSON.stringify(data)},
        success: function (data) {
            if (data.code == 200) {
                msgSuccess(data.msg);
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    })
}
function loadMarkItems(markTplId){
    $.ajax({
        url:basePath+'/api/dynamic_patrol/valuationItems/mark_template_route/getMarkItems?top_id='+markTplId,
        type: 'get',
        success: function (result) {
            if (result.success) {
                $("#markItems").empty();
                var data =result.data;
                if(data.length >0) {
                    var render = template.compile(showTemplate);
                    var html = render({markItemArr: data});
                    $("#markItems").html(html);
                    $.parser.parse("#markItems");
                    $("li[id^='type_']").each(function(index){

                        var $itemFirst = $("#itemFirstId_"+index);

                        $("li[id^='norm_"+index+"']").each(function(normIndex){
                            setFirstCombox($itemFirst, index, normIndex, true);
                        });
                        var length = $("li[id^='norm_"+index+"']").length;
                        $("#type_"+index).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});
                    });
                }
            }
        }
    });
}

$(function(){
    $('#templateTree').tree({
        url:basePath+'/api/dynamic_patrol/valuationItems/mark_template_route/queryTemplate',
        method: 'get',
        animate: true,
        lines: true,
        onLoadSuccess:function (node, data) {
            $("#templateTree li:eq(1)").find("div").addClass("tree-node-selected"); // 设置第一个节点高亮
            var n = $("#templateTree").tree("getSelected");
            if (n != null) {
                $("#templateTree").tree("select", n.target);// 相当于默认点击了一下第一个节点，执行onSelect方法
            }
        },
        onSelect:function(node) {
            loadMarkItems(node.id);
            if(node.id=='0'){
                $("#edit").attr('disabled','disabled');
            } else{
                $("#edit").removeAttr('disabled');
            }
        }
    });
    $.ajax({
        url: basePath + '/api/dynamic_patrol/valuationItems/mark_template_route/getItemConfig?pid=0&grade=0',
        type: 'get',
        success: function (result) {
            itemConfig = result.data;
        }
    });
});
