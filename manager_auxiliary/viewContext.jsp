<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@page import="com.breeze.framwork.databus.*"%>
<%@page import="com.breezefw.service.cms.*"%>
<%@page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@include file="./hHead.jsp"%>
<%

   String globalPath = request.getParameter("cpath");
   BreezeContext globalCtx = null;
   if (globalPath != null){
		globalCtx = ContextMgr.global.getContextByPath(globalPath);
	}

   String sName = request.getParameter("sName");
   String sValue = request.getParameter("sValue");

   Object sessionObj = null;
   if (sName != null && (sValue == null || "".equals(sValue)) ){
		sessionObj = session.getAttribute(sName);
	}
	if (sName!= null && sValue != null && !"".equals(sValue)){
		//这是设置session的节奏
		sessionObj = ContextTools.getBreezeContext4Json(sValue);
		session.setAttribute(sName,sessionObj);
	}


%>
<html>
<head>
	<link rel="shortcut icon" href="./img/icon/viewcontext.jpg" >
	<title>查阅设置上下文</title>
</head>
<body>
所有的系统配置信息
<%
	String type = "cfg";
	
	String path = CmsIniter.CMSPARAMPRIFIX;
	//获取所有的系统配置
	BreezeContext tmpObjCtx = ContextMgr.global.getContextByPath(path);
	
	if ("cfg".equals(type)){
		if (tmpObjCtx != null && !tmpObjCtx.isNull()){
			//把系统配置设置到request里面
			for (String key : tmpObjCtx.getMapSet()) {
				String val = tmpObjCtx.getContext(key).getData().toString();
				%><%=key%>:<%=val%><br/><%
			}
		}

	}
%>
<br/>
全局变量信息：
<%if (globalCtx == null){%>
	<form>
		请输入全局变量路径：<input type="text" name="cpath"/><br/>
		<input type="submit" value="提交"/>
	</form>
<%}else{%>
   <%=globalCtx%>
<%}%>

session信息：
<%if (sessionObj == null){%>
	<form method="post">
		请输入session名称：<input type="text" name="sName"/><br/>
		请输入要设置session值:<textarea name="sValue"></textarea>
		<input type="submit" value="提交"/>
	</form>
<%}else{%>
   <%=sessionObj%>
<%}%>
</body>
</html>