var express = require('express');
var router = express.Router();
var config = require('../../../../config');
var utils = require('../../../../lib/utils/app_utils');
var path = require('path');
var fs = require('fs');
var urlencode = require('urlencode');
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

/**
 * 附件下载
 */
router.get('/downloadAnnex',function(req, res, next){
    if(res.length=1){
        var filePath = path.join(__dirname,"../../../../")+"res_download_file\\";
        console.log(filePath);
        var fileName = req.query.fileName;
        var stats = fs.statSync(filePath+"/"+fileName);
        if(stats.isFile()){
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment;filename='+urlencode(fileName),
                'Content-Length': stats.size
            });
            fs.createReadStream(filePath+"/"+fileName).pipe(res);
        } else {
            res.end(404);
        }
    }else{
        utils.respJsonData(res, "下载文件失败");
    }
});
module.exports = router;
