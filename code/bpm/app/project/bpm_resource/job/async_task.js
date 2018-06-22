var model_org = require("../models/user_model");
var process_model = require("../models/process_model");
var Promise = require("bluebird");



exports.sync_data_from_Athena = function () {
    sync_data_from_Athena();
}
// update_data();
function sync_data_from_Athena() {
    update_data();
}

/**
 *  从雅典娜更新人员数据
 * @returns {bluebird|exports|module.exports}   hall_manager_info
 */
function update_data() {
    return new Promise(async (resolve, reject) => {
        model_org.$User.find({}, function (err, resp) {
            for(let i in resp){
                let user_no=resp[i].user_no;
                let work_id=resp[i].work_id;
                    process_model.$ProcessInstTask.update({"proc_inst_task_assignee": user_no}, {$set: {"proc_inst_task_work_id": work_id}}, {multi: true}, function (err) {
                        process_model.$ProcessTaskHistroy.update({"proc_inst_task_assignee": user_no}, {$set: {"proc_inst_task_work_id": work_id}}, {multi: true}, function (err) {
                            console.log("修改成功");
                        })
                    })

            }
        })
    });
}
