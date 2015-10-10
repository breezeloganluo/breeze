<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.breeze.base.db.*"%>
<%@page import="java.sql.*"%>
<%@include file="./hHead.jsp"%>
<%
request.setAttribute("B",this.getServletContext().getContextPath()+'/');
request.setAttribute("_","$");
%>
<%
	//新添加逻辑，接收参数，直接跳转到要编辑的模型中。并把设置参数带上去。
	//带入的参数包括：var url = "editModule.jsp?alias="+alias +"&extends="+extendsName+"&className="+className+"&classPath="+encodeURIComponent(classPath);
	//接收所有参数
	String alias = request.getParameter("alias");
	String extendsName = request.getParameter("extends");
	String className = request.getParameter("className");
	String classPath = request.getParameter("classPath");
	String url = this.getServletContext().getContextPath() + "/page/manager/CMSMgr.jsp?alias=channel&norole=true";
	//if (参数是否存在){设定编辑url
	if (alias!=null && extendsName != null && className != null && classPath != null){
		//数据库查询，通过alias查询到对应的cid
		String sql = "select * from cmsmetadata where alias = '"+alias+"'";

		ResultSet rs = COMMDB.executeSql(sql);
		String cid = null;
		while(rs.next()){
			cid = rs.getString("cid");
		}
		rs.close();

		if(cid != null){
			//合成新的参数到url中，保留原来所有的其他参数不变
			url = this.getServletContext().getContextPath() + "/page/manager/CMSMgr.jsp?type=single&alias=channel&norole=true";
			url = url + "&cid="+cid;
			url = url + "&extends="+extendsName+"&className="+className+"&classPath="+java.net.URLEncoder.encode(classPath,"utf-8");
			url += "&edittype=changeCMSGadget";
		}		
	}
	//}
	//重定向
	response.sendRedirect(url);
%>