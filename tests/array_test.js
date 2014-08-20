var should = require('chai').should();
var array  = require('../src/array');

describe('#array_test', function() {

  it('returns true if value passed in is an array', function() {
    array.is([1,2,3]).should.equal(true);
  });
  
  it('converts an array-like object into an array', function() {
    arguments = {first: 1, second: 2, third: 3};
    arguments.length = 3;
    array.is(array.from(arguments)).should.equal(true);
  });

  it('returns the first element of the array passed in (car)', function() {
    array.head([1,2,3]).should.equal(1);
  });

  it('returns all elements except the first (cdr)', function() {
    var cdr = array.tail([1,2,3,4]);
    cdr[0].should.equal(2);
    cdr[1].should.equal(3);
    cdr[2].should.equal(4);
  });
  
  it('returns the array with last element popped', function() {
    var arr = [1,2,3,4];
    var arr_len = arr.length;
    var popped_array = array.drop(arr);
    popped_array.length.should.equal(arr_len -1);
    array.is(popped_array).should.equal(true);
    popped_array.should.equal(arr); //test they are both the same reference
    popped_array[0].should.equal(1);
    popped_array[1].should.equal(2);
    popped_array[2].should.equal(3);
  });

  it('returns the unshifted array after unshift is called', function() {
    var arr = [1,2,3];
    var unshifted_array = array.unshift(arr, 4);
    unshifted_array.should.equal(arr); //test they are both the same reference
    unshifted_array[0].should.equal(4);
    unshifted_array[unshifted_array.length -1].should.equal(3);
  });
});
