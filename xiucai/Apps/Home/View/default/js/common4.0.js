var currentUrl = window.location.host+window.location.pathname;
$(function(){
    //hash调用登录和注册的弹窗
    var url='';
    try {
        url = decodeURIComponent(document.location.href);
    }catch(ex) {}

    if(url.indexOf("#login")>0 && $('#header .a-login').length>0){
        showLogin();
    }
    if(url.indexOf("#register")>0 && $('#header .a-register').length>0){
        showRegister();
    }

    $('.close-dialog-board').on('click',function(){
        $('#is-activate-layer').hide();
        $('.overlay').hide();
    });
    var __timer = null;
    $('.nav-menu-btn').on('mouseenter', function () {
        clearTimeout(__timer);
        $('.drop-down-menu:not(:animated)').slideDown();
    }).on('mouseleave', function () {
        __timer = setTimeout(function () {
            $('.drop-down-menu').slideUp();
        },200);
    });
    $('.drop-down-menu').on('mouseenter', function () {
        clearTimeout(__timer);
    }).on('mouseleave', function () {
        __timer = setTimeout(function () {
            $('.drop-down-menu').slideUp();
        },200);
    });
});
/**
 * 检查手机号码格式
 * @param v
 * @returns {boolean}
 */
function checkMobile(v){
    var reg=/^0{0,1}(13[0-9]|15[0-9]|153|156|17[0-9]|18[0-9])[0-9]{8}$/;
    if(reg.test(v)){
        return true;
    }else{
        return false;
    }
}

/**
 * 检查QQ号码
 * @param v
 * @returns {boolean}
 */
function checkQq(v){
    var reg=/^[1-9][0-9]{4,9}$/;
    if(reg.test(v)){
        return true;
    }else{
        return false;
    }
}

/**
 * 检查电话号码(座机)格式
 * @param v
 * @returns {boolean}
 */
function checkTellphone(v)
{
    var result=v.match(/\d{3}-\d{8}|\d{4}-\d{7}/);
    if(result==null) return false;
    return true;
}

/**
 * 检查用户名
 * @param v
 * @returns {boolean}
 */
function checkUserName(v)
{
    var reg = /^[A-Za-z0-9_\-\u2E80-\uFE4F]+$/;
    if(reg.test(v)){
        return true;
    }else{
        return false;
    }
}


/**
 * 检查用户职位
 * @param v
 * @returns {boolean}
 */
function checkPositionName(v)
{
    var reg = /^[A-Za-z_\-\u4e00-\u9fa5]+$/;
    if(reg.test(v)){
        return true;
    }else{
        return false;
    }
}


/**
 * 检查邮箱格式
 * @param v
 * @returns {boolean}
 */
function checkEmail(v)
{
    var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(reg.test(v)){
        return true;
    }else{
        return false;
    }
}

/**
 * 检查是否包含空格
 * @param str
 * @returns {boolean}
 */
function isHaveSpaces(str){
    if(str.indexOf(" ") >=0){
        return true;
    }else{
        return false;
    }
}

/**
 *删除左右两端的空格
 * @param str
 * @returns {XML|string|void|*}
 */
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 过滤字符串所有空格，HTML标签
 * @param str
 * @returns {XML|string|*}
 */
function removeHTMLTag(str) {
    str = ignoreSpaces(str);
    str = str.replace(/&nbsp;/ig,'');//去掉&nbsp;
    str = str.replace(/ /g,'');
    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/ /g,'');
    return str;
}

/**
 * 过滤所有空格
 * @param string
 * @returns {string}
 */
function ignoreSpaces(string) {
    var temp = "";
    string = '' + string;
    var splitstring = string.split(" ");
    for(var i = 0; i < splitstring.length; i++){
        //splitstring[i] = $.trim(splitstring[i]);
        if(splitstring[i] == "" || splitstring[i] == " " || splitstring[i] == "&nbsp;"){
            continue;
        }else{
            temp += splitstring[i];
        }
    }

    return temp;
}

