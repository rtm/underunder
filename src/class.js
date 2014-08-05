// Simple class definition and inheritance framework for __ library, (c) Bob Myers */
/*jslint white: true, indent: 4, nomen: true */
/*global __ */

__.class=(function(){
	var 
	proxy    = function(o,p){__.object.proxy.all(o,p._static);},
	create  = Object.create,
	merge    = __.object.merge,
	slice    = Array.prototype.slice,

	names   = {},
	O       = {
		new    : function class$new() {
			var o, opts=this._opts||{}, _final=opts.final;
			if(DEBUG){if(opts.virtual){throw new Error("Cannot instantiate virtual class "+this._name);}}
			o = create(this._proto);
			o = this._ctor.apply(o,arguments) || o;
			if(_final){Object.preventExtensions(o);}
			return o;
		},
		derive : function()  {
			var o=__.class.new(); 
			o._derived_from=this;
			proxy(o,this);                 //make static methods available on class itself
			proxy(o._static,this);         //proxy (not copy) superclass static members
			o._proto=create(this._proto);  //initial instance methods are same as superclass
			o._proto.static=o._static;     //make static methods available to instances through 'static' member
			return o;
		},
		proto  : function(p,pd) {
			if(p){
				merge(this._proto,p);
				//the below implements the ability to do this.foo_super(blah), but is somewhat expensive
				// __.object.forEach(__.object.filter(p,__.fn.is),function(fn,name){
				// 	//create additional functions named method_super
				// 	sup._proto[name+"_super"]=function(){
				// 		return sup[name].apply(this,arguments);
				// 	};
				// });
			}
			if(pd){Object.defineProperties(this._proto,pd);}
			return this;
		},
		mixin  : function(c) {return merge(this._proto,c._proto), proxy(this,c), this;},
		ctor   : function(c) {return this._ctor=c,                               this;},
		static : function(m) {return merge(this._static,m), merge(this,m),       this;},
		enum   : function(n) {return this.static(__.array.map_to_object(n,function(v,i){return i;}));},
		name   : function(n) {return this._name=n, names[n]=this,                this;},
		watch  : function(v) {return __.object.watch.define(this._proto,v),      this;},
		opts   : function(o) {return __.object.merge(this._opts=this._opts||{},o),this;},
		proxy  : function(target_propname,props,opts){
			__.object.proxy.many_named(this._proto,target_propname,opts,props);
			return this;
		},
		_ctor  : function()  {
			merge(this,{
				_ctor   : function(){},
				_static : {},
				_proto  : {
					super  : function _super(sup){sup._ctor.apply(this,slice.call(arguments,1));},
					superclass : function superclass(sup){
						//permit this.superclass(sup).method(args), or this.superclass(sup).static.method(args)
						var ret=__.object.bind(sup._proto,this);
						ret.static=__.object.bind(sup._static,sup);
						return ret;
					},
					is : function(sup){return __.class.is(this,sup);},
					static : this,
					toString: function(){return this.static._name;}
				}
			});
			proxy(this._proto,this);
		}
	}
	;
	O._proto=create(O);
	O.get_by_name=function(name){return names[name];};//TODO: keep this out of prototype
	O.is=function(obj,sup){
		return typeof sup==="object" && sup._proto && Object.prototype.isPrototypeOf.call(sup._proto,obj);
	};
	O._static={};
	return O;
}());
