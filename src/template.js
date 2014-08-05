/* jshint evil: false */

__.template={
    //poor man's string interpolation
    settings   : {
        evaluate    : /<%\s*([\s\S]+?)\s*%>/g,
        interpolate : /<%=\s*([\s\S]+?)\s*%>/g,
        escape      : /<%\-\s*([\s\S]+?)\s*%>/g
    },
    compile    : function(str,settings){
        //return a function to apply this template; not really compiling!
        var interpolate = (settings&&settings.interpolate)|| this.settings.interpolate,
        evaluate    = (settings&&settings.evaluate)   || this.settings.evaluate
        ;
        return function(o){
            return str
                .replace(interpolate,function(m,v){return __.string.escape(o[v]);})
                .replace(evaluate,   function(m,v){return eval(v);})
            ;
        };
    },
    exec       : function(str,o,settings){
        //run the template immediately without pre-compiling
        return this.compile(str,settings)(o);
    }
};
