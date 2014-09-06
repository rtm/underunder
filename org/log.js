__.log=(function(){
    var log,data;
    function insert(){
	log=__.dom.elt.build("div",{
	    style:{position:"fixed",top:"10px",left:"10px",height:"400px",width:"300px",borderWidth:"1px",borderStyle:"solid",borderColor:"red",zIndex:1000,backgroundColor:"white",overflowY:'scroll',whiteSpace:'pre-wrap'}
	});
	document.body.appendChild(log);
    }
    return{
	msg:function(str){
	    if(!log){insert();}
	    data+=str+"\n";
	    log.innerHTML=data;
	}
    };

}());
