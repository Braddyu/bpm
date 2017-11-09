var maintain_professional;
var user_education;
var userId = '';

//字典加载
function getSelectValue(callback) {
    var dictCode ="'"+Dict_Code.aptitude_user_sex+"','"+
        Dict_Code.org_unity+"','"+
        Dict_Code.aptitude_user_status+"','"+
         Dict_Code.aptitude_user_grade+"','"+
        Dict_Code.aptitude_user_essence+"','"+
        Dict_Code.aptitude_user_post_certification+"','"+
        Dict_Code.aptitude_user_role+"','"+
        Dict_Code.aptitude_user_blacklist+"','"+
        Dict_Code.aptitude_user_education+"','"+
        Dict_Code.aptitude_maintain_professional+"'";
    $.ajax({
        url: basePath + '/api/dictionary/dict_route/allDictAndAttr',
        type: 'get',
        data:{dict_code:dictCode},
        success: function (data) {
            $.each(data, function (i, r) {
                var  result = r.children;
                if(r.dict_code ==Dict_Code.aptitude_user_sex){
                    // 性别
                    $('#userSex').combobox({
                        data:result,
                        editable:false,
                        valueField:'field_value',
                        textField:'field_name',
                        multiple:false,
                        required:true
                    });
                }
				 // 骨干人员
                if(r.dict_code ==Dict_Code.aptitude_user_essence){
                    $("#essence_personnel").combobox({
                        data:result,
                        editable:false,
                        valueField:'field_value',
                        textField:'field_name',
                        multiple:false,
                        required:true,
                        onLoadSuccess:function(){
                            $("#essence_personnel").combobox("setValue",'essence2');
                        },
                    });
                }

                // 在职状态
                if(r.dict_code ==Dict_Code.aptitude_user_status){
                    $("#status").combobox({
                        data:result,
                        editable:false,
                        valueField:'field_value',
                        textField:'field_name',
                        multiple:false,
                        required:true,
                        onLoadSuccess:function(){
                            $("#status").combobox("setValue",'zzStatus');
                        },
                    });
                }
                // 是否通过上岗认证一
                if(r.dict_code ==Dict_Code.aptitude_user_post_certification){
                    $("#approve1").combobox({
                        data:result,
                        editable:false,
                        valueField:'field_value',
                        textField:'field_name',
                        multiple:false,
                        required:false
                    });
                }
                // 是否黑名单标示
                if(r.dict_code ==Dict_Code.aptitude_user_blacklist){
                    $("#blacklist").combobox({
                        data:result,
                        editable:false,
                        valueField:'field_value',
                        textField:'field_name',
                        multiple:false,
                        required:false
                    });
                }
                // 获取学历
                if(r.dict_code ==Dict_Code.aptitude_user_education){
                    user_education = result;
                   $("#highest_education").combobox({
                        data:result,
                        editable:false,
                        valueField:'field_value',
                        textField:'field_name',
                        multiple:false,
                        required:false
                    });
                }
                if(r.dict_code ==Dict_Code.aptitude_maintain_professional) {
                    maintain_professional = result;
                    $("#management_major").combobox({
                        data: result,
                        editable: false,
                        valueField: 'field_value',
                        textField: 'field_name',
                        multiple: false,
                        required: true
                    });
                }
            });
            callback();
        }
    });
}
//获取密码
function getPassWord(){
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/getPassWord',
        method:"get",
        success:function(data){
            var password=data.data.password;
            $("#password1").textbox("setValue",password);
            $("#password").textbox("setValue",password);
        }
    });
}


