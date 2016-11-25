<?php
namespace Home\Model;
/**
* 课程类 文件
* ==============================================
* 版权所有 2015-2016 http://www.chunni168.com
* ----------------------------------------------
* 这不是一个自由软件，未经授权不许任何使用和传播。
* ==============================================
* @date: 2016-11-15
* @author: top_iter、lnrp
* @email:2504585798@qq.com
* @version:1.0
*/
class CourseModel extends BaseModel {
	
	
	/**
	 * 课程列表
	 */
	public function getCourseList(){
		
		//$areaId2 = $obj["areaId2"];
		//$areaId3 = $obj["areaId3"];
	//	$communityId = (int)I("communityId");
		$c1Id = (int)I("c1Id");
		$c2Id = (int)I("c2Id");
		$c3Id = (int)I("c3Id");
		$pcurr = (int)I("pcurr");
		$mark = (int)I("mark",1);//13,14最新，最热
		$msort = (int)I("msort",1);
		$prices = I("prices");
		
		// 免费课is_free,1,2,
		$is_free=(int)I("is_free");
		
		//is_live是否直播录播
		
		$is_live=(int)I("is_live");
		
		
		
		if($prices != ""){
			$pricelist = explode("_",$prices);
		}
		$brandId = (int)I("brandId");
		$keyWords = WSTAddslashes(urldecode(I("keyWords")));
		$words = array();
		if($keyWords!=""){
			$words = explode(" ",$keyWords);
		}
		
		$sqla = "SELECT  g.courseId,courseSn,courseName,courseThums,courseStock,g.saleCount,p.shopId,marketPrice,shopPrice,ga.id courseAttrId,saleTime,totalScore,totalUsers ";
		//$sqlb = "SELECT max(shopPrice) maxShopPrice  ";
		$sqlc = " FROM __PREFIX__course g 
				left join __PREFIX__course_attributes ga on g.courseId=ga.courseId and ga.isRecomm=1
				left join __PREFIX__course_scores gs on gs.courseId= g.courseId
				, __PREFIX__shops p ";
		
		if($brandId>0){
			$sqlc .=" , __PREFIX__brands bd ";
		}
		$sqld = "";
		if($areaId3>0 || $communityId>0){
			$sqld .=" , __PREFIX__shops_communitys sc ";
		}
		
		$where = " WHERE g.shopId = p.shopId AND  g.coursestatus=1 AND g.courseFlag = 1 and g.isSale=1 ";
		//$where2 = " AND p.areaId2 = $areaId2 AND p.isDistributAll=0 ";
		$where3 = " AND p.isDistributAll=1 ";
		if($areaId3>0 || $communityId>0){
			$where2 .= " AND sc.shopId=p.shopId ";
			if($areaId3>0){
				$where2 .= " AND sc.areaId3 = $areaId3 ";
			}
			if($communityId>0){
				$where2 .= " AND sc.communityId = $communityId ";
			}
		}
		if($brandId>0){
			$where .=" AND bd.brandId=g.brandId AND g.brandId = $brandId ";
		}
		if($c1Id>0){
			$where .= " AND g.courseCatId1 = $c1Id";
		}
		if($c2Id>0){
			$where .= " AND g.courseCatId2 = $c2Id";
		}
		if($c3Id>0){
			$where .= " AND g.courseCatId3 = $c3Id";
		}
		
		if($is_free){
			$where .= " AND g.is_free =$is_free";
			
		};
		
		if($is_live){
			$where .= " AND g.is_live =$is_live";
		}
		
		
		
		
		if(!empty($words)){
			$sarr = array();
			foreach ($words as $key => $word) {
				if($word!=""){
					$sarr[] = "g.courseName LIKE '%$word%'";
				}
			}
			$where .= " AND (".implode(" or ", $sarr).")";
		}
		/* 
		$sqlb = "select max(maxShopPrice) maxShopPrice from (".
				//$sqlb . $sqlc . $sqld . $where. $where2. 
		$sqlb . $sqlc . $sqld . $where.
				" union all ".
				$sqlb . $sqlc . $where. $where3. 
				") course";
		 */
	//	$maxrow = $this->queryRow( $sqlb );
	//	$maxPrice = $maxrow["maxShopPrice"];
	
	    if($prices != "" && $pricelist[0]>=0 && $pricelist[1]>=0){
			$where .= " AND (g.shopPrice BETWEEN  ".(int)$pricelist[0]." AND ".(int)$pricelist[1].") ";
		}
	   	$groupBy .= " group by courseId  ";
	   	//排序-暂时没有按好评度排
	   	$orderFile = array('1'=>'saleCount','6'=>'saleCount','7'=>'saleCount','8'=>'shopPrice','9'=>'(totalScore/totalUsers)','10'=>'saleTime',''=>'saleTime','12'=>'saleCount','13'=>'is_new','is_hot'=>14);
	   	$orderSort = array('0'=>'ASC','1'=>'DESC');
		$orderBy .= " ORDER BY ".$orderFile[$mark]." ".$orderSort[$msort].",courseId ";

		$sqla = "select * from (".
				$sqla . $sqlc . $sqld . $where.     // $where2 .
				" union all ".
				$sqla . $sqlc . $where. $where3 .
				") course". $groupBy .$orderBy ;
		
		//var_dump($sqla);
		//exit;
		$pages = $this->pageQuery($sqla, $pcurr, 30);
		//var_dump($pages );
		//exit;
		//$rs["maxPrice"] = $maxPrice;
		//$brands = array();
		//$sql = "SELECT b.brandId, b.brandName FROM __PREFIX__brands b, __PREFIX__course_cat_brands cb WHERE b.brandId = cb.brandId AND b.brandFlag=1 ";
		//if($c1Id>0){
		//	$sql .= " AND cb.catId = $c1Id";
		//}
		//$sql .= " GROUP BY b.brandId";
		//$blist = $this->query($sql);
		/* for($i=0;$i<count($blist);$i++){
			$brand = $blist[$i];
			$brands[$brand["brandId"]] = array('brandId'=>$brand["brandId"],'brandName'=>$brand["brandName"]);
		} */
		//$rs["brands"] = $brands;
		$rs["pages"] = $pages;
		$gcats["courseCatId1"] = $c1Id;
		$gcats["courseCatId2"] = $c2Id;
		$gcats["courseCatId3"] = $c3Id;
		//$rs["courseNav"] = self::getCourseNav($gcats);
		return $rs;
	}


	/**
	 * 查询课程信息
	 */
	public function getCourseDetails($obj){		
		$courseId = $obj["courseId"];
		$sql = "SELECT sc.catName,sc2.catName as pCatName, g.*,shop.shopName,shop.deliveryType,ga.id courseAttrId,ga.attrPrice,ga.attrStock,
				shop.shopAtive,shop.shopTel,shop.shopDetails,shop.shopAddress,shop.deliveryTime,shop.isInvoice, shop.deliveryStartMoney,g.courseStock,shop.deliveryFreeMoney,shop.qqNo,shop.isDistributAll,
				shop.deliveryMoney ,g.courseSn,g.courseTime,g.courseDifficulty,g.courseIntro,g.courseFor,shop.serviceStartTime,shop.serviceEndTime FROM __PREFIX__course g left join __PREFIX__course_attributes ga on g.courseId=ga.courseId and ga.isRecomm=1, __PREFIX__shops shop, __PREFIX__shops_cats sc 
				LEFT JOIN __PREFIX__shops_cats sc2 ON sc.parentId = sc2.catId
				WHERE g.courseId = $courseId AND shop.shopId=sc.shopId AND sc.catId=g.shopCatId1 AND g.shopId = shop.shopId AND g.courseFlag = 1 ";		
		$rs = $this->query($sql);
		
		if(!empty($rs) && $rs[0]['courseAttrId']>0){
			$rs[0]['shopPrice'] = $rs[0]['attrPrice'];
			$rs[0]['courseStock'] = $rs[0]['attrStock'];
		}
		return $rs[0];
	}
	
