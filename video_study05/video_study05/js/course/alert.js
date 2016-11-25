(function ($) {
    var xcDialog = {
        alert: function (options) {
            var defaults = {
                content: "秀财网", timeOut: 2000, onClose: function () {
                }
            };
            options = $.extend(true, {}, defaults, options);

            //处理相应的对话框
            var panel = '<div class="xcDialog"> <div class="alert">' + options.content + '</div></div>';
            $('body').append(panel);

            var tid = setTimeout(function () {
                $(".xcDialog").hide().remove();
                options.onClose();
            }, options.timeOut);

        }
    };
    $.xcDialog = xcDialog;
})(jQuery);

