/*
MySQL Data Transfer
Source Host: localhost
Source Database: logictest
Target Host: localhost
Target Database: logictest
Date: 2013-11-15 8:08:00
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for aliasdata_test_testgetonecontextaliasdata
-- ----------------------------
CREATE TABLE `aliasdata_test_testgetonecontextaliasdata` (
  `a` int(11) NOT NULL default '0',
  `b` varchar(255) default NULL,
  PRIMARY KEY  (`a`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for cmsmetadata_test_testreload
-- ----------------------------
CREATE TABLE `cmsmetadata_test_testreload` (
  `cid` int(11) NOT NULL auto_increment,
  `dataDesc` varchar(20480) default NULL,
  `alias` varchar(128) NOT NULL,
  `tableName` varchar(128) default NULL,
  `displayName` varchar(128) default NULL,
  `parentAlias` varchar(128) default NULL,
  `dataRefresh` varchar(128) default NULL,
  `dataOwner` varchar(64) default NULL,
  `opertime` bigint(20) default NULL,
  `nodeid` int(11) default NULL,
  `dataOwnerSet` varchar(128) default NULL,
  PRIMARY KEY  (`cid`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for news_result_testsetview
-- ----------------------------
CREATE TABLE `news_result_testsetview` (
  `alias` varchar(255) default NULL,
  `name` varchar(255) default NULL,
  `outerName` varchar(255) default NULL,
  `opertime` int(11) default NULL,
  `cid` int(11) NOT NULL default '0',
  `dataOwner` varchar(255) default NULL,
  `nodeid` int(11) default NULL,
  PRIMARY KEY  (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for news_test_testsetview
-- ----------------------------
CREATE TABLE `news_test_testsetview` (
  `cid` int(11) NOT NULL,
  `name` varchar(128) default NULL,
  `alias` varchar(128) default NULL,
  `opertime` bigint(20) default NULL,
  `dataOwner` varchar(128) default NULL,
  `nodeid` int(11) default NULL,
  PRIMARY KEY  (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for news3_test_testsetview
-- ----------------------------
CREATE TABLE `news3_test_testsetview` (
  `cid` int(11) NOT NULL default '0',
  `name` varchar(128) default NULL,
  `alias` varchar(128) default NULL,
  `opertime` bigint(20) default NULL,
  `dataOwner` varchar(128) default NULL,
  `nodeid` int(11) default NULL,
  PRIMARY KEY  (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
-- Records 
-- ----------------------------
INSERT INTO `aliasdata_test_testgetonecontextaliasdata` VALUES ('1', 'aaa');
INSERT INTO `aliasdata_test_testgetonecontextaliasdata` VALUES ('2', 'bbb');
INSERT INTO `cmsmetadata_test_testreload` VALUES ('1', '{}', 'alias1', 'tableName', 'displayName', '', '', '', null, '3', null);
INSERT INTO `cmsmetadata_test_testreload` VALUES ('2', '{}', 'alias2', 'tableName', 'displayName', 'alias1', null, null, null, null, null);
INSERT INTO `news_result_testsetview` VALUES ('alias2', 'ttttt', null, null, '23', null, null);
INSERT INTO `news_result_testsetview` VALUES ('alias1', 'wwww', 'eeee', null, '33', '0:dataOwner', '11');
INSERT INTO `news_test_testsetview` VALUES ('23', 'ttttt', 'alias2', null, null, null);
INSERT INTO `news_test_testsetview` VALUES ('33', 'wwww', 'alias1', null, '0:dataOwner', '11');
INSERT INTO `news3_test_testsetview` VALUES ('11', 'eeee', 'alias3', null, '0:dataOwner', '11');
INSERT INTO `news3_test_testsetview` VALUES ('3311', 'wwww', 'alias3', null, '0:dataOwner', '111');
