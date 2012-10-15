// JavaScript Document


function hideTag(val) {
	$.each($("#order_con .order_topNav ul li a"), function(val){
		$(this).removeClass("order_topNavA");
	});
	$(this).addClass("order_topNavA");
	
	
	$.each($(".controlleddiv"), function(val){
		$(this).hide();
	});

    var destination;
	switch ($(this).attr("id")) {
		case "click1":
			destination = "#controlled1";
			break;
		case "click2":
			destination = "#controlled2";
			break;
		case "click3":
			destination = "#controlled3";
			break;	
		case "click4":
			destination = "#controlled4";
			break;	
        case "click5":
			destination = "#controlled5";
			break;	
		 case "click6":
			destination = "#controlled6";
			break;		
	}
	$(destination).show();
}
$(document).ready(function() {
	$("#click1").click(hideTag);
	$("#click2").click(hideTag);
	$("#click3").click(hideTag);
	$("#click4").click(hideTag);
	$("#click5").click(hideTag);
	$("#click6").click(hideTag);
});