	/**
	 * 获取课程信息-购物车/核对订单用
	 */
    public function getCourseForCheck($obj){		
		$courseId = (int)$obj["courseId"];
		$courseAttrId = (int)$obj["courseAttrId"];
		$sql = "SELECT sc.catName,sc2.catName as pCatName, g.attrCatId,g.courseThums,g.courseId,g.courseName,g.shopPrice,g.courseStock
				,g.shopId,shop.shopName,shop.isDistributAll,shop.qqNo,shop.deliveryType,shop.shopAtive,shop.shopTel,shop.shopAddress,shop.deliveryTime,shop.isInvoice, 
				shop.deliveryStartMoney,g.courseStock,shop.deliveryFreeMoney,shop.deliveryMoney ,g.courseSn,shop.serviceStartTime startTime,shop.serviceEndTime endTime
				FROM __PREFIX__course g, __PREFIX__shops shop, __PREFIX__shops_cats sc 
				LEFT JOIN __PREFIX__shops_cats sc2 ON sc.parentId = sc2.catId
				WHERE g.courseId = $courseId AND shop.shopId=sc.shopId AND sc.catId=g.shopCatId1 AND g.shopId = shop.shopId AND g.courseFlag = 1 ";		
		$rs = $this->queryRow($sql);
		if(!empty($rs) && $rs['attrCatId']>0){
			$sql = "select ga.id,ga.attrPrice,ga.attrStock,a.attrName,ga.attrVal,ga.attrId from __PREFIX__attributes a,__PREFIX__course_attributes ga
			        where a.attrId=ga.attrId and a.catId=".$rs['attrCatId']." 
			        and ga.courseId=".$rs['courseId']." and id=".$courseAttrId;
			$priceAttrs = $this->queryRow($sql);
			if(!empty($priceAttrs)){
				$rs['attrId'] = $priceAttrs['attrId'];
				$rs['courseAttrId'] = $priceAttrs['id'];
				$rs['attrName'] = $priceAttrs['attrName'];
				$rs['attrVal'] = $priceAttrs['attrVal'];
				$rs['shopPrice'] = $priceAttrs['attrPrice'];
				$rs['courseStock'] = $priceAttrs['attrStock'];
			}
		}
		$rs['courseAttrId'] = (int)$rs['courseAttrId'];
		return $rs;
	}
	/**
	 * 获取课程的属性
	 */
	public function getAttrs($obj){
		$id = (int)$obj["courseId"];
		$shopId = (int)$obj["shopId"];
		$attrCatId = (int)$obj["attrCatId"];
		$course = array();
		//获取规格属性
		$sql = "select ga.id,ga.attrVal,ga.attrPrice,ga.attrStock,a.attrId,a.attrName,a.isPriceAttr
		            from __PREFIX__attributes a 
		            left join __PREFIX__course_attributes ga on ga.attrId=a.attrId and ga.courseId=".$id." where  
					a.attrFlag=1 and a.catId=".$attrCatId." and a.shopId=".$shopId." order by a.attrSort asc, a.attrId asc,ga.id asc";
		$attrRs = $this->query($sql);
		if(!empty($attrRs)){
			$priceAttr = array();
			$attrs = array();
			foreach ($attrRs as $key =>$v){
				if($v['isPriceAttr']==1){
					$course['priceAttrId'] = $v['attrId'];
					$course['priceAttrName'] = $v['attrName'];
					$priceAttr[] = $v;
				}else{
					$v['attrContent'] = $v['attrVal'];
					$attrs[] = $v;
				}
			}
			$course['priceAttrs'] = $priceAttr;
			$course['attrs'] = $attrs;
		}
		return $course;
	}
	/**
	 * 获取课程相册
	 */
	public function getCourseImgs(){
		
		$courseId = (int)I("courseId");
	
		$sql = "SELECT img.* FROM __PREFIX__course_gallerys img WHERE img.courseId = $courseId ";		
		$rs = $this->query($sql);
		return $rs;
		
	}
	
	
	/**
	 * 获取关联课程
	 */
	public function getRelatedCourse(){
		
		$courseId = (int)I("courseId");
		$sql = "SELECT g.* FROM __PREFIX__course g, __PREFIX__course_relateds gr WHERE g.courseId = gr.relatedCourseId AND g.courseStock>0 AND g.courseStatus = 1 AND gr.courseId =$courseId";
		$rs = $this->query($sql);
		return $rs;
		
	}
	
	
	  //获取同类课程
	public function getRelatedCoursed($catid){
	
		//$courseId = (int)I("courseId");
		$sql = "SELECT g.* FROM __PREFIX__course g  WHERE g.courseCatId2 =$catid  AND g.courseStock>0 AND g.courseStatus = 1 ORDER  BY  rand(),courseId desc ";
		$rs = $this->query($sql);
		return $rs;
	
	}
	
	
	/**
	 * 获取上架中的课程
	 */
	public function queryOnSaleByPage(){
		$shopId=(int)session('WST_USER.shopId');
		$shopCatId1 = (int)I('shopCatId1',0);
		$shopCatId2 = (int)I('shopCatId2',0);
		$courseName = WSTAddslashes(I('courseName'));
		$sql = "select g.courseId,g.coursen,g.courseName,g.courseImg,g.courseThums,g.shopPrice,g.courseStock,g.saleCount,g.isSale,g.isRecomm,g.isHot,g.isBest,g.isNew,ga.isRecomm as attIsRecomm from __PREFIX__course g
				left join __PREFIX__course_attributes ga on g.courseId = ga.courseId and ga.isRecomm = 1
				where g.courseFlag=1 
		     and g.shopId=".$shopId." and g.coursetatus=1 and g.isSale=1 ";
		if($shopCatId1>0)$sql.=" and g.shopCatId1=".$shopCatId1;
		if($shopCatId2>0)$sql.=" and g.shopCatId2=".$shopCatId2;
		if($courseName!='')$sql.=" and (g.courseName like '%".$courseName."%' or g.coursen like '%".$courseName."%') ";
		$sql.=" order by g.courseId desc";
		
		return $this->pageQuery($sql);
	}
    /**
	 * 获取下架的课程
	 */
	public function queryUnSaleByPage(){
		$shopId=(int)session('WST_USER.shopId');
		$shopCatId1 = (int)I('shopCatId1',0);
		$shopCatId2 = (int)I('shopCatId2',0);
		$courseName = WSTAddslashes(I('courseName'));
		$sql = "select g.courseId,g.coursen,g.courseName,g.courseImg,g.courseThums,g.shopPrice,g.courseStock,g.saleCount,g.isSale,g.isRecomm,g.isHot,g.isBest,g.isNew,ga.isRecomm as attIsRecomm from __PREFIX__course  g
				left join __PREFIX__course_attributes ga on g.courseId = ga.courseId and ga.isRecomm = 1
				where g.courseFlag=1 
		      and g.shopId=".$shopId." and g.isSale=0 ";
		if($shopCatId1>0)$sql.=" and g.shopCatId1=".$shopCatId1;
		if($shopCatId2>0)$sql.=" and g.shopCatId2=".$shopCatId2;
		if($courseName!='')$sql.=" and (g.courseName like '%".$courseName."%' or g.coursen like '%".$courseName."%') ";
		$sql.=" order by g.courseId desc";
		return $this->pageQuery($sql);
	}
    /**
	 * 获取审核中的课程
	 */
	public function queryPenddingByPage(){
		$shopId=(int)session('WST_USER.shopId');
		$shopCatId1 = (int)I('shopCatId1',0);
		$shopCatId2 = (int)I('shopCatId2',0);
		$courseName = WSTAddslashes(I('courseName'));
		$sql = "select g.courseId,g.coursen,g.courseName,g.courseImg,g.courseThums,g.shopPrice,g.courseStock,g.saleCount,g.isSale,g.isRecomm,g.isHot,g.isBest,g.isNew,ga.isRecomm as attIsRecomm from __PREFIX__course g
				left join __PREFIX__course_attributes ga on g.courseId = ga.courseId and ga.isRecomm = 1
				where g.courseFlag=1 
		     and g.shopId=".$shopId." and g.coursetatus=0 and isSale=1 ";
		if($shopCatId1>0)$sql.=" and g.shopCatId1=".$shopCatId1;
		if($shopCatId2>0)$sql.=" and g.shopCatId2=".$shopCatId2;
		if($courseName!='')$sql.=" and (g.courseName like '%".$courseName."%' or g.coursen like '%".$courseName."%') ";
		$sql.=" order by g.courseId desc";
		return $this->pageQuery($sql);
	}
	
