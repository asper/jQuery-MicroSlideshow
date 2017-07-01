(function($){
  $.fn.microslideshow = function(action, options) {
    
    if($.type(action) == 'object'){
      options = action;
      action = 'init';
    }
    
    if(!action){
      action = 'init';
    }
          
    return this.each(function(i, el){
      
      var $el = $(el);
      var data = $el.data();
      
      if(action == 'init'){
        
        if(!options){
          options = {};
        }
        data.microslideshow = {
          current: 0,
          timer: null,
          slides: $el.children(),
            options : $.extend({
              autoplay: true,
              duration: 1500,
              delay: 5000,
              transition: 'fade'
            }, options)
        };
        data.microslideshow.slides.each(function(slideIndex, slide){
          if(slideIndex){
            $( slide).detach();
          }
        });
        if(data.microslideshow.options.autoplay){
          $el.trigger('microslideshow.beforeInitialPlay');
          $el.microslideshow('play');
          $el.trigger('microslideshow.afterInitialPlay');
        }
        $el.trigger('microslideshow.afterInitialize');
          
      } else if(action == 'play'){
        
        $el.microslideshow('pause');
        $el.trigger('microslideshow.beforePlay');
        var nextFunction = function(){
          $el.microslideshow('next');
          data.microslideshow.timer = setTimeout(nextFunction, data.microslideshow.options.delay);
        };
        data.microslideshow.timer = setTimeout(nextFunction, data.microslideshow.options.delay);
        $el.trigger('microslideshow.afterPlay');
            
      } else if(action == 'pause'){
        
        $el.trigger('microslideshow.beforePause');
        clearInterval(data.microslideshow.timer);  
        $el.trigger('microslideshow.afterPause');
        
      } else if(action == 'next'){
        
        var next = data.microslideshow.current + 1;
        if(next == data.microslideshow.slides.length){
          next = 0;
        }
        $el.trigger('microslideshow.beforeNext');
        $el.microslideshow('show', next); 
        $el.trigger('microslideshow.afterNext');
        
      } else if(action == 'prev') {
        
        var prev = data.microslideshow.current - 1;
        if(prev < 0){
          prev = data.microslideshow.slides.length - 1;
        }
        $el.trigger('microslideshow.beforePrev');
        $el.microslideshow('show', prev); 
        $el.trigger('microslideshow.afterPrev');
            
      } else if(action == 'show') {
        
        var slideNumber = options;
        if(data.microslideshow.current == slideNumber || !data.microslideshow.slides.eq(slideNumber)){
          return;
        }
        var $current = data.microslideshow.slides.eq(data.microslideshow.current);
        $current.stop();
        $el.trigger('microslideshow.beforeShow', [slideNumber]);
        var $slide = data.microslideshow.slides.eq(slideNumber);
        if('fade' == data.microslideshow.options.transition){
          $slide.css('opacity', 0);
          $slide.appendTo($el);
          $slide.animate(
            {
              opacity: 1
            }, 
            {
              duration: data.microslideshow.options.duration,
              complete: function(){
                $current.detach();
                data.microslideshow.current = slideNumber;
                $el.trigger('microslideshow.afterShow');
              }
            }
          );
        } else if('slide_left' == data.microslideshow.options.transition) {
          $slide.css({
            opacity: 0,
            left: '100%'
          });
          $slide.appendTo($el);
          $current.animate(
            {
              left: '-100%', 
              opacity: 0
            }, 
            {
              duration: data.microslideshow.options.duration, 
              queue: false
            }
          );
          $slide.animate(
            {
              left: 0, 
              opacity: 1
            }, 
            {
              duration: data.microslideshow.options.duration, 
              queue: false, 
              complete: function(){
                $current.detach();
                $slide.css('left', 0);
                data.microslideshow.current = slideNumber;
                $el.trigger('microslideshow.afterShow');
              }
            }
          );
        }
      } else if(action == 'slide') {
        
        var slideNumber = options;
        var current = data.microslideshow.current;
        var length = data.microslideshow.slides.length;
        if(!slideNumber || slideNumber == 'current'){
          slideNumber = current;
        }
        else if(slideNumber == 'next'){
          slideNumber = current+1;
          if(slideNumber == length){
            slideNumber = 0;
          }
        }
        else if(slideNumber == 'previous'){
          slideNumber = current-1;
          if(slideNumber < 0){
            slideNumber = length-1;
          }
        }
        else if(slideNumber == 'first'){
          slideNumber = 0;
        }
        else if(slideNumber == 'last'){
          slideNumber = length-1;
        }
        var $slide = data.microslideshow.slides.eq(slideNumber);
        if(!$slide){
          return false;
        }
        return $slide;
        
      }
    });
  };
}(jQuery));
