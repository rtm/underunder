/* localization logic in __ library, (c) Bob Myers */

__.l10n=__.class.new()
    .ctor(function(strings,lang){
        this.strings=strings;
        this.lang=lang;
    })
    .proto({
        get    : function get(s){
            //get translation based on either key or English string
            var e,r;
            e = this.strings[s] ||
                this.find(s)    ||
                {}
            ;
            r = e[this.lang]                   ||
                e[this.lang.split(/[\-_]/)[0]] ||
                e.en                           ||
                "Missing localized string"
            ;
            return r;
        },
        find   : function(s){
	    return __.object.find_value(this.strings,function(ss){return ss.en===s;});
	},
	getter : function(){
	    return this.get.bind(this);
	}
    })
;
