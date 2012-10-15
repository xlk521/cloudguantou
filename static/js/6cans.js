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
//作者目录页变量设置
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
//作者列表的目录页的左半部分的模版
var markupcontents_left_data='<div class="contents_list_divleft"><h3>{{ datetime }} </h3></div><div id="contents_list_date" class="contents_list_date"></div>';
$.template("contents_left_data", markupcontents_left_data );
var markupcontents_left_work='<div id="contents_work"><a><img class="img_delay_load" data-url="/statics/img/content_list.GIF" src="http://www.zhangxinxu.com/study/image/pixel.gif" style="background:url(http://www.zhangxinxu.com/study/image/loading.gif) no-repeat center;" />'+
    '<div style=""><b>草麦山系列</b></div></a></div>';
$.template("contents_left_work", markupcontents_left_work );
//目录页右半部分的模版
//中间简介区域的模版
var contents_center='<div id="contents_list_center" style="position:absolute;width:450px;min-height:450px;background:#fff;left:0px"><div id="contents_centerleft" style="position:relative;width:400px;height:140px;top:50%;margin:auto;"></div></div>';
var contents_center_up='<div style="overflow:hidden;height:60px;border-bottom-color:#aaa;border-bottom-style:solid;border-bottom-width:1px;">'+
    '<ul><li style="width:150px;float:left;margin-top:15px"><h2 style="font-size:20px;margin-left:35px;">乡村风情</h2></li>'+
    '<li style="width:50px;float:left;margin-top:17px"><h3 style="font-size:16px;color:#aaa;">摄影</h3></li>'+
    '<li style="float:left;margin-top:28px"><span style="font-size:16px;color:#AAA">创作时间：2012年8月</span></li></ul></div>';
var contents_center_down='<div style="overflow:hidden;height:90px;">'+
    '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;小浪的品牌小浪的博客小浪的品牌小浪的博客小浪的品牌小浪的博客小浪的品牌小浪的博客小浪的品牌小浪的博客... ...<a>阅读更多</a></p></div>';
$.template("contents_center_left",  contents_center );
$.template("contents_center_leftup",  contents_center_up );
$.template("contents_center_leftdown",  contents_center_down );
//右边图片部分的模版
var contents_rightimg='<div id="contents_list_img2" class="contents_list_img2" style="position:absolute;min-height:450px;background:#fff;left:700px;border-left-color:#AAA;border-left-style:solid;border-left-width:1px;"></div>';
var contents_rightimg_head='<div style="height:45px;background:#fff;line-height:40px;">'+
    '<span style="float:left;background:#aaa;font-size:19px;margin-left:5px">【照片的名称】</span>'+
    '<a style="float:right;margin-top:10px;margin-right:5px"><img src="/statics/img/contents_cart.GIF"></a><a style="float:right;margin-top:20px;margin-right:5px"><img src="/statics/img/contents_share.GIF"></a></div>';
var contents_rightimg_center='<div id="list_img" style="padding:5px;"><a><img src="/statics/img/content_right.gif" style="min-height:380px;"></a></div>';
var contents_rightimg_footul='<div style="height:25px;background:#fff;"><ul id="contents_rightimg_ul"></ul></div>';
var contents_rightimg_footliwork='<li class="dropdown"><a style="float:left;margin-left:5px;" data-toggle="dropdown" href="#" class="dropdown-toggle">'+
    '<img src="/statics/img/contents_work_details.GIF" style="height:22px"></a><ul id="list_work_details" style="margin-top:-140px;min-width:300px;" class="dropdown-menu">'+
    '<li><div><div class="modal-header"><a data-dismiss="modal" style="margin-top:-5px" class="close">×</a><h5>作品参数</h5></div><div class="modal-body">'+
    '<ul style="float:left"><li><p>拍摄的相机:（ 尼康D800 ）</p></li><li><p>快门:（ XXXX ）</p></li><li><p>镜头长短:（ XXXXXXXXX ）</p></li></ul><ul style="float:right"><li><p>光圈:（ XXXXXXXXX ）</p></li><li><p>感光度:（ XXXXXXXXXXXXX ）</p></li>'+
    '</ul> </div></div> </li></ul></li>';
