// 倒计时
(function($){
    $.fn.Countdown=function(){
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
            var range   = data-CURRENTTIME,
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
                        $(_DOM).find(".hour").html('00');
                        $(_DOM).find(".min").html('00');
                        $(_DOM).find(".sec").html('00');
                        $('.time-down').find('.freetime').remove();
                        return false;
                    }
                }
            }

            $(_DOM).find(".hour").html(nol(hours));
            $(_DOM).find(".min").html(nol(min));
            $(_DOM).find(".sec").html(nol(sec));
            CURRENTTIME++;

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

$(function () {
    // 展开课程评价详情
    $(document).on('click', '.unfold', function() {
        $(this).parent().html($(this).parent().data("content"));
    });

    // 好评度选择
    $(document).on('click', '.choose-eva .radio', function(event) {
        event.preventDefault();
        if($(this).hasClass('radio-chked'))
            return;

        $('#course-evaluate-box').find('.evaluate-content').html('');
        $(this).addClass('radio-chked').siblings().removeClass('radio-chked');

        evaluateParam.page = 1;
        evaluateParam.hasMore = true;
        evaluateParam.eType = $(this).data('e-type');
        loadCourseEvaluate();
    });

    // 展开问答详情
    $(document).on('click', '.unfold-ask', function() {
        $(this).hide();
        $(this).parent().find("span").html($(this).parent().find("span").data("content"));
    });

    // 提问框提示文字
    $(".ask-tips").on('click', function(event) {
        $(this).fadeOut();
        $(this).parent().find(".ipt-ask").focus();
    });

    $(".ipt-ask").blur(function(event) {
        if(!$(this).val()){$(this).parent().find(".ask-tips").fadeIn();}
    });

    // 快速提问
    $(".v-qu-ask").on('click', function(event) {
        if($(".ipt-ask").hasClass("animate")){$(".ipt-ask").removeClass("animate")};
        var thread_title = trim($(".ipt-ask").val());
        if($(".ask-tips").is(":visible") || !thread_title || thread_title == ''){
            $(".ipt-ask").addClass("blur animate");
            return false;
        }

        $(".ipt-ask").removeClass("blur");
        if (!isLoadding) {
            isLoadding = true; //防止多次触发事件

            //滚动加载更多以及回复
            $.post(course_Ask_url+'?v='+Math.random(),
                {
                    instructor_m_id: courseAskParam.instructor_m_id,
                    course_type: courseAskParam.courseType,
                    course_id: courseAskParam.courseId,
                    thread_title: thread_title,
                    class_id: courseClassId,
                    company_id:courseCompanyId
                },function (result) {
                    isLoadding = false;
                    if(result.code == 200){
                        $(".ipt-ask").val('');
                        $.xcDialog.alert({'content':'提问成功'});

                        //清除内容区域空数据提醒
                        $('#course-askTutor-box .evaluate-content').find('.no-class').remove();

                        //显示同行在问tab
                        $('.jason-details-tab').hide();
                        $('#course-askTutor-box').show();
                        $('#course-detail-askTutor-tab').addClass('cur').siblings().removeClass('cur');

                        //判断是否有加载过同行在问
                        if(courseAskParam.hasLoadAsk == false){
                            loadCourseAskData();
                        }else{
                            var c = $('#course-askTutor-box .evaluate-content').children(':first');
                            if(!c.length){
                                $('#course-askTutor-box').find('.evaluate-content').append(result.html);
                            }else{
                                c.before(result.html);
                            }
                        }
                    }else if(result.code == 201){
                        $('#is-activate-layer').show();
                        $('.overlay').show();
                    }else
                        $.xcDialog.alert({'content':result.msg});
                }
            )
        }
    });

    // 视频播放区章节收缩
    $(".course-video").on("click",".aside",function(){
        var _this=$(this),_right=_this.parent(),_left=_right.siblings(".left"),_status=_this.hasClass("visible");
        if(!_status){
            _left.animate({"width":"1170px"},500);
            _right.animate({"width":"30px"},500);
            _this.addClass("visible");
        }else{
            _left.animate({"width":"802px"},500);
            _right.animate({"width":"398px"},500);
            _this.removeClass("visible");
        }
    });

    /**************改版4.1js start************/
    $('.ipt-group input').autotab({ format: 'alphanumeric', maxlength: 4 }); //听课码输入框效果js

    // 倒计时初始化
    $(".countBox").each(function(){
        $(this).Countdown();
    });
    /**************改版4.1js end************/
    //课程提问tab切换
    $('#course-detail-ask-tab').click(function(){
        $('.jason-details-tab').hide();
        $('#course-questions-box').show();
        $(this).addClass('cur').siblings().removeClass('cur');
    });

    //课程评价tab切换
    $('#course-detail-evaluate-tab').click(function(){
        $('.jason-details-tab').hide();
        $('#course-evaluate-box').show();
        $(this).addClass('cur').siblings().removeClass('cur');

        if(evaluateParam.hasLoad == false)
            loadCourseEvaluate();
    });

    //课程详情tab切换
    $('#course-detail-info-tab').click(function(){
        $('.jason-details-tab').hide();
        $('#course-details-box').show();
        $(this).addClass('cur').siblings().removeClass('cur');
    });

    //课程同行在问tab切换
    $('#course-detail-askTutor-tab').click(function(){
        $('.jason-details-tab').hide();
        $('#course-askTutor-box').show();
        $(this).addClass('cur').siblings().removeClass('cur');

        if(courseAskParam.hasLoadAsk == false)
            loadCourseAskData();
    });

    // 当滚动到最底部以上100像素时， 加载新内容
    $(window).scroll(function(){
        if($(document).height() - $(this).scrollTop() - $(this).height() < 350){
            if($('#course-detail-ask-tab').hasClass('cur')){
                if (hasMore && !isLoadding) {
                    isLoadding = true; //防止多次滚动加载

                    //滚动加载更多以及回复
                    $.post(load_more_reply_url+'?v='+Math.random(),
                        {'thread_id': THREAD_ID, reply_level: 'one'},function (result) {
                            if(result.code == 200){
                                hasMore = result.hasMore;
                                $('.all-post').append(result.template);
                            }else
                                $.xcDialog.alert({'content':result.msg});
                            isLoadding = false;
                        }
                    )
                }
            }else if($('#course-detail-evaluate-tab').hasClass('cur')){
                loadCourseEvaluate(); //滚动加载课程评论
            }else if($('#course-detail-askTutor-tab').hasClass('cur')){
                loadCourseAskData(); //滚动加载课程导师问答
            }
        }
    });

    //赠送听课码和兑换听课码选项切换
    $(".tingkema .choose>div").click(function(){
        $('.course-code-error-info').val('');
        $('#ipt-group2 input, #ipt-group1 input').val('');
        $(this).addClass("selected").siblings().removeClass("selected");
        if($(this).data("value")==1){
            $(this).find(".ipt-group").show().prev("div").hide();
            $('#live-code-ticket-layer .open-course a').addClass('course-code-confirm');
            $('#live-code-ticket-layer .open-course a').removeClass('use-course-code-ticket');
            /*if(courseInfo.courseType == 1){
                $('#course-code-ticket-layer .open-course a').addClass('course-code-confirm');
                $('#course-code-ticket-layer .open-course a').removeClass('use-course-code-ticket');
            }else{
                $('#live-code-ticket-layer .open-course a').addClass('course-code-confirm');
                $('#live-code-ticket-layer .open-course a').removeClass('use-course-code-ticket');
            }*/
        }
        else{
            $(this).next().find(".ipt-group").hide().prev("div").show();
            $('#live-code-ticket-layer .open-course a').addClass('use-course-code-ticket');
            $('#live-code-ticket-layer .open-course a').removeClass('course-code-confirm');
            /*if(courseInfo.courseType == 1){
                $('#course-code-ticket-layer .open-course a').addClass('use-course-code-ticket');
                $('#course-code-ticket-layer .open-course a').removeClass('course-code-confirm');
            }else{
                $('#live-code-ticket-layer .open-course a').addClass('use-course-code-ticket');
                $('#live-code-ticket-layer .open-course a').removeClass('course-code-confirm');
            }*/
        }
    });

    // 分享到微信弹层
    $(".share").on("click",".wx",function(){
        $(this).addClass("active");
        $(".wx-qrcode").show();
        $("#wx-code").empty();

        var str = encodeURI(document.location.href);
        var qrcode = new QRCode(document.getElementById("wx-code"), {
            width : 130,//设置宽高
            height : 130
        });
        qrcode.makeCode(str);
    });

    //微信分享弹框关闭按钮
    $(".wx-qrcode").on("click",".wx-close",function(){
        $(".share").find("http://assets.xiucai.com/assets/js/i.wx").removeClass("active");
        $(".wx-qrcode").hide();
    });

    $(".audience-share .mobile").on("mouseenter",function(){
        $(this).find(".down-app").addClass("pop-up");
    }).on("mouseleave",function(){
        $(this).find(".down-app").removeClass("pop-up");
    });

    var featured = $(".featured-recommend");
    var featured_child_length = featured.find(".content>ul>li").length;
    if(featured_child_length>1)
        featured.slide({titleCell:".hd ul",mainCell:".bd ul",effect:"fade",trigger:"click",prevCell:"",nextCell:""});
    var featured_scroll = $(".featured-recommend .scroll-box");
    $.each(featured_scroll, function (index, element) {
        var li_length = $(element).find("li").length;
        if(li_length<5){
            $(element).children("a").remove();
        }else{
            $(element).slide({mainCell:".bd ul",autoPage:true,effect:"left",scroll:1,vis:4,pnLoop:false,trigger:"click",delayTime:300});
        }
    });
    var suggest_length = $(".suggest-zt .bd li").length;
    if(suggest_length>1)
    jQuery(".suggest-zt").slide({titleCell:".hd ul",mainCell:".bd ul",effect:"fade",autoPlay:true,interTime:5000,delayTime:600});
});

