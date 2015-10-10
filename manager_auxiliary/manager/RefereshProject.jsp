<%@page import="com.breeze.support.cfg.Cfg"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@page import="com.breezefw.client.service.ProjectMgr"%>
<%
if (session.getAttribute("login") == null){
     response.sendRedirect("../index.jsp");
}

String remoteHost = "http://show.wgfly.cn/servercenter/";
String projectBase = Cfg.getCfg().getRootDir();
String loadingObj = "yjcPrj";
String paramName = "functionName";
String serviceName = "getSelfFunction";
ProjectMgr.getIn().getFileFromServer(remoteHost, projectBase, loadingObj, paramName, serviceName);
%>
项目升级成功