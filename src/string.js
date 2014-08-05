/* jshint bitwise: false */

__.string={
    type          : "String",
    is            : function(x){
		return x===x+"";
//        return Object.prototype.toString.call(x) === "[object String]";
    },
    toCharCode    : function(str){
        return __.array.range(str.length).map(String.prototype.charCodeAt,str);
    },
    starts_with   : function(start){
        //make a function to test if the argument starts with a particular string
        //This is marginally faster than str.substring(0,6)===start when there is NO match
        var reg=new RegExp("^"+__.re.esc(start));
        return function(str){return str.match(reg);};
    },
    ends_with     : function(start){
        var reg=new RegExp(__.re.esc(start)+"$");
        return function(str){return str.match(reg);};
    },
    contains      : function(s,sub){
        return !!~('' + s).indexOf(sub);
    },
    range         : function(start,end){
        return String.fromCharCode.apply(0,__.array.range(String(start).charCodeAt(0),String(end).charCodeAt(0)));
    },
	substring     : {
		//return substrings before and after a specified character, a la XSLT
		after         : function(s,c){
			var pos=s.indexOf(c);
			return pos===-1 ? s : s.substr(pos+1);
		},
		after_last    : function(s,c){
			var pos=s.lastIndexOf(c);
			return pos===-1 ? s : s.substr(pos+1);
		},
		before        : function(s,c){
			var pos=s.indexOf(c);
			return pos===-1 ? s : s.substr(0,pos);
		},
		before_last   : function(s,c){
			var pos=s.lastIndexOf(c);
			return pos===-1 ? s : s.substr(0,pos);
		},
		count         : function(string,subString,allowOverlapping){
			//see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
			//note: does NOT handle regexps
			if(!string){return 0;}
			var n=0, pos=0, step=allowOverlapping?1:subString.length;
			string+=""; subString+="";
			if(!subString.length) return string.length+1;
			
			while(true){
				pos=string.indexOf(subString,pos);
				if(pos>=0){ n++; pos+=step; } else {break;}
			}
			return(n);
		}
	},
    camel         : {
        //conversion to and from canmelcase
        to        : function(s){return s.replace(/-(\S)/g, function(w,p){return p.toUpperCase();});},
        from      : function(s){return s.replace(/[A-Z]/g, function(w)  {return "-"+w.toLowerCase();});}
    },
	count          : function(s,re){
		if(!(re instanceof RegExp)){re=RegExp(re,"g");}
		return !s ? 0 : ((s+"").match(re)||[]).length;
	},
    repeat        : function(s,n){
        return new Array(n+1).join(s);
    },
	repeat2       : function(pattern, count) {
		var result = '';
		while (count > 0) {
			if (count & 1) result += pattern;
			count >>= 1, pattern += pattern;
		}
		return result;
	},
    smart_quotes  : function(a) {
        // Change straight quotes to curly
        a = a
            .replace(/(^|[\-—\s\(\["])'/g, "$1‘")     // opening singles
            .replace(/'/g, "’")                       // closing singles
            .replace(/(^|[\-—\/\[\(‘\s])"/g, "$1“")   // opening doubles
            .replace(/"/g, "”")                       // closing doubles
        ;
        return a;
    },
    escape        : function(s){
        return (""+s)
			.replace("&","&amp;")
			.replace("<","&lt;")
			.replace(">","&gt;")
			.replace("\"","&quot;")
			.replace("'","&apos;")
		;
    },
    unescape      : function(s){
        return (""+s)
			.replace("&amp;","&")
			.replace("&lt;","<")
			.replace("&gt;",">")
			.replace("&quot;","\"")
			.replace("&apos;","'")
		;
    }
};
