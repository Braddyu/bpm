var htmlTemplate =
'<li id="majorLi_0">'+
    '<div class="major-box" style="height: 92px; padding:6px 3px;">'+
        '<p>{{profession_name}}</p>'+
        '<input type="hidden" name="profession_id" id="majorId_0" value="{{profession_id}}" />'+
    '</div>'+
    '<ul class="" id="majorChild_0">'+
        '{{each typeArr as type typeIndex}}'+
        '<li id="typeLi_0_{{typeIndex}}">'+
            '<div class="type-box" id="typeBox_0_{{typeIndex}}" style="height: 46px; padding:6px 3px;">'+
                '<div style="width:100%; overflow: hidden; height:33px;">' +
                    '<p style="float:left; width:90%; height:33px; line-height:33px;">{{type.field_name}}</p>'+
                    '<div  style="float:left; width:10%; height:33px; line-height:33px;">' +
                        '<a href="javascript:addSizing({{typeIndex}}, \'typeChild_0_{{typeIndex}}\');"><i class="fa fa-plus"></i></a>' +
                    '</div>' +
                '</div>'+
                '<input type="hidden"  name="type_id" id="typeId_0_{{typeIndex}}" value="{{type.field_value}}" />'+
            '</div>'+
            '<ul class="" id="typeChild_0_{{typeIndex}}">'+
                '{{if type.children.length ==0}}'+
                '<li id="sizeLi_0_{{typeIndex}}_0">' +
                    '<div class="no-set-sizing" id="noSet_0_{{typeIndex}}_0">不设规模调整系数</div>' +
                    '<input type="hidden" name="sizing_start" id="sizingStart_0_{{typeIndex}}_0" value="" />' +
                    '<input type="hidden" name="sizing_end" id="sizingEnd_0_{{typeIndex}}_0" value="" />' +
                    '<input type="hidden" name="sizing_coefficient" id="sizingCoe_0_{{typeIndex}}_0" value="" />' +
                    '<input type="hidden" name="sizing_remark" id="sizingRemark_0_{{typeIndex}}_0" value="" />' +
                '</li>'+
                '{{/if}}'+
                '{{if type.children.length >0}}'+
                '{{each type.children as size sizeIndex}}'+
                '<li id="sizeLi_0_{{typeIndex}}_{{sizeIndex}}">'+
                    '<div class="size-info-box">'+
                        '<div class="sizing-start" style="{{if typeIndex >0 }} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<input type="text" class="form-control easyui-validatebox easyui-textbox" data-options="required:true, validType:\'number\', missingMessage:\'该输入项为必输项\', prompt:\'开始范围\'" name="sizing_start" id="sizingStart_0_{{typeIndex}}_{{sizeIndex}}" value="{{size.sizing_start}}" style="height:34px;width:100%;" />'+
                        '</div>'+
                        '<div class="sizing-end" style="{{if typeIndex >0 }} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<input type="text" class="form-control easyui-validatebox easyui-textbox" data-options="required:true, validType:\'number\', missingMessage:\'该输入项为必输项\', prompt:\'结束范围\'" name="sizing_end" id="sizingEnd_0_{{typeIndex}}_{{sizeIndex}}" value="{{size.sizing_end}}" style="height:34px;width:100%;" />'+
                        '</div>'+
                        '<div class="sizing-coe" style="{{if typeIndex >0 }} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<input type="text" class="form-control easyui-validatebox easyui-textbox" data-options="required:true, validType:\'decimals\', missingMessage:\'该输入项为必输项\', prompt:\'规模调整系数\'" name="sizing_coefficient" id="sizingCoe_0_{{typeIndex}}_{{sizeIndex}}" value="{{size.sizing_coefficient}}" style="height:34px;width:100%;" />'+
                        '</div>'+
                        '<div class="sizing-remark" style="{{if typeIndex >0 }} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<input type="text" class="form-control easyui-validatebox easyui-textbox" data-options="prompt:\'备注\'" name="sizing_remark" id="sizingRemark_0_{{typeIndex}}_{{sizeIndex}}" value="{{size.sizing_remark}}" style="height:34px;width:100%;" />'+
                        '</div>'+
                        '<div class="operation" style="{{if typeIndex >0 }} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<a href="javascript:delSizing({{typeIndex}},{{sizeIndex}});" id=""><i class="fa fa-remove"></i></a>'+
                        '</div>'+
                    '</div>'+
                '</li>'+
                '{{/each}}'+
                '{{/if}}'+
            '</ul>'+
        '</li>'+
        '{{/each}}'+
    '</ul>'+
