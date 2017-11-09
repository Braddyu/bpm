/**
 *
 * @param currDate
 * @param sourceList 原始数据集合List<String[]>
 * @returns {Array}
 * 用于1到3个实名违规文件导入数据过滤
 */
exports.doFilterForNamNum1_3=function(currDate,sourceList){
    var newList=[];
    if(sourceList){
        for(var i=0;i<sourceList.length;i++){
            var item=sourceList[i];
            var itemTem=[
                "<tr>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">身份证归属省：</td><td width=\"20%\">"+item[0]+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">身份证号：</td><td width=\"20%\">"+item[1]+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">手机号码：</td><td width=\"21%\">"+item[2]+"</td>"+
                "</tr>"+
                "<tr>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">手机号码归属地：</td><td width=\"20%\">"+item[3]+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">入网时间：</td><td width=\"20%\">"+currDate+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">入网类型：</td><td width=\"21%\">"+item[5]+"</td>"+
                "</tr>"+
                "<tr>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">受理工号：</td><td width=\"20%\">"+item[6]+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">工号姓名：</td><td width=\"20%\">"+item[7]+"</td>"+
                "</tr>",
                currDate
            ];
            newList[i]=itemTem;
        }
    }
    return newList;
}

/**
 *
 * @param currDate 当前日期
 * @param sourceList 原始数据集合List<String[]>
 * @returns {Array}
 * 用于第4个实名违规文件导入数据过滤
 */
exports.doFilterForNamNum4=function(currDate,sourceList){
    var newList=[];
    if(sourceList){
        for(var i=0;i<sourceList.length;i++){
            var item=sourceList[i];
            if(item[6].startsWith("CB")||item[6].startsWith("系统TASK")||item[6].startsWith("批量业务")){
                continue;
            }
            var itemTem=[
                "<tr>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">归属地市：</td><td width=\"20%\">"+item[0]+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">订单编号：</td><td width=\"20%\">"+item[1]+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">受理号码：</td><td width=\"21%\">"+item[2]+"</td>"+
                "</tr>"+
                "<tr>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">受理时间：</td><td width=\"20%\">"+currDate+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">受理业务名称：</td><td width=\"20%\">"+item[4]+"</td>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">操作员工号：</td><td width=\"21%\">"+item[5]+"</td>"+
                "</tr>"+
                "<tr>"+
                "<td class=\"info widget-caption themeprimary\" width=\"13%\" style=\"vertical-align:middle;\">操作员姓名：</td><td width=\"20%\">"+item[6]+"</td>"+
                "</tr>",currDate,item[6]+"0~6点受理"+item[4]+"异常"
            ];
            newList[i]=itemTem;
        }
    }
    return newList;
}