/**
 * JS获取URL里参数的值
 * @param name
 * @returns {*}
 * @constructor
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

/**
 * 判断值是否为空
 * @param value
 * @returns {boolean}
 */
function is_empty(value){
    if( value == '' || value == null || typeof value == 'undefined'){
        return true ;
    }
    return false ;
}

/**
 * JS判断字符串长度,英文占一个字符,中文占两个字符
 * @param str
 * @returns {number}
 */
function strlength(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        }
        else {
            len += 2;
        }
    }
    return len;
}

/**
 * 判断变量是否存在
 * @param variableName
 * @returns {boolean}
 */
function isExitsVariable(variableName) {
    try {
        if (typeof(variableName) == "undefined") {
            //alert("value is undefined");
            return false;
        } else {
            //alert("value is true");
            return true;
        }
    } catch(e) {}
    return false;
}

function setRead(ifDecreaseCount,messageId,sourceId,sourceTypeId,actionType,sourceParentId){
    $.post(set_read_url, {ifDecreaseCount: ifDecreaseCount,messageId: messageId, sourceId:sourceId, sourceTypeId:sourceTypeId, actionType:actionType},
        function(result){
            if(result.code == 200){
                if(sourceTypeId == 1 || sourceTypeId == 7){
                    if(actionType == 1){
                        window.location.href = thread_url+sourceParentId;
                    }else{
                        window.location.href = course_url+'/'+result.redirectId;
                    }
                }else if(sourceTypeId == 2){
                    window.location.href = thread_url+sourceParentId;
                }else if(sourceTypeId == 3){
                    window.location.href = thread_url+sourceId;
                }else if(sourceTypeId == 4){
                    window.location.href = topic_url+sourceId;
                }else if(sourceTypeId == 5){
                    //window.open(profile_url+sourceId);
                }else if(sourceTypeId == 6 || sourceTypeId == 8){
                    window.location.href = thread_url+sourceParentId;
                }else if(sourceTypeId == 9 || sourceTypeId == 10 || sourceTypeId == 11){
                    window.location.href = task_url;
                }else if(sourceTypeId == 12){
                    window.location.href = task_invite_url;
                }else if(sourceTypeId == 13){
                    window.location.href = vip_index_url;
                }else if(sourceTypeId == 14){
                    window.location.href = "/task/mall";
                }else if(sourceTypeId == 15){
                    window.location.href = "/user/";
                }else if(sourceTypeId == 17){
                    window.location.href = thread_url+sourceId+'?source=255';
                }else if(sourceTypeId == 18){
                    window.location.href = thread_url+sourceParentId+'?source=255';
                }else if(sourceTypeId == 19){
                    window.location.href = thread_url+sourceId+'?source=255';
                }else if(sourceTypeId == 20){
                    window.location.href = thread_url+sourceId+'?source=255';
                }else if(sourceTypeId == 21){
                    window.location.href = '/class/'+sourceParentId+'/?noteId='+sourceId;
                }else if(sourceTypeId == 22){
                    window.location.href = '/class/'+sourceParentId+'/?hid='+sourceId;
                }
            }
        }
    );
}



/**
 * 注册弹出弹窗
 */
$(function () {
    $(".a-register,.reg-btn").on('click',function(){
        login_register(showRegister());
    });
});

//function login_register(showType){
//  if(typeof showType!="function"){
//      return;
//  }
//  if($.trim($("#window").html()) == ''){
//      $.post(the_window,function(data){
//          if(data.code == 200){
//              $("#window").html(data.msg);
//              if(data.theIp == 'yes'){
//                  $("#pic-reg-code").parent().removeClass('hide');
//              }
//              showType();
//              
//          }else{
//              if(window.location.hash == "#login"){
//                  window.location.hash = '';
//              }
//              window.location.reload();
//              
//          }
//      });
//  }else{
//  	
//      showType();
//  }
//}

