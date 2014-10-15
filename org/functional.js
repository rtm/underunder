var __ = require('../src/underunder');

__.array = require('../org/array');

__.functional={
    is			  : function(x) {
	return Object.prototype.toString.call(x) === "[object Function]";
    },
    compose		  : function( ) {
	//compose a list or array of fns, passing the result from each to the previous one
	var fns=[].concat.apply([],[].slice.call(arguments,0));
	return function result(){
	    var self=this;
	    return fns.reduceRight(
		function(prev,cur){
		    return [cur.apply(self,prev)];
		},
		arguments
	    )[0];
	};
    },
    invertize	  : function(f) {
	//return a function which returns the value inverted
	return function(){return !f.apply(this,arguments);};
    },
    dethisize	  : function(f) {
	//return a function which passes in 'this' as the first argument
	//note: 'thisize' is precisely Function.prototype.apply
	return function(){
	    return f.apply(0,__.array.unshift(arguments,this));
	};
    },
    returnize	  : function(f,val) {
	//return a function which returns the specified value
	return function(){
	    f.apply(this,arguments);
	    return val;
	};
    },
    after		  : function(n,f){
	//invoke function only after n calls
	return function(){
	    if(--n<1){
		return f.apply(this,arguments);
	    }
	};
    },
    once		  : function(f){
	//create a version of a function which runs just once on first call
	//returns same value on succeeding calls
	var ran, ret;
	return function() {
	    return ran ? ret : (ran=true, ret=f.apply(this,arguments));
	};
    },
    args:		  (function(){
	//functions for transforming function arguments lists
	function transform(f,transformer){
	    return function(){
		return f.apply(
		    this,
		    transformer(Array.prototype.slice.call(arguments))
		);
	    };
	}
	return {
	    swap	  : function(f) {
		//transform a function so as to reverse the order of two arguments
		return transform(f,function(args){ return args.slice(0,2).reverse();});
	    },
	    reverse	  : function(f){
		//return a function to revese the order of all arguments
		return transform(f,Function.prototype.call.bind(Array.prototype.reverse));
	    },
	    pick	  : function(f,n1,n2){
		//return a function which passes only certain args
		if(!n2){n2=n1;n1=0;}
		return transform(f,function(args){return args.slice(n1,n2);});
	    },
	    append : function(fn){
		return transform(fn,function(args){return args.concat(__.array.tail(arguments));});
	    },
	    prepend : function(fn){
		return transform(fn,function(args){return __.array.tail(arguments).concat(args);});
	    }
	};
    }()),
    partial		  : function(f) {
	var slice=Array.prototype.slice,args=slice.call(arguments,1);
	return function() {
	    return f.apply(this,args.concat(slice.call(arguments)));
	};
    },
    memoize		  : function(fn,hash){
	var memo={};
	hash=hash||JSON.stringify;
	return function() {
	    var key = hash.apply(this,arguments);
	    if(!(key in memo)){memo[key]=fn.apply(this,arguments);}
	    return memo[key];
	};
    },
    delayed		  : function(f,d){
	//create a version of a function (same signature) whose execution is delayed
	return function(){
	    var _this=this,args=arguments,ff=function(){f.apply(_this,args);};
	    return setTimeout(ff,d);
	};
    },
    maybe		  : function(f) {return this.is(f) ? f.apply(this,__.array.tail(arguments)) : f;},
    argchecked	  : function(f){
	//Create a version of a function which checks number of arguments expected vs. passed
	return function() {
	    if (arguments.length < f.length) {
		throw(["Expected", f.length, "arguments, got", arguments.length].join(" "));
	    }
	    return f.apply(this, arguments);
	};
    },
    overloaded	  : function(){
	//Provide a list of fns or arrays of fns with different # of arguments
	//Return a function which calls the right one based on # of args passed
	//Add additional functions later with f.add(...), or set fallback with f.fallback
	var fns=[];
	function add_one(f){
	    var n=f.length;
	    if(fns[n]){throw Error("__.fn.overloaded: ambiguous signature");}
	    fns[n]=f;
	}
	function add(){
	    [].concat.apply([],[].slice.call(arguments,0)).forEach(add_one);
	}
	function go(){
	    var n=arguments.length,fn=fns[n]||go.fallback;
	    if(!fn){throw Error(["__.fn.overloaded: no function with",n,"arguments"].join(" "));}
	    return fn.apply(this,arguments);
	}
	add.apply(0,arguments);
	go.add=add;
	return go;
    },
    parse_args	  : function(fn){
	//get arguments to function as array of strings
	var args=fn.args=fn.args||						 //cache result in args property of function
	fn.toString()								 //get string version of function
	    .replace(/\/\/.*$|\/\*[\s\S]*?\*\//mg, '')	 //strip comments
	    .match(/\(.*?\)/m)[0]						 //find argument list, including parens
	    .match(/[^\s(),]+/g)						 //find arguments
	;
	return args;
    }
};

module.exports =  __.functional;
