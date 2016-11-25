$(document).on('click','.checkVip',function(){
    $("#view_course").attr('href',$(this).attr('href'));
    $("#vip_out_day").show();
    $(".overlay").show();
    return false;
})

$(document).on('click','#close_vip_out_day',function(){
    $("#vip_out_day").hide();
    $(".overlay").hide();
    return false;
})