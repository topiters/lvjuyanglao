var intID;
var player;
var playTime;
var totalLength = 0;
var flashFlag = true;

//字符编码转换
function toUtf8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}

//IE8以下版本浏览器替换所有href属性
function reHref(){
    var msie=navigator.userAgent.toString();
    var ie=/\d+.\d(?=;\sWindows)/ig;
    if(msie.match(ie)&&msie.match(ie)<=10){
        var reg=/^\s?javascript:;?$/i;
        $("a").each(function(a,b){
            var href=$(b).attr("href");
            if(reg.test(href)){
                $(b).attr("href","###");
            }
        });
    }
}

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

//TODO:播放器
/*window.onload=function(){
    if( !isMobile.any()) {
        intID = setInterval(function () {
            try {
                if (!player || !videoInfo || totalLength == 0) {
                    var id = $("[id^=playerbox]").find("[id^=player]");
                    player = document.getElementById(id);
                    var videoInfo = player['getVideoSetting']();
                    totalLength = parseInt(videoInfo.duration) - 1;
                }
                playTime = player["getVideoTime"]();
            } catch (e) {
            }
            if(flashFlag){
                showFlashTips();
                flashFlag=false;
            }

            //flash加载失败判断
            if(typeof playTime=="undefined")
                hasLoadFlashFlag = false;
            else
                hasLoadFlashFlag = true;

            console.log(playTime+'-'+totalLength);
            if (playTime > 0 && playTime >= totalLength && totalLength > 0) {
                clearInterval(intID);
                if($('#play-video-menu-list').find('.play').hasClass('last-video')){
                    completePlay(currentChapterId, 1);
                }else{
                    completePlay(currentChapterId, 0);
                }
            }
        }, 1000)
    }
}*/

//小节学完操作
function completePlay(){
    var is_complete = $('#play-video-menu-list').find('.play').data('play-chapter');
    if(is_complete == 'last'){
        //学习到最后一个小节
        if(hasEvaluateFlag == 1){
            var $dialog = $('#complete-study-course-layer');
        }else{
            var $dialog = $('#course-evaluate-layer');
        }
        toggleCourseLayer($dialog);
        return;
    }else{
        if(isCollect == 0){
            var $dialog = $('#course-detai-vip-layer');
            toggleCourseLayer($dialog);
            return;
        }else {
            playVideo($('#play-video-menu-list').find('.play').next());
        }
    }
}

//视频播放页检查是否登录
function courseDetailLogin(){
    var $dialog = $('#course-detail-login-layer');
    $dialog.find('.course-detail-login-tips').html('立即登陆，畅听精彩课程');
    toggleCourseLayer($dialog);
    return false;

}

//播放视频
function playVideo(_this){
    if(_this.hasClass('play'))
        return false;

    $('.layer').hide();
    $('.course-detail-layer').hide();
    $('#course-detail-play-video').removeClass('blurry');

    //检查是否登录
    if (memberId == 0 || $.trim(memberId) == '') {
        var $dialog = $('#course-detail-login-layer');
        $dialog.find('.course-detail-login-tips').html('立即登陆，畅听精彩课程吧');
        toggleCourseLayer($dialog);
        return false;
    }
    //用户只收藏了课程并没有实际报名
    if((isClassCourse == false && isCompanyUser == false && (isCollect == 'false' || isCollect == false || isJoinCourse == false || isJoinCourse == 'false')) || (isClassCourse == true && isLearnClassCourse == false) || (isCompanyCourse == true && isLearnCompanyCourse == false)){
        if(hasTicket == 1){
            var $dialog = $('#course-code-ticket-layer');
        }else{
            var $dialog = $('#course-detai-vip-layer');
        }

        toggleCourseLayer($dialog);
        return false;
    }
    //判断用户是否有权限听课,有听课权限则跳转选定章节播放
    $.post(is_join_course_url, function (data) {
        if(data.code == 200){
            playChapter = _this.data('play-chapter');
            _this.addClass('play').siblings().removeClass('play');
            _this.parents("ul").find(".play-icon").removeClass('play-icon');
            _this.find("p:first-child").addClass('play-icon');

            //跳转地址
            var chapter_id = _this.data('chapter-id');
            var classCourseId = _this.data('class-course-id');
            var play_url = course_play_video_url+'?chapterId='+chapter_id+'&courseId='+courseInfo.courseId;
            if(classCourseId!=''){
                play_url += "&classCourseId="+classCourseId;
            }
            if(companyCourseId!=''){
                play_url += "&companyCourseId="+companyCourseId;
            }
            $('#course-detail-play-video').attr('src', play_url);
            currentChapterId = _this.data('chapter-id');
        }else{
            dialog_alert(data.msg);
        }
    });
}

