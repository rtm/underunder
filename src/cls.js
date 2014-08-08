// __ routines for manipulating HTML classes

/* global DOMTokenList */

__.dom.cls={
    //utility functions related to classList
    list    : function(e){
	//return classlist, if it exists (may not for SVG!!!!), or array
	if(!e){return null;}
	if(e.classList){return e.classList;}
	return (e.getAttribute("class")||"").split(/\s/);
    },
    elts    : function(c,elt){
	//syntactic sugar for getElementsByClassName
	elt=elt||document.body;
        return [].slice.call(elt.getElementsByClassName(c),0);
    },
    parent  : function(c,elt){
	//return closest parent with given class
	do {elt=elt.parentNode;}
	while(elt && !elt.classList.contains(c));
	return elt;
    },
    children : function(c,elt){
	//get children only with given class
	return Array.prototype.filter.call(elt.childNodes,function(e){return e.classList.contains(c)});
    },
    parent_or_self  : function(c,elt){
	//return closest parent with given class, including self
	return elt.classList.contains(c) ? elt : this.parent(c,elt);
    },
    add     : function cls_add(classes,elt){
	//add class(es) to element, using classList if available
	var	
	cur_classes,
	c=[].concat(classes).filter(__.fn.truthy),
	l=DOMTokenList && DOMTokenList.prototype.add && elt.classList
	;
        if(l){
	    c.forEach(function(cc){l.add(cc);});
	}else{
	    cur_classes=this.list(elt);
	    cur_classes=__.array.unique(cur_classes.concat(c));
	    elt.setAttribute("class",cur_classes.join(" "));
	}
    },
    remove : function cls_remove(classes,elt){
	//remove class(es) from element, using classList if available
	var	
	cur_classes,
	c=[].concat(classes).filter(__.fn.truthy),
	l=DOMTokenList && DOMTokenList.prototype.add && elt.classList
	;
        if(l){
	    c.forEach(function(cc){l.remove(cc);});
	}else{
	    cur_classes=this.list(elt);
	    cur_classes.filter(function(cur){return c.indexOf(cur)===-1;});
	    elt.setAttribute("class",cur_classes.join(" "));
	}
    },
    add_many : function(classes,elts){
	Array.prototype.forEach.call(elts,this.add.bind(0,classes));
    },
    remove_many : function(classes,elts){
	Array.prototype.forEach.call(elts,this.remove.bind(0,classes));
    },
    //remove a class from a remembered element or set of elements, add it to a new one
    swapper : function(c,d){
        var elt=[];
        function cls_swapper(e){
            var d1=0,remove,add;
	    e=e ? [].concat(e) : [];
	    if(e===elt){return;}
	    remove = elt.filter(function(ee){return e.indexOf(ee)===-1;});
	    add    = e.filter(function(ee){return elt.indexOf(ee)===-1;});
            add.forEach(function(ee){
                if(d){
                    ee.style[__.dom.css.delay_prop]=__.dom.css.units.ms(d1);
                    d1+=d;
                }
                ee.classList.add(c);
            });
            remove.forEach(function(e){e.classList.remove(c);});
            elt=e;
        }
	cls_swapper.get=function(){return elt;};
	return cls_swapper;
    },
    setter  : function(e,cls){
	//syntacic sugar for classList methods
        return {
            add      : function(){e.classList.add(cls);},
            remove   : function(){e.classList.remove(cls);},
	    contains : function(){return e.classList.contains(cls);},
	    toggle   : function(){e.classList.toggle(cls);}
        };
    }
};
