//product物品详情页
var product_num=1;//要购买的物品，最初始的个数
var product_paynum_size=0;//按照大小，选择对应的金钱
var product_paynum_side=0;//按照边框，选择对应的金钱
var product_paynum=0;//选择完毕后，总的金钱
var money=0;
var add_num=0;//单张增加的金额数目

var product_left=0;//同类商品的左右移动
var product_other_left=new Array();//存放布局时的列表
var product_others_worknum=9;//同类产品的个数
//my_cart购物车页面的相关变量
var mycart_product_num=1;
var mycart_allpays=0.00;
var single_work;
var mycart_b;
var mycart_length=0;//价钱的列表长度
var mycart_array_pay=new Array();
var mrcart_add=new Array();




//我的购物车---模版以及相关变量的设置
/*
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
*/

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
var product_h410='<div style="width:510px;height:410px;background:#aaa;position:absolute;">'+
    '<div id="product_side_imgbg" style="width:380px;height:330px;background:#000;margin:40px auto"><img src="/statics/IMG/cp.gif" width="340" height="290" style="margin:20px 20px" /></div></div>';
var product_otherwork='<em>走进西藏的春与秋</em> ';
$.template("product_list_h30",product_h30);
$.template("product_list_h24",product_h24);
$.template("product_list_h410",product_h410);
$.template("product_other_work",product_otherwork);
//product同系列商品的模版
var product_other_works='<div class="product_otherdiv" style="float:left;position:absolute"><a ><img src="/statics/IMG/xq_cps1.jpg" width="110" height="83" /></a></div>';
$.template("product_otherworks", product_other_works );
//homepage页面的模版
/*
var num1='<li><div class="project-cover"><a><img class="project-cover-img" src="/statics/IMG/cp2.jpg" width="221" height="166" style="opacity: 1; "/></a>'+
                            '<div class="project-cover-div"><div><h4  title="和俩暖色调阿斯达暖色调阿斯暖色调阿斯">和俩暖色调阿斯达暖色调阿斯暖色调阿斯</h4><em>#摄影</em></div>'+
                                '<p><span class="font1">FROM:</span><a class="font2">简易</a>的品牌<a class="font2">净世界</a></p></div></div></li>';                             
$.template("tmpl_num1",num1);
*/

