//直播课报名
function joinLiveCourse(){
    $.post(liveCourse_apply_url,{liveId:courseInfo.courseId},
        function(result){
            if(result.code == 200){
                if(result.is_vip == 1 || result.is_free == 1 || isFreeTime == 1){
                    //报名信息收集，课前提问
                    if(result.remind_log == 0){
                        if(showWeixinDiv == true){
                            $('#liveWechatNoticeDiv').show();
                            $('.overlay').show();
                        }else{
                            $.xcDialog.alert({'content':'预约成功'});
                        }
                    }else
                        $('.overlay').hide();
                }else{
                    //先判断是否有听课券
                    $('.overlay').show();
                    if(result.has_ticket == true){
                        $('#live-code-ticket-layer').show();
                    }else
                        $('#live-open-vip-layer').show();
                }

                $('#btnJoinCourse').remove();
                $('.course-tab .use-live-course-code-btn').remove();
                $('#live-course-status-btn').append(result.html);
            }else if(result.code == 403){
                //账号未激活弹层提示
                $('.overlay').show();
                $('#is-activate-layer').show();
            }else if(result.code == 300){
                $('.overlay').hide();
                dialog_alert(result.msg);
            }
            isLoading = false;
        }
    );
}

$(function(){
    //直播课程使用听课码开通课程
    $(document).on('click', '.use-live-course-code-btn', function(){
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        //判断是否是激活用户
        if((courseInfo.courseType == 2 || courseInfo.courseType == '2')){
            if(!isActivateMember){
                $('.overlay').show();
                $('#is-activate-layer').show();
                return false;
            }
        }

        $('.overlay').show();
        $('.live-detail-layer').hide();

        //判断是否有听课券
        if(hasTicket == 1){
            $('#live-code-ticket-layer').show();
        }else{
            $('#live-course-code-layer').show();
        }
    });
});
