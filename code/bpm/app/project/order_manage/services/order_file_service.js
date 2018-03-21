
var model = require('../../bpm_resource/models/process_model');
var utils = require('../../../../lib/utils/app_utils');

/**
 * 工单列表分页
 * @param page
 * @param size
 * @param conditionMap
 * @returns {Promise}
 */
exports.getOrderfileListPage= function(page, size, conditionMap) {

    var p = new Promise(function(resolve,reject){
        conditionMap.proc_inst_status=4;
        utils.pagingQuery4Eui(model.$ProcessInst, page, size, conditionMap, resolve, '',  {proc_start_time:-1});

    });

    return p;
};




