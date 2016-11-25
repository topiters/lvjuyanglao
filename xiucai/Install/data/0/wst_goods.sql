SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `wst_goods`;
CREATE TABLE `wst_goods` (
  `goodsId` int(11) NOT NULL AUTO_INCREMENT,
  `goodsSn` varchar(20) NOT NULL,
  `goodsName` varchar(50) NOT NULL,
  `goodsImg` varchar(150) NOT NULL,
  `goodsThums` varchar(150) NOT NULL,
  `brandId` int(11) DEFAULT NULL,
  `shopId` int(11) NOT NULL,
  `marketPrice` decimal(11,2) NOT NULL DEFAULT '0.00',
  `shopPrice` decimal(11,2) NOT NULL DEFAULT '0.00',
  `goodsStock` int(11) NOT NULL DEFAULT '0',
  `saleCount` int(11) DEFAULT '0',
  `isBook` tinyint(4) NOT NULL DEFAULT '0',
  `bookQuantity` int(11) NOT NULL DEFAULT '0',
  `warnStock` int(11) NOT NULL DEFAULT '0',
  `goodsUnit` char(10) NOT NULL,
  `goodsSpec` text,
  `isSale` tinyint(4) NOT NULL DEFAULT '1',
  `isBest` tinyint(4) DEFAULT '1',
  `isHot` tinyint(4) DEFAULT '1',
  `isRecomm` tinyint(4) DEFAULT '1',
  `isNew` tinyint(4) DEFAULT '1',
  `isAdminBest` tinyint(4) DEFAULT '0',
  `isAdminRecom` tinyint(4) DEFAULT '0',
  `recommDesc` varchar(255) DEFAULT NULL,
  `goodsCatId1` int(11) NOT NULL,
  `goodsCatId2` int(11) NOT NULL,
  `goodsCatId3` int(11) NOT NULL,
  `shopCatId1` int(11) NOT NULL,
  `shopCatId2` int(11) NOT NULL,
  `goodsDesc` text NOT NULL,
  `isShopRecomm` tinyint(4) NOT NULL DEFAULT '0',
  `isIndexRecomm` tinyint(4) NOT NULL DEFAULT '0',
  `isActivityRecomm` tinyint(4) NOT NULL DEFAULT '0',
  `isInnerRecomm` tinyint(4) NOT NULL DEFAULT '0',
  `goodsStatus` tinyint(4) NOT NULL DEFAULT '0',
  `saleTime` datetime DEFAULT NULL,
  `attrCatId` int(11) DEFAULT '0',
  `goodsKeywords` varchar(200) DEFAULT NULL,
  `goodsFlag` tinyint(4) NOT NULL DEFAULT '1',
  `statusRemarks` varchar(255) DEFAULT NULL,
  `createTime` datetime NOT NULL,
  PRIMARY KEY (`goodsId`),
  KEY `shopId` (`shopId`) USING BTREE,
  KEY `goodsStatus` (`goodsStatus`,`goodsFlag`,`isSale`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8;