function showLogin(){
	if($.trim($("#window").html()) == ''){
		//alert(0);
		//$.post(the_window,function(data){
            //if(data.code == 200){
                //$("#window").html('').append(data.msg);
                //if(data.theIp == 'yes'){
                    $("#login-code-pic").parent().removeClass('hide');
                //}
                //showLogin();
            //}
            /*else{
                if(window.location.hash == "#login"){
                    window.location.hash = '';
                }
                window.location.reload();
            }*/
        //});
	}
   // if($.trim($("#window").html()) == ''){
        /*$.post(the_window,function(data){
            if(data.code == 200){
                $("#window").html('').append(data.msg);
                if(data.theIp == 'yes'){
                    //$("#pic-reg-code").parent().removeClass('hide');
                    $("#login-code-pic").parent().removeClass('hide');
                }
                showLogin();
            }else{
                if(window.location.hash == "#login"){
                    window.location.hash = '';
                }
                window.location.reload();
            }
        });*/
    //}else{
//      $(".overlay").show();
//      $(".xc-signUp-layer").hide();
//      $(".xc-login-layer:eq(0)").show();
//      $(".xc-retrieve-cellphone").hide();
//      $(".xc-retrieve-email").hide();
//      $(".xc-find-layer").hide();
//      setTimeout(function(){
//          ie_place_holder();
//      },200);
//      try{
//          xc_layer();
//          $(".xc-login-layer:eq(0) .xc-error-tips").css('visibility','hidden');
//      }catch(e){
//          setTimeout(function () {
//              xc_layer();
//              $(".xc-login-layer:eq(0) .xc-error-tips").css('visibility','hidden');
//          },500)
//      }
   // }
}
/**
 * 登录弹出弹窗
 */

$(".a-login").on('click',function(){
    //login_register(showLogin());
    showLogin()
});



function showRegister() {
    if($.trim($("#window").html()) == ''){
        $.post(the_window,function(data){
            if(data.code == 200){
                $("#window").html('').append(data.msg);
                if(data.theIp == 'yes'){
                    $("#pic-reg-code").parent().addClass('larger_three').removeClass('hide');
                }
                showRegister();
                try{
                    xc_layer();
                }catch (e){
                    setTimeout(function () {
                        xc_layer();
                    },500);
                }
            }else{
                if(window.location.hash == "#login"){
                    window.location.hash = '';
                }
                window.location.reload();
            }
        });
    }else{
        $(".overlay").show();
        $(".xc-reg-layer").show();
        $(".xc-login-layer:eq(0)").hide();
        $(".xc-retrieve-cellphone").hide();
        $(".xc-retrieve-email").hide();
        $(".xc-find-layer").hide();
        setTimeout(function(){
            ie_place_holder();
        },200);
        try{
            xc_layer();
            $(".xc-signUp-layer .xc-regist .xc-error-tips").css('visibility','hidden');
        }catch(e){
            setTimeout(function () {
                xc_layer();
                $(".xc-signUp-layer .xc-regist .xc-error-tips").css('visibility','hidden');
            },500)
        }
    }
}
/**
 * 按键keyup时移除空格并赋给本身
 * @param _this
 */
function removeSpacesValue(_this){
    _this.on('keyup',function(){
        if(isHaveSpaces(_this.val())){
            _this.val(removeHTMLTag(_this.val()));
        }
    });
}

/**
 * 验证手机号码
 * @param the_cellphone
 * @param code_btn
 * @param flag
 */
