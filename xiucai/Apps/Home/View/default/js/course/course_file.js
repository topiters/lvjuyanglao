var $THIS = '';
var isLoading = false;
var isLoaded = false;
$(function () {
    //加载课程资料
    $(document).on('click', '#course-file-info-tab', function(){
        $('.jason-details-tab').hide();
        $('#course-files-box').show();
        $(this).addClass('cur').siblings().removeClass('cur');

        if(!isLoading){
            isLoading = true;
            if($('#course-file-info-tab').data('is-load') == 0){
                $.post(course_file_url, {course_type: courseInfo.courseType}, function (data) {
                    if(data.code == 200){
                        //显示课程资料
                        $('#course-file-info-tab').data('is-load', 1);

                        if(data.html != ""){
                            $('#add-course-file-con-div').html(data.html).show();
                        }
                    }else if(data.code == 302){
                        $('.overlay').show();
                        $('.live-detail-layer').hide();
                        $('#no-authority-download-layer').show(); //没有会员等级无权限下载
                    }else if(data.code == 301){
                        $('.overlay').show();
                        $('.live-detail-layer').hide();
                        $('#download-times-out-layer').show(); //下载次数用完提示弹层
                    }else if(data.code == 404 || data.code == 403){
                        $('.overlay').show();
                        $('.live-detail-layer').hide();
                        $('#no-authority-download-layer').show();
                    }else{
                        dialog_alert(data.msg);
                    }
                    isLoading = false;
                });
            }
        }
    });

    //点击下载按钮下载提醒弹框
    $(document).on('click', '.download-course-material-btn', function(){
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        if($(this).hasClass('no')){
            //dialog_alert($('#remind-down-tips-con').val());
            return;
        }

        if($(this).data('is-down') == '1' || $(this).hasClass('no'))
            return false;

        if($('#remainder-down-times').length > 0)
            var downTimes = $.trim($('#remainder-down-times').val());
        else
            var downTimes = 0;

        if(downTimes == '')
            downTimes = 0;
        downTimes = parseInt(downTimes);
        if(downTimes == 0){
            $('.download-course-material-btn').attr('href', 'javascript:;');
            $('.download-course-material-btn').addClass('no');
        }else{
            $THIS = $(this);
            var tipsCon = $('#remind-down-tips-con').val();

            $('.overlay').show();
            $('#downC-course-file-layer').show();
            $('#downC-community-tips').html(tipsCon);
            $('#downC-community-btn').attr('href', $THIS.data('down-url'));
        }
    });

    //点击灰色下载按钮提示
    $(document).on('click', '.courseware-download-btn', function(){
        if(!$(this).hasClass('no')){
            var downTimes = $.trim($('#remainder-down-times').val());
            if(downTimes == 'Infinite'){
                $(this).html('重新下载');
            }
            return;
        }
    });

    //弹层确认下载
    $(document).on('click', '#downC-community-btn', function(){
        $('.overlay').hide();
        $('#downC-course-file-layer').hide();
        updateDownInfo($THIS);
    });

    //更新下载次数
    function updateDownInfo(_this){
        if($('#remainder-down-times').length > 0)
            var downTimes = $.trim($('#remainder-down-times').val());
        else
            var downTimes = 0;

        if(downTimes == '')
            downTimes = 0;

        downTimes = parseInt(downTimes);

        downTimes--;
        downTimes = (downTimes < 0) ? 0 : downTimes;

        _this.html('重新下载');
        _this.data('is-down', '1');
        _this.attr('target', '_blank');
        _this.attr('href', $THIS.data('down-url'));
        _this.removeClass('download-course-material-btn');

        if(downTimes == 0){
            //下载次数用完
            var tips = $('#remind-down-tips').val();
            $('.download-course-material-btn').html('下载'+tips);
            $('.download-course-material-btn').attr('href', 'javascript:;');
            $('.download-course-material-btn').addClass('no');
            $('#remind-down-tips-con').val(tips);
        }else{
            //更新弹层里下载次数
            $('#remainder-down-times').val(downTimes);
            $('#remind-down-tips-con').val('您本月还可下载<em>'+downTimes+'</em>个资料');
        }
    }

    //取消下载按钮
    $(document).on('click', '#downC-community-cancel', function(){
        $('.overlay').hide();
        $('.overlay-transparent').hide();
        $(this).parents('.dialog-board').hide();
    });

    //课程码验证成功弹层关闭按钮
    $(document).on('click', '.close-dialog-board', function(){
        $('.overlay').hide();
        $('.overlay-transparent').hide();
        $(this).parent().parent().hide();
    });

    //点击下载按钮处理
    $(document).on('click', '.course-file-layer .course-file-down-btn', function(){
        var _this = $(this)
        $(this).html('<img src="../img/spinner2.gif"/*tpa=http://assets.xiucai.com/assets/img/spinner2.gif*/ alt="下载" />');
        var file_id = $(this).data('file-id');
        $.post(course_file_down_url,
            {course_id: courseInfo.courseId ,file_id: file_id, course_type: courseInfo.courseType}, function (data) {
            if(data.code == 200){
                //显示课程资料
                _this.html('下载');
                document.location.reload();
            }else if(data.code == 403){
                _this.html('下载');
                $('.overlay').show();
                $('.live-detail-layer').hide();
                $('#no-authority-download-layer').show();
            }else{
                _this.html('下载');
                dialog_alert(data.msg);
            }
        });
    });
})
