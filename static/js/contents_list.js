/***

contents_list界面的js包括：
---base界面调用了--->jquery-1.8.2.min.js
-------本界面调用--->jquery.tmpl.min.js
-------本界面调用--->contents_list.js
---->注意：js的调用顺序会影响到功能的实现

***/

//作者目录页变量设置
var contents_line_num=0;//记录行高的列表移动的位置
var line_array=new Array();//用来存放行高的列表
var contents_left_right=0;
var work_top=0;//向上移动的距离
var work_next=0;//向左移动的距离
var contents_leftarray=new Array();//存储目录页的向上/向下的属性（top）变更的大小
var contents_leftnum=-1;//用于记录本次事件需要变更的属性的位置
var contents_nextarray=new Array();//存储目录页的向上/向下的属性（top）变更的大小
var contents_nextnum=new Array();//用于记录本次事件需要变更的属性的位置
var contents_list_array=-1;//用于记录盛放目录页的数据id数组的目前页
var contents_resize_num=0;//用来记录大小改变的次数
var contents_width_old=new Array();;//用来记录大小改变之前的数据
var csrftoken = getCookie('csrftoken');

//作者目录页右半部分的模版
//中间简介区域的模版
var contents_center='<div id="contents_list_center" style="position:absolute;width:450px;min-height:450px;background:#fff;left:0px"><div id="contents_centerleft" style="position:relative;width:400px;height:140px;top:50%;margin:auto;"></div></div>';
var contents_center_up='<div style="overflow:hidden;height:60px;border-bottom-color:#aaa;border-bottom-style:solid;border-bottom-width:1px;">'+
    '<ul><li style="width:150px;float:left;margin-top:15px"><h2 style="font-size:20px;margin-left:35px;">${title} </h2></li>'+
    '<li style="width:50px;float:left;margin-top:17px"><h3 style="font-size:16px;color:#aaa;">摄影</h3></li>'+
    '<li style="float:left;margin-top:28px"><span style="font-size:16px;color:#AAA">创作时间：${createtime}</span></li></ul></div>';
var contents_center_down='<div style="overflow:hidden;height:90px;">'+
    '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${description}<a>阅读更多</a></p></div>';
$.template("contents_center_left",  contents_center );
$.template("contents_center_leftup",  contents_center_up );
$.template("contents_center_leftdown",  contents_center_down );
//右边图片部分的模版
var contents_rightimg='<div id="contents_list_img2" class="contents_list_img2" style="position:absolute;min-height:450px;background:#fff;left:700px;border-left-color:#AAA;border-left-style:solid;border-left-width:1px;"></div>';
var contents_rightimg_head='<div style="height:40px;background:#fff;line-height:40px;">'+
    '<span style="float:left;background:#aaa;font-size:19px;margin-left:5px">【照片的名称】</span>'+
    '<a style="float:right;margin-top:10px;margin-right:5px"><img src="/statics/img/contents_cart.GIF"></a><a style="float:right;margin-top:20px;margin-right:5px"><img src="/statics/img/contents_share.GIF"></a></div>';
var contents_rightimg_center='<div id="list_img" style="padding:5px;"><a><img  class="contents_changeimg" src=${url} style="min-height:450px;margin:auto;display:block;"></a></div>';
var contents_rightimg_footul='<div style="height:25px;background:#fff;"><ul id="contents_rightimg_ul"></ul></div>';
var contents_rightimg_footliwork='<li class="dropdown" ><a style="float:left;margin-left:5px;" data-toggle="dropdown" href="#" class="dropdown-toggle">'+
    '<img src="/statics/img/contents_work_details.GIF" style="height:22px"></a><ul id="list_work_details" style="margin-top:-140px;min-width:300px;" class="dropdown-menu">'+
    '<li><div><div class="modal-header"><a data-dismiss="modal" style="margin-top:-5px" class="close">×</a><h5>作品参数</h5></div><div class="modal-body">'+
    '<ul style="float:left"><li><p>拍摄的相机:（ 尼康D800 ）</p></li><li><p>快门:（ XXXX ）</p></li><li><p>镜头长短:（ XXXXXXXXX ）</p></li></ul><ul style="float:right"><li><p>光圈:（ XXXXXXXXX ）</p></li><li><p>感光度:（ XXXXXXXXXXXXX ）</p></li>'+
    '</ul> </div></div> </li></ul></li>';