function cellphoneValidate(cellphone,code_btn,flag,error_tips){
        if(!isNaN(cellphone)){
            if(is_empty(cellphone)){
                error_tips.text('手机号不能为空!').css('visibility','visible');
                code_btn.addClass("disabled");
                if(flag == 2){
                    //$("#to-reg-btn").prop("disabled",true);
                }
                return false;
            }
            if(cellphone.length == 11){
                if(!checkMobile(cellphone)){
                    error_tips.text('手机号格式不正确!').css('visibility','visible');
                    code_btn.addClass("disabled");
                    if(flag == 2){
                        //$("#to-reg-btn").prop("disabled",true);
                    }
                    return false;
                }else{
                    error_tips.css('visibility','hidden');
                    var cellphone_verify ='';
                    /**
                     * 1手机找回密码验证手机号,2注册时验证手机号,3邀请用户注册验证手机号
                     */
                    if(flag == 1){
                        cellphone_verify = fp_cellphone_verify;
                    }else if(flag == 2){
                        cellphone_verify = reg_cellphone_verify;
                    }else if(flag == 3){
                        cellphone_verify = reg_cellphone_verify;
                    }
                    //ajax提交表单验证验证手机号码
                    $.post(cellphone_verify,{'cellphone':cellphone},function(data){
                        if(data.code == 1){
                            if(timeFlag){
                                code_btn.removeClass("disabled");
                            }
                            if(flag == 2){
                            }
                        }else if(data.code == 2){
                            code_btn.addClass("disabled");
                            error_tips.text(data.msg).css('visibility','visible');
                            if(flag == 2){
                                $("#reg-account").focus();
                                //$("#to-reg-btn").prop("disabled",true);
                            }
                            return false;
                        }
                    });
                }
            }else{
                code_btn.addClass("disabled");
                if(flag == 2){
                    //$("#to-reg-btn").prop("disabled",true);
                }
                return false;
            }
        }
}

/**
 * 邮箱注册,检查邮箱
 */
function emailValidate(email,flag,error_tips){
        //flag==1注册时验证邮箱,2找回密码时验证邮箱
        if(checkEmail(email)){
            $.post(reg_email,{'email':email},function(data){
                if(data.code == 1){
                    //可以注册
                    error_tips.text('').css('visibility','hidden');
                    //$("#to-reg-btn").removeAttr('disabled');
                    if(flag == 1){
                    }
                }else if(data.code == 2){
                    error_tips.text(data.msg).css('visibility','visible');
                    if(flag == 1){
                    }
                }
            });
        }else{
            error_tips.text('邮箱格式不正确!').css('visibility','visible');
            if(flag == 1){
                //$("#to-reg-btn").prop("disabled",true);
            }
            return false;
        }
}


/**
 *发送验证码倒计时
 */
var wait = 60;
var timeFlag = true;
function time(_this){
    if (wait == 0) {
        timeFlag = true;
        _this.removeClass("disabled");
        //_this.removeClass("btn-verificate-disabled");
        _this.html("重新获取验证码");
        wait = 60;
    } else {
        timeFlag = false;
        _this.addClass("disabled");
        //_this.addClass("btn-verificate-disabled");
        _this.html(wait + "秒后重新获取");
        wait--;
        setTimeout(function () {
                time(_this);
            },
            1000)
    }
}

/**
 * 点击按钮发送手机验证码
 * @param the_cellphone
 * @param get_code_btn
 */
