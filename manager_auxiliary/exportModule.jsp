<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@page import="java.util.regex.*"%>
<%@page import="java.sql.*"%>
<%@page import="com.breeze.framwork.databus.*"%>
<%@page import="com.breezefw.framework.init.service.Log4jInit"%>
<%@page import="com.breeze.support.tools.*"%>
<%@page import="com.breeze.support.cfg.*"%>
<%@page import="com.breeze.base.db.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@include file="./hHead.jsp"%>
<%
    String isGo = request.getParameter("isGo");
    String expData = request.getParameter("expData");
	if (isGo == null){
%>
	<html>
		<head>
			<link rel="shortcut icon" href="./img/icon/exportmodule.jpg" >
			<title>导出CMS模型</title>
		</head>
	
	<body>		
		<form action="exportModule.jsp?isGo=true" method="post">
			<input type="hidden" name="isGo" value="true"/>
			<input type="checkbox" name="expData" value="true"/>是否包含数据<br/>
			<input type="submit" value="确定"/>
		</form>		
	</body>
	</html>
<%
	}else{
		//+说明要导出了
		//用sql语句查询所有的触发器
		String sql = "show triggers";
		ResultSet rs = COMMDB.executeSql(sql);
		BreezeContext trigerCtx = new BreezeContext();
		//while(sql next){
		while(rs.next()){
		//  将sql的查询结果装载到breezeContext变量中，以表明为key值
			String table = rs.getString("Table");
		//  先创立一个新的
			BreezeContext one = new BreezeContext();
		//  if (原来就有){
			if (trigerCtx.getContext(table) != null){
		//    取出原来的
				one = trigerCtx.getContext(table);
			}
		//  }else{
			else{
		//    将新的加入到变量中
				trigerCtx.setContext(table, one);
			}
		//  }
		
			//取出Trigger,event，time，和内容。用trigger:event:time  ->>内容方式写入one
			String trigger = rs.getString("Trigger");
			String event = rs.getString("Event");
			String time = rs.getString("Timing");
			String content = rs.getString("Statement");
			one.setContext(trigger + ":" + event+":"+time, new BreezeContext(content));
		}
		//}
		rs.close();
		
		//进行sql查询
		sql = "select a.*,b.displayname nodeName from cmsmetadata a,wg_channelclass b where a.nodeid=b.cid";
		rs = COMMDB.executeSql(sql);
		//while(rs.next){
		while(rs.next()){
		//  读入表字段数据到breezecontext中
			BreezeContext oneRecord = new BreezeContext();
			String alias = null;
			for (int i = 0; i < rs.getMetaData().getColumnCount(); i++) {
				// 得到结果集中的列名
				String culomnName = rs.getMetaData().getColumnName(
						i + 1);
				if ("cid".equals(culomnName)){					
					continue;
				}
				if ("nodeid".equals(culomnName)){					
					continue;
				}
				// 得到每个列名的值，并把值放入BreezeContext
				oneRecord.setContext(culomnName, new BreezeContext(
						rs.getString(culomnName)));
			}
		//  整合对应breezecontext字段，增加对应触发器的字段内容
		String table = oneRecord.getContext("tableName").toString();
		BreezeContext dataMemoCtx = oneRecord.getContext("dataMemo");
		if (trigerCtx.getContext(table) != null){
			//说明存在对应的表的触发器
			oneRecord.setContext("triger", trigerCtx.getContext(table));
		}
		//判断是否要导出数据
		if ("true".equals(expData)){
			//2014-07-31日罗光瑜修改，将cmsview.mod表中的数据按照cid，把设定的数据改成对应的alias
			sql = "update cmsmetadata c,wg_cmsview v set v.alias = c.alias where v.nodeid=c.cid";
			COMMDB.executeUpdate(sql);
			//下面开始导出文件，这里加了继承机制后要注意：如果有继承，那么不能直接导出了
			String dataMemo = null;
			if (dataMemoCtx != null){
				dataMemo = dataMemoCtx.toString();
			}

			if (dataMemo == null || dataMemo.indexOf("\"type\":\"super\"")<0){
				sql = "select * from "+table;
				ResultSet rsData = COMMDB.executeSql(sql);
				BreezeContext extDataCtx = new BreezeContext();
				oneRecord.setContext("data",extDataCtx);
				while(rsData.next()){
					BreezeContext oneExtDataCtx = new BreezeContext();
					extDataCtx.pushContext(oneExtDataCtx);
					for (int i = 0; i < rsData.getMetaData().getColumnCount(); i++) {
						// 得到结果集中的列名
						String culomnName = rsData.getMetaData().getColumnName(
								i + 1);
						oneExtDataCtx.setContext(culomnName,new BreezeContext(rsData.getString(culomnName)));
					}
				}
				rsData.close();
			}
			
		}
		//  将breezecontext信息转成字符串
		String str = ContextTools.getJsonString(oneRecord, null);
		//  根据alias，合成写入文件路径
		String dir = Cfg.getCfg().getRootDir()+"WEB-INF/classes/module/"+oneRecord.getContext("alias")+".mod";		
		//  写入文件
		FileTools.writeFile(dir,str, "utf-8");
		//}
		}
		//关闭链接
		rs.close();
		
		//+下面处理存储过程，记录到文件中，扩展名是.pro
		//查询所有存储过程
		sql = "show procedure status where db=DATABASE()";
		rs = COMMDB.executeSql(sql);
		//while(rs.next){
		while(rs.next()){
			//构造语句，重新查询这个存储过程的详情
			String pName = rs.getString("Name");
			sql = "show create procedure " + pName;
			ResultSet rrs = COMMDB.executeSql(sql);		
			if (!rrs.next()){
				continue;
			}
			String contenet = rrs.getString("Create Procedure").replaceAll("\\sDEFINER=`[^`]+`@`[^`]+`\\s", " ");
			//关闭连接
			rrs.close();
			//合并存入文件的文件名
			String dir = Cfg.getCfg().getRootDir()+"WEB-INF/classes/module/"+pName+".pro";	
			//写入文件
			FileTools.writeFile(dir,contenet, "utf-8");
		}
		//}
		//关闭连接
		rs.close();
%>
		<html>
		<body>
		操作成功！
		</body>
		</html>
<%
		//rs.close();
	}
%>