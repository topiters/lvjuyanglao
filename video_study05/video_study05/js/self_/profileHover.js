$(function(){
    hover_friend_show();
});

function hover_friend_show(){
    // 列表内容块滑过效果
    $(".concern-page-list>div.concern-friends-box").hover(
        function(){
            $(this).addClass('box-gray-hightlight');
            $(this).find('.hover-btn-block').show();
        },
        function(){
            $(this).removeClass('box-gray-hightlight');
            $(this).find('.hover-btn-block').hide();
        }
    )

    $(".concern-page-list ul li").hover(
        function(){
            $(this).addClass('box-gray-hightlight');
            $(this).find('.hover-btn-block').show();
        },
        function(){
            $(this).removeClass('box-gray-hightlight');
            $(this).find('.hover-btn-block').hide();
        }
    )
}