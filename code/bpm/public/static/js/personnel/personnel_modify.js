var maintain_professional;
var user_education;
var id;

function getSelectValue(callback) {
    var dictCode ="'"+Dict_Code.aptitude_user_sex+"','"+
        Dict_Code.org_unity+"','"+
        Dict_Code.aptitude_user_status+"','"+
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
                        required:true
                    });
                }
                // 人员
                // 等级
                if(r.dict_code ==Dict_Code.aptitude_user_grade){
                    $("#user_grade").combobox({
                        data:result,
                        editable:false,
                        valueField:'field_value',
                        textField:'field_name',
                        multiple:false,
                        required:true
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
                        onSelect:function(rec){
                            workHandoverReady();
                        }
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
                    $("#education_0").combobox({
                        data: user_education,
                        editable: false,
                        valueField: 'field_value',
                        textField: 'field_name',
                        multiple: false,
                        required: false
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
                        required: false,
                    });
                }
            });
            callback();
        }
    });
}

//工作交接
function workHandoverReady(){
    var lzFlag = $("#status").combobox('getValue');
    if(lzFlag == "lzStatus"){
        $("#work_handover_info").attr('style','display:block');
        $.ajax({
            url:basePath+"/api/personnel/user_details_route/querySameDepartment",
            method:'get',
            data:{user_id:id},
            success:function(result){
                if(result.success){
                    //填充下拉选择
                    var data = result.data;
                    console.info("data："+JSON.stringify(data));
                    $("#work_handover").append('<option value="">'+'请选择工作接收人'+'</option>');
                    for(var i in data){
                        $("#work_handover").append('<option data-value="'+data[i].id+'" data-value2="'+data[i].name+'" value="'+ data[i].user_name+'">'+data[i].name+'</option>');
                    }
                }else{
                    msgError(result.msg+',错误代码:'+result.code);
                }
            }
        });
    }else{
        $("#work_handover_info").attr('style','display:none');
        $("#work_handover").val('');
        $("#work_handover_remark").val('');
    }
}

function getOptionValue(){
    var handover_userId = $('#work_handover option:selected').attr('data-value');
    var handover_name = $('#work_handover option:selected').attr('data-value2');
    $("#handoverReceiver_id").val(handover_userId);
    $("#handoverReceiver_name").val(handover_name);
}

//类型部门z
function getDeptType(number){
    $('#deptType').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/getDeptType',
        editable:false,
        valueField:'field_value',
        textField:'field_name',
        multiple:false,
        required:true,
        onChange:function(){
            var company = $('#company').combobox("getValues");
            var deptType = $('#deptType').combobox("getValues");
            //console.info(company +"----------------" +deptType);
            var city = $('#cities').combobox("getValue");
            if(number==1){
                number -=1;
            }else{
                $("#role").combobox('select','');
                number -=1;
            }
            if(number!=0){
                getDept(company, deptType, null,'major','org');
                getRole(deptType,null);
            }

        }
    });
}