	protected $_validate = array(
		 array('coursen','require','请输入课程编号!',1),
		 array('courseName','require','请输入课程名称!',1),
		 array('courseImg','require','请上传课程图片!',1),
		 array('courseThums','require','请上传课程缩略图!',1),
		 array('marketPrice','double','请输入市场价格!',1),
		 array('shopPrice','double','请输入店铺价格!',1),
		 array('courseStock','integer','请输入课程库存!',1),
		 array('courseUnit','require','请输入课程单位!',1),
		 array('courseCatId1','integer','请选择商城一级分类!',1),
		 array('courseCatId2','integer','请选择商城二级分类!',1),
		 array('courseCatId3','integer','请选择商城三级分类!',1),
		 array('shopCatId1','integer','请选择本店一级分类!',1),
		 array('shopCatId2','integer','请选择本店二级分类!',1),
		 array('shopCatId2','integer','请选择本店二级分类!',1)
	);
		
	/**
	 * 新增课程
	 */
	public function insert(){
	 	$rd = array('status'=>-1);
	 	//查询商家状态
	 	$shopId = (int)session('WST_USER.shopId');
		$sql = "select shopStatus from __PREFIX__shops where shopFlag = 1 and shopId=".$shopId;
		$shopStatus = $this->query($sql);
		if(empty($shopStatus)){
			$rd['status'] = -2;
			return $rd;
		}
		$m = D('course');
		if ($m->create()){
			$m->shopId = (int)session('WST_USER.shopId');
			$m->isBest = ((int)I('isBest')==1)?1:0;
			$m->isRecomm = ((int)I('isRecomm')==1)?1:0;
			$m->isNew = ((int)I('isNew')==1)?1:0;
			$m->isHot = ((int)I('isHot')==1)?1:0;
			//如果商家状态不是已审核则所有课程只能在仓库中
		    if($shopStatus[0]['shopStatus']==1){
				$m->isSale = ((int)I('isSale')==1)?1:0;
			}else{
				$m->isSale = 0;
			}
			if($m->isSale==1)$m->saleTime=date('Y-m-d H:i:s');
			$m->courseDesc = I('courseDesc');
			$m->attrCatId = (int)I("attrCatId");
			$m->coursetatus = ($GLOBALS['CONFIG']['isCourseVerify']==1)?0:1;
			$m->createTime = date('Y-m-d H:i:s');
			$m->brandId = (int)I("brandId");
			$m->coursepec = I("coursepec");
			$m->courseKeywords = I("courseKeywords");
			$courseId = $m->add();
			if(false !== $courseId){
				if($shopStatus[0]['shopStatus']==1){
				    $rd['status']= 1;
				}else{
				    $rd['status'] = -3;
				}
				//规格属性
				if((int)I("attrCatId")>0){
					//获取课程类型属性
					$sql = "select attrId,attrName,isPriceAttr from __PREFIX__attributes where attrFlag=1 
					       and catId=".intval(I("attrCatId"))." and shopId=".$shopId;
					$m = M('course_attributes');
					$attrRs = $m->query($sql);
					if(!empty($attrRs)){
						$priceAttrId = 0;
						foreach ($attrRs as $key =>$v){
							if($v['isPriceAttr']==1){
								$priceAttrId = $v['attrId'];
								continue;
							}else{
								$attr = array();
								$attr['shopId'] = $shopId;
								$attr['courseId'] = $courseId;
								$attr['attrId'] = $v['attrId'];
								$attr['attrVal'] = I('attr_name_'.$v['attrId']);
								$m->add($attr);
							}
						}
						if($priceAttrId>0){
							$no = (int)I('coursePriceNo');
							$no = $no>50?50:$no;
							$totalStock = 0;
							for ($i=0;$i<=$no;$i++){
								$name = trim(I('price_name_'.$priceAttrId."_".$i));
								if($name=='')continue;
								$attr = array();
								$attr['shopId'] = $shopId;
								$attr['courseId'] = $courseId;
								$attr['attrId'] = $priceAttrId;
								$attr['attrVal'] = $name;
								$attr['attrPrice'] = (float)I('price_price_'.$priceAttrId."_".$i);
								$attr['isRecomm'] = (int)I('price_isRecomm_'.$priceAttrId."_".$i);
								$attr['attrStock'] = (int)I('price_stock_'.$priceAttrId."_".$i);
								$totalStock = $totalStock + (int)$attr['attrStock'];
								$m->add($attr);
							}
							//更新课程总库存
							$sql = "update __PREFIX__course set courseStock=".$totalStock." where courseId=".$courseId;
							$m->execute($sql);
						}
					}
				}
				//保存相册
				$gallery = I("gallery");
				if($gallery!=''){
					$str = explode(',',$gallery);
					foreach ($str as $k => $v){
						if($v=='')continue;
						$str1 = explode('@',$v);
						$data = array();
						$data['shopId'] = $shopId;
						$data['courseId'] = $courseId;
						$data['courseImg'] = $str1[0];
						$data['courseThumbs'] = $str1[1];
						$m = M('course_gallerys');
						$m->add($data);
					}
				}
				
				//保存优惠套餐
				$packageCnt = (int)I("packageCnt");
				$pm = M("packages");
				$gm = M("course_packages");
				for($i=0;$i<$packageCnt;$i++){
					$data = array();
					$data["packageName"] = I("packageName_".$i);
					$data["shopId"] = $shopId;
					$data["courseId"] = $courseId;
					$data["createTime"] = date('Y-m-d H:i:s');
					$packageId = $pm->add($data);
					
					$courseIds = explode(",",I("courseIds_".$i));
					$courseDiffPrices = explode(",",I("courseDiffPrices_".$i));
					for($j=0,$k=count($courseIds);$j<$k;$j++){
						$pcourseId = (int)$courseIds[$j];
						if($pcourseId>0){
							$data = array();
							$data["packageId"] = $packageId;
							$data["courseId"] = $pcourseId;
							$data["diffPrice"] = (float)$courseDiffPrices[$j];
							$gm->add($data);
						}
					}
				}
			}
		}else{
			$rd['msg'] = $m->getError();
		}
		return $rd;
	} 
	 
