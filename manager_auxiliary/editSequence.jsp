<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@include file="./hHead.jsp"%>
	<html>

	<head>
		<meta charset="utf-8" />
		    <link rel="shortcut icon" href="./img/icon/sequence.jpg" >
		<style>
			a {
				text-decoration: none;
			}
		</style>
		<script>
			fileGlobleSetting = {
				exp:".js",
				initDir: "design/hld/sequence/",
				clickSetting: {
					"link": "点击自身的事件",
					'newone':"./sequenceCreator.jsp?fileUrl=[fileUrl]",
					"编辑": "./sequenceCreator.jsp?fileUrl=[fileUrl]"
				}
			}
		</script>
		<title>顺序图编辑</title>
	</head>
	<jsp:include page="./FileViewBase.jsp" />
	</html>