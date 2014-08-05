__.window.media={
    //media queries: access current true/false status with eg __.dom.media.smartphone()
    query   : function(q_str){
        var q=this.match?this.match.call(window,q_str):null;
        return function(){return q&&q.matches;};
    },
    match   : window.matchMedia||window.msMatchMedia,
    init    : function(){
        this.smartphone            = this.query("only screen and (min-device-width : 320px) and (max-device-width : 480px)");
        this.smartphone_landscape  = this.query("only screen and (min-width : 321px");
        this.smartphone_portrait   = this.query("only screen and (max-width : 320px)");
        this.ipad                  = this.query("only screen and (min-device-width : 768px) and (max-device-width : 1024px)");
        this.ipad_landscape        = this.query("only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : landscape)");
        this.ipad_portrait         = this.query("only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : portrait)");
        this.desktop               = this.query("only screen and (min-width : 1224px)");
        this.large_screen          = this.query("only screen and (min-width : 1824px)");
        this.iphone4               = this.query("only screen and (-webkit-min-device-pixel-ratio : 1.5),only screen and (min-device-pixel-ratio : 1.5)");
        // see http://www.glazman.org/weblog/dotclear/index.php?post/2012/01/20/iBooks-Author-a-nice-tool-but. NOT TESTED
        this.paginated             = this.query("(paginated)");
        this.nonpaginated          = this.query("(nonpaginated)");
    }
};

__.window.media.init();