	/**
	 * 编辑课程信息
	 */
	public function edit(){
		$rd = array('status'=>-1);
	 	$courseId = (int)I("id",0);
	 	$shopId = (int)session('WST_USER.shopId');
	    //查询商家状态
		$sql = "select shopStatus from __PREFIX__shops where shopFlag = 1 and shopId=".$shopId;
		$shopStatus = $this->queryRow($sql);
		if(empty($shopStatus)){
			$rd['status'] = -2;
			return $rd;
		}
	 	//加载课程信息
	 	$m = D('course');
	 	$course = $m->where('courseId='.$courseId." and shopId=".$shopId)->find();
	 	if(empty($course))return array('status'=>-1,'msg'=>'无效的课程ID！');
	 	if ($m->create()){
			$m->isBest = ((int)I('isBest')==1)?1:0;
			$m->isRecomm = ((int)I('isRecomm')==1)?1:0;
			$m->isNew = ((int)I('isNew')==1)?1:0;
			$m->isHot = ((int)I('isHot')==1)?1:0;
			//如果商家状态不是已审核则所有课程只能在仓库中
		    if($shopStatus['shopStatus']==1){
				$m->isSale = ((int)I('isSale')==1)?1:0;
			}else{
				$m->isSale = 0;
			}
			if($m->isSale==1)$m->saleTime=date('Y-m-d H:i:s');
			$m->courseDesc = I('courseDesc');
			$m->attrCatId = (int)I("attrCatId");
			$m->coursetatus = ($GLOBALS['CONFIG']['isCourseVerify']==1)?0:1;
			$m->brandId = (int)I("brandId");
			$m->coursepec = I("coursepec");
			$m->courseKeywords = I("courseKeywords");
			$m->where('courseId='.$course['courseId'])->save();
			
			if(false !== $rs){
				if($shopStatus['shopStatus']==1){
				    $rd['status']= 1;
				}else{
					$rd['status']= -3;
				}
				//删除属性记录
				$m->query("delete from __PREFIX__course_attributes where courseId=".$courseId);
			    //规格属性
				if(intval(I("attrCatId")) > 0){
					//获取课程类型属性列表
					$sql = "select attrId,attrName,isPriceAttr from __PREFIX__attributes where attrFlag=1 
					       and catId=".intval(I("attrCatId"))." and shopId=".session('WST_USER.shopId');
					$m = M('course_attributes');
					$attrRs = $m->query($sql);
					if(!empty($attrRs)){
						$priceAttrId = 0;
						$recommPrice = 0;
						foreach ($attrRs as $key =>$v){
							if($v['isPriceAttr']==1){
								$priceAttrId = $v['attrId'];
								continue;
							}else{
								//新增
								$attr = array();
								$attr['attrVal'] =  trim(I('attr_name_'.$v['attrId']));
								$attr['attrPrice'] = 0;
								$attr['attrStock'] = 0;
								$attr['shopId'] = session('WST_USER.shopId');
								$attr['courseId'] = $courseId;
								$attr['attrId'] = $v['attrId'];
								$m->add($attr);
							}
						}
						if($priceAttrId>0){
							$no = (int)I('coursePriceNo');
							$no = $no>50?50:$no;
							$totalStock = 0;
							
							for ($i=0;$i<=$no;$i++){
								$name = trim(I('price_name_'.$priceAttrId."_".$i));
								if($name=='')continue;
								$attr = array();
								$attr['shopId'] = session('WST_USER.shopId');
								$attr['courseId'] = $courseId;
								$attr['attrId'] = $priceAttrId;
								$attr['attrVal'] = $name;
								$attr['attrPrice'] = (float)I('price_price_'.$priceAttrId."_".$i);
								$attr['isRecomm'] = (int)I('price_isRecomm_'.$priceAttrId."_".$i);
								if($attr['isRecomm']==1){
									$recommPrice = $attr['attrPrice'];
								}
								$attr['attrStock'] = (int)I('price_stock_'.$priceAttrId."_".$i);
								$totalStock = $totalStock + (int)$attr['attrStock'];
								$m->add($attr);
							}
							//更新课程总库存
							$sql = "update __PREFIX__course set courseStock=".$totalStock;
							if($recommPrice>0){
								$sql .= ",shopPrice=".$recommPrice;
							}
							$sql .= " where courseId=".$courseId;
							$m->execute($sql);
							//删除已经失效的用户购物车课程记录
							$sql = "delete from __PREFIX__cart where courseId=".$courseId;
							$m->execute($sql);
							//删除首页缓存
							S("WST_CACHE_GOODS_CAT_GOODS_WEB_".(int)session('WST_USER.areaId2'),null);
						    S('WST_CACHE_GOODS_CAT_GOODS_WP_'.(int)session('WST_USER.areaId2'),null);
						}
					}
				}
				
			    //保存相册
				$gallery = I("gallery");
				if($gallery!=''){
					$str = explode(',',$gallery);
					$m = M('course_gallerys');
					//删除相册信息
					$m->where('courseId='.$course['courseId'])->delete();
					//保存相册信息
					foreach ($str as $k => $v){
						if($v=='')continue;
						$str1 = explode('@',$v);
						$data = array();
						$data['shopId'] = $course['shopId'];
						$data['courseId'] = $course['courseId'];
						$data['courseImg'] = $str1[0];
						$data['courseThumbs'] = $str1[1];
						$m->add($data);
					}
				}
				
				//保存优惠套餐
				$packageCnt = (int)I("packageCnt");
				$packageIds = array();
				for($i=0;$i<$packageCnt;$i++){
					$packageId = (int)I("packageId_".$i);
					if($packageId>0){
						$packageIds[] = $packageId;
					}
				}
				//本次删除的优惠套餐
				$sql = "select * from __PREFIX__packages where courseId= $courseId and packageId not in (".implode(",",$packageIds).")";
				$nlist = $this->query($sql);
				$npIds = array();
				for($i=0, $k=count($nlist); $i<$k; $i++){
					$npIds[] = $nlist[$i]["packageId"];
				}
				$sql = "delete from __PREFIX__packages where packageId in (".implode(",",$npIds).")";
				$this->execute($sql);
				
				//删除已经失效的套餐记录
				$sql = "delete from __PREFIX__cart where packageId in (".implode(",",$npIds).")";
				$m->execute($sql);
				
				$sql = "select * from __PREFIX__packages where courseId= $courseId";
				$vlist = $this->query($sql);
				$vpIds = array();
				for($i=0, $k=count($vlist); $i<$k; $i++){
					$vpIds[] = $vlist[$i]["packageId"];
				}
				
				$sql = "delete from __PREFIX__course_packages where packageId in (".implode(",",$vpIds).")";
				$this->execute($sql);
				$pm = M("packages");
				$gm = M("course_packages");
				for($i=0;$i<$packageCnt;$i++){
					$packageId = (int)I("packageId_".$i);
					$data = array();
					$data["packageName"] = I("packageName_".$i);
					if($packageId>0){
						$pm->where("packageId=".$packageId)->save($data);
					}else{
						$data["shopId"] = $shopId;
						$data["courseId"] = $courseId;
						$data["createTime"] = date('Y-m-d H:i:s');
						$packageId = $pm->add($data);
					}
					$courseIds = explode(",",I("courseIds_".$i));
					$courseDiffPrices = explode(",",I("courseDiffPrices_".$i));
					for($j=0,$k=count($courseIds);$j<$k;$j++){
						$pcourseId = (int)$courseIds[$j];
						if($pcourseId>0){
							$data = array();
							$data["packageId"] = $packageId;
							$data["courseId"] = $pcourseId;
							$data["diffPrice"] = (float)$courseDiffPrices[$j];
							$gm->add($data);
						}
					}
				}
			}
		}else{
			$rd['msg'] = $m->getError();
		}
		return $rd;
	}
	/**
	 * 获取课程信息
	 */
	 public function get(){
	 	$m = M('course');
	 	$id = (int)I('id',0);
	 	$shopId = (int)session('WST_USER.shopId');
		$course = $m->where("courseId=".$id." and shopId=".$shopId)->find();
		if(empty($course))return array();
		$m = M('course_gallerys');
		$course['gallery'] = $m->where('courseId='.$id)->select();
		//获取规格属性
		$sql = "select ga.attrVal,ga.attrPrice,ga.attrStock,ga.isRecomm,a.attrId,a.attrName,a.isPriceAttr,a.attrType,a.attrContent
		            ,ga.isRecomm from __PREFIX__attributes a 
		            left join __PREFIX__course_attributes ga on ga.attrId=a.attrId and ga.courseId=".$id." where  
					a.attrFlag=1 and a.catId=".$course['attrCatId']." and a.shopId=".$shopId." order by a.attrSort asc, a.attrId asc,ga.id asc";
		$attrRs = $m->query($sql);
		if(!empty($attrRs)){
			$priceAttr = array();
			$attrs = array();
			foreach ($attrRs as $key =>$v){
				if($v['isPriceAttr']==1){
					if($v['isRecomm']==1){
						$course['recommPrice'] = $v['attrPrice'];
					}
					$course['priceAttrId'] = $v['attrId'];
					$course['priceAttrName'] = $v['attrName'];
					$priceAttr[] = $v;
				}else{
					//分解下拉和多选的选项
					if($v['attrType']==1 || $v['attrType']==2){
						$v['opts']['txt'] = explode(',',$v['attrContent']);
						if($v['attrType']==1){
							$vs = explode(',',$v['attrVal']);
							//保存多选的值
							foreach ($vs as $vv){
								$v['opts']['val'][$vv] = 1;
							}
						}
					}
					$attrs[] = $v;
				}
			}
			$course['priceAttrs'] = $priceAttr;
			$course['attrs'] = $attrs;
		}
		return $course;
	 }
	 /**
	  * 删除课程
	  */
	 public function del(){
	 	$rd = array('status'=>-1);
	 	$m = M('course');
	 	$shopId = (int)session('WST_USER.shopId');
	 	$data = array();
		$data["courseFlag"] = -1;
	 	$rs = $m->where("shopId=".$shopId." and courseId=".I('id'))->save($data);
	    if(false !== $rs){
			$rd['status']= 1;
		}
		return $rd;
	 }
	 