//验证
$(function() {
    $('#user_name').textbox('textbox').bind('blur', function() {
        var user_name = $("#user_name").textbox("getValue");
        if(user_name!='') {
            $.ajax({
                url: basePath + '/api/personnel/personnel_route/getUserName',
                method: "post",
                data: {user_name: user_name, user_id: userId},
                success: function (data) {
                    $("#user_name").attr("data-status", data);
                    if (data == "false" && user_name !== null) {
                        alert("用户名已存在，请重新输入！");
                        $("#user_name").textbox("setValue", "");
                    }
                }
            });
        }
    });
    $('#postTime').textbox('textbox').bind('blur', function() {
        var postTime = $("#postTime").textbox("getValue");
        var na=isNaN(postTime);
        if(na){
            alert("你输入的格式有误，请从先输入");
            $("#postTime").textbox("setValue","");
        }else{
            if(postTime<1||postTime>50){
                alert("你输入的年限有误，请从先输入");
                $("#postTime").textbox("setValue","");
            }
        }
    });
    $('#labour_validity').textbox('textbox').bind('blur', function() {
        var labour_validity = $("#labour_validity").textbox("getValue");
       var na=isNaN(labour_validity);
        if(na){
            alert("你输入的格式有误，请从先输入");
            $("#labour_validity").textbox("setValue","");
        }else{
            if(labour_validity<1||labour_validity>50){
                alert("你输入的年限有误，请从先输入");
                $("#postTime").textbox("setValue","");
            }
        }
    });
//拼音
    $('#name').textbox('textbox').bind('blur', function() {
        var name = $("#name").textbox("getValue");
      var english_name=  ConvertPinyin(name);
        $("#english_name").textbox("setValue",english_name);
    });

//密码确认
    $('#password1').textbox('textbox').bind('blur', function() {
        var password1 = $("#password1").textbox("getValue");
        var password = $("#password").textbox("getValue");
        if(password1!=password){
            alert("你输入的密码不一致，请从先输入");
            $("#password1").textbox("setValue","");
            $("#password").textbox("setValue","");
        }
    });
//身份证验证
    $('#identityId').textbox('textbox').bind('blur', function() {
        var identityId = $("#identityId").textbox("getValue");
        if(identityId!='' && identityId.length == 18){
            $.ajax({
                url:basePath + '/api/personnel/personnel_route/getUserNameIdentity',
                method:"post",
                data:{identityId:identityId,user_id:userId},
                success:function(data){
                    if(data.success==false && identityId!=null ){
                        if(data.code==-1){
                            alert(data.msg);
                            return ;
                        }else{
                            alert(data.msg);
                            return ;

                        }
                    }
                }
            });
        }

    });
    //手机号码唯一验证
    $('#phone').textbox('textbox').bind('blur', function() {
        var phone = $("#phone").textbox("getValue");
        if(phone!='' && phone.length==11){
            $.ajax({
                url:basePath + '/api/personnel/personnel_route/getUserNamePhone',
                method:"post",
                data:{identityId:phone,user_id:userId},
                success:function(data){
                    if(data.success==false && phone!=null ){
                        if(data.code==-1){
                            alert(data.msg);
                            return ;
                        }else{
                            alert(data.msg);
                           // $("#phone").textbox("setValue","");
                            return ;

                        }
                    }
                }
            });
        }

    });

});
//生成员工编码
function setInterval(emp_Code) {
    $.ajax({
        url:basePath + '/api/personnel/personnel_route/countCode?operating_company='+ emp_Code,
        type: 'get',
        success: function (data) {
            if (data.success) {
                var num = data.data[0].total;
                var len = 4;//显示的长度
                num = num + 1;
                while(num.toString().length < len) {
                    num = '0' + num;
                }
                var emp_Code= $("#company").combobox('getValue')+''+num;
                $("#empCode").textbox("setValue",emp_Code);

            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}
//类型部门
function getDeptType(org_unity,org_code,org_code1, number){
    $('#deptType').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/getDeptType',
        editable:false,
        valueField:'field_value',
        textField:'field_name',
        multiple:false,
        required:true,
        onLoadSuccess:function(){
            if(org_unity&&org_unity!='GS'){
                var data = $('#deptType').combobox('getData');
                $("#deptType ").combobox('select',org_unity);
            }

        },
        onChange:function(){
            var company = $('#company').combobox("getValues");
            var deptType = $('#deptType').combobox("getValues");
            if(number==1){
                number -=1;
            }else{
                number -=1;
            }
            if( number!=0){
                getDept(company, deptType, org_code,null);

            }
        }
    });
}
//角色
function getRole(org_unity){
    $('#role').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/queryRole?org_unity='+org_unity,
        editable:false,
        valueField:'role_code',
        textField:'role_name',
        multiple:true,
        required:true,
        onLoadSuccess:function(){
            var data = $('#role').combobox('getData');
            $("#role").combobox('select',data[0].role_code);
        }
    });
}

