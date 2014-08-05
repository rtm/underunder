__.PromiseInstrumented=__._Promise.derive()
//instrumented version of promises, created if __.Promise.DEBUG==true
//keeps track of all promises; allows querying of unresolved promises
//__.PromiseIinstrumented.auto_log will cause all resolutions to be logged
	.ctor(
		function(ctxt){
			this.id=this.static.id_factory.id;
			this._name=null;
			this.static.add_id(this.id,this);
			this.super(__._Promise,ctxt);
			if(this.static.auto_log){this.log();}
		})
	.proto({
		name    : function(name){return this._name=name, this;},
		resolve : function(){
			this.static.add_resolved(this.id);
			this.superclass(__._Promise).resolve.apply(this,arguments);
		},
		then_uninstrumented : function(onFulfilled,onRejected,onProgress){
			var p=__._Promise.new(this.ctxt);
			this.thens.push({promise:p, onFulfilled:onFulfilled, onRejected:onRejected, onProgress:onProgress});
			if(this.resolved){this._go();}
			return p;
		},
		log        : function(msg){
			var promise=this,id=this.id;
			//log the status of a promise
			function m(t){
				return function(v){
					var out=["__.Promise.log:",id];
					if(promise._name){out.push("named '"+promise._name+"'");}
					out.push("was",t);
					if(v!=null){out.push("with value '"+v+"'");}
					out.push("at",Date.now()%1000000);
					if(msg){out.push("with message",msg);}
					if(console && console.log){
						console.log(out.join(" "));
					}
				};
			}
			this.then_uninstrumented(m("fulfilled"),m("rejected"),m("progress"));
			return this;
		}
	})
	.static((function(){
		var list={};
		return {
			id_factory   : __.id_factory.new("pr-"),
			unresolved   : function()     {return __.object.filter(list,function(v){return !v.resolved;});},
			add_resolved : function(id)   {list[id].resolved=Date.now()%1000000;},
			add_id       : function(id,p) {list[id]={promise:p, created: Date.now()%1000000};},
			get_id       : function(id)   {return list[id];},
			auto_log     : true
		};
	}()))
;

var DEBUG_PROMISES=DEBUG;
__.Promise=(typeof DEBUG_PROMISES!=="undefined" && DEBUG_PROMISES) ?__.PromiseInstrumented : __._Promise;

