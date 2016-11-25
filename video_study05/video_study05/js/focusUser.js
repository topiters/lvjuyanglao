$(document).ready(function () {
    var isSubmit = false;
    $('div').on('click', '.cancel_focus_user', function (ev) {

        if (!isSubmit) {
            isSubmit = true;
            var _this = $(this);
            var userId = $(this).attr('user_id');
            $.ajax({
                type: "POST",
                url: cancel_focus_url,
                data: {userId: userId},
                success: function (result) {
                    if (result.code == 200) {
                        _this.hide();
                        _this.next().css("display", 'block');

                        $("[data-pop-content]").attr('data-pop-content','');
                    }
                    else {
                        dialog_alert(result.msg);
                    }
                    isSubmit = false;
                }
            });
        }
        ev.stopPropagation();
        return false;
    });

    $('div').on('click', '.sure_focus_user', function (ev) {
        if ($('.a-login').length > 0) {
            showLogin();
            return false;
        }
        if (!isSubmit) {
            isSubmit = true;
            var _this = $(this);
            var userId = $(this).attr('user_id');
            $.ajax({
                type: "POST",
                url: sure_focus_user_url,
                data: {userId: userId},
                success: function (result) {
                    if (result.code == 200) {
                        _this.hide();
                        _this.prev().css("display", 'block');

                        $("[data-pop-content]").attr('data-pop-content','');
                    }
                    else {
                        dialog_alert(result.msg);
                    }
                    isSubmit = false;
                }
            });
        }
        ev.stopPropagation();
        return false;
    });

    $('div').on('click', '.toppic-bar .toppic-title a', function (ev) {
        ev.stopPropagation();
    });
})