// 获取集中稽核公司z
function getCompany(org_code1,org_unity,org_code){
        $('#company').combobox({
            method: 'get',
            url: basePath + '/api/personnel/personnel_route/queryCompany',
            editable:false,
            valueField:'org_code',
            textField:'org_name',
            multiple:false,
            required:true,
            onLoadSuccess:function(){
                getDeptType(org_unity,org_code,org_code1,1);
                if(org_code1==null){
                    var data = $('#company').combobox('getData');
                    $("#company").combobox('select',data[0].org_code);
                    var emp_Code= $("#company").combobox('getValue');
                    setInterval(emp_Code);
                }else{
                    var data = $('#company').combobox('getData');
                    $("#company").combobox('select',org_code1);
                    var emp_Code= $("#company").combobox('getValue');
                    setInterval(emp_Code);
                }

            }
        });
}

//获取类别
function  getMajor(code){
    // 主要集中稽核类别
    $('#major').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/getMajor?code='+code,
        editable:false,
        valueField:'field_value',
        textField:'field_name',
        multiple:true,
        required:true,
    });

}
// 获取所属地市
function getCities(){
    $('#cities').combobox({
        method: 'get',
        url: basePath +'/api/personnel/personnel_route/queryCity',
        editable:false,
        valueField:'id',
        textField:'area_name',
        multiple:false,
        required:false,
       /* onLoadSuccess:function(){
            var data = $('#cities').combobox('getData');
            $("#cities ").combobox('select',data[0].id);
        },
        onChange:function(){
            var city = $('#cities').combobox("getValues");
        }*/
    });
}
// 获取所属区县
function  getCountries(cityPid, counties){
    var deptType = $("#deptType").combobox("getValue");
    $('#counties').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/queryCounties',
        editable:false,
        valueField:'id',
        textField:'area_name',
        multiple:false,
        required:false,
        /*onLoadSuccess:function(){
            if(counties !=null){
                $("#counties").combobox('select',counties);
            } else{
                $("#counties").combobox('setValue',"");

            }
        }*/
    });
}

// 获取部门
function getDept(company, deptType, belongDept,ds){
    var $belongDept = $("#belongDept");
    $belongDept.combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/queryDept?org_pid='+company+"&org_unity="+deptType,
        editable:false,
        valueField:'org_code',
        textField:'org_name',
        multiple:false,
        required:true,
        onLoadSuccess:function(){
            if(belongDept&&belongDept.length!=9){
                if(ds=='org'){
                    $("#belongDept").combobox('select',belongDept);
                }
            }
        },
        onSelect:function(r){
            var dataArr = $belongDept.combobox("getData");
            var dept=$belongDept.combobox('getValue');
            for(var i in dataArr){
                if(dataArr[i].org_code == dept){
                    $("#cities").combobox("setValue",dataArr[i].belong_city);
                    $("#counties").combobox("setValue",dataArr[i].belong_area);
                   getMajor(dataArr[i].maintain_professional)
                }
            }
            if(dept.length==21&&ds==null){
                getDeptUser(dept);

            }

        },
        filter: function(q, row){
            var opts = $(this).combobox('options');
            //row[opts.textField].indexOf(q)== 1;//从头匹配
            return row[opts.textField].indexOf(q) >-1 ; //任意匹配
        },
    });
}


