/* global console */

__.Error=__.class.new()
//subclass providing this.context and this.templates
    .ctor(function(name,data,sev){
	this.name=name;
	this.data=data||{};
	this.sev=sev||this.static.WARNING;
	this._line=this.static.line();

	var tmpl=this.static.templates[name];
        if(tmpl){
	    this.message=
		this.static.sev_labels[this.sev]+": " +
		__.template.exec(tmpl,this.data||{})  +
		" (line "+this._line+" in "+__.string.substring.after_last(location.href,"/")+")"
	    ;
	}else{
	    this.message="Invalid error message.";
	    this.sev=this.static.FATAL;
	}
	this.static.register(this);
	this.is_error=true;
    })
    .proto({
	log : function(){
	    if(console && console.log){console.log(this.message);}
	},
	throw : function(e){
	    if(e){this.msg+=" ("+e+")";}
	    if(this.sev===this.static.WARNING || this.sev===this.static.INFO){this.log();}
	    else{throw this;}
	}
    })
    .enum(["FATAL","ERROR","WARNING","INFO"])
    .static((function(){
	var errors=[];
	return{
	    sev_labels : ["Fatal","Error","Warning","Info"],
	    register : Array.prototype.push.bind(errors),
	    catch : function(e,names){
		if(e.is_error&&(names&&names.indexOf(e.name)!==-1)){
		    e.log();
		}else{
		    throw e;
		}
	    },
	    get_list   : function(){
		return errors;
	    },
	    get_html   : function(){
		var ret="No errors.";
		if(errors.length){
		    ret=__.dom.elt.build("ul",errors.map(function(e){return __.dom.elt.build("li",e);}));
		}
		return ret;
	    }
	};
    }()))
;
