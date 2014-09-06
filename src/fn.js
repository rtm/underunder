// __ library function utilities, (c) Bob Myers */

module.exports = {

    is            : function(x) {
	return typeof x === "function";
	//calling this function will be 63% slower than just applying typeof yourself
	//return !!(x && x.constructor && x.call && x.apply); // 30% slower according to jsperf
    },
    identity      : function(x) {return x;},
    fixed         : function(c) {return function(){return c;};},
    noop          : function( ) {},
    run           : function(f) {return f();},
    not           : function(v) {return !v;},
    invert        : function(v) {return function(){return !v.apply(this,arguments);}},
    falsy         : function(v) {return !v;},
    truthy        : function(v) {return !!v;},
    non_null      : function(x) {return x != null;},
    maybe         : function(f) {
		return typeof f==="function" ? f.apply(this,Array.prototype.slice.call(arguments,1)) : f;
	}

};
