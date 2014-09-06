// __ regular expression utilities

__.re={
    //convenience functions for building regexps's
    type    : "RegExp",
    is      : function(x){
	return x===RegExp(x);//bobtyping
	//        return Object.prototype.toString.call(x) === "[object RegExp]"; // much slower?
	//        return x instanceof RegExp; //could be faster?
    },
    equal   : function(a,b){
	return a.source   === b.source    &&
	    a.global      === b.global    &&
	    a.multiline   === b.multiline &&
	    a.ignoreCase  === b.ignoreCase;
    },
    clone   : function(re){
	return RegExp(re.source,(re.global?'g':'')+(re.ignoreCase?'i':'')+(re.multiline?'m':''));
    },
    args    : function(args,c){return Array.prototype.concat.apply([],args).join(c||"");},
    esc     : function(s)     {return s.replace(/[-\\^$*+?.[\](){}|]/g,function(s){return "\\"+s;});},
    //character class
    chr     : function()      {return "[" +this.esc(this.args(arguments))+"]";},
    not_chr : function()      {return "[^"+this.esc(this.args(arguments))+"]";},
    //grouping
    grp     : function(e)     {return "(?:" + e + ")";},
    cap     : function(e)     {return "("   + e + ")";},
    pla     : function(e)     {return "(?:" + e + ")";},
    nla     : function(e)     {return "(?!" + e + ")";},
    alt     : function(/*e*/) {return this.grp(this.args(arguments,"|"));},
    //replication
    mul     : function(e)     {return this.seq(e)+"*";},
    opt     : function(e)     {return this.seq(e)+"?";},
    seq     : function(/*e*/) {return this.grp(this.args(arguments));},
    rep     : function(e,i,j) {return e+"{"+i+","+j+"}";},
    oom     : function(e)     {return e+"+";}, /* "one or more */
    beg     : function(e)     {return this.grp("^"+e);},
    end     : function(e)     {return this.grp(e+"$");},

    //miscellanous
    quo     : function(q,e)   {return q+e+q;},

    //utility functions
    unquote       : function(s){
	var double_quotes = this.chr(__.unicode.classes.double_quotes);
	return s.replace(RegExp(this.alt(this.beg(double_quotes),this.end(double_quotes)),"g"),"");
    }
};
