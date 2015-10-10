<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.databus.*"%>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@ page import="com.breeze.support.cfg.Cfg"%>
<%@ page import="com.breeze.framwork.servicerg.*"%>
<%@ page import="com.breeze.support.tools.*"%>

<%
	BreezeContext root = ContextMgr.getRootContext();
    String flowName = root.getContextByPath("_R.flowName").getData().toString();
    
    String baseDir = Cfg.getCfg().getRootDir()+"WEB-INF/classes/flow/";
    
    
    String fileName = baseDir + flowName + ".flw";


    String content = FileTools.readFile(fileName,"utf-8");
    
    BreezeContext resultContext = new BreezeContext();
    resultContext.setContext("code", new BreezeContext(0));
    resultContext.setContext("data", new BreezeContext(content));
    out.println(ContextTools.getJsonString(resultContext, null));
%>