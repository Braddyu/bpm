var mysql_utils = require('./mysql_utils');

module.exports = {

    /**
     * 获取用户token
     * @param userid
     */
    getUserToken:function(userid, cb) {
        var sql = 'select a.token_value as user_token, a.user_tag as user_tag from aptitude_user_token a where a.user_id = ?'
        mysql_utils.query(sql, [userid], function(error, result){
            cb(error, result);
        });
    }
}