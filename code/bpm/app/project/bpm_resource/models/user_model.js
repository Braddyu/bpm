/**
 * Created by zhaojing on 2016/8/4.
 */
// 引入mongoose工具类
var mongoUtils  = require('../../../common/core/mongodb/mongoose_utils');
var mongoose = mongoUtils.init();
mongoose.set("debug",true);

Promise = require("bluebird");

mongoose.Promise=Promise;

var Schema = mongoose.Schema;

//声明User Schema结构
var userSchema = new Schema(
    {
            login_account : String,// 登录账号
            user_status : Number,// 用户状态
            user_id:String,//用户ID
            user_no : String,// 用户工号
            user_name : String,// 用户姓名
            user_gender : String,// 用户性别
            user_phone : String,// 用户手机
            user_tel : String,// 用户联系电话
            user_email : String,// 用户邮箱
            login_password : String,// 登录密码
            login_plain_password : String,// 登录密码明文
            user_org :  [{type: Schema.Types.ObjectId}],// 所在部门
            user_sys : String,// 所属系统
            user_org_desc:String,//所属系统的 描述
            theme_name : String,// 使用主题
            theme_skin : String,// 使用皮肤
            user_photo : String,// 用户头像/照片
            user_roles :  [{type: Schema.Types.ObjectId}],// 菜单访问权限使用角色
            sys_roles:[{type: Schema.Types.ObjectId}],//流程使用的角色
            boss_id:String,//对接外部系统专用的 Boss_id
            smart_visual_sys_user_id:String,//慧眼系统的 User_id
            athena_sys_user_id:String,//Athena系统的user_id
            athena_app_sys_user_id:String,//Athena_app系统的user_id
            inspect_sys_user_id:String,//稽查系统的user_id
            token:String,//不知道是什么东西，留着吧
            special_sign:String,//也不知道是什么东西 留着把
            work_id:String//工号
            // user_sys : {type: Schema.Types.ObjectId, ref: 'CommonCoreSys'},// 所属系统

    },
    {collection: "common_bpm_user_info"}// mongodb集合名
);
//将User类给予接口
var User = mongoose.model('User', userSchema);

//promise化user类及其方法
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

exports.$User = User;


//声明User Schema结构
var User_bakSchema = new Schema(
    {
        login_account : String,// 登录账号
        user_status : Number,// 用户状态
        user_id:String,//用户ID
        user_no : String,// 用户工号
        user_name : String,// 用户姓名
        user_gender : String,// 用户性别
        user_phone : String,// 用户手机
        user_tel : String,// 用户联系电话
        user_email : String,// 用户邮箱
        login_password : String,// 登录密码
        user_org : [],// 所在部门
        user_sys : String,// 所属系统
        user_org_desc:String,//所属系统的 描述
        theme_name : String,// 使用主题
        theme_skin : String,// 使用皮肤
        user_photo : String,// 用户头像/照片
        user_roles : [],// 菜单访问权限使用角色
        sys_roles:[],//流程使用的角色
        boss_id:String,//对接外部系统专用的 Boss_id
        smart_visual_sys_user_id:String,//慧眼系统的 User_id
        athena_sys_user_id:String,//Athena系统的user_id
        athena_app_sys_user_id:String,//Athena_app系统的user_id
        inspect_sys_user_id:String,//稽查系统的user_id
        token:String,//不知道是什么东西，留着吧
        special_sign:String,//也不知道是什么东西 留着把
        // user_sys : {type: Schema.Types.ObjectId, ref: 'CommonCoreSys'},// 所属系统

    },
    {collection: "common_bpm_user_info_bak_1208"}// mongodb集合名
);
//将User类给予接口
var User_bak = mongoose.model('User_bak', User_bakSchema);

//promise化user类及其方法
Promise.promisifyAll(User_bak);
Promise.promisifyAll(User_bak.prototype);

exports.$User_bak = User_bak;


//声明 role Schema结构
var roleSchema = new Schema(
    {
        role_code: String,//角色编码
        role_name: String,//角色名称
        role_tag: Number,//角色标志：1-内部，2-外部
        role_level: Number,//角色级别：1-省级，2-市级，3-县级
        role_status:Number,//状态：1-有效，2-停用
        role_remark:String,//角色描述
        role_order : Number,//序号
        sys_id : String,//系统编号
        smart_visual_sys_role_id:String,//慧眼系统的role_id
        athena_sys_role_id:String,//Athena系统的role_id
        athena_app_sys_role_id:String,//Athena_app系统的role_id
        inspect_sys_role_id:String,//稽查系统的role_id

    },
    {collection: "common_bpm_role_info"}// mongodb集合名
);
//将 Role 类给予接口
var Role = mongoose.model('Role', roleSchema);

