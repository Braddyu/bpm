var normTemplate =
    '<li id="normLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}">'+
        '<div class="service-norm" style="height:46px; padding: 6px 3px;{{if normIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
            '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_scene" id="itemScene_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:86%;" />'+
            '{{if normIndex == 0}}<a href="javascript:appendNorm(\'unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}\')" id="addNormA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
        '</div>'+
        '<div class="scene_coefficient" style="height:46px; padding: 6px 3px;{{if normIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
            '<input type="text" class="form-control easyui-validatebox" name="item_scene_coefficient" id="sceneC_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
        '</div>'+
        '<div class="max_price" style="height:46px; padding: 6px 3px;{{if normIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
            '<input type="text" class="form-control easyui-validatebox" name="item_max_price" id="maxP_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
        '</div>'+
        '<div class="service-del" style="{{if normIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
            '<a href="javascript:removeTr({{index}},{{typeIndex}},{{codeIndex}},{{unitIndex}},{{normIndex}})" id="delA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
        '</div>'+
        '<input type="hidden" name="item_id" value="" id="itemId_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" />'+
    '</li>';

var unitTemplate =
    '<li id="unitLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
        '<div class="service-unit" style="height:46px; padding: 6px 3px;{{if unitIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
            '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_unit" id="itemUnit_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}" value="" style="height:34px;width:82%;" />'+
            '{{if unitIndex == 0}}<a href="javascript:appendUnit(\'codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}\')" id="addUnitA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
        '</div>'+
        '<ul class="service-unit-child" id="unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
            '<li id="normLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}">'+
                '<div class="service-norm" style="height:46px; padding: 6px 3px;{{if unitIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                    '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_scene" id="itemScene_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:86%;" />'+
                    '{{if normIndex == 0}}<a href="javascript:appendNorm(\'unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}\')" id="addNormA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                '</div>'+
                '<div class="scene_coefficient" style="height:46px; padding: 6px 3px;{{if unitIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                    '<input type="text" class="form-control easyui-validatebox" name="item_scene_coefficient" id="sceneC_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
                '</div>'+
                '<div class="max_price" style="height:46px; padding: 6px 3px;{{if unitIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                    '<input type="text" class="form-control easyui-validatebox" name="item_max_price" id="maxP_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
                '</div>'+
                '<div class="service-del" style="{{if unitIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                    '<a href="javascript:removeTr({{index}},{{typeIndex}},{{codeIndex}},{{unitIndex}},{{normIndex}})" id="delA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
                '</div>'+
                '<input type="hidden" name="item_id" value="" id="itemId_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" />'+
            '</li>'+
        '</ul>'+
    '</li>';

var codeTemplate =
    '<li id="codeLi_{{index}}_{{typeIndex}}_{{codeIndex}}">'+
        '<div class="service-code-and-name">'+
            '<div class="service-code" style="height:46px; padding: 6px 3px;{{if codeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                '<input type="text" class="easyui-validatebox" data-options="required:true" name="item_code" id="itemCode_{{index}}_{{typeIndex}}_{{codeIndex}}" value="" style="height:34px;width:100%;" />'+
            '</div>'+
            '<div class="service-name" style="height:46px; padding: 6px 3px;{{if codeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                '<input type="text" class="easyui-validatebox" data-options="required:true" name="item_name" id="itemName_{{index}}_{{typeIndex}}_{{codeIndex}}" value="" style="height:34px;width:90%;" />'+
                '{{if codeIndex == 0}}<a href="javascript:appendCode(\'typeChild_{{index}}_{{typeIndex}}\')" id="addCodeA_{{index}}_{{typeIndex}}_{{codeIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
            '</div>'+
        '</div>'+
        '<ul class="code-name-child" id="codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}">'+
            '<li id="unitLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
                '<div class="service-unit" style="height:46px; padding: 6px 3px;{{if codeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                    '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_unit" id="itemUnit_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}" value="" style="height:34px;width:82%;" />'+
                    '{{if unitIndex == 0}}<a href="javascript:appendUnit(\'codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}\')" id="addUnitA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                '</div>'+
                '<ul class="service-unit-child" id="unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
                    '<li id="normLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}">'+
                        '<div class="service-norm" style="height:46px; padding: 6px 3px;{{if codeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_scene" id="itemScene_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:86%;" />'+
                            '{{if normIndex == 0}}<a href="javascript:appendNorm(\'unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}\')" id="addNormA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                        '</div>'+
                        '<div class="scene_coefficient" style="height:46px; padding: 6px 3px;{{if codeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<input type="text" class="form-control easyui-validatebox" name="item_scene_coefficient" id="sceneC_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
                        '</div>'+
                        '<div class="max_price" style="height:46px; padding: 6px 3px;{{if codeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<input type="text" class="form-control easyui-validatebox" name="item_max_price" id="maxP_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
                        '</div>'+
                        '<div class="service-del" style="{{if codeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<a href="javascript:removeTr({{index}},{{typeIndex}},{{codeIndex}},{{unitIndex}},{{normIndex}})" id="delA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
                        '</div>'+
                        '<input type="hidden" name="item_id" value="" id="itemId_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" />'+
                    '</li>'+
                '</ul>'+
            '</li>'+
        '</ul>'+
    '</li>';

