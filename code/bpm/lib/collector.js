///var logger = require('./logger');
var logger = require("../lib/logHelper").helper;
var config = require('../config');
var os = require('os');
var EventEmitter = require('events').EventEmitter;
var influx = require('influx');
var mqtt    = require('mqtt');
var url = require('url');
var _ = require('lodash');


/**
 * url 采集服务器url
 * mqtt：
 * url="mqtt://:@117.135.196.136:11883/flushInterval=5000&qos=1&1retain=false" ;
 *
 * influxdb
 * url = "http://stat:stat@117.135.196.136:18086/dev?instantFlush=no&flushInterval=5000" ;
 * @type {string}
 */

var uri =config.stat_collect.url;

var mqtt_qos=1 ;
var mqtt_retain = false ;
var point_max_len = config.stat_collect.point_max_len ;
var mqtt_topic=config.stat_collect.mqtt_topic;
// create a collector for the given series
function Collector(series) {
    if (!(this instanceof Collector)) {
        return new Collector(series);
    }

    var self = this;

    if (!series) {
        throw new Error('series name must be specified');
    }

    self._uri = uri;
    var parsed = url.parse(uri, true /* parse query args */);

    var username = undefined;
    var password = undefined;

    if (parsed.auth) {
        var parts = parsed.auth.split(':');
        username = parts.shift();
        password = parts.shift();

    }

    self._points = [];
    var opt = parsed.query || {};

    self._series_name = series;

    if("mqtt:" == parsed.protocol)
    {

        self._dbtype = 1 ;

        mqtt_retain = opt.retain === true ;

        if(!self._mqttclient) {

            self._mqttclient = mqtt.connect(parsed.protocol+'//'+parsed.hostname+':'+parsed.port, function () {

                ///logger.info('stat collect （mqtt connected） ['+parsed.protocol+'//'+parsed.hostname+':'+parsed.port+']');

            });

            self._mqttclient.on('connect', function () {

               /// logger.info('stat collect （mqtt connected） ['+parsed.protocol+parsed.hostname+parsed.port+']');

            });

            self._mqttclient.on('message', function (topic, message) {

               /// logger.debug('stat collect ，MQTT recv message ['+topic+']/['+message+']');
            });

        }

    }
    else
    {
        self._dbtype = 2 ;

        self._client = influx({
            host : parsed.hostname,
            port : parsed.port,
            protocol : parsed.protocol,
            username : username,
            password : password,
            database : parsed.pathname.slice(1) // remove leading '/'
        })
    }



    self._instant_flush = opt.instantFlush == 'yes';
    self._time_precision = opt.time_precision;

    // no automatic flush
    if (opt.autoFlush == 'no' || self._instant_flush) {
        return;
    }

    var flush_interval = opt.flushInterval || 5000;

    // flush on an interval
    // or option to auto_flush=false
    setInterval(function() {

        self.flush();

    }, flush_interval).unref();
}

Collector.prototype.__proto__ = EventEmitter.prototype;


Collector.prototype._createKeyValueString = function (object) {

    var lines = "" ;

    var clone = _.clone(object)
    delete clone.time
    _.forOwnRight(clone, function (value, key) {

        var output = []
        //console.logs(key);

        if (typeof value === 'string') {
         //   output.push(key + '="' + JSON.stringify(value) + '"')
        } else {
            _.forOwn(value, function (value1, key1) {
                if("time" != key1)
                    output.push(key1 + '=' +  value1 )
            });

         //   output.push(key + '=' + JSON.stringify(value))
        }
        lines+=output.join(',') +" ";
    })
    return lines;// output.join('+')
}

Collector.prototype._createKeyTagString = function (object) {
    var output = []
    _.forOwn(object, function (value, key) {
        if (typeof value === 'string') {
            output.push(key + '=' + JSON.stringify(value).replace(/ /g, '\\ ').replace(/,/g, '\\,').replace(/=/g, '\\='))
        } else {
            //output.push(key + '=' + JSON.stringify(value))
        }
    })
    return output.join(',')
}



