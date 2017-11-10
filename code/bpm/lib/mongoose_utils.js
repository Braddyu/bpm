/**
 * Created by ShiHukui on 2016/2/22.
 */

/*

var mongoose = require('mongoose');
var config   = require('../config/config');
// var logger = require('../common/logger');
var recon =true;
mongoose.Promise = require('bluebird');



var $mongoose = null ;
exports.init  = function getConnect(){

    if($mongoose == null){

        var opts ={
            db:{ native_parser:true },
            server:{ poolSize:5, auto_reconnect:true },
            // user: username, pass: password
        };



        //mongoose.connect(config.mongdb.url, opts);
        //var dbcon = mongoose.connection;
        var dbcon = mongoose.createConnection(config.mongdb.url, opts);


        dbcon.on('error',function(error){
            console.log('connection error');
            // throw new Error('disconnected,restart');

            dbcon.close();

        });

        //监听关闭事件并重连
        dbcon.on('disconnected',function(){
            console.log('disconnected');
            dbcon.close();

        });

        dbcon.on('open',function(){
            console.log('connection success open');

            recon =true; });

        dbcon.on('close',function(err){
            console.log('closed');
//
            dbcon.open(host, dbName, port, opts, function() { //

                console.log('closed-opening');

            });
            reConnect('*');
        });

        function reConnect(msg){
            console.log('reConnect'+msg);
            if(recon){
                console.log('reConnect-**');
                dbcon.open(host, dbName, port, opts,function(){

                    console.log('closed-opening');
                });

                recon =false;
                console.log('reConnect-***');
            };

            console.log('reConnect-end');

        }

        $mongoose = mongoose;

    }

    return mongoose;
}
*/
//exports.init = getConnect;




var mongoose = require('mongoose');
var config   = require('../config');
// var logger = require('../common/logger');
var recon =true;
mongoose.Promise = require('bluebird');

var $mongoose = null;
exports.init = function() {
    if($mongoose == null) {
        mongoose.connect(config.mongdb.url,
            {
                server: {poolSize: config.mongdb.poolsize,auto_reconnect:true},
               // autoIndex: true,
                auto_reconnect:true
                //user: config.mongdb.user,
                //pass: config.mongdb.pass
            },
            function (err) {
                if (err) {
                    //logger.error('connect to %s error: ', config.mongodb_url, err.message);
                    console.log('connect to %s error: ', config.mongdb.url, err.message);
      //             process.exit(1);
                }
            });


        var db = mongoose.connection;
        db.on('error', function () {
            // console.error.bind(console, 'connection error:');
            console.log('db error ', config.mongdb.url, ' is connected')
        });


        db.once('open', function () {
            // we're connected!
            console.log('db ', config.mongdb.url, ' is connected');

            recon =true;

        });

        db.on('disconnected',function(){
            console.log('disconnected');
            //db.close();

        });


        db.on('close',function(err){
            console.log('closed');

        });





        $mongoose = mongoose;
    }

    return mongoose;
}


