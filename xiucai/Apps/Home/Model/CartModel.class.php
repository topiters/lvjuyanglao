<?php
namespace Home\Model;
/**
*  购物车model文件
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
class CartModel extends BaseModel {

	/**
	 * 添加[正常]课程到购物车
	 */
	public function addToCart(){
		$rd = array('status'=>-1);
		$m = M('cart');
		//判断一下该课程是否正常	出售
		$userId = (int)session('WST_USER.userId');
		$courseId = (int)I("courseId");
		$courseAttrId = (int)I("courseAttrId");
        $course = D('Home/course')->getcourseSimpInfo($courseId,$courseAttrId);
        if(empty($course))return array('status'=>-1,'msg'=>'找不到指定的课程!');
        if($course['courseStock']<=0)return array('status'=>-1,'msg'=>'对不起，课程'.$course['courseName'].'库存不足!');
		$courseCnt = ((int)I("gcount")>0)?(int)I("gcount"):1;
		$isCheck = 1;
		$rs = false;
		$sql = "select * from __PREFIX__cart where userId=$userId and courseId=$courseId and courseAttrId=$courseAttrId and packageId=0";
		$row = $this->queryRow($sql);
		//课程订单中是否存在
		$sqla = "select * from __PREFIX__order_course where userId=$userId and courseId=$courseId and courseAttrId=$courseAttrId ";
		$rows = $this->queryRow($sqla);
		if($rows['id']){
			
			return array('status'=>-1,'msg'=>'你已经购买过此课程请到个人课程中心查看!');
			
		}
		
		//课程购物车中是否存在
		if($row["cartId"]>0){
			//$data = array();
			//$data["courseCnt"] = $row["courseCnt"]+$courseCnt;
			//$rs = $m->where("userId=$userId and courseId=$courseId and courseAttrId=$courseAttrId and packageId=0")->save($data);
			return array('status'=>-1,'msg'=>'你已经购买过此课程请到个人课程中心查看!');
			
			
		}else{
			$data = array();
			$data["userId"] = $userId;
			$data["courseId"] = $courseId;
			$data["isCheck"] = $isCheck;
			$data["courseAttrId"] = $courseAttrId;
			$data["courseCnt"] = $courseCnt;
			$rs = $m->add($data);
		}
		if(false !== $rs){
			$rd['status']= 1;
			$rd['msg']="课程成功放入购物车";
		}
		return $rd;
	}
	
	/**
	 * 添加优惠套餐课程到购物车
	 */
	public function addCartPackage(){
		$rd = array('status'=>-1);
		$m = M('cart');
		$status = 1;
		//判断一下该课程是否正常	出售
		$batchNo = time();
		$userId = (int)session('WST_USER.userId');
		$courseAttrIds = WSTAddslashes(I("courseAttrIds"));
		$packageId = (int)I("packageId");
		$sql = "select batchNo from __PREFIX__cart where userId=$userId and packageId=$packageId group by batchNo";
		$packages = $this->query($sql);
		
		$vbatchNo = 0;
		$flag = 1;
		$gattrIds = explode("@",$courseAttrIds);
		if(count($packages)>0){
			for($i=0,$k=count($packages);$i<$k;$i++){
				$vbatchNo = $packages[$i]["batchNo"];
				for($j=0,$v=count($gattrIds);$j<$v;$j++){
					$gIds = explode("_",$gattrIds[$j]);
					$courseId = (int)$gIds[0];
					$courseAttrId = (int)$gIds[1];
					$sql = "select cartId from __PREFIX__cart where userId=$userId and packageId=$packageId and batchNo=$vbatchNo and courseId=$courseId and courseAttrId=$courseAttrId";
					$row = $this->queryRow($sql);
					if(!$row["cartId"]){
						$flag = 0;
					}
				}
				if($flag==1){
					break;
				}
			}
		}else{
			$flag = 0;
		}
		if($flag==0){//添加
			for($i=0,$k=count($gattrIds);$i<$k;$i++){
				$gIds = explode("_",$gattrIds[$i]);
				$courseId = (int)$gIds[0];
				$courseAttrId = (int)$gIds[1];
				$courseCnt = ((int)$gIds[2]>0)?(int)$gIds[2]:1;
			
				$course = D('Home/course')->getcourseSimpInfo($courseId,$courseAttrId);
				if(empty($course)){
					self::delCartPackage($userId,$packageId,$batchNo);
					return array('status'=>-1,'msg'=>'找不到指定的课程!');
				}
				if($course['courseStock']<=$courseCnt){
					self::delCartPackage($userId,$packageId,$batchNo);
					return array('status'=>-1,'msg'=>'对不起，课程'.$course['courseName'].'库存不足!');
				}
				$courseCnt = ($courseCnt>0)?$courseCnt:1;
				$isCheck = 1;
				$data = array();
				$data["userId"] = $userId;
				$data["courseId"] = $courseId;
				$data["isCheck"] = $isCheck;
				$data["courseAttrId"] = $courseAttrId;
				$data["courseCnt"] = $courseCnt;
				$data["packageId"] = $packageId;
				$data["batchNo"] = $batchNo;
				$rs = $m->add($data);
				if(false == $rs){
					self::delCartPackage($userId,$packageId,$batchNo);
					return array('status'=>-1,'msg'=>'加入购物车失败!');
				}
			}
		}else{//修改
			$cartIds = array();
			$cartIds[] = 0;
			for($i=0,$k=count($gattrIds);$i<$k;$i++){
				$gIds = explode("_",$gattrIds[$i]);
				$courseId = (int)$gIds[0];
				$courseAttrId = (int)$gIds[1];
				$courseCnt = ((int)$gIds[2]>0)?(int)$gIds[2]:1;
					
				$course = D('Home/course')->getcourseSimpInfo($courseId,$courseAttrId);
				if(empty($course)){
					self::updCartPackage($userId, $cartIds, $courseCnt);
					return array('status'=>-1,'msg'=>'找不到指定的课程!');
				}
				if($course['courseStock']<=$courseCnt){
					self::updCartPackage($userId, $cartIds, $courseCnt);
					return array('status'=>-1,'msg'=>'对不起，课程'.$course['courseName'].'库存不足!');
				}
				
				$sql = "select cartId from __PREFIX__cart where userId=$userId and courseId=$courseId and courseAttrId=$courseAttrId and packageId=$packageId and batchNo=$vbatchNo";
				$row = $this->queryRow($sql);
				
				$cartId = (int)$row["cartId"];
				$cartIds[] = $cartId;
				$sql = "update __PREFIX__cart set courseCnt=courseCnt+$courseCnt  where cartId=$cartId";
				$this->execute($sql);
			}
		}
		$rd["status"] = 1;
		return $rd;
	}
	
	public function delCartPackage($userId,$packageId,$batchNo){
		$sql = "delete from __PREFIX__cart where userId=$userId and packageId=$packageId and batchNo=$batchNo";
		$this->execute($sql);
	}
	
	public function updCartPackage($userId, $cartIds, $courseCnt){
		
		$cartIds = implode(",",$cartIds);
		$sql = "update __PREFIX__cart set courseCnt=courseCnt-$courseCnt where userId=$userId and cartId in ($cartIds) ";
		$this->execute($sql);
	}
	
	/**
	 * 获取课程信息
	 */
	public function getcourseInfo($courseId,$courseAttrId = 0){
		$sql = "SELECT g.attrCatId,g.courseId,g.courseSn,g.courseName,g.courseThums,g.shopId,g.marketPrice,g.shopPrice,g.courseStock,g.bookQuantity,g.isBook,sp.shopName,sp.shopAtive
				FROM __PREFIX__course g ,__PREFIX__shops sp WHERE g.shopId=sp.shopId AND courseFlag=1 and isSale=1 and courseStatus=1 and g.courseId = $courseId";
		$courselist = $this->queryRow($sql);
		//如果课程有价格属性的话则获取其价格属性
		if(!empty($courselist) && $courselist['attrCatId']>0){
			$sql = "select ga.id,ga.attrPrice,ga.attrStock,a.attrName,ga.attrVal,ga.attrId from __PREFIX__attributes a,__PREFIX__course_attributes ga
			        where a.attrId=ga.attrId and a.catId=".$courselist['attrCatId']." and a.isPriceAttr=1 
			        and ga.courseId=".$courselist['courseId']." and id=".$courseAttrId;
			$priceAttrs = $this->queryRow($sql);
			if(!empty($priceAttrs)){
				$courselist['attrId'] = $priceAttrs['attrId'];
				$courselist['courseAttrId'] = $priceAttrs['id'];
				$courselist['attrName'] = $priceAttrs['attrName'];
				$courselist['attrVal'] = $priceAttrs['attrVal'];
				$courselist['shopPrice'] = $priceAttrs['attrPrice'];
				$courselist['courseStock'] = $priceAttrs['attrStock'];
			}
		}
		$courselist['courseAttrId'] = (int)$courselist['courseAttrId'];
		return $courselist;
	}
	
	/**
	 * 获取购物车信息
	 */
	public function getCartInfo(){
		
		$mcourse = D('Home/course');
		$userId = (int)session('WST_USER.userId');
		$totalMoney = 0;
		$cartcourse = array();
		
		$sql = "select * from __PREFIX__cart where userId = $userId and packageId>0 group by batchNo";
		$shopcart = $this->query($sql);
		print_r($pkgList);
		for($i=0;$i<count($shopcart);$i++){
			$ccourse = $shopcart[$i];
			$package = array();
			$batchNo = $ccourse["batchNo"];
			$package["batchNo"] = $batchNo;
			$pkgShopPrice = 0;
			$pckMinStock = 0;
			$ischk = 0;
			$sql = "select * from __PREFIX__cart where userId = $userId and batchNo=$batchNo";
			$pkgList = $this->query($sql);
			
			for($j=0;$j<count($pkgList);$j++){
				$pcourse = $pkgList[$j];
				$packageId = $pcourse["packageId"];
				$courseId = (int)$pcourse["courseId"];
				$package["packageId"] = $packageId;
				$package["courseCnt"] = (int)$pcourse["courseCnt"];
				
				$sql = "select p.shopId, p.packageName, gp.diffPrice from __PREFIX__course_packages gp, __PREFIX__packages p where p.packageId =$packageId and gp.packageId=p.packageId and gp.courseId = $courseId";
				$pkg = $this->queryRow($sql);
				
				$diffPrice = (float)$pkg["diffPrice"];
				if($pkg["shopId"]>0){
					$package["packageName"] = $pkg["packageName"];
					$package["shopId"] = $pkg["shopId"];
				}
				$courseAttrId = (int)$pcourse["courseAttrId"];
				$sql = "SELECT  g.courseThums,g.courseId,g.shopPrice,g.isBook,g.courseName,g.shopId,g.courseStock,g.shopPrice,g.attrCatId,shop.shopName,shop.qqNo,shop.deliveryType,shop.shopAtive,
						shop.shopTel,shop.shopAddress,shop.deliveryTime,shop.isInvoice, shop.deliveryStartMoney,
						shop.deliveryFreeMoney,shop.deliveryMoney ,g.courseSn,shop.serviceStartTime,shop.serviceEndTime
						FROM __PREFIX__course g, __PREFIX__shops shop
						WHERE g.courseId = $courseId AND g.shopId = shop.shopId AND g.courseFlag = 1 and g.isSale=1 and g.courseStatus=1 ";
				$course = $this->queryRow($sql);
				if($course==null)continue;
				//如果课程有价格属性的话则获取其价格属性
				if(!empty($course) && $course['attrCatId']>0){
						
					$sql = "select ga.id,ga.attrPrice,ga.attrStock,a.attrName,ga.attrVal,ga.attrId from __PREFIX__attributes a,__PREFIX__course_attributes ga
				         	where a.attrId=ga.attrId and a.catId=".$course['attrCatId']." and a.isPriceAttr=1
				          	and ga.courseId=".$courseId." and id=".$courseAttrId;
					$priceAttrs = $this->queryRow($sql);
					if(!empty($priceAttrs)){
						$course['courseAttrId'] = $priceAttrs['id'];
						$course['attrName'] = $priceAttrs['attrName'];
						$course['attrVal'] = $priceAttrs['attrVal'];
						$course['oshopPrice'] = $priceAttrs['attrPrice'];
						$course['shopPrice'] = ($priceAttrs['attrPrice']>$diffPrice)?($priceAttrs['attrPrice']-$diffPrice):$priceAttrs['attrPrice'];
						$course['courseStock'] = $priceAttrs['attrStock'];
						$pckMinStock = ($pckMinStock==0 || $course['courseStock']<$pckMinStock)?$course['courseStock']:$pckMinStock;
						$pkgShopPrice += $course['shopPrice'];
					}
				}else{
					$course['oshopPrice'] = $course['shopPrice'];
					$course['shopPrice'] = ($course['shopPrice']>$diffPrice)?($course['shopPrice']-$diffPrice):$course['shopPrice'];
					$pckMinStock = ($pckMinStock==0 || $course['courseStock']<$pckMinStock)?$course['courseStock']:$pckMinStock;
					$pkgShopPrice += $course['shopPrice'];
				}
				$course['courseAttrId'] = (int)$course['courseAttrId'];
				
				$course["cnt"] = $pcourse["courseCnt"];
				
				$course["ischk"] = $pcourse["isCheck"];
				if($course["ischk"]==1){
					$ischk = 1;
					$totalMoney += $course["cnt"]*$course["shopPrice"];
					$cartcourse[$course["shopId"]]["ischk"] = 1;
				}
				
				$package["course"][] = $course;
				$cartcourse[$course["shopId"]]["shopId"] = $course["shopId"];//店铺ID
				$cartcourse[$course["shopId"]]["shopName"] = $course["shopName"];//店铺名
				$cartcourse[$course["shopId"]]["qqNo"] = $course["qqNo"];//店铺名
				$cartcourse[$course["shopId"]]["shopAtive"] = $course["shopAtive"];
				$cartcourse[$course["shopId"]]["deliveryFreeMoney"] = $course["deliveryFreeMoney"];//店铺免运费最低金额
				$cartcourse[$course["shopId"]]["deliveryMoney"] = $course["deliveryMoney"];//店铺配送费
				$cartcourse[$course["shopId"]]["deliveryStartMoney"] = $course["deliveryStartMoney"];//店铺配送费
				$cartcourse[$course["shopId"]]["totalCnt"] = $cartcourse[$course["shopId"]]["totalCnt"]+$ccourse["courseCnt"];
				$cartcourse[$course["shopId"]]["totalMoney"] = $cartcourse[$course["shopId"]]["totalMoney"]+(($course["ischk"]==1)?$course["cnt"]*$course["shopPrice"]:0);
			}
			$package["courseStock"] = $pckMinStock;
			$package["shopPrice"] = $pkgShopPrice;
			$package["ischk"] = $ischk;
			$cartcourse[$course["shopId"]]["packages"][] = $package;
			
		}
		$sql = "select * from __PREFIX__cart where userId = $userId and packageId=0";
		$shopcart = $this->query($sql);
		for($i=0;$i<count($shopcart);$i++){
			$ccourse = $shopcart[$i];
			$courseId = (int)$ccourse["courseId"];
			$courseAttrId = (int)$ccourse["courseAttrId"];
			$sql = "SELECT  g.courseThums,g.courseId,g.shopPrice,g.isBook,g.courseName,g.shopId,g.courseStock,g.shopPrice,g.attrCatId,shop.shopName,shop.qqNo,shop.deliveryType,shop.shopAtive,
					shop.shopTel,shop.shopAddress,shop.deliveryTime,shop.isInvoice, shop.deliveryStartMoney,
					shop.deliveryFreeMoney,shop.deliveryMoney ,g.courseSn,shop.serviceStartTime,shop.serviceEndTime
					FROM __PREFIX__course g, __PREFIX__shops shop
					WHERE g.courseId = $courseId AND g.shopId = shop.shopId AND g.courseFlag = 1 and g.isSale=1 and g.courseStatus=1 ";
			$course = $this->queryRow($sql);
			if($course==null)continue;
		    //如果课程有价格属性的话则获取其价格属性
		    if(!empty($course) && $course['attrCatId']>0){
		    	
			    $sql = "select ga.id,ga.attrPrice,ga.attrStock,a.attrName,ga.attrVal,ga.attrId from __PREFIX__attributes a,__PREFIX__course_attributes ga
			             where a.attrId=ga.attrId and a.catId=".$course['attrCatId']." and a.isPriceAttr=1 
			             and ga.courseId=".$courseId." and id=".$courseAttrId;
				$priceAttrs = $this->queryRow($sql);
				if(!empty($priceAttrs)){
					$course['courseAttrId'] = $priceAttrs['id'];
					$course['attrName'] = $priceAttrs['attrName'];
					$course['attrVal'] = $priceAttrs['attrVal'];
					$course['shopPrice'] = $priceAttrs['attrPrice'];
					$course['courseStock'] = $priceAttrs['attrStock'];
				}
			}
			$course['courseAttrId'] = (int)$course['courseAttrId'];
			
			if($course["isBook"]==1){
				$course["courseStock"] = $course["courseStock"]+$course["bookQuantity"];
			}
			$course["cnt"] = $ccourse["courseCnt"];
			$course["ischk"] = $ccourse["isCheck"];
			if($course["ischk"]==1){
				$totalMoney += $course["cnt"]*$course["shopPrice"];
				$cartcourse[$course["shopId"]]["ischk"] = 1;
			}

			$cartcourse[$course["shopId"]]["shopcourse"][] = $course;
			$cartcourse[$course["shopId"]]["shopId"] = $course["shopId"];//店铺ID
			$cartcourse[$course["shopId"]]["shopName"] = $course["shopName"];//店铺名
			$cartcourse[$course["shopId"]]["qqNo"] = $course["qqNo"];//店铺名
			$cartcourse[$course["shopId"]]["shopAtive"] = $course["shopAtive"];
			$cartcourse[$course["shopId"]]["deliveryFreeMoney"] = $course["deliveryFreeMoney"];//店铺免运费最低金额
			$cartcourse[$course["shopId"]]["deliveryMoney"] = $course["deliveryMoney"];//店铺配送费
			$cartcourse[$course["shopId"]]["deliveryStartMoney"] = $course["deliveryStartMoney"];//店铺配送费
			$cartcourse[$course["shopId"]]["totalCnt"] = $cartcourse[$course["shopId"]]["totalCnt"]+$ccourse["courseCnt"];
			$cartcourse[$course["shopId"]]["totalMoney"] = $cartcourse[$course["shopId"]]["totalMoney"]+(($course["ischk"]==1)?$course["cnt"]*$course["shopPrice"]:0);
		}

		$cartInfo = array();
		$cartInfo["gtotalMoney"] = $totalMoney;
		
		foreach($cartcourse as $key=> $cshop){
			if($cshop["totalMoney"]<$cshop["deliveryFreeMoney"] && $cshop["ischk"]==1){
				$totalMoney = $totalMoney + $cshop["deliveryMoney"];
			}
		}
		
		$cartInfo["totalMoney"] = $totalMoney;
		$cartInfo["cartcourse"] = $cartcourse;
		//print_r($cartInfo);
		return $cartInfo;
		
	}
   
	public function getPayCart(){
		
		$userId = (int)session('WST_USER.userId');
		$mcourse = D('Home/course');
		//$maddress = D('Home/UserAddress');
		
		$cartcourse = array();
		
		$shopColleges = array();
		$distributAll = array();
		$startTime = 0;
		$endTime = 24;
		
		$totalMoney = 0;
		$totalCnt = 0;
		
		$sql = "select * from __PREFIX__cart where userId = $userId and packageId>0 group by batchNo";
		$shopcart = $this->query($sql);
		for($i=0;$i<count($shopcart);$i++){
			$ccourse = $shopcart[$i];
			$package = array();
			$batchNo = $ccourse["batchNo"];
			$package["batchNo"] = $batchNo;
			$pkgShopPrice = 0;
			$pckMinStock = 0;
			$ischk = 0;
			$sql = "select * from __PREFIX__cart where userId = $userId and batchNo=$batchNo";
			$pkgList = $this->query($sql);
			for($j=0;$j<count($pkgList);$j++){
				$pcourse = $pkgList[$j];
				$packageId = $pcourse["packageId"];
				$courseId = (int)$pcourse["courseId"];
				$package["packageId"] = $packageId;
				$package["courseCnt"] = (int)$pcourse["courseCnt"];
		
				$sql = "select p.shopId, p.packageName, gp.diffPrice from __PREFIX__course_packages gp, __PREFIX__packages p where p.packageId =$packageId and gp.packageId=p.packageId and gp.courseId = $courseId";
				$pkg = $this->queryRow($sql);
		
				$diffPrice = (float)$pkg["diffPrice"];
				if($pkg["shopId"]>0){
					$package["packageName"] = $pkg["packageName"];
					$package["shopId"] = $pkg["shopId"];
				}
				$courseAttrId = (int)$pcourse["courseAttrId"];
				$obj["courseId"] = $courseId;
				$obj["courseAttrId"] = $courseAttrId;
				$course = $mcourse->getcourseForCheck($obj);
				
				$course['oshopPrice'] = $course['shopPrice'];
				$course['shopPrice'] = ($course['shopPrice']>$diffPrice)?($course['shopPrice']-$diffPrice):$course['shopPrice'];
				$pckMinStock = ($pckMinStock==0 || $course['courseStock']<$pckMinStock)?$course['courseStock']:$pckMinStock;
				$pkgShopPrice += $course['shopPrice'];
				

				$course["cnt"] = $pcourse["courseCnt"];
				$course["ischk"] = $pcourse["isCheck"];
				$totalMoney += $course["cnt"]*$course["shopPrice"];
				$cartcourse[$course["shopId"]]["ischk"] = 1;
				$package["course"][] = $course;
		
				$distributAll[$package["shopId"]] = $course["isDistributAll"];
				
				$cartcourse[$course["shopId"]]["shopId"] = $course["shopId"];//店铺ID
				$cartcourse[$course["shopId"]]["shopName"] = $course["shopName"];//店铺名
				$cartcourse[$course["shopId"]]["qqNo"] = $course["qqNo"];//店铺名
				$cartcourse[$course["shopId"]]["shopAtive"] = $course["shopAtive"];
				
				$cartcourse[$course["shopId"]]["deliveryFreeMoney"] = $course["deliveryFreeMoney"];//店铺免运费最低金额
				$cartcourse[$course["shopId"]]["deliveryMoney"] = $course["deliveryMoney"];//店铺配送费
				$cartcourse[$course["shopId"]]["deliveryStartMoney"] = $course["deliveryStartMoney"];//店铺配送费
				$cartcourse[$course["shopId"]]["totalCnt"] = $cartcourse[$course["shopId"]]["totalCnt"]+$ccourse["courseCnt"];
				$cartcourse[$course["shopId"]]["totalMoney"] = $cartcourse[$course["shopId"]]["totalMoney"]+($course["cnt"]*$course["shopPrice"]);
			}
			
			//$ommunitysId = $maddress->getShopCommunitysId($package["shopId"]);
			//$shopColleges[$package["shopId"]] = $ommunitysId;
					
			$package["courseStock"] = $pckMinStock;
			$package["shopPrice"] = $pkgShopPrice;
			$cartcourse[$course["shopId"]]["packages"][] = $package;
				
		}
		
		$sql = "select * from __PREFIX__cart where userId = $userId and isCheck=1 and courseCnt>0 and packageId=0";
		$shopcart = $this->query($sql);
		
		for($i=0;$i<count($shopcart);$i++){
			$ccourse = $shopcart[$i];
			$obj["courseId"] = (int)$ccourse["courseId"];
			$obj["courseAttrId"] = (int)$ccourse["courseAttrId"];
			
			$course = $mcourse->getcourseForCheck($obj);
			if($course["isBook"]==1){
				$course["courseStock"] = $course["courseStock"]+$course["bookQuantity"];
			}
			$course["ischk"] = $ccourse["isCheck"];
			$course["cnt"] = $ccourse["courseCnt"];
			$totalCnt += $ccourse["courseCnt"];
			$totalMoney += $course["cnt"]*$course["shopPrice"];
			//$communitysId = $maddress->getShopCommunitysId($course["shopId"]);
		     //	$shopColleges[$course["shopId"]] = $ommunitysId;
			$distributAll[$course["shopId"]] = $course["isDistributAll"];
			if($startTime<$course["startTime"]){
				$startTime = $course["startTime"];
			}
			if($endTime>$course["endTime"]){
				$endTime = $course["endTime"];
			}
		
			$cartcourse[$course["shopId"]]["shopcourse"][] = $course;
			
			$cartcourse[$course["shopId"]]["shopId"] = $course["shopId"];//店铺ID
			$cartcourse[$course["shopId"]]["shopName"] = $course["shopName"];//店铺名
			$cartcourse[$course["shopId"]]["qqNo"] = $course["qqNo"];//店铺名
			$cartcourse[$course["shopId"]]["shopAtive"] = $course["shopAtive"];
			
			$cartcourse[$course["shopId"]]["deliveryFreeMoney"] = $course["deliveryFreeMoney"];//店铺免运费最低金额
			$cartcourse[$course["shopId"]]["deliveryMoney"] = $course["deliveryMoney"];//店铺配送费
			$cartcourse[$course["shopId"]]["deliveryStartMoney"] = $course["deliveryStartMoney"];//店铺配送费
			$cartcourse[$course["shopId"]]["totalCnt"] = $cartcourse[$course["shopId"]]["totalCnt"]+$ccourse["courseCnt"];
			$cartcourse[$course["shopId"]]["totalMoney"] = $cartcourse[$course["shopId"]]["totalMoney"]+($course["cnt"]*$course["shopPrice"]);
			
		}
		$rdata["gtotalMoney"] = $totalMoney;//课程总价（去除配送费）
		foreach($cartcourse as $key=> $cshop){
			if($cshop["totalMoney"]<$cshop["deliveryFreeMoney"]){
				$totalMoney = $totalMoney + $cshop["deliveryMoney"];
			}
		}
		
		if(empty($cartcourse)){
			$rdata["cartnull"] = 1;
			return $rdata;
		}
		$rdata["totalMoney"] = $totalMoney;//课程总价（含配送费）
		$rdata["totalCnt"] = $totalCnt;
		
		$rdata["cartcourse"] = $cartcourse;
		$rdata["distributAll"] = $distributAll;
		$rdata["shopColleges"] = $shopColleges;
		$rdata["startTime"] = $startTime;
		$rdata["endTime"] = $endTime;
		return $rdata;
	}
	/**
	 * 检测购物车中课程库存
	 */
	public function checkCatCourseStock(){

		$mcourse = D('Home/course');
		$userId = (int)session('WST_USER.userId');
		$cartcourse = array();
		$sql = "select * from __PREFIX__cart where userId = $userId";
		$shopcart = $this->query($sql);
		
		for($i=0;$i<count($shopcart);$i++){
			$ccourse = $shopcart[$i];
			$courseId = (int)$ccourse["courseId"];
			$courseAttrId = (int)$ccourse["courseAttrId"];
			
			$obj = array();
			$obj["courseId"] = $courseId;
			$obj["courseAttrId"] = $courseAttrId;
			$course = $mcourse->getcourseStock($obj);
			if($course["isBook"]==1){
				$course["courseStock"] = $course["courseStock"]+$course["bookQuantity"];
			}
			$course['courseAttrId'] = $courseAttrId;
			$course["cnt"] = $ccourse["courseCnt"];
			$course["stockStatus"] = ($course["courseStock"]>=$course["cnt"])?1:0;		
			$cartcourse[] = $course;
		}

		return $cartcourse;
		
	}
	
	/**
	 * 核对课程信息
	 */
	public function checkcourseStock(){
	
		$mcourse = D('Home/course');
		$userId = (int)session('WST_USER.userId');
		$cartcourse = array();
		$sql = "select * from __PREFIX__cart where userId = $userId and isCheck=1 ";
		$shopcart = $this->query($sql);
	
		for($i=0;$i<count($shopcart);$i++){
			$ccourse = $shopcart[$i];
			$courseId = (int)$ccourse["courseId"];
			$courseAttrId = (int)$ccourse["courseAttrId"];
				
			$course = $mcourse->getcourseInfo($courseId,$courseAttrId);
			if($course["isBook"]==1){
				$course["courseStock"] = $course["courseStock"]+$course["bookQuantity"];
			}
			$course['courseAttrId'] = $courseAttrId;
			$course["cnt"] = $ccourse["courseCnt"];
			$cartcourse[] = $course;
		}
	
		return $cartcourse;
	
	}
	
	
	
	
	
	/**
	 * 删除购物车中的课程
	 */
	public function delCartcourse(){
		$rd = array('status'=>-1);
		$userId = (int)session('WST_USER.userId');
		$courseId = (int)I("courseId");
		$courseAttrId = (int)I("courseAttrId");
		$sql = "delete from __PREFIX__cart where userId=$userId and courseId=$courseId and courseAttrId=$courseAttrId and packageId=0";
		$rs = $this->execute($sql);
		if(false !== $rs){
			$rd['status']= 1;
		}
		return $rd;
	}
	
	/**
	 * 删除购物车中的课程
	 */
	public function delPckCatcourse(){
		$rd = array('status'=>-1);
		$userId = (int)session('WST_USER.userId');
		$packageId = (int)I("packageId");
		$batchNo = (int)I("batchNo");
		$sql = "delete from __PREFIX__cart where userId=$userId and packageId=$packageId and batchNo=$batchNo";
		$rs = $this->execute($sql);
		if(false !== $rs){
			$rd['status']= 1;
		}
		return $rd;
	}
	
	/**
	 * 修改购物车中的课程数量
	 * 
	 */
	public function changeCartcoursenum($courseCnt){
		
		$rd = array('status'=>-1);
		$m = M('cart');
		//判断一下该课程是否正常	出售
		$userId = (int)session('WST_USER.userId');
		$courseId = (int)I("courseId");
		$courseAttrId = (int)I("courseAttrId");

		//$courseCnt = abs((int)I("num"));
		$isCheck = (int)I("ischk",0);
		$sql = "select * from __PREFIX__cart where userId=$userId and courseId=$courseId and courseAttrId=$courseAttrId and packageId=0 ";
		$row = $this->queryRow($sql);
		if($row["cartId"]>0){
			$data = array();
			$data["isCheck"] = $isCheck;
			$data["courseCnt"] = $courseCnt;
			$rs = $m->where("userId=$userId and courseId=$courseId and courseAttrId=$courseAttrId and packageId=0 ")->save($data);
			if(false !== $rs){
				$rd['status']= 1;
			}
		}
		return $rd;
	}
	
	/**
	 * 修改购物车中的课程数量(套餐)
	 *
	 */
	public function changePkgCartcourseNum($courseCnt){
	
		$rd = array('status'=>-1);
		$m = M('cart');
		//判断一下该课程是否正常	出售
		$userId = (int)session('WST_USER.userId');
		$packageId = (int)I('packageId');
		$batchNo = (int)I('batchNo');
		$isCheck = (int)I("ischk",0);
		
		$data = array();
		$data["isCheck"] = $isCheck;
		$data["courseCnt"] = $courseCnt;
		$rs = $m->where("userId=$userId and packageId=$packageId and batchNo=$batchNo")->save($data);
		if(false !== $rs){
			$rd['status']= 1;
		}
		
		return $rd;
	}
	
}