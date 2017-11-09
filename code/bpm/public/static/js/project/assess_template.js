
/**
 *
 * @param work_order_id
 * @param city_id
 * @param county_id
 * @param assess_year
 * @param assess_month
 * @param major_id
 */
function countySum(work_order_id, city_id, county_id, assess_year, assess_month, major_id){
    $.ajax({
        url: basePath+'/api/assess_mgt/assess_task/assess_task_route/countySum',
        type: 'get',
        data:{
            work_order_id:work_order_id,
            city_id:city_id,
            county_id:county_id,
            assess_year:assess_year,
            assess_month:assess_month,
            major_id:major_id,
        },
        beforeSend: function () {
            loadMaskLayer();
        },
        complete: function () {
            disLoadMaskLayer();
        },
        success: function (result) {
            if(result.success){
                var dataObj =result.data;
                // 县级打分表头列名称集合
                var countyAssTitle = dataObj.countyAssTitle;
                // 县级打分表头列数
                var countyRow = countyAssTitle.length;
                // 县级打分表头列宽
                var width = (100/(countyRow+1)).toFixed(3);
                width.substring(0,width.lastIndexOf('.')+3) // 123456.78
                // 县级打分表头HTML
                var html='<tr>';
                html +='<th width="'+width+'%">区县名</th>';
                for(var i in countyAssTitle){
                    html +='<th width="'+width+'%">'+countyAssTitle[i].ass_name+'</th>';
                }
                html +='</tr>';
                $("#tableHead2").html(html);
                // 县级打分数据
                var countyScore = dataObj.countyScore;
                for(var i in countyScore){
                    var proc_inst_id = countyScore[i].proc_inst_id;
                    var url=basePath + '/api/assess_mgt/assess_task/assess_task_route/scoreDetail?proc_inst_id='+proc_inst_id;
                    var tableBodyHtml='<tr id="row_'+i+'">';
                    tableBodyHtml += '<td width="'+width+'%">' + countyScore[i].county_name + '</td>';
                    var children = countyScore[i].children;
                    if(children.length==0){
                        for(var j=0; j<countyRow; j++){
                            tableBodyHtml += '<td width="'+width+'%" id="col_'+j+'_'+i+'">--</td>';
                        }
                    } else {
                        for(var j in countyAssTitle){
                            for(var k in children){
                                if(children[k].ass_id == countyAssTitle[j].ass_id){
                                    tableBodyHtml += '<td width="'+width+'%" id="colScore'+j+'_'+i+'"><a href="javascript:openWindow(\'打分详情\',\''+url+'\');" style="color:'+getShowColor(children[k].ass_type)+'">'+children[k].total_score+'</a></td>';
                                }
                            }
                        }
                    }
                    tableBodyHtml+='</tr>';
                    $("#tableBody").append(tableBodyHtml);
                }
                for(var j=0; j<countyRow;j++){
                    var total=100;
                    $("td[id^='colScore"+j+"_']").each(function(index){
                        total= total-parseFloat($(this).text());
                    });
                    $("#sum_"+j).text(total);
                }
            }
        }
    });
}

/**
 *
 * @param work_order_id
 * @param city_id
 * @param assess_year
 * @param assess_month
 * @param major_id
 * @param company_id
 * @param flag 市级打分分数是否显示标识(0:不显示，1：显示)
 * @param rejectShow 驳回tab是否显示(0:不显示，1：显示)
 */
