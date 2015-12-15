<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
	<html>

	<head>
		<meta charset="utf-8" />
		<link rel="shortcut icon" href="./img/icon/srsview.png" >
		<style>
			a {
				text-decoration: none;
			}
		</style>
		<script>
			fileGlobleSetting = {
				icon:"./img/icon/srsview.png",
				initDir: "design/srs/",
				clickSetting: {
					"link": "点击自身的事件",
					'newone':"./SRSCreator.jsp?fileUrl=[fileUrl]",
					"编辑": "./SRSCreator.jsp?fileUrl=[fileUrl]"
				}
			}
		</script>
		<title>需求管理</title>
	</head>
	<jsp:include page="./FileViewBase.jsp" />
	</html>