var async = require('async');
var xlsx = require('node-xlsx');
var path = require('path');
var fs = require('fs-extra');
var config = require("../../../../config");
/**
 * 导出Excel文件
 * @param model mongoose model
 * @param condition 查询条件
 * @param populate 关联信息
 * @param tpl 模板
 * @param res response 对象
 */
exports.exportExcelByCursor = function(model, condition, populate, tpl, res) {
    var query = model.find(condition, {tailable: true, awaitdata: true, numberOfRetries: -1});
    if(populate) {
        query.populate(populate);
    }
    var stream = query.cursor();
    var cache = [];
    //stream.pipe(writeStream);
    var i = 1;
    var st = new Date().getTime();
    stream.on('data', function (item) {
        //console.log(item)
        //{work_order_code:1, work_order_profession_name:1, work_order_type_name:1, work_order_title:1, work_order_count_index:1}
        //model.findOne({_id:item2._id}).exec(function (err, item) {
        var item_data = new Array();
        for (var i = 0; i < tpl.column_keys.length; i++) {
            //item_data.push(eval('item.'+tpl.column_keys[i]));
            if (tpl.column_keys[i].formatter) {
                item_data.push(tpl.column_keys[i].formatter(item[tpl.column_keys[i].field], item));
            }
            else {
                //console.log(item);
                //console.log(tpl.column_keys[i].field + '/' + item[tpl.column_keys[i].field]);
                item_data.push(item[tpl.column_keys[i].field]);
            }
        }
        cache.push(item_data);
        //cache.push(item);
        //});
        if(cache.length % 100 == 0){
            stream.pause();
            process.nextTick(function(){
                doLotsWork(cache,function(){
                    //cache=[];
                    stream.resume();
                });
            });
        }
    })/*.on('readable', function(err, item) {
        console.log(err+'/'+item);
        console.log(cache);
    })*/.on('error', function (err) {
        console.log(err);
    }).on('end', function () {

        console.log(cache.length);
        console.log('query ended:'+(new Date().getTime() - st));

        // 检查数据是否需要分sheet
        var total = cache.length;
        var datas = new Array();
        if(total > tpl.sheet_data_size) {
            var size = total % tpl.sheet_data_size == 0 ? total / tpl.sheet_data_size : Math.floor(total / tpl.sheet_data_size) + 1;
            for(var j = 0; j < size; j++) {
                var tmpCache = cache.slice(j * tpl.sheet_data_size, (j + 1) * tpl.sheet_data_size);
                tmpCache.unshift(tpl.header_names);
                datas.push({name:tpl.sheet_prefix_name + (j+1), data:tmpCache});
                tmpCache = [];
            }
        }
        else {
            cache.unshift(tpl.header_names);
            datas.push({name:tpl.sheet_prefix_name+'1', data:cache});
        }

        if (datas) {
            var buffer = xlsx.build(datas);
            var filename = tpl.file_name + '_' + new Date().getTime();
            var dir = config.file_download_default_opts.downloadDirectory + 'workorder_directory/';
            mkdirsSync(dir, 0777);
            fs.ensureDir(dir, function (error) {
            });
            var filepath = dir + filename + '.xlsx';
            fs.writeFileSync(filepath, buffer, 'binary');
            res.download(filepath, filename+'.xlsx');
        }
    }).on('close', function () {
        console.log('query closed');
        cache = [];
    });
}

function doLotsWork(records,callback){
    //.....do lots of work
    //.....
    //all done, ready to deal with next 10 records

    //console.log(records.length);

    process.nextTick(function(){
        //console.log('cb');
        callback();
    });
}
function mkdirsSync(dirname, mode) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname), mode)) {
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
}

/**
 * 导出Excel文件
 * @param model mongoose model
 * @param condition 查询条件
 * @param populate 关联信息
 * @param tpl 模板
 * @param res response 对象
 */
exports.exportExcel = function(model, condition, populate, tpl, res) {
    var header_names = new Array();
    var select_keys = {};
    for (var i = 0; i < tpl.column_keys.length; i++) {
        var title = tpl.column_keys[i].title;
        var field = tpl.column_keys[i].field;
        header_names.push(title ? title : field);
        select_keys[field] = 1;
    }

    var query = model.find(condition, select_keys);
    if(populate) {
        query.populate(populate);
    }
    var st = new Date().getTime();
    query.exec(function (err, result) {
        if (err) {
            console.log(err);
            res.status(500);
            res.render('common/error', {
                message: '导出数据时出现异常'
            });
        }
        else {
            var total = result.length;
            if(total <= 0) {
                // 返回错误信息
                res.status(404);
                res.render('common/error', {
                    message: '未找到您要导出的数据'
                });
            }
            else {
                var datas = new Array();
                var cache = new Array();

                // 格式化数据
                for (var i = 0; i < result.length; i++) {
                    var item = result[i];
                    var item_data = new Array();
                    for (var j = 0; j < tpl.column_keys.length; j++) {
                        if (tpl.column_keys[j].formatter) {
                            item_data.push(tpl.column_keys[j].formatter(item[tpl.column_keys[j].field], item));
                        }
                        else {
                            item_data.push(item[tpl.column_keys[j].field]);
                        }
                    }
                    cache.push(item_data);
                }

                if (total > tpl.sheet_data_size) {
                    var size = total % tpl.sheet_data_size == 0 ? total / tpl.sheet_data_size : Math.floor(total / tpl.sheet_data_size) + 1;
                    for (var j = 0; j < size; j++) {
                        var tmpCache = cache.slice(j * tpl.sheet_data_size, (j + 1) * tpl.sheet_data_size);
                        tmpCache.unshift(header_names);
                        datas.push({name: tpl.sheet_prefix_name + (j + 1), data: tmpCache});
                        tmpCache = [];
                    }
                }
                else {
                    cache.unshift(header_names);
                    datas.push({name: tpl.sheet_prefix_name + '1', data: cache});
                }
                //console.log(datas);
                // 导出文件
                var buffer = xlsx.build(datas);
                var filename = tpl.file_name + '_' + new Date().getTime();
                var dir = config.file_download_default_opts.downloadDirectory + 'workorder_directory/';
                mkdirsSync(dir, 0777);
                fs.ensureDir(dir, function (error) {
                });
                var filepath = dir + filename + '.xlsx';
                fs.writeFileSync(filepath, buffer, 'binary');
                res.download(filepath, filename + '.xlsx',function(){
                    fs.unlinkSync(filepath);
                });

                console.log(cache.length);
                console.log('query ended:' + (new Date().getTime() - st));
            }
        }
    });


    //item_data.push(eval('item.'+tpl.column_keys[i]));
    /*if (tpl.column_keys[i].formatter) {
     item_data.push(tpl.column_keys[i].formatter(item[tpl.column_keys[i].field], item));
     }
     else {
     //console.log(item);
     //console.log(tpl.column_keys[i].field + '/' + item[tpl.column_keys[i].field]);
     item_data.push(item[tpl.column_keys[i].field]);
     }*/
}
