var __ = {};
__.dom = {};
__.dom.svg = {
  ns: "http://www.w3.org/2000/svg",
  init: function() {
    ['text', 'path', 'circle', 'rect', 'use'].forEach(function(c) {
      this[c] = function() {
        return this.make(c, arguments);
      };
    }, this);
  },
  make: function(tag, args) {
    args = [].slice.call(args, 0);
    args.unshift(document.createElementNS(this.ns, tag));
    return __.dom.elt.fill.apply(0, args);
  },
  svg: function() {
    var ret = this.make("svg", arguments);
    ret.setAttribute("version", "1.1");
    return ret;
  }
};
__.dom.svg.init();
var a = (function(a) {
  return a * 2;
});
(function() {
  var $__1 = 0,
      $__2 = [];
  for (var $__3 = [1, 2, 3][Symbol.iterator](),
      $__4; !($__4 = $__3.next()).done; ) {
    var x = $__4.value;
    $__2[$__1++] = x;
  }
  return $__2;
}());
var Foo = function Foo(x) {
  "use strict";
  this.x = x;
};
($traceurRuntime.createClass)(Foo, {bar: function(foo) {
    "use strict";
    console.log(foo);
  }}, {});
var foo = new Foo();
var boo = 'world';
var greeting = ("hello " + boo);
console.log(greeting);
