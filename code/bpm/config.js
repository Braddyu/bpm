/**
 * Created by ShiHukui on 2016/2/22.
 */
var project_url_prefix = "/gdgl";
var config = {
    project:{
        appid:'gdgl',
        appname: '工单管理系统平台', // App名字
        apptitle: '工单管理系统平台', // 网页title
        appdescription: 'gdgl', // App的描述
        copyright:'©中国移动贵州公司 版权所有',
        keywords: 'cmcc,gdgl',
        version: '0.0.1',
        report_version:"2017.1",//报表版本
        theme:'themes/beyond/',// 默认主题，优先显示common_system_info中的sys_theme_layout
        url:'',
        appurl:project_url_prefix,
        appviewurl:'app/',
        password_suffix:'@cmcc',
        captcha_login_enable:false,// 是否开启登陆验证码
        captcha_session_key:'captcha_session_key',
        uum_duty_mapping_key:'personnel_responsibilities',// 人员职责对应字典的key
        org_belong_mapping_key:'org_belong_class',// 机构归属对应字典的key
        common_major_resource_sqls_key:'common_major_resource_sqls',//维护对象（专业资源）
        common_major_resource_sqls_opt_key:'common_major_resource_sqls_opt',//维护对象模板（专业资源）
        org_expire_notice_key:'org_expire_notice_params',
        real_obj_distance_param_key:'real_obj_distance_param',
        common_major_abridge_mapping_key:'common_major_abridge_mapping' , //专业简称系统参数名称映射
        default_password_key:'default_password',//默认密码系统参数名称映射
        work_order_maintain_obj_cfg_key:'work_order_maintain_obj_cfg',//维护班组相关专业系统参数名称映射
        img_url_prefix:"http://211.139.11.136:18123/gdgl/file/",//图片存放地址IP及端口号
        common_msql_database_name_key:'common_msql_database_name',//mysql数据库名
        default_obj_role_key:'default_obj_role',//mongdb角色
        relation_site_sql_key:'relation_site_sql',        //基站专业物理站与逻辑站关联sql
        reset_password_key:'reset_password',//初始化密码（重置）
        work_order_handle_sms_key : 'work_order_handle_sms',  //处理时，需要定时上传步骤，发送短信通知的工单类型
        file_visit_prefix:'http://117.135.196.139:14000/gdgl/file',
        work_order_webpub_type_key:"work_order_webpub_type",
        photo_ywcj_url:'http://localhost:30001/ywcj/',//雅典娜-集中稽核平台图片URL
        photo_ydn_url:'http://localhost:30002/ywcj/',//雅典娜项目图片URL
        file_upload_default_opts:'/public/files/'//文件上传默认设置
    },
    datas:{
        tree_org:{
            root_node_name:'组织架构'// 机构根节点名称
        },
        tree_menu:{
            root_node_name:'ROOT'// 菜单根节点名称
        },
        tree_param:{
            root_node_name:'全部'// 菜单根节点名称
        },
        menu_shortcut_count:12
    },
    session:{
        secret:'gdgl_secret',
        key: 'gdgl_id',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
        cookie_maxAge:1800000,   //单位ms，即10分钟后session和相应的cookie失效过期
        resave: true,
        saveUninitialized: true,
        rolling:true,
          mongodb_url:'mongodb://192.168.9.48:27017/process',
        //  mongodb_url:'mongodb://10.201.253.162:27017/process1',
        //mongodb_url:'mongodb://127.0.0.1:27017/ywcj',  //内网
        mongodb_collection:'common_user_session'
    },
    routes:{
        mount_path:'*/routes/*',// 路由挂载路径
        is_debug:true,// 是否开启调试模式
        mappings: {
            '/common/job/routes/' : project_url_prefix + '/admin/api/common/job/',//schedule路由匹配路径
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
            '/project/desk/routes/':project_url_prefix + '/api/desk/*',//分公司工作台路由匹配路径
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
            '/project/workflow/routes/':project_url_prefix+'/api/workflow/',//用于平台页面接口的访问
            '/project/order_manage/routes/':project_url_prefix+'/api/order_manage/',

        },
        welcome_path:project_url_prefix + '/home',
        // 不做权限检查url（支持通配符*，尽量少用）
        exclude_auth_check_urls:[
            project_url_prefix + '/login',
            project_url_prefix + '/captcha',
            project_url_prefix + '/test/*',
            project_url_prefix +'/static/*',
            project_url_prefix + '/api/*',
            project_url_prefix +'/getVerificationcode',

        ],
        // 登陆后就能访问的url（无需授权）（支持通配符*，尽量少用）,如：修改个人信息、注销等操作
        logged_can_access_urls:[project_url_prefix + '/public/*',
            project_url_prefix + '/switchRole/*',
            project_url_prefix + '/logout',
            project_url_prefix + '/portal',
            project_url_prefix +'/profile',
            project_url_prefix +'/setting',
            project_url_prefix +'/api/workflow/*',
            // project_url_prefix + '/api/demo/*',
            // project_url_prefix+"api/workflow/*"
        ]
    },
    mongdb:{
          url: 'mongodb://192.168.9.48:27017/process',
        // url:'mongodb://10.201.253.162:27017/process1',
        // url: 'mongodb://10.201.253.111:27017/Examine',
        //url: 'mongodb://127.0.0.1:27017/ywcj',   //内网
        poolsize:20
    },
    memcached:{
        // server_locations:['117.135.196.139:11211'],  //外网
        server_locations:['192.168.9.48:11211'],//内网
        //  server_locations:['127.0.0.1:11211'],//本地

        options:{debug: true}
    },
    mysql:{
        host: '10.201.253.110',
        // host: '10.201.253.111',
        port:3306,
        // port:3307,
        user: 'root',
        password: 'repLcmc0613',//repLcmc0613
        database: 'channel2',
        insecureAuth:true
    },
    mysql_athena:{
        host: '135.10.59.62',
        // host: '10.201.253.111',
        port:3306,
        // port:3307,
        user: 'root',
        password: 'GzzyYfs-2016',//repLcmc0613
        database: 'channel2',
        insecureAuth:true
    },
    mysql_48:{
        host: '192.168.9.48',
        // host: '10.201.253.111',
        port:3306,
        // port:3307,
        user: 'root',
        password: 'root',//repLcmc0613
        database: 'yadianna',
        insecureAuth:true
    },
    ydn_mysql:{
        //雅典娜数据库
        host: '10.201.253.110',//测试环境：10.201.253.110;正式环境：135.10.59.62
        port:3306,
        user: 'root',//测试：root ;正式：readonly
        password: 'repLcmc0613',//测试：repLcmc0613 ;正式：repLcmc0613
        database: 'channel2'
    },
    auth:{
        auth_type:'local',// local：本地认证；cas：单点登录认证
        //cas_server_url             : 'http://117.135.196.139:65080/cas',
        cas_server_url             : 'http://10.196.11.231/cas',
        cas_server_version         : '2.0',
        //cas_client_service_url     : 'http://117.135.196.139:30000',
        cas_client_service_url     : 'http://localhost:3000',
        cas_client_session_name    : 'cas_sso_user',
        password:{
            key_1:'ea5456ffa698a9d7b469bcdd768bc104',
            key_2:'180831b7e2e6daba6ee89dbdf7846293',
            key_3_prefix:'cmcc_gz_'
        },
        // 密码每日允许错误次数
        password_daily_err_count:5
    },
    mqtt:{
        is_use:false,// 是否使用mqtt
        server:{// mqtt服务器端配置
            is_load:true,// 是否需要加载mqtt服务器模块，若为false，则不启用mqtt服务器
            host:'127.0.0.1',// mqtt服务器地址
            port:1883,// mqtt服务器端口
            is_persistence:false,// 是否需要持久化mqtt消息,持久化会将消息保存在mongodb中
            mongo_settings:{// 如果需要持久化mqtt消息，则此配置有效
                url:'mongodb://127.0.0.1:27017/mqtt',
                collection:'pubsub'
            }
        },
        pub_client:{
            is_load:true,// 是否需要加载mqtt发布客户端模块，若为false，则不启用mqtt发布客户端
            server_host:'127.0.0.1',// mqtt服务器的host
            server_port:1883,// mqtt服务器的port
            client_ip:'127.0.0.1'// mqtt发布客户端的ip
        },
        sub_client:{// mqtt订阅客户端配置
            is_load:true,// 是否需要加载mqtt订阅客户端模块，若为false，则不启用mqtt订阅客户端
            server_host:'127.0.0.1',// mqtt服务器的host
            server_port:1883,// mqtt服务器的port
            client_ip:'127.0.0.1'// mqtt订阅客户端的ip
        }
    },
    //系统日志采集配置
    logger:{
        app_group : 'ywcj',
        app_id : 'web',
        logstashEnable: true,
        logType: "applog",
        logstashHost:"117.135.196.139",
        logstashPort : 18087 ,
        logstashLevel:"DEBUG",
        consoleLevel :"DEBUG",
        path : '../logs'
    },
    //中间表名
    res_mapping : {table_name :"common_org_major_mapping"},
    //定义ftp/sftp 远程地址：
    sftpUtil1:{
        host:'192.168.1.109',
        port:'2121',
        basePath:'/home/zyjhpt/exception_data/real_name_illegal/id_5_phone/',
        start:'0001_',
        end:'.txt',
        flag:1,
        charset:'',
        temDir:'public/files/',
        split:'|'
    },
    sftpUtil2:{
        host:'192.168.1.109',
        port:'2121',
        basePath:'/home/zyjhpt/exception_data/real_name_illegal/other_province_id/',
        start:'0002_',
        end:'.txt',
        flag:2,
        charset:'utf-8',
        temDir:'public/files/',
        split:'|'
    },
    sftpUtil3:{
        host:'192.168.1.109',
        port:'2121',
        basePath:'/home/zyjhpt/exception_data/real_name_illegal/no_second_id/',
        start:'0003_',
        end:'.txt',
        flag:3,
        charset:'utf-8',
        temDir:'public/files/',
        split:'|'
    },
    sftpUtil4:{
        host:'192.168.1.109',
        port:'2121',
        basePath:'/home/zyjhpt/exception_data/job_number_exception/',
        start:'0004_',
        end:'.txt',
        flag:4,
        charset:'utf-8',
        temDir:'public/files/',
        split:'|'
    },
    ftpUtilD30173:{
        host:'192.168.1.137',//135.10.53.110
        //port:'2121',
        user:"channel",
        password : "tNi0eNL%@j",
        basePath:'/appdata/channel/YwjhData/zdyw',
        start:'D30173_',
        end:'.AVL',
        flag:0,
        charset:'utf-8',//GBK
        temDir:'public/files/',
        //split:''
    },
    ftpUtil1:{
        host:'192.168.1.13',
        basePath:'/myftp/',
        start:'D30174',
        end:'.AVL',
        charset:'utf-8',
        temDir:'../public/files/'
    },
    SMS:{
        http:'http://135.10.51.8:41500/CRMService',
        postContent:{
            PubInfo:{
                ClientIP:'135.10.53.110',
                InterfaceType:'98',
                InterfaceId:'6000',
                CountyCode:'0',
                OpId:'88000355',
                OrgId:'0',
                RegionCode:'0',
                TransactionId:'AX20120911160824'
            },
            Request: {
                BusiCode: "OI_SendShortMessage",
                BusiParams: {
                    Content: "content",
                    DestNum: "phonenum",
                    OptCode: "111",
                    Port: "10086"
                }

            },

        }

    },
    SMS_TEMPLET_ORDER:"渠道工单系统有一张需要您处理的工单，《procName》，工单号：orderNo，请及时登陆认真处理。",

    VALIDATION:"手机登录工单管理系统收到的验证码：randomNumber",
    OPEN_SMS:false

}
module.exports = config;