//判断该维护站是否超过5人
function getDeptUser(belongDept){
    $.ajax({
        url:basePath + '/api/personnel/personnel_route/getDeptCompany?belong_department='+ belongDept,
        type: 'get',
        success: function (data) {
            if (data.success) {
                var num = data.data[0].total;
                if(num>=5){
                    msgConfirm("该维护站已达上限！确认继续操作？",function(result){
                        if(!result){
                            window.location.href= basePath + '/user_info';
                        }
                    })
                }/*else{
                 var   n=5-num;
                    alert("该维护站人员差"+n+"人达到上限！")
                }*/
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
};


//---------------------------------------------------------------新增-----------------
//新增基本信息
function addUserInfo(){
    var valid_1 = $('#name').textbox("isValid");
    var valid_2 = $('#userSex').combobox("isValid");
    var valid_3 = $('#user_name').textbox("isValid");
    var valid_4 = $('#user_age').textbox("isValid");
    var valid_5 = $('#empCode').textbox("isValid");
    var valid_6 = $('#password').textbox("isValid");
    var valid_8 = $('#company').combobox("isValid");
    var valid_9 = $('#deptType').combobox("isValid");
    var valid_10 = $('#belongDept').combobox("isValid");
    var valid_11 = $('#major').combobox("isValid");
    var valid_12 = $('#status').combobox("isValid");
    var valid_14 = $('#role').combobox("isValid");
    var valid_17 = $('#identityId').textbox("isValid");
    var valid_18 = $('#phone').textbox("isValid");
    var valid_19 = $('#email').textbox("isValid");
    var valid_20 = $('#password1').textbox("isValid");
    var valid_22= $('#essence_personnel').combobox("isValid");
    var valid_21= $('#labour_validity').combobox("isValid");
    if($("#contractFiles").val()!=''){
        var contractFiles=document.getElementById("contractFiles").value;
        if(!/\.(pdf)$/.test(contractFiles)) {
            alert("合同附件文件类型有误，必须为PDF格式！");
            return ;
        }
    }
    if($("#educationFiles").val()!=''){
        var educationFiles=document.getElementById("educationFiles").value;
        if(!/\.(pdf)$/.test(educationFiles)) {
            alert("学历附件文件类型有误，必须为PDF格式！");
            return ;
        }
    }
    if(!valid_1 || !valid_2 || !valid_3 || !valid_4 || !valid_5 || !valid_6  || !valid_8 ||
        !valid_9 || !valid_10 || !valid_11 || !valid_12 || !valid_14  || !valid_17
        || !valid_18 || !valid_19||!valid_20||!valid_22||!valid_21){
        $('html,body').animate({scrollTop:100});
        alert('你有验证未通过或者必填项未完成!');
        return false;
    }
  /*  var getDept=$("#belongDept").combobox('getValue');
    if(getDept==null||getDept==undefined||getDept==''){
        alert('你的部门填写有误，请重新选择!');
        $("#belongDept").combobox('select','');
        return false;
    }*/

    var identityId = $("#identityId").textbox("getValue");
    if(identityId==''){
        alert("身份证信息不能为空！");
        return ;
    }
    if( identityId.length!= 18){
        alert("输入身份证号码有误！");
        return false;
    }
    var phone = $("#phone").textbox("getValue");
    var user_name = $("#user_name").textbox("getValue");
    //提交前验证防止提交多条信息
    $.ajax({
        url:basePath + '/api/personnel/personnel_route/getUserName1',
        method:"post",
        data:{identityId:identityId,phone:phone,user_name:user_name,user_id:userId},
        success:function(data){
            if(data.success==false  ){
                if(data.code==-1){
                    alert(data.msg);
                    return ;
                }else{
                    alert(data.msg);
                    return ;

                }
            }else{
                addUser();

            }
        }
    });



}
//新增技能
function addUserSkill(){
    $("#user_id1").val(userId);
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/addUserSkill',
        type: 'post',
        data:$("#cab_form1").serializeJson(),
        success: function (data) {
            if (data.code == 200) {
                getSkill();
                msgSuccess(data.msg);

            }else if (data.code == 100) {
                msgSuccess(data.msg)
            }
            else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}
//新增证书
function addUserCert(){
    if($("#myFilesCert_0").val()!=''){
        var myFilesCert_0=document.getElementById("myFilesCert_0").value;
        if(!/\.(pdf)$/.test(myFilesCert_0)) {
            alert("证书附件文件类型有误，必须为PDF格式！");
            return ;
        }
    }
    $("#user_id2").val(userId);
    $("#cab_form2").form({
        url:basePath + '/api/personnel/user_modify_route/addUserCert',
        onSubmit: function(){
        },
        dataType:'json',
        success:function(data){
           data = JSON.parse(data);
            if(data.success){
                msgSuccess(data.msg);
                getCert();
            }else {

                msgError(data.msg)
            }
        }
    });

    $("#cab_form2").submit();

}
//新增工作
function addUserWork(){
    $("#user_id3").val(userId);
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/addUserWork',
        type: 'post',
        data:$("#cab_form3").serializeJson(),
        success: function (data) {
            if (data.code == 200) {
                getWork();
                msgSuccess(data.msg);
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}
//新增学习
function addUserStudy(){
    $("#user_id4").val(userId);
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/addUserStudy',
        type: 'post',
        data:$("#cab_form4").serializeJson(),
        success: function (data) {
            if (data.code == 200) {
                getStudy();
                msgSuccess(data.msg);
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}
//新增培训
function addUserEducation(){
    $("#user_id5").val(userId);
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/addUserEducation',
        type: 'post',
        data:$("#cab_form5").serializeJson() ,
        success: function (data) {
           /* $("#anluEducation").attr('disabled','disabled');*/
            if (data.code == 200) {
                msgSuccess(data.msg);
                getEducation();
            }else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}
//新增奖励
function addUserReward(){
    if($("#myFilesRe_0").val()!=''){
        var contractFiles=document.getElementById("myFilesRe_0").value;
        if(!/\.(pdf)$/.test(contractFiles)) {
            alert("奖励文件类型有误，必须为PDF格式！");
            return ;
        }
    }

    $("#user_id6").val(userId);
    $("#cab_form6").form({
        url:basePath + '/api/personnel/user_modify_route/addUserReward',
        success:function(data){
            data = JSON.parse(data);
            if(data.success){
                getReward();
                msgSuccess(data.msg)
            }else {

                msgError(data.msg)
            }
        }
    });

    $("#cab_form6").submit();
}
//新增身份证信息
function addUserIdentity(){
    var flow_id=$("#flow_id").combobox('getValue');
    if(flow_id==0){
        msgError('请选择正反面信息！');
        return;
    }
    if($("#myFilesRe_identity").val()==''){
        msgError('请选择身份证附件信息！');
        return;
    }
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/selectIdentity?userId='+ userId+'&flow_id='+flow_id,
        type: 'get',
        success: function (data) {
            if (data.success) {
                var num = data.data[0].total;
                if(num<1){
                    $("#user_id7").val(userId);

                    $("#cab_form7").form({
                        url:basePath + '/api/personnel/user_modify_route/addUserIdentity',
                        success:function(data){
                            data = JSON.parse(data);
                            if(data.success){
                                getUserIdentity();
                                msgSuccess(data.msg)
                            }else {
                                msgError(data.msg)
                            }
                        }
                    });

                    $("#cab_form7").submit();
                }else{
                    msgError('该面信息已经存在！')
                }
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });

}
//增加
function addUser() {
    var major=$("#major").combobox('getValues');
    var majors='';
    var majorArr='';
    for (var i=0;i<major.length;i++){
        majors+=major[i]+","
    }
    majorArr=majors.substring(0,majors.length-1);
    $("#userIds").val(majorArr);
//
    var major1=$("#role").combobox('getValues');
    var majors1='';
    var majorArr1='';
    for (var i=0;i<major1.length;i++){
        majors1+=major1[i]+","
    }
    majorArr1=majors1.substring(0,majors1.length-1);
    $("#userIds1").val(majorArr1);
    $("#cab_form").form({
        url:basePath + '/api/personnel/user_modify_route/addPersonnel',
        onSubmit: function(){
        },
        dataType:'json',
        success:function(data){
            data = JSON.parse(data);
            if(data.success){
                alert(data.msg);
                $("#education_0").combobox({
                    data: user_education,
                    editable: false,
                    valueField: 'field_value',
                    textField: 'field_name',
                    multiple: false,
                    required: false
                });
                userId=data.code;
                $("#anlu").attr('disabled','disabled');
                $('#tt').tabs('enableTab', 1);
                $('#tt').tabs('enableTab', 2);
                $('#tt').tabs('enableTab', 3);
                $('#tt').tabs('enableTab', 4);
                $('#tt').tabs('enableTab', 5);
                $('#tt').tabs('enableTab', 6);
                $('#tt').tabs('enableTab', 7);
            }else{
                alert(data.msg)
            }
        }
    });
    $("#cab_form").submit();
}

//-----------------------------------------加载-------------------------------------------------
$(function(){
    var Request=new UrlSearch(); //实例化
    var org_code=Request.org_code;
    var org_unity=Request.org_unity;
    getCities();
    getCountries();
    var i=1;
    if(org_code!=undefined){
        getRole(org_unity);
       var company=org_code.substring(0,9);
        getDept(company,org_unity,org_code,'org');
        if(i==1){
            getCompany(company,org_unity,org_code);
            i++;
        }

    }else{
        getRole();
        if(i==1){
            getCompany();
            i++;
        }
        getDeptType();
    }
    getPassWord();
    getSelectValue(function(){});


   $('#tt').tabs('disableTab', 1);
    $('#tt').tabs('disableTab', 2);
    $('#tt').tabs('disableTab', 3);
    $('#tt').tabs('disableTab', 4);
    $('#tt').tabs('disableTab', 5);
    $('#tt').tabs('disableTab', 6);
    $('#tt').tabs('disableTab', 7);
    $('#tt').tabs({
        onSelect:function(title){
            if(title=='技能信息'){
                getSkill();
            }
            if(title=='证书信息'){
                getCert();
            }

            if(title=='工作经历信息'){
                getWork();
            }
            if(title=='学习经历信息'){
                getStudy();
            }
            if(title=='培训经历信息'){
                getEducation();
            }
            if(title=='奖励信息'){
                getReward();
            }
            if(title=='身份证附件上传'){
                getUserIdentity();
            }
        }
    });
});

//--------------------------------------------------------------datagrid加载
function  getSkill(){
        $('#skill').datagrid({
            url: basePath+'/api/personnel/user_details_route/getUserSkill?id='+userId,
            method:'get',
            rownumbers:true,
            striped:true,
            fitColumns:false,
            fit:true,
            singleSelect:false,
            selectOnCheck:true,
            columns:[[
                {field:'id',hidden:true},
                {"field": "name","title":"姓名","width":"12%"},
                {"field": "user_name","title":"用户名  ","width":"12%"},
                {"field": "major","title":"类别 ","width":"14%"},
                {"field": "skill_level","title":"等级  ","width":"14%"},
                {"field": "post","title":"岗位","width":"16%"},
                {"field": "sys_account","title":"账号","width":"12%"},
                {"field": "remark","title":"备注","width":"20%"}
            ]],
            onLoadSuccess:function(json) {
            },
            onLoadError:function() {
                msgError('加载数据出现时发生错误,请稍候重试...');
            },
            loadMsg:'正在加载...'
        });
}
//证书信息
function getCert(){
    $('#cert').datagrid({
        url: basePath +'/api/personnel/user_details_route/getUserCertificate?id='+userId,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:false,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {field:'id',hidden:true},
            {"field": "name","title":"姓名","width":"8%"},
            {"field": "user_name","title":"用户名  ","width":"10%"},
            {"field": "img_path","title":"图片路径 ","width":"10%"},
            {"field": "certificate_category","title":"证书类别","width":"10%"},
            {"field": "certificate_level","title":"证书等级","width":"10%"},
            {"field": "issuing_authority","title":"发证机关  ","width":"10%"},
            {"field": "issue_time","title":"颁发时间 ","width":"12%"},
            {"field": "effective_time","title":"有效期  ","width":"12%"},
            {"field": "certificate_number","title":"证书编号","width":"12%"},
            {"field": "remark2","title":"备注","width":"16%"}
        ]],
        onLoadSuccess:function(json) {

        },
        onLoadError:function() {
            msgError('加载数据出现时发生错误,请稍候重试...');
        },
        loadMsg:'正在加载...'
    });
}
//工作经历信息
function getWork(){
    $('#work').datagrid({
        url: basePath +'/api/personnel/user_details_route/getUserWork?id='+userId,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:false,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {field:'id',hidden:true},
            {"field": "name","title":"姓名","width":"12%"},
            {"field": "user_name","title":"用户名  ","width":"12%"},
            {"field": "entry_time","title":"入职时间 ","width":"14%"},
            {"field": "departure_time","title":"离职时间  ","width":"14%"},
            {"field": "work_unit","title":"工作单位","width":"16%"},
            {"field": "position","title":"职务","width":"12%"},
            {"field": "remark3","title":"备注","width":"20%"}
        ]],
        onLoadSuccess:function(json) {

        },
        onLoadError:function() {
            msgError('加载数据出现时发生错误,请稍候重试...');
        },
        loadMsg:'正在加载...'
    });
}
//学习经历信息
function getStudy(){
    $('#study').datagrid({
        url: basePath +'/api/personnel/user_details_route/getUserLearning?id='+userId,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:false,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {field:'id',hidden:true},
            {"field": "name","title":"姓名","width":"8%"},
            {"field": "user_name","title":"用户名  ","width":"8%"},
            {"field": "admission_time","title":"入学时间 ","width":"10%"},
            {"field": "graduation_time","title":"毕业时间  ","width":"10%"},
            {"field": "schoolTag","title":"毕业学校","width":"12%"},
            {"field": "specialty","title":"所学类别","width":"12%"},
            {"field": "edu","title":"获取学历","width":"12%"},
            {"field": "certificateId","title":"证书编号","width":"12%"},
            {"field": "remark4","title":"备注","width":"16%"}
        ]],
        onLoadSuccess:function(json) {

        },
        onLoadError:function() {
            msgError('加载数据出现时发生错误,请稍候重试...');
        },
        loadMsg:'正在加载...'
    });
}
//p培训经历信息
function getEducation(){
    $('#education').datagrid({
        url: basePath +'/api/personnel/user_details_route/getUserEducation?id='+userId,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:false,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {field:'id',hidden:true},
            {"field": "name","title":"姓名","width":"12%"},
            {"field": "user_name","title":"用户名  ","width":"12%"},
            {"field": "start_date","title":"开始时间 ","width":"12%"},
            {"field": "end_date","title":"结束时间  ","width":"12%"},
            {"field": "content","title":"内容","width":"18%"},
            {"field": "grade","title":"成绩","width":"12%"},
            {"field": "remark5","title":"备注","width":"22%"}
        ]],
        onLoadSuccess:function(json) {

        },
        loadMsg:'正在加载...'
    });
}
//奖励信息
function getReward(){
    $('#reward').datagrid({
        url: basePath +'/api/personnel/user_details_route/getUserReward?id='+userId,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:false,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {field:'id',hidden:true},
            {"field": "name","title":"姓名","width":"25%"},
            {"field": "user_name","title":"用户名  ","width":"25%"},
            {"field": "img_path","title":"图片路径  ","width":"25%"},
            {"field": "get_reward","title":"曾获奖励 ","width":"25%"},
            {"field": "remark6","title":"备注","width":"30%"}
        ]],
        onLoadSuccess:function(json) {

        },
        onLoadError:function() {
            msgError('加载数据出现时发生错误,请稍候重试...');
        },
        loadMsg:'正在加载...'
    });
}
//身份证附件信息
function getUserIdentity(){
    $('#userIdentity').datagrid({
        url: basePath +'/api/personnel/user_details_route/getUserIdentity?id='+userId,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:false,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {field:'img_id',hidden:true},
            {"field": "name","title":"姓名","width":"25%"},
            {"field": "user_name","title":"用户名  ","width":"25%"},
            {"field": "img_path","title":"图片路径  ","width":"25%"},
            {"field": "flow_id","title":"正反面 ","width":"25%","formatter":function (value, rowData,rowIndex) {
                var flag="";
                if(value==1){
                    flag="正面";
                }
                if(value==2){
                    flag="反面";
                }
                return flag;
            }},
        ]],
        onLoadSuccess:function(json) {

        },
        onLoadError:function() {
            msgError('加载数据出现时发生错误,请稍候重试...');
        },
        loadMsg:'正在加载...'
    });
}

