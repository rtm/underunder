// Books You Touch timer utilities, (C) Bob Myers

__.timer={
    frame     : {
	request : (function(){
	    var raf=window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {window.setTimeout(callback, 1000 / 60);};
	    //transform param to callback to current date if not using hirez timer
	    return function(fn){
		return raf.call(window, function(ms){
		    fn(__.timer.hirez ? ms : Date.now());
		});
	    }}()),
	
	cancel  : window.cancelAnimationFrame ||
	    window.webkitCancelAnimationFrame ||
	    window.mozCancelAnimationFrame ||
	    window.oCancelAnimationFrame ||
	    window.msCancelAnimationFrame
    },
    hirez     : false,
    time      : function(){
	//get current time, either as ms since beginning of epoch, or high-resolution timer
	//see http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
	return __.timer.hirez ? window.performance.now() : Date.now();
    },
    options   : {
	//if we have left the tab and the timer is no longer ticking, don't replay all the old stuff
	skipOlderThan: 0
    },
    _q        : {
	//a simple linked list kept in ascending time order
	//first node is dummy, last node is infinite time in the future
	next      : {ms: Infinity}
    },
    _t        : 0,//timer ID from requestAnimationFrame
    q        : function(f,ms,id){
	//add an element to the timer queue
	var q=this._q,elt;
	ms+=this.time();
	elt={f:f,ms:ms,id:id};
	while(q.next.ms<ms){q=q.next;}
	elt.next=q.next;
	q.next=elt;
	this.tick();
    },
    reset      : function(){
	this._q={next:{ms:Infinity}};
    },
    tick      : function(){
	this._t=this._t||this.frame.request(this.step.bind(this));
    },
    step      : function(now){
	//execute one tick of timer; call functions whose time has come
	var q=this._q,diff,old;
	this._t=0;
	while((diff=now-q.next.ms)>=0){
	    q=q.next;
	    old=this.options.skipOlderThan && diff>this.options.skipOlderThan;
	    if(!old){q.f();}
	}
	this._q.next=q.next;
	if(this._q.next.ms < Infinity){this.tick();}
    }
};

//test requestAnimationFrame to see what kind of timestamp it passes to the callback
//also make sure we have performance.now, which may not be the case on iPhone
__.timer.frame.request(function(timestamp){
    __.timer.hirez=!!(timestamp<1e12&&window.performance&&window.performance.now);
});
