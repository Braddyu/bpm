var model_org = require("../models/user_model");
var Promise = require("bluebird");

var mysql_pool_promise = require("../../../../lib/mysql_pool_athena");
var fs = require('fs');
var config = require('../../../../config');

exports.sync_data_from_Athena = function () {
    sync_data_from_Athena();
}


async function sync_data_from_Athena() {
    //await sync_grid_data(5);
    //同步厅经理中渠道
    // await sync_channel_data_hall_manager(6);
    // //同步营业员渠道
    // await sync_channel_data_salesperson_info(6);
    await sync_channel_data_yadiana_info();
}


/**
 * 同步区县
 * @returns {bluebird}
 */

/*function update_country_data() {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT " +
            " TRIM(district_code) district_code, " +
            " TRIM(district_name) district_name, " +
            " TRIM(city_code) city_code,TRIM(city_name) city_name " +
            "FROM " +
            " hall_manager_info " +
            "WHERE " +
            " channel_id IS NOT NULL " +
            "AND grid_coding IS NOT NULL " +
            "AND district_code IS NOT NULL " +
            "GROUP BY " +
            " district_code";
        let condition = {};
        let result = await mysql_pool_promise.queryPromise(sql, condition);
        if (!result) {
            console.log("获取mysql区县数据总数失败");
        } else {



        }
    });
}*/

/**
 *  更新网格数据到工单系统
 * @returns {bluebird|exports|module.exports}
 */
function sync_grid_data(type) {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT " +
            " TRIM(grid_coding) area_code, " +
            " TRIM(grid_name) area_name, " +
            " TRIM(district_code) p_code,TRIM(district_name) p_name " +
            "FROM " +
            " hall_manager_info " +
            "WHERE " +
            " channel_id IS NOT NULL " +
            "AND grid_coding IS NOT NULL " +
            "AND district_code IS NOT NULL " +
            "GROUP BY " +
            " grid_coding  ";
        let condition = {};
        let result = await mysql_pool_promise.queryPromise(sql, condition);
        if (!result) {
            console.log("获取mysql网格数据总数失败");
        } else {
            await synchrodata(result, type);
            resolve();
            console.log("=================================网格数据处理结束==============================");

        }
    });
}

/**
 *  从雅典娜更新渠道数据到工单系统
 * @returns {bluebird|exports|module.exports}
 */
function sync_channel_data_hall_manager(type) {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT " +
            " TRIM(channel_id) area_code, " +
            " TRIM(channel_name) area_name, " +
            " TRIM(grid_coding) p_code,TRIM(grid_name) p_name " +
            "FROM " +
            " hall_manager_info " +
            "WHERE " +
            " channel_id IS NOT NULL " +
            "AND grid_coding IS NOT NULL " +
            "AND district_code IS NOT NULL " +
            "GROUP BY " +
            " channel_id  ";
        let condition = {};
        console.log(sql);
        let result = await mysql_pool_promise.queryPromise(sql, condition);
        if (!result) {
            console.log("获取mysql渠道数据总数失败");
        } else {
            console.log(result.length);
            await synchrodata(result, type);
            resolve();
            console.log("=================================渠道数据处理结束==============================");
        }
    });
}

function sync_channel_data_salesperson_info(type) {
    return new Promise(async (resolve, reject) => {
        let sql = "SELECT " +
            " TRIM(channel_id) area_code, " +
            " TRIM(channel_name) area_name, " +
            " TRIM(grid_coding) p_code,TRIM(grid_name) p_name " +
            "FROM " +
            " salesperson_info " +
            "WHERE " +
            " channel_id IS NOT NULL " +
            "AND grid_coding IS NOT NULL " +
            "AND district_code IS NOT NULL " +
            "GROUP BY " +
            " channel_id  ";
        let condition = {};
        console.log(sql);
        let result = await mysql_pool_promise.queryPromise(sql, condition);
        if (!result) {
            console.log("获取mysql渠道数据总数失败");
        } else {
            console.log(result.length);
            await synchrodata(result, type);
            resolve();
            console.log("=================================渠道数据处理结束==============================");
        }
    });
}

