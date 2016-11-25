$(function () {
    //录播课听课码按钮触发事件
    $('#open-course-code-btn').click(function(){
        //检查是否登录
        if (memberId == 0 || memberId == '') {
            var $dialog = $('#course-detail-login-layer');
            $dialog.find('.course-detail-login-tips').html('未登录状态不能使用听课码，马上登录吧');
        }else if(hasTicket == 1){
            var $dialog = $('#course-code-ticket-layer');
        }else{
            var $dialog = $('#opening-course-code-layer');
            $('.ipt-group input').val('');//初始化听课码弹层的输入框
            $('.course-code-error-info').html(''); //初始化听课码弹层的错误提示信息
        }

        toggleCourseLayer($dialog);
    });

    //暂不使用听课券,暂不使用听课码开通课程
    $('.not-use-ticket').click(function(){
        var $dialog = $('#opening-course-code-layer');
        toggleCourseLayer($dialog);
    });

    //暂不使用听课码引导用户去开通会员
    $('.not-open-course-code').click(function(){
        var $dialog = $('#course-detai-vip-layer');
        toggleCourseLayer($dialog);
    });

    //课程码输入框输入状态清除错误提示信息
    $('.course-code-input').keyup(function(){
        $('.course-code-error-info').html('');
    });


    //视频课程评价弹层
    $('.course-evaluate-tab').click(function(){
        //检查是否登录
        if (memberId == 0 || memberId == '') {
            var $dialog = $('#course-detail-login-layer');
            $dialog.find('.course-detail-login-tips').html('未登录状态不能评价该课程，马上登录吧');
        }else if(joinFlag == false){
            var $dialog = $('#course-detai-permission-layer');
        }else if(hasEvaluateFlag == 1){
            var $dialog = $('#course-evaluated-layer');
        }else{
            var $dialog = $('#course-evaluate-layer');
        }

        toggleCourseLayer($dialog);
    });

    $('.closeLiveWechatNoticeDiv').on('click',function(){
        $('#liveWechatNoticeDiv').hide();
        $('.overlay').hide();
    });
});

//视频课程页面弹层显示隐藏
function toggleCourseLayer($dialog){
    if(memberId == 0 || memberId == ''){
        $('.layer').show();
        $('#course-detail-play-video').addClass('blurry');
        $('.course-detail-layer').animate({"top":"450px"},100).hide(); //隐藏所有视频页面弹层
        $dialog = $('#course-detail-login-layer');
        $dialog.css({"display":"block"});
        $dialog.animate({"top":"0"},400);

        return false;
    }

    if(!$dialog.is(":animated")){
        if(parseInt($dialog.css("top")) > 0){
            $('.layer').show();
            $('#course-detail-play-video').addClass('blurry');
            $('.course-detail-layer').animate({"top":"450px"},100).hide(); //隐藏所有视频页面弹层
            $dialog.css({"display":"block"});
            $dialog.animate({"top":"0"},400);
        }else{
            if(joinFlag == false){
                $('.layer').show();
                $('#course-detail-play-video').addClass('blurry');
                $('.course-detail-layer').animate({"top":"450px"},100).hide(); //隐藏所有视频页面弹层
                $dialog = $('#course-detai-vip-layer');
                $dialog.css({"display":"block"});
                $dialog.animate({"top":"0"},400);

                return false;
            }

            $('#course-detail-play-video').removeClass('blurry');
            $dialog.animate({"top":"450px"},400,function(){
                $dialog.css({"display":"none"});
                $('.layer').hide();
                $('.course-detail-layer').hide(); //隐藏所有视频页面弹层
            });
        }
    }
}

// 关闭弹层
$("span.close, .i-know").click(function(){
    var $dialog = $(this).parents('.course-detail-layer');
    toggleCourseLayer($dialog);
});

//课程大纲
function showChapter(){
    $("#chapterList").show();
    $(".overlay").show();
}


