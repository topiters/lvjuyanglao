

function toContinue(){
	location.href= WST.DOMAIN ;
}

//去结算
function goToPay(){
	var flag = true;
	var cflag = true;
	var chkId;
	var payCourseNum = 0;
	if(WST.IS_LOGIN==0){
		loginWin();
		return;
	}
	/* $("input[id^='buy-num_']").each(function(){
		chkId = $(this).attr('id').replace('buy-num_','chk_goods_');
		if($("#"+chkId).prop('checked'))payCourseNum++;
		if($(this).val()<1 && $("#"+chkId).prop('checked')){
			$(this).css({"border":"2px solid red"});
			layer.tips("购买数量不能小于1","#"+$(this).attr("id"));
			if(cflag){
				cflag = false;
			}
				
		}
	});
	if(payCourseNum==0){
		WST.msg('请选择要结算的商品!',{icon:5,offset: '200px'});
		return;
	} */
	/* if(!cflag){
		return false;
	} */
	jQuery.post( Think.U('Home/Cart/checkCartCourseStock') ,{},function(data) {
		alert( JSON.stringify(data));
		var goodsInfo = WST.toJson(data);
      		
		for(var i=0;i<goodsInfo.length;i++){
			var goods = goodsInfo[i];
			if(goods.cnt<1 ){
				
				WST.msg('课程数量不能少于1',{offset: '200px'});
				//layer.tips("购买数量不能小于1","#buy-num_"+goods.goodsId+"_"+goods.goodsAttrId);
			}
			if(goods.stockStatus<1 ){
				WST.msg('课程库存不足',{offset: '200px'});
		     }
		
		if(flag){
			location.href = Think.U('Home/Orders/checkOrderInfo','rnd='+new Date().getTime());
		}else{
			//$("#showwarnmsg").show();
		WST.msg('订单提交失败',{offset: '200px'});
		}
		}
	});
	
	}


//删除购物车中的商品
function delCatCourse(shopId,goodsId,priceAttrId){
	layer.confirm('您确定要从购物车中删除该商品吗？',{icon: 3, title:'系统提示',offset: '150px'}, function(tips){
		var ll = layer.load('数据处理中，请稍候...');
		var num = parseInt($("#buy-num_"+goodsId+"_"+priceAttrId).val(),10);	
		var totalMoney = parseFloat($("#wst_cart_totalmoney").html(),10);
		var shop_totalMoney = parseFloat($("#shop_totalMoney_"+shopId).html(),10);
		var price = parseFloat($("#price_"+goodsId+"_"+priceAttrId).val(),10);
		var ischk = $("#chk_goods_"+goodsId+"_"+priceAttrId).prop('checked');
		jQuery.post(Think.U('Home/Cart/delCartCourse') ,{goodsId:goodsId,goodsAttrId:priceAttrId},function(data) {
			layer.close(ll);
	    	layer.close(tips);
			var vd = WST.toJson(data);
			$("#selgoods_"+goodsId+"_"+priceAttrId).remove();
			if($("input[name='chk_goods_"+shopId+"']").length==0){
				$("#wst_cart_shop_"+shopId).remove();
			}
			if(ischk){
			    $("#shop_totalMoney_"+shopId).html(parseFloat((shop_totalMoney-price*num),10).toFixed(2));
			    $("#wst_cart_totalmoney").html(parseFloat((totalMoney-price*num),10).toFixed(2));
			}
			if($("div[id^='wst_cart_shop_']").length==0){
				$("#wst_cartlist_pbox").html("<div style='height:80px;line-height:80px;font-size:20px;text-align:center;'>您的购物车空空如也，赶快开始购物吧！</div><br/>");
				$('.wst-btn-checkout').hide();
			}
		});	
	});
}


//删除购物车中的商品
function delPckCatCourse(shopId,packageId,batchNo){
	layer.confirm('您确定要从购物车中删除该商品吗？',{icon: 3, title:'系统提示',offset: '150px'}, function(tips){
		var ll = layer.load('数据处理中，请稍候...');
		var num = parseInt($("#buy-num_"+packageId+"_"+batchNo).val(),10);	
		var totalMoney = parseFloat($("#wst_cart_totalmoney").html(),10);
		var shop_totalMoney = parseFloat($("#shop_totalMoney_"+shopId).html(),10);
		var price = parseFloat($("#price_"+packageId+"_"+batchNo).val(),10);
		var ischk = $("#chk_goods_"+packageId+"_"+batchNo).prop('checked');
		jQuery.post(Think.U('Home/Cart/delPckCatCourse') ,{shopId:shopId,packageId:packageId,batchNo:batchNo},function(data) {
			layer.close(ll);
	    	layer.close(tips);
			var vd = WST.toJson(data);
			$("#selgoods_"+packageId+"_"+batchNo).remove();
			if($("input[name='chk_goods_"+shopId+"']").length==0){
				$("#wst_cart_shop_"+shopId).remove();
			}
			if(ischk){
			    $("#shop_totalMoney_"+shopId).html(parseFloat((shop_totalMoney-price*num),10).toFixed(2));
			    $("#wst_cart_totalmoney").html(parseFloat((totalMoney-price*num),10).toFixed(2));
			}
			if($("div[id^='wst_cart_shop_']").length==0){
				$("#wst_cartlist_pbox").html("<div style='height:80px;line-height:80px;font-size:20px;text-align:center;'>您的购物车空空如也，赶快开始购物吧！</div><br/>");
				$('.wst-btn-checkout').hide();
			}
		});	
	});
}

jQuery(function(){
	jQuery(".goodsStockFlag").each(function(){		
		if($(this).val()==-1){
			$("#showwarnmsg").show();
			return;
		}
	});

	
	
});
