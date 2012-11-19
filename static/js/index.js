var index_addimg='<li><div class="project-cover"><a href="/content/index/39/?img_id=${pid}"><img src=${coverkey} width="221" height="166"></a><div class="project-cover-div"><div>'+
'<h4 title="和俩暖色调阿斯达暖色调阿斯暖色调阿斯">${title}</h4><em>#摄影</em></div><p><span class="font1">FROM:</span><a class="font2">${nickname }</a>的品牌'+
'<a href="/content/personal/?id=${profile_id }" class="font2">净世界</a></p></div></div></li>';
$.template("tmpl_num1",index_addimg);
function index_tmpl(){
	for(var i=0;i<12;i++){
		$.tmpl("tmpl_num1").appendTo( "#HomeConList_ul" );
	}
}
function indexfooter_show(){
    $(this).oneTime(100, function() {
        $(".indexfooter_hide_show").animate({bottom:0});
    });
}
function indexfooter_hide(){
    $(this).oneTime(1000, function() {
        $(".indexfooter_hide_show").animate({bottom:-55});
    });
}
function footer_stoptime(){
    $(this).stopTime();
}
function footer_time(){
    $(this).oneTime(1000, function() {
        $(".indexfooter_hide_show").animate({bottom:-55});
    });
}
var scrollPos; 
function get_num_scroll(){
        
        if (typeof window.pageYOffset != 'undefined')    //针对Netscape 浏览器
        { 
            scrollPos = window.pageYOffset; 
        } 
        else if (typeof document.compatMode != 'undefined' &&   document.compatMode != 'BackCompat')
        { 
            scrollPos = document.documentElement.scrollTop; 
        } 
        else if (typeof document.body != 'undefined') 
        { 
            scrollPos = document.body.scrollTop; 
        } 
        console.log("scrollPos:"+scrollPos);
        if(scrollPos>150){
            $("#index_footer_top").show();
        }
        else{$("#index_footer_top").hide();}
}
var album_count=0;//个数
var album_times=1;//次数
var class_nume_num=0;//用来标识需要的数据类型，0为全部，1为摄影，2为插画，3为绘画
var index_getfilm_num=0;//记录调用的次数
function index_getJson(){//目录页---发送请求并获取数据
    var list_index=0;
    list_index=window.screen.availHeight;
    list_index=Math.ceil(list_index/273);
    album_count=list_index*4;
    console.log("list_index:"+list_index);
    $.ajax({
        type: 'post',
        url:"/",
        headers: {"X-CSRFToken":csrftoken},
        data: { album_count:album_count,album_times:album_times},
        success:function(msg){
            album_times=msg.album_times;
            console.log("album_times:"+album_times);
            console.log(msg);            //index_tmpl();
            for(var i=0;i<album_count;i++){
                $.tmpl("tmpl_num1",msg.album_obj[i]).appendTo( "#HomeConList_ul" );
                console.log("msg.album"+i+":"+msg.album_obj[i]);
            }
        },
        dataType:'json'
    });
    console.log("首页---发送请求并获取数据");//打印LOG
}
function index_getfilm(num,string_name){//num传入标志：0代表全部···
    index_getfilm_num=index_getfilm_num+1;
    var list_index=0;
    list_index=window.screen.availHeight;
    list_index=Math.ceil(list_index/273);
    album_count=list_index*4;
    console.log("list_index:"+list_index);
    if(index_getfilm_num==1){
        album_times=0;
        $("#HomeConList_ul").empty();
    }
    class_nume_num=num;//标志数据类型为摄影
    $.ajax({
        type: 'post',
        url:"/",
        headers: {"X-CSRFToken":csrftoken},
        data: { album_count:album_count,album_times:album_times,getcategory:string_name},
        success:function(msg){
            album_times=msg.album_times;
            console.log("album_times:"+album_times);
            console.log(msg);
            for(var i=0;i<album_count;i++){
                $.tmpl("tmpl_num1",msg.album_obj[i]).appendTo( "#HomeConList_ul" );
                console.log("msg.album"+i+":"+msg.album_obj[i]);
            }
        },
        dataType:'json'
    });
    console.log("首页---发送请求并获取----指定类型----的数据");//打印LOG
}
var new_count=0;//用来存放目前显示的刷新得到的数据
function index_reloadJson(){//目录页---发送请求并获取数据
    var myA = document.getElementById("index_newload");//myA.innerText
    var nuw_neednum=0;
    $.ajax({
        type: 'post',
        url:"/",
        headers: {"X-CSRFToken":csrftoken},
        data: { latest_count:1},
        success:function(msg){
            nuw_neednum=msg.index_count;
            console.log("nuw_neednum:"+nuw_neednum);
            myA.innerText=nuw_neednum;
            new_count=nuw_neednum;
            if(nuw_neednum!=0){
                console.log("--------------------------------->"+nuw_neednum);
                $(".HomeConTit2").show();
            }
            else{$(".HomeConTit2").hide();}
        },
        dataType:'json'
    });
    
    setTimeout('index_reloadJson()',5000); //指定60秒刷新一次 
    console.log("首页---发送请求并获取数据--更新待添加的数据");//打印LOG
}
function index_reload_img(){//目录页---发送请求并获取数据---将新的数据添加到现有数据的顶部
    cur_count=new_count;
    console.log("cur_count:"+cur_count);
    $.ajax({
        type: 'post',
        url:"/",
        headers: {"X-CSRFToken":csrftoken},
        data: {get_current_albumdata:1,cur_count:cur_count},
        success:function(msg){
            console.log("数据调取成功！！！");
            for(var i=0;i<new_count;i++){
                $.tmpl("tmpl_num1",msg.album_obj[i]).prependTo( "#HomeConList_ul" );
                console.log("msg.album"+i+":"+msg.album_obj[i]);
            }
            var myA = document.getElementById("index_newload");//myA.innerText
            myA.innerText=0;
            $(".HomeConTit2").hide();
        },
        dataType:'json'
    });
    console.log("首页---发送请求并获取数据--添加数据");//打印LOG
}
window.onscroll=function(){get_num_scroll();};
$(document).ready(function(){
    $(".indexfooter_hide_show").css({bottom:-55});
    //test();
    $("#index_footer_show").hover(function(){
        indexfooter_show();
        },function(){
        indexfooter_hide();
    });
    $("#index_footer_show").click(function(){
        get_num_scroll();
    });
    get_num_scroll();
    var windows_height=document.body.clientHeight;
    $(window).scroll(function(){
        var top = scrollPos;
        var textheight = $(document).height();
        if (textheight - top  <= windows_height) {
            if(class_nume_num==1){
                index_getfilm(1,"摄影");
            }
            else{
                index_getJson();
            }
            
            console.log("已经发送请求");
        }
    });
    setTimeout('index_reloadJson()',5000); //指定60秒刷新一次 
});