//promise化Role类及其方法
Promise.promisifyAll(Role);
Promise.promisifyAll(Role.prototype);

exports.$Role = Role;


//声明 userRole Schema结构
var userRoleSchema = new Schema(
    {
        user_id : {type: Schema.Types.ObjectId, ref: 'User'}, // 用户ID
        role_id : {type: Schema.Types.ObjectId, ref: 'Role'},// 角色ID
        createTime:Date//创建时间
    },
    {collection: "common_bpm_user_role"}// mongodb集合名
);
//将 userRole 类给予接口
var UserRole = mongoose.model('UserRole', userRoleSchema);

//promise化Role类及其方法
Promise.promisifyAll(UserRole);
Promise.promisifyAll(UserRole.prototype);

exports.$UserRole = UserRole;

//声明 commonOrg Schema结构
var commonOrgSchema = new Schema(
    {
        org_code_desc : String,// 机构编号
        org_name : String,// 机构名
        org_fullname : String,// 机构全名
        company_code : String,// 公司编号
        level:String,//层级
        org_order : Number,// 排序号
        org_type : String,// 机构类型
        org_pid : String,// 机构父节点
        company_no:String,//empid
        parentcode_desc : String,// 机构父节点描述
        org_status : Number,// 机构状态
        org_belong : String,// 属于
        midifytime : Date,// 修改时间
        org_code : String,// 机构编号
        level : Number,// 机构层级
        childCount : Number,// 子机构数
        smart_visual_sys_org_id:String,//慧眼系统的org_id
        athena_sys_org_id:String,//Athena系统的org_id
        athena_app_sys_org_id:String,//Athena_app系统的org_id
        inspect_sys_org_id:String,//稽查系统的org_id
        audit_org_pid:String,//父id 资金稽核工单使用
        if_money_audit_org:Number,//是否属于资金稽核工单机构
        channel_enterprise_type:String,  //渠道 政企 区分类型  0：实体  1：政企
        channel_type:String //渠道类型
    },
    {collection: "common_bpm_org_info"}//mongodb集合名
);

// 机构model
var CommonCoreOrg = mongoose.model('CommonCoreOrg', commonOrgSchema);
exports.$CommonCoreOrg = CommonCoreOrg;

var  synch = new Schema(
    {
        compTime : Date,// 同步完成时间
        successOrfail : Number,//1 同步成功 0同步失败
        error:String,//同步失败原因
        failTime:Date, //同步失败时间
        results:String //结果
    },
    {collection: "common_sync_data"}//mongodb集合名
);

// 机构model
var synchData = mongoose.model('synchData', synch);
exports.$synchData = synchData;

var  async = new Schema(
    {
        asyncTime : Date,// 同步完成时间
        class : String,//同步类型
        from_sys:String, //数据来源系统
        code:String ,//编码
        name:String, //名称
    },
    {collection: "async_oa_data"}//mongodb集合名
);

// 机构model
var async = mongoose.model('asynch_Data', async);
exports.$asynch_Data = async;


var updateUserLogs = new Schema(
    {
        login_account : String,// 登录账号
        user_status : Number,// 用户状态
        user_id:String,//用户ID
        user_no : String,// 用户工号
        user_name : String,// 用户姓名
        user_gender : String,// 用户性别
        user_phone : String,// 用户手机
        user_tel : String,// 用户联系电话
        user_email : String,// 用户邮箱
        login_password : String,// 登录密码
        user_org :  [{type: Schema.Types.ObjectId}],// 所在部门
        user_sys : String,// 所属系统
        user_org_desc:String,//所属系统的 描述
        theme_name : String,// 使用主题
        theme_skin : String,// 使用皮肤
        user_photo : String,// 用户头像/照片
        user_roles :  [{type: Schema.Types.ObjectId}],// 菜单访问权限使用角色
        sys_roles:[{type: Schema.Types.ObjectId}],//流程使用的角色
        boss_id:String,//对接外部系统专用的 Boss_id
        smart_visual_sys_user_id:String,//慧眼系统的 User_id
        athena_sys_user_id:String,//Athena系统的user_id
        athena_app_sys_user_id:String,//Athena_app系统的user_id
        inspect_sys_user_id:String,//稽查系统的user_id
        token:String,//不知道是什么东西，留着吧
        special_sign:String,//也不知道是什么东西 留着把
        work_id:String//工号
        // user_sys : {type: Schema.Types.ObjectId, ref: 'CommonCoreSys'},// 所属系统

    },
    {collection: "common_update_user_logs"}// mongodb集合名
);
//将User类给予接口
var user_logs = mongoose.model('user_logs', updateUserLogs);
exports.$update_user = user_logs;


