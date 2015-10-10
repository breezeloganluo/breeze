<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.databus.*"%>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%
String baseDir = "../../../manager_auxiliary/server/";
String bDir = request.getParameter("bDir");
String sFile = request.getParameter("sFile");
String sParam = request.getParameter("sParam");
if (bDir!= null && !"".equals(baseDir)){
	baseDir = bDir;
}

String paramData = request.getParameter("data");
if (paramData == null){
	return;
}
BreezeContext paramContext = ContextTools.getBreezeContext4Json(paramData);
if (paramContext == null){
	return;
}

if (paramContext.getType()!= BreezeContext.TYPE_ARRAY){
	return;
}

BreezeContext result = new BreezeContext();
boolean isFirst = true;
//下面开始循环，处理每一个服务。
response.getWriter().write("[");
for (int i=0;i<paramContext.getArraySize();i++){
	if (isFirst){
		isFirst = false;
	}else{
		response.getWriter().write(",");
	}
	BreezeContext sObj = paramContext.getContext(i);
	String packageName = sObj.getContext("package").getData().toString();
	String serviceName = sObj.getContext("name").getData().toString();
	String jspFile = serviceName + ".jsp"; 
	if (sFile != null && !"".equals(sFile)){
		jspFile = sFile;
	}
	else if ("".equals(packageName)){
		jspFile = baseDir + jspFile;
	}else{
		jspFile = baseDir + packageName.replaceAll("\\.","/")+"/"+jspFile;
	}
	
    //初始化上下文
    ContextMgr.initRootContext();
    BreezeContext root = ContextMgr.getRootContext();
    root.setContext("service",new BreezeContext(serviceName));
    root.setContext("package",new BreezeContext(packageName));
    root.setContext("_R", sObj.getContext("param"));    
    if (sParam != null && !"".equals(sParam)){
    	root.setContextByPath("_R.sParam", new BreezeContext(sParam));
    }
    
    //执行每个服务
    System.out.println("jspFile-:" + jspFile);
    request.getRequestDispatcher(jspFile).include(request, response);
}
%>]