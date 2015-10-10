<%@page import="java.util.regex.*"%>
<%@page import="com.breezefw.framework.init.service.Log4jInit"%>
<%@page import="com.breeze.support.tools.*"%>
<%@page import="com.breeze.support.cfg.*"%>
<%@page import="com.breeze.base.db.*"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@include file="./hHead.jsp"%>
<%

	request.setAttribute("_", "$");
	String dbHost = request.getParameter("dbHost");
	String dbName = request.getParameter("dbName");
	String dbAccount = request.getParameter("dbAccount");
	String dbPassword = request.getParameter("dbPassword");
	if (dbName == null) {
%>
<!doctype html>
<html lang="en">
<head>
	<link rel="shortcut icon" href="./img/icon/createdb.jpg" >
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>创建数据库</title>
</head>
<body>
	<form method="get">
		数据库地址:<input name="dbHost" type="text" value="localhost"/><br/>
		数据库名:<input name="dbName" type="text" value="wgdev"/><br/>
		数据库帐号:<input name="dbAccount" type="text" value="root" /><br/> 
		数据库密码:<input name="dbPassword" type="text" value="123456" /><br/>
        
		<input type="submit"value="ok">
	</form>
</body>
</html>
<%
	return;	
	}
	String dbCfg = FileTools.readFile(Cfg.getCfg().getRootDir()+"WEB-INF/config.cfg", "utf-8");
	dbCfg = dbCfg.replaceAll("\\[dbHost\\]", dbHost);
	dbCfg = dbCfg.replaceAll("\\[dbName\\]", dbName);
	dbCfg = dbCfg.replaceAll("\\[dbAccount\\]", dbAccount);
	dbCfg = dbCfg.replaceAll("\\[dbPassword\\]", dbPassword);
	FileTools.writeFile(Cfg.getCfg().getRootDir()+"WEB-INF/config.cfg",dbCfg, "utf-8");
	
	try{
		String dburl = "jdbc:mysql://"+dbHost+":3306/"+dbName+"?relaxAutoCommit=true&zeroDateTimeBehavior=convertToNull&characterEncoding=utf8";
		DBCPOper oper = new DBCPOper();
		oper.initDB("com.mysql.jdbc.Driver",dburl,dbAccount,dbPassword);
		COMMDB.initDB(oper);
		COMMDB.executeSql("select 1");
    }catch(Exception e){
		System.out.println("create database....");
		String dburl = "jdbc:mysql://localhost:3306/?relaxAutoCommit=true&zeroDateTimeBehavior=convertToNull&characterEncoding=utf8";
		DBCPOper oper = new DBCPOper();
		oper.initDB("com.mysql.jdbc.Driver",dburl,dbAccount,dbPassword);
		COMMDB.initDB(oper);
		COMMDB.executeUpdate("create database "+dbName);
		System.out.println("finish database....");
		
		dburl = "jdbc:mysql://localhost:3306/"+dbName+"?relaxAutoCommit=true&zeroDateTimeBehavior=convertToNull&characterEncoding=utf8";
		oper = new DBCPOper();
		oper.initDB("com.mysql.jdbc.Driver",dburl,dbAccount,dbPassword);
		COMMDB.initDB(oper);
	}
	//下面重新连接数据库	
	ArrayList<String>insertSentence = new ArrayList<String>();
	ArrayList<String>createTable = new ArrayList<String>();
	String inText=FileTools.readFile(Cfg.getCfg().getRootDir()+"manager_auxiliary/sql.sql", "utf-8");
    //下面执行sql语句
    String[] ss = inText.split(";");
    boolean multLineFlag = false;
    StringBuilder sqlSb = null;
	for (String s : ss) {
		if ("".equals(s.trim())) {
			continue;
		}		
		// 创建对应的正则，用createtable加后缀进行判断
		Pattern p = Pattern.compile("CREATE\\s+TABLE\\s+`([^`]+)`",Pattern.CASE_INSENSITIVE);
		Matcher m = p.matcher(s);
		// if(存在){
		if (m.find() && !multLineFlag) {
			// 取对应的表明部分
			String tableName = m.group(1);
			//直接先删除
			COMMDB.executeUpdate("DROP TABLE IF EXISTS `"+tableName+"`;");
			createTable.add(s);
			continue;
		}
		// }
		p = Pattern.compile("DROP\\s+TABLE.+",Pattern.CASE_INSENSITIVE);
		m = p.matcher(s);
		if (m.find() && !multLineFlag) {
			//这种就直接跳过
			continue;
		}
		//+下面判断是否存储过程，触发器之类的,DELIMITER是一个开关，打开是进入多行状态，并new一个新的sqlSb，关闭时回归原来状态，并把山一个sqlSB输出记录到sql语句中
		if (s.indexOf("DELIMITER")>0){			
			multLineFlag = !multLineFlag;
			if (multLineFlag){
				sqlSb = new StringBuilder();
			}else{
				insertSentence.add(sqlSb.toString());
			}
			continue;
		}
		//+如果是不是存储过程等多行操作则正常加入语句，否则多行合并到sqlSb中
		if (multLineFlag){
			sqlSb.append(s).append(";\n");
		}else{
			//其余的就是普通的insert语句来
			insertSentence.add(s);	
		}
		
	}
	//下面开始真正的执行SQL语句
	for (String s:createTable){
		System.out.println(s);
		COMMDB.executeUpdate(s);
	}
	for (String s:insertSentence){
		System.out.println(s);
		COMMDB.executeUpdate(s);
	}
%>
<!doctype html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>创建sql语句</title>

</head>
<body>
	创建数据库成功，请重启服务。。。
</body>
</html>