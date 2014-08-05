__.object.watch={
	//handle watchers on a property on an object, callbacks held in non-enumerable foo_watcher property
	define    : function(o,p){
		//define the property p on object o (usually, a prototype) as watchable
		var pp="_"+p;
		Object.defineProperty(o,p,{
			set: function(v){
				var old=this[pp];
				if(v!==old){
					this[pp]=v;
					__.object.watch.trigger(o,this,p,old,v);
				}
			},
			get: function(){
				return this[pp];
			},
			enumerable: true
		});
	},
	watchers_prop: function(p){
		return p+"_watchers";
	},
	trigger   : function(o,i,p,old,v){
		var watchers=o[this.watchers_prop(p)];
		if(watchers){
			watchers.forEach(function(w){
				w.call(i,p,old,v);
			});
		}
	},
	add       : function(o,p,f){
		var w=this.watchers_prop(p);
		if(!o[w]){
			Object.defineProperty(o,w,{value:[],writable:true});
		}
		o[w]=__.array.unique(o[w].concat(f.handleEvent||f));
	},
	remove    : function(o,p,f){
		var w=this.watchers_prop(p);
		if(o[w]){
			o[w]=__.array.omit(o[w],f);
		}
	}
},

__.object.Watcher=__.class.new()
//controller for handling properties on an object
	.ctor(function(o){
		this.o=o;
	})
	.proto({
		watch: function(){
			var _this=this;
			__.args.squash(arguments).forEach(function(p){
				__.object.watch.add(_this.o,p,_this);
			});
		},
		unwatch: function(){
			var _this=this;
			__.args.squash(arguments).forEach(function(p){
				__.object.watch.remove(_this.o,p,_this);
			});
		},
		handleEvent  : function(o,p,old,v){
			var handler=this[p];
			if(handler){return handler.call(this,o,p,old,v);}
		}
	})
;
