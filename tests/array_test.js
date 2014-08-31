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
  
  it('returns the array formed after an element is pushed', function() {
    var arr = [1, 2, 3, 4];
    var new_array = array.push(arr, 5);
    new_array.length.should.equal(5);
    new_array[new_array.length -1].should.equal(5);
    });
  
  it('returns the new array with specified value omitted', function() {
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var result = array.omit(arr, 2);
    array.contains(result, 2).should.equal(0);
  });

  it('overlays the elements of second array on to the first array starting from specified index', function() {
    var arr1 = [1,2,3,4,5];
    var arr2 = [10, 20, 30, 40, 50];
    var result = array.overlay(arr1, arr2, 3);
    var expectedResults = [1, 2, 3, 10, 20, 30, 40, 50];
    for(var i = 0, j = expectedResults.length; i < j; i++) {
      result[i].should.equal(expectedResults[i]);
    }
  });
  
  xit('fills in missing elements into array1, with elements in array2', function() {
    var arr1 = [1, 2, 3, 4, 5];
    var arr2 = [10, 20, 30, 40, 50];
    var result = array.overlay(arr1, arr2, 3);
    var expectedResults = [1, 2, 3, 10, 20, 30, 40, 50];
    var res = array.defaults(arr1, arr2);
    console.log(res);
    return true;
  });

  it('transforms an array with duplicates into a set', function() {
    var arr1 = [1, 2, 3, 4, 5, 6, 7, 3, 5, 6];
    var res = array.unique(arr1);
    res.length.should.equal(7);
  });
  
  it('creates a range from a to b', function() {
    var range = array.range(10,100);
    for(var i = 10, j = 0; i < 100, j < range.length; i++, j++) {
      range[j].should.equal(i);
    }
  });
  
  it('returns the index of the first element in the array that satisfies some conditions', function() {
    var arr = [1, 2, 3, 4, 5, 15];
    array.find_index(arr, function cond(x) { return x%15 === 0; }).should.equal(5); 
    });
  
  it('returns the value in the array that satisfies the condition specified', function() {
    var arr = [1, 2, 3, 4, 5, 6];
    array.find_value(arr, function(x) { return x%6 ===0; }).should.equal(6);
    });

  it('counts the elements in the collection that satisfy the condition', function() {
    var arr = array.range(1, 100);
    array.count(arr, function is_even(x) { return x%2 === 0; }).should.equal(49);
  });
  
  xit('creats n instances of the passed in array', function() {
    var arr = array.range(10);
    console.log(array.repeat(arr, 5));
    return true;
  });

 it('coerces the passed in scalar into an array', function() {
   var s = 5;
   var arr = array.coerce(s);
   array.is(arr).should.equal(true);
 });
});
