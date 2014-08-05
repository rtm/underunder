/* Bob's promises implementation. (C) Bob Myers */

/*global console, MutationObserver */

__._Promise=__.Promise=__.class.new()
//normal, non-instrumented version of promises
	.ctor(function(ctxt){
		this.thens     = [];
		this.resolved  = false;
		this.fulfilled = false;
		this.ctxt      = ctxt;
		this.ands      = 0;
		this.value     = null;
		Object.preventExtensions(this);
	})
	.proto({
		then       : function(onFulfilled,onRejected,onProgress){
			var p=__.Promise.new(this.ctxt);
			this.thens.push({promise:p, onFulfilled:onFulfilled, onRejected:onRejected, onProgress:onProgress});
			if(this.resolved){this._go();}
			return p;
		},

		always     : function(onFulfilledOrRejected) {return this.then(onFulfilledOrRejected,onFulfilledOrRejected);},
		ensure     : function(onFulfilledOrRejected) {return this.then(onFulfilledOrRejected,onFulfilledOrRejected);},
		finally    : function(onFulfilledOrRejected) {return this.then(onFulfilledOrRejected,onFulfilledOrRejected);},

		otherwise  : function(onRejected) {return this.then(null,onRejected);},
		onprogress : function(onProgress) {return this.then(null,null,onProgress);},
		context    : function(ctxt)       {return this.ctxt=ctxt, this;},
		name       : function()           {return this;},
		yield      : function(v)          {return this.then(function(){return v;});},

		fulfill    : function(v)          {return this.resolve(true,v);},
		reject     : function(v)          {return this.resolve(false,v);},
		wait       : function(ms,v)       {return this.then(function(v1){return __.Promise.fulfilled(v,ms||v1);});},
		timeout    : function(ms,v)       {return this.then(function(v1){return __.Promise.rejected(v,ms||v1);});},
		listen     : function(elt,evt)    {return this.then(function(){return __.Promise.listen(elt,evt);});},
		watch      : function(o,p)        {return this.then(__.Promise.watch.bind(0,o,p));},
		catch      : function()           {return this.then(null,this.static.CATCHER);},
		log        : function()           {return this;},
		cancel     : function()           {this.thens.length=0; return this;},
		get        : function(p)          {this.then(function(v){return v[p];});},
        put        : function(p,val)      {this.then(function(v){v[p]=val;});},
		delete     : function(p)          {this.then(function(v){delete v[p];})},
		self       : function()           {var _this=this; this.then(function(){return _this;}); return this;},

		matches    : function(v,fn,desc)  {
			return __.Promise
				.every([v,this])
				.then(function(vals){
					if(fn.apply(0,vals)){return val[0];}
					else throw desc;
				})
			;
		},
		equals     : function(v)          {return this.matches(v,function(a,b){return a===b;},"not equal to");},
		
		mutate	   : function(target,options,timeout){
			//return a promise for one mutation on a specified target
			var p=__.Promise.new(), observer=new MutationObserver(p.fulfill.bind(p));
			if(timeout){p.timeout(timeout);}
			observer.observe(target,options);
			return p.finally(function(){observer.disconnect();});
		},

		or         : function(p)          {return p.then(this.fulfill.bind(this),this.reject.bind(this)), this;},
		and        : function(p){
			//add another promise which must be fulfilled for this one to be
			//can be used to wait for longer of two tasks, as in p.then(task1).and(task2).then...
			//note 1: value of promise is that of last fulfilled requisite
			//note 2: ands added to resolved promise have no effect
			//not well tested
			this.ands++;
			p.then(this.fulfill.bind(this),this.reject.bind(this));
			return this;
		},
		progress  : function(v,data){
			//report a progress update. Pass along to promises on the chain
			//the progress handler can change the value passed along, or it can throw to stop propagation
			//a second "data" argument is passed as is down the chain
			//progress handler is called with (value,promise,data), synchronously
			//not well tested
			if(this.resolved){return;}
			this.thens.forEach(function do_then(then){
				//handle one then, calling progressHandler if present, passing along update
				var threw=false, vv=v;
				if(typeof then.onProgress==="function"){
					try{ vv = then.onProgress (v, then.promise, data); }
					catch(e){threw=true;}
				}
				if(!threw){then.promise.progress(vv, data);}
			});
			return this;
		},
		apply      : function(f1,f2,f3){
			//assuming promise value is an array, feed elements to fn as arguments, apply-like
			//allows user to continue chaining
			this.then(
				f1 && f1.apply.bind(this.ctxt),
				f2 && f2.apply.bind(this.ctxt),
				f3 && f3.apply.bind(this.ctxt)
			);
			return this;
		},
		call       : function(f1,f2,f3){
			//feed value to function(s); do not disrupt chain
			//allows user to continue chaining
			this.then(
				f1 && f1.call.bind(this.ctxt),
				f2 && f2.call.bind(this.ctxt),
				f3 && f3.call.bind(this.ctxt)
			);
			return this;
		},
		resolve   : function(fulfilled,value){
			if(!this.resolved){
				if(this.ands){
					this.ands--;
				}else{
					this.resolved=true;
					this.fulfilled=fulfilled;
					this.value=value;
					this._go();
				}
				//Object.freeze(this);
			}
			return this;
		},
		_go   : function(){
			var t,callback,prom,n=0;
			while(t=this.thens.shift()){
				prom=t.promise;
				prom.fulfilled=this.fulfilled;
				prom.value=this.value;
				callback=prom.fulfilled?t.onFulfilled:t.onRejected;
				if(callback===this.static.CATCHER){throw this.value;}
				if(typeof callback==="function"){
					callback=callback.bind(prom.ctxt);
					this._callback(prom,callback,this.value,n++);
				}else{
					prom.resolve(this.fulfilled,this.value);
				}
			}
		},
		_callback   : function(promise,callback,value,n){
			setTimeout(function(){
				try      { 
					var new_value=callback(value);
					if (__.Promise.is(new_value)){
						promise.resolved=new_value.resolved;
						promise.fulfilled=new_value.fulfilled;
						promise.value=new_value.value;
						new_value.then(
							function(v){promise.fulfill(v);},
							function(v){promise.reject(v);}
						);
					}else{
						promise.fulfill(new_value);
					}
				}
				catch(e) { promise.reject(e); }
			},n);
		}
	})
	.static({
		is        : function(p){
			return p&&typeof p.then==="function";
		},
		when      : function(w){
			return this.is(w) ? w : typeof w==="function" ? this.fulfilled().then(w) : this.fulfilled(w);
		},
		context   : function(ctxt){
			//return unresolved promise with this-context
			return __.Promise.new().context(ctxt);
		},
		fulfilled : function(v,ms){
			//create pre-fulfilled promise, optionally after delay
			var p=__.Promise.new(),resolve=p.fulfill.bind(p,v);
			if(ms){__.timer.q(resolve,ms);}
			else{resolve();}
			return p;
		},
		wait      : function(ms){
			return this.fulfilled(0,ms);
		},
		rejected  : function(v,ms){
			//create promise which will reject with value (reason) v after specified delay
			var p=__.Promise.new(),reject=p.reject.bind(p,v);
			if(ms){	__.timer.q(reject,ms);}
			else{reject();}
			return p;
		},
		timeout   : function(ms){
			return this.rejected(0,ms);
		},
		listen    : function(elt,evt_type,timeout){
			//create a promise which is fulfilled (with value of event object) when an event occurs
			//event will continue to bubble, and default action executed
			var p=__.Promise.new(), listener=p.fulfill.bind(p);
			if(timeout){p.timeout(timeout);}
			elt.addEventListener(evt_type,listener);
			return p.finally(function(){elt.removeEventListener(evt_type,listener);});
		},
		watch     : function(o){
			//create a promise which is fulfilled (with new prop value) when a watched property changs
			var p=__.Promise.new();
			function watcher(o,p,old,v){
				__.object.watch.remove(o,p,watcher);
				p.fulfill(v);
			}
			__.object.watch.add(o,p,watcher);
			return p;
		},
		every     : function(a){
			//create a promise which is fulfilled when all the promises in an array are
			//and yields as its value of an array of the indivdual values, in order
			//promise is rejected on first rejection, with that rejection's reason as its reason
			var len=a.length,p=__.Promise.new(),res=[];
			a.forEach(function(pp,i){
				__.Promise.when(pp).then(
					function(v) {res[i]=v; if(!--len){p.fulfill(res);}},
					function(v) {p.reject(v);}
				);
			});
			return p;
		},
		some      : function(a){
			//create a promise which is fulfilled when any one of the promises in an array are
			//and yields the value of the first promise to be fulfilled
			var len=a.length,fails=0,p=__.Promise.new();
			a.forEach(function(pp){
				pp.then(
					function(v) {p.fulfill(v);},
					function( ) {if(++fails===len){p.reject();}}
				);
			});
			return p;
		},
		xhr       : function(r){
			//get a promise representing an XMLHttpRequest
			//call this *before* the call to open; you are responsible for doing the send yourself
			var p=__.Promise.new();
			r.addEventListener("load",  p.fulfill.bind(p), false);
			r.addEventListener("error", p.reject .bind(p), false);
			r.addEventListener("abort", p.reject .bind(p), false);
			return p;
		},
		seq       : function(fns){
			//take an array of fns, or [success,failure] fns, and chain them via 'then'
			return fns.reduce(
				function(prev,fn){
					var f01=__.array.coerce(fn);
					return prev.then(f01[0],f01[1]);
				},
				__.Promise.fulfilled()
			);
		},
		par       : function(fns){
			//take an array of fns, and execute proimses on all in parallel
			return __.Promise.every(fns.map(function(fn){return __.Promise.when(fn);}));
		},
		poll      : function(fn,interval,max){
			//poll at specified interval for fn to return a truthy value, up to max times
			var 
			p=__.Promise.new(),
			resolve=function(b,v){
				p.resolve(b,v);
				clearInterval(timer);
			},
			timer=setInterval(
				function(){
					var v=fn();
					if(v){resolve(true,v);}
					else if(max--<=0){resolve(false);}
				},
				interval
			)
			;
			return p;
		},
		CATCHER    : {}
	})
;
