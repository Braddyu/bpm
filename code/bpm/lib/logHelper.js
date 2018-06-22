var helper = {};
exports.helper = helper;
var log4js = require('log4js');
var os = require('os');
var config = require('../config');
var group_name = config.logger.app_group ||  'group_demo';
var app_id = config.logger.app_id || 'group_appid';
var logType = config.logger.logType || "applog" ;
var logPath = config.logger.path || "logs";
var logEnable = config.logger.logstashEnable || false;
var logServer= config.logger.logstashHost || "127.0.0.1";
var logServerPort = config.logger.logstashPort || 554;
var logLevel = config.logger.logstashLevel || "INFO";
var consoleLevel = config.logger.consoleLevel ||  "DEBUG";
var hostname = os.hostname();
var pid = process.pid;
// INFO,ERROR,WARN,DEBUG
//var  loglevels = { "console":"DEBUG","debug": "INFO", "info": "ERROR", "warn": "WARN", "error": "ERROR"} ;
var  loglevels = { "console":consoleLevel,"debug": logLevel, "info": logLevel, "warn": logLevel, "error": logLevel} ;
var replaceConsole = true ;
if(logEnable )
{
    log4js.configure({
        "replaceConsole": replaceConsole,
        "levels":loglevels,
        "appenders": [
            {
                category: "console",
                type: "console"
            },
            {
                "category": "info",
                type: "file",
                filename: logPath+"/app_info.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            },
            {
                "category": "info4A",
                type: "file",
                filename: logPath+"/info_4A.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            },
            {
                "category": "warn",
                type: "file",
                filename: logPath+"/app_warn.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            },

            {
                "category": "error",
                type: "file",
                filename: logPath+"/app_error.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            },

            {
                "category": "debug",
                type: "file",
                filename: logPath+"/app_debug.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            },
            {
                "category": "info",
                "host": logServer,
                "port": logServerPort,
                "type": "logstashUDP",
                "logType": logType, // Optional, defaults to 'category'
                "fields": {             // Optional, will be added to the 'fields' object in logstash
                    "appgroup": group_name,
                    "appid": app_id,
                    "host": hostname,
                    "pid": pid
                },
                "layout": {
                    "type": "pattern",
                    "pattern": "%m"
                }
            },
            {
                "category": "warn",
                "host": logServer,
                "port": logServerPort,
                "type": "logstashUDP",
                "logType": logType, // Optional, defaults to 'category'
                "fields": {             // Optional, will be added to the 'fields' object in logstash
                    "appgroup": group_name,
                    "appid": app_id,
                    "host": hostname,
                    "pid": pid
                },
                "layout": {
                    "type": "pattern",
                    "pattern": "%m"
                }
            },
            {
                "category": "error",
                "host": logServer,
                "port": logServerPort,
                "type": "logstashUDP",
                "logType": logType, // Optional, defaults to 'category'
                "fields": {             // Optional, will be added to the 'fields' object in logstash
                    "appgroup": group_name,
                    "appid": app_id,
                    "host": hostname,
                    "pid": pid
                },
                "layout": {
                    "type": "pattern",
                    "pattern": "%m"
                }
            },
            {
                "category": "debug",
                "host": logServer,
                "port": logServerPort,
                "type": "logstashUDP",
                "logType": logType, // Optional, defaults to 'category'
                "fields": {             // Optional, will be added to the 'fields' object in logstash
                    "appgroup": group_name,
                    "appid": app_id,
                    "host": hostname,
                    "pid": pid
                },
                "layout": {
                    "type": "pattern",
                    "pattern": "%m"
                }
            }
        ]
    });
}
else
{
    log4js.configure({
        "replaceConsole": replaceConsole,
        "levels":loglevels,
        "appenders": [
            {
                category: "console",
                type: "console"
            },
            {
                "category": "info",
                type: "file",
                filename: logPath+"/app_info.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            },
            {
                "category": "warn",
                type: "file",
                filename: logPath+"/app_warn.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            },
            {
                "category": "error",
                type: "file",
                filename: logPath+"/app_error.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            },
            {
                "category": "debug",
                type: "file",
                filename: logPath+"/app_debug.log",
                maxLogSize: 10*1024*1024, // = 10Mb
                numBackups: 50, // keep five backup files
                compress: true, // compress the backups
                encoding: 'utf-8',
                mode: parseInt('0640', 8),
                flags: 'w+'
            }
        ]
    });
}
// 目录创建完毕，才加载配置，不然会出异常
//log4js.configure(objConfig);
var logDebug = log4js.getLogger('debug');
var logInfo = log4js.getLogger('info');
var logWarn = log4js.getLogger('warn');
var logErr = log4js.getLogger('error');
var logConsole = log4js.getLogger('console');
helper.debug = function(code,info,msg){
    if(msg == null)
        msg = "";
    logDebug.debug({code:code,info:info,msg:JSON.stringify(msg)});
    logConsole.debug({code:code,info:info,msg:JSON.stringify(msg)});
};

helper.info = function(code,info,msg){
    if(msg == null)
        msg = "";
    logInfo.info({code:code,info:info,msg:JSON.stringify(msg)});
    logConsole.info({code:code,info:info,msg:JSON.stringify(msg)});

};
helper.warn = function(code,info,msg){
    if(msg == null)
        msg = "";
    logWarn.warn({code:code,info:info,msg:JSON.stringify(msg)});
    logConsole.warn({code:code,info:info,msg:JSON.stringify(msg)});
};
helper.error = function(code,info,msg, exp){
    if(msg == null)
        msg = "";
    if(exp != null)
        msg += "\r\n" + exp;
    logErr.error({code:code,info:info,msg:JSON.stringify(msg)});
    logConsole.error({code:code,info:info,msg:JSON.stringify(msg)});
};

var logInfo4A = log4js.getLogger('info4A');
var logError4A = log4js.getLogger('error4A');
helper.info4A = function(code,info,msg){
    if(msg == null)
        msg = "";
    logInfo4A.info({code:code,info:info,msg:msg});
    logConsole.info({code:code,info:info,msg:msg});

};





// 配合express用的方法
exports.use = function(app) {
    //页面请求日志, level用auto时,默认级别是WARN
    app.use(log4js.connectLogger(logInfo, {level:'debug', format:':method :url'}));
}