'</li>';

var sizingTemplate =
    '<li id="sizeLi_0_{{typeIndex}}_{{sizeIndex}}">'+
        '<div class="size-info-box">'+
            '<div class="sizing-start">'+
                '<input type="text" class="form-control easyui-validatebox easyui-textbox" data-options="required:true, validType:\'number\', missingMessage:\'该输入项为必输项\', prompt:\'开始范围\'" name="sizing_start" id="sizingStart_0_{{typeIndex}}_{{sizeIndex}}" value="" style="height:34px;width:100%;" />'+
            '</div>'+
            '<div class="sizing-end">'+
                '<input type="text" class="form-control easyui-validatebox easyui-textbox" data-options="required:true, validType:\'number\', missingMessage:\'该输入项为必输项\', prompt:\'结束范围\'" name="sizing_end" id="sizingEnd_0_{{typeIndex}}_{{sizeIndex}}" value="" style="height:34px;width:100%;" />'+
            '</div>'+
            '<div class="sizing-coe">'+
                '<input type="text" class="form-control easyui-validatebox easyui-textbox" data-options="required:true, validType:\'decimals\', missingMessage:\'该输入项为必输项\', prompt:\'规模调整系数\'" name="sizing_coefficient" id="sizingCoe_0_{{typeIndex}}_{{sizeIndex}}" value="" style="height:34px;width:100%;" />'+
            '</div>'+
            '<div class="sizing-remark">'+
                '<input type="text" class="form-control easyui-validatebox" name="sizing_remark" data-options="prompt:\'备注\'" id="sizingRemark_0_{{typeIndex}}_{{sizeIndex}}" value="" style="height:34px;width:100%;" />'+
            '</div>'+
            '<div class="operation">'+
                '<a href="javascript:delSizing({{typeIndex}},{{sizeIndex}});" id=""><i class="fa fa-remove"></i></a>'+
            '</div>'+
        '</div>'+
    '</li>';
