// 关闭窗口
function closeDialog() {
    $('#paramModal').dialog('close');
    clear();
}
// 关闭窗口
function closeCatalogDialog() {
    $('#catalogModal').dialog('close');
    clearCatalogForm();
}

// 清空新增表单数据
function clear() {
    $('#paramForm').form('reset');
}

// 清空新增表单数据
function clearCatalogForm() {
    $('#catalogForm').form('reset');
}

/*
复制功能的实现
 */
function copyData(){
    var selectedNode = $('#catalogTree').tree('getSelected');
    if (!selectedNode) {
        msgError('提示,请选择一条数据进行复制操作');
        return false;
    }
    if(selectedNode.id==0){
        msgError('提示,顶级模板不能复制');
        return false;
    }
    var url = basePath+'/api/assess_mgt/assess_tpl/norm_define_route/normTypeTree';
    $("#copy_pid").combotree({
        method:'get',
        url:url,
        editable:false
    });
    $("#copyParam input[name='copy_id']").val(selectedNode.id);
    $("#copyParam input[name='name']").val(selectedNode.text);
    $('#copyModal').show();
    $('#copyModal').mydialog({
        title:'复制选中项',
        width: 600,
        height: 400,
        top:20,
        modal: true,
        myButtons:[
            {
                text:'确定',
                btnCls:'btn btn-blue',
                handler:function(){
                    copySubmit();
                }
            },
            {
                text:'关闭',
                btnCls:'btn btn-danger',
                handler:function(){
                    $('#copyModal').dialog('close');
                    $('#copyParam').form('reset');
                }
            }
        ]
    });
}

/*
提交复制进行处理
 */
function copySubmit(){
    // 验证表单
    var validate = $('#copyParam').form('validate');
    if(!validate) {
        return false;
    }
    var params = $('#copyParam').serializeJson();
    var url = basePath+'/api/assess_mgt/assess_tpl/norm_define_route/copyData';
    $.ajax({
        url:url,
        data:params,
        type:'post',
        dataType:'json',
        success:function(result){
            if(result.success){
                msgSuccess('提示，复制数据成功');
                $('#copyModal').dialog('close');
                $('#copyParam').form('reset');
                initLeftCatalogTree();
                doSearch();
                reloadTree();

            }else{
                msgSuccess('提示，复制数据失败');
                $('#copyModal').dialog('close');
                $('#copyParam').form('reset');
            }
        },
        error:function(){
            msgSuccess('服务器连接异常，请稍后重试');
            $('#copyModal').dialog('close');
            $('#copyParam').form('reset');
        }
    });
}

//点击最左面删除按钮
function toDeleteCatalog(){
    var selectedNode = $('#catalogTree').tree('getSelected');
    if (!selectedNode) {
        msgError('提示,请选择一条数据再进行删除');
        return false;
    }
    if(selectedNode.id==0){
        msgError('提示,顶级模板不能删除');
        return false;
    }
    $.messager.confirm('确认','删除后，该项下面所有子项都删除，是否继续执行该操作？',function(r){
        if (r){
            var url = basePath+'/api/assess_mgt/assess_tpl/norm_define_route/delData?id='+selectedNode.id;
            $.ajax({
                url:url,
                type:'post',
                dataType:'json',
                success:function(result){
                    if(result.success){
                        msgSuccess('删除数据成功');
                        initLeftCatalogTree();

                    }else{
                        msgError('删除数据失败');
                    }
                },
                error:function(){
                    msgError('服务器连接失败，请稍后重试');
                }
            });
        }
    });

}
//最右面的删除
function toDelete(){
    // 获得选择行
    var rows = $('#paramdatatable').datagrid('getChecked');
    if (rows.length ==0) {
        msgError('提示,请选择一条数据再进行删除');
        return false;
    }
    var ids ="";
    for(var i=0;i<rows.length;i++){
        ids += "'"+rows[i].id+"',";
    }
    ids = ids.substring(0,ids.lastIndexOf(","));
    alert(ids);
    $.messager.confirm('确认','你确定要删除所选择的数据',function(r){
        if (r){
            var url = basePath+'/api/assess_mgt/assess_tpl/norm_define_route/delData';
            $.ajax({
                url:url,
                data:{ids:ids},
                type:'post',
                dataType:'json',
                success:function(result){
                    if(result.success){
                        msgSuccess('删除数据成功');
                        doSearch();
                    }else{
                        msgError('删除数据失败');
                    }
                },
                error:function(){
                    msgError('服务器连接失败，请稍后重试');
                }
            });
        }
    });
}
// 打开页面
function openPage(title, value, callback) {
    var selectedNode = $('#catalogTree').tree('getSelected');
    if (!selectedNode) {
        msgError('提示,请先在左侧选择一个指标类别');
        return false;
    }
    $('#norm_type_id').combotree('reload');
    $('#norm_type_id').combotree('setValue', selectedNode.id);

    $('#paramModal').show();
    $('#paramModal').mydialog({
        title:title,
        width: 600,
        height: 650,
        top:20,
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
                    closeDialog();
                }
            }
        ]
    });
}