	 /**
	  * 批量删除课程
	  */
	 public function batchDel(){
	 	$rd = array('status'=>-1);
	 	$m = M('course');
	 	$shopId = (int)session('WST_USER.shopId');
	 	$data = array();
		$data["courseFlag"] = -1;
		$ids = self::formatIn(",", I('ids'));
	 	$rs = $m->where("shopId=".$shopId." and courseId in(".$ids.")")->save($data);
	    if(false !== $rs){
			$rd['status']= 1;
		}
		return $rd;
	 }
	 /**
	  * 批量修改课程状态
	  */
	 public function courseet(){
	 	$rd = array('status'=>-1);
	 	$code = WSTAddslashes(I('code'));
	 	$codeArr = array('isBest','isNew','isHot','isRecomm');
	 	if(in_array($code,$codeArr)){
		 	$m = M('course');
		 	$shopId = (int)session('WST_USER.shopId');
		 	$data = array();
			$data[$code] = 1;
			$ids = self::formatIn(",", I('ids'));
		 	$rs = $m->where("shopId=".$shopId." and courseId in(".$ids.")")->save($data);
		    if(false !== $rs){
				$rd['status']= 1;
			}
	 	}
		return $rd;
	 }
     /**
	  * 批量上架/下架课程
	  */
	 public function sale(){
	 	$rd = array('status'=>-1);
	 	$m = M('course');
	 	$isSale = (int)I('isSale');
	 	$shopId = (int)session('WST_USER.shopId');
	 	$ids = self::formatIn(",", I('ids'));
	 	if($isSale==1){
	 		//核对店铺状态
	 		$sql = "select shopStatus from __PREFIX__shops where shopId=".$shopId;
	 		$shopRs = $m->query($sql);
	 		if($shopRs[0]['shopStatus']!=1){
	 			$rd['status']= -3;
	 			return $rd;
	 		}
	 		//核对课程是否符合上架的条件
	 		$sql = "select g.courseId from __PREFIX__course g,__PREFIX__shops_cats sc2,__PREFIX__course_cats gc3 
	 		  	    where sc2.shopId=$shopId and g.shopCatId2=sc2.catId and sc2.catFlag=1 and sc2.isShow=1 and g.courseCatId3=gc3.catId and gc3.catFlag=1 and gc3.isShow=1
	 		  	    and g.courseId in(".$ids.")";

	 		$courseRs = $m->query($sql);

	 		if(count($courseRs)>0){
	 			$rd['num'] = 0;
	 			foreach ($courseRs as $key =>$v){
			 		//课程上架操作
				 	$data = array();
					$data["isSale"] = 1;
					$data["saleTime"] = date('Y-m-d H:i:s');
				 	$rs = $m->where("shopId=".$shopId." and courseId =".$v['courseId'])->save($data);
				    if(false !== $rs){
						$rd['num']++;
					}
	 			}
	 			$rd['status'] = (count(explode(',',$ids))==$rd['num'])?1:2;
	 		}else{
	 			$rd['status']= -2;
	 		}
	 	}else{
		 	//课程下架操作
		 	$data = array();
			$data["isSale"] = 0;
		 	$rs = $m->where("shopId=".$shopId." and courseId in(".$ids.")")->save($data);
		    if(false !== $rs){
				$rd['status']= 1;
			}
	 	}
	 	
		return $rd;
	 }
	 
	/**
	 * 获取店铺课程列表
	 */
	public function getShopsCourse($shopId = 0){
		
		$shopId = ($shopId>0)?$shopId:(int)I("shopId");
		$ct1 = (int)I("ct1");
		$ct2 = (int)I("ct2");
		$msort = (int)I("msort",1);//排序標識		
		$mdesc = (int)I("mdesc");//排序標識		
		
		$sprice = WSTAddslashes(I("sprice"));//开始价格
		$eprice = WSTAddslashes(I("eprice"));//结束价格
		//$courseName = I("courseName");//搜索店鋪名
		$courseName = WSTAddslashes(urldecode(I("courseName")));//搜索店鋪名
		$words = array();
		if($courseName!=""){
			$words = explode(" ",$courseName);
		}
		$sql = "SELECT sp.shopName, g.saleCount totalnum, sp.shopId ,g.courseStock, g.courseId , g.courseName,g.courseImg, g.courseThums,g.shopPrice,g.marketPrice, g.coursen,ga.id courseAttrId 
						FROM __PREFIX__course g left join __PREFIX__course_attributes ga on g.courseId = ga.courseId and ga.isRecomm=1
						left join __PREFIX__course_scores gs on gs.courseId= g.courseId,
						__PREFIX__shops sp 
						WHERE g.shopId = sp.shopId AND sp.shopFlag=1 AND sp.shopStatus=1 AND g.courseFlag = 1 AND g.isSale = 1 AND g.coursetatus = 1 AND g.shopId = $shopId";
		
		if($ct1>0){
			$sql .= " AND g.shopCatId1 = $ct1 ";
		}
		if($ct2>0){
			$sql .= " AND g.shopCatId2 = $ct2 ";
		}
		if($sprice!=""){
			$sql .= " AND g.shopPrice >= '$sprice' ";
		}
		if($eprice!=""){
			$sql .= " AND g.shopPrice <= '$eprice' ";
		}

		if(!empty($words)){
			$sarr = array();
			foreach ($words as $key => $word) {
				if($word!=""){
					$sarr[] = "g.courseName LIKE '%$word%'";
				}
			}
			$sql .= " AND (".implode(" or ", $sarr).")";
		}
		
		$orderFile = array('1'=>'saleCount','2'=>'saleCount','3'=>'saleCount','4'=>'shopPrice','5'=>'(totalScore/totalUsers)','6'=>'saleTime');
	   	$orderSort = array('0'=>'ASC','1'=>'DESC');
		$sql .= " ORDER BY ".$orderFile[$msort]." ".$orderSort[$mdesc].",g.courseId";
		$rs = $this->pageQuery($sql,I('p'),30);
		return $rs;
		
	}
	
	
	/**
	 * 获取店铺课程列表
	 */
	public function getHotCourse($shopId){
		$hotcourse = S("WST_CACHE_HOT_GOODS_".$shopId);
		if(!$hotcourse){
			//热销排名
			$sql = "SELECT sp.shopName, g.saleCount totalnum, sp.shopId , g.courseId , g.courseName,g.courseImg, g.courseThums,g.shopPrice,g.marketPrice, g.coursen 
							FROM __PREFIX__course g,__PREFIX__shops sp 
							WHERE g.shopId = sp.shopId AND g.courseFlag = 1 AND sp.shopFlag=1 AND sp.shopStatus=1 AND g.isSale = 1 AND g.coursetatus = 1 AND sp.shopId = $shopId
							ORDER BY g.saleCount desc limit 5";	
			$hotcourse = $this->query($sql);
			S("WST_CACHE_HOT_GOODS_".$shopId,$hotcourse,86400);
		}
		for($i=0;$i<count($hotcourse);$i++){
			$hotcourse[$i]["courseName"] = WSTMSubstr($hotcourse[$i]["courseName"],0,25);
		}
		return  $hotcourse;
	}
	
