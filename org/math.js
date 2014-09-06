"use strict";

__.math={
    sgn     : function(x){
        return x<0?-1:x>0?+1:0;
    },
    sum     : function(){
        //sum the values of the arguments, which may also be arrays
        return [].concat.apply([],arguments)
            .reduce(function(memo,num){return memo+num;});
    },
    rand    : function(min,max){
        //return random number between 0 and 1, or 0 and argument, or first and second arguments
        if(arguments.length===0){min=0;max=1;}
        else if(arguments.length===1){max=min;min=0;}
        return min + Math.floor(Math.random()*(max-min));
    }
};
