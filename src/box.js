// __ library implementation of boxes, (C) Bob Myers

/*jslint white: true, indent: 4, nomen: true, plusplus: true */
/*global __ */

__.box=__.class.new()
    .ctor(function(o){
	o=o||{};
	this.l=o.l;
	this.r=o.r;
	this.t=o.t;
	this.b=o.b;
    })
    .proto({
	expand      : function(n,slop){
	    if(typeof slop==="undefined"){slop=2;}
	    this.t -= slop;
            this.b += slop;
            this.l -= slop;
            this.r += slop;
	    
            if(this.t < 3  ) {this.t=0;  }
            if(this.l < 3  ) {this.l=0;  }
            if(this.b > n-4) {this.b=n-1;}
            if(this.r > n-4) {this.r=n-1;}
	    
            return this;
        },
        contains    : function(xy){
            //does an xy point fall within the box?
            return +xy.x>=this.l&&+xy.x<=this.r&&+xy.y>=this.t&&+xy.y<=this.b;
        },
        bound       : function(n){
            //fix coordinates to lie within 0-n range
            this.l = !this.l ? 0   : Math.min(Math.max(this.l,0),n-1);
            this.r = !this.r ? n-1 : Math.min(Math.max(this.r,0),n-1);
            this.t = !this.t ? 0   : Math.min(Math.max(this.t,0),n-1);
            this.b = !this.b ? n-1 : Math.min(Math.max(this.b,0),n-1);
            return this;
        },
        max         : function(b2){
            //expand box to contain a second box
            this.l = !this.l ? b2.l : !b2.l ? this.l : Math.min(this.l,b2.l);
            this.r = !this.r ? b2.r : !b2.r ? this.r : Math.max(this.r,b2.r);
            this.t = !this.t ? b2.t : !b2.t ? this.t : Math.min(this.t,b2.t);
            this.b = !this.b ? b2.b : !b2.b ? this.b : Math.max(this.b,b2.b);
            return this;
        }
    })
    .static({
	max       : function(boxes){
	    //return bounding box for an array of boxes
	    function fun(p,f){return f.apply(0,__.array.pluck(boxes,p));}
	    return {
		t:fun('t',Math.min),
		b:fun('b',Math.max),
		l:fun('l',Math.min),
		r:fun('r',Math.max)
	    };
	},
	full      : function(n){
	    //return an nxn box
	    return this.new({t:0,l:0,b:n-1,r:n-1});
	}
    })
;
