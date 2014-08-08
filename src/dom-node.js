__.dom.node=(function(){
    function parent(n){
	var p=n.parentNode;
	if(!p){throw "No parent";}
	return p;
    }

    return {
	name_eq     : function(node, name) {
	    return name==='*' || node.tagName===(node.namespaceURI===__.dom.html.ns ? name.toLowerCase() : name);
	},
	next       : function(n,root,omit_children) {
	    //preorder depth-first traversal
	    function next_uncle(){
		var uncle;
		while(n=n.parentNode&&n!==root&&!(uncle=n.nextSibling)){}
		return uncle;
	    }
	    return n && ((!omit_children&&n.firstChild) || n.nextSibling || next_uncle());
	},
	parent     : parent,
	next2      : function(node) {
	    //preorder depth-traversal, returning [node,revisit], where revisit is true on parent after child
	    //usage is while(node=next2(node)){}
	    var n=node[0],visit_children=node[1],s,ret=null;
	    if(n){
		if(visit_children){
		    s=n.firstChild;
		    if(s){
			ret=[s,true];
		    }else{
			ret=[n,false];
		    }
		}else{
		    s=n.nextSibling;
		    if(s){
			ret=[s,true];
		    }else{
			s=n.parentNode;
			if(s){
			    ret=[s,false];
			}else{
			    ret=null;
			}
		    }
		}
	    }
	    return ret;
	},
	prev       : function(n,root){
	    if(!n || n===root){return null;}
	    while(n && !n.previousSibling){n=n.parentNode;}
	    n = n && n.previousSibling;
	    while(n && n.lastChild){n=n.lastChild;}
	    return n;
	}
    };
}());