function sendValidateCode(sms_login_phone,get_code_btn,flag,error_tips){
    get_code_btn.on('click',function(){
        var _this = $(this);
        if(_this.hasClass("disabled")){return;}
        if(is_empty(sms_login_phone.val())){
            _this.addClass("disabled");
            error_tips.text('手机号不能为空!').css('visibility','visible');
            if(flag == 2){
                //$("#to-reg-btn").prop("disabled",true);
            }else if(flag == 4){
                //$("#to-login-btn-sms").prop("disabled",true);
            }else if(flag == 3){
                //$("#invite-to-reg-btn").prop("disabled",true);
            }else if(flag == 1){
                //$("#find-pwd-cellphone-btn").prop("disabled",true);
            }
            return false;
        }else{
            if(flag == 4 || flag == 1){
                if(flag == 4){
                    var sms_login_code = $('#sms-login-code-pic').val();
                }else{
                    var sms_login_code = $('#pic-forgot-pwd-code').val();
                }
                if(sms_login_code == ''){
                    error_tips.text('请输入图片验证码').css('visibility','visible');
                    return false;
                }
                _this.addClass("disabled");
                var cellphone_sendcode ='';
                if(flag == 1){
                    cellphone_sendcode = fp_cellphone_sendcode;
                }else if(flag == 4){
                    cellphone_sendcode = sms_login_sendcode
                }else{return false;}
                //发送验证码
                $.post(cellphone_sendcode, {'cellphone': sms_login_phone.val(),'sms_login_code': sms_login_code }, function (data) {
                    if(data.code == 1){
                        //发送成功
                        time(_this);
                        if(flag == 4){
                            $('#sms_login_img').click();

                            if(data.is_reg == 0){
                                //$("#to-login-btn-sms").val("注册");
                                $("#to-login-btn-sms").data("is-reg", 0);
                                $(".jason-reg-info").show();
                                $(".jason-reg-tips").show().html("该手机尚未注册，设置密码后将自动创建秀财账户");
                            }
                        }else if(flag == 1){
                            $('#forgot_pwd_code_img').click();
                        }
                    }else if(data.code == 2){
                        //发送失败
                        error_tips.text(data.msg).css('visibility','visible');
                        _this.removeClass("disabled");
                        sms_login_phone.focus();
                        return false;
                    }
                });
            }
            if(flag != 4 && flag != 1){
                _this.addClass("disabled");
                var cellphone_sendcode ='';
                var pic_sms_reg_code='';
                /**
                 * 1手机找回密码验证手机号,2注册时验证手机号
                 * 3邀请用户注册验证手机号,4短信登录时发送验证码
                 */
                if(flag == 1){
                    cellphone_sendcode = fp_cellphone_sendcode;
                }else if(flag == 2){
                    cellphone_sendcode = reg_cellphone_sendcode;

                    // 注册时获取手机验证码的图片验证码
                    pic_sms_reg_code=$("#pic_sms_reg_code").val();

                    if(pic_sms_reg_code==''){
                        error_tips.text('请输入图片验证码').css('visibility','visible');
                        _this.removeClass("disabled");
                        return;
                    }

                }else if(flag == 3){
                    pic_sms_reg_code=$("#invite-reg-pic-code").val();

                    if(pic_sms_reg_code==''){
                        error_tips.text('请输入图片验证码').css('visibility','visible');
                        _this.removeClass("disabled");
                        return;
                    }
                    cellphone_sendcode = reg_cellphone_sendcode;
                }else if(flag == 4){
                    cellphone_sendcode = sms_login_sendcode
                }else{return false;}
                //发送验证码
                $.post(cellphone_sendcode, {'cellphone': sms_login_phone.val(),'pic_sms_reg_code':pic_sms_reg_code}, function (data) {
                    if(data.code == 1){
                        //发送成功
                        time(_this);
                        if(flag == 2){
                            //图片验证码更换
                            $("#pic_sms_reg_code").parent().find('img').click();
                        }else if(flag == 3){
                        }else if(flag == 1){
                        }
                    }else if(data.code == 2){
                        //发送失败
                        error_tips.text(data.msg).css('visibility','visible');
                        _this.removeClass("disabled");
                        sms_login_phone.focus();
                        if(flag == 2){
                        }else if(flag == 3){
                        }else if(flag == 1){
                        }
                        return false;
                    }
                });
            }
        }
    });
}

/**
 * 验证手机验证码
 * @param cellphone
 * @param cellphone_code
 * @param getcode_btn
 * @param flag
 * @param error_tips
 * @returns {boolean}
 */
