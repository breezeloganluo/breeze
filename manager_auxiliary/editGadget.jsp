<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
	<html>

	<head>
		<meta charset="utf-8" />
		    <link rel="shortcut icon" href="./img/icon/editgadget.jpg" >
		<style>
			a {
				text-decoration: none;
			}
		</style>
		<script>
			fileGlobleSetting = {
				exp:".js",
				initDir: "",
				clickSetting: {
					"link": "点击自身的事件",
					'newone':"./gadgetCreator.jsp?fileUrl=[fileUrl]",
					"编辑": "./gadgetCreator.jsp?fileUrl=[fileUrl]"
				}
			}
		</script>
		<title>gadget编辑器</title>
	</head>
	<jsp:include page="./FileViewBase.jsp" />
	</html>