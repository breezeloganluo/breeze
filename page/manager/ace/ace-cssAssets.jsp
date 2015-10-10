<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@page import="com.breeze.framwork.databus.BreezeContext"%>
<%
   String cssCtxStr = (String)request.getAttribute("cssimport");
   BreezeContext cssList = new BreezeContext();
   if (cssCtxStr !=null && !("--".equals(cssCtxStr) || "".equals(cssCtxStr))){
	  cssList = ContextTools.getBreezeContext4Json(cssCtxStr);	  
   }   
%>
<!-- bootstrap & fontawesome -->
<link rel="stylesheet" href="${B}page/manager/assets/ace/css/bootstrap.css" />
<link rel="stylesheet" href="${B}page/manager/assets/ace/css/font-awesome.css" />

<!-- text fonts -->
<link rel="stylesheet" href="${B}page/manager/assets/ace/css/ace-fonts.css" />

<!-- ace styles -->
<link rel="stylesheet" href="${B}page/manager/assets/ace/css/ace.css" class="ace-main-stylesheet" id="main-ace-style" />
<link rel="stylesheet" href="${B}page/manager/assets/ace/plugins/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css"/>
<!--[if lte IE 9]>
	<link rel="stylesheet" href="${B}page/manager/assets/ace/css/ace-part2.css" />
<![endif]-->

<link rel="stylesheet" href="${B}page/manager/assets/ace/css/ace-rtl.css" />
<link rel="stylesheet" href="${B}page/manager/assets/ace/css/datepicker.css" />
<link rel="stylesheet" href="${B}page/manager/assets/ace/css/bootstrap-timepicker.css" />


<!--[if lte IE 9]>
  <link rel="stylesheet" href="${B}page/manager/assets/ace/css/ace-ie.css" />
<![endif]-->
<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!--[if lt IE 9]>
<script src="${B}page/manager/assets/ace/js/html5shiv.js"></script>
<script src="${B}page/manager/assets/ace/js/respond.js"></script>
<![endif]-->
<%
   for(int i=0;!cssList.isNull()&&i<cssList.getArraySize();i++){   
		%><link rel="stylesheet" href="${B}<%=cssList.getContext(i).getData()%>>" /><%
   }
%>