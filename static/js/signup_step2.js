$(function(){
    //图片大小限制信息
    var ERROR_FMT = '图片格式不正确,支持jpeg/png格式的图片'; 
    var rm = '<img class="iright" src="'+ sogoke.STATIC_URL + 'img/getright.gif" />';
    var em = '<img class="ierror" src="'+ sogoke.STATIC_URL + 'img/getcode.gif" />';
    //默认图片
    var queueMaxima = 1;
    var init = {
      Error: function(up, error) {
        // The error object looks like this:
        // code: -200
        // file: g.File
        //     id: "p16jahs4p9vrl1vnpli55fl11m13"
        //     loaded: 145449
        //     name: "d93c4e0fedf8432614b7d6a2201347fb-d4jr7iy.jpg"
        //     percent: 100
        //     size: 145449
        //     status: 4
        // message: "HTTP Error."
        // status: 502
        //
        $('#pickfiles').loadingDots('stop');
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
        if (files.length  > queueMaxima) {
          for (; i < files.length; ++i ) {
            up.removeFile(files[i]);
          }
          $('#uploader_notice').css({'color':'#FFB2B0'}).html('每次只能上传一张头像');
        } else {
          up.start();
          $('#pickfiles').loadingDots({'word':'上传中'});      
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
        $('#pickfiles').loadingDots('stop');
        $("#logo_flag").val(1);
      }
    };
    uploader = sogoke.uploader({multiple_queues:true,
        location:'settings',container:'pickfiles_wrapper', init:init}); 
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
