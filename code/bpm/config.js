/**
 * Created by ShiHukui on 2016/2/22.
 */
var project_url_prefix = "/gdgl";
var config = {
    project: {
        appid: 'gdgl',
        appname: '工单管理系统平台', // App名字
        apptitle: '工单管理系统平台', // 网页title
        appdescription: 'gdgl', // App的描述
        copyright: '©中国移动贵州公司 版权所有',
        keywords: 'cmcc,gdgl',
        version: '0.0.1',
        report_version: "2017.1",//报表版本
        theme: 'themes/beyond/',// 默认主题，优先显示common_system_info中的sys_theme_layout
        url: '',
        appurl: project_url_prefix,
        appviewurl: 'app/',
        password_suffix: '@cmcc',
        captcha_login_enable: false,// 是否开启登陆验证码
        captcha_session_key: 'captcha_session_key',
        uum_duty_mapping_key: 'personnel_responsibilities',// 人员职责对应字典的key
        org_belong_mapping_key: 'org_belong_class',// 机构归属对应字典的key
        common_major_resource_sqls_key: 'common_major_resource_sqls',//维护对象（专业资源）
        common_major_resource_sqls_opt_key: 'common_major_resource_sqls_opt',//维护对象模板（专业资源）
        org_expire_notice_key: 'org_expire_notice_params',
        real_obj_distance_param_key: 'real_obj_distance_param',
        common_major_abridge_mapping_key: 'common_major_abridge_mapping', //专业简称系统参数名称映射
        default_password_key: 'default_password',//默认密码系统参数名称映射
        work_order_maintain_obj_cfg_key: 'work_order_maintain_obj_cfg',//维护班组相关专业系统参数名称映射
        img_url_prefix: "http://211.139.11.136:18123/gdgl/file/",//图片存放地址IP及端口号
        common_msql_database_name_key: 'common_msql_database_name',//mysql数据库名
        default_obj_role_key: 'default_obj_role',//mongdb角色
        relation_site_sql_key: 'relation_site_sql',        //基站专业物理站与逻辑站关联sql
        reset_password_key: 'reset_password',//初始化密码（重置）
        work_order_handle_sms_key: 'work_order_handle_sms',  //处理时，需要定时上传步骤，发送短信通知的工单类型
        file_visit_prefix: 'http://117.135.196.139:14000/gdgl/file',
        work_order_webpub_type_key: "work_order_webpub_type",
        photo_ywcj_url: 'http://localhost:30001/ywcj/',//雅典娜-集中稽核平台图片URL
        photo_ydn_url: 'http://localhost:30002/ywcj/',//雅典娜项目图片URL
        file_upload_default_opts: '/public/files/'//文件上传默认设置
    },
    datas: {
        tree_org: {
            root_node_name: '组织架构'// 机构根节点名称
        },
        tree_menu: {
            root_node_name: 'ROOT'// 菜单根节点名称
        },
        tree_param: {
            root_node_name: '全部'// 菜单根节点名称
        },
        menu_shortcut_count: 12
    },
    session: {
        secret: 'gdgl_secret',
        key: 'gdgl_id',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        cookie_maxAge: 1800000,   //单位ms，即10分钟后session和相应的cookie失效过期
        resave: false,
        saveUninitialized: false,
        rolling: true,
        //mongodb_url:'mongodb://10.196.153.11:30000/process',
        mongodb_url: 'mongodb://192.168.9.48:27017/processpm',
        // mongodb_url:'mongodb://10.201.253.162:27017/process1',
        //mongodb_url:'mongodb://127.0.0.1:27017/ywcj',  //内网
        mongodb_collection: 'common_user_session'
    },
    routes: {
        mount_path: '*/routes/*',// 路由挂载路径
        is_debug: false,// 是否开启调试模式
        mappings: {
            '/common/job/routes/': project_url_prefix + '/admin/api/common/job/',//schedule路由匹配路径
            '/common/bpm/routes/': project_url_prefix + '/admin/api/common/bpm/',
            '/common/report/routes/': project_url_prefix + '/admin/api/common/report/',//report路由匹配路径
            '/project/demo/routes/': project_url_prefix + '/api/demo/',//demo路由匹配路径,
            '/common/dict/routes/': project_url_prefix + '/api/sysdict/*',
            '/project/dictionary/routes/': project_url_prefix + '/api/dictionary/',// 数据字典,

            '/project/remreport/routes/': project_url_prefix + '/api/remreport/',//remreport路由匹配路径
            '/project/refund/routes/': project_url_prefix + '/api/refund/',//refund路由匹配路径
            '/project/sp/routes/': project_url_prefix + '/api/sp/',//sp路由匹配路径
            '/project/terminal/routes/': project_url_prefix + '/api/terminal/',//sp路由匹配路径
            '/project/newnet/routes/': project_url_prefix + '/api/newnet/',//sp路由匹配路径
            '/project/process/routes/': project_url_prefix + '/api/process/',//流程相关路由匹配路径
            '/project/marketing/routes/': project_url_prefix + '/api/marketing/',//营销案路由匹配路径
            '/project/bill/routes/': project_url_prefix + '/api/bill/',//
            // 业务单据路由匹配路径
            '/project/moneyback/routes/': project_url_prefix + '/api/moneyback/',//新版退费路由匹配路径
            '/project/fundaudit/routes/': project_url_prefix + '/api/fundaudit/',//资金稽核路由匹配路径
            '/project/spsettlement/routes/': project_url_prefix + '/api/spsettlement/',//新版sp路由匹配路径
            '/project/desk/routes/': project_url_prefix + '/api/desk/*',//分公司工作台路由匹配路径
            '/project/attachment/routes/': project_url_prefix + '/api/attachment/',//附件管理路由匹配路径
            '/project/workbench/routes/': project_url_prefix + '/api/workbench/',//省公司工作台路由匹配路径
            '/project/remuneration/routes/': project_url_prefix + '/api/remuneration/',//业务稽核路由匹配路径
            '/project/capital/routes/': project_url_prefix + '/api/capital/',//资金稽核路由匹配路径
            '/project/physical/routes/': project_url_prefix + '/api/physical/',//实物稽核路由匹配路径
            '/project/transaction/routes/': project_url_prefix + '/api/transaction/',//异动监控路由匹配路径
            '/project/workorder/routes/': project_url_prefix + '/api/workorder/',//工单处理路由匹配路径
            '/project/manual/routes/': project_url_prefix + '/api/manual/',//人工抽查路由匹配路径
            '/project/bpm/routes/': project_url_prefix + '/bpm/manual/',//人工抽查路由匹配路径
            '/project/statecos/routes/': project_url_prefix + '/api/statecos/',//人工抽查路由匹配路径
            '/project/bpm_resource/routes/': project_url_prefix + '/api/',//给外部用户 不要需要权限的 用户 调用的  URL
            // '/project/bpm_resource/routes/': project_url_prefix + '/api/bpm_resource/',//给外部用户 不要需要权限的 用户 调用的  URL
            '/project/workflow/routes/': project_url_prefix + '/api/workflow/',//用于平台页面接口的访问
            '/project/order_manage/routes/': project_url_prefix + '/api/order_manage/',
            '/project/money_audit/routes/': project_url_prefix + '/api/money_audit/',
            '/project/suggestion/routes/': project_url_prefix + '/api/suggestion/',// 意见意见路由匹配路径
            '/project/res_download/routes/': project_url_prefix + '/api/res_down/',// 资料下载路由匹配路径
            '/project/misdata/routes/': project_url_prefix + '/api/misdata/',//错误数据展现路由


        },
        welcome_path: project_url_prefix + '/home',
        // 不做权限检查url（支持通配符*，尽量少用）
        exclude_auth_check_urls: [
            project_url_prefix + '/login',
            project_url_prefix + '/captcha',
            project_url_prefix + '/getVerificationcode',
            project_url_prefix + '/encverfcode',
            project_url_prefix + '/userSearch',
            project_url_prefix + '/test/*',
            project_url_prefix + '/static/*',
            project_url_prefix + '/api/*',


        ],
        // 登陆后就能访问的url（无需授权）（支持通配符*，尽量少用）,如：修改个人信息、注销等操作
        logged_can_access_urls: [project_url_prefix + '/public/*',
            project_url_prefix + '/switchRole/*',
            project_url_prefix + '/logout',
            project_url_prefix + '/portal',
            project_url_prefix + '/profile',
            project_url_prefix + '/setting',

            project_url_prefix + '/api/workflow/*',
            // project_url_prefix + '/api/demo/*',
            // project_url_prefix+"api/workflow/*"
        ]
    },
    mongdb: {
        url: 'mongodb://192.168.9.48:27017/process',
        // url: 'mongodb://10.196.153.11:30000/process',
        //url:'mongodb://10.201.253.162:27017/process1',
        // url: 'mongodb://10.201.253.111:27017/Examine',
        //url: 'mongodb://127.0.0.1:27017/ywcj',   //内网
        poolsize: 20
    },
    //慧眼同步数据库地址(测试数据库)
    hy_mongdb: {
        url: 'mongodb://10.196.153.11:30003/policySupport',
        // url: 'mongodb://10.196.153.11:30000/process',
        //url:'mongodb://10.201.253.162:27017/process1',
        // url: 'mongodb://10.201.253.111:27017/Examine',
        //url: 'mongodb://127.0.0.1:27017/ywcj',   //内网
        poolsize: 20
    },
    //慧眼同步数据定时任务时间设置
    hy_time: {
        hour: '3',
        minute: '0'
    },
    memcached: {
        // server_locations:['117.135.196.139:11211'],  //外网
        //server_locations: ['10.196.153.5:21211'],  //内网
        server_locations: ['192.168.9.48:11211'],//内网
        // server_locations:['127.0.0.1:11211'],//本地

        options: {debug: true}
    },
    mysql: {
        host: '192.168.9.48',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'hh_history_gd',
        insecureAuth: true
    },
    auth: {
        auth_type: 'local',// local：本地认证；cas：单点登录认证
        //cas_server_url             : 'http://117.135.196.139:65080/cas',
        cas_server_url: 'http://10.196.11.231/cas',
        cas_server_version: '2.0',
        //cas_client_service_url     : 'http://117.135.196.139:30000',
        cas_client_service_url: 'http://localhost:3000',
        cas_client_session_name: 'cas_sso_user',
        password: {
            key_1: 'ea5456ffa698a9d7b469bcdd768bc104',
            key_2: '180831b7e2e6daba6ee89dbdf7846293',
            key_3_prefix: 'cmcc_gz_'
        },
        // 密码每日允许错误次数
        password_daily_err_count: 5
    },

    //系统日志采集配置
    logger: {
        app_group: 'ywcj',
        app_id: 'web',
        logstashEnable: true,
        logType: "applog",
        logstashHost: "117.135.196.139",
        logstashPort: 18087,
        logstashLevel: "DEBUG",
        consoleLevel: "DEBUG",
        path: './logs'
    },
    //中间表名
    res_mapping: {table_name: "common_org_major_mapping"},
    SMS: {
        http: 'http://135.10.51.8:41500/CRMService',
        postContent: {
            PubInfo: {
                ClientIP: '135.10.53.110',
                InterfaceType: '98',
                InterfaceId: '6000',
                CountyCode: '0',
                OpId: '88000355',
                OrgId: '0',
                RegionCode: '0',
                TransactionId: 'AX20120911160824'
            },
            Request: {
                BusiCode: "OI_SendShortMessage",
                BusiParams: {
                    Content: "content",
                    DestNum: "phonenum",
                    OptCode: "111",
                    Port: "10086"
                }
            }
        }
    },
    //差错工单不通过归档时回传黄河地址
    repair_huanghe: {
        hostname: '135.10.38.80',
        port: 9090,
        path: '/ewfs/client/ewf4store/repair.do',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plan; charset=UTF-8'
        }
    },
    //差错工单通过归档时回传黄河地址
    repair_pass_huanghe: {
        hostname: '135.10.20.51',
        port: 8080,
        path: '/ewfs/client/ewf4store/repaper.do',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plan; charset=UTF-8'
        }
    },
    //差错工单获取黄河通过数据
    paperList_huanghe: {
      //  hostname: '120.24.6.54',
        hostname: '135.10.20.51',
        port: 8080,
        path: '/ewfs/client/ewf4store/paperList.do',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plan; charset=UTF-8'
        }
    },
    //黄河通过附件下载地址
    paperPdf_huanghe: {
        hostname: '135.10.20.51',
        port: 8080,
        path: '/ewfs/client/ewf4store/paperPdf.do',
        method: 'POST',
        headers: {
            'Content-Type': 'text/plan; charset=UTF-8'
        }
    },
    //预警工单归档时回传雅典娜地址
    repair_channel: {
        hostname: 'localhost',
        port: 8080,
        path: '/channel2/services/DataSync',
        method: 'POST',
        headers: {
            'Content-Type': 'application/soap+xml; charset=utf-8'
        },
    },
    //所属系统编号-预警工单系统编号-差错工单系统编号-稽核工单系统编号-慧眼工单系统编号-风险防控系统编号
    joinup_sys:'warnSys_node,errorSys_node,auditorSys_node,syesightSys_node,moneyAudit_node,unitTest_node,riskManagementSys_node',
    AES_KEY:'1234567890ABCDEFGHIJKLMNOPQRSTUV',
    SMS_TEMPLET_ORDER:"渠道工单系统有一张需要您处理的工单，《procName》，工单号：orderNo，请及时登陆认真处理。",
    SMS_TEMPLET_MONEY_AUDIT_ORDER:"渠道工单系统有一张需要您处理的工单即将到期，《procName》，工单号：orderNo，请尽快登陆认真处理。",
    SMS_TEMPLET_MONEY_AUDIT_ORDER_THAN:"渠道工单系统有一张需要您处理的工单已经到期，《procName》，工单号：orderNo，请登陆查看。",
    VALIDATION:"工单系统手机号登录验证码为：randomNumber，请不要透露他人。",
    GRID_COPY:"尊敬的网格管理员，您所辖渠道:channelName,渠道编码:channelCode,有一条待处理工单《procName》,工单号：orderNo，请及时催促处理。",
    MISTAKE_DISTRIBUTE_TASK:"差错工单量达到number上限值，自动派单失败，需手动派单",
	MISTAKE_DISTRIBUTE_SUCCESS:"差错工单自动派单成功！派单时间:time",
    MISTAKE_DISTRIBUTE_ERROR:"差错工单自动派单失败:msg",

    OPEN_ORDER_SMS:false, //工单短信发送接口
    OPEN_LOGIN_SMS:false, //短信登录验证码
    GRID_COPY_SMS:false, //预警工单抄送给网格经理短信
    MISTAKE_DISTRIBUTE_TASK_SMS:false, // 差错工单系统自动派单短信提醒
    MONEY_AUDIT_SMS:true,//资金稽核工单 预警短信开关
    //派单接口信息
    api_interface_url: 'https://127.0.0.1:30002',
    mistake_proc_code: 'p-201',
    mistake_proc_name: '稽核差错工单',
    //邮件服务器配置信息
    email : {
        host : 'smtp.163.com',
        port:465,
        user:'xmglpt@163.com',
        password:'518390a457fee48d069c6523ab'
    },
    email_switch:false,//是否发送邮件开关
    email_subject:'《procName》的工单任务处理通知',//邮件标题
    email_templet:'您好，您有一张名为：《procName》的工单任务需处理，请及时处理。',//邮件内容模板
    //定时任务开关明细
    switchDetail: {
        oa_switch: false,   //同步OA数据(省、地市、区县级)作业任务开关
        athena_switch: false,  //同步雅典娜数据(网格、渠道级)作业任务开关
        athena_app_switch: false,  //同步雅典娜app数据(网格经理、厅经理、营业员)作业任务开关
        mistake_switch: false,  //差错工单任务是否超时定时任务
        mistake_distribute_switch: true,// 差错工单派发定时任务
        errData_switch: false, //差错工单归档数据上传ftp
        money_audit_switch: false  //资金稽核工单 预警定时任务
    },
    //定时任务表达式
    athena_org_switch_core: "30 1 1 * * *",//秒、分、时、日、月、周几
    athena_peason_switch_core: "30 1 2 * * *",//秒、分、时、日、月、周几
    huanghe_switch_core: "30 11 15 * * *",//秒、分、时、日、月、周几
    mistake_switch_core: "40 14 15 * * *",//秒、分、时、日、月、周几
    mistake_distribute_cron: "00 00 09 * * *",
    money_audit_switch_core: " 0 * */1 * *",//秒、分、时、日、月、周几
    peson_sync_data_from_Athena_url: "e:\\peasondata",//同步人员错误数据导出地址
    org_sync_data_from_Athena_url: "e:\\data",//同步机构错误数据导出地址
    sftp_huanghe_server: {
        host:'192.168.9.66',
        port:'22',
        username:"ftpUser",
        password:"ftpUser"
    },//差错工单ftp地址
    ftp_gdglFile_server: {
        host: '135.10.53.110',
        port: 21,
        user: 'channel',
        password: 'tNi0eNL%@j'
    },//集中稽核所需归档文件
    gdglFile_server_time: {
        hour: '2',
        minute: '0'
    },//同步集中稽核数据时间
    sftp_huanghe_get: '/upload/',//获取差错工单ftp路径
    sftp_huanghe_put: '/mnt/infinitsoft/test',//上传差错工单附件路径
    local_haunghe_path: 'E:/test/',//本地存储黄河数据
    local_path: '/upload/',//本地存储附件路径
    batch_size: 2000,//差错工单每一批次数量
    accessory_path: 'C:/res_download_file/', //帮助资料
    writeLoad: 'E:/upload/writeLoad/',//本地存放差错工单归档数据
    ftp_gdglFile_server_put: '~/gdglfile/gdgl_pigeonhole/',//上传差错工单数据
    ftp_logs_filePath: '~/gdglfile/logs_filePath/'//上传差错工单归档日志以及附件地址
}
module.exports = config;
