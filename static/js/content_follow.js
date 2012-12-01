/***
-------->jquery-1.8.2.min.js
-------->jquery-ui-1.9.1.min.js
-------->bootstrap.js
-------->jquery.infinitescroll.min.js
-------->jquery.tmpl.min.js
-------->new_6cans.js
-------->content_follow.js
***/

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
var page_num=1;
//作者列表页发送请求后，由服务器返回所得到的数据，
var author_load_num=0;//记录调用数据的次数
var user_followers = new Array();//我的关注
var user_followings = new Array();//粉丝
var user_allfriends = new Array();//首次取出的数据
var aythor_users = new Array();//取出已登录作者的信息

var wid=0;
var hei=0;
//单个框架的宽高属性
var single_x=500;
var single_y=150;
//var single_y2=0;//更改大小后的每个模块的高度

var markup_active = '<div id="relationList_active" class="item active" style="height:100%;left: 0px;position: fixed;top: 45px;"></div>';
var markup_first = '<div id="relationList_first" class="item" style="overflow:hidden"></div>';
var markup_list = '<div id="relationList_div" class="relationList_div_cls" name="relationList_div" style="border-right:1px solid #ccc;background:#fff;position:absolute;left:0px"></div>';
var markup_content = '<div id="authorcontent" class="relationList" style="height:150px;width:390px;background:#fff;border-bottom:1px solid #ccc;"></div>';

//作者列表页每个模块的内部信息
var markup_content_img = '<div id="relation_content_img" style="width:120px;height:120px;overflow:hidden;background:#fff;float:left"><img src="${head}" style="width:120px;height:120px;"/></div>';
var markup_content_center = '<div id="relation_content_center" style="width:260px;height:130px;overflow:hidden;background:#fff;float:left;margin-left: 15px;"></div>';
var markup_content_name = '<div id="relation_content_name" style="overflow:hidden;background:#fff;font-size:14px">${nickname}<span style="font-size:12px"> （${category}） </span></div>';
var markup_content_work = '<div id="relation_content_work" style="overflow:hidden;background:#fff;font-size:12px">个人品牌：<span style="font-size:12px"> ${brand} </span></div>';
var markup_content_friend = '<div id="relation_content_friend" style="overflow:hidden;background:#fff;font-size:12px"><span style="font-size:12px">关注：(${friends_count})    |  粉丝：(${followers_count})    |  作品：(${works_count})</span></div>';
var markup_content_intro = '<div id="relation_content_intro" style="overflow:hidden;background:#fff;font-size:12px;">简介：</div><div style="width:240px;height:45px;background:#fff;overflow:hidden;border:1px solid #aaa;">${introduction}</div>';
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


