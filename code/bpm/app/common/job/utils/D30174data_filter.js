/**
 *
 * @param sourceList 原始数据集合处理List<String[]>
 */
var path = require('path');
exports.doFilter=function(sourceList){
    var list=[];
    var map={};
    for(var i=0;i<sourceList.length;i++){
        var listItem=sourceList[i];
        // 区县编码
        var countyCode = listItem[3];
        // 业务类型
        var type = listItem[20];
        connect(map,countyCode,type,"新增放号",listItem);
        connect(map,countyCode,type,"4G套餐",listItem);
        connect(map,countyCode,type,"终端销售",listItem);
        connect(map,countyCode,type,"行卡办理增值业务",listItem);
    }
        for(var key in map){
            //List<String[]>
            var currValues=map[key];
            if (!currValues) {
                continue;
            }
            //console.log(currValues);
            var index = randomIndex(currValues.length);
            var randomValue = currValues[index];
            list.push(randomValue);
        }
    return list;
}

function connect(map,countyCode,type,typeStart,values){
    if(type&&type.startsWith(typeStart)){
        var key = countyCode + "-" + typeStart;
        var theList=map[key];
        if(!theList){
            theList=[];
            map[key]=theList;
        }
        theList.push(values);
    }
}

function randomIndex(size){
    var index=Math.floor(size-1)
    return index;
}


/**
 *
 * @param sourceList 处理后新数据集合List<String[]>
 */
//exports.doFilter=function(currDate,sourceList){
//    var newList=[];
//    if(sourceList){
//        for(var i=0;i<sourceList.length;i++){
//            var item=sourceList[i];
//            var itemTem=[
//                "<tr>"+
//                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">身份证归属省：</td><td width=\"20%\">"+item[0]+"</td>"+
//                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">身份证号：</td><td width=\"20%\">"+item[1]+"</td>"+
//                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">手机号码：</td><td width=\"21%\">"+item[2]+"</td>"+
//                "</tr>"+
//                "<tr>"+
//                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">手机号码归属地：</td><td width=\"20%\">"+item[3]+"</td>"+
//                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">入网时间：</td><td width=\"20%\">"+currDate+"</td>"+
//                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">入网类型：</td><td width=\"21%\">"+item[5]+"</td>"+
//                "</tr>"+
//                "<tr>"+
//                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">受理工号：</td><td width=\"20%\">"+item[6]+"</td>"+
//                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">工号姓名：</td><td width=\"20%\">"+item[7]+"</td>"+
//                "</tr>",
//                currDate
//            ];
//            newList[i]=itemTem;
//        }
//    }
//    return newList;
//}