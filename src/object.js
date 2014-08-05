// Object methods for __ library (c) Bob Myers

__.object={
	type		  : "Object",
	is			  : function(x){
		//check if argument is an object
		return Object.prototype.toString.call(x) === "[object Object]";
	},
	has			  : function(o,p){
		return o.hasOwnProperty(p);
	},
	hasnt		  : function(o,p){
		return !o.hasOwnProperty(p);
	},
	get_prop_chain: function(o,chain){
		//get chain of properties, as in get_prop_chain(o,'prop1.prop2.prop3')
		return chain.split('.').reduce(function(v,p){return p ? v && v[p] : v;},o);
	},
	/* =====ITERATOR-STYLE methods===== */
	iterator	  : function(o,fn,ctxt){
		//create iteration function for use with forEach, some, every, filter
		//called with property value, property name (key), and object
		//convert Array.map style callback signature to (val,key,obj)
		return function object$iterator(k/*,i,keys*/){return fn.call(ctxt,o[k],k,o);};
	},
	map			  : function object$map(o,fn,ctxt){
		//create a parallel object by applying a function to the value in each key-value pair
		//function is called with value, key, and object
		var keys=Object.keys(o);
		return this.from_keys_values(keys,keys.map(this.iterator(o,fn,ctxt)));
	},
	map_kv		  : function object$map_kv(o,fn,ctxt){
		//create a parallel object by applying a function to each key-value pair
		//function is called with value, key, and object, returns [k,v], or null to remove
		return Object.keys(o).reduce(
			function(prev,cur){
				var res=fn.call(ctxt,o[cur],cur,o);
				if(res){prev[res[0]]=res[1];}
				return prev;
			},
			{}
		);
	},
	forEach		  : function object$forEach(o,fn,ctxt){
		Object.keys(o).forEach(this.iterator(o,fn,ctxt));
	},
	some		  : function object$some(o,fn,ctxt){
		return Object.keys(o).some(this.iterator(o,fn,ctxt));
	},
	every		  : function object$every(o,fn,ctxt){
		return Object.keys(o).every(this.iterator(o,fn,ctxt));
	},
	filter		  : function object$filter(o,fn,ctxt){
		//create new object with only those property/value pairs which satisfy fn(val,prop,obj)
		return Object.create(
			Object.getPrototypeOf(o),
			this.descriptors.from_keys(
				o,
				Object.getOwnPropertyNames(o).filter(this.iterator(o,fn,ctxt))
			)
		);
	},
	bind		  : function(o,_this){
		//return a new object with all functions bound to a specified context
		//this is used by __.class to bind prototype functions in superclasses
		return __.object.map(
			__.object.filter(o,__.fn.is),
			function(f){return f.bind(_this);}
		);
	},
	/* =====UPDATE/CLONE-STYLE methods===== */
	merge		  : function merge_object(o1,o2){
		o1=o1||{};
		//properties from second argument overwrite those with same name from first
		return Object.defineProperties(o1,__.object.descriptors.own(o2));
	},
	update		  : function update_object(){
		//merge all specified objects into first one and return it
		return __.array.to(arguments).reduce(this.merge);
	},
	clone		  : function clone_object(o,no_status){
		var n=Object.create(
			Object.getPrototypeOf(o),
			__.object.descriptors.own(o)
		);
		if(!no_status){
			if(!Object.isExtensible(o)){Object.preventExtensions(n);}
			if(Object.isSealed(o)){Object.seal(n);}
			if(Object.isFrozen(o)){Object.freeze(n);}
		}
		return n;
	},
	defaults	  : function(o,defaults){
		//fill in an object with properties from another giving defaults
		//object is modified in place
		Object.defineProperties(
			o,
			this.omit_keys(
				this.descriptors.own(defaults),
				Object.getOwnPropertyNames(o)
			)
		);
		return o;
	},
	set_prototype  : function(o,p){
		//can't actually set prototype--instead, create new object with specified prototype
		return Object.create(p||{},this.descriptors.own(o||{}));
	},
	find_key	  : function(o,fn,ctxt){
		//find some object key for which fn(value,key,obj) returns true
		var result=null;
		this.some(o,function(v,k,o){
			if(fn.call(ctxt,v,k,o)){
				result=k;
				return true;
			}
		});
		return result;
	},
	find_keys	  : function(o,fn,ctxt){
		//return array of all keys in object which satisfy criterion
		return Object.keys(o).filter(this.iterator(o,fn,ctxt));
	},
	find_value	  : function(o,fn,ctxt){
		//find a property value in the object which satisfies criterion
		return o[this.find_key(o,fn,ctxt)];
	},
	values		  : function(o){
		//return array of values of (enumerable) keys in object
		return Object.keys(o).map(function(k){return o[k];});
	},
	to_pairs	  : function(o){
		//turn an object into an array of [key,val] pairs
		return Object.keys(o).map(function(k){return [k,o[k]];});
	},
	from_pairs	  : function(pairs){
		//turn an array of [key,val] pairs into an object
		return pairs.reduce(function(prev,cur){prev[cur[0]]=cur[1];return prev;},{});
	},
	from_keys_values : function(keys,values){
		//turn arrays of keys and values into an object
		return keys.reduce(function(prev,cur,i){
			var v=values[i];
			if(typeof v!=="undefined"){prev[cur]=v;}
			return prev;
		},{});
	},
	set_prop	  : function(o,v,p){
		//set a property on the this object
		o[p]=v;
	},
	filter_keys	  : function(o,keys){
		//create new object containing only specified keys
		return this.filter(o,function(v,k){return keys.indexOf(k)>=0;});
	},
	omit_keys	  : function(o,keys){
		//create new object omitting specified keys
		return this.filter(o,function(v,k){return [].concat(keys).indexOf(k)===-1;});
	}
};
