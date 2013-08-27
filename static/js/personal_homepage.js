var imgsrc=new Array();
imgsrc[0]="/statics/img/01.jpg";
imgsrc[1]="/statics/img/02.jpg";
imgsrc[2]="/statics/img/03.jpg";
imgsrc[3]="/statics/img/04.jpg";
imgsrc[4]="/statics/img/05.jpg";
imgsrc[5]="/statics/img/06.jpg";
var num1=0;
var num2=1;
var num3=2;
var num4=3;
var len=imgsrc.length;
function imgfor(){
	$("#img1").attr({"src":imgsrc[0]});
	$("#img2").attr({"src":imgsrc[1]});
	$("#img3").attr({"src":imgsrc[2]});
	$("#img4").attr({"src":imgsrc[3]});
}
function leftright(id){
	if(id=="right" && num4<len-1){
		num1=num1+1;
		num2=num2+1;
		num3=num3+1;
		num4=num4+1;
		$("#img1").attr({"src":imgsrc[num1]});
		$("#img2").attr({"src":imgsrc[num2]});
		$("#img3").attr({"src":imgsrc[num3]});
		$("#img4").attr({"src":imgsrc[num4]});
	}
	else if(id=="left" && num1>0){
		num1=num1-1;
		num2=num2-1;
		num3=num3-1;
		num4=num4-1;
		$("#img1").attr({"src":imgsrc[num1]});
		$("#img2").attr({"src":imgsrc[num2]});
		$("#img3").attr({"src":imgsrc[num3]});
		$("#img4").attr({"src":imgsrc[num4]});
	}
	console.log(id);
}
function personal_resize(){
    var hei=document.body.clientHeight;//网页可见区域高-上下导航
    $("#personal_wrap").css({height:hei});
}
$(document).ready(function(){
    personal_resize();
    $("#footer").hide();
    imgfor();
	$("#left").click(function(){
		leftright("left");
	});
	$("#right").click(function(){
		leftright("right");
	});
});