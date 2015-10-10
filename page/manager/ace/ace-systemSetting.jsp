<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%
	request.setAttribute("LeftMenuClearCach","\n,clearCach:true");
	request.getRequestDispatcher("/page/manager/ace/ace-CMSMgr.jsp").forward(request,response);
 %>