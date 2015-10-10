CREATE TABLE `cmsmetadata` (
  `cid` int(11) NOT NULL auto_increment,
  `dataDesc` text,
  `alias` varchar(128) NOT NULL,
  `tableName` varchar(128) default NULL,
  `displayName` varchar(128) default NULL,
  `parentAlias` varchar(128) default NULL,
  `dataRefresh` varchar(128) default NULL,
  `dataOwner` varchar(64) default NULL,
  `opertime` bigint(20) default NULL,
  `nodeid` int(11) default NULL,
  `dataOwnerSet` varchar(128) default NULL,
  `dataMemo` text,
  `roleSetting` varchar(64) default NULL,
  `outAlias` varchar(64) default NULL,
  PRIMARY KEY  (`cid`),
  UNIQUE KEY `alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `wg_channelclass` (
  `alias` varchar(128) default NULL,
  `displayName` varchar(256) default NULL,
  `opertime` bigint(20) default NULL,
  `cid` int(11) NOT NULL auto_increment,
  `dataOwner` varchar(64) default NULL,
  `nodeid` int(11) default NULL,
  PRIMARY KEY  (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


INSERT INTO `cmsmetadata` VALUES ('29', '{\"tableName\":{\"title\":\"表名\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"128\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"1\",\"issearch\":\"1\",\"order\":\"50\"},\"displayName\":{\"title\":\"模型名称\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"128\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"1\",\"issearch\":\"0\",\"order\":\"50\"},\"parentAlias\":{\"title\":\"挂接模型\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"128\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"1\",\"issearch\":\"0\",\"order\":\"50\"},\"dataRefresh\":{\"title\":\"数据刷新\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"128\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"1\",\"issearch\":\"0\",\"order\":\"50\"},\"dataDesc\":{\"title\":\"数据描述\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"20480\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"0\",\"issearch\":\"0\",\"order\":\"50\"},\"dataOwnerSet\":{\"title\":\"数据权限设置\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"128\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"1\",\"issearch\":\"0\",\"order\":\"50\"},\"dataOwner\":{\"title\":\"数据所有者\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"128\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"1\",\"issearch\":\"0\",\"order\":\"50\"},\"alias\":{\"title\":\"模型别名\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"128\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"1\",\"issearch\":\"0\",\"order\":\"40\"},\"roleSetting\":{\"title\":\"权限设置\",\"type\":\"CheckBox\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"64\",\"dataExt\":\"\",\"valueRange\":[{\"内容添加\":\"0\",\"内容修改\":\"1\",\"内容删除\":\"2\",\"内容查询\":\"3\"},{\"节点添加\":\"4\",\"节点修改\":\"5\",\"节点删除\":\"6\",\"节点查询\":\"7\"}],\"desc\":\"* 这张表是否需要配置功能权限\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"0\",\"issearch\":\"0\",\"order\":\"60\"},\"outAlias\":{\"title\":\"外接模型\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"64\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"本数据模型用于挂接空连接,在添加时直接弹出本alias的蒙板层，且是批量的\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"0\",\"issearch\":\"0\",\"order\":\"60\"},\"dataMemo\":{\"title\":\"数据备注说明\",\"type\":\"TextArea\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldMemo\":\"\",\"fieldLen\":\"128\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"0\",\"issearch\":\"0\",\"order\":\"70\"}}', 'channel', 'cmsmetadata', '数据模型', 'channelClass', '', null, null, '1', '', '', '[1,2,3,4,5,6,7]', '');
INSERT INTO `cmsmetadata` VALUES ('30', '{\"displayName\":{\"title\":\"分类名称\",\"type\":\"Text\",\"fieldType\":\"varchar\",\"ourterLink\":\"\",\"fieldLen\":\"\",\"dataExt\":\"\",\"valueRange\":\"\",\"desc\":\"\",\"width\":\"\",\"fieldtmp\":\"\",\"islist\":\"1\",\"issearch\":\"0\",\"order\":\"50\"}}', 'channelClass', 'wg_channelclass', '模型分类', '', '', null, null, '1', '', null, '[1,2,3,4,5,6,7]', '');