var typeTemplate =
    '<li id="typeLi_{{index}}_{{typeIndex}}">'+
        '<div class="work-order-type-box" style="height: 46px; padding:6px 3px;{{if typeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
            '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="type_id" id="typeId_{{index}}_{{typeIndex}}" value="" style="height:34px; width:100%;" />'+
        '</div>'+
        '<ul class="work-order-child" id="typeChild_{{index}}_{{typeIndex}}">'+
            '<li id="codeLi_{{index}}_{{typeIndex}}_{{codeIndex}}">'+
                '<div class="service-code-and-name">'+
                    '<div class="service-code" style="height:46px; padding: 6px 3px;{{if typeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                        '<input type="text" class="easyui-validatebox" data-options="required:true" name="item_code" id="itemCode_{{index}}_{{typeIndex}}_{{codeIndex}}" value="" style="height:34px;width:100%;" />'+
                    '</div>'+
                    '<div class="service-name" style="height:46px; padding: 6px 3px;{{if typeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                        '<input type="text" class="easyui-validatebox" data-options="required:true" name="item_name" id="itemName_{{index}}_{{typeIndex}}_{{codeIndex}}" value="" style="height:34px;width:90%;" />'+
                        '{{if codeIndex == 0}}<a href="javascript:appendCode(\'typeChild_{{index}}_{{typeIndex}}\')" id="addCodeA_{{index}}_{{typeIndex}}_{{codeIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                    '</div>'+
                '</div>'+
                '<ul class="code-name-child" id="codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}">'+
                    '<li id="unitLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
                        '<div class="service-unit" style="height:46px; padding: 6px 3px;{{if typeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                            '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_unit" id="itemUnit_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}" value="" style="height:34px;width:82%;" />'+
                            '{{if unitIndex == 0}}<a href="javascript:appendUnit(\'codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}\')" id="addUnitA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                        '</div>'+
                        '<ul class="service-unit-child" id="unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
                            '<li id="normLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}">'+
                                '<div class="service-norm" style="height:46px; padding: 6px 3px;{{if typeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                    '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_scene" id="itemScene_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:86%;" />'+
                                    '{{if normIndex == 0}}<a href="javascript:appendNorm(\'unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}\')" id="addNormA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                                '</div>'+
                                '<div class="scene_coefficient" style="height:46px; padding: 6px 3px;{{if typeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                    '<input type="text" class="form-control easyui-validatebox" name="item_scene_coefficient" id="sceneC_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
                                '</div>'+
                                '<div class="max_price" style="height:46px; padding: 6px 3px;{{if typeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                    '<input type="text" class="form-control easyui-validatebox" name="item_max_price" id="maxP_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
                                '</div>'+
                                '<div class="service-del" style="{{if typeIndex > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                    '<a href="javascript:removeTr({{index}},{{typeIndex}},{{codeIndex}},{{unitIndex}},{{normIndex}})" id="delA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
                                '</div>'+
                                '<input type="hidden" name="item_id" value="" id="itemId_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" />'+
                            '</li>'+
                        '</ul>'+
                    '</li>'+
                '</ul>'+
            '</li>'+
        '</ul>'+
    '</li>';