//用户验证
$(function() {
    $('#postTime').textbox('textbox').bind('blur', function() {
        var postTime = $("#postTime").textbox("getValue");
        var na=isNaN(postTime);
        if(na){
            alert("你输入的格式有误，请从先输入");
            $("#postTime").textbox("setValue","");
        }else{
            if(postTime<0||postTime>50){
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
            if(labour_validity<0||labour_validity>50){
                alert("你输入的年限有误，请从先输入");
                $("#postTime").textbox("setValue","");
            }
        }
    });

    $('#user_name').textbox('textbox').bind('blur', function() {
        var user_name = $("#user_name").textbox("getValue");
        if(user_name!=null){
            $.ajax({
                url:basePath + '/api/personnel/personnel_route/getUserName',
                method:"post",
                data:{user_name:user_name,user_id:id},
                success:function(data){
                    $("#user_name").attr("data-status",data);
                    if(data=="false" && user_name!==null){
                        alert("用户名已存在，请重新输入！");
                        $("#user_name").textbox("setValue","");
                    }
                }
            });
        }

    });

    $('#name').textbox('textbox').bind('blur', function() {
        var name = $("#name").textbox("getValue");
        var english_name=  ConvertPinyin(name);
        $("#english_name").textbox("setValue",english_name);
    });

    $('#identityId').textbox('textbox').bind('blur', function() {
        var identityId = $("#identityId").textbox("getValue");
        if(identityId!=null && identityId.length==18 ) {
            $.ajax({
                url: basePath + '/api/personnel/personnel_route/getUserNameIdentity',
                method: "post",
                data: {identityId: identityId, user_id: id},
                success: function (data) {
                    if (data.success == false && identityId != null) {
                        if (data.code == -1) {
                            alert(data.msg);
                            return;
                        } else {
                            alert(data.msg);
                            $("#identityId").textbox("setValue", "")
                            return;

                        }
                    }

                }
            });
        }
    });
    //手机号码唯一验证
    $('#phone').textbox('textbox').bind('blur', function() {
        var phone = $("#phone").textbox("getValue");
        if(phone!=null && phone.length==11) {
            $.ajax({
                url: basePath + '/api/personnel/personnel_route/getUserNamePhone',
                method: "post",
                data: {identityId: phone, user_id: id},
                success: function (data) {
                    if (data.success == false && phone != null) {
                        if (data.code == -1) {
                            alert(data.msg);
                            return;
                        } else {
                            alert(data.msg);
                            $("#phone").textbox("setValue", "");
                            return;

                        }
                    }

                }
            });
        }
    });
});


// 获取集中稽核公司
function getCompany(){
    $('#company').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/queryCompany',
        editable:false,
        valueField:'org_code',
        textField:'org_name',
        multiple:false,
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
    });
}
// 获取所属区县对的
function  getCountries(){
    var deptType = $("#deptType").combobox("getValue");
    $('#counties').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/queryCounties',
        editable:false,
        valueField:'id',
        textField:'area_name',
        multiple:false,
        required:false,
    });
}

// 获取部门
function getDept(company, deptType, belongDept,major,c,city,county){
    var $belongDept = $("#belongDept");
    $('#belongDept').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/queryDept?org_pid='+company+"&org_unity="+deptType+"&major="+major,
        editable:false,
        valueField:'org_code',
        textField:'org_name',
        multiple:false,
        required:true,
        onLoadSuccess:function(){
            if(belongDept !=null&&belongDept!=undefined&&major!=undefined){
                $("#belongDept").combobox('select',belongDept);
            }
            if(city!=undefined){
                $("#cities").combobox("setValue",city);
            }
            if(county!=undefined){
                $("#counties").combobox("setValue",county);
            }

        },
        onSelect:function(r){
            var dataArr = $belongDept.combobox("getData");
            var dept=$belongDept.combobox('getValue');
            for(var i in dataArr){
                if(dataArr[i].org_code == dept){
                    $("#cities").combobox("setValue",dataArr[i].belong_city);
                    $("#counties").combobox("setValue",dataArr[i].belong_area);
                    getMajor(dataArr[i].maintain_professional,major,belongDept)
                }
                if(dept.length==21&&c==null){
                    getDeptUser(dept);
                }
            }

        },
        filter: function(q, row){
            var opts = $(this).combobox('options');
            //row[opts.textField].indexOf(q)== 1;//从头匹配
            return row[opts.textField].indexOf(q) >-1 ; //任意匹配
        }
    });
}
//获取类别
function  getMajor(code,major,belongDept){
    // 主要集中稽核类别
    $('#major').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/getMajor?code='+code+'&major='+major,
        editable:false,
        valueField:'field_value',
        textField:'field_name',
        multiple:true,
        required:true,
        onLoadSuccess:function(){
            if(major!='major'){
                if(major!=null&&major!=undefined){
                    $("#major").combobox('setValues',major.split(','));
                }
                disLoadMaskLayer();
            }

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
                    msgConfirm("你要修改的该维护站的人员已达上限！是否继续操作？",function(result){
                        if(!result){
                            window.location.href= basePath + '/user_info';
                        }
                    })
                }
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}



