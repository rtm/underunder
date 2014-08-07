"use strict";

__.array.set={
    union         : function(){
        return this.__.array.unique([].concat.apply([],arguments));
    },
    intersection  : function(a1,a2){
	//intersection of two arrays: elements held in common
	//to take intersection of multiple arrays, do [arrays].reduce(__.array.intersection)
        return a1.filter(__.array.contains.bind(0,a2));
    },
    difference    : function(a1,a2){
        return a1.filter(__.array.does_not_contain.bind(0,a2));
    }
};

//__.array.set.∪=__.array.set.union;
//__.array.set.∩=__.array.set.intersection;