var majorTemplate =
    '<li id="professionLi_{{index}}" data-flag="tpl_{{tpl_id}}_major_{{profession_id}}">'+
        '<div class="profession-box" style="height: 46px; padding:6px 3px;{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
            '<p>{{profession_name}}</p>'+
            '<input type="hidden" name="tpl_id" id="tplId_{{index}}" value="{{tpl_id}}" style="height:34px; width:100%;" />'+
            '<input type="hidden" name="profession_id" id="majorId_{{index}}" value="{{profession_id}}" style="height:34px; width:100%;" />'+
        '</div>'+
        '<ul id="majorChild_{{index}}">'+
            '<li id="typeLi_{{index}}_{{typeIndex}}">'+
                '<div class="work-order-type-box" style="height: 46px; padding:6px 3px;{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                    '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="type_id" id="typeId_{{index}}_{{typeIndex}}" value="" style="height:34px; width:100%;" />'+
                '</div>'+
                '<ul class="work-order-child" id="typeChild_{{index}}_{{typeIndex}}">'+
                    '<li id="codeLi_{{index}}_{{typeIndex}}_{{codeIndex}}">'+
                        '<div class="service-code-and-name">'+
                            '<div class="service-code" style="height:46px; padding: 6px 3px;{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                '<input type="text" class="easyui-validatebox" data-options="required:true" name="item_code" id="itemCode_{{index}}_{{typeIndex}}_{{codeIndex}}" value="" style="height:34px;width:100%;" />'+
                            '</div>'+
                            '<div class="service-name" style="height:46px; padding: 6px 3px;{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                '<input type="text" class="easyui-validatebox" data-options="required:true" name="item_name" id="itemName_{{index}}_{{typeIndex}}_{{codeIndex}}" value="" style="height:34px;width:90%;" />'+
                                '{{if codeIndex == 0}}<a href="javascript:appendCode(\'typeChild_{{index}}_{{typeIndex}}\')" id="addCodeA_{{index}}_{{typeIndex}}_{{codeIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                            '</div>'+
                        '</div>'+
                        '<ul class="code-name-child" id="codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}">'+
                            '<li id="unitLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
                                '<div class="service-unit" style="height:46px; padding: 6px 3px;{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                    '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_unit" id="itemUnit_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}" value="" style="height:34px;width:82%;" />'+
                                    '{{if unitIndex == 0}}<a href="javascript:appendUnit(\'codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}\')" id="addUnitA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                                '</div>'+
                                '<ul class="service-unit-child" id="unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
                                    '<li id="normLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}">'+
                                        '<div class="service-norm" style="height:46px; padding: 6px 3px;{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                            '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_scene" id="itemScene_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:86%;" />'+
                                            '{{if normIndex == 0}}<a href="javascript:appendNorm(\'unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}\')" id="addNormA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                                        '</div>'+
                                        '<div class="scene_coefficient" style="height:46px; padding: 6px 3px;{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                            '<input type="text" class="form-control easyui-validatebox" name="item_scene_coefficient" id="sceneC_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
                                        '</div>'+
                                        '<div class="max_price" style="height:46px; padding: 6px 3px;{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                            '<input type="text" class="form-control easyui-validatebox" name="item_max_price" id="maxP_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="" style="height:34px;width:100%;" />'+
                                        '</div>'+
                                        '<div class="service-del" style="{{if index > 0}} border-top: 1px solid #d5d5d5;{{/if}}">'+
                                            '<a href="javascript:removeTr({{index}},{{typeIndex}},{{codeIndex}},{{unitIndex}},{{normIndex}})" id="delA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
                                        '</div>'+
                                        '<input type="hidden" name="item_id" value="" id="itemId_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" />'+
                                    '</li>'+
                                '</ul>'+
                            '</li>'+
                        '</ul>'+
                    '</li>'+
                '</ul>'+
            '</li>'+
        '</ul>'+
    '</li>';

