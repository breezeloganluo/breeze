<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
	<html>

	<head>
		<meta charset="utf-8" />
		<link rel="shortcut icon" href="./img/icon/editpage.png" >
		<style>
			a {
				text-decoration: none;
			}
		</style>
		<script>
			fileGlobleSetting = {
				icon:"./img/icon/editpage.png",
				initDir: "",
				clickSetting: {
					"link": "点击自身的事件",
					'newone':"./htmlCreator.jsp?fileUrl=[fileUrl]",
					"编辑": "./htmlCreator.jsp?fileUrl=[fileUrl]"
				}
			}
		</script>
		<title>页面编辑器</title>
	</head>
	<jsp:include page="./FileViewBase.jsp" />
	</html>