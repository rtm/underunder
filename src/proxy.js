// property proxying for __ library, (c) Bob Myers

__.object.proxy={
	descriptor : function(target,opts,prop){
		//make a property descriptor which aliases a property to that of another object
		//if provided in opts, fn_get and fn_set map values coming and going
		//function values are optionally bound to the delegate object via opts.bind=true
		opts=opts||{};
		return {
			get   : function(){
				var v=target[prop];
				if(opts.fn_get){v=opts.fn_get.call(this,v,prop);}
				if(opts.bind&&typeof v==="function"){v=v.bind(target);}
				return v;
			},
			set   : function(v){
				if(opts.fn_set){v=opts.fn_set.call(this,v,prop);}
				target[prop]=v;
			}
		};
	},
	descriptor_named : function(target_propname,opts,prop){
		//make a property descriptor which aliases a property to that of another object
		//the object is given by a property with the specified name
		//function values are optionally bound to the delegate object
		opts=opts||{};
		return {
			get   : function(){
				var target=this[target_propname];
				var v=target[prop];
				if(opts.fn_get){v=opts.fn_get.call(this,v,prop);}
				if(opts.bind&&typeof v==="function"){v=v.bind(target);}
				return v;
			},
			set   : function(v){
				var target=this[target_propname];
				if(opts.fn_set){v=opts.fn_set.call(this,v,prop);}
				target[prop] =v;
			}
		};
	},
	many       : function(o,target,opts,props){
		//set up proxied properties on o for many properties, delegating to target object
		Object.defineProperties(o,__.array.map_to_object(props,this.descriptor.bind(0,target,opts)));
	},
	many_named : function(o,target_propname,opts,props){
		//set up proxied properties on o for a list of properties, delegating to object specified by property
		Object.defineProperties(o,__.array.map_to_object(props,this.descriptor_named.bind(0,target_propname,opts)));
	},
	all        : function(o,target,opts){
		//set up proxied properties for all properties on an object
		return this.many(o,target,opts,Object.getOwnPropertyNames(target));
	}
};
