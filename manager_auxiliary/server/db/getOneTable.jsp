<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="com.breeze.framwork.databus.BreezeContext" %>
<%@ page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@ page import="com.breeze.framwork.databus.*"%>
<%@ page import="java.util.*" %>
<%@ page import="java.io.*"%>
<%@ page import="com.breeze.support.cfg.*"%>
<%@ page import="com.breeze.framwork.servicerg.*"%>
<%@ page import="com.breeze.support.tools.*"%>
<%@ page import="com.google.gson.*" %>
<%@ page import="java.text.*" %>
<%@page import="java.sql.*"%>
<%@page import="com.breeze.base.db.*"%>

<%
	request.setCharacterEncoding("UTF-8");
	//+接受参数有两个baseDir,fileName,content(内容)，当只有baseDir时，返回baseDir对应的文件列表，当fileName存在时返回fileName内容，当content存在时，写入文件
	//读入baseDir,fileName,content三个参数
	BreezeContext root = ContextMgr.getRootContext();
	BreezeContext tableNameC = root.getContext("_R").getContext("name");
    BreezeContext resultCtx = new BreezeContext();
    if (tableNameC == null){
    	resultCtx.setContext("code",new BreezeContext(10));
        out.println(ContextTools.getJsonString(resultCtx, null));
        return;
    }
    
   String sql = "select * from " + tableNameC;
   ResultSet result = COMMDB.executeSql(sql);
   BreezeContext data = new BreezeContext();
   while (result.next()) {
   		BreezeContext oneRecord = new BreezeContext();
         for (int i = 0; i < result.getMetaData().getColumnCount(); i++) {
             // 得到结果集中的列名
             String culomnName = result.getMetaData().getColumnName(i + 1);
             // 得到每个列名的值，并把值放入BreezeContext
             oneRecord.setContext(culomnName, new BreezeContext(
             result.getString(culomnName)));
         }
         // 把得到的每条记录都放入resultSetContext
         data.pushContext(oneRecord);
   }
   result.close();

   resultCtx.setContext("code",new BreezeContext(0));
   resultCtx.setContext("data",data);
   out.println(ContextTools.getJsonString(resultCtx, null));
%>