//TODO:flash版本过低或错误提示
function showFlashTips(){
    var wait;
    setTimeout(function(){
        wait=setInterval(function(){
            if(typeof playTime == "undefined"){
                if($(window.frames["courseDetailPlayIframe"].document).find("object").length>0){
                    $(".leshi:hidden").hide();
                    $(".flash-error:hidden").show();
                    hasLoadFlashFlag = false;
                }else {
                    $(".leshi:hidden").show();
                }
            }else{
                $(".flash-error:visible").hide();
                $(".leshi:hidden").hide();
                clearInterval(wait);
                showFlashTips=function(){};
                hasLoadFlashFlag = true;
            }
        },1000);
    },2000);
}
$("body").on("click",".flash-tips-title .close",function(){
    clearInterval(wait);
    $(this).parents(".flash-tips").remove();
});
var isSubmitLogin = false;
$(function () {
    //reHref(); //IE8以下版本浏览器替换所有href属性

    //课程评价星级
    $('.star-rate-content').raty({ width: 160, half: true, hints: ['不是很好', '凑合看吧', '学到一二', '受益匪浅', '膜拜前辈'], mouseover: function() { $('.star-rate-content-tips').hide(); }});
    $('.star-rate-speak').raty({ width: 160, half: true, hints: ['有待改进', '凑合听懂', '深有感触', '高手水平', '大师水准'], mouseover: function() { $('.star-rate-speak-tips').hide(); }});
    $('.star-rate-listen').raty({ width: 160, half: true, hints: ['无法观看', '经常卡顿', '偶尔卡顿', '正常观看', '灰常流畅'], mouseover: function() { $('.star-rate-listen-tips').hide(); }});

    //评价提交按钮
    $('.course-evaluate-btn').click(function(){
        evaluateParam.rateContent = $.trim($('#course-evaluate-layer .star-rate-content').find('input[name=score]').val());
        evaluateParam.rateSpeak = $.trim($('#course-evaluate-layer .star-rate-speak').find('input[name=score]').val());
        evaluateParam.rateListen = $.trim($('#course-evaluate-layer .star-rate-listen').find('input[name=score]').val());
        if(evaluateParam.rateContent == '' || evaluateParam.rateContent == 0){
            $('.star-rate-content-tips').show();
            return false;
        }else if(evaluateParam.rateSpeak == '' || evaluateParam.rateSpeak == 0){
            $('.star-rate-speak-tips').show();
            return false;
        }else if(evaluateParam.rateListen == '' || evaluateParam.rateListen == 0){
            $('.star-rate-listen-tips').show();
            return false;
        }

        //建议内容过滤字符处理，长度限制处理
        evaluateParam.otherSuggest = $.trim($('.evaluate-mark-suggest').val());
        if(evaluateParam.otherSuggest != ''){
            evaluateParam.otherSuggest = removeHTMLTag(evaluateParam.otherSuggest);
            $('.mark-other-suggest').val(evaluateParam.otherSuggest);
        }
        if(evaluateParam.otherSuggest.length > 500){
            dialog_alert('建议内容不能超过500字');
            return false;
        }

        //邮箱验证处理
        evaluateParam.markEmail = $.trim($('.evaluate-mark-email').val());
        if(evaluateParam.markEmail != ''){
            if(checkEmail(evaluateParam.markEmail) == false){
                dialog_alert('请输入正确的邮箱格式');
                return false;
            }
        }

        if (!isSubmitLogin) {
            isSubmitLogin = true;
            $.post(course_evaluate_url,{evaluateParam: evaluateParam},
                function(result){
                    if(result.code == 200){
                        hasEvaluateFlag = 1;
                        var $dialog = $('#course-evaluated-layer');
                        var rateContentScore = Math.round(parseFloat(evaluateParam.rateContent));
                        var rateSpeakScore = Math.round(parseFloat(evaluateParam.rateSpeak));
                        var rateListenScore = Math.round(parseFloat(evaluateParam.rateListen));
                        $dialog.find('.star-rate-content').data('number', rateContentScore);
                        $dialog.find('.star-rate-speak').data('number', rateSpeakScore);
                        $dialog.find('.star-rate-listen').data('number', rateListenScore);

                        if(evaluateParam.otherSuggest == ''){
                            $dialog.find('.pingjia').hide();
                            $dialog.find('.dafen').addClass('single');
                        }else
                            $dialog.find('.pj-advise').html(evaluateParam.otherSuggest);

                        $('.course-evaluate-tab').html('<i></i>我的评价');
                        $('.course-evaluate-tab').addClass('active'); //已评价class
                        $('.rated-panel .star-rate-content').raty({ width: 160, half: true, readOnly: true, score: evaluateParam.rateContent, number: function() { return $dialog.find('.star-rate-content').data('number');} });
                        $('.rated-panel .star-rate-speak').raty({ width: 160, half: true, readOnly: true, score: evaluateParam.rateSpeak, number: function() { return $dialog.find('.star-rate-speak').data('number');} });
                        $('.rated-panel .star-rate-listen').raty({ width: 160, half: true, readOnly: true, score: evaluateParam.rateListen, number: function() { return $dialog.find('.star-rate-listen').data('number');} });
                        toggleCourseLayer($dialog);
                    }else if(result.code == 300){
                        if(result.tips == 1)
                            $('.star-rate-content-tips').show();
                        else if(result.tips == 2)
                            $('.star-rate-speak-tips').show();
                        else if(result.tips == 3)
                            $('.star-rate-listen-tips').show();
                    }else{
                        dialog_alert(result.msg);
                    }
                    isSubmitLogin = false;
                }
            );
        }
    });

    //播放小节视屏
    $('.play-video').click(function(){
        //检查是否登录
        if (memberId == 0 || $.trim(memberId) == '') {
            var $dialog = $('#course-detail-login-layer');
            $dialog.find('.course-detail-login-tips').html('未登录状态无法观看课程哦！');
            toggleCourseLayer($dialog);
            return false;
        }else if(joinFlag == false){
            if(courseAuthority == false && isClassCourse == false && isCompanyUser == false){
                return false;
            }else{
                $('.layer').show();
                $('#course-detail-play-video').addClass('blurry');
                $('.course-detail-layer').hide(); //隐藏所有视频页面弹层
                $('#course-detai-vip-layer').show();
                $('#course-detai-vip-layer').css({"display":"block"});
                $('#course-detai-vip-layer').animate({"top":"0"},400);
            }
            return false;
        }
        playVideo($(this));
    });

    //检查flash
    var version = deconcept.SWFObjectUtil.getPlayerVersion();
    if(!isMobile.any() && version["major"] == 0){
        $(".video_player").addClass("video_player_null");
        $(".flash-error").show();
        $(".video_catalog").remove();
    }
    else {
        var timeID = "";
        var hoverID = "";
        var playID = "";
        function Stopinplay(){
            var ikey = 0;
            var imouse = 0;
            var itime = 60 * 10;
            $('.video_player').onmousemove = function(){
                imouse = 1;
            }
            $('.video_player').onkeydown = function(){
                ikey = 1;
            }
            hoverID=setTimeout(function(){
                if(imouse == 0){
                    $('.video_catalog').animate({right: '-260px'});
                }
            },5000);
        };
        $('.video_player').mouseenter(function () {
            window.clearTimeout(playID)
            $(this).css("cursor", "pointer");
            $('.video_catalog').stop().animate({right: "0px"});
            Stopinplay();
        });
        $('.video_player').mouseleave(function(){
            timeID=setTimeout(function(){
                $('.video_catalog').stop().animate({right:"-260px"});
            },0);
        });
        $('.video_catalog').mouseenter(function () {
            window.clearTimeout(hoverID);
            window.clearTimeout(timeID);
        });
        $('.video_catalog').mouseleave(function () {
            playID=setTimeout(function(){
                $('.video_catalog').stop().animate({right: "-260px"});
            },0);
        });

        $player = $("[data-video-id]");
        if ($player.length > 0) {
            coursePlayer.play('course_player', $player.data('video-id'));
        }
    }

    var timer = null;
    $(".course-video .share").on("mouseenter", function () {
        clearTimeout(timer);
        $(this).find(".wx-qq").fadeIn(200);
    }).on("mouseleave", function () {
        var wx_qq = $(this).find(".wx-qq");
        clearTimeout(timer);
        timer = setTimeout(function () {
            wx_qq.fadeOut(200);
        },400);
    });
    $(".course-video .wx-qq").on("mouseenter",function () {
        clearTimeout(timer);
    }).on("mouseleave",function () {
        var wx_qq = $(this);
        clearTimeout(timer);
        timer = setTimeout(function () {
            wx_qq.fadeOut(200);
        },400);
    });

    $("http://assets.xiucai.com/assets/js/.info-right a.no").on("mouseenter",function () {
        $(this).find("span").css({"display":"block"});
    }).on("mouseleave",function () {
        $(this).find("span").css({"display":"none"});
    });

    //立即学习 会员免费观看
    $('.now-to-learn').on('click', function(){
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        if(needBindPhone == 1){
            showBindPhone();
            return false;
        }

        if (!isSubmitLogin) {
            isSubmitLogin = true;
            $.post(courseLearnUrl,
                function(result){
                    if(result.code == 200){
                        window.location.reload();
                    }else{
                        dialog_alert(result.msg);
                    }
                    isSubmitLogin = false;
                }
            );
        }
    });

    //显示课程大纲（章节）
    $(document).on('click', '.course-info-box .course-chapter-view', function(){
        showChapter();
    });

    //播放试听课程
    $(document).on('click', '.play-free-video', function(){
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        if(needBindPhone == 1){
            showBindPhone();
            return false;
        }

        var chapterId = $(this).data('video-id');
        var freeVideoUrl = '/course/free_play/?chapterId='+chapterId;
        $.post(freeVideoUrl,
            function(result){
                if(result.code == 200){
                    $('#play-free-iframe').prev().prev().hide();
                    $('#play-free-iframe').prev().hide();
                    $('#play-free-iframe').show();
                    $('#play-free-iframe').attr('src', freeVideoUrl);
                }else if(result.code == 301){
                    showLogin();
                }else{
                    dialog_alert(result.msg);
                }
            }
        );
    });

    //渲染笔记编辑器
    if($("#set-note-content").length > 0) {
        htmlEditor = UE.getEditor('set-note-content', {
            autoHeight: false,
            initialFrameWidth: '100%',
            toolbars: [["bold", "italic", "underline", "forecolor", "rowspacingtop", "lineheight", "simpleupload"]]
        });

        //初始化笔记模板
        htmlEditor.ready(function() {
            htmlEditor.setContent($('#show-note-content').html());
        });
    }

});
//编辑或发表课程笔记
$(document).on('click', '#set-note-btn', function(){
    var contentTxt = htmlEditor.getContentTxt();
    var content = htmlEditor.getContent();
    if (htmlEditor.hasContents()) {
        if(contentTxt == ''){
            $.xcDialog.alert({'content':'请输入笔记内容'});
            return false;
        } else if(contentTxt.length < 50){
            $.xcDialog.alert({'content':'笔记内容不少于50字'});
            return false;
        }else if(contentTxt.length > 2000){
            $.xcDialog.alert({'content':'笔记内容不超过2000字'});
            return false;
        }
    }else{
        $.xcDialog.alert({'content':'请输入笔记内容'});
        return false;
    }
    $.post(companySetNoteUrl,
        {
            companyCourseId: companyCourseId,
            content: content,
            content_txt: contentTxt
        },
        function (data) {
            if(data.code == 200){
                $('http://assets.xiucai.com/assets/js/.bd .edit-wrap .save').hide();
                $('http://assets.xiucai.com/assets/js/.bd .edit-wrap .edit').show();
                $('#show-note-content').html(content);
                $.xcDialog.alert({'content':data.msg});
            }else{
                $.xcDialog.alert({'content':data.msg});
            }
        }
    );
});
$(document).on('click', '#edit-note-btn', function(){
    $('#set-note-content').show();
    $('#show-note-content').hide();
    $('#edit-note-btn').hide();
    $('#set-note-btn').show();
})