/**
 * Created by zhaojing on 2017/1/9.
 */
var model = require('../../bpm_resource/models/work_turn_over_model');
var userModel = require('gmdp').init_gmdp.core_user_model;
var utils = require('../../../utils/app_utils');
var mysql_utils = require('gmdp').init_gmdp.mysql_utils;
var mysql = require('mysql');

/**
 * 获取工作交接列表
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.getDataList = function(page, size, conditionMap, cb) {
    utils.pagingQuery4Eui(model.$WorkTurnOver, page, size, conditionMap, cb, '', {status:1,create_time:-1});
};

/**
 * 保存工作交接信息
 * @param data
 */
exports.checkAndSave = function(data, cb) {
    model.$WorkTurnOver.find({leave_user_id:data.leave_user_id,status:{'$ne':3}}).exec(function(err,rs){
        if(err){
            cb({'success':false, 'code':'1001', 'msg':'保存数据库出现异常'});
        }else{
            if(rs.length > 0){
                model.$WorkTurnOver.update({_id: rs[0]._doc._id}, {$set: data}, {}, function (error) {
                    if(error) {
                        cb({'success':false, 'code':'1002', 'msg':'保存数据库出现异常'});
                    }else {
                        cb({'success':true, 'code':'0000', 'msg':'保存数据库成功'});
                    }
                });
            }else{
                model.$WorkTurnOver.find({turn_user_id:data.leave_user_id,status:{'$ne':3}}).exec(function(err,rs){
                    if(err){
                        cb({'success':false, 'code':'1003', 'msg':'保存数据库出现异常'});
                    }else{
                        if(rs.length > 0){
                            var entity = {
                                turn_user_id : data.turn_user_id,
                                turn_user_account : data.turn_user_account,
                                turn_user_name : data.turn_user_name,
                                turn_user_tag : data.turn_user_tag,
                                exp_date : data.exp_date,
                                create_time : data.create_time
                            }
                            model.$WorkTurnOver.update({_id: rs[0]._doc._id}, {$set: entity}, {}, function (error) {
                                if(error) {
                                    cb({'success':false, 'code':'1004', 'msg':'保存数据库出现异常'});
                                }else {
                                    model.$WorkTurnOver(data).save(function(error){
                                        if(error) {
                                            cb({'success':false, 'code':'1005', 'msg':'保存数据库出现异常'});
                                        }else {
                                            cb({'success':true, 'code':'0000', 'msg':'保存数据库成功'});
                                        }
                                    });
                                }
                            });
                        }else{
                            model.$WorkTurnOver(data).save(function(error){
                                if(error) {
                                    cb({'success':false, 'code':'1005', 'msg':'保存数据库出现异常'});
                                }else {
                                    cb({'success':true, 'code':'0000', 'msg':'保存数据库成功'});
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

/**
 * 修改工作交接信息
 * @param id
 * @param data
 * @param cb
 */
exports.update = function(id,data,cb){
    model.$WorkTurnOver.update({_id: id}, {$set: data}, {}, function (error) {
        if(error) {
            cb({'success':false, 'code':'1001', 'msg':'修改数据库出现异常'});
        }else {
            cb({'success':true, 'code':'0000', 'msg':'修改数据库成功'});
        }
    });
}

/**
 * 启用、禁用
 * @param id
 * @param status
 * @param cb
 */
exports.changeStatus = function(id,status,cb){
    model.$WorkTurnOver.update({_id: id}, {$set: {status:status}}, {}, function (error) {
        if(error) {
            cb({'success':false, 'code':'1001', 'msg':'修改数据库出现异常'});
        }else {
            cb({'success':true, 'code':'0000', 'msg':'修改数据库成功'});
        }
    });
}

/**
 * 获取内部人员
 * @param user_account
 * @param user_name
 * @param user_org_id
 * @param cb
 */
exports.getUserInList = function(user_account,user_name,user_team_name,cb) {
    var queryParams = {};
    if(user_account){
        queryParams['login_account'] = new RegExp(user_account);
    }
    if(user_name){
        queryParams['user_name'] = new RegExp(user_name);
    }
    var query = userModel.$.find({});
    if(queryParams){
        for(var key in queryParams){
            query.where(key, queryParams[key]);
        }
    }
    query.where('user_status',1);
    if(user_team_name){
        query.populate({
            path:'user_org',
            model:'CommonCoreOrg',
            match:{
                org_name:new RegExp(user_team_name)
            }
        })
    }else{
        query.populate({
            path:'user_org',
            model:'CommonCoreOrg'
        })
    }
    query.exec(function(err,rs){
        if(err){
            cb({'success':false, 'code':'1001', 'msg':'查询数据库出现异常'});
        }else{
            var datas = [];
            if(rs.length > 0){
                for(var i=0;i<rs.length;i++){
                    if(rs[i]._doc.user_org){
                        if(rs[i]._doc.user_org._doc.org_type == '1102'){
                            var city_code = (rs[i]._doc.user_org._doc.org_code).substring(2,5);
                            var obj = {
                                user_id:rs[i]._doc._id,
                                user_account:rs[i]._doc.login_account,
                                user_name:rs[i]._doc.user_name,
                                user_tag:1,
                                user_team_id:rs[i]._doc.user_org._doc._id,
                                user_team_code:rs[i]._doc.user_org._doc.org_code,
                                user_team_name:rs[i]._doc.user_org._doc.org_name,
                                user_team_city:city_code,
                                user_team_city_name:'',
                                user_team_area:rs[i]._doc.user_org._doc.org_belong,
                                user_team_area_name:'',
                                user_org_id:'0',
                                user_org_code:'',
                                user_org_name:'贵州移动'
                            };
                            datas.push(obj);
                        }else{
                            var obj = {
                                user_id:rs[i]._doc._id,
                                user_account:rs[i]._doc.login_account,
                                user_name:rs[i]._doc.user_name,
                                user_tag:1,
                                user_team_id:rs[i]._doc.user_org._doc._id,
                                user_team_code:rs[i]._doc.user_org._doc.org_code,
                                user_team_name:rs[i]._doc.user_org._doc.org_name,
                                user_team_city:rs[i]._doc.user_org._doc.org_belong,
                                user_team_city_name:'',
                                user_team_area:'',
                                user_team_area_name:'',
                                user_org_id:'0',
                                user_org_code:'',
                                user_org_name:'贵州移动'
                            };
                            datas.push(obj);
                        }
                    }
                }
            }
            cb(datas);
        }
    });
}

/**
 * 获取内部机构
 * @param cb
 */
exports.getOrgInList = function(cb){
    userModel.$CommonCoreOrg.find({org_status:1}).exec(function(err,rs){
        if(err){
            cb({'success':false, 'code':'1001', 'msg':'查询数据库出现异常'});
        }else{
            cb(rs);
        }
    });
}

/**
 * 获取外部人员
 * @param user_account
 * @param user_name
 * @param user_org_id
 * @param cb
 */
exports.getUserOutList = function(user_account,user_name,user_team_name,user_org_name,cb) {
    var sql = 'select'
                +' a.id,'
                +' a.user_name,'
                +' a.`name`,'
                +' b.id as team_id,'
                +' b.org_code as team_code,'
                +' b.org_name as team_name,'
                +' b.belong_city as city,'
                +' d.area_name as city_name,'
                +' b.belong_area as area,'
                +' e.area_name as area_name,'
                +' c.id AS org_id,'
                +' c.org_code AS org_code,'
                +' c.org_name as org_name'
            +' from aptitude_user_info a'
            +' left join aptitude_org_info b on b.org_code = a.belong_department'
            +' left join aptitude_org_info c on c.id = b.top_id'
            +' left join area d on d.id = b.belong_city'
            +' left join area e on e.id = b.belong_area'
            +' where a.employee_status = 3';
    if(user_account){
        sql += ' and a.user_name like ' + mysql.escape("%"+user_account+"%");
    }
    if(user_name){
        sql += ' and a.`name` like ' + mysql.escape("%"+user_name+"%");
    }
    if(user_team_name){
        sql += ' and b.org_name like ' + mysql.escape("%"+user_team_name+"%");
    }
    if(user_org_name){
        sql += ' and c.org_name like ' + mysql.escape("%"+user_org_name+"%");
    }
    mysql_utils.query(sql, [], function(err,data){
        if(err){
            cb({'success': false, 'code': '1001', 'msg': '查询数据库出现异常'});
        }else{
            var datas = [];
            if(data.length > 0){
                for(var i=0;i<data.length;i++){
                    var obj = {
                        user_id:data[i].id,
                        user_account:data[i].user_name,
                        user_name:data[i].name,
                        user_tag:2,
                        user_team_id:data[i].team_id,
                        user_team_code:data[i].team_code,
                        user_team_name:data[i].team_name,
                        user_team_city:data[i].city,
                        user_team_city_name:data[i].city_name,
                        user_team_area:data[i].area,
                        user_team_area_name:data[i].area_name,
                        user_org_id:data[i].org_id,
                        user_org_code:data[i].org_code,
                        user_org_name:data[i].org_name
                    };
                    datas.push(obj);
                }
            }
            cb(datas);
        }
    });
}

/**
 * 获取外部机构
 * @param cb
 */
exports.getOrgOutList = function(cb){
    var sql = 'select * from aptitude_org_info a where a.audit_status = 1'
    mysql_utils.query(sql, [], function(err,data){
        if(err){
            cb({'success': false, 'code': '1001', 'msg': '查询数据库出现异常'});
        }else{
            cb(data);
        }
    });
}

/**
 * 克隆对象
 * @param obj
 * @returns {{}}
 */
function shallowClone(obj){
    var clone = {};
    for(var p in obj){
        if(obj.hasOwnProperty(p)){
            clone[p] = obj[p];
        }
    }
    return clone;
}