function sync_channel_data_yadiana_info(){
    return new Promise(async (resolve, reject) => {
        let sql ="SELECT " +
            "  channel_id area_code, " +
            "  channel_name area_name, " +
            "  grid_code p_code, " +
            "  channel_type " +
            "FROM " +
            "  channel2_develop_baseinfo " +
            "WHERE " +
            "  `status` = '1' " ;
        let condition = {};
        console.log(sql);
        let result = await mysql_pool_promise.queryPromise(sql, condition);
        if (!result) {
            console.log("获取mysql渠道数据总数失败");
        } else {
            console.log(result.length);
            let size = 1000;
            let pool_size = Math.ceil(result.length / size);
            console.log('pool_size', pool_size)
            for (let i = 0; i < pool_size; i++) {
                console.log("=================第", i, "次====================");

                let start = i * size;
                let end = ((i + 1) * size) > result.length ? result.length : ((i + 1) * size);
                await synchrodata(result.slice(start, end),6);
            }
            resolve()
            console.log("=================================渠道数据处理结束==============================");
        }
    });
}



  function synchrodata(result, type) {
    return new Promise(async(resolve, reject) => {
        let count = 0;
        for (let i = 0; i < result.length; i++) {
            //此处为最开始同步OA信息与雅典娜组织进行名字匹配正确
            // var porgname = result[i].areadesc.replace("(县级名)","").replace("县","").replace("市","").replace("特区","").replace("区","").replace("公司","").replace("自治","");
            // var orgname = new RegExp(porgname);
            // var parm = {"org_name":orgname,"level" : 4};

            let area_code = result[i].area_code;
            let p_code = result[i].p_code;
            await model_org.$CommonCoreOrg.find({"company_code": area_code}, function (err, res) {
                if(err){
                    count++;
                    console.log(count)
                    if (count == result.length) {
                        resolve();
                    }
                    console.log("查询出错1",err);
                }else{
                    //查找所属地州
                    model_org.$CommonCoreOrg.find({"company_code": p_code}, function (err, resp) {
                        if(err){
                            count++;
                            console.log(count)
                            if (count == result.length) {
                                resolve();
                            }
                            console.log("查询出错2",err);
                        }else if(resp && resp.length>0){
                            let org = {};
                            org.org_name = result[i].area_name;
                            org.org_fullname = result[i].area_name;
                            org.company_code = area_code;
                            if (type == 5) {
                                org.level = 5;
                                org.org_type = '网格';
                            } else if (type == 6) {
                                org.level = 6;
                                org.channel_type = result[i].channel_type;
                                org.org_type = '渠道';
                            }

                            org.org_belong = '0';
                            org.midifytime = new Date();
                            org.org_code = area_code;
                            org.org_status=1;
                                org.org_pid = resp[0]._id;
                                //存在则修改
                                if ( res.length > 0) {
                                    if(res.length==1){
                                        model_org.$CommonCoreOrg.update({"_id": res[0]._id}, {$set: org}, function (err, res) {
                                            count++;
                                            console.log(count)
                                            if (count == result.length) {
                                                resolve();
                                            }
                                        })
                                    }else{
                                        model_org.$CommonCoreOrg.remove({"company_code": area_code}, function (err) {
                                            let orgModel = new model_org.$CommonCoreOrg(org)
                                            orgModel.save(function (err) {
                                                    count++;
                                                    console.log(count)
                                                    if (count == result.length) {
                                                        resolve();
                                                    }
                                                }
                                            );
                                        })
                                    }

                                } else {
                                    let orgModel = new model_org.$CommonCoreOrg(org)
                                    orgModel.save(function (err) {
                                            count++;
                                            console.log(count)
                                            if (count == result.length) {
                                                resolve();
                                            }
                                        }
                                    );
                                }

                        }else{
                            count++;
                            console.log(count)
                            if (count == result.length) {
                                resolve();
                            }
                        }



                    })
                }



            })
        }
    })
}


function writeFile(file, result) {
    fs.writeFile(file, result, function (err) {
        if (err)
            console.log("fail " + err);
        else {
            console.log("写入文件ok");
            // fs.close();
        }
    })
}
