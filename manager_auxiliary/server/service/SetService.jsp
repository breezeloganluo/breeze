<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.databus.*"%>
<%@ page import="com.breeze.support.cfg.Cfg"%>
<%@ page import="com.breeze.framwork.servicerg.*"%>
<%@ page import="com.breeze.support.tools.*"%>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%
	BreezeContext root = ContextMgr.getRootContext();
    String pkg = root.getContextByPath("_R.package").getData().toString();
    String serviceName = root.getContextByPath("_R.servicename").getData().toString();
    String data = root.getContextByPath("_R.data").getData().toString();
    
    String baseDir = Cfg.getCfg().getRootDir()+"WEB-INF/classes/service/";
    
    if (!"".equals(pkg)){
    	pkg = pkg.replaceAll("\\.", "/")+"/";
    }
    
    String fileName = baseDir + pkg + serviceName + ".brz";

    root.setContext("code", new BreezeContext(0));
    root.setContext("data", new BreezeContext("good"));
    
    FileTools.writeFile(fileName,data,"utf-8");

	AllServiceTemplate.INSTANCE.reloadMap();
%>{"code":0,"data":"ok"}