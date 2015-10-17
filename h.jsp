<%@page import="com.breeze.support.cfg.Cfg"%>
<%
	String baseUrl = this.getServletContext().getContextPath();
	String configUrlPrefix = Cfg.getCfg().getString("siteprefix");
	if (configUrlPrefix !=null && !configUrlPrefix.equals("--")){
		baseUrl = configUrlPrefix;
	}
	if ("/".equals(baseUrl)){
		baseUrl = "";
	}
	response.sendRedirect(baseUrl + "/manager_auxiliary/index.jsp");  
%>
