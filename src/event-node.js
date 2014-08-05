// event-node.js: definition of objects surrounding DOM nodes to handle events
// (C) Bob Myers

__.dom.EventNode=__.class.new()
// EventNode class: encapsulates DOM element with event behavior
// subclass this class, with method names corresponding to event names
// delegate events to other elements using this.delegate
	.name("__.dom.EventNode")
	.ctor(function EventNode$ctor(e){
		this.e=e;
		this.delegates={};
	})
	.proto({
		handleEvent  : function EventNode$handleEvent(ev){
			//call method with name of event
			var handler;
			if(handler=this[ev.type]){
				return handler.call(this,ev);
			}else{
				if(DEBUG){throw "Missing handler for "+ev.type;}
			}
		},
		listen       : function EventNode$listen(){
			for(var i=0;i<arguments.length;i++){
				this.e.addEventListener(arguments[i],this);
			}
			return this;
		},
		unlisten     : function EventNode$unlisten(){
			for(var i=0;i<arguments.length;i++){
				this.e.removeEventListener(arguments[i],this);
			}
			return this;
		},
		trigger      : function EventNode$trigger(eventType,canBubble,cancelable,detail){
			canBubble=canBubble||false;
			cancelable=cancelable||false;
			detail=detail||{};

			var evt=document.createEvent("CustomEvent");
			evt.initCustomEvent(eventType,canBubble,cancelable,detail);
			this.e.dispatchEvent(evt);
			return this;
		}
	})
;