function citySum(work_order_id, city_id, assess_year, assess_month, major_id, company_id, flag, rejectShow){
    $.ajax({
        url: basePath+'/api/assess_mgt/assess_task/assess_task_route/citySum',
        type: 'get',
        data:{
            work_order_id:work_order_id,
            city_id:city_id,
            assess_year:assess_year,
            assess_month:assess_month,
            major_id:major_id,
            company_id:company_id
        },
        beforeSend: function () {
            loadMaskLayer();
        },
        complete: function () {
            disLoadMaskLayer();
        },
        success: function (result) {
            if(result.success){
                var dataObj =result.data;
                // 表头_县级列信息
                var countyAssTitle = dataObj.countyAssTitle;
                var countyRow = countyAssTitle.length;

                // 表头_市级列信息
                var cityAssTitle = dataObj.cityAssTitle;
                var cityRow = cityAssTitle.length;
                var rate = parseInt(100/(countyRow*2+cityRow+1));
                // 一级表头
                var html='<tr>' +
                    '<th width="'+(countyRow*rate+rate)+'%" rowspan="'+(countyRow+1)+'">县级</th>' +
                    '<th width="'+cityRow*rate+'%" rowspan="'+cityRow+'">市级</th>' +
                    '<th width="'+countyRow*rate+'%" rowspan="'+countyRow+'">合计</th>' +
                    '</tr>';
                $("#tableHead").html(html);

                // 二级表头
                html='<tr>';
                html +='<th width="'+rate+'%">区县名</th>';
                for(var i in countyAssTitle){
                    html +='<th width="'+rate+'%">'+countyAssTitle[i].ass_name+'</th>';
                }
                for(var i in cityAssTitle){
                    html +='<th width="'+rate+'%">'+cityAssTitle[i].ass_name+'</th>';
                }
                for(var i in countyAssTitle){
                    html +='<th width="'+rate+'%">'+countyAssTitle[i].ass_name+'合计</th>';
                }
                html +='</tr>';
                $("#tableHead2").html(html);

                // 县级打分数据
                var countyScore = dataObj.countyScore;
                // 县级考核流程结束数
                var countyFinishNum=0;
                for(var i in countyScore){
                    // 工单状态（1:流转，2：虚拟归档，3：际归实档）
                    var work_order_status = countyScore[i].work_order_status;
                    if(work_order_status==2){
                        countyFinishNum++;
                    }
                    var proc_inst_id = countyScore[i].proc_inst_id;
                    var url=basePath+'/api/assess_mgt/assess_task/assess_task_route/scoreDetail?proc_inst_id='+proc_inst_id+"&isShow="+rejectShow;
                    var tranMsgUrl = basePath+'/process_history?proc_inst_id='+encodeURI(proc_inst_id);
                    var tableBodyHtml='<tr id="row_'+i+'">';
                    if(i==0){
                        // 第一个tr时，加载市级打分结果
                        tableBodyHtml += '<td  width="'+rate+'%">'+countyScore[i].county_name+'</td>';
                        var children = countyScore[i].children;
                        if(children.length ==0){
                            // 县级还没有打分
                            for(var j=0;j<countyRow;j++){
                                /*tableBodyHtml += '<td  width="10%" id="col_'+j+'_'+i+'">--</td>';*/
                                tableBodyHtml +='<td width="'+rate+'%" id="col_'+j+'_'+i+'"><a href="javascript:openWindow(\'打分详情\',\''+tranMsgUrl+'\');">--</a></td>';

                            }
                        } else {
                            // 县级已经打分
                            for(var j in countyAssTitle){
                                for(var k in children){
                                    if(children[k].ass_id == countyAssTitle[j].ass_id){
                                        if(work_order_status==1){
                                            // 县级考核工单未走到虚拟归档节点时，分数不显示
                                            /*tableBodyHtml += '<td  width="10%" id="col_'+j+'_'+i+'">--</td>';*/
                                            tableBodyHtml +='<td width="'+rate+'%" id="col_'+j+'_'+i+'"><a href="javascript:openWindow(\'打分详情\',\''+tranMsgUrl+'\');">--</a></td>';
                                        } else{
                                            // 县级考核工单未走到虚拟归档节点（及其以后节点）时，分数显示
                                            tableBodyHtml += '<td width="'+rate+'%" id="colScore'+j+'_'+i+'" data-ass-code="'+children[k].ass_code+'_3" data-total-score="'+children[k].total_score+'"><a href="javascript:openWindow(\'打分详情\',\''+url+'\');" style="color:'+getShowColor(children[k].ass_type)+'">'+children[k].total_score+'</a></td>';
                                        }
                                    }
                                }
                            }
                        }
                        // 市级打分数据
                        var cityScore = dataObj.cityScore;
                        var url_2=basePath+'/api/assess_mgt/assess_task/assess_task_route/scoreDetail?proc_inst_id='+cityScore[0].proc_inst_id;
                        var cityChildren = cityScore[0].children;
                        if(cityChildren.length==0){
                            // 市级未打分
                            for(var j=0;j<cityRow;j++){
                                tableBodyHtml += '<td  width="'+rate+'%" rowspan="'+countyScore.length+'">--</td>';
                            }
                        } else {
                            // 市级已经打分
                            for(var j in cityAssTitle){
                                for(var k in cityChildren){
                                    if(cityChildren[k].ass_id == cityAssTitle[j].ass_id){
                                        if(flag=='0'){
                                            tableBodyHtml += '<td  width="'+rate+'%" rowspan="'+countyScore.length+'" data-ass-code="'+cityChildren[k].ass_code+'_2" data-total-score="'+cityChildren[k].total_score+'" style="color:'+getShowColor(cityChildren[k].ass_type)+'">'+cityChildren[k].total_score+'</td>';
                                        } else{
                                            tableBodyHtml += '<td  width="'+rate+'%" rowspan="'+countyScore.length+'" data-ass-code="'+cityChildren[k].ass_code+'_2" data-total-score="'+cityChildren[k].total_score+'">' +
                                                '<a href="javascript:openWindow(\'打分详情\',\''+url_2+'\');" style="color:'+getShowColor(cityChildren[k].ass_type)+'">'+cityChildren[k].total_score+'</a>' +
                                                '</td>';
                                        }
                                    }
                                }
                            }
                        }
                        // 显示县市汇总项
                        for(var j in countyAssTitle){
                            tableBodyHtml += '<td  width="'+rate+'%" rowspan="'+countyScore.length+'" id="sum_'+j+'" data-ass-code="'+countyAssTitle[j].ass_code+'" data-total-score="0"></td>';
                        }
                    } else {
                        tableBodyHtml += '<td width="'+rate+'%">' + countyScore[i].county_name + '</td>';
                        var children = countyScore[i].children;
                        if(children.length==0){
                            for(var j=0; j<countyRow; j++){
                               /* tableBodyHtml += '<td width="10%" id="col_'+j+'_'+i+'">--</td>';*/
                                tableBodyHtml +='<td width="'+rate+'%" id="col_'+j+'_'+i+'"><a href="javascript:openWindow(\'打分详情\',\''+tranMsgUrl+'\');">--</a></td>';

                            }
                        } else {
                            for(var j in countyAssTitle){
                                for(var k in children){
                                    if(children[k].ass_id == countyAssTitle[j].ass_id){
                                        if(work_order_status==1){
                                            /*tableBodyHtml += '<td  width="10%" id="col_'+j+'_'+i+'">--</td>';*/
                                            tableBodyHtml +='<td width="'+rate+'%" id="col_'+j+'_'+i+'"><a href="javascript:openWindow(\'打分详情\',\''+tranMsgUrl+'\');">--</a></td>';

                                        } else{
                                            tableBodyHtml += '<td width="'+rate+'%" id="colScore'+j+'_'+i+'" data-ass-code="'+countyAssTitle[j].ass_code+'_3" data-total-score="'+children[k].total_score+'">' +
                                                '<a href="javascript:openWindow(\'打分详情\',\''+url+'\');" style="color:'+getShowColor(children[k].ass_type)+'">'+children[k].total_score+'</a>' +
                                                '</td>';
                                        }
                                    }
                                }
                            }
                        }
                    }
                    tableBodyHtml+='</tr>';
                    $("#tableBody").append(tableBodyHtml);
                }
                for(var j=0; j<countyRow;j++){
                    var total=100;
                    /*
                     $("td[id^='colScore"+j+"_']").each(function(index){
                     total= total-parseFloat($(this).text());
                     });
                     */
                    var $sumTd = $("#sum_"+j);
                    var ass_code = $sumTd.attr("data-ass-code");
                    var arrays = [];
                    //var countyScore = 0.0;
                    $("td[data-ass-code='"+ass_code+"_3']").each(function(index){
                        //total= total-parseFloat($(this).attr("data-total-score"));
                        arrays.push(parseFloat($(this).attr("data-total-score")));
                    });
                    total -= calculate(arrays,1);
                    $("td[data-ass-code='"+ass_code+"_2']").each(function(index){
                        total= total-parseFloat($(this).attr("data-total-score"));
                    });
                    $sumTd.text(total.toFixed(2));
                }
                if(countyFinishNum<countyScore.length){
                    // 县级所有考核流程未结束，提交按钮不可用
                    $("#submitBtn").attr("disabled","disabled");
                }
            }
          }
    });
}


/**
 * 省级打分数据编辑
 * @param work_order_id
 * @param city_id
 * @param assess_year
 * @param assess_month
 * @param major_id
 */
function provinceScoreData(work_order_id, city_id, assess_year, assess_month, major_id){
    $.ajax({
        url: basePath+'/api/assess_mgt/assess_task/assess_task_route/provinceSum',
        type: 'get',
        data:{
            work_order_id:work_order_id,
            city_id:city_id,
            assess_year:assess_year,
            assess_month:assess_month,
            major_id:major_id,
        },
        beforeSend: function () {
            loadMaskLayer();
        },
        complete: function () {
            disLoadMaskLayer();
        },
        success: function (result) {
            if(result.success){
                var dataObj =result.data;
                // 表头名称数组
                var provinceTitle = dataObj.provinceTitle;
                // 表头动态列数
                var provinceRow = provinceTitle.length;
                var width = (100/(provinceRow+2)).toFixed(3);
                width.substring(0,width.lastIndexOf('.')+3);
                // 表头_列HTML
                var html='<tr>';
                html +='<th width="'+width+'%">地市</th>';
                html +='<th width="'+width+'%">类别</th>';
                for(var i in provinceTitle){
                    html +='<th width="'+width+'%">'+provinceTitle[i].ass_name+'</th>';
                }
                html +='</tr>';
                $("#tableHead2").html(html);
                // 省级打分数据
                var provinceScore = dataObj.provinceScore;
                var html2="";
                for(var i in provinceScore){
                    var proc_inst_id = provinceScore[i].proc_inst_id;
                    var url=basePath + '/api/assess_mgt/assess_task/assess_task_route/scoreDetail?proc_inst_id='+proc_inst_id;
                    var tableBodyHtml='<tr id="row_'+i+'">';
                    tableBodyHtml += '<td width="'+width+'%">' + provinceScore[i].city_name + '</td>';
                    tableBodyHtml += '<td width="'+width+'%">' + provinceScore[i].major_name + '</td>';
                    var children = provinceScore[i].children;
                    if(children.length==0){
                        for(var j=0; j<provinceRow; j++){
                            tableBodyHtml += '<td width="'+width+'%" id="col_'+j+'_'+i+'">--</td>';
                        }
                    } else {
                        for(var j in provinceTitle){
                            for(var k in children){
                                if(children[k].ass_id == provinceTitle[j].ass_id){
                                    tableBodyHtml += '<td width="'+width+'%" id="colScore'+j+'_'+i+'"><a href="javascript:openWindow(\'打分详情\',\''+url+'\');" style="color:'+getShowColor(children[k].ass_type)+'">'+children[k].total_score+'</a></td>';
                                }
                            }
                        }
                    }
                    tableBodyHtml+='</tr>';
                    $("#tableBody").append(tableBodyHtml);
                }
                for(var j=0; j<provinceRow;j++){
                    var total=100;
                    $("td[id^='colScore"+j+"_']").each(function(index){
                        total= total-parseFloat($(this).text());
                    });
                    $("#sum_"+j).text(total.toFixed(2));
                }
            }
        }
    });
}