var contents_rightimg_footliadvise='<li style="float:right;margin-right:5px"><a href="#myModal" data-toggle="modal" data-keyboard="false" data-backdrop="false" class="dropdown-toggle">'+
    '<img src="/statics/img/contents_work_advise.GIF" style="height:22px"></a><div id="myModal" class="modal" style="width:315px;display:none;position:absolute;bottom:15px;right:35px" >'+
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
//我的购物车---模版以及相关变量的设置
var mycart_head='<dl id="my_cart_head"><hr class="bottom_line2" /><dt><input name="" type="checkbox" value="" /><strong>品牌：</strong><span>西南游采风</span><strong>创作者：</strong><span>遥远</span></dt></dl>';
var mycart_content='<hr class="bottom_line" /><dd><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr id="mycart_content"> </tr></table></dd><hr class="bottom_line" />';
var mycart_top=' <td class="cart_w50"><input name="" type="checkbox" value="" /></td><td class="cart_w117"><img src="/statics/IMG/cp1.jpg" width="107" height="85" /></td><td class="cart_w140"><strong>云贵水田油墨风云贵水田油墨风景云贵水田油墨风景云贵水田油墨风景景</strong></td><td class="cart_w70">摄影</td><td class="cart_w80">黑色框架</td>';
var mycart_center='<td class="cart_w142"><div class="w124_margintop"><a class="ddnumbera1"></a><input type="text" class="ddinputw60h21" value=" 2" maxlength="5" style="padding:0"/> <a class="ddnumbera2"></a></div></td>';
var mycart_bottom='<td class="cart_w105"><em><i class="ibg1"></i>600.00</em></td><td class="cart_w145"><b><i class="ibg2"></i>1200.00</b></td><td class="cart_w60"><div class="cart_w60_div"><a class="cart_w60_a">收藏</a><a class="cart_w60_a">删除</a></div></td>';
$.template("cart_head",  mycart_head );
$.template("cart_content", mycart_content );
$.template("cart_top", mycart_top );
$.template("cart_center",mycart_center );
$.template("cart_bottom",mycart_bottom );
//订单填写页的模版
//地址模版
var order_write_addressli='<li class="t-red" id="order_write_adli"></li>';
var order_write_addressspan='<span class="tip">寄送至</span>';
var order_write_addresscontent='<a class="delete">删除</a><input class="radio" type="radio" checked="checked" />'+
	'<label class="label1">北京市 朝阳区 西大望路1号SOHO现代城A座562号  (遥远 收)</label>'+
	'<em class="em1">1854545454</em><a class="dft">设为默认地址</a>';
$.template("order_write_li",  order_write_addressli );
$.template("order_write_span",  order_write_addressspan );
$.template("order_write_content",  order_write_addresscontent );
//作品模版
var order_write_work='<li class="li1 hg"><img src="IMG/cp1.jpg" width="107" height="85" /></li>'+
    '<li class="li2 hg"><div>云贵水田油墨风景</div></li>'+
    '<li class="li3 hg"><div>摄影</div></li>'+
    '<li class="li4 hg"><div>黑色框架</div></li>'+
    '<li class="li5 hg"><div>2</div></li>'+
    '<li class="li6 hg"><div><strong>600</strong></div></li>'+
    '<li class="li7 hg"><div><strong class="strong1">￥1200.00</strong></div></li>';
$.template("order_write_works",  order_write_work );
//订单成功页
var order_ok_li='<li class="ok_f1">订单号<strong>：2536152465</strong></li><li class="ok_f2">应付金额：<strong>1200.00</strong></li>';
$.template("order_okli",  order_ok_li );
//订单确认页的模板
var order_check_ul='<ul><li class="t-red"><span class="tip">寄送至</span>'+
    '<label class="label1">北京市 朝阳区 西大望路1号SOHO现代城A座562号  (遥远 收)</label>'+
    '<em class="em1">1854545454</em></li></ul>';
