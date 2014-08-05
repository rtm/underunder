// __ routines wrapping JSON

__.dom.json={
    //JSON variants which convert DOM elements to and from ID's
    to_id     : function(k,v){
        //filter function for us with JSON.stringify, converting dom nodes to id's
		if(k[0]==='_'){
			//skip keys starting with underscore
			return undefined;
		}
        if(__.dom.elt.is(v)){
            if(DEBUG){if(!v.id){throw new ReferenceError("in JSON_DOM.stringify, elt has no id");}}
            v='#'+v.id;
        }
        return v;
    },
    from_id   : function(k,v){
        //filter function for use with JSON.parse, converting id's to nodes
        if(__.string.is(v)&&v[0]==="#"){
			//translate keys whose values starts with "#" as DOM IDs
            v=document.getElementById(v.substring(1));
            if(DEBUG){if(!v){throw new ReferenceError("in JSON_DOM.parse, no element with id "+v);}}
        }
        return v;
    },
	omit_keys : function(keys){
		return function(k,v){
			return keys.indexOf(k)===-1 ? v : undefined;
		};
	},
    stringify : function(o/*,filters and properties to omit*/){
        //modified version of JSON.stringify which processes DOM nodes
		var replacer=
			//create a replacer function which returns undefined (skip) if any of the arguments
			//are functions which do so, or are arrays which contain the key
			//note:if a changed value is returned, that value is used in succeeding calls
			Array.prototype.slice.call(arguments,1).reduceRight(
				function(prev,cur){
					return function(k,v){
						v = typeof cur==="function" ? cur(k,v) : 
							Array.isArray(cur) ? (cur.indexOf(k)===-1 ? v : undefined) :
						cur===k ? undefined : v;
						return typeof v==="undefined" ? undefined : prev(k,v);
					};
				},
				this.to_id
			)
		;
		return JSON.stringify(o,replacer);
    },
    parse     : function(s){
        //modified version of JSON.parse which processes DOM nodes
        return JSON.parse(s,this.from_id);
    },
	deep_map_from_id : function(o){
		function from_id(id){return __.dom.json.from_id(0,id);}
		return __.deep_map(o,from_id);
	},
	deep_map_to_id : function(o){
		function to_id(e){return __.dom.json.to_id(0,e);}
		return __.deep_map(o,to_id);
	}
};
