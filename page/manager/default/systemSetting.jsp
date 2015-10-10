<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%
	request.setAttribute("LeftMenuClearCach","\n,clearCach:true");
	request.getRequestDispatcher("/page/manager/default/CMSMgr.jsp").forward(request,response);
  %>
