<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.util.regex.*"%>
<%@page import="java.sql.*"%>
<%@page import="com.breeze.framwork.databus.*"%>
<%@page import="com.breeze.support.tools.*"%>
<%@page import="com.breeze.support.cfg.*"%>
<%@page import="com.breeze.framwork.netserver.*"%>
<%@page import="com.breeze.base.db.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@include file="./hHead.jsp"%>
<html>
<head>
	<link rel="shortcut icon" href="./img/icon/upgrapc.jpg" >
<title>升级包改变</title>
</head>
<body>
<%
    String dir = Cfg.getCfg().getRootDir()+"WEB-INF/classes/service";
	DirManager dMgr = new DirManager(dir);
	ArrayList<File> files = dMgr.getAllFile(null);
	//罗光瑜修改，是否要修改CMS视图，要另外做一个标识
	boolean hasChangeCMSView = false;
	for (File f:files){
		//读入所有的文件字符串
		String content = FileTools.readFile(f,"UTF-8");
		if (content.indexOf("com.weiguang.framework.template")<0){
			continue;
		}
%>
		解析转换文件：<%=f.getName()%><br/>
<%
		//修改字符串
		content = content.replaceAll("com\\.weiguang\\.framework\\.template","com.breezefw.framework.template");
		//将字符串反写回去
		FileTools.writeFile(f,content,"UTF-8");
	}
	
%>
</body>
</html>
