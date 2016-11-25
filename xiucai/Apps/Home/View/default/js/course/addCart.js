$(function () {
    $('.cart-to-buy').on('click', function(){
        $(this).parents('.dialog-board ').hide();
        $('.overlay').hide();
    });
    //立即购买
    var isSubmitLogin = false;
    $('.now-to-buy').on('click', function(){
        //检查是否登录
        if ($('a.a-login').length > 0) {
            showLogin();
            return false;
        }

        var product_id = $(this).data('product-id');
        if (!isSubmitLogin) {
            isSubmitLogin = true;
            $.post(addToCart, {product_id: product_id},
                function(result){
                    if(result.code == 200 || result.msg == '此商品已在购物车中'){
                        $('.overlay').show();
                        $('#add-to-cart-layer').show();
                    }else{
                        $.xcDialog.alert({'content':result.msg});
                    }
                    isSubmitLogin = false;
                }
            );
        }
    });
})