var contents_rightimg_footliadvise='<li style="float:right;margin-right:5px"><a href="#myModal_p" data-toggle="modal" data-keyboard="false" data-backdrop="false" class="dropdown-toggle">'+
    '<img class="contents_adviceimg1" src="/statics/img/contents_work_advise.GIF" style="height:22px"></a><div id="myModal_p" class="modal" style="width:315px;display:none;position:absolute;bottom:15px;right:35px" >'+
    '<div class="modal-header"><a data-dismiss="modal" style="margin-top:-5px" class="close">×</a><h5>评论</h5></div><div class="modal-body"><p>暂无评论</p><hr>'+
    '<textarea id="textarea" rows="2" class="input-xlarge"></textarea> <button class="btn">提交</button></div></div></li>';
var contents_rightimg_footliattention='<li style="float:right;margin-right:5px" class="dropdown"><a data-toggle="dropdown" href="#" class="dropdown-toggle"><img src="/statics/img/contents_work_attention.GIF" style="height:22px"></a>'+
    '<ul id="list_work_attention" style="margin-top:-65px;min-width:300px;margin-left:-300px" class="dropdown-menu"><li><div><div class="modal-header"><a data-dismiss="modal" style="margin-top:-5px" class="close">×</a><h5>收藏成功</h5></div></div></li></ul></li>';
$.template("contents_list_rightimg",  contents_rightimg );
$.template("contents_list_rightimg_head",  contents_rightimg_head );
$.template("contents_list_rightimg_center",  contents_rightimg_center );
$.template("contents_list_rightimg_footul",  contents_rightimg_footul );
$.template("contents_list_rightimg_footliwork",  contents_rightimg_footliwork );
$.template("contents_list_rightimg_footliadvise", contents_rightimg_footliadvise );
$.template("contents_list_rightimg_footliattention",  contents_rightimg_footliattention );


//contents_list：个人目录页的js功能函数
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
//个人目录页--添加模版的函数
function contents_right_left(works_msg){
    var tmpl_arraynum=0;
    var next_left=0;
    var center_wid=0;
    var leftnum=0;
    var up_stop=0;
    var wid=document.body.clientWidth-22;//网页可见区域宽-22px
    if(contents_resize_num==1){//当没有改变时，获取大小改变之前的数组
        for(var k=0;k<=work_next;k++){
            contents_width_old[k]=contents_nextarray[k];
        }
    }
    $.tmpl( "contents_center_left").appendTo( "#contents_list_right" );
    $.tmpl( "contents_center_leftup",works_msg).appendTo( "#contents_centerleft" );
    $.tmpl( "contents_center_leftdown",works_msg).appendTo( "#contents_centerleft" );
    center_wid=$("#contents_list_center").width();//获取当前右侧区域的大小
    leftnum=center_wid;
    contents_nextnum[tmpl_arraynum]=center_wid;//用来存放每个模块的宽度
    next_left=next_left-center_wid;//向左移动的距离
    contents_nextarray[tmpl_arraynum]=next_left;//用来存放左右移动的数据
    work_next=works_msg.works.length;
    for(var i=0;i<work_next;i++){
        leftnum=leftnum+$("#contents_list_img2").width();//获取当前右侧区域的大小
        $('#contents_list_img2').removeAttr('id');
        $('#contents_rightimg_ul').removeAttr('id');
        $.tmpl( "contents_list_rightimg").appendTo( "#contents_list_right" );
        $.tmpl( "contents_list_rightimg_head").appendTo( "#contents_list_img2" );
        $.tmpl( "contents_list_rightimg_center",works_msg.works[i]).appendTo( "#contents_list_img2" );
        $.tmpl( "contents_list_rightimg_footul").appendTo( "#contents_list_img2" );
        $.tmpl( "contents_list_rightimg_footliwork").appendTo( "#contents_rightimg_ul" );
        $.tmpl( "contents_list_rightimg_footliadvise").appendTo( "#contents_rightimg_ul" );
        $.tmpl( "contents_list_rightimg_footliattention").appendTo( "#contents_rightimg_ul" );
        //新模版插入时的位置
        contents_show(1210);
        $('#contents_list_img2').css({left:leftnum});
        //获取新添加的模版的宽度，以便用来左右移动
        tmpl_arraynum=tmpl_arraynum+1;
        center_wid=$("#contents_list_img2").width();//获取当前右侧区域的大小
        contents_nextnum[tmpl_arraynum]=center_wid;//用来存放每个模块的宽度
        next_left=next_left-center_wid;//向左移动的距离
        contents_nextarray[tmpl_arraynum]=next_left;//用来存放左右移动的数据
    }
    for(var i=work_next;i>=0;i--){//确定最后一次移动的距离
        up_stop=up_stop+contents_nextnum[i];//计算最右边几个模块的宽度
        if(up_stop>=wid){
            var stop_num=0;
            var i_last=i-1;
            var last_num=0;
            if(i_last<0){last_num=0;}
            else{last_num=contents_nextarray[i-1];}
            stop_num=up_stop-wid;//最后一次要移动的距离
            last_num=last_num-stop_num;
            for(var h=i;h<work_next;h++){
                contents_nextarray[h]=last_num;
            }
            work_next=i;
            i=-1;
        }
        else if(up_stop<wid && i==0){
            contents_nextarray=new Array();
            contents_nextarray[0]=0;
        }
    }
    if(contents_resize_num>1){
        contents_resize_num=0;
        var left_less=0;
        left_less=contents_nextarray[contents_list_array];
        $("#contents_list_right").css({left:left_less});
        contents_left_resize();
    }
    $("#contents_list_right").css({left:0});
    contents_list_array=-1;
}