//增加与修改
function addUserInfo() {
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

    var valid_1 = $('#name').textbox("isValid");
    var valid_2 = $('#userSex').combobox("isValid");
    var valid_3 = $('#user_name').textbox("isValid");
    var valid_4 = $('#user_age').textbox("isValid");
    var valid_5 = $('#empCode').textbox("isValid");
    var valid_8 = $('#company').combobox("isValid");
    var valid_9 = $('#deptType').combobox("isValid");
    var valid_10 = $('#belongDept').combobox("isValid");
    var valid_11 = $('#major').combobox("isValid");
    var valid_12 = $('#status').combobox("isValid");
    var valid_14 = $('#role').combobox("isValid");
    var valid_17 = $('#identityId').textbox("isValid");
    var valid_18 = $('#phone').textbox("isValid");
    var valid_19 = $('#email').textbox("isValid");
    var valid_22= $('#essence_personnel').combobox("isValid");
    var valid_21= $('#labour_validity').combobox("isValid");

    //工作交接
    var lzFlag = $("#status").combobox('getValue');
    if(lzFlag == 'lzStatus'){
        var handover = $("#work_handover").val();
        var handover_remark = $("#work_handover_remark").val();
        if(handover == '' || handover_remark == ''){
            alert('你有验证未通过或者必填项未完成!');
            return false;
        }
    }
      /*var getDept=$("#belongDept").combobox('getValue');
     if(getDept==null||getDept==undefined||getDept==''){
     alert('你的部门填写有误，请重新选择!');
     $("#belongDept").combobox('select','');
     return false;
     }*/

    if(!valid_1 || !valid_2 || !valid_3 || !valid_4 || !valid_5 || !valid_8 ||
        !valid_9 || !valid_10 || !valid_11 || !valid_12 || !valid_14
        || !valid_17 || !valid_18 || !valid_19||!valid_22||!valid_21){
        $('html,body').animate({scrollTop:100});
        alert('你有验证未通过或者必填项未完成!');
        return false;
    }
    var phone = $("#phone").textbox("getValue");
    var user_name = $("#user_name").textbox("getValue");
    var identityId = $("#identityId").textbox("getValue");
    //提交前验证
    $.ajax({
        url:basePath + '/api/personnel/personnel_route/getUserName1',
        method:"post",

        data:{identityId:identityId,phone:phone,user_name:user_name,user_id:id},
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
                $.messager.confirm('确认','你是否确认修改提交该信息？',function(r){
                    if(r){
                        var major=$("#major").combobox('getValues');
                        var majors='';
                        var majorArr='';
                        for (var i=0;i<major.length;i++){
                            majors+=major[i]+","
                        }
                        majorArr=majors.substring(0,majors.length-1);
                        $("#userIds").val(majorArr);

                        var major1=$("#role").combobox('getValues');
                        var majors1='';
                        var majorArr1='';
                        for (var i=0;i<major1.length;i++){
                            majors1+=major1[i]+","
                        }
                        majorArr1=majors1.substring(0,majors1.length-1);
                        $("#userIds1").val(majorArr1);
                        $("#cab_form").form({
                            url:basePath + '/api/personnel/user_modify_route/updatePersonnel',
                            onSubmit: function(){
                            },
                            dataType:'json',
                            success:function(data){
                                data = JSON.parse(data);
                                if(data.success){
                                    $("#anlu").attr('disabled','disabled');
                                    alert(data.msg);
                                }else{
                                    alert(data.msg)
                                }
                            }
                        });
                        $("#cab_form").submit();
                    }else{
                        //window.location.href = basePath + '/user_info';
                    }
                })

            }
        }
    });




}


