var should = require('chai').should();
var array  = require('../src/array');

describe('#array_test', function() {

    it('returns true if value passed in is an array', function() {
       array.is([1,2,3]).should.equal(true);
    });
    
    it('converts an array-like object into an array', function() {
        arguments = [1,2,3];
       array.is(array.from(arguments)).should.equal(true);
    });

    it('returns the first element of the array passed in', function() {
        console.log("Here.");
        array.head([1,2,3]).should.equal(1);
    });
    
});