// 作者列表界面的排版----当点击按钮时添加新的内容
function author_getRelation(url,relation, x_num, y_num,id_relationTemplate,id_relationList,switch_num){
    var need_num= x_num*y_num;
    var user=new Array();
    console.log("目前总共的数据个数:"+cursor);
    $.ajax({
        type: 'POST',
        url:url ,
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
            }
        },
        dataType:'json'
    });
    console.log("执行函数：author_getRelation");//打印LOG
}
function render_following(x_num, y_num,id_relationTemplate,id_relationList) {
    var count_num=cursor-count;
    author_active(author_x_num,author_y_num,id_relationTemplate,id_relationList,count_num);//将指定内容在特定位置显示
    console.log("执行函数：render_following");//打印LOG
}
function render_follower(x_num, y_num,id_relationTemplate,id_relationList) {

    var count_num=cursor-count;
    author_active(author_x_num,author_y_num,id_relationTemplate,id_relationList,count_num);//将指定内容在特定位置显示
    console.log("执行函数：render_follower");//打印LOG
}
function author_list_num(){//作者列表页，计算能容纳多少作者的信息块
    
    wid=document.body.clientWidth-161;//网页可见区域宽-左侧导航
    hei=document.body.clientHeight-102;//网页可见区域高-上下导航
    var num_x=Math.ceil(wid/single_x);//向下取整，分别计算长和宽能容纳多少数据
    var num_y=Math.floor(hei/single_y);
    var num_xx=wid%single_x;//分别取余，判定剩下的区域是否可以容下新的内容
    var num_yy=hei%single_y;
    
    $("#attention_listing_content").height(hei);
    $("#author_content_right").css({width:wid});
    $("#author_content_followright").css({width:wid});
    author_num=num_x*num_y;//获取作者列表界面的模板总数
    console.log("页面的排版数为："+author_num);
    height_num=single_y+Math.floor(num_yy/num_y);//重新设定区域的高度
    author_x_num=num_x;
    author_y_num=num_y;
    console.log("height_num:"+height_num);
    width_num=single_x;
    count=author_x_num*author_y_num;
    console.log("num_x==>"+num_x);
}
var left_array=new Array();
var list_width=0;//每一列的宽度
var content_folloe_num=-1;//记录移动的键
var leftnum=0;//记录每次左移的距离
function author_active(x_num,y_num,id_active,id_relationList,users_num)//每调用一次，生成一个完整的界面
{
    //用来生成界面
    var  first_left=0;
    var count_num=0;
    var left_array_num=left_array.length;
    
    count_num=users_num;//数组的开始；cursor-count
    console.log("count_num:"+count_num);
    $.tmpl( id_active).appendTo( "#relationList_form" );
    for(var j=0;j<x_num;j++) {/**/
        var list_left=$('.relationList_div_cls').css("left");//上一个列的left值
        $('.relationList_div_cls').removeAttr('class');
        list_left=parseFloat(list_left);//强制转换为float类型
        console.log("list_left===>"+list_left);
        if(list_left>0){
            first_left=list_left+list_width;
        }
        else{//如果left值是0，则设置第一个的左移值
            first_left=parseFloat($('.content_follow_left').css("width"))+1;
            leftnum=first_left;
            console.log("没有数值");
        }
        
        $.tmpl( "relationTemplate_form").appendTo( "#relationList_active" );
        for(var i=0;i<y_num;i++){//完成一列的布置
            if(user_allfriends[count_num]==undefined){break;}
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
        if(list_width==0){
            list_width=parseFloat($('.relationList_div_cls').css("width"))+1;
            leftnum=list_width-leftnum;//每次移动需要的差额
        }
        left_array[j+left_array_num]=first_left+leftnum;//将移动的数值存放到数组中
        $('#relationList_div').css({"left":first_left});
        $('#relationList_div').removeAttr('id');
        if(user_allfriends[count_num]==undefined){break;}
    }
    $("#relationList_first").removeAttr('id');
    console.log("执行函数：author_active");//打印LOG
}
function resize_loaddata(data){//改变大小后重新加载数据
    var author_count=0;
    var data_num=0;
    var num=author_x_num*author_y_num;//改变后的网页排版的数量
    var max_new=Math.ceil(cursor/num);//向上取整,新的页面数
    var max_old=Math.ceil(cursor/author_old);//向上取整，旧的页面数
    var page_newnum=author_old*page_num;
    var cursor_num=cursor;//以获取的总的数量
    var int_num=Math.floor(cursor_num/num);
    var intnum=Math.floor(page_newnum/num);
    if(max_new>max_old){//排版变小
        intnum=intnum+1;//当前页面的页数
        page_num=1;
    }
    else if(max_new<max_old){
        page_num=1;
    }
    data_num=data;
    if(data_num!=0){int_num=int_num+1;}
    $("#relationList_form").empty();//清空当前指定内容区域的ID
    for(var i=0;i<int_num;i++){//一共有int_num个页面
        author_active(author_x_num,author_y_num,"relationTemplate_active","#relationList_active",author_count);
        author_count=author_count+num;
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
        left_array=new Array();
    }
    else{
        author_list_num();//获取作者列表的排版数
        num=author_x_num*author_y_num;//改变后的网页排版的数量
        console.log("改变后的网页排版的数量:"+num);
        change=author_old-num;//不为零，则样式改变
        int_num=Math.floor(cursor_num/num);
        rem_num=cursor_num%num;
        need_num=num-rem_num;
        resize_num=0;
        if(change!=0){
            if(have_next_page==true){//还允许调用数据， 并且需要调数据
                console.log("还允许调用数据， 并且需要调数据,发送数据请求。"+need_num)
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

function left_right(leftright){
    var may=document.getElementsByName("relationList_div");
    console.log(may);
    var num=0;
    var last=may.length;
    //last=Math.ceil(cursor/author_y_num);//判断有几列
    last=last-author_x_num;
    if(last<0){//防止模版不足，消除左右移动的功能
        return 0;
    }
    var lastwidth=0;
    lastwidth=author_x_num*width_num+author_x_num;//每个界面显示出来的所有列的宽度之和
    var widthnum=lastwidth-wid;//最后一次需要移动的距离
    var movearray=new Array();
    var left_num=0;
    for(var i=0;i<=last;i++){
        left_num=left_num+width_num+1;
        movearray[i]=left_num;
    }
    console.log("left_num:"+left_num);
    for(var i=0;i<last;i++){
        //console.log(left_array[i]);
    }
    if(leftright=="left" && content_folloe_num>=0){
        content_folloe_num=content_folloe_num-1;
        //console.log("leftright:"+num);
    }
    else if(leftright=="right" && content_folloe_num<last){
        content_folloe_num=content_folloe_num+1;
       // console.log("leftright:"+num);
    }
    if(content_folloe_num==-1){num=0;}
    else if(content_folloe_num>=0){
        num=-movearray[content_folloe_num];
    }
    $("#relationList_active").animate({"left":num},"slow","swing");
    console.log(cursor+"   "+last+"   "+num+"    "+content_folloe_num);
}
$(document).ready(function(){
	wid=document.body.clientWidth-161;//网页可见区域宽-左侧导航
    hei=document.body.clientHeight-102;//网页可见区域高-上下导航
    $("#attention_listing_content").height(hei);
	//生成初始界面
    $("#author_right").click(function(){
        left_right("right");
    });
    $("#author_left").click(function(){
        left_right("left");
    });
    $("#author_followright").click(function(){
        left_right("right");
    });
    $("#author_followleft").click(function(){
        left_right("left");
    });
    $("#author_right").hover(function(){//我的关注界面的移动按钮
        if(have_next_page==true){
            author_getRelation("/content/content_follower/",'follower',author_x_num, author_y_num,"relationTemplate","#relationList_first",'render_follower');//调取数据
        }},function(){}
    );
    $("#author_followright").hover(function(){//我的粉丝界面的移动按钮
        if(have_next_page==true){
            author_getRelation("/content/content_following/",'following',author_x_num, author_y_num,"relationTemplate","#relationList_first",'render_follower');//调取数据
        }},function(){}
    );
    $("#detail_content_div").show("normal",function(){
        product_details();
    });
    $("#cart_div").show("normal",function(){
        mycart_init();
    });
	$("#author_content_right").show("normal",function(){
        $('.carousel').carousel('pause');
        author_list_num();//获取作者列表的行数和列数
        author_getRelation("/content/content_follower/",'follower',author_x_num, author_y_num,"relationTemplate_active","#relationList_active",'render_follower');//调取数据
    });
    $("#author_content_followright").show("normal",function(){
        $('.carousel').carousel('pause');
        author_list_num();//获取作者列表的行数和列数
        author_getRelation("/content/content_following/",'following',author_x_num, author_y_num,"relationTemplate_active","#relationList_active",'render_follower');//调取数据
    });
});
$(window).resize(function() {//重置网页大小的监听函数
    console.log("-------------------------------------------------------------------------------------------------------------");
    wid=document.body.clientWidth-161;//网页可见区域宽-左侧导航
    hei=document.body.clientHeight-102;//网页可见区域高-上下导航
    $("#author_content_right").show("normal",function(){author_resize("/content/content_follower/",'follower');});//作者列表页的设计
    $("#author_content_followright").show("normal",function(){author_resize("/content/content_following/",'following');});//作者列表页的设计
});