/*打开新的window*/
function openWindow(title,url){
   /* $('#newWindow').window({
        width:1000,
        height:600,
        modal:true,
        title:title,
        href:url,
    });*/
    window.open(url);
}
/***********************************************************付维炼****************************************************************************8*/


/**
 * 省级的归档
 * @param city
 * @param assess_year
 * @param assess_month
 * @param profession
 * @param assess_category
 */
function provinceSum(work_order_id,assess_year,assess_month,profession,assess_category,assess_level){
    var params = {assess_category:assess_category,assess_year:assess_year,assess_month:assess_month,assess_level:assess_level,profession:profession,work_order_id:work_order_id}
    $.ajax({
        url:basePath + '/api/assess_mgt/assess_task/assess_task_route/queryScoreMsg',
        dataType:'json',
        data:params,
        type:'post',
        beforeSend: function () {
            loadMaskLayer();
        },
        complete: function () {
            disLoadMaskLayer();
        },
        success:function(result){//这里要对数据进行处理
            var obj = scoreShow(result);
            $('#proThread').html(obj.thread);
            $('#proTbody').html(obj.tbody);
        },
        error:function(){//错误的处理
            msgError('查询打分详情数据失败');
        }
    });
}
/**
 * 获取该显示的数据
 * @param result
 */
function scoreShow(result){
    var proDatas = result.proData;
    var data = result.data;
    var pointInfos = [];
    var thread = '';
    var tbody = '';
    var index = 0;
    var flag = false;
    if(data==undefined||data.length==0){
        msgError('暂时没有数据');
        return {thread:thread,tbody:tbody};
    }else{
        for(var i=0;i<data.length;i++){
            // var proData = proDatas[data[i].major_id];//这个以后加上类别后补上
            var proData = proDatas;//这个是没有类别之分的,比例
            var children = data[i].children;
            var prData = children.prChildren;//省级数据
            var ciData = children.ciChildren;//市级数据
            var coData = children.coChildren;//区县级数据
            if(i==0){//第一次加载，首先要加载表头数据
                var threads = [];
                var overPoints  = [];
                for(var j=0;j<coData.length;j++){//加载区县表头
                    if(threads.length==0){
                        threads.push({code:coData[j].ass_code,threadName:coData[j].ass_name,type:coData[j].ass_type});
                    }else{
                        flag = false;
                        for(var k=0;k<threads.length;k++){
                            if(threads[k].code==coData[j].ass_code){
                                flag = true;
                                break;
                            }
                        }
                        if(!flag){
                            threads.push({code:coData[j].ass_code,threadName:coData[j].ass_name,type:coData[j].ass_type});
                        }
                    }
                }
                for(var j=0;j<prData.length;j++){//加载省级表头
                    if(threads.length==0){
                        threads.push({code:prData[j].ass_code,threadName:prData[j].ass_name,type:prData[j].ass_type});
                    }else{
                        flag = false;
                        for(var k=0;k<threads.length;k++){
                            if(threads[k].code==prData[j].ass_code){
                                flag = true;
                                break;
                            }
                        }
                        if(!flag){
                            threads.push({code:prData[j].ass_code,threadName:prData[j].ass_name,type:prData[j].ass_type});
                        }
                    }
                }
                for(var j=0;j<ciData.length;j++){//加载市级表头
                    if(threads.length==0){
                        threads.push({code:ciData[j].ass_code,threadName:ciData[j].ass_name,type:ciData[j].ass_type});
                    }else{
                        flag = false;
                        for(var k=0;k<threads.length;k++){
                            if(threads[k].code==ciData[j].ass_code){
                                flag = true;
                                break;
                            }
                        }
                        if(!flag){
                            threads.push({code:ciData[j].ass_code,threadName:ciData[j].ass_name,type:ciData[j].ass_type});
                        }
                    }
                }
                //生成表头
                for(var j=0;j<threads.length;j++){//按中间配置表方式呈现数据
                    var proValue = 1;
                    flag = false;
                    for(var k=0;k<proData.length;k++){
                        if(proData[k].pro_code==threads[j].code){
                            flag = true;
                            proValue = proData[k].pro_value;
                            break;
                        }
                    }
                    threads[j].proValue = proValue;
                    if(!flag){
                        overPoints.push(threads[j]);
                    }else{
                        pointInfos.push(threads[j]);
                    }
                }
                //生成表头html
                for(var j=0;j<pointInfos.length;j++){
                    if('WHZL' == pointInfos[j].code){//由于
                        thread += "<th>维护质量</th>";
                    }else{
                        thread += "<th>"+pointInfos[j].threadName+"</th>";
                    }
                }
                for(var j=0;j<overPoints.length;j++){
                    if('WHZL' == overPoints[j].code){
                        thread += "<th>维护质量</th>";
                    }else{
                        thread += "<th>"+overPoints[j].threadName+"</th>";
                    }
                    pointInfos.push(overPoints[j]);
                }

            }
            data[i].tbody = calculateScore(pointInfos,data[i].children);
        }
        console.log(data);
        tbody = treeTbale(data);
        thread = "<tr><th>集中稽核公司</th><th>地市</th><th>集中稽核类别</th>"+thread+"<th>得分合计</th><th>扣款合计</th></tr>";
        return {thread:thread,tbody:tbody};
    }
};

/**
 * 按顺序生成对应的表格数据
 * @param points
 * @param data
 */
