/**
 * Created by Administrator on 15-8-3.
 */
var threadId = 0;
var threadColor = '';
$(function(){
    $(function(){
        // 筛选
        $(".color-filtrate").click(function(event) {
            $(this).toggleClass("color-filtrate-show");
        });

        $(".color-filtrate ul li").click(function(event) {
            threadColor = $(this).data('color');
            $(this).parents(".color-filtrate").find(".filter-box").html($(this).text() + "<i class='triangle6-red color-gray'></i>");
        });

        //弹层关闭按钮
        $(document).on('click', '.close-dialog-board', function(){
            $(this).parent().parent().hide();
            $('.overlay').hide();
        });

        //帖子着色弹层取消按钮
        $(document).on('click', '#colorful-community-cancel', function(){
            $('#colorful-community-layer').hide();
            $('.overlay').hide();
        })

        //删除帖子弹层取消按钮
        $(document).on('click', '#del-community-cancel', function(){
            $('#del-community-layer').hide();
            $('.overlay').hide();
        })

        //操作成功弹层确定按钮
        $(document).on('click', '#option-community-btn', function(){
            $('#option-community-layer').hide();
            $('.overlay').hide();
        });

        //删除帖子
        $(document).on('click', '.del-thread', function(){
            //检查是否登录
            if ($('a.a-login').length > 0) {
                showLogin();
                return false;
            }

            threadId = $(this).parent().data('thread-id');
            if($.trim(threadId) == '' || threadId == 0){
                $.xcDialog.alert({'content':'操作失败,帖子ID无效'});
                return false;
            }

            $('.overlay').show();
            $('#del-community-layer').show();
        });

        //删除帖子操作
        $(document).on('click', '#del-community-btn', function(){
            if($.trim(threadId) == '' || threadId == 0){
                $.xcDialog.alert({'content':'操作失败,帖子ID无效'});
                return false;
            }

            $.post(thread_setting_url,{id: threadId, type: 'del'},
                function (data) {
                    if(data.code == 200){
                        $('.overlay').hide();
                        $('#del-community-layer').hide();
                        if($("#thread-item-content" + threadId).length > 0){
                            $("#thread-item-content" + threadId).hide();
                            
                        }else{
                            if(data.threadType ==3){
                                location.href = tutor_home_page_url;
                            }else {
                                location.href = circle_detail_url; //跳转到圈子详情页
                            }
                        }
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                        return false;
                    }
                }
            );
        });

        //帖子着色弹层
        $(document).on('click', '.colorful-thread', function(){
            //检查是否登录
            if ($('a.a-login').length > 0) {
                showLogin();
                return false;
            }

            threadId = $(this).parent().data('thread-id');
            if($.trim(threadId) == '' || threadId == 0){
                $.xcDialog.alert({'content':'操作失败,帖子ID无效'});
                return false;
            }

            $('.overlay').show();
            $('#colorful-community-layer').show();
        });

        //帖子着色操作
        $(document).on('click', '#colorful-community-btn', function(){
            if($.trim(threadId) == '' || threadId == 0){
                $.xcDialog.alert({'content':'操作失败,帖子ID无效'});
                return false;
            }

            $.post(thread_setting_url,{id: threadId, color: threadColor, type: 'color'},
                function (data) {
                    if(data.code == 200){
                        $('.overlay').hide();
                        $('#colorful-community-layer').hide();
                        $("#quan-post-title" + threadId).css('color', threadColor);
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                        return false;
                    }
                }
            );
        });

        //帖子设置操作
        $(document).on('click', '.operate-thread-set', function(){
            //检查是否登录
            if ($('a.a-login').length > 0) {
                showLogin();
                return false;
            }

            threadId = $(this).parent().data('thread-id');
            if($.trim(threadId) == '' || threadId == 0){
                $.xcDialog.alert({'content':'操作失败,帖子ID无效'});
                return false;
            }

            var _this = $(this);
            var option_type = $(this).data('option-type');
            if($.trim(option_type) == ''){
                $.xcDialog.alert({'content':'帖子操作类型有误'});
                return false;
            }

            if(option_type == 'lock'){
                $('.overlay').show();
                $('#out-circle-confirm-btn').hide();
                $('#down-thread-confirm-btn').hide();
                $('#lock-thread-confirm-btn').show();
                $('#delete-reply-confirm-btn').hide();
                $('#option-community-confirm-layer').show();
                $('#option-community-confirm-tips').html('确认锁定该帖子吗？');
                // $('#option-community-confirm-title').html('确认锁定帖子');
                return;
            }else if(option_type == 'down'){
                $('.overlay').show();
                $('#out-circle-confirm-btn').hide();
                $('#down-thread-confirm-btn').show();
                $('#lock-thread-confirm-btn').hide();
                $('#delete-reply-confirm-btn').hide();
                $('#option-community-confirm-layer').show();
                $('#option-community-confirm-tips').html('确认沉底该帖子吗？');
                // $('#option-community-confirm-title').html('确认沉底帖子');
                return;
            }

            $.post(thread_setting_url,{id: threadId, type: option_type},
                function (data) {
                    if(data.code == 200){
                        if(option_type == 'essence'){
                            _this.data('option-type', 'cancel_essence');
                            _this.html('<a href="javascript:;">取消加精</a>');
                            $('#quan-post-tag' + threadId).append('<i class="tag-essence"></i>');
                        }else if(option_type == 'cancel_essence'){
                            _this.data('option-type', 'essence');
                            _this.html('<a href="javascript:;">加精</a>');
                            $('#quan-post-tag' + threadId).find('.tag-essence').remove();
                        }else if(option_type == 'hot'){
                            _this.data('option-type', 'cancel_hot');
                            _this.html('<a href="javascript:;">取消热帖</a>');
                            $('#quan-post-tag' + threadId).append('<i class="tag-hot"></i>');
                        }else if(option_type == 'cancel_hot'){
                            _this.data('option-type', 'hot');
                            _this.html('<a href="javascript:;">加热</a>');
                            $('#quan-post-tag' + threadId).find('.tag-hot').remove();
                        }else if(option_type == 'top1'){
                            _this.data('option-type', 'cancel_top1');
                            _this.html('<a href="javascript:;">取消置顶1</a>');

                            if(CATEId > 0){
                                if(data.is_top == 0 && data.is_topic_top == 0){
                                    $('#quan-post-tag' + threadId).append('<i class="tag-w tag-top1"></i>');
                                }
                            }
                        }else if(option_type == 'cancel_top1'){
                            _this.data('option-type', 'top1');
                            _this.html('<a href="javascript:;">分类置顶</a>');

                            if(CATEId > 0){
                                $('#quan-post-tag' + threadId).find('.tag-top1').remove();
                            }
                        }else if(option_type == 'top2'){
                            _this.data('option-type', 'cancel_top2');
                            _this.html('<a href="javascript:;">取消置顶2</a>');

                            if(data.is_top == 0){
                                $('#quan-post-tag' + threadId).find('.tag-top1').remove();
                                $('#quan-post-tag' + threadId).append('<i class="tag-w tag-top2"></i>');
                            }
                        }else if(option_type == 'cancel_top2'){
                            _this.data('option-type', 'top2');
                            _this.html('<a href="javascript:;">圈内置顶</a>');
                            $('#quan-post-tag' + threadId).find('.tag-top2').remove();
                        }else if(option_type == 'top3'){
                            _this.data('option-type', 'cancel_top3');
                            _this.html('<a href="javascript:;">取消置顶3</a>');

                            $('#quan-post-tag' + threadId).find('.tag-top1').remove();
                            $('#quan-post-tag' + threadId).find('.tag-top2').remove();
                            $('#quan-post-tag' + threadId).append('<i class="tag-w tag-top3"></i>');
                        }else if(option_type == 'cancel_top3'){
                            _this.data('option-type', 'top3');
                            _this.html('<a href="javascript:;">总置顶</a>');
                            $('#quan-post-tag' + threadId).find('.tag-top3').remove();
                        }else if(option_type == 'lock'){
                            _this.data('option-type', 'cancel_lock');
                            _this.html('<a href="javascript:;">取消锁定</a>');
                        }else if(option_type == 'cancel_lock'){
                            _this.data('option-type', 'lock');
                            _this.html('<a href="javascript:;">锁定</a>');
                        }else if(option_type == 'down'){
                            _this.data('option-type', 'cancel_down');
                            _this.html('<a href="javascript:;">取消沉底</a>');
                            $('#quan-post-tag' + threadId).find('.tag-top1').remove();
                            $('#quan-post-tag' + threadId).find('.tag-top2').remove();
                            $('#quan-post-tag' + threadId).find('.tag-top3').remove();
                        }else if(option_type == 'cancel_down'){
                            _this.data('option-type', 'down');
                            _this.html('<a href="javascript:;">沉底</a>');
                        }

                        $.xcDialog.alert({'content':'<i class="tick"></i>'+'操作成功'});
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                        return false;
                    }
                }
            );
        });

        //锁定帖子操作
        $(document).on('click', '#lock-thread-confirm-btn', function(){
            $.post(thread_setting_url,{id: threadId, type: 'lock'},
                function (data) {
                    if(data.code == 200){
                        $('.overlay').hide();
                        $('#option-community-confirm-layer').hide();

                        $('.post-operate ul li').eq(7).data('option-type', 'cancel_lock');
                        $('.post-operate ul li').eq(7).html('<a href="javascript:;">取消锁定</a>');

                        $.xcDialog.alert({'content':'<i class="tick"></i>'+'操作成功'});
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                        return false;
                    }
                }
            );
        });

        //沉底帖子操作
        $(document).on('click', '#down-thread-confirm-btn', function(){
            $.post(thread_setting_url,{id: threadId, type: 'down'},
                function (data) {
                    if(data.code == 200){
                        $('.overlay').hide();
                        $('#option-community-confirm-layer').hide();

                        $('.post-operate ul li').eq(8).data('option-type', 'cancel_down');
                        $('.post-operate ul li').eq(8).html('<a href="javascript:;">取消沉底</a>');
                        $('#quan-post-tag' + threadId).find('.tag-top1').remove();
                        $('#quan-post-tag' + threadId).find('.tag-top2').remove();
                        $('#quan-post-tag' + threadId).find('.tag-top3').remove();

                        $.xcDialog.alert({'content':'<i class="tick"></i>'+'操作成功'});
                    }else{
                        $.xcDialog.alert({'content':data.msg});
                        return false;
                    }
                }
            );
        });
    });
});