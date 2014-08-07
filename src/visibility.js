__.window.visibility=(function(){
    //Page Visibility API
    var 
    hidden_property=Modernizr.prefixed('hidden',document,false),
    event_names={
	hidden:        "visibilitychange",
	mozHidden:     "mozvisibilitychange",
	msHidden:      "msvisibilitychange",
	webkitHidden:  "webkitvisibilitychange"
    },
    event_name=event_names[hidden_property]
    ;
    return Object.create({
	add_listener       : function(f){
	    document.addEventListener(event_name,f);
	},
	remove_listener    : function(f){
	    document.removeEventListener(event_name,f);
	}
    },{
	hidden : {
	    get: function(){return document[hidden_property];}
	}
    });
}());
