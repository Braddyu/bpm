var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_history_service');
var path = require('path');
var fs = require('fs');
var urlencode = require('urlencode');
/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    var page = req.body.page;
    var size = req.body.rows;
    var condition={};
    if (req.body.SCLASS_ID) {
        condition.SCLASS_ID = req.body.SCLASS_ID;//
    }
    if (req.body.startDate) {
        condition.startDate = req.body.startDate;//开始时间
    }
    if (req.body.endDate) {
        condition.endDate = req.body.endDate;//结束时间
    }
    if (req.body.chlId) {
        condition.chlId = req.body.chlId;//被派单渠道id
    }
    if (req.body.job_id) {
        condition.job_id = req.body.job_id;//工单id
    }
    service.getHistoryList(condition,page,size).then(function (taskresult) {
       utils.respJsonData(res, taskresult);
    })
})
/**
 * 工单详情
 */
router.route('/orderHistoryDetail').post(function(req,res){
    var orderId = req.body.orderId;
    var condition={};
    service.getOrderHistoryDetail(orderId).then(function (result) {
        utils.respJsonData(res, result);
    })
})

/**
 * 附件下载
 */
/*router.get('/downloadAnnex',function(req, res, next){
    var currDir = path.normalize(req.query.filePath),
        fileName = req.query.fileName,
        currFile = path.join(currDir,fileName),
        fReadStream;

    fs.exists(currFile,function(exist) {
        if(exist){
            res.set({
                "Content-type":"application/octet-stream",
                "Content-Disposition":"attachment;filename="+encodeURI(fileName)
            });
            fReadStream = fs.createReadStream(currFile);
            fReadStream.on("data",(chunk) => res.write(chunk,"binary"));
            fReadStream.on("end",function () {
                res.end();
            });
        }else{
            res.set("Content-type","text/html");
            res.send("file not exist!");
            res.end();
        }
    });
});*/

/**
 * 附件下载
 */
router.get('/downloadAnnex',function(req, res, next){
    if(res.length=1){
        var filePath = req.query.filePath;
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