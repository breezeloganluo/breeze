<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.regex.*"%>
<%@page import="java.sql.*"%>
<%@page import="com.breeze.framwork.databus.*"%>
<%@page import="com.breezefw.framework.init.service.Log4jInit"%>
<%@page import="com.breeze.support.tools.*"%>
<%@page import="com.breeze.support.cfg.*"%>
<%@page import="com.breeze.framwork.netserver.*"%>
<%@page import="com.breeze.base.db.*"%>
<%@ page import="java.util.*"%>
<%@ page import="java.io.*"%>
<%
   String sql = "show tables";
   ResultSet rs = COMMDB.executeSql(sql);
   BreezeContext data = new BreezeContext();
   while(rs.next()){
       String name = rs.getString(1);
       BreezeContext one = new BreezeContext();
       one.setContext("name",new BreezeContext(name));
       data.pushContext(one);
   }
   rs.close();
   BreezeContext result = new BreezeContext();
   result.setContext("code",new BreezeContext(0));
   result.setContext("data",data);
    out.println(ContextTools.getJsonString(result, null));
%>