function calculateScore(points,data){
    var prChildren = data.prChildren;
    var ciChildren = data.ciChildren;
    var coChildren = data.coChildren;
    var totalMoney = 0.0;
    var totalScore = 0.0;
    var scoreHtml = "";
    var index = 0;
    var flag = false;
    var score = 0.0;
    var pointsCopy = points;
    for(var i=0;i<points.length;i++){
        for(var j=0;j<prChildren.length;j++){
            if(prChildren[j].ass_code==points[i].code){
                var score = (pointsCopy[i].score==undefined||pointsCopy[i].score==null)?0:pointsCopy[i].score;
                var addScore = (prChildren[j].total_score==''||prChildren[j].total_score==null)?0:prChildren[j].total_score;
                pointsCopy[i].score = parseFloat(score)+parseFloat(addScore);
            }
        }
        for(var j=0;j<ciChildren.length;j++){
            if(ciChildren[j].ass_code==points[i].code){
                if(ciChildren[j].work_order_status!='3'&&ciChildren[j].work_order_status!=3){//这个是用来判断市级或者区县工单归档
                    if(pointsCopy[i].score!='--'&&pointsCopy[i].score!=undefined&&pointsCopy[i].score!=null){
                        continue;
                    }else{
                        pointsCopy[i].score = '--';
                        flag = true;
                    }
                }else{
                    var score = (pointsCopy[i].score==undefined||pointsCopy[i].score==null)?0:pointsCopy[i].score;
                    var addScore = (ciChildren[j].total_score==''||ciChildren[j].total_score==null)?0:ciChildren[j].total_score;
                    pointsCopy[i].score = parseFloat(score)+parseFloat(addScore);
                }

            }
        }
        var aveScores = [];//用来保存区县的分数
        for(var j=0;j<coChildren.length;j++){//这里要改一下,区县的这里算平均值
            if(coChildren[j].ass_code==points[i].code){
                if(coChildren[j].work_order_status!='3'&&coChildren[j].work_order_status!=3){//这个是用来判断市级或者区县工单归档
                    if(pointsCopy[i].score!='--'&&pointsCopy[i].score!=undefined&&pointsCopy[i].score!=null){
                        continue;
                    }else{
                        pointsCopy[i].score = '--';
                        flag = true;
                    }
                }else{
                    var score = (pointsCopy[i].score==undefined||pointsCopy[i].score==null)?0:pointsCopy[i].score;
                    var addScore = (coChildren[j].total_score==''||coChildren[j].total_score==null)?0:coChildren[j].total_score;
                    //pointsCopy[i].score = parseFloat(score)+parseFloat(addScore);
                    aveScores.push(addScore);
                }
            }
        }
        if(!flag){
            var score = (pointsCopy[i].score==undefined||pointsCopy[i].score==null)?0:pointsCopy[i].score;
            pointsCopy[i].score = parseFloat(score)+calculate(aveScores,1);//计算区县平均数
        }
    }
    for(var i=0;i<pointsCopy.length;i++){
        if(pointsCopy[i].score=='--'){
            scoreHtml += "<td>--</td>";
            pointsCopy[i].score = null;
            continue;
        }
        var type = pointsCopy[i].type==''?'2':pointsCopy[i].type;
        score = pointsCopy[i].score.toFixed(2);
        switch(type){
            case '1':{//加分项
                scoreHtml += "<td>"+score+"</td>";
                break;
            }
            case '2':{//扣分项,这里有一个比重
                score = 100-parseFloat(score);
                totalScore = totalScore + score*parseFloat(pointsCopy[i].proValue);
                scoreHtml += "<td>"+score.toFixed(2)+"</td>";
                break;
            }
            case '3':{//直接扣款项
                scoreHtml += "<td>"+score+"</td>";
                totalMoney = totalMoney + parseFloat(score);
                break;
            }
            case '4':{//直接加款项
                scoreHtml += "<td>"+score+"</td>";
                totalMoney = totalMoney - parseFloat(score);
                break;
            }
            case '5':{//直接加分项
                scoreHtml += "<td>"+score+"</td>";
                totalScore = totalScore + parseFloat(score);
                break;
            }
            case '6':{//直接扣分项
                scoreHtml += "<td>"+score+"</td>";
                totalScore = totalScore - parseFloat(score);
                break;
            }
        }
        pointsCopy[i].score = null;
    }
    if(flag){
        scoreHtml +="<td>--</td><td>--</td>";
    }else{
        scoreHtml += "<td>"+totalScore.toFixed(2)+"</td><td>"+totalMoney.toFixed(2)+"</td>";
    }
    return scoreHtml;
}
/**
 * 生成想要的树形表格
 * @param data
 */
function treeTbale(data){
    /**
     * 先把所有的公司合在一起
     * 再把所有的市合在一起
     * @type {string}
     */
    var tbody = '';
    var flag = false;
    var index = 0;
    var company = [];
    var city = [];
    var children = [];
    var cityChildren = [];
    //1
    for(var i=0;i<data.length;i++){
        flag = false;
        for(var j=0;j<company.length;j++){
            if(company[j].code==data[i].org_code){
                flag = true;
                index = j;
                break;
            }
        }
        if(!flag){
            children = [];
            children.push(data[i]);
            company.push({code:data[i].org_code,num:1,children:children})
        }else{
            company[index].num +=1;
            company[index].children.push(data[i]);
        }
    }
    console.log(company);
    //2
    for(var i=0;i<company.length;i++){
        children = company[i].children;
        city = [];
        for(var j=0;j<children.length;j++){
            flag = false;
            for(var k=0;k<city.length;k++){
                if(city[k].city==children[j].city_id){
                    flag = true;
                    index = k;
                    break;
                }
            }
            if(!flag){
                cityChildren.push(children[j]);
                city.push({city:children[j].city_id,num:1,children:cityChildren});
            }else{
                city[index].num +=1;
                city[index].children.push(children[j]);
            }
            cityChildren = [];
        }
        console.log(city);
        //生成html
        for(var j=0;j<city.length;j++){
            children = city[j].children;
            for(var k=0;k<children.length;k++){
                if(k==0){
                    if(j==0){
                        tbody += "<tr><td rowspan='"+company[i].num+"'>"+children[k].org_name+"</td><td rowspan='"+city[j].num+"'>"+children[k].city+"</td>";
                    }else{
                        tbody += "<td rowspan='"+city[j].num+"'>"+children[k].city+"</td>";
                    }
                }
                tbody += "<td><a href='javascript:void(0);' code='"+children[k].org_code+"' major_id='"+children[k].major_id+"' " +
                    "city='"+children[k].city_id+"' year='"+children[k].assess_year+"' " +
                    " month='"+children[k].assess_month+"' assess_category='"+children[k].assess_category+"' onclick='getScoreMsgInfo(this)'>"+
                    children[k].major_name+"</a></td>"+children[k].tbody+"</tr>";
            }
        }
    }
    return tbody;
}


function getScoreMsgInfo(obj){
    var title = $('#work_order_name').val()+'打分详情';
    var url = basePath+'/api/assess_mgt/assess_task/assess_task_route/getScoreMsgInfo?type=1';
    url += "&code="+$(obj).attr('code')+"&major_id="+$(obj).attr( 'major_id')+"&city="+$(obj).attr('city')+"&month="+$(obj).attr('month')+"&year="+$(obj).attr('year')+"&assess_category="+$(obj).attr('assess_category');
    openWindow(title,url);
}

/**
 * @param work_order_id
 * @param assess_tpl_id
 * @param assess_year
 * @param assess_month
 * @param scoreTableName

 */