//加载状态
var loadingStr = supportCss3('animation-play-state') ? '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>':'<div class="spinner">加载更多</div>';

//加载课程评价
function loadCourseEvaluate(){
    if(courseInfo.courseType == 1){
        if (evaluateParam.hasMore && !isLoadding) {
            isLoadding = true; //防止多次滚动加载
            $('#course-evaluate-box .article').append(loadingStr);
            $.post(course_evaluate_load+'?v='+Math.random(),
                {
                    course_type: evaluateParam.courseType,
                    course_id: evaluateParam.courseId,
                    eType:evaluateParam.eType,
                    page:evaluateParam.page
                },
                function (result) {
                    $("#course-evaluate-box .article").find(".spinner").remove();
                    if(result.code == 200){
                        if(evaluateParam.hasLoad == false){
                            $('#course-evaluate-box').find('.evaluate-bar').show();
                            $('#course-evaluate-box').find('.evaluate-bar').html(result.bar);
                        }
                        $('#course-evaluate-box').find('.evaluate-content').append(result.html);

                        // 评分初始化
                        $('.eva-star-rate').raty({
                            path: imgDefaultPath,
                            width: 180,
                            readOnly: true,
                            half : true,
                            hints:['','','','',''],
                            score: function() {
                                return $(this).attr('data-score');
                            },
                            number: function() {
                                return $(this).attr('data-number');
                            }
                        });

                        //判断是否有更多
                        if(result.cur_page_count >= 20){
                            evaluateParam.hasMore = true;
                        }else{
                            evaluateParam.hasMore = false;
                        }

                        evaluateParam.page++;
                    }else if(result.code == 404){
                        if(evaluateParam.hasLoad == false){
                            $('#course-evaluate-box').find('.evaluate-bar').show();
                            $('#course-evaluate-box').find('.evaluate-bar').html(result.bar);
                        }
                        evaluateParam.hasMore = false;
                    }else
                        $.xcDialog.alert({'content':result.msg});

                    isLoadding = false;
                    evaluateParam.hasLoad = true;
                }
            )
        }
    }
}

