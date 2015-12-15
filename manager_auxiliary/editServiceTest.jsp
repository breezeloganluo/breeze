<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
	<html>

	<head>
		<meta charset="utf-8" />
		<link rel="shortcut icon" href="./img/icon/servicetest.png" >
		<style>
			a {
				text-decoration: none;
			}
		</style>
		<script>
			fileGlobleSetting = {
				initDir: "",
				clickSetting: {
                	exp:".js",
					"link": "点击自身的事件",
					'newone':"./serviceTestCreator.jsp?fileUrl=[fileUrl]",
					"编辑": "./serviceTestCreator.jsp?fileUrl=[fileUrl]"
				}
			}
		</script>
		<title>service测试编辑器</title>
	</head>
	<jsp:include page="./FileViewBase.jsp" />
	</html>