//角色
function getRole(org_unity,emp_role){
    $('#role').combobox({
        method: 'get',
        url: basePath + '/api/personnel/personnel_route/queryRole?org_unity='+org_unity+'&emp_role='+emp_role,
        editable:false,
        valueField:'role_code',
        textField:'role_name',
        multiple:true,
        required:true,
        onLoadSuccess:function(){
            if(emp_role != null && emp_role !="") {
                $("#role").combobox("setValues",emp_role.split(','));
            }
        }
    });
}

//根据Id查询
function loadData(){
    $.ajax({
        url: basePath + '/api/personnel/user_modify_route/getDataById',
        type: 'post',
        data: {id:id},
        beforeSend: function () {
            loadMaskLayer();
        },
        success: function (result) {
            if(result.success) {
                var r = result.data[0];
                $("#userId").val(id);
                $("#name").textbox("setValue",r.name);
                $("#english_name").textbox("setValue", r.english_name);
                $("#userSex").combobox("setValue", r.user_sex);
                $("#user_name").textbox("setValue",r.user_name);
                $("#user_age").textbox("setValue",r.user_age);
                $("#empCode").textbox("setValue",r.emp_code);
                $("#company").combobox("setValue", r.operating_company);
                $("#deptType").combobox("setValue", r.department_type);
                getRole(r.department_type,r.emp_role);
                getDept(r.operating_company,r.department_type, r.belong_department,r.major ,'org',r.cities,r.counties);
                /*if(r.major != null && r.major !=""){
                 $("#major").combobox("setValues",r.major.split(','));
                 }*/
                $("#essence_personnel").combobox("setValue", r.essence_personnel);
                $("#status").combobox("setValue", r.status);
                $("#postTime").textbox("setValue",r.post_time);
               /* $("#cities").combobox("setValue", r.cities);
                $("#counties").combobox("setValue", r.counties);*/
                $("#identityId").textbox("setValue",r.identityId);
                $("#phone").textbox("setValue",r.phone);
                $("#birthday").val(r.birthday);
                $("#labour_time").val(r.labour_time);
                $("#labour_validity").textbox("setValue",r.labour_validity);
                $("#nationality").textbox("setValue",r.nationality);
                $("#native").textbox("setValue",r.native);
                $("#email").textbox("setValue",r.email);
                $("#approve1").combobox("setValue", r.post_certification);
                $("#blacklist").combobox("setValue", r.blacklist);
                if(r.img_path){
                    var img = $('#imghead');
                    var path=basePath+'/file'+ r.img_path;
                    img.attr('src',path);

                }
                $("#highest_education").combobox("setValue",r.highest_education);
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
                            getUserIdentity()
                        }
                    }
                });

            } else {
                disLoadMaskLayer();
                msgError(result.msg+',错误代码:'+result.code);
            }
        }
    });
}
$(function(){
    var Request=new UrlSearch(); //实例化
    id=Request.id;
    judgeUser(id);
    getCompany();
    getCountries();
    getDeptType(1);
    getCities();
});


//判断是否是该资料员可修改的人员范围
function judgeUser(id){
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/judgeUser?id='+ id,
        type: 'get',
        beforeSend: function () {
            loadMaskLayer();
        },
        success: function (data) {
            if (data.success) {
                var num = data.data[0].total;
                if(num==0){
                    msgConfirm("对不起你对该人员的修改已跨区县，不能对该人员进行操作！",function(result){
                        window.location.href= basePath + '/user_info';
                    })
                }else{
                    getSelectValue(function(){
                        //更新时，加载更新的数据
                        loadData();
                    });
                }
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }

    })
}

