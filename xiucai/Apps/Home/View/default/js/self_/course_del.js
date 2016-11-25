$("#my-course-del").on('click',function(){
	//alert("1");
    $('.i-close-del').show();
    $(".finished-delete").show();
    $("#isLoadingDel").val(1);
})
$(document).on('click', '.finished-delete', function(){
    $("#my-course-del").show();
    $('.i-close-del').hide();
    $(this).hide();
    $("#isLoadingDel").val(2);
});
$(document).on('click','.i-close-del',function(){
    var _this = $(this);
    var inventory_id = $(this).attr("inventory-id");
    var d = dialog({
        title: '',
        content: '你确定放弃学习？',
        okValue: '确 定',
        skin:'alert-dialog modal-dialog',
        ok: function () {
            /*$.ajax({
                type: "POST",
                url: course_delete_url,
                data: {inventory_id : inventory_id},
                success: function(result){
                    if (result.code == 200){
                        _this.parent().fadeOut();
                        $('.overlay-transparent').hide();
                    }
                    else{
                        dialog_alert("删除失败");
                        $('.overlay-transparent').hide();
                    }
                }
            });*/
           //$(".overlay-transparent").addClass('hide');
            $('.overlay-transparent').hide();
           alert("success");
        },
        cancelValue:'取 消',
        cancel: function () {
            $('.overlay-transparent').hide();
        }
    });
    $('.overlay-transparent').show();
    d.show();
})