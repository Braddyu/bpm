var config = require('../config');

var Stats = require('./collector');
var os = require('os');
var usage = require('usage');
var mem_stats = Stats('node_base');

var interval = config.stat_collect.interval ;

setInterval(function() {


  var options = { keepHistory: false };

  usage.lookup(process.pid , options,function(err, result) {

    var osloadavg = os.loadavg();
    var mem = process.memoryUsage();

    var cpu = 0;
    if('linux' == os.platform())
    {
      cpu = result.cpu ;
    }

    mem_stats.collect({
      //time 必填
      time : new Date(),

      p_count:1,
      os_mem_total:os.totalmem(),
      os_mem_free : os.freemem(),
      p_cpu:cpu,//result.cpu,
      p_cpu_1m_avg:osloadavg[0],
      p_mem_rss: mem.rss,
      p_mem_heap_total: mem.heapTotal,
      p_mem_heap_used: mem.heapUsed,

    }, {
      pid:  process.pid,
      appgroup: config.app_group,
      app: config.app_id,
      host:config.host
    });

    if('linux' == os.platform())
    {
      usage.clearHistory();
    }

  });


},  interval * 1000);



