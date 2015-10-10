<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
<%@ page import="com.breeze.support.cfg.Cfg"%>
<%@ page import="com.breeze.framwork.servicerg.*"%>
<%@ page import="com.breeze.support.tools.*"%>
<%@ page import="com.google.gson.*" %>

<%
	request.setCharacterEncoding("UTF-8");
	//读取参数
	String tips=null;
	String testDataFileName = request.getParameter("testData");
	if (testDataFileName == null){
		testDataFileName = "testdata.js";
	}
	String packageName = request.getParameter("package");
	if ("".equals(packageName.trim())){
		tips = "package 不能为空";
	}
	String name = request.getParameter("name");
	if ("".equals(name.trim())){
		tips = "name 不能为空";
	}
	String paramName = request.getParameter("paramName");
	if ("".equals(paramName.trim())){
		tips = "paramName 不能为空";
	}
	String param = request.getParameter("param");
	if ("".equals(param.trim())){
		tips = "param 不能为空";
	}
	String code = request.getParameter("code");
	if ("".equals(code.trim())){
		tips = "code 不能为空";
	}
	String data = request.getParameter("data");
	if ("".equals(data.trim())){
		tips = "data 不能为空";
	}
	String jsonResult = "";
	if (tips == null){
		//读取文件
		String fileName = Cfg.getCfg().getRootDir()+"manager_auxiliary/data/"+testDataFileName;
		System.out.println("the fileName is:" + fileName);
	    String content = FileTools.readFile(fileName,"utf-8");

	    //转换成map
	    Map<String,Object> jsonMap = GsonTools.parserJsonMapObj(content);
	    //设置map从最里头开始设置
	    Map<String,Object> oneData = new HashMap<String,Object>();
	    oneData.put("param", param);
	    oneData.put("code",code);
	    oneData.put("data",data);
	    
	    Map<String,Object>onePackage = (Map<String,Object>)jsonMap.get(packageName);
	    if (onePackage == null){
	    	onePackage = new HashMap<String,Object>();
	    	jsonMap.put(packageName, onePackage);
	    }
	    Map<String,Object>oneName = (Map<String,Object>)onePackage.get(name);
	    if (oneName == null){
	    	oneName = new HashMap<String,Object>();
	    	onePackage.put(name, oneName);
	    }    
	    oneName.put(paramName,oneData);
	    //反向转换成json
	    Gson gson = new Gson();
	    //jsonResult = "testData=" + gson.toJson(jsonMap);
	    jsonResult = gson.toJson(jsonMap);
	    //最后一步，保存这个文件
	    FileTools.writeFile(fileName, jsonResult, "UTF-8");
	    tips = "记录保存成功，新保存记录如下：";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<%=tips %><br/>
<%=jsonResult %>
</body>
</html>