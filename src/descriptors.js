// manipulate ECMAScript 5 property descriptors

__.object.descriptors={
    from_keys     : function(o,keys){
        //get a properties descriptor object for specified keys
        //suitable for use with Object.create or Object.defineProperties
        return __.array.map_to_object(keys,Object.getOwnPropertyDescriptor.bind(0,o));
    },
    own           : function(o){
	//get a properties descriptor object for own properties
        return this.from_keys(o,Object.getOwnPropertyNames(o||{}));
    },
    enumerable    : function(o){
	//get a properties descriptor object for enumerable properties
        return this.from_keys(o,Object.keys(o));
    },
    from_value     : function(v){
	//create a simple value property description from a value
	return {value: v };
    },
    from_object    : function(o){
	return __.array.map_to_object(
	    Object.getOwnPropertyNames(o),
	    this.from_value
	);
    },
    copy_to_object : function(from,to,p){
	//copy a property description to another object with same name
	this._copy(from,to,p,p);
    },
    copy_to_property: function(o,from,to){
	//copy a property descriptor to another property on same object
	this._copy(o,o,from,to);
    },
    _copy           : function(from_o,to_o,from_p,to_p){
	//copy a property descriptor for one property on one object to another object
	Object.defineProperty(to_o,to_p,Object.getOwnPropertyDesciptor(from_o,from_p));
    }
};
