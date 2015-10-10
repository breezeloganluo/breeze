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

<%
	request.setCharacterEncoding("UTF-8");
%>
<%@include file="./hHead.jsp"%>
<html>
<head>
<title>业务测试_导出数据</title>
</head>
<body>
<%
	String[] tables = request.getParameterValues("tables");
	String fileName = request.getParameter("fileName");
	String inouttype = request.getParameter("inouttype");
	BreezeContext allData = new BreezeContext();
	String oldSName = "";
	String oldSValue = "";
	Set<String> oldSelected = new HashSet<String>();
	String file = "";
	if (fileName != null){
		//读入处理文件
		fileName = fileName.replaceAll("\\.st","");
		file = Cfg.getCfg().getRootDir()+"manager_auxiliary/data/servicetest/"+fileName+".st";
		String fileStr = FileTools.readFile(file, "UTF-8");
		if (fileStr!=null){
			allData = ContextTools.getBreezeContext4Json(fileStr);
			//先找到原来的session值
			BreezeContext sctx = allData.getContext("session");
			if (sctx != null){
				for (String s:sctx.getMapSet()){
					oldSName = s;
					oldSValue = ContextTools.getJsonString(sctx.getContext(s),null);
				}
			}
			//再找选择的表
			BreezeContext oldSelectedCtx = allData.getContext(inouttype);
			oldSelected = oldSelectedCtx.getMapSet();
			
			//放入request.attribute中
			request.setAttribute("data",allData.createMap());
		}
	}

	if (tables == null || fileName == null || "获取数据".equals(request.getParameter("submit"))){
		if (fileName == null){
			fileName = "";
		}
%>
        <form method="post">
		测试文件名:<input type="text" name="fileName" value="<%=fileName%>"><input name="submit" type="submit" value="获取数据"/><br/>
		测试目的:<textarea name="purpose">${data.purpose}</textarea><br/>
		<input type="radio" name="inouttype" value="input" checked="true"/>导入输入&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="inouttype" value="output"/>导入输出<br/>
		session名字<input type="text" name="sName" value="<%=oldSName%>"/><br/>
		session值<textarea name="sValue"><%=oldSValue%></textarea><br/>
		service名称:<input type="text" name="serviceName" value="${data.service.serviceName}"><br/>
		调用参数:<textarea name="serviceParam">${data.service.serviceParam}</textarea><br/>
<%
		String sql = "select * from cmsmetadata order by alias";
		ResultSet rs = COMMDB.executeSql(sql);
		while(rs.next()){
%>
            <input type="checkbox" name="tables" value="<%=rs.getString("tableName")%>" <%if(oldSelected.contains(rs.getString("tableName"))){%>checked="true"<%}%>/><%=rs.getString("alias")%><br/>
<%
		}
		rs.close();
%>
		
		<input type="submit" value="执行导出"/>
		</form>
		</body>
</html>
<%
		return;
	}
%>
<%
	//先看看session是否要导入
	String sName = request.getParameter("sName");
	String sValue = request.getParameter("sValue");
	if (sName != null && sValue !=null && !"".equals(sName) && !"".equals(sValue)){
		BreezeContext sVCtx = ContextTools.getBreezeContext4Json(sValue);
		BreezeContext sessionCtx = new BreezeContext();
		allData.setContext("session",sessionCtx);
		sessionCtx.setContext(sName,sVCtx);
	}
%>
<%
	//测试目的
	String purpose = request.getParameter("purpose");
	if (purpose!=null){
		allData.setContext("purpose",new BreezeContext(purpose));
	}
%>
<%
	//测试service信息
	String serviceName = request.getParameter("serviceName");
	String serviceParam = request.getParameter("serviceParam");
	if (serviceName != null && serviceParam != null){
		BreezeContext serviceCtx = new BreezeContext();
		serviceCtx.setContext("serviceName",new BreezeContext(serviceName));
		serviceCtx.setContext("serviceParam",new BreezeContext(serviceParam));
		allData.setContext("service",serviceCtx);
	}
%>
<%
	//数据导入
	BreezeContext inputCtx = new BreezeContext();
	allData.setContext(inouttype,inputCtx);
	for (int i=0;i<tables.length;i++){
		String sql = "select * from "+tables[i];
		ResultSet rsData = COMMDB.executeSql(sql);
		
		BreezeContext extDataCtx = new BreezeContext();
		inputCtx.setContext(tables[i],extDataCtx);
		boolean hasData = false;
		while(rsData.next()){
			hasData = true;
			BreezeContext oneExtDataCtx = new BreezeContext();
			extDataCtx.pushContext(oneExtDataCtx);
			for (int j = 0; j < rsData.getMetaData().getColumnCount(); j++) {
				// 得到结果集中的列名
				String culomnName = rsData.getMetaData().getColumnName(
						j + 1);
				oneExtDataCtx.setContext(culomnName,new BreezeContext(rsData.getString(culomnName)));
			}
		}
		//空数据也要导出
		if (!hasData){
			inputCtx.setContext(tables[i],new BreezeContext("null"));
		}
		rsData.close();
	}
%>
<%
	//写入文件
	String fileContent = ContextTools.getJsonString(allData, null);
	//  写入文件
	FileTools.writeFile(file,fileContent, "utf-8");
%>
设置成功
</body>
</html>