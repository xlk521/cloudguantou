/***
choose_personal_bg界面的js包括：
----base界面调用了--->jquery-1.8.2.min.js
-------->choose_personal_bg.js
-------->
***/
var ie=document.all;
var nn6=document.getElementById&&!document.all;
var isdrag=false;
var x,y;
var dobj;
var getX;
var getY;
var xx=0;
var yy=0;
var xx3=0;
var yy3=0;
function movemouse(e){
    if (isdrag){
        var xx2=nn6 ? tx + e.clientX - x : tx + event.clientX - x;//新的移动
        var yy2=nn6 ? ty + e.clientY - y : ty + event.clientY - y;
        xx3= xx+xx2; 
        yy3= yy+yy2;
        document.getElementById("moveid").style.backgroundPosition=xx3+"px"+" "+yy3+"px";
        return false;
    }
}
function selectmouse(e){//获取当前指针位置
    fobj = document.getElementById("moveid");
    xx=xx3;
    yy=yy3;
    if(fobj.className=="dragme"){
        isdrag = true;
        dobj = fobj;
        tx = parseInt(dobj.style.left+0);
        ty = parseInt(dobj.style.top+0);
        x = nn6 ? e.clientX : event.clientX;
        y = nn6 ? e.clientY : event.clientY;
        document.onmousemove=movemouse;
        return false;
    }
}
function forbidden_selectmouse(){}
var press_bt_a="";
var stopnum=0;
function personal_rightorleft(obj){
    var left_num=0;//用来记录左移的距离
    var old_leftnum=parseFloat($(".personal_img_content").css('left'));
    var single_img=$(".personalimg").width()+10;
    var max_width=$("#Personal_brand_background").width();
    var single_nums=Math.ceil(max_width/single_img);//获取一行显示的个数
    var allnum=4;//假定当前有4个图片
    var img_nums=document.getElementById("#Personal_brand_background");
    var stop=0;
    if(single_nums>=allnum){stop=0;}
    else {
        stop=allnum-single_nums;//确定可以移动的个数
    }
    if(obj.className=="personal_right" && stopnum<stop){
        stopnum=stopnum+1;
        left_num=old_leftnum+single_img;
    }
    else if(obj.className=="personal_left"  && stopnum>0){
        stopnum=stopnum-1;
        left_num=old_leftnum-single_img;
    }
    $(".personal_img_content").animate({left:left_num});
}
function Personal_brand_resize(){
    var wid=document.body.clientWidth;
    var hei=document.body.clientHeight;
    var div_height=$("#personal_button").height();
    hei=hei-div_height-10;
    $("#personal_content").css({height:hei});
    wid=wid-10;
    wid=wid+10;
    wid=wid-210;
    $("#Personal_brand_background").css({width:wid});
}
function choose_img(obj){
    isdrag=false;
    x=0;y=0;
    getX=0;
    getY=0;
    xx=0;
    yy=0;
    xx3=0;
    yy3=0;
    $("#personal_content_div").hide();
    document.body.style.backgroundImage="url(" + obj.src + ")";
    document.getElementById("moveid").style.backgroundPosition=xx3+"px"+" "+yy3+"px";
}
function choose_perbg(obj){
    if(obj.id=="personal_button"){
        press_bt_a="button";
        $("#choose_personalbg").animate({top:-84},"slow");
        document.onmousedown=new Function("isdrag=false");
        console.log("xx3:"+xx3 +"   "+"yy3:"+yy3 );
        console.log("top_percent:"+top_percent );
    }
    else if(obj.id=="personal_choose_a"){
        press_bt_a="a";
        $("#choose_personalbg").animate({top:0},"slow");
        //初始化  确定鼠标移动事件
        document.onmousedown=selectmouse;
        document.onmouseup=new Function("isdrag=false");
    }
}
$("#personal_left").live("mouseover",function(){
        if(press_bt_a=="a"){
            Endrag('personal_left','personal_left',0,0);
        }
        else if(press_bt_a=="button"){
            forbidden_selectmouse();
        }
    });
$("#personal_left").live("mouseout",function(){
    if(press_bt_a=="a"){
        mouse_stop();
    }
    else if(press_bt_a=="button"){
        forbidden_selectmouse();
    }
});
$("#personal_right_center").live("mouseover",function(){
        if(press_bt_a=="a"){
            Endrag('personal_right_center','personal_right_center',0,0);
        }
        else if(press_bt_a=="button"){
            forbidden_selectmouse();
        }
    });
$("#personal_right_center").live("mouseout",function(){
    if(press_bt_a=="a"){
        mouse_stop();
    }
    else if(press_bt_a=="button"){
        forbidden_selectmouse();
    }
});
function personal_resize(){
    var hei=document.body.clientHeight-2;//网页可见区域高-上下导航
    $("#personal_wrap").css({height:hei});
}

$(document).ready(function(){
    Personal_brand_resize();
    personal_resize();
    $(window).resize(function(){
        Personal_brand_resize();
        personal_resize();
        choosepersonalhomebg_init();
    });
});
