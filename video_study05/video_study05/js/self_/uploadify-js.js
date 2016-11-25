var formData='{"'+session_name+'":"'+session_id+'"}';
formData= $.parseJSON(formData);
$(document).ready(function(){
	var jcrop_api;

    setTimeout(function(){
        $("#avatarUpload").uploadify({
            'auto'				: true,
            'multi'			: false,
            'uploadLimit'		: 999,
            'formData'			: formData,
            'buttonText'		: '上传头像',
            'buttonClass' : 'common-all-btn',
            'height'			: 40,
            'width'			: 220,
            'color':'#fff',
            'removeCompleted'	: false,
            'swf'				: '/assets/uploadify/uploadify/uploadify.swf',
            'uploader'			: uploadUrl,
            'fileTypeExts'		: '*.gif; *.jpg; *.jpeg; *.png;',
            'fileSizeLimit'		: '2048KB',
            // 'debug'				: true,
            'onUploadSuccess' : function(file, data, response) {
                var msg = $.parseJSON(data);
                if( msg.result_code == 1 ){
                    var oriPath = msg.result_des;
                    var random = Math.random();
                    msg.result_des += "?v=" + random;
                    //清除图片信息
                    // $("div.jcrop-tracker").remove();
                    // $(".shadow").hide();
                    $("#img").val( oriPath );
                    //$("#target").removeAttr('style').removeAttr("height").removeAttr("width");
                    $("#target").attr("src", msg.result_des );
                    $(".preview").attr("src", msg.result_des );
                    //$(".jcrop-holder img").attr("src" , $("#target").attr("src"));

                    $('#target').Jcrop({
                        minSize: [80,80],
                        setSelect: [0,0,220,220],
                        onSelect: updateCoords,
                        aspectRatio: 1
                    },
                    function(){
                        // Use the API to get the real image size
                        //var bounds = this.getBounds();
                        //boundx = bounds[0];
                        //boundy = bounds[1];
                        // Store the API in the jcrop_api variable
                        jcrop_api = this;
                        updateCoords(jcrop_api.tellSelect());
                    });
                    // $(".imgchoose").show(1000);
                    //$("#avatar_submit").show(1000);
                } else {
                    alert('上传失败。');
                }
            },
            'onClearQueue' : function(queueItemCount) {
                alert( $('#img1') );
            },
            'onCancel' : function(file) {
                alert('The file ' + file.name + ' was cancelled.');
            }
        });

        $("#avatarProfileUpload").uploadify({
            'auto'				: true,
            'multi'			: false,
            'uploadLimit'		: 999,
            'formData'			: formData,
            'buttonText'		: '更换头像',
            'buttonClass' : 'btn_sub_upload_avatar',
            'height'			: 142,
            'width'			: 142,
            'color':'#fff',
            'removeCompleted'	: false,
            'swf'				: '/assets/uploadify/uploadify/uploadify.swf',
            'uploader'			: uploadUrl,
            'fileTypeExts'		: '*.gif; *.jpg; *.jpeg; *.png;',
            'fileSizeLimit'		: '2048KB',
            'onDialogOpen' : function() {
                isUploadDialogOpen=true;
            },
            'onDialogClose':function(){
                isUploadDialogOpen=false;
            },
            'onCancel':function(){
                isUploadDialogOpen=false;
                //hidEditAvatar();
            },
            // 'debug'				: true,
            'onUploadSuccess' : function(file, data, response) {
                isUploadDialogOpen=false;
                //hidEditAvatar();
                var msg = $.parseJSON(data);
                if( msg.result_code == 1 ){
                    var oriPath = msg.result_des;
                    var random = Math.floor(Math.random()*10000);
                    msg.result_des += "?preventCatch=" + random;
                    //清除图片信息
                    // $("div.jcrop-tracker").remove();
                    // $(".shadow").hide();
                    $("#img").val( oriPath );
                    $("#target").removeAttr('style').removeAttr("height").removeAttr("width");

                    $("#target").attr("src", msg.result_des );
                    //$(".preview").attr("src", msg.result_des );
                    $(".jcrop-holder img").attr("src" , $("#target").attr("src"));

                    $('#target').Jcrop({
                            minSize: [80,80],
                            setSelect: [0,0,220,220],
                            onSelect: updateCoords,
                            aspectRatio: 1
                        },
                        function(){
                            // Use the API to get the real image size
                            //var bounds = this.getBounds();
                            //boundx = bounds[0];
                            //boundy = bounds[1];
                            // Store the API in the jcrop_api variable
                            jcrop_api = this;
                            updateCoords(jcrop_api.tellSelect());
                        });
                    // $(".imgchoose").show(1000);
                    //$("#avatar_submit").show(1000);
                } else {
                    alert('上传失败。');
                }
            },
            'onClearQueue' : function(queueItemCount) {
                alert( $('#img1') );
            },
            'onCancel' : function(file) {
                alert('The file ' + file.name + ' was cancelled.');
            }
        });
    },10);

	//头像裁剪
	function updateCoords(c)
	{
		$('#x').val(c.x);
		$('#y').val(c.y);
		$('#w').val(c.w);
		$('#h').val(c.h);
	};
	function checkCoords()
	{
		if (parseInt($('#w').val())) return true;
		alert('请选择图片上合适的区域');
		return false;

	};

	//document.domain='xiucai.com';
	$("#avatar_submit").click(function(){
		var img = $("#img").val();
		var x = $("#x").val();
		var y = $("#y").val();
		var w = $("#w").val();
		var h = $("#h").val();


		var member_id = $("#member_id").val();
		if( checkCoords() ){

			$.ajax({
				type: "GET",
				url: "http://yz.assets.xiucai.com/assets/handler/crop.php?v="+Math.random(),
				data: {"img":img,"x":x,"y":y,"w":w,"h":h,"member_id": member_id},
				dataType: "jsonp",
				success: function(msg){
                    //msg = $.parseJSON(msg);
                    if( msg.result_code == 1 ){
                        $.ajax({
                            type: "GET",
                            data: {"pic_big":msg.result_des.big,"pic_small":msg.result_des.small,"member_id":member_id},
                            url: ajax_update_avatar,
                            dataType: "json"
                        });
                    	$('#avatar').attr('src', msg.result_des.big + "?v="+Math.random());
                    	$('#head_pic').val(msg.result_des.small+"?v="+Math.random());
                        $('#head_pic_large').val(msg.result_des.big+"?v="+Math.random());
                    	jcrop_api.destroy();
                    	/*$('html,body').animate({scrollTop:$('#avatar').offset().top-150},1000,'swing',function(){
                    	});*/
                    } else {
                    	alert("上传失败。");
                    }
                },
                error: function () { }
            });
		}

		$("#pop_bg").hide();
        $("#pop_bg .img_bg").html('<img id="target" border="0" src=""/>');
        $("#layer_bg").hide();

		//var tw=$("#target").attr("width");
		//var th=$("#target").attr("height");
		//$(".jcrop-tracker img").css("width" ,tw );
		//$(".jcrop-tracker img").css("height" , th);
	});

    $(".pop_bg .res").click(function(event){
        event.preventDefault();
        $("#pop_bg").hide();
        $("#pop_bg .img_bg").html('<img id="target" border="0" src=""/>');
        $("#layer_bg").hide();
        jcrop_api.destroy();
    });

});