// 跳转到新增技能页面
function  openPage(title, value,type, add,flag) {

         var Form;
         if(type==1){
             Form='skillForm'
         }
        if(type==2){
            Form='certForm'
        }
        if(type==3){
            Form='workForm'
        }
        if(type==4){
            Form='studyForm'
        }
        if(type==5){
            Form='educationForm'
        }
        if(type==6){
            Form='rewardForm'
        }
        if(type==7){
            Form='identityForm'
        }
        //新增按钮
        $("#"+Form).show();
        $("#mgtMajor").combobox({
            data: maintain_professional,
            editable: false,
            valueField: 'field_value',
            textField: 'field_name',
            multiple: false,
            required: false
        });

        $("#"+Form).mydialog({
            title: title,
            width: 1050,
            height: 250,
            top: 120,
            modal: true,
            myButtons: [
                {
                    text: '确定',
                    btnCls: 'btn btn-blue',
                    handler: function () {
                        add(value);
                    }
                },

                {
                    text: '关闭',
                    btnCls: 'btn btn-danger',
                    handler: function () {
                        closeDialog(Form);
                    }
                }
            ]
        });
}

// 关闭新增窗口

function closeDialog(Form) {
    $('#'+Form).dialog('close');
    $('#'+Form).form('clear');

}

