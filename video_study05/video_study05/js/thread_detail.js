/**
 * Created by Administrator on 15-7-30.
 */
var FILE_ID = '';
var isThreadSubmitting = false;
var jmz = {};
jmz.GetLength = function(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};
var setEditorContent1 = '<span style="color: #999;font-size: 14px;">补充问题说明</span>';
var setEditorContentTxt1 = '补充问题说明';
$(function(){
    if($('#supplement_content').length > 0){
        var supplementEditor = UE.getEditor('supplement_content', {
            autoHeight: false,
            initialFrameWidth:522,
            initialFrameHeight:250,
            toolbars: [["insertunorderedlist","insertorderedlist","simpleupload","emotion","bold","italic","underline"]]
        });

        supplementEditor.ready(function() {
            $("#ueditor_1").addClass('z-idx');

            //非火狐浏览器执行此js
            if( !/firefox/.test(navigator.userAgent.toLowerCase())) {
                //设置编辑器的内容
                supplementEditor.setContent(setEditorContent1);

                if($("#ueditor_1").size()>0){
                    //编辑器失去焦点
                    $($("#ueditor_1")[0].contentWindow.document).find(".view").on('blur', function () {
                        var reply_content = supplementEditor.getPlainTxt().replace(setEditorContentTxt1, '');
                        if ($.trim(reply_content) == '') {
                            supplementEditor.setContent(setEditorContent1);
                        }
                    });

                    //编辑器获取焦点
                    $($("#ueditor_1")[0].contentWindow.document).find(".view").on('focus', function () {
                        var reply_txt = supplementEditor.getPlainTxt().replace(setEditorContentTxt1, '');
                        if ($.trim(reply_txt) == setEditorContentTxt1 || $.trim(reply_txt) == "") {
                            supplementEditor.setContent('');
                            supplementEditor.focus();
                        }else {
                            supplementEditor.setContent(reply_txt);
                        }
                    });
                }

            }
            if($("#ueditor_1").size()>0) {
                // 编辑器输入统计字数
                $($("#ueditor_1")[0].contentWindow.document).find(".view").on('keyup', function () {
                    maxLen = 200;
                    var str = supplementEditor.getContentTxt();
                    counter = getLength(str);
                    if (counter > maxLen * 2) {
                        supplementEditor.setContent(formatString(str));
                        counter = maxLen * 2;
                    }
                    $("#thread_content_b").html(Math.floor(counter / 2) + "/" + maxLen);
                });
            }
        });
    }

    // 圈子背景色重新定义
    $("body").css("background","#ebeced");

    // 分享到微信弹层
    $(".share,.share-tooltip").on("click",".wx",function(){
        $(this).addClass("active");
        $(".wx-qrcode").show();
        $("#wx-code").empty();

        var str = encodeURI(document.location.href);
        var qrcode = new QRCode(document.getElementById("wx-code"), {
            width : 130,//设置宽高
            height : 130
        });
        qrcode.makeCode(str);
        /*$("#wx-code").qrcode({
            render: "table",
            width: 100,
            height:100,
            text: str
        });*/
    });

    //微信分享弹框关闭按钮
    $(".wx-qrcode").on("click",".wx-close",function(){
        $(".share").find("i.wx").removeClass("active");
        $(".wx-qrcode").hide();
    });

    // 点击空白区域隐藏微信分享二维码弹层
    $(document).on("click",function(e){
        /*var target  = $(e.target);
        if(target.closest(".wx-qrcode").length == 0 && target.closest(".share>i.wx").length == 0){
            $(".share").find("i.wx").removeClass("active");
            $(".wx-qrcode").hide();
        }*/
        e.stopPropagation();
    });

    var timer = null;
    $(".post-share-collect .share-tooltip").on("mouseenter", function () {
        clearTimeout(timer);
        $(this).find(".wx-qq").fadeIn(200);
    }).on("mouseleave", function () {
        var wx_qq = $(this).find(".wx-qq");
        clearTimeout(timer);
        timer = setTimeout(function () {
            wx_qq.fadeOut(200);
        },400);
    });
    

    //帖子详情页 帖子扣圈币附件下载
    $(document).on('click', '.download-thread-file-icon', function(){
        var file_url = $(this).data('file-url');
        var file_icon = $(this).data('file-icon');
        $('#down-thread-file-coin-btn').attr('href', file_url);
        var tips = '下载该附件资源需要用掉<span style="color: #fd6440">'+file_icon+'</span>个圈币，确认下载吗？'

        $('.overlay').show();
        $('#down-thread-file-coin-tips').html(tips);
        $('#down-thread-file-coin-layer').show();
    });

    //圈币弹层提示确认操作
    $(document).on('click', '#down-thread-file-coin-btn', function(){
        $('.overlay').hide();
        $('#down-thread-file-coin-layer').hide();
        location.reload();
    });

    //圈币弹层提示取消操作
    $(document).on('click', '#down-thread-file-coin-cancel', function(){
        $('.overlay').hide();
        $('#down-thread-file-coin-layer').hide();
    });

    //圈子详情页三级分类检索
    $(document).on('click', '.topic-tag-item', function(){
        var topic_tag_id = $(this).data('tag-id');
        if ($.inArray(topic_tag_id, topicTags) == -1){
            // 将分类添加到数组
            topicTags.push(topic_tag_id);
        } else {

            //解决IE8不支持数组的indexOf方法
            if (!Array.prototype.indexOf)
            {
                Array.prototype.indexOf = function(elt /*, from*/)
                {
                    var len = this.length >>> 0;

                    var from = Number(arguments[1]) || 0;
                    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
                    if (from < 0)
                        from += len;

                    for (; from < len; from++)
                    {
                        if (from in this && this[from] === elt)
                            return from;
                    }
                    return -1;
                };
            }

            //将分类移除数组
            var index = topicTags.indexOf(topic_tag_id);
            if (index != -1){
                topicTags.splice(index, 1);
            }
        }

        $('#topic-tag-input').val(topicTags);
        $('#topic-tags-form').submit();
    });

    //加入圈子，退出圈子操作
    $(document).on('click', '.add-quan', function(event) {
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        var _this = $(this);
        var option_type = $(this).data('option-type');
        if($.trim(option_type) == ''){
            $.xcDialog.alert({'content':'操作类型有误'});
            return false;
        }

        if(option_type == 'out'){
            $('.overlay').show();
            $('#out-circle-confirm-btn').show();
            $('#down-thread-confirm-btn').hide();
            $('#lock-thread-confirm-btn').hide();
            $('#delete-reply-confirm-btn').hide();
            $('#option-community-confirm-layer').show();
            $('#option-community-confirm-tips').html('确认退出该圈子吗？');
            $('#option-community-confirm-title').html('确认退出圈子');
            return;
        }

        if(!isThreadSubmitting){
            isThreadSubmitting = true;
            $.post(join_circle_url,{id: CIRCLE_ID, type: option_type},
                function (data) {
                    if(data.code == 200){
                        if(option_type == 'join'){
                            /*_this.addClass("active-added").find("a").html("您是财税圈第<b>45216</b>位成员").hover(
                                function(){
                                    $(".add-quan.active-added>a").addClass("add-hit").html("退出圈子");
                                },
                                function(){
                                    $(".add-quan.active-added>a").removeClass("add-hit").html("您是财税圈第<b>45216</b>位成员");
                                }
                            );*/

                            _this.data('option-type', 'out');
                            _this.addClass("active-added");
                            _this.html('<a class="globe-btn50 add-hit" href="javascript:;">退出圈子</a>');

                            var totalUserCount = parseInt($.trim($('#circle-total-user-count').html()))+1;
                            var todayCount = parseInt($.trim($('#today-user-count').html()))+1;
                            $('#today-user-count').html(todayCount);
                        }else if(option_type == 'out'){
                            _this.data('option-type', 'join');
                            _this.removeClass("active-added");
                            _this.html('<a class="globe-btn50" href="javascript:;">加入圈子</a>');

                            var totalUserCount = parseInt($.trim($('#circle-total-user-count').html()))-1;
                            if(data.is_today == 1){
                                var todayCount = parseInt($.trim($('#today-user-count').html()))-1;
                                $('#today-user-count').html(todayCount);
                            }
                        }

                        if(totalUserCount < 0)
                            totalUserCount = 0;
                        $('#circle-total-user-count').html(totalUserCount);
                    }else if(data.code == 301){
                        _this.data('option-type', 'out');
                        _this.addClass("active-added");
                        _this.html('<a class="globe-btn50 add-hit" href="javascript:;">退出圈子</a>');

                        var totalUserCount = parseInt($.trim($('#circle-total-user-count').html()))+1;
                        var todayCount = parseInt($.trim($('#today-user-count').html()))+1;
                        $('#today-user-count').html(todayCount);
                        $('#circle-total-user-count').html(totalUserCount);
                    }else if(data.code == 302){
                        _this.data('option-type', 'join');
                        _this.removeClass("active-added");
                        _this.html('<a class="globe-btn50" href="javascript:;">加入圈子</a>');
                        var totalUserCount = parseInt($.trim($('#circle-total-user-count').html()))-1;

                        if(totalUserCount < 0)
                            totalUserCount = 0;
                        $('#circle-total-user-count').html(totalUserCount);
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                    }
                    isThreadSubmitting = false;
                }
            );
        }
    });

    //回帖时候的入圈提示
    $(document).on('click', '#reply-thread-remind-btn', function(){
        if(!isThreadSubmitting) {
            $.post(join_circle_url, {id: CIRCLE_ID, type: 'join'},
                function (data) {
                    if (data.code == 200) {
                        $('.overlay').hide();
                        $('#reply-thread-remind-layer').hide();
                    } else {
                        $.xcDialog.alert({'content': data.msg});
                    }
                    isThreadSubmitting = false;
                }
            );
        }
    });

    //退出圈子操作
    $(document).on('click', '#out-circle-confirm-btn', function(){
        $.post(join_circle_url,{id: CIRCLE_ID, type: 'out'},
            function (data) {
                if(data.code == 200 || data.code == 302){
                    $('.overlay').hide();
                    $('#option-community-confirm-layer').hide();

                    $('.add-quan').data('option-type', 'join');
                    $('.add-quan').removeClass("active-added").find("a").html("加入圈子");
                    var totalUserCount = parseInt($.trim($('#circle-total-user-count').html()))-1;

                    if(data.is_today == 1 && data.code == 200){
                        var todayCount = parseInt($.trim($('#today-user-count').html()))-1;
                        $('#today-user-count').html(todayCount);
                    }

                    if(totalUserCount < 0)
                        totalUserCount = 0;
                    $('#circle-total-user-count').html(totalUserCount);
                }else{
                    $.xcDialog.alert({'content':data.msg});
                    return false;
                }
            }
        );
    });

    //退出圈子，锁定帖子，沉底帖子确认弹层取消按钮
    $(document).on('click', '#cancel-option-community', function(){
        $('.overlay').hide();
        $('#option-community-confirm-layer').hide();
    });

    //圈子按钮鼠标hover效果
    /*$(".add-quan").hover(
        function(){
            if($(this).hasClass("active-added"))
                $(".add-quan.active-added>a").addClass("add-hit").html("退出圈子");
        },
        function(){
            if($(this).hasClass("active-added"))
                $(".add-quan.active-added>a").removeClass("add-hit").html("您是财税圈第<b>45216</b>位成员");
        }
    );*/

    // 筛选
    $(".dynamic-filtrate").click(function(event) {
        $(this).toggleClass("dynamic-filtrate-show");
    });


    // 设置
    $(document).on('click', ".post-operate", function(event) {
        $(this).toggleClass("post-operate-active");

        $(this).parents(".quan-post-item").siblings().find(".post-operate").removeClass("post-operate-active ie7-item-index");

        // ie7兄弟列表被覆盖
        if($(this).hasClass("post-operate-active")){
            $(this).addClass("ie7-item-index");
        }
        else{
            $(this).removeClass("ie7-item-index");
        }
    });

    // 点击空白区域隐藏筛选跟设置下拉框
    $(document).on("click",function(e){
        var target  = $(e.target);
        if(target.closest(".dynamic-filtrate").length == 0){
            $(".dynamic-filtrate").removeClass("dynamic-filtrate-show");
        }
        if(target.closest(".post-operate").length == 0){
            $(this).find(".post-operate").removeClass("post-operate-active ie7-item-index");
        };
        e.stopPropagation();
    });

    //未登录状态加入圈子
    $('#no-login-join-btn').click(function(){
        //检查是否登录
        showLogin();
    });

    //回复点赞
    $(document).on('click', '.agree-reply', function(){
        //检查帖子是否被锁定
        if(THREAD_IS_LOCK == 1){
            //$.xcDialog.alert({'content':'该帖子已被锁定暂不能做任何操作'});
            return false;
        }

        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        var _this = $(this);
        var reply_id = $(this).data('reply-id');
        if($.trim(reply_id) == '' || reply_id == 0){
            $.xcDialog.alert({'content':'回复操作失败，请稍后再试'});
            return false;
        }

        if(!isThreadSubmitting){
            isThreadSubmitting = true;
            $.post(agree_rely_url,{id: reply_id},
                function (data) {
                    if(data.code == 200){
                        _this.addClass("scale-animation");
                        setTimeout(function(){
                            $(".post-praise").removeClass("scale-animation");
                        },1000);
                        _this.html('<i></i>赞（'+data.agree_count+'）');
                        _this.removeClass('agree-reply').addClass('post-praised');

                        if(data.agree_level_msg != ''){
                            $.xcDialog.alert({'content':data.agree_level_msg});
                        }
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                    }
                    isThreadSubmitting = false;
                }
            );
        }
    });

    //收藏帖子
    $(document).on('click', '#collect-thread', function(){
        //检查帖子是否被锁定
        /*if(THREAD_IS_LOCK == 1){
            $.xcDialog.alert({'content':'该帖子已被锁定暂不能做任何操作'});
            return false;
        }*/

        if($(this).hasClass('a-login'))
            return false;

        if(needBindPhone == 1){
            showBindPhone();
            return false;
        }
        var _this = $(this);
        var option_type = $(this).data('option-type');
        if($.trim(option_type) == ''){
            $.xcDialog.alert({'content':'操作类型有误'});
            return false;
        }

        if(!isThreadSubmitting){
            isThreadSubmitting = true;
            $.post(collect_thread_url,{id: THREAD_ID, type: option_type},
                function (data) {
                    if(data.code == 200){
                        if(option_type == 'collect'){
                            _this.data('option-type', 'cancel_collect');

                            _this.html("<em class='iconfont'>&#xe657;</em>已收藏");

                            _this.addClass("active-collect").find("a").html("<i class='collect'></i>已收藏").hover(
                            function(){
                                $(".collect-post.active-collect>a").addClass("add-hit").html("<i class='collect'></i>取消收藏");
                            },
                            function(){
                                $(".collect-post.active-collect>a").removeClass("add-hit").html("<i class='collect'></i>已收藏");
                            });
                        }else if(option_type == 'cancel_collect'){
                            _this.data('option-type', 'collect');
                            _this.html("<em class='iconfont'>&#xe652;</em>收藏");
                            _this.removeClass("active-collect").find("a").html("<i class='collect'></i>收藏");
                        }
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                    }
                    isThreadSubmitting = false;
                }
            );
        }
    });
    $(document).on('click', '.qa-side-block .collect', function(){
        //检查帖子是否被锁定
        /*if(THREAD_IS_LOCK == 1){
         $.xcDialog.alert({'content':'该帖子已被锁定暂不能做任何操作'});
         return false;
         }*/

        if($(this).hasClass('a-login'))
            return false;

        var _this = $(this);
        var option_type = $(this).data('option-type');
        if($.trim(option_type) == ''){
            $.xcDialog.alert({'content':'操作类型有误'});
            return false;
        }

        if(!isThreadSubmitting){
            isThreadSubmitting = true;
            $.post(collect_thread_url,{id: THREAD_ID, type: option_type},
                function (data) {
                    if(data.code == 200){
                        if(option_type == 'collect'){
                            _this.data('option-type', 'cancel_collect').html('<em class="iconfont">&#xe657;</em>已收藏');
                        }else if(option_type == 'cancel_collect'){
                            _this.data('option-type', 'collect').html('<em class="iconfont">&#xe652;</em>收藏');
                        }
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                    }
                    isThreadSubmitting = false;
                }
            );
        }
    });

    //圈子按钮鼠标hover效果
    $("#collect-thread").hover(
        function(){
            if($(this).hasClass("active-collect"))
                $(".collect-post.active-collect>a").addClass("add-hit").html("<i class='collect'></i>取消收藏");
        },
        function(){
            if($(this).hasClass("active-collect"))
                $(".collect-post.active-collect>a").removeClass("add-hit").html("<i class='collect'></i>已收藏");
        }
    );

    //切换马甲
    $(document).on('click', '.diy_select_list li', function(){
        var position = $(this).attr('v');
        $(this).parent().parent().next().html(position);
    });

    // 秀财直播轮播
    jQuery(".live-slider").slide({mainCell:".bd ul",effect:"left",easing:"easeOutCirc",delayTime:1000,interTime:3000,autoPlay:true});

    // 导师问答更新状态 满意/不满意
    $(".assess-tutor").on('click',function (event) {
        event.preventDefault();
        /* Act on the event */

        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        var _this = $(this);
        var solve_ = _this.attr('a-value');

        if(solve_ == 'solve' || solve_ =='un_solve'){

            if(solve_ =='un_solve'){
                $('.survey').css('height',99);
                $('.dissatisfied').show();
                $('.survey-left').hide();
                $('.survey-right').hide();
            }
            if(!isThreadSubmitting){
                isThreadSubmitting = true;
                $.post(question_update_url,{is_solve:solve_},
                    function (data) {
                        if(data.code == 200){
                            assessId = data['assessId'];
                            log_id = data['logId'];
                            // _this.parents(".guider-qa-wrap").fadeOut();
                            // $('.guider-qa-wrap').html($('#getSetContent').html());
                            $('.survey-left').html($('#getSetContent').html())
                        }else{
                            $.xcDialog.alert({'content':data.msg});
                        }
                        isThreadSubmitting = false;
                    }
                );
            }
        }
    });

    //不满意处理
    $('.submit-survey').on('click',function () {

        var not_in_time = 0;
        var answer_is_not = 0;
        var other_reason = '';
        if($('.checkbox_1 .icheckbox_minimal-orange').hasClass('checked')){
            answer_is_not = 1
        }
        if($('.checkbox_2 .icheckbox_minimal-orange').hasClass('checked')){
            not_in_time = 1;
        }
        if($('.checkbox_3 .icheckbox_minimal-orange').hasClass('checked')){
            other_reason = $('#other_reason').val();
        }
        if(!isThreadSubmitting){
            isThreadSubmitting = true;
            $.post(cause_update_url,{'assess_id':assessId,'log_id':log_id,'other_reason':other_reason,'answer_is_not':answer_is_not,'not_in_time':not_in_time},function (data) {
                if(data['code']==200){
                    $('.survey').css('height',49);
                    $('.dissatisfied').hide();
                    $('.survey-left').show();
                    $('.survey-right').show();
                    $('.survey-left').html($('#getSetContent').html())
                }
                isThreadSubmitting = false;
            });
        }
    });

    $('.cancel').on('click',function () {
        $('.survey').css('height',49);
        $('.dissatisfied').hide();
        $('.survey-left').show();
        $('.survey-right').show();
        $('.survey-left').html($('#getSetContent').html())
    });
    // 导师问答更新状态 已解决
    $(".qa-is-solved").on('click', 'a.solved', function(event) {
        event.preventDefault();
        /* Act on the event */

        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        var _this = $(this);
        if(!isThreadSubmitting){
            isThreadSubmitting = true;
            $.post(question_update_url,{is_solve: 'solve'},
                function (data) {
                    if(data.code == 200){
                        // _this.parents(".guider-qa-wrap").fadeOut();
                        $('.guider-qa-wrap').html($('#getSetContent').html());
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                    }
                    isThreadSubmitting = false;
                }
            );
        }
    });
    //帖子追问
    $('#put-question-btn').on('click',function () {
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        //判断是否是激活用户
        if(!isActivateThreadMember){
            $('.overlay').show();
            $('#is-activate-layer').show();
            return false;
        }

        if (UE.getEditor('supplement_content').getContentTxt()) {
            //获取纯文本内容
            var reply_txt = $.trim(UE.getEditor('supplement_content').getContentTxt());
            if(reply_txt == ''){
                $.xcDialog.alert({'content':'请输入回复内容'});
                return false;
            }else if(reply_txt.length > 3000) {
                $.xcDialog.alert({'content':'回复内容不能超过3000字'});
                return false;
            }

            var _this = $(this);
            $(this).html(spinnerIcon);
            var vestId = $(this).prev().prev().find('input').val();
            // var reply_content = htmlEditor.getContent();
            if (!isReplySubmitting) {
                isReplySubmitting = true;
                $.post(rely_thread_url, {'content': reply_txt, vestId: vestId, floor: FLOOR, level: 'one',is_ask:1}, function (result) {
                    if(result.code == 200){
                        $('#all-post-list').append(result.template);
                        TTDiy_select_init();
                        FLOOR = parseInt(FLOOR)+1;
                        replyTotalCount = parseInt(replyTotalCount)+1;
                        $('.thread-floor-count').html(replyTotalCount);
                        $('#thread-all-reply-list').show();
                        $('#all-post-list .no-class').remove();
                        $('.survey-left').hide();
                        $('.survey-right').attr('class','');
                        if(result.showWeixinDiv == true){
                            $('#threadWechatDiv').show();
                            $('.overlay').show();
                        }
                        //导师解答显示状态
                        //if(result.is_tutor_reply == 1){
                        if(result.is_self_reply == 1){
                            $(".r-content .guider-qa-wrap").fadeOut(); // 隐藏导师信息
                            if($('#quan-post-tag'+THREAD_ID).length > 0){
                                if($(".tag-guide-qa").attr("flg")!= 1)
                                {
                                    $('<span class="tag-guide-qa" flg="1">√ 导师解答</span>').insertAfter($('#quan-post-tag'+THREAD_ID));
                                }
                            }

                        }

                        if(result.msg == '加入圈子提示'){
                            $('.overlay').show();
                            $('#reply-thread-remind-layer').show();
                        }else{
                            //经验值
                            if(result.reply_level_msg != ''){
                                $.xcDialog.alert({'content':data.reply_level_msg});
                            }else if(result.reply_level_val > 0){
                                var new_level = (result.new_level == '') ? '' : '<p>'+result.new_level+'</p>';
                                $.xcDialog.alert({'content':'回复成功'+'<span>经验+'+result.reply_level_val+'</span>'+new_level});
                            }
                        }
                        supplementEditor.setContent('');

                        $("#fill-up-qa").hide();
                        $('.overlay').hide();
                        $('#is-activate-layer').hide();
                    }else if(result.code == 403){
                        //账号未激活弹层提示
                        $('.overlay').show();
                        $('#is-activate-layer').show();
                    }else
                        $.xcDialog.alert({'content':result.msg});

                    _this.html('<i></i> 继续提问');
                    isReplySubmitting = false;
                })
            }
        }else {
            $.xcDialog.alert({'content':'请输入回复内容'});

            return;
        }
    })


      // click  -id-put-question-btn 原追问
    $(document).on('click', '---', function(){
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        var supplement_text = $.trim(UE.getEditor('supplement_content').getContentTxt());
        var supplement_content = $.trim(UE.getEditor('supplement_content').getContent());
        //var supplement_content = $.trim($("#supplement_content").val());
        if(supplement_text == ''){
            $.xcDialog.alert({'content':'请输入补充说明'});
            return false;
        }else if($.trim(supplement_text) == setEditorContentTxt1){
            $.xcDialog.alert({'content':'请输入补充说明'});
            return false;
        }

        if(jmz.GetLength(supplement_text) > 400){
            $.xcDialog.alert({'content':'帖子描述不能超过200个字'});
            return false;
        }

        if(!isThreadSubmitting){
            isThreadSubmitting = true;
            $.post(question_update_url,{supplement_text: supplement_text, supplement_content: supplement_content},
                function (data) {
                    if(data.code == 200){



                        $('.overlay').hide();
                        $('#fill-up-qa').hide();
                        $("#overlay-re-qu").remove();
                        $("#thread_content_b").html("0/200");
                        $('#thread-info-content').html(data.supplement_content);

                        //非火狐浏览器执行此js
                        if( !/firefox/.test(navigator.userAgent.toLowerCase())) {
                            supplementEditor.setContent(setEditorContent1);
                        }else{
                            supplementEditor.setContent('');
                        }
                        location.reload();
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                    }

                    isThreadSubmitting = false;
                }
            );
        }
    });

    //未解决问题操作
    $(".qa-is-solved").on('click', 'a.unsolved', function(event) {
        updateThreadSolve();
    });

    //追问操作
    $(".questioning").on('click',function(event) {
        event.preventDefault();
        supplementEditor.setContent('');
        /* Act on the event */
        $("body").append('<div id="overlay-re-qu" class="overlay"></div>');
        $("#fill-up-qa").show();
    });

    //关闭补充问题弹窗
    function closeFillWindows(){
        $("#fill-up-qa").hide();
        $("#overlay-re-qu").remove();
        $("#thread_content_b").html("0/200");

        //非火狐浏览器执行此js
        if( !/firefox/.test(navigator.userAgent.toLowerCase())) {
            supplementEditor.setContent(setEditorContent1);
        }else{
            supplementEditor.setContent('');
        }
    }

    // 关闭补充回答弹窗
    $("#fill-up-qa a.close-dialog-board").on('click', function(event) {
        closeFillWindows();
    });

    function  updateThreadSolve() {
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        if(!isThreadSubmitting){
            isThreadSubmitting = true;
            $.post(question_update_url,{is_solve: 'un_solve'},
                function (data) {
                    if(data.code == 200){
                        closeFillWindows(); // 关闭补充回答弹窗
                        //关闭导师助手
                        // $(".guider-qa-wrap").hide();
                        $('.guider-qa-wrap').html($('#getSetContent').html());
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                    }
                    isThreadSubmitting = false;
                }
            );
        }
    }

    //点击不问了修改问答状态
    $('#fill-up-qa .b-tips>em').on('click', function(){
        updateThreadSolve()
    });

    // 补充问题描述统计字数
    /*$(".ipt-border textarea").bind('input propertychange', function(event) {
        event.preventDefault();

        maxLen=200;
        var str=$(this).val();
        counter=getLength(str);
        if(counter>maxLen*2){
            $(this).val(formatString(str));
            counter=maxLen*2;
        }
        $(this).parent().find("b").html(Math.floor(counter / 2)+"/"+maxLen);
    });*/

    // 获取字符长度
    function getLength(str){
        realLength = 0;
        var charCode;

        for (var i = 0; i < str.length; i++){
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128){
                realLength += 1;
            }
            else{
                realLength += 2;
            }
        }
        return realLength;
    }
    // 截取字符
    function formatString(str){
        var result="",str_length= 0,strArr=str.split('');
        for(var i= 0,len=str.length;i<len;i++){
            var charCode = str.charCodeAt(i);
            if(str_length<maxLen*2){
                if (charCode >= 0 && charCode <= 128){
                    result+=strArr[i];
                    str_length+=1;
                }else{
                    result+=strArr[i];
                    str_length+=2;
                }
            }
        }
        return result;
    }
})