function openShutManager(oSourceObj,oTargetObj,shutAble,oOpenTip,oShutTip){//评论框的打开与关闭
    var sourceObj = typeof oSourceObj == "string" ? document.getElementById(oSourceObj) : oSourceObj;
    var targetObj = typeof oTargetObj == "string" ? document.getElementById(oTargetObj) : oTargetObj;
    var openTip = oOpenTip || "";
    var shutTip = oShutTip || "";
    if(targetObj.style.display!="none"){
       if(shutAble) return;
       targetObj.style.display="none";
       if(openTip  &&  shutTip){
        sourceObj.innerHTML = shutTip; 
       }
    } else {
       targetObj.style.display="block";
       if(openTip  &&  shutTip){
        sourceObj.innerHTML = openTip; 
       }
    }
}
function contentlist_content_imgnum(div_id){//通过包含图片的div区域id，判断有多少图片，获取每行的高
    var line_imgnum=4;//每行图片的数目
    var line_num=0;//每个模块中的行数
    var line_height=0;//获取每个图片区域的高度
    var title_height=$(".contents_list_divleft").height();//获取每个日期区域的高度
    var array_num=0;
    var count_line=0;
    line_height=160;
    while($("#"+div_id).length>0){//获取当前的排版行数以及每行的大小
        var testUL = document.getElementById(div_id);   
        var listItems = testUL.getElementsByTagName("img"); 
        var num=0;
        count_line=count_line+1;
        for (var i=0; i<listItems.length; i++) {
            num=num+1;
        }
        line_num=Math.ceil(num/line_imgnum);//向上取整，获取当前行数
        var div_height=line_num*160-1;
        $("#"+div_id).height(div_height);//设置所在div的高度
        //将区域内所有的div块添加到列表中，等待调用
        line_array[array_num]=title_height;
        for(var i=0;i<line_num;i++){
            array_num=array_num+1;
            line_array[array_num]=line_height;
        }
        $("#"+div_id).removeAttr("id");//消除当前区域的id
        array_num=array_num+1;
    }
}

