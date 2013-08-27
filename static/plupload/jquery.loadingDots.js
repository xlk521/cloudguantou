(function($) {

    $.loadingDots = function(el, options) {

      var base = this;

      base.$el = $(el);

      base.oldWord = base.$el.val();

      base.$el.data("loadingDots", base);

      base.stopInterval = function() {    
        clearInterval(base.theInterval);
        base.$el.val(base.oldWord);
      };

      base.dotItUp = function() {
        base.i = ++base.i % 4;
        base.$el.val(base.options.word + Array(base.i+1).join("."));     
      };

      base.init = function() {
        base.i = 0;
        base.options = $.extend({},$.loadingDots.defaultOptions, options);
        base.theInterval = setInterval(base.dotItUp, base.options.speed);

      };

      base.init();
    };

    $.loadingDots.defaultOptions = {
      speed: 500,
      maxDots: 3,
      word: "Loading"
    };

    $.fn.loadingDots = function(options) {

      if (typeof(options) == "string") {  // Maybe need more specific?
        var safeGuard = $(this).data('loadingDots');
        if (safeGuard) {
          safeGuard.stopInterval();
        }
      } else { 
        return this.each(function(){
            (new $.loadingDots(this, options));
        });
      } 
    };

})(jQuery);
