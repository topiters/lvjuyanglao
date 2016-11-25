$(document).on('click','.notBegin',function(){
    $('#notBeginDialogReleaseTime').html($(this).attr('release-time'));
    $("#notBeginDialog").show();
    $(".overlay").show();
    return false;
})

$(document).on('click','.closeNotBeginDialog',function(){
    $("#notBeginDialog").hide();
    $(".overlay").hide();
    return false;
})