function getAssessItems(work_order_id, assess_tpl_id, assess_year, assess_month, scoreTableName, $detailDom,flag){
    $.ajax({
        url: basePath + '/api/assess_mgt/assess_task/assess_task_route/queryAssessItems',
        type: 'post',
        data:{
            work_order_id:work_order_id,
            assess_tpl_id:assess_tpl_id
        },
        beforeSend: function () {
            loadMaskLayer();
        },
        complete: function () {
            disLoadMaskLayer();
        },
        success: function (result) {
            var score = 0.0;
            if (result.success) {
                var dataArr = result.data;
                var html = getHtml(assess_year, assess_month, scoreTableName,dataArr);
                $detailDom.html(html);
                $.parser.parse($detailDom);
                if($("#isShow").length>0&& $("#isShow").val()=='1'){
                    if($("#route_0").length>0){
                        var item_code = $("#route_0").attr("data-item-code");
                        var item_trend = $("#route_0").attr("data-item-trend");
                        var item_name = $("#route_0").attr("data-item-name");
                        addBtn(item_code, item_trend, item_name);
                    }
                }
                //$('#totalPoints').text(totalPoints.toFixed(2));
                $("div[id^='assItems_']").each(
                    function(i,v){
                        var totalPoints = 0.0;
                        var deductPoints = 0.0;
                        $(this).find("td[id='totalPoint']").each(function(i,v){
                            var totalScore = ($(v).text()==''||$(v).text()==null)?'0':$(v).text();
                            //这里以后估计要处理一下
                            totalPoints += parseFloat(totalScore);
                        });
                        $(this).find("input[name='scoreRemark']").each(function(i,v){//加上字符的限制，最多可以输入500字
                            $(v).blur(function(){
                                //alert($(v).val().length);
                                if($(v).val().length>500){
                                    $(v).val($(v).val().substr(0,500));
                                    msgError('您输入的字数太多，请精简一下说明');
                                }
                            });
                        });
                        $(this).find("input[name='score']").each(function(i,v){
                            var deductScore = ($(v).val()==''||$(v).val()==null)?'0':$(v).val();
                            deductPoints += parseFloat(deductScore);
                            //绑定事件
                            $(v).blur(function(){
                                //加载处理的函数
                                if(!checkFloat($(v).val())){
                                    //$(v).val(0);
                                    msgError('请输入合理数字,且小数位最多为两位');
                                    $(v).attr("style","border:1px solid #ffa8a8;");
                                    $(v).focus();
                                    return false;
                                }else{
                                    $(v).attr("style","border: 1px solid #d4d4d4;");
                                }
                                if(!checkOverMax(v)){
                                    //$(v).val(0);
                                    msgError('您输入的值过大，请重新输入');
                                    $(v).attr("style","border:1px solid #ffa8a8;");
                                    $(v).focus();
                                    return false;
                                }else{
                                    $(v).attr("style","border: 1px solid #d4d4d4;");
                                }
                                ShowScore(v);
                            });
                        });
                        $(this).find("td[id='totalPoints']").text(totalPoints.toFixed(2));
                        $(this).find("td[id='deductPoints']").text(deductPoints.toFixed(2));
                        var showType= $(this).find("td[id='nums']").attr('showType');
                        if(showType=='1'||showType==1){
                            $(this).find("td[id='nums']").text(deductPoints.toFixed(2));
                        }
                        if(showType=='2'||showType==2){
                            $(this).find("td[id='nums']").text((parseFloat(totalPoints)-deductPoints).toFixed(2));
                        }
                        if(showType=='3'||showType==3){
                            $(this).find("td[id='nums']").text(-deductPoints.toFixed(2));
                        }
                        if(flag){
                            hiddenInput($(this));
                        }

                    }
                );


            }
        },
        error: function () {
        }
    });
}
/**
 * 检查打的分值是否超过上限
 * @param obj
 */
function checkOverMax(obj){
    /**
     * 检查的条件是：如果找到有的合分值不为null或者0，那么就判断和值不超过该值，
     * 否则就没有判断上限之说
     */
    var _obj = $(obj);
    var scores = 0.0;
    var score = "";
    var common = _obj.parents('tr').find("input[name='common']").attr("common");
    var totalScore = _obj.parents('tr').find("input[name='common']").attr("score");
    score = _obj.val();
    if(totalScore==''||totalScore==null){//没有获取到上限值，就没有上限值，比如直接加款与直接扣款，但是要看在没有在有效的值范围
        var integerStr = score;
        if(score.indexOf(".")!=-1){
            integerStr = score.substring(0,score.indexOf("."));
        }
        if(integerStr.length>9){
            return false;
        }else{
            return true;
        }
    }
    $("input[common='"+common+"']").each(function(i,v){
        score = $(v).parents('tr').find("input[name='score']").val();
        score = score==''||score==null?'0':score;
        scores += parseFloat(score);
    });
    if(parseFloat(totalScore)<scores){
        return false;
    }else{
        return true;
    }
}


/**
 *
 * @param f 小数
 */
function checkFloat(f){
    if(f=='0'){
        return true;
    }
    if(/^[1-9][0-9]*$/.test(f)){
        return true;
    }
    if(/^[1-9][0-9]*\.[0-9]{1,2}$/.test(f)){
        return true;
    }
    if(/^[0-9]\.[0-9]{1,2}$/.test(f)){
        return true;
    }
    return false;
}
/**
 * 去掉所有的显示input框
 * @param obj
 */
function hiddenInput(_obj){
    var _par = _obj.parents('#details2');
    if(_par.length==0){
        return;
    }
    var text = '';
    var inputs = _obj.find("input[name^='score']");
    inputs.each(function(i,v){
        text = $(v).val();
        $(v).parent('td').html(text);
    });
}
/**
 * 进行打分合计显示
 * @param obj
 * @constructor
 */
function ShowScore(obj){
    var _$ = $(obj).parents("tbody");
    var deductPoints = 0.0;
    _$.find("input[name='score']").each(function(i,v){
        var score = ($(v).val()==null||$(v).val())==''?'0':$(v).val();
        deductPoints += parseFloat(score);
    });
    var type = _$.find("input[name='assType']").val();
    var totalPoints = _$.find("td[id='totalPoints']").text();
    _$.find("td[id='deductPoints']").text(deductPoints.toFixed(2));

    var showType= _$.find("td[id='nums']").attr('showType');
    if(showType=='1'||showType==1){
        _$.find("td[id='nums']").text(deductPoints.toFixed(2));
    }
    if(showType=='2'||showType==2){
        _$.find("td[id='nums']").text((parseFloat(totalPoints)-deductPoints).toFixed(2));
    }
    if(showType=='3'||showType==3){
        _$.find("td[id='nums']").text(-deductPoints.toFixed(2));
    }
}

