function personal_resize(){
    var hei=document.body.clientHeight-100;//网页可见区域高-上下导航
    $("#personal_wrap").css({height:hei});
}
$(document).ready(function(){
    personal_resize();
});