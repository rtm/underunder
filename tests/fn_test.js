var should = require('chai').should();
var fn  = require('../src/fn');

describe('#fn_test', function() {

	describe('#is', function(){
		it('is true when passed a function', function(){
			(fn.is(function(){})).should.be.true;
		});
		it('is false when passed a non-function', function(){
			(fn.is(1)).should.be.false;
		});
	});

    describe('#identity', function(){
        it('returns passed value', function(){
			(fn.identity(1)).should.equal(1);
        });
	});

    describe('#fixed', function(){
        it('returns a function returning passed value', function(){
			(fn.fixed(1)()).should.equal(1);
        });
    });

    describe('#not', function(){
        it('inverts argument', function(){
			(fn.not(true)).should.equal(false);
			(fn.not(false)).should.equal(true);
        });
    });

    describe('#invert', function(){
        it('returns a function inverting passed function\'s result', function(){
			(fn.invert(fn.fixed(true))()).should.equal(false);
		});
    });
	
    describe('#falsy', function(){
        it('returns true if passed value is false', function(){
			(fn.falsy(false)).should.equal(true);
		});
    });
	
    describe('#truthy', function(){
        it('returns true if passed value is truthy', function(){
			(fn.truthy(true)).should.equal(true);
			(fn.truthy(1)).should.equal(true);
			(fn.truthy('a')).should.equal(true);
		});
        it('returns false if passed value is not truthy', function(){
			(fn.truthy(false)).should.equal(false);
			(fn.truthy('')).should.equal(false);
			(fn.truthy(0)).should.equal(false);
			(fn.truthy(null)).should.equal(false);
		});
    });
	
    describe('#maybe', function(){
        it('returns non-function value as is', function(){
			(fn.maybe(1)).should.equal(1);
		});
        it('returns function value if passed function', function(){
			(fn.maybe(fn.fixed(1))).should.equal(1);
		});
	});

});
