<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.breeze.framwork.databus.BreezeContext"%>
<%@ page import="java.util.*"%>
<%
	if(session.getAttribute("manager")==null)
	{
		String strBackUrl = request.getAttribute("B").toString();
		if ("/".equals(strBackUrl)){
			strBackUrl="";
		}
        strBackUrl+=request.getServletPath();
 		if(request.getParameterMap()!=null){
			strBackUrl+= "?";
			Enumeration enu=request.getParameterNames();  
			while(enu.hasMoreElements()){  
				String key=(String)enu.nextElement();  
				String value = request.getParameter(key).toString();
				strBackUrl += key + "=" + value + "&";
			}
			strBackUrl = strBackUrl.substring(0,strBackUrl.length()-1);
 		}
		session.setAttribute("saveUrl",strBackUrl);
%>
		<script>
		   alert('请登录!');
		   <%if(request.getAttribute("Template").toString().equals("ace")){%>
		   		location.href='${B}page/adminUserPage/ace-login.jsp'
		   <%}else{%>
		   		location.href='${B}page/adminUserPage/login.jsp'
		   <%}%>
		   
		</script>
<%
	}
%>