function validateSmsCode(cellphone,cellphone_code,flag,error_tips,_this){
        //flag==1,用户手机注册;flag==2,邀请用户手机注册,flag==3,手机找回密码
        if(is_empty(cellphone)){
            error_tips.text('手机号不能为空!').css('visibility','visible');
            if(flag == 1){
                //$("#to-reg-btn").prop("disabled",true);
            }else if(flag == 2){
                //$("#invite-to-reg-btn").prop("disabled",true);
                }else if(flag == 3){
                //$("#find-pwd-cellphone-btn").prop("disabled",true);
                }
            return false;
        }
        if(is_empty(cellphone_code)){
            error_tips.text('手机验证码不能为空!').css('visibility','visible');
            if(flag == 1){
                //$("#to-reg-btn").prop("disabled",true);
            }else if(flag == 2){
                //$("#invite-to-reg-btn").prop("disabled",true);
                            }else if(flag == 3){
                //$("#find-pwd-cellphone-btn").prop("disabled",true);
                            }
            return false;
        }else{
            if(!isNaN(cellphone_code)){
                if(cellphone_code.length != 6){
                    error_tips.text('手机验证码长度不对!').css('visibility','visible');
                    if(flag == 1){
                        //$("#to-reg-btn").prop("disabled",true);
                    }else if(flag == 2){
                        //$("#invite-to-reg-btn").prop("disabled",true);
                                            }else if(flag == 3){
                        //$("#find-pwd-cellphone-btn").prop("disabled",true);
                                            }
                    return false;
                }else{
                    error_tips.text('').css('visibility','hidden');
                    var cellphone_verifycode = '';
                    if(flag == 3){
                        cellphone_verifycode = fp_cellphone_justVerifycode;
                    }else{
                        cellphone_verifycode = reg_cellphone_verifycode;
                    }
                    //提交验证码验证对不对
                    $.post(cellphone_verifycode,{'cellphone':cellphone,'code':cellphone_code},function(data){
                        if(data.code == 200){
                            //验证验证码成功
                            if(flag == 1){
                                _this.data("error","yes");
                            }else if(flag ==2){
                                _this.data("error","yes");
                            }else if(flag == 3){

                            }
                        }else if(data.code == 300){
                            //验证失败
                            error_tips.text(data.msg).css('visibility','visible');
                            if(flag ==1){
                                _this.data("error","error");
                            }else if(flag == 2){
                                _this.data("error","error");
                            }else if(flag == 3){

                            }
                            return false;
                        }else{
                            return false;
                        }
                    });
                }
            }else{
                error_tips.text('手机验证码是6位的数字!').css('visibility','visible');
                if(flag ==1){
                    //$("#to-reg-btn").prop("disabled",true);
                }else if(flag == 2){
                    //$("#invite-to-reg-btn").prop("disabled",true);
                                    }else if(flag == 3){
                    //$("#find-pwd-cellphone-btn").prop("disabled",true);
                                    }
                return false;
            }
        }
}

//右侧浮动栏
function showRightFloat(){
    var h=300;
    t = $(document).scrollTop();
    t > h ? $('#pic_top').show() : $('#pic_top').hide();
    var qrcode = $("#pic_qrcode").children("a");
    if(qrcode.data("status")==1){
        t > h ? qrcode.addClass("display") : qrcode.removeClass("display");
    }
}
$(document).ready(function(){
    showRightFloat();
    $(document).on('click','#pic_top',function(e){
        e.preventDefault();
        $(document.documentElement).animate({
            scrollTop: 0
        },1000);
        //支持chrome
        $(document.body).animate({
            scrollTop: 0
        },1000);

    });
});

$(window).scroll(function(){
    showRightFloat();
});

var is_called_fun = false;
function ie_place_holder(){
    if(!is_called_fun){
        //var login_place_holder = $(".tables input[type='text'],.tables input[type='password']");
        //if(login_place_holder.length>0) {
        //    //placeholder,IE支持
        //    //$(".login-box input").placeholder({isUseSpan:true,onInput:true});
        //    login_place_holder.placeholder({isUseSpan:true,onInput:true});
        //}
        $(".xc-layer input[type=text],.xc-layer input[type=password]").placeholder({isUseSpan:true,onInput:true});
        is_called_fun = true;
    }
}