//
//product产品页的模版生成函数
function product_details(){
    $.tmpl( "product_list_h30").appendTo( "#h30" );
    $.tmpl( "product_list_h24").appendTo( "#h24" );
    //$.tmpl( "product_list_h410").appendTo( "#h410" );
    $.tmpl( "product_other_work").appendTo( "#other_product_name" );
}
//product同系列商品的模版生成函数
function product_others(){//产品详情页布模版
    for(var i=0;i<product_others_worknum;i++){
        var other_distence=0;
        other_distence=114*i;
        $.tmpl( "product_otherworks").appendTo( ".detail_left_content_w" );
        $(".product_otherdiv").css({left:other_distence});
        product_other_left[i]=-other_distence;
        $('.product_otherdiv').removeAttr('class');  
    }
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

function out()
{
    if(window.event.toElement.id!="menu"  && window.event.toElement.id!="link")
        menu.style.visibility="hidden";
}

//my_cart界面的js功能实现
function mycart_init(){//购物车界面的数据初始化
    single_work=document.getElementById("cart_con");
    mycart_b=single_work.getElementsByTagName("b"); 
    mycart_length=mycart_b.length;//价钱的列表长度
    for(var i=0;i<mycart_length;i++){
        mycart_array_pay[i]=parseFloat(mycart_b[i].innerText);
        mrcart_add[i]=0;
        console.log(mycart_array_pay[i]);
    }
}
function mycart_all_choose(obj,num_my,end_mynum){//判定购物车中的商品是否全选中
    console.log("mycart_all_choose");
    var mycart_choose = document.getElementById(obj.value);
    var list_input = mycart_choose.getElementsByTagName("input"); 
    var num=list_input.length;
    var checkbox_num=0;
    var input_choose_id = document.getElementById("cart_con");
    var input_choose=input_choose_id.getElementsByTagName("input");       
    var input_length=input_choose.length;
    var checked_num=0;
    var checked_array=new Array();
    if(obj.checked==true){ 
        if(obj.name=="single_work"){
            for(var i=0;i<num;i++){
                console.log(i);
                if(list_input[i].type=="checkbox" && list_input[i].checked==false){
                    checkbox_num=checkbox_num+1; 
                }
            }
            if(checkbox_num==1){
                for(var i=0;i<num;i++){
                    if(list_input[i].type=="checkbox" && list_input[i].name=="single_works"){
                        list_input[i].checked=true;
                        break;
                    }
                } 
            }
            mycart_allpays=mycart_allpays+mycart_array_pay[num_my];//获取当前物品的价钱
            mrcart_add[num_my]=num_my;
        }
        else{
            for(var i=0;i<num;i++){
                if(list_input[i].type=="checkbox"){
                    list_input[i].checked=true;
                }
            }
            if(num_my==0){
                num_my=2;
                end_mynum=mycart_length-2;
            }
            for(var i=num_my;i<=end_mynum;){
                mycart_allpays=mycart_allpays+mycart_array_pay[i];//获取当前物品的价钱
                mrcart_add[i]=i;
                i+=2;
            }
        }
        for(var i=0;i<input_length;i++){//实现全选功能
            if(input_choose[i].type=="checkbox" && input_choose[i].checked==false){
                checked_array[checked_num]=input_choose[i];
                checked_num +=1;
                console.log("checked_num:"+checked_num);
            }
        }
        if(checked_num==2){
            for(var i=0;i<2;i++){
                checked_array[i].checked=true;
            }
        }
        
    }
    else{
        if(obj.name=="single_work"){
            for(var i=0;i<num;i++){
                if(list_input[i].type=="checkbox" && list_input[i].name=="single_works"){
                    list_input[i].checked=false;
                    break;
                }
            } 
            mycart_allpays=mycart_allpays-mycart_array_pay[num_my];//获取当前物品的价钱
            mrcart_add[num_my]=0;
        }
        else{
            for(var i=0;i<num;i++){
                if(list_input[i].type=="checkbox"){
                    list_input[i].checked=false;
                }
            }
            if(num_my==0){
                num_my=2;
                end_mynum=mycart_length-2;
            }
            for(var i=num_my;i<=end_mynum;){
                mycart_allpays=mycart_allpays-mycart_array_pay[i];//获取当前物品的价钱
                mrcart_add[i]=0;
                i+=2;
            }
        }
        for(var i=0;i<input_length;i++){//实现：判定是否还是全选
            if(input_choose[i].type=="checkbox" && input_choose[i].name=="choose_all"){
                input_choose[i].checked=false;
            }
        }
        
    }
    console.log("mycart_allpays:"+mycart_allpays+"----------num:"+num_my);
    for(var i=0;i<mycart_length;i++){
        //mycart_array_pay[i]=parseFloat(mycart_b[i].innerText);
        console.log(mycart_array_pay[i]);
    }
    mycart_b[0].innerText=mycart_allpays;
    mycart_b[mycart_length-1].innerText=mycart_allpays;
}
function mycart_pay(obj,num){//物品数量与资金的关系函数
    console.log("mycart_pay");
    //console.log(obj.name);
    var mycartnum=$("#"+obj.name).attr('value');
    var single_pay=parseFloat(mycart_b[num].innerText);
    var pay=0;
    var old_pay=mycart_array_pay[num+1];
    var new_pay=0;
    if(mycartnum!=mycart_product_num){mycart_product_num=1;}
    if(obj.className=="ddnumbera1"){
        if(mycart_product_num>1){mycart_product_num -=1;}
        console.log("111111");
    }
    else if(obj.className=="ddnumbera2"){
        var max_num=$(".ddinputw60h21").attr('maxlength');
        if(mycart_product_num<max_num){mycart_product_num +=1;}
        console.log("222222");
    }
    console.log(mycart_b);
    pay=single_pay*mycart_product_num;
    num +=1;
    mycart_array_pay[num]=pay;
    mycart_b[num].innerText=pay;
    $("#"+obj.name).attr('value',mycart_product_num);
    if(mrcart_add[num]!=0){
        console.log("num====>:"+num);
        new_pay=old_pay-pay;
        console.log("new_pay-------------====>:"+new_pay);
        mycart_allpays=mycart_allpays-new_pay;//获取当前物品的价钱
        mycart_b[0].innerText=mycart_allpays;
        mycart_b[mycart_length-1].innerText=mycart_allpays;
    }
}
//product产品详情页的js函数
function product_next_prive(next_prive){//产品详情页的其他相关作品的移动
    var last_works=product_others_worknum-5;//停止移动的位置
    if(next_prive=="next" && product_left<last_works){
        product_left +=1;
    }
    else if(next_prive=="prive" && product_left>0){
        product_left -=1;
    }
    
    $( ".detail_left_content_w" ).animate({left:product_other_left[product_left]});
}
function product_count_paynum(obj){//产品详情页--计算产品需要支付的money
    var myA = document.getElementById("product_offer");
    var add_money=parseFloat(obj.value);
    var clss=obj.className;
    if(clss=="product_size_pay"){
        product_paynum_size=add_money;
    }
    else if(clss=="product_side_pay"){
        product_paynum_side=add_money
        if(obj.title=="白框"){
            console.log("1");
            //$("#product_side_imgbg").attr("background","#aaa");
            document.getElementById('product_side_imgbg').style.backgroundColor='#ffffff';
        }
        else if(obj.title=="黑框"){
            console.log("2");
            document.getElementById('product_side_imgbg').style.backgroundColor='#000000';
        }
        else{
            console.log("3");
            document.getElementById('product_side_imgbg').style.backgroundColor='#aaaaaa';
        }
    }
    add_num=product_paynum_size+product_paynum_side;
    add_money=product_paynum+add_num;
    var money_pay=add_money*product_num;
    myA.innerText=money_pay;
    money=add_money;
    console.log("product_paynum:"+product_paynum);
    console.log("add_money:"+add_money);
}
function product_pay(add_nav){//物品数量与资金的关系函数
    if(add_nav=="nav"){
        if(product_num>1){product_num -=1;}
    }
    else if(add_nav=="add"){
        var max_num=$(".ddinputw60h21").attr('maxlength');
        if(product_num<max_num){product_num +=1;}
    }
    var myA = document.getElementById("product_offer");
    var money_pay=money*product_num;
    myA.innerText=money_pay;
    $(".ddinputw60h21").attr('value',product_num);
}
//homepage界面的添加图片
/*
function homepage_addimg(){
    for(var i=0;i<12;i++){
        $.tmpl("tmpl_num1").appendTo( "#HomeConList_ul" );
    }
}
*/



/*base.html登录与注册的js功能实现*/
function show_login(){
    console.log("123");
    $("#login_div").show("normal");
    $("#register_div").hide("normal");
 }
 function show_register(){
    $("#register_div").show("normal");
    $("#login_div").hide("normal");
 }
function reload_this()//刷新当前页
{
    window.location.reload();
}
function creater_add(){
    window.location.href ="/accounts/register/";
}
/*所有界面的功能实现*/
$(document).ready(function(){
    //author_rightshow();
    $(".project-cover-img").hover(function(){
    	$(this).css({opacity: 0.8});
    },function(){
    	$(this).css({opacity: 1});
    });
    $("#logo_registbutton").click(function(){
        creater_add();
    });
    $("#logo_loginbutton").click(function(){
        window.location.href ="/accounts/login/"
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
        .formValidator({onshow:"请输入用户名！",onfocus:"用户名4~30字符！"})
        .inputValidator({min:4,max:30,onerror:"用户名非法！"})
        .regexValidator({regexp:"username",datatype:"enum",onerror:"格式错误！"});
    $("#id_password")
        .formValidator({onshow:"请输入密码！",onfocus:"至少6个字符！",oncorrect:"密码格式合法！"})
        .inputValidator({min:6,empty:{leftempty:false,rightempty:false,emptyerror:"两边不能为空！"},onerror:"密码不能为空！"});
    $("#id_email")
        .formValidator({onshow:"请输入邮箱！",onfocus:"至少6个字符！",oncorrect:"输入正确！",defaultvalue:"@"})
        .inputValidator({min:6,max:100,onerror:"邮箱长度非法！"})
        .regexValidator({regexp:"^([\\w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([\\w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$",onerror:"邮箱格式错误！"});
    $("#id_password1")
        .formValidator({onshow:"请输入密码！",onfocus:"至少6个字符！",oncorrect:"密码格式合法！"})
        .inputValidator({min:6,empty:{leftempty:false,rightempty:false,emptyerror:"两边不能有空符！"},onerror:"密码不能为空！"});
    $("#id_password2")
        .formValidator({onshow:"再次输入密码！",onfocus:"至少6个字符！",oncorrect:"密码一致！"})
        .inputValidator({min:6,empty:{leftempty:false,rightempty:false,emptyerror:"两边不能有空符号"},onerror:"重复密码不能为空,请确认"})
        .compareValidator({desid:"id_password1",operateor:"=",onerror:"2次密码不一致,请确认"});
    $("#upload_textarea")
        .formValidator({onshow:"请输入作品介绍",onfocus:"作品介绍至少50个字符,最多500个字符",oncorrect:"恭喜你,输入正确"})
        .inputValidator({min:50,max:500,onerror:"你输入的作品介绍长度非法,请确认"});
    $("#id_title")
        .formValidator({onshow:"请输入系列名！",onfocus:"系列名1~9字！"})
        .inputValidator({min:1,max:18,onerror:"系列名至多9个字！"})
    $("#id_description")
        .formValidator({onshow:"请输入系列作品描述！",onfocus:"系列作品描述1~100字！"})
        .inputValidator({min:1,max:200,onerror:"系列名至多100个字！"})
    $("#id_category")
        .formValidator({onshow:"请选择系列作品类别！",onfocus:"已选！"})
    $("#input01")
        .formValidator({onshow:"请输入名称！",onfocus:"名称1~9字！"})
        .inputValidator({min:1,max:18,onerror:"名称至多9个字！"})
    $("#id_name")
        .formValidator({onshow:"请输入品牌名称！",onfocus:"品牌名称1~9字！"})
        .inputValidator({min:1,max:18,onerror:"品牌名称至多9个字！"})
    $("#id_nickname")
        .formValidator({onshow:"请输入昵称！",onfocus:"昵称1~8字！"})
        .inputValidator({min:1,max:16,onerror:"昵称至多8个字！"})
    $("#id_introduction")
        .formValidator({onshow:"请输入品牌简介！",onfocus:"品牌简介1~100字！"})
        .inputValidator({min:1,max:200,onerror:"昵称至多100个字！"})
    
    
    /**/
    
    //增加或者减少购买物品数量的按钮事件
    $(".ddnumbera1").mousedown(function(){
        
        if(product_num>1){product_num -=1;}
        $(".ddinputw60h21").attr('value',product_num);
    },function(){}
    );
    $(".ddnumbera2").mousedown(function(){
        var max_num=$(".ddinputw60h21").attr('maxlength');
        if(product_num<max_num){product_num +=1;}
        $(".ddinputw60h21").attr('value',product_num);
    },function(){}
    );

    $("#contents_list_left").show("normal",function(){document.getElementById('change_id').className = 'body_contents_list'; });
    /*
    $("#homepage_content").show("normal",function(){
        homepage_addimg();
        $("#footer").hide();
    });
    $("#homepage_content").show("normal",function(){$("#footer").hide();});
    */
    
    //product产品详情页
    $(".detail_slide_left").click(function(){  
        product_next_prive("prive");
    });
    $(".detail_slide_right").click(function(){  
        product_next_prive("next");
    });
    $("#detail_content_div").show("normal",function(){
        //变量初始化，获取总共需要支付的money
        var myA = document.getElementById("product_offer");
        product_paynum=parseFloat(myA.innerText);
        money=parseFloat(myA.innerText);
        product_others();
    });
    var files;
    $("#album-upload").fileupload({
        autoUpload: true,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        add: function(e, data) {
            console.log(data);
        },
        change: function(e, data) {
            console.log(data.files);
            console.log(data.result);
            files = data.files;
            $.each(data.files, function(index, file) {
                $("#files").tmpl().prependTo("#movieList");
            });
        },
        done: function (e, data) {
            /**
            console.log(e)
            console.log(data.jqXHR.responseText)
            var obj = jQuery.parseJSON(data.jqXHR.responseText);
            console.log( obj.photo_key );
            $("#user-head").attr("src","/authorize/head/"+obj.photo_key);
            **/
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progressall .bar').css(
                'width',
                progress + '%'
            );
        }
    });
    $("#portfolio_post").click(function(){
        var portfolio = "master&";
        $.each($('.template-download'), function(i, val) {
            var name = $(this).find('.input-xlarge').val();
            var description = $(this).find('textarea').val();
            var key = $(this).find('.preview').attr('id');
            key = key.split('/')[5]
            portfolio+=key+'&'+name+'&'+description+'|'
        });
        console.log(portfolio);
        $('<input>').attr({
            type: 'hidden',
            id: 'works',
            name: 'works',
            value: portfolio
        }).appendTo($('#portfolio'));
        $('#portfolio').submit();
    });
    $(window).resize(function() {//重置网页大小的监听函数
        console.log("-------------------------------------------------------------------------------------------------------------");
        $("#author_content_right").show("normal",function(){author_resize("/content/content_follower/",'follower');});//作者列表页的设计
        $("#author_content_followright").show("normal",function(){author_resize("/content/content_following/",'following');});//作者列表页的设计
        $("#contents_list").show("normal",function(){//目录页的内容初始设计
            $("#contents_list_right").empty();
            contents_resize_num=contents_resize_num+1;//记录大小改变的次数
            //contents_right_left();
            contents_getJson(contentslist_imgid);
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
window.locale = {
    "fileupload": {
        "errors": {
            "maxFileSize": "文件超过限制大小",
            "minFileSize": "文件未达到规定大小",
            "acceptFileTypes": "暂不支持此文件类型",
            "maxNumberOfFiles": "超出文件上传数目的最大范围",
            "uploadedBytes": "上传的字节数超过文件大小",
            "emptyResult": "文件为空，请查证后重新上传"
        },
        "error": "错误",
        "start": "开始上传",
        "cancel": "取消上传",
        "destroy": "删除作品"
    }
};
