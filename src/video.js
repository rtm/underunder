__.video={
    Poster   : __.dom.EventNode.derive()
    //mimic poster feature of HTML5 video tag, to avoid the big ugly iPhone replay button
    //basic plan is to create an alternate <img> element showing poster
    //instantiate with opts of {revert:true} to switch back to poster after replay ends
	.ctor(function video$Poster$ctor(video_elt,opts){
	    var poster_url=video_elt.getAttribute("poster");
	    if(!poster_url){return;}

	    this.opts      = opts||{};
	    this.video_elt = video_elt;
	    this.source_elt=video_elt.querySelector("source");
	    this.src       = this.source_elt.getAttribute("src");
	    this.seq       = 0;
	    this.parent    = video_elt.parentNode;
	    this.setter    = __.dom.cls.setter(this.parent,"show-poster");

	    this.super(__.dom.EventNode,video_elt);

	    this.listen("play");
	    this.listen("webkitendfullscreen");
	    if(this.opts.revert){this.listen("ended");}

	    this.set_poster(poster_url);
	    this.to_poster();
	})
	.proto({
	    to_video  : function()    {this.setter.remove();},
	    to_poster : function()    {this.setter.add();},
	    set_poster: function(url) {this.parent.style.backgroundImage=__.dom.css.url(url);},
	    play      : function()    {this.to_video();},
	    ended     : function()    {
		this.webkitendfullscreen();
                //				if(this.opts.revert){setTimeout(this.to_poster.bind(this),100);}},
	    },
	    webkitendfullscreen : function() {
		this.source_elt.setAttribute("src",this.src+"?seq="+this.seq++);
		setTimeout(this.to_poster.bind(this),100);
	    }
	})
	.static({
	    cls : "video-poster"
	})
};

//video.webkitDisplayingFullscreen