var showTemplate=
'{{each majorArr as major index}}'+
    '<li id="professionLi_{{index}}" data-flag="tpl_{{major.tpl_id}}_major_{{major.profession_id}}">'+
        '<div class="profession-box" style="height: 46px; padding:6px 3px; border-top: 1px solid #d5d5d5;">'+
            '<p>{{profession_name}}</p>'+
            '<input type="hidden" name="tpl_id" id="tplId_{{index}}" value="{{major.tpl_id}}" style="height:34px; width:100%;" />'+
            '<input type="hidden" name="profession_id" id="majorId_{{index}}" value="{{major.profession_id}}" style="height:34px; width:100%;" />'+
        '</div>'+
        '<ul id="majorChild_{{index}}">'+
        '{{each major.children as type typeIndex}}'+
            '<li id="typeLi_{{index}}_{{typeIndex}}">'+
                '<div class="work-order-type-box" style="height: 46px; padding:6px 3px; border-top: 1px solid #d5d5d5;">'+
                    '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="type_id" id="typeId_{{index}}_{{typeIndex}}" value="{{type.type_id}}" style="height:34px; width:100%;" />'+
                '</div>'+
                '<ul class="work-order-child" id="typeChild_{{index}}_{{typeIndex}}">'+
                '{{each type.children as code codeIndex}}'+
                    '<li id="codeLi_{{index}}_{{typeIndex}}_{{codeIndex}}">'+
                        '<div class="service-code-and-name">'+
                            '<div class="service-code" style="height:46px; padding: 6px 3px; border-top: 1px solid #d5d5d5;">'+
                                '<input type="text" class="easyui-validatebox" data-options="required:true" name="item_code" id="itemCode_{{index}}_{{typeIndex}}_{{codeIndex}}" value="{{code.item_code}}" style="height:34px;width:100%;" />'+
                            '</div>'+
                            '<div class="service-name" style="height:46px; padding: 6px 3px; border-top: 1px solid #d5d5d5;">'+
                                '<input type="text" class="easyui-validatebox" data-options="required:true" name="item_name" id="itemName_{{index}}_{{typeIndex}}_{{codeIndex}}" value="{{code.item_name}}" style="height:34px;width:90%;" />'+
                                '{{if codeIndex ==0}}<a href="javascript:appendCode(\'typeChild_{{index}}_{{typeIndex}}\')" id="addCodeA_{{index}}_{{typeIndex}}_{{codeIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                            '</div>'+
                        '</div>'+
                        '<ul class="code-name-child" id="codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}">'+
                            '{{each code.children as unit unitIndex}}'+
                            '<li id="unitLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
                                '<div class="service-unit" style="height:46px; padding: 6px 3px; border-top: 1px solid #d5d5d5;">'+
                                    '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_unit" id="itemUnit_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}" value="{{unit.item_unit}}" style="height:34px;width:82%;" />'+
                                    '{{if unitIndex ==0}}<a href="javascript:appendUnit(\'codeChild_{{index}}_{{typeIndex}}_{{codeIndex}}\')" id="addUnitA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                                '</div>'+
                                '<ul class="service-unit-child" id="unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}">'+
                                    '{{each unit.children as norm normIndex}}'+
                                    '<li id="normLi_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}">'+
                                        '<div class="service-norm" style="height:46px; padding: 6px 3px; border-top: 1px solid #d5d5d5;">'+
                                        '<input type="text" class="form-control easyui-validatebox easyui-combobox" name="item_scene" id="itemScene_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="{{norm.item_scene}}" style="height:34px;width:86%;" />'+
                                        '{{if normIndex ==0}}<a href="javascript:appendNorm(\'unitChild_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}\')" id="addNormA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}"><i class="fa fa-plus"></i></a>{{/if}}'+
                                        '</div>'+
                                        '<div class="scene_coefficient" style="height:46px; padding: 6px 3px; border-top: 1px solid #d5d5d5;">'+
                                        '<input type="text" class="form-control easyui-validatebox" name="item_scene_coefficient" id="sceneC_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="{{norm.item_scene_coefficient}}" style="height:34px;width:100%;" />'+
                                        '</div>'+
                                        '<div class="max_price" style="height:46px; padding: 6px 3px; border-top: 1px solid #d5d5d5;">'+
                                        '<input type="text" class="form-control easyui-validatebox" name="item_max_price" id="maxP_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" value="{{norm.item_max_price}}" style="height:34px;width:100%;" />'+
                                        '</div>'+
                                        '<div class="service-del" style="border-top: 1px solid #d5d5d5;">'+
                                        '<a href="javascript:removeTr({{index}},{{typeIndex}},{{codeIndex}},{{unitIndex}},{{normIndex}})" id="delA_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}"><i class="fa fa-remove"></i></a>'+
                                        '</div>'+
                                        '<input type="hidden" name="item_id" value="{{norm.item_id}}" id="itemId_{{index}}_{{typeIndex}}_{{codeIndex}}_{{unitIndex}}_{{normIndex}}" />'+
                                    '</li>'+
                                    '{{/each}}'+
                                '</ul>'+
                            '</li>'+
                            '{{/each}}'+
                        '</ul>'+
                    '</li>'+
                '{{/each}}'+
                '</ul>'+
            '</li>'+
            '{{/each}}'+
        '</ul>'+
    '</li>'+
'{{/each}}';