function getHtml(assess_year, assess_month, scoreTableName,data){
    var tabs = '<div class="easyui-tabs" id="tab3" style="width:100%;">';
    if(data==null){
        msgError("暂时没有考核数据");
        return '';
    }else{
        for(var x=0;x<data.length;x++){
            var htm = "";
            tabs += '<div title="'+data[x].name+'" style="padding:10px;" id="assItems_'+x+'">'+
                '<div><input type="hidden" name="ass_item_id" id="ass_item_id_'+x+'" value="'+data[x].id+'" /></div>'+
                '<div style="width:90%; height:40px; line-height:40px; text-align: center;font-size: 20px;font-weight:bolder;color:#000;" id="markTitle_'+x+'">'+scoreTableName+'集中稽核'+data[x].name+'评分表</div>'+
                '<div style="width:90%;height:40px; line-height:40px; text-align: right;" id="markYearMonth_'+x+'">'+assess_year+'年'+assess_month+'月</div>'+
                '<table class="grid" id="markTable_'+x+'" width="100%" cellspacing="0" cellpadding="1" >' +
                '<thead>' +
                '<tr>' +
                '<th width="20%" colspan="2">项目</th>' +
                '<th width="20%">要求</th>' +
                '<th width="5%" >基分</th>' +
                '<th width="20%" >评分标准</th>';
            if(data[x].name.indexOf('维护质量')!=-1){//显示*/
                var obj = getShowTitle(data[x].ass_type);
                tabs += '<th width="5%" >基准值</th>' +
                    '<th width="5%" >挑战值</th>' ;
                var res = data[x].children;
                htm = showAllAssess(res);
                tabs +='<th width="10%" >扣分说明</th>' +
                    '<th width="10%" >扣分</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody><input type="hidden" name="assType" value="'+data[x].ass_type+'">';
                tabs += htm;
                tabs +=  ' <tr>' +
                    '<td colspan="3" align="right">合计</td>' +
                    '<td id="totalPoints" align="left"></td>' +
                    '<td colspan="4" align="right">扣分合计</td>' +
                    '<td id="deductPoints" align="left"></td>' +
                    '</tr>' +
                    ' <tr>' +
                    '<td colspan="8" align="right">得分合计</td>' +
                    '<td colspan="1" id="nums" align="left" showType="'+obj.asstype+'"></td>' +
                    '</tr></tbody></table></div>';
            }else{
                var res = data[x].children;
                htm = showAssess(res);
                //这里写一个方法动态显示说明
                var obj = getShowTitle(data[x].ass_type);
                tabs +='<th width="10%" >'+obj.inputTitle1+'</th>' +
                    '<th width="10%" >'+obj.inputTitle2+'</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody><input type="hidden" name="assType" value="'+data[x].ass_type+'">';
                tabs += htm;
                tabs += ' <tr>' +
                    '<td colspan="3" align="right">合计</td>' +
                    '<td id="totalPoints" align="left"></td>' +
                    '<td colspan="2" align="right">'+obj.deductTitle+'</td>' +
                    '<td id="deductPoints" align="left"></td>' +
                    '</tr>' +
                    ' <tr>' +
                    '<td colspan="6" align="right">'+obj.numTitle+'</td>' +
                    '<td colspan="1" id="nums" align="left" showType="'+obj.asstype+'"></td>' +
                    '</tr></tbody></table></div>';
            }
        }
        tabs += "</div>";
        return tabs;
    }
}
/**
 * 其中asstype 1：代表直接显示，2：用总的减去打分，3：显示负数(也是直接显示)
 * @param type
 * @returns {*}
 */
function getShowTitle(type){
    type = type==''?'2':type;
    switch(type){
        case '1':{//加分项
            return {inputTitle1:'加分说明',inputTitle2:'加分',deductTitle:'加分合计',numTitle:'得分合计',asstype:1};
            break;
        }
        case '2':{//扣分项
            return {inputTitle1:'扣分说明',inputTitle2:'扣分',deductTitle:'扣分合计',numTitle:'得分合计',asstype:2};
            break;
        }
        case '3':{//直接扣款项
            return {inputTitle1:'扣款说明',inputTitle2:'扣款',deductTitle:'扣款合计',numTitle:'款项合计',asstype:3};
            break;
        }
        case '4':{//直接加款项
            return {inputTitle1:'加款说明',inputTitle2:'加款',deductTitle:'加款合计',numTitle:'款项合计',asstype:1};
            break;
        }
        case '5':{//直接加分项
            return {inputTitle1:'加分说明',inputTitle2:'加分',deductTitle:'加分合计',numTitle:'得分合计',asstype:1};
            break;
        }
        case '6':{//直接扣分项
            return {inputTitle1:'扣分说明',inputTitle2:'扣分',deductTitle:'扣分合计',numTitle:'得分合计',asstype:2};
            break;
        }
    }
}
/**
 * 获取下一级全部html（包括基础值与挑战值）
 * @param res
 * @returns {string}
 */
