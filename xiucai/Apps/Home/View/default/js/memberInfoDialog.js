var isPopAllowClose = true;
var uid = 0;
var dia = dialog({id: 'user_pop', skin: 'mp_dialog'});
var popRequest;
$(function () {
    //$("a[href^='/user/']");
    $(document).on("mouseover", "a[href^='/user/'],a[href*='.com/user/']", function () {
        if (!$(this).hasClass('notCard')) {
            var href = $(this).attr('href');
            var reg = /\/user\/\d+\/$/;
            //alert(reg.test(href));
            if (reg.test(href) == true) {
                var regx = /\d+/;
                data_pop_uid = href.match(regx);
                uid = data_pop_uid;
                var content = $(this).attr('data-pop-content');
                var _pop_this = this;

                if (content == '' || content == undefined) {

                    if (popRequest) {
                        popRequest.abort();
                    }
                    popRequest = $.post(ajax_load_member_info_dialog_pop, {uid: data_pop_uid},
                        function (result) {
                            dia.content(result.html);
                            dia.show(_pop_this);
                            $(_pop_this).attr('data-pop-content', result.html);
                            isPopAllowClose = false;
                        }
                    );
                }
                else {
                    dia.content(content);
                    dia.show(_pop_this);
                    isPopAllowClose = false;
                }
            }
        }
    }).on("mouseout", function () {
        isPopAllowClose = true;
        closePop();
    })

    $(document).on("mouseover", ".ui-popup", function () {
        isPopAllowClose = false;
    }).on("mouseout", function () {
        isPopAllowClose = true;
        closePop();
    });
});

function closePop() {
    setTimeout(function () {
        if (isPopAllowClose) {
            //$(".ui-popup").hide();
            dia.close();
        }
    }, 200);
}