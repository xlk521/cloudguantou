
function preview(img, selection) {
    var scaleX = 100 / (selection.width || 1);
    var scaleY = 100 / (selection.height || 1);
    var wid=$("#user-head").width();
    var hei=$("#user-head").height();
    $('#user-head + div > img').css({
        width: Math.round(scaleX * wid) + 'px',
        height: Math.round(scaleY * hei) + 'px',
        marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
        marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
    });
}
$(document).ready(function(){
    $("#head-upload").fileupload({
        dataType: 'json',
        autoUpload: true,
        singleFileUploads: true,
        done: function (e, data) {
        	console.log("xlk--2");
        	var obj = jQuery.parseJSON(data.jqXHR.responseText);
			$("#user-head").attr("src","/authorize/head/"+obj.photo_key);
			img_url = $('#user-head').attr("src");
			$('#user_upload_thumbnail').attr("src",img_url);
			$('input[name="img_url"]').val(img_url);
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        }
    });
    $('<div><img id="user_upload_thumbnail" src="/statics/img/picture_load.gif" style="position: relative;" /></div>')	
        .css({
            float: 'left',
            position: 'relative',
            overflow: 'hidden',
            width: '100px',
            height: '100px'
        })
        .insertAfter($('#user-head'));
    $('#user-head').imgAreaSelect({ aspectRatio: '1:1', onSelectChange: preview,
    	onSelectEnd: function (img, selection) {
        $('input[name="x1"]').val(selection.x1);
        $('input[name="y1"]').val(selection.y1);
        $('input[name="x2"]').val(selection.x2);
        $('input[name="y2"]').val(selection.y2);
    	}
    });
})