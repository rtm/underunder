var should = require('chai').should();
var functional = require('../org/functional');
var assert = require('chai').assert;

describe('#is Function', function() {
  
  it('returns true when passed a function', function() {
    functional.is(function lambda() { }).should.equal(true);
  });
  
  it('returns false when passed a non-function', function()  {
    functional.is(Object.create({foo: 'bar'})).should.equal(false);
    functional.is([]).should.equal(false);
    functional.is(3).should.equal(false);
    functional.is("function").should.equal(false);
  });
  
  it('returns true when passed a function object created by Object.defineProperty', function() {
    functional.is(Object.defineProperty(function () {}, "valueOf", { value: function() { return 3; } })).should.equal(true);
  });
});

describe("#function composition", function() {

  it('chains a series of functions when passed an array of functions', function() {
    var functionMaker = function(x) {
      return function(y) {
        return x*y;
      };
    };
    var fn_list = [1, 2, 3, 4, 5, 6, 7, 8].map(functionMaker);
    var eight_factorial = 40320;
    functional.compose(fn_list)(1).should.equal(eight_factorial);
  });
});

describe('#function return value negation', function() {

  it('returns the logical not of a function', function() {
    var truthy = function() { return true; };
    functional.invertize(truthy)().should.equal(false);
  });
  
  it('returns a function that returns false when the passed a function returning Nan', function() {
    var nan_fn = function() { return NaN; };
    functional.invertize(nan_fn)().should.equal(true);
  });
  
  it('returns a function that returns true when passed a function that returns nothing', function() {
    var undefined_fn = function() {};
    functional.invertize(undefined_fn)().should.equal(true);
  });
});

describe('#dethisize', function() {

  xit('returns a function that accepts "thisArg" as the first paramete', function() {
    var obj1 = {
      start_time: 10,
      end_time: 20,
      speed: function(distance) {
        return Math.floor((distance /(this.end_time - this.start_time)));
      }
    };
    var obj2 = { start_time: 50, end_time: 200 };
    console.log(functional.dethisize(obj1.speed)(obj2, 1000));
    return true;//stubbed out for now.
  });
});


describe('#returnize', function() {

  it("returns a function that always returns the same value as one that's passed in", function() {
    var obj = {
      name: "Angelina",
      changeName: function(newName) {
        this.name = newName;
      }
    };
    var transformedFn = functional.returnize(obj.changeName.bind(obj), -1);
    transformedFn('Jolie').should.equal(-1);
    obj.name.should.equal('Jolie');
  });
});

describe('#after', function() {
  it("invokes a function only after the function's been called n times", function() {
    var f = function checkIfDomUpdateNeeded() {
      //blah 
      return true;
    };
    var afterFn = functional.after(20, f);
    assert(afterFn() === undefined);
    for(var i = 1; i <= 19; i += 1) {
      afterFn(); 
    }
    assert(afterFn() === true);
  });
});

describe('#args utility methods tests', function() {
  
  it('swaps the order of arguments for a function with arity = 2', function() {
    var difference = function(a, b) { return (a - b); };
    difference(2, 3).should.equal(-1);
    var swappedArgsFn = functional.args.swap(difference);
    swappedArgsFn(2, 3).should.equal(1);
  });

  it('returns a function with to reverse the order of arguments', function() {
    var fn = function(a, b, c, d) { return (a + b) - (c + d); }; 
    fn(1, 2, 3, 4).should.equal(-4);
    var revFn = functional.args.reverse(fn);
    revFn(1, 2, 3, 4).should.equal(4);
  });
  
  xit('returns a function that only passes in the arguments between n1 and n2', function() {
    var fn = function(a, b, c, d) { return a + b + c + d; };
    fn(1, 2, 3, 4).should.equal(10);
    return true; //failing test. Why?
  });
  
  xit('returns a function that appends', function() {
    var fn = function(a, b, c, d) { return a + b + c + d; };
    functional.args.append(fn);
    return true; //failing test. Why?
  });
});

describe('#partial', function() {
  
  it('returns a new function with arguments bound', function() {
    var add = function(a, b) { return a + b; };
    var increment = functional.partial(add, 1);
    increment(1).should.equal(2);
  });
});

describe('memoize', function() {
  
  it('returns the memoized version of the function', function() {
    //hold a counter to see how many times this code gets executed.
    var counter = 0;
    var fibn = function(n) {
      var root_5 = Math.pow(5, 0.5);
      var phi = (1 + root_5)/2;       //careful double values in JS!!
      var minusPhi = (1 - root_5)/2;
      counter += 1;
      return (Math.pow(phi, n) - Math.pow(minusPhi, n))/root_5;
    };
    fibn(3).should.equal(2); //verify our fibn works
    assert(counter === 1); //unmemoized version has been called once.
    var memoFibn = functional.memoize(fibn); //memoized fibn function
    memoFibn(3).should.equal(2); //invoke the memozied function for the first time.
    assert(counter === 2); //code has executed twice.
    memoFibn(3).should.equal(2); //call memoized version again. Counter should not get incremented.
    assert(counter === 2);
    fibn(3).should.equal(2);
    assert(counter === 3);
  });
});

describe('#delayed', function() {
  
  //todo figure out how to run async tests.
  xit('runs a function  after a specified time delay', function() {
    var endTime = 0;
    var startTime = + new Date();
    var drawToCanvas = function() { console.log("called");
                                    endTime = + new Date();
                                    assert((endTime - startTime) === 300);
                                  };
    functional.delayed(drawToCanvas, 3000);
  });
});

describe('#maybe', function() {
  
  it("executes a passed in variable iff it's a function, else returns it", function() {
    var fn = function(a, b) { return a + b; };
    functional.maybe(fn, 2, 3).should.equal(5);
    functional.maybe(5).should.equal(5);
  });
});


describe('#argchecked', function() {
  
  it('creates a function that checks the number of arguments it gets passed', function() {
    var greaterThan = function(a, b) { return a > b; };
    var argchecked = functional.argchecked(greaterThan);
    argchecked(2, 3).should.equal(false);
    try {
      argchecked(3);
    }catch(e) {
      assert(e === "Expected 2 arguments, got 1"); 
    }
  });
  
});

describe('#overloaded', function() {
  
  it('calls the right function depending on the number of arguments passed in', function() {
    
    var increment = function(a) { return a + 1; };
    var incrementBy = function(a, inc) { return a + inc; };
    var sum = function(a, b, c) { return a + b + c; };
    var overloaded = functional.overloaded([increment, incrementBy, sum]);
    assert(overloaded(1) === 2);
    assert(overloaded(1, 2) === 3);
    assert(overloaded(1, 2, 3) === 6);
    overloaded.add(function average(a, b, c, d) { return (a + b + c + d) /4; });
    assert(overloaded(1, 2, 3, 4) === 2.5);
  });
});

describe('#parse_args', function() {
  
  it('returns the parsed arguments passed to a function', function() {
   function foo(a, b, c) {
      return a > b ? c : a;
      };
    var args = functional.parse_args(foo);
    assert(args.length === 3);
    assert(args[0] === 'a');
    assert(args[1] === 'b');
    assert(args[2] === 'c');
  });
});
