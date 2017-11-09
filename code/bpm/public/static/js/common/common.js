/**
 * Created by zlc on 2017/6/20.
 */

/**
 * js时间格式化类库
 * @param format
 * @returns {*}
 */
Date.prototype.format =function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}
//验证是否是有效的身份证信息
function isCardID(sId){
    var iSum=0 ;
    var info="" ;
    if(!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
    sId=sId.replace(/x$/i,"a");
    if(aCity[parseInt(sId.substr(0,2))]==null) return "你的身份证地区非法";
    sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2));
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return "身份证上的出生日期非法";
    for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
    if(iSum%11!=1) return "你输入的身份证号非法";
    return true;//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女")
}

//手机号码验证
function checkPhone(value){
    if(!(/^1[3|4|5|7|8]\d{9}$/.test(value))){
        return false;
    }
    return true;
}

//邮箱验证
function checkEmail(value){
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!myreg.test(value)){
        return false;
    }
    return true;
}

/**
 * 获取当前时间 yyyy-MM-dd
 * 如 2017-06-20
 */
function  getNowDateFormate1() {
    
    var now = new Date();
    return now.format('yyyy-MM-dd');
}
/**
 * 获取当月1号日期
 * 如 2017-06-01
 */
function getFirstDayOfMonth() {
    var now  = new Date();
    var year = now.getFullYear();
    var month = "" + (now.getMonth()+1);
    if(month.length < 2){
        month = "0"+month;
    }

    return year+"-"+month+"-01";

}

