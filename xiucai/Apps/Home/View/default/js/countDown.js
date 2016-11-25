// 倒计时
(function($){
    $.fn.Countdown=function(current_time){
        var data="";
        var _DOM=null;
        var TIMER;
        createdom =function(dom){
            _DOM=dom;
            data=$(dom).attr("data");
            data = data.replace(/-/g,"/");
            data = Math.round((new Date(data)).getTime()/1000);
            $(_DOM).append("<i class='hour'></i><i class='split'>：</i><i class='min'></i><i class='split'>：</i><i class='sec'></i>")
            reflash();

        };
        reflash=function(){
            var range   = data-current_time,
                secday = 86400, sechour = 3600,
                days    = parseInt(range/secday),
                hours   = parseInt((range%secday)/sechour),
                min     = parseInt(((range%secday)%sechour)/60),
                sec     = ((range%secday)%sechour)%60;
            // $(_DOM).find(".day").html(nol(days));

            //倒计时为零时判断
            if(hours == 0 && min == 0 && sec == 0){
                clearInterval(TIMER); //清除定时器
                document.location.reload();
            }

            //倒计时小于零时判断
            if(sec < 0){
                if(min <= 0){
                    if(hours <= 0){
                        clearInterval(TIMER); //清除定时器
                        $(_DOM).html("限免结束");
                        /*$(_DOM).find(".hour").html('00');
                        $(_DOM).find(".min").html('00');
                        $(_DOM).find(".sec").html('00');*/
                        return false;
                    }
                }
            }
            /*if(hours < 0 && min < 0 && sec < 0){
                clearInterval(TIMER); //清除定时器
                return false;
            }*/

            $(_DOM).find(".hour").html(nol(hours));
            $(_DOM).find(".min").html(nol(min));
            $(_DOM).find(".sec").html(nol(sec));
            current_time++;

        };
        TIMER = setInterval( reflash,1000 );
        nol = function(h){
            return h>9?h:'0'+h;
        }
        return this.each(function(){
            var $box = $(this);
            createdom($box);
        });
    }
})(jQuery);