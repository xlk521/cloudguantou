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
    $(".datePicker").datepicker();
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