Collector.prototype.formatInfluxMsg = function(seriesName,points) {

    var self = this;

    var  t = '' ;
    var lines = '' ;


    _.each(points,function (point) {

        var line = '' ;
        line = seriesName.replace(/ /g, '\\ ').replace(/,/g, '\\,')+','


        var timestamp = null
        if (_.isObject(points[0])) {

            _.forEach(points[0], function (points_item, b) {
                if (points_item.time) {
                    {
                        timestamp = points_item.time ;
                        //console.logs(a);
                    }
                }

            });

            line += '' + self._createKeyValueString(points[0])

        } else {
            if (typeof points[0] === 'string') {
                line += ' value="' + points[0] + '"'
            } else {
                line += ' value=' + points[0]
            }
        }

        if (points[1] && _.isObject(points[1]) && _.keys(points[1]).length > 0) {
            line += '' + self._createKeyTagString(points[1])
        }

        // console.logs(timestamp.getTime().toExponential(19));
        if (timestamp) {
            if (timestamp instanceof Date) {
                line += '' + timestamp.getTime()+_.random(100001,999990)
            } else {
                line += '' + timestamp
            }
        }



        lines = lines + line +"\n";
    });


    return lines;
}



Collector.prototype.writeToMQTT = function(seriesName,points,callback) {

    var self = this;

    var  t = '' ;
    var lines = '' ;

    _.each(points,function (point) {

        var line = '' ;
        line = seriesName.replace(/ /g, '\\ ').replace(/,/g, '\\,')+','

        var timestamp = null
        if (_.isObject(points[0])) {

            _.forEach(points[0], function (points_item, b) {
                if (points_item.time) {
                    {
                        timestamp = points_item.time ;
                    }
                }
            });

            line += '' + self._createKeyValueString(points[0])

        } else {
            if (typeof points[0] === 'string') {
                line += ' value="' + points[0] + '"'
            } else {
                line += ' value=' + points[0]
            }
        }

        if (points[1] && _.isObject(points[1]) && _.keys(points[1]).length > 0) {
            line += '' + self._createKeyTagString(points[1])
        }

        if (timestamp) {
            if (timestamp instanceof Date) {
                line += '' + timestamp.getTime()+_.random(100001,999990)
            } else {
                line += '' + timestamp
            }
        }


        var t =  new Date() ;
        self._mqttclient.publish(mqtt_topic+'/'+os.hostname()+'/'+seriesName,line ,{qos: mqtt_qos, retain: mqtt_retain},function (err) {

            var duration = ((new Date()) - t);
            if(err)
            {
               /// logger.error('error on publish,topic:'+mqtt_topic+'/'+os.hostname()+'/'+seriesName +',error:'+err.message);

                //
                if(self._points.length < point_max_len)
                    self._points.push(points);
                else
                    ///logger.error('Ponts exceed max len ['+self._points.length+']');
                    ;

            }
            else
            {

                //logger.debug('published[size:'+points.length+',in '+duration+'ms],topic:'+'dev/'+os.hostname()+'/'+seriesName +'');
                //callback();
            }

        });

        lines = lines + line +"\n";


    });

    // console.log('hello');
    callback();
}
Collector.prototype.flush = function() {
    var self = this;

    if (!self._points || self._points.length === 0) {
        return;
    }

    var points_len = self._points.length;

    var points = self._points.splice(0,50);

    var opt = { precision: self._time_precision };

    var t = new Date();

    if(self._dbtype == 1)
    {


        var message = self.writeToMQTT(self._series_name,points,function (err) {


            var duration = ((new Date()) - t);
            if (err) {

                ///logger.error('error when write Points[size:'+points.length+'/'+points_len+' ] into MQTT('+self._uri+'),error('+err.message+")");

            }
            else
            {

                if (self._points.length >0) {
                    setImmediate(self.flush.bind(self));
                }
            }

        }) ;



    }
    else
    {


        self._client.writePoints(self._series_name, points, opt, function(err) {
            if (err) {

               /// logger.error('error when write Points into influxDB('+self._uri+'),error('+JSON.stringify(err.message)+")");

                if(self._points.length < point_max_len)
                    self._points.push(points);
                else
                    ; ///logger.error('Ponts exceed max len ['+self._points.length+']');

                //self._points.push(points);
            }
            else
            {
                //console.logs('--');
                ///logger.debug('write to influxDB end');

                // there are more points to flush out
                if (self._points.length >0) {
                    setImmediate(self.flush.bind(self));
                }
            }

        });
    }

};

Collector.prototype.collect = function(value, tags) {
    //console.log(value);
    var self = this;

    // disabled (due to no URL)
    if (!self._points) {
        return;
    }

    self._points.push([value, tags]);
    if (self._instant_flush) {
        self.flush();
    }

    //console.log(value);
};

module.exports = Collector;