	/**
	 * 获取课程库存
	 */
	public function getcourseStock($data){
	 	$courseId = $data['courseId'];
		$isBook = $data['isBook'];
		$courseAttrId = $data['courseAttrId'];
		if($isBook==1){
			$sql = "select courseId,(courseStock+bookQuantity) as courseStock from __PREFIX__course where isSale=1 and courseFlag=1 and coursetatus=1 and courseId=".$courseId;
		}else{
			$sql = "select courseId,courseStock,attrCatId from __PREFIX__course where isSale=1 and courseFlag=1 and coursestatus=1 and courseId=".$courseId;
		}
	 	$course = $this->queryRow($sql);
	 	if($course['attrCatId']>0){
	 		$sql = "select ga.id,ga.attrStock from __PREFIX__course_attributes ga where ga.courseId=".$courseId." and id=".$courseAttrId;
			$priceAttrs = $this->queryRow($sql);
			if(!empty($priceAttrs))$course['courseStock'] = $priceAttrs['attrStock'];
	 	}
	 	if(empty($course))return array();
	 	return $course;
	 }
	 
	 
	 /**
	  * 获取课程库存
	  */
	 public function getPkgcourseStock($data){
	 	$packageId = $data['packageId'];
	 	$batchNo = $data['batchNo'];
	 	
	 	$sql = "select * from __PREFIX__cart where packageId=$packageId and batchNo=$batchNo";
	 	$pkgList = $this->query($sql);
	 	$package = array();
	 	for($i=0;$i<count($pkgList);$i++){
	 		$pcourse = $pkgList[$i];
	 		$packageId = $pcourse["packageId"];
	 		$courseId = (int)$pcourse["courseId"];

	 		$courseAttrId = (int)$pcourse["courseAttrId"];
	 		$sql = "SELECT g.courseStock,g.shopPrice,g.attrCatId
			 		FROM __PREFIX__course g, __PREFIX__shops shop
			 		WHERE g.courseId = $courseId AND g.shopId = shop.shopId AND g.courseFlag = 1 and g.isSale=1 and g.coursetatus=1 ";
	 		$course = $this->queryRow($sql);
	 		if($course==null)continue;
	 		//如果课程有价格属性的话则获取其价格属性
	 		if(!empty($course) && $course['attrCatId']>0){
	 	
	 			$sql = "select ga.id,ga.attrPrice,ga.attrStock,a.attrName,ga.attrVal,ga.attrId from __PREFIX__attributes a,__PREFIX__course_attributes ga
				         	where a.attrId=ga.attrId and a.catId=".$course['attrCatId']." and a.isPriceAttr=1
				          	and ga.courseId=".$courseId." and id=".$courseAttrId;
	 			$priceAttrs = $this->queryRow($sql);
	 			if(!empty($priceAttrs)){
	 				$course['courseStock'] = $priceAttrs['attrStock'];
	 				$pckMinStock = ($pckMinStock==0 || $course['courseStock']<$pckMinStock)?$course['courseStock']:$pckMinStock;
	 			}
	 		}else{
	 			$pckMinStock = ($pckMinStock==0 || $course['courseStock']<$pckMinStock)?$course['courseStock']:$pckMinStock;
	 		}
	 	}
	 	$package["packageId"] = $packageId;
	 	$package["courseStock"] = $pckMinStock;
	 
	 	return $package;
	 }
	 
	 
	/**
	 * 查询课程简单信息
	 */
	public function getCourseInfo($courseId,$courseAttrId){		
		$sql = "SELECT g.attrCatId,g.courseId,g.courseName,g.courseStock,g.bookQuantity,g.isBook,g.isSale,sp.shopAtive,sp.shopName FROM __PREFIX__course g, __PREFIX__shops sp WHERE g.shopId=sp.shopId AND g.courseId = $courseId AND g.courseFlag = 1 AND g.coursetatus = 1";		
		$rs = $this->queryRow($sql);
        if(!empty($rs) && $rs['attrCatId']>0){
        	$sql = "select ga.id,ga.attrPrice,ga.attrStock,a.attrName,ga.attrVal,ga.attrId from __PREFIX__attributes a,__PREFIX__course_attributes ga
			        where a.attrId=ga.attrId and a.catId=".$rs['attrCatId']." 
			        and ga.courseId=".$rs['courseId']." and id=".$courseAttrId;
			$priceAttrs = $this->query($sql);
			if(!empty($priceAttrs))$rs['courseStock'] = $priceAttrs[0]['attrStock'];
        }
		return $rs;
		
	}
	
	/**
	 * 查询课程简单信息
	 */
	public function getcourseSimpInfo($courseId,$courseAttrId){
		$sql = "SELECT g.*,sp.shopId,sp.shopName,sp.deliveryFreeMoney,sp.deliveryMoney,sp.deliveryStartMoney,sp.isInvoice,sp.serviceStartTime startTime,sp.serviceEndTime endTime,sp.deliveryType 
				FROM __PREFIX__course g, __PREFIX__shops sp 
				WHERE g.shopId = sp.shopId AND g.courseId = $courseId AND g.isSale=1 AND g.courseFlag = 1 AND g.courseStatus = 1";
		$rs = $this->queryRow($sql);
		if(empty($rs))return array();
	    if($rs['attrCatId']>0){
        	$sql = "select ga.id,ga.attrPrice,ga.attrStock,a.attrName,ga.attrVal,ga.attrId from __PREFIX__attributes a,__PREFIX__course_attributes ga
			        where a.attrId=ga.attrId and a.catId=".$rs['attrCatId']." 
			        and ga.courseId=".$rs['courseId']." and id=".$courseAttrId;
			$priceAttrs = $this->queryRow($sql);
			if(!empty($priceAttrs)){
				$rs['attrId'] = $priceAttrs['attrId'];
				$rs['courseAttrId'] = $priceAttrs['id'];
				$rs['attrName'] = $priceAttrs['attrName'];
				$rs['attrVal'] = $priceAttrs['attrVal'];
				$rs['shopPrice'] = $priceAttrs['attrPrice'];
				$rs['courseStock'] = $priceAttrs['attrStock'];
			}
        }
        $rs['courseAttrId'] = (int)$rs['courseAttrId'];
		return $rs;
		
	}
	
	
	/**
	 * 获取课程类别导航
	 */
	public function getCourseNav($obj=array()){
		$courseId = (int)I("courseId");
		if($courseId>0){
			$sql = "SELECT courseCatId1,courseCatId2,courseCatId3 FROM __PREFIX__course WHERE courseId = $courseId";
			$rs = $this->queryRow($sql);
		}else{
			$rs = $obj;
		}
		$gclist = M('course_cats')->cache('WST_CACHE_GOODS_CAT_URL',31536000)->where('isShow = 1')->field('catId,catName')->order('catId')->select();
		$catslist = array();
		foreach ($gclist as $key => $gcat) {
			$catslist[$gcat["catId"]] = $gcat;
		}
		
		$data[] = $catslist[$rs["courseCatId1"]];
		$data[] = $catslist[$rs["courseCatId2"]];
		$data[] = $catslist[$rs["courseCatId3"]];
		return $data;
	}
	
	/**
	 * 查询课程属性价格及库存
	 */
	public function getPriceAttrInfo(){
		$courseId = (int)I("courseId");
		$id = (int)I("id");
		$sql = "select id,attrPrice,attrStock from  __PREFIX__course_attributes where courseId=".$courseId." and id=".$id;
		$rs = $this->query($sql);
		return $rs[0];
	}
	
