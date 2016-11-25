    // 个人主页鼠标滑过头像显示更换头像
    $(".user-head").hover(function(){
        $(this).find(".head-mask90").show();
    },function(){
        $(this).find(".head-mask90").hide();
    })

// 个人主页tab
$(".course-navigation a").click(function(){
    $(this).addClass('curr').siblings().removeClass('curr');
    $(this).children('div.classify-line').removeClass('hide').parents().siblings().children('div.classify-line').addClass('hide');
})

// 二级导航切换
$(".hp-r-nav li a").click(function(event) {
    $(this).parent().addClass("cur").siblings().removeClass("cur");
});

    $(function(){
        // 秀财直播轮播
        jQuery(".live-slider").slide({mainCell:".bd ul",effect:"left",easing:"easeOutCirc",delayTime:1000,interTime:3000,autoPlay:true});
    })