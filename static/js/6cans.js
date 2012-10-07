//作者界面所能容纳的行数和列数
var author_x_num=0;
var author_y_num=0;
var author_num=0;//获取作者列表界面的总的模板数
//作者列表界面发送请求时，发给服务器的参数
var cursor=0;
var cursor_follow=0;//我的粉丝
var count=0;
var have_next_page=true;
//作者列表界面单个模块的宽和高
var height_num=0;
var width_num=0;
var resize_num=0;//设定界面大小改变的次数
var author_old=0;//设定界面排版的个数
//作者列表页发送请求后，由服务器返回所得到的数据，
var author_load_num=0;//记录调用数据的次数
var user_followers = new Array();//我的关注
var user_followings = new Array();//粉丝
var user_allfriends = new Array();//首次取出的数据
var aythor_users = new Array();//取出已登录作者的信息
//作者目录页变量设置
var work_top=0;//移动的距离
var contents_leftarray=new Array();//存储目录页的向上/向下的属性（top）变更的大小
var contents_leftnum=-1;//用于记录本次事件需要变更的属性的位置

var markup_active = '<div id="relationList_active" class="item active" style="overflow:hidden"></div>';
var markup_first = '<div id="relationList_first" class="item" style="overflow:hidden"></div>';
var markup_list = '<div id="relationList_div" style="border-right:1px solid #ccc;background:#fff;float:left">  </div>';
var markup_content = '<div id="authorcontent" class="relationList" style="height:150px;width:390px;background:#fff;border-bottom:1px solid #ccc"></div>';
//作者列表页每个模块的内部信息
var markup_content_img = '<div id="relation_content_img" style="width:50px;height:50px;overflow:hidden;background:#fff;float:left"><img src=${head} /></div>';
var markup_content_center = '<div id="relation_content_center" style="width:260px;height:120px;overflow:hidden;background:#fff;float:left"></div>';
var markup_content_name = '<div id="relation_content_name" style="overflow:hidden;background:#fff;font-size:14px">${nickname}<span style="font-size:12px"> （${category}） </span></div>';
var markup_content_work = '<div id="relation_content_work" style="overflow:hidden;background:#fff;font-size:12px">个人品牌：<span style="font-size:12px"> ${brand} </span></div>';
var markup_content_friend = '<div id="relation_content_friend" style="overflow:hidden;background:#fff;font-size:12px"><span style="font-size:12px">关注：(${friends_count})| 粉丝：(${followers_count})| 作品：(${works_count})</span></div>';
var markup_content_intro = '<div id="relation_content_intro" style="overflow:hidden;background:#fff;font-size:12px;">简介：</div><div style="width:200px;height:45px;background:#fff;overflow:hidden;border:1px solid #aaa;">${introduction}</div>';
var markup_content_right = '<div id="relation_content_right" style="width:50px;height:120px;overflow:hidden;background:#fff;float:left;"><div style="width:45px;height:20px;border:1px solid #ccc;line-height:20px;text-align:center;"><a id="author_cancel">删除</a></div></div>';
    //生成作者列表对应的模版
$.template("relationTemplate_active", markup_active );
$.template("relationTemplate", markup_first );
$.template("relationTemplate_form", markup_list );
$.template("relationTemplate_div", markup_content );
    //生成列表页每块模版对应的
