__.dom.Visitor=__.class.new()
// Visit DOM for Books You Touch, (c) Bob Myers
	.ctor(function Visitor$ctor(fns,selector){
		this.fns        = fns;
		this.selector   = selector;

		this.line       = 0;
		this.node_count = [];
		this.cur_node   = null;
		this.processing = true;
	})
	.proto({
		init        : function(n){
			//initialize yield-based traversal
			this.cur_node=[n||document.documentElement,true];
			this.node_count=[];
			this.line=0;
		},
		skip       : function(){
			this.cur_node[1]=false;//omitchildren
		},
		yield      : function(){
			return this.cur_node=__.dom.node.next2(this.cur_node);
		},
		go         : function(start){
			var nv;
			this.init(start);
			while(nv=this.yield()){
				this.node(nv);
			}
		},
		node       : function(nodeinfo){
            var n=nodeinfo[0],inout=nodeinfo[1],
            name=n.nodeName,
            f=this.fns[name]||__.fn.noop
            ;

			if(n instanceof HTMLElement && this.static.matches && this.selector){
				this.processing=n[this.static.matches](this.selector);
			}
            this.line+=__.string.count(n.nodeValue,/\n/g);//count lines

			if(this.processing){
				if(inout){
					this.node_count[name]=this.node_count[name]||0;
					this.node_count[name]++;
				}
				f(n,inout);
			}
        }
    })
	.static({
		matches     : HTMLElement.prototype.matches ? "matches" : Modernizr.prefixed("matchesSelector",HTMLElement.prototype,false),
		text_node   : function(fn,context){
			//create a function to process a text node which may be split up
			//user provides function which may can invoke callback
			//callback deletes text and optionally inserts DOM node
			return function(n,b){
				var
				parent=n.parentNode,
				repeat=true,
				
				//can this be written using splitText, and would that be more efficient?
				callback=function(start,end,repl){
					var val=n.nodeValue;
					
					//insert new text node with preceding text, if any
					if(start){
						parent.insertBefore(
							document.createTextNode(val.slice(0,start)),
							n
						);
					}
					
					//insert DOM node to replace text segment, if any
					if(repl){
						parent.insertBefore(repl,n);
					}
					
					//make this text node the following text
					n.nodeValue=val.slice(end);
					
					repeat=true;
				}
				;
				
				while(b&&repeat){
					repeat=false;
					fn.call(context,n,callback);
				}
			};
		},
		text_node_regexp:function(regexp,fn,context){
			//create a function for use as the value of the '#text' property
			//in the scanning functions objects passed to text_node_processor,
			//which finds all regexp matches within a text node, and replace them with the DOM resulting
			//from a function called with the result of the regexp match, including captures
			return this.text_node(
				function(n,callback){
					var result=n.nodeValue.match(regexp);
					if(result){
						callback(
							result.index,
							result.index+result[0].length,
							fn.apply(context,result)
						);
					}
				}
			);
		},
		fix_japanese: function(n,wrap){
			function convert_node_for_japanese(n,callback){
				var len,result,romaji=/[０-９Ａ-Ｚａ-ｚ0-9A-Za-z]+/g;
				
				if(wrap){
					result=romaji.exec(n.nodeValue);
					
					if(result){
						len=result[0].length;
						
						callback(
							result.index,
							result.index+result[0].length,
							__.dom.span(
								(len===2||len===3)&&{'class':'tcy'}, //bunch 2-3 char string
								len>4 && {textOrientation:'mixed'},  //write long strongs sideways
								(len===1||len===4)?__.unicode.fw.convert.to(result[0]):__.unicode.fw.convert.from(result[0])
							)
						);
					}
				}else{
					n.nodeValue=n.nodeValue.replace(romaji,function(match){
						return (match.length===1||match.length===4)?__.unicode.fw.convert.to(match):__.unicode.fw.convert.from(match);
					});
				}
			}
			
			__.dom.Visitor.new(
				{
					"#text":this.text_node(convert_node_for_japanese)
				},
				"*"
			).go(n||document.documentElement);
		}
	})
;