//---------------------------------datagrid加载---------------------------------------
function  getSkill(){
    $('#skill').datagrid({
        url: basePath+'/api/personnel/user_details_route/getUserSkill?id='+id,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:true,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {"field": "id", checkbox: true},
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
        url: basePath +'/api/personnel/user_details_route/getUserCertificate?id='+id,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:true,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {"field": "id", checkbox: true},
            {"field": "name","title":"姓名","width":"8%"},
            {"field": "user_name","title":"用户名  ","width":"10%"},
            {"field": "img_path","title":"图片路径 ","width":"10%",formatter:function(v,r,i){
                if(v){
                    var Path=basePath+'/file/'+v;
                    return '<a href="'+Path+'" target="_blank">'+Path+'</a>'
                }
            }},
            {"field": "certificate_category","title":"证书类别","width":"10%"},
            {"field": "certificate_level","title":"证书等级","width":"10%"},
            {"field": "issuing_authority","title":"发证机关  ","width":"10%"},
            {"field": "issue_time","title":"颁发时间 ","width":"12%"},
            {"field": "effective_time","title":"有效期  ","width":"12%"},
            {"field": "certificate_number","title":"证书编号","width":"12%"},
            {"field": "remark2","title":"备注","width":"16%"}
        ]],

        onLoadError:function() {
            msgError('加载数据出现时发生错误,请稍候重试...');
        },
        loadMsg:'正在加载...'
    });
}
//工作经历信息
function getWork(){
    $('#work').datagrid({
        url: basePath +'/api/personnel/user_details_route/getUserWork?id='+id,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:false,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {"field": "id", checkbox: true},
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
        url: basePath +'/api/personnel/user_details_route/getUserLearning?id='+id,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:false,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {"field": "id", checkbox: true},
            {"field": "name","title":"姓名q","width":"8%"},
            {"field": "user_name","title":"用户名q","width":"8%"},
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
        url: basePath +'/api/personnel/user_details_route/getUserEducation?id='+id,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:true,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {"field": "id", checkbox: true},
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
        url: basePath +'/api/personnel/user_details_route/getUserReward?id='+id,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:true,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {"field": "id", checkbox: true},
            {"field": "name","title":"姓名","width":"25%"},
            {"field": "img_path","title":"图片路径","width":"25%",formatter:function(v,r,i){
                if(v){
                    var Path=basePath+'/file/'+v;
                    return '<a href="'+Path+'" target="_blank">'+Path+'</a>'
                }
            }},
            {"field": "user_name","title":"用户名  ","width":"25%"},
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
        url: basePath +'/api/personnel/user_details_route/getUserIdentity?id='+id,
        method:'get',
        rownumbers:true,
        striped:true,
        fitColumns:true,
        fit:true,
        singleSelect:false,
        selectOnCheck:true,
        columns:[[
            {field:'img_id',checkbox:true},
            {"field": "name","title":"姓名","width":"25%"},
            {"field": "user_name","title":"用户名  ","width":"25%"},
            {"field": "img_path","title":"图片路径  ","width":"25%",formatter:function(v,r,i){
                if(v){
                    var Path=basePath+'/file/'+v;
                    return '<a href="'+Path+'" target="_blank">'+Path+'</a>'
                }

            }},
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
function  openPage(title, value,type, up,flag) {

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
                    up(value);
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
}
//--------------------------------修改----------------------
//打开修改页面
function toModify(k) {
    var rows;
    if(k==1){
        rows = $('#skill').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        $("#management_major").combobox({
            data: maintain_professional,
            editable: false,
            valueField: 'field_value',
            textField: 'field_name',
            multiple: false,
            required: false

        });
        $('#skillForm').form('load',rows[0]);
        $('#management_major').combobox('setValue',rows[0].management_major);
        $('#skill_level').val(rows[0].skill_level);
        $('#post').val(rows[0].post);
        $('#sys_account').val(rows[0].sys_account);
        $('#remark').val(rows[0].remark);

        openPage("修改", rows[0].id,1,upUserSkill,2);
    }
    if(k==2){
        rows = $('#cert').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        $('#certForm').form('load',rows[0]);
        $('#certType_0').val(rows[0].certificate_category);
        $('#certLevel_0').val(rows[0].certificate_level);
        $('#issueOrg_0').val(rows[0].issuing_authority);
        $('#issueTime_0').val(rows[0].issue_time);
        $('#expDate_0').val(rows[0].effective_time);
        $('#certNum_0').val(rows[0].certificate_number);
        $('#remark2_0').val(rows[0].remark2);

        openPage("修改", rows[0].id,2,upUserCert,2);
    }
    if(k==3){
        rows = $('#work').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        $('#workForm').form('load',rows[0]);
        $('#entryTime_0').val(rows[0].entry_time);
        $('#departureTime_0').val(rows[0].departure_time);
        $('#workUnit_0').val(rows[0].work_unit);
        $('#position_0').val(rows[0].position);
        $('#remark3_0').val(rows[0].remark3);
        openPage("修改", rows[0].id,3,upUserWork,2);
    }
    if(k==4){
        $("#education_0").combobox({
            data: user_education,
            editable: false,
            valueField: 'field_value',
            textField: 'field_name',
            multiple: false,
            required: false
        });
        rows = $('#study').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        $('#studyForm').form('load',rows[0]);
        $('#admissionTime_0').val(rows[0].admission_time);
        $('#graduateTime_0').val(rows[0].graduation_time);
        $('#schoolTag_0').val(rows[0].schoolTag);
        $('#specialty_0').val(rows[0].specialty);
        $('#education_0').val(rows[0].education);
        $('#certificateId_0').val(rows[0].certificateId);
        $('#remark4_0').val(rows[0].remark4);
        openPage("修改", rows[0].id,4,upUserStudy,2);
    }
    if(k==5){
        rows = $('#education').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        $('#educationForm').form('load',rows[0]);

        $('#startDate_0').val(rows[0].start_date);
        $('#endDate_0').val(rows[0].end_date);
        $('#content_0').val(rows[0].content);
        $('#grade_0').val(rows[0].grade);
        $('#remark5_0').val(rows[0].remark4);

        openPage("修改", rows[0].id,5,upUserEducation,2);
    }
    if(k==6){
        rows = $('#reward').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        $('#rewardForm').form('load',rows[0]);
        $('#getReward_0').val(rows[0].get_reward);
        $('#myFilesRe1_0').val('');
        $('#remark6_0').val(rows[0].remark6);
        openPage("修改", rows[0].id,6,upUserReward,2);
    }
    if(k==7){
        rows = $('#userIdentity').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        $('#identityForm').form('load',rows[0]);
        $('#flow_id').val(rows[0].flow_id);
        openPage("修改", rows[0].img_id,7,upUserIdentity,2);
    }
}

function  del(k){
    // 获得选择行
    var rows;
    var id;
    if(k==1){
        rows = $('#skill').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行删除');
            return false;
        }
        id = rows[0].id;
        deleteUsers('deleteUserSkill',id)

    }
    if(k==2){
        rows = $('#cert').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行删除');
            return false;
        }
        id = rows[0].id;

        deleteUsers('deleteUserCert',id)
    }
    if(k==3){
        rows = $('#work').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行删除');
            return false;
        }
        id = rows[0].id;

        deleteUsers('deleteUserWork',id);
    }
    if(k==4){
        rows = $('#study').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行删除');
            return false;
        }
        id = rows[0].id;

        deleteUsers('deleteUserStudy',id);
    }
    if(k==5){
        rows = $('#education').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行删除');
            return false;
        }
        id = rows[0].id;

        deleteUsers('deleteUserEducation',id);
    }
    if(k==6){
        rows = $('#reward').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        id = rows[0].id;

        deleteUsers('deleteUserReward',id);
    }
    if(k==7){
        rows = $('#userIdentity').datagrid('getChecked');
        if (rows.length != 1) {
            msgError('提示,请选择一条数据再进行修改');
            return false;
        }
        id = rows[0].img_id;

        deleteUsers('deleteUserIdentity',id);
    }

}
function deleteUsers(deleteUser,ids){
    msgConfirm('确定删除此条记录？',function(result){
        if(result){
            // 获取远程数据
            $.ajax({
                url:basePath + '/api/personnel/user_modify_route/'+deleteUser,
                type: 'get',
                data: {id:ids},
                success: function (data) {
                    if(data.success) {
                        msgSuccess(data.msg);
                        if(data.code=201){
                            getSkill();
                        }
                        if(data.code=202){
                            getCert();
                        }
                        if(data.code=203){
                            getWork();
                        }
                        if(data.code=204){
                            getStudy();
                        }
                        if(data.code=205){
                            getEducation();
                        }
                        if(data.code=206){
                            getReward();
                        }
                        if(data.code=207){
                            getReward();
                        }
                        if(data.code=208){
                            getUserIdentity();
                        }

                    }
                    else {
                        msgError(data.msg+',错误代码:'+data.code);
                    }
                }
            });
        }
    });
}

