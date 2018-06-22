var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var config = require('../../../../config');
var utils =  require('gmdp').init_gmdp.core_app_utils;

function mkdirsSync(dirname, mode){
    //console.log(dirname);
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdirsSync(path.dirname(dirname), mode)){
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
}

/**
 * 文件上传
 * @param req
 * @param opts
 * @param cb
 */
exports.uploadFile = function(req, opts, cb) {
    var file_field_name = opts.file_field_name;

    // 文件上传默认配置
    var form_opts = config.file_upload_default_opts;
    var form = new formidable.IncomingForm();   //创建上传表单
    console.log(file_field_name);
    form.encoding = form_opts.encoding ? form_opts.encoding : 'utf-8';		//设置编辑
    form.uploadDir = form_opts.uploadDir ? form_opts.uploadDir  : process.cwd() + '/upload';	 //设置上传目录
    form.keepExtensions = form_opts.keepExtensions ? form_opts.keepExtensions : true;	 //保留后缀
    //form.maxFieldsSize = opts.file_max_size ? opts.file_max_size : form_opts.maxFieldsSize;   //文件大小
    form.maxFieldsSize = form_opts.maxFieldsSize ? form_opts.maxFieldsSize : 20 * 1024 * 1024;   //文件大小

    // 创建文件夹
    mkdirsSync(form.uploadDir,0777);

    form.parse(req, function(err, fields, files) {
        /*console.log(fields);
        console.log(files);*/
        var _reuslt = {};
        var _error = new Array();

        if (err) {
            _error.push({code:'1000', msg:'上传文件时出现异常'});
        }
        else {

            for(var i = 0; i < opts.length; i++) {

                var file_save_path = opts[i].file_save_path ? opts[i].file_save_path : '';
                var file_allow_range = opts[i].file_allow_range ? opts[i].file_allow_range : '*';
                var file_field_name = opts[i].file_field_name;

                if(!file_field_name) {
                    _error.push({code:'1001', msg:'请设置file上传标签的名称属性[file_field_name]'});
                }
                else {
                    // 检查是否有附件属性
                    if (files.hasOwnProperty(file_field_name)) {
                        var extname = path.extname(files[file_field_name]['path']);
                        var filename = path.basename(files[file_field_name]['path']);
                        //console.log('filename:' + filename);
                        // 检查图片是否在允许上传的列表中
                        //console.log('reg:' + new RegExp('\.*').test(extname));
                        if(extname) {
                            if (!new RegExp('\.' + file_allow_range + '$').test(extname)) {
                                _error.push({code: '1002', msg: '上传文件不在允许的范围内[' + file_allow_range + ']', tag:file_field_name});
                            }
                            else {
                                // 需要重新命名
                                if (!opts[i].file_name) {
                                    filename = utils.getUUID() + '_' + i + extname;
                                }
                                else {
                                    filename = opts[i].file_name;
                                }
                                mkdirsSync(form.uploadDir + file_save_path, 0777);
                                fs.renameSync(files[file_field_name]['path'], form.uploadDir + file_save_path + filename);  //重命名
                                _reuslt[file_field_name] = {
                                    file_save_path: form.uploadDir + filename,
                                    file_relative_path: file_save_path + filename,
                                    code: '0000',
                                    msg: '附件上传成功'
                                };
                            }
                        }
                        else {
                            _reuslt[file_field_name] = {


                                file_save_path: '',
                                file_relative_path: '',
                                code:'0000',
                                msg:'未上传附件'
                            };
                        }
                    }
                    else {
                        _reuslt[file_field_name] = {
                            file_save_path: '',
                            file_relative_path: '',
                            code:'0000',
                            msg:'未上传附件'
                        };
                    }
                }
            }
            _reuslt['fields'] = fields;
            cb(_error, _reuslt);
        }
    });
    /*form.onPart = function(part) {
        /!*if(part.filename) {

        }*!/
        form.handlePart(part);
    };*/

}

/**
 * 文件上传
 * @param req
 * @param opts
 * @param cb
 */
/*
exports.uploadFile = function(req, opts, cb) {
    var file_field_name = opts.file_field_name;

    if(!file_field_name) {
        cb(utils.returnMsg(false, '1000', '请设置file上传标签的名称属性[file_field_name]', null, err));
    }
    else {
        // 文件上传默认配置
        var form_opts = config.file_upload_default_opts;
        var form = new formidable.IncomingForm();   //创建上传表单

        var file_save_path = opts.file_save_path ? opts.file_save_path : '';
        var file_allow_range = opts.file_allow_range ? opts.file_allow_range : '*';

        form.encoding = form_opts.encoding ? form_opts.encoding : 'utf-8';		//设置编辑
        form.uploadDir = form_opts.uploadDir ? form_opts.uploadDir + file_save_path : process.cwd() + '/upload' + file_save_path;	 //设置上传目录
        form.keepExtensions = form_opts.keepExtensions ? form_opts.keepExtensions : true;	 //保留后缀
        form.maxFieldsSize = opts.file_max_size ? opts.file_max_size : form_opts.maxFieldsSize;   //文件大小

        // 创建文件夹
        mkdirsSync(form.uploadDir,0777);

        form.parse(req, function(err, fields, files) {

            if (err) {
                cb(utils.returnMsg(false, '1001', '上传文件时出现异常', null, err));
            }
            else {
                // 检查是否有附件属性
                if(files.hasOwnProperty(file_field_name)) {
                    var extname = path.extname(files[file_field_name]['path']);
                    var filename = path.basename(files[file_field_name]['path']);
                    console.log('filename:' + filename);
                    // 检查图片是否在允许上传的列表中
                    console.log('reg:'+ new RegExp('\.*').test(extname));
                    //if(!eval('\.('+file_allow_range+')$').test(extname)){
                    if (!new RegExp('\.' + file_allow_range + '$').test(extname)) {
                        cb(utils.returnMsg(false, '1002', '上传文件不在允许的范围内[' + file_allow_range + ']', null, err));
                    }
                    else {
                        // 需要重新命名
                        if (!opts.file_name) {
                            filename = utils.getUUID() + extname;
                        }
                        else {
                            filename = opts.file_name;
                        }
                        fs.renameSync(files[file_field_name]['path'], form.uploadDir + filename);  //重命名
                        cb(utils.returnMsg(true, '0000', '上传文件成功', {
                            file_save_path: form.uploadDir + filename,
                            file_relative_path: file_save_path + filename,
                            fields_req: fields
                        }, null));
                    }
                }
                else {
                    cb(utils.returnMsg(true, '0000', '上传文件成功', {
                        file_save_path: '',
                        file_relative_path: '',
                        fields_req: fields
                    }, null));
                }
            }
        });
        form.on('file', function(name, file) {
            console.log(name+'/'+file);
        });
        form.onPart = function(part) {
            console.log('size:' + JSON.stringify(part));
            if(part.filename) {
                form.handlePart(part);
            }
        };
    }

}*/
