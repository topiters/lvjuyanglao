var last = "";
$(function(){
    $('#search_content,#search_content_index').keyup(function(){
        clearTimeout(last);
        if($.trim($(this).val())==""){
            $(this).attr("value","");
            //$('#topSearchContent').hide();
            $(this).parent().parent().find('#topSearchContent').hide();
        }else{
            var inputString = $(this).val();
            var _this = $(this);
            last=setTimeout(function(){ //设时延迟0.5s执行
                questionSearch(inputString,_this);
            },500);
        }
    });
    $('#search_content,#search_content_index').focus(function(){
        var _this = $(this);
        document.onkeydown = function (e) {
            var theEvent = window.event || e;
            var code = theEvent.keyCode || theEvent.which;

            if (code == 13) {
                var search_from = $('#search_from').val();
                //var searchContent = $('#search_content').val();
                var searchContent = _this.val();
                if($.trim(searchContent)){
                    if(search_from == 'thread'){
                        location_url = search_result_thread+'?word=';
                    }else if(search_from == 'course'){
                        location_url = search_result+'?word=';
                    }else if(search_from == 'tutor'){
                        location_url = search_result_thread+"?type=3&word=";
                    }
                    location.href = location_url+searchContent;
                }
            }
        }
    });
})

$("#search_button,#search_button_index").bind("click", function(){
    searchAll($(this));
});

function searchAll(_this){
    //var searchContent = $('#search_content').val();
    var searchContent = _this.parent().find('.search_content_input').val();
    if($.trim(searchContent)){
        location.href = search_result+'?word='+searchContent;
    }else{
        dialog_alert('请输入搜索内容');
        return false;
    }
}

function questionSearch(thread_title,_this){
    $.post(search_ajax, {thread_title: ""+thread_title+""},
        function(result){
            if(result.code == 200){
                //$('#topSearchContent').html(result.html);
                //$('#topSearchContent').show();
                _this.parent().parent().find('#topSearchContent').html(result.html);
                _this.parent().parent().find('#topSearchContent').show();
            }else{
                //$('#topSearchContent').hide();
                _this.parent().parent().find('#topSearchContent').hide();
            }
            return false;
        }
    );
}