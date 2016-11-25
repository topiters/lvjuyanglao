

/**
 * 加入购物车
 */
function addCart(courseId,type,attrId,courseThums){
	
	
	if(WST.IS_LOGIN==0){
		login();
		return;
	}
	var params = {};
	params.courseId = courseId;
	params.gcount = 1;
	params.courseAttrId =attrId;
	params.rnd = Math.random();
	//alert(JSON.stringify(WST));
	//params.courseAttrId = $('#shopGoodsPrice_'+courseId).attr('dataId');
	//$("#flyItem img").attr("src",WST.DOMAIN  +"/"+ courseThums)
	jQuery.post(Think.U('Home/Cart/addToCartAjax') ,params,function(data) {
		var json = WST.toJson(data);
	
		if(json.status==1){
			
			if(type==1){
				WST.msg(json.msg,{offset: '200px'});
				location.href= Think.U('Home/Cart/toCart');
			}
		}else{
			WST.msg(json.msg,{offset: '200px'});
		}
	});
}
//修改商品购买数量
function changebuynum(flag){
	var num = parseInt($("#buy-num").val(),10);
	var num = num?num:1;
	if(flag==1){
		if(num>1)num = num-1;
	}else if(flag==2){
		num = num+1;
	}
	var maxVal = parseInt($("#buy-num").attr('maxVal'),10);
	if(maxVal<=num)num=maxVal;
	$("#buy-num").val(num);
}

//获取属性价格
function getPriceAttrInfo(id){
	var courseId = $("#courseId").val();
	jQuery.post( Think.U('Home/Goods/getPriceAttrInfo') ,{courseId:courseId,id:id},function(data) {
		var json = WST.toJson(data);
		if(json.id){
			if(json.attrStock>0){
				WST.showHide(1,'#haveGoodsToBuy,#buyBtn');
				WST.showHide(0,'#noGoodsToBuy');
			}else{
				WST.showHide(0,'#haveGoodsToBuy,#buyBtn');
				WST.showHide(1,'#noGoodsToBuy');
			}
			$('#shopGoodsPrice_'+courseId).html("￥"+json.attrPrice);
			var buyNum = parseInt($("#buy-num").val());
			$("#buy-num").attr('maxVal',json.attrStock);
			$("#courseStock").html(json.attrStock);
			if(buyNum<=0)$("#buy-num").val(1);
			if(buyNum>json.attrStock){
				$("#buy-num").val(json.attrStock);
			}
			$('#shopGoodsPrice_'+courseId).attr('dataId',id);
		}
	});
}

