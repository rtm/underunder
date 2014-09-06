// __.dom.xpath: XPath manipulation/convenience routines (wrap document.evaluate etc.)

__.dom.xpath={
    //create, evaluate and process results of XPath expressions
    ns_resolver : function(prefix){
	var ns={
	    xhtml: "http://www.w3.org/1999/xhtml"//TODO: add more namespaces
	};
	return ns[prefix];
    },
    evaluate    : function(xpathExpression,contextNode,namespaceResolver,resultType,result){
	contextNode=contextNode||document;
	namespaceResolver=namespaceResolver||this.ns_resolver;
	resultType=resultType||XPathResult.ANY_TYPE;
	result=result||null;
	return document.evaluate(xpathExpression,contextNode,namespaceResolver,resultType,result);
    },
    expression  : {
	//create (compile) and evalute XPath expressions
	create      : function(xpathText,namespaceResolver){
	    //precompile XPath expression; execute with evaluate
	    namespaceResolver=namespaceResolver||__.dom.xpath.ns_resolver;
	    return document.createExpression(xpathText,namespaceResolver);
	},
	evaluate    : function(xpathExpression,contextNode,resultType,result){
	    contextNode=contextNode||document;
	    resultType=resultType||XPathResult.ANY_TYPE;
	    result=result||null;
	    return xpathExpression.evaluate(contextNode,resultType,result);
	}
    },
    result      : {
	//manipulate XPathResult objects
	to_array    : function(result){
	    var r,ret=[];
	    while(r=result.iterateNext()){ret.push(r);}
	    return ret;
	}
    },
    util       : {
        has_class  : function(cls_name){
	    //create an XPath expression to detect if an elt has a particular class
	    //place this within [] after the element in question
	    //or, in XPath 2.0, [count(index-of(tokenize(@class, '\s+' ), '$classname')) = 1]
	    return "contains(concat(' ',normalize-space(@class),' '),concat(' ','"+cls_name+"',' '))";
	}
    }
};
