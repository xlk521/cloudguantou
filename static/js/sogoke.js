/*
* Various setting/method for the purpose of sogoke.com
******************************************************************************/
(function(global) {

    var sogoke = sogoke || {};

    ///////////////////////////////////////////////////////////////////////////
    // Constants
    ///////////////////////////////////////////////////////////////////////////
    //
    sogoke.HAS_POPOVER = false;

    //
    sogoke.HAS_OVERLAY = false;         

    // Max length of self instruction
    sogoke.INTRODUCTION_LENGTH = 140;

    // Don't forget sync this value with django
    // Servr link time out (in million seconds)
    // with sogoke.SERVE_LINK_TIMEOUT in static/js/libs/sogoke.js       
    sogoke.SERVER_LINK_TIMEOUT = 5 * 1000 * 1000;

    // Min lenght of comments
    sogoke.MIN_LENGTH_OF_COMMENT = 1;

    // Max length of buzz length
    sogoke.MAX_LENGTH_OF_BUZZ = 512;

    // How many comments a static page can has
    sogoke.STATIC_COMMENT_PAGE_SIZE = 10;

    // Index page discoveries refresh time, in seconds
    sogoke.INDEX_PAGE_REFRESH_TIME = 60 * 1000;

    // Maxium lenght of invitation advices
    sogoke.MAX_LENGTH_OF_INVITATION_ADVICE = 140;

    // Maxium lenght of tag description
    sogoke.MAX_LENGTH_OF_TAG_DESCRIPTION = 140;

    // Maxium lenght of user self introduction
    sogoke.MAX_LENGTH_OF_USER_SELF_INTRODUCTION = 140;

    // Default link photo path
    sogoke.DEFAULT_LINK_PHOTO_PATH = '/media/default/link.gif';

    /////////////////////////////////////////////
    // Plupload constants
    /////////////////////////////////////////////
    //
    sogoke.FLASH_DOWNLOAD_URL = 'http://www.adobe.com/go/getflashplayer';
    // Default runtime
    //sogoke.DEFAULT_RUNTIMES = 'flash';
    sogoke.DEFAULT_RUNTIMES = 'html5,flash';

    // Maxium size of upload photo
    sogoke.MAX_FILE_SIZE_OF_UPLOAD = '10mb';

    //
    sogoke.PLUPLOAD_ERROR_MESSAGES = {
      DEFAULT:'发生错误, 请检查后再试',
      INIT_ERROR:'没有找到上传插件，你可能需要安装 <a target="_blank" href="' + sogoke.FLASH_DOWNLOAD_URL + '">Adobe Flash</a>',
      HTTP_ERROR:'网络错误'
    };

    ////////////////////////////////////////////
    // uEditor constans
    ////////////////////////////////////////////
    sogoke.MIN_HEIGHT_OF_UEDITOR = 152; //px

    sogoke.DEFAULT_ACTION_LOCATION = 'index';

    // Minium lenght of comment
    sogoke.MIN_LENGTH_OF_COMMENT = 2;

    ///////////////////////////////////////////////////////////////////////////
    // Settings
    ///////////////////////////////////////////////////////////////////////////
    // Default options
    sogoke.defaultFormOptions = {
    };

    //
    sogoke.defaultRatyOptions = {
      noRatedMsg: '暂时没有评分'
    };

    ///////////////////////////////////////////////////////////////////////////
    // Methods
    ///////////////////////////////////////////////////////////////////////////
    // Check if account/domain/email/ is occupied or unique
    sogoke.checkAccount = function(token, value){
      var enable = false,
          encodedValue = encodeURIComponent(value);
      $.ajax({
          async: false,
          url: "/accounts/exists/?token="+token+"&"+token+"="+encodedValue,
          dataType: 'json',
          success: function( data ){
            enable = data.enable;
          }
      });

      return enable;
    };

    // Show popover
    sogoke.popover = function(celebrate, email, feedback, next) {
      var POPOVER_BG_WIDTH = 461;
      var POPOVER_BG_HEIGHT = 203;
      var html, top, left, popoverBG;

      if ($.browser.msie && $.browser.version === '6.0') {
        popoverBG = '/static/img/popoverBG.gif';
      } else {
        popoverBG = '/static/img/popoverBG.png';
      }                      

      html = '<img class="popoverBG" src="' + popoverBG + '" alt="" />' + 
             '<div class="content">' + 
             '<p class="celebrate"><img src="/static/img/smile.png"><span>' + celebrate + '</span></p>' + 
             '<p class="email">你的电子邮箱：<span>' + email + '</span></p>' + 
             '<p class="feedback">' + feedback + '</p>' +
             (next ? ('<a class="next" href="' + next.href + '">' + next.text + '</a>') : '') +
             '</div><img class="popoverClose" src="/static/img/popoverClose.png" alt="" />';  

      if (!sogoke.HAS_POPOVER) {
        $('.popover').html(html);
        top = ($(window).height() - POPOVER_BG_HEIGHT) / 2 - 20;
        left = ($(window).width() - POPOVER_BG_WIDTH) / 2;
        $('.popover img.popoverBG').css({'top': top + 'px', 'left': left + 'px'});
        $('.popover img.popoverClose').css({'top': top + 0 + 'px', 'left': left + 442 + 'px'});
        $('.popover div.content').css({'top': top + 'px', 'left': left + 'px'});

        $('.popover').fadeIn(100);
        sogoke.HAS_POPOVER = true;
      }

      return;
    };

    // Client side paginator
    sogoke.paginator = function(cpage, totalpage, path, query) {
      var outstr = '', count = 0; //condition = raw_condition || ''; 
      if (totalpage > 1) {
        if (totalpage <= 10){        //总页数小于十页 
          for (count = 1; count <= totalpage; count++) {
            if(count !== cpage) {
              if (query && query !== '') {
                outstr = outstr + "<a class='page_part' href='" + path + "?" + query + "&page=" +count + "'>" + count + "</a>";         
              } else {
                outstr = outstr + "<a class='page_part' href='" + path  + "?page=" +count + "'>" + count + "</a>";
              }
            } else { 
              outstr = outstr + "<span class='current' >" + count + "</span>"; 
            } 
          } 
        } else if (totalpage > 10) {  //总页数大于十页 
          if (parseInt((cpage - 1)/10, 10) === 0) {             
            for (count = 1;count <= 10; count++) {
              if (count !== cpage) {
                if (query && query !== '') {
                  outstr = outstr + "<a class='page_part' href='" + path + "?" + query + "&page=" +count + "'>" + count + "</a>";         
                } else {
                  outstr = outstr + "<a class='page_part' href='" + path + "?page=" + count + "'>" + count + "</a>";
                }  
              } else { 
                outstr = outstr + "<span class='current'>"+count+"</span>"; 
              } 
            }
            if (query && query !== '') {

              outstr = outstr + "<a class='page_part_control'  href='" + path + "?" + query + "&page=" + count + "'><img src='/static/img/page_right.gif' alt='page_control'/></a>"; 
            } else {

              outstr = outstr + "<a class='page_part_control'  href='" + path + "?page=" + count + "'><img src='/static/img/page_right.gif' alt='page_control'/></a>"; 
            }  
          } else if (parseInt((cpage - 1)/10, 10) == parseInt(totalpage/10, 10)) {
              if (query && query !== '') {
                outstr = outstr + "<a class='page_part_control'  href='" + path + "?" + query + "&page=" + (parseInt((cpage-1)/10)*10) +"'><img src='/static/img/page_left.gif' alt='page_control'/></a>"; 
              } else {
                outstr = outstr + "<a class='page_part_control'  href='" + path + "?page=" + (parseInt((cpage-1)/10)*10) +"'><img src='/static/img/page_left.gif' alt='page_control'/></a>"; 
              }
              for (count=parseInt(totalpage/10)* 10 + 1;count <= totalpage; count++) {
                if (count != cpage) {
                  if (query && query !== '') {
                    outstr = outstr + "<a class='page_part' href='" + path + "?" + query + "&page=" +count + "'>" + count + "</a>";         
                  } else {
                    outstr = outstr + "<a class='page_part' href='" + path + "?page=" + count + "'>" + count + "</a>";
                  }    
                } else { 
                  outstr = outstr + "<span class='current'>"+count+"</span>"; 
                } 
              } 
            } else {
              if (query && query !== '') {
                outstr = outstr + "<a class='page_part_control'  href='" + path + "?" + query + "&page=" + (parseInt((cpage-1)/10)*10) + "'><img src='/static/img/page_left.gif' alt='page_control'/></a>"; 
              } else {
                outstr = outstr + "<a class='page_part_control'  href='" + path + "?page=" + (parseInt((cpage-1)/10)*10) + "'><img src='/static/img/page_left.gif' alt='page_control'/></a>"; 
              }
              for (count = parseInt((cpage-1)/10)*10+1;count<=parseInt((cpage-1)/10)*10+10;count++) {         
                  if (count !== cpage) {
                    if (query && queyr !== '') {
                      outstr = outstr + "<a class='page_part' href='" + path + "?" + query + "&page=" +count + "'>" + count + "</a>";         
                    } else {
                      outstr = outstr + "<a class='page_part' href='" + path + "?page=" + count + "'>" + count + "</a>";
                    }                  
                  } else { 
                    outstr = outstr + "<span class='current'>"+count+"</span>"; 
                  } 
                }
                if (query && query !== '') {
                  outstr = outstr + "<a class='page_part_control'  href='" + path + "?" + query + "&page=" + count + "'><img src='/static/img/page_right.gif' alt='page_control'/></a>"; 
                } else {
                  outstr = outstr + "<a class='page_part_control'  href='" + path + "?page=" + count + "'><img src='/static/img/page_right.gif' alt='page_control'/></a>"; 
                }
              } 
            }

            return "<div id='setpage'><span id='info'><!--共"+totalpage+"页|第"+cpage+"页--><\/span>" + outstr + "<\/div>";
          } else {
            return;
          }
        };                               


        // Handlebars template render
        sogoke.render = function(data, template_id) {
          var  template, source;

          if (typeof template_id === 'Object') {
            source = template_id.html();
          }  else {
            source = $(template_id).html();
          }

          //console.log(source);
          template = Handlebars.compile(source);

          return template(data);
        };


        // Valite email address using regrex
        sogoke.validateEmail = function(email) {
          var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test($.trim(email));
        };

        // Temporaty choice, there must be better one.
        sogoke.validateURL = function(textval) {
          var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
          return urlregex.test(textval);
        };

        //
        sogoke.showFntext2_notice = function(text, waiting, callback) {

          $('li#fntext2_notice > span.fntext2_notice_span').html(text);
          $('li#fntext2_notice').show();

          setTimeout(function() {
              $('li#fntext2_notice').fadeOut('slow');
              if (typeof callback === 'function') {
                callback.call();
              }
            }, waiting || 5000);
        };

        sogoke.showFntext2_bingo = function(text, waiting, callback) {

          $('li#fntext2_bingo > span.fntext2_notice_span').html(text);
          $('li#fntext2_bingo').show();

          setTimeout(function() {
              $('li#fntext2_bingo').fadeOut('slow');
              if (typeof callback === 'function') {
                callback.call();
              }
            }, waiting || 5000);
        };

        sogoke.showFntext2_error = function(text, waiting, callback) {

          $('li#fntext2_delete > span.fntext2_notice_span').html(text);
          $('li#fntext2_delete').show();

          setTimeout(function() {
              $('li#fntext2_delete').fadeOut('slow');
              if (typeof callback === 'function') {
                callback.call();
              }
            }, waiting || 5000);
        };        

        //
        sogoke.buildTagzy = function(tagName) {
          return '<span class="tagged">' + tagName + '<a href="#" title="delete">x</a></span>';
        };

        // Parse taggzy
        sogoke.parseTagzy = function(rawString) {
          var tagNames = [], i = 0;
          noCommaString = rawString.replace('/,/g', ' ');
          rawTagNames = noCommaString.split(' ');

          for (;i < rawTagNames.length; ++i) {
            if (rawTagNames[i].length > 0 && rawTagNames[i] !== ' ') {
              tagNames.push(rawTagNames[i]);  // Need $.trim?
            }
          }

          return tagNames;
        };

        // Parse photos suid
        sogoke.parsePhotos = function(rawString) {
          var photos = [], i = 0;
          rawPhotos = rawString.split(' ');

          for (;i < rawPhotos.length; ++i) {
            if (rawPhotos[i].length == 22) {
              photos.push(rawPhotos[i]);  // Need $.trim?
            }
          }

          return photos;
        };          

        //
        sogoke.getCookie = function(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie !== '') {
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
        };

        // A simple wrapper for jquery scroll object,
        // So we don't need use zebang's horrible code.
        sogoke.slider = function(options) {

          var slider = new ScrollPic();

          slider.scrollContId   = options.scrollContId || "ISL_Cont_1";
          slider.arrLeftId      = options.arrLeftId || "LeftArr";//左箭头ID
          slider.arrRightId     = options.arrRightId || "RightArr"; //右箭头ID
          slider.frameWidth     = options.frameWidth || 680;//显示框宽度
          slider.pageWidth      = options.pageWidth || 340; //翻页宽度
          slider.speed          = options.speed || 10; //移动速度(毫秒，越小越快)
          slider.space          = options.space || 680; //每次移动像素(单位px，越大越快)
          slider.autoPlay       = options.autoPlay || true; //自动播放
          slider.autoPlayTime   = options.autoPlayTime || 20; //自动播放间隔时间(秒)

          return slider;
        };

        // A simple wrapper for plupload initializer
        sogoke.uploader = function(options, onError, onFilesAdded, onFileUploaded) {
          var uploader = new plupload.Uploader({
              url : 'http://192.168.1.103:8000/upload-project-cover/',
              runtimes : sogoke.DEFAULT_RUNTIMES || options.runtimes,
              container: options.container || 'pickfiles_wrapper',
              browse_button : options.browse_button || 'pickfiles',
              max_file_size : sogoke.MAX_FILE_SIZE_OF_UPLOAD || options.max_file_size,
              flash_swf_url : '/static/js/libs/plupload/plupload.flash.swf',
              multipart: true || options.multipart,
              unique_names : false || options.unique_names,
              multiple_queues : false || options.multiple_queues,

              headers : {'X-Requested-With' : 'XMLHttpRequest',
                'X-CSRFToken' : options.csrf_token ? options.csrf_token : sogoke.getCookie('csrftoken')
            },

            filters : [{title : "Image files", extensions : "jpg,png,jpeg,gif,bmp,JPG,PNG,JPEG,GIF,BMP,pdf,tiff"}],

            init : options.init
        });

        // Flash run time dose not support chunk very well.   
        if (options.chunk_size) { uploader.chunk_size = options.chunk_size; }

        return uploader;
      };


      // A simple function to strip html tag in browser
      sogoke.stripNewLineHTML = function(html) {
        var newLineTags = /(<\/h\d>|<\/a>|<\/dd>|<\/dt>|<\/p>|<br\ \/>|<\/li>|<br>)/g;
        var multiNewLines = /\n+/g;
        return sogoke.stripHTML(html.replace(newLineTags, '\n').replace(multiNewLines, '\n'));
      };

      // A simple function to strip html tag in browser
      sogoke.stripHTML = function(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return $.trim(tmp.textContent || tmp.innerText);
      };

      sogoke.getLocation = function(defaultLocation) {
        return window.location.pathname.split('/')[1] || defaultLocation || 'index';
      };

      sogoke.search = function(query) {
      };

      //
      sogoke.renderMentions = function(rawComment, mentions) {
        var i = 0, comment, username, uid, link;

        if (mentions) {
          for (; i < mentions.length; ++i) {
            uid = mentions[i].uid;
            username = mentions[i].username;
            link = '<a href="/r/' + uid + '/">' + username + '</a>';
            comment = rawComment.replace('@' + username, '@' + link);
          }
        } else {
          comment = rawComment;
        }

        return comment;
      }

      //
      sogoke.C_slider = function(frame,list,Lframe,Llist,forwardEle,backEle,scrollType,LscrollType,acitonType,autoInterval){
        var i = 0;
        this.frame = frame;
        this.list = list;
        this.Lframe = Lframe;
        this.Llist = Llist;
        this.forwardEle = forwardEle;
        this.backEle = backEle;
        this.scrollType = scrollType;
        this.LscrollType = LscrollType;
        this.acitonType = acitonType;
        this.autoInterval = autoInterval;
        this.slideLength = $("#"+this.Llist+" > li").length;//总的slider数量
        this.currentSlide = 0;
        this.FrameHeight = $("#"+this.frame).height();
        this.FrameWidth = $("#"+this.frame).width();
        this.lFrameHeight = $("#"+this.Lframe).height();
        this.lFrameWidth = $("#"+this.Lframe).width();
        this.lListHeight = $("#"+this.Llist+" >li").eq(0).outerHeight(true);
        this.lListWidth = $("#"+this.Llist+" >li").eq(0).outerWidth(true);
        var self = this;
        for(;i < this.slideLength; i++) {
          $("#"+this.Llist+" > li").eq(i).data("index",i);
          $("#"+this.Llist+" > li").eq(i).bind(this.acitonType,function(){
              self.go($(this).data("index"));
          });
        }

        //给“上一个”、“下一个”按钮添加动作
        $("#"+this.forwardEle).bind('click',function(){
            self.forward();
            return false;
        });
        $("#"+this.backEle).bind('click',function(){
            self.back();
            return false;
        });
        //定论鼠标划过时，自动轮换的处理
        $("#"+this.frame+",#"+this.Lframe+",#"+this.forwardEle+",#"+this.backEle).bind('mouseover',function(){
            clearTimeout(self.autoExt);
        });
        $("#"+this.frame+",#"+this.Lframe+",#"+this.forwardEle+",#"+this.backEle).bind('mouseout',function(){
            clearTimeout(self.autoExt);
            self.autoExt = setTimeout(function(){
                //self.extInterval();
              },self.autoInterval);
        });
        //开始自动轮换
        this.autoExt = setTimeout(function(){
            //self.extInterval();
          },this.autoInterval);
      }


      //执行运动
      sogoke.C_slider.prototype.go = function(index){
        this.currentSlide = index;
        if (this.scrollType == "left"){
          $("#"+this.list).animate({
              marginLeft: (-index*this.FrameWidth)+"px"
            }, {duration:600,queue:false});
        } else if (this.scrollType == "top"){
          $("#"+this.list).animate({
              marginTop: (-index*this.FrameHeight)+"px"
            }, {duration:600,queue:false});
        }
        $("#"+this.Llist+" > li").removeClass("cur");
        $("#"+this.Llist+" > li").eq(index).addClass("cur");
        //对于缩略图的滚动处理
        if(this.LscrollType == "left"){
          if(this.slideLength*this.lListWidth > this.lFrameWidth){
            var spaceWidth = (this.lFrameWidth - this.lListWidth)/2;
            var hiddenSpace = this.lListWidth*this.currentSlide - spaceWidth;
            if (hiddenSpace > 0){
              if(hiddenSpace+this.lFrameWidth <= this.slideLength*this.lListWidth){
                $("#"+this.Llist).animate({
                    marginLeft: -hiddenSpace+"px"
                  }, {duration:600,queue:false});
              } else {
                var endHidden = this.slideLength*this.lListWidth - this.lFrameWidth;
                $("#"+this.Llist).animate({
                    marginLeft: -endHidden+"px"
                  }, {duration:600,queue:false});
              }
            } else {
              $("#"+this.Llist).animate({
                  marginLeft: "0px"
                }, {duration:600,queue:false});
            }
          }
        } else if (this.LscrollType == "top"){
          if(this.slideLength*this.lListHeight > this.lFrameHeight){
            var spaceHeight = (this.lFrameHeight - this.lListHeight)/2;
            var hiddenSpace = this.lListHeight*this.currentSlide - spaceHeight;
            if (hiddenSpace > 0){
              if(hiddenSpace+this.lFrameHeight <= this.slideLength*this.lListHeight){
                $("#"+this.Llist).animate({
                    marginTop: -hiddenSpace+"px"
                  }, {duration:600,queue:false});
              } else {
                var endHidden = this.slideLength*this.lListHeight - this.lFrameHeight;
                $("#"+this.Llist).animate({
                    marginTop: -endHidden+"px"
                  }, {duration:600,queue:false});
              }
            } else {
              $("#"+this.Llist).animate({
                  marginTop: "0px"
                }, {duration:600,queue:false});
            }
          }
        }
      };

      //前进
      sogoke.C_slider.prototype.forward = function(){
        if(this.currentSlide<this.slideLength-1){
          this.currentSlide += 1;
          this.go(this.currentSlide);
        }else {
          this.currentSlide = 0;
          this.go(0);
        }
      };
      //后退
      sogoke.C_slider.prototype.back = function(){
        if(this.currentSlide>0){
          this.currentSlide -= 1;
          this.go(this.currentSlide);
        }else {
          this.currentSlide = this.slideLength-1;
          this.go(this.slideLength-1);
        }
      };
      //自动执行         

      global.sogoke = sogoke;

  })(window);