function dialog_alert(content){
    var d = dialog({
        skin: 'alert-dialog',
        title: '',
        content: content,
        okValue: '确 定',
        ok: function () {$('.overlay-transparent').hide();}
    });
    $('.overlay-transparent').show();
    d.show();
}

function open_qq_login(type){
    var currentUrl = document.location.href.replace(document.location.hash,'');
    /*var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = "qq_login_redirect="+ escape (currentUrl) + ";expires=" + exp.toGMTString();*/
    var url = "/account/qqLogin?currentUrl="+escape(currentUrl)+"&type="+type;
    var iWidth=800; //弹窗口宽度;
    var iHeight=500; //弹窗口高度;
    var iTop = (window.screen.availHeight-30-iHeight)/2; //获窗口垂直位置;
    var iLeft = (window.screen.availWidth-10-iWidth)/2; //获窗口水平位置;
    window.open(url,'QQ登录',"height="+iHeight+",width="+iWidth+",top="+iTop+",left="+iLeft+",toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no");
}

function randomQQ(){
    var qq_array=["2852263842"];
    var index_qq = Math.floor((Math.random()*10000))%qq_array.length;
    var qq_url = "http://wpa.qq.com/msgrd?v=3&uin="+qq_array[index_qq]+"&site=qq&menu=yes";
    $(".qq_help a").attr("href",qq_url);
}

function clearTaskNotice(){
    $.post(clear_task_notice_url, {}, function (data) {
        if(data.code == 200){
            return true;
        }else{
            return false;
        }
    });
}

function is_empty(value){
    if( value == '' || value == null || typeof value == 'undefined'){
        return true ;
    }

    return false ;
}

function get_type(v){
    if(is_empty(v)){
        return 'null' ;
    }

    if(v instanceof Array){
        return 'array' ;
    }else if(typeof v == 'object'){
        return 'object' ;
    }else if(typeof v == 'number'){
        return 'number' ;
    }else{
        return 'string' ;
    }
}

function _debug(v){
    if(is_empty(v)){
        alert('null') ;
        return ;
    }

    var str ;

    if(v instanceof Array){
        str = "array=>\r\n" ;
        for(var i in v){
            if(v.hasOwnProperty(i)){
                str += '['+i+']='+v[i]+"\r\n" ;
            }
        }
        alert(str) ;
    }else if(typeof v == 'object'){
        str = "object=>\r\n" ;
        for(var i in v){
            if(v.hasOwnProperty(i)){
                str += i+':'+v[i]+"\r\n" ;
            }
        }
        alert(str) ;
    }else{
        alert(v) ;
        return ;
    }
}

// 判断是否支持css3
function supportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
        i,
        humpString = [],
        htmlStyle = document.documentElement.style,
        _toHumb = function (string) {
            return string.replace(/-(\w)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        };
 
    for (i in prefix)
        humpString.push(_toHumb(prefix[i] + '-' + style));
 
    humpString.push(_toHumb(style));
 
    for (i in humpString)
        if (humpString[i] in htmlStyle) return true;
 
    return false;
}

function showBindPhone(){
    $('#needBindPhoneDiv').show();
    $('.overlay').show();
}

$(document).on('click', '#headerGoToBindPhone', function(){
   var currentUrl = window.location.href;
   if(currentUrl.indexOf("account_safe") > 0){
       window.location.href=bindPhoneUrl+"?returnUrl="+encodeURIComponent('http://'+window.location.host+'/user/account_safe/')+'#bindPhone';
   }else{
       window.location.href=bindPhoneUrl+"?returnUrl="+encodeURIComponent(window.location.href)+'#bindPhone';
   }

});

$(document).on('click', '#closeNeedBindPhoneDiv', function(){
    window.location.reload();
});