$.template("relationTemplate_img", markup_content_img );
$.template("relationTemplate_center", markup_content_center );
$.template("relationTemplate_name", markup_content_name );
$.template("relationTemplate_work", markup_content_work );
$.template("relationTemplate_friend", markup_content_friend );
$.template("relationTemplate_intro", markup_content_intro );
$.template("relationTemplate_right", markup_content_right );
//作者列表的目录页的模版
var markupcontents_left_data='<div id="contents_list_date" class="contents_list_date" style="position:relative;width:690px;min-height:200px;background:#f00;overflow:hidden"></div>';
$.template("contents_left_data", markupcontents_left_data );
var markupcontents_left_work='<div id="contents_work" style="position:relative;width:130px;height:130px;background:#fff;float:left"></div>';
$.template("contents_left_work", markupcontents_left_work );
function author_a(){//用来判定应该隐藏哪个箭头
 if(author_load_num==0){//如果是第一次调用，隐藏左边的按钮
    $("#author_left").css({display:none});
 }
}
function out()
{
    if(window.event.toElement.id!="menu"  && window.event.toElement.id!="link")
        menu.style.visibility="hidden";
}
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
var csrftoken = getCookie('csrftoken');
$(function() {
    $('#sina_auth').click(function() {
        open_auth_window('/authorize/sinaauth');
    });
    $('#douban_auth').click(function() {
        open_auth_window('/authorize/doubanauth');
    });
    $('#renren_auth').click(function() {
        open_auth_window('/authorize/renrenauth');
    });
    $('#qq_auth').click(function() {
        open_auth_window('/authorize/qqauth');
    });
    /*homepage页的js功能设计*/
    var $container = $('#container');
    $container.infinitescroll({
        navSelector  : '#page-nav',    // selector for the paged navigation
        nextSelector : '#page-nav a',  // selector for the NEXT link (to page 2)
        itemSelector : '.box',     // selector for all items you'll retrieve
        loading: {
            finishedMsg: 'No more pages to load.',
            img: 'http://i.imgur.com/6RMhx.gif'
         }
     },
    function( newElements ) {
        var $newElems = $( newElements ).css({ opacity: 0 });
        $newElems.imagesLoaded(function(){
            $newElems.animate({ opacity: 1 });
            $container.masonry( 'appended', $newElems, true );
        });
    });
    function refresh() {
        location.reload();
    }
    function getPost(url, data) {
        var result;
        $.ajax({
            type: 'POST',
            url: url,
            headers: {"X-CSRFToken":csrftoken},
            dataType:'json',
            data: data,
            success:function(message){
                $("#id_city").empty();
                for(i in message) {
                    var city = message[i];
                    $("#id_city").append($('<option>',{city:city}).text(city)); 
                }}
        });
        return result;
    }
    $('#id_province').change(function() {
        var province = $(this).val();
        getPost("/authorize/get_cities/", {province:province});
    });
});
// 只是用来测试作者列表界面的排版----当点击按钮时添加新的内容
function author_getRelation(url,relation, x_num, y_num,id_relationTemplate,id_relationList,switch_num){
    var need_num= x_num*y_num;
    var user=new Array();
    console.log("author_getRelation:"+cursor);
    $.ajax({
        type: 'POST',
        url:url ,//"/content/getRelationProfile/",
        headers: {"X-CSRFToken":csrftoken},
        data: {cursor:cursor, count:need_num, relation:relation ,have_next_page:have_next_page},
        success:function(msg){
            author_load_num++;//每次调用成功后，调用次数增加一个
            cursor=msg.cursor;
            have_next_page=msg.have_next_page;
            console.log("cursor:"+cursor);
            user=msg.user_friends;
            console.log("users--new:"+user.length);
            console.log("msg.user_friends:"+(msg.user_friends).length);
            var j=user_allfriends.length;
            for(var i=0;i<user.length;i++){//将新旧数据拼接到一起
                user_allfriends[j+i]=user[i];
            }
            aythor_users=msg.users;//获取数据中关于已登录作者的数据
            console.log("user_allfriends:::json>"+user_allfriends);
            switch(switch_num){
                case 'render_follower':
                    render_follower(author_x_num, author_y_num,id_relationTemplate,id_relationList);
                    break;
                case 'render_following':
                    render_following(author_x_num, author_y_num,id_relationTemplate,id_relationList);
                    break;
                case 'loadjson':

                    break;
                case 'resize_loaddata':
                    resize_loaddata(0);
                    break;
            }/**/
        },
        dataType:'json'
    });
    console.log("执行函数：author_getRelation");//打印LOG
}
function render_following(x_num, y_num,id_relationTemplate,id_relationList) {
    var count_num=cursor-count;
    //user_followers=user_followers+user_allfriends;//   测试用
    author_active(author_x_num,author_y_num,id_relationTemplate,id_relationList,count_num);//将指定内容在特定位置显示
    console.log("执行函数：render_following");//打印LOG
}
function render_follower(x_num, y_num,id_relationTemplate,id_relationList) {
    var count_num=cursor-count;
    author_active(author_x_num,author_y_num,id_relationTemplate,id_relationList,count_num);//将指定内容在特定位置显示
    console.log("执行函数：render_follower");//打印LOG
}
function author_list_num(){//作者列表页，计算能容纳多少作者的信息块
    var wid=document.body.clientWidth-160;//网页可见区域宽-左侧导航
    var hei=document.body.clientHeight-130;//网页可见区域高-上下导航
    var num_x=Math.floor(wid/400);//向下取整，分别计算长和宽能容纳多少数据
    var num_y=Math.floor(hei/150);
    var num_xx=wid%400;//分别取余，判定剩下的区域是否可以容下新的内容
    var num_yy=hei%150;
    var single_x=400;
    var single_y=150;
    $("#author_content_right").css({width:wid-5});
    $("#author_content_followright").css({width:wid-5});
    author_num=num_x*num_y;//获取作者列表界面的模板总数
    single_x=single_x+Math.floor(num_xx/num_x)-5;//重新设定区域的宽度
    single_y=single_y+Math.floor(num_yy/num_y);//重新设定区域的高度
    author_x_num=num_x;
    author_y_num=num_y;
    height_num=single_y;
    width_num=single_x;
    count=author_x_num*author_y_num;
}
function contentslist(){//生成目录页的模版
    $("#contents_list_date").removeAttr('id');//初始界面上有几个同样的id就要移除几次
    $(".contents_list_date").removeAttr('class');
    //$("#contents_list_date").removeAttr('id');

    $.tmpl( "contents_left_data").appendTo( "#contents_list_work" );
    $.tmpl( "contents_left_work").appendTo( ".contents_list_date" );
    $.tmpl( "contents_left_work").appendTo( ".contents_list_date" );
    $.tmpl( "contents_left_work").appendTo( ".contents_list_date" );

}
function author_active(x_num,y_num,id_active,id_relationList,users_num)//每调用一次，生成一个完整的界面
{
    //用来生成界面
    var count_num=0;
    count_num=users_num;//数组的开始；cursor-count
    console.log("count_num:"+count_num);
    $.tmpl( id_active).appendTo( "#relationList_form" );
    for(var j=0;j<x_num;j++) {/**/
        $.tmpl( "relationTemplate_form").appendTo( id_relationList );
        for(var i=0;i<y_num;i++){
            $.tmpl( "relationTemplate_div").appendTo( "#relationList_div" );
            $(".relationList").css({height:height_num,width:width_num});
            $.tmpl( "relationTemplate_img",user_allfriends[count_num]).appendTo( "#authorcontent" );
            console.log("user_allfriends[count_num]:::>"+user_allfriends[count_num]);//打印指定的信息
            $.tmpl( "relationTemplate_center").appendTo( "#authorcontent" );
            $.tmpl( "relationTemplate_name",user_allfriends[count_num]).appendTo( "#relation_content_center" );
            $.tmpl( "relationTemplate_work",user_allfriends[count_num]).appendTo( "#relation_content_center" );
            $.tmpl( "relationTemplate_friend",user_allfriends[count_num]).appendTo( "#relation_content_center" );
            $.tmpl( "relationTemplate_intro",user_allfriends[count_num]).appendTo( "#relation_content_center" );
            $.tmpl( "relationTemplate_right").appendTo( "#authorcontent" );
            $('#authorcontent').removeAttr('id');
            $('#relation_content_center').removeAttr('id');
            count_num=count_num+1;
        }
        $('#relationList_div').removeAttr('id');
    }
    $("#relationList_first").removeAttr('id');
    console.log("执行函数：author_active");//打印LOG
}
function resize_loaddata(data){//改变大小后重新加载数据
    var author_count=0;
    var data_num=0;
    var num=author_x_num*author_y_num;//改变后的网页排版的数量
    var cursor_num=cursor;//以获取的总的数量
    var int_num=Math.floor(cursor_num/num);
    data_num=data;
    if(data_num!=0){int_num=int_num+1;}
    $("#relationList_form").empty();//清空当前指定内容区域的ID
    for(var i=0;i<int_num;i++){//一共有int_num个页面
        if(i==int_num-1){//把最后一个界面设置为显示的界面
            console.log("xlk——active"+int_num);
            author_active(author_x_num,author_y_num,"relationTemplate_active","#relationList_active",author_count);
        }
        else{
            author_active(author_x_num,author_y_num,"relationTemplate","#relationList_first",author_count);
            author_count=author_count+num;
        }
    }
    console.log("resize_loaddata()函数被执行");
}
function author_resize(url,relation){//用来判定调整大小后的界面布局
    var authornum=author_x_num*author_y_num;//获取板式原来的排版数
    resize_num=resize_num+1;
    console.log("authornum:"+authornum);
    var num=0;//改变后的网页排版的数量
    var cursor_num=cursor;//以获取的总的数量
    var change=0;//不为零，则样式改变
    var int_num=0;//获取现有数据所能盛放的页数
    var rem_num=0;//多出来的部分
    var relation="follower";//发送数据中，确定数据关系
    //用来测试时用到的虚假数据，其真正来源本应该是由服务器返回的数据来生成
    var need_num=0;//申请所需的数据量
    var author_count=0;
    console.log(user_allfriends);
    //$("#relationList_form").empty();//清空当前指定内容区域的ID
    if(resize_num==1){
        author_old=authornum;
    }
    else{
        author_list_num();//获取作者列表的排版数
        num=author_x_num*author_y_num;//改变后的网页排版的数量
        console.log("num:"+num);
        change=author_old-num;//不为零，则样式改变
        int_num=Math.floor(cursor_num/num);
        rem_num=cursor_num%num;
        need_num=num-rem_num;
        resize_num=0;
        if(change!=0){
            if(have_next_page==true){//还允许调用数据， 并且需要调数据
                console.log("发送数据请求。"+need_num)
                var user=new Array();
                author_getRelation(url,relation,1, need_num,"relationTemplate_active","#relationList_active",'resize_loaddata');//调取数据
            }
            else{
                if(rem_num==0){
                    resize_loaddata(0);
                }
                else{
                    resize_loaddata(1);
                }
                console.log("else");
            }
        }
    }
    console.log("执行函数：author_resize");//打印LOG
}
function author_init(){
    //作者列表页数据清零
    cursor=0;
    cursor_follow=0;//我的粉丝
    count=0;
    have_next_page=true;
    author_load_num=0;//记录调用数据的次数
    user_followers = new Array();//我的关注
    user_followings = new Array();//粉丝
    user_allfriends = new Array();//首次取出的数据
    aythor_users = new Array();//取出已登录作者的信息
}
function contents_resize(){//目录页的大小调整函数

}
function contents_leftchange(top_num,up_down){//记录目录页向上移动的数据，每当点击向上按钮（#work_up）,符合条件时添加数据
    if(up_down=="up"){//如果是向上按钮并且还允许调取数据库，数组计数加一
        contents_leftnum=contents_leftnum+1;
        contents_leftarray[contents_leftnum]=top_num;
        console.log("up:"+top_num);
        $("#contents_list_work").animate({top:top_num});
        contentslist();
    }
    else if(up_down=="down" && contents_leftnum>=-1){//如果点击向下按钮，并且数组没有到达第一组
        contents_leftnum=contents_leftnum-1;
        work_top=contents_leftarray[contents_leftnum];
        if(contents_leftnum==-1){work_top=0;}
        $("#contents_list_work").animate({top:work_top});
        console.log("down:"+work_top);
    }

}
function contents_show(){
    //$("#contents_list").show(function(){//目录页的内容初始设计
        var wid=document.body.clientWidth-2;//网页可见区域宽-2px
        var hei=document.body.clientHeight-135;//网页可见区域高-上下导航
        var right_width=wid-1210;
        // var num_x=Math.floor(wid/400);//向下取整，分别计算长和宽能容纳多少数据
        $("#contents_list").css({width:wid,height:hei,background:"#aaa"});
        $("#contents_list_left").css({height:hei,background:"#efa"});
        $("#contents_list_button").css({height:hei});
        $("#contents_list_center").css({height:hei});
       // $("#contents_list_work").css({height:hei});
        $("#contents_list_a").css({height:hei});
        $("#contents_list_img").css({width:right_width,height:hei});
        console.log("wid:"+wid);
   // });
}
$(document).ready(function(){
    //author_rightshow();
    $("#logo_registbutton").click(function(){
        window.location.href ="/accounts/register/"
    });
    $("#logo_loginbutton").click(function(){
        window.location.href ="/"
    });
    $("#logo_logoutbutton").click(function(){
        window.location.href ="/accounts/logout/"
    });
    $.formValidator.initConfig({formid:"register_form",debug:false,submitonce:true,
        onerror:function(msg,obj,errorlist){alert(msg);}
    });
    $.formValidator.initConfig({formid:"login_form",debug:false,submitonce:true,
        onerror:function(msg,obj,errorlist){alert(msg);}
    });
    $("#id_username")
        .formValidator({onshow:"请输入用户名",onfocus:"用户名至少4个字符,最多30个字符"})
        .inputValidator({min:4,max:30,onerror:"你输入的用户名非法,请确认"})
        .regexValidator({regexp:"username",datatype:"enum",onerror:"用户名格式不正确"});
    $("#id_password")
        .formValidator({onshow:"请输入密码",onfocus:"至少6个长度",oncorrect:"密码格式合法"})
        .inputValidator({min:6,empty:{leftempty:false,rightempty:false,emptyerror:"密码两边不能有空符号"},onerror:"密码不能为空,请确认"});
    $("#id_email")
        .formValidator({onshow:"请输入邮箱",onfocus:"邮箱至少6个字符",oncorrect:"恭喜你,输入正确",defaultvalue:"@"})
        .inputValidator({min:6,max:100,onerror:"你输入的邮箱长度非法,请确认"})
        .regexValidator({regexp:"^([\\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$",onerror:"你输入的邮箱格式不正确"});
    $("#id_password1")
        .formValidator({onshow:"请输入密码",onfocus:"至少6个长度",oncorrect:"密码格式合法"})
        .inputValidator({min:6,empty:{leftempty:false,rightempty:false,emptyerror:"密码两边不能有空符号"},onerror:"密码不能为空,请确认"});
    $("#id_password2")
        .formValidator({onshow:"输再次输入密码",onfocus:"至少6个长度",oncorrect:"密码一致"})
        .inputValidator({min:6,empty:{leftempty:false,rightempty:false,emptyerror:"重复密码两边不能有空符号"},onerror:"重复密码不能为空,请确认"})
        .compareValidator({desid:"id_password1",operateor:"=",onerror:"2次密码不一致,请确认"});
    $("#upload_textarea")
        .formValidator({onshow:"请输入作品介绍",onfocus:"作品介绍至少50个字符,最多500个字符",oncorrect:"恭喜你,输入正确"})
        .inputValidator({min:50,max:500,onerror:"你输入的作品介绍长度非法,请确认"});
    //生成初始界面
    $("#author_right").click(function(){
        $("#author_right").carousel('next');
    });
    $("#author_left").click(function(){
        $("#author_left").carousel('next');
    });
    $("#author_right").hover(function(){//我的关注界面的移动按钮
        //author_list_num(),
        if(have_next_page==true){
            author_getRelation("/content/content_follower/",'follower',author_x_num, author_y_num,"relationTemplate","#relationList_first",'render_follower');//调取数据
        }},function(){}
    );
    $("#author_followright").hover(function(){//我的粉丝界面的移动按钮
         //author_list_num(),
         if(have_next_page==true){
             author_getRelation("/content/content_following/",'following',author_x_num, author_y_num,"relationTemplate","#relationList_first",'render_follower');//调取数据
         }},function(){}
    );
    $("#contents_list").show(function(){//目录页的内容初始设计
        contents_show();
    });
    $("#author_content_right").show(function(){
        $('.carousel').carousel('pause');
        author_list_num();//获取作者列表的行数和列数
        author_getRelation("/content/content_follower/",'follower',author_x_num, author_y_num,"relationTemplate_active","#relationList_active",'render_follower');//调取数据
        //author_active(author_x_num,author_y_num,"relationTemplate_active","#relationList_active",0);
        console.log("show--ing");
    });
    $("#author_content_followright").show(function(){
        $('.carousel').carousel('pause');
        author_list_num();//获取作者列表的行数和列数
        author_getRelation("/content/content_following/",'following',author_x_num, author_y_num,"relationTemplate_active","#relationList_active",'render_follower');//调取数据
        //author_active(author_x_num,author_y_num,"relationTemplate_active","#relationList_active",0);
        console.log("show--ing");
    });
    /*$("#author_friend").hover(function(){
        $("#author_friend_show").show();
        $("#author_follow_show").hide();
    });
    $("#author_follow").hover(function(){
        $("#author_friend_show").hide();
        $("#author_follow_show").show();
    });
    $("#author_follow").click(function(){
        $("#author_right").hide();
        $("#author_left").hide();
        $("#author_followleft").show();
        $("#author_followright").show();
        author_init();
        console.log("author_init();"+cursor);
        author_list_num(),
        $("#relationList_form").empty(),
        author_getRelation("/content/getRelationProfile/",'follower',author_x_num, author_y_num,"relationTemplate_active","#relationList_active",'render_follower');//调取数据
    });
    $("#author_friend").click(function(){
        $("#author_right").show();
        $("#author_left").show();
        $("#author_followleft").hide();
        $("#author_followright").hide();
        author_init();
        author_list_num(),
        $("#relationList_form").empty(),
        author_getRelation("/content/getRelationProfile/",'follower',author_x_num, author_y_num,"relationTemplate_active","#relationList_active",'render_follower');//调取数据
    });*/
    $("#list_button_shrink").click(function(){
        $("#contents_list_left").hide();
        $("#list_button_shrink").hide();
        $("#list_button_extend").show();
        var wid=document.body.clientWidth-2;//网页可见区域宽-2px
        var right_width=wid-470;
        $("#contents_list_img").css({width:right_width});
        $("#contents_control_left").show();
        $("#contents_control_right").show();
    });
    $("#list_button_extend").click(function(){
        $("#contents_list_left").show();
        $("#list_button_shrink").show();
        $("#list_button_extend").hide();
        var wid=document.body.clientWidth-2;//网页可见区域宽-2px
        console.log("wid"+wid);
        var right_width=wid-1210;
        $("#contents_list_img").css({width:right_width});
        $("#contents_control_left").hide();
        $("#contents_control_right").hide();
        //$("#contents_list_img").css({width:right_width,height:hei});
    });
    $("#work_up").click(function(){
       // var hei=document.body.clientHeight-135;//网页可见区域高-上下导航
        work_top=work_top-$("#contents_list_date").height();
        //console.log(work_top);
        contents_leftchange(work_top,"up");
       // contentslist();
        //$("#contents_list_img").css({width:right_width});
    });
    $("#work_down").click(function(){
        //work_top=work_top+$("#contents_list_date").height();
       // console.log(work_top);
        contents_leftchange(0,"down");
       // contentslist();
        //$("#contents_list_img").css({width:right_width});
    });
    $(window).resize(function() {//重置网页大小的监听函数
        $("#author_content_right").show(function(){author_resize("/content/content_follower/",'follower');});//作者列表页的设计
        $("#author_content_followright").show(function(){author_resize("/content/content_following/",'following');});//作者列表页的设计
        $("#contents_list").show(function(){//目录页的内容初始设计
            contents_show();
        });
    });
});
function open_auth_window(url) {
    var left = (screen.width - 600) / 2;
    var top = (screen.height - 400) / 2;
    window.open(url, '_blank', 'toolbar=no, directories=no, status=no, menubar=no, width=600, height=500, top='+top+', left='+left).focus();
}
var QueryString = function () {
    // This function is anonymous, is executed immediately and 
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [ query_string[pair[0]], pair[1] ];
            query_string[pair[0]] = arr;
        // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
} ();
