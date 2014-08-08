/* jshint bitwise: false */

__.array={
    is            : function(a){
        return Array.isArray(a);
    },
    from          : function(){
	//ES6 Array.from equivalent
	return this.to.call(this,arguments);
    },
    to            : function(a,n){
	//ES6 Array.from equivalent
	return Array.prototype.slice.call(a,n||0);
    },
    head          : function(a){
        return a&&a[0];
    },
    tail          : function(a){
        //return all but first element; useful on arguments
        return a&&[].slice.call(a,1);
    },
    drop          : function(a){
	//pop, returning array
	a.length--;
	return a;
    },
    unshift       : function(a){
        //version of unshift which returns array, not new length
        [].unshift.apply(a,this.to(arguments,1));
        return a;
    },
    push          : function(a){
        //version of push which returns array, not new length
        [].push.apply(a,this.to(arguments,1));
        return a;
    },
    omit          : function(a,v){
	//omit particular values
	return a.filter(function(vv){return v!==vv;});
    },
    overlay       : function(a1,a2,start){
	//overlay the elements on a2 onto a1 (returning new array)
	start=start||0;
	return a1.slice(0,start).concat(a2).concat(a1.slice(start+a2.length));
    },
    defaults      : function(a1,a2){
	//fill in "missing" elts in a1 with a2
	return a1.concat(a2.slice(a1.length));
    },
    unique        : function(a){
        return a.filter(function(e,p){return a.indexOf(e)===p;});
    },
    pluck         : function(a,p){
	//from array of objects, create array of values for key named "p"
	//shouldn't this be in __.object?
        return a.map(function(v){return v[p];});
    },
    range         : function(n,n1){
        //create an integer range from 0..n, or n..n1
        var arr,ret;
        if(!n1){n1=n;n=0;}
        arr=Array.apply(0,Array(Math.abs(n1-n)));
        ret=arr.map(function(v,i){return n<=n1 ? i+n : n-i;});
        return ret;
    },
    forEach2      : function(a,fn,ctxt){
        //iterate over an array twice in nested fashion
        a.forEach(function(i,ii,a){
            a.forEach(function(j,jj,a){
                fn.call(ctxt,i,j,ii,jj,a);
            });
        });
    },
    find_index    : function(a,fn,ctxt){
        //return the index of the first element in an array that satisfies some conditions
	//in ECMAScript 6, Array.prototype.findIndex
        var result=-1;
        a.some(function(v,i,a){
            if(fn.call(ctxt,v,i,a)){
                result=i;
                return true;
            }
        });
        return result;
    },
    find_value    : function(a,fn,ctxt){
	//return a value if found in the array, otherwise undefined
	//in ECMAScript 6, Array.prototype.find
        return a[this.find_index(a,fn,ctxt)];
    },
    count         : function(a,fn){
	//count the number of times a function returns true
	//function is called with (value,index,array)
	return a.reduce(function(prev,cur,i,a){return prev+!!fn(cur,i,a);},0);
    },
    repeat        : function(i,n){
        //"static" function to create an array of n instances of i
        return this.range(n).map(__.fn.fixed(i));
    },
    map           : function(a,fn,ctxt){
	//non-member version of map for composition etc.
	return a.map(fn,ctxt);
    },
    map_to_object : function(a,fn,ctxt){
        //create an object whose properties are the values in the array, their value the result of a fn call
	return a.reduce(
	    function(prev,cur,i,a){
		return prev[cur]=fn.call(ctxt,cur,i,a), prev;
	    },
	    {}
	);
        //			return __.object.from_keys_values(a,a.map(fn,ctxt)); //hopefull, above is faster?
    },
    contains      : function(a,v){
        return ~a.indexOf(v);
    },
    does_not_contain : function(a,v){
        return !~a.indexOf(v);
    },
    coerce        : function(x){
        //make scalar into array, leave array alone
        return [].concat(x);
    }
};
