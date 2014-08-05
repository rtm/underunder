module Boo {
	export var foo = 1;
}


// __ routines for manipulating SVG DOM

var __ = {};
__.dom = {};
__.dom.svg={
    ns      : "http://www.w3.org/2000/svg",
    init    : function(){
        ['text','path','circle','rect','use'].forEach(
            function(c){
                this[c]=function(){return this.make(c,arguments);};
            },
            this
        );
    },
    make    : function(tag,args){
        args=[].slice.call(args,0);
        args.unshift(document.createElementNS(this.ns,tag));
        return __.dom.elt.fill.apply(0,args);
    },
    svg     : function(){
        var ret=this.make("svg",arguments);
        ret.setAttribute("version","1.1");
        return ret;
    }
};
__.dom.svg.init();

var a = a => a*2;
[for (x of [1,2,3]) x];

class Foo {
	constructor(x) { this.x = x; }
    bar(foo) { console.log(foo); }
}
var foo = new Foo();

var boo = 'world';
var greeting = `hello ${boo}`;
console.log(greeting);