//声明 commonOrg Schema结构
var updateOrgLogs = new Schema(
    {
        org_code_desc : String,// 机构编号
        org_name : String,// 机构名
        org_fullname : String,// 机构全名
        company_code : String,// 公司编号
        level:String,//层级
        org_order : Number,// 排序号
        org_type : String,// 机构类型
        org_pid : String,// 机构父节点
        company_no:String,//empid
        parentcode_desc : String,// 机构父节点描述
        org_status : Number,// 机构状态
        org_belong : String,// 属于
        midifytime : Date,// 修改时间
        org_code : String,// 机构编号
        level : Number,// 机构层级
        childCount : Number,// 子机构数
        smart_visual_sys_org_id:String,//慧眼系统的org_id
        athena_sys_org_id:String,//Athena系统的org_id
        athena_app_sys_org_id:String,//Athena_app系统的org_id
        inspect_sys_org_id:String,//稽查系统的org_id

    },
    {collection: "common_update_org_logs"}//mongodb集合名
);

// 机构model
var orgLogs = mongoose.model('updateOrgLogs', updateOrgLogs);
exports.$update_org = orgLogs;


var commonRoleMenuOptSchema = new Schema(
    {
        "role_id" : String, // 角色ID
        "menu_id" : {type: Schema.Types.ObjectId, ref: 'CommonCoreRoleMenu'}, // 菜单ID
        "menu_opts" : [{type: Schema.Types.ObjectId, ref: 'CommonCoreMenuOpt'}] // 菜单中执行的操作
    },
    {collection: "common_role_menu_opt"}//mongodb集合名
);

// 角色拥有权限（菜单）model
exports.$CommonRoleMenuOpt = mongoose.model('CommonCoreRoleMenuOpt', commonRoleMenuOptSchema);

var commonMenuOptSchema = new Schema(
    {
        "menu_id" : String, // 所属菜单
        "opt_code" : String, // 操作编码
        "opt_name" : String, // 操作名称
        "opt_url" : String, // 操作执行url
        "opt_method" : String, // 操作执行http method
        "opt_status" : Number, // 操作状态
        "opt_remark" : String, // 操作备注
        "opt_order" : Number // 操作排序号
    },
    {collection: "common_menu_opt_info"}//mongodb集合名
);

// 菜单操作model
var CommonCoreMenuOpt = mongoose.model('CommonCoreMenuOpt', commonMenuOptSchema);
exports.$CommonCoreMenuOpt = CommonCoreMenuOpt;

var commonMenuSchema = new Schema(
    {
        menu_code: String,// 菜单编码
        menu_name: String,// 菜单名称
        menu_nav: String,// 菜单导航
        menu_remark: String,// 菜单备注
        menu_url: String,// 菜单访问地址
        menu_cls: String,// 菜单样式
        menu_level: Number,// 菜单层级
        menu_type: Number,// 菜单类型（1：框架内置；2：业务自有）
        menu_order: Number,// 菜单序号
        menu_status: Number,// 菜单状态（1：启用；0：禁用）
        menu_pid: String,// 菜单父节点id
        menu_hidden:{type: Number, default: 0},// 菜单是否隐藏（0:显示；1：隐藏）
        menu_use_sys_layout:{type: Number, default: 1},// 菜单是是否沿用系统布局（1：是；0：否）
        menu_target:{type: String, default: '_self'},// 页面目标
        menu_sysid: String// 菜单所属系统id
    },
    {collection: "common_menu_info"}//mongodb集合名
);

// model
var CommonCoreRoleMenu = mongoose.model('CommonCoreRoleMenu', commonMenuSchema);
exports.$CommonCoreRoleMenu = CommonCoreRoleMenu;


var commonUserLoginLogSchema = new Schema(
    {
        login_account : {type:String, index:true},// 登陆账号
        org_name:String,
        org_id:String,
        login_port:String,
        login_time:Date,
        user_phone:String,
        user_tag:String,
        user_name:String,
        user_no:String

    },
    {collection: "common_user_login_log"}//mongodb集合名
);
//login_account,user_id,name,user_tag,phone_info,create_time,login_port,org_id,org_name
// 账号model
exports.$CommonUserLoginLog = mongoose.model('commonUserLoginLog', commonUserLoginLogSchema);