// 维护类别
var aptitude_maintain_professional;
function getSelectValue(callback) {
    var dictCode ="'"+Dict_Code.aptitude_maintain_professional+"'";
    $.ajax({
        url: basePath + '/api/dictionary/dict_route/allDictAndAttr',
        type: 'get',
        data:{dict_code:dictCode},
        success: function (data) {
            $.each(data, function (i, r) {
                aptitude_maintain_professional = r.children;
            });
            if(typeof (callback) =="function"){
                callback();
            }
        }
    });
}
function initTree(){
    var fatherNode = new Array();
    for(var j=0; j< aptitude_maintain_professional.length; j++){
        var data = aptitude_maintain_professional[j];
        var tempData = {};
        tempData.id = data .field_value;
        tempData.text = data.field_name;
        tempData.attributes ={grade:'1'};
        tempData.children=[];
        fatherNode.push(tempData);
    }
    var treeData = new Array();
    var treeNode = {
        id:"0",
        text:"维护类别",
        attributes:{grade:'0'},
        children:fatherNode
    }
    treeData.push(treeNode);
    $('#templateTree').tree({
        data: treeData,
        onLoadSuccess: function(node, data){
            $("#templateTree li:eq(1)").find("div").addClass("tree-node-selected");   //设置第一个节点高亮
            var n = $("#templateTree").tree("getSelected");
            if(n!=null){
                $("#templateTree").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
            }
        },
        onSelect:function(node) {
            var profession_id = node.id;
            var profession_name = node.text;
            getSizing(profession_id, profession_name);
        }
    });
}
function addSizing(typeIndex, idName){

    if($("#noSet_0_"+typeIndex+"_0").length == 1){
        $("#"+idName).empty();
    }
    var sizeIndex = $("#"+idName).find("li[id^='sizeLi']").length;
    var render = template.compile(sizingTemplate);
    var html = render({typeIndex: typeIndex, sizeIndex:sizeIndex});
    $("#"+idName).append(html);

    $.parser.parse("#sizeLi_0_"+typeIndex+"_"+sizeIndex);

    var length = $("input[name='sizing_remark']").length;
    $(".major-box").css("height",length*46);

    length = $("#"+idName).find("input[name='sizing_remark']").length;
    $("#typeBox_0_"+typeIndex).css({height:length*46, padding:(length*46-33)/2 +"px 3px"});

}
function delSizing(typeIndex, sizeIndex){
    $("#sizeLi_0_"+typeIndex+"_"+sizeIndex).remove();
    var $sizeLi = $("li[id^='sizeLi_0_"+typeIndex+"_']");
    if($sizeLi.length >0){
        $sizeLi.each(function(newSizeIndex){
            var $size = $(this);
            $size.attr("id", "sizeLi_0_"+typeIndex+"_"+newSizeIndex);
            $size.find("input[id^='sizingStart_']").attr("id", "sizingStart_"+typeIndex+"_"+newSizeIndex);
            $size.find("input[id^='sizingEnd_']").attr("id", "sizingEnd_"+typeIndex+"_"+newSizeIndex);
            $size.find("input[id^='sizingCoe_']").attr("id", "sizingCoe_"+typeIndex+"_"+newSizeIndex);
            $size.find("input[id^='sizingRemark_']").attr("id", "sizingRemark_"+typeIndex+"_"+newSizeIndex);
            $size.find("a").attr("href","javascript:delSizing("+typeIndex+","+newSizeIndex+");");
        });
    } else{
        var html= '<li id="sizeLi_0_'+typeIndex+'_0"><div id="noSet_0_'+typeIndex+'_0" class="no-set-sizing">不设规模调整系数</div>' +
            '<input type="hidden" name="sizing_start" id="sizingStart_0_'+typeIndex+'_0" value="" />' +
            '<input type="hidden" name="sizing_end" id="sizingEnd_0_'+typeIndex+'_0" value="" />' +
            '<input type="hidden" name="sizing_coefficient" id="sizingCoe_0_'+typeIndex+'_0" value="" />' +
            '<input type="hidden" name="sizing_remark" id="sizingRemark_0_'+typeIndex+'_0" value="" />' +
            '</li>';
        $("#typeChild_0_"+typeIndex).html(html);
        var length = $("input[name='sizing_remark']").length;
        $(".major-box").css("height",length*46);
        $("#typeBox_0_"+typeIndex).css({height:46, padding:"6px 3px"});
    }
    var length = $("input[name='sizing_remark']").length;
    $(".major-box").css("height",length*46);

    length = $("#typeChild_0_"+typeIndex).find("input[name='sizing_remark']").length;
    $("#typeBox_0_"+typeIndex).css({height:length*46, padding:(length*46-33)/2 +"px 3px"});
}

