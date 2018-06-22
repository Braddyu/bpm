/**
 * Created by zhaojing on 2017/2/19.
 */
var mysql_utils = require('gmdp').init_gmdp.mysql_utils;
var core_user_model = require('gmdp').init_gmdp.core_user_model;

/**
 * 保存资料员和代维管理员信息
 * @param cb
 */
exports.save_user_info = function(cb){
    var deleteSql = "delete from Examine.common_user_info";
    mysql_utils.query(deleteSql, [], function(err1,data1){
        if(err1){
            cb({'success':false, 'code':'1001', 'msg':'保存资料员和代维管理员信息出现异常。'});
        }else{
            var insertSql = "insert into common_user_info(user_id,user_name,user_phone,user_tag,org_id,org_code,org_name,city_id,county_id,major,company_id,company_code,company_name)"+
                            "("+
                                "select"+
                                    " t3.id as user_id,"+
                                    " t3.`name` as user_name,"+
                                    " t3.phone as user_phone,"+
                                    " '2' as user_tag,"+
                                    " t2.id as org_id,"+
                                    " t2.org_code,"+
                                    " t2.org_name,"+
                                    " t1.cfg_city_id as city_id,"+
                                    " t1.cfg_county_id as county_id,"+
                                    " t3.major as major,"+
                                    " t4.id as company_id,"+
                                    " t4.org_code as company_code,"+
                                    " t4.org_name as company_name"+
                                " from Examine.common_org_major_mapping t1"+
                                " left join Examine.aptitude_org_info t2 on t2.top_id = t1.cfg_org_id and t2.org_unity = 'WHZ' and t2.belong_city = t1.cfg_city_id and t2.belong_area = t1.cfg_county_id"+
                                " left join Examine.aptitude_user_info t3 on t3.belong_department = t2.org_code and INSTR('D_R_ZLY',t3.emp_role)<>0"+
                                " left join Examine.aptitude_org_info t4 on t4.top_id = t2.id"+
                                " where t3.status='zzStatus'"+
                                " and t3.employee_status=3"+
                            ")";
            mysql_utils.query(insertSql, [], function(err2,data2) {
                if(err2){
                    cb({'success': false, 'code': '1002', 'msg': '保存资料员和代维管理员信息出现异常。'});
                }else{
                    core_user_model.$CommonCoreRole.find({'role_code':'M_R_DWGLY'}).exec(function(err3,rs3){
                        if(err3){
                            cb({'success': false, 'code': '1003', 'msg': '保存资料员和代维管理员信息出现异常。'});
                        }else{
                            if(rs3.length > 0){
                                var roleIdArray = [];
                                roleIdArray.push(rs3[0]._doc._id);

                                var query = core_user_model.$.find({
                                    'user_roles':{'$in':roleIdArray}
                                });
                                query.populate({path:'user_org'});
                                query.exec(function(err4,rs4){
                                    if(err4){
                                        cb({'success': false, 'code': '1004', 'msg': '保存资料员和代维管理员信息出现异常。'});
                                    }else{
                                        if(rs4.length > 0){
                                            var userEntitys = [];
                                            for(var i=0;i<rs4.length;i++){
                                                var  user = [];
                                                user.push(rs4[i]._doc._id);
                                                user.push(rs4[i]._doc.user_name);
                                                var user_phone = rs4[i]._doc.user_phone!=null?rs4[i]._doc.user_phone:'';
                                                user.push(user_phone);
                                                user.push('1');
                                                user.push(rs4[i]._doc.user_org._doc._id);
                                                user.push(rs4[i]._doc.user_org._doc.org_code);
                                                user.push(rs4[i]._doc.user_org._doc.org_name);
                                                var city_id = (rs4[i]._doc.user_org._doc.org_code).substring(2,5);
                                                user.push(city_id);
                                                user.push(rs4[i]._doc.user_org._doc.org_belong);
                                                user.push((rs4[i]._doc.user_duties).join(','));
                                                user.push('');
                                                user.push('');
                                                user.push('');

                                                userEntitys.push(user);
                                            }
                                            if(userEntitys.length > 0){
                                                var insertSql = "insert into common_user_info(user_id,user_name,user_phone,user_tag,org_id,org_code,org_name,city_id,county_id,major,company_id,company_code,company_name) values ?";
                                                mysql_utils.query(insertSql, [userEntitys], function(err5,data5) {
                                                    if(err5){
                                                        cb({'success': false, 'code': '1005', 'msg': '保存资料员和代维管理员信息出现异常。'});
                                                    }else{
                                                        cb({'success': true, 'code': '0000', 'msg': '保存资料员和代维管理员信息成功。'});
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}
