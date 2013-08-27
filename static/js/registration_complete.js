var num=6;
function time_one(){
	$(this).oneTime(1000,function(){
		time_one(num);
	});
	turnonther(num);
	num=num-1;
}
function turnonther(num){
	var myA = document.getElementById("changenum");//myA.innerText
	console.log(myA);
	myA.innerText=num;
	if(num==1){
		$(this).stopTime();
		window.location.href="/authorize/identity/";
	}
}
$(document).ready(function(){
	time_one();
});