function showAllAssess(res){
    var commonTab = "";
    var tbody = "";
    if(res==null){
        msgError('暂时没有考核项');
        return tbody;
    }else{
        for(var i=0;i<res.length;i++){
            var ass = res[i];
            if(ass.total==0){//一级没有子项
                tbody += "<tr><input type='hidden' score='"+ass.ass_score+"' name='common' common='"+ass.id+"'><td colspan='2' valign='center' style='vertical-align:middle;'>"+ass.name+"</td><td style='vertical-align:middle;'>"+ass.ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+ass.ass_score+"</td><td style='vertical-align:middle;'>"+ass.ass_stan+"</td><td style='vertical-align:middle;'>"+ass.base_score+"</td><td style='vertical-align:middle;'>"+ass.challenge_score+"</td><td><input type='text' value='"+ass.points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+ass.points+"' assType='"+ass.ass_type+"' ass_id='"+ass.id+"' ass_pids='"+ass.ass_pids+"' maxlength='12' /></td></tr>"
            }else{//一级有子项
                var score = (ass.ass_score==''||ass.ass_score==null||ass.ass_score=='0')?'0':ass.ass_score;
                commonTab = ass.id;
                var tChildren = ass.children;//获取子项
                for(var j=0;j<tChildren.length;j++){//二级
                    if(tChildren[j].is_hidden==0){//隐藏级，
                        /*首先把拿到的第三级作为第二级，而且合并分数*/
                        if(tChildren[j ].total==0){
                            //暂时不会有
                        }else{
                            var tsChildren = tChildren[j].children;//获取下一级
                            for(var k=0;k<tsChildren.length;k++){//三级变二级asss
                                if(tsChildren[k].total==0){//没有子项
                                    commonTab = tChildren[j].id;
                                    if(j==0&&k==0){
                                        tbody += "<tr><input type='hidden' name='common' score='"+tChildren[j].ass_score+"' common='"+commonTab+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j==0&&k!=0){
                                        tbody += "<tr><input type='hidden' name='common' score='"+tChildren[j].ass_score+"' common='"+commonTab+"'><td style='vertical-align:middle;'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j!=0&&k==0){
                                        tbody += "<tr><input type='hidden' name='common' score='"+tChildren[j].ass_score+"' common='"+commonTab+"'><td style='vertical-align:middle;'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j!=0&&k!=0){
                                        tbody += "<tr><input type='hidden' name='common' score='"+tChildren[j].ass_score+"' common='"+commonTab+"'><td style='vertical-align:middle;'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                }else{//有子项，在要求上面
                                    var tssChildren = tsChildren[k].children;
                                    for(var t=0;t<tssChildren.length;t++){
                                        if(j==0){
                                            if(k==0&&t==0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;' rowspan='"+tsChildren[k].total+"'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td style='vertical-align:middle;'>"+tssChildren[t].base_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].challenge_score+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tssChildren[t].points+"' name='score' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k==0&&t!=0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td style='vertical-align:middle;'>"+tssChildren[t].base_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].challenge_score+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tssChildren[t].points+"' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k!=0&&t==0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;' rowspan='"+tsChildren[k].total+"'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td style='vertical-align:middle;'>"+tssChildren[t].base_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].challenge_score+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tssChildren[t].points+"' name='score' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k!=0&&t!=0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td style='vertical-align:middle;'>"+tssChildren[t].base_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].challenge_score+"</td><td style='vertical-<td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tssChildren[t].points+"' name='score' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                        }else{
                                            if(k==0&&t==0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;' rowspan='"+tsChildren[k].total+"'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td style='vertical-align:middle;'>"+tssChildren[t].base_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].challenge_score+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tssChildren[t].points+"' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k==0&&t!=0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td style='vertical-align:middle;'>"+tssChildren[t].base_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].challenge_score+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tssChildren[t].points+"' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k!=0&&t==0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;' rowspan='"+tsChildren[k].total+"'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td style='vertical-align:middle;'>"+tssChildren[t].base_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].challenge_score+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tssChildren[t].points+"' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k!=0&&t!=0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td style='vertical-align:middle;'>"+tssChildren[t].base_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].challenge_score+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tssChildren[t].points+"' name='score' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }else{//显示级
                        if(tChildren[j].total==0){//没有子项
                            if(score==0){//没有分数
                                commonTab = tChildren[j].id;
                                if(j==0){
                                    tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_stan+"</td><td style='vertical-align:middle;'>"+tChildren[j].base_score+"</td><td style='vertical-align:middle;'>"+tChildren[j].challenge_score+"</td><td><input type='text' value='"+tChildren[j].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tChildren[j].points+"' name='score' assType='"+tChildren[j].ass_type+"' ass_id='"+tChildren[j].id+"' ass_pids='"+tChildren[j].ass_pids+"' maxlength='12' /></td></tr>";
                                }else{
                                    tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_stan+"</td><td style='vertical-align:middle;'>"+tChildren[j].base_score+"</td><td style='vertical-align:middle;'>"+tChildren[j].challenge_score+"</td><td><input type='text' value='"+tChildren[j].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tChildren[j].points+"' assType='"+tChildren[j].ass_type+"' ass_id='"+tChildren[j].id+"' ass_pids='"+tChildren[j].ass_pids+"' maxlength='12' /></td></tr>";
                                }
                            }else{//有分数
                                if(j==0){
                                    tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+ass.total+"' id='totalPoint'>"+score+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_stan+"</td><td style='vertical-align:middle;'>"+tChildren[j].base_score+"</td><td style='vertical-align:middle;'>"+tChildren[j].challenge_score+"</td><td><input type='text' value='"+tChildren[j].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tChildren[j].points+"' name='score' assType='"+tChildren[j].ass_type+"' ass_id='"+tChildren[j].id+"' ass_pids='"+tChildren[j].ass_pids+"' maxlength='12' /></td></tr>";
                                }else{
                                    tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td style='vertical-align:middle;'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_require+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_stan+"</td><td style='vertical-align:middle;'>"+tChildren[j].base_score+"</td><td style='vertical-align:middle;'>"+tChildren[j].challenge_score+"</td><td><input type='text' value='"+tChildren[j].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tChildren[j].points+"' name='score' assType='"+tChildren[j].ass_type+"' ass_id='"+tChildren[j].id+"' ass_pids='"+tChildren[j].ass_pids+"' maxlength='12' /></td></tr>";
                                }
                            }
                        }else{//有子项，在‘要求’位置了
                            var tsChildren = tChildren[j].children;
                            if(score==0){
                                var tscore = (tChildren[j].ass_score==''||tChildren[j].ass_score===null||tChildren[j].ass_score==='0')?'0':tChildren[j].ass_score;
                                for(var k=0;k<tsChildren.length;k++){
                                    if(tscore==0){//项目子项无分数,分数在‘要求’上
                                        commonTab = tsChildren[k].id;
                                        if(j==0&&k==0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tsChildren[k].ass_score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tsChildren[k].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j==0&&k!=0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tsChildren[k].ass_score+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tsChildren[k].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j!=0&&k==0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tsChildren[k].ass_score+"'><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tsChildren[k].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j!=0&&k!=0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tsChildren[k].ass_score+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tsChildren[k].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+ass.ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                    }else{//项目子项有分数，分数在子项目上
                                        commonTab = tChildren[j].id;
                                        if(j==0&&k==0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tscore+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tscore+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j==0&&k!=0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tscore+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' assType='"+tsChildren[k].ass_type+"' value='"+tsChildren[k].points+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j!=0&&k==0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tscore+"'><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tscore+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j!=0&&k!=0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tscore+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                    }
                                }
                            }else{//有分数，子项就没有分数
                                for(var k=0;k<tsChildren.length;k++){
                                    if(j==0&&k==0){
                                        tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+ass.total+"'>"+score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j==0&&k!=0){
                                        tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j!=0&&k==0){
                                        tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j!=0&&k!=0){
                                        tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td style='vertical-align:middle;'>"+tsChildren[k].base_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].challenge_score+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
    }
    return tbody;
}
/**
 * 获取下一级全部html（不包括基础值与挑战值）
 * @param res
 * @returns {string}
 */
function showAssess(res){
    var tbody = "";
    if(res==null){
        msgError('暂时没有考核项');
        return tbody;
    }else{
        for(var i=0;i<res.length;i++){
            var ass = res[i];
            if(ass.total==0){//一级没有子项
                tbody += "<tr><input type='hidden' score='"+ass.ass_score+"' name='common' common='"+ass.id+"'><td colspan='2' valign='center' style='vertical-align:middle;'>"+ass.name+"</td><td style='vertical-align:middle;'>"+ass.ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+ass.ass_score+"</td><td style='vertical-align:middle;'>"+ass.ass_stan+"</td><td><input type='text' value='"+ass.points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+ass.points+"' assType='"+ass.ass_type+"' ass_id='"+ass.id+"' ass_pids='"+ass.ass_pids+"' maxlength='12' /></td></tr>"
            }else{//一级有子项
                var score = (ass.ass_score==''||ass.ass_score==null||ass.ass_score=='0')?'0':ass.ass_score;
                commonTab = ass.id;
                var tChildren = ass.children;//获取子项
                for(var j=0;j<tChildren.length;j++){//二级
                    if(tChildren[j].is_hidden==0){//隐藏级，
                        /*首先把拿到的第三级作为第二级，而且合并分数*/
                        if(tChildren[j].total==0){
                            //暂时不会有
                        }else{
                            var tsChildren = tChildren[j].children;//获取下一级
                            for(var k=0;k<tsChildren.length;k++){//三级变二级
                                commonTab = tChildren[j].id;
                                if(tsChildren[k].total==0){//没有子项
                                    if(j==0&&k==0){
                                        tbody += "<tr><input type='hidden' name='common' score='"+tChildren[j].ass_score+"' common='"+commonTab+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j==0&&k!=0){
                                        tbody += "<tr><input type='hidden' name='common' score='"+tChildren[j].ass_score+"' common='"+commonTab+"'><td style='vertical-align:middle;'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j!=0&&k==0){
                                        tbody += "<tr><input type='hidden' name='common' score='"+tChildren[j].ass_score+"' common='"+commonTab+"'><td style='vertical-align:middle;'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j!=0&&k!=0){
                                        tbody += "<tr><input type='hidden' name='common' score='"+tChildren[j].ass_score+"' common='"+commonTab+"'><td style='vertical-align:middle;'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                }else{//有子项，在要求上面
                                    var tssChildren = tsChildren[k].children;
                                    for(var t=0;t<tssChildren.length;t++){
                                        if(j==0){
                                            if(k==0&&t==0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;' rowspan='"+tsChildren[k].total+"'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tssChildren[t].points+"' name='score' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k==0&&t!=0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tssChildren[t].points+"' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k!=0&&t==0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;' rowspan='"+tsChildren[k].total+"'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tssChildren[t].points+"' name='score' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k!=0&&t!=0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tssChildren[t].points+"' name='score' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                        }else{
                                            if(k==0&&t==0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;' rowspan='"+tsChildren[k].total+"'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tssChildren[t].points+"' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k==0&&t!=0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tssChildren[t].points+"' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k!=0&&t==0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;' rowspan='"+tsChildren[k].total+"'>"+tsChildren[k].name+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tssChildren[t].points+"' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }
                                            if(k!=0&&t!=0){
                                                tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tssChildren[t].ass_require+"</td><td style='vertical-align:middle;'>"+tssChildren[t].ass_stan+"</td><td><input type='text' value='"+tssChildren[t].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tssChildren[t].points+"' name='score' assType='"+tssChildren[t].ass_type+"' ass_id='"+tssChildren[t].id+"' ass_pids='"+tssChildren[t].ass_pids+"' maxlength='12' /></td></tr>";
                                            }}
                                    }
                                }
                            }
                        }
                    }else{//显示级
                        if(tChildren[j].total==0){//没有子项
                            if(score==0){//没有分数
                                commonTab = tChildren[j].id;
                                if(j==0){
                                    tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_stan+"</td><td><input type='text' value='"+tChildren[j].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tChildren[j].points+"' name='score' assType='"+tChildren[j].ass_type+"' ass_id='"+tChildren[j].id+"' ass_pids='"+tChildren[j].ass_pids+"' maxlength='12' /></td></tr>";
                                }else{
                                    tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tChildren[j].ass_score+"'><td style='vertical-align:middle;'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tChildren[j].ass_score+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_stan+"</td><td><input type='text' value='"+tChildren[j].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tChildren[j].points+"' assType='"+tChildren[j].ass_type+"' ass_id='"+tChildren[j].id+"' ass_pids='"+tChildren[j].ass_pids+"' maxlength='12' /></td></tr>";
                                }
                            }else{//有分数
                                if(j==0){
                                    tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+ass.total+"' id='totalPoint'>"+score+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_stan+"</td><td><input type='text' value='"+tChildren[j].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tChildren[j].points+"' name='score' assType='"+tChildren[j].ass_type+"' ass_id='"+tChildren[j].id+"' ass_pids='"+tChildren[j].ass_pids+"' maxlength='12' /></td></tr>";
                                }else{
                                    tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td style='vertical-align:middle;'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_require+"</td><td style='vertical-align:middle;'>"+tChildren[j].ass_stan+"</td><td><input type='text' value='"+tChildren[j].points_remark+"' name='scoreRemark'/></td><td><input type='text' value='"+tChildren[j].points+"' name='score' assType='"+tChildren[j].ass_type+"' ass_id='"+tChildren[j].id+"' ass_pids='"+tChildren[j].ass_pids+"' maxlength='12' /></td></tr>";
                                }
                            }
                        }else{//有子项，在‘要求’位置了
                            var tsChildren = tChildren[j].children;
                            if(score==0){
                                var tscore = (tChildren[j].ass_score==''||tChildren[j].ass_score===null||tChildren[j].ass_score==='0')?'0':tChildren[j].ass_score;
                                for(var k=0;k<tsChildren.length;k++){
                                    if(tscore==0){//项目子项无分数,分数在‘要求’上
                                        commonTab = tsChildren[k].id;
                                        if(j==0&&k==0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tsChildren[k].ass_score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tsChildren[k].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j==0&&k!=0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tsChildren[k].ass_score+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tsChildren[k].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j!=0&&k==0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tsChildren[k].ass_score+"'><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tsChildren[k].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j!=0&&k!=0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tsChildren[k].ass_score+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' id='totalPoint'>"+tsChildren[k].ass_score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                    }else{//项目子项有分数，分数在子项目上
                                        commonTab = tChildren[j].id;
                                        if(j==0&&k==0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tscore+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tscore+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j==0&&k!=0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tscore+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' assType='"+tsChildren[k].ass_type+"' value='"+tsChildren[k].points+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j!=0&&k==0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tscore+"'><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"' id='totalPoint'>"+tscore+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                        if(j!=0&&k!=0){
                                            tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+tscore+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                        }
                                    }
                                }
                            }else{//有分数，子项就没有分数
                                for(var k=0;k<tsChildren.length;k++){
                                    if(j==0&&k==0){
                                        tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td valign='center' style='vertical-align:middle;' rowspan='"+ass.total+"'>"+ass.name+"</td><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;' rowspan='"+ass.total+"'>"+score+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j==0&&k!=0){
                                        tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+ass.ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j!=0&&k==0){
                                        tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td style='vertical-align:middle;' rowspan='"+tChildren[j].total+"'>"+tChildren[j].name+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                    if(j!=0&&k!=0){
                                        tbody += "<tr><input type='hidden' name='common' common='"+commonTab+"' score='"+score+"'><td style='vertical-align:middle;'>"+tsChildren[k].ass_require+"</td><td style='vertical-align:middle;'>"+tsChildren[k].ass_stan+"</td><td><input type='text' value='"+tsChildren[k].points_remark+"' name='scoreRemark'/></td><td><input type='text' name='score' value='"+tsChildren[k].points+"' assType='"+tsChildren[k].ass_type+"' ass_id='"+tsChildren[k].id+"' ass_pids='"+tsChildren[k].ass_pids+"' maxlength='12' /></td></tr>";
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
    }
    return tbody;
}
/**
 * 获取显示的字体颜色，如果是加分或者加款为蓝色，减分或者扣款为红色
 * @param type
 * @returns {*}
 */
function getShowColor(type){
    type = type==''?'2':type;
    switch(type){
        case '1':{//加分项,暂时没有
            return 'blue';
            break;
        }
        case '2':{//扣分项
            return 'red';
            break;
        }
        case '3':{//直接扣款项
            return 'red';
            break;
        }
        case '4':{//直接加款项
            return 'blue';
            break;
        }
        case '5':{//直接加分项
            return 'blue';
            break;
        }
        case '6':{//直接扣分项
            return 'red';
            break;
        }
    }
}


function addBtn(item_code, item_trend, item_name){
    <!-- 审核意见 -->
    var html = '<div class="info-box" style="margin-top:5px;overflow-x:hidden;">'+
        '<label class="col-sm-2 control-label no-padding-right">确认/审核意见：</label>'+
        '<div class="col-sm-8"><textarea class="form-control easyui-validatebox" data-options="required:true" rows="6" id="remark" placeholder="请输入意见"></textarea></div>'+
        '</div>'+
        '<div style="text-align:center;margin-bottom:10px;">'+
        '<div class="form-group"><button type="button" class="btn btn-ts" name="detailBtn" onclick="detailDoSure(\''+item_code+'\',\''+item_trend+'\')">'+item_name+'</button></div>'+
        '</div>';
    $("#tab3").tabs('add',{
        title: '驳回',
        selected: false,
        content:html});
}

/**
 * 计算arrays数组中的平均数或者方差等，，，，
 * @param arrays：要算的数组
 * @param type：类别
 */
function calculate(arrays,type){
    var totals = 0.0;
    if(arrays==null||arrays.length==0){
        return null;
    }
    if(type==1){//平均数
        for(var i=0;i<arrays.length;i++){
            totals += arrays[i];
        }
        totals = totals/arrays.length;
        return totals;
    }
    //......后续补充
}


