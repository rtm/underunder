// touchevent.js: definition of touch events
// (C) Bob Myers

__.dom.TouchEventNode=__.dom.EventNode.derive()
// TouchEventNode class: EventNode responsive to touch
    .name("__.dom.TouchEventNode")
    .ctor(function event_node_ctor(e,o){
	//options are longTapDuration, doubleTapThreshold, dragThreshold (0 to disable, unit is ms)
	__.dom.EventNode._ctor.call(this,e);
	this.listen("touchstart");
	this.waiting_for_doubletap=false;
	this.waiting_to_drag=false;
	this.dragging=false;
	this.o=__.object.set_prototype(o||{},this.static.defaults);
    })
    .proto({
	listen_events    : ["touchmove","touchend","touchcancel","touchleave"],
	add_listeners    : function(){this.listen  .apply(this,this.listen_events);},
	remove_listeners : function(){this.unlisten.apply(this,this.listen_events);},

	touchstart:function touchstart(event){
	    var _this=this;
	    event.stopPropagation();
	    event.preventDefault();

	    this.now=Date.now();

	    this.start_x = this.cur_x = this.min_x = event.touches[0].clientX;
	    this.start_y = this.cur_y = this.min_y = event.touches[0].clientY;

	    this.dragging=false;
	    this.started=true;
	    if(this.waiting_for_doubletap){
		this.waiting_for_doubletap=false;
		this.trigger("doubletap");
	    }else{
		if(this.o.dragThreshold){
		    setTimeout(
			function(){
			    _this.waiting_to_drag=true;
			},
			this.o.dragThreshold
		    );
		}
		this.add_listeners();
	    }
	},
	touchend:function touchend(event){
	    var 
	    xdiff=this.cur_x-this.start_x,
	    ydiff=this.cur_y-this.start_y,
	    evt_type,
	    detail={xdiff:xdiff,ydiff:ydiff},
	    _this=this
	    ;
	    event.stopPropagation();
	    event.preventDefault();
	    if(!this.started){return;}
	    this.waiting_for_doubletap=false;
	    this.waiting_to_drag=false;

	    if(this.dragging){
		this.trigger("dragend");
		this.dragging=false;
		return;
	    }

	    if     (this.start_x-this.min_x < 16  && this.cur_x-this.start_x > 100)  {evt_type="swiperight";    }
	    else if(this.cur_x-this.min_x   < 16  && this.start_x-this.cur_x > 100)  {evt_type="swipeleft";     }
	    else if(this.cur_y-this.min_y   < 16  && this.start_y-this.cur_y > 100)  {evt_type="swipeup";       }
	    else if(this.start_y-this.min_y < 16  && this.cur_y-this.start_y > 100)  {evt_type="swipedown";     }
	    else if(this.start_x-this.min_x > 100 && this.cur_x-this.min_x   > 100)  {evt_type="swipeleftright";}
	    else{
		detail={clientX:this.start_x,clientY:this.start_y};
		evt_type="tap";
		if(this.o.longTapDuration && (Date.now()-this.now>this.o.longTapDuration)){
		    evt_type="longtap";
		}
	    }
	    if(evt_type==="tap"&&this.o.doubleTapThreshold){
		this.waiting_for_doubletap=true;
		setTimeout(
		    function(){
			if(_this.waiting_for_doubletap){
			    _this.trigger(evt_type,false,false,detail);
			    _this.waiting_for_doubletap=false;
			    _this.dragging=false;
			}
		    },
		    this.o.doubleTapThreshold
		);
	    }else{
		this.trigger(evt_type,false,false,detail);
	    }
	    this.remove_listeners();
	    this.started=false;
	},
	touchcancel:function(event){
	    event.stopPropagation();
	    event.preventDefault();
	    this.waiting_for_doubletap=this.waiting_to_drag=this.dragging=this.started=false;
	    this.remove_listeners();
	},
	touchmove:function(event){
	    var x=event.touches[0].clientX,y=event.touches[0].clientY;

	    event.stopPropagation();
	    event.preventDefault();
	    if(!this.started){return;}
	    if(this.waiting_to_drag){
		this.dragging=true;
		this.waiting_to_drag=false;
		this.trigger("dragstart",false,false,{clientX:this.start_x,clientY:this.start_y});
	    }
	    if(this.dragging){
		this.trigger("drag",false,false,{xdiff:x-this.cur_x,ydiff:y-this.cur_y});
	    }
	    this.cur_x=x;
	    this.cur_y=y;
	    this.min_x=Math.min(this.min_x,this.cur_x);
	    this.min_y=Math.min(this.min_y,this.cur_y);
	},
	touchleave:function(event){
	    event.stopPropagation();
	    event.preventDefault();
	    this.waiting_for_doubletap=this.waiting_to_drag=this.dragging=this.started=false;
	},
	cancel:function(){
	    this.waiting_for_doubletap=this.waiting_to_drag=this.dragging=this.started=false;
	    this.remove_listeners();
	    this.unlisten("touchstart");
	}
    })
    .static({
	defaults: {
	    longTapDuration    : 800,
	    doubleTapThreshold : 400,
	    dragThreshold      : 400
	}
    })
;

