<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<%@page import="com.breezefw.service.cms.CmsIniter"%>
<%@page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@page import="com.breeze.support.tools.*"%>
<%@page import="com.breeze.support.cfg.*"%>
<%@page import="java.util.regex.*"%>
<%@ page import="java.util.*"%>
<%
	BreezeContext password4tools = ContextMgr.global.getContextByPath(CmsIniter.CMSPARAMPRIFIX);
	String rightkey = "1qaz@WSX";
	
	if(password4tools != null && !password4tools.isNull() && password4tools.getContext("password4tools")!=null && !password4tools.getContext("password4tools").isNull()){
		if(!password4tools.getContext("password4tools").getData().toString().equals("--")){
			rightkey = password4tools.getContext("password4tools").getData().toString();	
		}
	}

	boolean needLogin = true;
	if (session.getAttribute("login") != null) {
		needLogin = false;
	} else {
		String password = request.getParameter("password");
		if (rightkey.equals(password)) {
			session.setAttribute("login", true);
			needLogin = false;
		}else{
			session.removeAttribute("login");
		}
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="shortcut icon" href="./img/icon/tools.png" >
<title>辅助工具列表</title>
<style type="text/css">
      <!-- 
        a {text-transform:none;text-decoration:none;} 
        a:hover {text-decoration:underline} 
       -->
</style> 
</head>
<body>
	<ul>
<%if (needLogin){ %>
	<form method="post">
		请输入密码<input name="password" type="password"><br /> <input
			type="submit" value="ok">
	</form>
<%}else{
    //如果有url则直接返回
    Object backurl = session.getAttribute("backurl");
    if (backurl != null){
    	response.sendRedirect(backurl.toString());
    	session.removeAttribute("backurl");
    	return;
    }
	//自动读入所有
	String dir = Cfg.getCfg().getRootDir()+"manager_auxiliary";
	File fDir = new File(dir);
	HashMap<String,String> allMap = new HashMap<String,String>();
	for (File f : fDir.listFiles()){
		if (f.isDirectory()){
			continue;
		}
		if (f.getName().indexOf(".jsp") <=0 || f.getName().indexOf("index.jsp")>=0){
			continue;
		}
		String content = FileTools.readFile(f,"utf-8");
		Pattern pt = Pattern.compile("<title>([\\s\\S]+?)</title>");
		Matcher mh = pt.matcher(content);
		String url = null;
		String name = null;
		if (mh.find()){
			name = mh.group(1);
			String[] fileNameArr = f.getName().split("[\\/]");
			url = fileNameArr[fileNameArr.length-1];
		}
		String img = null;
		
		pt = Pattern.compile("<link\\s+rel=\"shortcut\\sicon\"\\s+href=\"([^\"]+)\"");
		mh = pt.matcher(content);
		if (mh.find()){
			img = mh.group(1);
		}else{
			img = "./img/icon/noimg.png";
		}
		if (name != null && url != null){
%>          
        <li style="width: 150px;list-style-type:none;display: inline-block;">
        	<div style="text-align: center;">
        		<a href="<%=url%>" target="_blank"><img src="<%=img%>" width="100" height="100"/></a>
        	</div>
        	<div style="text-align: center;">
        		<a href="<%=url%>" target="_blank"><%=name%></a>
        	</div>        	
        </li>
         
<%
       }
	}	
}
%>
	</ul>
</body>
</html>