//图片上传预览    IE是用了滤镜。
function previewImage(file)
{
    var MAXWIDTH  = 120;
    var MAXHEIGHT = 120;
    var div = document.getElementById('preview');
    var f=document.getElementById("previewImg").value;
    if(f==""){
        alert("请上传图片");return false;}
    else {
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(f)) {
            alert("图片类型必须是.gif,jpeg,jpg,png中的一种");
            return false;
        }
    }
    if (file.files && file.files[0])
    {
        div.innerHTML ='<img id=imghead onclick=$("#previewImg").click()>';
        var img = document.getElementById('imghead');
        img.onload = function(){
          var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width  =  rect.width;
            img.height =  rect.height;
                 img.style.marginLeft = rect.left+'px';
            img.style.marginTop = rect.top+'px';
        }
        var reader = new FileReader();
        reader.onload = function(evt){img.src = evt.target.result;}
        reader.readAsDataURL(file.files[0]);
    }
    else //兼容IE
    {
        var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        div.innerHTML = '<img id=imghead>';
        var img = document.getElementById('imghead');
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
       var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
        div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
    }
}
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight ){
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;

        if( rateWidth > rateHeight ){
            param.width =  120;//maxWidth;
            param.height = 140;//Math.round(height / rateWidth);
        }else{
            param.width = 120;//Math.round(width / rateHeight);
            param.height = 140;//maxHeight;
        }
    }
    param.left = 0//Math.round((maxWidth - param.width) / 2);
    param.top = 0//Math.round((maxHeight - param.height) / 2);
    return param;
}

