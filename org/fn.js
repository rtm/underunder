// __ library function utilities

require('src/underunder').__.fn={
    is            : function(x) {
		//calling this function will be 63% slower than just applying typeof yourself
		//return !!(x && x.constructor && x.call && x.apply); // 30% slower according to jsperf
		return typeof x === "function";
    },
    identity      : function(x) {return x;},
    fixed         : function(c) {return function(){return c;};},
    noop          : function( ) {},
    run           : function(f) {return f();},
    not           : function(v) {return !v;},
    falsy         : function(v) {return !v;},
    truthy        : function(v) {return !!v;},
    non_null      : function(x) {return x != null;},
    maybe         : function(f) {return typeof f==="function" ? f.apply(this,__.array.tail(arguments)) : f;}
};
