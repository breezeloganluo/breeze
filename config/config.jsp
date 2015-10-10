<%@ page language="java" contentType="application/x-javascript; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.breeze.support.cfg.Cfg"%>
<%
   
   String B = this.getServletContext().getContextPath();

	String configUrlPrefix = Cfg.getCfg().getString("siteprefix");
	if (configUrlPrefix !=null && !configUrlPrefix.equals("--")){
		B = configUrlPrefix;
	}

   if ("/".equals(B)){
	   B = "";
	}
   String cmsBaseUrl = (String)session.getAttribute("CMSMgr");   
%>
var Cfg = {
	baseUrl: '<%=B%>',
	ajaxFileUpLoadUrl: '<%=B%>/upload.up',
	swfuploadUrl: '<%=B%>/upload.mup',
	lang:'zh',
	CMSMgr:'<%=B%>/<%=cmsBaseUrl%>'
};