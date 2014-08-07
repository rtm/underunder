/*! Books You Touch utilities, (C) Bob Myers */

/* global __: false */

var __ = {
    init	 : function(){
	//initialize sub-objects; should be called from init method within namespaces
	__.object.forEach(this,function(v){if(__.object.is(v)&&v.init){v.init();}});
	return this;
    },
    flatten	 : function flatten(a,b){
	//function for use as in Array.prototype.reduce(__.flatten,[])
	return a.concat(Array.isArray(b)?b.reduce(flatten,[]):b);
    },
    args	 : {
	squash		  : function(args,n){
	    //squash an argument list including arrays into a single array
	    return [].concat.apply([],__.array.to(args,n));
	}
    },
    bool	 : {
	option		  : function(o){
	    //convert something--anything--that might look like a boolean into a real boolean
	    return o===1 || o===true || /^(1|on|y|t)/i.test(o);
	}
    },
    deep_map : function(o,fn){
	//recursively traverse a JS structure mapping values
	function mapper(o){
	    return Array.isArray(o) ? __.array.map.bind(__.array) : __.object.is(o) ? __.object.map.bind(__.object) : null;
	}
	return this._deep_map(o,fn,mapper);
    },
    _deep_map : function(o,fn,mapper){
	var cnt=0;
	cnt++; /*avoid uglify unused var message when DEBUG code removed*/
	//recursively traverse a structure mapping values based on mappers selected according to object
	return (function deep_map(o){
	    if(DEBUG){if(cnt++>1e6){throw new Error("Excessive recursion in __._deep_map at object "+o);}}
	    var map=mapper(o);
	    return map ? map(o,deep_map) : fn(o);
	}(o));
    }
};

