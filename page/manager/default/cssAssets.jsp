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
<!-- GLOBAL STYLES -->
<!-- PAGE LEVEL STYLES -->
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/bootstrap/css/bootstrap.min.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/magic/magic.min.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/css/main.min.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/css/theme.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/css/MoneAdmin.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/Font-Awesome/css/font-awesome.min.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/dataTables/dataTables.bootstrap.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/social-buttons/social-buttons.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/css/zTreeStyle/zTreeStyle.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/daterangepicker/daterangepicker-bs3.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/uniform/themes/default/css/uniform.default.min.css"/>
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css"/>
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/datepicker/css/datepicker.css" />
<link rel="stylesheet" href="${B}page/manager/assets/default/plugins/timepicker/css/bootstrap-timepicker.min.css" />
<link href="${B}page/manager/assets/default/plugins/jquery-steps-master/demo/css/normalize.css" rel="stylesheet" />
<link href="${B}page/manager/assets/default/plugins/jquery-steps-master/demo/css/wizardMain.css" rel="stylesheet" />
<link href="${B}page/manager/assets/default/plugins/jquery-steps-master/demo/css/jquery.steps.css" rel="stylesheet" />
<!-- END PAGE LEVEL STYLES -->
<link rel="stylesheet" type="text/css" href="${B}page/manager/assets/default/plugins/foxibox/style/jquery-foxibox-0.2.css" />
<link rel="stylesheet" type="text/css" href="${B}page/manager/assets/default/plugins/gritter/css/jquery.gritter.css" />

<%
   for(int i=0;!cssList.isNull()&&i<cssList.getArraySize();i++){   
		%><link rel="stylesheet" href="${B}<%=cssList.getContext(i).getData()%>>" /><%
   }
%>