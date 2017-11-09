// 关闭窗口
function closeDialog() {
    $('#markModal').dialog('close');
    $("#dataList").empty();
}
/**
 * 打开打分页面
 * @param title 页面标题
 * @param flg 打分标识（1：站点打分，2：直放站打分）
 * @param callback 回调函数
 * @returns {boolean}
 */
function openPage(title, flg, callback) {
    var rows = $('#simpledatatable').datagrid('getChecked');
    if (rows.length != 1) {
        msgError('提示,请选择一条数据再进行打分');
        return false;
    }
    $('#markModal').show();
    $('#markModal').mydialog({
        title:title,
        width: 1000,
        height: 550,
        top:50,
        modal: true,
        myButtons:[
            {
                text:'确定',
                btnCls:'btn btn-blue',
                handler:function(){
                    callback(flg);
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
    getMarkItems(flg, rows);
}

/**
 *
 * @param flag 打分标识（1：站点打分，2：直放站打分）
 * @param rows 选中的数据
 */
function getMarkItems(flag, rows){
    var url ="";
    var code=""
    var devicesNum=0;
    var alarmNum =0;
    var station_id =rows[0].id;
    // 敷设方式
    var layingWay ="";
    if(flag=='1'){
        // 站点打分
        code="station_mark_template";
    } else if(flag=='2'){
        // 直放站打分
        code="repeater_mark_template";
    }
    // 基站内设备数(基站内主设备+传输设备+集客家客设备)
    devicesNum = parseInt(rows[0].primary_device_num)+
        parseInt(rows[0].transmission_device_num)+
        parseInt(rows[0].hakka_device_num);
    // 基站内性能告警数(基站主设备内性能告警数+传输设备性能告警数)
    alarmNum = parseInt(rows[0].primary_device_alarm)+
        parseInt(rows[0].transmission_device_alarm);
    // 请求参数
    var reqParam ='code='+code+'&flag='+flag+'&station_id='+station_id+'&devicesNum='+devicesNum+"&alarmNum="+alarmNum;
    url =basePath+'/api/dynamic_patrol/mark/mark_route/mark?'+reqParam;

    $("#station_id").val(station_id);
    $("#dataList").empty();
    $.ajax({
        url: url,
        type: 'get',
        success: function (result) {
            var selData = new Array();
            if(result.success) {
                var data = result.data;
                for(var i =0; i<data.length; i++){
                    var mark = data[i];
                    var children = mark.children;
                    var obj ={};
                    var html="";
                    // 站点或直放站打分
                    html +='<div class="data-row" id="dataRow_'+i+'">';
                    html +='<div style="width:15%"><p>'+mark.scene_name+'</p>'+
                        '<input type="hidden" name="mark_item_id" id="mark_item_id_'+i+'" value="' + mark.mark_item_id + '" />' +
                        '<input type="hidden" name="mark_item_name" id="mark_item_name_'+i+'" value="' + mark.scene_name + '" />' +
                        '</div>';
                    if(children.length >1){
                        // 打分项需要手动选择时
                        obj.index =i+"";
                        obj.value = new Array();
                        for(var j=0; j<children.length;j++){
                            obj.value.push(children[j]);
                        }
                        selData.push(obj);
                        if(mark.id!=null && mark.id!=""){
                            // 更新的场合
                            html += '<div style="width:45%; padding:7px 7px;">'+
                                '<input class="easyui-combobox form-control" id="arithmeticSel_'+i+'" value="'+mark.arithmetic_id+'" style="height:34px; width:96%; margin:auto;" />'+
                                '<input type="hidden" name="arithmetic_id" id="arithmetic_id_'+i+'" value="'+mark.arithmetic_id+'" />'+
                                '<input type="hidden" name="arithmetic_name" id="arithmetic_name_'+i+'" value="'+mark.arithmetic_name+'" />'+
                                '</div>';
                            html += '<div style="width:10%">' +
                                '<p id="scoreBox_'+i+'">'+mark.score+'</p>' +
                                '<input type="hidden" name="score" id="score_'+i+'" value="'+mark.score+'" />' +
                                '</div>';
                            html += '<div style="width:30%"><p id="dataSources_'+i+'">'+mark.data_sources+'</p>' +
                                '<input type="hidden" name="data_sources" id="data_sources_'+i+'" value="'+mark.data_sources+'" />' +
                                '<input type="hidden" name="sort" id="sort_'+i+'" value="'+mark.sort+'" />' +
                                '<input type="hidden" name="id" id="id_'+i+'" value="'+mark.id+'" />' +
                                '</div>';
                        } else {
                            // 新增的场合
                            html += '<div style="width:45%; padding:7px 7px;">'+
                                '<input class="easyui-combobox form-control" id="arithmeticSel_'+i+'" value="'+children[0].id+'" style="height:34px; width:96%; margin:auto;" />'+
                                '<input type="hidden" name="arithmetic_id" id="arithmetic_id_'+i+'" value="'+children[0].id+'" />'+
                                '<input type="hidden" name="arithmetic_name" id="arithmetic_name_'+i+'" value="'+children[0].arithmetic+'" />'+
                                '</div>';
                            html += '<div style="width:10%">' +
                                '<p id="scoreBox_'+i+'">'+children[0].score+'</p>' +
                                '<input type="hidden" name="score" id="score_'+i+'" value="'+children[0].score+'" />' +
                                '</div>';
                            html += '<div style="width:30%"><p id="dataSources_'+i+'">'+children[0].data_sources+'</p>' +
                                '<input type="hidden" name="data_sources" id="data_sources_'+i+'" value="'+children[0].data_sources+'" />' +
                                '<input type="hidden" name="sort" id="sort_'+i+'" value="'+(i+1)+'" />' +
                                '<input type="hidden" name="id" id="id_'+i+'" value="" />' +
                                '</div>';
                        }
                    } else {
                        // 打分项自动选择时
                        html += '<div style="width:45%">' +
                            '<p>'+children[0].arithmetic+'</p>' +
                            '<input type="hidden" name="arithmetic_id" id="arithmetic_id_'+i+'" value="'+children[0].id+'" />' +
                            '<input type="hidden" name="arithmetic_name" id="arithmetic_name_'+i+'" value="'+children[0].arithmetic+'" />' +
                            '</div>';
                        html += '<div style="width:10%">' +
                            '<p id="scoreBox_'+i+'">'+children[0].score+'</p>' +
                            '<input type="hidden" name="score" id="score_'+i+'" value="'+children[0].score+'" />' +
                            '</div>';
                        html += '<div style="width:30%">' +
                            '<p id="dataSources_'+i+'">'+children[0].data_sources+'</p>' +
                            '<input type="hidden" name="data_sources" id="data_sources_'+i+'" value="'+children[0].data_sources+'" />' +
                            '<input type="hidden" name="sort" id="sort_'+i+'" value="'+(i+1)+'" />';
                        if(mark.id!=null && mark.id!=""){
                            html += '<input type="hidden" name="id" id="id_'+i+'" value="'+mark.id+'" />';
                        }else{
                            html += '<input type="hidden" name="id" id="id_'+i+'" value="" />';
                        }
                        html += '</div>';
                    }
                    html += '</div>';
                    $("#dataList").append(html);
                    $.parser.parse("#dataRow_"+i);
                }
                setTotalScore();
                for(var i=0; i<selData.length; i++){
                    var $arithmetic = $("#arithmeticSel_"+selData[i].index);
                    if($arithmetic.length >0){
                        $arithmetic.combobox({
                            valueField:'id',
                            textField:'arithmetic',
                            data:selData[i].value,
                            onSelect:function(record){
                                var dataArr = $(this).combobox("getData");
                                var idIndex = $(this).attr("id").split("_")[1];
                                for(var k=0; k< dataArr.length; k++){
                                    var data = dataArr[k];
                                    if(data.id==record.id){
                                        $("#arithmetic_id_"+idIndex).val($(this).combobox("getValue"));
                                        $("#arithmetic_name_"+idIndex).val($(this).combobox("getText"));
                                        $("#scoreBox_"+idIndex).text(data.score);
                                        $("#score_"+idIndex).val(data.score);
                                        $("#dataSources_"+idIndex).text(data.data_sources);
                                        $("#data_sources_"+idIndex).val(data.data_sources);
                                        break;
                                    }
                                }
                                setTotalScore();
                            }
                        })
                    }
                }
            } else {
                msgError(result.msg+',错误代码:'+result.code);
            }
        }
    });
}
function setTotalScore(){
    var totalScore= parseFloat($("#basicScore").text());
    $("p[id^='scoreBox_']").each(function(){
        totalScore = totalScore*parseFloat($(this).text());
    });
    $("#totalScore").text(totalScore.toFixed(2));
}
/**
 * 打分
 * @param flag 打分标识（1：站点打分，2：直放站打分）
 */
function doMark(flag){
    var data= new Array();
    $("div[id^='dataRow_']").each(function(index){
        var obj = {};
        var id =$("#id_"+index).val()
        if( id ==null || id==""){
            obj.id = keyGenerator();
            obj.addFlag ="0";
        } else {
            obj.id = id;
            obj.addFlag ="1";
        }
        var station_id = $("#station_id").val();
        obj.station_id = station_id;
        obj.mark_item_id = $("#mark_item_id_"+index).val();
        obj.mark_item_name = $("#mark_item_name_"+index).val();
        obj.arithmetic_id = $("#arithmetic_id_"+index).val();
        obj.arithmetic_name = $("#arithmetic_name_"+index).val();
        obj.score = $("#score_"+index).val();
        obj.data_sources = $("#data_sources_"+index).val();
        obj.sort = $("#sort_"+index).val();
        data.push(obj);
    });
    var totalScore = $("#totalScore").text();
    var station_id = $("#station_id").val();
    console.info(JSON.stringify(data));
    $.ajax({
        url: basePath+'/api/dynamic_patrol/mark/mark_route/addMark?flag='+flag+"&station_id="+station_id+"&total_score="+totalScore,
        type: 'post',
        data: {dataArr:JSON.stringify(data)},
        success: function (data) {
            if(data.success) {
                msgSuccess(data.msg);
                closeDialog();
                $('#simpledatatable').datagrid('reload');
            }
            else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}

/**
 * 打开打分详情页面
 * @param title 页面标题
 * @param flg 打分标识（1：站点打分详情，2：直放站打分详情， 3：中继段打分详情）
 * @returns {boolean}
 */
function openMarkDetailPage(title, flg) {
    var rows = $('#simpledatatable').datagrid('getChecked');
    if (rows.length != 1) {
        msgError('提示,请选择一条数据再查看');
        return false;
    }
    $('#markModal').show();
    $('#markModal').mydialog({
        title:title,
        width: 1000,
        height: 550,
        top:50,
        modal: true,
        myButtons:[
            {
                text:'关闭',
                btnCls:'btn btn-danger',
                handler:function(){
                    closeDialog();
                }
            }
        ]
    });
    getMarkDetails(rows, flg);
}
function getMarkDetails(rows, flag){
    var code="";
    var layingWay="";
    var bearingSys="";
    var url="";

    if(flag=="1" || flag=="2"){
        // 站点、直放站 打分详情
        var station_id = rows[0].id;
        var url=basePath+'/api/dynamic_patrol/mark/mark_route/stationMarkDetails?flag='+flag+'&station_id='+station_id;
    } else {
        code ="hop_mark_template";
        layingWay = rows[0].laying_way;
        if(layingWay=="管道"){
            layingWay="01";
        } else if(layingWay=="直埋"){
            layingWay="02";
        } else{
            layingWay="03";
        }
        bearingSys =rows[0].bearing_sys;
        if(bearingSys=="一干"){
            bearingSys="01";
        } else if(layingWay=="二干"){
            bearingSys="02";
        }  else if(layingWay=="核心层/汇聚层"){
            bearingSys="04";
        } else{
            // 接入网
            bearingSys="05";
        }
        url =basePath+'/api/dynamic_patrol/mark/mark_route/markDetails?code='+code+'&layingWay='+layingWay+"&bearingSys="+bearingSys;
    }
    $("#dataList").empty();
    $.ajax({
        url: url,
        type: 'get',
        success: function (result) {
            if(result.success) {
                var dataArr = result.data;
                if(flag=="3"){
                    var html = "<ul>";
                    for(var i =0;i<dataArr.length; i++){
                        var eval = dataArr[i];
                        var normArr = eval.children;
                        html +='<li>';
                        html +='<div style="height:'+(normArr.length*40)+'px;line-height:'+(normArr.length*40)+'px;width:15%">' +
                            '<p style="height:'+(normArr.length*40)+'px;line-height:'+(normArr.length*40)+'px;">'+eval.scene_name+'</p>' +
                            '</div>';
                        html += "<ul>";
                        for(var j=0; j<normArr.length; j++){
                            var norm = normArr[j];
                            var typeArr = norm.children;
                            html +='<li>';
                            html +='<div class="norm" style="width:15%"><p>'+norm.scene_name+'</p></div>';
                            html += '<ul>';
                            for(var k=0; k<typeArr.length; k++){
                                var type = typeArr[k];
                                html +='<li>';
                                html +='<div class="norm" style="width:30%"><p>'+type.arithmetic+'</p></div>';
                                html +='<div class="norm" style="width:30%"><p>'+type.data_sources+'</p></div>';
                                html +='<div class="norm" style="width:10%"><p id="score_'+i+'_'+j+'_'+k+'">'+type.score+'</p></div>';
                                html +='</li>';
                            }
                            html += "</ul>";
                            html +='</li>';
                        }
                        html += "</ul>";

                        html +='</li>';
                    }
                    html += "</ul>";
                    $("#dataList").html(html);
                    var totalScore = 0;
                    $("p[id^='score_']").each(function(){
                        totalScore += parseInt($(this).text());
                    })
                    $("#totalScore").text(totalScore);
                } else{
                    var html = "";
                    for(var i =0;i<dataArr.length; i++){
                        var mark = dataArr[i];
                        html +='<div class="data-row" id="dataRow_'+i+'">';
                        html +='<div style="width:15%"><p>'+mark.mark_item_name+'</p></div>';
                        html +='<div style="width:45%"><p>'+mark.arithmetic_name+'</p></div>';
                        html += '<div style="width:10%"><p id="scoreBox_'+i+'">'+mark.score+'</p></div>';
                        html += '<div style="width:30%"><p id="dataSources_'+i+'">'+mark.data_sources+'</p></div>';
                        html += '</div>';
                    }
                    $("#dataList").html(html);
                    setTotalScore();
                }
            }else {
                msgError(result.msg+',错误代码:'+result.code);
            }
        }
    });
}