	/**
	 * 修改课程库存
	 */
	public function editStock(){
		$rdata= array("status"=>-1);
		$courseId = (int)I("courseId");
		$stock = (int)I("stock");
		$data = array();
		$data["courseStock"] = $stock;
		
		M('course')->where("courseId=$courseId")->save($data);
		$rdata["status"] = 1;
		return $rdata;
	}
	
	/**
	 * 修改课程库存,课程编号,价格
	 */
	public function editCourseBase(){
	
		$rdata= array("status"=>-1);
		$vfield = (int)I("vfield");
		$courseId = (int)I("courseId");
	
		$data = array();
		if($vfield==1){//课程编号
			$data["coursen"] = WSTAddslashes(I("vtext"));
		}else if($vfield==2){//课程价格
			$data["shopPrice"] = WSTAddslashes(I("vtext"));
		}else if($vfield==3){//课程庫存
			$data["courseStock"] = (int)I("vtext");
		}
	
		M('course')->where("courseId=$courseId")->save($data);
		$rdata["status"] = 1;
		return $rdata;
	}
	
	public function getKeyList($areaId2){
		$keywords = WSTAddslashes(I("keywords"));	
		$m = M('course');
		$sql = "select DISTINCT courseName as searchKey from __PREFIX__course g,__PREFIX__shops sp  where (sp.areaId2=$areaId2 or sp.isDistributAll=1) and g.shopId=sp.shopId and coursetatus=1 and courseFlag=1 and courseName like '%$keywords%' 
				Order by saleCount desc, courseName asc limit 10";
		$rs = $this->query($sql);
		return $rs;
	}
	
	
	/**
	 * 修改 推荐/精品/新品/热销/上架
	 */
	public function changSaleStatus(){
		$rdata= array("status"=>-1,'msg'=>'操作失败!');
		$courseId = (int)I("courseId");
		$tamk = ((int)I("tamk")==1)?1:0;
		$flag = (int)I("flag");
		$data = array();
		if($tamk==0){
			$tamk = 1;
		}else{
			$tamk = 0;
		}
		if($flag==1){
			$data["isRecomm"] = $tamk;
		}else if($flag==2){
			$data["isBest"] = $tamk;
		}else if($flag==3){
			$data["isNew"] = $tamk;
		}else if($flag==4){
			$data["isHot"] = $tamk;
		}else if($flag==5){
			$data["isSale"] = $tamk;
			if($data["isSale"]==1){
				//核对课程是否符合上架的条件
	 		    $sql = "select g.courseId from __PREFIX__course g,__PREFIX__shops_cats sc2,__PREFIX__course_cats gc3 
	 		  	    where sc2.shopId=".(int)session('WST_USER.shopId')." and g.shopCatId2=sc2.catId and sc2.catFlag=1 and sc2.isShow=1 and g.courseCatId3=gc3.catId and gc3.catFlag=1 and gc3.isShow=1
	 		  	    and g.courseId = ".$courseId;
	 		    $courseRs = $this->queryRow($sql);
	 		    if(empty($courseRs))return array('status'=>-1,'msg'=>'上架失败，请核对课程信息是否完整!');
	 		    $data["saleTime"] = date('Y-m-d H:i:s');
			}
		}
	
		M('course')->where("courseId=$courseId")->save($data);
		$rdata["status"] = 1;
		return $rdata;
	}
	
	/**
	 * 获取课程历史浏览记录(取最新10條)
	 */
	function getViewCourse(){
		$m = M();
		$viewCourse = WSTAddslashes(cookie("viewCourse"));
		$viewCourse = array_reverse($viewCourse);
		$goodIds = 0;
		if(!empty($viewCourse)){
			$goodIds = implode(",",$viewCourse);
		}
		//热销排名
		$sql = "SELECT g.saleCount totalnum, g.courseId , g.courseName,g.courseImg, g.courseThums,g.shopPrice,g.marketPrice, g.coursen FROM __PREFIX__course g
				WHERE g.courseId in ($goodIds) AND g.courseFlag = 1 AND g.isSale = 1 AND g.coursetatus = 1
				ORDER BY FIELD(g.courseId,$goodIds) limit 10";
	
		$course = $m->query($sql);
		for($i=0;$i<count($course);$i++){
			$course[$i]["courseName"] = WSTMSubstr($course[$i]["courseName"],0,25);
		}
		return  $course;
	
	}
	
	/**
	 * 上传课程数据
	 */
	public function importCourse($data){
		$objReader = WSTReadExcel($data['file']['savepath'].$data['file']['savename']);
        $objReader->setActiveSheetIndex(0); 
        $sheet = $objReader->getActiveSheet();
        $rows = $sheet->getHighestRow();
        $cells = $sheet->getHighestColumn();
        //数据集合
        $readData = array();
        $courseCatMap = array();
        $shopCourseCatMap = array();
        $brandMap = array();
        $shopId = (int)session('WST_USER.shopId');
        $courseModel = M('course');
        $importNum = 0;
        //循环读取每个单元格的数据
        for ($row = 3; $row <= $rows; $row++){//行数是以第3行开始
            $course = array();
            $course['shopId'] = $shopId;
            $course['coursen'] = trim($sheet->getCell("A".$row)->getValue());
            if($course['coursen']=='')break;//如果某一行第一列为空则停止导入
            $course['courseName'] = trim($sheet->getCell("B".$row)->getValue());
            $course['marketPrice'] = trim($sheet->getCell("C".$row)->getValue());
            $course['shopPrice'] = trim($sheet->getCell("D".$row)->getValue());
            $course['courseStock'] = trim($sheet->getCell("E".$row)->getValue());
            $course['saleCount'] = trim($sheet->getCell("F".$row)->getValue());
            $course['courseUnit'] = trim($sheet->getCell("G".$row)->getValue());
            $course['coursepec'] = trim($sheet->getCell("H".$row)->getValue());
            $course['courseKeywords'] = trim($sheet->getCell("I".$row)->getValue());
            $course['isSale'] = 0;
            $course['isRecomm'] = (trim($sheet->getCell("J".$row)->getValue())!='')?1:0;
            $course['isBest'] = (trim($sheet->getCell("K".$row)->getValue())!='')?1:0;
            $course['isNew'] = (trim($sheet->getCell("L".$row)->getValue())!='')?1:0;
            $course['isHot'] = (trim($sheet->getCell("M".$row)->getValue())!='')?1:0;
            //查询商城分类
            $courseCat = trim($sheet->getCell("N".$row)->getValue());
            if($courseCatMap[$courseCat]==''){
	            $sql = "select gc1.catId catId1,gc2.catId catId2,gc3.catId catId3,gc3.catName 
	                    from __PREFIX__course_cats gc3, __PREFIX__course_cats gc2,__PREFIX__course_cats gc1
	                    where gc3.parentId=gc2.catId and gc2.parentId=gc1.catId and gc3.isShow=1 and gc2.isShow=1 and gc1.isShow=1
	                    and gc3.catFlag=1 and gc2.catFlag=1 and gc1.catFlag=1 and gc3.catName='".$courseCat."'";
	            $trs = $this->queryRow($sql);
	            if(!empty($trs)){
	            	$courseCatMap[$trs['catName']] = $trs;
	            }
            }
            $course['courseCatId1'] = (int)$courseCatMap[$courseCat]['catId1'];
            $course['courseCatId2'] = (int)$courseCatMap[$courseCat]['catId2'];
            $course['courseCatId3'] = (int)$courseCatMap[$courseCat]['catId3'];
            //查询店铺分类
            $shopCourseCat = trim($sheet->getCell("O".$row)->getValue());
            if($shopCourseCatMap[$shopCourseCat]==''){
	            $sql = "select sc1.catId catId1,sc2.catId catId2,sc2.catName
	                    from __PREFIX__shops_cats sc2, __PREFIX__shops_cats sc1
	                    where sc2.parentId=sc1.catId
	                    and sc2.catFlag=1 and sc1.catFlag=1 and sc1.shopId=".$shopId." and sc2.catName='".$shopCourseCat."'";
	            $trs = $this->queryRow($sql);
	            if(!empty($trs)){
	            	$shopCourseCatMap[$trs['catName']] = $trs;
	            }
            }
            $course['shopCatId1'] = (int)$shopCourseCatMap[$shopCourseCat]['catId1'];
            $course['shopCatId2'] = (int)$shopCourseCatMap[$shopCourseCat]['catId2'];
            //查询品牌
            $brand = WSTAddslashes(trim($sheet->getCell("P".$row)->getValue()));
            if($brandMap[$brand]==''){
            	$sql="select brandId,brandName from __PREFIX__brands where brandName='".$brand."' and brandFlag=1";
            	$trs = $this->queryRow($sql);
	            if(!empty($trs)){
	            	$brandMap[$trs['brandName']] = $trs;
	            }
            }
            $course['brandId'] = (int)$brandMap[$brand]['brandId'];
            $course['courseDesc'] = trim($sheet->getCell("Q".$row)->getValue());
            $course['coursetatus'] = 0;
            $course['courseFlag'] = 1;
            $course["saleTime"] = date('Y-m-d H:i:s');
            $course['createTime'] = date('Y-m-d H:i:s');
            $readData[] = $course;
            $importNum++;
        }
        if(count($readData)>0)$courseModel->addAll($readData);
        return array('status'=>1,'importNum'=>$importNum);
	}
	