// 服务项目计价单位
var service_type_unit;
// 维护类别
var aptitude_maintain_professional;
// 服务项目场景
var billing_template_scene;
// 场景调整系数
var billing_tpl_scene_factor;
function openTemplatePage(title, value, callback) {
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
// 添加维护类别
function appendMajor(profession_id, profession_name, tpl_id,parent_id){
    $('#profession_child').empty();
    var index = $("li[id^='professionLi_']").length;
    var typeIndex = $("li[id^='typeLi_"+index+"']").length;
    var codeIndex = $("li[id^='codeLi_"+index+"_"+typeIndex+"']").length;
    var unitIndex = $("li[id^='unitLi_"+index+"_"+typeIndex+"_"+codeIndex+"']").length;
    var normIndex = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"']").length;
    var data = {index: index,
        typeIndex:typeIndex,
        codeIndex:codeIndex,
        unitIndex:unitIndex,
        normIndex:normIndex,
        profession_id:profession_id,
        profession_name:profession_name,
        tpl_id:tpl_id
    };
    var render = template.compile(majorTemplate);
    var html = render(data);
    $('#profession_child').html(html);
    $.parser.parse('#professionLi_'+index);
    getWorkOrderType(profession_id, index, typeIndex,parent_id);
    setItemUnit(index, typeIndex, codeIndex, unitIndex);
    setItemScene(index, typeIndex, codeIndex, unitIndex, normIndex);
    //setSceneFactor(index, typeIndex, codeIndex, unitIndex, normIndex);
}
// 添加工单类型
function appendWorkOrderType(){
    var node = $('#templateTree').tree("getSelected");
    var childrenNodes = $('#templateTree').tree('getChildren',node.target);
    if(childrenNodes.length >0){
        msgError('提示,请先在左侧选择一个维护类别');
        return;
    }
    var profession_id = node.id;
    var tpl_id = node.attributes.tpl_id;
    var $majorLi = $("li[data-flag='tpl_"+tpl_id+"_major_"+profession_id+"']");
    var majorNodeId =  $majorLi.attr("id");
    var index = majorNodeId.split("_")[1];
    var typeIndex = $("li[id^='typeLi_"+index+"']").length;
    var codeIndex = $("li[id^='codeLi_"+index+"_"+typeIndex+"']").length;
    var unitIndex = $("li[id^='unitLi_"+index+"_"+typeIndex+"_"+codeIndex+"']").length;
    var normIndex = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"']").length;
    var data = {index: index,
        typeIndex:typeIndex,
        codeIndex:codeIndex,
        unitIndex:unitIndex,
        normIndex:normIndex
    };
    var render = template.compile(typeTemplate);
    var html = render(data);
    $('#majorChild_'+index).append(html);
    // 设定维护类别列高度
    var length = $("li[id^='normLi_"+index+"_']").length;
    $majorLi.find(".profession-box").css("height",46*length);
    $majorLi.find("p").css("padding-top", 46*length/2);
    // easyui解析
    $.parser.parse('#typeLi_'+index+"_"+typeIndex);
    // 设定工单类型下拉框值
    getWorkOrderType(profession_id, index, typeIndex,node._id);
    // 设定单位下拉框值
    setItemUnit(index, typeIndex, codeIndex, unitIndex);
    // 设定场景下拉框值
    setItemScene(index, typeIndex, codeIndex, unitIndex, normIndex);
    //setSceneFactor(index, typeIndex, codeIndex, unitIndex, normIndex);
}
// 添加
function appendCode(nodeIdName){
    var indexArr = nodeIdName.substring(10).split("_");
    var index = indexArr[0];
    var typeIndex = indexArr[1];
    var codeIndex = $("li[id^='codeLi_"+index+"_"+typeIndex+"']").length;
    var unitIndex = $("li[id^='unitLi_"+index+"_"+typeIndex+"_"+codeIndex+"']").length;
    var normIndex = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"']").length;
    var data = {index: index,
        typeIndex:typeIndex,
        codeIndex:codeIndex,
        unitIndex:unitIndex,
        normIndex:normIndex
    };
    var render = template.compile(codeTemplate);
    var html = render(data);
    $('#'+nodeIdName).append(html);
    // 设定维护类别列高度
    var length = $("li[id^='normLi_"+index+"_']").length;
    var $majorLi = $("#professionLi_"+index);
    $majorLi.find(".profession-box").css("height",46*length);
    $majorLi.find("p").css("padding-top", 46*length/2);
    // 设定工单类型列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_']").length;
    $("#typeLi_"+index+"_"+typeIndex).find(".work-order-type-box").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});
    // easyui解析
    $.parser.parse('#codeLi_'+index+"_"+typeIndex+"_"+codeIndex);
    // 设定单位下拉框值
    setItemUnit(index, typeIndex, codeIndex, unitIndex);
    // 设定场景下拉框值
    setItemScene(index, typeIndex, codeIndex, unitIndex, normIndex);
    //setSceneFactor(index, typeIndex, codeIndex, unitIndex, normIndex);
}
// 添加计费单位
function appendUnit(nodeIdName){
    var node = $('#templateTree').tree("getSelected");
    var childrenNodes = $('#templateTree').tree('getChildren',node.target);
    if(childrenNodes.length >0){
        return;
    }
    var indexArr = nodeIdName.substring(10).split("_");
    var index = indexArr[0];
    var typeIndex = indexArr[1];
    var codeIndex = indexArr[2];
    var unitIndex = $("li[id^='unitLi_"+index+"_"+typeIndex+"_"+codeIndex+"']").length;
    var normIndex = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"']").length;
    var data = {index: index,
        typeIndex:typeIndex,
        codeIndex:codeIndex,
        unitIndex:unitIndex,
        normIndex:normIndex
    };
    var render = template.compile(unitTemplate);
    var html = render(data);
    $('#'+nodeIdName).append(html);
    // 设定维护类别列高度
    var length = $("li[id^='normLi_"+index+"_']").length;
    var $majorLi = $("#professionLi_"+index);
    $majorLi.find(".profession-box").css("height",46*length);
    $majorLi.find("p").css("padding-top", 46*length/2);
    // 设定工单类型列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_']").length;
    $("#typeLi_"+index+"_"+typeIndex).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px" });
    // 设定编码和名称列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_']").length;
    $("#codeLi_"+index+"_"+typeIndex+"_"+codeIndex).find("div>div").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});
    // easyui解析
    $.parser.parse('#unitLi_'+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex);
    // 设定单位下拉框值
    setItemUnit(index, typeIndex, codeIndex, unitIndex);
    // 设定场景下拉框值
    setItemScene(index, typeIndex, codeIndex, unitIndex, normIndex);
    // 设定场景系数下拉框值
    //setSceneFactor(index, typeIndex, codeIndex, unitIndex, normIndex);
}

