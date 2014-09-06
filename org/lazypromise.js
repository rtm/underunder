__.LazyPromise=__.Promise.derive()
//create a promise with some async logic executed only when then is called on it
//untested/unused
    .ctor(function(factory){
	this._factory=factory;
	this._started=false;
    })
    .proto({
	then: function(){
	    if (!this._started) {
		this._started = true;
		var self = this;
		
		this._factory(function(error, result) {
		    if (error) self.reject(error);
		    else self.fulfill(result);
		});
	    }
	    return this.superclass(__.Promise).then.apply(this, arguments);
	}
    })
;