$.template("order_checkul",  order_check_ul );
var order_check_offerli='<label class="label1">在线支付</label><em class="em1">即时到帐，支持绝大数银行借记卡及部分银行信用卡</em><a class="a1" >查看银行及限额</a>';
var order_check_sendli=' <label class="label1">顺丰快递</label><span><div class="tb-postAgeCont">至   北京</div></span><span> 快递费用：<b>3</b> 元(人民币)/千克</span>';
$.template("order_check_offer_li", order_check_offerli );
$.template("order_check_send_li",  order_check_sendli );
var order_check_ul2='<li class="li1 hg"><img src="IMG/cp1.jpg" width="107" height="85" /></li>'+
                    '<li class="li2 hg"><div>云贵水田油墨风景</div></li>'+
                    '<li class="li3 hg"><div>摄影</div></li>'+
                    '<li class="li4 hg"><div>黑色框架</div></li>'+
                    '<li class="li5 hg"><div>2</div></li>'+
                    '<li class="li6 hg"><div><strong>600</strong></div></li>'+
                    '<li class="li7 hg"><div><strong class="strong1">￥1200.00</strong></div></li>';
$.template("order_checkul2",order_check_ul2);
//product产品页的模版
var product_h30='<h3>青藏高原</h3>';
var product_h24='<span>类别：</span><em>摄影</em><span>品牌：</span><em>金色闪光</em><span>作者：</span><em>遥远</em>';
var product_h410='<img src="/statics/IMG/cp.jpg" width="510" height="410" />';
var product_otherwork='<em>走进西藏的春与秋</em> ';
$.template("product_list_h30",product_h30);
$.template("product_list_h24",product_h24);
$.template("product_list_h410",product_h410);
$.template("product_other_work",product_otherwork);
//product产品页的模版生成函数
function product_details(){
    $.tmpl( "product_list_h30").appendTo( "#h30" );
    $.tmpl( "product_list_h24").appendTo( "#h24" );
    $.tmpl( "product_list_h410").appendTo( "#h410" );
    $.tmpl( "product_other_work").appendTo( "#other_product_name" );
}
//订单成功页的模版生成
function order_ok(){
    $.tmpl( "order_okli").appendTo( "#order_ok_ul" );
}
//订单确认页的模版
function order_check(){
    $.tmpl( "order_checkul").appendTo( ".sbt-ift22" );
    $.tmpl( "order_check_offer_li").appendTo( "#order_check_offer" );
    $.tmpl( "order_check_send_li").appendTo( "#order_check_send" );
    $.tmpl( "order_checkul2").appendTo( ".ul2" );
}
//订单填写页的模版生成函数
function order_write(){
    //地址模版
    for(var i=0;i<2;i++){
        $.tmpl( "order_write_li").appendTo( "#order_write_address" );
        if(i==0){
        	$.tmpl( "order_write_span").appendTo( "#order_write_adli" );
        }
        $.tmpl( "order_write_content").appendTo( "#order_write_adli" );
        $('#order_write_adli').removeAttr('id');
    }
    //作品模板
    for(var i=0;i<2;i++){
    	$.tmpl( "order_write_works").appendTo( "#order_write_work" );
    }
}
//个人目录页--添加模版的函数
function contents_right_left(){
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
    $.tmpl( "contents_center_leftup").appendTo( "#contents_centerleft" );
    $.tmpl( "contents_center_leftdown").appendTo( "#contents_centerleft" );
    //$("#contents_list_center").css({height:hei});
    center_wid=$("#contents_list_center").width();//获取当前右侧区域的大小
    leftnum=center_wid;
    contents_nextnum[tmpl_arraynum]=center_wid;//用来存放每个模块的宽度
    next_left=next_left-center_wid;//向左移动的距离
    contents_nextarray[tmpl_arraynum]=next_left;//用来存放左右移动的数据
    work_next=10;
    for(var i=0;i<work_next;i++){
        leftnum=leftnum+$("#contents_list_img2").width();//获取当前右侧区域的大小
        console.log("leftnum:"+leftnum);
        $('#contents_list_img2').removeAttr('id');
        $('#contents_rightimg_ul').removeAttr('id');
        $.tmpl( "contents_list_rightimg").appendTo( "#contents_list_right" );
        //$.tmpl( "contents_list_rightimg_head").appendTo( "#contents_list_img2" );
        $.tmpl( "contents_list_rightimg_center").appendTo( "#contents_list_img2" );
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
        console.log("center_wid:"+center_wid);
        contents_nextnum[tmpl_arraynum]=center_wid;//用来存放每个模块的宽度
        next_left=next_left-center_wid;//向左移动的距离
        contents_nextarray[tmpl_arraynum]=next_left;//用来存放左右移动的数据
    }
    for(var i=work_next-1;i>=0;i--){
        up_stop=up_stop+contents_nextnum[i];//计算最右边几个模块的宽度
        if(up_stop>=wid){
            var stop_num=0;
            var last_num=contents_nextarray[i-1];
            stop_num=up_stop-wid;//最后一次要移动的距离
            last_num=last_num-stop_num;
            for(var h=i;h<work_next;h++){
                contents_nextarray[h]=last_num;
                console.log("last_num:"+last_num);
            }
            work_next=i;
            console.log("-------------------work_next:"+work_next);
            i=-1;
        }
    }
    if(contents_resize_num>1){
        contents_resize_num=0;
        var left_less=0;
        left_less=contents_nextarray[contents_list_array];
        $("#contents_list_right").css({left:left_less});
        console.log("left_less:"+left_less);
    }
    console.log("resize--contents");
}
//购物车---添加模版
function mycart_tmpl(){//#mycart_content
    $.tmpl( "cart_head").appendTo( "#mycart_list" );
    $.tmpl( "cart_content").appendTo( "#my_cart_head" );
    $.tmpl( "cart_top").appendTo( "#mycart_content" );
    $.tmpl( "cart_center").appendTo( "#mycart_content" );
    $.tmpl( "cart_bottom").appendTo( "#mycart_content" );
    $('#my_cart_head').removeAttr('id');
    $('#mycart_content').removeAttr('id');
    $.tmpl( "cart_head").appendTo( "#mycart_list" );
    $.tmpl( "cart_content").appendTo( "#my_cart_head" );
    $.tmpl( "cart_top").appendTo( "#mycart_content" );
    $.tmpl( "cart_center").appendTo( "#mycart_content" );
    $.tmpl( "cart_bottom").appendTo( "#mycart_content" );
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
function contentslist(){//生成目录页的模版===一个完整的信息模板
    //$("#contents_list_date").removeAttr('id');//初始界面上有几个同样的id就要移除几次
    $(".contents_list_date").removeAttr('class');
    $.tmpl( "contents_left_data").appendTo( "#contents_list_work" );
    //for(var i=0;i<模版个数;i++){}
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
        if(i==intnum-1){//把最后一个界面设置为显示的界面
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
function author_left_right(left_right,num){
    var page_max=Math.ceil(cursor/num);
    if(left_right=="author_left"){
        if(page_num>1){
            page_num=page_num-1;
        }
        else{
         //禁用left
            $("#author_left").hide();
            $("#author_followleft").hide();
        }
    }
    else if(left_right=="author_right"){
        if(page_num<page_max){
            page_num=page_num+1;
        }
        else{
         //禁用right
            $("#author_right").hide();
            $("#author_followright").hide();
        }
    }
}
function contents_resize(){//目录页的大小调整函数

}
function base_foot(id){
    var hei=document.body.clientHeight-135;//网页可见区域高-上下导航
    var content_h=$(id).height();
}
function contents_leftchange(up_down){//记录目录页向上移动的数据，每当点击向上按钮（#work_up）,符合条件时添加数据
    if(up_down=="up"){//如果是向上按钮并且还允许调取数据库，数组计数加一
        var hei=document.body.clientHeight-135;//网页可见区域高-上下导航
        var left_show_num=Math.floor(hei/400);//计算每次加载的模版个数，向下取整
        console.log("left_show_num--400:"+left_show_num);
        var up_num=left_show_num*200;
        work_top=work_top-up_num;
        contents_leftnum=contents_leftnum+1;
        contents_leftarray[contents_leftnum]=work_top;
        console.log("up:"+work_top);
        $("#contents_list_work").animate({top:work_top});
    }
    else if(up_down=="down" && contents_leftnum>-1){//如果点击向下按钮，并且数组没有到达第一组
        contents_leftnum=contents_leftnum-1;
        if(contents_leftnum==-1){work_top=0;}
        else{work_top=contents_leftarray[contents_leftnum];}
        $("#contents_list_work").animate({top:work_top});
        console.log("down:"+work_top);
    }
    var change_img=new Array();
    for(var i=0;i<5;i++){
        change_img[0]="/statics/img/content_list.GIF";
    }
    $(".img_delay_load").attr("src","/statics/img/content_list.GIF");
}

function contents_rightchange(next_prive){//设置目录页的变换
    var distance=0;
    if(next_prive=="next" && contents_list_array<work_next){
        contents_list_array=contents_list_array+1;
        console.log("work_next:"+contents_nextarray[contents_list_array]);
        $("#contents_list_right").animate({left:contents_nextarray[contents_list_array]});
    }
    else if(next_prive=="prive" &&  contents_list_array>=0){
        //contents_nextnum=contents_nextnum-1;//
        contents_list_array=contents_list_array-1;
        if(contents_list_array<0){distance=0;}
        else if(contents_list_array>=0){
            distance=contents_nextarray[contents_list_array];
        }
        console.log("contents_list_array::"+contents_list_array);
        $("#contents_list_right").animate({left:distance});
    }
}
function contents_getJson(url,neednum){//目录页---发送请求并获取数据
    var user=new Array();
    $.ajax({
        type: 'POST',
        url:url ,//"/content/getRelationProfile/",
        headers: {"X-CSRFToken":csrftoken},
        data: { cursor:cursor, count:need_num, relation:relation ,have_next_page:have_next_page},
        success:function(msg){
            //user=msg.[];
            //for(var i=0;i<user.length;i++){//将新旧数据拼接到一起
             //user_allfriends[j+i]=user[i];
          //  }
            aythor_users=msg.users;//获取数据中关于已登录作者的数据
            console.log("user_allfriends:::json>"+user_allfriends);
        },
        dataType:'json'
    });
    console.log("执行函数：contents_getJson");//打印LOG
}
function contents_left_init(){//目录页初始时显示界面----left部分
    var hei=document.body.clientHeight-135;//网页可见区域高-上下导航
    var left_show_num=Math.ceil(hei/200);//初始显示时需要加载的模版各抒
    console.log("left_show_num:"+left_show_num);
    for(var i=0;i<left_show_num;i++){
        contentslist();
    }
    for(var i=0;i<10;i++){
        contentslist();
    }

}
function contents_resize(){//作者目录页---大小更换之后的函数
    contents_show(1210);
}
function contents_show(leftwidth){
    //$("#contents_list").show(function(){//目录页的内容初始设计
        var wid=document.body.clientWidth-2;//网页可见区域宽-2px
        var hei=document.body.clientHeight-135;//网页可见区域高-上下导航
        var right_width=wid-leftwidth;
        // var num_x=Math.floor(wid/400);//向下取整，分别计算长和宽能容纳多少数据
        $("#contents_list").css({width:wid,height:hei,background:"#aaa"});
        $("#contents_list_left").css({height:hei,background:"#efa"});
        $("#contents_list_button").css({height:hei});
        $("#contents_list_center").css({height:hei});
       // $("#contents_list_work").css({height:hei});
        $("#contents_list_a").css({height:hei});
        //$("#contents_list_img").css({width:right_width,height:hei});
        $("#contents_list_img").css({height:hei});
        var img_h=hei-35;
        var img_w=img_h*4/3+1;
        $(".contents_list_img2").css({height:hei,width:img_w});//所有的模板统一大小的设置
        console.log("wid:"+wid);
        //contents_left_init();
   // });
}
function keyDown(){
    var body_class=document.getElementById('change_id').className;
    if(body_class=="body_contents_list"){
        if($("#contents_list_left").css("display")=="none"){
            if(window.event.keyCode==37){contents_rightchange("prive"); }
            else if(window.event.keyCode==39){contents_rightchange("next");}
            else if(window.event.keyCode==70){list_button_extend();}
        }
        else{
            if(window.event.keyCode==38){contents_leftchange("up");}
            else if(window.event.keyCode==40){contents_leftchange("down");}
            else if((window.event.keyCode==70)||(window.event.keyCode==39&&(contents_list_array==0||contents_list_array==-1))){list_button_shrink();}
        }
    }
}
function list_button_extend(){//目录页：展开左半边
    $("#contents_list_left").show(50);
    $("#list_button_shrink").show();
    $("#list_button_extend").hide();
    var wid=document.body.clientWidth-2;//网页可见区域宽-2px
    var hei=document.body.clientHeight-135;//网页可见区域高-上下导航
    console.log("wid"+wid);
    var right_width=wid-1210;
    $("#contents_list").css({width:wid});
    //$("#contents_list_img").css({width:right_width});
    $("#contents_control_left").hide();
    $("#contents_control_right").hide();
    var img_h=hei-35;
    var img_w=img_h*4/3;
    $("#contents_list_img2").css({height:hei,width:img_w});
}
function list_button_shrink(){//目录页：收缩左半边
    $("#contents_list_left").hide(50);
    $("#list_button_shrink").hide();
    $("#list_button_extend").show();
    var wid=document.body.clientWidth-2;//网页可见区域宽-2px
    var right_width=wid-470;
    $("#contents_list").css({width:wid});
    //$("#contents_list_img").css({width:right_width});
    $("#contents_control_left").show();
    $("#contents_control_right").show();
}
$(document).ready(function(){
    //author_rightshow();
    $(".box").hover(function(){
    	$(this).css({opacity: 0.8});
    },function(){
    	$(this).css({opacity: 1});
    });
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
        author_left_right("author_right",count);
    });
    $("#author_left").click(function(){
        $("#author_left").carousel('next');
        author_left_right("author_left",count);
    });
    $("#author_followright").click(function(){
        author_left_right("author_right",count);
    });
    $("#author_followleft").click(function(){
        author_left_right("author_left",count);
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
    $("#detail_content_div").show(function(){
        product_details();
    });
    $("#cart_div").show(function(){mycart_tmpl();});
    $("#contents_list").show(function(){//目录页的内容初始设计
        contents_show(1210);
       // contents_left_init();
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
    $("#contents_list_right").show(function(){ contents_right_left();});
    $("#list_button_shrink").click(function(){
        list_button_shrink();
    });
    $("#list_button_extend").click(function(){
        list_button_extend();
    });
    $("#work_up").click(function(){
        contents_leftchange("up");
    });
    $("#work_down").click(function(){
        contents_leftchange("down");
    });
    $("#contents_control_left").click(function(){
        contents_rightchange("prive");
    });
    $("#contents_control_right").click(function(){
        contents_rightchange("next");
    });
    $("#contents_list_left").show(function(){document.getElementById('change_id').className = 'body_contents_list'; });
    $("#homepage_content").show(function(){$("#foot").hide();});
    $("#album-upload").fileupload({
        autoUpload: false,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/,
        /**
        process: [{
            action: 'load',
            fileTypes: /^image\/(gif|jpeg|png)$/,
            maxFileSize: 20000000 // 20MB
        }, {
            action: 'resize',
            maxWidth: 1920,
            maxHeight: 1200,
            minWidth: 800,
            minHeight: 600
        }, {
            action: 'save'
        }],**/
        add: function(e, data) {
            console.log(e);
            console.log(data);
            $("#movieTemplate").tmpl().prependTo("#movieList");
        },
        change: function(e, data) {
            var length = data.files.length;

        },
        done: function (e, data) {
            console.log(e)
            console.log(data.jqXHR.responseText)
            var obj = jQuery.parseJSON(data.jqXHR.responseText);
            console.log( obj.photo_key );
            $("#user-head").attr("src","/authorize/head/"+obj.photo_key);
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        }
    });
    $(window).resize(function() {//重置网页大小的监听函数
        $("#author_content_right").show(function(){author_resize("/content/content_follower/",'follower');});//作者列表页的设计
        $("#author_content_followright").show(function(){author_resize("/content/content_following/",'following');});//作者列表页的设计
        $("#contents_list").show(function(){//目录页的内容初始设计
            $("#contents_list_right").empty();
            contents_resize_num=contents_resize_num+1;//记录大小改变的次数
            contents_right_left();
            for(var i=0;i<2;i++){contentslist();}
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
