<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	session.removeAttribute("manager");
	String _page = request.getParameter("goto");
	_page += ".jsp";
    out.println("<script>alert('已注销!');location.href='"+this.getServletContext().getContextPath()+"/page/adminUserPage/"+_page+"';</script>");
%>