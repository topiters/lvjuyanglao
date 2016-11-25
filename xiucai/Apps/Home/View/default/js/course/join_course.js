var isLoading = false;
$(function () {
    //使用听课券听课
    $(document).on('click', '.use-course-code-ticket', function(){
        if(courseInfo.courseType == 2){
            if(!isActivateMember){
                $('.overlay').show();
                $('#is-activate-layer').show();
                return false;
            }
        }

        if(!isLoading){
            isLoading = true;
            $.post(use_course_code_url,{course_id:courseInfo.courseId, course_type: courseInfo.courseType},
                function(result){
                    if(result.code == 200){
                        if(courseInfo.courseType == 1){
                            //录播课使用听课券
                            var d = dialog({
                                skin: 'all-dialog',
                                content: '课程开通成功，该课程有效期为：<br/>'+result.expireTime+'。请抓紧时间完成学习。',
                                button: [
                                    {
                                        value: '确定',
                                        autofocus: true,
                                        callback: function () {
                                            document.location.reload();
                                        }
                                    }
                                ]
                            });
                            d.showModal();
                            /*var $dialog = $('#open-course-code-success-layer');
                            toggleCourseLayer($dialog);*/
                        }else{
                            //报名信息收集，课前提问
                            $('.live-detail-layer').hide();

                            if(result.remind_log == 0){
                                if(showWeixinDiv == true){
                                    $('#liveWechatNoticeDiv').show();
                                    $('.overlay').show();
                                }else{
                                    $.xcDialog.alert({'content':'预约成功'});
                                }
                                //$('#join-live-course-success-layer').show();
                            }
                            else
                                $('.overlay').hide();

                            $('#btnJoinCourse').remove();
                            $('.course-tab .use-live-course-code-btn').remove();
                            $('#live-course-status-btn').append(result.html);
                        }
                    }else if(result.code == 403){
                        $('.overlay').show();
                        $('#is-activate-layer').show();
                    }else{
                        dialog_alert(result.msg);
                    }
                    isLoading = false;
                }
            );
        }
    });

    //未激活状态点击事件
    /*$(document).on('click', '#isActivate', function(){
        $('.overlay').show();
        $('#is-activate-layer').show();
        return false;
    });*/

    $(document).on('click', '.enter-room', function(){
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }
        if(needBindPhone == 1){
            showBindPhone();
            return false;
        }
    });

    //预约课程按钮
    $(document).on('click', '#btnJoinCourse', function(){
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        //判断是否是激活用户
        /*if((courseInfo.courseType == 2 || courseInfo.courseType == '2')){
            if(!isActivateMember){
                $('.overlay').show();
                $('#is-activate-layer').show();
                return false;
            }
        }*/

        if(needBindPhone == 1){
            showBindPhone();
            return false;
        }

        if(!isLoading){
            isLoading = true;
            if(courseInfo.coursePrice == 0 || courseInfo.coursePrice == '0' || courseInfo.coursePrice == 'http://assets.xiucai.com/assets/js/0.00'){
                if(courseInfo.courseType == 1){
                    $.post(joinUrl, function (data) {
                        document.location.reload();
                    });
                }else{
                    joinLiveCourse();
                }
            }else{
                $.post(is_vip_url,{course_type: courseInfo.courseType}, function (data) {
                    if(data.code == 200){
                        if(courseInfo.courseType == 1){
                            $.post(joinUrl, function (data) {
                                document.location.reload();
                            });
                        }else{
                            joinLiveCourse();
                        }
                    }else if(isFreeTime == 1 && courseInfo.courseType == 2){
                        joinLiveCourse();
                    }else if(data.code == 403){
                        $('.overlay').show();
                        $('#live-open-vip-layer').show();

                        /*//判断是否有听课券
                        if(data.has_ticket == true){
                            $('#live-code-ticket-layer').show();
                        }else{
                            $('#live-open-vip-layer').show();
                        }*/
                    }else{
                        dialog_alert(data.msg);
                    }
                });

                isLoading = false;
            }
        }
    });

    //听课码输入确认按钮
    $(document).on('click', '.course-code-confirm', function(){
        var _this = $(this);
        if(_this.hasClass('opening1') || _this.hasClass('opening2')){
            var course_code = '';
            if(_this.hasClass('opening1')){
                $('#ipt-group1 input').each(function(){
                    course_code += $.trim($(this).val());
                });
            }else{
                $('#ipt-group2 input').each(function(){
                    course_code += $.trim($(this).val());
                });
            }

            if($.trim(course_code) == ""){
                $('.course-code-error-info').html('请输入听课码');
                return false;
            }
        }

        $.post(course_code_url,
            {course_id: courseInfo.courseId,course_type: courseInfo.courseType, course_code: course_code},
            function (data) {
            if(data.code == 200){
                if(courseInfo.courseType == 1){
                    var d = dialog({
                        skin: 'all-dialog',
                        content: '课程开通成功，该课程有效期为：<br/>'+result.expireTime+'。请抓紧时间完成学习。',
                        button: [
                            {
                                value: '确定',
                                autofocus: true,
                                callback: function () {
                                    location.reload();
                                }
                            }
                        ]
                    });
                    d.showModal();
                    /*var $dialog = $('#open-course-code-success-layer');
                    toggleCourseLayer($dialog);*/
                }else{
                    //报名信息收集，课前提问
                    $('.live-detail-layer').hide();

                    if(data.remind_log == 0){
                        if(showWeixinDiv == true){
                            $('#liveWechatNoticeDiv').show();
                            $('.overlay').show();
                        }else{
                            $.xcDialog.alert({'content':'预约成功'});
                        }
                        //$('#join-live-course-success-layer').show();
                    }else
                        $('.overlay').hide();

                    //听课吗报完名后修改按钮链接状态
                    $('#btnJoinCourse').remove();
                    $('.course-tab .use-live-course-code-btn').remove();
                    $('#live-course-status-btn').append(data.html);
                }
            }else if(data.code == 403){
                $('.overlay').show();
                $('#is-activate-layer').show();
            }else{
                $('.course-code-error-info').html(data.msg);
            }
        });
    });

    //课程码输入框输入状态清除错误提示信息
    $('.ipt-group input').keyup(function(){
        $('.course-code-error-info').html('');
    });

    // 初始化placeholder插件
    $(".course-code-input").placeholder({isUseSpan:true,onInput:true});
})
