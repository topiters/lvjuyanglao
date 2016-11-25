/**
 * Created by Administrator on 15-7-9.
 */
$(function(){
    $(window).scroll(function(){
        if($(document).height() - $(this).scrollTop() - $(this).height() < 300){
            if(loadInfo.hasMore && !loadInfo.isLoading){
                loadInfo.isLoading = true;
                    $.post(get_more_zt,{'page':loadInfo.page},function(data){
                        if(data.code == 200){
                            if(data.restCount > 0){
                                loadInfo.page++;
                                loadInfo.hasMore = (data.restCount >= loadInfo.limit) ? true : false;
                                $(".course").append(data.html);
                            }else{
                                loadInfo.hasMore = false;
                            }
                            loadInfo.isLoading = false;

                        }else if(data.code == 404){
                            loadInfo.hasMore = false;
                            return false;
                        }else if(data.code == 300){
                            dialog_alert(data.msg);
                            return false;
                        }
                    });
            }
        }
    });
});
$(".course").on("mouseenter",".list-box",function(){
    $(this).children(".hover-layer").show();
    show_count(this);
});
$(".course").on("mouseleave",".list-box",function(){
    $(this).children(".hover-layer").hide();
    $(this).children(".count").html('');
});
$(".course").on("click",".list-box",function(){
    var new_win=window.open();
    var url=$(this).find(".click-to-detail").attr("href");
    new_win.location.href=url;
});
$(".course").on("click",".list-box a",function(e){
    e = e||window.event;
    if(e.stopPropagation) { //W3C阻止冒泡方法
         e.stopPropagation();
    } else {
         e.cancelBubble = true; //IE阻止冒泡方法
    }
});
function show_count(obj){
    var ele=$(obj).find(".count");
    var start=[];
    var end=ele.data("count").toString();
    end=end.split("");
    var len=start.length=end.length;
    var timer=setInterval(function(){
        for(var i=0;i<len;i++){
            if(start[i]=="undefined"||start[i]==null){
                start[i]=0;
            }
            start[i]==0?((start[i]==end[i])?start[i]=end[i]:start[i]++):(start[i]<end[i]?start[i]++:end[i]);
        }
        if(start.join('')<end.join('')){
            ele.html(start.join(''));
        }else{
            ele.html(start.join(''));
            clearInterval(timer);
        }

    },50);
}