//用身份证信息带出相关基本信息
function copyUserInfo(){
    var identityId = $("#identityId").textbox("getValue");
    if(identityId==''){
        alert("请输入身份证号码！");
        return false;
    }
    if( identityId.length!= 18){
        alert("输入身份证号码有误！");
        return false;
    }
    $.ajax({
        url:basePath + '/api/personnel/personnel_route/getUserNameIdentity',
        method:"post",

        data:{identityId:identityId,user_id:userId},
        success:function(data){
            if(data.success==false ){
                if(data.code==-1){
                    alert(data.msg);
                    return ;
                }else{
                    alert(data.msg);
                    return ;
                }
            }else{
                $.ajax({
                    url:basePath + '/api/personnel/user_modify_route/copyUserInfo',
                    type: 'post',
                    data:{identityId:identityId},
                    dataType:'json',
                    success: function (data) {
                        if(data.success){
                            if(data.code==200){
                                var r = data.data[0];
                                $("#name").textbox("setValue",r.name);
                                $("#english_name").textbox("setValue", r.english_name);
                                $("#userSex").combobox("setValue", r.user_sex);
                                $("#user_age").textbox("setValue",r.user_age);
                                $("#birthday").val(r.birthday);
                                $("#nationality").textbox("setValue",r.nationality);
                                $("#native").textbox("setValue",r.native);
                                $("#email").textbox("setValue",r.email);
                                $("#approve1").combobox("setValue", r.post_certification);
                                $("#highest_education").combobox("setValue",r.highest_education);
                                $("#phone").textbox("setValue",r.phone);
                                return;
                            }else{
                                alert(data.msg);
                                return;
                            }
                        }else{
                            alert(data.msg);
                            return;
                        }
                    }

                });

            }
        }
    });




}
