<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
	<html>

	<head>
		<meta charset="utf-8" />
		    <link rel="shortcut icon" href="./img/icon/testgadget.png" >
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
					'newone':"./gadgetTestCreator.jsp?fileUrl=[fileUrl]",
					"编辑": "./gadgetTestCreator.jsp?fileUrl=[fileUrl]"
				}
			}
		</script>
		<title>gadget单元测试</title>
	</head>
	<jsp:include page="./FileViewBase.jsp" />
	</html>