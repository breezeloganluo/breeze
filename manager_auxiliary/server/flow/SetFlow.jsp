<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.databus.*"%>
<%@ page import="com.breeze.support.cfg.Cfg"%>
<%@ page import="com.breeze.framwork.servicerg.*"%>
<%@ page import="com.breeze.support.tools.*"%>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@ page import="com.breeze.framwork.netserver.process.ServerProcessManager"%>
<%
	BreezeContext root = ContextMgr.getRootContext();
    String flowName = root.getContextByPath("_R.flowname").getData().toString();
    String data = root.getContextByPath("_R.data").getData().toString();
    
    String baseDir = Cfg.getCfg().getRootDir()+"WEB-INF/classes/flow/";
    
    
    String fileName = baseDir + flowName + ".flw";
    
    FileTools.writeFile(fileName,data,"utf-8");

	ServerProcessManager.INSTANCE.reloadMap();
	AllServiceTemplate.INSTANCE.reloadMap();
%>{"code":0,"data":"ok"}