function appendNorm(nodeIdName){
    var indexArr = nodeIdName.substring(10).split("_");
    var index = indexArr[0];
    var typeIndex = indexArr[1];
    var codeIndex = indexArr[2];
    var unitIndex = indexArr[3];
    var normIndex = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"']").length;
    var data = {index: index,
        typeIndex:typeIndex,
        codeIndex:codeIndex,
        unitIndex:unitIndex,
        normIndex:normIndex
    };
    var render = template.compile(normTemplate);
    var html = render(data);
    $('#'+nodeIdName).append(html);
    // 设定维护类别列高度
    var length = $("li[id^='normLi_"+index+"_']").length;
    var $majorLi = $("#professionLi_"+index);
    $majorLi.find(".profession-box").css("height",46*length);
    $majorLi.find("p").css("padding-top", 46*length/2);
    // 设定工单类型列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_']").length;
    $("#typeLi_"+index+"_"+typeIndex).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px" });
    // 设定编码和名称列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_']").length;
    $("#codeLi_"+index+"_"+typeIndex+"_"+codeIndex).find("div>div").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});
    // 设定单位列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_']").length;
    $("#unitLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});

    $.parser.parse('#normLi_'+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_"+normIndex);
    setItemScene(index, typeIndex, codeIndex, unitIndex, normIndex);
    //setSceneFactor(index, typeIndex, codeIndex, unitIndex, normIndex);
}
function getSelectValue(callback) {
    var dictCode ="'"+Dict_Code.aptitude_maintain_professional+"','"
        +Dict_Code.service_type_unit+"','"
        +Dict_Code.billing_template_scene+"','"
        +Dict_Code.billing_tpl_scene_factor+"'";
    $.ajax({
        url: basePath + '/api/dictionary/dict_route/allDictAndAttr',
        type: 'get',
        data:{dict_code:dictCode},
        success: function (data) {
            $.each(data, function (i, r) {
                var result = r.children;
                if (r.dict_code == Dict_Code.aptitude_maintain_professional) {
                    aptitude_maintain_professional  =result;
                }
                if (r.dict_code == Dict_Code.service_type_unit) {
                    service_type_unit = result;
                }
                if(r.dict_code == Dict_Code.billing_template_scene){
                    billing_template_scene = result;
                }
                if(r.dict_code == Dict_Code.billing_tpl_scene_factor){
                    billing_tpl_scene_factor = result;
                }
            });
            if(typeof (callback) =="function"){
                callback();
            }
        }
    });
}
function getWorkOrderType(field_parent_value, index, typeIndex,parent_id){
    $.ajax({
        url: basePath+'/api/dictionary/dict_route/getChildren',
        type: 'get',
        data:{field_parent_value:field_parent_value,parent_id:parent_id},
        success: function (data) {
            $("#typeId_"+index+"_"+typeIndex).combobox({
                data: data,
                editable: false,
                valueField: 'field_value',
                textField: 'field_name',
                multiple: false,
                required: true
            });
        }
    });
}
function setItemUnit(index, typeIndex, codeIndex, unitIndex){
    $("#itemUnit_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex).combobox({
        data: service_type_unit,
        editable: false,
        valueField: 'field_value',
        textField: 'field_name',
        multiple: false,
        required: true
    });
}
function setItemScene(index, typeIndex, codeIndex, unitIndex, normIndex){
    $("#itemScene_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_"+normIndex).combobox({
        data: billing_template_scene,
        editable: false,
        valueField: 'field_value',
        textField: 'field_name',
        multiple: false,
        required: false
    });
}
function setSceneFactor(index, typeIndex, codeIndex, unitIndex, normIndex){
    $("#sceneC_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_"+normIndex).combobox({
        data: billing_tpl_scene_factor,
        editable: false,
        valueField: 'field_value',
        textField: 'field_name',
        multiple: false,
        required: false
    });
}
/*****************************************删除相关js*******************************************************/
function setNormLiAttr($normLi, idStr, index, typeIndex, codeIndex, unitIndex){
    $normLi.each(function(newNormIndex){
        var $norm = $(this);
        $norm.attr("id", idStr + newNormIndex);
        var idIndex=index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_"+newNormIndex;
        $norm.find("input[id^='itemScene_']").attr("id", "itemScene_" + idIndex);
        $norm.find("input[id^='sceneC_']").attr("id", "sceneC_" + idIndex);
        $norm.find("input[id^='sizeC_']").attr("id", "sizeC_" + idIndex);
        $norm.find("input[id^='maxP_']").attr("id", "maxP_" + idIndex);
        if(newNormIndex ==0){
            var $addNormA = $norm.find("a[id^='addNormA_']");
            if($addNormA.length >0){
                $addNormA.attr("id", "addNormA_"+idIndex);
                $addNormA.attr("href", 'javascript:appendNorm(\'unitChild_'+ index+'_'+typeIndex+'_'+codeIndex+'_'+unitIndex+'\')');
            } else{
                var html = '<a href="javascript:appendNorm(\'unitChild_'+ index+'_'+typeIndex+'_'+codeIndex+'_'+unitIndex+'\')" id="addNormA_'+index+'_'+typeIndex+'_'+codeIndex+'_'+unitIndex+'"><i class="fa fa-plus"></i></a>';
                $norm.find("div:first").append(html);
            }
        }

        var $delA = $norm.find("a[id^='delA_']");
        $delA.attr("id","delA_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_"+newNormIndex);
        $delA.attr("href", "javascript:removeTr("+index+", "+typeIndex+", "+codeIndex+", "+unitIndex+", "+newNormIndex+");");
    });
}
function setUnitLiAttr($unitLi, idStr, index, typeIndex, codeIndex){
    $unitLi.each(function(newUnitIndex) {
        var $unit = $(this);
        $unit.attr("id", idStr+newUnitIndex);
        var idIndex=index+"_" + typeIndex + "_" + codeIndex + "_" + newUnitIndex;
        $unit.find("input[id^='itemUnit_']").attr("id", "itemUnit_" + idIndex);
        if(newUnitIndex ==0){
            var $addUnitA = $unit.find("a[id^='addUnitA_']");
            if($addUnitA.length >0){
                $addUnitA.attr("id", "addUnitA_"+idIndex);
                $addUnitA.attr("href", 'javascript:appendUnit(\'codeChild_'+index+'_'+typeIndex+'_'+codeIndex+'\')');
            } else{
                var html = '<a href="javascript:appendUnit(\'codeChild_'+index+'_'+typeIndex+'_'+codeIndex+'\')" id="addUnitA_'+index+'_'+typeIndex+'_'+codeIndex+'_'+newUnitIndex+'"><i class="fa fa-plus"></i></a>';
                $unit.find("div:first").append(html);
            }
        }
        $unit.find("ul[id^='unitChild_']").attr("id", "unitChild_" + idIndex);

        var temp = "normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+newUnitIndex+"_";
        var $normLi = $("li[id^='"+temp+"']");
        setNormLiAttr($normLi, temp, index, typeIndex, codeIndex, newUnitIndex);
    });
}
function setCodeLiAttr($codeLi, idStr, index, typeIndex){
    $codeLi.each(function(newCodeIndex) {
        var $code = $(this);
        $code.attr("id", idStr + newCodeIndex);
        var idIndex = index+"_" + typeIndex + "_" +newCodeIndex;
        $code.find("input[id^='itemCode_']").attr("id", "itemCode_" + idIndex);
        $code.find("input[id^='itemName_']").attr("id", "itemName_" + idIndex);
        if(newCodeIndex ==0){
            var $addCodeA = $code.find("a[id^='addCodeA_']");
            if($addCodeA.length >0){
                $addCodeA.attr("id", "addCodeA_"+idIndex);
                $addCodeA.attr("href", 'javascript:appendCode(\'typeChild_'+index+'_'+typeIndex+'\')');
            } else{
                var html = '<a href="javascript:appendCode(\'typeChild_'+index+'_'+typeIndex+'\')" id="addCodeA_'+index+'_'+typeIndex+'_'+newCodeIndex+'"><i class="fa fa-plus"></i></a>';
                $code.find(".service-name").append(html);
            }
        }
        $code.find("ul[id^='codeChild_']").attr("id", "codeChild_" + idIndex);

        var temp = "unitLi_"+index+"_"+typeIndex+"_"+newCodeIndex+"_";
        var $unitLi = $("li[id^='"+temp+"']");
        setUnitLiAttr($unitLi, temp, index, typeIndex, newCodeIndex);
    });
}
function setTypeLiAttr($typeLi, idStr, index){
    $typeLi.each(function(newTypeIndex) {
        var $type = $(this);
        $type.attr("id", idStr+ newTypeIndex);
        var idIndex = index+"_" + newTypeIndex;
        $type.find("input[id^='typeId_']").attr("id", "typeId_" + idIndex);
        $type.find("ul[id^='typeChild_']").attr("id", "typeChild_" + idIndex);

        var temp = "codeLi_" + index + "_" + newTypeIndex + "_";
        var $codeLi = $("li[id^='"+temp+"']");
        setCodeLiAttr($codeLi, temp, index, newTypeIndex)
    });
}
// 删除行
function removeTr(index, typeIndex, codeIndex, unitIndex, normIndex) {
    //  删除指定场景以下的列
    var idStr ="normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_";
    var item_id = $("#"+idStr+normIndex).find("input[id^='itemId_']").val();
    $("#"+idStr+normIndex).remove();
    if(item_id !=null && item_id !=""){
        $.ajax({
            url:basePath+'/api/billing/billing_tpl_route/delItem?item_id='+item_id,
            type: 'post',
            success: function (data) {
                if (data.code == 200) {
                    msgSuccess(data.msg);
                } else {
                    msgError(data.msg+',错误代码:'+data.code);
                }
            }
        })
    }
    //
    var $normLi = $("li[id^='"+idStr+"']");
    if($normLi.length>0){
        setHeight(index, typeIndex, codeIndex, unitIndex, normIndex);
        setNormLiAttr($normLi, idStr, index, typeIndex, codeIndex, unitIndex);
    } else{
        //  删除指定单位以下的列
        idStr = "unitLi_"+index+"_"+typeIndex+"_"+codeIndex+"_";
        $("#"+idStr+unitIndex).remove();
        var $unitLi =$("li[id^='"+idStr+"']");
        if($unitLi.length>0){
            setHeight(index, typeIndex, codeIndex, unitIndex, normIndex);
            setUnitLiAttr($unitLi, idStr, index, typeIndex, codeIndex);
        } else{
            idStr = "codeLi_"+index+"_"+typeIndex+"_";
            $("#"+idStr+codeIndex).remove();
            var $codeLi = $("li[id^='"+idStr+"']");
            if($codeLi.length>0){
                setHeight(index, typeIndex, codeIndex, unitIndex, normIndex);
                setCodeLiAttr($codeLi, idStr, index, typeIndex);
            } else{
                idStr = "typeLi_"+index+"_";
                $("#"+idStr+typeIndex).remove();
                var  $typeLi =$("li[id^='"+idStr+"']");
                if($typeLi.length>0){
                    setHeight(index, typeIndex, codeIndex, unitIndex, normIndex);
                    setTypeLiAttr($typeLi, idStr, index);
                } else{
                    appendWorkOrderType();
                }
            }
        }
    }
}
function setHeight(index, typeIndex, codeIndex, unitIndex, normIndex){
    // 设定维护类别列高度
    var length = $("li[id^='normLi_"+index+"_']").length;
    var $majorLi = $("#professionLi_"+index);
    $majorLi.find(".profession-box").css("height",46*length);
    $majorLi.find("p").css("padding-top", 46*length/2);
    // 设定工单类型列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_']").length;
    $("#typeLi_"+index+"_"+typeIndex).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px" });
    // 设定编码和名称列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_']").length;
    $("#codeLi_"+index+"_"+typeIndex+"_"+codeIndex).find("div>div").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});
    // 设定单位列高度
    length = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_']").length;
    $("#unitLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex).find("div:first").css({height:46*length, padding:(46*length -34)/2 + "px 3px"});

    /*// 设定维护类别列高度
     var length = $("li[id^='normLi_"+index+"_']").length;
     $("#professionLi_"+index).find(".profession-box").css("height",46*length);
     // 设定编码和名称列高度
     length = $("li[id^='normLi_"+index+"_"+typeIndex+"_']").length;
     $("#typeLi_"+index+"_"+typeIndex).find("div:first").css("height",46*length);
     // 设定编码和名称列高度
     length = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_']").length;
     $("#codeLi_"+index+"_"+typeIndex+"_"+codeIndex).find("div>div").css("height",46*length);
     // 设定单位列高度
     length = $("li[id^='normLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex+"_']").length;
     $("#unitLi_"+index+"_"+typeIndex+"_"+codeIndex+"_"+unitIndex).find("div:first").css("height",46*length);*/
}