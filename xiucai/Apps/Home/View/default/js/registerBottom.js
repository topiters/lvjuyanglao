$(function () {
    var _origin=$(".pic_tools").css("bottom");
    var _bottom=$(".registered-bottom").length!=0?$(".registered-bottom").height():_origin;
    $(".fixed-yqhy").animate({bottom: parseInt(_bottom)+180},300);
    $(".pic_tools").animate({bottom: _bottom},300);
    $('.submit-box input').iCheck({
        checkboxClass: 'icheckbox_minimal-orange',
        radioClass: 'iradio_minimal',
        increaseArea: '20%'
    });
    $(".registered-bottom .registered-bottom-close").on("click", function () {
        $(".registered-bottom").remove();
        $("#footer").css({"padding-bottom":"0"});
        $(".pic_tools").animate({bottom: _origin},300);
        $(".fixed-yqhy").animate({bottom: parseInt(_origin)+185},300);
    });
    $(".registered-bottom input[type=text]").placeholder({isUseSpan:true,onInput:true});
    // $("#footer").css({"padding-bottom":"169px"});
    $("#footer").css({"padding-bottom":"88px"});
    $(window).scroll(fixedBottom);
    $(window).resize(fixedBottom);
    function fixedBottom(){
        var s_left = $(window).scrollLeft();
        $(".registered-bottom").css("left",~s_left+1);
    }
    $("#protocol").on("ifChanged", function () {
        var agree = $(this).is(":checked");
        if(agree){
            $('#bottom_error_msg').html('').hide();
            $(".submit-box .register-btn").removeClass("no").removeAttr("title");
        }else{
            $('#bottom_error_msg').html('请先同意用户协议').show();
            $(".submit-box .register-btn").addClass("no").attr("title","请先同意用户协议");
        }
    });
    var isRegister = false;
    $("#bottom-register-btn").on("click", function () {
        var phone = $('#bottom_phone').val();
        var code = $('#bottom_code').val();
        var verify_code = $('#bottom_verify_code').val();
        if($('#protocol').is(':checked')) {
        }else{
            $('#bottom_error_msg').html('请先同意用户协议').show();
            return false;
        }
        if(phone==''){
            $('#bottom_error_msg').html('请输入手机号码').show();
            return false;
        }
        if(!checkMobile(phone)){
            $('#bottom_error_msg').html('手机号格式不对').show();
            return false;
        }
        if(code==''){
            $('#bottom_error_msg').html('请输入短信验证码').show();
            return false;
        }
        /*if(verify_code==''){
            $('#bottom_error_msg').html('请输入验证码').show();
            return false;
        }*/
        var _this = $(this);
        if (!isRegister) {
            isRegister = true;
            _this.val('注册中...');
            var registerUrl=encodeURIComponent(document.location.href);
            $.post(bottom_sms_reg,{'sms_login_phone':phone,'sms_login_code':code,'need_verify_code':1,'bottom_register':1,'verify_code':verify_code,'register_url':registerUrl},function(data){
                if(data.code == 200){
                    if(data.isFirst == 'yes'){
                        $('#bottomRegRewardCode').show();
                        $('.overlay').show();
                    }else{
                        var url =decodeURIComponent(GetQueryString('url'));
                        if(url == 'null'){
                            if(data.url == ''){
                                window.location.reload(true);
                                return false;
                            }else{
                                window.location.href = data.url;
                                return false;
                            }
                        }else{
                            window.location.href = url;
                            return false;
                        }
                    }
                }else if(data.code == 300){
                    $('#bottom_error_msg').html(data.msg).show();
                    _this.val('注册');
                }
                isRegister = false;
            });
        }
    });
    var isSubmitRegisterBottom = false;
    $("#bottom_get_sms_code").on("click", function () {
        if($(this).hasClass('disabled')){
            return;
        }
        var phone = $('#bottom_phone').val();
        var verify_code = $('#bottom_verify_code').val();
        if($('#protocol').is(':checked')) {
        }else{
            $('#bottom_error_msg').html('请先同意用户协议').show();
            return false;
        }
        if(phone==''){
            $('#bottom_error_msg').html('请输入手机号码').show();
            return false;
        }
        if(!checkMobile(phone)){
            $('#bottom_error_msg').html('手机号格式不对').show();
            return false;
        }
        if(verify_code==''){
            $('#bottom_error_msg').html('请输入验证码').show();
            return false;
        }
        var _this = $(this);
        if (!isSubmitRegisterBottom) {
            isSubmitRegisterBottom = true;
                if (!$(this).hasClass("disabled")) {
                    $(this).addClass("disabled");
                    $.ajax({
                        type: "POST",
                        url: bottom_sms_reg_sendcode,
                        data: {cellphone:phone,'bottom_register':1,'sms_login_code':verify_code},
                        success: function(result){
                            if (result.code == 1){
                                time(_this);
                                $("#bottom_get_sms_code").addClass("disabled");
                                $('#bottom_error_msg').html('').hide();
                                $('#bottom_reg_code_img').click();
                            }else if(result.code == 2){
                                $('#bottom_error_msg').html(result.msg).show();
                                $("#bottom_get_sms_code").removeClass("disabled");
                            }
                            isSubmitRegisterBottom = false;
                        }
                    });
                }
        }
    });

    //
    $("#bottom_phone").on('input propertychange',function () {

        if(checkMobile($(this).val())){
   
            if($("#bottom_verify_code").val().length==4){
                $("#bottom_get_sms_code").removeClass("disabled");

                return;
            }
        }

        $("#bottom_get_sms_code").addClass("disabled");
    });
    //
    $("#bottom_verify_code").on('input propertychange',function () {
        if($(this).val().length==4){
            if(checkMobile($("#bottom_phone").val())){
                $("#bottom_get_sms_code").removeClass("disabled");
                return;
            }
        }
        $("#bottom_get_sms_code").addClass("disabled");
    });

});