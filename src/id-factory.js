__.id_factory=__.class.new()
//generate sequential ID's based on a prefix
//usage: factory=__.id.factory.new("prefix"); id=factory.id;
	.ctor(function(prefix,len,start){
		this.prefix = prefix||"id";
		this.len	= len||5;        //length of numeric portion
		this.count	= start||0;
	})
	.proto(
		null,
		{
			id : { 
				get: function(){
					return this.prefix+("0000000000"+this.count++).slice(-this.len);
				}
			}
		}
	)
;
