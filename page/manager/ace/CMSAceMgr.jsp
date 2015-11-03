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
	<jsp:include page="ace-cssAssets.jsp"/>
	<!-- /cssAssets -->
	<style type="text/css">
        #maskLayer{
        	display: none;  
        	position: absolute;  
        	top: 0%;  
        	left: 0%;  
        	width: 100%;  
        	height: 100%;  
        	background-color: black;  
        	z-index:1001;  
        	-moz-opacity: 0.7;  
        	opacity:.70;  
        	filter: alpha(opacity=70);
        }
	</style>
</head>
<body class="no-skin">
	<div id="maskLayer"></div>
	<div  id="navbar" class="navbar navbar-default">
		<jsp:include page="ace-header.jsp"/>
	</div>
	<div class="main-container" id="main-container">
		<script type="text/javascript">
			try{ace.settings.check('main-container' , 'fixed')}catch(e){}
		</script>
		<jsp:include page="ace-leftMenu.jsp"/>
		<div class="main-content">
			<div class="main-content-inner">
				<div class="page-content">
					<div id="CMSMgrControl" style="display:none"></div>
					<div id="appMainView"></div>
				</div>
			</div>
		</div>
		<jsp:include page="ace-footer.jsp"/>
	</div>
	<script>
		seajs.config({base:"${B}"});
		seajs.use(${allGadget},function(a) {
			a.go("${S}","CMSMgrSelector");
			window.FW = a;
		});
	</script>
</body>
</html>
