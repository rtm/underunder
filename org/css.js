// __ routines for manipulating CSS and properties

__.dom.css=(function(){
    function check_property_value(p,v){
        //check a CSS property value by setting it on dummy element, seeing if it sticks
        //specify camel-case variant of property name
        //I think Modernizr has the same API
        var d;
	
        //setting font-size to 'normal' makes it a null string
        if(p==="fontSize"&&v==="normal"){return true;}
	
        d=document.createElement("div");
        d.style[p]=v;
        return d.style[p]===v;
    }
    function wrap(prefix,exp){return prefix+"("+exp+")";}
    var unit_names=[
	"em","ex","ch","rem",           //font-relative
	"vw","vh","vmin","vmax",        //viewport-relative
	"cm","mm","in","pt","pc","px",  //absolute
	"s","ms",                       //time
	"deg", "grad", "rad", "turn"    //angles
    ],
    prefixed
    ;

    ["", "-webkit-", "-moz-", "-o-", "-ms-", ""].some(function(p){
	//Modernizr does not appear to be able to find out which vendor prefix for calc is required
	//take a calc expression and wrap it in the correct vendor-prefixed version of "calc", or use a fallback value
        var
        _prefixed=p+"calc",
        works=check_property_value('height',wrap(_prefixed,"1px"))
        ;
        if(works){prefixed=_prefixed;}
        return works;
    });
    
    return {	
	units : __.object.merge(
	    __.array.map_to_object(unit_names,function(n){return function(v){return v+(v?n:"");};}),
	    {
		pct   : function(p){
		    return (p*100).toFixed(3)+"%";
                    //					return (Math.round(p*100000)/1000)+"%";
		}
	    }
	),
	delay_prop  : Modernizr.prefixed('transitionDelay'),
	check_property_value : check_property_value,
	calc        : function(exp,fallback){
	    return prefixed?wrap(prefixed,exp):fallback;
	},

	url : function(url){
	    return "url("+encodeURI(url)+")";
	},

	transform   : __.class.new()
	//syntactic sugar for CSS transform property
	//example: __.dom.css.transform.new().translate(em(1),em(2)).value()
	    .ctor(function(){
		this.v=[];
	    })
	    .proto(__.object.update(
		__.array.map_to_object(
		    [
			'translate','translateX','translateY',
			'scale','scaleX','scaleY','scale3d','scaleZ',
			'rotate','rotateX','rotateY','rotateZ','rotate3d',
			'perspective','matrix','matrix3d',
			'skewX','skewY'
		    ],
		    function(k){
			return function(){
			    this.v.push(k + "(" +  [].slice.call(arguments).reduce(__.flatten,[]).join(",") + ")");
			};
		    }
		),
		{
		    value: function(){return this.v.join(" ");}
		}
	    ))
	
    };
}());
