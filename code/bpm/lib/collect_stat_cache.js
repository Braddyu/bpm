'use strict'

var EventEmitter = require('events').EventEmitter;

function HashMap() {
    EventEmitter.call(this);

    var self = this;

    self._entry = new Object();
}


module.exports = new HashMap();


HashMap.prototype.set = function(key,value){

    var t = 0 ;
    var self = this;
    //if(self.containsKey(key))
    //{
    //    t = self._entry[key];
    //}
    t =  value;

    self._entry[key] = t;

}

HashMap.prototype.add = function(key,value){

    var t = 0 ;
    var self = this;
    if(self.containsKey(key))
    {
        t = self._entry[key];
    }
    t = t+ value;

    self._entry[key] = t;

}

HashMap.prototype.containsKey = function ( key )
{
    return (key in this._entry);

}

HashMap.prototype.pop = function (key)
{
    var t = 0 ;
    if(this.containsKey(key))
    {
        var t = this._entry[key];
        this._entry[key] = 0 ;
    }
    return t ;
}