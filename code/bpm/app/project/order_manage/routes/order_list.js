var express = require('express');
var router = express.Router();
var utils = require('../../../../lib/utils/app_utils');
var service = require('../services/order_list_service');
var formidable=require("formidable");

/**
 * 工单列表
 */
router.route('/list').post(function(req,res){
    console.log("开始获取所有工单列表...");
    var page = req.body.page;
    var size = req.body.rows;
    var conditionMap = {};

    // 调用分页
    service.getOrderListPage(page,size,conditionMap)
        .then(function(result){
            console.log("获取所有工单列表成功");
            utils.respJsonData(res, result);
        })
        .catch(function(err){
            console.log('获取所有工单列表失败',err);

        });
})

/**
 * 工单类型即所有流程
 */
router.route('/proBase').get(function(req,res){
    console.log("开始获取工单类型下拉框.......");
    service.getAllProBase()
        .then(function(result){
            console.log("获取下拉框结果:",result.success);
            if(result.success){
                utils.respJsonData(res, result.data);

            }
        })
        .catch(function(err){
            console.log('获取下拉框失败',err);

        });
})

/**
 * 获取对应流程的第二节点信息，即发起工单的开始节点信息
 */
router.route('/procDefineDetail').post(function(req,res){
    var proc_code=req.body.proc_code;
    console.log("开始获取对应流程的详细信息.......");
    service.getProcDefineDetail(proc_code)
        .then(function(result){
            console.log("获取获取对应流程的详细信息结果:",result);
             utils.respJsonData(res, result);

        })
        .catch(function(err){
            console.log('获取获取对应流程的详细信息失败',err);

        });
})

/**
 * 新增工单
 */
router.route("/createAndSaveApplication").post(function(req,res){

        var form =new formidable.IncomingForm();
        form.encoding='utf-8';
        form.maxFieldsSize=5*1024*1024;
        form.maxFields = 1000;
        form.parse(req,function(err,fields,files){
            if(err){
                console.log(err);
            }else{
                console.log("fields     :  ",fields);
                console.log("files      :  ",files);

                var flag=fields.flag;
                var application_code=fields.application_code;
                var proc_inst_id=fields.proc_inst_id;
                var proc_code=fields.proc_code;
                var proc_name=fields.proc_name;
                var proc_ver =fields.proc_ver;
                var userNo = fields.application_create_user_no;
                var userName = fields.application_create_user_name;
                // var userNo = '50001';
                // var userName = '演示用户';
                var title = fields.application_title;
                var applicationDetailId=fields._id;
                var description = fields.application_content_desciption;
                // var start_date= new Date;
                var condition={};
                console.log("dddffffffdddddddddddddddddd",flag)
                condition.userNo=userNo;
                condition.userName=userName;
                condition.proc_code=proc_code;
                condition.proc_name=proc_name;
                condition.proc_ver=proc_ver;
                condition.title=title;
                condition.application_code=application_code;
                condition.description=description;
                var attach_array=[];
                for(var k in files){
                    var conditions={}
                    console.log(files[k].path,"./files/"+files[k].name);      //很多文件的时候使用for in循环来进行遍历 此时 k是files对象的某个索引 或者是后面提到的FormData.append的名字
                    var file=files[k];
                    if(file.name){
                        conditions.name=file.name;
                        conditions.type=file.type;
                        conditions.path=file.path;
                        var data_b = fs.readFileSync(file.path,"binary");
                        console.info("filesssssssssssssssssssssssssss",data_b)
                        conditions.data=data_b;
                        attach_array.push(conditions);
                    }
                }
                condition.attach=attach_array;
                if(applicationDetailId){
                    condition.applicationDetailId=applicationDetailId;
                }else{
                    condition.applicationDetailId="";
                }

                if (flag == 1) {
                    //保存业务申请
                    console.log(condition);
                    service.saveApplication(condition).then(function(rs){
                        utils.respJsonData(res, rs);
                    });

                } else if (flag == 2) {
                    //保存业务申请并创建
                    service.createApplication(condition).then(function(rs){
                        console.log(rs)
                        utils.respJsonData(res,rs);
                    });
                }

            }
        });

    })


module.exports = router;
