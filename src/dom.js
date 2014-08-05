// Books You Touch DOM utilities, (C) Bob Myers

__.dom={
    init        : function(){
        __.init.call(this);
        ['div','span','a'].forEach(function(t){this[t]=this.elt.build.bind(this.elt,t);},this);
    },
    attribute   : {
        init        : function(){
            this.disabled=this.setter("disabled","disabled");
        },
        setter      : function(a,default_value){
        //return an object with methods to add and remove a particular attribute on some DOM element
            return{
                set     : function(e,v) {e.setAttribute   (a,arguments.length>=2?v:default_value); return e;},
                remove  : function( e ) {e.removeAttribute(a);                                     return e;}
            };
        }
    },
    text        : function(t){
		//create a text node
        return document.createTextNode(t);
    },
	node        : {
		insert_after : function(elt,after){
			return after.parentNode.insertBefore(elt,after.nextSibling);
		}
	},
	script      : {
		inject  : function __$dom$script$inject(src,append_to){
			var elt=document.createElement("script");
			elt.setAttribute("src",src);
			(append_to||document.body).appendChild(elt);
			return __.Promise.listen(elt,"load");
		}
	},
    elt         : {
        is      : function(e){
            return e && e.nodeType===Node.ELEMENT_NODE;
        },
        fill    : function(elt/*atts,children...*/){
            [].slice.call(arguments,1).reduce(__.flatten,[]).filter(__.fn.truthy).forEach(function(c){
                if (c.nodeType)            {elt.appendChild(c);}
                else if (!__.object.is(c)) {elt.appendChild(__.dom.text(c));}
                else{
					__.object.forEach(c,function(v,k){
						switch(k){
						case "class":   __.dom.cls.add(v,elt);     break;
						case "dataset":
						case "style":   //__.object.merge(elt[k],v); break;
							__.object.forEach(v,__.object.set_prop.bind(0,elt[k])); break;
						default:        elt.setAttribute(k,v);
						}
					});
				}
            });
            return elt;
        },
        build   : function(){
			var a=arguments[0];
			if(a===a+""){arguments[0]=document.createElement(a);}
            return this.fill.apply(this,arguments);
        },
        disable_selection : function(e){e.classList.add("unselectable");},
        disable : function(e){this.attribute.disabled.set(e);},
        enable  : function(e){this.attribute.remove(e);}
    },
    html        : {
        ns      : "http://www.w3.org/1999/xhtml"
    }
};
__.dom.init();