function contents_left_resize(){//作者目录页的做部分：上下移动的问题
    var hei=document.body.clientHeight-100;//网页可见区域高-上下导航
    var left_show_num=Math.floor(hei/2);//获取内容界面的高度的1/2，向下取整
    var contents_height_num=0;
    var lineArayLenght=line_array.length;
    var left_num=0;
    var off_height=0;//记录保留的页面高度
    var last_array_num=lineArayLenght-1;
    var left_last_height=0;//获取最后一次移动的距离
    var title_height=$(".contents_list_divleft").height();//获取每个日期区域的高度
    contents_leftarray=new Array();
    work_top=0;
    contents_line_num=0;
    for(var i=last_array_num;i>-1;i--){
        off_height=off_height+line_array[i];
        if(off_height>=hei){
            left_last_height=off_height-hei;//获取最后一次移动的距离
            last_array_num=i;
            break;
        }
        else if(i==0){
            left_last_height=-1;
            break;
        }
    }
    if(left_last_height!=-1){//如果是-1，禁用上下按钮的功能，否则获取移动的距离分布情况
        var the_last_num=last_array_num-1;
        for(var i=contents_line_num;i<last_array_num;i++){
            contents_height_num=contents_height_num+line_array[contents_line_num];
            if(contents_height_num>=left_show_num || contents_line_num==the_last_num){
                if(line_array[contents_line_num]==title_height && contents_line_num!=the_last_num){
                    contents_height_num=contents_height_num-line_array[contents_line_num];
                    contents_line_num=contents_line_num-1;
                    i=i-1;
                }
                work_top=work_top-contents_height_num;
                contents_height_num=0;
                contents_leftarray[left_num]=work_top;
                left_num=left_num+1;
            }
            contents_line_num=contents_line_num+1;
        }
        if(left_last_height!=0){
            left_num=left_num-1;
            work_top=work_top-left_last_height;
            contents_leftarray[left_num]=work_top;
        }
    }
}
var contents_begin_num=0;
function contents_leftchange(up_down){//记录目录页向上移动的数据，每当点击向上按钮（#work_up）,符合条件时添加数据
    var up_num=contents_leftarray.length;
    var hei=document.body.clientHeight-100;//网页可见区域高-上下导航
    up_num=up_num-1;
    if(up_down=="up" && contents_leftnum<up_num){//如果是向上按钮并且还允许调取数据库，数组计数加一
        contents_leftnum=contents_leftnum+1;
        work_top=contents_leftarray[contents_leftnum];
        $("#contents_list_work").animate({top:work_top});
        if(contents_leftnum==contents_begin_num){
            contents_begin_num +=1;
        }
    }
    else if(up_down=="down" && contents_leftnum>-1){//如果点击向下按钮，并且数组没有到达第一组
        contents_leftnum=contents_leftnum-1;
        if(contents_leftnum==-1){work_top=0;}
        else{work_top=contents_leftarray[contents_leftnum];}
        $("#contents_list_work").animate({top:work_top});
    }
}
function contents_rightchange(next_prive){//设置目录页的变换
    var distance=0;
    if($("#contents_list_left").css("display")!="none" &&(contents_list_array==0||contents_list_array==-1)){
        list_button_shrink();
    }
    else if(next_prive=="next" && contents_list_array<work_next){
        $("#contents_control_left").show("normal");
        contents_list_array=contents_list_array+1;
        $("#contents_list_right").animate({left:contents_nextarray[contents_list_array]});
        if(contents_list_array==work_next){
            $("#contents_control_right").hide("normal");
        }
    }
    else if(next_prive=="prive" &&  contents_list_array>=0){
        $("#contents_control_right").show("normal");
        contents_list_array=contents_list_array-1;
        if(contents_list_array<0){
            distance=0;
            $("#contents_control_left").hide("normal");
        }
        else if(contents_list_array>=0){
            $("#contents_control_right").show("normal");
            distance=contents_nextarray[contents_list_array];
        }
        $("#contents_list_right").animate({left:distance});
    }
    else if(contents_list_array==work_next){
        list_button_shrink();
    }
}
var contentslist_imgid;
function contents_getJson(imgid){//目录页---发送请求并获取数据
    contentslist_imgid=imgid;
    var contents_listuser=new Array();
    $.ajax({
        type: 'get',
        url:"/content/getWorks/",
        headers: {"X-CSRFToken":csrftoken},
        data: { imgid:imgid },
        success:function(msg){
            if(imgid!=undefined){list_button_shrink();}
            contents_listuser[0]=[msg.description,msg.title,msg.createtime];
            contents_listuser[1]=msg.works;
            $("#contents_list_right").empty();
            contents_right_left(msg);
        },
        dataType:'json'
    });
}
function contents_resize(){//作者目录页---大小更换之后的函数
    contents_show(1210);
}
function contents_show(leftwidth){
    var wid=document.body.clientWidth-2;//网页可见区域宽-2px
    var hei=document.body.clientHeight-100;//网页可见区域高-上下导航
    var right_width=wid-leftwidth;
    // var num_x=Math.floor(wid/400);//向下取整，分别计算长和宽能容纳多少数据
    $("#contents_list").css({width:wid,height:hei,background:"#aaa"});
    $("#contents_list_left").css({height:hei,background:"#FFF"});
    $("#contents_list_button").css({height:hei});
    $("#contents_list_center").css({height:hei});
    $("#contents_listborder_left").css({height:hei});
    $("#contents_list_a").css({height:hei});
    $("#contents_list_img").css({height:hei});
    var img_h=hei-35;
    var img_w=img_h*4/3+1;
    $(".contents_list_img2").css({height:hei,width:img_w});//所有的模板统一大小的设置
    var img_hei=hei-75;
    $(".contents_changeimg").css({height:img_hei});
}
function keyDown(){
    var body_class_add=document.getElementById('change_id').className;
    if(body_class_add=="contents_body"){
        var body_class=document.getElementById('contents_list').className;
        if(body_class=="body_contents_list"){
            if($("#contents_list_left").css("display")=="none"){
                if(window.event.keyCode==37 && contents_list_array!=-1){contents_rightchange("prive"); }
                else if(window.event.keyCode==39){contents_rightchange("next");}
                else if(window.event.keyCode==70){list_button_extend();}
                else if(window.event.keyCode==37 && contents_list_array==-1){
                    list_button_extend();
                }
            }
            else{
                if(window.event.keyCode==38){contents_leftchange("down");}
                else if(window.event.keyCode==40){contents_leftchange("up");}
                else if((window.event.keyCode==70)||(window.event.keyCode==39&&(contents_list_array==0||contents_list_array==-1))){list_button_shrink();}
            }
        }
        else if(window.event.keyCode==39 && contents_list_array==work_next){
            list_button_shrink();
        }
    }
}
function list_button_extend(){//目录页：展开左半边
    $("#contents_list_left").show("normal");
    $("#list_button_shrink").show("normal");
    $("#list_button_extend").hide("normal");
    var wid=document.body.clientWidth-2;//网页可见区域宽-2px
    var hei=document.body.clientHeight-100;//网页可见区域高-上下导航
    var right_width=wid-1210;
    $("#contents_list").css({width:wid});
    $("#contents_control_left").hide("normal");
    $("#contents_control_right").show("normal");
    var img_h=hei-35;
    var img_w=img_h*4/3;
    $("#contents_list_img2").css({height:hei,width:img_w});
}
function list_button_shrink(){//目录页：收缩左半边
    if(contents_list_array==work_next){
        $("#contents_control_right").hide("normal");
        $("#contents_control_left").show("normal");
    }
    else{
        $("#contents_control_right").show("normal");
    }
    $("#contents_list_left").hide("normal");
    $("#list_button_shrink").hide("normal");
    $("#list_button_extend").show("normal");
    var wid=document.body.clientWidth-2;//网页可见区域宽-2px
    var right_width=wid-470;
    $("#contents_list").css({width:wid});
}
function contents_getimgid(obj){//目录页--获取图片的id

    contents_getJson(obj.id);
}
$(document).ready(function(){
    $("#list_button_shrink").click(function(){
        list_button_shrink();
    });
    $("#list_button_extend").click(function(){
        list_button_extend();
    });
    $(".contents_adviceimg").live("click",function(){openShutManager(this,'contents_advice_box',false);});
    $(".cls").live("click",function(){openShutManager(this,'contents_advice_box',false);});
    $("#work_up").click(function(){
        contents_leftchange("down");
    });
    $("#work_down").click(function(){
        contents_leftchange("up");
    });
    $("#contents_control_left").click(function(){
        contents_rightchange("prive");
    });
    $("#contents_control_right").click(function(){
        contents_rightchange("next");
    });
    $("#contents_list").show("normal",function(){//生成右边的图片区域
        $("#change_id").attr("class","contents_body");
        contents_show(1210);
        contentlist_content_imgnum("contents_list_date");
        contents_left_resize();
        $('#contents_list_right').show("normal",function() {
            contents_getJson();
        });
    });
});
$(window).resize(function() {//重置网页大小的监听函数
    $("#contents_list_right").empty();
    contents_getJson(contentslist_imgid);
    contents_left_resize();
});