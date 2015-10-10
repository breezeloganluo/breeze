<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="com.breeze.framwork.databus.*"%>
<%@page import="com.breeze.framwork.netserver.tool.ContextMgr"%>
<%@page import="com.breeze.framwork.databus.ContextTools"%>
<%@page import="com.breezefw.service.cms.*"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Iterator"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.regex.*"%>
<jsp:include page="../../allhead.jsp"/>
<jsp:include page="../cmsallhead.jsp"/>
<jsp:include page="../bgPower.jsp"/>
<!doctype html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!--> <html lang="en" xmlns="http://www.w3.org/1999/xhtml"> <!--<![endif]-->
<head>
	<meta charset="UTF-8" />
	<title></title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<meta content="" name="description" />
	<meta content="" name="author" />
	<!--[if IE]>
    	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <![endif]-->
	<!-- cssAssets -->
	<jsp:include page="cssAssets.jsp"/>
	<!-- /cssAssets -->
	<%
		if(session.getAttribute("manager")!=null&&request.getAttribute("Template").toString().equals("ace")){
			%>
				<script>
					location.href = "${B}page/manager/ace/CMSAceMgr.jsp" + window.location.search;
				</script>
			<%
		}
	%>
</head>
<body class="padTop53">
	<div id="wrap">
		<div id="top">
			<jsp:include page="header.jsp"/>
		</div>
		<div id="left">
			<jsp:include page="leftMenu.jsp"/>
		</div>
		<div id="content">
			<div class="inner" style="min-height:700px">
				<div id="CMSMgrControl" style="display:none"></div>
				<div  id="appMainView">
				</div>
			</div>
		</div>
	</div>
	<!-- footer -->
	<jsp:include page="footer.jsp"/>
	<!-- /footer -->
	<!-- wgfly breeze -->
	<script>
		seajs.config({base:"${B}"});
		seajs.use(${allGadget},function(a) {
			a.go("${S}","CMSMgrSelector");
			window.FW = a;
		});
	</script>
</body>
</html>