//加载课程导师问答
function loadCourseAskData(){
    if(courseInfo.courseType == 1){
        if (courseAskParam.hasMoreAsk && !isLoadding) {
            isLoadding = true; //防止多次滚动加载
            $('#course-askTutor-box .article').append(loadingStr);
            $.post(course_tutorAsk_load+'?v='+Math.random(),
                {
                    course_type: courseAskParam.courseType,
                    course_id: courseAskParam.courseId,
                    page:courseAskParam.page
                },
                function (result) {
                    $("#course-askTutor-box .article").find(".spinner").remove();
                    if(result.code == 200){
                        $('#course-askTutor-box').find('.evaluate-content').append(result.html);

                        //判断是否有更多
                        if(result.cur_page_count >= 20){
                            courseAskParam.hasMoreAsk = true;
                        }else{
                            courseAskParam.hasMoreAsk = false;
                        }

                        courseAskParam.page++;
                    }else if(result.code == 404){
                        if(courseAskParam.page == 1)
                            $('#course-askTutor-box').find('.evaluate-content').append(result.html);

                        courseAskParam.hasMoreAsk = false;
                    }else
                        $.xcDialog.alert({'content':result.msg});

                    isLoadding = false;
                    courseAskParam.hasLoadAsk = true;
                }
            )
        }
    }
}