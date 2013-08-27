$(function(){
    //上传多张图片
    //图片大小限制信息
    var ERROR_FMT = '图片格式不正确,支持jpeg/png格式的图片'; 
    var rm = '<img class="iright" src="'+ sogoke.STATIC_URL + 'img/getright.gif" />';
    var em = '<img class="ierror" src="'+ sogoke.STATIC_URL + 'img/getcode.gif" />';
    //默认图片最大上传数
    var queueMaxima_more = 10;
    var init = {
      Error: function(up, error) {
        $('#pickfiles_more').loadingDots('stop');
        switch(error.code) {
          case plupload.INIT_ERROR:
          $('#uploader_notice').css({'color':'#FFB2B0'}).html(sogoke.PLUPLOAD_ERROR_MESSAGES['INIT_ERROR']);
          break;
          case plupload.HTTP_ERROR:
          $('#uploader_notice').css({'color':'#FFB2B0'}).html(sogoke.PLUPLOAD_ERROR_MESSAGES['HTTP_ERROR']);
          break;
          case plupload.FILE_SIZE_ERROR:
            $('#uploader_notice').css({'color':'#FFB2B0'}).html('图片大于5M,请压缩后再上传');
            break;
          case plupload.FILE_EXTENSION_ERROR:
            $('#uploader_notice').css({'color':'#FFB2B0'}).html(ERROR_FMT);
            break;
          default:
          $('#uploader_notice').css({'color':'#FFB2B0'}).html(sogoke.PLUPLOAD_ERROR_MESSAGES['DEFAULT']);
        }   
      },           
      FilesAdded: function(up, files) {
        var i = 0;
        if (files.length  > queueMaxima_more) {
          for (; i < files.length; ++i ) {
            up.removeFile(files[i]);
          }
          $('#uploader_notice').css({'color':'#FFB2B0'}).html('每次只能上传一张头像');
        } else {
          up.start();
          $('#pickfiles__more').loadingDots({'word':'上传中'});      
        }
      },          
       FileUploaded: function(up, file, info) {
        var src = '/media/'+  JSON.parse(info.response).src; 
        v = new Date().getTime();
        var pro_src = src + '?v=' +  v;  
        //show block 
        //crop
        $('#upload_image').attr({'src':pro_src});      
      },
      UploadComplete: function(up, files) {
        $('#pickfiles__more').loadingDots('stop');
        $("#logo_flag").val(1);
      }
    };
    uploader = sogoke.uploader({multiple_queues:true,
        location:'settings',container:'pickfiles_wrapper_more',browse_button:'pickfiles__more', init:init}); 
    uploader.init();
    var $errorContainer = $("a.loginNotice");

    function init_error_msg(msg){
        var prefix = "<li>";
        var suffix = "</li>";
        var message = prefix + msg + suffix;
        return message;
    }

    function error_msg_handler(msg){
        var feed = init_error_msg(msg);
        $errorContainer.html(feed);
    }

    function error_handler(msg, $element, im){
        error_msg_handler(msg);
        img_handler($element, im);
    }

    function img_handler($element, im){
        var $next = $element.next();
        if (!$next.is("img")){
            $element.after(im);
        }
    }
    
    function clean_error_msg($element){
        $errorContainer.html('');
        var $next = $element.next();
        if ($next.is("img")){
            $next.remove();
        }
    }
})
