<?php
namespace Home\Action;
/**
*  购物车文件
* ==============================================
* 版权所有 2015-2016 http://www.chunni168.com
* ----------------------------------------------
* 这不是一个自由软件，未经授权不许任何使用和传播。
* ==============================================
* @date: 2016-11-18
* @author: top_iter、lnrp
* @email:2504585798@qq.com
* @version:1.0
*/
class CartAction extends BaseAction {
	/**
	 * 跳到购物车列表
	 */
    public function toCart(){
   		$m = D('Home/Cart');
		$cartInfo = $m->getCartInfo();
		//dump($cartInfo);
   		$pnow = (int)I("pnow",0);
   		$this->assign('cartInfo',$v=$cartInfo);
  // 	dump($v);
   	//	exit;
   		$this->display('default/cart_pay_list');//

    }
    
    /**
     * 添加商品到购物车(ajax)
     */
	public function addToCartAjax(){
   		$m = D('Home/Cart');
   		$rs = $m->addToCart();
   		$this->ajaxReturn($rs);
    }
    
    /**
     * 添加优惠套餐到购物车(ajax)
     */
    public function addCartPackage(){
    	$m = D('Home/Cart');
    	$rs = $m->addCartPackage();
    	$this->ajaxReturn($rs);
    }
    
    /**
     * 修改购物车商品
     * 
     */
    public function changeCartCourse(){
    	$m = D('Home/Cart');
   		$res = $m->addToCart();
   		echo "{status:1}";
    }
    
	/**
	 * 获取购物车信息
	 * 
	 */
	public function getCartInfo() {
		$m = D('Home/Cart');
		$cartInfo = $m->getCartInfo();
		$axm = (int)I("axm",0);
		if($axm ==1){
			echo json_encode($cartInfo);
		}else{
			$this->assign('cartInfo',$cartInfo);
			$this->display('default/cart_pay_list');
		}
		
	}
	
	/**
	 * 获取购物车商品数量
	 */
	public function getCartGoodCnt(){
		echo json_encode(array("coursecnt"=>WSTCartNum()));
	}
    
	/**
	 * 检测购物车中商品库存
	 * 
	 */
	public function checkCartCourseStock(){
		$m = D('Home/Cart');
		$res = $m->checkCatCourseStock();
		echo json_encode($res);

	}
	
	
	
	/**
	 * 删除购物车中的商品
	 * 
	 */
	public function delCartCourse(){	
		$m = D('Home/Cart');	
		$res = $m->delCartCourse();
		$cartInfo = $m->getCartInfo();
		echo json_encode($cartInfo);
	}
	
	/**
	 * 删除购物车中的商品
	 *
	 */
	public function delPckCatCourse(){
		$m = D('Home/Cart');
		$res = $m->delPckCatCourse();
		$cartInfo = $m->getCartInfo();
		echo json_encode($cartInfo);
	}
	
	/**
	 * 修改购物车中的商品数量
	 * 
	 */
	public function changeCartCourseNum(){
		
		$data = array();
		$data['courseId'] = (int)I('courseId');
		$data['isBook'] = (int)I('isBook');
		$data['courseAttrId'] = (int)I('courseAttrId');
		$course = D('Home/Course');
		$courseStock = $course->getCourseStock($data);
		$num = (int)I("num");
		if($courseStock["courseStock"]>=$num){
			$num = $num>100?100:$num;
		}else{
			$num = (int)$courseStock["courseStock"];
		}
		$m = D('Home/Cart');
		$rs = $m->changeCartCoursenum(abs($num));
		$this->ajaxReturn($courseStock);
		
	}
	
	/**
	 * 修改购物车中的商品数量
	 *
	 */
	public function changePkgCartCourseNum(){
	
		$data = array();
		$data['packageId'] = (int)I('packageId');
		$data['batchNo'] = (int)I('batchNo');
		$course = D('Home/Course');
		$courseStock = $course->getPkgCourseStock($data);
		$num = (int)I("num");
		if($courseStock["courseStock"]>=$num){
			$num = $num>100?100:$num;
		}else{
			$num = (int)$courseStock["courseStock"];
		}
		$m = D('Home/Cart');
		$rs = $m->changePkgCartCourseNum(abs($num));
		$this->ajaxReturn($courseStock);
	
	}
	
	/**
	 *去购物车结算
	 * 
	 */
	public function toCatpaylist(){	
		$m = D('Home/Cart');
		$cartInfo = $m->getCartInfo();
		$this->assign("cartInfo",$cartInfo);
		
		$this->display('default/cat_pay_list');
	}
	
}