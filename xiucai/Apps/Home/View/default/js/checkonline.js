$(function () {
    setTimeout(function () {
        checkOnLine();
        setInterval(function () {
            checkOnLine();
        }, 3000 * 60);
    }, 5000);
});

function checkOnLine() {
    var url = "/account/checkonline/";
    $.get(url, function (data) {
        if (data.status == 403) {
            document.location.href='/account/alert/?url='+encodeURIComponent( document.location.href);
        }
    });
}