// 打开页面
function openCatalogPage(title, value, callback) {
    /*$('#maintain_id').combobox({
        url:basePath+'/api/data_library/meeting/meeting_routes/queryDic?type=maintain',
        editable:false
    });*/
    $('#catalogModal').show();
    $('#catalogModal').mydialog({
        title:title,
        width: 600,
        height: 500,
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
var curNormTypeId;
$(document).ready(function() {
    initLeftCatalogTree();
    $('#paramdatatable').datagrid({
        url:basePath+'/api/assess_mgt/assess_tpl/norm_define_route/normTypeParam',
        queryParams:{id:curNormTypeId},
        method: 'post',
        rownumbers: true,
        striped: true,
        fitColumns: false,
        toolbar: '#toolbar2',
        fit: true,
        border: false,
        singleSelect: true,
        selectOnCheck: false,
        nowrap:false,
        columns:[[
            {"field":'id',checkbox:true},
            {"field": "name","title":"项目","width":"20%"},
            {"field": "access_require","title":"要求","width":"30%"},
            {"field": "mod_stan","title":"评分标准","width":"30%"},
            {"field": "access_level","title":"考核级别","width":"8%",formatter:function(v,r,i){if(v==1){return '省级'}else if(v==2){return '市级'}else{return '区县级'}}},
            {"field": "score","title":"基分/权重","width":"8%"},
            {"field": "version","title":"版本号","width":"10%",formatter:function(v,r,i){if(v=='null'||v=='undefined'){return '';}else{return v;}}},
            {"field": "status","title":"状态","width":"8%",
                "formatter":function (value, rowData,rowIndex) {
                    if(value == 1){
                        return '<span class="success">启用</span>';
                    }else if(value == 2){
                        return '<span class="danger">禁用</span>';
                    }
                }
            }
        ]],
        onLoadSuccess:function(json) {
            if(!json.success) {
                msgError(json.msg + ',错误代码:' + json.code);
            }
        },
        onLoadError:function() {
            msgError('加载数据出现时发生错误,请稍候重试...');
        },
        onCheck:function(rowIndex,rowData){
        },
        pagination:true,
        loadMsg:'正在加载...'
    });
    $('#pid').combotree({
        method:'get',
        url:basePath+'/api/assess_mgt/assess_tpl/norm_define_route/normTypeTree',
        editable:false,
        onChange:function(newValue,oldValue){
            if(newValue==0){
                $('#maintain_id').parent('div').show();
            }else{
                $('#maintain_id').parent('div').hide();
            }
        }
    });
    $('#norm_type_id').combotree({
        method:'get',
        url:basePath+'/api/assess_mgt/assess_tpl/norm_define_route/normTypeTree',
        editable:false
    });
    $('#norm_type_id2').combotree({
        method:'get',
        url:basePath+'/api/assess_mgt/assess_tpl/norm_define_route/normTypeTree',
        editable:false
    });
});

/*function initLeftCatalogTree() {
    $('#catalogTree').tree({
        method:'get',
        url:basePath+'/api/assess_mgt/assess_tpl/norm_define_route/normTypeTree',
        onClick:function(node) {
                curNormTypeId = node.id;
                $('#paramdatatable').datagrid('load',{
                    id:curNormTypeId
                });
        }
    });
}*/
function initLeftCatalogTree() {
    var menuHtml ='<div id="customMenu">' +
        '<div style="overflow:hidden;width:120px; height:60px;left:0px; top:0px;" class="easyui-menu menu-top menu" id="orgTreeMenu">'+
        '<div style="height:25px;line-height:25px;text-align: center" name="copyBtn" id="copyBtn">复制</div>'+
        '<div style="height:25px;line-height:25px;text-align: center" name="enableBtn" id="enableBtn">启用</div>'+
        '</div>' +
        '</div>';
    $("body").append(menuHtml);
    $.parser.parse("#customMenu");

    $('#catalogTree').tree({
        method:'get',
        url:basePath+'/api/assess_mgt/assess_tpl/norm_define_route/normTypeTree',
        onClick:function(node) {
            curNormTypeId = node.id;
            $('#paramdatatable').datagrid('load',{
                id:curNormTypeId
            });
        },
        onContextMenu: function(e, node){
            // 右键事件
            e.preventDefault();
            var _copyBtn = $('#copyBtn');
            var _enableBtn = $('#enableBtn');
            $('#orgTreeMenu').menu('show', {
                left: e.clientX,
                top: e.clientY,
                noline: true,
                duration: 500,
                onShow: function () {
                    $(this).menu('enableItem', _copyBtn);
                    $(this).menu('enableItem', _enableBtn);
                    $('#orgTreeMenu .menu-line').remove();
                },
                onClick: function (item) {
                    // 复制
                    if ("copyBtn" == item.name) {
                        copyData();
                    }
                    // 启用
                    if ("enableBtn" == item.name) {
                        alert('暂时没有做');
                    }
                }
            });
        }
    });
}

function doSearch() {
    var selectedNode = $('#catalogTree').tree('getSelected');
    var id = (!selectedNode)?0:selectedNode.id;
    $('#paramdatatable').datagrid('reload',{
        'id':id,
        'name':$.trim($('#filter_name').val())
    });
}

// 新增数据
function doAdd(value) {

    // 验证表单
    var validate = $('#paramForm').form('validate');
    if(!validate) {
        return false;
    }
    $.ajax({
        url: basePath+'/api/assess_mgt/assess_tpl/norm_define_route/addNormType',
        type: 'post',
        data: $('#paramForm').serializeJson(),
        success: function (data) {
            if(data.success) {
                msgSuccess(data.msg);
                closeDialog();
                doSearch();
            }
            else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}

// 打开修改页面
function toEdit() {

    // 获得选择行
    var rows = $('#paramdatatable').datagrid('getChecked');
    if (rows.length != 1) {
        msgError('提示,请选择一条数据再进行修改');
        return false;
    }
    var id = rows[0].id;
    $('#paramForm').form('load',rows[0]);
    $('#norm_type_id').combotree('reload');
    $('#norm_type_id').combotree('setValue',rows[0].pid);
    openPage("修改参数", id, doEdit);
}
// 修改数据
function doEdit(value) {
    // 验证表单
    var validate = $('#paramForm').form('validate');
    if(!validate) {
        return false;
    }
    $.ajax({
        url: basePath+'/api/assess_mgt/assess_tpl/norm_define_route/editNormType?id='+value,
        type: 'post',
        data: $('#paramForm').serializeJson(),
        success: function (data) {
            if(data.success) {
                msgSuccess(data.msg);
                closeDialog();
                doSearch();
                clear();
            }
            else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });

}

// 打开修改类别页面
function toEditCatalog() {
    var selectedNode = $('#catalogTree').tree('getSelected');
    if (!selectedNode||selectedNode.id==0) {
        msgError('提示,请选择一条数据再进行修改');
        return false;
    }
    var id = selectedNode.id;
    $.ajax({
        url: basePath+'/api/assess_mgt/assess_tpl/norm_define_route/normType?id='+id,
        type: 'get',
        success: function (data) {
            if(data.success) {
                //$('#catalogForm').form('load',data.data[0]);
                $("#catalogForm input[name='name']").val(data.data[0].name);
                $("#catalogForm input[name='score']").val(data.data[0].score);
                $("#normTypeSort").numberspinner('setValue',data.data[0].sort);
                $("#catalogForm input[name='status']").val(data.data[0].status);
                $("#catalogForm input[name='version']").val(data.data[0].version);
                $("#catalogForm textarea[name='remark']").val(data.data[0].remark);
                $("#catalogForm input[name='pids']").val(data.data[0].pids);
                $('#pid').combotree("setValue",data.data[0].pid);
                if(data.data[0].pid==0){
                    $('#maintain_id').parent('div').show();
                    $('#maintain_id').combobox('setValue',data.data[0].maintain_id);
                }else{
                    $('#maintain_id').parent('div').hide();
                    $('#maintain_id').combobox('setValue','');
                }
                if(data.data[0].access_level!=null){
                    var values = data.data[0].access_level.split(",");
                    $('#access_level_catalog').combobox('setValues',values);
                }else{
                    $('#access_level_catalog').combobox('setValues',['']);
                }
            }
            else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
    openCatalogPage("修改考核模板", id, doEditCatalog);
}

// 修改数据
function doEditCatalog(value) {
    // 验证表单
    /*var validate = $('#catalogForm').form('validate');
    if(!validate) {
        return false;
    }*/
    var data = $('#catalogForm').serializeJson();
    var access_levels =$("#access_level_catalog").combobox('getValues');
    var access_level = '';
    for(var i=0;i<access_levels.length;i++){
        access_level += access_levels[i]+",";
    }
    access_level = access_level.substr(0,access_level.lastIndexOf(','));
    data.access_level = access_level;
    $.ajax({
        url: basePath+'/api/assess_mgt/assess_tpl/norm_define_route/editNormType?id='+value,
        type: 'post',
        data: data,
        success: function (data) {
            if(data.success) {
                msgSuccess(data.msg);
                closeCatalogDialog();
                initLeftCatalogTree();
                reloadTree();
            }
            else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });

}

// 新增数据
function doAddCatalog(value) {
    // 验证表单
    /*var validate = $('#catalogForm').form('validate');
    if(!validate) {
        alert('jinlail  validate');
        return false;
    }*/
    var data = $('#catalogForm').serializeJson();
    var access_levels =$("#access_level_catalog").combobox('getValues');
    var access_level = '';
    for(var i=0;i<access_levels.length;i++){
        access_level += access_levels[i]+",";
    }
    access_level = access_level.substr(0,access_level.lastIndexOf(','));
    data.access_level = access_level;
    $.ajax({
        url: basePath+'/api/assess_mgt/assess_tpl/norm_define_route/addNormType',
        type: 'post',
        data: data ,
        success: function (data) {
            if(data.success) {
                msgSuccess(data.msg);
                closeCatalogDialog();
                initLeftCatalogTree();
                reloadTree();
            }
            else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}


/*重新加载树*/
function reloadTree($id){
    $('#pid').combotree("reload");
    $('#norm_type_id').combotree("reload");
    $('#norm_type_id2').combotree("reload");
}