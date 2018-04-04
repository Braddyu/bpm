var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var utils = require('../../../../lib/utils/app_utils');

/***
 * 资源下载页面跳转
 */
router.route('/list').get(function(req,res){
    res.render(config.project.appviewurl+'/project/res_download/res_download',{
        title: '' ,
        subtitle: 'Hello',
        layout:'themes/admin/layout',
        currentUser:req.session.current_user
    });
});
module.exports = router;
