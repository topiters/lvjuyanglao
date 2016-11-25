$(function(){
	$(".close_icon").click(function(){
		$(".login").css({"display":"none"});
		//$("body").css({"overflow":"auto"});
		$("#allsccren").removeClass('allsccren');
	});
});
function login(){
	$("#allsccren").addClass('allsccren');
	//$("body").css({"overflow":"hidden"});
	$(".login").css({"display":"block"});
	$("#all_login").css({"display":"block"});
	$("#register_").css({"display":"none"});
	
}
function zhuce(){
	$("#allsccren").addClass('allsccren');
	//$("body").css({"overflow":"hidden"});
	$(".login").css({"display":"block"});
	$("#all_login").css({"display":"none"});
	$("#register_").css({"display":"block"});
}

function close_x(){
	$(".login").css({"display":"none"});
	//$("body").css({"overflow":"auto"});
	$("#allsccren").removeClass('allsccren');
}

//登录成功之后
function logined(){
	alert("登录成功");
	close_x();
	$("#wei_denglu").css({"display":"none"});
	$(".login_zh_").css({"display":"block"});
}
function exit(){
	alert("退出登录");
	close_x();
	$("#wei_denglu").css({"display":"block"});
	$(".login_zh_").css({"display":"none"});
}
//页码特效
$(function(){
	$(".page_course a").click(function(){
		//alert(0);
		$(this).addClass('page_active');
		$(this).siblings().removeClass('page_active');
	});
})


//帮助中心
$(function(){                		
	$(".help_center .help_question .help_title").click(function(){
		$(this).next().removeClass('hide');
		$(this).parent().siblings().children('.help_tab').addClass('hide');
	});
})