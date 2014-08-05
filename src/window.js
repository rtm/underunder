// Igowalker window utilities, (C) Bob Myers

__.window={
    init        : function(){
        __.init.call(this);
    },
    scroll      : {
        top     : function(){
            return document.body.scrollTop||document.documentElement.scrollTop;
        },
        left    : function(){
            return document.body.scrollLeft||document.documentElement.scrollLeft;
        },
        to      : function(o){
            //plan is to use CSS transitions on the transform property to scroll smoothly
            //then afterward, undo the transform and set the scroll position so fast it's not visible
            var
                set_transform=function(t){document.body.style[Modernizr.prefixed('transform')]=t;},
                css=__.dom.css,
                px=css.units.px,
                class_setter=__.dom.cls.setter(document.body,"scrolling"),
                set=function(){
                    class_setter.add();
                    set_transform(css.transform.new().translate(px(this.left()-o.loc.x),px(this.top()-o.loc.y)).value());
                },
                unset=function(){
                    class_setter.remove();
                    set_transform("");
                    window.scrollTo(o.loc.x,o.loc.y);
                }
            ;
            set();
            window.setTimeout(unset,o.duration);
            return o.duration;
        },
        by      : function(o){
            //scroll by a particular amount
            o.loc.x += this.left();
            o.loc.y += this.top();
            return this.to(o);
        },
        back    : function(){
            //go back to previous location--return true if success
            //might normally be bound to BKSP key
            var ret=!!this.prev;
            if(this.prev){this.to(this.prev);}
            this.prev=null;
            return ret;
        },
        diff    : function(elt,buf){
            //find distances to scroll window by to bring DOM object into view
            var
                dif         = {x:0,y:0},
                rect        = elt.getBoundingClientRect(),

                win_top     = this.top(),
                win_hgt     = window.innerHeight,
                win_bot     = win_top + win_hgt,

                win_lft     = this.left(),
                win_wid     = window.innerWidth,
                win_rgt     = win_lft + win_wid,

                elt_top     = rect.top,
                elt_hgt     = rect.height,
                elt_bot     = rect.bottom,

                elt_lft     = rect.left,
                //elt_wid     = rect.width,
                elt_rgt     = rect.right
            ;
			alert([elt_lft, elt_rgt, win_lft, win_wid, win_rgt, window.scrollX, window.pageXOffset].join(" "));

            //buffer is irrelevant if object is taller than screen
            buf=!buf?0:Math.max(0,Math.min(win_hgt-elt_hgt,buf));

            if (elt_lft < 0)       { dif.x = elt_lft - buf; }
            if (elt_rgt > win_rgt) { dif.x = elt_rgt - win_rgt + buf; }
            if (elt_top < 0)       { dif.y = elt_top - buf; }
            if (elt_bot > win_bot) { dif.y = elt_bot - win_bot + buf; }

            return dif;
        },
        go      : function(dif,duration,easing){
            //remember location and return queueable fn to scroll to it
            var ret,o;
            easing=easing||"easeOutBack";

            this.prev  = {loc: {y:this.top(),x:this.left()}, duration:duration, easing:easing};
            o          = {loc: dif,                          duration:duration, easing:easing};
            ret        = this.by(o);
            return ret;
        }
    },
    hash        : {
		id_factory : __.id_factory.new("hash"),
        init    : function(){
            window.addEventListener("popstate",function(e){
                if(e.state){window.scrollTo(e.state.x,e.state.y);}
            });
        },
        set     : function(hash){
            var elt=document.getElementById(hash);
            if(DEBUG){if(!elt){throw new URIError("window.set_hash: no such hash '#'"+hash+"'");}}
			this.set_elt(elt);
		},
        set_elt : function(elt){
            //jump to an internal location, only if not already visible on screen
            //remember where we were, so we can go back when user hits BKSP
			//return a promise for the jump being completed
            var dif,jump,p=__.Promise.fulfilled(),hash=elt.id,siv=elt.scrollIntoViewIfNeeded;
			if(!hash){elt.setAttribute("id",hash=this.id_factory.id);}
			if(siv){
				siv.call(elt,false);
				p=p.wait(200);
			}else{
				dif=__.window.scroll.diff(elt,0);
				jump=dif.x||dif.y;
				alert(["Jump is",dif.x,dif.y].join(" "));
				if(jump){
					window.location.hash='';
					try{
						history.replaceState({x:__.window.scroll.left(),y:__.window.scroll.top()},"",null);
					}
					catch(e){}
					window.location.hash='#'+hash;
					p=p.wait(500);//listen(window,"hashchange");
				}
			}
			return p;
        },
        decode  : function(name){
            return (window.location.href.match("[\\?&]"+name+"=([^&#]*)") || [undefined,undefined]) [1];
        }
    }
};
__.window.init();
