/**
 * Created by Administrator on 2015/4/13.
 */
var coursePlayer = {

    play: function (contentId,vedeoId) {
        var swfVersionStr = "11.4.0";
        var flashvars = {};
        var params = {};

        flashvars.uu = '0115ad55a5';
        flashvars.vu = vedeoId;
        flashvars.pu = 'a0a5288acc';
        flashvars.auto_play = 1;
        flashvars.gpcflag = 1;
        flashvars.more = 0;

        flashvars.definition = 0;
        flashvars.extend = 0;
        flashvars.isrotation = 0;
        flashvars.share = 0

        params.quality = "high";
        params.bgcolor = "#000000";
        params.allowscriptaccess = "always";
        params.allowfullscreen = "true";
        params.wmode = "opaque";

        var attributes = {};
        attributes.id = "letv_player";
        attributes.name = "player";
        attributes.align = "middle";
        attributes.height="100%";
        attributes.width="100%";
        swfobject.embedSWF(
            "../../../player.letvcdn.com/lc04_p/201608/09/11/18/11/newplayer/bcloud.swf-"/*tpa=http://yuntv.letv.com/bcloud.swf*/,
            contentId,
            "100%", "100%",
            swfVersionStr,
            "",
            flashvars, params, attributes);

    }
}