	public function getCourseByCat(){
		$shopId = (int)session('WST_USER.shopId');
		$catId = (int)I("catId");
		$sql = "select courseId,courseName,shopPrice from  __PREFIX__course where shopId=$shopId and courseFlag = 1 AND isSale = 1 AND coursetatus = 1";
		if($catId>0){
			$sql .= " and (shopCatId1=$catId or shopCatId2=$catId) ";
		}
		$rs = $this->query($sql);
		return $rs;
	}
	
	/**
	 * 获取套餐中的课程
	 */
	public function getPackageCourse(){
		$shopId = (int)session('WST_USER.shopId');
		$courseIds = WSTFormatIn(",", I("courseIds"));
		$sql = "select courseId,courseName,shopPrice from __PREFIX__course where shopId=$shopId and courseId in ($courseIds) order by find_in_set(courseId,'$courseIds')";
		$rs = $this->query($sql);
		return $rs;
	}
	
	/**
	 * 获取指定课程的套餐
	 * $courseId 课程ID
	 * $flag 1:来自课程详情
	 */
	public function getCoursePackages($courseId,$flag=0){
		$sql = "select packageId,courseId,packageName,shopId from __PREFIX__packages where courseId= $courseId ";
		$packages = $this->query($sql);
		if(!empty($packages)){
			$pminPrice = $pmaxPrice = 0;
			if($flag==1){
				$sql = "select courseId, courseName, courseThums, shopPrice, attrCatId from __PREFIX__course where courseId=$courseId";
				$course = $this->queryRow($sql);
				$pminPrice = $course["shopPrice"];
				$pmaxPrice = $course["shopPrice"];
				//获取规格属性
				$sql = "select ga.id,ga.attrVal,ga.attrPrice,ga.attrStock,ga.isRecomm,a.attrId,a.attrName,a.isPriceAttr,a.attrType,a.attrContent
			            ,ga.isRecomm from __PREFIX__attributes a, __PREFIX__course_attributes ga  where
						a.attrFlag=1 and a.catId=".$course['attrCatId']." and ga.attrId=a.attrId and a.isPriceAttr=1 and ga.courseId=".$course['courseId']." order by a.attrSort asc, a.attrId asc,ga.id asc";
				$attrRs = $this->query($sql);
				if(!empty($attrRs)){
					$priceAttr = array();
					$attrs = array();
					foreach ($attrRs as $key =>$v){
						$attrPrice = (float)$v['attrPrice'];
						$pminPrice = ($attrPrice<$pminPrice)?$attrPrice:$pminPrice;
						$pmaxPrice = ($attrPrice>$pmaxPrice)?$attrPrice:$pmaxPrice;
					}
				}
			}
			$packageIds = array();
			for($i=0;$i<count($packages);$i++){
				$packageIds[] = $packages[$i]["packageId"];
			}
			$sql = "select g.courseId,g.courseName,g.courseThums,g.shopPrice,g.attrCatId,g.coursetock,p.diffPrice,p.packageId from __PREFIX__course g, __PREFIX__course_packages p where g.courseId=p.courseId and p.packageId in (".implode(",",$packageIds).")";
			$glist = $this->query($sql);
			$pcourse = array();
			$gprices = array();
			$sprices = array();
			
			$courseIds = array();
			$diffPrices = array();
			
			for($i=0;$i<count($glist);$i++){
				$course = $glist[$i];
				if($flag==1){
					$diffPrice = $course['diffPrice'];
					
					$minPrice = 0;
					$maxPrice = 0;
					
					//获取规格属性
					$sql = "select ga.id,ga.attrVal,ga.attrPrice,ga.attrStock,ga.isRecomm,a.attrId,a.attrName,a.isPriceAttr,a.attrType,a.attrContent
			            	,ga.isRecomm from __PREFIX__attributes a, __PREFIX__course_attributes ga  where
							a.attrFlag=1 and a.catId=".$course['attrCatId']." and ga.attrId=a.attrId and a.isPriceAttr=1 and ga.courseId=".$course['courseId']." order by a.attrSort asc, a.attrId asc,ga.id asc";
					$attrRs = $this->query($sql);
					if(!empty($attrRs)){
						$priceAttr = array();
						$attrs = array();
						foreach ($attrRs as $key =>$v){
							$attrPrice = (float)$v['attrPrice'];
							if($v['isRecomm']==1){
								$course['recommPrice'] = $attrPrice;
							}
							$course['priceAttrId'] = $v['attrId'];
							$course['priceAttrName'] = $v['attrName'];
							
							$vprice = (($attrPrice-$diffPrice)>0)?($attrPrice-$diffPrice):$attrPrice;
							
							$minPrice = ($vprice<$minPrice || $minPrice==0)?$vprice:$minPrice;
							$maxPrice = ($vprice>$maxPrice)?$vprice:$maxPrice;
							
							$priceAttr[] = $v;
						}
						$course['priceAttrs'] = $priceAttr;
					}else{
						$shopPrice = $course["shopPrice"];
						$vprice = ($shopPrice-$diffPrice)>0?($shopPrice-$diffPrice):$shopPrice;
						$minPrice = $vprice;
						$maxPrice = $vprice;
					}
					$sprices[$course['packageId']]['savePrice'] = $sprices[$course['packageId']]['savePrice']+$course["diffPrice"];
					
					$gprices[$course['packageId']]['minPrice'] += $minPrice;
					$gprices[$course['packageId']]['maxPrice'] += $maxPrice;
				}
				$pcourse[$course['packageId']][] = $course;
				$courseIds[$course['packageId']][] = $course["courseId"];
				$diffPrices[$course['packageId']][] = $course["diffPrice"];
			}
			for($i=0;$i<count($packages);$i++){
				if($flag==1){
					$packages[$i]["savePrice"] = $sprices[$packages[$i]["packageId"]]["savePrice"];
					
					$packages[$i]["pminPrice"] = $pminPrice;
					$packages[$i]["pmaxPrice"] = $pmaxPrice;
					
					$packages[$i]["minPrice"] = $gprices[$packages[$i]["packageId"]]["minPrice"];
					$packages[$i]["maxPrice"] = $gprices[$packages[$i]["packageId"]]["maxPrice"];
				}
				$packages[$i]["glist"] = $pcourse[$packages[$i]["packageId"]];
				$packages[$i]["courseIds"] = implode(",",$courseIds[$packages[$i]["packageId"]]);
				$packages[$i]["diffPrices"] = implode(",",$diffPrices[$packages[$i]["packageId"]]);
			}
		}
		return $packages;
		
	}
}