//-----------------------------------------修改信息
// 修改技能
function  upUserSkill(id){

    // 验证表单
    var validate = $('#skill').form('validate');
    if(!validate) {
        alert('保存的为空！');
        return false;
    }
    $("#user_id1").val(id);
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/upUserSkill',
        type: 'post',
        data:$("#cab_form1").serializeJson(),
        success: function (data) {
            if (data.code == 200) {
                getSkill();
                msgSuccess(data.msg);
            } else {
                msgError(data.msg+',错误代码:'+data.code);
            }
        }
    });
}
//修改证书
function upUserCert(id){
    if($("#myFilesCert_0").val()!=''){
        var contractFiles=document.getElementById("myFilesCert_0").value;
        if(!/\.(pdf)$/.test(contractFiles)) {
            alert("证书附件文件类型有误，必须为PDF格式！");
            return ;
        };
    }

    var validate = $('#cert').form('validate');
    if(!validate) {
        alert('保存的为空！')
        return false;
    }
    $("#user_id2").val(id);
    $("#cab_form2").form({
        url:basePath + '/api/personnel/user_modify_route/upUserCert',
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
//修改工作经历
function upUserWork(id){

    $("#user_id3").val(id);
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/upUserWork',
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
//学习经历信息
function upUserStudy(id){
    $("#user_id4").val(id);
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/upUserStudy',
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
//培训经历信息
function upUserEducation(id){
    $("#user_id5").val(id);
    $.ajax({
        url:basePath + '/api/personnel/user_modify_route/upUserEducation',
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
// 奖励信息
function upUserReward(id){
    if($("#myFilesRe_0").val()!=''){
        var contractFiles=document.getElementById("myFilesRe_0").value;
        if(!/\.(pdf)$/.test(contractFiles)) {
            alert("奖励文件类型有误，必须为PDF格式！");
            return ;
        }
    }
    $("#user_id6").val(id);
    $("#cab_form6").form({
        url:basePath + '/api/personnel/user_modify_route/upUserReward',
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
// 身份证信息
function upUserIdentity(ids){
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
        url:basePath + '/api/personnel/user_modify_route/selectIdentity?userId='+ id+'&flow_id='+flow_id,
        type: 'get',
        success: function (data) {
            if (data.success) {
                var num = data.data[0].total;
                if(num<1){
                    $("#user_id7").val(ids);
                    $("#cab_form7").form({
                        url:basePath + '/api/personnel/user_modify_route/upUserIdentity',
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
//-----------------------------------------修改新增附加信息
//新增技能
function addUserSkill(){
    $("#user_id1").val(id);
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
    $("#user_id2").val(id);
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
    $("#user_id3").val(id);
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
    $("#user_id4").val(id);
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
    $("#user_id5").val(id);
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
    $("#user_id6").val(id);
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
        url:basePath + '/api/personnel/user_modify_route/selectIdentity?userId='+ id+'&flow_id='+flow_id,
        type: 'get',
        success: function (data) {
            if (data.success) {
                var num = data.data[0].total;
                if(num<1){
                    $("#user_id7").val(id);

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

//图片上传预览    IE是用了滤镜。---------------------图片上传----------------------
function previewImage(file) {
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
        data:{identityId:identityId,user_id:id},
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