//
function getSizing(profession_id, profession_name){
    $.ajax({
        url: basePath+'/api/billing/billing_sizing_route/querySizing?profession_id='+profession_id,
        type: 'get',
        success: function (result) {
            if(result.success) {
                var typeArr = new Array();
                var searchData =result.data;
                if(searchData.length >0){
                    $.ajax({
                        url: basePath+'/api/dictionary/dict_route/getChildren',
                        type: 'get',
                        data:{field_parent_value:profession_id},
                        success: function (typeData) {
                            for(var i in typeData){
                                var type = typeData[i];
                                type.children = [];
                                for(var j in searchData){
                                    var sizing = searchData[j];
                                    if(type.field_value == sizing.type_id){
                                        var child = {};
                                        child.sizing_start = sizing.sizing_start;
                                        child.sizing_end = sizing.sizing_end;
                                        child.sizing_coefficient = sizing.sizing_coefficient;
                                        child.sizing_remark =sizing.sizing_remark;
                                        type.children.push(child);
                                    }
                                }
                                typeArr.push(type);
                            }
                            createHtml(typeArr,profession_id, profession_name);
                        }
                    });
                } else {
                    $.ajax({
                        url: basePath+'/api/dictionary/dict_route/getChildren',
                        type: 'get',
                        data:{field_parent_value:profession_id},
                        success: function (typeData) {
                            for(var i in typeData){
                                var type = typeData[i];
                                type.children = [];
                                typeArr.push(type);
                            }
                            createHtml(typeArr,profession_id, profession_name);
                        }
                    });
                }
            } else {
                msgError(result.msg+',错误代码:'+result.code);
            }
        }
    });
}
function createHtml(typeArr,profession_id, profession_name){
    var render = template.compile(htmlTemplate);
    var html = render({typeArr: typeArr, profession_id:profession_id, profession_name:profession_name});
    $("#profession_child").html(html);
    $.parser.parse("#profession_child");

    var length = $("input[name='sizing_remark']").length;
    $(".major-box").css("height",length*46);

    $("li[id^='typeLi_0_']").each(function(typeIndex){
        length = $("#typeChild_0_"+typeIndex).find("input[name='sizing_remark']").length;
        $("#typeBox_0_"+typeIndex).css({height:length*46, padding:(length*46-33)/2 +"px 3px"});
    });
}
function saveSizing(){
    var data= new Array();
    $("li[id^='majorLi_']").each(function(index, profession){
        // 维护类别ID
        var $profession = $(this);
        var profession_id = $("#majorId_"+index).val();

        var $typeLi = $profession.find("li[id^='typeLi_"+index+"_']");
        $typeLi.each(function(typeIndex){
            // 工单类型
            var $type = $(this);
            var type_id = $("#typeId_"+index+"_"+typeIndex).val();

            var $sizeLi = $type.find("li[id^='sizeLi_"+index+"_"+typeIndex+"_']");
            $sizeLi.each(function(sizeIndex){
                var $size = $(this);
                var $sizingStart = $("#sizingStart_"+index+"_"+typeIndex+"_"+sizeIndex);
                var $sizingEnd = $("#sizingEnd_"+index+"_"+typeIndex+"_"+sizeIndex);
                var $sizingCoe = $("#sizingCoe_"+index+"_"+typeIndex+"_"+sizeIndex);

                // 验证
                if($size.find("input[type='text']").length>0){
                    var valid_1 = $sizingStart.textbox("isValid");
                    var valid_2 = $sizingEnd.textbox("isValid");
                    var valid_3 = $sizingCoe.textbox("isValid");
                    if(!valid_1 || !valid_2 || !valid_3){
                        if(!valid_1){
                            $sizingStart.textbox('textbox').focus();
                            return false;
                        }
                        if(!valid_2){
                            $sizingEnd.textbox('textbox').focus();
                            return false;
                        }
                        if(!valid_3){
                            $sizingCoe.textbox('textbox').focus();
                            return false;
                        }

                    }
                }

                var sizing_start = $sizingStart.val();
                var sizing_end =$sizingEnd.val();
                var sizing_coefficient = $sizingCoe.val();
                var sizing_remark = $("#sizingRemark_"+index+"_"+typeIndex+"_"+sizeIndex).val();
                if(sizing_start !="" && sizing_end !="" && sizing_coefficient!=""){
                    var obj = {};
                    obj.sizing_id = keyGenerator();
                    obj.profession_id = profession_id;
                    obj.type_id = type_id;
                    obj.sizing_start =sizing_start;
                    obj.sizing_end =sizing_end;
                    obj.sizing_coefficient = sizing_coefficient;
                    obj.sizing_remark =sizing_remark;
                    data.push(obj);
                }
            })
        })
    });
    $.ajax({
        url:basePath+'/api/billing/billing_sizing_route/addSizing',
        type: 'post',
        data: {dataArr:JSON.stringify(data)},
        success: function (data) {
            if (data.code == 200) {
                msgSuccess(data.msg);
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}

function doCancel(){
    var n = $("#templateTree").tree("getSelected");
    if(n!=null){
        $("#templateTree").tree("select",n.target);    //相当于默认点击了一下第一个节点，执行onSelect方法
    }
}